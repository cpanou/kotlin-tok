package gr.tek.talks.tektalksdemo.http.entities.request

import gr.tek.talks.tektalksdemo.http.entities.GuestRequest

class UserInfoFetchRequest(
    var username: String
) : GuestRequest() {

}