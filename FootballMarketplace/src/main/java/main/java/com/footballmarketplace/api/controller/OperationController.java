package main.java.com.footballmarketplace.api.controller;

import main.java.com.footballmarketplace.application.dto.OperationRequest;
import main.java.com.footballmarketplace.application.service.OperationService;
import main.java.com.footballmarketplace.domain.model.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/operations")
public class OperationController {

    @Autowired
    private OperationService operationService;

    @GetMapping
    public ResponseEntity<List<Operation>> listOperations() {
        List<Operation> operations = operationService.getAllOperations();
        return ResponseEntity.ok(operations);
    }

    @GetMapping("/{operationId}")
    public ResponseEntity<Operation> getOperationById(@PathVariable Long operationId) {
        return operationService.getOperationById(operationId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Operation> addOperation(@RequestBody OperationRequest operationRequest) {
        Operation operation = new Operation();
        operation.setDescription(operationRequest.getDescription());

        Operation savedOperation = operationService.addOperation(operation);
        return ResponseEntity.created(URI.create("/operations/" + savedOperation.getId())).body(savedOperation);
    }

    @DeleteMapping("/{operationId}")
    public ResponseEntity<Void> deleteOperation(@PathVariable Long operationId) {
        operationService.deleteOperation(operationId);
        return ResponseEntity.noContent().build();
    }
}