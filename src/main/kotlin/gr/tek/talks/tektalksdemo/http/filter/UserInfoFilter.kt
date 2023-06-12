package gr.tek.talks.tektalksdemo.http.filter

import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.web.reactive.function.server.HandlerFilterFunction
import org.springframework.web.reactive.function.server.HandlerFunction
import org.springframework.web.reactive.function.server.ServerRequest
import org.springframework.web.reactive.function.server.ServerResponse
import reactor.core.publisher.Mono


class UserInfoFilter : HandlerFilterFunction<ServerResponse, ServerResponse> {

    override fun filter(request: ServerRequest, next: HandlerFunction<ServerResponse>): Mono<ServerResponse> {
        return if (filter(request))
            next.handle(request)
        else ServerResponse
            .status(HttpStatus.UNAUTHORIZED)
            .build()
    }

    private fun filter(request: ServerRequest): Boolean {
        val authorization = request.headers().firstHeader(HttpHeaders.AUTHORIZATION)
        return authorization?.isNotEmpty() ?: throw RuntimeException("No user present")
    }


}