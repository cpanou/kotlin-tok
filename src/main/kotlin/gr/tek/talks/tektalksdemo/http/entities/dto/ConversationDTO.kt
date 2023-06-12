package gr.tek.talks.tektalksdemo.http.entities.dto

import gr.tek.talks.tektalksdemo.domain.entities.Conversation


data class ConversationDTO(
    val user: String,
    val messages: List<UserMessageDTO>,
)

fun Conversation.toDTO(): ConversationDTO {
    return ConversationDTO(
        user = user.username,
        messages = messages.map { it.toDTO() }
    )
}
