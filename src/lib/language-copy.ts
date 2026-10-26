export type Language = 'en' | 'es' | 'pt'

export interface Copy {
  nav: string[]
  header: { menuOpen: string; menuClose: string; navLabel: string; languageLabel: string }
  hero: {
    acts: { kicker: string; title: string; text: string; secondary?: string }[]
    metrics: string[]
    solutionsLink: string
    scrollCue: string
  }
  solutions: { eyebrow: string; title: string; subtitle: string; items: { title: string; description: string }[] }
  implementation: {
    eyebrow: string
    title: string[]
    lead: string
    steps: { title: string; description: string }[]
  }
  training: {
    eyebrow: string
    title: string[]
    lead: string
    diagramTitle: string
    diagramDescription: string
    diagramLabels: string[]
    items: string[]
  }
  support: {
    eyebrow: string
    title: string[]
    lead: string
    graphicLabels: string[]
    items: string[]
  }
  clients: { eyebrow: string; title: string; lead: string; deployments: string }
  contact: {
    eyebrow: string
    title: string[]
    lead: string
    name: string
    email: string
    message: string
    honeypot: string
    submit: string
    submitting: string
    success: string
    networkError: string
    sendError: string
    whatsapp: string
    whatsappAria: string
  }
  footer: { description: string; navLabel: string }
  lab: { back: string; modeLabel: string; modes: string[]; loading: string; unavailable: string }
  skipLink: string
}

export const COPY: Record<Language, Copy> = {
  pt: {
    nav: ['Serviços', 'Implantação', 'Treinamentos', 'Suporte', 'Clientes', 'Contato'],
    header: {
      menuOpen: 'Abrir menu',
      menuClose: 'Fechar menu',
      navLabel: 'Principal',
      languageLabel: 'Selecionar idioma',
    },
    hero: {
      acts: [
        {
          kicker: 'Infraestrutura física',
          title: 'JT TECNOLOGIA',
          text: 'Tecnologia que move a sua operação logística.',
          secondary:
            'Especialistas em Infor WMS, integração de sistemas e soluções para operações logísticas.',
        },
        {
          kicker: 'Integração de sistemas',
          title: 'INTEGRAÇÃO DE SISTEMAS',
          text: 'Conectamos tecnologias, processos e operações.',
        },
        {
          kicker: 'Inteligência digital',
          title: 'INTELIGÊNCIA OPERACIONAL',
          text: 'Infraestrutura tecnológica para operações logísticas mais conectadas.',
        },
        {
          kicker: 'A solução',
          title: 'JT TECNOLOGIA',
          text: 'Da implantação à evolução da sua operação.',
        },
      ],
      metrics: ['anos de experiência em WMS', 'foco em multinacionais'],
      solutionsLink: 'Conheça nossas soluções',
      scrollCue: 'Role para explorar',
    },
    solutions: {
      eyebrow: 'Serviços / 01—06',
      title: 'SOLUÇÕES COMPLETAS',
      subtitle: 'Tecnologia para toda a sua operação logística.',
      items: [
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
      ],
    },
    implementation: {
      eyebrow: 'Implantação / Método',
      title: ['DA ESTRATÉGIA', 'À OPERAÇÃO'],
      lead: 'Uma metodologia estruturada para reduzir riscos e assegurar a continuidade operacional.',
      steps: [
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
          description: 'Capacitação de operadores, líderes, key users e equipes de TI.',
        },
        {
          title: 'Go-live Assistido',
          description: 'Acompanhamento técnico durante a entrada em produção.',
        },
        {
          title: 'Suporte Contínuo',
          description: 'Sustentação, melhorias e acompanhamento da evolução operacional.',
        },
      ],
    },
    training: {
      eyebrow: 'Treinamentos / Pessoas & operação',
      title: ['CONHECIMENTO', 'QUE SUSTENTA', 'A OPERAÇÃO'],
      lead:
        'A eficiência de um sistema depende também das pessoas que o utilizam. A JT Tecnologia desenvolve treinamentos direcionados às diferentes funções envolvidas na operação logística.',
      diagramTitle: 'Fluxo de conhecimento operacional',
      diagramDescription: 'Um núcleo de conhecimento conecta pessoas, processos e tecnologia.',
      diagramLabels: ['PESSOAS', 'PROCESSOS', 'TECNOLOGIA', 'CONHECIMENTO'],
      items: [
        'Treinamento de operadores: coletores RF, recebimento, picking e inventário.',
        'Formação de key users e multiplicadores internos.',
        'Capacitação de supervisores e gestores em indicadores e relatórios.',
        'Treinamento técnico para equipes de TI: configuração, integrações e monitoramento.',
        'Materiais didáticos e procedimentos operacionais personalizados.',
      ],
    },
    support: {
      eyebrow: 'Suporte / Continuidade',
      title: ['CONTINUIDADE', 'OPERACIONAL'],
      lead: 'Tecnologia, acompanhamento e evolução para manter sua operação em funcionamento.',
      graphicLabels: ['OPERAÇÃO', 'SISTEMAS'],
      items: [
        'Suporte 24/7.',
        'Atendimento N1, N2 e N3.',
        'SLA definido conforme criticidade.',
        'Monitoramento de integrações.',
        'Melhoria contínua.',
        'Reforço operacional em períodos sazonais.',
      ],
    },
    clients: {
      eyebrow: 'Experiência / Escala',
      title: 'EXPERIÊNCIA EM OPERAÇÕES DE GRANDE ESCALA',
      lead: 'Experiência em projetos e implantações de sistemas para operações logísticas de empresas multinacionais.',
      deployments: 'IMPLANTAÇÕES REALIZADAS EM',
    },
    contact: {
      eyebrow: 'Contato / Próximo passo',
      title: ['VAMOS CONECTAR', 'SUA OPERAÇÃO', 'AO PRÓXIMO NÍVEL.'],
      lead:
        'Converse com nossos especialistas e descubra como a JT Tecnologia pode contribuir para a evolução da sua operação logística.',
      name: 'SEU NOME',
      email: 'SEU E-MAIL',
      message: 'COMO PODEMOS AJUDAR?',
      honeypot: 'Não preencha este campo',
      submit: 'ENVIAR MENSAGEM',
      submitting: 'ENVIANDO…',
      success: 'Mensagem enviada. Agradecemos o contato.',
      networkError:
        'Não foi possível conectar ao serviço de envio. Verifique sua conexão e tente novamente, ou use o e-mail público informado na página.',
      sendError:
        'Não foi possível enviar sua mensagem. Tente novamente ou use o e-mail público informado na página.',
      whatsapp: 'ENTRAR EM CONTATO',
      whatsappAria: 'Entrar em contato pelo WhatsApp no número 15 99156-3052',
    },
    footer: {
      description: 'Especialização em soluções tecnológicas para logística.',
      navLabel: 'Navegação do rodapé',
    },
    lab: {
      back: 'Página inicial',
      modeLabel: 'Modo de visualização',
      modes: ['Físico', 'Digital'],
      loading: 'Carregando ambiente 3D…',
      unavailable: 'Não foi possível iniciar o ambiente 3D neste dispositivo.',
    },
    skipLink: 'Pular para o conteúdo',
  },
  en: {
    nav: ['Services', 'Implementation', 'Training', 'Support', 'Clients', 'Contact'],
    header: {
      menuOpen: 'Open menu',
      menuClose: 'Close menu',
      navLabel: 'Main',
      languageLabel: 'Select language',
    },
    hero: {
      acts: [
        {
          kicker: 'Physical infrastructure',
          title: 'JT TECNOLOGIA',
          text: 'Technology that drives your logistics operation.',
          secondary:
            'Infor WMS, systems integration, and technology solutions for logistics operations.',
        },
        {
          kicker: 'Systems integration',
          title: 'SYSTEMS INTEGRATION',
          text: 'We connect technologies, processes, and operations.',
        },
        {
          kicker: 'Digital intelligence',
          title: 'OPERATIONAL INTELLIGENCE',
          text: 'Technology infrastructure for more connected logistics operations.',
        },
        {
          kicker: 'The solution',
          title: 'JT TECNOLOGIA',
          text: 'From implementation to the evolution of your operation.',
        },
      ],
      metrics: ['years of WMS experience', 'focus on multinational companies'],
      solutionsLink: 'Discover our solutions',
      scrollCue: 'Scroll to explore',
    },
    solutions: {
      eyebrow: 'Services / 01—06',
      title: 'COMPLETE SOLUTIONS',
      subtitle: 'Technology for your entire logistics operation.',
      items: [
        {
          title: 'Infor WMS Implementation',
          description:
            'From assessment to go-live: configuration, testing, training, and post-implementation support.',
        },
        {
          title: 'Systems Integration',
          description:
            'Integration across WMS, ERP, TMS, e-commerce, and APIs, focused on security and availability.',
        },
        {
          title: 'Custom Development',
          description:
            'Customizations, reports, automation, and applications tailored to operational needs.',
        },
        {
          title: 'Solutions Architecture',
          description:
            'Scalable architecture aligned with each operation’s processes and objectives.',
        },
        {
          title: 'Upgrade and Migration',
          description:
            'Platform and version upgrades planned to reduce operational impact.',
        },
        {
          title: 'Support and Maintenance',
          description:
            'Technical assistance, incident resolution, and continuous system improvement.',
        },
      ],
    },
    implementation: {
      eyebrow: 'Implementation / Method',
      title: ['FROM STRATEGY', 'TO OPERATIONS'],
      lead: 'A structured methodology to reduce risk and ensure operational continuity.',
      steps: [
        {
          title: 'Assessment',
          description:
            'Mapping of receiving, storage, picking, and shipping processes.',
        },
        {
          title: 'Solution Design',
          description:
            'Definition of the functional and technical blueprint, Infor WMS configuration, and integrations.',
        },
        {
          title: 'Implementation and Testing',
          description:
            'Configuration, integration testing, data loading, and operational simulation.',
        },
        {
          title: 'User Training',
          description: 'Training for operators, team leaders, key users, and IT teams.',
        },
        {
          title: 'Assisted Go-live',
          description: 'Technical support during production launch.',
        },
        {
          title: 'Ongoing Support',
          description: 'Maintenance, improvements, and support for operational evolution.',
        },
      ],
    },
    training: {
      eyebrow: 'Training / People & operations',
      title: ['KNOWLEDGE', 'THAT SUPPORTS', 'OPERATIONS'],
      lead:
        'A system’s efficiency also depends on the people who use it. JT Tecnologia develops training tailored to the different roles involved in logistics operations.',
      diagramTitle: 'Operational knowledge flow',
      diagramDescription: 'A knowledge hub connects people, processes, and technology.',
      diagramLabels: ['PEOPLE', 'PROCESSES', 'TECHNOLOGY', 'KNOWLEDGE'],
      items: [
        'Operator training: RF scanners, receiving, picking, and inventory.',
        'Training for key users and internal trainers.',
        'Training for supervisors and managers on metrics and reports.',
        'Technical training for IT teams: configuration, integrations, and monitoring.',
        'Customized learning materials and operating procedures.',
      ],
    },
    support: {
      eyebrow: 'Support / Continuity',
      title: ['OPERATIONAL', 'CONTINUITY'],
      lead: 'Technology, guidance, and improvement to keep your operation running.',
      graphicLabels: ['OPERATIONS', 'SYSTEMS'],
      items: [
        '24/7 support.',
        'Tier 1, 2, and 3 support.',
        'SLA based on incident severity.',
        'Integration monitoring.',
        'Continuous improvement.',
        'Additional operational support during seasonal peaks.',
      ],
    },
    clients: {
      eyebrow: 'Experience / Scale',
      title: 'EXPERIENCE WITH LARGE-SCALE OPERATIONS',
      lead: 'Experience in systems projects and implementations for multinational logistics operations.',
      deployments: 'IMPLEMENTATIONS COMPLETED AT',
    },
    contact: {
      eyebrow: 'Contact / Next step',
      title: ['LET’S CONNECT', 'YOUR OPERATION', 'TO THE NEXT LEVEL.'],
      lead:
        'Talk to our specialists and discover how JT Tecnologia can help advance your logistics operation.',
      name: 'YOUR NAME',
      email: 'YOUR EMAIL',
      message: 'HOW CAN WE HELP?',
      honeypot: 'Leave this field empty',
      submit: 'SEND MESSAGE',
      submitting: 'SENDING…',
      success: 'Message sent. Thank you for reaching out.',
      networkError:
        'Could not connect to the sending service. Check your connection and try again, or use the public email listed on this page.',
      sendError:
        'Could not send your message. Try again or use the public email listed on this page.',
      whatsapp: 'GET IN TOUCH',
      whatsappAria: 'Contact us on WhatsApp at +55 15 99156-3052',
    },
    footer: {
      description: 'Technology solutions for logistics.',
      navLabel: 'Footer navigation',
    },
    lab: {
      back: 'Home',
      modeLabel: 'View mode',
      modes: ['Physical', 'Digital'],
      loading: 'Loading 3D environment…',
      unavailable: 'Could not start the 3D environment on this device.',
    },
    skipLink: 'Skip to content',
  },
  es: {
    nav: ['Servicios', 'Implementación', 'Capacitación', 'Soporte', 'Clientes', 'Contacto'],
    header: {
      menuOpen: 'Abrir menú',
      menuClose: 'Cerrar menú',
      navLabel: 'Principal',
      languageLabel: 'Seleccionar idioma',
    },
    hero: {
      acts: [
        {
          kicker: 'Infraestructura física',
          title: 'JT TECNOLOGIA',
          text: 'Tecnología que impulsa su operación logística.',
          secondary:
            'Especialistas en Infor WMS, integración de sistemas y soluciones para operaciones logísticas.',
        },
        {
          kicker: 'Integración de sistemas',
          title: 'INTEGRACIÓN DE SISTEMAS',
          text: 'Conectamos tecnologías, procesos y operaciones.',
        },
        {
          kicker: 'Inteligencia digital',
          title: 'INTELIGENCIA OPERACIONAL',
          text: 'Infraestructura tecnológica para operaciones logísticas más conectadas.',
        },
        {
          kicker: 'La solución',
          title: 'JT TECNOLOGIA',
          text: 'Desde la implementación hasta la evolución de su operación.',
        },
      ],
      metrics: ['años de experiencia en WMS', 'enfoque en multinacionales'],
      solutionsLink: 'Conozca nuestras soluciones',
      scrollCue: 'Deslice para explorar',
    },
    solutions: {
      eyebrow: 'Servicios / 01—06',
      title: 'SOLUCIONES COMPLETAS',
      subtitle: 'Tecnología para toda su operación logística.',
      items: [
        {
          title: 'Implementación de Infor WMS',
          description:
            'Del diagnóstico al go-live: parametrización, pruebas, capacitación y soporte posterior a la implementación.',
        },
        {
          title: 'Integraciones de Sistemas',
          description:
            'Integración entre WMS, ERP, TMS, comercio electrónico y APIs, con foco en seguridad y disponibilidad.',
        },
        {
          title: 'Desarrollo a Medida',
          description:
            'Personalizaciones, informes, automatizaciones y aplicaciones adaptadas a las necesidades operativas.',
        },
        {
          title: 'Arquitectura de Soluciones',
          description:
            'Diseño de arquitecturas escalables, alineadas con los procesos y objetivos de cada operación.',
        },
        {
          title: 'Actualización y Migración',
          description:
            'Evolución de versiones y plataformas con planificación y reducción del impacto operativo.',
        },
        {
          title: 'Soporte y Mantenimiento',
          description:
            'Acompañamiento técnico, resolución de incidentes y evolución continua de los sistemas.',
        },
      ],
    },
    implementation: {
      eyebrow: 'Implementación / Método',
      title: ['DE LA ESTRATEGIA', 'A LA OPERACIÓN'],
      lead: 'Una metodología estructurada para reducir riesgos y asegurar la continuidad operativa.',
      steps: [
        {
          title: 'Diagnóstico',
          description:
            'Mapeo de los procesos de recepción, almacenamiento, preparación y expedición.',
        },
        {
          title: 'Diseño de la Solución',
          description:
            'Definición del blueprint funcional y técnico, parametrización de Infor WMS e integraciones.',
        },
        {
          title: 'Implementación y Pruebas',
          description:
            'Configuración, pruebas integradas, carga de datos y simulación de la operación.',
        },
        {
          title: 'Capacitación de Usuarios',
          description: 'Capacitación de operadores, líderes, key users y equipos de TI.',
        },
        {
          title: 'Go-live Asistido',
          description: 'Acompañamiento técnico durante la puesta en producción.',
        },
        {
          title: 'Soporte Continuo',
          description: 'Mantenimiento, mejoras y acompañamiento de la evolución operativa.',
        },
      ],
    },
    training: {
      eyebrow: 'Capacitación / Personas y operación',
      title: ['CONOCIMIENTO', 'QUE SOSTIENE', 'LA OPERACIÓN'],
      lead:
        'La eficiencia de un sistema también depende de las personas que lo utilizan. JT Tecnologia desarrolla capacitaciones dirigidas a las distintas funciones de la operación logística.',
      diagramTitle: 'Flujo de conocimiento operativo',
      diagramDescription: 'Un núcleo de conocimiento conecta personas, procesos y tecnología.',
      diagramLabels: ['PERSONAS', 'PROCESOS', 'TECNOLOGÍA', 'CONOCIMIENTO'],
      items: [
        'Capacitación de operadores: terminales RF, recepción, picking e inventario.',
        'Formación de key users y multiplicadores internos.',
        'Capacitación de supervisores y gestores en indicadores e informes.',
        'Capacitación técnica para equipos de TI: configuración, integraciones y monitoreo.',
        'Materiales didácticos y procedimientos operativos personalizados.',
      ],
    },
    support: {
      eyebrow: 'Soporte / Continuidad',
      title: ['CONTINUIDAD', 'OPERATIVA'],
      lead: 'Tecnología, acompañamiento y evolución para mantener su operación en funcionamiento.',
      graphicLabels: ['OPERACIÓN', 'SISTEMAS'],
      items: [
        'Soporte 24/7.',
        'Atención N1, N2 y N3.',
        'SLA definido según la criticidad.',
        'Monitoreo de integraciones.',
        'Mejora continua.',
        'Refuerzo operativo en períodos estacionales.',
      ],
    },
    clients: {
      eyebrow: 'Experiencia / Escala',
      title: 'EXPERIENCIA EN OPERACIONES DE GRAN ESCALA',
      lead: 'Experiencia en proyectos e implementaciones de sistemas para operaciones logísticas de empresas multinacionales.',
      deployments: 'IMPLEMENTACIONES REALIZADAS EN',
    },
    contact: {
      eyebrow: 'Contacto / Próximo paso',
      title: ['CONECTEMOS', 'SU OPERACIÓN', 'CON EL SIGUIENTE NIVEL.'],
      lead:
        'Hable con nuestros especialistas y descubra cómo JT Tecnologia puede contribuir a la evolución de su operación logística.',
      name: 'SU NOMBRE',
      email: 'SU CORREO ELECTRÓNICO',
      message: '¿CÓMO PODEMOS AYUDARLE?',
      honeypot: 'Deje este campo vacío',
      submit: 'ENVIAR MENSAJE',
      submitting: 'ENVIANDO…',
      success: 'Mensaje enviado. Gracias por contactarnos.',
      networkError:
        'No fue posible conectar con el servicio de envío. Compruebe su conexión e inténtelo de nuevo, o utilice el correo público indicado en esta página.',
      sendError:
        'No fue posible enviar su mensaje. Inténtelo de nuevo o utilice el correo público indicado en esta página.',
      whatsapp: 'PÓNGASE EN CONTACTO',
      whatsappAria: 'Contactar por WhatsApp al número +55 15 99156-3052',
    },
    footer: {
      description: 'Especialización en soluciones tecnológicas para logística.',
      navLabel: 'Navegación del pie de página',
    },
    lab: {
      back: 'Página de inicio',
      modeLabel: 'Modo de visualización',
      modes: ['Físico', 'Digital'],
      loading: 'Cargando entorno 3D…',
      unavailable: 'No fue posible iniciar el entorno 3D en este dispositivo.',
    },
    skipLink: 'Saltar al contenido',
  },
}
