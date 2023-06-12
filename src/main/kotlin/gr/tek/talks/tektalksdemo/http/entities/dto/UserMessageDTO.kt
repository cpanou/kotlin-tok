package gr.tek.talks.tektalksdemo.http.entities.dto

import gr.tek.talks.tektalksdemo.domain.entities.UserMessage


data class UserMessageDTO(
    val id: String,
    val username: String,
    val text: String,
)

fun UserMessage.toDTO(): UserMessageDTO {
    return UserMessageDTO(
        id = id,
        text = text,
        username = user.username,
    )
}