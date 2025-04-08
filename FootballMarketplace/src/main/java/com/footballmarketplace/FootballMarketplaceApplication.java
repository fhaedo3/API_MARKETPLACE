package com.footballmarketplace;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(
    exclude = {DataSourceAutoConfiguration.class},
    scanBasePackages = "com.footballmarketplace"
)
public class FootballMarketplaceApplication {

    public static void main(String[] args) {
        SpringApplication.run(FootballMarketplaceApplication.class, args);
    }
}
