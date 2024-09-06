package com.lancers.jiratypething.controller;

import com.lancers.jiratypething.model.Message;
import com.lancers.jiratypething.model.Ticket;
import com.lancers.jiratypething.model.User;
import com.lancers.jiratypething.service.MessageService;
import com.lancers.jiratypething.service.TicketService;
import com.lancers.jiratypething.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @Autowired
    private TicketService ticketService;

    @Autowired
    private UserService userService;

    private static final Logger logger = Logger.getLogger(MessageController.class.getName());

    @PostMapping("/{ticketId}")
    public ResponseEntity<Message> sendMessage(@PathVariable Long ticketId, @RequestBody Message message, HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");
        logger.info("Received sendMessage request for ticketId: " + ticketId);
        logger.info("Authorization Header: " + authorizationHeader);
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String jwt = authorizationHeader.substring(7);
            logger.info("JWT extracted: " + jwt);
            if (userService.validateToken(jwt)) {
                User user = userService.getUserFromToken(jwt);
                Ticket ticket = ticketService.getTicketById(ticketId);
                if (ticket == null) {
                    return ResponseEntity.status(404).body(null); // Ticket not found
                }
                message.setTicket(ticket);
                message.setUser(user); // Updated this line
                messageService.saveMessage(message);
                return ResponseEntity.ok(message);
            } else {
                logger.warning("Token validation failed");
            }
        }
        return ResponseEntity.status(403).build();
    }

    @GetMapping("/{ticketId}")
    public ResponseEntity<List<Message>> getMessages(@PathVariable Long ticketId, HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String jwt = authorizationHeader.substring(7);
            if (userService.validateToken(jwt)) {
                List<Message> messages = messageService.getMessagesByTicketId(ticketId);
                return ResponseEntity.ok(messages);
            }
        }
        return ResponseEntity.status(403).build();
    }
}
