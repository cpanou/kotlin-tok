package gr.tek.talks.tektalksdemo.http.entities.request

import gr.tek.talks.tektalksdemo.http.entities.AuthorizedRequest

class GroupCreateRequest(
    var groupName: String
) : AuthorizedRequest()