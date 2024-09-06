package com.lancers.jiratypething.repository;

import com.lancers.jiratypething.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
    List<User> findByUserType(String userType);

    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.user.id = :userId")
    Long countTicketsByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.user.id = :userId AND t.status = :status")
    Long countTicketsByStatusAndUserId(@Param("status") String status, @Param("userId") Long userId);
}