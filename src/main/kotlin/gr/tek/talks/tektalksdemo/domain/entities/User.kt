package gr.tek.talks.tektalksdemo.domain.entities

import gr.tek.talks.tektalksdemo.domain.exception.UserDomainException

data class User(
    var userInfo: UserInfo,
    var groups: List<Group>,
    var privateChats: List<Conversation>,
) {

    fun join(group: Group) {
        if (groups.contains(group))
            throw UserDomainException("User already in group")
        groups += group
    }

    fun initiatePrivateChat(conversation: Conversation) {
        if (privateChats.contains(conversation))
            throw UserDomainException("User already chatting with user")
        privateChats += conversation
    }

    fun sendGroupMessage(message: UserMessage, group: Group) {
        val userGroup = groups.find { it.id == group.id }
            ?: throw UserDomainException("User not in group")
        userGroup.addMessage(message)
    }

    fun sendPrivateMessage(message: UserMessage, receiver: User) {
        val conversation = privateChats.find { it.user.id == receiver.userInfo.id }
            ?: throw UserDomainException("User already chatting with user")
        conversation.add(message)
    }

}