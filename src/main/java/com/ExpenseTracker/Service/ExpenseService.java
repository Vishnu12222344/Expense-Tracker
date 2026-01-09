package com.ExpenseTracker.Service;

import com.ExpenseTracker.Model.Expense;
import com.ExpenseTracker.Model.User;
import com.ExpenseTracker.Repository.ExpenseRepository;
import com.ExpenseTracker.Repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ExpenseService {

    private final ExpenseRepository repo;
    private final UserRepository userRepo; // Required to find the owner

    public ExpenseService(ExpenseRepository repo, UserRepository userRepo) {
        this.repo = repo;
        this.userRepo = userRepo;
    }

    // Updated: Automatically links the expense to the logged-in user
    public Expense addExpense(Expense expense, String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        expense.setUser(user); // Ownership link
        return repo.save(expense);
    }

    // New Method: Fetches ONLY expenses belonging to this email
    public List<Expense> getAllForUser(String email) {
        return repo.findByUserEmail(email);
    }

    public void deleteExpense(Long id, String email) {
        Expense expense = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        // Security check: Verify owner before deleting
        if (!expense.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized deletion attempt");
        }
        repo.deleteById(id);
    }
}