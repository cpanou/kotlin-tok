package gr.tek.talks.tektalksdemo.http.filter

import com.fasterxml.jackson.databind.ObjectMapper
import gr.tek.talks.tektalksdemo.domain.exception.UserDomainException
import gr.tek.talks.tektalksdemo.http.entities.dto.UserInfoDTO
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.reactive.function.server.HandlerFilterFunction
import org.springframework.web.reactive.function.server.ServerRequest
import org.springframework.web.reactive.function.server.ServerResponse
import org.springframework.web.reactive.socket.HandshakeInfo


@Service
class UserAuthenticationResolver(
    val objectMapper: ObjectMapper
) {

    fun filterFunction(): HandlerFilterFunction<ServerResponse, ServerResponse> {
        return HandlerFilterFunction { request, next ->
            if (filter(request))
                next.handle(request)
            else ServerResponse
                .status(HttpStatus.UNAUTHORIZED)
                .build()
        }
    }

    private fun filter(request: ServerRequest): Boolean {
        val authorization = request.headers().firstHeader(HttpHeaders.AUTHORIZATION)
        return filter(authorization)
    }

    fun filter(authorization: String?): Boolean {
        return authorization?.isNotEmpty()
            ?: throw RuntimeException("No user present")
    }

    fun authenticate(serverRequest: ServerRequest): UserInfoDTO {
        val auth = serverRequest.headers().firstHeader(HttpHeaders.AUTHORIZATION)
        return userInfoDTO(auth)
    }

    fun authenticate(handshake: HandshakeInfo): UserInfoDTO {
        val cookies = handshake.headers.getFirst(HttpHeaders.COOKIE)
            ?.split(";")
            ?.map {
                it.split("=")
            }
            ?.associate {
                when (it.size) {
                    2 -> it[0].trim() to it[1].trim()
                    else -> "" to ""
                }
            }
        return userInfoDTO(cookies?.get("sws-usessid"))
    }

    private fun userInfoDTO(auth: String?): UserInfoDTO {
        auth ?: throw UserDomainException("Not Authenticated")
        return objectMapper.readValue(auth, UserInfoDTO::class.java)
    }

}