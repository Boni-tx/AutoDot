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

interface UserSession {
  name: string;
  email: string;
  isBusiness: boolean;
  orgName?: string;
}

interface NotificationItem {
  id: string;
  message: string;
  time: string;
}

export default function AutoDotPage() {
  // Estado do Usuário Real (Persistente)
  const [user, setUser] = useState<UserSession | null>(null);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  // Estados do Formulário e Feed
  const [taskTitle, setTaskTitle] = useState('');
  const [taskReward, setTaskReward] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [deployStatus, setDeployStatus] = useState<'idle' | 'error' | 'loading' | 'success'>('idle');
  const [deployMessage, setDeployMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: '', desc: '' });

  // Estados de Notificação (NOVO)
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [hasNewAlert, setHasNewAlert] = useState(false);

  // Estados do Modal e Tarefas
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  
  // Estados para o Efeito UAU da IA
  const [acceptedTasks, setAcceptedTasks] = useState<string[]>([]);
  const [aiReviewing, setAiReviewing] = useState(false);
  const [reviewConsole, setReviewConsole] = useState<string[]>([]);
  const [taskCompleted, setTaskCompleted] = useState(false);
  const reviewEndRef = useRef<HTMLDivElement>(null);

  const [feedItems, setFeedItems] = useState<TaskItem[]>([
    { user: "0xAlpha", title: "Optimize Smart Contract", pot: "500", type: "Ink! / Rust", description: "Improve gas efficiency in the escrow core functions. Needs deep Ink! knowledge." },
    { user: "DevKush", title: "Refactor Frontend UI", pot: "250", type: "Next.js / Tailwind", description: "Optimize the community feed section for better mobile performance and scrolling." },
    { user: "Satoshi_AI", title: "Create API Endpoint", pot: "100", type: "Backend", description: "Integrate a new API endpoint to fetch token price feeds." }
  ]);

  // LÓGICA DA IA (Console Principal)
  const [consoleLines, setConsoleLines] = useState<string[]>([
    "_ initializing_autodot_agent_v0.1...",
    "> status: online. awaiting_bounty_detection...",
  ]);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  // NOVO: Função para sincronizar dados do Dashboard para o Workspace
  const loadWorkspaceData = () => {
    const saved = localStorage.getItem('autodot_bounties');
    if (saved) {
      const dashboardBounties = JSON.parse(saved);
      
      // Mapeia os Bounties do Dashboard para o formato do Feed do Workspace
      const mappedTasks: TaskItem[] = dashboardBounties.map((b: any) => ({
        user: "Business Sponsor",
        title: b.title,
        pot: b.pot,
        type: "Dashboard Bounty",
        description: "Autonomous cryptographic code review condition locked via AutoDot WASM virtual machine handler."
      }));

      setFeedItems(mappedTasks);

      // Atualiza as notificações com base nas tarefas do Dashboard
      if (dashboardBounties.length > 0) {
        const freshAlerts: NotificationItem[] = dashboardBounties.map((b: any, index: number) => ({
          id: `notif-${b.id || index}`,
          message: `New bounty from Dashboard: "${b.title}" for ${b.pot} POT.`,
          time: index === 0 ? 'Just now' : `${index + 1}h ago`
        }));
        setNotifications(freshAlerts);
        setHasNewAlert(true);
      }
    }
  };

  // Carregar Sessão e Sincronizar
  useEffect(() => {
    const savedUser = localStorage.getItem('autodot_session');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    // Carrega inicial
    loadWorkspaceData();

    // Escuta eventos de atualização do Dashboard (Sincronização em tempo real!)
    window.addEventListener('autodot_update', loadWorkspaceData);
    window.addEventListener('storage', loadWorkspaceData);

    return () => {
      window.removeEventListener('autodot_update', loadWorkspaceData);
      window.removeEventListener('storage', loadWorkspaceData);
    };
  }, []);

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [consoleLines]);

  useEffect(() => {
    reviewEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [reviewConsole]);

  const handleLogout = () => {
    localStorage.removeItem('autodot_session');
    setUser(null);
    window.location.href = '/login';
  };

  const handleOpenNotifications = () => {
    setIsNotifOpen(!isNotifOpen);
    setHasNewAlert(false); // Limpa a bolinha vermelha ao abrir
  };

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
        user: user ? (user.isBusiness ? user.orgName || user.name : user.name) : "Anon_Wallet",
        title: taskTitle,
        pot: taskReward,
        type: "New Bounty",
        description: taskDescription || "Bounty created from platform interface."
      };
      
      setFeedItems(prev => [newItem, ...prev]);

      // NOVO: Sincroniza essa tarefa criada no Workspace com o Dashboard!
      const saved = localStorage.getItem('autodot_bounties');
      let currentBounties = saved ? JSON.parse(saved) : [];
      const dashBounty = {
        id: Date.now().toString(),
        title: newItem.title,
        pot: newItem.pot,
        status: 'Awaiting PR',
        applicants: 0,
        date: 'Just now'
      };
      localStorage.setItem('autodot_bounties', JSON.stringify([dashBounty, ...currentBounties]));
      window.dispatchEvent(new Event('autodot_update')); // Avisa o Dashboard

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

  const handleAcceptTask = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation(); 

    if (!user) {
      window.location.href = '/login';
      return;
    }

    if (!selectedTask) return;
    
    setAcceptedTasks(prev => {
      if (!prev.includes(selectedTask.title)) {
        return [...prev, selectedTask.title];
      }
      return prev;
    });

    setToastMessage({ title: 'Repository Forked!', desc: 'Task added to your workspace. Happy coding!' });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const handleSubmitPR = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setAiReviewing(true);
    setReviewConsole([]);
    setTaskCompleted(false);

    const lines = [
      "> Webhook received: New Pull Request #42",
      "> Initiating AutoDot AI Code Reviewer...",
      "> Cloning repository and applying changes...",
      "> Running static analysis on Smart Contract...",
      "> ✅ Gas optimization verified. (-12% gas used)",
      "> ✅ Security checks passed (No vulnerabilities).",
      "> Generating feedback summary...",
      "> PR APPROVED. Triggering Escrow Smart Contract...",
      "> 💸 Transaction confirmed! Funds released to Dev Wallet."
    ];

    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < lines.length) {
        setReviewConsole(prev => [...prev, lines[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
           setAiReviewing(false);
           setTaskCompleted(true);
        }, 1200);
      }
    }, 700); 
  };

  const closeModal = () => {
    setIsTaskModalOpen(false);
    setTimeout(() => {
      setAiReviewing(false);
      setTaskCompleted(false);
      setReviewConsole([]);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#0C1A54] text-[#FFF8D3] font-sans flex flex-col relative overflow-hidden">
      
      {/* Header Atualizado com Notificações */}
      <header className="w-full p-8 flex justify-between items-center max-w-7xl mx-auto z-20">
        <div className="flex items-center gap-3 cursor-pointer">
          <img src="/Dot (4).png" alt="AutoDot Logo" className="h-22 w-40" />
        </div>
        
        <div className="flex gap-6 items-center">
          
          {/* SININHO DE NOTIFICAÇÕES (NOVO) */}
          <div className="relative">
            <button 
              onClick={handleOpenNotifications}
              className="w-10 h-10 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/10 transition-all flex items-center justify-center text-white/60 hover:text-white relative"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              {hasNewAlert && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-yellow-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(246,201,125,0.7)]" />
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-[#050A24]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-2xl z-50 animate-fadeIn origin-top-right">
                <h3 className="text-[#F6C97D] text-[10px] font-mono uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#F6C97D] rounded-full"></span> System Alerts
                </h3>
                
                {notifications.length === 0 ? (
                  <div className="py-6 text-center opacity-40">
                    <p className="text-xs font-light italic">No tasks discovered yet.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 max-h-[260px] overflow-y-auto custom-scroll pr-1">
                    {notifications.map(alert => (
                      <div key={alert.id} className="bg-white/[0.03] border border-white/5 p-3 rounded-xl hover:border-white/10 transition-colors">
                        <p className="text-xs text-white/80 font-light leading-snug mb-1">{alert.message}</p>
                        <p className="text-[9px] text-[#F6C97D]/40 font-mono">{alert.time}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {user && user.isBusiness && (
            <a href="/dashboard" className="hidden md:flex items-center justify-center px-4 py-2 border border-[#F6C97D]/50 text-[#F6C97D] hover:bg-[#F6C97D] hover:text-[#0C1A54] rounded-lg text-[10px] uppercase tracking-widest font-bold transition-all shadow-[0_0_10px_rgba(246,201,125,0.1)]">
              View Dashboard
            </a>
          )}

          {user ? (
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:flex flex-col leading-tight">
                <span className="text-sm font-medium text-[#FFF8D3]">{user.isBusiness ? user.orgName : user.name}</span>
                <span className="text-[9px] text-[#F6C97D] uppercase tracking-[0.2em] font-bold">
                  {user.isBusiness ? 'Business Account' : 'Developer Account'}
                </span>
              </div>
              <button onClick={handleLogout} className="text-[10px] uppercase tracking-widest text-red-400 hover:text-red-300 font-bold transition-colors">
                Exit
              </button>
            </div>
          ) : (
            <a href="/login" className="px-5 py-2 border border-white/20 hover:border-[#F6C97D] text-[#FFF8D3] hover:text-[#F6C97D] rounded-md transition-all uppercase text-[10px] tracking-[0.2em] font-bold">
              Login
            </a>
          )}
          
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
          <p className="text-[#FFF8D3]/50 text-lg tracking-[0.3em] uppercase font-light">Powered by Polkadot & AI Agents</p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
          {/* Box 1: Community Feed */}
          <div className="border border-[#F6C97D]/10 rounded-3xl p-8 bg-white/[0.02] backdrop-blur-xl hover:border-[#F6C97D]/30 transition-all duration-500 overflow-y-auto custom-scroll h-[460px]">
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

          {/* Box 2: Sponsor Action */}
          <div className="border border-[#F6C97D]/10 rounded-3xl p-8 bg-white/[0.02] backdrop-blur-xl hover:border-[#F6C97D]/30 transition-all duration-500 h-[460px]">
            <h2 className="text-[#F6C97D] font-medium mb-8 uppercase tracking-[0.2em] text-xs text-center">Sponsor a Bounty</h2>
            <form className="flex flex-col gap-6" onSubmit={handleDeploy}>
              <input type="text" required value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} placeholder="Task Title" className="w-full bg-transparent border-b border-[#FFF8D3]/10 py-2 text-[#FFF8D3] focus:outline-none focus:border-[#F6C97D] text-sm" />
              <input type="number" required value={taskReward} onChange={(e) => setTaskReward(e.target.value)} placeholder="Reward in POT" className="w-full bg-transparent border-b border-[#FFF8D3]/10 py-2 text-[#FFF8D3] focus:outline-none focus:border-[#F6C97D] text-sm" />
              <textarea required value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} placeholder="Short Description / Tech Stack" className="w-full bg-transparent border border-[#FFF8D3]/10 rounded-xl p-4 text-[#FFF8D3] placeholder-[#FFF8D3]/20 focus:outline-none focus:border-[#F6C97D] transition-colors text-xs h-20 resize-none mt-2 custom-scroll" />
              <button type="submit" disabled={deployStatus === 'loading'} className={`w-full mt-2 py-4 border transition-all duration-500 rounded-xl uppercase tracking-[0.2em] text-[10px] font-bold ${deployStatus === 'loading' ? 'border-[#F6C97D]/20 text-[#F6C97D]/50 cursor-wait animate-pulse' : deployStatus === 'success' ? 'bg-[#F6C97D]/10 border-[#F6C97D] text-[#F6C97D]' : 'bg-transparent border-[#F6C97D]/40 text-[#F6C97D] hover:bg-[#F6C97D] hover:text-[#0C1A54]'}`}>
                {deployStatus === 'loading' ? 'Processing...' : deployStatus === 'success' ? 'Deployed' : 'Deploy to Escrow'}
              </button>
              {deployMessage && (<div className={`text-center text-xs mt-[-10px] font-medium tracking-wide ${deployStatus === 'error' ? 'text-red-400' : 'text-green-400'}`}>{deployMessage}</div>)}
            </form>
          </div>

          {/* Box 3: AI Console */}
          <div className="border border-[#F6C97D]/10 rounded-3xl p-8 bg-white/[0.02] backdrop-blur-xl hover:border-[#F6C97D]/30 transition-all duration-500 h-[460px]">
            <h2 className="text-[#F6C97D] font-medium mb-8 uppercase tracking-[0.2em] text-xs">AI Verifier Agent</h2>
            <div className="bg-[#050A24]/80 border border-white/5 rounded-2xl p-6 h-72 font-mono text-[10px] leading-relaxed text-[#FFF8D3]/60 relative shadow-2xl overflow-y-auto custom-scroll">
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

      {/* MODAL DE CARTEIRA */}
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

      {/* TOAST NOTIFICATION */}
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

      {/* MODAL DE TAREFA */}
      {isTaskModalOpen && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0C1A54]/60 backdrop-blur-md animate-[fadeIn_0.2s]">
          <div className="bg-[#050A24] border border-[#F6C97D]/20 rounded-3xl p-10 w-full max-w-xl shadow-[0_0_50px_rgba(246,201,125,0.07)] relative overflow-hidden">
            <button onClick={closeModal} className="absolute top-8 right-8 text-[#FFF8D3]/40 hover:text-[#F6C97D] z-20">✕</button>
            
            {taskCompleted ? (
              <div className="flex flex-col items-center justify-center py-10 animate-[fadeIn_0.5s]">
                <div className="w-24 h-24 rounded-full bg-green-400/10 border-2 border-green-400 flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(74,222,128,0.3)]">
                  <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="text-3xl font-light text-green-400 mb-2">Bounty Claimed!</h2>
                <p className="text-[#FFF8D3]/60 mb-8 text-center text-sm">The AI verified your code and the smart contract<br/>has released the funds to your wallet.</p>
                <div className="bg-green-400/10 border border-green-400/30 px-8 py-4 rounded-2xl flex flex-col items-center">
                  <span className="text-green-400/70 uppercase tracking-widest text-[10px] mb-1">Earned</span>
                  <span className="text-green-400 font-mono text-3xl">{selectedTask.pot} POT</span>
                </div>
              </div>
            ) : aiReviewing ? (
              <div className="py-4">
                <h2 className="text-xl font-light text-[#F6C97D] mb-6 flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#F6C97D] animate-ping"></div>
                  AI Agent Reviewing PR...
                </h2>
                <div className="bg-[#020513] border border-white/10 rounded-xl p-5 h-64 font-mono text-[11px] leading-loose text-[#FFF8D3]/70 overflow-y-auto custom-scroll">
                  {reviewConsole.map((line, i) => (
                    <p key={i} className={`${line?.includes('✅') || line?.includes('💸') ? 'text-green-400' : ''}`}>{line}</p>
                  ))}
                  <div ref={reviewEndRef} />
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-light text-[#FFF8D3] mb-2">{selectedTask.title}</h2>
                <p className="text-[#F6C97D] font-mono text-xl mb-8">{selectedTask.pot} POT</p>
                <div className="mb-10 p-6 bg-white/[0.01] rounded-xl border border-white/5">
                  <h4 className="text-[#F6C97D]/70 text-xs uppercase tracking-widest mb-3">Task Description</h4>
                  <p className="text-[#FFF8D3]/80 text-sm font-light leading-relaxed">{selectedTask.description}</p>
                </div>

                {acceptedTasks.includes(selectedTask.title) ? (
                  <div role="button" onClick={(e) => handleSubmitPR(e)} className="w-full py-4 bg-[#F6C97D] text-[#0C1A54] transition-all duration-300 rounded-xl uppercase tracking-[0.2em] text-xs font-bold hover:scale-[1.02] shadow-[0_0_20px_rgba(246,201,125,0.3)] flex items-center justify-center gap-2 cursor-pointer">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                    Submit Pull Request
                  </div>
                ) : (
                  <div role="button" onClick={(e) => handleAcceptTask(e)} className={`w-full py-4 border transition-all duration-500 rounded-xl uppercase tracking-[0.2em] text-xs font-bold flex items-center justify-center cursor-pointer bg-[#F6C97D] text-[#0C1A54] hover:scale-[1.02]`}>
                    {user ? 'Accept Task' : 'Login to Accept Task'}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* ESTILOS GLOBAIS (Scrollbar Oculta e Animações) */}
      <style jsx global>{`
        /* Remove setas do input number */
        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }

        /* Scrollbar Global Escura (Conserta a lateral branca) */
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #050A24; }
        ::-webkit-scrollbar-thumb { background: rgba(246, 201, 125, 0.2); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(246, 201, 125, 0.5); }

        /* Custom Scroll para pequenas caixas de texto */
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 4px; }
        .custom-scroll:hover::-webkit-scrollbar-thumb { background: rgba(246, 201, 125, 0.2); }

        @keyframes slideIn { from { transform: translateY(100%) opacity(0); } to { transform: translateY(0) opacity(1); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
}