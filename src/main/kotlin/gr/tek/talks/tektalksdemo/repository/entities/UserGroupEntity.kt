package gr.tek.talks.tektalksdemo.repository.entities

import jakarta.persistence.*
import java.io.Serializable
import java.time.OffsetDateTime
import java.util.*


@Entity
@IdClass(UserGroupEntity.UserGroupId::class)
class UserGroupEntity(
    @Id
    @ManyToOne
    @JoinColumn(name = "user_id")
    var userEntity: UserEntity,

    @Id
    @ManyToOne
    @JoinColumn(name = "group_id")
    var groupEntity: GroupEntity,

    var joinedAt: OffsetDateTime,
    var active: Boolean,
    var leftAt: OffsetDateTime?
) {

    companion object {
        @JvmStatic
        fun newEntity(userEntity: UserEntity, groupEntity: GroupEntity): UserGroupEntity {
            return UserGroupEntity(
                groupEntity = groupEntity,
                userEntity = userEntity,
                joinedAt = OffsetDateTime.now(),
                leftAt = OffsetDateTime.now(),
                active = true
            )
        }
    }

    data class UserGroupId(
        var userEntity: UUID? = null,
        var groupEntity: UUID? = null
    ) : Serializable
}
