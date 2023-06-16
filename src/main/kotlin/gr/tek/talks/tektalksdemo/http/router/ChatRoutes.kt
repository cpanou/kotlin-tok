package gr.tek.talks.tektalksdemo.http.router

import com.fasterxml.jackson.databind.ObjectMapper
import gr.tek.talks.tektalksdemo.http.entities.AuthorizedRequest
import gr.tek.talks.tektalksdemo.http.entities.EmptyRequest
import gr.tek.talks.tektalksdemo.http.entities.GuestRequest
import gr.tek.talks.tektalksdemo.http.entities.dto.UserInfoDTO
import gr.tek.talks.tektalksdemo.http.entities.request.*
import gr.tek.talks.tektalksdemo.http.error.ErrorResponse
import gr.tek.talks.tektalksdemo.http.filter.UserInfoFilter
import gr.tek.talks.tektalksdemo.service.ChatAPIHandler
import kotlinx.coroutines.reactor.mono
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.io.ClassPathResource
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.web.reactive.HandlerMapping
import org.springframework.web.reactive.function.BodyInserters
import org.springframework.web.reactive.function.server.ServerRequest
import org.springframework.web.reactive.function.server.ServerResponse
import org.springframework.web.reactive.function.server.router
import org.springframework.web.reactive.handler.SimpleUrlHandlerMapping
import org.springframework.web.reactive.socket.WebSocketHandler
import reactor.core.publisher.Mono
import reactor.kotlin.core.publisher.switchIfEmpty


@Configuration
class ChatRouter(
    val chatService: ChatAPIHandler,
    val objectMapper: ObjectMapper,
    val chatWebSocketHandler: WebSocketHandler,
) {

    @Bean
    fun webSocketHandlerMapping(): HandlerMapping? {
        val map: MutableMap<String, WebSocketHandler?> = HashMap()
        map["/message-emitter"] = chatWebSocketHandler
        return SimpleUrlHandlerMapping()
            .apply {
                order = 1
                urlMap = map
            }
    }

    @Bean
    fun staticResources() = router {
        resources("/", ClassPathResource("/static/index.html"))
    }

    @Bean
    fun userRoutes() = router {
        "/api/account".nest {
            GET("/{username}") {
                it.handlePublic(UserInfoFetchRequest::class.java, chatService::getUserInfo)
            }
            POST {
                it.handlePublic(UserCreateRequest::class.java, chatService::createUser)
            }
        }
    }

    @Bean
    fun chatRoutes() = router {
        "/api/conversations".nest {
            POST("/users") {
                it.handleAuthorized(GroupJoinRequest::class.java, chatService::joinUserGroup)
            }
            GET {
                it.handleAuthorized(UserConversationsFetchRequest::class.java, chatService::fetchUserConversations)
            }
            POST {
                it.handleAuthorized(GroupCreateRequest::class.java, chatService::createChatGroup)
            }
        }
    }.filter(UserInfoFilter())


    fun <T : GuestRequest, R : Any> ServerRequest.handlePublic(
        rClass: Class<T>, handlerFunction: (T) -> R
    ): Mono<ServerResponse> {
        return bodyToMono(rClass)
            .switchIfEmpty {
                mono {
                    objectMapper.readValue("{}", rClass)
                }
            }
            .flatMap {
                if (it is EmptyRequest)
                    it.initSelf(request = this)
                serverResponse(handlerFunction, it)
            }
    }

    fun <T : AuthorizedRequest, R : Any> ServerRequest.handleAuthorized(
        rClass: Class<T>, handlerFunction: (T) -> R
    ): Mono<ServerResponse> {
        return bodyToMono(rClass)
            .switchIfEmpty {
                mono {
                    objectMapper.readValue("{}", rClass)
                }
            }
            .flatMap {
                if (it is EmptyRequest)
                    it.initSelf(request = this)
                val auth = headers().firstHeader(HttpHeaders.AUTHORIZATION);
                val user = objectMapper.readValue(auth, UserInfoDTO::class.java)
                serverResponse(handlerFunction, it.apply {
                    userInfo = user
                })
            }
    }

    private inline fun <T : Any, R : Any> serverResponse(crossinline handlerFunction: (T) -> R, it: T)
            : Mono<ServerResponse> {
        return mono {
            handlerFunction(it)
        }.flatMap {
            ServerResponse.ok().body(BodyInserters.fromValue(it))
        }.switchIfEmpty {
            ServerResponse.notFound().build()
        }.onErrorResume { e ->
            val error = ErrorResponse(
                error = e::class.java.simpleName,
                errorDescription = e.localizedMessage
            )
            ServerResponse.status(HttpStatus.BAD_REQUEST).body(
                BodyInserters.fromValue(error)
            )
        }
    }
}