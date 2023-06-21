package gr.tek.talks.tektalksdemo.http.entities

import org.springframework.web.reactive.function.server.ServerRequest

interface EmptyRequest {

    fun initSelf(request: ServerRequest)

}