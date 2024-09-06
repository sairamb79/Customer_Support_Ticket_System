package com.lancers.jiratypething.controller;

import com.lancers.jiratypething.model.AuthenticationRequest;
import com.lancers.jiratypething.model.AuthenticationResponse;
import com.lancers.jiratypething.model.User;
import com.lancers.jiratypething.security.JwtUtil;
import com.lancers.jiratypething.service.BlacklistService;
import com.lancers.jiratypething.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        User registeredUser = userService.registerUser(user.getUsername(), user.getEmail(), user.getPassword());
        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody AuthenticationRequest authenticationRequest) throws Exception {
        User user = userService.authenticateUser(authenticationRequest.getUsername(), authenticationRequest.getPassword());
        String jwt = jwtUtil.generateToken(user.getUsername(), user.getUserType());
        return ResponseEntity.ok(new AuthenticationResponse(jwt, user.getUserType()));
    }

    @Autowired
    private BlacklistService blacklistService;

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String jwt = authorizationHeader.substring(7);
            blacklistService.blacklistToken(jwt);
        }

        return ResponseEntity.ok("Logged out successfully");
    }
}