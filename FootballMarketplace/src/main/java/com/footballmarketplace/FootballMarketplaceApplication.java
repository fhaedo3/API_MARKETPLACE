package com.footballmarketplace;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.footballmarketplace")
public class FootballMarketplaceApplication {

    public static void main(String[] args) {
        SpringApplication.run(FootballMarketplaceApplication.class, args);
    }
}
