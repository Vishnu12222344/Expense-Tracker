package com.ExpenseTracker.Repository;

import com.ExpenseTracker.Model.Income;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface IncomeRepository extends JpaRepository<Income, Long> {
    // Fetches all income for a user with dynamic sorting
    List<Income> findByUserEmail(String email, Sort sort);

    // Fetches filtered income for a user with dynamic sorting
    List<Income> findByUserEmailAndSource(String email, String source, Sort sort);

    @Query("SELECT SUM(i.amount) FROM Income i WHERE i.user.email = :email")
    Double sumIncomeByUser(@Param("email") String email);
}