package gr.tek.talks.tektalksdemo.http.router

import com.fasterxml.jackson.databind.ObjectMapper
import gr.tek.talks.tektalksdemo.http.entities.AuthorizedRequest
import gr.tek.talks.tektalksdemo.http.entities.GuestRequest
import gr.tek.talks.tektalksdemo.http.entities.dto.UserInfoDTO
import gr.tek.talks.tektalksdemo.http.entities.request.*
import gr.tek.talks.tektalksdemo.http.error.ErrorResponse
import gr.tek.talks.tektalksdemo.http.error.ServiceException
import gr.tek.talks.tektalksdemo.http.filter.UserInfoFilter
import gr.tek.talks.tektalksdemo.service.ChatAPIHandler
import kotlinx.coroutines.reactor.mono
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.io.ClassPathResource
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.web.reactive.function.BodyInserters
import org.springframework.web.reactive.function.server.ServerRequest
import org.springframework.web.reactive.function.server.ServerResponse
import org.springframework.web.reactive.function.server.router
import reactor.core.publisher.Mono

@Configuration
class ChatRouter(
    val chatService: ChatAPIHandler,
    val objectMapper: ObjectMapper
) {

    @Bean
    fun staticResources() = router {
        resources("/", ClassPathResource("/static/index.html"))
    }

    @Bean
    fun userRoutes() = router {
        "/api/account".nest {
            GET {
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
        return bodyToMono(rClass).flatMap {
            serverResponse(handlerFunction, it)
        }
    }

    fun <T : AuthorizedRequest, R : Any> ServerRequest.handleAuthorized(
        rClass: Class<T>, handlerFunction: (T) -> R
    ): Mono<ServerResponse> {
        return bodyToMono(rClass).map {
            val auth = headers().firstHeader(HttpHeaders.AUTHORIZATION);
            val user = objectMapper.readValue(auth, UserInfoDTO::class.java)
            it.apply {
                userInfo = user
            }
        }.flatMap {
            serverResponse(handlerFunction, it)
        }
    }

    private inline fun <T : Any, R : Any> serverResponse(crossinline handlerFunction: (T) -> R, it: T)
            : Mono<ServerResponse> {
        return try {
            mono {
                handlerFunction(it)
            }.flatMap {
                ServerResponse.ok().body(BodyInserters.fromValue(it))
            }
        } catch (e: ServiceException) {
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