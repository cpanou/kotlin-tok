package gr.tek.talks.tektalksdemo.domain.service

import gr.tek.talks.tektalksdemo.domain.exception.UserDomainException
import gr.tek.talks.tektalksdemo.messages.ChatMessage
import gr.tek.talks.tektalksdemo.repository.entities.GroupMessageEntity
import gr.tek.talks.tektalksdemo.repository.entities.MessageEntity
import gr.tek.talks.tektalksdemo.repository.storage.GroupMessageRepository
import gr.tek.talks.tektalksdemo.repository.storage.UserGroupRepository
import gr.tek.talks.tektalksdemo.repository.storage.UserRepository
import org.springframework.stereotype.Service
import java.time.OffsetDateTime
import java.util.*

@Service
class MessagingService(
    val userRepository: UserRepository,
    val userGroupRepository: UserGroupRepository,
    val groupMessageRepository: GroupMessageRepository
) {


    fun messageReceived(message: ChatMessage) {
        val user = userRepository.findByUsername(message.username)
            ?: throw UserDomainException("User Does Not Exist")
        val userGroup = userGroupRepository.findByUserEntityId(userId = user.id)
            .filter {
                it.groupEntity.id == UUID.fromString(message.groupId)
            }
            .ifEmpty {
                throw UserDomainException("User not part of group")
            }.first()

        val groupMessage = GroupMessageEntity(
            messageEntity = MessageEntity(
                text = message.text,
                type = "Chat Message",
                createdAt = OffsetDateTime.now(),
                userEntity = user
            ),
            groupEntity = userGroup.groupEntity
        )
        groupMessageRepository.save(groupMessage);
    }
}