// Emmanuel Educa - Core Logic & Gamification Engine

// 1. Estado Global do Aplicativo
const state = {
  xp: 0,
  completedLanguages: [],
  unlockedBadges: [],
  currentTab: 'aprender',
  quiz: {
    currentQuestionIndex: 0,
    score: 0,
    answers: [],
    completed: false
  },
  roadmapCompleted: [],
  soundsEnabled: true
};

// 2. Sintetizador de Efeitos Sonoros 8-Bit (Web Audio API)
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
      
      time += duration * 0.8; // Transição suave entre notas
    });
  } catch (e) {
    console.warn("Falha ao tocar som: ", e);
  }
}

// Efeitos Sonoros Específicos
const sounds = {
  click: () => playTone([440, 880], [0.05, 0.05], 'triangle', 0.06),
  success: () => playTone([523.25, 659.25, 783.99, 1046.50], [0.08, 0.08, 0.08, 0.15], 'sine', 0.08),
  error: () => playTone([220, 147], [0.15, 0.2], 'sawtooth', 0.06),
  badge: () => playTone([392, 523.25, 659.25, 783.99, 987.77, 1046.50], [0.1, 0.1, 0.1, 0.1, 0.1, 0.3], 'sine', 0.1),
  levelUp: () => playTone([261.63, 329.63, 392, 523.25, 659.25, 783.99, 1046.50, 1318.51], [0.07, 0.07, 0.07, 0.07, 0.07, 0.07, 0.07, 0.25], 'sine', 0.09)
};

// 3. Inicialização ao Carregar a Página
document.addEventListener('DOMContentLoaded', () => {
  loadProgress();
  setupNavigation();
  renderLanguages();
  setupFiltersAndSearch();
  setupPlayground();
  setupRoadmap();
  setupGlossary();
  setupChatbot();
  updateUIProgress();
  
  // Registrar cliques globais para inicializar contexto de áudio (política do navegador)
  document.body.addEventListener('click', () => {
    initAudio();
  }, { once: true });
});

// 4. Salvar & Carregar Progresso (LocalStorage)
function saveProgress() {
  localStorage.setItem('emmanuel_educa_xp', state.xp);
  localStorage.setItem('emmanuel_educa_completed', JSON.stringify(state.completedLanguages));
  localStorage.setItem('emmanuel_educa_badges', JSON.stringify(state.unlockedBadges));
  localStorage.setItem('emmanuel_educa_roadmap', JSON.stringify(state.roadmapCompleted));
}

function loadProgress() {
  state.xp = parseInt(localStorage.getItem('emmanuel_educa_xp')) || 0;
  state.completedLanguages = JSON.parse(localStorage.getItem('emmanuel_educa_completed')) || [];
  state.unlockedBadges = JSON.parse(localStorage.getItem('emmanuel_educa_badges')) || [];
  state.roadmapCompleted = JSON.parse(localStorage.getItem('emmanuel_educa_roadmap')) || [];
}

function updateUIProgress() {
  // Atualiza XP no HUD
  const xpCount = document.getElementById('hud-xp-count');
  const xpBar = document.getElementById('hud-xp-bar');
  if (xpCount && xpBar) {
    xpCount.innerText = `${state.xp} XP`;
    // Cada nível tem 100 XP. Progresso do nível atual é o resto da divisão por 100
    const levelXp = state.xp % 100;
    xpBar.style.width = `${levelXp}%`;
    document.getElementById('hud-level-label').innerText = `NÍVEL ${Math.floor(state.xp / 100) + 1}`;
  }
  
  // Atualiza contagem de medalhas/badges
  const badgeCount = document.getElementById('hud-badge-count');
  if (badgeCount) {
    badgeCount.innerText = `${state.unlockedBadges.length} Medalhas`;
  }
}

function addXP(amount) {
  const oldLevel = Math.floor(state.xp / 100);
  state.xp += amount;
  const newLevel = Math.floor(state.xp / 100);
  
  updateUIProgress();
  saveProgress();
  
  if (newLevel > oldLevel) {
    sounds.levelUp();
    showToast(`🚀 LEVEL UP! Você alcançou o Nível ${newLevel + 1}!`, '#00ff87');
    triggerConfettiExplosion();
  }
}

// 5. Navegação por Abas (SPA)
function setupNavigation() {
  const buttons = document.querySelectorAll('.nav-btn');
  const sections = document.querySelectorAll('.section');
  
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      sounds.click();
      
      buttons.forEach(b => b.classList.remove('active'));
      sections.forEach(s => s.classList.remove('active'));
      
      btn.classList.add('active');
      const targetSection = document.getElementById(`section-${tabId}`);
      if (targetSection) {
        targetSection.classList.add('active');
      }
      
      state.currentTab = tabId;
      
      // Inicializar lógicas de aba ao entrar
      if (tabId === 'quiz') {
        initQuiz();
      }
    });
  });
}

// 6. Catálogo de Linguagens (Renderização e Filtros)
function renderLanguages(filterCat = 'all', searchQuery = '') {
  const grid = document.getElementById('languages-grid');
  if (!grid) return;
  
  grid.innerHTML = '';
  
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
    card.className = 'lang-card';
    card.style.setProperty('--card-color', lang.color);
    // Converter cor Hex para RGB para usar opacidades no CSS
    const rgb = hexToRgb(lang.color);
    card.style.setProperty('--card-color-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
    
    // Nível de dificuldade em bolinhas
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

// 7. Modal de Detalhes da Linguagem
function openLanguageModal(lang) {
  const modal = document.getElementById('lang-modal');
  if (!modal) return;
  
  const rgb = hexToRgb(lang.color);
  modal.style.setProperty('--card-color', lang.color);
  modal.style.setProperty('--card-color-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
  
  // Preencher banner do modal
  document.getElementById('modal-icon').className = lang.icon + ' modal-banner-icon';
  document.getElementById('modal-title').innerText = lang.name;
  document.getElementById('modal-diff-badge').innerText = `Dificuldade: ${lang.difficulty}`;
  
  // Preencher conteúdo didático
  document.getElementById('modal-analogy').innerText = lang.analogy;
  document.getElementById('modal-what-does').innerText = lang.whatItDoes;
  document.getElementById('modal-cool-fact').innerText = lang.coolFact;
  
  // Como rodar no PC
  const stepsList = document.getElementById('modal-steps');
  stepsList.innerHTML = '';
  lang.howToRunLocal.forEach((step, idx) => {
    const li = document.createElement('li');
    li.className = 'step-item';
    li.innerHTML = `
      <span class="step-num">${idx + 1}</span>
      <p>${step}</p>
    `;
    stepsList.appendChild(li);
  });
  
  // Exemplo de código
  const codeBox = document.getElementById('modal-code-box');
  codeBox.textContent = lang.codeExample;
  
  // Projeto prático sugerido
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
  
  // Configurar botão de teste no Playground
  const runBtn = document.getElementById('modal-btn-run');
  if (runBtn) {
    runBtn.style.display = (lang.id === 'javascript' || lang.id === 'html-css') ? 'flex' : 'none';
    runBtn.onclick = () => {
      sounds.click();
      closeLanguageModal();
      goToPlayground(lang.id);
    };
  }
  
  // Ganha 5 XP por abrir e ler a linguagem (apenas a primeira vez por seção para evitar farm)
  if (!state.completedLanguages.includes(lang.id)) {
    state.completedLanguages.push(lang.id);
    addXP(15);
    saveProgress();
  }
  
  modal.style.display = 'flex';
}

function closeLanguageModal() {
  const modal = document.getElementById('lang-modal');
  if (modal) modal.style.display = 'none';
}

// Configurar botões de fechar modal
document.getElementById('modal-close-btn').addEventListener('click', () => {
  sounds.click();
  closeLanguageModal();
});
document.getElementById('lang-modal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('lang-modal')) {
    closeLanguageModal();
  }
});

// 8. Editor e Playground Interativo
const playgroundTemplates = {
  'javascript': `// Robô Dançarino! 🤖⚡
// Digite código JavaScript aqui e clique em "Executar Código"

function dancar() {
  console.log("Robô dá um passo para a esquerda... 🕺");
  console.log("Robô dá um giro estelar! 💫");
  console.log("Bip bop! Dança concluída com sucesso!");
}

dancar();`,
  'html-css': `<!-- Crie seu Botão Mágico Galáctico! -->
<div class="painel">
  <h2>Emmanuel Educa 🚀</h2>
  <p>Passe o mouse no botão para ativar as turbinas!</p>
  <button class="botao-magico">ATIVAR PROPULSORES</button>
</div>

<style>
body {
  background: #060709;
  color: white;
  font-family: sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 90vh;
  margin: 0;
}
.painel {
  text-align: center;
  padding: 30px;
  border: 2px solid #00ff87;
  border-radius: 16px;
  box-shadow: 0 0 20px rgba(0, 255, 135, 0.2);
}
.botao-magico {
  background: transparent;
  border: 2px solid #00ff87;
  color: #00ff87;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
  border-radius: 8px;
}
.botao-magico:hover {
  background: #00ff87;
  color: #000;
  box-shadow: 0 0 20px #00ff87;
  transform: scale(1.05);
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
  
  // Trocar template baseado na seleção
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
      addXP(5); // 5 XP por rodar código
    } else if (lang === 'html-css') {
      runHtmlCssPreview(code);
      addXP(5);
    }
  });
}

function goToPlayground(langId) {
  // Ativa a aba playground
  const playBtn = document.querySelector('.nav-btn[data-tab="playground"]');
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
  
  // Redireciona temporariamente o console.log para capturar outputs
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
    // Execução segura no escopo local
    const runFn = new Function(code);
    runFn();
  } catch (err) {
    logs.push('❌ ERRO DE EXECUÇÃO: ' + err.message);
  }
  
  // Restaurar consoles originais
  console.log = originalLog;
  console.warn = originalWarn;
  console.error = originalError;
  
  // Mostrar logs no terminal fake
  if (logs.length === 0) {
    terminal.textContent = '// Código executado com sucesso, mas nada foi impresso no console.\nDica: Use console.log("sua mensagem") para ver o texto aqui!';
  } else {
    terminal.textContent = logs.join('\n');
  }
}

function runHtmlCssPreview(code) {
  const iframe = document.getElementById('play-iframe');
  iframe.srcdoc = code;
}

// 9. Arena de Quiz Gamificado
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
  
  // Atualiza cabeçalho
  document.getElementById('quiz-current-num').innerText = qIndex + 1;
  document.getElementById('quiz-total-num').innerText = quizQuestions.length;
  document.getElementById('quiz-score-val').innerText = state.quiz.score * 10;
  
  // Barra de progresso
  const progressPercent = ((qIndex) / quizQuestions.length) * 100;
  document.getElementById('quiz-progress').style.width = `${progressPercent}%`;
  
  // Questão e Opções
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
  
  // Esconder explicação e botão avançar
  document.getElementById('quiz-feedback-box').classList.remove('show');
  document.getElementById('quiz-btn-next').style.display = 'none';
}

function selectQuizOption(selectedIdx) {
  const qIndex = state.quiz.currentQuestionIndex;
  const qData = quizQuestions[qIndex];
  
  const options = document.querySelectorAll('.quiz-option');
  
  // Desabilitar todas as opções após escolha
  options.forEach(opt => opt.style.pointerEvents = 'none');
  
  const isCorrect = (selectedIdx === qData.answer);
  
  // Estilizar opção selecionada e a correta
  options[selectedIdx].classList.add(isCorrect ? 'correct' : 'wrong');
  if (!isCorrect) {
    options[qData.answer].classList.add('correct');
    sounds.error();
  } else {
    state.quiz.score++;
    sounds.success();
  }
  
  // Mostrar bloco explicativo
  const feedbackBox = document.getElementById('quiz-feedback-box');
  const feedbackTitle = document.getElementById('quiz-feedback-title');
  const feedbackText = document.getElementById('quiz-feedback-text');
  
  feedbackTitle.innerText = isCorrect ? '🌟 RESPOSTA EXCELENTE!' : '🔥 QUASE LÁ!';
  feedbackTitle.className = `feedback-title ${isCorrect ? 'success' : 'error'}`;
  feedbackText.innerText = qData.explanation;
  feedbackBox.classList.add('show');
  
  // Configurar botão de Avançar/Terminar
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
  const finalScoreXP = finalScore * 15; // 15 XP por resposta correta
  
  addXP(finalScoreXP);
  
  document.getElementById('results-score-val').innerText = `${finalScore}/${quizQuestions.length}`;
  document.getElementById('results-xp-earned').innerText = `Você ganhou +${finalScoreXP} XP!`;
  
  // Mensagem final fofa baseada no desempenho
  let msg = '';
  if (finalScore === 10) {
    msg = 'Perfeito! Você provou ser um hacker supremo do Emmanuel Educa! Todas as respostas estão corretas! 👑🌌';
  } else if (finalScore >= 7) {
    msg = 'Sensacional! Você já entende muito sobre o mundo tecnológico e está pronto para criar seus primeiros programas! 🚀🟢';
  } else if (finalScore >= 4) {
    msg = 'Muito bom! Você está pegando o jeito. Que tal dar mais uma lida nos resumos das linguagens para gabaritar? 📚✨';
  } else {
    msg = 'O início da jornada é sempre um desafio! Continue lendo os resumos e tentando de novo. Você vai longe! 💪🎮';
  }
  document.getElementById('results-msg-text').innerText = msg;
  
  // Processar desbloqueio de medalhas
  const badgesGrid = document.getElementById('results-badges');
  badgesGrid.innerHTML = '';
  
  let newBadgesUnlocked = false;
  
  badgesData.forEach(badge => {
    const isUnlocked = badge.requirement(finalScore);
    const alreadyHad = state.unlockedBadges.includes(badge.id);
    
    if (isUnlocked && !alreadyHad) {
      state.unlockedBadges.push(badge.id);
      newBadgesUnlocked = true;
    }
    
    const hasBadgeNow = state.unlockedBadges.includes(badge.id);
    
    const badgeCard = document.createElement('div');
    badgeCard.className = `badge-card ${hasBadgeNow ? 'unlocked' : ''}`;
    badgeCard.style.setProperty('--badge-color', badge.color);
    const rgb = hexToRgb(badge.color);
    badgeCard.style.setProperty('--badge-color-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
    
    badgeCard.innerHTML = `
      <div class="badge-card-icon"><i class="${badge.icon}"></i></div>
      <div class="badge-card-info">
        <p class="badge-card-name">${badge.name}</p>
        <p class="badge-card-desc">${badge.description}</p>
      </div>
    `;
    
    badgesGrid.appendChild(badgeCard);
  });
  
  saveProgress();
  updateUIProgress();
  
  if (newBadgesUnlocked || finalScore === 10) {
    sounds.badge();
    triggerConfettiExplosion();
    showToast("🏅 Nova Medalha desbloqueada e guardada no seu perfil!", "#fbbf24");
  } else {
    sounds.levelUp();
  }
  
  document.getElementById('quiz-btn-restart').onclick = () => {
    sounds.click();
    initQuiz();
  };
}

// 10. Roadmap do Futuro
const roadmapMilestones = [
  { id: 'rm_1', title: 'Aprender Lógica Básica', xp: 20, desc: 'Entender variáveis, condicionais e loops jogando Scratch.', languages: ['Scratch'] },
  { id: 'rm_2', title: 'Estilizar Sua Primeira Página', xp: 25, desc: 'Criar um site com sua cara usando HTML estruturado e estilo CSS neon.', languages: ['HTML & CSS'] },
  { id: 'rm_3', title: 'Dar Vida a Elementos Web', xp: 30, desc: 'Usar JavaScript para fazer botões mágicos e calculadoras interativas.', languages: ['JavaScript'] },
  { id: 'rm_4', title: 'Aventurar-se no Back-End', xp: 35, desc: 'Aprender Python para criar lógicas inteligentes de servidores.', languages: ['Python', 'Go'] },
  { id: 'rm_5', title: 'Aprender a Organizar Dados', xp: 40, desc: 'Conversar com bancos de dados usando SQL para salvar seus itens de jogo.', languages: ['SQL', 'R'] },
  { id: 'rm_6', title: 'Criar Apps e Jogos 3D', xp: 50, desc: 'Desenvolver para celulares ou criar games avançados com C# na Unity.', languages: ['C#', 'Java', 'Swift', 'Kotlin'] }
];

function setupRoadmap() {
  const container = document.getElementById('roadmap-list');
  if (!container) return;
  
  container.innerHTML = '';
  
  roadmapMilestones.forEach((stone, index) => {
    const isCompleted = state.roadmapCompleted.includes(stone.id);
    
    const stepEl = document.createElement('div');
    stepEl.className = `roadmap-step ${isCompleted ? 'active' : ''}`;
    
    let langBadges = stone.languages.map(l => `<span class="roadmap-lang-badge">${l}</span>`).join('');
    
    stepEl.innerHTML = `
      <div class="roadmap-icon-node ${isCompleted ? 'completed' : ''}" id="node-${stone.id}">
        <i class="fas ${isCompleted ? 'fa-check' : 'fa-lock'}"></i>
      </div>
      <div class="roadmap-content">
        <span class="roadmap-step-num">ETAPA 0${index + 1} • +${stone.xp} XP</span>
        <h3>${stone.title}</h3>
        <p>${stone.desc}</p>
        <div class="roadmap-badges-list">
          ${langBadges}
        </div>
      </div>
    `;
    
    // Clique para marcar como concluído
    const content = stepEl.querySelector('.roadmap-content');
    const node = stepEl.querySelector('.roadmap-icon-node');
    
    const toggleNode = () => {
      initAudio();
      const alreadyDone = state.roadmapCompleted.includes(stone.id);
      
      if (!alreadyDone) {
        state.roadmapCompleted.push(stone.id);
        stepEl.classList.add('active');
        node.classList.add('completed');
        node.querySelector('i').className = 'fas fa-check';
        sounds.success();
        addXP(stone.xp);
        showToast(`✅ Concluiu a Etapa: ${stone.title}! +${stone.xp} XP`, '#00ff87');
      } else {
        // Remover do progresso
        state.roadmapCompleted = state.roadmapCompleted.filter(id => id !== stone.id);
        stepEl.classList.remove('active');
        node.classList.remove('completed');
        node.querySelector('i').className = 'fas fa-lock';
        sounds.error();
        // Remove o XP correspondente
        state.xp = Math.max(0, state.xp - stone.xp);
        updateUIProgress();
        saveProgress();
      }
      saveProgress();
    };
    
    content.addEventListener('click', toggleNode);
    node.addEventListener('click', toggleNode);
    
    container.appendChild(stepEl);
  });
}

// 11. Glossário Hacker
const glossaryData = [
  { term: 'Algoritmo', desc: 'É como uma receita de bolo passo a passo! Diz ao computador exatamente quais ingredientes usar e a ordem de preparo.' },
  { term: 'API', desc: 'Como o garçom de um restaurante! Ele pega seu pedido de dados, leva até a cozinha (servidor) e traz a comida (informações) de volta.' },
  { term: 'Array / Vetor', desc: 'Uma gaveta organizada com divisórias, onde você pode empilhar vários itens parecidos com etiquetas numéricas.' },
  { term: 'Banco de Dados', desc: 'Uma pasta gigante e super organizada de arquivos eletrônicos onde salvamos informações sem perdê-las.' },
  { term: 'Bug / Inseto', desc: 'Um pequeno erro chato que se escondeu no meio do seu código e faz o computador se comportar de forma engraçada ou travar.' },
  { term: 'Compilar', desc: 'A tradução do código humano (como Python) para a linguagem secreta binária dos computadores (010101).' },
  { term: 'Console / Terminal', desc: 'Uma telinha preta mágica onde os desenvolvedores digitam feitiços diretos e leem o que o sistema responde.' },
  { term: 'Framework', desc: 'Um kit de construção de LEGO que já vem com pedaços grandes de casas e pontes montados para você não precisar começar do absoluto zero.' },
  { term: 'Função', desc: 'Uma maquininha onde você coloca um ingrediente, ela roda um processamento rápido e te devolve um produto pronto (ex: soma de números).' },
  { term: 'Hacker', desc: 'Um explorador digital super curioso e inteligente que adora entender como sistemas funcionam por dentro e criar soluções.' },
  { term: 'HTML', desc: 'O esqueleto de um site de internet! Ele cuida de dizer onde ficam os textos, as caixas de imagens e os botões.' },
  { term: 'Loop / Laço', desc: 'Fazer o computador rodar a mesma atividade várias vezes. Como o refrão da sua música favorita que repete até cansar.' },
  { term: 'Null / Nulo', desc: 'Significa que a variável está totalmente vazia. Não tem zero, não tem texto, é apenas um vácuo absoluto.' },
  { term: 'Open Source', desc: 'Código aberto! Significa que o criador do programa deixou a receita de graça para que qualquer pessoa do mundo possa ajudar a melhorar.' },
  { term: 'Servidor', desc: 'Um computador super forte que fica ligado o dia inteiro em um prédio especial para alimentar sites e jogos no planeta inteiro.' },
  { term: 'String / Texto', desc: 'Uma corrente formada de letras e caracteres de texto. Toda String fica entre aspas, tipo "Olá, Mundo!".' }
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
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 20px; color: var(--text-muted)">
          Nenhum termo encontrado.
        </div>
      `;
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
    searchInput.addEventListener('input', (e) => {
      renderList(e.target.value);
    });
  }
  
  renderList();
}

// 12. Chatbot Ajudante (Emmanuel AI)
const botResponses = {
  'olá': 'Bip Bop! Olá, futuro programador! Eu sou o Robo-Emmanuel, o robô conselheiro da plataforma. Qual a sua dúvida sobre códigos hoje?',
  'ola': 'Bip Bop! Olá, futuro programador! Eu sou o Robo-Emmanuel, o robô conselheiro da plataforma. Qual a sua dúvida sobre códigos hoje?',
  'como comecar': 'A melhor forma de começar é jogando no Scratch! Ele ensina a montar ideias lógicas usando blocos coloridos, sem que você precise se preocupar com digitação.',
  'como começar': 'A melhor forma de começar é jogando no Scratch! Ele ensina a montar ideias lógicas usando blocos coloridos, sem que você precise se preocupar com digitação.',
  'o que e python': 'O Python é uma das linguagens mais fáceis e poderosas do planeta! Ele parece muito com inglês escrito e é a linguagem principal de criação de Inteligências Artificiais e robôs inteligentes.',
  'o que é python': 'O Python é uma das linguagens mais fáceis e poderosas do planeta! Ele parece muito com inglês escrito e é a linguagem principal de criação de Inteligências Artificiais e robôs inteligentes.',
  'criar jogos': 'Para criar jogos profissionais em 3D, a melhor escolha é aprender a linguagem C# (C-Sharp) para programar usando a Unity. Muitos jogos famosos que você conhece usam essa dupla dinâmica!',
  'criar sites': 'Para criar seus sites estilosos, o caminho clássico e mais divertido é aprender a trilha de ouro da Web: HTML para a estrutura, CSS para as cores e JavaScript para fazer tudo mexer e brilhar!',
  'ajuda': 'Estou aqui para ajudar! Você pode me perguntar coisas como: "Como começar?", "Como criar jogos?", "O que é Python?" ou "Como criar sites?".'
};

function setupChatbot() {
  const history = document.getElementById('chat-history');
  const input = document.getElementById('chat-input');
  const btnSend = document.getElementById('chat-btn-send');
  const suggestions = document.querySelectorAll('.suggestion-chip');
  
  if (!history || !input || !btnSend) return;
  
  const sendMessage = (text) => {
    if (!text.trim()) return;
    
    // Mensagem do Usuário
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-message user';
    userMsg.textContent = text;
    history.appendChild(userMsg);
    
    history.scrollTop = history.scrollHeight;
    input.value = '';
    
    sounds.click();
    
    // Resposta do Robô com pequeno atraso para simular inteligência
    setTimeout(() => {
      const botMsg = document.createElement('div');
      botMsg.className = 'chat-message bot';
      
      const cleanText = text.toLowerCase().trim().replace(/[?.,!]/g, "");
      let reply = 'Bip Bop... Não entendi bem esse comando de voz. Digite "ajuda" para ver quais perguntas eu sei responder!';
      
      // Procurar palavra-chave nas respostas salvas
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
    }, 600);
  };
  
  btnSend.addEventListener('click', () => {
    sendMessage(input.value);
  });
  
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage(input.value);
    }
  });
  
  suggestions.forEach(chip => {
    chip.addEventListener('click', () => {
      sendMessage(chip.innerText);
    });
  });
}

// 13. Utilitários Globais
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 255, b: 135 };
}

function showToast(message, color = '#00ff87') {
  // Cria elemento do toast se não existir
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = 'position:fixed; bottom:30px; left:30px; z-index:999; display:flex; flex-direction:column; gap:10px; pointer-events:none;';
    document.body.appendChild(container);
  }
  
  const toast = document.createElement('div');
  toast.style.cssText = `
    background: rgba(11, 14, 18, 0.95);
    border: 1px solid ${color};
    box-shadow: 0 0 15px ${color}50;
    color: white;
    padding: 14px 20px;
    border-radius: 10px;
    font-size: 0.85rem;
    font-family: 'Orbitron', sans-serif;
    animation: toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1), fadeOut 0.4s ease-out 4.5s forwards;
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 600;
  `;
  toast.innerHTML = `<i class="fas fa-info-circle" style="color:${color}"></i> ${message}`;
  
  container.appendChild(toast);
  
  // Remover do DOM após animação
  setTimeout(() => {
    toast.remove();
  }, 5000);
}

// CSS temporário para animação do toast e fadeOut
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes toastSlideIn {
    from { transform: translateX(-50px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes fadeOut {
    to { opacity: 0; transform: translateY(10px); }
  }
`;
document.head.appendChild(styleSheet);

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
