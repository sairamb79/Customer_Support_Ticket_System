package com.lancers.jiratypething.service;

import com.lancers.jiratypething.model.User;
import com.lancers.jiratypething.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    public User createServiceStaff(String username, String email, String password) {
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(bCryptPasswordEncoder.encode(password));
        user.setUserType("service_staff"); // Set user type to service staff
        return userRepository.save(user);
    }

    public Map<String, Object> getServiceStaffStats() {
        Map<String, Object> stats = new HashMap<>();
        List<User> serviceStaff = userRepository.findByUserType("service_staff");

        for (User staff : serviceStaff) {
            Map<String, Long> staffStats = new HashMap<>();
            staffStats.put("totalTickets", userRepository.countTicketsByUserId(staff.getId()));
            staffStats.put("openTickets", userRepository.countTicketsByStatusAndUserId("Open", staff.getId()));
            staffStats.put("closedTickets", userRepository.countTicketsByStatusAndUserId("Closed", staff.getId()));
            stats.put(staff.getUsername(), staffStats);
        }

        return stats;
    }

    public User getServiceStaffById(Long staffId) {
        return userRepository.findById(staffId).orElseThrow(() -> new RuntimeException("Service staff not found"));
    }

    public User updateServiceStaff(Long staffId, User user) {
        User existingUser = userRepository.findById(staffId).orElseThrow(() -> new RuntimeException("Service staff not found"));
        existingUser.setUsername(user.getUsername());
        existingUser.setEmail(user.getEmail());
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            existingUser.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        }
        return userRepository.save(existingUser);
    }

    public void deleteServiceStaff(Long staffId) {
        userRepository.deleteById(staffId);
    }
}