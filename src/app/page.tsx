// src/app/page.tsx

'use client'; 

import React, { useState, useEffect } from 'react';

interface Product {
  product_code: string; // Asumsi ini adalah kode produk yang akan kita gunakan
  product_name: string; // Asumsi ini adalah nama produk
  product_price: number; // Asumsi ini adalah harga produk
}

// **GANTI DENGAN TOKEN OPEN API BUKAOLSHOP ANDA**
const BUKAOLSHOP_TOKEN = 'MASUKKAN_TOKEN_ANDA_DI_SINI'; 

export default function HomePage() {
  const [customerNumber, setCustomerNumber] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fungsi untuk mengambil daftar harga dari Bukaolshop
  const fetchPriceList = async () => {
    // 1. Definisikan URL Open API Bukaolshop
    const BUKAOLSHOP_API_URL = `https://openapi.bukaolshop.net/v1/app/produk?token=${BUKAOLSHOP_TOKEN}`;
    
    setIsLoading(true);
    setError(null);
    try {
      
      const response = await fetch(BUKAOLSHOP_API_URL, {
          method: 'GET', // Sesuai dokumentasi Open API Bukaolshop
          // Header Content-Type tidak wajib untuk GET, tapi bisa disertakan
      });
      
      const data = await response.json();

      // PENTING: Struktur respons Bukaolshop mungkin berbeda dengan Digiflazz.
      // Kita asumsikan respons sukses Bukaolshop berisi array data produk.
      if (data && data.code === 200 && data.status === 'success') {
        // Asumsi respons Bukaolshop memiliki struktur yang perlu kita proses
        // Jika data produk Bukaolshop adalah array, kita simpan
        // CATATAN: Anda mungkin perlu menyesuaikan pemetaan data produk di sini
        setProducts(data.data.products || []); // Asumsi ada object 'data' di respons
      } else {
        setError(data.message || 'Gagal memuat harga dari Bukaolshop.');
        setProducts([]);
      }
    } catch (err) {
      setError('Gagal terhubung ke Open API Bukaolshop.');
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Panggil saat komponen pertama kali dimuat
    fetchPriceList(); 
  }, []); 

// ... (sisa kode tampilan return) ...
