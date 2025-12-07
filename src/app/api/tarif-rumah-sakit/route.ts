import { NextRequest, NextResponse } from "next/server";

// Interface untuk data tarif
interface TarifData {
  id: number;
  kode: string;
  tindakan: string;
  tarif: string;
  kategori: string;
  created_at?: string;
  updated_at?: string;
}

// Data dummy untuk simulasi database
// Dalam implementasi nyata, ini akan diganti dengan query database
const dummyTarifData: TarifData[] = [
  {
    id: 1,
    kode: "R.TO.0001",
    tindakan: "ABDOMEN, LAPAROTOMY, TRAUMA REOPERATION",
    tarif: "17.958.000",
    kategori: "Operatif",
  },
  {
    id: 2,
    kode: "R.TO.0002",
    tindakan: "APPENDECTOMY, LAPAROSCOPIC",
    tarif: "12.500.000",
    kategori: "Operatif",
  },
  {
    id: 3,
    kode: "R.TO.0003",
    tindakan: "CHOLECYSTECTOMY, LAPAROSCOPIC",
    tarif: "15.750.000",
    kategori: "Operatif",
  },
  {
    id: 4,
    kode: "R.TO.0004",
    tindakan: "HERNIA REPAIR, INGUINAL",
    tarif: "8.500.000",
    kategori: "Operatif",
  },
  {
    id: 5,
    kode: "R.TO.0005",
    tindakan: "THYROIDECTOMY, TOTAL",
    tarif: "18.200.000",
    kategori: "Operatif",
  },
  {
    id: 6,
    kode: "R.NO.0001",
    tindakan: "KONSULTASI SPESIALIS BEDAH",
    tarif: "350.000",
    kategori: "Non Operatif",
  },
  {
    id: 7,
    kode: "R.NO.0002",
    tindakan: "KONSULTASI SPESIALIS PENYAKIT DALAM",
    tarif: "300.000",
    kategori: "Non Operatif",
  },
  {
    id: 8,
    kode: "R.NO.0003",
    tindakan: "KONSULTASI SPESIALIS ANAK",
    tarif: "325.000",
    kategori: "Non Operatif",
  },
  {
    id: 9,
    kode: "R.TG.0001",
    tindakan: "TRANSPLANTASI GINJAL DONOR HIDUP",
    tarif: "125.000.000",
    kategori: "Transplantasi Ginjal",
  },
  {
    id: 10,
    kode: "R.TG.0002",
    tindakan: "TRANSPLANTASI GINJAL DONOR KADAVER",
    tarif: "150.000.000",
    kategori: "Transplantasi Ginjal",
  },
  {
    id: 11,
    kode: "R.KM.0001",
    tindakan: "AKUPUNKTUR MEDIK",
    tarif: "200.000",
    kategori: "Komplementer",
  },
  {
    id: 12,
    kode: "R.KM.0002",
    tindakan: "TERAPI BEKAM",
    tarif: "150.000",
    kategori: "Komplementer",
  },
  {
    id: 13,
    kode: "R.MC.0001",
    tindakan: "MEDICAL CHECK UP BASIC",
    tarif: "750.000",
    kategori: "Med Check Up",
  },
  {
    id: 14,
    kode: "R.MC.0002",
    tindakan: "MEDICAL CHECK UP COMPREHENSIVE",
    tarif: "1.500.000",
    kategori: "Med Check Up",
  },
  {
    id: 15,
    kode: "R.MC.0003",
    tindakan: "MEDICAL CHECK UP EXECUTIVE",
    tarif: "2.250.000",
    kategori: "Med Check Up",
  },
];

export async function GET(request: NextRequest) {
  try {
    // Simulasi delay untuk menunjukkan loading state
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const kategori = searchParams.get("kategori");
    const search = searchParams.get("search");

    let filteredData = [...dummyTarifData];

    // Filter berdasarkan kategori
    if (kategori && kategori !== "Semua") {
      filteredData = filteredData.filter(
        (item) => item.kategori.toLowerCase() === kategori.toLowerCase()
      );
    }

    // Filter berdasarkan pencarian
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredData = filteredData.filter(
        (item) =>
          item.kode.toLowerCase().includes(searchTerm) ||
          item.tindakan.toLowerCase().includes(searchTerm)
      );
    }

    // Sort berdasarkan kode
    filteredData.sort((a, b) => a.kode.localeCompare(b.kode));

    return NextResponse.json(filteredData, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error in tarif-rumah-sakit API:", error);

    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Gagal mengambil data tarif rumah sakit",
      },
      { status: 500 }
    );
  }
}

// POST method untuk menambah data tarif (opsional)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { kode, tindakan, tarif, kategori } = body;

    // Validasi data
    if (!kode || !tindakan || !tarif || !kategori) {
      return NextResponse.json(
        {
          error: "Bad Request",
          message: "Semua field wajib diisi: kode, tindakan, tarif, kategori",
        },
        { status: 400 }
      );
    }

    // Simulasi penambahan data
    const newTarif: TarifData = {
      id: dummyTarifData.length + 1,
      kode,
      tindakan,
      tarif,
      kategori,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    dummyTarifData.push(newTarif);

    return NextResponse.json(newTarif, { status: 201 });
  } catch (error) {
    console.error("Error creating tarif data:", error);

    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Gagal menambah data tarif",
      },
      { status: 500 }
    );
  }
}
