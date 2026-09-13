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

export default function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<string>('PULSA');
    const [selectedProduct, setSelectedProduct] = useState<string>('');
    const [customerNo, setCustomerNo] = useState<string>('');
    const [productPrice, setProductPrice] = useState<number>(0);
    const [activeNav, setActiveNav] = useState<string>('Home');
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        fetch('/api/products')
            .then((res) => res.json())
            .then((data) => {
                if (data && data.data) {
                    const activeProducts = data.data.filter((item: Product) => item.buyer_product_status);
                    setProducts(activeProducts);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error('Gagal memuat produk:', err);
                setLoading(false);
            });
    }, []);

    // Filter produk berdasarkan kategori dan kata kunci pencarian
    const filteredProducts = products.filter((item) => {
        const name = (item.product_name || '').toUpperCase();
        const cat = (item.category || '').toUpperCase();
        const brand = (item.brand || '').toUpperCase();
        const searchKey = activeCategory.toUpperCase();
        
        const matchesCategory = name.includes(searchKey) || cat.includes(searchKey) || brand.includes(searchKey);
        const matchesSearch = name.includes(searchTerm.toUpperCase()) || item.buyer_sku_code.toUpperCase().includes(searchTerm.toUpperCase());

        return matchesCategory && matchesSearch;
    });

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
        alert(`Memproses transaksi ${activeCategory} untuk nomor ${customerNo} dengan SKU ${selectedProduct}. Mohon selesaikan pembayaran via mutasi otomatis.`);
    };

    return (
        <div className="bg-slate-100 text-slate-800 min-h-screen flex flex-col font-sans pb-28">
            
            {/* Header & Status Section */}
            <div className="bg-[#0b4d45] text-white px-5 pt-6 pb-12 rounded-b-[35px] shadow-lg relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-600/20 rounded-full blur-2xl pointer-events-none"></div>
                <div className="flex justify-between items-center mb-6 relative z-10">
                    <div>
                        <h1 className="text-xl font-black tracking-wider">TOOPAYDIGI</h1>
                        <span className="text-[10px] text-emerald-300 font-semibold tracking-wider">DIRECT DIGIFLAZZ GATEWAY</span>
                    </div>
                    <div className="bg-emerald-800/80 border border-emerald-600/50 text-emerald-300 text-xs px-3 py-1 rounded-full flex items-center gap-1.5 font-medium shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> DANA Bisnis Active
                    </div>
                </div>

                {/* Info Card Saldo / Webhook */}
                <div className="bg-[#083b35] border border-emerald-700/40 rounded-2xl p-4 shadow-inner flex justify-between items-center relative z-10">
                    <div>
                        <p className="text-xs text-emerald-200 font-medium">Sistem Mutasi Otomatis</p>
                        <h2 className="text-base font-bold text-white mt-0.5">Webhook Real-time Active</h2>
                    </div>
                    <div className="bg-emerald-900/80 p-2.5 rounded-xl text-emerald-300 shadow">
                        <i className="fa-solid fa-bolt text-lg"></i>
                    </div>
                </div>
            </div>

            {/* Konten Utama */}
            <main className="flex-1 max-w-md w-full mx-auto px-4 -mt-6 space-y-4 z-20">
                
                {/* Menu Kategori Layanan (Grid) */}
                <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xl space-y-3">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Menu Pembelian & Layanan</h3>
                    <div className="grid grid-cols-4 gap-2.5 text-center">
                        {[
                            { name: 'PULSA', icon: 'fa-mobile-screen', color: 'text-blue-600 bg-blue-50' },
                            { name: 'DATA', icon: 'fa-wifi', color: 'text-emerald-600 bg-emerald-50' },
                            { name: 'E-MONEY', icon: 'fa-wallet', color: 'text-purple-600 bg-purple-50' },
                            { name: 'GAME', icon: 'fa-gamepad', color: 'text-amber-600 bg-amber-50' },
                            { name: 'PLN', icon: 'fa-bolt', color: 'text-yellow-600 bg-yellow-50' },
                            { name: 'VOUCHER', icon: 'fa-ticket', color: 'text-rose-600 bg-rose-50' },
                            { name: 'STREAMING', icon: 'fa-tv', color: 'text-indigo-600 bg-indigo-50' },
                            { name: 'LAINNYA', icon: 'fa-layer-group', color: 'text-slate-600 bg-slate-100' },
                        ].map((menu) => (
                            <button
                                key={menu.name}
                                onClick={() => {
                                    setActiveCategory(menu.name);
                                    setSelectedProduct('');
                                    setProductPrice(0);
                                }}
                                className={`flex flex-col items-center justify-center p-2.5 rounded-2xl transition border ${
                                    activeCategory === menu.name
                                        ? 'border-emerald-600 bg-emerald-50/80 shadow-md scale-[1.02]'
                                        : 'border-slate-100 bg-white hover:bg-slate-50'
                                }`}
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm mb-1 shadow-sm ${menu.color}`}>
                                    <i className={`fa-solid ${menu.icon}`}></i>
                                </div>
                                <span className="text-[10px] font-bold text-slate-700 leading-tight">{menu.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Formulir Transaksi Utama */}
                <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xl space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Formulir Transaksi</h2>
                        <span className="text-xs text-emerald-700 font-extrabold bg-emerald-100/80 px-3 py-1 rounded-full">{activeCategory}</span>
                    </div>
                    
                    {/* Input Nomor HP / Pelanggan */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500">Nomor Tujuan / Pelanggan</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                <i className="fa-solid fa-phone text-xs"></i>
                            </span>
                            <input 
                                type="tel" 
                                value={customerNo}
                                onChange={(e) => setCustomerNo(e.target.value)}
                                placeholder="Contoh: 08123456789" 
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 pl-10 text-sm focus:outline-none focus:border-emerald-600 transition text-slate-800 font-medium"
                            />
                        </div>
                    </div>

                    {/* Filter Pencarian Produk Cepat */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500">Cari Produk / Nominal</label>
                        <input 
                            type="text" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Ketik nama produk (misal: Telkomsel, 10k)..." 
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-emerald-600 transition text-slate-700"
                        />
                    </div>

                    {/* Pilihan Produk Digiflazz */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500">Pilih Nominal & Layanan</label>
                        <select 
                            value={selectedProduct}
                            onChange={handleProductChange}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:border-emerald-600 transition text-slate-800 font-medium"
                        >
                            <option value="">{loading ? '-- Memuat Pricelist Digiflazz --' : filteredProducts.length === 0 ? '-- Produk Tidak Ditemukan --' : `-- Pilih Produk ${activeCategory} (${filteredProducts.length} tersedia) --`}</option>
                            {filteredProducts.map((item) => (
                                <option key={item.buyer_sku_code} value={item.buyer_sku_code}>
                                    {item.product_name} - Rp {item.price.toLocaleString('id-ID')}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Rincian Harga Dinamis */}
                    {productPrice > 0 && (
                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 text-xs space-y-1 shadow-sm">
                            <div className="flex justify-between text-slate-600">
                                <span>Total Tagihan:</span>
                                <span className="font-black text-emerald-700 text-base">Rp {productPrice.toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                    )}

                    {/* Tombol Eksekusi */}
                    <button 
                        onClick={handleTransaction}
                        className="w-full bg-gradient-to-r from-[#0b4d45] to-[#083b35] hover:from-[#093d37] hover:to-[#062d29] text-white font-bold py-4 px-4 rounded-2xl shadow-lg shadow-emerald-900/30 transition flex items-center justify-center gap-2 text-sm mt-2"
                    >
                        <span>Proses Transaksi Sekarang</span>
                        <i className="fa-solid fa-arrow-right text-xs"></i>
                    </button>
                </div>
            </main>

            {/* Bottom Navigation Bar Mengapung */}
            <nav className="fixed bottom-3 left-4 right-4 max-w-md mx-auto bg-[#0b4d45] text-white rounded-full shadow-2xl py-2.5 px-6 flex justify-between items-center z-50 border border-emerald-600/30 backdrop-blur-md">
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
                        className={`flex flex-col items-center justify-center transition ${
                            activeNav === nav.name ? 'text-amber-400 scale-105 font-bold' : 'text-emerald-200 hover:text-white'
                        }`}
                    >
                        <i className={`fa-solid ${nav.icon} text-base mb-0.5`}></i>
                        <span className="text-[10px]">{nav.name}</span>
                    </button>
                ))}
            </nav>

        </div>
    );
                  }
