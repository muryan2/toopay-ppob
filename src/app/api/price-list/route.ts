// src/app/api/price-list/route.ts

import { NextRequest, NextResponse } from 'next/server';
import * as crypto from 'crypto'; 

// Ambil variabel dari Vercel Environment Variables
const USERNAME = process.env.DIGIFLAZZ_USERNAME;
const API_KEY = process.env.DIGIFLAZZ_DEVELOPMENT_KEY; 
const DIGIFLAZZ_URL = 'https://api.digiflazz.com/v1/price-list'; 

// Fungsi untuk membuat signature MD5
const createSign = (username: string, apiKey: string): string => {
    // Formula: md5(username + apiKey + "pricelist")
    const hashString = `${username}${apiKey}pricelist`;
    return crypto.createHash('md5').update(hashString).digest('hex');
};

// Menggunakan GET untuk debugging cepat via browser
export async function POST(request: NextRequest) { 
    
    // 1. Validasi Kunci
    if (!USERNAME || !API_KEY) {
        return NextResponse.json({
            status: "error",
            message: "Kunci API atau Username Digiflazz belum dikonfigurasi.",
        }, { status: 500 });
    }

    // Hitung Signature
    const SIGNATURE = createSign(USERNAME, API_KEY);
    
    // 2. Siapkan Data Permintaan
    const requestData = {
        cmd: 'prepaid', 
        username: USERNAME,
        sign: SIGNATURE, 
    };
    
    // 3. Kirim Permintaan ke API Digiflazz
    try {
        const digiResponse = await fetch(DIGIFLAZZ_URL, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        });

        const result = await digiResponse.json();
        
        // 4. Proses Respon dari Digiflazz
        if (result.data && result.data.rc === '00') {
            // Sukses: Kirim produk kembali ke frontend
            return NextResponse.json({
                status: "success",
                products: result.data.data
            });
        }

        // Gagal: Respon dari Digiflazz menunjukkan error
        return NextResponse.json({
            status: "error",
            message: result.data?.message || "Permintaan ke Digiflazz gagal (Cek Kunci API).",
        }, { status: 400 });

    } catch (e) {
        console.error("Error fetching price list:", e);
        return NextResponse.json({
            status: "error",
            message: "Gagal terhubung ke API Digiflazz."
        }, { status: 500 });
    }
} // <--- PASTIKAN KURUNG KURAWAL INI ADA!
