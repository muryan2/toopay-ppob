// src/app/api/bukaolshop-price-list/route.ts

import { NextRequest, NextResponse } from 'next/server';

// Ambil Token dari Environment Variables Vercel
const BUKAOLSHOP_TOKEN = process.env.BUKAOLSHOP_API_TOKEN;
const BUKAOLSHOP_API_URL = 'https://openapi.bukaolshop.net/v1/app/produk'; 

// Karena frontend akan menggunakan method POST, kita gunakan POST di sini
export async function POST(request: NextRequest) {
    
    // 1. Validasi Token di Server
    if (!BUKAOLSHOP_TOKEN) {
        return NextResponse.json({
            status: "error",
            message: "Token Bukaolshop belum dikonfigurasi di server.",
        }, { status: 500 });
    }

    // 2. Siapkan URL dengan Token (Metode GET ke Bukaolshop)
    const finalUrl = `${BUKAOLSHOP_API_URL}?token=${BUKAOLSHOP_TOKEN}`;
    
    // 3. Kirim Permintaan ke Open API Bukaolshop
    try {
        const bsResponse = await fetch(finalUrl, {
            method: 'GET', // <-- PENTING: Bukaolshop meminta GET
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const result = await bsResponse.json();
        
        // 4. Proses Respon dari Bukaolshop
        if (result && result.code === 200 && result.status === 'success') {
            // Sukses: Kirim data produk Bukaolshop kembali ke frontend Vercel
            return NextResponse.json({
                status: "success",
                products: result.data.products // Sesuaikan jika struktur Bukaolshop berbeda
            });
        }

        // Gagal: Respon dari Bukaolshop menunjukkan error
        return NextResponse.json({
            status: "error",
            message: result.message || "Gagal memuat harga dari Bukaolshop.",
        }, { status: 400 });

    } catch (e) {
        console.error("Error fetching price list:", e);
        return NextResponse.json({
            status: "error",
            message: "Gagal terhubung ke API Proxy Bukaolshop."
        }, { status: 500 });
    }
}
