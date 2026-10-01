# Emannuel Educa

Protótipo de ensino de programação para iniciantes, desenvolvido com HTML, CSS e JavaScript. Reúne lições, experimentação e quizzes em uma interface com identidade visual neon.

## O que explorar

- Catálogo introdutório de linguagens e exemplos de programação.
- Playground de JavaScript e visualização de HTML/CSS.
- Quizzes, roteiro de aprendizado, XP e conquistas.
- Efeitos sonoros com Web Audio e celebrações visuais.
- Interface demonstrativa de contas, perfis e administração local.
- Assistente de respostas predefinidas, apresentado na interface como Emannuel AI. Não há integração com um modelo de linguagem.

## Executar localmente

Não há etapa de compilação nem backend. Com Python instalado:

```sh
git clone https://github.com/iamnothuman7/emannuel-educa.git
cd emannuel-educa
python -m http.server 8000 --bind 127.0.0.1
```

Abra `http://127.0.0.1:8000/`. Alguns recursos visuais usam serviços externos, como Font Awesome e canvas-confetti, e precisam de conexão com a internet.

## Estrutura

| Arquivo | Função |
| --- | --- |
| `index.html` | Estrutura da aplicação |
| `css/style.css` | Layout, temas e animações |
| `js/languages.js` | Conteúdo das lições |
| `js/quiz.js` | Conteúdo dos quizzes |
| `js/app.js` | Navegação, estado, playground e controles da interface |

## Limites de segurança e privacidade

Este é um protótipo de frontend, não uma plataforma escolar pronta para produção. Contas, sessões e progresso ficam em `localStorage`, sob controle de quem usa o navegador. A tela de administração não é uma barreira de segurança de servidor.

Use apenas nomes, emails e senhas fictícios. Não reutilize senhas pessoais nem cadastre dados de alunos. Limpar os dados do navegador pode apagar o progresso.

O playground executa JavaScript no navegador com `new Function`. Execute somente código que você compreende e não cole conteúdo desconhecido. Uma evolução para uso público com dados reais exige autenticação no servidor, armazenamento apropriado e isolamento da execução de código.

## Validação e próximos passos

Ainda não há suíte automatizada de testes no repositório. Ao contribuir, verifique navegação por teclado, telas pequenas, áudio após interação, persistência de progresso, quizzes e os dois modos do playground. Esses itens são uma lista de verificação, não uma declaração de testes concluídos.

Issues e pull requests são bem-vindos com exemplos fictícios. Não há licença de redistribuição declarada neste repositório.
