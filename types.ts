
export type UserRole = 'admin' | 'member' | 'viewer';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatarUrl: string;
  password?: string;
}

export type TaskStatus = 'todo' | 'progress' | 'done';
export type TaskPriority = 'baixa' | 'media' | 'alta';

export interface Task {
  id: string;
  title: string;
  responsible: string;
  deadline?: string;
  priority: TaskPriority;
  status: TaskStatus;
}

export interface Document {
    id: string;
    title: string;
    type: string;
    link: string;
    responsible: string;
    file?: File;
}

export interface ChecklistItem {
    id: string;
    text: string;
    completed: boolean;
}

export type ProjectStatus = 'Em andamento' | 'Em revisão' | 'Atrasado' | 'Finalizado';

export interface Project {
  id:string;
  name: string;
  description: string;
  discipline: string;
  dueDate: string;
  status: ProjectStatus;
  members: string[];
  tasks: Task[];
  documents: Document[];
  checklist: ChecklistItem[];
  access: string[]; // Array of user IDs with access
}

export interface ChatMessage {
    id: string;
    user: string;
    text: string;
    timestamp: string;
}

export interface Activity {
    id: string;
    discipline: string;
    description: string;
    dueDate?: string;
    status: 'precisa de ajuda' | 'em andamento' | 'resolvida';
    user: string;
    comments: { user: string; text: string; }[];
    pinned?: boolean;
    projectId?: string; // Link activity to a project for permission checking
}
