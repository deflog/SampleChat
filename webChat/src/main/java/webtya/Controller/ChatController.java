package webtya.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.web.bind.annotation.RestController;

import webtya.Form.ChatForm;

@RestController
public class ChatController {

	/**@MessageMapping(value = "/message")
	@SendTo(value="/topic/messages")
	ChatForm greet(ChatForm chatForm) {
		return chatForm;
	}**/
	@Autowired
	private SimpMessagingTemplate simpMessagingTemplate;

	@SubscribeMapping("/message/{id}")
	public void sendMessage(@DestinationVariable String id,ChatForm chatForm) {
		simpMessagingTemplate.convertAndSend("/topic/messages/" + id,chatForm);
	}

}
