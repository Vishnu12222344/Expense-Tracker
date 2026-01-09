package com.ExpenseTracker.Service;

import com.ExpenseTracker.Repository.ExpenseRepository;
import com.ExpenseTracker.Repository.IncomeRepository;
import com.ExpenseTracker.dto.PnlResponse;
import org.springframework.stereotype.Service;

@Service
public class PnlService {
    private final IncomeRepository incomeRepo;
    private final ExpenseRepository expenseRepo;

    public PnlService(IncomeRepository incomeRepo, ExpenseRepository expenseRepo) {
        this.incomeRepo = incomeRepo;
        this.expenseRepo = expenseRepo;
    }

    public PnlResponse calculatePnLMetrics(String email) {
        Double totalIncome = incomeRepo.sumIncomeByUser(email);
        Double totalExpense = expenseRepo.sumExpenseByUser(email);

        totalIncome = (totalIncome != null) ? totalIncome : 0.0;
        totalExpense = (totalExpense != null) ? totalExpense : 0.0;

        return new PnlResponse(totalIncome, totalExpense, totalIncome - totalExpense);
    }
}