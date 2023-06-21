package gr.tek.talks.tektalksdemo.repository.entities

import jakarta.persistence.*
import org.hibernate.annotations.GenericGenerator
import java.time.OffsetDateTime
import java.util.*


@Entity
class GroupEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    var id: UUID = UUID.randomUUID(),

    @Column(unique = true)
    var name: String,
    @OneToMany(mappedBy = "groupEntity", cascade = [CascadeType.ALL], fetch = FetchType.EAGER)
    var userGroup: List<UserGroupEntity>,
    var createdAt: OffsetDateTime,
    var deletedAt: OffsetDateTime?,
    var active: Boolean
) {
    companion object {
        fun newGroupEntity(group: String): GroupEntity {
            return GroupEntity(
                createdAt = OffsetDateTime.now(),
                name = group,
                active = true,
                deletedAt = null,
                userGroup = listOf()
            )
        }
    }
}
