// src/app/api/bukaolshop-price-list/route.ts

import { NextRequest, NextResponse } from 'next/server';

// Menggunakan EV DIGIFLAZZ_USERNAME sebagai Token Bukaolshop
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

    // 2. Siapkan URL dengan Token dan Page=1. (TIDAK ADA total_data=100)
    // Dibiarkan default 10 data Bukaolshop atau diubah menjadi total_data=200 jika diperlukan
    const finalUrl = `${BUKAOLSHOP_API_URL}?token=${BUKAOLSHOP_TOKEN}&page=1`; // Kembali ke default 10 data
    
    // 3. Kirim Permintaan ke Open API Bukaolshop
    try {
        const bsResponse = await fetch(finalUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const result = await bsResponse.json();
        
        // 4. Proses Respon dari Bukaolshop
        if (result && result.code === 200 && result.status === 'ok') { 
            return NextResponse.json({
                status: "success",
                products: result.data 
            });
        }

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
