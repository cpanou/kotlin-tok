package gr.tek.talks.tektalksdemo.domain.entities

import java.time.OffsetDateTime

data class UserMessage(
    val id: String,
    val text: String,
    val createdAt: OffsetDateTime,
    val type: String,
    val user: UserInfo,
) {
}