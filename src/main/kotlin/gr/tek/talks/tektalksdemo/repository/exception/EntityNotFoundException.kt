package gr.tek.talks.tektalksdemo.repository.exception

import gr.tek.talks.tektalksdemo.http.error.ServiceException

class EntityNotFoundException(message: String?) : ServiceException(message), EntityException