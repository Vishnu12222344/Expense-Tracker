package com.ExpenseTracker.Repository;

import com.ExpenseTracker.Model.Expense;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    // Fetches all expenses for a user with dynamic sorting
    List<Expense> findByUserEmail(String email, Sort sort);

    // Fetches filtered expenses for a user with dynamic sorting
    List<Expense> findByUserEmailAndCategory(String email, String category, Sort sort);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.user.email = :email")
    Double sumExpenseByUser(@Param("email") String email);
}