package com.lancers.jiratypething.controller;

import com.lancers.jiratypething.model.User;
import com.lancers.jiratypething.service.AdminService;
import com.lancers.jiratypething.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private UserService userService;

    @PostMapping("/service-staff")
    public ResponseEntity<User> createServiceStaff(@RequestBody User user) {
        User createdUser = adminService.createServiceStaff(user.getUsername(), user.getEmail(), user.getPassword());
        return ResponseEntity.ok(createdUser);
    }

    @GetMapping("/service-staff/stats")
    public ResponseEntity<Map<String, Object>> getServiceStaffStats() {
        Map<String, Object> stats = adminService.getServiceStaffStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/service-staff")
    public ResponseEntity<List<User>> getAllServiceStaff() {
        List<User> serviceStaff = userService.getAllServiceStaff();
        return ResponseEntity.ok(serviceStaff);
    }

    @PutMapping("/service-staff/{staffId}")
    public ResponseEntity<User> updateServiceStaff(@PathVariable Long staffId, @RequestBody User user) {
        User updatedUser = adminService.updateServiceStaff(staffId, user);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/service-staff/{staffId}")
    public ResponseEntity<String> deleteServiceStaff(@PathVariable Long staffId) {
        adminService.deleteServiceStaff(staffId);
        return ResponseEntity.ok("Service staff deleted successfully");
    }
}