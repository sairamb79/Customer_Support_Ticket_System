package com.lancers.jiratypething.service;

import com.lancers.jiratypething.model.Ticket;
import com.lancers.jiratypething.model.User;
import com.lancers.jiratypething.repository.TicketRepository;
import com.lancers.jiratypething.repository.UserRepository;
import com.lancers.jiratypething.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private NotificationService notificationService;

    public Ticket createTicket(String subject, String description, String priority, MultipartFile file, HttpServletRequest request) throws IOException {
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String jwt = authorizationHeader.substring(7);
            String username = jwtUtil.extractUsername(jwt);
            User user = userRepository.findByUsername(username);
            if (user != null) {
                Ticket ticket = new Ticket();
                ticket.setUser(user);
                ticket.setSubject(subject);
                ticket.setDescription(description);
                ticket.setPriority(priority);
                ticket.setStatus("Open");  // Default status
                ticket.setCreatedAt(LocalDateTime.now());
                ticket.setLastUpdated(LocalDateTime.now());
                if (file != null && !file.isEmpty()) {
                    ticket.setImage(file.getBytes());
                }
                return ticketRepository.save(ticket);
            }
        }
        return null;
    }

    public boolean validateToken(String jwt) {
        String username = jwtUtil.extractUsername(jwt);
        return username != null && jwtUtil.validateToken(jwt, username);
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public Ticket updateTicket(Long ticketId, String subject, String description, String priority, MultipartFile file) throws IOException {
        Ticket ticket = ticketRepository.findById(ticketId).orElse(null);
        if (ticket != null) {
            ticket.setSubject(subject);
            ticket.setDescription(description);
            ticket.setPriority(priority);
            ticket.setLastUpdated(LocalDateTime.now());
            if (file != null && !file.isEmpty()) {
                ticket.setImage(file.getBytes());
            }
            return ticketRepository.save(ticket);
        }
        return null;
    }

    public boolean deleteTicket(Long ticketId) {
        if (ticketRepository.existsById(ticketId)) {
            ticketRepository.deleteById(ticketId);
            return true;
        }
        return false;
    }

    public String getTicketStatus(Long ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId).orElse(null);
        if (ticket != null) {
            return ticket.getStatus();
        }
        return null;
    }

    public Map<String, Long> getTicketCounts() {
        Map<String, Long> counts = new HashMap<>();
        counts.put("open", ticketRepository.countByStatus("Open"));
        counts.put("closed", ticketRepository.countByStatus("Closed"));
        counts.put("escalated", ticketRepository.countByStatus("Escalated"));
        counts.put("total", ticketRepository.count());
        return counts;
    }

    public List<Ticket> getTicketsByStatus(String status) {
        return ticketRepository.findByStatus(status);
    }

    public Ticket updateTicket(Long ticketId, String subject, String description, String priority) {
        Ticket ticket = ticketRepository.findById(ticketId).orElse(null);
        if (ticket != null) {
            ticket.setSubject(subject);
            ticket.setDescription(description);
            ticket.setPriority(priority);
            ticket.setLastUpdated(LocalDateTime.now());
            return ticketRepository.save(ticket);
        }
        return null;
    }

    public String getUserType(String username) {
        User user = userRepository.findByUsername(username);
        return user != null ? user.getUserType() : null;
    }

    public List<Ticket> getTicketsByUser(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String jwt = authorizationHeader.substring(7);
            String username = jwtUtil.extractUsername(jwt);
            User user = userRepository.findByUsername(username);
            if (user != null) {
                return ticketRepository.findByUser(user);
            }
        }
        return null;
    }

    public Ticket respondToTicket(Long ticketId, String response) {
        Ticket ticket = ticketRepository.findById(ticketId).orElse(null);
        if (ticket != null) {
            ticket.setResponse(response);
            ticket.setStatus("Closed"); // Mark the ticket as closed
            ticket.setLastUpdated(LocalDateTime.now());
            notificationService.createNotification(ticket.getUser().getId(), "Your ticket has been responded to.");
            return ticketRepository.save(ticket);
        }
        return null;
    }

    public Map<String, Long> getUserTicketCounts(User user) {
        Map<String, Long> counts = new HashMap<>();
        counts.put("open", ticketRepository.countByStatusAndUser("Open", user));
        counts.put("closed", ticketRepository.countByStatusAndUser("Closed", user));
        counts.put("escalated", ticketRepository.countByStatusAndUser("Escalated", user));
        counts.put("total", (long) ticketRepository.findByUser(user).size());
        return counts;
    }

    public Ticket updateTicketPriority(Long ticketId, String priority) {
        Ticket ticket = ticketRepository.findById(ticketId).orElse(null);
        if (ticket != null && (priority.equalsIgnoreCase("low") || priority.equalsIgnoreCase("medium") || priority.equalsIgnoreCase("high"))) {
            ticket.setPriority(priority);
            notificationService.createNotification(ticket.getUser().getId(), "Your ticket priority has been updated.");
            return ticketRepository.save(ticket);
        }
        return null;
    }

    public Ticket updateTicketStatus(Long ticketId, String status) {
        Ticket ticket = ticketRepository.findById(ticketId).orElse(null);
        if (ticket != null && (status.equalsIgnoreCase("open") || status.equalsIgnoreCase("closed") || status.equalsIgnoreCase("pending") || status.equalsIgnoreCase("escalated"))) {
            ticket.setStatus(status);
            notificationService.createNotification(ticket.getUser().getId(), "Your ticket status has been updated.");
            return ticketRepository.save(ticket);
        }
        return null;
    }

    public Ticket getTicketById(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found with id: " + id));
    }
}