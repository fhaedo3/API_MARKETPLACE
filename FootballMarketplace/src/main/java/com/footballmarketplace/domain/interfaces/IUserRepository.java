package com.footballmarketplace.domain.interfaces;

import java.util.Optional;
import com.footballmarketplace.domain.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

public interface IUserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String mail);
}
