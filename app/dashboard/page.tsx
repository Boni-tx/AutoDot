"use client";

import React, { useState } from 'react';

export default function BusinessDashboard() {
  const [isWalletConnected, setIsWalletConnected] = useState(true); // Simulando já conectado para o demo

  // Dados mockados para a apresentação
  const stats = [
    { label: "Total POT Locked", value: "1,250", trend: "+15%", positive: true },
    { label: "Active Bounties", value: "4", trend: "Stable", positive: true },
    { label: "Tasks Completed", value: "12", trend: "+3 this week", positive: true },
    { label: "Avg. AI Review Time", value: "1.2s", trend: "-0.4s", positive: true },
  ];

  const activeBounties = [
    { title: "Optimize Smart Contract", pot: "500", status: "Awaiting PR", applicants: 3 },
    { title: "Refactor Frontend UI", pot: "250", status: "AI Reviewing", applicants: 1 },
    { title: "Create API Endpoint", pot: "100", status: "Completed", applicants: 5 },
    { title: "Write Rust Tests", pot: "400", status: "Awaiting PR", applicants: 0 },
  ];

  const transactions = [
    { hash: "0x8f...3a1b", type: "Escrow Release", amount: "100 POT", to: "Satoshi_AI", date: "2 mins ago" },
    { hash: "0x2c...9f4e", type: "Bounty Funded", amount: "500 POT", to: "AutoDot Escrow", date: "1 hour ago" },
    { hash: "0x1a...7c2d", type: "Escrow Release", amount: "150 POT", to: "DevKush", date: "Yesterday" },
  ];

  return (
    <div className="min-h-screen bg-[#0C1A54] text-[#FFF8D3] font-sans flex flex-col relative overflow-hidden">
      
      {/* Header Simplificado */}
      <header className="w-full p-8 flex justify-between items-center max-w-7xl mx-auto z-10 border-b border-[#FFF8D3]/5">
        <div className="flex items-center gap-3">
          <img src="/Dot (4).png" alt="AutoDot Logo" className="h-16 w-auto" />
          <span className="text-[#F6C97D] font-mono text-xs tracking-widest uppercase ml-4 border-l border-[#FFF8D3]/20 pl-4">Business Area</span>
        </div>
        
        <div className="flex gap-4 items-center">
          <button className={`px-6 py-2.5 font-semibold rounded-md transition-all uppercase text-xs tracking-[0.2em] flex items-center gap-2
              ${isWalletConnected ? 'bg-white/10 text-[#F6C97D] border border-[#F6C97D]/30' : 'bg-[#F6C97D] text-[#0C1A54]'}`}
          >
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            sponsor_dev.dot
          </button>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="flex-grow flex flex-col px-6 py-12 w-full max-w-7xl mx-auto z-10">
        
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-light tracking-tighter mb-2">Workspace <span className="text-[#F6C97D] font-normal italic">Overview</span></h1>
            <p className="text-[#FFF8D3]/50 text-xs tracking-[0.2em] uppercase">Manage your autonomous bounties</p>
          </div>
          <button className="bg-[#F6C97D] text-[#0C1A54] px-6 py-3 rounded-xl uppercase tracking-[0.2em] text-xs font-bold hover:scale-[1.02] shadow-[0_0_20px_rgba(246,201,125,0.2)] transition-all">
            + New Bounty
          </button>
        </div>

        {/* 4 Top Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="border border-[#F6C97D]/10 rounded-2xl p-6 bg-white/[0.02] backdrop-blur-xl hover:border-[#F6C97D]/30 transition-all">
              <h3 className="text-[#FFF8D3]/50 text-[10px] uppercase tracking-widest mb-2">{stat.label}</h3>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-mono text-[#F6C97D]">{stat.value}</span>
                <span className={`text-[10px] mb-1 ${stat.positive ? 'text-green-400' : 'text-red-400'}`}>{stat.trend}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Active Bounties Table (Takes up 2 columns) */}
          <div className="lg:col-span-2 border border-[#F6C97D]/10 rounded-3xl p-8 bg-white/[0.02] backdrop-blur-xl">
            <h2 className="text-[#F6C97D] font-medium uppercase tracking-[0.2em] text-xs mb-6">Active Bounties</h2>
            
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#FFF8D3]/10 text-[#FFF8D3]/40 text-[10px] uppercase tracking-widest">
                    <th className="pb-4 font-normal">Task Title</th>
                    <th className="pb-4 font-normal">Locked Reward</th>
                    <th className="pb-4 font-normal">Status</th>
                    <th className="pb-4 font-normal">Devs</th>
                  </tr>
                </thead>
                <tbody>
                  {activeBounties.map((bounty, i) => (
                    <tr key={i} className="border-b border-[#FFF8D3]/5 hover:bg-white/[0.02] transition-colors group">
                      <td className="py-5 text-sm text-[#FFF8D3]/90 group-hover:text-[#F6C97D] transition-colors">{bounty.title}</td>
                      <td className="py-5 font-mono text-xs text-[#F6C97D]">{bounty.pot} POT</td>
                      <td className="py-5">
                        <span className={`text-[9px] px-2.5 py-1 rounded-full uppercase tracking-widest border
                          ${bounty.status === 'Completed' ? 'bg-green-400/10 text-green-400 border-green-400/30' : 
                            bounty.status === 'AI Reviewing' ? 'bg-blue-400/10 text-blue-400 border-blue-400/30 animate-pulse' : 
                            'bg-white/5 text-[#FFF8D3]/60 border-white/10'}`}>
                          {bounty.status}
                        </span>
                      </td>
                      <td className="py-5 text-xs text-[#FFF8D3]/60">{bounty.applicants} applied</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Escrow Transactions (Takes up 1 column) */}
          <div className="border border-[#F6C97D]/10 rounded-3xl p-8 bg-white/[0.02] backdrop-blur-xl">
            <h2 className="text-[#F6C97D] font-medium uppercase tracking-[0.2em] text-xs mb-6">Escrow Activity</h2>
            
            <div className="flex flex-col gap-5">
              {transactions.map((tx, i) => (
                <div key={i} className="flex justify-between items-center p-4 rounded-xl border border-[#FFF8D3]/5 bg-white/[0.01]">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${tx.type === 'Escrow Release' ? 'bg-green-400' : 'bg-[#F6C97D]'}`}></span>
                      <p className="text-xs text-[#FFF8D3]">{tx.type}</p>
                    </div>
                    <p className="text-[10px] text-[#FFF8D3]/40 font-mono">{tx.hash} • {tx.date}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-mono ${tx.type === 'Escrow Release' ? 'text-green-400' : 'text-[#F6C97D]'}`}>
                      {tx.type === 'Escrow Release' ? '-' : '+'}{tx.amount}
                    </p>
                    <p className="text-[9px] text-[#FFF8D3]/30 uppercase mt-1">To: {tx.to}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-6 py-3 border border-[#F6C97D]/20 text-[#F6C97D]/60 hover:text-[#F6C97D] hover:bg-[#F6C97D]/10 rounded-xl text-[10px] uppercase tracking-widest transition-all">
              View on Explorer
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}