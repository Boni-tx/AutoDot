"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface BountyItem {
  id: string;
  title: string;
  pot: string;
  status: 'Awaiting PR' | 'AI Reviewing' | 'Completed';
  applicants: number;
  date: string;
}

interface TransactionItem {
  hash: string;
  type: 'Bounty Funded' | 'Escrow Release' | 'Contract Updated' | 'Contract Revoked';
  amount: string;
  to?: string;
  date: string;
}

interface NotificationItem {
  id: string;
  message: string;
  time: string;
}

export default function BusinessDashboard() {
  const router = useRouter();
  const [bounties, setBounties] = useState<BountyItem[]>([]);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [filter, setFilter] = useState<'All' | 'Awaiting PR' | 'AI Reviewing' | 'Completed'>('All');
  
  // Estados do Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newPot, setNewPot] = useState('');
  const [deployStep, setDeployStep] = useState<'idle' | 'sig' | 'deploy' | 'success'>('idle');

  // Estados de Notificação
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Estados dos Contadores Animados
  const [animatedPot, setAnimatedPot] = useState(0);
  const [animatedActive, setAnimatedActive] = useState(0);

  // Inicialização
  useEffect(() => {
    const defaultBounties: BountyItem[] = [
      { id: '1', title: "Optimize Smart Contract Gas Limit", pot: "500", status: "Awaiting PR", applicants: 3, date: "10 mins ago" },
      { id: '2', title: "Refactor Frontend UI Architecture", pot: "250", status: "AI Reviewing", applicants: 1, date: "1 hour ago" },
    ];
    const defaultTransactions: TransactionItem[] = [
      { hash: "0x8f...3alb", type: "Escrow Release", amount: "100 POT", to: "Satoshi AI", date: "2 mins ago" }
    ];

    const savedBounties = localStorage.getItem('autodot_bounties');
    if (savedBounties) {
      setBounties(JSON.parse(savedBounties));
    } else {
      setBounties(defaultBounties);
      localStorage.setItem('autodot_bounties', JSON.stringify(defaultBounties));
    }
    setTransactions(defaultTransactions);
  }, []);

  // Contadores Animados
  useEffect(() => {
    if (bounties.length === 0) {
      setAnimatedPot(0);
      setAnimatedActive(0);
      return;
    }
    const totalPot = bounties.reduce((acc, curr) => acc + (curr.status !== 'Completed' ? Number(curr.pot) : 0), 0);
    const activeCount = bounties.filter(b => b.status !== 'Completed').length;

    let potCurrent = 0;
    const potTimer = setInterval(() => {
      potCurrent += Math.ceil(totalPot / 15);
      if (potCurrent >= totalPot) { setAnimatedPot(totalPot); clearInterval(potTimer); } 
      else { setAnimatedPot(potCurrent); }
    }, 25);

    let activeCurrent = 0;
    const activeTimer = setInterval(() => {
      activeCurrent += 1;
      if (activeCurrent >= activeCount) { setAnimatedActive(activeCount); clearInterval(activeTimer); } 
      else { setAnimatedActive(activeCurrent); }
    }, 60);

    return () => { clearInterval(potTimer); clearInterval(activeTimer); };
  }, [bounties]);

  // CRUD: Criar / Editar Escrow
  const handleDeployEscrow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPot) return;

    setDeployStep('sig');
    setTimeout(() => setDeployStep('deploy'), 1800);
    setTimeout(() => {
      setDeployStep('success');
      
      let updatedBounties;
      if (editingId) {
        updatedBounties = bounties.map(b => 
          b.id === editingId ? { ...b, title: newTitle, pot: newPot } : b
        );
        addTransaction('Contract Updated', `${newPot} POT`);
        addNotification(`Contract "${newTitle}" updated.`);
      } else {
        const newBounty: BountyItem = {
          id: Date.now().toString(),
          title: newTitle, pot: newPot, status: 'Awaiting PR', applicants: 0, date: 'Just now'
        };
        updatedBounties = [newBounty, ...bounties];
        addTransaction('Bounty Funded', `${newPot} POT`);
        addNotification(`New escrow launched: "${newTitle}".`);
      }

      setBounties(updatedBounties);
      localStorage.setItem('autodot_bounties', JSON.stringify(updatedBounties));
      
      // Dispara o evento de comunicação em tempo real entre as abas/telas
      window.dispatchEvent(new Event('autodot_update'));

      setTimeout(() => {
        setIsModalOpen(false);
        setNewTitle(''); setNewPot(''); setEditingId(null); setDeployStep('idle');
      }, 1200);
    }, 4200);
  };

  // CRUD: Deletar Escrow
  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to revoke the escrow for "${title}"?`)) {
      const updatedBounties = bounties.filter(b => b.id !== id);
      setBounties(updatedBounties);
      localStorage.setItem('autodot_bounties', JSON.stringify(updatedBounties));
      addTransaction('Contract Revoked', '0 POT');
      addNotification(`Contract "${title}" revoked.`);
      window.dispatchEvent(new Event('autodot_update'));
    }
  };

  const openEditModal = (bounty: BountyItem) => {
    setEditingId(bounty.id);
    setNewTitle(bounty.title);
    setNewPot(bounty.pot);
    setIsModalOpen(true);
  };

  const addTransaction = (type: any, amount: string) => {
    setTransactions([{ hash: `0x${Math.random().toString(16).substr(2, 6)}...${Math.random().toString(16).substr(2, 4)}`, type, amount, date: 'Just now' }, ...transactions]);
  };

  const addNotification = (message: string) => {
    setNotifications(prev => [{ id: Date.now().toString(), message, time: 'Just now' }, ...prev]);
  };

  const filteredBounties = bounties.filter(bounty => filter === 'All' ? true : bounty.status === filter);

  return (
    <div className="min-h-screen bg-[#050A24] text-[#FFF8D3] font-sans p-6 md:p-12 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#F6C97D]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Botão Superior para Voltar para o Workspace */}
        <div className="mb-6">
          <button 
            onClick={() => router.push('/workspace')}
            className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#F6C97D]/60 hover:text-[#F6C97D] transition-colors bg-white/[0.02] border border-white/5 px-4 py-2 rounded-xl hover:border-[#F6C97D]/30"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            ← Back to Workspace
          </button>
        </div>

        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <img src="/Dot (4).png" alt="AutoDot" className="h-12 object-contain" />
              <span className="text-[10px] uppercase tracking-[0.3em] bg-[#F6C97D]/10 border border-[#F6C97D]/30 text-[#F6C97D] px-2 py-0.5 rounded-md font-mono">Business Portal</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-light">Protocol <span className="text-[#F6C97D] italic">Overview</span></h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Dropdown de Notificações Gringo Refinado */}
            <div className="relative">
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="w-12 h-12 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/10 transition-all flex items-center justify-center text-white/50 hover:text-white relative"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                {notifications.length > 0 && <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-[#0C1A54]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-2xl z-50 animate-fadeIn origin-top-right">
                  <h3 className="text-[#F6C97D] text-[10px] font-mono uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#F6C97D] rounded-full"></span> System Alerts
                  </h3>
                  
                  {notifications.length === 0 ? (
                    <div className="py-8 flex flex-col items-center justify-center opacity-40">
                      <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                      <p className="text-xs font-light italic">No new alerts found.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3 max-h-[250px] overflow-y-auto custom-scroll pr-1">
                      {notifications.map(notif => (
                        <div key={notif.id} className="bg-white/5 border border-white/10 p-3 rounded-xl">
                          <p className="text-xs text-white font-light leading-tight mb-1">{notif.message}</p>
                          <p className="text-[9px] text-[#F6C97D]/50 font-mono">{notif.time}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <button 
              onClick={() => { setEditingId(null); setNewTitle(''); setNewPot(''); setIsModalOpen(true); }}
              className="px-6 py-3 h-12 bg-[#F6C97D] text-[#0C1A54] font-bold text-xs uppercase tracking-[0.15em] rounded-xl shadow-[0_0_30px_rgba(246,201,125,0.2)] hover:scale-[1.03] transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
              Deploy New Escrow
            </button>
          </div>
        </header>

        {/* Estatísticas */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Total POT Locked", value: `${animatedPot.toLocaleString()} POT`, trend: "Secured in escrow", color: "text-[#F6C97D]" },
            { label: "Active Bounties", value: animatedActive, trend: "Live requirements", color: "text-white" },
            { label: "Tasks Completed", value: bounties.filter(b => b.status === 'Completed').length, trend: "Merged autonomously", color: "text-green-400" },
            { label: "Avg. AI Review Time", value: "1.2s", trend: "Military-grade audit", color: "text-blue-400" }
          ].map((card, i) => (
            <div key={i} className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 backdrop-blur-xl hover:border-[#F6C97D]/20 transition-all">
              <p className="text-[10px] text-[#FFF8D3]/40 uppercase tracking-widest mb-2">{card.label}</p>
              <p className={`text-3xl font-light mb-1 ${card.color} tracking-tight`}>{card.value}</p>
              <p className="text-[11px] text-[#FFF8D3]/50 font-light">{card.trend}</p>
            </div>
          ))}
        </section>

        {/* Listagem */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white/[0.01] border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-md">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <h2 className="text-lg font-light text-white">Live Escrows</h2>
              <div className="flex gap-1.5 bg-black/20 p-1 rounded-xl border border-white/5 overflow-x-auto">
                {(['All', 'Awaiting PR', 'AI Reviewing', 'Completed'] as const).map((tab) => (
                  <button key={tab} onClick={() => setFilter(tab)} className={`px-3 py-1.5 text-[10px] uppercase tracking-wider rounded-lg transition-all ${filter === tab ? 'bg-[#F6C97D] text-[#0C1A54] font-bold' : 'text-[#FFF8D3]/60 hover:text-white'}`}>
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] uppercase tracking-widest text-[#FFF8D3]/30 font-mono">
                    <th className="pb-4">Bounty Title</th>
                    <th className="pb-4">Value</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {filteredBounties.map((bounty) => (
                    <tr key={bounty.id} className="group hover:bg-white/[0.01]">
                      <td className="py-4 pr-4">
                        <p className="text-sm font-light text-white group-hover:text-[#F6C97D] transition-colors">{bounty.title}</p>
                        <p className="text-[10px] font-mono text-white/20">ID: {bounty.id}</p>
                      </td>
                      <td className="py-4 font-mono text-sm text-[#F6C97D] font-bold">{Number(bounty.pot).toLocaleString()} POT</td>
                      <td className="py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono border ${bounty.status === 'Completed' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-[#F6C97D]/10 border-[#F6C97D]/30 text-[#F6C97D]'}`}>
                          {bounty.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEditModal(bounty)} className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                          </button>
                          <button onClick={() => handleDelete(bounty.id, bounty.title)} className="p-2 hover:bg-red-500/10 rounded-lg text-white/60 hover:text-red-400 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Histórico Transações */}
          <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-md">
            <h2 className="text-sm font-mono text-[#F6C97D] uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#F6C97D] animate-pulse" /> On-chain Stream
            </h2>
            <div className="flex flex-col gap-4 overflow-y-auto max-h-[400px] pr-1 custom-scroll">
              {transactions.map((tx, i) => (
                <div key={i} className="p-4 rounded-xl border border-white/[0.03] bg-black/20">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs text-white font-medium">{tx.type}</p>
                    <p className={`text-xs font-mono font-bold ${tx.type.includes('Revoked') ? 'text-red-400' : 'text-[#F6C97D]'}`}>{tx.amount}</p>
                  </div>
                  <p className="text-[10px] text-white/30 font-mono">{tx.hash} • {tx.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL COM FLUXO WEB3 ULTRA MODERNO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#0C1A54] border border-white/10 w-full max-w-md rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            
            {deployStep === 'idle' && (
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}

            {deployStep === 'idle' ? (
              <form onSubmit={handleDeployEscrow} className="flex flex-col gap-5">
                <div>
                  <h3 className="text-xl font-light text-white mb-1">{editingId ? 'Modify' : 'Deploy New'} <span className="text-[#F6C97D] italic">Escrow</span></h3>
                  <p className="text-xs text-[#FFF8D3]/50">Cryptographic lockbound smart contract parameters.</p>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-mono uppercase text-[#F6C97D]">Bounty Specification Title</label>
                  <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#F6C97D]" required />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-mono uppercase text-[#F6C97D]">Locked Amount (POT)</label>
                  <input type="number" value={newPot} onChange={(e) => setNewPot(e.target.value)} className="bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#F6C97D] font-mono" required />
                </div>
                <button type="submit" className="w-full mt-2 py-4 bg-[#F6C97D] text-[#0C1A54] text-xs font-bold font-mono uppercase tracking-[0.2em] rounded-xl hover:scale-[1.02] transition-all shadow-lg">
                  {editingId ? 'Update Smart Contract' : 'Deploy to Network'}
                </button>
              </form>
            ) : (
              /* NOVA ANIMAÇÃO COMPLETA DE DEPLOY E VALIDAÇÃO CRIPTOGRÁFICA */
              <div className="flex flex-col items-center justify-center py-8 text-center">
                {deployStep === 'sig' && (
                  <div className="w-full flex flex-col items-center animate-fadeIn">
                    <div className="relative w-16 h-16 mb-6 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-4 border-[#F6C97D]/20 border-t-[#F6C97D] animate-spin" />
                      <svg className="w-6 h-6 text-[#F6C97D] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                    </div>
                    <p className="text-sm font-mono text-[#F6C97D] uppercase tracking-widest mb-2">[1/3] Requesting Signature</p>
                    <p className="text-xs text-white/40 max-w-[280px]">Please confirm the cryptography parameters inside your connected Web3 extension.</p>
                  </div>
                )}

                {deployStep === 'deploy' && (
                  <div className="w-full flex flex-col items-center animate-fadeIn">
                    <div className="relative w-16 h-16 mb-6 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-4 border-blue-500/20 border-t-blue-400 Jack-spin animate-spin" />
                      <div className="absolute w-12 h-12 bg-blue-500/10 rounded-full animate-ping" />
                      <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                    </div>
                    <p className="text-sm font-mono text-blue-400 uppercase tracking-widest mb-2">[2/3] Broadcasting WASM</p>
                    <div className="w-48 bg-white/5 h-1.5 rounded-full overflow-hidden mb-2">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-400 h-full w-full rounded-full animate-loadingBar" />
                    </div>
                    <p className="text-[10px] text-white/30 font-mono">Gas estimation: 0.042 DOT • Block indexing...</p>
                  </div>
                )}

                {deployStep === 'success' && (
                  <div className="w-full flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/40 flex items-center justify-center mb-6 scale-up-animation shadow-[0_0_25px_rgba(34,197,94,0.2)]">
                      <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <p className="text-sm font-mono text-green-400 uppercase tracking-widest mb-1 font-bold">[3/3] Escrow Finalized</p>
                    <p className="text-xs text-white/50">Smart contract compiled and verified live.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ESTILOS DE SCROLLBAR E ANIMAÇÕES COMPLETOS */}
      <style jsx global>{`
        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }

        /* Correção Definitiva da Barra Lateral do Navegador */
        html, body {
          background-color: #050A24;
        }
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #050A24;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(246, 201, 125, 0.15);
          border-radius: 10px;
          border: 2px solid #050A24;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(246, 201, 125, 0.4);
        }

        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 4px; }
        .custom-scroll:hover::-webkit-scrollbar-thumb { background: rgba(246,201,125,0.2); }

        .animate-fadeIn { animation: fadeIn 0.25s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
        
        .scale-up-animation { animation: scaleUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        @keyframes scaleUp { from { transform: scale(0.6); opacity: 0; } to { transform: scale(1); opacity: 1; } }

        @keyframes loadBar { from { transform: translateX(-100%); } to { transform: translateX(0%); } }
        .animate-loadingBar { animation: loadBar 2s cubic-bezier(0.1, 0.85, 0.25, 1) forwards; }
      `}</style>
    </div>
  );
}