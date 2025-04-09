package com.footballmarketplace.domain.interfaces;

import com.footballmarketplace.domain.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IUserRepository extends JpaRepository<User, Long> {
}
