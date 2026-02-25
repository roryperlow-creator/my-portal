'use client';
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabase';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, LineChart, Line } from 'recharts';
import { v4 as uuidv4 } from 'uuid';
import logoImg from './logo.png';

// ─── UNIFIED ICON SYSTEM ────────────────────────────────────────────────────
const Ic = ({ n, s = 20 }: { n: string, s?: number }) => {
  const p = { width: s, height: s, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
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
    fire: <svg {...p}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>
  };
  return <>{icons[n] || null}</>;
};

// ============================================================================
// 1. EXTENSIVE ADMIN HEADQUARTERS VIEWS (God Mode Only)
// ============================================================================

const AdminSalesDashboard = () => {
  const revData = [
    { month: 'Jan', revenue: 25000, deals: 12 }, { month: 'Feb', revenue: 28500, deals: 15 },
    { month: 'Mar', revenue: 34000, deals: 22 }, { month: 'Apr', revenue: 38200, deals: 18 },
    { month: 'May', revenue: 42500, deals: 26 }, { month: 'Jun', revenue: 48000, deals: 31 }
  ];

  return (
    <div style={{ maxWidth: '1400px', width: '100%' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0, color: '#0f172a', letterSpacing: '-0.02em' }}>Connect HQ Overview</h1>
      <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px', marginBottom: '32px' }}>Your internal sales, global revenue, and platform health.</p>
      
      {/* KPI METRICS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {[ 
          { l: 'Global MRR', v: '$48,000', c: '#22c55e' }, 
          { l: 'Active Agency Clients', v: '24', c: '#0f172a' }, 
          { l: 'New Deals (This Month)', v: '4', c: '#3b82f6' }, 
          { l: 'Pending Onboarding', v: '2', c: '#f59e0b' } 
        ].map((k, i) => (
          <div key={i} style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k.l}</div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: k.c, marginTop: '12px' }}>{k.v}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
        {/* REVENUE CHART */}
        <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', height: '360px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>Platform Revenue Growth</h3>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8', fontWeight: 600}} />
                <Tooltip cursor={{stroke: '#e2e8f0', strokeWidth: 2, strokeDasharray: '4 4'}} contentStyle={{borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} />
                <Area type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={4} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ACTIVE SALES PIPELINE */}
        <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', height: '360px', overflowY: 'auto' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>Sales Pipeline</h3>
          
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>Demos Scheduled (4)</div>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Apex Partners <span style={{ float: 'right', color: '#3b82f6' }}>Today</span></div>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', fontWeight: 600 }}>Horizon Life <span style={{ float: 'right', color: '#3b82f6' }}>Tomorrow</span></div>
          </div>

          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>Closing / Contract Sent (2)</div>
            <div style={{ background: '#fffbeb', padding: '12px', borderRadius: '8px', border: '1px solid #fde68a', color: '#92400e', fontSize: '14px', fontWeight: 600 }}>Vanguard Financial</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// NEW: ADMIN VERIFICATION QUEUE
const VerificationQueue = () => {
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);

  const fetchPending = async () => {
    const { data } = await supabase.from('profiles').select('*').eq('is_verified', false);
    if (data) setPendingUsers(data);
  };

  useEffect(() => { fetchPending(); }, []);

  const approveUser = async (id: string) => {
    const { error } = await supabase.from('profiles').update({ is_verified: true }).eq('id', id);
    if (!error) fetchPending();
  };

  return (
    <div style={{ maxWidth: '1200px', width: '100%' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0, color: '#0f172a' }}>Verification Queue</h1>
      <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px', marginBottom: '32px' }}>Review and approve new agency accounts.</p>
      
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>User / Email</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Company / System</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Role</th>
              <th style={{ padding: '16px 24px', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingUsers.length === 0 && <tr><td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>No pending accounts to verify.</td></tr>}
            {pendingUsers.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '20px 24px' }}>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{u.full_name}</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{u.email} • {u.phone}</div>
                </td>
                <td style={{ padding: '20px 24px' }}>
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>{u.company_name}</div>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#3b82f6', fontWeight: 800, marginTop: '4px' }}>{u.client_type}</div>
                </td>
                <td style={{ padding: '20px 24px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, textTransform: 'capitalize', color: '#0f172a' }}>{u.role}</span>
                </td>
                <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                  <button onClick={() => approveUser(u.id)} style={{ background: '#22c55e', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>Verify Access</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AdminCalendarView = () => (
  <div style={{ maxWidth: '1200px', width: '100%' }}>
    <h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0, color: '#0f172a' }}>Sales Appointments</h1>
    <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px', marginBottom: '32px' }}>Upcoming prospect demos and client onboarding calls.</p>
    <div style={{ background: '#fff', padding: '60px 40px', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#64748b' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}><Ic n="calendar" s={48} /></div>
      <h3 style={{ margin: '0 0 8px 0', color: '#0f172a', fontSize: '20px', fontWeight: 800 }}>Google Calendar Sync Active</h3>
      <p style={{ maxWidth: '400px', margin: '0 auto', lineHeight: '1.6' }}>Your upcoming sales calls and product demos will automatically map here. (Demo Mockup)</p>
    </div>
  </div>
);

const AdminContactsView = () => (
  <div style={{ maxWidth: '1200px', width: '100%' }}>
    <h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0, color: '#0f172a' }}>Prospects & Clients</h1>
    <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px', marginBottom: '32px' }}>Manage your agency leads and active client roster.</p>
    <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Agency / Prospect Name</th>
            <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Status</th>
            <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Last Contact</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
            <td style={{ padding: '20px 24px', fontWeight: 700, color: '#0f172a' }}>
              Sterling Financial Group
              <div style={{fontSize:'13px', color:'#64748b', fontWeight:500, marginTop:4}}>michael@sterling.com</div>
            </td>
            <td style={{ padding: '20px 24px' }}><span style={{ background: '#f0fdf4', color: '#16a34a', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>Active Client</span></td>
            <td style={{ padding: '20px 24px', color: '#475569', fontSize: '14px', fontWeight: 500 }}>2 days ago</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
            <td style={{ padding: '20px 24px', fontWeight: 700, color: '#0f172a' }}>
              Apex Insurance Partners
              <div style={{fontSize:'13px', color:'#64748b', fontWeight:500, marginTop:4}}>sarah@apexins.com</div>
            </td>
            <td style={{ padding: '20px 24px' }}><span style={{ background: '#fffbeb', color: '#d97706', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>Demo Scheduled</span></td>
            <td style={{ padding: '20px 24px', color: '#475569', fontSize: '14px', fontWeight: 500 }}>Today</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

const AdminCompaniesView = ({ onSelectCompany }: any) => {
  const [companies, setCompanies] = useState<any[]>([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      const { data } = await supabase.from('companies').select('*');
      if (data) setCompanies(data);
    };
    fetchCompanies();
  }, []);

  return (
    <div style={{ maxWidth: '1200px', width: '100%' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0, color: '#0f172a' }}>Client Companies</h1>
      <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px', marginBottom: '32px' }}>Click a company to view their live metrics and team dashboards.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {companies.length === 0 ? (
           <div style={{ padding: '60px 40px', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', color: '#64748b', textAlign: 'center', gridColumn: '1 / -1', fontSize: '15px' }}>
             No companies found. Create your first client in Supabase!
           </div>
        ) : companies.map(company => (
          <div key={company.id} onClick={() => onSelectCompany(company)} style={{ background: '#fff', padding: '32px', borderRadius: '20px', border: '1px solid #e2e8f0', cursor: 'pointer', transition: '0.2s', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }} onMouseOver={e => e.currentTarget.style.borderColor = '#22c55e'} onMouseOut={e => e.currentTarget.style.borderColor = '#e2e8f0'}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ width: 48, height: 48, borderRadius: '12px', background: '#f0fdf4', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 800 }}>
                {company.name.charAt(0)}
              </div>
              <span style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', background: company.status === 'active' ? '#f0fdf4' : '#fef2f2', color: company.status === 'active' ? '#16a34a' : '#ef4444', height: 'fit-content' }}>
                {company.status}
              </span>
            </div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>{company.name}</h3>
            <p style={{ margin: 0, fontSize: '14px', color: '#64748b', fontWeight: 500 }}>System Access: <span style={{ textTransform: 'capitalize', fontWeight: 700, color: '#0f172a' }}>{company.subscription_type}</span></p>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminTeamManagementView = () => {
  const [team, setTeam] = useState<any[]>([]);

  const fetchTeam = async () => {
    const { data } = await supabase.from('internal_team').select('*, profiles(full_name, email)');
    if (data) setTeam(data);
  };

  useEffect(() => { fetchTeam(); }, []);

  const handleToggle = async (userId: string, field: string, currentValue: boolean) => {
    const { error } = await supabase.from('internal_team').update({ [field]: !currentValue }).eq('user_id', userId);
    if (!error) fetchTeam();
  };

  return (
    <div style={{ maxWidth: '1400px', width: '100%' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0, color: '#0f172a' }}>Employee Management</h1>
      <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px', marginBottom: '32px' }}>Manage roles, access, and permissions for your internal team.</p>
      
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Employee</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Role</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', textAlign: 'center' }}>Conversations</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', textAlign: 'center' }}>Calendar</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', textAlign: 'center' }}>Contacts</th>
            </tr>
          </thead>
          <tbody>
            {team.map(member => (
              <tr key={member.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '20px 24px', fontWeight: 700, color: '#0f172a' }}>
                  {member.profiles?.full_name}
                  <div style={{fontSize:'13px', color:'#64748b', fontWeight:500, marginTop: '4px'}}>{member.profiles?.email}</div>
                </td>
                <td style={{ padding: '20px 24px' }}>
                  <span style={{ background: member.is_admin ? '#f0fdf4' : '#eff6ff', color: member.is_admin ? '#16a34a' : '#1e40af', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>
                    {member.is_admin ? 'Super Admin' : 'Employee'}
                  </span>
                </td>
                <td style={{ padding: '20px 24px', textAlign: 'center' }}>
                  <input type="checkbox" disabled={member.is_admin} checked={member.can_see_conversations || false} onChange={() => handleToggle(member.user_id, 'can_see_conversations', member.can_see_conversations)} style={{ width: 18, height: 18, cursor: member.is_admin ? 'not-allowed' : 'pointer' }} />
                </td>
                <td style={{ padding: '20px 24px', textAlign: 'center' }}>
                  <input type="checkbox" disabled={member.is_admin} checked={member.can_see_calendar || false} onChange={() => handleToggle(member.user_id, 'can_see_calendar', member.can_see_calendar)} style={{ width: 18, height: 18, cursor: member.is_admin ? 'not-allowed' : 'pointer' }} />
                </td>
                <td style={{ padding: '20px 24px', textAlign: 'center' }}>
                  <input type="checkbox" disabled={member.is_admin} checked={member.can_see_contacts || false} onChange={() => handleToggle(member.user_id, 'can_see_contacts', member.can_see_contacts)} style={{ width: 18, height: 18, cursor: member.is_admin ? 'not-allowed' : 'pointer' }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============================================================================
// 2. EMPLOYEE VIEWS (Operations, Support, General Staff)
// ============================================================================

const EmployeeDashboard = ({ profile }: any) => (
  <div style={{ maxWidth: '1400px', width: '100%' }}>
    <h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0, color: '#0f172a' }}>Welcome, {profile?.full_name || 'Team Member'}</h1>
    <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px', marginBottom: '32px' }}>Here is your daily task overview and active tickets.</p>
    
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
      {[ 
        { l: 'Open Support Tickets', v: '4', c: '#ef4444' }, 
        { l: 'Tasks Pending', v: '12', c: '#f59e0b' }, 
        { l: 'Clients Onboarded', v: '2', c: '#22c55e' } 
      ].map((k, i) => (
        <div key={i} style={{ background: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k.l}</div>
          <div style={{ fontSize: '40px', fontWeight: 800, color: k.c, marginTop: '12px' }}>{k.v}</div>
        </div>
      ))}
    </div>
  </div>
);

const EmployeeConversationsView = () => (
  <div style={{ display: 'flex', height: 'calc(100vh - 160px)', background: '#fff', borderRadius: '24px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
    <aside style={{ width: '320px', borderRight: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0', background: '#fff' }}>
        <h3 style={{ margin: '0', fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>Inbox</h3>
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', background: '#eff6ff', cursor: 'pointer', borderLeft: '4px solid #3b82f6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '15px' }}>John Smith</span>
            <span style={{ fontSize: '11px', color: '#3b82f6', fontWeight: 700, textTransform: 'uppercase' }}>SMS</span>
          </div>
          <div style={{ fontSize: '13px', color: '#475569', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 500 }}>Can we reschedule our call?</div>
        </div>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', cursor: 'pointer', background: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '15px' }}>Sarah Jenkins</span>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Email</span>
          </div>
          <div style={{ fontSize: '13px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Attached are my documents.</div>
        </div>
      </div>
    </aside>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <div style={{ padding: '24px 32px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '20px' }}>John Smith</div>
        <span style={{ fontSize: '12px', background: '#f0fdf4', color: '#16a34a', padding: '6px 12px', borderRadius: '20px', fontWeight: 700 }}>SMS Active</span>
      </div>
      <div style={{ flex: 1, padding: '32px', overflowY: 'auto', background: '#f8fafc' }}>
        <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '12px', marginBottom: '24px', fontWeight: 600 }}>Today 9:41 AM</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: '#fff', padding: '16px 20px', borderRadius: '0 16px 16px 16px', border: '1px solid #e2e8f0', maxWidth: '60%', fontSize: '15px', color: '#0f172a', lineHeight: '1.5', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            Hi there, can we reschedule our call to tomorrow?
          </div>
        </div>
      </div>
      <div style={{ padding: '24px 32px', background: '#fff', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <input placeholder="Type an SMS message..." style={{ flex: 1, padding: '16px 24px', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '15px' }} />
          <button style={{ background: '#0f172a', color: '#fff', border: 'none', borderRadius: '12px', padding: '0 32px', fontWeight: 700, cursor: 'pointer', fontSize: '15px' }}>Send</button>
        </div>
      </div>
    </div>
  </div>
);

const EmployeeCalendarView = () => (
  <div style={{ maxWidth: '1200px', width: '100%' }}>
    <h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0, color: '#0f172a' }}>My Calendar</h1>
    <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px', marginBottom: '32px' }}>Your upcoming appointments via Google Meet.</p>
    <div style={{ background: '#fff', padding: '60px 40px', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#64748b', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}><Ic n="calendar" s={48} /></div>
      <h3 style={{ marginTop: '0', color: '#0f172a', fontSize: '20px', fontWeight: 800 }}>Google Calendar Connected</h3>
      <p style={{ maxWidth: '400px', margin: '8px auto 0', lineHeight: '1.6' }}>Your scheduled Google Meet links will appear here automatically.</p>
    </div>
  </div>
);

const HelpDeskView = () => (
  <div style={{ maxWidth: '1200px', width: '100%' }}>
    <h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0, color: '#0f172a' }}>Client Support Inbox</h1>
    <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px', marginBottom: '32px' }}>Manage and respond to support tickets from clients.</p>
    <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', padding: '60px 40px', textAlign: 'center', color: '#64748b', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', color: '#22c55e' }}><Ic n="check" s={48} /></div>
      <h3 style={{ marginTop: '0', color: '#0f172a', fontSize: '20px', fontWeight: 800 }}>Inbox Zero!</h3>
      <p style={{ maxWidth: '400px', margin: '8px auto 0', lineHeight: '1.6' }}>No active client tickets currently require your attention. Great job!</p>
    </div>
  </div>
);

// ─── INTERNAL TEAM HUB (Shared by Admins and Employees) ───
const InternalTeamHub = ({ profile }: any) => {
  const [activeChannel, setActiveChannel] = useState('community');
  const [activeChannelName, setActiveChannelName] = useState('# community');
  const [messages, setMessages] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  const getDmChannelId = (id1: string, id2: string) => {
    const sorted = [id1, id2].sort();
    return `dm_${sorted[0]}_${sorted[1]}`;
  };

  const fetchTeamMembers = async () => {
    const { data } = await supabase.from('internal_team').select(`user_id, profiles(full_name, avatar_url)`);
    if (data) setTeamMembers(data.filter((tm: any) => tm.user_id !== profile.id));
  };

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('internal_messages')
      .select(`id, content, created_at, sender_id, profiles (full_name, avatar_url)`)
      .eq('channel', activeChannel)
      .order('created_at', { ascending: true });
    if (data) setMessages(data);
  };

  useEffect(() => { fetchTeamMembers(); }, [profile.id]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [activeChannel]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !profile?.id) return;
    const tempMsg = input;
    setInput('');
    const { error } = await supabase.from('internal_messages').insert([{ sender_id: profile.id, content: tempMsg, channel: activeChannel }]);
    if (error) { alert("Message failed to send. Check Supabase Row Level Security policies for 'internal_messages'. Error: " + error.message); } 
    else { fetchMessages(); }
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 160px)', background: '#fff', borderRadius: '24px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
      <aside style={{ width: '280px', borderRight: '1px solid #f1f5f9', padding: '32px 24px', background: '#f8fafc', overflowY: 'auto' }}>
        <h3 style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px' }}>Channels</h3>
        <button onClick={() => { setActiveChannel('community'); setActiveChannelName('# community'); }} style={{ width: '100%', textAlign: 'left', padding: '12px 16px', borderRadius: '12px', background: activeChannel === 'community' ? '#22c55e' : 'transparent', color: activeChannel === 'community' ? '#fff' : '#64748b', fontWeight: 700, border: 'none', marginBottom: '8px', cursor: 'pointer' }}># community</button>
        <button onClick={() => { setActiveChannel('announcements'); setActiveChannelName('# announcements'); }} style={{ width: '100%', textAlign: 'left', padding: '12px 16px', borderRadius: '12px', background: activeChannel === 'announcements' ? '#22c55e' : 'transparent', color: activeChannel === 'announcements' ? '#fff' : '#64748b', fontWeight: 700, border: 'none', cursor: 'pointer' }}># announcements</button>
        
        <h3 style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '32px', marginBottom: '20px' }}>Direct Messages</h3>
        {teamMembers.length === 0 && <div style={{ fontSize: '12px', color: '#94a3b8', padding: '0 12px' }}>No other team members found.</div>}
        {teamMembers.map(tm => {
          const dmId = getDmChannelId(profile.id, tm.user_id);
          const isDmActive = activeChannel === dmId;
          const memberName = tm.profiles?.full_name || 'Employee';
          return (
            <button key={tm.user_id} onClick={() => { setActiveChannel(dmId); setActiveChannelName(memberName); }} style={{ width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: '12px', background: isDmActive ? '#22c55e' : 'transparent', color: isDmActive ? '#fff' : '#475569', fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <div style={{ width: 28, height: 28, borderRadius: '8px', background: isDmActive ? '#fff' : '#e2e8f0', color: isDmActive ? '#22c55e' : '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', overflow: 'hidden' }}>
                {tm.profiles?.avatar_url ? <img src={tm.profiles.avatar_url} style={{width:'100%',height:'100%',objectFit:'cover'}}/> : memberName.charAt(0)}
              </div>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{memberName}</span>
            </button>
          )
        })}
      </aside>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px 32px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 800, fontSize: '20px', color: '#0f172a' }}>{activeChannelName}</span>
        </div>
        <div style={{ flex: 1, padding: '32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px', background: '#f8fafc' }}>
          {messages.length === 0 && <div style={{color: '#94a3b8', textAlign: 'center', marginTop: '40px', fontWeight: 500}}>Be the first to send a message to {activeChannelName}</div>}
          {messages.map(m => {
            const isMe = m.sender_id === profile.id;
            const senderName = isMe ? (profile?.full_name || 'Admin') : (m.profiles?.full_name || 'Team Member');
            const senderAvatar = isMe ? profile?.avatar_url : m.profiles?.avatar_url;
            return (
              <div key={m.id} style={{ display: 'flex', gap: '16px', flexDirection: isMe ? 'row-reverse' : 'row' }}>
                <div style={{ width: 40, height: 40, borderRadius: '12px', background: isMe ? '#22c55e' : '#e2e8f0', color: isMe ? '#fff' : '#0f172a', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, overflow: 'hidden' }}>
                  {senderAvatar ? <img src={senderAvatar} style={{width:'100%', height:'100%', objectFit:'cover'}}/> : senderName.charAt(0)}
                </div>
                <div style={{ maxWidth: '70%', display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px', flexDirection: isMe ? 'row-reverse' : 'row' }}>
                    <span style={{ fontWeight: 800, fontSize: '14px', color: '#0f172a' }}>{senderName}</span>
                  </div>
                  <div style={{ fontSize: '15px', color: isMe ? '#fff' : '#334155', lineHeight: '1.6', background: isMe ? '#22c55e' : '#fff', padding: '16px 20px', borderRadius: isMe ? '16px 0 16px 16px' : '0 16px 16px 16px', border: isMe ? 'none' : '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>{m.content}</div>
                </div>
              </div>
            )
          })}
          <div ref={endRef} />
        </div>
        <div style={{ padding: '24px 32px', background: '#fff', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '16px' }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder={`Message ${activeChannelName}`} style={{ flex: 1, padding: '16px 24px', borderRadius: '16px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '15px', color: '#0f172a' }} />
          <button onClick={handleSend} style={{ background: '#0f172a', color: '#fff', border: 'none', borderRadius: '16px', width: '60px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ic n="send" s={20}/></button>
        </div>
      </div>
    </div>
  );
};
// ============================================================================
// 3. NEW & ENHANCED CLIENT VIEWS (Leads, Retention, Recruiting)
// ============================================================================

const LeadsView = () => {
  const mockLeads = [
    { id: 1, name: 'Mike Johnson', phone: '(555) 234-5678', email: 'mike.johnson@gmail.com', zip: '60035', age: 38, coverage: '$500K-$1M', beneficiary: 'Spouse/Partner', timeline: "I'm ready today", concern: 'Burial or cremation costs', tobacco: 'No', health: 'No', occupation: 'Independent contractor', industry: 'Long-haul trucking', driver: 'CDL', source: 'Facebook', status: 'new', date: 'Oct 24, 2026' },
    { id: 2, name: 'Sarah Martinez', phone: '(555) 876-5432', email: 'sarah.m@yahoo.com', zip: '60201', age: 45, coverage: '$250K-$500K', beneficiary: 'Child/Children', timeline: 'Within a week', concern: 'Not Asked', tobacco: 'Not Asked', health: 'Not Asked', occupation: 'Registered Nurse', industry: 'Hospital', driver: 'Personal', source: 'Google', status: 'contacted', date: 'Oct 23, 2026' },
    { id: 3, name: 'David Chen', phone: '(555) 111-3333', email: 'david.chen@outlook.com', zip: '60614', age: 52, coverage: '$1M+', beneficiary: 'Spouse/Partner', timeline: 'Within a month', concern: 'Income replacement', tobacco: 'No', health: 'Yes', occupation: 'Software Engineer', industry: 'Tech', driver: 'Personal', source: 'Zapier', status: 'pitched', date: 'Oct 22, 2026' },
    { id: 4, name: 'Lisa Thompson', phone: '(555) 444-5555', email: 'lisa.t@email.com', zip: '60657', age: 31, coverage: '$250K-$500K', beneficiary: 'Child/Children', timeline: "I'm ready today", concern: 'Mortgage protection', tobacco: 'No', health: 'No', occupation: 'Marketing Manager', industry: 'Advertising', driver: 'Personal', source: 'Facebook', status: 'follow_up', followDate: 'Today', followNotes: 'Very interested, asked to call back Tuesday', date: 'Oct 20, 2026' },
    { id: 5, name: 'Robert Williams', phone: '(555) 666-7777', email: 'rob.w@test.com', zip: '60611', age: 67, coverage: '$100K-$250K', beneficiary: 'Other', timeline: "I'm not sure", concern: 'Legacy planning', tobacco: 'Yes', health: 'Yes', occupation: 'Retired', industry: 'N/A', driver: 'Personal', source: 'Manual', status: 'not_sold', reason: 'Not interested', date: 'Oct 19, 2026' },
    { id: 6, name: 'Jennifer Adams', phone: '(555) 888-9999', email: 'jen.adams@gmail.com', zip: '60640', age: 29, coverage: '$500K-$1M', beneficiary: 'Spouse/Partner', timeline: 'Within a week', concern: 'Income replacement', tobacco: 'No', health: 'No', occupation: 'Teacher', industry: 'Education', driver: 'Personal', source: 'Google', status: 'sold', policy: 'Term', premium: 85, date: 'Oct 15, 2026' }
  ];

  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [status, setStatus] = useState('');

  const getStatusColor = (s: string) => {
    const colors: any = { new: '#3b82f6', contacted: '#f59e0b', pitched: '#f97316', sold: '#22c55e', not_sold: '#ef4444', follow_up: '#8b5cf6' };
    return colors[s] || '#64748b';
  };

  const getQualBadge = (val: string) => {
    if (val === 'No') return { bg: '#dcfce7', c: '#16a34a' };
    if (val === 'Yes') return { bg: '#fee2e2', c: '#ef4444' };
    return { bg: '#f1f5f9', c: '#64748b' };
  };

  if (selectedLead) {
    return (
      <div style={{ maxWidth: '1200px', width: '100%' }}>
        <button onClick={() => setSelectedLead(null)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#64748b', fontWeight: 600, cursor: 'pointer', padding: 0, marginBottom: '24px', fontSize: '15px' }}>
          <Ic n="back" s={18} /> Back to Leads Pipeline
        </button>
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          
          {/* Section 1: Header */}
          <div style={{ padding: '32px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: '#f8fafc' }}>
            <div>
              <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '12px' }}>
                {selectedLead.name} {selectedLead.timeline === "I'm ready today" && <span style={{color:'#ef4444'}}><Ic n="fire" s={24}/></span>}
              </h1>
              <div style={{ fontSize: '15px', color: '#475569', fontWeight: 500, marginBottom: '8px' }}>{selectedLead.email} • {selectedLead.phone}</div>
              <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 600 }}>Age {selectedLead.age} • Zip {selectedLead.zip} • Source: {selectedLead.source}</div>
            </div>
            <span style={{ background: getStatusColor(selectedLead.status), color: '#fff', padding: '8px 20px', borderRadius: '20px', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {selectedLead.status.replace('_', ' ')}
            </span>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr' }}>
            <div style={{ padding: '32px', borderRight: '1px solid #e2e8f0' }}>
              {/* Section 2: Needs */}
              <h3 style={{ margin: '0 0 24px 0', fontSize: '16px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Insurance Needs</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}><div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700, marginBottom: '4px', textTransform: 'uppercase' }}>Coverage Requested</div><div style={{ fontSize: '16px', color: '#0f172a', fontWeight: 700 }}>{selectedLead.coverage}</div></div>
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}><div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700, marginBottom: '4px', textTransform: 'uppercase' }}>Beneficiary</div><div style={{ fontSize: '16px', color: '#0f172a', fontWeight: 700 }}>{selectedLead.beneficiary}</div></div>
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}><div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700, marginBottom: '4px', textTransform: 'uppercase' }}>Timeline</div><div style={{ fontSize: '16px', color: selectedLead.timeline === "I'm ready today" ? '#ef4444' : '#0f172a', fontWeight: 700 }}>{selectedLead.timeline}</div></div>
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}><div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700, marginBottom: '4px', textTransform: 'uppercase' }}>Primary Concern</div><div style={{ fontSize: '16px', color: '#0f172a', fontWeight: 700 }}>{selectedLead.concern}</div></div>
              </div>

              {/* Section 3: Qualifiers */}
              <h3 style={{ margin: '0 0 24px 0', fontSize: '16px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', borderTop: '1px solid #f1f5f9', paddingTop: '32px' }}>Qualifying Data</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div><div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' }}>Tobacco Use</div><span style={{ padding: '6px 14px', borderRadius: '12px', fontSize: '13px', fontWeight: 700, background: getQualBadge(selectedLead.tobacco).bg, color: getQualBadge(selectedLead.tobacco).c }}>{selectedLead.tobacco}</span></div>
                <div><div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' }}>Health Conditions</div><span style={{ padding: '6px 14px', borderRadius: '12px', fontSize: '13px', fontWeight: 700, background: getQualBadge(selectedLead.health).bg, color: getQualBadge(selectedLead.health).c }}>{selectedLead.health}</span></div>
                <div><div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700, marginBottom: '4px', marginTop: '16px', textTransform: 'uppercase' }}>Occupation</div><div style={{ fontSize: '16px', color: '#0f172a', fontWeight: 600 }}>{selectedLead.occupation}</div></div>
                <div><div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700, marginBottom: '4px', marginTop: '16px', textTransform: 'uppercase' }}>Industry</div><div style={{ fontSize: '16px', color: '#0f172a', fontWeight: 600 }}>{selectedLead.industry}</div></div>
              </div>
            </div>

            <div style={{ padding: '32px', background: '#f8fafc' }}>
              {/* Section 4: Pipeline Management */}
              <h3 style={{ margin: '0 0 24px 0', fontSize: '16px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pipeline Action</h3>
              
              <label style={{ fontSize: '13px', color: '#475569', fontWeight: 700, marginBottom: '8px', display: 'block' }}>Update Pipeline Status</label>
              <select value={status || selectedLead.status} onChange={e => setStatus(e.target.value)} style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none', marginBottom: '24px', fontWeight: 600, fontSize: '15px', color: '#0f172a', cursor: 'pointer' }}>
                <option value="new">New Lead</option>
                <option value="contacted">Contacted</option>
                <option value="pitched">Pitched</option>
                <option value="follow_up">Follow Up</option>
                <option value="sold">Sold</option>
                <option value="not_sold">Not Sold</option>
              </select>

              {status === 'not_sold' && (
                <div style={{ marginBottom: '24px', background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <label style={{ fontSize: '12px', color: '#64748b', fontWeight: 700, marginBottom: '8px', display: 'block', textTransform: 'uppercase' }}>Not Sold Reason</label>
                  <select style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', marginBottom: '16px', fontSize: '14px', color: '#0f172a' }}>
                    <option>No Answer</option>
                    <option>Not Interested</option>
                    <option>Bad Lead / Invalid Info</option>
                    <option>Other</option>
                  </select>
                  <label style={{ fontSize: '12px', color: '#64748b', fontWeight: 700, marginBottom: '8px', display: 'block', textTransform: 'uppercase' }}>Additional Notes</label>
                  <textarea placeholder="Enter specific details..." style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box', minHeight: '100px', resize: 'vertical', fontSize: '14px', color: '#0f172a' }}></textarea>
                </div>
              )}

              {status === 'follow_up' && (
                <div style={{ marginBottom: '24px', background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <label style={{ fontSize: '12px', color: '#64748b', fontWeight: 700, marginBottom: '8px', display: 'block', textTransform: 'uppercase' }}>Next Follow-Up Date</label>
                  <input type="date" style={{ width: '100%', boxSizing: 'border-box', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', marginBottom: '16px', fontSize: '14px', color: '#0f172a' }} />
                  <label style={{ fontSize: '12px', color: '#64748b', fontWeight: 700, marginBottom: '8px', display: 'block', textTransform: 'uppercase' }}>Follow-Up Notes</label>
                  <textarea placeholder="Enter context for the next call..." style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box', minHeight: '100px', resize: 'vertical', fontSize: '14px', color: '#0f172a' }}></textarea>
                </div>
              )}

              {status === 'sold' && (
                <div style={{ background: '#ecfdf5', padding: '24px', borderRadius: '12px', border: '2px solid #22c55e', marginBottom: '24px' }}>
                  <h4 style={{ margin: '0 0 16px 0', color: '#166534', fontSize: '16px', fontWeight: 800 }}>Convert to Retention Client</h4>
                  <label style={{ fontSize: '12px', color: '#166534', fontWeight: 700, marginBottom: '8px', display: 'block', textTransform: 'uppercase' }}>Purchased Policy Type</label>
                  <select style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #86efac', outline: 'none', marginBottom: '16px', fontSize: '14px', color: '#0f172a' }}>
                    <option>Select Policy Type...</option>
                    <option>IUL</option>
                    <option>Term Life</option>
                    <option>Final Expense</option>
                    <option>Whole Life</option>
                  </select>
                  <label style={{ fontSize: '12px', color: '#166534', fontWeight: 700, marginBottom: '8px', display: 'block', textTransform: 'uppercase' }}>Monthly Premium Value</label>
                  <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #86efac', borderRadius: '8px', padding: '0 12px', marginBottom: '20px' }}>
                    <span style={{ color: '#0f172a', fontWeight: 700 }}>$</span>
                    <input type="number" placeholder="0.00" style={{ width: '100%', boxSizing: 'border-box', padding: '12px', border: 'none', outline: 'none', fontSize: '15px', color: '#0f172a' }} />
                  </div>
                  <button onClick={() => { alert('Success! Lead converted to Active Retention Client. They have been added to your Contacts.'); setSelectedLead(null); }} style={{ width: '100%', background: '#16a34a', color: '#fff', border: 'none', padding: '16px', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', fontSize: '15px' }}>Convert to Client</button>
                </div>
              )}

              {status !== 'sold' && (
                <button style={{ width: '100%', background: '#0f172a', color: '#fff', border: 'none', padding: '16px', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', fontSize: '15px' }}>Save Pipeline Update</button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1400px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0, color: '#0f172a' }}>Leads Pipeline</h1>
          <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px' }}>Prioritize and work your incoming insurance inquiries.</p>
        </div>
        <button style={{ background: '#0f172a', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>+</span> Add Lead
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '32px' }}>
        <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Leads</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', marginTop: 12 }}>412</div>
        </div>
        <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>New Leads</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#3b82f6', marginTop: 12 }}>14</div>
        </div>
        <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hot Leads</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#ef4444', marginTop: 12 }}>6</div>
        </div>
        <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pending Follow-up</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#8b5cf6', marginTop: 12 }}>12</div>
        </div>
        <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Conversion Rate</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#22c55e', marginTop: 12 }}>8.4%</div>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '16px', background: '#f8fafc' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0 12px', flex: 1 }}>
            <Ic n="search" s={18} color="#94a3b8"/>
            <input placeholder="Search leads by name, email, or phone..." style={{ border: 'none', outline: 'none', padding: '14px', width: '100%', fontSize: '14px', color: '#0f172a' }}/>
          </div>
          <select style={{ padding: '14px 20px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', outline: 'none', fontSize: '14px', fontWeight: 600, color: '#475569', cursor: 'pointer' }}>
            <option>All Statuses</option>
            <option>New</option>
            <option>Contacted</option>
            <option>Follow Up</option>
          </select>
          <select style={{ padding: '14px 20px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', outline: 'none', fontSize: '14px', fontWeight: 600, color: '#475569', cursor: 'pointer' }}>
            <option>All Timelines</option>
            <option>Ready Today</option>
            <option>Within a week</option>
          </select>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#fff' }}>
              <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Lead Name</th>
              <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Coverage Request</th>
              <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Timeline</th>
              <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
              <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Date Received</th>
            </tr>
          </thead>
          <tbody>
            {mockLeads.map(l => (
              <tr key={l.id} onClick={() => { setSelectedLead(l); setStatus(l.status); }} style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background 0.2s', background: (l.status === 'follow_up' && l.followDate === 'Today') ? '#fff7ed' : '#fff' }} onMouseOver={e => e.currentTarget.style.background = (l.status === 'follow_up' && l.followDate === 'Today') ? '#ffedd5' : '#f8fafc'} onMouseOut={e => e.currentTarget.style.background = (l.status === 'follow_up' && l.followDate === 'Today') ? '#fff7ed' : '#fff'}>
                <td style={{ padding: '24px', position: 'relative' }}>
                  {l.timeline === "I'm ready today" && l.status !== 'sold' && l.status !== 'not_sold' && <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: '#ef4444'}} />}
                  <div style={{ fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px' }}>
                    {l.name} 
                    {l.timeline === "I'm ready today" && l.status !== 'sold' && l.status !== 'not_sold' && <span style={{color: '#ef4444'}}><Ic n="fire" s={16}/></span>}
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px', fontWeight: 500 }}>{l.phone} • Age {l.age}</div>
                </td>
                <td style={{ padding: '24px', color: '#0f172a', fontWeight: 700, fontSize: '14px' }}>{l.coverage}</td>
                <td style={{ padding: '24px', color: '#475569', fontSize: '14px', fontWeight: 600 }}>{l.timeline}</td>
                <td style={{ padding: '24px' }}>
                  <span style={{ background: getStatusColor(l.status), color: '#fff', padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {l.status.replace('_', ' ')}
                  </span>
                </td>
                <td style={{ padding: '24px', textAlign: 'right', color: '#64748b', fontSize: '14px', fontWeight: 500 }}>{l.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const HealthScoreSection = () => {
  const mockHealth = [
    { name: 'Michael Sterling', type: 'IUL', premium: '$245', status: 'green', days: '4' },
    { name: 'Sarah Jenkins', type: 'Term', premium: '$85', status: 'yellow', days: '32' },
    { name: 'Luke Kendo', type: 'Final Expense', premium: '$120', status: 'red', days: '64' },
  ];
  return (
    <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0', marginTop: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>Client Health Scores</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {mockHealth.map((h, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: h.status === 'green' ? '#22c55e' : h.status === 'yellow' ? '#f59e0b' : '#ef4444', boxShadow: `0 0 0 4px ${h.status === 'green' ? '#dcfce7' : h.status === 'yellow' ? '#fef3c7' : '#fee2e2'}` }} />
              <div>
                <div style={{ fontWeight: 800, fontSize: '15px', color: '#0f172a' }}>{h.name}</div>
                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px', fontWeight: 500 }}>{h.type} • {h.premium}/mo</div>
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
              Last contact:<br/>
              <span style={{color: h.status === 'red' ? '#ef4444' : '#0f172a', fontWeight: 800, fontSize: '14px'}}>{h.days} days ago</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const LapseRiskAlerts = () => (
  <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0', marginTop: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
    <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 800, color: '#ef4444', display: 'flex', alignItems: 'center', gap: '10px' }}>
      <Ic n="alert" /> Lapse Risk Alerts
    </h3>
    <div style={{ padding: '24px', border: '2px dashed #fca5a5', borderRadius: '12px', background: '#fef2f2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <div style={{ fontWeight: 800, fontSize: '18px', color: '#991b1b' }}>David Alawieh</div>
        <div style={{ fontSize: '14px', color: '#b91c1c', marginTop: '6px', fontWeight: 600 }}>Flag Reason: Multiple missed payments (2)</div>
      </div>
      <button style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', fontSize: '14px' }}>Review Client</button>
    </div>
  </div>
);

const PolicyReviewsPage = ({ isAdminMode }: { isAdminMode: boolean }) => (
  <div style={{ maxWidth: '1200px', width: '100%' }}>
    <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Policy Reviews</h1>
    <p style={{ color: '#64748b', marginTop: '8px', marginBottom: '32px', fontSize: '15px' }}>Manage upcoming annual and check-in policy reviews.</p>
    
    <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
          <tr>
            <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Client Name</th>
            <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Review Type</th>
            <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Due Date</th>
            {isAdminMode && <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Assigned Agent</th>}
            <th style={{ padding: '20px 24px', textAlign: 'right', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
            <td style={{ padding: '24px', fontWeight: 800, color: '#0f172a', fontSize: '15px' }}>Michael Sterling</td>
            <td style={{ padding: '24px', color: '#64748b', fontWeight: 600, fontSize: '14px' }}>Annual Review</td>
            <td style={{ padding: '24px', color: '#ef4444', fontWeight: 800, fontSize: '14px' }}>Oct 30, 2026</td>
            {isAdminMode && <td style={{ padding: '24px', color: '#0f172a', fontWeight: 700, fontSize: '14px' }}>Rory Perlow</td>}
            <td style={{ padding: '24px', textAlign: 'right' }}>
              <button style={{ background: '#0f172a', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 800, cursor: 'pointer' }}>Mark Complete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

const ForecastingPage = ({ isRecruiting }: { isRecruiting?: boolean }) => (
  <div style={{ maxWidth: '1200px', width: '100%' }}>
    <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
      {isRecruiting ? 'Recruiting Forecast' : 'Revenue Forecasting'}
    </h1>
    <p style={{ color: '#64748b', marginTop: '8px', marginBottom: '32px', fontSize: '15px' }}>
      {isRecruiting ? 'Predictive models for upcoming new agent recruits.' : 'Predictive models based on active policies and lapse risks.'}
    </p>
    
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
      <div style={{ background: '#fff', padding: '40px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <div style={{ fontSize: '13px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {isRecruiting ? 'Projected Recruits (This Month)' : 'Projected Monthly Revenue'}
        </div>
        <div style={{ fontSize: '48px', fontWeight: 800, color: '#22c55e', marginTop: '16px' }}>
          {isRecruiting ? '34' : '$12,450'}
        </div>
      </div>
      <div style={{ background: '#fff', padding: '40px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <div style={{ fontSize: '13px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {isRecruiting ? 'Projected Drop-Offs' : 'At-Risk Revenue'}
        </div>
        <div style={{ fontSize: '48px', fontWeight: 800, color: '#ef4444', marginTop: '16px' }}>
          {isRecruiting ? '5' : '$840'}
        </div>
      </div>
    </div>

    <div style={{ background: '#fff', padding: '40px', borderRadius: '16px', border: '1px solid #e2e8f0', height: '450px', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
       <h3 style={{ margin: '0 0 32px 0', fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>6-Month Projection</h3>
       <div style={{flex: 1, minHeight: 0}}>
         <ResponsiveContainer width="100%" height="100%">
            <LineChart data={
              isRecruiting 
              ? [{m:'May', v:18}, {m:'Jun', v:22}, {m:'Jul', v:28}, {m:'Aug', v:34}, {m:'Sep', v:42}, {m:'Oct', v:55}]
              : [{m:'May', v:4000}, {m:'Jun', v:4500}, {m:'Jul', v:5100}, {m:'Aug', v:5800}, {m:'Sep', v:6200}, {m:'Oct', v:7100}]
            }>
              <XAxis dataKey="m" axisLine={false} tickLine={false} tick={{fontSize: 13, fill: '#94a3b8', fontWeight: 700}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 13, fill: '#94a3b8', fontWeight: 700}} tickFormatter={(v) => isRecruiting ? `${v}` : `$${v}`} dx={-10} />
              <Tooltip cursor={{stroke: '#e2e8f0', strokeWidth: 2}} contentStyle={{borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
              <Line type="monotone" dataKey="v" stroke="#22c55e" strokeWidth={5} dot={{r: 6, fill: '#fff', stroke: '#22c55e', strokeWidth: 3}} activeDot={{r: 8}} />
            </LineChart>
         </ResponsiveContainer>
       </div>
    </div>
  </div>
);

const AgentPerformancePage = ({ onAgentSelect, isRecruiting }: any) => {
  const retentionAgents = [
    { id: '1', name: 'Rory Perlow', active: 45, retention: '98%', rev: '$4,500', fail: 1, pend: 0, conv: '10.7%', time: '2 Days' },
    { id: '2', name: 'Sarah Jenkins', active: 32, retention: '95%', rev: '$3,200', fail: 0, pend: 2, conv: '9.4%', time: '1 Day' },
  ];

  const recruitingAgents = [
    { id: '1', name: 'Rory Perlow', recruits: 12, appts: 38, showRate: '85%', conv: '31%', time: '14 Days' },
    { id: '2', name: 'Sarah Jenkins', recruits: 8, appts: 24, showRate: '78%', conv: '33%', time: '18 Days' },
  ];

  const data = isRecruiting ? recruitingAgents : retentionAgents;

  return (
    <div style={{ maxWidth: '1400px', width: '100%' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
        {isRecruiting ? 'Recruiter Leaderboard' : 'Agent Leaderboard'}
      </h1>
      <p style={{ color: '#64748b', marginTop: '8px', marginBottom: '32px', fontSize: '15px' }}>Click a team member to drill down into their specific dashboard.</p>
      
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            {isRecruiting ? (
              <tr>
                <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recruiter</th>
                <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Recruits</th>
                <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Appts Taken</th>
                <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Show Rate</th>
                <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hire Conv %</th>
                <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avg Time to Hire</th>
              </tr>
            ) : (
              <tr>
                <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Agent</th>
                <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Policies</th>
                <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Retention %</th>
                <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>MRR</th>
                <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Lead Conv %</th>
                <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Failed/Pend</th>
                <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avg Time</th>
              </tr>
            )}
          </thead>
          <tbody>
            {data.map((a: any) => (
              <tr key={a.id} onClick={() => onAgentSelect(a)} style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: '0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#f8fafc'} onMouseOut={e => e.currentTarget.style.background = '#fff'}>
                <td style={{ padding: '24px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '16px', fontSize: '15px' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: isRecruiting ? '#eff6ff' : '#f0fdf4', color: isRecruiting ? '#1e3a8a' : '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>{a.name.charAt(0)}</div>
                  {a.name}
                </td>
                
                {isRecruiting ? (
                  <>
                    <td style={{ padding: '24px', color: '#22c55e', fontWeight: 800, fontSize: '15px' }}>{a.recruits}</td>
                    <td style={{ padding: '24px', fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>{a.appts}</td>
                    <td style={{ padding: '24px', fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>{a.showRate}</td>
                    <td style={{ padding: '24px', color: '#0f172a', fontWeight: 700, fontSize: '15px' }}>{a.conv}</td>
                    <td style={{ padding: '24px', color: '#64748b', fontWeight: 600, fontSize: '14px' }}>{a.time}</td>
                  </>
                ) : (
                  <>
                    <td style={{ padding: '24px', fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>{a.active}</td>
                    <td style={{ padding: '24px', color: '#22c55e', fontWeight: 800, fontSize: '15px' }}>{a.retention}</td>
                    <td style={{ padding: '24px', fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>{a.rev}</td>
                    <td style={{ padding: '24px', color: '#0f172a', fontWeight: 700, fontSize: '15px' }}>{a.conv}</td>
                    <td style={{ padding: '24px', fontSize: '15px' }}><span style={{color:'#ef4444', fontWeight:800}}>{a.fail}</span> / <span style={{color:'#f59e0b', fontWeight:800}}>{a.pend}</span></td>
                    <td style={{ padding: '24px', color: '#64748b', fontWeight: 600, fontSize: '14px' }}>{a.time}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


// ============================================================================
// 4. SHARED / ORIGINAL CLIENT VIEWS (Merged & Enhanced)
// ============================================================================

const CalendarView = ({ isRecruiting }: { isRecruiting?: boolean }) => {
  const mockBookings = isRecruiting ? [
    { id: 1, name: 'Jason Smith', role: 'Candidate', date: 'Oct 24, 2026', time: '10:00 AM EST', status: 'Upcoming' },
    { id: 2, name: 'Amanda Clarke', role: 'Candidate', date: 'Oct 24, 2026', time: '1:30 PM EST', status: 'Upcoming' },
  ] : [
    { id: 1, name: 'Michael Sterling', role: 'Client', date: 'Oct 24, 2026', time: '10:00 AM EST', status: 'Upcoming' },
    { id: 2, name: 'Sarah Jenkins', role: 'Client', date: 'Oct 24, 2026', time: '1:30 PM EST', status: 'Upcoming' },
  ];

  return (
    <div style={{ maxWidth: '1200px', width: '100%' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0, color: '#0f172a', letterSpacing: '-0.02em' }}>
        {isRecruiting ? 'Recruiting Interviews' : 'Client Appointments'}
      </h1>
      <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px', marginBottom: '32px' }}>
        {isRecruiting ? 'Your scheduled calls with potential new agency recruits.' : 'Your scheduled policy reviews and client onboarding calls.'}
      </p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {mockBookings.map(booking => (
          <div key={booking.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{ width: 72, height: 72, borderRadius: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>{booking.date.split(' ')[0]}</span>
                <span style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>{booking.date.split(' ')[1].replace(',', '')}</span>
              </div>
              <div>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{booking.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px', color: '#64748b', fontWeight: 600 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Ic n="user" s={16} /> {booking.role}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Ic n="calendar" s={16} /> {booking.time}</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <span style={{ padding: '8px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 800, background: booking.status === 'Upcoming' ? '#f0fdf4' : '#fffbeb', color: booking.status === 'Upcoming' ? '#16a34a' : '#d97706', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {booking.status}
              </span>
              <button style={{ background: '#0f172a', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: 800, cursor: 'pointer' }}>Join Call</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ContactsView = ({ isRecruiting, isEmployee, profile }: any) => {
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [tab, setTab] = useState('overview');
  const isAdminMode = profile?.role === 'owner';

  const mockContacts = [
    { id: 1, name: "Michael Sterling", policy: "IUL", health: "green", date: "Oct 12, 2025", agent: "Rory Perlow", phone: "(555) 234-5678", email: "michael.s@example.com", duration: "4 Months" },
    { id: 2, name: "Sarah Jenkins", policy: "Term", health: "yellow", date: "Jan 05, 2026", agent: "Rory Perlow", phone: "(555) 876-5432", email: "s.jenkins88@example.com", duration: "1 Month" },
    { id: 3, name: "David Alawieh", policy: "Final Expense", health: "red", date: "Nov 20, 2025", agent: "Luke Kendo", phone: "(555) 345-6789", email: "david.alawieh@example.com", duration: "3 Months" }
  ];

  if (selectedContact) {
    return (
      <div style={{ maxWidth: '1000px', width: '100%' }}>
        <button onClick={() => setSelectedContact(null)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#64748b', fontWeight: 700, cursor: 'pointer', padding: 0, marginBottom: '32px', fontSize: '15px' }}>
          <Ic n="back" s={18} /> Back to Contacts
        </button>
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <div style={{ padding: '40px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ width: 88, height: 88, borderRadius: '50%', background: '#f0fdf4', color: '#16a34a', border: '4px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 800 }}>
              {selectedContact.name.charAt(0)}
            </div>
            <div>
              <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '16px' }}>
                {selectedContact.name} 
                {!isRecruiting && <div style={{width: 16, height: 16, borderRadius: '50%', background: selectedContact.health === 'green' ? '#22c55e' : selectedContact.health === 'yellow' ? '#f59e0b' : '#ef4444', boxShadow: `0 0 0 4px ${selectedContact.health === 'green' ? '#dcfce7' : selectedContact.health === 'yellow' ? '#fef3c7' : '#fee2e2'}`}}/>}
              </h1>
              <span style={{ display: 'inline-block', marginTop: '6px', background: '#22c55e', color: '#fff', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {isEmployee ? 'Assigned Contact' : (isRecruiting ? 'Active Candidate' : 'Activated Client')}
              </span>
              {!isRecruiting && <div style={{ fontSize: '15px', color: '#475569', fontWeight: 600, marginTop: '12px' }}>Policy: {selectedContact.policy} | Assigned Agent: {selectedContact.agent}</div>}
            </div>
          </div>
          
          <div style={{ display: 'flex', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            {['overview', 'communication log', 'referrals'].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: '20px', border: 'none', background: tab === t ? '#fff' : 'transparent', color: tab === t ? '#22c55e' : '#64748b', fontWeight: 800, textTransform: 'uppercase', fontSize: '13px', letterSpacing: '0.05em', cursor: 'pointer', borderBottom: tab === t ? '3px solid #22c55e' : '3px solid transparent', transition: '0.2s' }}>{t}</button>
            ))}
          </div>

          <div style={{ padding: '40px' }}>
            {tab === 'overview' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                <div>
                  <div style={{ marginBottom: '32px' }}><div style={{ fontSize: '12px', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Email Address</div><div style={{ fontSize: '18px', color: '#0f172a', fontWeight: 600 }}>{selectedContact.email}</div></div>
                  <div><div style={{ fontSize: '12px', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Phone Number</div><div style={{ fontSize: '18px', color: '#0f172a', fontWeight: 600 }}>{selectedContact.phone}</div></div>
                </div>
                <div>
                  <div style={{ marginBottom: '32px' }}><div style={{ fontSize: '12px', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>{isEmployee ? 'Added Date' : (isRecruiting ? 'Date Sourced' : 'Policy Drafted Date')}</div><div style={{ fontSize: '18px', color: '#0f172a', fontWeight: 600 }}>{selectedContact.date}</div></div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Lead Origin</div>
                    <button style={{ background: '#eff6ff', border: 'none', padding: '10px 16px', borderRadius: '8px', color: '#3b82f6', fontWeight: 700, cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><Ic n="search" s={16}/> View original inquiry data</button>
                  </div>
                </div>
              </div>
            )}
            {tab === 'communication log' && <div>
              <div style={{ padding: '24px', borderLeft: '4px solid #3b82f6', background: '#eff6ff', marginBottom: '16px', borderRadius: '0 12px 12px 0' }}><div style={{fontSize:13, color:'#475569', fontWeight:800, textTransform: 'uppercase', marginBottom:8, letterSpacing: '0.05em'}}>Today - Automated Email</div><div style={{fontSize: '15px', color: '#0f172a', fontWeight: 500}}>Anniversary Check-in sent successfully.</div></div>
              <div style={{ padding: '24px', borderLeft: '4px solid #22c55e', background: '#f0fdf4', borderRadius: '0 12px 12px 0' }}><div style={{fontSize:13, color:'#475569', fontWeight:800, textTransform: 'uppercase', marginBottom:8, letterSpacing: '0.05em'}}>Oct 12, 2025 - Phone Call</div><div style={{fontSize: '15px', color: '#0f172a', fontWeight: 500}}>Client confirmed setup. All good.</div></div>
            </div>}
            {tab === 'referrals' && <div><h3 style={{marginTop:0, fontSize: '20px', fontWeight: 800, color: '#0f172a'}}>Referral Network</h3><p style={{color:'#64748b', fontSize: '15px', lineHeight: '1.6'}}>Referred by: <strong>Organic Web</strong> <br/>Made <strong>0</strong> referrals to date.</p></div>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1400px', width: '100%' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0, color: '#0f172a', letterSpacing: '-0.02em' }}>{isEmployee ? 'My Contacts' : (isRecruiting ? 'Candidate CRM' : 'Active Contacts')}</h1>
      <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px', marginBottom: '32px' }}>{isEmployee ? 'Manage the contacts assigned to your account.' : (isRecruiting ? 'Manage your recruiting pipeline and candidates.' : `Manage ${isAdminMode ? 'all company clients' : 'your assigned clients'}.`)}</p>
      
      {!isRecruiting && (
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '0 16px', flex: 1 }}>
            <Ic n="search" s={18} color="#94a3b8" />
            <input placeholder="Search clients by name or email..." style={{ border: 'none', outline: 'none', padding: '16px', width: '100%', fontSize: '15px', color: '#0f172a' }}/>
          </div>
          <select style={{ padding: '16px 24px', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#fff', outline: 'none', fontWeight: 600, color: '#475569', fontSize: '14px', cursor: 'pointer' }}>
            <option>All Policy Types</option><option>IUL</option><option>Term</option>
          </select>
          <select style={{ padding: '16px 24px', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#fff', outline: 'none', fontWeight: 600, color: '#475569', fontSize: '14px', cursor: 'pointer' }}>
            <option>All Health Scores</option><option>Green (Healthy)</option><option>Red (At-Risk)</option>
          </select>
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <tr>
              <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', width: '35%' }}>{isEmployee ? 'Contact Name' : (isRecruiting ? 'Candidate Name' : 'Client Name')}</th>
              <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', width: '20%' }}>Phone</th>
              {!isEmployee && <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', width: '20%' }}>{isRecruiting ? 'Sourced Date' : 'Policy Drafted'}</th>}
              {!isRecruiting && <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Health</th>}
              {(!isEmployee && isRecruiting) && <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', width: '25%' }}>Pipeline Status</th>}
              {(!isEmployee && !isRecruiting && isAdminMode) && <th style={{ padding: '20px 24px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Agent</th>}
            </tr>
          </thead>
          <tbody>
            {mockContacts.map(c => (
              <tr key={c.id} onClick={() => setSelectedContact(c)} style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#f8fafc'} onMouseOut={e => e.currentTarget.style.background = '#fff'}>
                <td style={{ padding: '24px', verticalAlign: 'middle' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '18px', border: '1px solid #bbf7d0', flexShrink: 0 }}>{c.name.charAt(0)}</div>
                    <div><div style={{ fontWeight: 800, color: '#0f172a', fontSize: '16px' }}>{c.name}</div><div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px', fontWeight: 500 }}>{c.email}</div></div>
                  </div>
                </td>
                <td style={{ padding: '24px', verticalAlign: 'middle', fontSize: '15px', color: '#0f172a', fontWeight: 600 }}>{c.phone}</td>
                {!isEmployee && <td style={{ padding: '24px', verticalAlign: 'middle', fontSize: '15px', color: '#475569', fontWeight: 500 }}>{c.date}</td>}
                
                {!isRecruiting && (
                  <td style={{ padding: '24px' }}>
                    <div style={{ width: 16, height: 16, borderRadius: '50%', background: c.health === 'green' ? '#22c55e' : c.health === 'yellow' ? '#f59e0b' : '#ef4444', boxShadow: `0 0 0 4px ${c.health === 'green' ? '#dcfce7' : c.health === 'yellow' ? '#fef3c7' : '#fee2e2'}` }}/>
                  </td>
                )}
                
                {(!isEmployee && isRecruiting) && (
                  <td style={{ padding: '24px', verticalAlign: 'middle' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '160px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontSize: '14px', fontWeight: 800, color: '#16a34a' }}>{c.duration || 'Active'}</span><span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Active</span></div>
                      <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}><div style={{ width: '100%', height: '100%', background: '#22c55e', borderRadius: '3px' }}></div></div>
                    </div>
                  </td>
                )}

                {(!isEmployee && !isRecruiting && isAdminMode) && <td style={{ padding: '24px', color: '#0f172a', fontWeight: 700, fontSize: '15px' }}>{c.agent}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const NotificationsView = () => {
  const mockNotifications = [
    { id: 1, type: 'alert', icon: 'alert', color: '#ef4444', bg: '#fef2f2', title: 'Action Required', text: 'You have a pending notification that requires your immediate attention.', time: '10 min ago' },
    { id: 2, type: 'message', icon: 'chat', color: '#3b82f6', bg: '#eff6ff', title: 'New Message', text: 'Jane Smith replied back: "Can we get on a call to discuss the details?"', time: '1 hour ago' },
  ];
  return (
    <div style={{ maxWidth: '1000px', width: '100%' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0, color: '#0f172a', letterSpacing: '-0.02em' }}>Notifications</h1>
      <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px', marginBottom: '32px' }}>Stay on top of alerts and messages.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {mockNotifications.map(note => (
          <div key={note.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '32px', display: 'flex', gap: '24px', alignItems: 'flex-start', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: note.bg, color: note.color, display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Ic n={note.icon} s={28} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}><h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{note.title}</h3><span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 700 }}>{note.time}</span></div>
              <p style={{ margin: 0, color: '#475569', fontSize: '15px', lineHeight: '1.6' }}>{note.text}</p>
              <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
                <button style={{ background: '#0f172a', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>Mark as Resolved</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const RecruitingFormsView = () => {
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', lead_type: '', showed_up: '', call_notes: '', call_outcome: '', call_date: '', follow_up_needed: '', follow_up_date: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Success! Recruiting call logged successfully.");
    setFormData({ name: '', phone: '', email: '', lead_type: '', showed_up: '', call_notes: '', call_outcome: '', call_date: '', follow_up_needed: '', follow_up_date: '' });
  };

  const inputStyle = { width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '15px', color: '#0f172a', background: '#fff', boxSizing: 'border-box' as const };
  const labelStyle = { display: 'block', fontSize: '13px', fontWeight: 800, color: '#475569', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' };
  const groupStyle = { marginBottom: '24px' };

  return (
    <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0, color: '#0f172a', letterSpacing: '-0.02em' }}>Post-Call Log</h1>
      <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px', marginBottom: '32px' }}>Complete this form immediately after your recruiting calls.</p>
      
      <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: '24px', padding: '48px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
        <div style={groupStyle}><label style={labelStyle}>Contact Lookup *</label><input required style={inputStyle} placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
        <div style={groupStyle}><label style={labelStyle}>Phone *</label><input required style={inputStyle} placeholder="Phone Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} /></div>
        <div style={groupStyle}><label style={labelStyle}>Email *</label><input required type="email" style={inputStyle} placeholder="Email Address" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
        <div style={groupStyle}><label style={labelStyle}>Lead Type *</label>
          <select required style={{...inputStyle, cursor: 'pointer', appearance: 'none'}} value={formData.lead_type} onChange={e => setFormData({...formData, lead_type: e.target.value, call_outcome: ''})}>
            <option value="" disabled>Select Type...</option><option value="licensed">Licensed</option><option value="unlicensed">Unlicensed</option>
          </select>
        </div>
        <div style={groupStyle}><label style={labelStyle}>Did They Show Up? *</label>
          <select required style={{...inputStyle, cursor: 'pointer', appearance: 'none'}} value={formData.showed_up} onChange={e => setFormData({...formData, showed_up: e.target.value})}>
            <option value="" disabled>Select Status...</option><option value="yes">Yes, Showed Up</option><option value="no">No Show</option>
          </select>
        </div>
        <div style={groupStyle}><label style={labelStyle}>Call Notes *</label><textarea required style={{...inputStyle, minHeight: '120px', resize: 'vertical'}} placeholder="Enter comprehensive call notes here..." value={formData.call_notes} onChange={e => setFormData({...formData, call_notes: e.target.value})} /></div>
        {formData.lead_type && (
          <div style={groupStyle}><label style={labelStyle}>Call Outcome *</label>
            <select required style={{...inputStyle, cursor: 'pointer', appearance: 'none', border: '2px solid #3b82f6'}} value={formData.call_outcome} onChange={e => setFormData({...formData, call_outcome: e.target.value})}>
              <option value="" disabled>Select Outcome...</option>
              {formData.lead_type === 'licensed' ? (
                <><option value="closed_ready">Closed Ready to Join</option><option value="not_interested">Not Interested</option><option value="needs_follow_up">Needs Follow Up</option><option value="unqualified">Unqualified</option></>
              ) : (
                <><option value="closed_payment">Closed - Send Payment Link</option><option value="not_interested">Not Interested</option><option value="needs_follow_up">Needs Follow Up</option><option value="unqualified">Unqualified</option></>
              )}
            </select>
          </div>
        )}
        <div style={groupStyle}><label style={labelStyle}>Call Date/Time *</label><input required type="datetime-local" style={inputStyle} value={formData.call_date} onChange={e => setFormData({...formData, call_date: e.target.value})} /></div>
        <div style={groupStyle}><label style={labelStyle}>Follow-Up Needed? *</label>
          <select required style={{...inputStyle, cursor: 'pointer', appearance: 'none'}} value={formData.follow_up_needed} onChange={e => setFormData({...formData, follow_up_needed: e.target.value})}>
            <option value="" disabled>Select...</option><option value="yes">Yes</option><option value="no">No</option>
          </select>
        </div>
        {formData.follow_up_needed === 'yes' && (
          <div style={groupStyle}><label style={labelStyle}>Follow-Up Date</label><input type="date" style={inputStyle} value={formData.follow_up_date} onChange={e => setFormData({...formData, follow_up_date: e.target.value})} /></div>
        )}
        <button type="submit" style={{ width: '100%', background: '#0f172a', color: '#fff', border: 'none', padding: '18px', borderRadius: '12px', fontWeight: 800, fontSize: '16px', cursor: 'pointer', marginTop: '16px' }}>SUBMIT FORM</button>
      </form>
    </div>
  );
};

const InternalFormsView = () => {
  const [formData, setFormData] = useState({ first_name: '', last_name: '', phone: '', email: '', monthly_premium: '' });
  const [activationData, setActivationData] = useState({ first_name: '', last_name: '', phone: '', email: '', policy_effective_date: '', first_payment_status: '', is_active: false });
  
  const [illustrationFile, setIllustrationFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const illustrationInputRef = useRef<HTMLInputElement>(null);

  const handleIllustrationClick = () => illustrationInputRef.current?.click();
  const handleIllustrationChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files && e.target.files[0]) setIllustrationFile(e.target.files[0]); };

  const handleIntakeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    let illustrationUrl = null;

    try {
      if (illustrationFile) {
        const fileExt = illustrationFile.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `public/${fileName}`;

        const { error: uploadError } = await supabase.storage.from('illustrations').upload(filePath, illustrationFile);
        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('illustrations').getPublicUrl(filePath);
        illustrationUrl = data.publicUrl;
      }

      const { error } = await supabase.from('contacts').insert([{ 
            first_name: formData.first_name, last_name: formData.last_name, phone: formData.phone, email: formData.email,
            monthly_premium: parseFloat(formData.monthly_premium || '0'), policy_status: 'pending', illustration_url: illustrationUrl 
      }]);

      if (error) throw error;
      alert("Success! Policy Intake Form and Illustration submitted.");
      setFormData({ first_name: '', last_name: '', phone: '', email: '', monthly_premium: '' });
      setIllustrationFile(null); 
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleActivationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    alert("Success! Activation Form submitted.");
    setActivationData({ first_name: '', last_name: '', phone: '', email: '', policy_effective_date: '', first_payment_status: '', is_active: false });
  };

  const inputStyle = { width: '100%', padding: '16px 20px', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '15px', color: '#0f172a', marginBottom: '16px', boxSizing: 'border-box' as const, background: '#f8fafc' };
  const moneyWrapperStyle = { display: 'flex', alignItems: 'center', width: '100%', borderRadius: '12px', border: '1px solid #cbd5e1', marginBottom: '16px', background: '#f8fafc', padding: '0 20px', boxSizing: 'border-box' as const };
  const moneyInputStyle = { flex: 1, border: 'none', outline: 'none', padding: '16px 10px', fontSize: '15px', background: 'transparent', color: '#0f172a' };

  return (
    <div style={{ maxWidth: '1400px', width: '100%' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0, color: '#0f172a', letterSpacing: '-0.02em' }}>Internal Forms</h1>
      <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px', marginBottom: '24px' }}>Process and activate new client policies.</p>
      
      <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '16px', padding: '24px', display: 'flex', gap: '16px', marginBottom: '40px', alignItems: 'flex-start' }}>
        <div style={{ color: '#ef4444', marginTop: '2px' }}><Ic n="alert" s={24} /></div>
        <div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#991b1b', fontWeight: 800 }}>Workflow Requirement</h3>
          <p style={{ margin: 0, color: '#b91c1c', fontSize: '15px', lineHeight: '1.6' }}>The <strong>Policy Intake Form</strong> must be filled out when you finish the call and close the policy. The <strong>Activation Form</strong> must be filled out when payment is submitted.</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', alignItems: 'flex-start' }}>
        
        {/* POLICY INTAKE FORM */}
        <form onSubmit={handleIntakeSubmit} style={{ flex: '1 1 500px', background: '#fff', borderRadius: '24px', padding: '48px', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, textAlign: 'center', marginBottom: '8px', color: '#0f172a' }}>Policy Intake Form</h2>
          <p style={{ textAlign: 'center', color: '#64748b', fontSize: '14px', marginBottom: '40px' }}>Complete this upon closing the policy.</p>
          
          <input style={inputStyle} placeholder="First Name*" required value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} />
          <input style={inputStyle} placeholder="Last Name*" required value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} />
          <input style={inputStyle} placeholder="Phone*" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
          <input style={inputStyle} placeholder="Email*" required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          
          <input style={inputStyle} placeholder="Address*" />
          <input style={inputStyle} placeholder="City*" />
          <input style={inputStyle} placeholder="State*" />
          <input style={inputStyle} placeholder="Postal Code*" />
          <input style={inputStyle} placeholder="Date of birth*" />
          <textarea style={{ ...inputStyle, borderRadius: '16px', minHeight: '120px', resize: 'vertical' }} placeholder="Client why?*" />
          <select style={{ ...inputStyle, appearance: 'none', cursor: 'pointer', color: '#0f172a' }}><option value="">Type of Sale*</option><option value="term">Term Life</option><option value="whole">Whole Life</option><option value="iul">IUL</option></select>
          <input style={inputStyle} placeholder="Insurance Product*" />
          <div style={moneyWrapperStyle}><span style={{ color: '#0f172a', fontWeight: 800 }}>$</span><input style={moneyInputStyle} placeholder="Face Amount*" /></div>
          <div style={moneyWrapperStyle}><span style={{ color: '#0f172a', fontWeight: 800 }}>$</span><input style={moneyInputStyle} placeholder="Policy Annual Premium*" /></div>
          <div style={moneyWrapperStyle}><span style={{ color: '#0f172a', fontWeight: 800 }}>$</span><input style={moneyInputStyle} placeholder="Monthly Premium*" required type="number" value={formData.monthly_premium} onChange={e => setFormData({...formData, monthly_premium: e.target.value})} /></div>
          <input style={inputStyle} placeholder="Policy Number*" />
          <input style={inputStyle} placeholder="Beneficiary*" />
          <input style={inputStyle} placeholder="Payment Date*" />
          
          {/* FUNCTIONAL FILE UPLOAD DROPZONE */}
          <div onClick={handleIllustrationClick} style={{ border: '2px dashed #cbd5e1', borderRadius: '16px', padding: '40px', textAlign: 'center', marginBottom: '40px', cursor: 'pointer', background: illustrationFile ? '#f0fdf4' : '#f8fafc', borderColor: illustrationFile ? '#22c55e' : '#cbd5e1', transition: '0.2s' }}>
            <div style={{ color: illustrationFile ? '#22c55e' : '#64748b', display: 'flex', justifyContent: 'center' }}><Ic n={illustrationFile ? "check" : "upload"} s={32} /></div>
            <div style={{ marginTop: '16px', fontSize: '15px', fontWeight: 700, color: illustrationFile ? '#16a34a' : '#475569' }}>{illustrationFile ? `Selected: ${illustrationFile.name}` : 'Click to upload IUL / Annuity Illustration'}</div>
            <input type="file" ref={illustrationInputRef} onChange={handleIllustrationChange} style={{ display: 'none' }} accept=".pdf,.png,.jpg,.jpeg,.doc,.docx" />
          </div>
          
          <button disabled={isSubmitting} type="submit" style={{ width: '100%', background: isSubmitting ? '#94a3b8' : '#0f172a', color: '#fff', border: 'none', padding: '20px', borderRadius: '12px', fontWeight: 800, fontSize: '16px', textTransform: 'uppercase', cursor: isSubmitting ? 'not-allowed' : 'pointer', letterSpacing: '0.05em' }}>
            {isSubmitting ? 'Submitting...' : 'Submit Application Form'}
          </button>
        </form>

        {/* ACTIVATION FORM */}
        <form onSubmit={handleActivationSubmit} style={{ flex: '1 1 400px', background: '#fff', borderRadius: '24px', padding: '48px', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)', height: 'fit-content' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, textAlign: 'center', marginBottom: '8px', color: '#0f172a' }}>Activation Form</h2>
          <p style={{ textAlign: 'center', color: '#64748b', fontSize: '14px', marginBottom: '40px' }}>Complete this when payment is submitted.</p>
          <input style={inputStyle} placeholder="First Name*" required value={activationData.first_name} onChange={e => setActivationData({...activationData, first_name: e.target.value})} />
          <input style={inputStyle} placeholder="Last Name*" required value={activationData.last_name} onChange={e => setActivationData({...activationData, last_name: e.target.value})} />
          <input style={inputStyle} placeholder="Phone*" required value={activationData.phone} onChange={e => setActivationData({...activationData, phone: e.target.value})} />
          <input style={inputStyle} placeholder="Email*" required type="email" value={activationData.email} onChange={e => setActivationData({...activationData, email: e.target.value})} />
          <input style={inputStyle} placeholder="Policy Effective Date" type="date" value={activationData.policy_effective_date} onChange={e => setActivationData({...activationData, policy_effective_date: e.target.value})} />
          <select style={{ ...inputStyle, appearance: 'none', cursor: 'pointer', color: '#0f172a', marginBottom: '32px' }} required value={activationData.first_payment_status} onChange={e => setActivationData({...activationData, first_payment_status: e.target.value})}>
            <option value="">First Payment Status*</option><option value="pending">Pending</option><option value="cleared">Cleared</option><option value="failed">Failed</option>
          </select>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', fontWeight: 700, color: '#64748b', cursor: 'pointer', marginBottom: '40px', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
            <input type="checkbox" style={{ width: '20px', height: '20px', accentColor: '#22c55e' }} checked={activationData.is_active} onChange={e => setActivationData({...activationData, is_active: e.target.checked})} /> Policy is active and fully approved
          </label>
          <button type="submit" style={{ width: '100%', background: '#fff', color: '#0f172a', border: '2px solid #0f172a', padding: '20px', borderRadius: '12px', fontWeight: 800, fontSize: '16px', cursor: 'pointer' }}>Submit Activation</button>
        </form>

      </div>
    </div>
  );
};

const RetentionDashboard = ({ profile, overrideAgent, clearOverride }: any) => {
  const [selectedAgent, setSelectedAgent] = useState(profile?.role === 'owner' ? 'all' : 'self');
  const isTeamView = profile?.role === 'owner' && selectedAgent === 'all';

  const mockAgents = [
    { id: 'rory', name: 'Rory Perlow', active: 45, retention: '98%', revenue: '$4,500', failed: 1, pending: 0, time: '2 Days' },
    { id: 'sarah', name: 'Sarah Jenkins', active: 32, retention: '95%', revenue: '$3,200', failed: 0, pending: 2, time: '1 Day' },
  ];

  const growthData = [
    { name: 'Jan', policies: 45 }, { name: 'Feb', policies: 52 },
    { name: 'Mar', policies: 61 }, { name: 'Apr', policies: 75 },
    { name: 'May', policies: 88 }, { name: 'Jun', policies: 104 },
  ];

  const headerTitle = isTeamView ? 'Team Overview' : (selectedAgent === 'self' ? 'My Dashboard' : `${mockAgents.find(a => a.id === selectedAgent)?.name}'s Dashboard`);
  const displayTitle = overrideAgent ? `${overrideAgent.name}'s Dashboard` : headerTitle;

  return (
    <div style={{ maxWidth: '1400px', width: '100%' }}>
      {overrideAgent && (
        <button onClick={clearOverride} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#64748b', fontWeight: 700, cursor: 'pointer', padding: 0, marginBottom: '24px', fontSize: '14px', transition: 'color 0.2s' }}>
          <Ic n="back" s={18} /> Back to Leaderboard
        </button>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0, color: '#0f172a', letterSpacing: '-0.02em' }}>{displayTitle}</h1>
          <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px' }}>{profile?.role === 'owner' && !overrideAgent ? 'Aggregated metrics across your entire agency.' : 'Personal performance and policy metrics.'}</p>
        </div>
        {!overrideAgent && (
          <div style={{ display: 'flex', gap: '16px' }}>
            <select value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)} style={{ padding: '12px 20px', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none', background: '#fff', fontWeight: 700, color: '#0f172a', cursor: 'pointer', fontSize: '14px' }}>
              {profile?.role === 'owner' ? (
                <><option value="all">All Agents (Team View)</option>{mockAgents.map(agent => (<option key={agent.id} value={agent.id}>{agent.name}</option>))}</>
              ) : (<option value="self">{profile?.full_name || 'My Dashboard'}</option>)}
            </select>
          </div>
        )}
      </div>
      
      {/* OWNER: LEAD PIPELINE SUMMARY */}
      {(profile?.role === 'owner' && !overrideAgent) && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '24px' }}>
          {[ { l: 'New Leads (Week)', val: '24', color: '#3b82f6' }, { l: 'Hot Leads', val: '6', color: '#ef4444' }, { l: 'Lead Conversion', val: '12.4%', color: '#22c55e' }, { l: 'Need Follow-Up', val: '15', color: '#f59e0b' } ].map((kpi, i) => (
            <div key={i} style={{ background: '#f8fafc', padding: '32px', borderRadius: '16px', border: '1px solid #cbd5e1' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{kpi.l}</div>
              <div style={{ fontSize: '36px', fontWeight: 800, marginTop: '12px', color: kpi.color }}>{kpi.val}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        {[ { label: 'Active Policies', val: '105', color: '#22c55e' }, { label: 'Retention %', val: '95.00%', color: '#22c55e' }, { label: 'Total Monthly Revenue', val: '$10,500', color: '#0f172a' }, { label: 'Pending Payments', val: '3', color: '#f59e0b' }, { label: 'Failed Payments', val: '3', color: '#ef4444' } ].map((kpi, i) => (
          <div key={i} style={{ background: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{kpi.label}</div>
            <div style={{ fontSize: '36px', fontWeight: 800, marginTop: '12px', color: kpi.color }}>{kpi.val}</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', padding: '40px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', height: '450px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
          <div><h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>Growth Performance</h3><p style={{ margin: '8px 0 0 0', color: '#64748b', fontSize: '14px', fontWeight: 500 }}>Total active policies over time.</p></div>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={growthData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <defs><linearGradient id="colorPol" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22c55e" stopOpacity={0.2}/><stop offset="95%" stopColor="#22c55e" stopOpacity={0}/></linearGradient></defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 13, fill: '#94a3b8', fontWeight: 700}} dy={10} />
              <Tooltip cursor={{stroke: '#e2e8f0', strokeWidth: 2, strokeDasharray: '4 4'}} contentStyle={{borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
              <Area type="monotone" dataKey="policies" stroke="#22c55e" strokeWidth={5} fill="url(#colorPol)" activeDot={{r: 8, strokeWidth: 2}} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <HealthScoreSection />
        <LapseRiskAlerts />
      </div>

      {(isTeamView && !overrideAgent) && (
        <div style={{ background: '#fff', padding: '40px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>Top Agent Performers</h3>
            <button style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', fontWeight: 800, cursor: 'pointer', padding: '10px 20px', borderRadius: '8px', fontSize: '13px' }}>View All Agents</button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '15px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                  <th style={{ padding: '20px 16px', fontWeight: 800, textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.05em' }}>Agent Name</th>
                  <th style={{ padding: '20px 16px', fontWeight: 800, textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.05em' }}>Active Policies</th>
                  <th style={{ padding: '20px 16px', fontWeight: 800, textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.05em' }}>Retention %</th>
                  <th style={{ padding: '20px 16px', fontWeight: 800, textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.05em' }}>Monthly Rev</th>
                </tr>
              </thead>
              <tbody>
                {mockAgents.map(agent => (
                  <tr key={agent.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '24px 16px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '16px' }}><div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f0fdf4', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>{agent.name.charAt(0)}</div>{agent.name}</td>
                    <td style={{ padding: '24px 16px', color: '#0f172a', fontWeight: 700 }}>{agent.active}</td>
                    <td style={{ padding: '24px 16px', color: '#22c55e', fontWeight: 800 }}>{agent.retention}</td>
                    <td style={{ padding: '24px 16px', color: '#0f172a', fontWeight: 700 }}>{agent.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const RecruitingDashboard = ({ profile }: any) => {
  const [selectedAgent, setSelectedAgent] = useState(profile?.role === 'owner' ? 'all' : 'self');
  const isTeamView = profile?.role === 'owner' && selectedAgent === 'all';

  const mockRecruiters = [
    { id: 'rory', name: 'Rory Perlow', active: 112, interviews: 45, hires: 12, conversions: '10.7%', time: '14 Days' },
    { id: 'sarah', name: 'Sarah Jenkins', active: 85, interviews: 32, hires: 8, conversions: '9.4%', time: '18 Days' },
    { id: 'michael', name: 'Michael Sterling', active: 64, interviews: 28, hires: 5, conversions: '7.8%', time: '21 Days' }
  ];

  const growthData = [
    { name: 'Jan', candidates: 120 }, { name: 'Feb', candidates: 150 },
    { name: 'Mar', candidates: 190 }, { name: 'Apr', candidates: 215 },
    { name: 'May', candidates: 250 }, { name: 'Jun', candidates: 310 },
  ];

  const headerTitle = isTeamView ? 'Recruiting Overview' : (selectedAgent === 'self' ? 'My Pipeline' : `${mockRecruiters.find(a => a.id === selectedAgent)?.name}'s Pipeline`);

  return (
    <div style={{ maxWidth: '1400px', width: '100%' }}>
      {!isTeamView && profile?.role === 'owner' && (
        <button onClick={() => setSelectedAgent('all')} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#64748b', fontWeight: 700, cursor: 'pointer', padding: 0, marginBottom: '24px', fontSize: '14px', transition: 'color 0.2s' }}>
          <Ic n="back" s={18} /> Back to Team Overview
        </button>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0, color: '#0f172a', letterSpacing: '-0.02em' }}>{headerTitle}</h1>
          <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px' }}>Track candidate flow, interviews, and hires.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <select value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)} style={{ padding: '12px 20px', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none', background: '#fff', fontWeight: 700, color: '#0f172a', cursor: 'pointer', fontSize: '14px' }}>
            {profile?.role === 'owner' ? (
              <><option value="all">All Recruiters (Team View)</option>{mockRecruiters.map(agent => (<option key={agent.id} value={agent.id}>{agent.name}</option>))}</>
            ) : (<option value="self">{profile?.full_name || 'My Pipeline'}</option>)}
          </select>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        {[ { label: 'Active Candidates', val: '261', color: '#3b82f6' }, { label: 'Interviews Booked', val: '105', color: '#0f172a' }, { label: 'Offers Extended', val: '32', color: '#f59e0b' }, { label: 'Total Hires', val: '25', color: '#22c55e' } ].map((kpi, i) => (
          <div key={i} style={{ background: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}><div style={{ fontSize: '12px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{kpi.label}</div><div style={{ fontSize: '36px', fontWeight: 800, marginTop: '12px', color: kpi.color }}>{kpi.val}</div></div>
        ))}
      </div>

      <div style={{ background: '#fff', padding: '40px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', height: '450px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
          <div><h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>Pipeline Growth</h3><p style={{ margin: '8px 0 0 0', color: '#64748b', fontSize: '14px', fontWeight: 500 }}>Total candidates entering pipeline over time.</p></div>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={growthData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <defs><linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient></defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 13, fill: '#94a3b8', fontWeight: 700}} dy={10} />
              <Tooltip cursor={{stroke: '#e2e8f0', strokeWidth: 2, strokeDasharray: '4 4'}} contentStyle={{borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
              <Area type="monotone" dataKey="candidates" stroke="#3b82f6" strokeWidth={5} fill="url(#colorRec)" activeDot={{r: 8, strokeWidth: 2}} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {isTeamView && (
        <div style={{ background: '#fff', padding: '40px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 32px 0', fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>Recruiter Performance</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '15px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                  <th style={{ padding: '20px 16px', fontWeight: 800, textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.05em' }}>Recruiter Name</th>
                  <th style={{ padding: '20px 16px', fontWeight: 800, textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.05em' }}>Active Candidates</th>
                  <th style={{ padding: '20px 16px', fontWeight: 800, textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.05em' }}>Interviews Booked</th>
                  <th style={{ padding: '20px 16px', fontWeight: 800, textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.05em' }}>Total Hires</th>
                  <th style={{ padding: '20px 16px', fontWeight: 800, textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.05em' }}>Hire Conversion %</th>
                  <th style={{ padding: '20px 16px', fontWeight: 800, textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.05em' }}>Avg Time to Hire</th>
                </tr>
              </thead>
              <tbody>
                {mockRecruiters.map(agent => (
                  <tr key={agent.id} onClick={() => setSelectedAgent(agent.id)} style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '24px 16px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '16px' }}><div style={{ width: 40, height: 40, borderRadius: '50%', background: '#eff6ff', color: '#1e3a8a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>{agent.name.charAt(0)}</div>{agent.name}</td>
                    <td style={{ padding: '24px 16px', color: '#0f172a', fontWeight: 700 }}>{agent.active}</td>
                    <td style={{ padding: '24px 16px', color: '#0f172a', fontWeight: 700 }}>{agent.interviews}</td>
                    <td style={{ padding: '24px 16px', color: '#22c55e', fontWeight: 800 }}>{agent.hires}</td>
                    <td style={{ padding: '24px 16px', color: '#0f172a', fontWeight: 700 }}>{agent.conversions}</td>
                    <td style={{ padding: '24px 16px', color: '#64748b', fontWeight: 600 }}>{agent.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const GhlAccountView = ({ profile, setProfile, isEmployee }: any) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [apiKey, setApiKey] = useState('');

  const [firstName, setFirstName] = useState(profile?.full_name ? profile.full_name.split(' ')[0] : '');
  const [lastName, setLastName] = useState(profile?.full_name ? profile.full_name.split(' ').slice(1).join(' ') : '');

  const handleConnectCalendar = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events',
        queryParams: { access_type: 'offline', prompt: 'consent' },
        redirectTo: window.location.origin 
      }
    });
    if (error) alert("Error connecting calendar: " + error.message);
  };

  const handleGenerateKey = () => { setApiKey(uuidv4()); };
  const handleCopyKey = () => { navigator.clipboard.writeText(apiKey); alert("API Key copied to clipboard!"); };

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
      const newFullName = `${firstName} ${lastName}`.trim();
      const { error: updateError } = await supabase.from('profiles').update({ 
        full_name: newFullName, avatar_url: finalAvatarUrl 
      }).eq('id', profile.id);
      if (updateError) throw updateError;
      setProfile({ ...profile, full_name: newFullName, avatar_url: finalAvatarUrl });
      alert('Profile updated successfully!');
      setAvatarFile(null);
    } catch (error: any) { alert('Error updating profile: ' + error.message); } finally { setUploading(false); }
  };

  return (
    <div style={{ maxWidth: '1200px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0, color: '#0f172a', letterSpacing: '-0.02em' }}>Account Settings</h1>
      <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px', marginBottom: '32px' }}>Manage your profile data, integrations, and security.</p>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px' }}>
        <div style={{ flex: '1 1 600px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div style={{ background: '#fff', padding: '40px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>Personal Data</h3>
            <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', alignItems: 'center' }}>
              <div onClick={handleAvatarClick} style={{ width: 96, height: 96, borderRadius: '50%', background: '#f8fafc', border: '2px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer', position: 'relative' }}>
                {avatarFile ? (<img src={URL.createObjectURL(avatarFile)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />) : profile?.avatar_url ? (<img src={profile.avatar_url} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />) : (<Ic n="camera" s={28} />)}
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '16px', color: '#0f172a' }}>Profile Image</div>
                <div style={{ color: '#64748b', fontSize: '14px', marginTop: '6px', lineHeight: '1.5' }}>{avatarFile ? `Selected: ${avatarFile.name}` : 'Click image to select a new file.'}<br/>Recommended size is 512x512px.</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div><label style={{ fontSize: '13px', color: '#475569', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>First Name</label><input style={{ width: '100%', boxSizing: 'border-box', padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1', marginTop: '8px', fontSize: '15px', outline: 'none', color: '#0f172a' }} value={firstName} onChange={e => setFirstName(e.target.value)} /></div>
              <div><label style={{ fontSize: '13px', color: '#475569', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Last Name</label><input style={{ width: '100%', boxSizing: 'border-box', padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1', marginTop: '8px', fontSize: '15px', outline: 'none', color: '#0f172a' }} value={lastName} onChange={e => setLastName(e.target.value)} /></div>
            </div>
            <div style={{ marginBottom: '32px' }}><label style={{ fontSize: '13px', color: '#475569', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</label><input style={{ width: '100%', boxSizing: 'border-box', padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1', marginTop: '8px', background: '#f8fafc', fontSize: '15px', outline: 'none', color: '#0f172a' }} value={profile?.email} readOnly /></div>
            <button onClick={handleUpdateProfile} disabled={uploading} style={{ background: uploading ? '#94a3b8' : '#22c55e', color: '#fff', border: 'none', padding: '16px 32px', borderRadius: '12px', fontWeight: 800, cursor: uploading ? 'not-allowed' : 'pointer', fontSize: '15px' }}>{uploading ? 'Updating...' : 'Update Profile'}</button>
          </div>

          {/* NEW API KEY MANAGEMENT SECTION */}
          {(!isEmployee && profile?.role === 'owner') && (
            <div style={{ background: '#fff', padding: '40px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>API Integration</h3>
                <span style={{ background: apiKey ? '#f0fdf4' : '#f1f5f9', color: apiKey ? '#16a34a' : '#64748b', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{apiKey ? 'Active' : 'Inactive'}</span>
              </div>
              <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '32px', lineHeight: '1.6' }}>Use this API key to connect your lead sources via Zapier. Your leads will automatically appear in your Leads Pipeline.</p>
              
              {apiKey ? (
                <div style={{ display: 'flex', gap: '16px' }}>
                  <input readOnly value={apiKey} style={{ flex: 1, padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#64748b', outline: 'none', fontFamily: 'monospace', fontSize: '15px' }} />
                  <button onClick={handleCopyKey} style={{ background: '#0f172a', color: '#fff', border: 'none', padding: '0 32px', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', fontSize: '15px' }}>Copy Key</button>
                </div>
              ) : (
                <button onClick={handleGenerateKey} style={{ background: '#22c55e', color: '#fff', border: 'none', padding: '16px 32px', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', fontSize: '15px' }}>Generate New Key</button>
              )}
            </div>
          )}
        </div>

        <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div style={{ background: '#fff', padding: '40px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>Calendar Integration</h3>
            <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '32px', lineHeight: '1.6' }}>Connect your Google Workspace to sync your calendar and generate Meet links for client calls.</p>
            <button onClick={handleConnectCalendar} style={{ width: '100%', background: '#f8fafc', color: '#0f172a', border: '1px solid #cbd5e1', padding: '16px', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{width: 20}}/> Connect Google Account
            </button>
          </div>

          <div style={{ background: '#fff', padding: '40px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>Change Password</h3>
            <div style={{ marginBottom: '20px' }}><label style={{ fontSize: '13px', color: '#475569', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Password</label><input type="password" style={{ width: '100%', boxSizing: 'border-box', padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1', marginTop: '8px', outline: 'none', color: '#0f172a', fontSize: '15px' }} placeholder="••••••••" /></div>
            <div style={{ marginBottom: '32px' }}><label style={{ fontSize: '13px', color: '#475569', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>New Password</label><input type="password" style={{ width: '100%', boxSizing: 'border-box', padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1', marginTop: '8px', outline: 'none', color: '#0f172a', fontSize: '15px' }} placeholder="••••••••" /></div>
            <button style={{ width: '100%', background: '#0f172a', color: '#fff', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', fontSize: '15px' }}>Update Password</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChatUI = ({ messages, onSend, isMini, onClose }: any) => {
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  const handleSend = () => { if (!input.trim()) return; onSend(input); setInput(''); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: isMini ? '480px' : '75vh', width: isMini ? '360px' : '100%', maxWidth: isMini ? 'none' : '900px', background: '#fff', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: isMini ? '0 25px 50px -12px rgba(0,0,0,0.25)' : 'none', position: isMini ? 'fixed' : 'relative', bottom: isMini ? '100px' : 'auto', right: isMini ? '40px' : 'auto', zIndex: isMini ? 10000 : 1, overflow: 'hidden' }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}><div style={{ fontWeight: 800, fontSize: isMini ? '16px' : '20px', display: 'flex', alignItems: 'center', gap: 12, color: '#0f172a' }}><div style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e' }} /> ConnectAI Support</div>{isMini && <button onClick={onClose} style={{ border: 'none', background: 'none', color: '#64748b', cursor: 'pointer', fontSize: '28px', lineHeight: 1 }}>×</button>}</div>
      <div style={{ flex: 1, padding: '24px', background: '#f8fafc', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>{messages.map((msg: any, i: number) => (<div key={i} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', background: msg.role === 'user' ? '#22c55e' : '#fff', color: msg.role === 'user' ? '#fff' : '#0f172a', padding: '14px 20px', borderRadius: msg.role === 'user' ? '20px 20px 0 20px' : '0 20px 20px 20px', border: msg.role === 'user' ? 'none' : '1px solid #e2e8f0', maxWidth: '80%', fontSize: '15px', lineHeight: '1.6', boxShadow: msg.role === 'user' ? 'none' : '0 2px 4px rgba(0,0,0,0.05)' }}>{msg.text}</div>))}<div ref={endRef} /></div>
      <div style={{ padding: '20px', background: '#fff', borderTop: '1px solid #f1f5f9', display: 'flex', gap: 12 }}><input placeholder="Type your message..." style={{ flex: 1, padding: '16px 20px', borderRadius: '16px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '15px', color: '#0f172a', background: '#f8fafc' }} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} /><button onClick={handleSend} style={{ background: '#22c55e', color: '#fff', border: 'none', width: '52px', height: '52px', borderRadius: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Ic n="send" s={20}/></button></div>
    </div>
  );
};

// ============================================================================
// 4. MAIN PORTAL ARCHITECTURE
// ============================================================================
export default function Portal() {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  // GOD MODE & EMPLOYEE STATE
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEmployee, setIsEmployee] = useState(false);
  const [teamPermissions, setTeamPermissions] = useState<any>({});
  const [viewingCompany, setViewingCompany] = useState<any>(null);
  const [drilldownAgent, setDrilldownAgent] = useState<any>(null);

  // CLIENT WORKSPACE STATE
  const [activeSystem, setActiveSystem] = useState('retention');
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);

  // NAVIGATION STATE
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // SUPPORT BOT STATE
  const [isBotOpen, setIsBotOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([{ role: 'bot', text: 'Hi! I am your ConnectAI assistant. How can I help you navigate your portal today?' }]);
  const handleSendMessage = (text: string) => { setChatHistory(prev => [...prev, { role: 'user', text }]); setTimeout(() => { setChatHistory(prev => [...prev, { role: 'bot', text: "I'm your ConnectAI assistant. I am here to help you navigate your portal." }]); }, 800); };

  // LOGIN/REGISTRATION STATE
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
              setTeamPermissions(team);
              if (team.is_admin) {
                setIsAdmin(true);
                setActiveTab('admin_dashboard');
              } else {
                setActiveTab('employee_dashboard');
              }
            } else if (prof.client_type !== 'recruiting') {
              // Default to leads view for retention system users
              setActiveTab('leads');
            }
        }
      }
    };
    init();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload(); 
  };

  if (!session) {
    return (
      <div style={{ display: 'flex', width: '100vw', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', color: '#fff', fontFamily: "'Inter', sans-serif" }}>
        <div style={{ width: '100%', maxWidth: isSignUp ? '540px' : '400px', padding: '40px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '40px' }}>
            <button onClick={() => setIsTeamLogin(false)} style={{ background: 'none', border: 'none', color: !isTeamLogin ? '#fff' : '#64748b', fontWeight: 800, borderBottom: !isTeamLogin ? '2px solid #22c55e' : '2px solid transparent', paddingBottom: '8px', cursor: 'pointer', fontSize: '15px' }}>Client Login</button>
            <button onClick={() => setIsTeamLogin(true)} style={{ background: 'none', border: 'none', color: isTeamLogin ? '#fff' : '#64748b', fontWeight: 800, borderBottom: isTeamLogin ? '2px solid #22c55e' : '2px solid transparent', paddingBottom: '8px', cursor: 'pointer', fontSize: '15px' }}>Team Login</button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '48px' }}><img src={logoImg.src || logoImg} alt="" style={{ width: 34 }} /><span style={{ fontWeight: 800, fontSize: '26px' }}>Connect</span></div>
          
          <h1 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '8px' }}>
            {isSignUp ? 'Create an account' : (isTeamLogin ? 'Connect Team Login' : 'Welcome back')}
          </h1>
          <p style={{ color: '#94a3b8', marginBottom: '40px', fontSize: '15px' }}>
            {isSignUp ? 'Sign up to access your portal.' : (isTeamLogin ? 'Log in to your internal employee account.' : 'Sign in to your account to continue.')}
            <br/>
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            <span onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(''); }} style={{ color: '#22c55e', cursor: 'pointer', fontWeight: 600 }}>
              {isSignUp ? 'Sign in' : 'Create one'}
            </span>
          </p>

          <button onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })} style={{ width: '100%', background: '#000', color: '#fff', border: '1px solid #2d2d2d', padding: '16px', borderRadius: '10px', cursor: 'pointer', marginBottom: '32px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontSize: '15px' }}><img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" style={{width:20}}/> Continue with Google</button>
          <div style={{ position: 'relative', textAlign: 'center', margin: '32px 0' }}><hr style={{ border: 0, borderTop: '1px solid #2d2d2d' }} /><span style={{ position: 'absolute', top: '-10px', left: '44%', background: '#0a0a0a', padding: '0 12px', color: '#64748b', fontSize: '12px', fontWeight: 700 }}>OR</span></div>
          
          <form onSubmit={async (e) => {
            e.preventDefault();
            setErrorMsg('');
            setLoading(true);
            if (isSignUp) {
              const { data, error } = await supabase.auth.signUp({ email, password: pass });
              if (data.user) {
                await supabase.from('profiles').insert([{ 
                  id: data.user.id, email, 
                  full_name: `${reg.fName} ${reg.lName}`, 
                  first_name: reg.fName, last_name: reg.lName,
                  phone: reg.phone, company_name: reg.company, 
                  client_type: reg.system, role: reg.role, is_verified: false 
                }]);
                alert("Account created! Approval pending.");
                window.location.reload();
              } else if (error) setErrorMsg(error.message);
            } else {
              const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
              if (error) setErrorMsg(error.message);
              else window.location.reload();
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
                  <select style={{ width: '100%', padding: '14px', background: '#1a1a1a', border: '1px solid #2d2d2d', color: '#fff', borderRadius: '10px', outline: 'none' }} value={reg.system} onChange={e => setReg({...reg, system: e.target.value})}>
                    <option value="recruiting">Recruiting</option><option value="retention">Retention</option>
                  </select>
                </div>
                <div style={{gridColumn: 'span 1'}}><label style={{fontSize: '10px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px', display: 'block'}}>Account Role</label>
                  <select style={{ width: '100%', padding: '14px', background: '#1a1a1a', border: '1px solid #2d2d2d', color: '#fff', borderRadius: '10px', outline: 'none' }} value={reg.role} onChange={e => setReg({...reg, role: e.target.value})}>
                    <option value="agent">Agent</option><option value="owner">Agency Owner</option>
                  </select>
                </div>
              </div>
            )}
            <input placeholder="Email" style={{ width: '100%', boxSizing: 'border-box', padding: '16px', background: '#1a1a1a', border: '1px solid #2d2d2d', color: '#fff', borderRadius: '10px', marginBottom: '16px', outline: 'none' }} value={email} onChange={e => setEmail(e.target.value)} />
            <input placeholder="Password" type="password" style={{ width: '100%', boxSizing: 'border-box', padding: '16px', background: '#1a1a1a', border: '1px solid #2d2d2d', color: '#fff', borderRadius: '10px', marginBottom: '24px', outline: 'none' }} value={pass} onChange={e => setPass(e.target.value)} />
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
          <p style={{ color: '#64748b', lineHeight: 1.6, margin: 0, fontSize: '16px' }}>
            Hi <strong>{profile.full_name}</strong>! Your registration has been submitted. To maintain security, an administrator must verify your company details before you can access the <strong>{profile.client_type}</strong> system.
          </p>
          <button onClick={handleSignOut} style={{ marginTop: '40px', background: '#f1f5f9', color: '#475569', border: 'none', padding: '14px 32px', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', fontSize: '15px' }}>Back to Login</button>
        </div>
      </div>
    );
  }

  // ─── DYNAMIC SIDEBAR LOGIC ───
  const getNavItems = () => {
    // 1. ADMIN MENU
    if (isAdmin) return [
      { id: 'admin_dashboard', label: 'HQ Command', icon: 'home' },
      { id: 'admin_calendar', label: 'Sales Calendar', icon: 'calendar' },
      { id: 'admin_contacts', label: 'Prospects & Clients', icon: 'users' },
      { id: 'companies', label: 'Client Companies', icon: 'briefcase' },
      { id: 'team_management', label: 'Team Management', icon: 'settings' },
      { id: 'verify', label: 'Verification Queue', icon: 'shield' },
      { id: 'team', label: 'My Internal Team', icon: 'chat' },
      { id: 'account', label: 'Account Settings', icon: 'user' },
    ];
    // 2. EMPLOYEE MENU
    if (isEmployee) {
      let nav = [{ id: 'employee_dashboard', label: 'My Dashboard', icon: 'home' }];
      if (teamPermissions?.can_see_conversations) nav.push({ id: 'conversations', label: 'Conversations', icon: 'chat' });
      if (teamPermissions?.can_see_calendar) nav.push({ id: 'emp_calendar', label: 'Calendar', icon: 'calendar' });
      if (teamPermissions?.can_see_contacts) nav.push({ id: 'emp_contacts', label: 'Contacts', icon: 'users' });
      nav.push({ id: 'helpdesk', label: 'Support Inbox', icon: 'forms' });
      nav.push({ id: 'team', label: 'Internal Team', icon: 'chat' });
      nav.push({ id: 'account', label: 'Account Settings', icon: 'user' });
      return nav;
    }
    
    // 3. CLIENT MENU (Role-Scoped)
    let items = [];
    if (activeSystem !== 'recruiting') {
       items.push({ id: 'leads', label: 'Leads Pipeline', icon: 'leads' });
    }
    
    items.push({ id: 'dashboard', label: profile?.role === 'owner' ? 'Company Overview' : 'Overview', icon: 'home' });
    
    if (profile?.role === 'owner') {
      items.push({ id: 'performance', label: 'Agent Performance', icon: 'trending' });
      items.push({ id: 'forecast', label: activeSystem === 'recruiting' ? 'Recruiting Forecast' : 'Revenue Forecast', icon: 'trending' });
    }
    
    items.push({ id: 'calendar', label: 'Calendar', icon: 'calendar' });
    if (activeSystem !== 'recruiting') items.push({ id: 'reviews', label: 'Policy Reviews', icon: 'check' });
    
    items.push({ id: 'forms', label: 'Internal Forms', icon: 'forms' });
    items.push({ id: 'contacts', label: 'Contacts', icon: 'users' });
    items.push({ id: 'notifications', label: 'Notifications', icon: 'bell' });
    items.push({ id: 'account', label: 'Account Settings', icon: 'user' });
    
    return items;
  };

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', fontFamily: "'Inter', sans-serif", background: '#f8fafc', overflow: 'hidden' }}>
      <style>{`.ni { display:flex; align-items:center; gap:14px; padding:16px 20px; border-radius:12px; color:#64748b; font-size:15px; font-weight:600; cursor:pointer; border:none; background:none; width:100%; text-align:left; transition:0.2s; margin-bottom: 6px; } .ni:hover { background:#f1f5f9; color:#0f172a; } .ni.on { background:#0f172a !important; color:#fff !important; font-weight: 700; }`}</style>
      
      <aside style={{ width: '320px', background: '#fff', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', padding: '40px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '48px', padding: '0 8px' }}>
          <img src={logoImg.src || logoImg} style={{width:36}}/>
          <span style={{fontWeight:800, fontSize:'28px', color: '#0f172a', letterSpacing: '-0.02em'}}>Connect</span>
        </div>
        
        {/* PROFILE HEADER WITH CONDITIONAL DROPDOWN */}
        <div style={{ position: 'relative', marginBottom: '48px' }}>
            <div onClick={() => (!isEmployee && profile?.client_type === 'both') && setShowWorkspaceMenu(!showWorkspaceMenu)} style={{ padding: '20px', background: isEmployee ? '#f0fdf4' : '#f8fafc', borderRadius: '16px', border: isEmployee ? '1px solid #bbf7d0' : '1px solid #e2e8f0', cursor: (!isEmployee && profile?.client_type === 'both') ? 'pointer' : 'default', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: 44, height: 44, borderRadius: '12px', background: isEmployee ? '#16a34a' : '#0f172a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '18px' }}>{profile?.full_name?.charAt(0) || 'U'}</div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: isEmployee ? '#166534' : '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{profile?.full_name || 'User'}</div>
                  <div style={{ fontSize: '13px', color: isEmployee ? '#22c55e' : '#64748b', fontWeight: 700, marginTop: '2px' }}>
                    {isAdmin ? 'Connect HQ Admin' : (isEmployee ? 'Connect Team' : (activeSystem === 'recruiting' ? 'Recruiting' : 'Retention'))}
                  </div>
                </div>
                {(!isEmployee && profile?.client_type === 'both') && <Ic n="chevronDown" s={20} />}
            </div>
            {showWorkspaceMenu && !isEmployee && profile?.client_type === 'both' && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', zIndex: 100, padding: '12px', marginTop: '12px' }}>
                    <button onClick={() => { setActiveSystem('recruiting'); setShowWorkspaceMenu(false); setActiveTab('dashboard'); }} style={{ width: '100%', textAlign: 'left', padding: '16px', borderRadius: '10px', border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>Recruiting System</button>
                    <button onClick={() => { setActiveSystem('retention'); setShowWorkspaceMenu(false); setActiveTab('leads'); }} style={{ width: '100%', textAlign: 'left', padding: '16px', borderRadius: '10px', border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>Retention System</button>
                </div>
            )}
        </div>

        <nav style={{ flex: 1, overflowY: 'auto' }}>
            {getNavItems().map(item => (
              <button key={item.id} className={`ni ${activeTab === item.id ? 'on' : ''}`} onClick={() => { setActiveTab(item.id); setViewingCompany(null); setDrilldownAgent(null); }}><Ic n={item.icon} /> {item.label}</button>
            ))}
        </nav>

        {/* UNIVERSAL SIGN OUT BUTTON */}
        <div style={{ marginTop: 'auto', paddingTop: '32px', borderTop: '1px solid #e2e8f0' }}>
          <button onClick={handleSignOut} style={{ width: '100%', padding: '16px', borderRadius: '12px', background: '#fef2f2', color: '#ef4444', fontWeight: 800, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '15px' }}>
            <Ic n="out" s={18} /> Sign Out
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, padding: '80px 60px', overflowY: 'auto' }}>
        {/* IMPERSONATION MODE (Admin looking at a specific company) */}
        {viewingCompany ? (
            <div>
                <button onClick={() => setViewingCompany(null)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#64748b', fontWeight: 800, cursor: 'pointer', marginBottom: '32px', fontSize: '15px' }}><Ic n="back" s={20} /> Back to Companies</button>
                <div style={{ background: '#0f172a', color: '#fff', padding: '24px 40px', borderRadius: '20px', marginBottom: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div><span style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Auditing Client</span><h2 style={{ margin: '8px 0 0 0', fontSize: '28px', fontWeight: 800 }}>{viewingCompany.name}</h2></div>
                    <div style={{ textAlign: 'right' }}><span style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Subscription</span><div style={{ fontWeight: 800, color: '#22c55e', textTransform: 'capitalize', fontSize: '20px', marginTop: '8px' }}>{viewingCompany.subscription_type}</div></div>
                </div>
                {viewingCompany.subscription_type === 'recruiting' ? <RecruitingDashboard profile={profile} /> : <RetentionDashboard profile={profile} overrideAgent={null} clearOverride={() => {}} />}
            </div>
        ) : (
            <>
                {/* 1. ADMIN EXCLUSIVE VIEWS */}
                {isAdmin && activeTab === 'admin_dashboard' && <AdminSalesDashboard />}
                {isAdmin && activeTab === 'admin_calendar' && <AdminCalendarView />}
                {isAdmin && activeTab === 'admin_contacts' && <AdminContactsView />}
                {isAdmin && activeTab === 'companies' && <AdminCompaniesView onSelectCompany={setViewingCompany} />}
                {isAdmin && activeTab === 'team_management' && <AdminTeamManagementView />}
                {isAdmin && activeTab === 'verify' && <VerificationQueue />}
                
                {/* 2. EMPLOYEE DYNAMIC VIEWS */}
                {isEmployee && !isAdmin && activeTab === 'employee_dashboard' && <EmployeeDashboard profile={profile} />}
                {isEmployee && !isAdmin && activeTab === 'conversations' && teamPermissions?.can_see_conversations && <EmployeeConversationsView />}
                {isEmployee && !isAdmin && activeTab === 'emp_calendar' && teamPermissions?.can_see_calendar && <EmployeeCalendarView />}
                {isEmployee && !isAdmin && activeTab === 'emp_contacts' && teamPermissions?.can_see_contacts && <ContactsView isEmployee={true} profile={profile} />}
                {isEmployee && !isAdmin && activeTab === 'helpdesk' && <HelpDeskView />}

                {/* 3. SHARED INTERNAL VIEWS */}
                {isEmployee && activeTab === 'team' && <InternalTeamHub profile={profile} />}
                
                {/* 4. CLIENT VIEWS (Recruiting & Retention) */}
                {!isEmployee && activeTab === 'leads' && <LeadsView />}
                {!isEmployee && activeTab === 'dashboard' && (activeSystem === 'recruiting' ? <RecruitingDashboard profile={profile} /> : <RetentionDashboard profile={profile} overrideAgent={drilldownAgent} clearOverride={() => setDrilldownAgent(null)} />)}
                {!isEmployee && activeTab === 'forms' && (activeSystem === 'recruiting' ? <RecruitingFormsView /> : <InternalFormsView />)}
                {!isEmployee && activeTab === 'calendar' && <CalendarView isRecruiting={activeSystem === 'recruiting'} />}
                {!isEmployee && activeTab === 'contacts' && <ContactsView isRecruiting={activeSystem === 'recruiting'} profile={profile} />}
                {!isEmployee && activeTab === 'notifications' && <NotificationsView />}
                {!isEmployee && activeTab === 'performance' && <AgentPerformancePage isRecruiting={activeSystem === 'recruiting'} onAgentSelect={(agent: any) => { setDrilldownAgent(agent); setActiveTab('dashboard'); }} />}
                {!isEmployee && activeTab === 'forecast' && <ForecastingPage isRecruiting={activeSystem === 'recruiting'} />}
                {!isEmployee && activeTab === 'reviews' && <PolicyReviewsPage isAdminMode={profile?.role === 'owner'} />}
                
                {/* 5. GLOBAL VIEWS */}
                {activeTab === 'account' && <GhlAccountView profile={profile} setProfile={setProfile} isEmployee={isEmployee} />}
            </>
        )}
      </main>

      {/* FLOATING SUPPORT BOT (Only visible for clients) */}
      {!isEmployee && isBotOpen && <ChatUI messages={chatHistory} onSend={handleSendMessage} isMini={true} onClose={() => setIsBotOpen(false)} />}
      {!isEmployee && (
        <div onClick={() => setIsBotOpen(!isBotOpen)} style={{ position: 'fixed', bottom: '40px', right: '40px', width: '72px', height: '72px', background: '#22c55e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer', boxShadow: '0 12px 30px rgba(34,197,94,0.4)', zIndex: 10001, transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
          <Ic n="chat" s={32} />
        </div>
      )}

    </div>
  );
}
