package gr.tek.talks.tektalksdemo.domain.entities

import java.time.OffsetDateTime
import java.util.*


data class UserInfo(
    val id: UUID?,
    val username: String,
    val firstName: String,
    val lastName: String,
    val createdAt: OffsetDateTime,
    val lastSeenAt: OffsetDateTime,
) {

}