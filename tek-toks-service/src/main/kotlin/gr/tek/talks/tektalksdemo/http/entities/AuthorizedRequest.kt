package gr.tek.talks.tektalksdemo.http.entities

import gr.tek.talks.tektalksdemo.http.entities.dto.UserInfoDTO

abstract class AuthorizedRequest {
    lateinit var userInfo: UserInfoDTO
}