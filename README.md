# JT Tecnologia — Invisible Infrastructure

Fundação do novo site institucional da JT Tecnologia: React, TypeScript, Vite,
Tailwind CSS e dependências preparadas para experiências 3D.

## Requisitos

- Node.js 20.19+ ou 22.12+.
- npm.

## Instalação e execução

```bash
npm install
npm run dev
```

O Vite informa no terminal o endereço local, normalmente
`http://localhost:5173`.

## Verificações

```bash
npm run build
npx tsc -b
```

O build de produção fica em `dist/`. Para pré-visualizá-lo localmente:

```bash
npm run preview
```

## Estrutura

```text
src/
  assets/
    fonts/
    images/
    models/
    textures/
  components/
    layout/
    three/
    ui/
  hooks/
  lib/
  sections/
  styles/
  App.tsx
  main.tsx
```

`src/components/three/ThreeScene.tsx` é o ponto de entrada das cenas 3D.
O Canvas é importado sob demanda e tem fallback de carregamento e de erro. Com
movimento reduzido, exibe fallback (ou, com `reducedMotion="static"`, renderiza
um quadro estático sob demanda).

## Página inicial cinematográfica (`/`)

A home é uma narrativa em 4 atos guiada por scroll (GSAP ScrollTrigger) sobre
um único Canvas persistente que reutiliza a cena do laboratório:

- `src/sections/Hero.tsx`: trilha alta com palco `position: sticky`, timeline
  dos textos e progresso 0–1 gravado em `ref` (sem estado React por frame).
- `src/components/three/warehouse/scrollPath.ts`: curva de percurso da câmera,
  `blend` Physical→Digital e escurecimento final, todos funções do progresso.
- `src/lib/content.ts`: textos, navegação e serviços (fonte única).
- Com `prefers-reduced-motion`, não há pinning nem câmera animada: a cena é um
  quadro estático e os atos aparecem em sequência vertical.
- O conteúdo institucional inclui serviços, etapas de implantação, modalidades
  de treinamento, capacidades de suporte, experiência em operações de grande
  escala e contato por e-mail.
- A seção de experiência não exibe marcas ou logotipos até que a autorização e
  a natureza das relações estejam documentadas.
- As seções institucionais usam revelações discretas com GSAP e mantêm o
  conteúdo visível sem JavaScript ou com movimento reduzido.
- A metodologia recebe um pulso sequencial na linha e nos seis nós; diagramas
  SVG em Treinamentos e Experiência usam fluxos leves em CSS, sem outro Canvas.
- O movimento decorativo é desativado com `prefers-reduced-motion`. O endereço
  público continua sendo `contato@jttecnologia.com`.

## Formulário de contato (Formspree)

O formulário envia `name`, `email` e `message` por `POST` (`FormData`, com
`Accept: application/json`) para o endpoint público do Formspree
(`https://formspree.io/f/meaerybp`), definido em
`src/sections/InstitutionalSections.tsx`. A mensagem de sucesso só aparece
quando o Formspree responde com status 2xx; caso contrário, é exibido erro. O
campo oculto `_gotcha` é o honeypot anti-spam do Formspree.

O endereço que recebe as notificações é configurado no painel do Formspree
(formulário → Settings), nunca no código. Para testes reais, confirme o e-mail
de destino no Formspree e, se houver restrição de domínio, permita `localhost`
e o domínio de produção. Não há backend próprio nem variáveis de ambiente.

## Laboratório 3D (`/lab-3d`)

Protótipo de um centro de distribuição, acessível em
`http://localhost:5173/lab-3d` (roteamento próprio em `src/lib/navigation.ts`,
sem biblioteca de rotas). A página inicial permanece em `/`.

Toda a geometria é procedural (Three.js); nenhuma imagem, textura, modelo ou
vídeo externo é usado. Objetos repetidos usam `InstancedMesh`.

- **Physical**: materiais opacos, iluminação industrial e detalhes âmbar.
- **Digital**: a estrutura física esmaece e surgem linhas de fluxo de dados,
  conexões e nós em ciano e laranja. A transição é contínua (um único valor
  `blend`), sem desmontar a cena.
- Câmera com paralaxe sutil do mouse (interpolação independente do frame rate,
  ponto de fuga estável) e uma aproximação inicial discreta, executada só ao
  carregar o laboratório. Ambos desativados com movimento reduzido.

**Refinamento (etapa 2.1)**

- Materiais PBR com texturas procedurais geradas em canvas (`textures.ts`):
  aço perfurado, concreto polido, papelão, madeira, etiquetas, chapa ondulada.
- Detalhes: placas de base, proteções de coluna, clipes, etiquetas, faixas de
  segurança e placas de corredor.
- Automação: pórticos de leitura, esteira aérea, esteiras laterais, sensores e
  gabinetes com LEDs de status.
- Digital com hierarquia: linhas principais (espinha dorsal, trilhas), contornos
  secundários de baixa intensidade, nós e arcos de integração.
- Qualidade adaptativa (`useSceneQuality`): menos detalhe e DPR menor em telas
  pequenas/touch.

Código em `src/components/three/warehouse/` (`WarehouseScene`, `Racks`,
`Storage`, `Structure`, `Automation`, `Lighting`, `DataLayer`, `CameraRig`) e página em
`src/pages/Lab3DPage.tsx`.

As cores da identidade inicial e as famílias Space Grotesk e DM Sans estão
preparadas em `src/index.css`. Os arquivos de fonte podem ser adicionados em
`src/assets/fonts/` após a verificação de licença; a aplicação não carrega fontes
por URLs externas.
