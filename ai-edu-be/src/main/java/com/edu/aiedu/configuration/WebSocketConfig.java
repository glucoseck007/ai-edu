package com.edu.aiedu.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {
    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(new ChatbotWebSocketHandler(), "/process_audio_ws")
                .setAllowedOrigins("http://localhost:5173").withSockJS();
    }

    private static class ChatbotWebSocketHandler extends TextWebSocketHandler {

        @Override
        public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {
            // Assuming audio data is sent as a binary message
            byte[] audioData = (byte[]) message.getPayload();

            // Process the audio (e.g., transcribe it or send to AI service)
            String botResponse = processAudioMessage(audioData);

            // Send back the response
            session.sendMessage(new TextMessage(botResponse));
        }

        private String processAudioMessage(byte[] audioData) {
            // Simulate processing the audio (e.g., speech-to-text)
            return "Audio processed, how can I assist further?";
        }
    }
}
