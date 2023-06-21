package gr.tek.talks.tektalksdemo.http.entities.dto

import gr.tek.talks.tektalksdemo.domain.entities.UserInfo
import java.time.OffsetDateTime
import java.util.*

class UserInfoDTO(
    var id: String?,
    var username: String,
    var firstname: String,
    var lastname: String,
    var createdAt: OffsetDateTime,
    var lastSeenAt: OffsetDateTime,
) {
    fun toUserInfo(): UserInfo =
        UserInfo(
            id = UUID.fromString(id),
            username = username,
            firstName = firstname,
            lastName = lastname,
            createdAt = createdAt,
            lastSeenAt = lastSeenAt
        )
}

fun UserInfo.toDTO(): UserInfoDTO {
    return UserInfoDTO(
        id = id.toString(),
        username = username,
        firstname = firstName,
        lastname = lastName,
        lastSeenAt = lastSeenAt,
        createdAt = createdAt,
    )
}
