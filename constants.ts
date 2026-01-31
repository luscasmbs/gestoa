
import { User, Project, ChatMessage, Activity } from './types';

export const USERS: User[] = [
    { id: '1', name: 'Lucas', role: 'admin', avatarUrl: 'https://i.pravatar.cc/150?u=lucas', password: '123' },
    { id: '2', name: 'Carol', role: 'admin', avatarUrl: 'https://i.pravatar.cc/150?u=carol', password: '123' },
    { id: '3', name: 'Guilherme', role: 'member', avatarUrl: 'https://i.pravatar.cc/150?u=guilherme', password: '123' },
    { id: '4', name: 'Davi', role: 'member', avatarUrl: 'https://i.pravatar.cc/150?u=davi', password: '123' },
    { id: '5', name: 'Gabi', role: 'member', avatarUrl: 'https://i.pravatar.cc/150?u=gabi', password: '123' },
    { id: '6', name: 'Italo', role: 'viewer', avatarUrl: 'https://i.pravatar.cc/150?u=italo', password: '123' },
];

export const MOCK_PROJECTS: Project[] = [
    {
        id: 'proj1',
        name: 'Desenvolvimento Web App de Gestão',
        description: 'Criar uma aplicação web completa para gestão de projetos escolares, utilizando React, TypeScript e Tailwind.',
        discipline: 'Engenharia de Software',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
        status: 'Em andamento',
        members: ['Lucas', 'Carol', 'Davi'],
        tasks: [
            { id: 't1', title: 'Estruturar projeto React', responsible: 'Lucas', status: 'done', priority: 'alta', deadline: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0] },
            { id: 't2', title: 'Criar componentes de UI', responsible: 'Carol', status: 'progress', priority: 'alta', deadline: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0] },
            { id: 't3', title: 'Configurar autenticação', responsible: 'Davi', status: 'todo', priority: 'media', deadline: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0] },
        ],
        documents: [
            { id: 'd1', title: 'Documento de Requisitos.pdf', type: 'principal', link: '#', responsible: 'Carol' },
            { id: 'd2', title: 'Wireframes Iniciais.fig', type: 'design', link: '#', responsible: 'Carol' },
        ],
        checklist: [
            { id: 'c1', text: 'Definir paleta de cores', completed: true },
            { id: 'c2', text: 'Esboçar layout principal', completed: false },
        ],
        access: ['1', '2', '3', '4', '5'], // Everyone except Italo
    },
    {
        id: 'proj2',
        name: 'Análise de Dados de Mercado',
        description: 'Analisar dados de mercado para identificar tendências de consumo para o próximo trimestre.',
        discipline: 'Marketing Digital',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString().split('T')[0],
        status: 'Em revisão',
        members: ['Guilherme', 'Gabi'],
        tasks: [
             { id: 't4', title: 'Coletar dados de vendas', responsible: 'Gabi', status: 'done', priority: 'alta' },
             { id: 't5', title: 'Gerar relatórios iniciais', responsible: 'Guilherme', status: 'progress', priority: 'media' },
        ],
        documents: [],
        checklist: [],
        access: ['3', '5', '6'], // Guilherme, Gabi, and Italo
    },
];

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
    { id: 'msg1', user: 'Carol', text: 'Pessoal, comecei a criar os componentes de UI. Alguma sugestão de paleta de cores?', timestamp: '10:30' },
    { id: 'msg2', user: 'Lucas', text: 'Acho que um azul como cor primária ficaria bom!', timestamp: '10:32' }
];

export const MOCK_ACTIVITIES: Activity[] = [
    {
        id: 'act1',
        discipline: 'Banco de Dados',
        description: 'Preciso de ajuda com uma query SQL para o relatório final. Não estou conseguindo fazer o join correto.',
        status: 'precisa de ajuda',
        user: 'Davi',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().split('T')[0],
        comments: [
            { user: 'Lucas', text: 'Posso dar uma olhada depois do almoço.' }
        ],
        pinned: true,
        projectId: 'proj1',
    },
    {
        id: 'act2',
        discipline: 'Design de Interfaces',
        description: 'Trabalhando no protótipo de alta fidelidade da tela de login.',
        status: 'em andamento',
        user: 'Carol',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
        comments: [],
        pinned: false,
        projectId: 'proj1',
    },
    {
        id: 'act3',
        discipline: 'Marketing',
        description: 'Verificar dados para o Italo',
        status: 'em andamento',
        user: 'Guilherme',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0],
        comments: [],
        pinned: false,
        projectId: 'proj2',
    }
];
