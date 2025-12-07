// src/app/page.tsx

'use client'; 

import React, { useState, useEffect } from 'react';

// Interface diperbarui agar sesuai dengan properti Bukaolshop:
interface Product {
  id_produk: string;        // ID Produk
  nama_produk: string;      // Nama Produk
  harga_produk: number;     // Harga Produk
}


export default function HomePage() {
  const [customerNumber, setCustomerNumber] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fungsi untuk mengambil daftar harga, memanggil PROXY API Vercel
  const fetchPriceList = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Panggil endpoint PROXY API Vercel yang baru
      const response = await fetch('/api/bukaolshop-price-list', {
          method: 'POST', // Memanggil proxy Vercel
          headers: {
              'Content-Type': 'application/json',
          },
      });
      const data = await response.json();

      if (data.status === 'success') {
        // Data.products sekarang sudah berasal dari Bukaolshop
        setProducts(data.products || []); 
      } else {
        // Menampilkan pesan error dari server proxy
        setError(data.message || 'Gagal memuat harga.');
        setProducts([]);
      }
    } catch (err) {
      setError('Gagal terhubung ke server proxy.');
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Panggil saat komponen pertama kali dimuat
    fetchPriceList(); 
  }, []); 

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
          {/* Perubahan properti di sini agar sesuai dengan Bukaolshop */}
          {products.map((product) => (
            <option key={product.id_produk} value={product.id_produk}>
              {product.nama_produk} - Rp{product.harga_produk.toLocaleString('id-ID')}
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
