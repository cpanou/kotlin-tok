package gr.tek.talks.tektalksdemo.domain.entities

data class Group(
    var id: String,
    var name: String,
    var messages: List<UserMessage>
) {
    fun addMessage(message: UserMessage) {
        messages += message
    }
}
