import { NextResponse } from "next/server";

// Use environment variable if set, otherwise default to localhost:8081
// In .env.local, set: NEXT_PUBLIC_API_URL=http://localhost:8081
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";

export async function handleApiRequest(
  url: string,
  options: RequestInit = {}
): Promise<NextResponse> {
  try {
    console.log(`[handleApiRequest] Fetching: ${url}`, { 
      method: options.method || "GET",
      hasBody: !!options.body 
    });
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    let response: Response;
    try {
      response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });
      clearTimeout(timeoutId);
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error(`[handleApiRequest] Fetch failed for ${url}:`, fetchError);
      
      if (fetchError instanceof Error) {
        if (fetchError.name === 'AbortError') {
          return NextResponse.json(
            { 
              error: "Request timeout - Server tidak merespon dalam 30 detik",
              message: "Request timeout - Server tidak merespon dalam 30 detik"
            },
            { status: 408 }
          );
        }
        
        if (fetchError.message.includes("fetch") || fetchError.message.includes("ECONNREFUSED") || fetchError.message.includes("ENOTFOUND")) {
          return NextResponse.json(
            { 
              error: `Tidak dapat terhubung ke server backend (${API_BASE_URL}). Pastikan backend server berjalan dan dapat diakses.`,
              message: `Tidak dapat terhubung ke server backend (${API_BASE_URL}). Pastikan backend server berjalan dan dapat diakses.`
            },
            { status: 500 }
          );
        }
      }
      
      throw fetchError;
    }

    console.log(`[handleApiRequest] Response status: ${response.status} for ${url}`);

    let data;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      try {
        const text = await response.text();
        if (!text || text.trim() === '') {
          console.warn(`[handleApiRequest] Empty response body from ${url}`);
          return NextResponse.json(
            { error: "Empty response from server", message: "Empty response from server" },
            { status: response.status }
          );
        }
        data = JSON.parse(text);
      } catch (jsonError) {
        console.error(`[handleApiRequest] Failed to parse JSON from ${url}:`, jsonError);
        const text = await response.text().catch(() => "Unable to read response");
        return NextResponse.json(
          { 
            error: `Invalid JSON response: ${text.substring(0, 200)}`, 
            message: `Invalid JSON response: ${text.substring(0, 200)}` 
          },
          { status: response.status }
        );
      }
    } else {
      const text = await response.text().catch(() => "Unable to read response");
      console.log(`[handleApiRequest] Non-JSON response from ${url}:`, text.substring(0, 200));
      return NextResponse.json(
        { 
          error: text || "Request failed", 
          message: text || "Request failed" 
        },
        { status: response.status }
      );
    }

    if (!response.ok) {
      console.error(`[handleApiRequest] Error response from ${url}:`, data);
      return NextResponse.json(
        { 
          error: data.message || data.error || `HTTP ${response.status}: ${response.statusText}`,
          message: data.message || data.error || `HTTP ${response.status}: ${response.statusText}`
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error(`[handleApiRequest] Exception for ${url}:`, error);
    
    if (error instanceof TypeError) {
      if (error.message.includes("fetch") || error.message.includes("ECONNREFUSED") || error.message.includes("ENOTFOUND")) {
        return NextResponse.json(
          { 
            error: `Tidak dapat terhubung ke server backend (${API_BASE_URL}). Pastikan backend server berjalan di ${API_BASE_URL} dan dapat diakses.`,
            message: `Tidak dapat terhubung ke server backend (${API_BASE_URL}). Pastikan backend server berjalan di ${API_BASE_URL} dan dapat diakses.`
          },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Failed to connect to server",
        message: error instanceof Error ? error.message : "Failed to connect to server"
      },
      { status: 500 }
    );
  }
}

export { API_BASE_URL };

