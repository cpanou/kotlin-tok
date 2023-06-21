package gr.tek.talks.tektalksdemo.service

import com.fasterxml.jackson.databind.ObjectMapper
import gr.tek.talks.tektalksdemo.domain.service.MessagingService
import gr.tek.talks.tektalksdemo.http.filter.UserAuthenticationResolver
import gr.tek.talks.tektalksdemo.messages.MessageBridge
import gr.tek.talks.tektalksdemo.messages.inbound.ChatMessage
import kotlinx.coroutines.reactor.mono
import org.springframework.context.annotation.Bean
import org.springframework.stereotype.Service
import org.springframework.web.reactive.socket.WebSocketHandler
import org.springframework.web.reactive.socket.WebSocketMessage


@Service
class WebSocketHandler(
    val objectMapper: ObjectMapper,
    val messagingService: MessagingService,
    val messageBridge: MessageBridge,
    val userAuthenticationResolver: UserAuthenticationResolver,
) {

    @Bean
    fun chatWebSocketHandler(): WebSocketHandler {
        return WebSocketHandler { webSocketSession ->
            val user = userAuthenticationResolver.authenticate(webSocketSession.handshakeInfo)
            webSocketSession
                .send(messageBridge.register(user, webSocketSession))
                .and(webSocketSession.receive()
                    .map(WebSocketMessage::getPayloadAsText)
                    .map {
                        objectMapper.readValue(it, ChatMessage::class.java)
                    }
                    .flatMap {
                        mono {
                            messagingService.handleMessage(it)
                        }
                    }
                    .log())
        }
    }

}
