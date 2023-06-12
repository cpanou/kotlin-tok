package gr.tek.talks.tektalksdemo.repository.storage

import gr.tek.talks.tektalksdemo.repository.entities.UserEntity
import org.springframework.data.jpa.repository.JpaRepository

import org.springframework.stereotype.Repository
import java.util.*


@Repository
interface UserRepository : JpaRepository<UserEntity, UUID> {

    fun findByUsername(username: String): UserEntity?

}