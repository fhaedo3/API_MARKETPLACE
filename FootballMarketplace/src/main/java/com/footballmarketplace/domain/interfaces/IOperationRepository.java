package com.footballmarketplace.domain.interfaces;

import com.footballmarketplace.domain.model.Operation;

import java.util.List;
import java.util.Optional;

public interface IOperationRepository {
    List<Operation> findAll();
    Optional<Operation> findById(Long id);
    Operation save(Operation operation);
    void deleteById(Long id);
}