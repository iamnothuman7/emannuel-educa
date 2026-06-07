// Banco de dados de linguagens para a plataforma Emmanuel Educa
// Mescla as linguagens padrão com linguagens customizadas adicionadas pelo Admin via localStorage

const defaultLanguages = [
  {
    id: 'scratch',
    name: 'Scratch',
    icon: 'fas fa-puzzle-piece',
    color: '#FF8C1A',
    category: 'iniciante',
    categoryLabel: 'Iniciante / Jogos',
    difficulty: 'Fácil como encaixar blocos de LEGO! 🧱',
    difficultyValue: 1,
    analogy: 'O Scratch é como um grande balde de blocos de montar coloridos. Em vez de escrever palavras difíceis, você apenas junta blocos para criar comandos. Se você encaixar um bloco amarelo de "Quando clicar na bandeira" com um bloco azul de "Ande 10 passos", o seu personagem (que costuma ser um gatinho simpático) vai andar de verdade!',
    whatItDoes: 'Criar joguinhos divertidos, animações fofas e histórias interativas sem precisar digitar nenhuma linha de código difícil!',
    coolFact: 'Foi criado pelo pessoal do MIT (uma das universidades de tecnologia mais famosas do mundo) com o objetivo de ajudar crianças de qualquer idade a pensarem como programadores!',
    howToRunLocal: [
      'Acesse o site oficial: <a href="https://scratch.mit.edu" target="_blank" class="glow-link">scratch.mit.edu</a>',
      'Clique em "Criar" no menu superior.',
      'Você já pode arrastar os blocos na tela e ver o gatinho se mover na hora, direto no seu navegador!'
    ],
    codeExample: `// No Scratch não digitamos código, mas a lógica é assim:
QUANDO [Bandeira Verde] CLICADO
REPITA PARA SEMPRE:
  SE [Tecla Espaço] PRESSIONADA? ENTÃO
    MUDE O EFEITO [Cor] POR (25)
    TOQUE O SOM [Miau] ATÉ O FIM
  FIM-SE
FIM-REPITA`,
    miniProject: {
      title: 'Gatinho Arco-Íris que Mia',
      description: 'Um jogo simples onde o gatinho muda de cor e mia toda vez que você aperta a barra de espaço!',
      steps: [
        'Arraste o bloco amarelo "Quando a tecla [espaço] for pressionada".',
        'Encaixe embaixo dele o bloco roxo "Adicione 25 ao efeito cor".',
        'Adicione o bloco rosa "Toque o som [Miau] até o fim" para dar voz ao seu gatinho!',
        'Aperte a barra de espaço do teclado e veja a mágica acontecer!'
      ]
    }
  },
  {
    id: 'python',
    name: 'Python',
    icon: 'fab fa-python',
    color: '#3776AB',
    category: 'iniciante',
    categoryLabel: 'Iniciante / Inteligência Artificial',
    difficulty: 'Fácil. Escrever em Python é quase como conversar em inglês! 🐍',
    difficultyValue: 2,
    analogy: 'Imagine que o Python é uma cobra de estimação muito inteligente e obediente. Ela não gosta de enrolação! Você dá instruções para ela em linhas de texto simples e ela faz exatamente o que você pediu. Por ser muito direta e fácil de ler, é a linguagem favorita de cientistas, criadores de robôs e desenvolvedores de Inteligência Artificial.',
    whatItDoes: 'Com o Python, criamos robôs inteligentes, fazemos cálculos científicos gigantes, analisamos montanhas de dados do YouTube e criamos Inteligências Artificiais super espertas!',
    coolFact: 'O nome "Python" não foi inspirado na cobra de verdade, mas sim em um grupo de comediantes de TV muito antigo e engraçado chamado "Monty Python"!',
    howToRunLocal: [
      'Baixe o instalador no site <a href="https://www.python.org" target="_blank" class="glow-link">python.org</a> e marque a caixinha "Add Python to PATH" durante a instalação.',
      'Abra o VS Code e instale a extensão chamada "Python".',
      'Crie um arquivo chamado <code>app.py</code>, escreva <code>print("Olá, Emmanuel!")</code> e aperte o botão de "Play" para rodar.'
    ],
    codeExample: `# Um jogo de adivinhação super rápido!
import random

numero_secreto = random.randint(1, 10)
tentativa = int(input("Adivinhe o número de 1 a 10: "))

if tentativa == numero_secreto:
    print("Parabéns! Você acertou! 🎉")
else:
    print(f"Errou! O número era {numero_secreto} 😢")`,
    miniProject: {
      title: 'Gerador de Nomes de Super-Herói',
      description: 'Um programa que combina sua cor favorita e o primeiro animal que vier à sua mente para criar seu codinome de herói!',
      steps: [
        'Peça ao usuário a cor favorita dele usando <code>cor = input("Cor favorita: ")</code>.',
        'Peça o animal usando <code>animal = input("Um animal: ")</code>.',
        'Junte tudo com <code>print("Seu nome de herói é: " + cor.title() + " " + animal.title())</code>!',
        'Execute o programa e descubra se você será o "Azul Tubarão" ou o "Verde Gato"!'
      ]
    }
  },
  {
    id: 'html-css',
    name: 'HTML & CSS',
    icon: 'fab fa-html5',
    color: '#E34F26',
    category: 'web',
    categoryLabel: 'Web / Criação de Sites',
    difficulty: 'Fácil a Médio. Muito visual e divertido! 🎨',
    difficultyValue: 2,
    analogy: 'Imagine que você está criando um boneco de papel. O HTML é o esqueleto do boneco (onde ficam os braços, pernas e olhos). O CSS são as roupas, a cor do cabelo, os óculos escuros estilosos e os sapatos brilhantes! O HTML dá a estrutura e o CSS deixa tudo bonito e no estilo neon que você quiser.',
    whatItDoes: 'Desenhar a estrutura e o visual de TODAS as páginas da internet que você acessa todos os dias, incluindo o YouTube, a Netflix e este almanaque!',
    coolFact: 'O CSS foi criado para que os designers não precisassem misturar as cores e fontes no meio do texto do site, permitindo trocar o estilo de milhares de páginas mudando apenas um arquivo!',
    howToRunLocal: [
      'Abra o VS Code e crie uma pasta no seu computador.',
      'Crie um arquivo chamado <code>index.html</code> e digite <code>html:5</code> para criar a estrutura padrão.',
      'Escreva sua página e clique com o botão direito para abrir com a extensão "Live Server" no navegador!'
    ],
    codeExample: `<!-- HTML: O Esqueleto -->
<div class="cartao-heroi">
  <h1>Mega Robô 9000</h1>
  <p>Status: Ativado 🟢</p>
</div>

<!-- CSS: As Roupas (estilo neon) -->
<style>
.cartao-heroi {
  background-color: #000;
  border: 2px solid #00ff87;
  border-radius: 10px;
  box-shadow: 0 0 15px #00ff87;
  color: white;
  padding: 20px;
  font-family: sans-serif;
}
</style>`,
    miniProject: {
      title: 'Seu Próprio Cartão de Visitas Galáctico',
      description: 'Um cartão digital futurista com sua foto fictícia, seu nome e um brilho verde neon quando passa o mouse.',
      steps: [
        'Crie uma tag <code>&lt;div class="card"&gt;</code> para ser a caixa do cartão.',
        'Coloque um título <code>&lt;h2&gt;</code> com seu nome e um parágrafo com seus superpoderes.',
        'No CSS, adicione <code>border: 2px solid #10b981</code> and <code>box-shadow: 0 0 10px #10b981;</code>.',
        'Use a propriedade CSS <code>transition: 0.3s</code> e o seletor <code>.card:hover</code> para fazer o brilho aumentar quando passar o mouse!'
      ]
    }
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    icon: 'fab fa-js',
    color: '#F7DF1E',
    category: 'web',
    categoryLabel: 'Web / Jogos / Dinâmico',
    difficulty: 'Médio. Requer um pouco mais de lógica e treino! ⚡',
    difficultyValue: 3,
    analogy: 'Voltando ao exemplo do boneco de papel: se o HTML é o esqueleto e o CSS é a roupa, o JavaScript é o CÉREBRO do boneco! É ele que faz o boneco dar piruetas, soltar raios laser pelos olhos, abrir menus quando clicados e fazer as luzes da sua tela piscarem quando você ganha pontos em um jogo.',
    whatItDoes: 'Trazer vida para as páginas web! Ele é usado para fazer animações incríveis, jogos rodando direto no navegador, responder a cliques de botões e carregar mensagens novas sem precisar atualizar a página.',
    coolFact: 'O JavaScript foi criado em apenas 10 dias por um programador chamado Brendan Eich em 1995. Hoje ele é a linguagem mais popular e usada no mundo inteiro!',
    howToRunLocal: [
      'Você não precisa instalar nada! O JavaScript já vem dentro de todos os navegadores de internet (Chrome, Edge, Firefox).',
      'Em qualquer site, aperte a tecla F12 (ou clique com botão direito e vá em "Inspecionar") e clique na aba "Console".',
      'Escreva <code>alert("Olá do Console!")</code> e dê Enter para ver um alerta na tela!'
    ],
    codeExample: `// Faz um robô contar até 3 e gritar "Decolar!"
let segundos = 3;

function iniciarContagem() {
  while (segundos > 0) {
    console.log("Faltam " + segundos + " segundos...");
    segundos = segundos - 1;
  }
  console.log("🚀 DECOLAR! Rumo ao espaço!");
}

iniciarContagem();`,
    miniProject: {
      title: 'Lançador de Feitiços com Cliques',
      description: 'Um botão mágico na tela que, toda vez que clicado, faz aparecer uma palavra de feitiço aleatória e pisca a tela com cores neon!',
      steps: [
        'Crie um botão no HTML com o atributo <code>onclick="lancarFeitico()"</code>.',
        'No JS, crie uma lista (array) de feitiços como: <code>const feitiços = ["Abracadabra", "Expecto Patronum", "Alacazam"]</code>.',
        'Crie a função <code>lancarFeitico()</code> que sorteia um índice usando <code>Math.random()</code>.',
        'Use <code>document.getElementById("status").innerText</code> para mostrar o feitiço sorteado na tela!'
      ]
    }
  },
  {
    id: 'csharp',
    name: 'C# (C-Sharp)',
    icon: 'fas fa-hashtag',
    color: '#239120',
    category: 'jogos',
    categoryLabel: 'Jogos / Sistemas / 3D',
    difficulty: 'Médio a Difícil. Exige muita atenção aos detalhes! 🎮',
    difficultyValue: 4,
    analogy: 'O C# é como a cabine de comando de um parque de diversões tecnológico. Ele é extremamente organizado e segue regras muito firmes para garantir que tudo funcione rápido e sem falhas. Por ser muito poderoso e estruturado, ele é o motor principal da Unity, o programa que as pessoas usam para criar jogos 2D e 3D incríveis de videogame.',
    whatItDoes: 'Criar jogos profissionais para PC, PlayStation, Xbox e Nintendo Switch usando o motor Unity. Também é usado por grandes empresas para fazer sistemas de bancos super seguros.',
    coolFact: 'Jogos mega famosos como "Cuphead", "Hollow Knight", "Among Us", "Pokemon GO" e "Subnautica" foram todos programados usando C# dentro da Unity!',
    howToRunLocal: [
      'Baixe e instale o SDK do .NET no site oficial da Microsoft.',
      'Instale o VS Code e a extensão oficial "C#".',
      'No terminal, digite <code>dotnet new console -o MeuApp</code> e depois <code>dotnet run</code> para rodar seu primeiro programa C#.'
    ],
    codeExample: `using System;

class Jogador {
    public string Nome = "Guerreiro";
    public int Vida = 100;

    public void TomarDano(int dano) {
        Vida -= dano;
        Console.WriteLine(Nome + " levou " + dano + " de dano! Vida restante: " + Vida);
    }
}

// C# precisa de uma estrutura de classes organizada!`,
    miniProject: {
      title: 'Simulador de Combate RPG',
      description: 'Um sistema em modo texto onde seu guerreiro enfrenta um monstro e ambos trocam golpes até um deles perder toda a vida.',
      steps: [
        'Crie uma variável para a vida do Jogador (100) e outra para o Monstro (80).',
        'Use um laço <code>while</code> que roda enquanto a vida de ambos for maior que zero.',
        'Use <code>Random</code> para gerar danos aleatórios para o jogador e o monstro a cada rodada.',
        'Mostre o vencedor na tela usando <code>Console.WriteLine()</code>!'
      ]
    }
  },
  {
    id: 'java',
    name: 'Java',
    icon: 'fab fa-java',
    color: '#ED8B00',
    category: 'sistemas',
    categoryLabel: 'Sistemas / Servidores / Android',
    difficulty: 'Médio a Difícil. Escreve-se bastante código para tarefas simples. ☕',
    difficultyValue: 4,
    analogy: 'O Java é como um grande engenheiro de fábrica que gosta de tudo etiquetado, testado e documentado em três vias! Ele é bem exigente e te faz escrever bastante texto, mas faz isso por um ótimo motivo: o código Java roda exatamente igual em qualquer máquina do mundo, seja no seu computador, em um celular Android ou até em um micro-ondas inteligente!',
    whatItDoes: 'Criar aplicativos de celulares Android, controlar sistemas bancários gigantescos que lidam com milhões de transações e rodar servidores gigantes de internet.',
    coolFact: 'O jogo "Minecraft" original de PC foi programado em Java! Foi graças a essa linguagem que as pessoas conseguiram criar os famosos "Mods", modificando as regras do jogo facilmente.',
    howToRunLocal: [
      'Baixe e instale o JDK (Java Development Kit) no site da Oracle ou escolha a versão livre OpenJDK.',
      'Configure as variáveis de ambiente (PATH) do seu computador.',
      'Crie um arquivo <code>Main.java</code> com uma classe de mesmo nome, compile com <code>javac Main.java</code> e rode com <code>java Main</code>.'
    ],
    codeExample: `public class Main {
    public static void main(String[] args) {
        String bloco = "Diamante";
        int quantidade = 64;
        
        System.out.println("Você coletou um pack de: " + bloco);
        System.out.println("Total de blocos: " + quantidade);
    }
}`,
    miniProject: {
      title: 'Inventário Minecraft no Terminal',
      description: 'Um programa simples que permite adicionar itens a uma lista de inventário e mostra o que você tem guardado na mochila.',
      steps: [
        'Importe a classe <code>ArrayList</code> do pacote <code>java.util</code>.',
        'Crie uma lista de itens chamada <code>mochila</code>.',
        'Use o método <code>mochila.add("Picareta de Ferro")</code> para colocar novos itens.',
        'Use um loop <code>for</code> simples para imprimir todos os itens da mochila no terminal!'
      ]
    }
  },
  {
    id: 'swift',
    name: 'Swift',
    icon: 'fab fa-swift',
    color: '#F05138',
    category: 'mobile',
    categoryLabel: 'Mobile / Dispositivos Apple',
    difficulty: 'Médio. Bastante amigável e moderno! 🍎',
    difficultyValue: 3,
    analogy: 'O Swift é o idioma oficial dos dispositivos da Apple. É como um falcão mensageiro super veloz (inclusive o símbolo dele é um pássaro laranja). Ele foi desenhado para ser muito rápido, seguro contra erros de memória e fácil de ler, substituindo linguagens antigas e complicadas da Apple para criar aplicativos elegantes de iPhone.',
    whatItDoes: 'Criar aplicativos e jogos para todos os aparelhos da Apple: iPhones, iPads, Macs, Apple Watches e até para os óculos Apple Vision Pro!',
    coolFact: 'A Apple criou um jogo grátis para iPad chamado "Swift Playgrounds" focado especialmente em ensinar crianças e adolescentes a programar em Swift resolvendo quebra-cabeças 3D divertidos!',
    howToRunLocal: [
      'Você precisará de um computador Mac para instalar o programa oficial chamado Xcode (disponível na App Store).',
      'Se não tiver Mac, pode testar online em sites como o <a href="https://swiftinit.org/play" target="_blank" class="glow-link">swiftinit.org/play</a>.',
      'No Xcode, crie um novo projeto do tipo "Playground" para começar a digitar código e ver as telas se desenharem imediatamente.'
    ],
    codeExample: `import Foundation

var pontosDeVida = 5
let nomeDoPet = "Rex"

func curarPet() {
    pontosDeVida += 2
    print("\\(nomeDoPet) foi curado! Vida atual: \\(pontosDeVida) ❤️")
}

curarPet()`,
    miniProject: {
      title: 'Alimentador de Bichinho Virtual',
      description: 'Um modelo lógico para alimentar um pet virtual que fica com fome conforme o tempo passa.',
      steps: [
        'Defina uma variável <code>fome</code> começando em 50.',
        'Crie uma função <code>alimentar()</code> que reduz a fome em 15 unidades.',
        'Crie uma função <code>brincar()</code> que aumenta a fome em 10 unidades.',
        'Adicione mensagens bonitas usando emojis para avisar se o pet está com muita fome ou super feliz!'
      ]
    }
  },
  {
    id: 'kotlin',
    name: 'Kotlin',
    icon: 'fas fa-mobile-alt',
    color: '#7F52FF',
    category: 'mobile',
    categoryLabel: 'Mobile / Aplicativos Android',
    difficulty: 'Médio. Moderno, limpo e super inteligente! 🤖',
    difficultyValue: 3,
    analogy: 'Imagine que o Kotlin é um canivete suíço tecnológico feito sob medida para o Android. Ele foi criado para corrigir todas as coisas chatas e demoradas que os programadores reclamavam no Java antigo. Ele escreve menos linhas de código, evita erros chatos que fazem o app fechar sozinho e é muito legal de usar!',
    whatItDoes: 'Criar a grande maioria dos aplicativos modernos que você usa no seu celular Android, como Nubank, Instagram, Pinterest e muitos outros.',
    coolFact: 'O Google adotou o Kotlin como a linguagem oficial preferida para o desenvolvimento Android em 2017. O nome da linguagem vem de uma ilha russa chamada Kotlin, perto de São Petersburgo.',
    howToRunLocal: [
      'Baixe o programa oficial gratuito Android Studio no site developer.android.com.',
      'Configure um projeto básico usando o modelo "Empty Compose Activity" para programar telas modernas.',
      'Você pode rodar seu app em um celular virtual (emulador) que aparece direto na tela do seu computador!'
    ],
    codeExample: `fun main() {
    val superPoder = "Voo"
    var energia = 100
    
    fun usarPoder() {
        energia -= 20
        println("Voando alto! Energia restante: $energia%")
    }
    
    usarPoder()
}`,
    miniProject: {
      title: 'Medidor de Energia de Super-Herói',
      description: 'Um aplicativo que simula os gastos de bateria ou energia de um super-herói usando superpoderes.',
      steps: [
        'Defina uma variável <code>energia</code> com valor 100.',
        'Escreva uma função que recebe o nome do poder (como "Raio Laser" ou "Teleporte").',
        'Cada poder consome uma quantidade específica de energia.',
        'Se a energia chegar a 0, mostre o aviso: "Herói cansado! Precisa comer um sanduíche!"'
      ]
    }
  },
  {
    id: 'sql',
    name: 'SQL (S-Q-L)',
    icon: 'fas fa-database',
    color: '#00BCF2',
    category: 'dados',
    categoryLabel: 'Banco de Dados / Organização',
    difficulty: 'Fácil a Médio. Parece que você está mandando comandos para um mordomo. 📊',
    difficultyValue: 2,
    analogy: 'O SQL é como o bibliotecário-chefe de uma biblioteca colossal que guarda bilhões de fichas de dados. Ele não serve para criar animações ou mover personagens de jogos. O trabalho dele é responder perguntas super específicas na hora, como: "Bibliotecário, busque na gaveta de usuários o nome de todos os jogadores que têm mais de 100 moedas e ordene do mais rico para o mais pobre!"',
    whatItDoes: 'Salvar, pesquisar e organizar todas as informações do mundo digital: suas fotos postadas, senhas, compras online e a lista de amigos do seu jogo favorito.',
    coolFact: 'Quase toda grande empresa usa SQL nos bastidores. Sem ele, seria impossível para o Spotify encontrar a música que você quer no meio de 80 milhões de faixas em menos de um segundo!',
    howToRunLocal: [
      'Você pode baixar um banco de dados leve e gratuito chamado SQLite (ou instalar a extensão "SQLite Viewer" no VS Code).',
      'Você também pode praticar online e de graça em sites interativos como o <a href="https://sqlbolt.com" target="_blank" class="glow-link">sqlbolt.com</a>.',
      'Crie tabelas, insira dados e digite comandos <code>SELECT</code> para extrair relatórios fantásticos.'
    ],
    codeExample: `-- Cria uma tabela de jogadores de RPG
CREATE TABLE Jogadores (
    id INT,
    nome TEXT,
    nivel INT,
    ouro INT
);

-- Busca os melhores jogadores!
SELECT nome, ouro 
FROM Jogadores 
WHERE nivel >= 10
ORDER BY ouro DESC;`,
    miniProject: {
      title: 'Loja de Poções Mágicas',
      description: 'Criação de uma tabela de poções com preços e buscas para ver quais poções custam menos de 50 moedas de ouro.',
      steps: [
        'Escreva o comando <code>CREATE TABLE Posoes</code> com campos de nome, efeito e preco.',
        'Insira 3 poções usando <code>INSERT INTO Posoes VALUES (...)</code> (ex: Poção de Cura, Invisibilidade).',
        'Faça uma pesquisa com <code>SELECT * FROM Posoes WHERE preco < 50;</code>.',
        'Veja a lista de poções baratinhas aparecer como mágica!'
      ]
    }
  },
  {
    id: 'rust',
    name: 'Rust',
    icon: 'fas fa-shield-alt',
    color: '#DEA584',
    category: 'sistemas',
    categoryLabel: 'Sistemas / Segurança / Alta Velocidade',
    difficulty: 'Difícil. Tem regras de segurança bem rígidas! 🦀',
    difficultyValue: 5,
    analogy: 'Imagine que o Rust é como uma armadura medieval de titânio hiper tecnológica. Ele foi criado para ser o mais seguro e veloz possível. Ele tem um assistente interno de compilação super exigente (apelidado de "Borrow Checker") que vasculha seu código em busca de qualquer mínima falha que possa travar o computador. Se encontrar, ele bloqueia o programa e te obriga a consertar antes de rodar!',
    whatItDoes: 'Escrever sistemas operacionais, criar navegadores de internet rápidos, construir motores de jogos ultra-realistas e controlar robôs e satélites onde erros de software não podem acontecer de jeito nenhum.',
    coolFact: 'O mascote oficial do Rust é um caranguejo muito fofo chamado "Ferris"! Os programadores que usam Rust se autodenominam "Rustacean" (uma mistura de Rust com crustáceo).',
    howToRunLocal: [
      'Baixe e instale o instalador oficial através do site <a href="https://rustup.rs" target="_blank" class="glow-link">rustup.rs</a>.',
      'No terminal, use a ferramenta do Rust chamada Cargo digitando: <code>cargo new meu_projeto</code>.',
      'Entre na pasta e digite <code>cargo run</code> para compilar e executar instantaneamente.'
    ],
    codeExample: `// Código ultra seguro!
fn main() {
    let mut nome_robo = String::from("R2-D2");
    
    // O Rust garante que o robô não faça besteira na memória
    println!("Robô ativado: {}", nome_robo);
    nome_robo.push_str(" - Modo Combate");
    println!("Status: {}", nome_robo);
}`,
    miniProject: {
      title: 'Termômetro Espacial Seguro',
      description: 'Um utilitário em Rust que lê a temperatura em Celsius de um motor de foguete e avisa se ele vai derreter, garantindo segurança total de tipos.',
      steps: [
        'Crie uma variável constante para o limite crítico de calor (ex: 1500 graus).',
        'Leia uma entrada numérica de temperatura simulada.',
        'Use uma condicional de alta velocidade para verificar se a temperatura ultrapassou o limite.',
        'Imprima alertas em vermelho se o foguete estiver correndo perigo!'
      ]
    }
  },
  {
    id: 'r',
    name: 'R',
    icon: 'fas fa-chart-pie',
    color: '#278EA5',
    category: 'dados',
    categoryLabel: 'Dados / Gráficos / Estatística',
    difficulty: 'Médio. Focado em matemática e estatística! 📈',
    difficultyValue: 3,
    analogy: 'A linguagem R é como um laboratório de ciências cheio de réguas milimétricas, lupas de precisão e quadros negros gigantes. Ela é voltada quase que inteiramente para cientistas e matemáticos que querem analisar informações do mundo real (como o clima, a cura de doenças ou os dados de acessos de redes sociais) e transformá-los em belos gráficos coloridos, mapas e tabelas dinâmicas.',
    whatItDoes: 'Cálculos estatísticos avançados, análise de dados de pesquisas médicas, criação de gráficos e visualização de dados científicos de forma visualmente incrível.',
    coolFact: 'A linguagem R foi criada na Nova Zelândia por dois professores chamados Ross Ihaka e Robert Gentleman. Como os nomes de ambos começavam com a letra "R", esse acabou sendo o nome oficial da linguagem!',
    howToRunLocal: [
      'Baixe o interpretador R no site oficial do projeto CRAN (Comprehensive R Archive Network).',
      'Para facilitar a escrita, instale o programa gratuito "RStudio", que te dá uma tela cheia de painéis para ver seus gráficos em tempo real.',
      'Abra um script novo e use funções prontas para importar tabelas do Excel e desenhar gráficos automáticos.'
    ],
    codeExample: `# Criando dados de uma pesquisa de games favoritos
jogos <- c("Minecraft", "Roblox", "Fortnite")
votos <- c(50, 45, 30)

# R cria um gráfico de pizza com apenas uma linha!
pie(votos, labels = jogos, main = "Games Favoritos da Galera", col = rainbow(3))`,
    miniProject: {
      title: 'Gráfico de Notas Escolares',
      description: 'Um script simples que calcula a média das notas de um aluno e plota um gráfico de barras comparando o rendimento nas matérias.',
      steps: [
        'Crie um vetor com as matérias (Matemática, História, Ciências, Português).',
        'Crie outro vetor com as suas notas (ex: 8.5, 9.0, 7.0, 10.0).',
        'Calcule a média geral usando a função pronta <code>mean(notas)</code>.',
        'Desenhe o gráfico usando <code>barplot(notas, names.arg=materias, col="green")</code>!'
      ]
    }
  },
  {
    id: 'go',
    name: 'Go (Golang)',
    icon: 'fas fa-shipping-fast',
    color: '#00ADD8',
    category: 'sistemas',
    categoryLabel: 'Sistemas / Servidores / Google',
    difficulty: 'Médio. Muito simples, rápido e direto! 🐹',
    difficultyValue: 3,
    analogy: 'O Go (ou Golang) é como um mensageiro ninja de patinete elétrico. Ele não gosta de carregar peso inútil! Foi inventado pelos engenheiros do próprio Google porque eles queriam uma linguagem que compilasse em menos de 3 segundos e pudesse gerenciar milhões de conversas de bate-papo ao mesmo tempo sem fazer o servidor do Google suar ou travar.',
    whatItDoes: 'Criar serviços de internet ultra-rápidos que lidam com milhões de acessos simultâneos (back-end de grandes sites), gerenciar nuvens de dados (Cloud) e APIs globais.',
    coolFact: 'O mascote oficial do Go é uma criatura muito simpática chamada "Gopher", que é uma espécie de esquilo/espreitador terrestre fofo de óculos de proteção!',
    howToRunLocal: [
      'Baixe e instale o Go através do site oficial <a href="https://go.dev" target="_blank" class="glow-link">go.dev</a>.',
      'Instale o VS Code e a extensão oficial "Go".',
      'No terminal, digite <code>go mod init meu-app</code> e execute seu arquivo com o comando <code>go run main.go</code>.'
    ],
    codeExample: `package main

import "fmt"

func main() {
    // Goroutines permitem rodar coisas em paralelo facilmente!
    go enviarMensagem("Gopher 1")
    enviarMensagem("Gopher 2")
}

func enviarMensagem(nome string) {
    fmt.Println("Olá do mensageiro:", nome)
}`,
    miniProject: {
      title: 'Mensagens Paralelas Simultâneas',
      description: 'Demonstrar o poder das Goroutines (tarefas paralelas) simulando dois robôs conversando ao mesmo tempo sem que um precise esperar o outro.',
      steps: [
        'Importe o pacote "fmt" e o pacote "time" para atrasos.',
        'Crie uma função que imprime uma mensagem e espera 500 milissegundos usando <code>time.Sleep()</code>.',
        'Na função <code>main()</code>, chame essa função colocando a palavra <code>go</code> na frente de uma delas.',
        'Veja as mensagens de ambos os robôs se misturarem na tela, provando que rodam em paralelo!'
      ]
    }
  }
];

// Carregar linguagens customizadas do localStorage
function getLanguages() {
  const customs = JSON.parse(localStorage.getItem('emmanuel_educa_custom_languages')) || [];
  return [...defaultLanguages, ...customs];
}

// Inicializa a variável global languagesData com a junção das duas fontes
let languagesData = getLanguages();

// Função auxiliar para recarregar o banco de dados dinamicamente após edições do admin
function reloadLanguagesData() {
  languagesData = getLanguages();
  if (typeof renderLanguages === 'function') {
    renderLanguages();
  }
}

// Exporta se estiver em ambiente Node/CommonJS (para testes caso necessário) ou anexa na window
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { defaultLanguages, getLanguages, languagesData, reloadLanguagesData };
}
