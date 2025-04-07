package main.java.com.footballmarketplace.api.controller;

import main.java.com.footballmarketplace.application.dto.TransactionRequest;
import main.java.com.footballmarketplace.application.service.TransactionService;
import main.java.com.footballmarketplace.domain.model.Transaction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @GetMapping
    public ResponseEntity<List<Transaction>> listTransactions() {
        List<Transaction> transactions = transactionService.getAllTransactions();
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/{transactionId}")
    public ResponseEntity<Transaction> getTransactionById(@PathVariable Long transactionId) {
        return transactionService.getTransactionById(transactionId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Transaction> addTransaction(@RequestBody TransactionRequest transactionRequest) {
        Transaction transaction = new Transaction();
        transaction.setBuyerId(transactionRequest.getBuyerId());
        transaction.setSellerId(transactionRequest.getSellerId());
        transaction.setPlayerId(transactionRequest.getPlayerId());
        transaction.setOperationId(transactionRequest.getOperationId());
        transaction.setTotal(transactionRequest.getTotal());

        Transaction savedTransaction = transactionService.addTransaction(transaction);
        return ResponseEntity.created(URI.create("/transactions/" + savedTransaction.getId())).body(savedTransaction);
    }

    @DeleteMapping("/{transactionId}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long transactionId) {
        transactionService.deleteTransaction(transactionId);
        return ResponseEntity.noContent().build();
    }
}