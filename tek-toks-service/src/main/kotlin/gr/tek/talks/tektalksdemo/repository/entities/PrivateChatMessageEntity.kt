package gr.tek.talks.tektalksdemo.repository.entities

import jakarta.persistence.*
import java.io.Serializable
import java.util.*


@Entity
@IdClass(PrivateChatMessageEntity.PrivateChatId::class)
class PrivateChatMessageEntity(
    @Id
    @ManyToOne
    @JoinColumn(name = "message_id")
    var messageEntity: MessageEntity,
    @Id
    @ManyToOne
    @JoinColumn(name = "private_chat_id")
    var privateChatEntity: PrivateChatEntity,
) {
    data class PrivateChatId(
        var messageEntity: UUID? = null,
        var privateChatEntity: UUID? = null,
    ) : Serializable
}