package com.ExpenseTracker.Service;

import com.ExpenseTracker.Model.Income;
import com.ExpenseTracker.Model.User;
import com.ExpenseTracker.Repository.IncomeRepository;
import com.ExpenseTracker.Repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class IncomeService {

    private final IncomeRepository repo;
    private final UserRepository userRepo;

    public IncomeService(IncomeRepository repo, UserRepository userRepo) {
        this.repo = repo;
        this.userRepo = userRepo;
    }

    // Links the incoming income data to the logged-in user
    public Income addIncome(Income income, String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        income.setUser(user); // Ownership link
        return repo.save(income);
    }

    // New Method: Fetches ONLY income entries for this specific user
    public List<Income> getAllForUser(String email) {
        return repo.findByUserEmail(email);
    }

    public void deleteIncome(Long id, String email) {
        Income income = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Income not found"));

        // Security check: Verify owner before deleting
        if (!income.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized deletion attempt");
        }
        repo.deleteById(id);
    }
}