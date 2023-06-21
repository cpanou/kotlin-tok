package gr.tek.talks.tektalksdemo.domain.entities

data class Conversation(
    var user: UserInfo,
    var messages: List<UserMessage>
) {
    fun add(message: UserMessage) {
        messages += message
    }

}