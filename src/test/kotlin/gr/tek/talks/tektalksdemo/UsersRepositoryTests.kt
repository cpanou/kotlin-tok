package gr.tek.talks.tektalksdemo

import gr.tek.talks.tektalksdemo.repository.entities.UserEntity
import gr.tek.talks.tektalksdemo.repository.storage.UserRepository
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import java.time.OffsetDateTime
import java.util.*

@SpringBootTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class UsersRepositoryTests {

    @Autowired
    lateinit var userRepository: UserRepository

    @BeforeAll
    fun initialize(): Unit {
        val user1 = UserEntity(
            id = UUID.randomUUID(),
            "Sukrats",
            "Suk",
            "Suk",
            OffsetDateTime.now(),
            OffsetDateTime.now()
        )
        val user2 = UserEntity(
            id = UUID.randomUUID(),
            "Sukrats2",
            "Suk2",
            "Suk2",
            OffsetDateTime.now(),
            OffsetDateTime.now()
        )
        val user3 = UserEntity(
            id = UUID.randomUUID(),
            "Sukrats3",
            "Suk3",
            "Suk3",
            OffsetDateTime.now(),
            OffsetDateTime.now()
        )
        userRepository.save(user1)
        userRepository.save(user2)
        userRepository.save(user3)
    }
    
    @Test
    fun should_return_test_user_info() {
        var user1 = userRepository.findByUsername("Sukrats")
        assertEquals("Sukrats", user1?.username)

        user1 = userRepository.findByUsername("Sukrats2")
        assertEquals("Sukrats2", user1?.username)

        user1 = userRepository.findByUsername("Sukrats3")
        assertEquals("Sukrats3", user1?.username)
    }

}
