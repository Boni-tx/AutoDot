"use client";

import React, { useState, useEffect, useRef } from 'react';

// Tipagem
interface TaskItem {
  user: string;
  title: string;
  pot: string;
  type: string;
  description: string;
}

export default function AutoDotPage() {
  // Estados de Autenticação
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isGithubConnected, setIsGithubConnected] = useState(false);

  // Estados do Formulário e Feed
  const [taskTitle, setTaskTitle] = useState('');
  const [taskReward, setTaskReward] = useState('');
  const [taskDescription, setTaskDescription] = useState(''); // TEXTAREA RESTAURADO
  const [deployStatus, setDeployStatus] = useState<'idle' | 'error' | 'loading' | 'success'>('idle');
  const [deployMessage, setDeployMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: '', desc: '' });

  // Estado para o Modal de Detalhes da Tarefa
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [acceptingTask, setAcceptingTask] = useState(false); // NOVO: Estado para aceitar tarefa

  const [feedItems, setFeedItems] = useState<TaskItem[]>([
    { user: "0xAlpha", title: "Optimize Smart Contract", pot: "500", type: "Ink! / Rust", description: "Improve gas efficiency in the escrow core functions. Needs deep Ink! knowledge." },
    { user: "DevKush", title: "Refactor Frontend UI", pot: "250", type: "Next.js / Tailwind", description: "Optimize the community feed section for better mobile performance and scrolling." },
    { user: "Satoshi_AI", title: "Create API Endpoint", pot: "100", type: "Ink! / Backend", description: "Integrate a new API endpoint to fetch token price feeds." }
  ]);

  // LÓGICA DA IA
  const initialConsoleLines = [
    "_ initializing_autodot_agent_v0.1...",
    "> status: online. awaiting_bounty_detection...",
  ];
  
  const [consoleLines, setConsoleLines] = useState<string[]>(initialConsoleLines);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [consoleLines]);

  const animateConsole = (linesArray: string[], title: string, pot: string) => {
    setConsoleLines([]);
    let currentLine = 0;
    const addNextLine = () => {
      if (currentLine < linesArray.length) {
        let lineToAdd = linesArray[currentLine].replace('${TITLE}', title).replace('${POT}', pot);
        setConsoleLines(prev => [...prev, lineToAdd]);
        currentLine++;
        setTimeout(addNextLine, Math.random() * 500 + 300); 
      }
    };
    addNextLine();
  };

  const handleConnectWallet = () => {
    setIsWalletConnected(true);
    setIsWalletModalOpen(false);
  };

  const handleDeploy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isWalletConnected) {
      setDeployStatus('error');
      setDeployMessage('Error: Please connect your Polkadot wallet first.');
      return;
    }

    setDeployStatus('loading');
    setDeployMessage('Deploying funds to Escrow Contract...');

    const titleForConsole = taskTitle;
    const potForConsole = taskReward;

    setTimeout(() => {
      setDeployStatus('success');
      setDeployMessage('Success! POT locked in AutoDot Escrow.');
      setToastMessage({ title: 'Transaction Confirmed', desc: 'Bounty active on network' });
      setShowToast(true);

      const newItem: TaskItem = {
        user: isGithubConnected ? "sponsor_dev" : "Anon_Wallet",
        title: taskTitle,
        pot: taskReward,
        type: "New Bounty",
        description: taskDescription || "Bounty created from platform interface. Detailed specifications needed."
      };
      
      setFeedItems(prev => [newItem, ...prev].slice(0, 4));

      animateConsole([
        "> ALERT: NEW_BOUNTY_DETECTED",
        "> Analyzing task: '${TITLE}'",
        "> Value locked: ${POT} POT",
        "> STATUS: Awaiting pull request...",
      ], titleForConsole, potForConsole);

      setTimeout(() => {
        setDeployStatus('idle');
        setDeployMessage('');
        setShowToast(false);
        setTaskTitle('');
        setTaskReward('');
        setTaskDescription('');
      }, 4000);
    }, 2000);
  };

  // NOVO: Função para o Dev aceitar a tarefa
  const handleAcceptTask = () => {
    if (!isGithubConnected) {
      setIsGithubConnected(true);
      return;
    }
    setAcceptingTask(true);
    setTimeout(() => {
      setAcceptingTask(false);
      setIsTaskModalOpen(false);
      setToastMessage({ title: 'Repository Forked!', desc: 'Task added to your workspace. Happy coding!' });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0C1A54] text-[#FFF8D3] font-sans flex flex-col relative overflow-hidden">
      
      {/* Header */}
      <header className="w-full p-8 flex justify-between items-center max-w-7xl mx-auto z-10">
        <div className="flex items-center gap-3 cursor-pointer">
          <img src="/Dot (4).png" alt="AutoDot Logo" className="h-22 w-40" />
        </div>
        
        <div className="flex gap-6 items-center">
          {/* NOTIFICAÇÃO RESTAURADA */}
          <button className="relative text-[#FFF8D3]/60 hover:text-[#F6C97D] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#F6C97D] rounded-full border border-[#0C1A54]"></span>
          </button>

          <button onClick={() => setIsGithubConnected(true)} className="text-[#FFF8D3]/60 hover:text-[#F6C97D] transition-colors text-sm font-medium hidden md:flex items-center gap-2">
            {isGithubConnected ? (
              <><div className="w-5 h-5 bg-[#FFF8D3]/20 rounded-full flex items-center justify-center text-[10px] text-[#F6C97D] font-bold">@</div>sponsor_dev</>
            ) : ('Sign In with GitHub')}
          </button>
          
          <button onClick={() => !isWalletConnected && setIsWalletModalOpen(true)}
            className={`px-6 py-2.5 font-semibold rounded-md transition-all uppercase text-xs tracking-[0.2em] flex items-center gap-2
              ${isWalletConnected ? 'bg-white/10 text-[#F6C97D] border border-[#F6C97D]/30 cursor-default' : 'bg-[#F6C97D] text-[#0C1A54] hover:bg-opacity-90 shadow-[0_0_15px_rgba(246,201,125,0.2)]'}`}
          >
            {isWalletConnected ? (<><div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>0x7F...9A2C</>) : ('Connect Wallet')}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 py-12 w-full max-w-7xl mx-auto z-10 overflow-auto">
        <div className="text-center mb-24">
          <h1 className="text-5xl md:text-8xl font-light tracking-tighter leading-[1.1] mb-6">
            The Future of Work <br /> is <span className="text-[#F6C97D] font-normal italic">Autonomous.</span>
          </h1>
          <p className="text-[#FFF8D3]/50 text-lg tracking-[0.3em] uppercase font-light">Powered by Portaldot & AI Agents</p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
          
          {/* Box 1: Community Feed */}
          <div className="border border-[#F6C97D]/10 rounded-3xl p-8 bg-white/[0.02] backdrop-blur-xl hover:border-[#F6C97D]/30 transition-all duration-500 overflow-auto h-[460px]">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-[#F6C97D] font-medium uppercase tracking-[0.2em] text-xs">Community Feed</h2>
              <span className="text-[10px] text-[#FFF8D3]/30 uppercase animate-pulse">Live</span>
            </div>
            <div className="flex flex-col gap-6">
              {feedItems.map((post, i) => (
                <div key={i} onClick={() => {setSelectedTask(post); setIsTaskModalOpen(true);}} className="group cursor-pointer border-b border-[#FFF8D3]/5 pb-4 last:border-0 hover:bg-[#F6C97D]/5 p-2 rounded-lg transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${i === 0 && post.type === 'New Bounty' ? 'bg-green-400/40 border border-green-400' : 'bg-[#F6C97D]/20 border border-[#F6C97D]/40'}`}></div>
                    <span className="text-[#F6C97D]/60 text-[10px] font-mono">{post.user}</span>
                  </div>
                  <h3 className="text-[#FFF8D3]/90 text-sm group-hover:text-[#F6C97D] transition-colors mb-3">{post.title}</h3>
                  <div className="flex justify-between items-center">
                    <span className={`text-[9px] px-2 py-0.5 rounded uppercase tracking-widest ${i === 0 && post.type === 'New Bounty' ? 'bg-green-400/10 text-green-400/80' : 'bg-white/5 text-[#FFF8D3]/40'}`}>{post.type}</span>
                    <span className="text-[#F6C97D] font-mono text-xs">{post.pot} POT</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Box 2: Sponsor Action - COM TEXTAREA RESTAURADO */}
          <div className="border border-[#F6C97D]/10 rounded-3xl p-8 bg-white/[0.02] backdrop-blur-xl hover:border-[#F6C97D]/30 transition-all duration-500 h-[460px]">
            <h2 className="text-[#F6C97D] font-medium mb-8 uppercase tracking-[0.2em] text-xs text-center">Sponsor a Bounty</h2>
            <form className="flex flex-col gap-6" onSubmit={handleDeploy}>
              <input type="text" required value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} placeholder="Task Title" className="w-full bg-transparent border-b border-[#FFF8D3]/10 py-2 text-[#FFF8D3] focus:outline-none focus:border-[#F6C97D] text-sm" />
              <input type="number" required value={taskReward} onChange={(e) => setTaskReward(e.target.value)} placeholder="Reward in POT" className="w-full bg-transparent border-b border-[#FFF8D3]/10 py-2 text-[#FFF8D3] focus:outline-none focus:border-[#F6C97D] text-sm" />
              
              {/* TEXTAREA AQUI */}
              <textarea 
                required 
                value={taskDescription} 
                onChange={(e) => setTaskDescription(e.target.value)}
                placeholder="Short Description / Tech Stack" 
                className="w-full bg-transparent border border-[#FFF8D3]/10 rounded-xl p-4 text-[#FFF8D3] placeholder-[#FFF8D3]/20 focus:outline-none focus:border-[#F6C97D] transition-colors text-xs h-20 resize-none mt-2" 
              />
              
              <button type="submit" disabled={deployStatus === 'loading'} className={`w-full mt-2 py-4 border transition-all duration-500 rounded-xl uppercase tracking-[0.2em] text-[10px] font-bold ${deployStatus === 'loading' ? 'border-[#F6C97D]/20 text-[#F6C97D]/50 cursor-wait animate-pulse' : deployStatus === 'success' ? 'bg-[#F6C97D]/10 border-[#F6C97D] text-[#F6C97D]' : 'bg-transparent border-[#F6C97D]/40 text-[#F6C97D] hover:bg-[#F6C97D] hover:text-[#0C1A54]'}`}>
                {deployStatus === 'loading' ? 'Processing...' : deployStatus === 'success' ? 'Deployed' : 'Deploy to Escrow'}
              </button>
              {deployMessage && (<div className={`text-center text-xs mt-[-10px] font-medium tracking-wide ${deployStatus === 'error' ? 'text-red-400' : 'text-green-400'}`}>{deployMessage}</div>)}
            </form>
          </div>

          {/* Box 3: AI Console */}
          <div className="border border-[#F6C97D]/10 rounded-3xl p-8 bg-white/[0.02] backdrop-blur-xl hover:border-[#F6C97D]/30 transition-all duration-500 h-[460px]">
            <h2 className="text-[#F6C97D] font-medium mb-8 uppercase tracking-[0.2em] text-xs">AI Verifier Agent</h2>
            <div className="bg-[#050A24]/80 border border-white/5 rounded-2xl p-6 h-72 font-mono text-[10px] leading-relaxed text-[#FFF8D3]/60 relative shadow-2xl overflow-y-auto">
              <div className="flex flex-col gap-3">
                {consoleLines.map((line, i) => (<p key={i} className={`${line.includes('ALERT') ? 'text-green-400' : ''}`}>{line}</p>))}
                <div ref={consoleEndRef} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full py-12 text-center relative z-10 mt-auto">
        <p className="text-[#FFF8D3]/20 text-[9px] tracking-[0.5em] uppercase">© 2026 AutoDot Protocol</p>
      </footer>

      {/* MODAL 1: CARTEIRA */}
      {isWalletModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0C1A54]/60 backdrop-blur-md animate-[fadeIn_0.2s]">
          <div className="bg-[#050A24] border border-[#F6C97D]/20 rounded-[30px] p-12 w-full max-w-lg shadow-[0_0_60px_-15px_rgba(246,201,125,0.1)] relative">
            <button onClick={() => setIsWalletModalOpen(false)} className="absolute top-10 right-10 text-[#FFF8D3]/40 hover:text-[#F6C97D] transition-colors">✕</button>
            <h2 className="text-3xl font-light text-[#FFF8D3] mb-3 tracking-tight">Connect Wallet</h2>
            <p className="text-[#FFF8D3]/40 text-xs tracking-widest uppercase mb-12">Select your Polkadot Provider</p>
            <div className="flex flex-col gap-5">
              {[ { name: "Talisman", sub: "Recommended" }, { name: "SubWallet", sub: "Polkadot & EVM" }, { name: "Polkadot.js", sub: "Developer Wallet" } ].map((wallet, index) => (
                <button key={index} onClick={handleConnectWallet} className="w-full flex items-center justify-between p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-[#F6C97D]/5 hover:border-[#F6C97D]/40 transition-all duration-300 group">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#F6C97D]/30 border border-[#F6C97D]/50 flex items-center justify-center text-[10px] text-[#F6C97D]">W</div>
                    <span className="text-[#FFF8D3]/90 font-medium group-hover:text-[#F6C97D] transition-colors text-sm">{wallet.name}</span>
                  </div>
                  <span className="text-[#FFF8D3]/30 text-[10px] uppercase tracking-widest">{wallet.sub}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TOAST DE SUCESSO (AGORA DINÂMICO) */}
      {showToast && (
        <div className="fixed bottom-10 right-10 z-50 flex items-center gap-4 bg-[#050A24]/90 backdrop-blur-xl border border-green-400/30 px-6 py-4 rounded-2xl shadow-[0_0_30px_rgba(74,222,128,0.15)] animate-[slideIn_0.3s_ease-out]">
          <div className="w-8 h-8 rounded-full bg-green-400/20 flex items-center justify-center border border-green-400/50">
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
          </div>
          <div>
            <h4 className="text-green-400 font-medium text-sm tracking-wide">{toastMessage.title}</h4>
            <p className="text-[#FFF8D3]/50 text-[10px] tracking-wider uppercase mt-0.5">{toastMessage.desc}</p>
          </div>
        </div>
      )}

      {/* MODAL 3: TAREFA COM NOVA LÓGICA DE ACEITAR */}
      {isTaskModalOpen && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0C1A54]/60 backdrop-blur-md animate-[fadeIn_0.2s]">
          <div className="bg-[#050A24] border border-[#F6C97D]/20 rounded-3xl p-10 w-full max-w-xl shadow-[0_0_50px_rgba(246,201,125,0.07)] relative">
            <button onClick={() => setIsTaskModalOpen(false)} className="absolute top-8 right-8 text-[#FFF8D3]/40 hover:text-[#F6C97D]">✕</button>
            <h2 className="text-3xl font-light text-[#FFF8D3] mb-2">{selectedTask.title}</h2>
            <p className="text-[#F6C97D] font-mono text-xl mb-8">{selectedTask.pot} POT</p>
            <div className="mb-10 p-6 bg-white/[0.01] rounded-xl border border-white/5">
              <h4 className="text-[#F6C97D]/70 text-xs uppercase tracking-widest mb-3">Task Description</h4>
              <p className="text-[#FFF8D3]/80 text-sm font-light leading-relaxed">{selectedTask.description}</p>
            </div>
            <button 
              onClick={handleAcceptTask} 
              disabled={acceptingTask}
              className={`w-full py-4 border transition-all duration-500 rounded-xl uppercase tracking-[0.2em] text-xs font-bold
                ${acceptingTask ? 'border-[#F6C97D]/20 text-[#F6C97D]/50 cursor-wait animate-pulse' : 
                isGithubConnected ? 'bg-[#F6C97D] text-[#0C1A54] hover:scale-[1.02]' : 'bg-transparent border-[#F6C97D] text-[#F6C97D] hover:bg-[#F6C97D] hover:text-[#0C1A54]'}`}
            >
              {acceptingTask ? 'Forking Repository...' : isGithubConnected ? 'Accept Task & Start Building' : 'Sign In with GitHub to Apply'}
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes slideIn { from { transform: translateY(100%) opacity(0); } to { transform: translateY(0) opacity(1); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(246, 201, 125, 0.15); border-radius: 6px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(246, 201, 125, 0.3); }
        input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>
    </div>
  );
}