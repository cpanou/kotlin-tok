package gr.tek.talks.tektalksdemo.domain.service

import gr.tek.talks.tektalksdemo.domain.exception.UserDomainException
import gr.tek.talks.tektalksdemo.messages.MessageBridge
import gr.tek.talks.tektalksdemo.messages.OutboundMessage
import gr.tek.talks.tektalksdemo.messages.WebSocketKey
import gr.tek.talks.tektalksdemo.messages.inbound.ChatMessage
import gr.tek.talks.tektalksdemo.messages.outbound.GroupMessageDTO
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
    val groupMessageRepository: GroupMessageRepository,
    val messageBridge: MessageBridge,
) {

    fun handleMessage(message: ChatMessage) {
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
        val groupMessageEntity = groupMessageRepository.save(groupMessage)
        groupMessageEntity.groupEntity.userGroup.forEach {
            messageBridge.sendMessage(
                OutboundMessage(
                    WebSocketKey(
                        userId = it.userEntity.id,
                        id = "no idea"
                    ),
                    GroupMessageDTO(
                        id = groupMessageEntity.messageEntity.id.toString(),
                        text = groupMessageEntity.messageEntity.text,
                        username = user.username,
                        sentAt = groupMessageEntity.messageEntity.createdAt,
                        groupId = userGroup.groupEntity.id.toString(),
                    )
                )
            )
        }
    }
}