import { NextRequest, NextResponse } from "next/server";
import { handleApiRequest, API_BASE_URL } from "../_utils";

// Skip API routes saat build untuk static export (mobile)
// API routes hanya untuk web development
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Catch-all route handler untuk semua API endpoints
// Mapping endpoint:
// Frontend -> Backend
// GET /api/dokter -> GET http://localhost:8081/dokter
// GET /api/ruangan -> GET http://localhost:8081/ruangan
// GET /api/icd9 -> GET http://localhost:8081/icd9
// GET /api/icd10 -> GET http://localhost:8081/icd10
// GET /api/tarifRS -> GET http://localhost:8081/tarifRS
// GET /api/tarifRS/:kode -> GET http://localhost:8081/tarifRS/:kode
// GET /api/tarifRSByKategori/:kategori -> GET http://localhost:8081/tarifRSByKategori/:kategori
// GET /api/tarifBPJSRawatInap -> GET http://localhost:8081/tarifBPJSRawatInap
// GET /api/tarifBPJS/:kode -> GET http://localhost:8081/tarifBPJS/:kode
// GET /api/tarifBPJSRawatJalan -> GET http://localhost:8081/tarifBPJSRawatJalan
// GET /api/tarifBPJSRawatJalan/:kode -> GET http://localhost:8081/tarifBPJSRawatJalan/:kode
// GET /api/pasien/:id -> GET http://localhost:8081/pasien/:id
// GET /api/pasien/search?nama=... -> GET http://localhost:8081/pasien/search?nama=...
// GET /api/billing/aktif?nama_pasien=... -> GET http://localhost:8081/billing/aktif?nama_pasien=...
// GET /api/admin/billing -> GET http://localhost:8081/admin/billing
// POST /api/login -> POST http://localhost:8081/login
// POST /api/admin/login -> POST http://localhost:8081/admin/login
// POST /api/billing -> POST http://localhost:8081/billing
// POST /api/admin/inacbg -> POST http://localhost:8081/admin/inacbg

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> | { path: string[] } }
) {
  try {
    // Handle both sync and async params (Next.js 13+ vs 15+)
    const resolvedParams = params instanceof Promise ? await params : params;
    const pathSegments = resolvedParams.path || [];
    const path = pathSegments.join("/");
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    
    // Build backend URL
    const backendPath = path ? `/${path}` : "";
    const backendUrl = `${API_BASE_URL}${backendPath}${queryString ? `?${queryString}` : ""}`;
    
    console.log(`[API] GET ${request.url} -> ${backendUrl}`);
    
    return handleApiRequest(backendUrl, {
      method: "GET",
    });
  } catch (error) {
    console.error("[API] Error in GET:", error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Internal server error",
        message: error instanceof Error ? error.message : "Internal server error"
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> | { path: string[] } }
) {
  try {
    // Handle both sync and async params (Next.js 13+ vs 15+)
    const resolvedParams = params instanceof Promise ? await params : params;
    const pathSegments = resolvedParams.path || [];
    const path = pathSegments.join("/");
    
    let body;
    try {
      body = await request.json();
    } catch (jsonError) {
      console.error("[API] Failed to parse request body:", jsonError);
      return NextResponse.json(
        { error: "Invalid JSON in request body", message: "Invalid JSON in request body" },
        { status: 400 }
      );
    }
    
    // Build backend URL
    const backendPath = path ? `/${path}` : "";
    const backendUrl = `${API_BASE_URL}${backendPath}`;
    
    console.log(`[API] POST ${request.url} -> ${backendUrl}`, { bodyKeys: Object.keys(body || {}) });
    
    return handleApiRequest(backendUrl, {
      method: "POST",
      body: JSON.stringify(body),
    });
  } catch (error) {
    console.error("[API] Error in POST:", error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Internal server error",
        message: error instanceof Error ? error.message : "Internal server error"
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> | { path: string[] } }
) {
  try {
    // Handle both sync and async params (Next.js 13+ vs 15+)
    const resolvedParams = params instanceof Promise ? await params : params;
    const pathSegments = resolvedParams.path || [];
    const path = pathSegments.join("/");
    
    let body;
    try {
      body = await request.json();
    } catch (jsonError) {
      console.error("[API] Failed to parse request body:", jsonError);
      return NextResponse.json(
        { error: "Invalid JSON in request body", message: "Invalid JSON in request body" },
        { status: 400 }
      );
    }
    
    // Build backend URL
    const backendPath = path ? `/${path}` : "";
    const backendUrl = `${API_BASE_URL}${backendPath}`;
    
    console.log(`[API] PUT ${request.url} -> ${backendUrl}`);
    
    return handleApiRequest(backendUrl, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  } catch (error) {
    console.error("[API] Error in PUT:", error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Internal server error",
        message: error instanceof Error ? error.message : "Internal server error"
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> | { path: string[] } }
) {
  try {
    // Handle both sync and async params (Next.js 13+ vs 15+)
    const resolvedParams = params instanceof Promise ? await params : params;
    const pathSegments = resolvedParams.path || [];
    const path = pathSegments.join("/");
    
    // Build backend URL
    const backendPath = path ? `/${path}` : "";
    const backendUrl = `${API_BASE_URL}${backendPath}`;
    
    console.log(`[API] DELETE ${request.url} -> ${backendUrl}`);
    
    return handleApiRequest(backendUrl, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("[API] Error in DELETE:", error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Internal server error",
        message: error instanceof Error ? error.message : "Internal server error"
      },
      { status: 500 }
    );
  }
}

