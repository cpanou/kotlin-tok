package gr.tek.talks.tektalksdemo.http.entities.dto

import gr.tek.talks.tektalksdemo.domain.entities.Group


data class GroupDTO(
    val id: String,
    val name: String,
    val messages: List<UserMessageDTO>
)

fun Group.toDTO(): GroupDTO {
    return GroupDTO(name = name, id = id, messages = messages.map { it.toDTO() })
}
