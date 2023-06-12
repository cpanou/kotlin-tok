package gr.tek.talks.tektalksdemo.domain.exception

import gr.tek.talks.tektalksdemo.http.error.ServiceException

class UserDomainException(message: String?) : ServiceException(message) {
}