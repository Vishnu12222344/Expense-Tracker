package com.ExpenseTracker.Service;

import com.ExpenseTracker.Model.Income;
import com.ExpenseTracker.Model.User;
import com.ExpenseTracker.Repository.IncomeRepository;
import com.ExpenseTracker.Repository.UserRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class IncomeService {
    private final IncomeRepository repo;
    private final UserRepository userRepo;

    public IncomeService(IncomeRepository repo, UserRepository userRepo) {
        this.repo = repo;
        this.userRepo = userRepo;
    }

    public Income addIncome(Income income, String email) {
        // Fix: Safely parse the date by ensuring it is treated as a String
        LocalDate selectedDate = LocalDate.parse(String.valueOf(income.getIncomeDate()));
        LocalDate today = LocalDate.now();

        if (selectedDate.isAfter(today)) {
            throw new RuntimeException("Cannot add future income");
        }

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        income.setUser(user);
        return repo.save(income);
    }

    public List<Income> getAllForUser(String email, Sort sort) {
        return repo.findByUserEmail(email, sort);
    }

    public List<Income> getBySourceForUser(String email, String source, Sort sort) {
        return repo.findByUserEmailAndSource(email, source, sort);
    }

    public void deleteIncome(Long id, String email) {
        Income income = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Income not found"));

        if (!income.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized deletion attempt");
        }
        repo.deleteById(id);
    }
}