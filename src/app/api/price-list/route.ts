// src/app/api/price-list/route.ts

import { NextRequest, NextResponse } from 'next/server';
import * as crypto from 'crypto'; 
// ... (Bagian atas kode sama) ...

// Ubah: export async function POST(request: NextRequest) {
// Menjadi:
export async function GET(request: NextRequest) {
    // ... (Semua isi fungsi tetap sama) ...
    
    // 3. Kirim Permintaan ke API Digiflazz
    try {
        const digiResponse = await fetch(DIGIFLAZZ_URL, {
            method: 'POST', // <-- METHOD INI TETAP POST
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        });
    // ... (Bagian bawah kode sama) ...
    }
