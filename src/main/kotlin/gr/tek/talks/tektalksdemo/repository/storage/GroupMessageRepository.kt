package gr.tek.talks.tektalksdemo.repository.storage

import gr.tek.talks.tektalksdemo.repository.entities.GroupMessageEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*


@Repository
interface GroupMessageRepository : JpaRepository<GroupMessageEntity, GroupMessageEntity.GroupMessageId> {

    fun findByGroupEntityId(groupId: UUID): List<GroupMessageEntity>
    fun findByGroupEntityName(groupName: String): List<GroupMessageEntity>

}