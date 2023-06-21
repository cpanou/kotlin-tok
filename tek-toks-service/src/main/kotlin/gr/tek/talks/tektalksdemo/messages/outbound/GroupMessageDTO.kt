package gr.tek.talks.tektalksdemo.messages.outbound

import java.time.OffsetDateTime

class GroupMessageDTO(
    val id: String,
    val username: String,
    val text: String,
    val groupId: String,
    val sentAt: OffsetDateTime,
) {

}