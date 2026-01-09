import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useIncome, useCreateIncome, useDeleteIncome } from "@/hooks/useIncome";
import { IncomeSource } from "@/lib/api";
import { Trash2, Plus, TrendingUp, Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const INCOME_SOURCE_OPTIONS: { value: IncomeSource; label: string }[] = [
  { value: "SALARY", label: "Salary" },
  { value: "FROM_INVESTMENT", label: "From Investment" },
  { value: "FROM_TRADING", label: "From Trading" },
];

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

export default function Income() {
  const { data: income, isLoading } = useIncome();
  const createIncome = useCreateIncome();
  const deleteIncome = useDeleteIncome();

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState<IncomeSource | "">("");
  const [incomeDate, setIncomeDate] = useState(new Date().toISOString().split("T")[0]);
  const [filterSource, setFilterSource] = useState<string>("all");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !source) return;

    await createIncome.mutateAsync({
      description,
      amount: parseFloat(amount),
      source: source as IncomeSource,
      incomeDate,
    });

    setDescription("");
    setAmount("");
    setSource("");
    setIncomeDate(new Date().toISOString().split("T")[0]);
  };

  const filteredIncome = income?.filter((inc) => 
    filterSource === "all" || inc.source === filterSource
  ) || [];

  const totalFiltered = filteredIncome.reduce((sum, inc) => sum + inc.amount, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Income</h1>
          <p className="text-muted-foreground">Manage your income sources</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Add Income Form */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="e.g., Monthly salary"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="source">Source</Label>
                  <Select value={source} onValueChange={(val) => setSource(val as IncomeSource)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      {INCOME_SOURCE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={incomeDate}
                    onChange={(e) => setIncomeDate(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={createIncome.isPending}>
                  {createIncome.isPending ? "Adding..." : "Add Income"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Income List */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-success" />
                Income History
              </CardTitle>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={filterSource} onValueChange={setFilterSource}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    {INCOME_SOURCE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : filteredIncome.length > 0 ? (
                <>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Description</TableHead>
                          <TableHead>Source</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredIncome.map((inc) => (
                          <TableRow key={inc.id}>
                            <TableCell className="font-medium">{inc.description}</TableCell>
                            <TableCell>
                              <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-success/10 text-success">
                                {INCOME_SOURCE_LABELS[inc.source]}
                              </span>
                            </TableCell>
                            <TableCell>{new Date(inc.incomeDate).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right font-semibold text-success">
                              +{formatCurrency(inc.amount)}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteIncome.mutate(inc.id)}
                                disabled={deleteIncome.isPending}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <div className="text-sm text-muted-foreground">
                      Total: <span className="font-semibold text-success">{formatCurrency(totalFiltered)}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-32 flex items-center justify-center text-muted-foreground">
                  No income entries yet
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
