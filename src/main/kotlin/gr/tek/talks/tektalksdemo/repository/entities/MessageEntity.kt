package gr.tek.talks.tektalksdemo.repository.entities

import jakarta.persistence.*
import org.hibernate.annotations.GenericGenerator
import java.time.OffsetDateTime
import java.util.*

@Entity
class MessageEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    var id: UUID = UUID.randomUUID(),
    @ManyToOne
    @JoinColumn(name = "user_id")
    var userEntity: UserEntity,
    var text: String,
    var createdAt: OffsetDateTime,
    var type: String,
)
