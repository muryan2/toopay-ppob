// src/app/api/transaction/route.ts

import { NextRequest, NextResponse } from 'next/server';

// Menggunakan EV yang sama untuk Token Bukaolshop
const BUKAOLSHOP_TOKEN = process.env.DIGIFLAZZ_USERNAME; 
// Endpoint Transaksi Bukaolshop (Asumsi)
const BUKAOLSHOP_TRANSACTION_URL = 'https://openapi.bukaolshop.net/v1/app/proses-transaksi'; 
// CATATAN: URL transaksi ini harus Anda konfirmasi dari dokumentasi Bukaolshop.

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

    // 3. Siapkan Payload untuk Bukaolshop (Metode POST ke Bukaolshop)
    const payload = {
        token: BUKAOLSHOP_TOKEN,
        id_produk: product_id,
        // Asumsi Bukaolshop menggunakan parameter 'nomor_tujuan' atau 'customer_id'
        // Anda mungkin perlu menyesuaikan nama parameter di bawah ini
        nomor_tujuan: customerNumber, 
        
        // PENTING: Bukaolshop mungkin memerlukan URL Callback/Webhook di sini
        // Sesuaikan dengan dokumentasi Bukaolshop!
    };
    
    // 4. Kirim Permintaan Transaksi ke Open API Bukaolshop
    try {
        const bsResponse = await fetch(BUKAOLSHOP_TRANSACTION_URL, {
            method: 'POST', // Asumsi Bukaolshop menggunakan POST untuk transaksi
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        const result = await bsResponse.json();
        
        // 5. Proses Respon dari Bukaolshop
        if (result && result.code === 200 && result.status === 'ok') {
            // Transaksi Sukses
            return NextResponse.json({
                status: "success",
                message: "Transaksi berhasil diproses.",
                data: result
            });
        }

        // Transaksi Gagal (Token salah atau data Bukaolshop menolak)
        return NextResponse.json({
            status: "error",
            message: result.message || "Transaksi gagal diproses oleh Bukaolshop.",
        }, { status: 400 });

    } catch (e) {
        console.error("Error during transaction:", e);
        return NextResponse.json({
            status: "error",
            message: "Gagal terhubung ke API Proxy Transaksi."
        }, { status: 500 });
    }
}
