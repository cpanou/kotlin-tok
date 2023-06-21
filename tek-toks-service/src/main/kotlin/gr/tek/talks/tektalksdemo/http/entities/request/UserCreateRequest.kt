package gr.tek.talks.tektalksdemo.http.entities.request

import gr.tek.talks.tektalksdemo.domain.entities.UserInfo
import gr.tek.talks.tektalksdemo.http.entities.GuestRequest
import java.time.OffsetDateTime

class UserCreateRequest(
    var username: String,
    var firstname: String,
    var lastname: String,
) : GuestRequest() {

    fun toUserInfo(): UserInfo = UserInfo(
        id = null,
        username = username,
        firstName = firstname,
        lastName = lastname,
        createdAt = OffsetDateTime.now(),
        lastSeenAt = OffsetDateTime.now()
    )

}