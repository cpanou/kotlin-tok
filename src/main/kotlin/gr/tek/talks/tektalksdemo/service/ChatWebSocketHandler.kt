package gr.tek.talks.tektalksdemo.service

import com.fasterxml.jackson.databind.ObjectMapper
import gr.tek.talks.tektalksdemo.domain.service.MessagingService
import gr.tek.talks.tektalksdemo.http.entities.dto.UserMessageDTO
import gr.tek.talks.tektalksdemo.messages.ChatMessage
import kotlinx.coroutines.reactor.mono
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import org.springframework.web.reactive.socket.WebSocketHandler
import org.springframework.web.reactive.socket.WebSocketMessage
import org.springframework.web.reactive.socket.WebSocketSession
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import reactor.core.publisher.Sinks


@Component
class ChatWebSocketHandler(
    val objectMapper: ObjectMapper,
    val messagingService: MessagingService
) : WebSocketHandler {

    var log: Logger = LoggerFactory.getLogger(ChatAPIHandler::class.java)

    private final val sink: Sinks.Many<String> = Sinks.many().multicast().onBackpressureBuffer()
    private final val messageFlux: Flux<String> = sink.asFlux();

    override fun handle(webSocketSession: WebSocketSession): Mono<Void> {
        return webSocketSession.send(messageFlux.map(webSocketSession::textMessage))
            .and(
                webSocketSession.receive()
                    .map(WebSocketMessage::getPayloadAsText)
                    .map {
                        objectMapper.readValue(it, ChatMessage::class.java)
                    }
                    .flatMap {
                        mono {
                            messagingService.messageReceived(it)
                        }
                    }
                    .log()
            )
    }

    fun sendMessage(messageDTO: UserMessageDTO) {
        val message = objectMapper.writeValueAsString(messageDTO)
        sink.tryEmitNext(message)
    }

}