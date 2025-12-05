// src/app/page.tsx

import React from 'react';

// Ini adalah komponen utama (Halaman Utama)
export default function HomePage() {
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>Aplikasi PPOB Toopay</h1>
      <p>Selamat datang! Silakan masukkan nomor pelanggan dan pilih produk di bawah ini.</p>
      
      {/* Container untuk Formulir Utama */}
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
        <h2>Formulir Transaksi</h2>
        
        <label htmlFor="customerNo" style={{ display: 'block', marginTop: '15px' }}>Nomor Pelanggan/HP:</label>
        <input 
          type="text" 
          id="customerNo" 
          style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ddd' }}
          placeholder="Masukkan nomor pelanggan atau HP"
        />

        <label htmlFor="productSelect" style={{ display: 'block', marginTop: '15px' }}>Pilih Produk:</label>
        <select 
          id="productSelect" 
          style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ddd' }}
        >
          <option value="">-- Pilih Produk --</option>
          <option value="data">Paket Data</option>
          <option value="pulsa">Pulsa Reguler</option>
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
        >
          Proses Transaksi
        </button>
      </div>
    </div>
  );
}
