'use client';

import { useState, useEffect } from 'react';

interface Product {
    buyer_sku_code: string;
    product_name: string;
    price: number;
    buyer_product_status: boolean;
    category?: string;
    brand?: string;
}

const fallbackProducts: Product[] = [
    { buyer_sku_code: 'S10', product_name: 'Telkomsel Pulsa 10.000', price: 11500, buyer_product_status: true, category: 'PULSA', brand: 'TELKOMSEL' },
    { buyer_sku_code: 'I10', product_name: 'Indosat Pulsa 10.000', price: 11400, buyer_product_status: true, category: 'PULSA', brand: 'INDOSAT' },
    { buyer_sku_code: 'DATA5GB', product_name: 'Telkomsel Flash 5GB', price: 25000, buyer_product_status: true, category: 'DATA', brand: 'TELKOMSEL' },
    { buyer_sku_code: 'DANA20K', product_name: 'Top Up DANA 20.000', price: 21000, buyer_product_status: true, category: 'E-MONEY', brand: 'DANA' },
    { buyer_sku_code: 'PLN20K', product_name: 'Token PLN 20.000', price: 20500, buyer_product_status: true, category: 'PLN', brand: 'PLN' },
];

export default function Home() {
    const [products, setProducts] = useState<Product[]>(fallbackProducts);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<string>('PULSA');
    const [selectedProduct, setSelectedProduct] = useState<string>('');
    const [customerNo, setCustomerNo] = useState<string>('');
    const [productPrice, setProductPrice] = useState<number>(0);
    const [activeNav, setActiveNav] = useState<string>('Home');
    const [showBalance, setShowBalance] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        fetch('/api/products')
            .then((res) => res.json())
            .then((data) => {
                const list = data?.data || data?.products || (Array.isArray(data) ? data : []);
                if (list.length > 0) {
                    const activeProducts = list.filter((item: Product) => item.buyer_product_status !== false);
                    setProducts(activeProducts);
                }
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, []);

    const filteredProducts = products.filter((item) => {
        const name = (item.product_name || '').toUpperCase();
        const cat = (item.category || '').toUpperCase();
        const brand = (item.brand || '').toUpperCase();
        const searchKey = activeCategory.toUpperCase();
        
        const matchesCategory = name.includes(searchKey) || cat.includes(searchKey) || brand.includes(searchKey);
        const searchUpper = searchTerm.toUpperCase();
        const matchesSearch = !searchTerm || name.includes(searchUpper) || item.buyer_sku_code.toUpperCase().includes(searchUpper);

        return matchesCategory && matchesSearch;
    });

    const displayProducts = filteredProducts.length > 0 ? filteredProducts : products;

    const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const sku = e.target.value;
        setSelectedProduct(sku);
        const found = products.find((p) => p.buyer_sku_code === sku);
        if (found) {
            setProductPrice(found.price);
        } else {
            setProductPrice(0);
        }
    };

    const handleTransaction = () => {
        if (!customerNo || !selectedProduct) {
            alert('Mohon isi nomor HP/pelanggan dan pilih produk terlebih dahulu!');
            return;
        }
        alert(`Memproses transaksi ${activeCategory} untuk nomor ${customerNo} dengan SKU ${selectedProduct}.`);
    };

    return (
        <div className="bg-slate-100 text-slate-800 min-h-screen flex flex-col font-sans pb-32">
            
            {/* Header Utama Hijau Toska & Total Saldo */}
            <div className="bg-[#084c44] text-white px-5 pt-6 pb-16 rounded-b-[40px] shadow-md relative">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-black tracking-wider text-white">DIGIFLASH</h1>
                    <div className="text-[11px] bg-emerald-800/60 px-2.5 py-1 rounded-full text-emerald-200 border border-emerald-700/50">
                        DANA Bisnis Active
                    </div>
                </div>

                {/* Bagian Saldo */}
                <div className="text-center my-3">
                    <p className="text-xs text-emerald-200 font-medium">Total Saldo</p>
                    <div className="flex justify-center items-center gap-2 mt-1">
                        <span className="text-xl font-bold tracking-widest">
                            {showBalance ? 'Rp 1.450.000' : 'Rp ••••••••'}
                        </span>
                        <button onClick={() => setShowBalance(!showBalance)} className="text-emerald-200 hover:text-white transition">
                            <i className={`fa-solid ${showBalance ? 'fa-eye' : 'fa-eye-slash'} text-sm`}></i>
                        </button>
                    </div>
                </div>

                {/* Tombol Aksi Cepat (Top Up, Transfer, Pembukuan) */}
                <div className="grid grid-cols-3 gap-3 mt-6">
                    <button className="bg-[#073f38] hover:bg-[#06332d] border border-emerald-700/30 py-2.5 px-2 rounded-2xl flex flex-col items-center justify-center transition shadow-sm">
                        <i className="fa-solid fa-qrcode text-emerald-300 text-sm mb-1"></i>
                        <span className="text-[11px] font-semibold text-emerald-100">Top Up</span>
                    </button>
                    <button className="bg-[#073f38] hover:bg-[#06332d] border border-emerald-700/30 py-2.5 px-2 rounded-2xl flex flex-col items-center justify-center transition shadow-sm">
                        <i className="fa-solid fa-arrow-up-right-from-square text-emerald-300 text-sm mb-1"></i>
                        <span className="text-[11px] font-semibold text-emerald-100">Transfer</span>
                    </button>
                    <div className="bg-[#073f38] border border-emerald-700/30 py-2.5 px-2 rounded-2xl flex flex-col items-center justify-center relative opacity-80">
                        <span className="absolute -top-2 bg-amber-500 text-[9px] font-bold text-white px-1.5 py-0.2 rounded-full">Segera</span>
                        <i className="fa-solid fa-book text-emerald-300 text-sm mb-1"></i>
                        <span className="text-[11px] font-semibold text-emerald-100">Pembukuan</span>
                    </div>
                </div>
            </div>

            {/* Konten Utama (Card Putih Melayang) */}
            <main className="flex-1 max-w-md w-full mx-auto px-4 -mt-8 space-y-4 z-20">
                
                {/* Hot Promo Section */}
                <div className="bg-white border border-slate-200/80 rounded-3xl p-4 shadow-lg space-y-3">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Hot Promo</h3>
                        <button className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
                            <i className="fa-regular fa-heart text-[10px]"></i> Tambah Favorit
                        </button>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center">
                        {['INDOSAT', 'TELKOMSEL', 'XL', 'TRI'].map((op) => (
                            <button 
                                key={op} 
                                onClick={() => setActiveCategory('PULSA')}
                                className="bg-slate-50 hover:bg-emerald-50/50 border border-slate-100 p-2.5 rounded-2xl flex flex-col items-center transition"
                            >
                                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] mb-1 shadow-sm">
                                    {op.substring(0, 3)}
                                </div>
                                <span className="text-[10px] font-bold text-slate-700 truncate w-full">{op}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Menu Pembelian & Layanan */}
                <div className="bg-white border border-slate-200/80 rounded-3xl p-4 shadow-lg space-y-3">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Pembelian</h3>
                    <div className="grid grid-cols-4 gap-2.5 text-center">
                        {[
                            { name: 'PULSA', icon: 'fa-mobile-screen' },
                            { name: 'DATA', icon: 'fa-wifi' },
                            { name: 'E-MONEY', icon: 'fa-wallet' },
                            { name: 'TELP & SMS', icon: 'fa-phone' },
                            { name: 'PLN', icon: 'fa-bolt' },
                            { name: 'GAME', icon: 'fa-gamepad' },
                            { name: 'VOUCHER', icon: 'fa-ticket' },
                            { name: 'LAINNYA', icon: 'fa-layer-group' },
                        ].map((menu) => (
                            <button
                                key={menu.name}
                                onClick={() => {
                                    setActiveCategory(menu.name.includes('PULSA') ? 'PULSA' : menu.name);
                                    setSelectedProduct('');
                                    setProductPrice(0);
                                }}
                                className={`flex flex-col items-center justify-center p-2.5 rounded-2xl transition border ${
                                    activeCategory === menu.name
                                        ? 'border-emerald-600 bg-emerald-50 shadow-sm'
                                        : 'border-slate-100 bg-slate-50/60 hover:bg-slate-100'
                                }`}
                            >
                                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-sm mb-1 shadow-sm">
                                    <i className={`fa-solid ${menu.icon}`}></i>
                                </div>
                                <span className="text-[9px] font-bold text-slate-700 leading-tight">{menu.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Formulir Transaksi & Eksekusi */}
                <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xl space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Formulir Transaksi</h2>
                        <span className="text-[10px] text-emerald-700 font-extrabold bg-emerald-100 px-2.5 py-0.5 rounded-full">{activeCategory}</span>
                    </div>
                    
                    {/* Input Nomor Tujuan */}
                    <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-500">Nomor Tujuan / Pelanggan</label>
                        <input 
                            type="tel" 
                            value={customerNo}
                            onChange={(e) => setCustomerNo(e.target.value)}
                            placeholder="Contoh: 08123456789" 
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:border-emerald-600 transition text-slate-800 font-medium"
                        />
                    </div>

                    {/* Filter Pencarian Cepat */}
                    <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-500">Cari Produk / Nominal</label>
                        <input 
                            type="text" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Ketik nama produk..." 
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-emerald-600 transition text-slate-700"
                        />
                    </div>

                    {/* Pilihan Produk Digiflazz */}
                    <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-500">Pilih Nominal & Layanan</label>
                        <select 
                            value={selectedProduct}
                            onChange={handleProductChange}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:border-emerald-600 transition text-slate-800 font-medium"
                        >
                            <option value="">-- Pilih Produk ({displayProducts.length} tersedia) --</option>
                            {displayProducts.map((item) => (
                                <option key={item.buyer_sku_code} value={item.buyer_sku_code}>
                                    {item.product_name} - Rp {item.price.toLocaleString('id-ID')}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Rincian Harga */}
                    {productPrice > 0 && (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-xs flex justify-between items-center">
                            <span className="text-slate-600">Total Tagihan:</span>
                            <span className="font-black text-emerald-700 text-sm">Rp {productPrice.toLocaleString('id-ID')}</span>
                        </div>
                    )}

                    {/* Tombol Eksekusi */}
                    <button 
                        onClick={handleTransaction}
                        className="w-full bg-gradient-to-r from-[#084c44] to-[#06332d] hover:opacity-95 text-white font-bold py-3.5 px-4 rounded-2xl shadow-md transition flex items-center justify-center gap-2 text-xs"
                    >
                        <span>Proses Transaksi Sekarang</span>
                        <i className="fa-solid fa-arrow-right text-[10px]"></i>
                    </button>
                </div>
            </main>

            {/* Bottom Navigation Bar Oranye Persis Referensi */}
            <nav className="fixed bottom-3 left-4 right-4 max-w-md mx-auto bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded-full shadow-2xl py-2 px-6 flex justify-between items-center z-50 border border-orange-400/30">
                {[
                    { name: 'Home', icon: 'fa-house' },
                    { name: 'Notifikasi', icon: 'fa-bell' },
                    { name: 'Histori', icon: 'fa-clipboard-list' },
                    { name: 'Bantuan', icon: 'fa-circle-question' },
                    { name: 'Akun', icon: 'fa-user' },
                ].map((nav) => (
                    <button
                        key={nav.name}
                        onClick={() => setActiveNav(nav.name)}
                        className={`flex flex-col items-center justify-center transition px-2 py-1 ${
                            activeNav === nav.name ? 'text-white scale-110 font-bold' : 'text-orange-100 hover:text-white opacity-80'
                        }`}
                    >
                        <i className={`fa-solid ${nav.icon} text-sm mb-0.5`}></i>
                        <span className="text-[9px] tracking-tight">{nav.name}</span>
                    </button>
                ))}
            </nav>

        </div>
    );
            }
