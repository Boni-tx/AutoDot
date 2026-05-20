"use client";

import React, { useEffect, useState, useRef } from 'react';

export default function LandingPage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const mousePosRef = useRef({ x: 0, y: 0 }); // Usado para o Canvas não travar
  const [windowSize, setWindowSize] = useState({ w: 1000, h: 800 });
  
  // Ref e State para a animação do POT
  const [potCount, setPotCount] = useState(0);
  const [isStep1Visible, setIsStep1Visible] = useState(false);
  
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setWindowSize({ w: window.innerWidth, h: window.innerHeight });

    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
      requestAnimationFrame(() => {
        setMousePos({ x: e.clientX, y: e.clientY });
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    const observerOptions = { threshold: 0.3, rootMargin: "0px" };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        // Verifica a exibição do Step 1 para disparar os POTs
        if (entry.target === step1Ref.current) {
          setIsStep1Visible(entry.isIntersecting);
        }

        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
        }
      });
    }, observerOptions);

    if (step1Ref.current) observer.observe(step1Ref.current);
    if (step2Ref.current) observer.observe(step2Ref.current);
    if (step3Ref.current) observer.observe(step3Ref.current);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
    };
  }, []);

  // Lógica do Motor de Partículas (Antigravidade)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    class Particle {
      x: number;
      y: number;
      size: number;
      density: number;
      vx: number;
      vy: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.density = (Math.random() * 30) + 1;
        this.vx = (Math.random() - 0.5) * 1;
        this.vy = (Math.random() - 0.5) * 1;
      }
      
      draw() {
        ctx!.fillStyle = 'rgba(246, 201, 125, 0.4)';
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.closePath();
        ctx!.fill();
      }
      
      update() {
        // Efeito Antigravidade (Repulsão do Mouse)
        let dx = mousePosRef.current.x - this.x;
        let dy = mousePosRef.current.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let maxDistance = 150;
        
        if (distance < maxDistance) {
          let forceDirectionX = dx / distance;
          let forceDirectionY = dy / distance;
          let force = (maxDistance - distance) / maxDistance;
          let directionX = forceDirectionX * force * (this.density * 0.5);
          let directionY = forceDirectionY * force * (this.density * 0.5);
          
          this.x -= directionX;
          this.y -= directionY;
        } else {
          // Movimento natural suave
          this.x += this.vx;
          this.y += this.vy;
        }

        // Rebater nas bordas da tela
        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
      }
    }

    for (let i = 0; i < 150; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Lógica da Contagem dos POTs
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isStep1Visible) {
      let current = 0;
      const end = 5000;
      const step = 80; // Velocidade da contagem
      
      timer = setInterval(() => {
        current += step;
        if (current >= end) {
          setPotCount(end);
          clearInterval(timer);
        } else {
          setPotCount(current);
        }
      }, 16);
    } else {
      setPotCount(0); // Zera quando não visualizado
    }
    return () => clearInterval(timer);
  }, [isStep1Visible]);

  return (
    // Fundo Alterado: Gradiente longo suave escurecendo para baixo (Sem linhas!)
    <div className="min-h-screen bg-gradient-to-b from-[#13266E] via-[#09133B] to-[#020412] text-[#FFF8D3] font-sans selection:bg-[#F6C97D] selection:text-[#0C1A54] relative w-full overflow-hidden">
      
      {/* AURA MAGNÉTICA MANTIDA */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div 
          className="absolute top-0 left-0 w-[800px] h-[800px] bg-[#F6C97D]/15 rounded-full blur-[150px] transition-transform duration-[800ms] ease-out mix-blend-screen"
          style={{ transform: `translate(${mousePos.x - 400}px, ${mousePos.y - 400}px)` }}
        />
        <div 
          className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/15 rounded-full blur-[120px] transition-transform duration-[1200ms] ease-out mix-blend-screen"
          style={{ transform: `translate(${mousePos.x - 250}px, ${mousePos.y - 250}px)` }}
        />
      </div>

      {/* Navbar - Linha de borda removida */}
      <nav className="w-full p-8 flex justify-between items-center max-w-7xl mx-auto z-20 relative">
        <div className="flex items-center gap-3">
          <img src="/Dot (4).png" alt="AutoDot Logo" className="h-16 w-32 object-contain hover:scale-105 transition-transform cursor-pointer" />
        </div>
        <div className="flex gap-6 items-center">
          <a href="#how-it-works" className="hidden md:block text-xs uppercase tracking-widest text-[#FFF8D3]/60 hover:text-[#F6C97D] transition-colors">
            Protocol Overview
          </a>
          <a href="/login" className="px-6 py-2.5 bg-white/5 border border-[#F6C97D]/30 text-[#F6C97D] hover:bg-[#F6C97D] hover:text-[#0C1A54] rounded-lg text-xs uppercase tracking-widest font-bold transition-all shadow-[0_0_15px_rgba(246,201,125,0.1)] group backdrop-blur-md">
            Enter App <span className="inline-block ml-1 group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>
      </nav>

      {/* Hero Section com Canvas de Partículas ao Fundo e Textos Estáticos */}
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-40 flex flex-col items-center text-center relative z-10 min-h-[90vh] justify-center">
        
        {/* Canvas de Partículas (Antigravidade) */}
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 z-0 pointer-events-none opacity-60"
        />

        {/* Textos da Primeira Aba (Agora Totalmente Estáticos) */}
        <div className="relative z-10">
          <div className="inline-block mb-10 px-5 py-2 rounded-full border border-[#F6C97D]/30 bg-[#F6C97D]/10 text-[#F6C97D] text-[10px] uppercase tracking-widest shadow-[0_0_20px_rgba(246,201,125,0.2)] animate-float backdrop-blur-md">
            <span className="w-2 h-2 inline-block bg-green-400 rounded-full mr-2 animate-pulse"></span>
            Polkadot Hackathon 2026 Ready
          </div>
          
          <div>
            <h1 className="text-6xl md:text-8xl lg:text-[110px] font-light tracking-tighter leading-[1] mb-8 drop-shadow-2xl">
              The First <span className="text-[#F6C97D] font-normal italic relative inline-block">
                Autonomous
                <span className="absolute inset-0 blur-2xl bg-[#F6C97D]/20 -z-10"></span>
              </span> <br/> Bounty Protocol.
            </h1>
          </div>
          
          <div>
            <p className="max-w-2xl mx-auto text-[#FFF8D3]/60 text-lg md:text-2xl font-light mb-14 leading-relaxed">
              Ship code faster with AI-verified pull requests and trustless escrow smart contracts.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6 items-center">
            <a href="/login" className="w-full sm:w-auto px-12 py-5 bg-[#F6C97D] text-[#0C1A54] font-bold uppercase tracking-[0.2em] text-sm rounded-xl transition-all shadow-[0_0_40px_rgba(246,201,125,0.4)] hover:scale-105 hover:bg-white hover:shadow-[0_0_60px_rgba(255,255,255,0.5)]">
              Start Building
            </a>
            <a href="#how-it-works" className="group w-full sm:w-auto px-12 py-5 border border-white/20 text-white font-bold uppercase tracking-[0.2em] text-sm rounded-xl transition-all hover:border-[#F6C97D] hover:text-[#F6C97D] bg-white/[0.02] backdrop-blur-md flex items-center justify-center gap-3">
              How it Works
              <svg className="w-4 h-4 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
            </a>
          </div>
        </div>
      </main>

      {/* SEÇÃO CINEMATOGRÁFICA "COMO FUNCIONA" (Background Transparente e Sem Linhas) */}
      <div id="how-it-works" className="relative z-10 bg-transparent">
        
        {/* Step 1: Fund Escrow */}
        <section className="min-h-screen w-full flex items-center py-20 overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full reveal-base" ref={step1Ref}>
            {/* Texto */}
            <div className="order-2 lg:order-1">
              <span className="text-[#F6C97D]/50 text-sm font-mono tracking-[0.3em] uppercase mb-4 block">Phase 01</span>
              <h2 className="text-5xl md:text-7xl font-light mb-8 leading-tight">
                Lock the <br/><span className="text-[#F6C97D] italic">Bounty</span>.
              </h2>
              <p className="text-[#FFF8D3]/60 text-lg md:text-xl font-light leading-relaxed mb-8">
                Sponsors don't need to trust developers, and developers don't need to trust sponsors. Funds are locked in our impenetrable Polkadot Escrow Contract.
              </p>
              <ul className="flex flex-col gap-4 text-sm text-[#FFF8D3]/80">
                <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-[#F6C97D]"></span> Instant Global Broadcasting</li>
                <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-[#F6C97D]"></span> 100% On-chain Transparency</li>
              </ul>
            </div>
            {/* Visual: Cofre / Contrato ANIMADO */}
            <div className="order-1 lg:order-2 relative perspective-1000">
              <div className="absolute inset-0 bg-[#F6C97D]/20 blur-[100px] rounded-full"></div>
              <div className="w-full aspect-square md:aspect-[4/3] bg-gradient-to-br from-white/10 to-white/0 border border-white/10 rounded-3xl p-8 backdrop-blur-xl flex flex-col items-center justify-center shadow-2xl transform rotate-y-[-10deg] hover:rotate-y-0 transition-transform duration-700">
                <div className="w-24 h-24 rounded-full bg-[#F6C97D]/10 border border-[#F6C97D]/30 flex items-center justify-center mb-6 animate-pulse">
                  <svg className="w-10 h-10 text-[#F6C97D]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <h3 className="text-2xl font-mono text-white mb-2">ESCROW_LOCKED</h3>
                <p className="text-4xl text-[#F6C97D] font-bold">
                  {/* Número Subindo Magicamente */}
                  {potCount.toLocaleString('en-US')} POT
                </p>
                <div className="mt-8 w-full bg-white/5 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-[#F6C97D] h-full transition-all duration-[2000ms] ease-out"
                    style={{ width: `${(potCount / 5000) * 100}%` }}
                  ></div>
                </div>
                <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mt-4">Awaiting Pull Request</p>
              </div>
            </div>
          </div>
        </section>

        {/* Step 2: AI Review */}
        <section className="min-h-screen w-full flex items-center py-20 overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full reveal-base" ref={step2Ref}>
            {/* Visual: Terminal IA */}
            <div className="relative perspective-1000">
              <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full"></div>
              <div className="w-full aspect-square md:aspect-[4/3] bg-[#0C1A54] border border-blue-400/30 rounded-3xl overflow-hidden backdrop-blur-xl flex flex-col shadow-2xl transform rotate-y-[10deg] hover:rotate-y-0 transition-transform duration-700">
                {/* Header Terminal */}
                <div className="h-10 bg-black/40 flex items-center px-4 gap-2 border-b border-white/10">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="ml-2 text-[10px] text-white/50 font-mono">autodot_ai_agent_v2.exe</span>
                </div>
                {/* Body Terminal */}
                <div className="p-6 font-mono text-sm flex flex-col gap-3">
                  <p className="text-blue-400">> Fetching Pull Request #142...</p>
                  <p className="text-white/60">> Analyzing 4 files, 132 insertions.</p>
                  <p className="text-yellow-400">> Running static vulnerability scan...</p>
                  <div className="my-2 border-l-2 border-green-500 pl-4 py-2 bg-green-500/5">
                    <p className="text-green-400">✓ No reentrancy issues found.</p>
                    <p className="text-green-400">✓ Gas optimization: Optimal.</p>
                  </div>
                  <p className="text-white font-bold animate-pulse">> STATUS: APPROVED</p>
                </div>
              </div>
            </div>
            {/* Texto */}
            <div>
              <span className="text-[#F6C97D]/50 text-sm font-mono tracking-[0.3em] uppercase mb-4 block">Phase 02</span>
              <h2 className="text-5xl md:text-7xl font-light mb-8 leading-tight">
                Autonomous <br/><span className="text-[#F6C97D] italic">Verification</span>.
              </h2>
              <p className="text-[#FFF8D3]/60 text-lg md:text-xl font-light leading-relaxed mb-8">
                Say goodbye to weeks of waiting for a manual code review. Our integrated AI Agent clones the repo, runs tests, checks for vulnerabilities, and approves the PR in seconds.
              </p>
              <ul className="flex flex-col gap-4 text-sm text-[#FFF8D3]/80">
                <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-[#F6C97D]"></span> Military-grade Security Checks</li>
                <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-[#F6C97D]"></span> Instant Feedback Loop</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Step 3: Payout */}
        <section className="min-h-screen w-full flex items-center py-20 overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full reveal-base" ref={step3Ref}>
            {/* Texto */}
            <div className="order-2 lg:order-1">
              <span className="text-[#F6C97D]/50 text-sm font-mono tracking-[0.3em] uppercase mb-4 block">Phase 03</span>
              <h2 className="text-5xl md:text-7xl font-light mb-8 leading-tight">
                Trustless <br/><span className="text-[#F6C97D] italic">Payouts</span>.
              </h2>
              <p className="text-[#FFF8D3]/60 text-lg md:text-xl font-light leading-relaxed mb-8">
                The moment the AI merges the Pull Request, a webhook is fired to the blockchain. The Escrow smart contract releases the funds straight to the developer's wallet. Zero humans involved.
              </p>
              <a href="/login" className="inline-block px-10 py-4 border border-[#F6C97D] text-[#F6C97D] font-bold uppercase tracking-[0.2em] text-xs rounded-xl transition-all hover:bg-[#F6C97D] hover:text-[#0C1A54]">
                Experience AutoDot
              </a>
            </div>
            {/* Visual: Transação de Sucesso */}
            <div className="order-1 lg:order-2 relative perspective-1000">
              <div className="absolute inset-0 bg-green-500/20 blur-[100px] rounded-full"></div>
              <div className="w-full aspect-square md:aspect-[4/3] bg-gradient-to-tr from-[#050A24] to-[#0C1A54] border border-green-500/30 rounded-3xl p-8 backdrop-blur-xl flex flex-col items-center justify-center shadow-[0_0_50px_rgba(34,197,94,0.1)] transform rotate-y-[-10deg] hover:rotate-y-0 transition-transform duration-700">
                <div className="w-24 h-24 rounded-full bg-green-500/20 border border-green-400 flex items-center justify-center mb-6">
                  <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-3xl font-light text-white mb-2">Payout Complete</h3>
                <p className="text-xl text-green-400 font-mono">+ 5,000 POT</p>
                <div className="mt-8 flex flex-col gap-2 w-full max-w-[250px]">
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-xs text-white/40">Developer</span>
                    <span className="text-xs text-white font-mono">0x4F...a9B1</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-xs text-white/40">Network Fee</span>
                    <span className="text-xs text-white font-mono">0.001 POT</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-xs text-[#F6C97D]">TxHash</span>
                    <span className="text-xs text-[#F6C97D] font-mono cursor-pointer hover:underline">0x88c...df21</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer - Linha de borda removida */}
      <footer className="w-full bg-transparent py-12 text-center relative z-10 pb-20">
        <img src="/Dot (4).png" alt="AutoDot Logo" className="h-8 object-contain mx-auto mb-4 opacity-50 grayscale" />
        <p className="text-[#FFF8D3]/20 text-[10px] tracking-[0.5em] uppercase">© 2026 AutoDot Protocol</p>
      </footer>
      
      {/* Estilos Globais + CUSTOM SCROLLBAR */}
      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 10px;
        }
        ::-webkit-scrollbar-track {
          background: #020412; 
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(246, 201, 125, 0.2); 
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(246, 201, 125, 0.5); 
        }

        html { scroll-behavior: smooth; overflow-x: hidden; }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }

        .perspective-1000 {
          perspective: 1000px;
        }
        .rotate-y-[-10deg] { transform: rotateY(-10deg); }
        .rotate-y-[10deg] { transform: rotateY(10deg); }
        .rotate-y-0 { transform: rotateY(0deg); }

        .reveal-base {
          opacity: 0;
          transform: translateY(100px) scale(0.95);
          transition: all 1.2s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .reveal-active {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      `}</style>
    </div>
  );
}