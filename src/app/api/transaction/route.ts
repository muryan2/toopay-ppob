// src/app/api/transaction/route.ts

import { NextRequest, NextResponse } from 'next/server';

// Menggunakan EV yang sama untuk Token Bukaolshop
const BUKAOLSHOP_TOKEN = process.env.DIGIFLAZZ_USERNAME; 
// Endpoint Transaksi Bukaolshop (Asumsi POST)
const BUKAOLSHOP_TRANSACTION_URL = 'https://openapi.bukaolshop.net/v1/app/proses-transaksi'; 

export async function POST(request: NextRequest) {
    
    // 1. Ambil data dari Frontend (customerNumber dan product_id)
    const { customerNumber, product_id } = await request.json();

    // 2. Validasi Token dan Data
    if (!BUKAOLSHOP_TOKEN) {
        return NextResponse.json({
            status: "error",
            message: "Token Bukaolshop belum dikonfigurasi di server.",
        }, { status: 500 });
    }
    
    if (!customerNumber || !product_id) {
        return NextResponse.json({
            status: "error",
            message: "Nomor pelanggan atau kode produk tidak lengkap.",
        }, { status: 400 });
    }

    // 3. Siapkan Payload untuk Bukaolshop
    // CATATAN: Pastikan nama parameter cocok dengan dokumentasi Bukaolshop
    const payload = {
        token: BUKAOLSHOP_TOKEN,
        id_produk: product_id,
        nomor_tujuan: customerNumber, 
    };
    
    // 4. Kirim Permintaan Transaksi ke Open API Bukaolshop
    try {
        const bsResponse = await fetch(BUKAOLSHOP_TRANSACTION_URL, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        // Jika respons bukan JSON atau ada masalah di koneksi, ini mungkin gagal
        if (!bsResponse.ok) {
            // Tangani status non-200 dari Bukaolshop (misalnya 401, 500)
             const errorResult = await bsResponse.json();
             return NextResponse.json({
                 status: "error",
                 message: errorResult.message || `API Bukaolshop menolak permintaan dengan status ${bsResponse.status}.`,
             }, { status: bsResponse.status });
        }
        
        const result = await bsResponse.json();

        // 5. Proses Respon Sukses dari Bukaolshop
        if (result && result.code === 200 && result.status === 'ok') {
            return NextResponse.json({
                status: "success",
                message: "Transaksi berhasil diproses.",
                data: result
            });
        }

        // Transaksi Gagal (Namun status HTTP-nya 200)
        return NextResponse.json({
            status: "error",
            message: result.message || "Transaksi gagal diproses oleh Bukaolshop.",
        }, { status: 400 });

    } catch (e) {
        console.error("Error during transaction:", e);
        // Error koneksi akan tertangkap di sini
        return NextResponse.json({
            status: "error",
            message: "Gagal terhubung ke API Proxy Transaksi (Periksa URL atau Koneksi Server).",
        }, { status: 500 });
    }
}
