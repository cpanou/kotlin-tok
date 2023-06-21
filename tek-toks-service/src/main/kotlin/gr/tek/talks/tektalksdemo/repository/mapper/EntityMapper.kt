package gr.tek.talks.tektalksdemo.repository.mapper

import gr.tek.talks.tektalksdemo.domain.entities.Group
import gr.tek.talks.tektalksdemo.domain.entities.UserInfo
import gr.tek.talks.tektalksdemo.domain.entities.UserMessage
import gr.tek.talks.tektalksdemo.repository.entities.GroupEntity
import gr.tek.talks.tektalksdemo.repository.entities.MessageEntity
import gr.tek.talks.tektalksdemo.repository.entities.UserEntity

interface EntityMapper {
}


fun GroupEntity.toGroup(): Group = Group(
    id = id.toString(),
    name = name,
    messages = listOf()
)


fun UserEntity.toUserInfo(): UserInfo = UserInfo(
    id = id,
    username = username,
    firstName = firstName,
    lastName = lastName,
    createdAt = createdAt,
    lastSeenAt = lastSeenAt
)


fun MessageEntity.toUserMessage(): UserMessage =
    UserMessage(
        id = id.toString(),
        user = userEntity.toUserInfo(),
        text = text,
        createdAt = createdAt,
        type = type,
    )