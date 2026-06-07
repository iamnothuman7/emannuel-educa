# Emmanuel Educa 🚀🟢

**Emmanuel Educa** é uma plataforma interativa de ensino de programação projetada para crianças (a partir de 10 anos) e iniciantes de todas as idades. O projeto possui um visual de ficção científica ("Cyber-Edu") com fundo preto e detalhes em verde neon/esmeralda, focado em alta interatividade e gamificação.

## 🌟 Principais Recursos

1. **Almanaque de Programação**: Catálogo detalhado com 12 linguagens principais (Scratch, Python, HTML/CSS, JavaScript, C#, Java, Swift, Kotlin, SQL, Rust, R e Go). Cada linguagem é explicada com analogias simples do dia a dia (ex: variáveis como caixas de brinquedo), exemplos de código, fatos curiosos e instruções de como instalar e rodar localmente.
2. **Playground Interativo**: Um editor em tempo real onde é possível programar em **JavaScript** e **HTML/CSS** e ver o resultado imediato na tela, incluindo captura de saídas do console diretamente no terminal estilizado da plataforma.
3. **Roadmap do Futuro**: Roteiro visual e interativo contendo etapas de desenvolvimento (Web, Jogos, Dados, Sistemas) onde o progresso pode ser marcado para acumular XP.
4. **Arena do Quiz**: Um jogo de perguntas e respostas gamificado com feedback imediato explicativo de cada questão. O quiz calcula a pontuação e dá XP ao jogador.
5. **Medalhas e Conquistas (Badges)**: Sistema automático que desbloqueia medalhas específicas com base no seu progresso e pontuação do Quiz. Seu progresso fica salvo localmente (`localStorage`).
6. **Efeitos Sonoros Retrô (8-Bit)**: Sons espaciais interativos sintetizados diretamente no navegador via **Web Audio API** (sem necessidade de arquivos de áudio externos pesados) que tocam ao responder ao Quiz, ganhar XP ou avançar fases.
7. **Emmanuel AI**: Chatbot interativo simulando um robô ajudante para responder perguntas frequentes e indicar caminhos.

## 🛠️ Tecnologias Utilizadas

- **HTML5** (Estrutura semântica e acessível)
- **CSS3** (Variáveis CSS, animações personalizadas de neon, Grid/Flexbox e glassmorphism)
- **JavaScript ES6+** (Orientado a estados, lógica dinâmica, manipulação do DOM e Web Audio API)
- **canvas-confetti** (Biblioteca externa via CDN para efeitos visuais nas vitórias)
- **FontAwesome** (Ícones vetoriais modernos)

## 📂 Estrutura do Projeto

```text
├── index.html          # Ponto de entrada e estrutura da aplicação
├── css/
│   └── style.css       # Estilização completa e responsiva
├── js/
│   ├── languages.js    # Banco de dados de lições de cada linguagem
│   ├── quiz.js         # Perguntas e lógica de conquistas
│   └── app.js          # Inicialização, som, lógica de abas e playground
└── README.md           # Documentação do projeto
```

## 🚀 Como Executar Localmente

Como a plataforma foi feita em **Front-end Puro**, você não precisa instalar nenhuma ferramenta de servidor complexa para testar!

1. Baixe a pasta do projeto.
2. Abra a pasta no **VS Code**.
3. Use a extensão **Live Server** (clique com botão direito em `index.html` e selecione *Open with Live Server*) ou apenas dê um duplo clique no arquivo `index.html` para abrir diretamente no seu navegador de preferência!

---
Desenvolvido com carinho para inspirar a próxima geração de engenheiros de software galácticos! 💫
