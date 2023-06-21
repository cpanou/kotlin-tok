package gr.tek.talks.tektalksdemo.repository.storage

import gr.tek.talks.tektalksdemo.repository.entities.PrivateChatEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*


@Repository
interface PrivateChatRepository : JpaRepository<PrivateChatEntity, UUID> {

    fun findByUser1IdOrUser2Id(user1Id: UUID, user2Id: UUID): List<PrivateChatEntity>

}