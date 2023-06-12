package gr.tek.talks.tektalksdemo.service

import gr.tek.talks.tektalksdemo.domain.service.GroupApplicationService
import gr.tek.talks.tektalksdemo.domain.service.UserApplicationService
import gr.tek.talks.tektalksdemo.http.entities.dto.GroupDTO
import gr.tek.talks.tektalksdemo.http.entities.dto.toDTO
import gr.tek.talks.tektalksdemo.http.entities.request.*
import gr.tek.talks.tektalksdemo.http.entities.response.UserInfoResponse
import gr.tek.talks.tektalksdemo.http.entities.response.UserResponse
import gr.tek.talks.tektalksdemo.http.entities.response.toResponse
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service


@Service
class ChatAPIHandler(
    val userService: UserApplicationService,
    val groupApplicationService: GroupApplicationService
) {

    var log: Logger = LoggerFactory.getLogger(ChatAPIHandler::class.java)

    fun getUserInfo(request: UserInfoFetchRequest): UserInfoResponse {
        log.info("getUserInfo invoked: $request")
        val userInfo = userService.findUserByUsername(request.username)
        return UserInfoResponse(userInfo = userInfo.toDTO())
    }

    fun createUser(request: UserCreateRequest): UserInfoResponse {
        log.info("createUser invoked: $request")
        val userInfo = userService.createUser(request.toUserInfo())
        return UserInfoResponse(userInfo = userInfo.toDTO())
    }

    fun createChatGroup(request: GroupCreateRequest): GroupDTO {
        log.info("createChatGroup invoked: $request")
        return groupApplicationService.createNewUserGroup(request.groupName)
            .toDTO()
    }

    fun joinUserGroup(request: GroupJoinRequest): GroupDTO {
        log.info("joinUserGroup invoked: $request")
        return groupApplicationService.joinUserGroup(request.userInfo.toUserInfo(), request.groupName)
            .toDTO()
    }

    fun fetchUserConversations(request: UserConversationsFetchRequest): UserResponse {
        log.info("fetchUserConversations invoked: $request")
        return userService.fetchUserConversations(request.userInfo.username)
            .toResponse()
    }

}