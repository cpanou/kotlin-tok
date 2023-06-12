package gr.tek.talks.tektalksdemo.repository.entities

import gr.tek.talks.tektalksdemo.domain.entities.UserInfo
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import org.hibernate.annotations.GenericGenerator
import java.time.OffsetDateTime
import java.util.*

@Entity
class UserEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    var id: UUID = UUID.randomUUID(),
    var username: String,
    var firstName: String,
    var lastName: String,
    var createdAt: OffsetDateTime,
    var lastSeenAt: OffsetDateTime,
) {
    companion object {
        fun newEntity(user: UserInfo): UserEntity {
            return UserEntity(
                username = user.username,
                firstName = user.firstName,
                lastName = user.lastName,
                createdAt = OffsetDateTime.now(),
                lastSeenAt = OffsetDateTime.now()
            )
        }
    }

}