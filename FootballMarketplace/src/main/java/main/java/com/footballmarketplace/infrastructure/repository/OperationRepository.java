package main.java.com.footballmarketplace.infrastructure.repository;

import main.java.com.footballmarketplace.domain.interfaces.IOperationRepository;
import main.java.com.footballmarketplace.domain.model.Operation;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class OperationRepository implements IOperationRepository {

    private final List<Operation> operations = new ArrayList<>();
    private final AtomicLong idGenerator = new AtomicLong(1);

    @Override
    public List<Operation> findAll() {
        return new ArrayList<>(operations);
    }

    @Override
    public Optional<Operation> findById(Long id) {
        return operations.stream().filter(op -> op.getId().equals(id)).findFirst();
    }

    @Override
    public Operation save(Operation operation) {
        if (operation.getId() == null) {
            operation.setId(idGenerator.getAndIncrement());
            operation.setTimestamp(LocalDateTime.now());
            operations.add(operation);
        } else {
            operations.removeIf(op -> op.getId().equals(operation.getId()));
            operations.add(operation);
        }
        return operation;
    }

    @Override
    public void deleteById(Long id) {
        operations.removeIf(op -> op.getId().equals(id));
    }
}