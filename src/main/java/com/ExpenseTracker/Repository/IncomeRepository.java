package com.ExpenseTracker.Repository;

import com.ExpenseTracker.Model.Income;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface IncomeRepository extends JpaRepository<Income, Long> {

    // Finds all income records belonging only to the user with this email
    List<Income> findByUserEmail(String email);

    // Sums only the income for a specific user to fix the Dashboard issue
    @Query("SELECT SUM(i.amount) FROM Income i WHERE i.user.email = :email")
    Double sumIncomeByUser(@Param("email") String email);

    // Legacy global sum (remove or keep for admin use)
    @Query("SELECT SUM(i.amount) FROM Income i")
    Double sumIncome();
}