// src/app/page.tsx

'use client'; 

import React, { useState, useEffect } from 'react';

// Interface diperbarui agar sesuai dengan properti Bukaolshop:
interface Product {
  id_produk: string;        // ID Produk (Contoh: "2046567")
  nama_produk: string;      // Nama Produk (Contoh: "pulsa telkom 20rb")
  harga_produk: number;     // Harga Produk (Contoh: 21000)
}


export default function HomePage() {
  const [customerNumber, setCustomerNumber] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>(''); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactionMessage, setTransactionMessage] = useState<string | null>(null); 

  // Fungsi untuk mengambil daftar harga, memanggil PROXY API Vercel
  const fetchPriceList = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Panggil endpoint PROXY API Vercel untuk Price List
      const response = await fetch('/api/bukaolshop-price-list', {
          method: 'POST', 
          headers: {
              'Content-Type': 'application/json',
          },
      });
      const data = await response.json();

      if (data.status === 'success') {
        setProducts(data.products || []); 
      } else {
        setError(data.message || 'Gagal memuat harga.');
        setProducts([]);
      }
    } catch (err) {
      setError('Gagal terhubung ke server proxy harga.');
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };


  // Fungsi untuk memproses transaksi
  const handleTransaction = async () => {
    setTransactionMessage(null); // Reset pesan
    
    if (!customerNumber || !selectedProduct) {
        setTransactionMessage("Mohon lengkapi Nomor Pelanggan dan Pilih Produk.");
        return;
    }

    setIsLoading(true);
    try {
        const response = await fetch('/api/transaction', { // Panggil endpoint proxy transaksi Vercel
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                customerNumber: customerNumber,
                product_id: selectedProduct,
            }),
        });

        const data = await response.json();

        if (data.status === 'success') {
            setTransactionMessage(`✅ SUCCESS! ${data.message}`);
            // Kosongkan form setelah sukses (opsional)
            setCustomerNumber(''); 
            setSelectedProduct(''); 
        } else {
            setTransactionMessage(`❌ GAGAL! ${data.message}`);
        }
    } catch (err) {
        setTransactionMessage('Terjadi kesalahan koneksi saat memproses transaksi.');
    } finally {
        setIsLoading(false);
    }
  };


  useEffect(() => {
    // Panggil saat komponen pertama kali dimuat
    fetchPriceList(); 
  }, []); 

  // Menentukan status display harga
  const priceStatusText = isLoading 
    ? 'Memuat...' 
    : error 
      ? `Error: ${error}` 
      : 'Berhasil dimuat!';


  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>Aplikasi PPOB Toopay</h1>
      <p>Status Harga: **{priceStatusText}**</p>
      
      {/* Tampilkan pesan transaksi (SUCCESS/GAGAL) */}
      {transactionMessage && ( 
          <div style={{ 
              padding: '10px', 
              marginTop: '10px', 
              color: transactionMessage.includes('SUCCESS') ? 'green' : 'red', 
              border: `1px solid ${transactionMessage.includes('SUCCESS') ? 'green' : 'red'}`,
              backgroundColor: transactionMessage.includes('SUCCESS') ? '#e6ffe6' : '#ffe6e6',
              borderRadius: '4px'
          }}>
              {transactionMessage}
          </div>
      )}

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
          value={selectedProduct} 
          onChange={(e) => setSelectedProduct(e.target.value)} 
        >
          <option value="">-- Pilih Produk --</option>
          {products.map((product) => (
            <option key={product.id_produk} value={product.id_produk}>
              {product.nama_produk} - Rp{product.harga_produk.toLocaleString('id-ID')}
            </option>
          ))}
        </select>

        <button 
          onClick={handleTransaction} 
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
          {isLoading ? 'Memproses...' : 'Proses Transaksi'}
        </button>
      </div>
    </div>
  );
}
