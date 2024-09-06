package com.lancers.jiratypething.service;

import com.lancers.jiratypething.model.Message;
import com.lancers.jiratypething.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private NotificationService notificationService;

    public List<Message> getMessagesByTicketId(Long ticketId) {
        return messageRepository.findByTicketId(ticketId);
    }

    public Message saveMessage(Message message) {
        notificationService.createNotification(message.getUser().getId(), "You have a new message on your ticket.");
        return messageRepository.save(message);
    }
}
