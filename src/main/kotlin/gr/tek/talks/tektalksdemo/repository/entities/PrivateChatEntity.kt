package gr.tek.talks.tektalksdemo.repository.entities

import jakarta.persistence.*
import org.hibernate.annotations.GenericGenerator
import java.util.*


@Entity
class PrivateChatEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    var id: UUID = UUID.randomUUID(),
    @ManyToOne
    @JoinColumn(name = "user_1_id")
    var user1: UserEntity,
    @ManyToOne
    @JoinColumn(name = "user_2_id")
    var user2: UserEntity
)