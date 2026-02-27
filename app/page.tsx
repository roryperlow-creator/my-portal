'use client';
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabase';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, CartesianGrid, ReferenceLine, Legend } from 'recharts';
import { v4 as uuidv4 } from 'uuid';
import logoImg from './logo.png';

// ─── 1. UNIFIED ICON SYSTEM (Enterprise SaaS Set) ───────────────────────────
const Ic = ({ n, s = 20, color = 'currentColor', style }: { n: string, s?: number, color?: string, style?: React.CSSProperties }) => {
  const p = { width: s, height: s, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: '2', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, style };
  const icons: Record<string, React.ReactNode> = {
    home: <svg {...p}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    forms: <svg {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
    bell: <svg {...p}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>,
    user: <svg {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    users: <svg {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    chat: <svg {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    out: <svg {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    send: <svg {...p}><line x1="22" y1="2" x2="11" y2="13"/><polyline points="22 2 15 22 11 13 2 9 22 2"/></svg>,
    check: <svg {...p}><polyline points="20 6 9 17 4 12"/></svg>,
    camera: <svg {...p}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
    alert: <svg {...p}><polygon points="12 2 22 20 2 20 12 2"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    upload: <svg {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
    back: <svg {...p}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
    calendar: <svg {...p}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
    chevronDown: <svg {...p}><polyline points="6 9 12 15 18 9"></polyline></svg>,
    briefcase: <svg {...p}><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>,
    settings: <svg {...p}><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>,
    shield: <svg {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    trending: <svg {...p}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    search: <svg {...p}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    leads: <svg {...p}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>,
    fire: <svg {...p}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>,
    video: <svg {...p}><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>,
    plus: <svg {...p}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
    more: <svg {...p}><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>,
    link: <svg {...p}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>,
    zap: <svg {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>,
    plug: <svg {...p}><path d="M12 22v-4"></path><path d="M12 8V2"></path><path d="M4 10h16"></path><path d="M8 2v6"></path><path d="M16 2v6"></path><rect x="6" y="10" width="12" height="8" rx="2"></rect></svg>
  };
  return <>{icons[n] || null}</>;
}

// ─── 2. REUSABLE SAAS UI COMPONENTS ─────────────────────────────────────────
const Card = ({ children, style = {}, onClick }: any) => (
  <div onClick={onClick} style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', ...style }}>
    {children}
  </div>
);

const Badge = ({ text, status }: { text: string, status: 'success' | 'warning' | 'danger' | 'info' | 'neutral' }) => {
  const styles = {
    success: { bg: '#dcfce7', color: '#16a34a', border: '#bbf7d0' },
    warning: { bg: '#fffbeb', color: '#d97706', border: '#fde68a' },
    danger: { bg: '#fef2f2', color: '#ef4444', border: '#fca5a5' },
    info: { bg: '#eff6ff', color: '#3b82f6', border: '#bfdbfe' },
    neutral: { bg: '#f8fafc', color: '#64748b', border: '#e2e8f0' },
  };
  return (
    <span style={{ background: styles[status].bg, color: styles[status].color, border: `1px solid ${styles[status].border}`, padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
      {text}
    </span>
  );
};

const Button = ({ children, variant = 'primary', onClick, style = {}, icon }: any) => {
  const baseStyle = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', border: 'none', transition: 'all 0.2s' };
  const variants = {
    primary: { background: '#0f172a', color: '#fff' },
    success: { background: '#22c55e', color: '#fff' },
    danger: { background: '#ef4444', color: '#fff' },
    outline: { background: '#fff', border: '1px solid #cbd5e1', color: '#0f172a' },
    ghost: { background: 'transparent', color: '#64748b', padding: '8px 16px' }
  };
  return (
    <button onClick={onClick} style={{ ...baseStyle, ...(variants[variant as keyof typeof variants]), ...style }}
      onMouseOver={e => { if(variant !== 'ghost') e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = variant !== 'ghost' ? '0 4px 6px rgba(0,0,0,0.1)' : 'none' }}
      onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
    >
      {icon && <Ic n={icon} s={16} />} {children}
    </button>
  );
};

const Modal = ({ isOpen, onClose, title, children, width = '500px' }: any) => {
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: '24px', width: '100%', maxWidth: width, padding: '32px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: 'absolute', top: '24px', right: '24px', background: '#f1f5f9', border: 'none', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', color: '#64748b', fontSize: '18px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' }} onMouseOver={e=>e.currentTarget.style.background='#e2e8f0'} onMouseOut={e=>e.currentTarget.style.background='#f1f5f9'}>×</button>
        {title && <h2 style={{ margin: '0 0 24px 0', fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>{title}</h2>}
        {children}
      </div>
    </div>
  );
};

const Input = ({ label, type = 'text', placeholder, value, onChange, required, style={} }: any) => (
  <div style={{ marginBottom: '16px', ...style }}>
    {label && <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>{label}</label>}
    <input type={type} placeholder={placeholder} value={value} onChange={onChange} required={required} style={{ width: '100%', boxSizing: 'border-box', padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#f8fafc', outline: 'none', fontSize: '15px', color: '#0f172a', transition: 'border 0.2s' }} onFocus={e => e.currentTarget.style.borderColor = '#3b82f6'} onBlur={e => e.currentTarget.style.borderColor = '#cbd5e1'} />
  </div>
);

const Toggle = ({ enabled, onToggle }: { enabled: boolean, onToggle: () => void }) => (
  <div onClick={onToggle} style={{ width: 48, height: 26, background: enabled ? '#22c55e' : '#e2e8f0', borderRadius: '13px', position: 'relative', cursor: 'pointer', transition: 'background 0.2s' }}>
    <div style={{ width: 22, height: 22, background: '#fff', borderRadius: '50%', position: 'absolute', top: 2, left: enabled ? 24 : 2, transition: 'left 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
  </div>
);
// ─── 3. GLOBAL SHELL & NAVIGATION ───────────────────────────────────────────

const TopBar = ({ profile, activeSystem, setShowWorkspaceMenu, showWorkspaceMenu, toggleBot }: any) => {
  const [showNotifications, setShowNotifications] = useState(false);
  
  return (
    <header style={{ height: '80px', background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', position: 'sticky', top: 0, zIndex: 100 }}>
      {/* Global Search */}
      <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '0 16px', width: '400px', height: '48px', transition: 'border 0.2s' }}>
        <Ic n="search" s={18} color="#94a3b8" />
        <input placeholder="Search clients, leads, or policies (Cmd+K)" style={{ border: 'none', background: 'transparent', outline: 'none', padding: '0 12px', width: '100%', fontSize: '14px', color: '#0f172a' }} />
      </div>

      {/* Right Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <button onClick={toggleBot} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '14px', transition: 'color 0.2s' }} onMouseOver={e=>e.currentTarget.style.color='#22c55e'} onMouseOut={e=>e.currentTarget.style.color='#64748b'}>
          <Ic n="chat" s={20} /> Ask AI
        </button>
        
        {/* Notifications Dropdown */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => setShowNotifications(!showNotifications)} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', position: 'relative' }}>
            <Ic n="bell" s={18} />
            <span style={{ position: 'absolute', top: -2, right: -2, width: 10, height: 10, background: '#ef4444', borderRadius: '50%', border: '2px solid #fff' }} />
          </button>
          
          {showNotifications && (
            <div style={{ position: 'absolute', top: '120%', right: 0, width: '320px', background: '#fff', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', zIndex: 200, padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 800 }}>Notifications</h4>
                <span style={{ fontSize: '12px', color: '#3b82f6', cursor: 'pointer', fontWeight: 700 }}>Mark all read</span>
              </div>
              <div style={{ padding: '12px', background: '#fef2f2', borderRadius: '8px', marginBottom: '8px', cursor: 'pointer' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#991b1b' }}>Review Required: David Alawieh</div>
                <div style={{ fontSize: '12px', color: '#b91c1c', marginTop: '4px' }}>Missed 2 payments. High lapse risk.</div>
              </div>
              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', cursor: 'pointer' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>New Lead Sourced</div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Sarah Martinez assigned via Facebook.</div>
              </div>
            </div>
          )}
        </div>

        <div style={{ width: '1px', height: '24px', background: '#e2e8f0' }} />

        {/* Profile / Workspace Switcher */}
        <div style={{ position: 'relative' }}>
          <div onClick={() => profile?.client_type === 'both' && setShowWorkspaceMenu(!showWorkspaceMenu)} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: profile?.client_type === 'both' ? 'pointer' : 'default' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>{profile?.full_name}</div>
              <div style={{ fontSize: '11px', color: '#22c55e', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{activeSystem} Workspace</div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: '12px', background: '#0f172a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '16px' }}>
               {profile?.full_name?.charAt(0) || 'U'}
            </div>
          </div>
          {showWorkspaceMenu && profile?.client_type === 'both' && (
            <div style={{ position: 'absolute', top: '100%', right: 0, width: '200px', background: '#fff', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', zIndex: 100, padding: '8px', marginTop: '12px' }}>
              <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', padding: '8px 12px', letterSpacing: '0.05em' }}>Switch Workspace</div>
              <button onClick={() => setShowWorkspaceMenu(false)} style={{ width: '100%', textAlign: 'left', padding: '12px', borderRadius: '8px', border: 'none', background: activeSystem === 'recruiting' ? '#f0fdf4' : 'transparent', color: activeSystem === 'recruiting' ? '#16a34a' : '#0f172a', cursor: 'pointer', fontWeight: 700, fontSize: '13px' }}>Recruiting System</button>
              <button onClick={() => setShowWorkspaceMenu(false)} style={{ width: '100%', textAlign: 'left', padding: '12px', borderRadius: '8px', border: 'none', background: activeSystem === 'retention' ? '#f0fdf4' : 'transparent', color: activeSystem === 'retention' ? '#16a34a' : '#0f172a', cursor: 'pointer', fontWeight: 700, fontSize: '13px' }}>Retention System</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
// ─── 4. ADMIN HEADQUARTERS (God Mode) ───────────────────────────────────────

const AdminSalesDashboard = () => {
  const revData = [
    { month: 'Jan', revenue: 25000 }, { month: 'Feb', revenue: 28500 },
    { month: 'Mar', revenue: 34000 }, { month: 'Apr', revenue: 38200 },
    { month: 'May', revenue: 42500 }, { month: 'Jun', revenue: 48000 }
  ];

  return (
    <div style={{ maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0, color: '#0f172a', letterSpacing: '-0.02em' }}>Connect HQ Overview</h1>
      <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px', marginBottom: '32px' }}>Your internal sales, global revenue, and platform health.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {[ 
          { l: 'Global MRR', v: '$48,000', c: '#22c55e' }, 
          { l: 'Active Agency Clients', v: '24', c: '#0f172a' }, 
          { l: 'New Deals (This Month)', v: '4', c: '#3b82f6' }, 
          { l: 'Pending Onboarding', v: '2', c: '#f59e0b' } 
        ].map((k, i) => (
          <Card key={i} style={{ padding: '32px' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k.l}</div>
            <div style={{ fontSize: '36px', fontWeight: 800, color: k.c, marginTop: '12px' }}>{k.v}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
        <Card style={{ padding: '32px', height: '400px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>Platform Revenue Growth</h3>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs><linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22c55e" stopOpacity={0.2}/><stop offset="95%" stopColor="#22c55e" stopOpacity={0}/></linearGradient></defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8', fontWeight: 600}} dy={10} />
                <Tooltip cursor={{stroke: '#e2e8f0', strokeWidth: 2, strokeDasharray: '4 4'}} contentStyle={{borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                <Area type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={4} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card style={{ padding: '32px', height: '400px', overflowY: 'auto' }}>
          <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>Sales Pipeline</h3>
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>Demos Scheduled (4)</div>
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '8px', fontSize: '14px', fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>Apex Partners <span style={{ color: '#3b82f6' }}>Today</span></div>
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '14px', fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>Horizon Life <span style={{ color: '#3b82f6' }}>Tomorrow</span></div>
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>Closing / Contract Sent (2)</div>
            <div style={{ background: '#fffbeb', padding: '16px', borderRadius: '12px', border: '1px solid #fde68a', color: '#92400e', fontSize: '14px', fontWeight: 700 }}>Vanguard Financial</div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const VerificationQueue = () => {
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const fetchPending = async () => { const { data } = await supabase.from('profiles').select('*').eq('is_verified', false); if (data) setPendingUsers(data); };
  useEffect(() => { fetchPending(); }, []);
  const approveUser = async (id: string) => { const { error } = await supabase.from('profiles').update({ is_verified: true }).eq('id', id); if (!error) fetchPending(); };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0, color: '#0f172a' }}>Verification Queue</h1>
      <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px', marginBottom: '32px' }}>Review and approve new agency accounts before granting system access.</p>
      
      <Card style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>User / Email</th>
              <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Company / System</th>
              <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Role</th>
              <th style={{ padding: '20px 24px', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingUsers.length === 0 && <tr><td colSpan={4} style={{ padding: '60px', textAlign: 'center', color: '#94a3b8', fontSize: '15px', fontWeight: 500 }}>No pending accounts require verification.</td></tr>}
            {pendingUsers.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '24px' }}><div style={{ fontWeight: 800, color: '#0f172a', fontSize: '15px' }}>{u.full_name}</div><div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>{u.email} • {u.phone}</div></td>
                <td style={{ padding: '24px' }}><div style={{ fontWeight: 700, color: '#0f172a', fontSize: '15px' }}>{u.company_name}</div><div style={{ marginTop: '6px' }}><Badge text={u.client_type} status="info" /></div></td>
                <td style={{ padding: '24px' }}><span style={{ fontSize: '14px', fontWeight: 600, textTransform: 'capitalize', color: '#475569' }}>{u.role}</span></td>
                <td style={{ padding: '24px', textAlign: 'right' }}><Button variant="success" onClick={() => approveUser(u.id)} icon="check">Verify Access</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
// ─── 4b. ADMIN HEADQUARTERS (Continued) ─────────────────────────────────────

const AdminCompaniesView = ({ onSelectCompany }: any) => {
  const [companies, setCompanies] = useState<any[]>([]);
  useEffect(() => { const fetchCompanies = async () => { const { data } = await supabase.from('companies').select('*'); if (data) setCompanies(data); }; fetchCompanies(); }, []);
  
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0, color: '#0f172a' }}>Client Companies</h1>
      <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px', marginBottom: '32px' }}>Click a company to securely impersonate and view their live dashboards.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {companies.length === 0 ? ( <Card style={{ padding: '60px 40px', color: '#64748b', textAlign: 'center', gridColumn: '1 / -1', fontSize: '15px' }}>No companies found. Create your first client in Supabase!</Card> ) : companies.map(company => (
          <Card key={company.id} style={{ padding: '32px', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }} onClick={() => onSelectCompany(company)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div style={{ width: 56, height: 56, borderRadius: '16px', background: '#f0fdf4', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 800 }}>{company.name.charAt(0)}</div>
              <Badge text={company.status} status={company.status === 'active' ? 'success' : 'danger'} />
            </div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>{company.name}</h3>
            <p style={{ margin: 0, fontSize: '14px', color: '#64748b', fontWeight: 500 }}>System Access: <span style={{ textTransform: 'capitalize', fontWeight: 800, color: '#0f172a' }}>{company.subscription_type}</span></p>
          </Card>
        ))}
      </div>
    </div>
  );
};

const AdminTeamManagementView = () => {
  const [team, setTeam] = useState<any[]>([]);
  const fetchTeam = async () => { const { data } = await supabase.from('internal_team').select('*, profiles(full_name, email)'); if (data) setTeam(data); };
  useEffect(() => { fetchTeam(); }, []);
  const handleToggle = async (userId: string, field: string, currentValue: boolean) => { const { error } = await supabase.from('internal_team').update({ [field]: !currentValue }).eq('user_id', userId); if (!error) fetchTeam(); };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0, color: '#0f172a' }}>Team Management</h1>
      <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px', marginBottom: '32px' }}>Manage roles, system access, and module permissions for your internal team.</p>
      
      <Card style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Employee</th>
              <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Role</th>
              <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Conversations</th>
              <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Calendar</th>
              <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Contacts</th>
            </tr>
          </thead>
          <tbody>
            {team.map(member => (
              <tr key={member.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '24px', fontWeight: 800, color: '#0f172a', fontSize: '15px' }}>{member.profiles?.full_name}<div style={{fontSize:'13px', color:'#64748b', fontWeight:500, marginTop: '4px'}}>{member.profiles?.email}</div></td>
                <td style={{ padding: '24px' }}><Badge text={member.is_admin ? 'Super Admin' : 'Employee'} status={member.is_admin ? 'success' : 'info'} /></td>
                <td style={{ padding: '24px', textAlign: 'center' }}><input type="checkbox" disabled={member.is_admin} checked={member.can_see_conversations || false} onChange={() => handleToggle(member.user_id, 'can_see_conversations', member.can_see_conversations)} style={{ width: 20, height: 20, accentColor: '#22c55e', cursor: member.is_admin ? 'not-allowed' : 'pointer' }} /></td>
                <td style={{ padding: '24px', textAlign: 'center' }}><input type="checkbox" disabled={member.is_admin} checked={member.can_see_calendar || false} onChange={() => handleToggle(member.user_id, 'can_see_calendar', member.can_see_calendar)} style={{ width: 20, height: 20, accentColor: '#22c55e', cursor: member.is_admin ? 'not-allowed' : 'pointer' }} /></td>
                <td style={{ padding: '20px 24px', textAlign: 'center' }}><input type="checkbox" disabled={member.is_admin} checked={member.can_see_contacts || false} onChange={() => handleToggle(member.user_id, 'can_see_contacts', member.can_see_contacts)} style={{ width: 20, height: 20, accentColor: '#22c55e', cursor: member.is_admin ? 'not-allowed' : 'pointer' }} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
// ─── 5. EMPLOYEE OPERATIONS & TEAM HUB ──────────────────────────────────────

const EmployeeDashboard = ({ profile }: any) => (
  <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
    <h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0, color: '#0f172a', letterSpacing: '-0.02em' }}>Welcome, {profile?.full_name || 'Team Member'}</h1>
    <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px', marginBottom: '32px' }}>Here is your daily task overview and active tickets.</p>
    
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
      {[ 
        { l: 'Open Support Tickets', v: '4', c: '#ef4444' }, 
        { l: 'Tasks Pending', v: '12', c: '#f59e0b' }, 
        { l: 'Clients Onboarded', v: '2', c: '#22c55e' } 
      ].map((k, i) => (
        <Card key={i} style={{ padding: '32px' }}>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k.l}</div>
          <div style={{ fontSize: '40px', fontWeight: 800, color: k.c, marginTop: '12px' }}>{k.v}</div>
        </Card>
      ))}
    </div>
  </div>
);

const InternalTeamHub = ({ profile }: any) => {
  const [activeChannel, setActiveChannel] = useState('community');
  const [activeChannelName, setActiveChannelName] = useState('# community');
  const [messages, setMessages] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  const getDmChannelId = (id1: string, id2: string) => { const sorted = [id1, id2].sort(); return `dm_${sorted[0]}_${sorted[1]}`; };
  const fetchTeamMembers = async () => { const { data } = await supabase.from('internal_team').select(`user_id, profiles(full_name, avatar_url)`); if (data) setTeamMembers(data.filter((tm: any) => tm.user_id !== profile.id)); };
  const fetchMessages = async () => { const { data } = await supabase.from('internal_messages').select(`id, content, created_at, sender_id, profiles (full_name, avatar_url)`).eq('channel', activeChannel).order('created_at', { ascending: true }); if (data) setMessages(data); };

  useEffect(() => { fetchTeamMembers(); }, [profile?.id]);
  useEffect(() => { fetchMessages(); const interval = setInterval(fetchMessages, 3000); return () => clearInterval(interval); }, [activeChannel]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !profile?.id) return;
    const tempMsg = input; setInput('');
    const { error } = await supabase.from('internal_messages').insert([{ sender_id: profile.id, content: tempMsg, channel: activeChannel }]);
    if (error) alert("Message failed to send. Check Supabase RLS policies."); else fetchMessages();
  };

  return (
    <Card style={{ display: 'flex', height: 'calc(100vh - 160px)', overflow: 'hidden', padding: 0 }}>
      <aside style={{ width: '280px', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0' }}><h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>Workspace Directory</h3></div>
        <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
          <h4 style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 16px 0' }}>Channels</h4>
          <button onClick={() => { setActiveChannel('community'); setActiveChannelName('# community'); }} style={{ width: '100%', textAlign: 'left', padding: '12px 16px', borderRadius: '12px', background: activeChannel === 'community' ? '#e2e8f0' : 'transparent', color: activeChannel === 'community' ? '#0f172a' : '#64748b', fontWeight: 700, border: 'none', marginBottom: '4px', cursor: 'pointer', fontSize: '14px' }}># community</button>
          <button onClick={() => { setActiveChannel('announcements'); setActiveChannelName('# announcements'); }} style={{ width: '100%', textAlign: 'left', padding: '12px 16px', borderRadius: '12px', background: activeChannel === 'announcements' ? '#e2e8f0' : 'transparent', color: activeChannel === 'announcements' ? '#0f172a' : '#64748b', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '14px' }}># announcements</button>
          
          <h4 style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '32px 0 16px 0' }}>Direct Messages</h4>
          {teamMembers.map(tm => {
            const dmId = getDmChannelId(profile.id, tm.user_id);
            const isDmActive = activeChannel === dmId;
            const memberName = tm.profiles?.full_name || 'Employee';
            return (
              <button key={tm.user_id} onClick={() => { setActiveChannel(dmId); setActiveChannelName(memberName); }} style={{ width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: '12px', background: isDmActive ? '#e2e8f0' : 'transparent', color: isDmActive ? '#0f172a' : '#475569', fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px', fontSize: '14px' }}>
                <div style={{ width: 24, height: 24, borderRadius: '6px', background: isDmActive ? '#fff' : '#cbd5e1', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800, overflow: 'hidden' }}>{tm.profiles?.avatar_url ? <img src={tm.profiles.avatar_url} style={{width:'100%',height:'100%',objectFit:'cover'}}/> : memberName.charAt(0)}</div>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{memberName}</span>
              </button>
            )
          })}
        </div>
      </aside>
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff' }}>
        <div style={{ padding: '24px 32px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 800, fontSize: '18px', color: '#0f172a' }}>{activeChannelName}</span>
        </div>
        <div style={{ flex: 1, padding: '32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {messages.length === 0 && <div style={{color: '#94a3b8', textAlign: 'center', marginTop: '40px', fontWeight: 600, fontSize: '14px'}}>This is the start of your history with {activeChannelName}.</div>}
          {messages.map(m => {
            const isMe = m.sender_id === profile.id;
            const senderName = isMe ? (profile?.full_name || 'Me') : (m.profiles?.full_name || 'Team Member');
            return (
              <div key={m.id} style={{ display: 'flex', gap: '16px', flexDirection: isMe ? 'row-reverse' : 'row' }}>
                <div style={{ width: 36, height: 36, borderRadius: '10px', background: isMe ? '#0f172a' : '#f1f5f9', color: isMe ? '#fff' : '#0f172a', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px' }}>{senderName.charAt(0)}</div>
                <div style={{ maxWidth: '75%', display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px', flexDirection: isMe ? 'row-reverse' : 'row' }}><span style={{ fontWeight: 800, fontSize: '13px', color: '#0f172a' }}>{senderName}</span></div>
                  <div style={{ fontSize: '15px', color: isMe ? '#fff' : '#334155', lineHeight: '1.6', background: isMe ? '#0f172a' : '#f8fafc', padding: '14px 20px', borderRadius: isMe ? '16px 4px 16px 16px' : '4px 16px 16px 16px', border: isMe ? 'none' : '1px solid #e2e8f0' }}>{m.content}</div>
                </div>
              </div>
            )
          })}
          <div ref={endRef} />
        </div>
        <div style={{ padding: '24px 32px', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
          <div style={{ display: 'flex', gap: '16px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '16px', padding: '8px', transition: 'border 0.2s' }} onFocus={e => e.currentTarget.style.borderColor = '#3b82f6'} onBlur={e => e.currentTarget.style.borderColor = '#cbd5e1'}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder={`Message ${activeChannelName}`} style={{ flex: 1, padding: '12px 16px', border: 'none', outline: 'none', fontSize: '15px', color: '#0f172a', background: 'transparent' }} />
            <Button variant="primary" onClick={handleSend} style={{ padding: '12px', borderRadius: '12px' }}><Ic n="send" s={18}/></Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
// ─── 6. KANBAN PIPELINE & MASS BROADCAST CENTER ─────────────────────────────

const KanbanPipelineView = () => {
  const columns = ['New Lead', 'Contacted', 'Appt Booked', 'Pitched', 'Contract Sent', 'Closed / Sold'];
  const mockCards = [
    { id: 1, name: 'Mike Johnson', type: 'IUL', amount: '$450/mo', col: 'New Lead', date: 'Today' },
    { id: 2, name: 'Sarah Martinez', type: 'Recruit', amount: 'Licensed', col: 'Contacted', date: 'Yesterday' },
    { id: 3, name: 'David Chen', type: 'Term', amount: '$85/mo', col: 'Appt Booked', date: 'Oct 24' },
    { id: 4, name: 'Lisa Thompson', type: 'Recruit', amount: 'Unlicensed', col: 'Contract Sent', date: 'Oct 22' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0, color: '#0f172a', letterSpacing: '-0.02em' }}>Pipeline</h1>
          <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px' }}>Drag and drop contacts through your sales cycle.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="outline" icon="search">Search Pipeline</Button>
          <Button variant="primary" icon="plus">Add Deal</Button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '24px', flex: 1 }}>
        {columns.map((col, i) => (
          <div key={i} style={{ width: '320px', minWidth: '320px', background: '#f8fafc', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{col}</h3>
              <span style={{ background: '#e2e8f0', color: '#475569', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 800 }}>
                {mockCards.filter(c => c.col === col).length}
              </span>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {mockCards.filter(c => c.col === col).map(card => (
                <Card key={card.id} style={{ padding: '16px', cursor: 'grab', border: '1px solid #cbd5e1' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 800, fontSize: '15px', color: '#0f172a' }}>{card.name}</span>
                    <Ic n="more" s={16} color="#94a3b8" />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <Badge text={card.type} status={card.type === 'Recruit' ? 'info' : 'success'} />
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#64748b' }}>{card.amount}</span>
                  </div>
                  <div style={{ marginTop: '12px', fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Added {card.date}</div>
                </Card>
              ))}
              {/* Drop Zone Placeholder */}
              <div style={{ height: '80px', borderRadius: '12px', border: '2px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                <Ic n="plus" s={20} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const BroadcastCenter = () => {
  const [audience, setAudience] = useState('all_active');
  const [channel, setChannel] = useState('email');

  return (
    <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0, color: '#0f172a', letterSpacing: '-0.02em' }}>Broadcast Center</h1>
      <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px', marginBottom: '32px' }}>Send mass SMS or Email campaigns to filtered contact segments.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
        <Card style={{ padding: '32px', height: 'fit-content' }}>
          <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>1. Select Audience</h3>
          <Input label="Filter Tag" type="text" placeholder="e.g. 'Unlicensed', 'IUL Client'" />
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Smart Segments</label>
            <select style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none', background: '#f8fafc', fontSize: '15px', color: '#0f172a' }} value={audience} onChange={e => setAudience(e.target.value)}>
              <option value="all_active">All Active Clients (104)</option>
              <option value="pending_recruits">Pending Recruits (21)</option>
              <option value="at_risk">At-Risk Policies (3)</option>
            </select>
          </div>
          <div style={{ padding: '16px', background: '#eff6ff', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
            <div style={{ fontSize: '12px', color: '#1e3a8a', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>Estimated Reach</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#1e40af' }}>{audience === 'all_active' ? '104 Contacts' : (audience === 'pending_recruits' ? '21 Contacts' : '3 Contacts')}</div>
          </div>
        </Card>

        <Card style={{ padding: '32px' }}>
          <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>2. Compose Message</h3>
          
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
            <div onClick={() => setChannel('email')} style={{ flex: 1, padding: '16px', borderRadius: '12px', border: channel === 'email' ? '2px solid #22c55e' : '1px solid #cbd5e1', background: channel === 'email' ? '#f0fdf4' : '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 700, transition: '0.2s' }}>
              <Ic n="forms" color={channel === 'email' ? '#16a34a' : '#64748b'} /> Email Blast
            </div>
            <div onClick={() => setChannel('sms')} style={{ flex: 1, padding: '16px', borderRadius: '12px', border: channel === 'sms' ? '2px solid #22c55e' : '1px solid #cbd5e1', background: channel === 'sms' ? '#f0fdf4' : '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 700, transition: '0.2s' }}>
              <Ic n="chat" color={channel === 'sms' ? '#16a34a' : '#64748b'} /> SMS Text Message
            </div>
          </div>

          {channel === 'email' && <Input label="Subject Line" placeholder="Enter subject line..." />}
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Message Body</label>
            <textarea style={{ width: '100%', boxSizing: 'border-box', padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#f8fafc', outline: 'none', fontSize: '15px', color: '#0f172a', minHeight: '200px', resize: 'vertical' }} placeholder={`Type your ${channel} message here. Use {{first_name}} to personalize...`} />
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <Button variant="primary" icon="send" style={{ flex: 1 }}>Send {channel.toUpperCase()} Blast Now</Button>
            <Button variant="outline" icon="calendar">Schedule for Later</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
// ─── 7. CLIENT 360° PROFILE DEEP-DIVE & CONTACTS ────────────────────────────

const Client360View = ({ client, onBack }: any) => {
  const [tab, setTab] = useState('timeline');

  return (
    <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
      <Button variant="ghost" onClick={onBack} icon="back" style={{ marginBottom: '24px', padding: 0 }}>Back to Directory</Button>
      
      {/* 360 Header */}
      <Card style={{ padding: '40px', display: 'flex', alignItems: 'center', gap: '32px', marginBottom: '24px' }}>
        <div style={{ width: 100, height: 100, borderRadius: '50%', background: '#f0fdf4', color: '#16a34a', border: '4px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', fontWeight: 800 }}>
          {client.name.charAt(0)}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
            <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 800, color: '#0f172a' }}>{client.name}</h1>
            <Badge text="Active Client" status="success" />
          </div>
          <div style={{ display: 'flex', gap: '24px', color: '#475569', fontSize: '15px', fontWeight: 500 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Ic n="user" s={16}/> {client.email}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Ic n="user" s={16}/> {client.phone}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
           <Button variant="outline" icon="forms">Log Note</Button>
           <Button variant="primary" icon="calendar">Book Review</Button>
        </div>
      </Card>

      {/* 360 Content Area */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>
        <Card style={{ overflow: 'hidden' }}>
          <div style={{ display: 'flex', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            {['timeline', 'file vault', 'tasks'].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: '20px', border: 'none', background: tab === t ? '#fff' : 'transparent', color: tab === t ? '#22c55e' : '#64748b', fontWeight: 800, textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.05em', cursor: 'pointer', borderBottom: tab === t ? '3px solid #22c55e' : '3px solid transparent', transition: '0.2s' }}>{t}</button>
            ))}
          </div>
          
          <div style={{ padding: '32px' }}>
            {tab === 'timeline' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Ic n="send" s={18}/></div>
                  <div>
                    <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '15px', marginBottom: '4px' }}>Automated Email Sent</div>
                    <div style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6' }}>"Your Annual Review is approaching." Sent successfully.</div>
                    <div style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 700, marginTop: '8px', textTransform: 'uppercase' }}>Today, 9:00 AM</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Ic n="calendar" s={18}/></div>
                  <div>
                    <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '15px', marginBottom: '4px' }}>Call Completed: 6-Month Check-in</div>
                    <div style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6' }}>Client is happy with the policy. Confirmed beneficiary details remain the same. No up-sell opportunity at this time.</div>
                    <div style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 700, marginTop: '8px', textTransform: 'uppercase' }}>Oct 12, 2025 by Rory Perlow</div>
                  </div>
                </div>
              </div>
            )}
            {tab === 'file vault' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                 <div style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                   <Ic n="forms" color="#ef4444" s={24}/>
                   <div style={{ flex: 1 }}><div style={{ fontWeight: 800, fontSize: '14px' }}>Initial_Illustration.pdf</div><div style={{ fontSize: '12px', color: '#64748b' }}>2.4 MB • Uploaded Oct 10</div></div>
                   <Button variant="ghost" icon="back" style={{ transform: 'rotate(-90deg)' }} />
                 </div>
                 <div style={{ padding: '16px', border: '2px dashed #cbd5e1', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', cursor: 'pointer', fontWeight: 700, fontSize: '14px' }}>
                   <Ic n="upload" s={18} style={{ marginRight: '8px' }}/> Upload Document
                 </div>
              </div>
            )}
            {tab === 'tasks' && (
              <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px' }}>No active tasks for this client.</div>
            )}
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Card style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Policy Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div><div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Product</div><div style={{ fontWeight: 800, color: '#0f172a' }}>{client.policy}</div></div>
              <div><div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Monthly Premium</div><div style={{ fontWeight: 800, color: '#22c55e' }}>$245.00</div></div>
              <div><div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Effective Date</div><div style={{ fontWeight: 800, color: '#0f172a' }}>{client.date}</div></div>
            </div>
          </Card>
          <Card style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Agent Assignment</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#0f172a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800 }}>RP</div>
              <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '14px' }}>Rory Perlow</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const ContactsDirectory = () => {
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const mockContacts = [
    { id: 1, name: "Michael Sterling", policy: "IUL", health: "green", date: "Oct 12, 2025", phone: "(555) 234-5678", email: "michael.s@example.com" },
    { id: 2, name: "Sarah Jenkins", policy: "Term", health: "yellow", date: "Jan 05, 2026", phone: "(555) 876-5432", email: "s.jenkins88@example.com" }
  ];

  if (selectedContact) return <Client360View client={selectedContact} onBack={() => setSelectedContact(null)} />;

  return (
    <div style={{ maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div><h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0, color: '#0f172a' }}>Contacts Directory</h1><p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px' }}>Click any client to open their 360° Profile.</p></div>
      </div>
      <Card style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <tr>
              <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Client Name</th>
              <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Contact Info</th>
              <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Policy Info</th>
            </tr>
          </thead>
          <tbody>
            {mockContacts.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }} onClick={() => setSelectedContact(c)} onMouseOver={e => e.currentTarget.style.background = '#f8fafc'} onMouseOut={e => e.currentTarget.style.background = '#fff'}>
                <td style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '16px' }}>{c.name.charAt(0)}</div>
                    <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '15px' }}>{c.name}</div>
                  </div>
                </td>
                <td style={{ padding: '24px' }}><div style={{ color: '#0f172a', fontWeight: 600, fontSize: '14px' }}>{c.phone}</div><div style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>{c.email}</div></td>
                <td style={{ padding: '24px', color: '#475569', fontWeight: 500, fontSize: '14px' }}>{c.policy} • {c.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
// ─── 8. INTERACTIVE CALENDAR & FORMS ────────────────────────────────────────

const CalendarView = ({ isRecruiting }: { isRecruiting?: boolean }) => {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const days = ['Sun 22', 'Mon 23', 'Tue 24', 'Wed 25', 'Thu 26', 'Fri 27', 'Sat 28'];
  const hours = ['9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM'];

  const recruitingBlocks = [
    { id: 1, day: 1, start: '9AM', span: 1, title: 'Jose Carlos (Interview)', type: 'interview', time: '9:00 AM - 10:00 AM', notes: 'First round interview. Source: Facebook Ads.' },
    { id: 2, day: 2, start: '10AM', span: 1, title: 'Hamzeh (Onboarding)', type: 'interview', time: '10:00 AM - 11:00 AM', notes: 'Contract signed. Complete portal walkthrough.' },
    { id: 3, day: 2, start: '11AM', span: 1.5, title: 'Busy', type: 'busy' }
  ];

  const retentionBlocks = [
    { id: 1, day: 1, start: '9AM', span: 1.5, title: 'Michael Sterling (Annual Review)', type: 'review', time: '9:00 AM - 10:30 AM', notes: 'Client requested to review IUL performance over the last 12 months. Prepare updated illustration.' },
    { id: 2, day: 4, start: '2PM', span: 1, title: 'David Alawieh (Policy Concern)', type: 'concern', time: '2:00 PM - 3:00 PM', notes: 'URGENT: Client missed last 2 payments.' },
    { id: 3, day: 2, start: '11AM', span: 1.5, title: 'Busy', type: 'busy' }
  ];

  const eventBlocks = isRecruiting ? recruitingBlocks : retentionBlocks;

  return (
    <div style={{ maxWidth: '1400px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0, color: '#0f172a', letterSpacing: '-0.02em' }}>{isRecruiting ? 'Recruiting Schedule' : 'Client Appointments'}</h1>
      <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px', marginBottom: '32px' }}>{isRecruiting ? 'Manage your upcoming candidate interviews.' : 'Manage your upcoming annual reviews, check-ins, and client concerns.'}</p>
      
      <Modal isOpen={!!selectedEvent} onClose={() => setSelectedEvent(null)}>
        {selectedEvent && (
          <div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ width: 56, height: 56, borderRadius: '16px', background: selectedEvent.type === 'concern' ? '#fef2f2' : '#f0fdf4', color: selectedEvent.type === 'concern' ? '#ef4444' : '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ic n={selectedEvent.type === 'concern' ? 'alert' : 'calendar'} s={28} /></div>
              <div>
                <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>{selectedEvent.title}</h2>
                <div style={{ color: '#64748b', fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}><Ic n="calendar" s={14}/> {selectedEvent.time}</div>
              </div>
            </div>
            <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '32px' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Appointment Notes</div>
              <div style={{ fontSize: '15px', color: '#0f172a', lineHeight: '1.6' }}>{selectedEvent.notes}</div>
            </div>
            <Button variant="primary" icon="video" onClick={() => window.open('https://meet.google.com', '_blank')} style={{ width: '100%', padding: '16px', fontSize: '16px' }}>Join Google Meet</Button>
          </div>
        )}
      </Modal>

      <Card style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
          <div style={{ padding: '16px', textAlign: 'center', fontSize: '11px', fontWeight: 800, color: '#94a3b8' }}>GMT</div>
          {days.map((d, i) => (<div key={i} style={{ padding: '16px', textAlign: 'center', fontSize: '13px', fontWeight: i === 4 ? 800 : 600, color: i === 4 ? '#3b82f6' : '#64748b', borderLeft: '1px solid #e2e8f0' }}>{d}</div>))}
        </div>
        <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '45%', left: '60px', right: 0, height: '2px', background: '#ef4444', zIndex: 10 }} />
          {hours.map((h, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)', minHeight: '80px' }}>
              <div style={{ borderBottom: '1px solid #e2e8f0', padding: '8px', fontSize: '11px', fontWeight: 700, color: '#94a3b8', textAlign: 'right' }}>{h}</div>
              {days.map((_, col) => {
                const block = eventBlocks.find(b => b.day === col && b.start === h);
                const bg = block?.type === 'busy' ? '#e2e8f0' : (block?.type === 'concern' ? '#ef4444' : '#22c55e');
                return (
                  <div key={col} style={{ borderBottom: '1px solid #e2e8f0', borderLeft: '1px solid #e2e8f0', position: 'relative', padding: '4px' }}>
                    {block && (
                      <div onClick={() => {if(block.type !== 'busy') setSelectedEvent(block)}} style={{ position: 'absolute', top: 4, left: 4, right: 4, height: `calc(${block.span * 100}% - 8px)`, background: bg, color: block.type === 'busy' ? '#64748b' : '#fff', borderRadius: '6px', padding: '8px', fontSize: '11px', fontWeight: 700, zIndex: 5, overflow: 'hidden', cursor: block.type === 'busy' ? 'default' : 'pointer' }}>{block.title}</div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
// ─── 9. LOOKER-STYLE DASHBOARDS & SETTINGS ──────────────────────────────────

const ForecastingPage = ({ isRecruiting }: { isRecruiting?: boolean }) => (
  <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
    <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
      {isRecruiting ? 'Recruiting Forecast' : 'Revenue Forecasting'}
    </h1>
    <p style={{ color: '#64748b', marginTop: '8px', marginBottom: '32px', fontSize: '15px' }}>
      {isRecruiting ? 'Predictive models for upcoming new agent recruits.' : 'Predictive models based on active policies and lapse risks.'}
    </p>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
      <Card style={{ padding: '40px' }}>
        <div style={{ fontSize: '13px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{isRecruiting ? 'Projected Recruits (This Month)' : 'Projected Monthly Revenue'}</div>
        <div style={{ fontSize: '48px', fontWeight: 800, color: '#22c55e', marginTop: '16px' }}>{isRecruiting ? '34' : '$12,450'}</div>
      </Card>
      <Card style={{ padding: '40px' }}>
        <div style={{ fontSize: '13px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{isRecruiting ? 'Projected Drop-Offs' : 'At-Risk Revenue'}</div>
        <div style={{ fontSize: '48px', fontWeight: 800, color: '#ef4444', marginTop: '16px' }}>{isRecruiting ? '5' : '$840'}</div>
      </Card>
    </div>
  </div>
);

const PolicyReviewsPage = () => (
  <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
    <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Policy Reviews</h1>
    <p style={{ color: '#64748b', marginTop: '8px', marginBottom: '32px', fontSize: '15px' }}>Manage upcoming annual and check-in policy reviews.</p>
    <Card style={{ overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
          <tr>
            <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Client Name</th>
            <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Review Type</th>
            <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Due Date</th>
            <th style={{ padding: '20px 24px', textAlign: 'right', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
            <td style={{ padding: '24px', fontWeight: 800, color: '#0f172a', fontSize: '15px' }}>Michael Sterling</td>
            <td style={{ padding: '24px', color: '#64748b', fontWeight: 600, fontSize: '14px' }}>Annual Review</td>
            <td style={{ padding: '24px', color: '#ef4444', fontWeight: 800, fontSize: '14px' }}>Oct 30, 2026</td>
            <td style={{ padding: '24px', textAlign: 'right' }}>
              <Button variant="primary">Mark Complete</Button>
            </td>
          </tr>
        </tbody>
      </table>
    </Card>
  </div>
);

const RecruitingDashboard = ({ profile }: any) => {
  const isOwner = profile?.role === 'owner';
  const dailyAppts = [{ d: 'Feb 23', v: 2 }, { d: 'Feb 24', v: 4 }, { d: 'Feb 25', v: 5 }, { d: 'Feb 26', v: 2 }];
  const weeklySplit = [{ name: 'Joined', Licensed: 6, Unlicensed: 1 }];
  const pipelineFlow = [{ name: 'Pipeline', Booked: 21, Shows: 0, Joined: 7 }];
  const cumulativeAgents = [{ d: 'Feb 23', v: 2 }, { d: 'Feb 24', v: 4 }, { d: 'Feb 25', v: 4 }, { d: 'Feb 26', v: 6 }];

  return (
    <div style={{ maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0, color: '#0f172a', letterSpacing: '-0.02em' }}>{isOwner ? 'Global Recruiting Analytics' : 'My Recruiting Pipeline'}</h1>
          <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px' }}>Live metrics synced from advertising and CRM data.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <select style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#fff', outline: 'none', fontWeight: 700, color: '#0f172a', cursor: 'pointer' }}>
            <option>Last 7 Days</option><option>Last 30 Days</option><option>Year to Date</option>
          </select>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {[ { label: 'Total Ads Spend', val: '$5,359.32', color: '#0f172a' }, { label: 'Total Appointments', val: '21', color: '#3b82f6' }, { label: 'Cost Per Action', val: '$144.09', color: '#0f172a' }, { label: 'Total Recruits Joined', val: '7', color: '#22c55e' }, { label: 'Licensed Delivered', val: '6', color: '#0f172a' }, { label: 'Licensing Success Rate', val: '85.71%', color: '#22c55e' } ].map((kpi, i) => (
          <Card key={i} style={{ padding: '24px' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{kpi.label}</div>
            <div style={{ fontSize: '28px', fontWeight: 800, marginTop: '8px', color: kpi.color }}>{kpi.val}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <Card style={{ padding: '32px', height: '350px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 24px 0', fontSize: '16px', fontWeight: 800, color: '#3b82f6', textAlign: 'center', textTransform: 'uppercase' }}>Daily Appointments Booked</h3>
          <ResponsiveContainer width="100%" height="100%"><LineChart data={dailyAppts}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" /><XAxis dataKey="d" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8', fontWeight: 600}} dy={10} /><YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8', fontWeight: 600}} domain={[0, 10]} /><Tooltip cursor={{stroke: '#e2e8f0', strokeWidth: 2}} contentStyle={{borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} /><ReferenceLine y={10} stroke="#94a3b8" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'Goal', fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} /><Line type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={4} dot={false} activeDot={{r: 6}} /></LineChart></ResponsiveContainer>
        </Card>
        <Card style={{ padding: '32px', height: '350px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 24px 0', fontSize: '16px', fontWeight: 800, color: '#3b82f6', textAlign: 'center', textTransform: 'uppercase' }}>Weekly Recruits Joined (Split)</h3>
          <ResponsiveContainer width="100%" height="100%"><BarChart data={weeklySplit}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" /><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8', fontWeight: 600}} dy={10} /><YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8', fontWeight: 600}} domain={[0, 6]} /><Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: '1px solid #e2e8f0'}} /><Legend verticalAlign="top" height={36} iconType="circle" /><Bar dataKey="Licensed" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={60} /><Bar dataKey="Unlicensed" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={60} /></BarChart></ResponsiveContainer>
        </Card>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <Card style={{ padding: '32px', height: '350px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 24px 0', fontSize: '16px', fontWeight: 800, color: '#3b82f6', textAlign: 'center', textTransform: 'uppercase' }}>Licensing Pipeline Flow</h3>
          <ResponsiveContainer width="100%" height="100%"><BarChart data={pipelineFlow}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" /><XAxis dataKey="name" axisLine={false} tickLine={false} tick={false} /><YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8', fontWeight: 600}} domain={[0, 25]} /><Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: '1px solid #e2e8f0'}} /><Legend verticalAlign="top" height={36} iconType="circle" /><Bar dataKey="Booked" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} /><Bar dataKey="Shows" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={40} /><Bar dataKey="Joined" fill="#a855f7" radius={[4, 4, 0, 0]} maxBarSize={40} /></BarChart></ResponsiveContainer>
        </Card>
        <Card style={{ padding: '32px', height: '350px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 24px 0', fontSize: '16px', fontWeight: 800, color: '#3b82f6', textAlign: 'center', textTransform: 'uppercase' }}>Cumulative Licensed Agents</h3>
          <ResponsiveContainer width="100%" height="100%"><AreaChart data={cumulativeAgents}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" /><defs><linearGradient id="colorCum" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient></defs><XAxis dataKey="d" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8', fontWeight: 600}} dy={10} /><YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8', fontWeight: 600}} domain={[0, 6]} /><Tooltip cursor={{stroke: '#e2e8f0', strokeWidth: 2}} contentStyle={{borderRadius: '8px', border: '1px solid #e2e8f0'}} /><Area type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={4} fill="url(#colorCum)" activeDot={{r: 6}} /></AreaChart></ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

const RetentionDashboard = ({ profile }: any) => {
  const isOwner = profile?.role === 'owner';
  const policyStatusData = [ { name: 'Active', value: 100, color: '#22c55e' } ];
  const pipelineStageData = [ { name: 'IUL Confirmed', count: 5 } ];
  const agentPerformance = [ { id: 1, name: 'Jawad Alawieh', failed: 0, pending: 0, active: 1, premium: '$200', time: '1 Day' }, { id: 2, name: 'Sarah Jenkins', failed: 0, pending: 0, active: 4, premium: '$850', time: '2 Days' } ];
  const atRiskData = [ { id: 1, fName: 'Michael', lName: 'Sterling', email: 'michael@sterling.com', phone: '(555) 234-5678', days: '0 (Review Due)' } ];

  return (
    <div style={{ maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div><h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0, color: '#0f172a', letterSpacing: '-0.02em' }}>{isOwner ? 'IUL Retention Dashboard' : 'My Retention Dashboard'}</h1><p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px' }}>Track active clients, policy health, and upcoming reviews.</p></div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <select style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#fff', outline: 'none', fontWeight: 700, color: '#0f172a', cursor: 'pointer' }}>
            <option>Last 7 Days</option><option>Last 30 Days</option><option>Year to Date</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {[ { label: 'Active Policies', val: '1', color: '#22c55e' }, { label: 'Retention %', val: '100.00%', color: '#d97706' }, { label: 'Total Monthly Revenue', val: '$200', color: '#0f172a' }, { label: 'Pending Payments', val: '0', color: '#f59e0b' }, { label: 'Failed Payments', val: '0', color: '#ef4444' } ].map((kpi, i) => (
          <Card key={i} style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{kpi.label}</div>
            <div style={{ fontSize: '32px', fontWeight: 800, marginTop: '12px', color: kpi.color }}>{kpi.val}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '24px', marginBottom: '24px' }}>
        <Card style={{ padding: '32px', height: '350px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 24px 0', fontSize: '16px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase' }}>Policy Status Breakdown</h3>
          <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={policyStatusData} innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="value" stroke="none">{policyStatusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}</Pie><Tooltip contentStyle={{borderRadius: '8px', border: '1px solid #e2e8f0'}} /></PieChart></ResponsiveContainer>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontWeight: 800, fontSize: '24px', color: '#0f172a' }}>100%</div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', fontWeight: 700, color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }}/> Active</div>
        </Card>
        <Card style={{ padding: '32px', height: '350px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 24px 0', fontSize: '16px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase' }}>Policies by Pipeline Stage</h3>
          <ResponsiveContainer width="100%" height="100%"><BarChart data={pipelineStageData}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" /><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 13, fill: '#64748b', fontWeight: 700}} dy={10} /><YAxis axisLine={false} tickLine={false} tick={{fontSize: 13, fill: '#94a3b8', fontWeight: 600}} domain={[0, 6]} /><Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: '1px solid #e2e8f0'}} /><Bar dataKey="count" fill="#e2e8f0" radius={[4, 4, 0, 0]} maxBarSize={100} /></BarChart></ResponsiveContainer>
        </Card>
      </div>

      <Card style={{ marginBottom: '24px', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}><h3 style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase' }}>Agent Performance</h3></div>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#fff' }}>
              <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Contact Owner</th>
              <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', textAlign: 'right' }}>Failed Payments</th>
              <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', textAlign: 'right' }}>Pending Payment</th>
              <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', textAlign: 'right' }}>Active Policies</th>
              <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', textAlign: 'right' }}>Monthly Premium</th>
              <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', textAlign: 'right' }}>Time to Activate</th>
            </tr>
          </thead>
          <tbody>
            {agentPerformance.map((a, idx) => (
              <tr key={a.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '20px 24px', fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>{idx + 1}. {a.name}</td>
                <td style={{ padding: '20px 24px', textAlign: 'right', fontWeight: 600, color: '#475569' }}>{a.failed}</td>
                <td style={{ padding: '20px 24px', textAlign: 'right', fontWeight: 600, color: '#475569' }}>{a.pending}</td>
                <td style={{ padding: '20px 24px', textAlign: 'right', fontWeight: 600, color: '#475569' }}>{a.active}</td>
                <td style={{ padding: '20px 24px', textAlign: 'right', fontWeight: 600, color: '#475569' }}>{a.premium}</td>
                <td style={{ padding: '20px 24px', textAlign: 'right', fontWeight: 600, color: '#475569' }}>{a.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #fca5a5', boxShadow: '0 4px 6px -1px rgba(239,68,68,0.1)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #fca5a5', background: '#fef2f2', display: 'flex', alignItems: 'center', gap: '10px' }}><Ic n="alert" color="#ef4444" /><h3 style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#991b1b', textTransform: 'uppercase' }}>ACTION REQUIRED: At-Risk and Late Policies</h3></div>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#fff' }}>
              <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>First Name</th><th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Last Name</th><th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Email</th><th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Phone</th><th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', textAlign: 'right' }}>Days Overdue</th>
            </tr>
          </thead>
          <tbody>
            {atRiskData.map(r => (
              <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '20px 24px', fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>{r.fName}</td><td style={{ padding: '20px 24px', fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>{r.lName}</td><td style={{ padding: '20px 24px', color: '#475569', fontSize: '14px' }}>{r.email}</td><td style={{ padding: '20px 24px', color: '#475569', fontSize: '14px' }}>{r.phone}</td><td style={{ padding: '20px 24px', textAlign: 'right', fontWeight: 800, color: '#ef4444', fontSize: '14px' }}>{r.days}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const GhlAccountView = ({ profile, setProfile, isEmployee }: any) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const handleConnectCalendar = async () => { alert("Google Calendar Integration initiated."); };
  const handleAvatarClick = () => { fileInputRef.current?.click(); };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => { if (event.target.files?.[0]) setAvatarFile(event.target.files[0]); };

  const handleUpdateProfile = async () => {
    if (!profile?.id) return;
    setUploading(true);
    try {
      let finalAvatarUrl = profile.avatar_url;
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `public/${profile.id}/${fileName}`;
        let { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, avatarFile);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
        finalAvatarUrl = publicUrl;
      }
      const { error: updateError } = await supabase.from('profiles').update({ avatar_url: finalAvatarUrl }).eq('id', profile.id);
      if (updateError) throw updateError;
      setProfile({ ...profile, avatar_url: finalAvatarUrl });
      alert('Profile updated successfully!');
      setAvatarFile(null);
    } catch (error: any) { alert('Error updating profile: ' + error.message); } finally { setUploading(false); }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0, color: '#0f172a', letterSpacing: '-0.02em' }}>Account Settings</h1>
      <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px', marginBottom: '32px' }}>Manage your profile data, integrations, and security.</p>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px' }}>
        <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <Card style={{ padding: '40px' }}>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>Personal Data</h3>
            <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', alignItems: 'center' }}>
              <div onClick={handleAvatarClick} style={{ width: 96, height: 96, borderRadius: '50%', background: '#f8fafc', border: '2px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', cursor: 'pointer', overflow: 'hidden' }}>
                {avatarFile ? (<img src={URL.createObjectURL(avatarFile)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />) : profile?.avatar_url ? (<img src={profile.avatar_url} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />) : (<Ic n="camera" s={28} />)}
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '16px', color: '#0f172a' }}>Profile Image</div>
                <div style={{ color: '#64748b', fontSize: '14px', marginTop: '6px', lineHeight: '1.5' }}>Click image to select a new file.<br/>Recommended size is 512x512px.</div>
              </div>
            </div>
            <Input label="Full Name" value={profile?.full_name} readOnly />
            <Input label="Email Address" value={profile?.email} readOnly />
            <Button variant="primary" onClick={handleUpdateProfile} style={{marginTop: '16px'}}>{uploading ? 'Updating...' : 'Update Profile'}</Button>
          </Card>
        </div>

        <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <Card style={{ padding: '40px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>Calendar Integration</h3>
            <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '32px', lineHeight: '1.6' }}>Connect your Google Workspace to sync your calendar and generate Meet links for client calls.</p>
            <Button variant="outline" onClick={handleConnectCalendar} style={{ width: '100%', padding: '16px' }}>
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{width: 20}}/> Connect Google Account
            </Button>
          </Card>

          <Card style={{ padding: '40px' }}>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>Change Password</h3>
            <Input label="Current Password" type="password" placeholder="••••••••" />
            <Input label="New Password" type="password" placeholder="••••••••" />
            <Button variant="primary" style={{ width: '100%' }}>Update Password</Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
// ─── 10. MAIN APP ROOT & ROUTING ────────────────────────────────────────────

const ChatUI = ({ messages, onSend, onClose }: any) => {
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  const handleSend = () => { if (!input.trim()) return; onSend(input); setInput(''); };

  return (
    <div style={{ position: 'fixed', bottom: '100px', right: '40px', width: '380px', height: '540px', background: '#fff', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', zIndex: 10000, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
        <div style={{ fontWeight: 800, fontSize: '16px', display: 'flex', alignItems: 'center', gap: 12, color: '#0f172a' }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e' }} /> ConnectAI Support
        </div>
        <button onClick={onClose} style={{ border: 'none', background: 'none', color: '#64748b', cursor: 'pointer', fontSize: '28px', lineHeight: 1 }}>×</button>
      </div>
      <div style={{ flex: 1, padding: '24px', background: '#f8fafc', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {messages.map((msg: any, i: number) => (
          <div key={i} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', background: msg.role === 'user' ? '#0f172a' : '#fff', color: msg.role === 'user' ? '#fff' : '#0f172a', padding: '14px 20px', borderRadius: msg.role === 'user' ? '20px 20px 0 20px' : '0 20px 20px 20px', border: msg.role === 'user' ? 'none' : '1px solid #e2e8f0', maxWidth: '85%', fontSize: '14px', lineHeight: '1.6', boxShadow: msg.role === 'user' ? 'none' : '0 2px 4px rgba(0,0,0,0.05)' }}>
            {msg.text}
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div style={{ padding: '20px', background: '#fff', borderTop: '1px solid #f1f5f9', display: 'flex', gap: 12 }}>
        <input placeholder="Type a message..." style={{ flex: 1, padding: '16px 20px', borderRadius: '16px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px', color: '#0f172a', background: '#f8fafc' }} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} />
        <button onClick={handleSend} style={{ background: '#0f172a', color: '#fff', border: 'none', width: '52px', height: '52px', borderRadius: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Ic n="send" s={20}/></button>
      </div>
    </div>
  );
};

export default function Portal() {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  // App & Routing State
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEmployee, setIsEmployee] = useState(false);
  const [activeSystem, setActiveSystem] = useState('retention');
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Interactions
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [isBotOpen, setIsBotOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([{ role: 'bot', text: 'Hi! I am your ConnectAI assistant. How can I help you navigate your portal today?' }]);
  
  // Login State
  const [isTeamLogin, setIsTeamLogin] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [reg, setReg] = useState({ fName: '', lName: '', phone: '', company: '', system: 'recruiting', role: 'agent' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session) {
        const { data: prof } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        if (prof) {
            setProfile(prof);
            setActiveSystem(prof.client_type === 'recruiting' ? 'recruiting' : 'retention');
            const { data: team } = await supabase.from('internal_team').select('*').eq('user_id', session.user.id).single();
            if (team) {
              setIsEmployee(true);
              if (team.is_admin) { setIsAdmin(true); setActiveTab('admin_dashboard'); } 
              else { setActiveTab('employee_dashboard'); }
            } else if (prof.client_type !== 'recruiting') {
              setActiveTab('pipeline');
            }
        }
      }
    };
    init();
  }, []);

  const handleSendMessage = (text: string) => { 
    setChatHistory(prev => [...prev, { role: 'user', text }]); 
    setTimeout(() => { setChatHistory(prev => [...prev, { role: 'bot', text: "I'm your ConnectAI assistant. I am analyzing your request now." }]); }, 800); 
  };

  const handleSignOut = async () => { await supabase.auth.signOut(); window.location.reload(); };

  // ─── LOGIN SCREEN ───
  if (!session) {
    return (
      <div style={{ display: 'flex', width: '100vw', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', color: '#fff', fontFamily: "'Inter', sans-serif" }}>
        <div style={{ width: '100%', maxWidth: isSignUp ? '540px' : '400px', padding: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '40px' }}>
            <button onClick={() => setIsTeamLogin(false)} style={{ background: 'none', border: 'none', color: !isTeamLogin ? '#fff' : '#64748b', fontWeight: 800, borderBottom: !isTeamLogin ? '2px solid #22c55e' : '2px solid transparent', paddingBottom: '8px', cursor: 'pointer', fontSize: '15px' }}>Client Login</button>
            <button onClick={() => setIsTeamLogin(true)} style={{ background: 'none', border: 'none', color: isTeamLogin ? '#fff' : '#64748b', fontWeight: 800, borderBottom: isTeamLogin ? '2px solid #22c55e' : '2px solid transparent', paddingBottom: '8px', cursor: 'pointer', fontSize: '15px' }}>Team Login</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '48px' }}><img src={typeof logoImg === 'string' ? logoImg : (logoImg as any).src} alt="" style={{ width: 34 }} /><span style={{ fontWeight: 800, fontSize: '26px' }}>Connect</span></div>
          <h1 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '8px' }}>{isSignUp ? 'Create an account' : (isTeamLogin ? 'Connect Team Login' : 'Welcome back')}</h1>
          <p style={{ color: '#94a3b8', marginBottom: '40px', fontSize: '15px' }}>
            {isSignUp ? 'Sign up to access your portal.' : 'Sign in to your account to continue.'} <br/>
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "} <span onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(''); }} style={{ color: '#22c55e', cursor: 'pointer', fontWeight: 600 }}>{isSignUp ? 'Sign in' : 'Create one'}</span>
          </p>
          <form onSubmit={async (e) => {
            e.preventDefault(); setErrorMsg(''); setLoading(true);
            if (isSignUp) {
              const { data, error } = await supabase.auth.signUp({ email, password: pass });
              if (data.user) {
                await supabase.from('profiles').insert([{ id: data.user.id, email, full_name: `${reg.fName} ${reg.lName}`, first_name: reg.fName, last_name: reg.lName, phone: reg.phone, company_name: reg.company, client_type: reg.system, role: reg.role, is_verified: false }]);
                alert("Account created! Approval pending."); window.location.reload();
              } else if (error) setErrorMsg(error.message);
            } else {
              const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
              if (error) setErrorMsg(error.message); else window.location.reload();
            }
            setLoading(false);
          }}>
            {isSignUp && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <input placeholder="First Name" style={{ width: '100%', padding: '14px', background: '#1a1a1a', border: '1px solid #2d2d2d', color: '#fff', borderRadius: '10px', outline: 'none' }} value={reg.fName} onChange={e => setReg({...reg, fName: e.target.value})} required />
                <input placeholder="Last Name" style={{ width: '100%', padding: '14px', background: '#1a1a1a', border: '1px solid #2d2d2d', color: '#fff', borderRadius: '10px', outline: 'none' }} value={reg.lName} onChange={e => setReg({...reg, lName: e.target.value})} required />
                <input placeholder="Phone Number" style={{ gridColumn: 'span 2', padding: '14px', background: '#1a1a1a', border: '1px solid #2d2d2d', color: '#fff', borderRadius: '10px', outline: 'none' }} value={reg.phone} onChange={e => setReg({...reg, phone: e.target.value})} required />
                <input placeholder="Company Name" style={{ gridColumn: 'span 2', padding: '14px', background: '#1a1a1a', border: '1px solid #2d2d2d', color: '#fff', borderRadius: '10px', outline: 'none' }} value={reg.company} onChange={e => setReg({...reg, company: e.target.value})} required />
                <div style={{gridColumn: 'span 1'}}><label style={{fontSize: '10px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px', display: 'block'}}>System Access</label>
                  <select style={{ width: '100%', padding: '14px', background: '#1a1a1a', border: '1px solid #2d2d2d', color: '#fff', borderRadius: '10px', outline: 'none' }} value={reg.system} onChange={e => setReg({...reg, system: e.target.value})}><option value="recruiting">Recruiting</option><option value="retention">Retention</option></select>
                </div>
                <div style={{gridColumn: 'span 1'}}><label style={{fontSize: '10px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px', display: 'block'}}>Account Role</label>
                  <select style={{ width: '100%', padding: '14px', background: '#1a1a1a', border: '1px solid #2d2d2d', color: '#fff', borderRadius: '10px', outline: 'none' }} value={reg.role} onChange={e => setReg({...reg, role: e.target.value})}><option value="agent">Agent</option><option value="owner">Agency Owner</option></select>
                </div>
              </div>
            )}
            <input placeholder="Email Address" type="email" style={{ width: '100%', boxSizing: 'border-box', padding: '16px', background: '#1a1a1a', border: '1px solid #2d2d2d', color: '#fff', borderRadius: '10px', marginBottom: '16px', outline: 'none' }} value={email} onChange={e => setEmail(e.target.value)} required />
            <input placeholder="Password" type="password" style={{ width: '100%', boxSizing: 'border-box', padding: '16px', background: '#1a1a1a', border: '1px solid #2d2d2d', color: '#fff', borderRadius: '10px', marginBottom: '24px', outline: 'none' }} value={pass} onChange={e => setPass(e.target.value)} required />
            {errorMsg && <p style={{ color: '#ef4444', fontSize: '13px', margin: '0 0 16px 0' }}>{errorMsg}</p>}
            <button type="submit" disabled={loading} style={{ width: '100%', background: '#22c55e', color: '#fff', padding: '16px', borderRadius: '10px', fontWeight: 800, border: 'none', cursor: 'pointer' }}>{loading ? 'Processing...' : (isSignUp ? 'Submit Registration' : 'Sign In')}</button>
          </form>
        </div>
      </div>
    );
  }

  // ─── VERIFICATION WALL ───
  if (profile && !profile.is_verified && !isAdmin) {
    return (
      <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
        <div style={{ textAlign: 'center', maxWidth: '480px', padding: '60px', background: '#fff', borderRadius: '32px', border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)' }}>
          <div style={{ color: '#f59e0b', marginBottom: '24px', display: 'flex', justifyContent: 'center' }}><Ic n="shield" s={72} /></div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a', margin: '0 0 16px 0' }}>Verification Pending</h1>
          <p style={{ color: '#64748b', lineHeight: 1.6, margin: 0, fontSize: '16px' }}>Hi <strong>{profile.full_name}</strong>! Your registration has been submitted. To maintain security, an administrator must verify your company details before you can access the system.</p>
          <button onClick={handleSignOut} style={{ marginTop: '40px', background: '#f1f5f9', color: '#475569', border: 'none', padding: '14px 32px', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', fontSize: '15px' }}>Back to Login</button>
        </div>
      </div>
    );
  }

  // ─── NAVIGATION LOGIC ───
  const getNavItems = () => {
    if (isAdmin) return [
      { id: 'admin_dashboard', label: 'HQ Command', icon: 'home' }, { id: 'companies', label: 'Client Companies', icon: 'briefcase' },
      { id: 'team_management', label: 'Team Management', icon: 'settings' }, { id: 'verify', label: 'Verification Queue', icon: 'shield' },
    ];
    if (isEmployee) return [
      { id: 'employee_dashboard', label: 'My Dashboard', icon: 'home' }, { id: 'team', label: 'Internal Team', icon: 'chat' }
    ];
    let items = [];
    
    // Core SaaS Views
    items.push({ id: 'dashboard', label: profile?.role === 'owner' ? 'Company Overview' : 'Overview', icon: 'home' });
    items.push({ id: 'pipeline', label: 'Kanban Pipeline', icon: 'trending' });
    if (activeSystem !== 'recruiting') items.push({ id: 'leads', label: 'Leads Table', icon: 'leads' });
    items.push({ id: 'directory', label: 'Client Directory', icon: 'users' });
    items.push({ id: 'broadcast', label: 'Broadcast Center', icon: 'send' });
    items.push({ id: 'calendar', label: 'Calendar', icon: 'calendar' });
    
    // Admin/Settings
    if (profile?.role === 'owner') items.push({ id: 'forecast', label: activeSystem === 'recruiting' ? 'Recruiting Forecast' : 'Revenue Forecast', icon: 'trending' });
    if (activeSystem !== 'recruiting') items.push({ id: 'reviews', label: 'Policy Reviews', icon: 'check' });
    items.push({ id: 'forms', label: 'Internal Forms', icon: 'forms' });
    items.push({ id: 'integrations', label: 'Integration Hub', icon: 'plug' });
    items.push({ id: 'notifications', label: 'Notifications', icon: 'bell' });
    items.push({ id: 'account', label: 'Account Settings', icon: 'user' });
    return items;
  };

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', fontFamily: "'Inter', sans-serif", background: '#f8fafc', overflow: 'hidden' }}>
      <style>{`.ni { display:flex; align-items:center; gap:14px; padding:16px 20px; border-radius:12px; color:#64748b; font-size:15px; font-weight:600; cursor:pointer; border:none; background:none; width:100%; text-align:left; transition:0.2s; margin-bottom: 6px; } .ni:hover { background:#f1f5f9; color:#0f172a; } .ni.on { background:#0f172a !important; color:#fff !important; font-weight: 700; }`}</style>
      
      {/* GLOBAL SIDEBAR */}
      <aside style={{ width: '280px', background: '#fff', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', padding: '32px 20px', zIndex: 200 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px', padding: '0 8px' }}>
          <img src={typeof logoImg === 'string' ? logoImg : (logoImg as any).src} style={{width:32}} alt="Logo"/>
          <span style={{fontWeight:800, fontSize:'24px', color: '#0f172a', letterSpacing: '-0.02em'}}>Connect</span>
        </div>
        <div style={{ marginBottom: '16px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', paddingLeft: '8px' }}>Main Menu</div>
        <nav style={{ flex: 1, overflowY: 'auto' }}>
            {getNavItems().map(item => (<button key={item.id} className={`ni ${activeTab === item.id ? 'on' : ''}`} onClick={() => setActiveTab(item.id)}><Ic n={item.icon} /> {item.label}</button>))}
        </nav>
        <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid #e2e8f0' }}>
          <button onClick={handleSignOut} className="ni" style={{ color: '#ef4444' }}><Ic n="out" /> Sign Out</button>
        </div>
      </aside>

      {/* MAIN APPLICATION SHELL */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <TopBar profile={profile} activeSystem={activeSystem} setShowWorkspaceMenu={setShowWorkspaceMenu} showWorkspaceMenu={showWorkspaceMenu} toggleBot={() => setIsBotOpen(!isBotOpen)} />
        
        <main style={{ flex: 1, padding: '40px 60px', overflowY: 'auto' }}>
          
          {isAdmin && activeTab === 'admin_dashboard' && <AdminSalesDashboard />}
          {isAdmin && activeTab === 'companies' && <AdminCompaniesView />}
          {isAdmin && activeTab === 'team_management' && <AdminTeamManagementView />}
          {isAdmin && activeTab === 'verify' && <VerificationQueue />}
          
          {isEmployee && !isAdmin && activeTab === 'employee_dashboard' && <EmployeeDashboard profile={profile} />}
          {isEmployee && !isAdmin && activeTab === 'team' && <InternalTeamHub profile={profile} />}
          
          {/* CLIENT VIEWS */}
          {!isEmployee && activeTab === 'dashboard' && (activeSystem === 'recruiting' ? <RecruitingDashboard profile={profile} /> : <RetentionDashboard profile={profile} />)}
          {!isEmployee && activeTab === 'pipeline' && <KanbanPipelineView />}
          {!isEmployee && activeTab === 'leads' && <LeadsView />}
          {!isEmployee && activeTab === 'directory' && <ContactsDirectory />}
          {!isEmployee && activeTab === 'broadcast' && <BroadcastCenter />}
          {!isEmployee && activeTab === 'calendar' && <CalendarView isRecruiting={activeSystem === 'recruiting'} />}
          {!isEmployee && activeTab === 'forms' && <InternalFormsView />}
          {!isEmployee && activeTab === 'integrations' && <IntegrationHubView />}
          {!isEmployee && activeTab === 'notifications' && <NotificationsView />}
          {!isEmployee && activeTab === 'forecast' && <ForecastingPage isRecruiting={activeSystem === 'recruiting'} />}
          {!isEmployee && activeTab === 'reviews' && <PolicyReviewsPage />}
          
          {activeTab === 'account' && <GhlAccountView profile={profile} setProfile={setProfile} isEmployee={isEmployee} />}
        </main>
      </div>

      {/* FLOATING AI SUPPORT BOT */}
      {!isEmployee && isBotOpen && <ChatUI messages={chatHistory} onSend={handleSendMessage} onClose={() => setIsBotOpen(false)} />}
      {!isEmployee && !isBotOpen && (
        <div onClick={() => setIsBotOpen(true)} style={{ position: 'fixed', bottom: '40px', right: '40px', width: '64px', height: '64px', background: '#0f172a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer', boxShadow: '0 12px 30px rgba(15,23,42,0.4)', zIndex: 10001, transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
          <Ic n="chat" s={28} />
        </div>
      )}
    </div>
  );
}
