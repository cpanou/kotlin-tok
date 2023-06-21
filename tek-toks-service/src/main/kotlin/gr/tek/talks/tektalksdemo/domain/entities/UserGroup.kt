package gr.tek.talks.tektalksdemo.domain.entities

data class UserGroup(
    var id: String,
    var name: String,
    var users: List<User>
) {
    fun addUser(user: User) {
        users += user
    }
}
