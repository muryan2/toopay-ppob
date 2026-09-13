'use client';

import { useState } from 'react';

export default function Home() {
    const [activeCategory, setActiveCategory] = useState('PULSA');
    const [customerNo, setCustomerNo] = useState('');
    const [showBalance, setShowBalance] = useState(true);
    const [activeNav, setActiveNav] = useState('Home');

    return (
        <div style={{ backgroundColor: '#f1f5f9', minHeight: '100vh', fontFamily: 'sans-serif', paddingBottom: '120px', color: '#1e293b' }}>
            
            {/* Header Hijau Toska */}
            <div style={{ backgroundColor: '#084c44', color: '#ffffff', padding: '24px 20px 60px 20px', borderBottomLeftRadius: '35px', borderBottomRightRadius: '35px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h1 style={{ fontSize: '18px', fontWeight: '900', letterSpacing: '1px', margin: 0 }}>TOOPAYDIGI</h1>
                    <span style={{ fontSize: '11px', backgroundColor: 'rgba(6, 95, 70, 0.6)', padding: '4px 10px', borderRadius: '20px', color: '#6ee7b7', border: '1px solid rgba(5, 150, 105, 0.4)' }}>
                        DANA Bisnis Active
                    </span>
                </div>

                {/* Total Saldo */}
                <div style={{ textAlign: 'center', margin: '15px 0' }}>
                    <p style={{ fontSize: '12px', color: '#a7f3d0', margin: '0 0 4px 0' }}>Total Saldo</p>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '20px', fontWeight: 'bold', letterSpacing: '2px' }}>
                            {showBalance ? 'Rp 1.450.000' : 'Rp ••••••••'}
                        </span>
                        <button onClick={() => setShowBalance(!showBalance)} style={{ background: 'none', border: 'none', color: '#a7f3d0', cursor: 'pointer', fontSize: '14px' }}>
                            👁
                        </button>
                    </div>
                </div>

                {/* Tombol Aksi Cepat */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '20px' }}>
                    <div style={{ backgroundColor: '#073f38', padding: '12px 8px', borderRadius: '16px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div style={{ fontSize: '14px', marginBottom: '4px' }}>📥</div>
                        <span style={{ fontSize: '11px', fontWeight: '600', color: '#ecfdf5' }}>Top Up</span>
                    </div>
                    <div style={{ backgroundColor: '#073f38', padding: '12px 8px', borderRadius: '16px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div style={{ fontSize: '14px', marginBottom: '4px' }}>📤</div>
                        <span style={{ fontSize: '11px', fontWeight: '600', color: '#ecfdf5' }}>Transfer</span>
                    </div>
                    <div style={{ backgroundColor: '#073f38', padding: '12px 8px', borderRadius: '16px', textAlign: 'center', position: 'relative', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <span style={{ position: 'absolute', top: '-6px', right: '15px', backgroundColor: '#f59e0b', fontSize: '9px', fontWeight: 'bold', color: '#fff', padding: '1px 6px', borderRadius: '10px' }}>Segera</span>
                        <div style={{ fontSize: '14px', marginBottom: '4px' }}>📖</div>
                        <span style={{ fontSize: '11px', fontWeight: '600', color: '#ecfdf5' }}>Pembukuan</span>
                    </div>
                </div>
            </div>

            {/* Konten Utama Melayang */}
            <div style={{ maxWidth: '420px', margin: '-30px auto 0 auto', padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', zIndex: 10 }}>
                
                {/* Hot Promo */}
                <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h3 style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', margin: 0 }}>Hot Promo</h3>
                        <span style={{ fontSize: '11px', color: '#047857', backgroundColor: '#ecfdf5', padding: '4px 10px', borderRadius: '20px', fontWeight: '600' }}>❤️ Tambah Favorit</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', textAlign: 'center' }}>
                        {['INDOSAT', 'TELKOMSEL', 'XL', 'TRI'].map((op) => (
                            <div key={op} onClick={() => setActiveCategory('PULSA')} style={{ backgroundColor: '#f8fafc', border: '1px solid #f1f5f9', padding: '10px 4px', borderRadius: '16px', cursor: 'pointer' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '10px', margin: '0 auto 4px auto' }}>
                                    {op.substring(0, 3)}
                                </div>
                                <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#334155', display: 'block' }}>{op}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Menu Pembelian */}
                <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', margin: '0 0 12px 0' }}>Pembelian</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', textAlign: 'center' }}>
                        {[
                            { name: 'PULSA', icon: '📱' },
                            { name: 'DATA', icon: '📶' },
                            { name: 'E-MONEY', icon: '💳' },
                            { name: 'TELP & SMS', icon: '📞' },
                            { name: 'PLN', icon: '⚡' },
                            { name: 'GAME', icon: '🎮' },
                            { name: 'VOUCHER', icon: '🎟️' },
                            { name: 'LAINNYA', icon: '🗂️' },
                        ].map((menu) => (
                            <div
                                key={menu.name}
                                onClick={() => setActiveCategory(menu.name)}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '10px 4px',
                                    borderRadius: '16px',
                                    cursor: 'pointer',
                                    border: activeCategory === menu.name ? '2px solid #059669' : '1px solid #f1f5f9',
                                    backgroundColor: activeCategory === menu.name ? '#ecfdf5' : '#f8fafc',
                                }}
                            >
                                <div style={{ width: '34px', height: '34px', borderRadius: '10px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', marginBottom: '4px' }}>
                                    {menu.icon}
                                </div>
                                <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#334155' }}>{menu.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Formulir Transaksi */}
                <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '20px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                        <h2 style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', margin: 0 }}>Formulir Transaksi</h2>
                        <span style={{ fontSize: '10px', color: '#047857', backgroundColor: '#d1fae5', padding: '2px 10px', borderRadius: '10px', fontWeight: 'bold' }}>{activeCategory}</span>
                    </div>

                    <div>
                        <label style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '4px' }}>Nomor Tujuan / Pelanggan</label>
                        <input 
                            type="tel" 
                            value={customerNo}
                            onChange={(e) => setCustomerNo(e.target.value)}
                            placeholder="Contoh: 08123456789" 
                            style={{ width: '100%', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '14px', padding: '12px', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
                        />
                    </div>

                    <button 
                        onClick={() => alert(`Memproses transaksi ${activeCategory} untuk ${customerNo}`)}
                        style={{ width: '100%', backgroundColor: '#084c44', color: '#ffffff', fontWeight: 'bold', padding: '14px', borderRadius: '14px', border: 'none', cursor: 'pointer', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                    >
                        Proses Transaksi Sekarang ➔
                    </button>
                </div>
            </div>

            {/* Bottom Navbar Oranye */}
            <div style={{ position: 'fixed', bottom: '12px', left: '16px', right: '16px', maxWidth: '400px', margin: '0 auto', background: 'linear-gradient(to right, #d97706, #f97316)', color: '#ffffff', borderRadius: '35px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1000, border: '1px solid rgba(255,255,255,0.2)' }}>
                {[
                    { name: 'Home', icon: '🏠' },
                    { name: 'Notifikasi', icon: '🔔' },
                    { name: 'Histori', icon: '📋' },
                    { name: 'Bantuan', icon: '❓' },
                    { name: 'Akun', icon: '👤' },
                ].map((nav) => (
                    <button
                        key={nav.name}
                        onClick={() => setActiveNav(nav.name)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', color: activeNav === nav.name ? '#ffffff' : 'rgba(255,255,255,0.7)', transform: activeNav === nav.name ? 'scale(1.1)' : 'scale(1)', transition: '0.2s' }}
                    >
                        <span style={{ fontSize: '14px', marginBottom: '2px' }}>{nav.icon}</span>
                        <span style={{ fontSize: '9px', fontWeight: activeNav === nav.name ? 'bold' : 'normal' }}>{nav.name}</span>
                    </button>
                ))}
            </div>

        </div>
    );
}
