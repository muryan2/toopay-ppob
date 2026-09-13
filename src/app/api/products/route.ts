import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET() {
    try {
        const username = process.env.DIGIFLAZZ_USERNAME || '';
        const key = process.env.DIGIFLAZZ_API_KEY || '';
        
        // Generate signature md5 untuk pricelist Digiflazz
        const sign = crypto.createHash('md5').update(username + key + 'pricelist').digest('hex');

        const response = await fetch('https://api.digiflazz.com/v1/price-list', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                cmd: 'prepaid',
                username: username,
                sign: sign
            })
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
          }
