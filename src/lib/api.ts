// API Configuration and Utilities
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://172.20.10.2:8081";

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  status: number;
}

interface FetchOptions extends RequestInit {
  timeout?: number;
}

// Generic API fetch function
export async function apiRequest<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const { timeout = 10000, ...fetchOptions } = options;

  const url = `${API_BASE_URL}${
    endpoint.startsWith("/") ? endpoint : "/" + endpoint
  }`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...fetchOptions.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        error:
          errorData.message ||
          errorData.error ||
          `HTTP ${response.status}: ${response.statusText}`,
        status: response.status,
      };
    }

    const data = await response.json();
    return {
      data,
      status: response.status,
    };
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        return {
          error:
            "Request timeout - Server tidak merespon dalam waktu yang ditentukan",
          status: 408,
        };
      }

      // Network errors
      if (error.message.includes("fetch")) {
        return {
          error: `Tidak dapat terhubung ke server (${API_BASE_URL}). Pastikan backend server berjalan.`,
          status: 0,
        };
      }
    }

    return {
      error:
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan yang tidak diketahui",
      status: 500,
    };
  }
}

// Specific API functions for Tarif Rumah Sakit
export interface TarifData {
  KodeRS: string;
  Deskripsi: string;
  Harga: number;
  Kategori: string;
}

export interface TarifQueryParams {
  kategori?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export async function getTarifRumahSakit(
  params: TarifQueryParams = {}
): Promise<ApiResponse<TarifData[]>> {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, value.toString());
    }
  });

  const endpoint = `/tarifRS${
    queryParams.toString() ? "?" + queryParams.toString() : ""
  }`;
  return apiRequest<TarifData[]>(endpoint);
}

export async function createTarifRumahSakit(
  data: TarifData
): Promise<ApiResponse<TarifData>> {
  return apiRequest<TarifData>("/tarifRS", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateTarifRumahSakit(
  kodeRS: string,
  data: Partial<TarifData>
): Promise<ApiResponse<TarifData>> {
  return apiRequest<TarifData>(`/tarifRS/${kodeRS}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteTarifRumahSakit(
  kodeRS: string
): Promise<ApiResponse<void>> {
  return apiRequest<void>(`/tarifRS/${kodeRS}`, {
    method: "DELETE",
  });
}

// Health check function
export async function checkBackendHealth(): Promise<
  ApiResponse<{ status: string; timestamp: string }>
> {
  return apiRequest("/tarifRS", {
    method: "HEAD", // Use HEAD method for lighter health check
    timeout: 3000,
  });
}

export { API_BASE_URL };
