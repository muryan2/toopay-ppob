// src/app/api/bukaolshop-price-list/route.ts

import { NextRequest, NextResponse } from 'next/server';

// PENTING: Variabel ini HARUS diisi di Vercel Environment Variables.
// Kita menggunakan nama variabel lama (DIGIFLAZZ_USERNAME)
// untuk meningkatkan kompatibilitas, asalkan nilainya sudah diganti
// dengan Token Open API Bukaolshop yang valid.
const BUKAOLSHOP_TOKEN = process.env.DIGIFLAZZ_USERNAME; 
const BUKAOLSHOP_API_URL = 'https://openapi.bukaolshop.net/v1/app/produk'; 

export async function POST(request: NextRequest) {
    
    // 1. Validasi Token di Server
    if (!BUKAOLSHOP_TOKEN) {
        return NextResponse.json({
            status: "error",
            message: "Token Bukaolshop belum dikonfigurasi di server Vercel.",
        }, { status: 500 });
    }

    // 2. Siapkan URL dengan Token (Permintaan GET ke Bukaolshop)
    // Kita juga tambahkan page=1 untuk memastikan data terambil
    const finalUrl = `${BUKAOLSHOP_API_URL}?token=${BUKAOLSHOP_TOKEN}&page=1`;
    
    // 3. Kirim Permintaan ke Open API Bukaolshop
    try {
        const bsResponse = await fetch(finalUrl, {
            method: 'GET', // Sesuai dokumentasi Open API Bukaolshop
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const result = await bsResponse.json();
        
        // 4. Proses Respon dari Bukaolshop
        // Cek kode 200 dan status 'ok' (sesuai contoh respons Bukaolshop)
        if (result && result.code === 200 && result.status === 'ok') { 
            // Sukses: Kirim data produk. Struktur data Bukaolshop adalah array di properti 'data'.
            return NextResponse.json({
                status: "success",
                products: result.data // Mengambil array produk dari result.data
            });
        }

        // Gagal: Respon dari Bukaolshop menunjukkan error (misalnya token salah)
        return NextResponse.json({
            status: "error",
            message: result.message || "Gagal memuat harga dari Bukaolshop. (Periksa Token Open API)",
        }, { status: 400 });

    } catch (e) {
        console.error("Error fetching price list:", e);
        return NextResponse.json({
            status: "error",
            message: "Gagal terhubung ke API Proxy Bukaolshop (Network Error)."
        }, { status: 500 });
    }
}
