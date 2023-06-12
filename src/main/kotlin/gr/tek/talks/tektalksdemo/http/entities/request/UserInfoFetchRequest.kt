package gr.tek.talks.tektalksdemo.http.entities.request

import gr.tek.talks.tektalksdemo.http.entities.EmptyRequest
import gr.tek.talks.tektalksdemo.http.entities.GuestRequest
import org.springframework.web.reactive.function.server.ServerRequest

class UserInfoFetchRequest(
    var username: String
) : GuestRequest(), EmptyRequest {

    constructor() : this("")

    override fun initSelf(request: ServerRequest) {
        username = request.pathVariable("username")
    }

}