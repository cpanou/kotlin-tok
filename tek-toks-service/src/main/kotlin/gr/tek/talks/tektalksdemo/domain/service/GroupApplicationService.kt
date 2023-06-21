package gr.tek.talks.tektalksdemo.domain.service

import gr.tek.talks.tektalksdemo.domain.entities.Group
import gr.tek.talks.tektalksdemo.domain.entities.UserInfo
import gr.tek.talks.tektalksdemo.domain.exception.UserDomainException
import gr.tek.talks.tektalksdemo.repository.entities.GroupEntity
import gr.tek.talks.tektalksdemo.repository.entities.UserGroupEntity
import gr.tek.talks.tektalksdemo.repository.exception.EntityNotFoundException
import gr.tek.talks.tektalksdemo.repository.mapper.toGroup
import gr.tek.talks.tektalksdemo.repository.mapper.toUserMessage
import gr.tek.talks.tektalksdemo.repository.storage.GroupMessageRepository
import gr.tek.talks.tektalksdemo.repository.storage.GroupRepository
import gr.tek.talks.tektalksdemo.repository.storage.UserGroupRepository
import gr.tek.talks.tektalksdemo.repository.storage.UserRepository
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service


@Service
class GroupApplicationService(
    val groupRepository: GroupRepository,
    val groupMessageRepository: GroupMessageRepository,
    val userGroupRepository: UserGroupRepository,
    val userRepository: UserRepository,
) {

    var log: Logger = LoggerFactory.getLogger(GroupApplicationService::class.java)

    fun joinUserGroup(userInfo: UserInfo, name: String): Group {
        val userId = userInfo.id ?: throw UserDomainException("Invalid User Provided")
        val groupEntity = groupRepository.findByName(name)
            ?: createGroupInternal(name)
        val userEntity = userRepository.findById(userId)
            .orElseThrow { EntityNotFoundException("User ${userInfo.username} not found") }
        userGroupRepository.save(UserGroupEntity.newEntity(userEntity, groupEntity))
        log.info("User: ${userEntity.id} joined Group: ${groupEntity.name}")
        return groupEntity.toGroup()
    }

    fun fetchUserGroups(user: UserInfo): List<Group> {
        val userId = user.id
            ?: throw UserDomainException("Invalid User Provided")
        return userGroupRepository.findByUserEntityId(userId)
            .map { userGroup ->
                val messages = groupMessageRepository.findByGroupEntityId(userGroup.groupEntity.id)
                userGroup.groupEntity.toGroup()
                    .copy(messages = messages.map { it.messageEntity.toUserMessage() })
            }
    }

    fun createNewUserGroup(group: String): Group {
        return createGroupInternal(group).toGroup()
    }

    fun createGroupInternal(group: String): GroupEntity {
        val entity = GroupEntity.newGroupEntity(group)
        return groupRepository.save(entity)
    }

}