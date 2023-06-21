package gr.tek.talks.tektalksdemo.messages

import com.fasterxml.jackson.databind.ObjectMapper
import gr.tek.talks.tektalksdemo.http.entities.dto.UserInfoDTO
import org.springframework.stereotype.Service
import org.springframework.web.reactive.socket.WebSocketMessage
import org.springframework.web.reactive.socket.WebSocketSession
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import reactor.core.publisher.Sinks
import java.util.*


interface MessageBridge {

    fun register(
        user: UserInfoDTO,
        socketSession: WebSocketSession
    ): Flux<WebSocketMessage>

    fun sendMessage(messageDTO: OutboundMessage)
}


data class WebSocketKey(
    val userId: UUID,
    var id: String,
)

class WebSocketEmitter(
    val session: WebSocketSession,
    val emitter: Sinks.Many<String>
)


@Service
class SessionMessageBridge(
    val objectMapper: ObjectMapper,
) : MessageBridge {

    var sessionsMap = mutableMapOf<UUID, MutableList<WebSocketEmitter>>()

    fun close(key: WebSocketKey): Mono<Void> {
        return sessionsMap[key.userId]
            ?.map {
                it.session.close()
            }.let {
                Mono.empty<Void?>().then()
            }

    }

    override fun register(
        user: UserInfoDTO,
        socketSession: WebSocketSession
    ): Flux<WebSocketMessage> {
        val sink: Sinks.Many<String> = Sinks.many().multicast().onBackpressureBuffer()
        val key = WebSocketKey(
            userId = UUID.fromString(user.id),
            id = socketSession.id
        )
        val emitter = WebSocketEmitter(
            session = socketSession,
            emitter = sink
        )

        sessionsMap[key.userId] = sessionsMap[key.userId]
            ?.apply {
                add(emitter)
            } ?: mutableListOf(emitter)

        return sink.asFlux().map(socketSession::textMessage)
    }

    override fun sendMessage(messageDTO: OutboundMessage) {
        val message = objectMapper.writeValueAsString(messageDTO.message)
        sessionsMap[messageDTO.key.userId]
            ?.forEach {
                it.emitter.tryEmitNext(message)
            }
    }
}
