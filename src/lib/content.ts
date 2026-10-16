export interface NavItem {
  label: string
  href: string
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Serviços', href: '#servicos' },
  { label: 'Implantação', href: '#implantacao' },
  { label: 'Treinamentos', href: '#treinamentos' },
  { label: 'Suporte', href: '#suporte' },
  { label: 'Clientes', href: '#clientes' },
  { label: 'Contato', href: '#contato' },
]

export interface HeroAct {
  id: 'physical' | 'integration' | 'intelligence' | 'solution'
  index: string
  kicker: string
  title: string
  text: string
  secondary?: string
}

export const HERO_ACTS: HeroAct[] = [
  {
    id: 'physical',
    index: '01',
    kicker: 'Infraestrutura física',
    title: 'JT TECNOLOGIA',
    text: 'Tecnologia que move a sua operação logística.',
    secondary:
      'Especialistas em Infor WMS, integração de sistemas e soluções para operações logísticas.',
  },
  {
    id: 'integration',
    index: '02',
    kicker: 'Integração de sistemas',
    title: 'INTEGRAÇÃO DE SISTEMAS',
    text: 'Conectamos tecnologias, processos e operações.',
  },
  {
    id: 'intelligence',
    index: '03',
    kicker: 'Inteligência digital',
    title: 'INTELIGÊNCIA OPERACIONAL',
    text: 'Infraestrutura tecnológica para operações logísticas mais conectadas.',
  },
  {
    id: 'solution',
    index: '04',
    kicker: 'A solução',
    title: 'JT TECNOLOGIA',
    text: 'Da implantação à evolução da sua operação.',
  },
]

export const SERVICES = [
  {
    title: 'Implantação Infor WMS',
    description:
      'Do diagnóstico ao go-live: parametrização, testes, treinamento e suporte pós-implantação.',
  },
  {
    title: 'Integrações de Sistemas',
    description:
      'Integração entre WMS, ERP, TMS, e-commerce e APIs, com foco em segurança e disponibilidade.',
  },
  {
    title: 'Desenvolvimento Sob Medida',
    description:
      'Customizações, relatórios, automações e aplicações adaptadas às necessidades operacionais.',
  },
  {
    title: 'Arquitetura de Soluções',
    description:
      'Desenho de arquiteturas escaláveis, alinhadas aos processos e objetivos de cada operação.',
  },
  {
    title: 'Upgrade e Migração',
    description:
      'Evolução de versões e plataformas com planejamento e redução dos impactos operacionais.',
  },
  {
    title: 'Suporte e Sustentação',
    description:
      'Acompanhamento técnico, resolução de incidentes e evolução contínua dos sistemas.',
  },
] as const

export interface EditorialItem {
  title: string
  description: string
}

export const IMPLEMENTATION_STEPS: EditorialItem[] = [
  {
    title: 'Diagnóstico',
    description:
      'Mapeamento dos processos de recebimento, armazenagem, separação e expedição.',
  },
  {
    title: 'Desenho da Solução',
    description:
      'Definição do blueprint funcional e técnico, parametrização do Infor WMS e integrações.',
  },
  {
    title: 'Implantação e Testes',
    description:
      'Configuração, testes integrados, carga de dados e simulação da operação.',
  },
  {
    title: 'Treinamento de Usuários',
    description:
      'Capacitação de operadores, líderes, key users e equipes de TI.',
  },
  {
    title: 'Go-live Assistido',
    description: 'Acompanhamento técnico durante a entrada em produção.',
  },
  {
    title: 'Suporte Contínuo',
    description:
      'Sustentação, melhorias e acompanhamento da evolução operacional.',
  },
]

export const TRAINING_ITEMS = [
  'Treinamento de operadores: coletores RF, recebimento, picking e inventário.',
  'Formação de key users e multiplicadores internos.',
  'Capacitação de supervisores e gestores em indicadores e relatórios.',
  'Treinamento técnico para equipes de TI: configuração, integrações e monitoramento.',
  'Materiais didáticos e procedimentos operacionais personalizados.',
] as const

export const SUPPORT_CAPABILITIES = [
  'Suporte 24/7.',
  'Atendimento N1, N2 e N3.',
  'SLA definido conforme criticidade.',
  'Monitoramento de integrações.',
  'Melhoria contínua.',
  'Reforço operacional em períodos sazonais.',
] as const
