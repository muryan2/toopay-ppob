// src/ap'use client'; 

import React, { useState, useEffect, useMemo } from 'react';
import styles from './page.module.css'; // IMPOR CSS MODULE BARU

// Interface Produk
interface Product {
  id_produk: string;        
  nama_produk: string;      
  harga_produk: number;     
}

// Data Prefix sederhana untuk contoh
const PREFIX_MAP = {
  '0812': 'Telkomsel',
  '0813': 'Telkomsel',
  '0852': 'Telkomsel',
  '0853': 'Telkomsel',
  '0815': 'Indosat',
  '0816': 'Indosat',
  '0896': 'Tri',
  '0899': 'Tri',
  // WAJIB: Tambahkan lebih banyak prefix di sini!
};

// Fungsi untuk menentukan operator berdasarkan prefix
const getOperator = (number: string) => {
    if (number.length < 4) return null;
    const prefix = number.substring(0, 4);
    return PREFIX_MAP[prefix] || null;
};


export default function HomePage() {
  const [customerNumber, setCustomerNumber] = useState('');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>(''); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactionMessage, setTransactionMessage] = useState<string | null>(null); 
  
  // LOGIC FILTRASI PREFIX (useMemo)
  const filteredProducts = useMemo(() => {
    const operator = getOperator(customerNumber);

    if (customerNumber.length < 4 || !operator) {
        // Tampilkan semua produk jika nomor belum terdeteksi/lengkap
        // Note: Anda bisa mengubah ini menjadi 'return []' agar dropdown kosong saat nomor belum dimasukkan
        return allProducts; 
    }

    // Filter produk yang mengandung nama operator (case-insensitive)
    return allProducts.filter(p => 
      p.nama_produk.toLowerCase().includes(operator.toLowerCase())
    );
  }, [customerNumber, allProducts]);


  const fetchPriceList = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/bukaolshop-price-list', {
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();

      if (data.status === 'success') {
        setAllProducts(data.products || []); 
      } else {
        setError(data.message || 'Gagal memuat harga.');
        setAllProducts([]);
      }
    } catch (err) {
      setError('Gagal terhubung ke server proxy harga.');
      setAllProducts([]);
    } finally {
      setIsLoading(false);
    }
  };


  const handleTransaction = async () => {
    setTransactionMessage(null); 
    
    if (!customerNumber || !selectedProduct) {
        setTransactionMessage("Mohon lengkapi Nomor Pelanggan dan Pilih Produk.");
        return;
    }

    setIsLoading(true);
    try {
        const response = await fetch('/api/transaction', { 
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
    fetchPriceList(); 
  }, []); 

  // Menentukan status display harga
  const priceStatusText = isLoading 
    ? 'Memuat...' 
    : error 
      ? `Error: ${error}` 
      : `Berhasil dimuat! (${allProducts.length} Produk Total)`;


  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Aplikasi PPOB Toopay</h1>
      <p>
        Status Harga: 
        <span className={error ? styles.statusError : styles.statusSuccess}>
          {priceStatusText}
        </span>
      </p>
      
      {/* Tampilkan pesan transaksi (SUCCESS/GAGAL) */}
      {transactionMessage && ( 
          <div className={`${styles.message} ${transactionMessage.includes('SUCCESS') ? styles.messageSuccess : styles.messageFailure}`}>
              {transactionMessage}
          </div>
      )}

      <div className={styles.formCard}>
        <h2>Formulir Transaksi</h2>
        
        <label htmlFor="customerNo" className={styles.label}>Nomor Pelanggan/HP:</label>
        <input 
          type="text" 
          id="customerNo" 
          className={styles.input}
          placeholder="Masukkan nomor pelanggan atau HP"
          value={customerNumber}
          onChange={(e) => setCustomerNumber(e.target.value)} 
        />
        {/* Tampilkan deteksi operator */}
        {customerNumber.length >= 4 && (
          <p className={styles.operatorInfo}>
            Operator Terdeteksi: {getOperator(customerNumber) || "Tidak Dikenal"}
          </p>
        )}

        <label htmlFor="productSelect" className={styles.label}>Pilih Produk (Tampil: {filteredProducts.length}):</label>
        <select 
          id="productSelect" 
          className={styles.select}
          disabled={isLoading || allProducts.length === 0}
          value={selectedProduct} 
          onChange={(e) => setSelectedProduct(e.target.value)} 
        >
          <option value="">-- Pilih Produk --</option>
          {/* Menggunakan filteredProducts untuk display */}
          {filteredProducts.map((product) => (
            <option key={product.id_produk} value={product.id_produk}>
              {product.nama_produk} - Rp{product.harga_produk.toLocaleString('id-ID')}
            </option>
          ))}
        </select>

        <button 
          onClick={handleTransaction} 
          className={styles.button}
          disabled={isLoading || filteredProducts.length === 0 || customerNumber.length < 4}
        >
          {isLoading ? 'Memproses...' : 'Proses Transaksi'}
        </button>
      </div>
    </div>
  );
}
