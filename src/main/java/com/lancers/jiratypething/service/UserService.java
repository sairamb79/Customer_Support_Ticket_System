package com.lancers.jiratypething.service;

import com.lancers.jiratypething.model.User;
import com.lancers.jiratypething.repository.UserRepository;
import com.lancers.jiratypething.security.JwtTokenProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    public User registerUser(String username, String email, String password) {
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(bCryptPasswordEncoder.encode(password));
        user.setUserType("client"); // Set user type to client
        return userRepository.save(user);
    }

    public User authenticateUser(String username, String password) throws Exception {
        User user = userRepository.findByUsername(username);

//        System.out.println("username: ");
//        System.out.println(username);
//        System.out.println("password: ");
//        System.out.println(password);
//        System.out.println("Hashed password: ");
//        System.out.println(bCryptPasswordEncoder.encode(password));

        if (user != null && bCryptPasswordEncoder.matches(password, user.getPassword())) {
            return user;
        } else {
            throw new Exception("Invalid username or password");
        }
    }

    public String getUserType(String username) {
        User user = userRepository.findByUsername(username);
        return user != null ? user.getUserType() : null;
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public List<User> getAllServiceStaff() {
        return userRepository.findByUserType("service_staff");
    }

    public boolean validateToken(String token) {
        boolean isValid = jwtTokenProvider.validateToken(token);
        logger.info("Token validation result: " + isValid);
        return isValid;
    }

    public User getUserFromToken(String token) {
        String username = jwtTokenProvider.getUsernameFromToken(token);
        logger.info("User from token: " + username);
        return userRepository.findByUsername(username);
    }
}
