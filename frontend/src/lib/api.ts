const API_BASE_URL = "http://localhost:8080";

/* ===================== TYPES ===================== */
export interface AuthResponse {
  token: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
}

export type ExpenseCategory = "PERSONAL" | "SURVIVAL" | "INVESTMENT";
export type IncomeSource = "SALARY" | "FROM_INVESTMENT" | "FROM_TRADING";

export interface Expense {
  id: number;
  description: string;
  category: ExpenseCategory;
  amount: number;
  expenseDate: string;
}

export interface Income {
  id: number;
  description: string;
  source: IncomeSource;
  amount: number;
  incomeDate: string;
}

/**
 * Matches the updated Backend PnlResponse DTO
 * that provides total income, total expense, and net pnl.
 */
export interface PnlResponse {
  totalIncome: number;
  totalExpense: number;
  pnl: number;
}

/* ===================== STORAGE MANAGEMENT ===================== */
export const getToken = () => localStorage.getItem("token");
export const setToken = (token: string) => localStorage.setItem("token", token);
export const removeToken = () => localStorage.removeItem("token");

export const getEmail = () => localStorage.getItem("email");
export const setEmail = (email: string) => localStorage.setItem("email", email);
export const removeEmail = () => localStorage.removeItem("email");

/* ===================== CORE API HELPER ===================== */
/**
 * Generic API request handler.
 * - Injects Authorization headers for protected routes.
 * - Automatically clears storage and signals redirect on 401/403 errors.
 */
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const isAuthEndpoint = endpoint.startsWith("/auth");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  // Only attach the Bearer token if it exists and we aren't at an auth endpoint.
  if (token && !isAuthEndpoint) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle unauthorized access for protected resources.
  if ((response.status === 401 || response.status === 403) && !isAuthEndpoint) {
    removeToken();
    removeEmail();
    throw new Error("UNAUTHORIZED");
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `HTTP ${response.status}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : ({} as T);
}

/* ===================== API EXPORTS ===================== */

export const authApi = {
  /**
   * Clears old session data and performs login.
   */
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    removeToken();
    removeEmail();
    const res = await apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data)
    });
    setToken(res.token);
    setEmail(res.email);
    return res;
  },

  /**
   * Clears old session data and performs signup.
   */
  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    removeToken();
    removeEmail();
    const res = await apiRequest<AuthResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(data)
    });
    setToken(res.token);
    setEmail(res.email);
    return res;
  },

  /**
   * Captures OAuth2 tokens from URL and saves them to local storage.
   */
  handleOAuthCallback: () => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const email = params.get("email");

    if (token && email) {
      setToken(token);
      setEmail(email);
      return true;
    }
    return false;
  }
};

export const expenseApi = {
  /** Retrieves all expenses for the authenticated user. */
  getAll: () => apiRequest<Expense[]>("/expenses"),

  /** Adds a new expense entry. */
  create: (data: any) => apiRequest<Expense>("/expenses", {
    method: "POST",
    body: JSON.stringify(data)
  }),

  /** Deletes a specific expense by ID. */
  delete: (id: number) => apiRequest<void>(`/expenses/${id}`, {
    method: "DELETE"
  }),
};

export const incomeApi = {
  /** Retrieves all income entries for the authenticated user. */
  getAll: () => apiRequest<Income[]>("/income"),

  /** Adds a new income entry. */
  create: (data: any) => apiRequest<Income>("/income", {
    method: "POST",
    body: JSON.stringify(data)
  }),

  /** Deletes a specific income entry by ID. */
  delete: (id: number) => apiRequest<void>(`/income/${id}`, {
    method: "DELETE"
  }),
};

export const pnlApi = {
  /** Retrieves the PnL summary for the logged-in user. */
  get: () => apiRequest<PnlResponse>("/pnl"),
};