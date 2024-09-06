package com.lancers.jiratypething.repository;

import com.lancers.jiratypething.model.Ticket;
import com.lancers.jiratypething.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByUser(User user);
    Long countByStatus(String status);
    List<Ticket> findByStatus(String status);
    Long countByStatusAndUser(String status, User user);
}