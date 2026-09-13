import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET() {
    // Mengecek apakah aplikasi berjalan secara lokal/development atau online/production
    const isDev = process.env.NODE_ENV === 'development';

    const username = isDev 
        ? (process.env.DIGIFLAZZ_DEV_USERNAME || process.env.DIGIFLAZZ_USERNAME) 
        : process.env.DIGIFLAZZ_USERNAME;

    const key = isDev 
        ? (process.env.DIGIFLAZZ_DEV_KEY || process.env.DIGIFLAZZ_KEY) 
        : process.env.DIGIFLAZZ_KEY;

    // URL endpoint Digiflazz (Biasanya sama atau dibedakan jika Digiflazz menyediakan URL khusus dev)
    const url = 'https://api.digiflazz.com/v1/price-list';
    
    const sig = crypto.createHash('md5').update(username + key + 'pricelist').digest('hex');

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                cmd: 'pricelist',
                username: username,
                sign: sig,
                // Tambahkan parameter 'dev' jika diperlukan oleh dokumentasi Digiflazz untuk mode sandbox
                ...(isDev && { dev: true }) 
            })
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Gagal mengambil data dari Digiflazz' }, { status: 500 });
    }
}
