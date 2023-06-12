package gr.tek.talks.tektalksdemo.domain.service

import gr.tek.talks.tektalksdemo.domain.entities.Conversation
import gr.tek.talks.tektalksdemo.domain.entities.User
import gr.tek.talks.tektalksdemo.domain.entities.UserInfo
import gr.tek.talks.tektalksdemo.domain.exception.UserDomainException
import gr.tek.talks.tektalksdemo.repository.entities.UserEntity
import gr.tek.talks.tektalksdemo.repository.mapper.toUserInfo
import gr.tek.talks.tektalksdemo.repository.mapper.toUserMessage
import gr.tek.talks.tektalksdemo.repository.storage.PrivateChatMessageRepository
import gr.tek.talks.tektalksdemo.repository.storage.PrivateChatRepository
import gr.tek.talks.tektalksdemo.repository.storage.UserRepository
import org.springframework.stereotype.Service


@Service
class UserApplicationService(
    val userRepository: UserRepository,
    val userPrivateChatRepository: PrivateChatRepository,
    val privateChatMessageRepository: PrivateChatMessageRepository,
    val groupService: GroupApplicationService
) {

    fun findUserByUsername(username: String): UserInfo {
        return userRepository.findByUsername(username)?.toUserInfo()
            ?: throw UserDomainException("User Not Found")
    }

    fun createUser(user: UserInfo): UserInfo {
        return userRepository.save(UserEntity.newEntity(user = user)).toUserInfo()
    }

    fun fetchUserConversations(username: String): User {
        val userInfo = userRepository.findByUsername(username)?.toUserInfo()
            ?: throw UserDomainException("User Not Found")
        val userGroups = groupService.fetchUserGroups(userInfo)
        val userConversations = getUserConversations(userInfo)
        return User(
            userInfo = userInfo,
            groups = userGroups,
            privateChats = userConversations
        )
    }

    private fun getUserConversations(userInfo: UserInfo): List<Conversation> {
        val userId = userInfo.id ?: throw UserDomainException("Invalid User Provided")
        return userPrivateChatRepository.findByUser1IdOrUser2Id(userId, userId).map {
            val messages = privateChatMessageRepository.findByPrivateChatEntityId(it.id);
            when (userId) {
                it.user1.id -> it.user2 to messages
                else -> it.user1 to messages
            }
        }.map { pair ->
            Conversation(
                pair.first.toUserInfo(),
                pair.second.map { it.messageEntity.toUserMessage() }
            )
        }
    }

}