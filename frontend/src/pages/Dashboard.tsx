import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePnl } from "@/hooks/usePnl";
import { useExpenses } from "@/hooks/useExpenses";
import { useIncome } from "@/hooks/useIncome";
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

const EXPENSE_COLORS = ["hsl(221, 83%, 53%)", "hsl(142, 76%, 36%)", "hsl(38, 92%, 50%)"];
const INCOME_COLORS = ["hsl(280, 65%, 60%)", "hsl(340, 75%, 55%)", "hsl(190, 80%, 45%)"];

const EXPENSE_CATEGORY_LABELS: Record<string, string> = {
  PERSONAL: "Personal",
  SURVIVAL: "Survival",
  INVESTMENT: "Investment",
};

const INCOME_SOURCE_LABELS: Record<string, string> = {
  SALARY: "Salary",
  FROM_INVESTMENT: "From Investment",
  FROM_TRADING: "From Trading",
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export default function Dashboard() {
  const { data: pnl, isLoading: pnlLoading } = usePnl();
  const { data: expenses, isLoading: expensesLoading } = useExpenses();
  const { data: income, isLoading: incomeLoading } = useIncome();

  // Calculate expense breakdown by category
  const expenseByCategory = expenses?.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>) || {};

  const expenseChartData = Object.entries(expenseByCategory).map(([name, value]) => ({
    name: EXPENSE_CATEGORY_LABELS[name] || name,
    value,
  }));

  // Calculate income breakdown by source
  const incomeBySource = income?.reduce((acc, inc) => {
    acc[inc.source] = (acc[inc.source] || 0) + inc.amount;
    return acc;
  }, {} as Record<string, number>) || {};

  const incomeChartData = Object.entries(incomeBySource).map(([name, value]) => ({
    name: INCOME_SOURCE_LABELS[name] || name,
    value,
  }));

  const recentTransactions = [
    ...(expenses?.slice(-5).map((e) => ({
      type: "expense" as const,
      description: e.description,
      amount: e.amount,
      date: e.expenseDate,
      category: EXPENSE_CATEGORY_LABELS[e.category],
    })) || []),
    ...(income?.slice(-5).map((i) => ({
      type: "income" as const,
      description: i.description,
      amount: i.amount,
      date: i.incomeDate,
      category: INCOME_SOURCE_LABELS[i.source],
    })) || []),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8);

  const isProfitable = (pnl?.pnl ?? 0) >= 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Your financial overview at a glance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* PnL Card */}
          <Card className={isProfitable ? "border-success/50" : "border-destructive/50"}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Profit/Loss</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {pnlLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="flex items-center gap-2">
                  <div className={`text-2xl font-bold ${isProfitable ? "text-success" : "text-destructive"}`}>
                    {formatCurrency(pnl?.pnl ?? 0)}
                  </div>
                  {isProfitable ? (
                    <ArrowUpRight className="h-4 w-4 text-success" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-destructive" />
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Total Income Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              {pnlLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-2xl font-bold text-success">
                  {formatCurrency(pnl?.totalIncome ?? 0)}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                {income?.length ?? 0} transactions
              </p>
            </CardContent>
          </Card>

          {/* Total Expenses Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              {pnlLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-2xl font-bold text-destructive">
                  {formatCurrency(pnl?.totalExpense ?? 0)}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                {expenses?.length ?? 0} transactions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Expenses by Category */}
          <Card>
            <CardHeader>
              <CardTitle>Expenses by Category</CardTitle>
            </CardHeader>
            <CardContent>
              {expensesLoading ? (
                <Skeleton className="h-[250px] w-full" />
              ) : expenseChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={expenseChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {expenseChartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                  No expense data yet
                </div>
              )}
            </CardContent>
          </Card>

          {/* Income by Source */}
          <Card>
            <CardHeader>
              <CardTitle>Income by Source</CardTitle>
            </CardHeader>
            <CardContent>
              {incomeLoading ? (
                <Skeleton className="h-[250px] w-full" />
              ) : incomeChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={incomeChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {incomeChartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={INCOME_COLORS[index % INCOME_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                  No income data yet
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {(expensesLoading || incomeLoading) ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : recentTransactions.length > 0 ? (
              <div className="space-y-3">
                {recentTransactions.map((transaction, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${transaction.type === "income" ? "bg-success/10" : "bg-destructive/10"}`}>
                        {transaction.type === "income" ? (
                          <TrendingUp className="h-4 w-4 text-success" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-destructive" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className={`font-semibold ${transaction.type === "income" ? "text-success" : "text-destructive"}`}>
                      {transaction.type === "income" ? "+" : "-"}{formatCurrency(transaction.amount)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-32 flex items-center justify-center text-muted-foreground">
                No transactions yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
