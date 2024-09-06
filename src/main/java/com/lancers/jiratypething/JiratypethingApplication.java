package com.lancers.jiratypething;

import com.lancers.jiratypething.model.User;
import com.lancers.jiratypething.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = { "com.lancers.jiratypething" })
@EntityScan(basePackages = "com.lancers.jiratypething.model")
@EnableJpaRepositories(basePackages = "com.lancers.jiratypething.repository")
public class JiratypethingApplication {

	public static void main(String[] args) {
		SpringApplication.run(JiratypethingApplication.class, args);
	}
}
 // LYb7F0QM9E1/xdMJZHL6yXWYbHjZG2Yf6Wj0Petd/Rc=