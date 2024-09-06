package com.lancers.jiratypething.controller;

import com.lancers.jiratypething.model.Ticket;
import com.lancers.jiratypething.model.User;
import com.lancers.jiratypething.service.TicketService;
import com.lancers.jiratypething.service.UserService;
import com.lancers.jiratypething.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:63342")
@RequestMapping("/api/tickets")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<Ticket> createTicket(
            @RequestParam("subject") String subject,
            @RequestParam("description") String description,
            @RequestParam("priority") String priority,
            @RequestParam(value = "file", required = false) MultipartFile file,
            HttpServletRequest request) {
        try {
            Ticket createdTicket = ticketService.createTicket(subject, description, priority, file, request);
            if (createdTicket != null) {
                return ResponseEntity.ok(createdTicket);
            }
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
        return ResponseEntity.status(403).build();
    }

    @GetMapping("/counts")
    public ResponseEntity<Map<String, Long>> getTicketCounts(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String jwt = authorizationHeader.substring(7);
            if (ticketService.validateToken(jwt)) {
                String username = jwtUtil.extractUsername(jwt);
                String userType = userService.getUserType(username);
                User user = userService.getUserByUsername(username);

                if ("service_staff".equals(userType)) {
                    Map<String, Long> counts = ticketService.getTicketCounts();
                    return ResponseEntity.ok(counts);
                } else if ("client".equals(userType)) {
                    Map<String, Long> counts = ticketService.getUserTicketCounts(user);
                    return ResponseEntity.ok(counts);
                }
            }
        }
        return ResponseEntity.status(403).build();
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Ticket>> getTicketsByStatus(@PathVariable String status, HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String jwt = authorizationHeader.substring(7);
            if (ticketService.validateToken(jwt)) {
                List<Ticket> tickets = ticketService.getTicketsByStatus(status);
                return ResponseEntity.ok(tickets);
            }
        }
        return ResponseEntity.status(403).build();
    }

    @PutMapping("/{ticketId}")
    public ResponseEntity<Ticket> updateTicket(
            @PathVariable Long ticketId,
            @RequestParam("subject") String subject,
            @RequestParam("description") String description,
            @RequestParam("priority") String priority,
            HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String jwt = authorizationHeader.substring(7);
            if (ticketService.validateToken(jwt)) {
                Ticket updatedTicket = ticketService.updateTicket(ticketId, subject, description, priority);
                if (updatedTicket != null) {
                    return ResponseEntity.ok(updatedTicket);
                }
            }
        }
        return ResponseEntity.status(403).build();
    }

    @GetMapping("/usertype")
    public ResponseEntity<String> getUserType(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String jwt = authorizationHeader.substring(7);
            String username = jwtUtil.extractUsername(jwt);
            if (ticketService.validateToken(jwt)) {
                String userType = userService.getUserType(username);
                return ResponseEntity.ok(userType);
            }
        }
        return ResponseEntity.status(403).build();
    }

    @PutMapping("/{ticketId}/respond")
    public ResponseEntity<?> respondToTicket(@PathVariable Long ticketId, @RequestBody Map<String, String> responseMap, HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String jwt = authorizationHeader.substring(7);
            if (ticketService.validateToken(jwt)) {
                String response = responseMap.get("response");
                if (response == null || response.isEmpty()) {
                    return ResponseEntity.badRequest().body("Response cannot be empty");
                }

                Ticket updatedTicket = ticketService.respondToTicket(ticketId, response);
                if (updatedTicket != null) {
                    return ResponseEntity.ok(updatedTicket);
                } else {
                    return ResponseEntity.status(404).body("Ticket not found");
                }
            }
        }
        return ResponseEntity.status(403).build();
    }


    @GetMapping("/user")
    public ResponseEntity<List<Ticket>> getTicketsByUser(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String jwt = authorizationHeader.substring(7);
            if (ticketService.validateToken(jwt)) {
                List<Ticket> tickets = ticketService.getTicketsByUser(request);
                return ResponseEntity.ok(tickets);
            }
        }
        return ResponseEntity.status(403).build();
    }

    @GetMapping
    public ResponseEntity<List<Ticket>> getAllTickets(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String jwt = authorizationHeader.substring(7);
            if (ticketService.validateToken(jwt)) {
                List<Ticket> tickets = ticketService.getAllTickets();
                return ResponseEntity.ok(tickets);
            }
        }
        return ResponseEntity.status(403).build();
    }

    @GetMapping("/user-tickets")
    public ResponseEntity<List<Ticket>> getUserTickets(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String jwt = authorizationHeader.substring(7);
            if (ticketService.validateToken(jwt)) {
                List<Ticket> tickets = ticketService.getTicketsByUser(request);
                return ResponseEntity.ok(tickets);
            }
        }
        return ResponseEntity.status(403).build();
    }

    @PutMapping("/{ticketId}/priority")
    public ResponseEntity<?> updateTicketPriority(@PathVariable Long ticketId, @RequestBody Map<String, String> request) {
        String priority = request.get("priority");
        Ticket updatedTicket = ticketService.updateTicketPriority(ticketId, priority);
        if (updatedTicket != null) {
            return ResponseEntity.ok(updatedTicket);
        }
        return ResponseEntity.status(400).body("Invalid priority");
    }

    @PutMapping("/{ticketId}/status")
    public ResponseEntity<?> updateTicketStatus(@PathVariable Long ticketId, @RequestBody Map<String, String> request) {
        String status = request.get("status");
        Ticket updatedTicket = ticketService.updateTicketStatus(ticketId, status);
        if (updatedTicket != null) {
            return ResponseEntity.ok(updatedTicket);
        }
        return ResponseEntity.status(400).body("Invalid status");
    }
}