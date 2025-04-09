package com.footballmarketplace.domain.interfaces;

import com.footballmarketplace.domain.model.Operation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IOperationRepository extends JpaRepository<Operation, Long> {
}