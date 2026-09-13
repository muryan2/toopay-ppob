import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET() {
    const username = process.env.DIGIFLAZZ_USERNAME || '';
    const key = process.env.DIGIFLAZZ_KEY || '';
    
    // Membuat sign MD5 sesuai dokumentasi Digiflazz
    const sig = crypto.createHash('md5').update(username + key + 'pricelist').digest('hex');

    try {
        const response = await fetch('https://api.digiflazz.com/v1/price-list', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                cmd: 'pricelist',
                username: username,
                sign: sig
            })
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Gagal mengambil data dari Digiflazz' }, { status: 500 });
    }
}
