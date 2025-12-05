// src/app/page.tsx

'use client'; // Wajib, karena kita menggunakan state/hook React

import React, { useState, useEffect } from 'react';

interface Product {
  product_code: string;
  product_name: string;
  product_price: number;
}

export default function HomePage() {
  const [customerNumber, setCustomerNumber] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fungsi untuk mengambil daftar harga
  const fetchPriceList = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Panggil endpoint API Next.js Anda sendiri
      const response = await fetch('/api/price-list');
      const data = await response.json();

      if (data.status === 'success') {
        // Asumsi data.products berisi array produk Digiflazz
        setProducts(data.products || []); 
      } else {
        setError(data.message || 'Gagal memuat harga.');
        setProducts([]);
      }
    } catch (err) {
      setError('Gagal terhubung ke server.');
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Panggil saat komponen pertama kali dimuat
    fetchPriceList(); 
  }, []); // [] berarti hanya dijalankan sekali

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>Aplikasi PPOB Toopay</h1>
      <p>Status Harga: {isLoading ? 'Memuat...' : error ? `Error: ${error}` : 'Berhasil dimuat!'}</p>

      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
        <h2>Formulir Transaksi</h2>
        
        <label htmlFor="customerNo" style={{ display: 'block', marginTop: '15px' }}>Nomor Pelanggan/HP:</label>
        <input 
          type="text" 
          id="customerNo" 
          style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ddd' }}
          placeholder="Masukkan nomor pelanggan atau HP"
          value={customerNumber}
          onChange={(e) => setCustomerNumber(e.target.value)}
        />

        <label htmlFor="productSelect" style={{ display: 'block', marginTop: '15px' }}>Pilih Produk:</label>
        <select 
          id="productSelect" 
          style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ddd' }}
          disabled={isLoading || products.length === 0}
        >
          <option value="">-- Pilih Produk --</option>
          {products.map((product) => (
            <option key={product.product_code} value={product.product_code}>
              {product.product_name} - Rp{product.product_price.toLocaleString('id-ID')}
            </option>
          ))}
        </select>

        <button 
          style={{ 
            marginTop: '20px', 
            padding: '10px 20px', 
            backgroundColor: '#0070f3', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer' 
          }}
          disabled={isLoading || products.length === 0}
        >
          Proses Transaksi
        </button>
      </div>
    </div>
  );
}
