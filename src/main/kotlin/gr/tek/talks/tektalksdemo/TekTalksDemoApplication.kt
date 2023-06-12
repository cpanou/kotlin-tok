package gr.tek.talks.tektalksdemo

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class TekTalksDemoApplication

fun main(args: Array<String>) {
    runApplication<TekTalksDemoApplication>(*args)
}
