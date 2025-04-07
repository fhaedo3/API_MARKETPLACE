package main.java.com.footballmarketplace.domain.interfaces;

import main.java.com.footballmarketplace.domain.model.User;

import java.util.List;
import java.util.Optional;

public interface IUserRepository {
    List<User> findAll();
    Optional<User> findById(Long id);
    User save(User user);
    void deleteById(Long id);
}