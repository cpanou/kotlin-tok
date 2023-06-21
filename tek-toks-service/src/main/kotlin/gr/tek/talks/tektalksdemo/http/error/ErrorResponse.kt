package gr.tek.talks.tektalksdemo.http.error

data class ErrorResponse(
    val error: String,
    val errorDescription: String,
) {
}