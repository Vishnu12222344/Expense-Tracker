package com.ExpenseTracker.Repository;

import com.ExpenseTracker.Model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    // Finds all expenses for a specific user
    List<Expense> findByUserEmail(String email);

    // Sums only the expenses for a specific user
    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.user.email = :email")
    Double sumExpenseByUser(@Param("email") String email);
}