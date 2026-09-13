import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { nominal, customer_no, buyer_sku_code, ref_id } = body;

        console.log('[VERCEL WEBHOOK] Menerima nominal mutasi:', nominal);

        const username = process.env.DIGIFLAZZ_USERNAME || '';
        const key = process.env.DIGIFLAZZ_API_KEY || '';
        
        // Generate signature md5 untuk transaksi Digiflazz
        const sign = crypto.createHash('md5').update(username + key + (ref_id || 'TOOPAY' + Date.now())).digest('hex');

        const payloadDigiflazz = {
            username: username,
            buyer_sku_code: buyer_sku_code,
            customer_no: customer_no,
            ref_id: ref_id || 'TP-' + Date.now(),
            sign: sign,
            testing: false // Ubah true jika masih mode sandbox/uji coba
        };

        const response = await fetch('https://api.digiflazz.com/v1/transaction', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payloadDigiflazz)
        });

        const result = await response.json();
        console.log('[DIGIFLAZZ RESPONSE]:', result);

        return NextResponse.json({ status: 'success', digiflazz: result });
    } catch (error: any) {
        console.error('[WEBHOOK ERROR]:', error.message);
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
}
