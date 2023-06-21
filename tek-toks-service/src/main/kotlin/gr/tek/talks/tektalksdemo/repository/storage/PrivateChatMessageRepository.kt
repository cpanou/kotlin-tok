package gr.tek.talks.tektalksdemo.repository.storage

import gr.tek.talks.tektalksdemo.repository.entities.PrivateChatMessageEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*


@Repository
interface PrivateChatMessageRepository :
    JpaRepository<PrivateChatMessageEntity, PrivateChatMessageEntity.PrivateChatId> {

    fun findByPrivateChatEntityId(privateChatId: UUID): List<PrivateChatMessageEntity>

}