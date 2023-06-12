package gr.tek.talks.tektalksdemo.repository.entities

import jakarta.persistence.*
import java.io.Serializable
import java.util.*


@Entity
@IdClass(GroupMessageEntity.GroupMessageId::class)
class GroupMessageEntity(
    @Id
    @ManyToOne
    @JoinColumn(name = "message_id")
    var messageEntity: MessageEntity,
    @Id
    @ManyToOne
    @JoinColumn(name = "group_id")
    var groupEntity: GroupEntity
) {

    data class GroupMessageId(
        var messageEntity: UUID? = null,
        var groupEntity: UUID? = null
    ) : Serializable

}
