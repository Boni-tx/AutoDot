"use client";

import React, { useState } from 'react';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  
  // Estados do Formulário
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const [showPassword, setShowPassword] = useState(false); 
  const [isBusiness, setIsBusiness] = useState(false);
  const [orgName, setOrgName] = useState('');
  const [orgSize, setOrgSize] = useState('');
  
  // Estados de Mensagem e Fluxo
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false); 

  // Handler de Cadastro
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all general fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please check again.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (isBusiness && !orgName) {
      setError('Please provide your Organization Name.');
      return;
    }

    const newUser = {
      name,
      email,
      password, 
      isBusiness,
      orgName: isBusiness ? orgName : undefined,
      orgSize: isBusiness ? orgSize : undefined
    };

    localStorage.setItem(`autodot_user_${email}`, JSON.stringify(newUser));
    setIsEmailSent(true);
  };

  // Simulação de verificação de e-mail enviado
  const handleSimulateEmailVerification = () => {
    const savedUserRaw = localStorage.getItem(`autodot_user_${email}`);
    if (savedUserRaw) {
      localStorage.setItem('autodot_session', savedUserRaw);
      setSuccess('Email verified successfully! Redirecting...');
      setTimeout(() => {
        // ATUALIZADO: Vai para o workspace
        window.location.href = '/workspace';
      }, 1500);
    }
  };

  // Handler de Login Real
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const savedUserRaw = localStorage.getItem(`autodot_user_${email}`);
    
    if (!savedUserRaw) {
      setError('Account not found. Please register first.');
      return;
    }

    const savedUser = JSON.parse(savedUserRaw);

    if (savedUser.password !== password) {
      setError('Invalid password. Please try again.');
      return;
    }

    localStorage.setItem('autodot_session', JSON.stringify(savedUser));
    // ATUALIZADO: Vai para o workspace
    window.location.href = '/workspace';
  };

  const handleSocialLogin = (provider: 'github' | 'google') => {
    const socialUser = {
      name: provider === 'github' ? 'Sponsor Dev GitHub' : 'Google Sponsor',
      email: `${provider}@autodot.xyz`,
      isBusiness: isBusiness, 
      orgName: isBusiness ? (orgName || "Global Ventures OpenSource") : undefined
    };

    localStorage.setItem('autodot_session', JSON.stringify(socialUser));
    // ATUALIZADO: Vai para o workspace
    window.location.href = '/workspace';
  };

  return (
    <div className="min-h-screen bg-[#0C1A54] text-[#FFF8D3] font-sans flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Decorativo */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#F6C97D]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#050A24] border border-[#F6C97D]/20 rounded-[32px] p-8 shadow-[0_0_50px_rgba(0,0,0,0.3)] z-10">
        
        {/* Header da Tela - Clicar no logo devolve à Landing Page ('/') */}
        <div className="flex flex-col items-center mb-8 cursor-pointer" onClick={() => window.location.href = '/'}>
          <img src="/Dot (4).png" alt="AutoDot Logo" className="h-16 w-32 object-contain mb-2" />
          <p className="text-[#FFF8D3]/40 text-[10px] uppercase tracking-[0.3em] mt-1">Autonomous Protocol Gateway</p>
        </div>

        {/* FLUXO DE CONFIRMAÇÃO DE EMAIL */}
        {isEmailSent ? (
          <div className="flex flex-col items-center justify-center py-6 animate-[fadeIn_0.5s]">
            <div className="w-20 h-20 bg-[#F6C97D]/10 rounded-full flex items-center justify-center mb-6 border border-[#F6C97D]/30 shadow-[0_0_30px_rgba(246,201,125,0.2)]">
              <svg className="w-10 h-10 text-[#F6C97D]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <h2 className="text-2xl font-light text-[#FFF8D3] mb-2 text-center">Check your inbox</h2>
            <p className="text-[#FFF8D3]/60 text-sm text-center leading-relaxed mb-8">
              We&apos;ve sent a verification link to <br/>
              <span className="text-[#F6C97D] font-medium">{email}</span>
            </p>
            
            {success && <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl text-xs text-center font-medium w-full tracking-wide">{success}</div>}

            <button onClick={handleSimulateEmailVerification} className="w-full py-4 bg-transparent border border-[#F6C97D]/40 text-[#F6C97D] hover:bg-[#F6C97D] hover:text-[#0C1A54] font-bold uppercase tracking-[0.2em] text-[10px] rounded-xl transition-all mb-4">
              Simulate Email Click
            </button>
            <p className="text-[#FFF8D3]/30 text-[9px] uppercase tracking-widest text-center">Did not receive the email? <span className="text-[#F6C97D] cursor-pointer hover:underline">Resend</span></p>
          </div>
        ) : (
          <>
            {/* Abas Alternadoras */}
            <div className="grid grid-cols-2 border-b border-white/5 mb-8">
              <button onClick={() => { setActiveTab('signin'); setError(''); }} className={`py-3 text-xs uppercase tracking-widest font-bold transition-all ${activeTab === 'signin' ? 'text-[#F6C97D] border-b-2 border-[#F6C97D]' : 'text-[#FFF8D3]/30 hover:text-[#FFF8D3]/60'}`}>
                Sign In
              </button>
              <button onClick={() => { setActiveTab('signup'); setError(''); }} className={`py-3 text-xs uppercase tracking-widest font-bold transition-all ${activeTab === 'signup' ? 'text-[#F6C97D] border-b-2 border-[#F6C97D]' : 'text-[#FFF8D3]/30 hover:text-[#FFF8D3]/60'}`}>
                Sign Up
              </button>
            </div>

            {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs text-center font-medium tracking-wide">{error}</div>}

            {/* FORMULÁRIO DE LOGIN */}
            {activeTab === 'signin' ? (
              <form onSubmit={handleSignIn} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase tracking-widest text-[#F6C97D]/60 ml-1">Email Address</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#FFF8D3] focus:outline-none focus:border-[#F6C97D] transition-colors" />
                </div>

                <div className="flex flex-col gap-1 relative">
                  <label className="text-[10px] uppercase tracking-widest text-[#F6C97D]/60 ml-1">Password</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm text-[#FFF8D3] focus:outline-none focus:border-[#F6C97D] transition-colors" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#FFF8D3]/40 hover:text-[#F6C97D] transition-colors">
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      )}
                    </button>
                  </div>
                </div>

                <button type="submit" className="w-full mt-2 py-3.5 bg-[#F6C97D] text-[#0C1A54] hover:bg-opacity-90 font-bold uppercase tracking-[0.2em] text-xs rounded-xl transition-all shadow-[0_0_20px_rgba(246,201,125,0.15)]">
                  Access Protocol
                </button>
              </form>
            ) : (
              
              /* FORMULÁRIO DE CADASTRO */
              <form onSubmit={handleSignUp} className="flex flex-col gap-5 max-h-[420px] overflow-y-auto pr-1 hide-scroll">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase tracking-widest text-[#F6C97D]/60 ml-1">Full Name</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#FFF8D3] focus:outline-none focus:border-[#F6C97D] transition-colors" />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase tracking-widest text-[#F6C97D]/60 ml-1">Email</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@protocol.io" className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#FFF8D3] focus:outline-none focus:border-[#F6C97D] transition-colors" />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase tracking-widest text-[#F6C97D]/60 ml-1">Password</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimum 6 characters" className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm text-[#FFF8D3] focus:outline-none focus:border-[#F6C97D] transition-colors" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#FFF8D3]/40 hover:text-[#F6C97D] transition-colors">
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase tracking-widest text-[#F6C97D]/60 ml-1">Confirm Password</label>
                  <input type={showPassword ? "text" : "password"} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat password" className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#FFF8D3] focus:outline-none focus:border-[#F6C97D] transition-colors" />
                </div>

                {/* SWITCH BUSINESS ACCOUNT */}
                <div className="flex items-center justify-between bg-white/[0.01] border border-white/5 p-4 rounded-xl my-2">
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-[#FFF8D3]">Business Account</span>
                    <span className="text-[9px] text-[#FFF8D3]/40 uppercase tracking-wider mt-0.5">I want to sponsor bounties</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={isBusiness} onChange={(e) => setIsBusiness(e.target.checked)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#050A24] after:border-white/20 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F6C97D]"></div>
                  </label>
                </div>

                {/* CAMPOS DINÂMICOS DA EMPRESA */}
                {isBusiness && (
                  <div className="flex flex-col gap-5 p-4 border border-[#F6C97D]/10 bg-[#F6C97D]/5 rounded-xl animate-[fadeIn_0.3s_ease-out]">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase tracking-widest text-[#F6C97D]/80 ml-1 font-bold">Organization Name *</label>
                      <input type="text" required={isBusiness} value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="e.g. Polkadot Labs Inc." className="w-full bg-[#050A24] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#FFF8D3] focus:outline-none focus:border-[#F6C97D] transition-colors" />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase tracking-widest text-[#F6C97D]/60 ml-1">Company Size</label>
                      <select value={orgSize} onChange={(e) => setOrgSize(e.target.value)} className="w-full bg-[#050A24] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#FFF8D3] focus:outline-none focus:border-[#F6C97D] transition-colors">
                        <option value="">Select size...</option>
                        <option value="1-10">1-10 members (Startup)</option>
                        <option value="11-50">11-50 members (Growth)</option>
                        <option value="51+">51+ members (Enterprise)</option>
                      </select>
                    </div>
                  </div>
                )}

                <button type="submit" className="w-full mt-2 py-3.5 bg-[#F6C97D] text-[#0C1A54] hover:bg-opacity-90 font-bold uppercase tracking-[0.2em] text-xs rounded-xl transition-all shadow-[0_0_20px_rgba(246,201,125,0.15)]">
                  Create Account
                </button>
              </form>
            )}

            {/* Divisor "OR" */}
            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-white/5"></div>
              <span className="px-4 text-[10px] text-[#FFF8D3]/20 uppercase tracking-widest font-mono">OR CONNECT VIA</span>
              <div className="flex-grow border-t border-white/5"></div>
            </div>

            {/* Botões de Provedores Sociais */}
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => handleSocialLogin('github')} className="flex items-center justify-center gap-2 p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 transition-all text-xs font-medium text-[#FFF8D3]/80">
                GitHub
              </button>
              <button onClick={() => handleSocialLogin('google')} className="flex items-center justify-center gap-2 p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 transition-all text-xs font-medium text-[#FFF8D3]/80">
                Google
              </button>
            </div>
          </>
        )}

      </div>

      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}