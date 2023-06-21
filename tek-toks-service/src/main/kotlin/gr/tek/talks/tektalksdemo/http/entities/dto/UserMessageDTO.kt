package gr.tek.talks.tektalksdemo.http.entities.dto

import gr.tek.talks.tektalksdemo.domain.entities.UserMessage
import java.time.OffsetDateTime


data class UserMessageDTO(
    val id: String,
    val username: String,
    val text: String,
    val sentAt: OffsetDateTime,
)

fun UserMessage.toDTO(): UserMessageDTO {
    return UserMessageDTO(
        id = id,
        text = text,
        username = user.username,
        sentAt = createdAt,
    )
}