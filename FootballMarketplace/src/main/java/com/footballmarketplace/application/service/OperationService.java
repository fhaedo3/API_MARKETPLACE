package com.footballmarketplace.application.service;

import com.footballmarketplace.domain.interfaces.IOperationRepository;
import com.footballmarketplace.domain.model.Operation;
import com.footballmarketplace.domain.model.Transaction;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OperationService {

    private final IOperationRepository operationRepository;

    public OperationService(IOperationRepository operationRepository) {
        this.operationRepository = operationRepository;
    }

    public List<Operation> getAllOperations() {
        return operationRepository.findAll();
    }

    public Optional<Operation> getOperationById(Long id) {
        return operationRepository.findById(id);
    }

    public Operation addOperation(Operation operation) {
        return operationRepository.save(operation);
    }

    public void deleteOperation(Long id) {
        operationRepository.deleteById(id);
    }

    public List<Transaction> getOperationTransactions(Long operationId) {
        Optional<Operation> operationOpt = operationRepository.findById(operationId);
        if (operationOpt.isPresent()) {
            return operationOpt.get().getTransactions();
        }
        return List.of();
    }
}