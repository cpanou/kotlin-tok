package gr.tek.talks.tektalksdemo.repository.storage

import gr.tek.talks.tektalksdemo.repository.entities.GroupEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*


@Repository
interface GroupRepository : JpaRepository<GroupEntity, UUID> {

    fun findByName(name: String): GroupEntity?

}