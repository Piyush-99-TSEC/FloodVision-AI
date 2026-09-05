const DEFAULT_PRIMARY = "http://localhost:5000/api/v1";

const API_BASE_URL = import.meta.env.VITE_API_URL || DEFAULT_PRIMARY;

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem("floodvision_token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Try primary target (e.g. localhost) first
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || `HTTP error ${response.status}`);
    }

    return data;
  } catch (error: any) {
    // If primary failed due to network/hostname resolution, attempt 127.0.0.1 fallback
    if (error.name === "TypeError" || error.message.includes("fetch")) {
      try {
        const fallbackUrl = API_BASE_URL.replace("localhost", "127.0.0.1");
        const response = await fetch(`${fallbackUrl}${endpoint}`, {
          ...options,
          headers,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || data.error || `HTTP error ${response.status}`);
        }

        return data;
      } catch (fallbackErr: any) {
        throw new Error("Unable to connect to FloodVisionAI backend server at http://localhost:5000. Ensure backend server is running.");
      }
    }

    throw new Error(error.message || "Request failed.");
  }
}

export const authApi = {
  login: (email: string, password: string) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (name: string, email: string, password: string, role: string = "viewer") =>
    apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, role }),
    }),

  getMe: () => apiRequest("/auth/me", { method: "GET" }),
};

export const casesApi = {
  getCases: () => apiRequest("/cases", { method: "GET" }),

  getDashboardSummary: () => apiRequest("/cases/summary/stats", { method: "GET" }),

  getCaseById: (id: string) => apiRequest(`/cases/${id}`, { method: "GET" }),

  createCase: (data: {
    title: string;
    description: string;
    location: { name: string; latitude: number; longitude: number };
    eventDate?: string;
  }) =>
    apiRequest("/cases", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

export const reportsApi = {
  getReports: () => apiRequest("/reports", { method: "GET" }),

  createReport: (data: { caseId: string; title: string; summary?: string; fileUrl?: string }) =>
    apiRequest("/reports", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

export const resultsApi = {
  getRescuePriorities: () => apiRequest("/results/priorities/all", { method: "GET" }),

  getResultByAssessment: (assessmentId: string) =>
    apiRequest(`/results/${assessmentId}`, { method: "GET" }),
};

