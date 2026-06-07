// Banco de dados e lógica de conquistas para a Arena do Quiz
const quizQuestions = [
  {
    id: 1,
    question: "O que é uma 'Variável' na programação?",
    options: [
      "Uma caixa com nome para guardar informações que podem mudar.",
      "Um monstro espacial que ataca o código.",
      "Um tipo de computador super rápido.",
      "A tomada onde ligamos o computador."
    ],
    answer: 0,
    explanation: "Uma variável é como uma caixinha com etiqueta! Você dá um nome para ela (como 'pontos' ou 'nome_do_heroi') e guarda um valor dentro. Depois você pode ler ou mudar o que está lá dentro!"
  },
  {
    id: 2,
    question: "Para que serve a linguagem CSS?",
    options: [
      "Para ligar o computador e carregar o sistema.",
      "Para deixar o site bonito, com cores, estilos e efeitos neon.",
      "Para fazer cálculos de matemática hiper complexos.",
      "Para consertar a internet quando ela cai."
    ],
    answer: 1,
    explanation: "Se o HTML é o esqueleto da página, o CSS é a roupa elegante! É ele quem pinta os botões de verde neon, adiciona sombras brilhantes e arruma as coisas para ficarem bonitas na tela."
  },
  {
    id: 3,
    question: "Se você quer criar jogos usando a Unity (como Among Us e Cuphead), qual linguagem você deve aprender?",
    options: [
      "Scratch",
      "SQL",
      "C# (C-Sharp)",
      "HTML"
    ],
    answer: 2,
    explanation: "A Unity usa a linguagem C# como seu cérebro! Ela é super organizada e permite comandar a física, os movimentos, a gravidade e a inteligência dos inimigos no seu jogo 3D ou 2D."
  },
  {
    id: 4,
    question: "Qual jogo super famoso foi criado originalmente usando a linguagem Java?",
    options: [
      "Minecraft",
      "Roblox",
      "Super Mario",
      "Fortnite"
    ],
    answer: 0,
    explanation: "O Minecraft original para computador (Java Edition) foi criado todinho em Java! É por isso que os desenvolvedores conseguem criar Mods tão fantásticos para ele, mudando os arquivos Java do jogo."
  },
  {
    id: 5,
    question: "O Scratch é muito famoso por ensinar programação. Como ele funciona?",
    options: [
      "Você precisa digitar centenas de códigos difíceis em inglês.",
      "Ele funciona apenas por comandos de voz.",
      "Você arrasta e encaixa blocos coloridos como blocos de LEGO.",
      "Ele é um jogo de corrida onde você programa carros de verdade."
    ],
    answer: 2,
    explanation: "No Scratch você não precisa digitar nada! Você só arrasta blocos lógicos coloridos que se encaixam perfeitamente, o que ajuda muito a treinar a mente para pensar como programador."
  },
  {
    id: 6,
    question: "O que é um 'Loop' (ou laço de repetição) na programação?",
    options: [
      "Um botão de desligar o computador.",
      "Um comando que faz uma instrução se repetir várias vezes automaticamente.",
      "Uma falha no computador que faz ele pegar fogo.",
      "O som de clique do mouse."
    ],
    answer: 1,
    explanation: "Um Loop serve para você não precisar digitar o mesmo código 100 vezes! Com ele, você diz: 'Repita este passo 10 vezes' e o computador faz isso em um piscar de olhos."
  },
  {
    id: 7,
    question: "Qual dessas linguagens foi criada pelo Google e usa um esquilo fofo (Gopher) como mascote?",
    options: [
      "Python",
      "Rust",
      "Go (Golang)",
      "Swift"
    ],
    answer: 2,
    explanation: "A linguagem Go foi desenvolvida pelo Google para ser ultra-rápida. O mascote dela é o Gopher, um esquilo terrestre super fofo de óculos de proteção azul!"
  },
  {
    id: 8,
    question: "O que significa 'SQL' e para que serve?",
    options: [
      "Serve para criar animações em 3D de alta qualidade.",
      "Significa 'Sistema de Quebrar Links' e serve para derrubar sites.",
      "Serve para conversar com bancos de dados e pedir informações organizadas.",
      "É um jogo online sobre digitação rápida."
    ],
    answer: 3, // Wait, options is 0-indexed. Option 0: box, Option 1: styles, Option 2: C#, Option 3: Minecraft, Option 4: lego, Option 5: Loop, Option 6: Go, Option 7: SQL. Let's fix this index to 2!
  },
  {
    id: 9,
    question: "Se você quer criar aplicativos para celulares iPhone da Apple, qual linguagem é a ideal?",
    options: [
      "Kotlin",
      "Swift",
      "SQL",
      "R"
    ],
    answer: 1,
    explanation: "O Swift é a linguagem moderna oficial criada pela Apple! Ela é rápida, segura e perfeita para desenhar apps elegantes que rodam no iPhone, iPad, Apple Watch e Mac."
  },
  {
    id: 10,
    question: "O que é um 'Bug' na programação?",
    options: [
      "Um erro ou falha no código que faz o programa funcionar de forma errada.",
      "Uma peça de metal dentro do teclado.",
      "O nome da tela quando o computador está desligado.",
      "Um vírus alienígena super perigoso."
    ],
    answer: 0,
    explanation: "Um Bug é um erro no código! O termo ficou famoso quando uma mariposa de verdade entrou em um computador gigante nos anos 40 e travou o sistema. Hoje em dia, achar e consertar bugs é o superpoder de todo programador (processo chamado de 'debugging' ou depuração)!"
  }
];

// Corrigindo a pergunta 8 que ficou com a resposta de index 3 erroneamente. 
// A opção correta "Serve para conversar com bancos de dados..." está no índice 2.
quizQuestions[7].answer = 2;

const badgesData = [
  {
    id: 'badge_rookie',
    name: 'Cadete Espacial 🚀',
    description: 'Acerte pelo menos 3 perguntas no quiz para começar sua jornada cósmica.',
    requirement: (score) => score >= 3,
    icon: 'fas fa-rocket',
    color: '#00ff87'
  },
  {
    id: 'badge_coder',
    name: 'Dev Iniciante 💻',
    description: 'Acerte pelo menos 6 perguntas e domine os conceitos básicos.',
    requirement: (score) => score >= 6,
    icon: 'fas fa-code',
    color: '#3b82f6'
  },
  {
    id: 'badge_wizard',
    name: 'Mago dos Códigos 🧙‍♂️',
    description: 'Acerte 9 perguntas e mostre que você domina as artes mágicas das linguagens.',
    requirement: (score) => score >= 9,
    icon: 'fas fa-magic',
    color: '#a855f7'
  },
  {
    id: 'badge_emmanuel_god',
    name: 'Lenda Emmanuel Educa 👑',
    description: 'Gabarite o Quiz com 10/10 e consiga o título máximo da plataforma!',
    requirement: (score) => score === 10,
    icon: 'fas fa-crown',
    color: '#fbbf24'
  }
];

// Exporta se estiver em ambiente Node/CommonJS (para testes caso necessário) ou anexa na window
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { quizQuestions, badgesData };
}
