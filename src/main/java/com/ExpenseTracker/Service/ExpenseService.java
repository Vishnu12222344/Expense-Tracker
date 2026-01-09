package com.ExpenseTracker.Service;

import com.ExpenseTracker.Model.Expense;
import com.ExpenseTracker.Model.User;
import com.ExpenseTracker.Repository.ExpenseRepository;
import com.ExpenseTracker.Repository.UserRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class ExpenseService {
    private final ExpenseRepository repo;
    private final UserRepository userRepo;

    public ExpenseService(ExpenseRepository repo, UserRepository userRepo) {
        this.repo = repo;
        this.userRepo = userRepo;
    }

    public Expense addExpense(Expense expense, String email) {
        // Fix: Use String.valueOf to safely handle the conversion to CharSequence
        // This prevents the "cannot be converted to CharSequence" error
        LocalDate selectedDate = LocalDate.parse(String.valueOf(expense.getExpenseDate()));
        LocalDate today = LocalDate.now();

        if (selectedDate.isAfter(today)) {
            throw new RuntimeException("Cannot add future expenses");
        }

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        expense.setUser(user);
        return repo.save(expense);
    }

    public List<Expense> getAllForUser(String email, Sort sort) {
        return repo.findByUserEmail(email, sort);
    }

    public List<Expense> getByCategoryForUser(String email, String category, Sort sort) {
        return repo.findByUserEmailAndCategory(email, category, sort);
    }

    public void deleteExpense(Long id, String email) {
        Expense expense = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        if (!expense.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized deletion attempt");
        }
        repo.deleteById(id);
    }
}