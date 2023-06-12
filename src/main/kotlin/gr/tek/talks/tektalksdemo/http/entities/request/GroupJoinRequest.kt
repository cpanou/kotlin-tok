package gr.tek.talks.tektalksdemo.http.entities.request

import gr.tek.talks.tektalksdemo.http.entities.AuthorizedRequest

class GroupJoinRequest(
    var groupName: String
) : AuthorizedRequest() {


}