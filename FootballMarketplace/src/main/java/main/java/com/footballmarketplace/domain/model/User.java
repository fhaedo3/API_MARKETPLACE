package main.java.com.footballmarketplace.domain.model;

import lombok.Data;
import main.java.com.footballmarketplace.domain.enums.Role;

@Data
public class User extends Auditable {
    private String username;
    private String email;
    private String password;
    private String teamName;     
    private Integer yearFounded;
    private String stadium;      
    private String city;         

    private Role role;           
}