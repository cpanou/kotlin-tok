package gr.tek.talks.tektalksdemo.repository.storage

import gr.tek.talks.tektalksdemo.repository.entities.UserGroupEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*


@Repository
interface UserGroupRepository : JpaRepository<UserGroupEntity, UserGroupEntity.UserGroupId> {

    fun findByGroupEntityId(groupId: UUID): UserGroupEntity?

    fun findByUserEntityId(userId: UUID): List<UserGroupEntity>

}