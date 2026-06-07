// Emmanuel Educa - Core Logic & Gamification Engine Pro

// 1. Estado Global do Aplicativo
const state = {
  currentUser: null, // Guardará os dados do usuário ativo
  users: [],         // Lista de todos os usuários registrados
  customLanguages: [], // Linguagens customizadas criadas pelo Admin
  systemLogs: [],      // Logs de atividade do admin
  currentTab: 'aprender',
  quiz: {
    currentQuestionIndex: 0,
    score: 0,
    answers: [],
    completed: false
  },
  soundsEnabled: true
};

// Usuários padrão para preencher o Leaderboard inicial
const defaultLeaderboardUsers = [
  { name: 'Pedro Hacker 🦖', email: 'pedro@hacker.com', xp: 260, completed: ['scratch', 'python'], badges: ['badge_rookie'], role: 'estudante' },
  { name: 'Sofia Web ⚡', email: 'sofia@web.com', xp: 195, completed: ['html-css', 'javascript'], badges: ['badge_rookie'], role: 'estudante' },
  { name: 'Lara Dev 🦄', email: 'lara@dev.com', xp: 140, completed: ['scratch'], badges: ['badge_rookie'], role: 'estudante' },
  { name: 'Lucca Bit 🤖', email: 'lucca@bit.com', xp: 70, completed: [], badges: [], role: 'estudante' }
];

// 2. Sintetizador de Som 8-Bit (Web Audio API)
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playTone(freqs, durations, type = 'sine', volume = 0.08) {
  if (!state.soundsEnabled) return;
  try {
    initAudio();
    let time = audioCtx.currentTime;
    
    freqs.forEach((freq, index) => {
      const duration = durations[index] || 0.1;
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, time);
      
      gainNode.gain.setValueAtTime(volume, time);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, time + duration);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.start(time);
      osc.stop(time + duration);
      
      time += duration * 0.8;
    });
  } catch (e) {
    console.warn("Falha ao tocar som: ", e);
  }
}

const sounds = {
  click: () => playTone([440, 880], [0.05, 0.05], 'triangle', 0.06),
  success: () => playTone([523.25, 659.25, 783.99, 1046.50], [0.08, 0.08, 0.08, 0.15], 'sine', 0.08),
  error: () => playTone([220, 147], [0.15, 0.2], 'sawtooth', 0.06),
  badge: () => playTone([392, 523.25, 659.25, 783.99, 987.77, 1046.50], [0.1, 0.1, 0.1, 0.1, 0.1, 0.3], 'sine', 0.1),
  levelUp: () => playTone([261.63, 329.63, 392, 523.25, 659.25, 783.99, 1046.50, 1318.51], [0.07, 0.07, 0.07, 0.07, 0.07, 0.07, 0.07, 0.25], 'sine', 0.09)
};

// 3. Inicialização e Controle de Sessão
document.addEventListener('DOMContentLoaded', () => {
  loadDatabase();
  checkSession();
  setupAuthEvents();
  setupNavigation();
  setupFiltersAndSearch();
  setupPlayground();
  setupGlossary();
  setupChatbot();
  setupMobileSidebar();
  setupAdminForm();
  
  // Registrar cliques globais para ativar áudio
  document.body.addEventListener('click', () => {
    initAudio();
  }, { once: true });
});

// 4. Lógica de Banco de Dados Local (localStorage)
function loadDatabase() {
  // Carrega lista de usuários geral
  let storedUsers = localStorage.getItem('emmanuel_educa_users');
  if (!storedUsers) {
    // Insere semente inicial de usuários competitivos
    state.users = [...defaultLeaderboardUsers];
    localStorage.setItem('emmanuel_educa_users', JSON.stringify(state.users));
  } else {
    state.users = JSON.parse(storedUsers);
  }

  // Carrega linguagens customizadas do admin
  state.customLanguages = JSON.parse(localStorage.getItem('emmanuel_educa_custom_languages')) || [];
  
  // Carrega logs de sistema
  state.systemLogs = JSON.parse(localStorage.getItem('emmanuel_educa_logs')) || [
    `[${getTimestamp()}] Sistema inicializado com sucesso.`
  ];
}

function saveDatabase() {
  localStorage.setItem('emmanuel_educa_users', JSON.stringify(state.users));
  localStorage.setItem('emmanuel_educa_custom_languages', JSON.stringify(state.customLanguages));
  localStorage.setItem('emmanuel_educa_logs', JSON.stringify(state.systemLogs));
  
  // Recarrega banco dinâmico do languages.js
  if (typeof reloadLanguagesData === 'function') {
    reloadLanguagesData();
  }
}

function checkSession() {
  const session = localStorage.getItem('emmanuel_educa_session');
  if (session) {
    const user = state.users.find(u => u.email === session);
    if (user) {
      loginUserSession(user);
      return;
    }
  }
  showLandingPage();
}

function addLog(message) {
  const logLine = `[${getTimestamp()}] ${message}`;
  state.systemLogs.push(logLine);
  if (state.systemLogs.length > 50) state.systemLogs.shift(); // Limite de 50 logs na memória
  saveDatabase();
  renderAdminLogs();
}

// 5. Fluxo de Autenticação
function setupAuthEvents() {
  const btnOpenAuth = document.getElementById('btn-open-auth');
  const btnStartNow = document.getElementById('btn-start-now');
  const authOverlay = document.getElementById('auth-overlay');
  const btnCloseAuth = document.getElementById('auth-close-btn');
  const authTabs = document.querySelectorAll('.auth-tab-btn');
  const formLogin = document.getElementById('form-login');
  const formSignup = document.getElementById('form-signup');

  // Abre Modal
  const openAuth = (tabName = 'login') => {
    sounds.click();
    authOverlay.style.display = 'flex';
    switchAuthTab(tabName);
  };
  
  if (btnOpenAuth) btnOpenAuth.onclick = () => openAuth('login');
  if (btnStartNow) btnStartNow.onclick = () => openAuth('signup');
  
  // Fecha Modal
  if (btnCloseAuth) {
    btnCloseAuth.onclick = () => {
      sounds.click();
      authOverlay.style.display = 'none';
    };
  }

  // Alterna Abas do Modal
  const switchAuthTab = (tab) => {
    authTabs.forEach(t => t.classList.remove('active'));
    document.getElementById(`tab-btn-${tab}`).classList.add('active');
    
    if (tab === 'login') {
      formLogin.classList.add('active');
      formSignup.classList.remove('active');
    } else {
      formLogin.classList.remove('active');
      formSignup.classList.add('active');
    }
  };

  authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      sounds.click();
      switchAuthTab(tab.getAttribute('data-tab'));
    });
  });

  // Submit Formulário de Login
  formLogin.onsubmit = (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const pass = document.getElementById('login-pass').value;
    const errorBox = document.getElementById('login-error');

    // Validação Superusuário / Admin
    if (email === 'emmanuel_admin' && pass === 'educa_superuser_99') {
      errorBox.style.display = 'none';
      let adminUser = state.users.find(u => u.email === 'admin@educa.com');
      if (!adminUser) {
        adminUser = {
          name: 'Emmanuel (Admin) 👑',
          email: 'admin@educa.com',
          xp: 1000,
          completed: [],
          badges: ['badge_emmanuel_god'],
          role: 'admin'
        };
        state.users.push(adminUser);
        saveDatabase();
      }
      loginUserSession(adminUser);
      addLog(`Superusuário logado na plataforma.`);
      authOverlay.style.display = 'none';
      return;
    }

    // Validação Aluno Normal
    const user = state.users.find(u => u.email === email && u.role !== 'admin');
    if (!user) {
      errorBox.innerText = 'E-mail ou credenciais incorretas.';
      errorBox.style.display = 'block';
      sounds.error();
      return;
    }
    
    // Simula senha correta (qualquer senha de 4 dígitos para facilitar testes rápidos do usuário)
    if (pass.length < 4) {
      errorBox.innerText = 'Senha precisa ter pelo menos 4 caracteres.';
      errorBox.style.display = 'block';
      sounds.error();
      return;
    }

    errorBox.style.display = 'none';
    loginUserSession(user);
    addLog(`Aluno [${user.name}] logou.`);
    authOverlay.style.display = 'none';
  };

  // Submit Formulário de Cadastro
  formSignup.onsubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const pass = document.getElementById('signup-pass').value;
    const errorBox = document.getElementById('signup-error');

    // Impedir cadastrar com e-mail reservado de admin
    if (email === 'admin@educa.com' || email === 'emmanuel_admin') {
      errorBox.innerText = 'Este e-mail é reservado pelo sistema.';
      errorBox.style.display = 'block';
      sounds.error();
      return;
    }

    // Verificar se já existe e-mail
    const exists = state.users.some(u => u.email === email);
    if (exists) {
      errorBox.innerText = 'E-mail já está sendo utilizado.';
      errorBox.style.display = 'block';
      sounds.error();
      return;
    }

    if (pass.length < 4) {
      errorBox.innerText = 'A senha deve conter pelo menos 4 dígitos.';
      errorBox.style.display = 'block';
      sounds.error();
      return;
    }

    // Criar Novo Aluno
    const newStudent = {
      name: name,
      email: email,
      xp: 0,
      completed: [],
      badges: [],
      role: 'estudante'
    };

    state.users.push(newStudent);
    saveDatabase();
    loginUserSession(newStudent);
    addLog(`Novo aluno cadastrado: [${name}] (${email}).`);
    authOverlay.style.display = 'none';
  };
}

function loginUserSession(user) {
  state.currentUser = user;
  localStorage.setItem('emmanuel_educa_session', user.email);
  sounds.success();
  
  // Atualiza HUD e Interface
  document.getElementById('sidebar-user-name').innerText = user.name;
  document.getElementById('sidebar-user-role').innerHTML = user.role === 'admin' 
    ? '<i class="fas fa-shield-alt"></i> Superusuário' 
    : '<i class="fas fa-graduation-cap"></i> Estudante';
  
  // Ocultar / Mostrar botão de Admin no menu lateral
  const adminBtn = document.getElementById('btn-tab-admin');
  if (adminBtn) {
    adminBtn.style.display = user.role === 'admin' ? 'flex' : 'none';
  }

  showPortal();
  updateUIProgress();
  renderLanguages();
  setupRoadmap();
  renderLeaderboard();
  
  // Renderiza dados do Perfil
  document.getElementById('profile-name-val').innerText = user.name;
  document.getElementById('profile-email-val').innerText = user.email;
  document.getElementById('profile-role-val').innerText = user.role === 'admin' ? 'Superusuário (Acesso Total)' : 'Estudante Oficial';
  
  // Se for admin, carrega estatísticas
  if (user.role === 'admin') {
    renderAdminStats();
    renderAdminUsersTable();
    renderAdminLogs();
  }

  // Seletor de abas ativa 'aprender' ao entrar
  document.getElementById('btn-tab-aprender').click();
  showToast(`Bem-vindo, ${user.name}! 🚀`, '#00ff87');
}

function logout() {
  sounds.click();
  addLog(`Usuário [${state.currentUser?.name}] deslogou.`);
  state.currentUser = null;
  localStorage.removeItem('emmanuel_educa_session');
  showLandingPage();
}

document.getElementById('btn-logout').onclick = logout;
document.getElementById('btn-profile-logout').onclick = logout;

// 6. Controle de Transição de Telas
function showLandingPage() {
  document.getElementById('landing-view').style.display = 'block';
  document.getElementById('portal-view').style.display = 'none';
}

function showPortal() {
  document.getElementById('landing-view').style.display = 'none';
  document.getElementById('portal-view').style.display = 'flex';
}

// 7. Navegação Interna do Portal (Sidebar SPA)
function setupNavigation() {
  const buttons = document.querySelectorAll('.sidebar-btn');
  const sections = document.querySelectorAll('.portal-content-section');
  
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      if (!tabId) return; // botão logout, etc.
      
      sounds.click();
      
      buttons.forEach(b => b.classList.remove('active'));
      sections.forEach(s => s.classList.remove('active'));
      
      btn.classList.add('active');
      const targetSection = document.getElementById(`sect-${tabId}`);
      if (targetSection) {
        targetSection.classList.add('active');
      }
      
      state.currentTab = tabId;
      
      // Fecha sidebar no mobile após clique
      document.getElementById('portal-sidebar').classList.remove('active');

      if (tabId === 'quiz') {
        initQuiz();
      } else if (tabId === 'ranking') {
        renderLeaderboard();
      } else if (tabId === 'profile') {
        renderProfileBadges();
      } else if (tabId === 'admin') {
        renderAdminStats();
        renderAdminUsersTable();
        renderAdminLogs();
      }
    });
  });
}

function setupMobileSidebar() {
  const toggle = document.getElementById('btn-menu-toggle');
  const sidebar = document.getElementById('portal-sidebar');
  if (toggle && sidebar) {
    toggle.onclick = () => {
      sounds.click();
      sidebar.classList.toggle('active');
    };
  }
}

// 8. HUD e Mecânica de XP / Medalhas
function updateUIProgress() {
  if (!state.currentUser) return;
  
  const xpCount = document.getElementById('hud-xp-count');
  const xpBar = document.getElementById('hud-xp-bar');
  if (xpCount && xpBar) {
    xpCount.innerText = `${state.currentUser.xp} XP`;
    const levelXp = state.currentUser.xp % 100;
    xpBar.style.width = `${levelXp}%`;
    document.getElementById('hud-level-label').innerText = `NÍVEL ${Math.floor(state.currentUser.xp / 100) + 1}`;
  }
  
  const badgeCount = document.getElementById('hud-badge-count');
  if (badgeCount) {
    badgeCount.innerText = `${state.currentUser.badges.length} Medalhas`;
  }
}

function addXP(amount) {
  if (!state.currentUser) return;
  
  const oldLevel = Math.floor(state.currentUser.xp / 100);
  state.currentUser.xp += amount;
  const newLevel = Math.floor(state.currentUser.xp / 100);
  
  // Atualiza no banco geral
  const dbUser = state.users.find(u => u.email === state.currentUser.email);
  if (dbUser) dbUser.xp = state.currentUser.xp;
  saveDatabase();
  
  updateUIProgress();
  
  if (newLevel > oldLevel) {
    sounds.levelUp();
    showToast(`🚀 LEVEL UP! Você alcançou o Nível ${newLevel + 1}!`, '#00ff87');
    triggerConfettiExplosion();
  }
}

// 9. Catálogo de Linguagens (Renderização e Modal)
function renderLanguages(filterCat = 'all', searchQuery = '') {
  const grid = document.getElementById('languages-grid');
  if (!grid) return;
  
  grid.innerHTML = '';
  
  // languagesData é importada de js/languages.js
  const filtered = languagesData.filter(lang => {
    const matchesCategory = filterCat === 'all' || lang.category === filterCat;
    const matchesSearch = lang.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          lang.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted)">
        <i class="fas fa-search" style="font-size: 2rem; color: var(--primary-green); margin-bottom: 12px"></i>
        <p>Nenhuma linguagem encontrada com esses termos.</p>
      </div>
    `;
    return;
  }
  
  filtered.forEach(lang => {
    const card = document.createElement('div');
    const isCompleted = state.currentUser?.completed.includes(lang.id);
    
    card.className = `lang-card ${isCompleted ? 'completed-lesson' : ''}`;
    card.style.setProperty('--card-color', lang.color);
    const rgb = hexToRgb(lang.color);
    card.style.setProperty('--card-color-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
    
    let diffDots = '';
    for (let i = 1; i <= 5; i++) {
      diffDots += `<span class="diff-dot ${i <= lang.difficultyValue ? 'active' : ''}"></span>`;
    }
    
    card.innerHTML = `
      <div class="lang-header">
        <div class="lang-icon-box">
          <i class="${lang.icon}"></i>
        </div>
        <span class="lang-tag">${lang.categoryLabel}</span>
      </div>
      <h3>${lang.name}</h3>
      <p class="lang-analogy-preview">${lang.analogy}</p>
      <div class="lang-footer">
        <div class="difficulty-indicator">
          ${diffDots}
        </div>
        <button class="btn-open">Aprender <i class="fas fa-arrow-right"></i></button>
      </div>
    `;
    
    card.addEventListener('click', () => {
      sounds.click();
      openLanguageModal(lang);
    });
    
    grid.appendChild(card);
  });
}

function setupFiltersAndSearch() {
  const searchInput = document.getElementById('lang-search');
  const filterTags = document.querySelectorAll('.filter-tag');
  
  let activeCat = 'all';
  let activeSearch = '';
  
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      activeSearch = e.target.value;
      renderLanguages(activeCat, activeSearch);
    });
  }
  
  filterTags.forEach(tag => {
    tag.addEventListener('click', () => {
      sounds.click();
      filterTags.forEach(t => t.classList.remove('active'));
      tag.classList.add('active');
      activeCat = tag.getAttribute('data-filter');
      renderLanguages(activeCat, activeSearch);
    });
  });
}

function openLanguageModal(lang) {
  const modal = document.getElementById('lang-modal');
  if (!modal) return;
  
  const rgb = hexToRgb(lang.color);
  modal.style.setProperty('--card-color', lang.color);
  modal.style.setProperty('--card-color-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
  
  document.getElementById('modal-icon').className = lang.icon + ' modal-banner-icon';
  document.getElementById('modal-title').innerText = lang.name;
  document.getElementById('modal-diff-badge').innerText = `Dificuldade: ${lang.difficulty}`;
  document.getElementById('modal-analogy').innerText = lang.analogy;
  document.getElementById('modal-what-does').innerText = lang.whatItDoes;
  document.getElementById('modal-cool-fact').innerText = lang.coolFact;
  
  const stepsList = document.getElementById('modal-steps');
  stepsList.innerHTML = '';
  lang.howToRunLocal.forEach((step, idx) => {
    const li = document.createElement('li');
    li.className = 'step-item';
    li.innerHTML = `<span class="step-num">${idx + 1}</span> <p>${step}</p>`;
    stepsList.appendChild(li);
  });
  
  document.getElementById('modal-code-box').textContent = lang.codeExample;
  document.getElementById('modal-project-title').innerText = `🏆 Projeto: ${lang.miniProject.title}`;
  document.getElementById('modal-project-desc').innerText = lang.miniProject.description;
  
  const projectSteps = document.getElementById('modal-project-steps');
  projectSteps.innerHTML = '';
  lang.miniProject.steps.forEach(step => {
    const li = document.createElement('li');
    li.style.marginBottom = '8px';
    li.innerHTML = `• ${step}`;
    projectSteps.appendChild(li);
  });
  
  const runBtn = document.getElementById('modal-btn-run');
  if (runBtn) {
    runBtn.style.display = (lang.id === 'javascript' || lang.id === 'html-css') ? 'flex' : 'none';
    runBtn.onclick = () => {
      sounds.click();
      closeLanguageModal();
      goToPlayground(lang.id);
    };
  }
  
  // Concluir Lição e dar XP (apenas a primeira vez)
  if (state.currentUser && !state.currentUser.completed.includes(lang.id)) {
    state.currentUser.completed.push(lang.id);
    const dbUser = state.users.find(u => u.email === state.currentUser.email);
    if (dbUser) dbUser.completed = state.currentUser.completed;
    saveDatabase();
    
    addXP(20); // 20 XP por concluir lição
    renderLanguages(); // Atualiza checkmark no grid
    showToast(`📚 Você concluiu a lição de ${lang.name}! +20 XP`, '#00ff87');
  }
  
  modal.style.display = 'flex';
}

function closeLanguageModal() {
  const modal = document.getElementById('lang-modal');
  if (modal) modal.style.display = 'none';
}

document.getElementById('modal-close-btn').onclick = () => {
  sounds.click();
  closeLanguageModal();
};

// 10. Editor / Playground
const playgroundTemplates = {
  'javascript': `// Olá Mundo e Loops no Emmanuel Educa 🪐
// Digite seu código JavaScript e execute!

function contarEstrelas() {
  console.log("Iniciando contagem de constelações... ✨");
  for (let i = 1; i <= 3; i++) {
    console.log("Estrela " + i + " mapeada no radar!");
  }
  console.log("Fim do escaneamento cibernético. Bip Bop!");
}

contarEstrelas();`,
  'html-css': `<!-- Desenhe o seu portal espacial! -->
<div class="cyber-box">
  <h1>PORTAL HACKER</h1>
  <p>Almanaque Emmanuel Educa</p>
  <div class="glow-ring"></div>
</div>

<style>
body {
  background: #06070a;
  color: #00ff87;
  font-family: 'Courier New', monospace;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 90vh;
  margin: 0;
  text-align: center;
}
.cyber-box {
  padding: 30px;
  border: 1px solid #10b981;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
  position: relative;
}
.glow-ring {
  width: 50px;
  height: 50px;
  border: 3px solid transparent;
  border-top-color: #00ff87;
  border-radius: 50%;
  margin: 20px auto 0 auto;
  animation: girar 1s linear infinite;
}
@keyframes girar {
  to { transform: rotate(360deg); }
}
</style>`
};

function setupPlayground() {
  const selector = document.getElementById('play-lang-select');
  const codeArea = document.getElementById('play-code');
  const btnRun = document.getElementById('play-btn-run');
  const iframe = document.getElementById('play-iframe');
  const terminal = document.getElementById('play-terminal');
  
  if (!selector || !codeArea || !btnRun) return;
  
  selector.addEventListener('change', () => {
    sounds.click();
    const lang = selector.value;
    codeArea.value = playgroundTemplates[lang] || '';
    
    if (lang === 'html-css') {
      iframe.style.display = 'block';
      terminal.style.display = 'none';
      runHtmlCssPreview(codeArea.value);
    } else {
      iframe.style.display = 'none';
      terminal.style.display = 'block';
      terminal.textContent = '// Console limpo. Aguardando execução...';
    }
  });
  
  btnRun.addEventListener('click', () => {
    sounds.success();
    const lang = selector.value;
    const code = codeArea.value;
    
    if (lang === 'javascript') {
      runJavaScriptConsole(code);
      addXP(5);
    } else if (lang === 'html-css') {
      runHtmlCssPreview(code);
      addXP(5);
    }
  });
}

function goToPlayground(langId) {
  const playBtn = document.querySelector('.sidebar-btn[data-tab="playground"]');
  if (playBtn) playBtn.click();
  
  const selector = document.getElementById('play-lang-select');
  const codeArea = document.getElementById('play-code');
  const iframe = document.getElementById('play-iframe');
  const terminal = document.getElementById('play-terminal');
  
  if (langId === 'javascript' || langId === 'html-css') {
    selector.value = langId;
    codeArea.value = playgroundTemplates[langId];
    
    if (langId === 'html-css') {
      iframe.style.display = 'block';
      terminal.style.display = 'none';
      runHtmlCssPreview(playgroundTemplates[langId]);
    } else {
      iframe.style.display = 'none';
      terminal.style.display = 'block';
      runJavaScriptConsole(playgroundTemplates[langId]);
    }
  }
}

function runJavaScriptConsole(code) {
  const terminal = document.getElementById('play-terminal');
  terminal.textContent = '';
  
  const originalLog = console.log;
  const originalWarn = console.warn;
  const originalError = console.error;
  
  let logs = [];
  
  console.log = (...args) => {
    logs.push(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' '));
  };
  console.warn = console.log;
  console.error = (...args) => {
    logs.push('❌ ERRO: ' + args.join(' '));
  };
  
  try {
    const runFn = new Function(code);
    runFn();
  } catch (err) {
    logs.push('❌ ERRO DE EXECUÇÃO: ' + err.message);
  }
  
  console.log = originalLog;
  console.warn = originalWarn;
  console.error = originalError;
  
  if (logs.length === 0) {
    terminal.textContent = '// Código rodou sem problemas, mas não chamou console.log()!';
  } else {
    terminal.textContent = logs.join('\n');
  }
}

function runHtmlCssPreview(code) {
  const iframe = document.getElementById('play-iframe');
  iframe.srcdoc = code;
}

// 11. Roteiro (Roadmap)
const roadmapMilestones = [
  { id: 'rm_1', title: 'Fundamentos Coder', xp: 25, desc: 'Complete Scratch e Python e entenda variáveis.' },
  { id: 'rm_2', title: 'Arquiteto Web', xp: 30, desc: 'Domine a estrutura do HTML5 e os estilos dinâmicos do CSS3.' },
  { id: 'rm_3', title: 'Interatividade com JS', xp: 35, desc: 'Crie comportamentos avançados e dinâmicos de tela.' },
  { id: 'rm_4', title: 'Administrador de Bancos', xp: 40, desc: 'Organize tabelas, dados e faça consultas SQL.' },
  { id: 'rm_5', title: 'Mestre Mobile e Jogos', xp: 50, desc: 'Crie aplicativos móveis com Swift/Kotlin ou jogos 3D em C#.' }
];

function setupRoadmap() {
  const container = document.getElementById('roadmap-list');
  if (!container || !state.currentUser) return;
  
  container.innerHTML = '';
  
  // Carrega progresso do usuário logado (usaremoscompleted_roadmap no currentUser ou salvamos no db)
  if (!state.currentUser.roadmap) {
    state.currentUser.roadmap = [];
  }
  
  roadmapMilestones.forEach((stone, index) => {
    const isCompleted = state.currentUser.roadmap.includes(stone.id);
    
    const stepEl = document.createElement('div');
    stepEl.className = `roadmap-step ${isCompleted ? 'active' : ''}`;
    
    stepEl.innerHTML = `
      <div class="roadmap-icon-node ${isCompleted ? 'completed' : ''}" id="node-${stone.id}">
        <i class="fas ${isCompleted ? 'fa-check' : 'fa-lock'}"></i>
      </div>
      <div class="roadmap-content">
        <span class="roadmap-step-num">ETAPA 0${index + 1} • +${stone.xp} XP</span>
        <h3>${stone.title}</h3>
        <p>${stone.desc}</p>
      </div>
    `;
    
    const node = stepEl.querySelector('.roadmap-icon-node');
    const content = stepEl.querySelector('.roadmap-content');
    
    const toggleNode = () => {
      const dbUser = state.users.find(u => u.email === state.currentUser.email);
      const isDone = state.currentUser.roadmap.includes(stone.id);
      
      if (!isDone) {
        state.currentUser.roadmap.push(stone.id);
        stepEl.classList.add('active');
        node.classList.add('completed');
        node.querySelector('i').className = 'fas fa-check';
        sounds.success();
        addXP(stone.xp);
        showToast(`✅ Concluiu a Etapa: ${stone.title}! +${stone.xp} XP`, '#00ff87');
      } else {
        state.currentUser.roadmap = state.currentUser.roadmap.filter(id => id !== stone.id);
        stepEl.classList.remove('active');
        node.classList.remove('completed');
        node.querySelector('i').className = 'fas fa-lock';
        sounds.error();
        // Deduz XP
        state.currentUser.xp = Math.max(0, state.currentUser.xp - stone.xp);
        updateUIProgress();
      }
      
      if (dbUser) {
        dbUser.roadmap = state.currentUser.roadmap;
        dbUser.xp = state.currentUser.xp;
      }
      saveDatabase();
      renderLeaderboard();
    };
    
    node.onclick = toggleNode;
    content.onclick = toggleNode;
    
    container.appendChild(stepEl);
  });
}

// 12. Arena do Quiz
function initQuiz() {
  state.quiz.currentQuestionIndex = 0;
  state.quiz.score = 0;
  state.quiz.answers = [];
  state.quiz.completed = false;
  
  document.getElementById('quiz-play-box').style.display = 'block';
  document.getElementById('quiz-results-box').style.display = 'none';
  
  renderQuestion();
}

function renderQuestion() {
  const qIndex = state.quiz.currentQuestionIndex;
  const qData = quizQuestions[qIndex];
  
  document.getElementById('quiz-current-num').innerText = qIndex + 1;
  document.getElementById('quiz-total-num').innerText = quizQuestions.length;
  document.getElementById('quiz-score-val').innerText = state.quiz.score * 10;
  
  const progressPercent = ((qIndex) / quizQuestions.length) * 100;
  document.getElementById('quiz-progress').style.width = `${progressPercent}%`;
  
  document.getElementById('quiz-question').innerText = qData.question;
  
  const optionsBox = document.getElementById('quiz-options');
  optionsBox.innerHTML = '';
  
  qData.options.forEach((opt, idx) => {
    const button = document.createElement('button');
    button.className = 'quiz-option';
    button.innerHTML = `<span class="step-num">${String.fromCharCode(65 + idx)}</span> <p>${opt}</p>`;
    button.onclick = () => selectQuizOption(idx);
    optionsBox.appendChild(button);
  });
  
  document.getElementById('quiz-feedback-box').classList.remove('show');
  document.getElementById('quiz-btn-next').style.display = 'none';
}

function selectQuizOption(selectedIdx) {
  const qIndex = state.quiz.currentQuestionIndex;
  const qData = quizQuestions[qIndex];
  const options = document.querySelectorAll('.quiz-option');
  
  options.forEach(opt => opt.style.pointerEvents = 'none');
  
  const isCorrect = (selectedIdx === qData.answer);
  
  options[selectedIdx].classList.add(isCorrect ? 'correct' : 'wrong');
  if (!isCorrect) {
    options[qData.answer].classList.add('correct');
    sounds.error();
  } else {
    state.quiz.score++;
    sounds.success();
  }
  
  const feedbackBox = document.getElementById('quiz-feedback-box');
  const feedbackTitle = document.getElementById('quiz-feedback-title');
  const feedbackText = document.getElementById('quiz-feedback-text');
  
  feedbackTitle.innerText = isCorrect ? '🌟 CORRETO! EXCELENTE TRABALHO!' : '🔥 ERROU! CONTINUE ESTUDANDO!';
  feedbackTitle.className = `feedback-title ${isCorrect ? 'success' : 'error'}`;
  feedbackText.innerText = qData.explanation;
  feedbackBox.classList.add('show');
  
  const nextBtn = document.getElementById('quiz-btn-next');
  nextBtn.style.display = 'flex';
  
  if (qIndex === quizQuestions.length - 1) {
    nextBtn.innerHTML = `Ver Resultados <i class="fas fa-crown"></i>`;
  } else {
    nextBtn.innerHTML = `Próxima Questão <i class="fas fa-chevron-right"></i>`;
  }
  
  nextBtn.onclick = () => {
    sounds.click();
    if (qIndex === quizQuestions.length - 1) {
      finishQuiz();
    } else {
      state.quiz.currentQuestionIndex++;
      renderQuestion();
    }
  };
}

function finishQuiz() {
  document.getElementById('quiz-play-box').style.display = 'none';
  const resultsBox = document.getElementById('quiz-results-box');
  resultsBox.style.display = 'block';
  
  const finalScore = state.quiz.score;
  const finalScoreXP = finalScore * 15;
  
  addXP(finalScoreXP);
  
  document.getElementById('results-score-val').innerText = `${finalScore}/${quizQuestions.length}`;
  document.getElementById('results-xp-earned').innerText = `Você ganhou +${finalScoreXP} XP!`;
  
  let msg = '';
  if (finalScore === 10) msg = 'Hacker Lendário! Desempenho fantástico de 100%! 👑';
  else if (finalScore >= 7) msg = 'Incrível! Você já domina bem os conceitos principais! 🚀';
  else if (finalScore >= 4) msg = 'Bom resultado! Dê mais uma olhada nas lições e tente de novo. 📚';
  else msg = 'Todo expert começou do zero. Continue tentando! 🎮';
  
  document.getElementById('results-msg-text').innerText = msg;
  
  // Medalhas
  const badgesGrid = document.getElementById('results-badges');
  badgesGrid.innerHTML = '';
  
  let newBadges = false;
  
  badgesData.forEach(badge => {
    const isUnlocked = badge.requirement(finalScore);
    const alreadyHad = state.currentUser.badges.includes(badge.id);
    
    if (isUnlocked && !alreadyHad) {
      state.currentUser.badges.push(badge.id);
      newBadges = true;
    }
    
    const hasBadgeNow = state.currentUser.badges.includes(badge.id);
    
    const card = document.createElement('div');
    card.className = `badge-card ${hasBadgeNow ? 'unlocked' : ''}`;
    card.style.setProperty('--badge-color', badge.color);
    const rgb = hexToRgb(badge.color);
    card.style.setProperty('--badge-color-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
    
    card.innerHTML = `
      <div class="badge-card-icon"><i class="${badge.icon}"></i></div>
      <div class="badge-card-info">
        <p class="badge-card-name">${badge.name}</p>
        <p class="badge-card-desc">${badge.description}</p>
      </div>
    `;
    badgesGrid.appendChild(card);
  });
  
  // Sincroniza
  const dbUser = state.users.find(u => u.email === state.currentUser.email);
  if (dbUser) {
    dbUser.badges = state.currentUser.badges;
    dbUser.xp = state.currentUser.xp;
  }
  saveDatabase();
  updateUIProgress();
  renderLeaderboard();
  
  if (newBadges) {
    sounds.badge();
    triggerConfettiExplosion();
    showToast("🏅 Nova medalha desbloqueada! Veja no seu perfil.", "#fbbf24");
  }
  
  document.getElementById('quiz-btn-restart').onclick = () => {
    sounds.click();
    initQuiz();
  };
}

// 13. Leaderboard (Ranking de Alunos)
function renderLeaderboard() {
  const tbody = document.getElementById('leaderboard-tbody');
  const podiumList = document.getElementById('podium-list');
  if (!tbody || !podiumList) return;
  
  tbody.innerHTML = '';
  
  // Classifica usuários por XP decrescente
  const sorted = [...state.users].sort((a, b) => b.xp - a.xp);
  
  // Renderiza Podium (Top 3)
  const podiumData = { gold: null, silver: null, bronze: null };
  if (sorted[0]) podiumData.gold = sorted[0];
  if (sorted[1]) podiumData.silver = sorted[1];
  if (sorted[2]) podiumData.bronze = sorted[2];
  
  podiumList.innerHTML = `
    <!-- 2º Lugar -->
    ${podiumData.silver ? `
      <div class="podium-step silver">
        <div class="podium-username" title="${podiumData.silver.name}">${podiumData.silver.name}</div>
        <div class="podium-xp">${podiumData.silver.xp} XP</div>
        <div class="podium-avatar"><i class="fas fa-medal"></i></div>
        <div class="podium-base">2</div>
      </div>
    ` : ''}
    
    <!-- 1º Lugar -->
    ${podiumData.gold ? `
      <div class="podium-step gold">
        <div class="podium-username" title="${podiumData.gold.name}">${podiumData.gold.name}</div>
        <div class="podium-xp">${podiumData.gold.xp} XP</div>
        <div class="podium-avatar"><i class="fas fa-crown"></i></div>
        <div class="podium-base">1</div>
      </div>
    ` : ''}
    
    <!-- 3º Lugar -->
    ${podiumData.bronze ? `
      <div class="podium-step bronze">
        <div class="podium-username" title="${podiumData.bronze.name}">${podiumData.bronze.name}</div>
        <div class="podium-xp">${podiumData.bronze.xp} XP</div>
        <div class="podium-avatar"><i class="fas fa-award"></i></div>
        <div class="podium-base">3</div>
      </div>
    ` : ''}
  `;

  // Renderiza Tabela
  sorted.forEach((user, index) => {
    const isCurrentUser = state.currentUser && user.email === state.currentUser.email;
    const tr = document.createElement('tr');
    if (isCurrentUser) tr.className = 'active-user-row';
    
    // Troféus ou números de ranking
    let rankHtml = index + 1;
    if (index === 0) rankHtml = '<i class="fas fa-trophy rank-trophy gold"></i>';
    else if (index === 1) rankHtml = '<i class="fas fa-trophy rank-trophy silver"></i>';
    else if (index === 2) rankHtml = '<i class="fas fa-trophy rank-trophy bronze"></i>';
    
    const flagRole = user.role === 'admin' ? '<i class="fas fa-crown" style="color:#fbbf24; font-size:0.75rem;" title="Admin"></i> ' : '';
    
    tr.innerHTML = `
      <td class="rank-cell">${rankHtml}</td>
      <td class="user-cell">
        <div class="user-cell-avatar"><i class="fas fa-user"></i></div>
        <span>${flagRole}${user.name}</span>
      </td>
      <td class="xp-cell">${user.xp} XP</td>
      <td>${user.completed ? user.completed.length : 0} / ${languagesData.length}</td>
    `;
    tbody.appendChild(tr);
  });
}

// 14. Glossário
const glossaryData = [
  { term: 'Algoritmo', desc: 'Receita passo a passo para o computador.' },
  { term: 'API', desc: 'Garçom que busca seus dados no servidor.' },
  { term: 'Array / Vetor', desc: 'Gaveteiro organizado de variáveis.' },
  { term: 'Banco de Dados', desc: 'Armário digital de armazenamento seguro.' },
  { term: 'Bug / Inseto', desc: 'Erro lógico que faz o código falhar.' },
  { term: 'Compilar', desc: 'Traduzir texto humano para código binário (01).' },
  { term: 'Console / Terminal', desc: 'Interface de texto para comando direto.' },
  { term: 'Framework', desc: 'Estrutura pré-pronta para acelerar projetos.' },
  { term: 'Função', desc: 'Mini-maquinário lógico com entrada e saída.' },
  { term: 'Hacker', desc: 'Explorador curioso de sistemas e computadores.' },
  { term: 'HTML', desc: 'O esqueleto de elementos de uma página.' },
  { term: 'Loop / Laço', desc: 'Comando para rodar tarefas repetidamente.' },
  { term: 'Null / Nulo', desc: 'Ausência total de valor de variável.' },
  { term: 'Open Source', desc: 'Código livre e colaborativo.' },
  { term: 'Servidor', desc: 'Computador que envia arquivos para a rede.' },
  { term: 'String / Texto', desc: 'Sequência de texto delimitada por aspas.' }
];

function setupGlossary() {
  const container = document.getElementById('glossary-list');
  const searchInput = document.getElementById('glossary-search');
  if (!container) return;
  
  const renderList = (search = '') => {
    container.innerHTML = '';
    const filtered = glossaryData.filter(item => 
      item.term.toLowerCase().includes(search.toLowerCase()) ||
      item.desc.toLowerCase().includes(search.toLowerCase())
    );
    
    if (filtered.length === 0) {
      container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 20px; color: var(--text-muted)">Nenhum termo encontrado.</div>';
      return;
    }
    
    filtered.forEach(item => {
      const card = document.createElement('div');
      card.className = 'glossary-card';
      card.innerHTML = `
        <h3 class="glossary-term"><i class="fas fa-terminal"></i> ${item.term}</h3>
        <p class="glossary-analogy">${item.desc}</p>
      `;
      container.appendChild(card);
    });
  };
  
  if (searchInput) {
    searchInput.addEventListener('input', (e) => renderList(e.target.value));
  }
  
  renderList();
}

// 15. Chatbot
const botResponses = {
  'olá': 'Olá, campeão! Robo-Emmanuel no ar. Como posso guiar seus códigos hoje?',
  'ola': 'Olá, campeão! Robo-Emmanuel no ar. Como posso guiar seus códigos hoje?',
  'comecar': 'Comece pelo Scratch! Seus blocos são divertidos e super fáceis.',
  'como começar': 'Comece pelo Scratch! Seus blocos são divertidos e super fáceis.',
  'python': 'Python é prático, direto e a linguagem usada na Inteligência Artificial!',
  'criar jogos': 'Para jogos 2D/3D use C# com Unity. É a melhor engine do mercado!',
  'criar sites': 'Use HTML (esqueleto), CSS (design) e JS (movimento). A tríade da Web!',
  'admin': 'Se você for o superusuário, seu login é emmanuel_admin. Com ele você controla o sistema!',
  'ajuda': 'Escreva "como começar", "python", "criar jogos" ou "criar sites" para receber dicas rápidas!'
};

function setupChatbot() {
  const history = document.getElementById('chat-history');
  const input = document.getElementById('chat-input');
  const btnSend = document.getElementById('chat-btn-send');
  const suggestions = document.querySelectorAll('.suggestion-chip');
  
  if (!history || !input || !btnSend) return;
  
  const sendMessage = (text) => {
    if (!text.trim()) return;
    
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-message user';
    userMsg.textContent = text;
    history.appendChild(userMsg);
    
    history.scrollTop = history.scrollHeight;
    input.value = '';
    
    sounds.click();
    
    setTimeout(() => {
      const botMsg = document.createElement('div');
      botMsg.className = 'chat-message bot';
      
      const cleanText = text.toLowerCase().trim().replace(/[?.,!]/g, "");
      let reply = 'Bip Bop... Não captei seu comando. Digite "ajuda" para ver os comandos rápidos!';
      
      for (let key in botResponses) {
        if (cleanText.includes(key)) {
          reply = botResponses[key];
          break;
        }
      }
      
      botMsg.innerHTML = reply;
      history.appendChild(botMsg);
      history.scrollTop = history.scrollHeight;
      sounds.success();
    }, 500);
  };
  
  btnSend.onclick = () => sendMessage(input.value);
  input.onkeypress = (e) => { if (e.key === 'Enter') sendMessage(input.value); };
  suggestions.forEach(chip => {
    chip.onclick = () => sendMessage(chip.innerText);
  });
}

// 16. Painel Administrativo (Apenas para Superusuário)
function renderAdminStats() {
  const statsUsers = document.getElementById('admin-stat-users');
  const statsLangs = document.getElementById('admin-stat-langs');
  const statsXp = document.getElementById('admin-stat-xp');
  
  if (!statsUsers || !statsLangs || !statsXp) return;
  
  const studentCount = state.users.filter(u => u.role !== 'admin').length;
  statsUsers.innerText = studentCount;
  
  // Total de linguagens (nativas + custom)
  statsLangs.innerText = languagesData.length;
  
  // XP médio
  const totalXp = state.users.reduce((acc, curr) => acc + curr.xp, 0);
  const avg = state.users.length ? Math.floor(totalXp / state.users.length) : 0;
  statsXp.innerText = `${avg} XP`;
}

function renderAdminUsersTable() {
  const tbody = document.getElementById('admin-users-tbody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  state.users.forEach((user, idx) => {
    const tr = document.createElement('tr');
    const badgeCount = user.badges ? user.badges.length : 0;
    
    // Desabilitar botões para o próprio admin
    const isAdmin = user.role === 'admin';
    const actionDisabled = isAdmin ? 'style="opacity:0.3; pointer-events:none;"' : '';
    
    tr.innerHTML = `
      <td><strong>${user.name}</strong></td>
      <td>${user.email}</td>
      <td style="color:var(--primary-green); font-family:var(--font-title);">${user.xp} XP</td>
      <td>${badgeCount} Medalhas</td>
      <td>
        <button class="btn-action bonus-xp" title="Conceder +50 XP" ${actionDisabled} onclick="adminGiveXP('${user.email}')">
          <i class="fas fa-plus-circle"></i>
        </button>
        <button class="btn-action delete" title="Deletar Usuário" ${actionDisabled} onclick="adminDeleteUser('${user.email}')">
          <i class="fas fa-trash-alt"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

window.adminGiveXP = (email) => {
  const user = state.users.find(u => u.email === email);
  if (user) {
    user.xp += 50;
    saveDatabase();
    renderAdminStats();
    renderAdminUsersTable();
    renderLeaderboard();
    sounds.success();
    addLog(`Admin concedeu +50 XP bônus para [${user.name}].`);
    showToast(`Concedido +50 XP para ${user.name}!`, '#fbbf24');
    
    // Se for o próprio logado
    if (state.currentUser && state.currentUser.email === email) {
      state.currentUser.xp = user.xp;
      updateUIProgress();
    }
  }
};

window.adminDeleteUser = (email) => {
  const user = state.users.find(u => u.email === email);
  if (user) {
    if (confirm(`Tem certeza que deseja deletar a conta de ${user.name}?`)) {
      state.users = state.users.filter(u => u.email !== email);
      saveDatabase();
      renderAdminStats();
      renderAdminUsersTable();
      renderLeaderboard();
      sounds.error();
      addLog(`Admin deletou a conta do aluno [${user.name}].`);
      showToast(`Usuário ${user.name} deletado com sucesso.`, '#ef4444');
    }
  }
};

function renderAdminLogs() {
  const terminal = document.getElementById('admin-logs-console');
  if (!terminal) return;
  terminal.textContent = state.systemLogs.join('\n');
  terminal.scrollTop = terminal.scrollHeight;
}

function setupAdminForm() {
  const form = document.getElementById('admin-form-lang');
  if (!form) return;
  
  form.onsubmit = (e) => {
    e.preventDefault();
    sounds.success();
    
    const name = document.getElementById('ad-name').value.trim();
    const icon = document.getElementById('ad-icon').value.trim() || 'fas fa-code';
    const color = document.getElementById('ad-color').value.trim() || '#00ff87';
    const category = document.getElementById('ad-category').value;
    const diff = document.getElementById('ad-diff').value;
    const analogy = document.getElementById('ad-analogy').value.trim();
    const whatItDoes = document.getElementById('ad-what-does').value.trim();
    const coolFact = document.getElementById('ad-cool-fact').value.trim();
    const code = document.getElementById('ad-code').value.trim();
    const projTitle = document.getElementById('ad-proj-title').value.trim();
    const projDesc = document.getElementById('ad-proj-desc').value.trim();
    
    // Cria novo objeto de linguagem
    const id = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    
    // Categorias labels
    const categoryLabels = {
      'iniciante': 'Iniciante / Lógica',
      'web': 'Web / Layout',
      'jogos': 'Jogos / Gráficos',
      'mobile': 'Mobile / Celulares',
      'dados': 'Dados / Estatística',
      'sistemas': 'Sistemas / Servidores'
    };

    const newLang = {
      id: id,
      name: name,
      icon: icon,
      color: color,
      category: category,
      categoryLabel: categoryLabels[category] || 'Tecnologia',
      difficulty: `${diff}. Configuração do Admin.`,
      difficultyValue: 3,
      analogy: analogy,
      whatItDoes: whatItDoes,
      coolFact: coolFact,
      howToRunLocal: [
        'Abra o VS Code e crie o seu arquivo de testes.',
        'Acesse a documentação oficial para instalar dependências se necessário.',
        'Execute no terminal digitando o interpretador correspondente.'
      ],
      codeExample: code,
      miniProject: {
        title: projTitle,
        description: projDesc,
        steps: [
          'Abra seu editor e copie o esqueleto básico de teste.',
          'Execute a primeira vez para garantir o funcionamento.',
          'Implemente a lógica proposta pelo Admin no painel!'
        ]
      }
    };
    
    state.customLanguages.push(newLang);
    saveDatabase();
    
    addLog(`Admin cadastrou nova linguagem: [${name}].`);
    showToast(`Linguagem ${name} criada com sucesso!`, '#fbbf24');
    triggerConfettiExplosion();
    
    // Limpa Formulário
    form.reset();
    
    // Atualiza Stats e Volta pro Aprender
    renderAdminStats();
    renderLanguages();
    document.getElementById('btn-tab-aprender').click();
  };
}

// Exportar Alunos para CSV
document.getElementById('admin-btn-export').onclick = () => {
  sounds.success();
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Nome,Email,XP,Medalhas,Função\n";
  
  state.users.forEach(user => {
    const badgeCount = user.badges ? user.badges.length : 0;
    csvContent += `"${user.name}","${user.email}",${user.xp},${badgeCount},"${user.role}"\n`;
  });
  
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `emmanuel_educa_alunos_${getTimestamp().replace(/[: ]/g, '_')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  addLog("Admin exportou a planilha de usuários cadastrados.");
};

// 17. Perfil e Outros Controles
function renderProfileBadges() {
  const container = document.getElementById('profile-badges-grid');
  if (!container || !state.currentUser) return;
  
  container.innerHTML = '';
  
  badgesData.forEach(badge => {
    const isUnlocked = state.currentUser.badges.includes(badge.id);
    const card = document.createElement('div');
    card.className = `badge-card ${isUnlocked ? 'unlocked' : ''}`;
    card.style.setProperty('--badge-color', badge.color);
    const rgb = hexToRgb(badge.color);
    card.style.setProperty('--badge-color-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
    
    card.innerHTML = `
      <div class="badge-card-icon"><i class="${badge.icon}"></i></div>
      <div class="badge-card-info">
        <p class="badge-card-name">${badge.name}</p>
        <p class="badge-card-desc">${badge.description}</p>
      </div>
    `;
    container.appendChild(card);
  });
}

// Resetar Conta (Estudante)
document.getElementById('btn-profile-reset').onclick = () => {
  if (confirm("ATENÇÃO: Você perderá todo seu progresso, XP e Medalhas acumuladas! Continuar?")) {
    sounds.error();
    state.currentUser.xp = 0;
    state.currentUser.completed = [];
    state.currentUser.badges = [];
    state.currentUser.roadmap = [];
    
    const dbUser = state.users.find(u => u.email === state.currentUser.email);
    if (dbUser) {
      dbUser.xp = 0;
      dbUser.completed = [];
      dbUser.badges = [];
      dbUser.roadmap = [];
    }
    saveDatabase();
    
    updateUIProgress();
    renderLanguages();
    setupRoadmap();
    renderLeaderboard();
    
    showToast("Seus dados de progresso foram resetados.", "#ef4444");
    addLog(`Usuário [${state.currentUser.name}] resetou o próprio progresso.`);
  }
};

// 18. Utilitários Globais Auxiliares
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 255, b: 135 };
}

function getTimestamp() {
  const now = new Date();
  return now.toLocaleTimeString('pt-BR') + ' ' + now.toLocaleDateString('pt-BR');
}

function showToast(message, color = '#00ff87') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = 'position:fixed; bottom:30px; left:30px; z-index:999; display:flex; flex-direction:column; gap:10px; pointer-events:none;';
    document.body.appendChild(container);
  }
  
  const toast = document.createElement('div');
  toast.style.cssText = `
    background: rgba(12, 15, 20, 0.95);
    border: 1px solid ${color};
    box-shadow: 0 0 15px ${color}50;
    color: white;
    padding: 14px 20px;
    border-radius: 10px;
    font-size: 0.8rem;
    font-family: 'Orbitron', sans-serif;
    animation: toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1), fadeOut 0.4s ease-out 4.5s forwards;
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 600;
  `;
  toast.innerHTML = `<i class="fas fa-info-circle" style="color:${color}"></i> ${message}`;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 5000);
}

function triggerConfettiExplosion() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#00ff87', '#10b981', '#34d399', '#ffffff', '#fbbf24']
    });
  }
}
