package gr.tek.talks.tektalksdemo.http.entities.response

import gr.tek.talks.tektalksdemo.domain.entities.User
import gr.tek.talks.tektalksdemo.http.entities.dto.ConversationDTO
import gr.tek.talks.tektalksdemo.http.entities.dto.GroupDTO
import gr.tek.talks.tektalksdemo.http.entities.dto.UserInfoDTO
import gr.tek.talks.tektalksdemo.http.entities.dto.toDTO

data class UserResponse(
    var userInfo: UserInfoDTO,
    var conversations: List<ConversationDTO>,
    var groups: List<GroupDTO>,
)

fun User.toResponse(): UserResponse {
    return UserResponse(
        userInfo = userInfo.toDTO(),
        conversations = privateChats.map { it.toDTO() },
        groups = groups.map { it.toDTO() },
    )
}