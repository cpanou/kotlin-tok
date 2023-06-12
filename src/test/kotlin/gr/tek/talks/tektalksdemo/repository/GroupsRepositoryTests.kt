package gr.tek.talks.tektalksdemo.repository

import gr.tek.talks.tektalksdemo.repository.entities.GroupEntity
import gr.tek.talks.tektalksdemo.repository.entities.UserEntity
import gr.tek.talks.tektalksdemo.repository.entities.UserGroupEntity
import gr.tek.talks.tektalksdemo.repository.storage.GroupRepository
import gr.tek.talks.tektalksdemo.repository.storage.UserGroupRepository
import gr.tek.talks.tektalksdemo.repository.storage.UserRepository
import org.junit.jupiter.api.*
import org.junit.jupiter.api.Assertions.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import java.time.OffsetDateTime
import java.util.*

@SpringBootTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class GroupsRepositoryTests {

    @Autowired
    lateinit var groupRepository: GroupRepository
    @Autowired
    lateinit var userRepository: UserRepository


    @BeforeAll
    fun initialize(): Unit {
        val user1 = UserEntity(
            id = UUID.randomUUID(), "Sukrats", "Suk", "Suk", OffsetDateTime.now(), OffsetDateTime.now()
        )
        val user2 = UserEntity(
            id = UUID.randomUUID(), "Sukrats2", "Suk2", "Suk2", OffsetDateTime.now(), OffsetDateTime.now()
        )
        val userEntity1 = userRepository.save(user1)
        val userEntity2 = userRepository.save(user2)
        val group = GroupEntity(
            id = UUID.randomUUID(),
            name = "Group",
            userGroup = listOf(),
            createdAt = OffsetDateTime.now(),
            active = true,
            deletedAt = null
        )
        val groupEntity = groupRepository.save(group)
        val userGroup = UserGroupEntity(
            userEntity = userEntity1,
            groupEntity = groupEntity,
            joinedAt = OffsetDateTime.now(),
            active = true,
            leftAt = null
        )
        groupEntity.userGroup += userGroup
        groupRepository.save(groupEntity)
    }

    @Test
    fun should_return_group_users() {
        val group = groupRepository.findByName("Group")
        val users = group!!.userGroup
            .map {
                it.userEntity
            }
        assertEquals(1, users.size)
        users.forEach {
            assertEquals("Sukrats", it.username)
        }
    }

}
