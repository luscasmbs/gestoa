
import React, { useState, useRef } from 'react';
import { Project, Task, TaskStatus, Document, ChecklistItem } from '../types';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../hooks/useData';
import { PlusIcon, TrashIcon, PaperclipIcon, CheckCircleIcon } from '../components/icons';

type Tab = 'tasks' | 'files' | 'checklist' | 'settings';

const KanbanColumn: React.FC<{ title: string; tasks: Task[]; status: TaskStatus; }> = ({ title, tasks, status }) => {
    const count = tasks.length;
    let badgeColor = '';
    switch(status) {
        case 'todo': badgeColor = 'bg-gray-200 text-gray-800'; break;
        case 'progress': badgeColor = 'bg-yellow-100 text-yellow-800'; break;
        case 'done': badgeColor = 'bg-green-100 text-green-800'; break;
    }
    
    return (
        <div className="bg-gray-50 p-4 rounded-lg flex-1 min-w-[280px]">
            <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-text-primary">{title}</h4>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${badgeColor}`}>{count}</span>
            </div>
            <div className="space-y-3">
                {tasks.map(task => <KanbanCard key={task.id} task={task} />)}
            </div>
        </div>
    );
};

const KanbanCard: React.FC<{ task: Task }> = ({ task }) => {
    let priorityColor = '';
    switch(task.priority) {
        case 'alta': priorityColor = 'border-l-danger'; break;
        case 'media': priorityColor = 'border-l-warning'; break;
        case 'baixa': priorityColor = 'border-l-success'; break;
    }
    return (
        <div className={`bg-surface p-3 rounded-md shadow-sm border ${priorityColor} border-l-4`}>
            <p className="font-medium text-sm">{task.title}</p>
            <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-text-secondary">{task.deadline ? new Date(task.deadline).toLocaleDateString('pt-BR') : 'Sem prazo'}</span>
                <img className="h-6 w-6 rounded-full" src={`https://i.pravatar.cc/150?u=${task.responsible.toLowerCase()}`} alt={task.responsible} title={task.responsible} />
            </div>
        </div>
    );
};

const FilesView: React.FC<{ project: Project; onUpdateProject: (project: Project) => void; }> = ({ project, onUpdateProject }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { user } = useAuth();
    
    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && user) {
            const newFile: Document = {
                id: `doc${Date.now()}`,
                title: file.name,
                type: file.type,
                link: URL.createObjectURL(file),
                responsible: user.name,
                file: file,
            };
            onUpdateProject({ ...project, documents: [newFile, ...project.documents] });
        }
    };
    
    const handleDownload = (doc: Document) => {
        if(doc.file) {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(doc.file);
            link.download = doc.title;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            alert("Arquivo de mock, não pode ser baixado.");
        }
    }

    return (
        <div className="mt-6">
             <div className="flex justify-between items-center mb-4">
                 <h2 className="text-xl font-semibold">Arquivos do Projeto</h2>
                 <button onClick={handleUploadClick} className="bg-primary text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-primary-hover shadow-sm">
                    <PaperclipIcon className="w-5 h-5"/> Subir Arquivo
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            </div>
            <div className="bg-surface border border-border rounded-lg">
                <ul className="divide-y divide-border">
                {project.documents.map(doc => (
                    <li key={doc.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                        <div>
                            <p className="font-semibold text-primary">{doc.title}</p>
                            <p className="text-sm text-text-secondary">Enviado por: {doc.responsible}</p>
                        </div>
                        <button onClick={() => handleDownload(doc)} className="text-sm text-primary hover:underline">Download</button>
                    </li>
                ))}
                </ul>
                {project.documents.length === 0 && <p className="p-8 text-center text-text-secondary">Nenhum arquivo encontrado.</p>}
            </div>
        </div>
    );
}

const ChecklistView: React.FC<{ project: Project; onUpdateProject: (project: Project) => void; }> = ({ project, onUpdateProject }) => {
    const [newItemText, setNewItemText] = useState('');

    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();
        if(!newItemText.trim()) return;
        const newItem: ChecklistItem = {
            id: `cl-${Date.now()}`,
            text: newItemText.trim(),
            completed: false,
        };
        onUpdateProject({ ...project, checklist: [...project.checklist, newItem] });
        setNewItemText('');
    };

    const handleToggle = (id: string) => {
        const updatedChecklist = project.checklist.map(item => item.id === id ? { ...item, completed: !item.completed } : item);
        onUpdateProject({ ...project, checklist: updatedChecklist });
    };

    const handleDelete = (id: string) => {
        const updatedChecklist = project.checklist.filter(item => item.id !== id);
        onUpdateProject({ ...project, checklist: updatedChecklist });
    }

    return (
        <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Checklist</h2>
            <div className="bg-surface border border-border rounded-lg p-4 space-y-3">
                {project.checklist.map(item => (
                    <div key={item.id} className="flex items-center gap-3 group">
                        <button onClick={() => handleToggle(item.id)}>
                            <CheckCircleIcon className={`w-6 h-6 ${item.completed ? 'text-success' : 'text-gray-300'}`} isCompleted={item.completed}/>
                        </button>
                        <span className={`flex-grow ${item.completed ? 'line-through text-text-secondary' : 'text-text-primary'}`}>{item.text}</span>
                        <button onClick={() => handleDelete(item.id)} className="text-gray-400 hover:text-danger opacity-0 group-hover:opacity-100">
                           <TrashIcon className="w-4 h-4"/>
                        </button>
                    </div>
                ))}
                {project.checklist.length === 0 && <p className="text-center text-text-secondary py-4">Nenhum item no checklist.</p>}
                <form onSubmit={handleAddItem} className="flex items-center gap-2 pt-4 border-t border-border">
                    <input 
                        type="text" 
                        value={newItemText}
                        onChange={e => setNewItemText(e.target.value)}
                        placeholder="Adicionar novo item..."
                        className="w-full px-3 py-2 border border-border rounded-lg bg-white placeholder-gray-400"
                    />
                    <button type="submit" className="bg-primary text-white p-2 rounded-lg font-semibold hover:bg-primary-hover">
                        <PlusIcon className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};

const ProjectDetail: React.FC<{ projectId: string; navigateTo: (page: 'projects') => void; }> = ({ projectId, navigateTo }) => {
    const { user } = useAuth();
    const { projects, updateProject, deleteProject } = useData();
    const project = projects.find(p => p.id === projectId);
    
    const [activeTab, setActiveTab] = useState<Tab>('tasks');
    
    if (!project) {
        return (
            <div className="text-center p-8">
                <h1 className="text-2xl font-bold">Projeto não encontrado</h1>
                <p className="text-text-secondary mt-2">Ele pode ter sido excluído ou você não tem mais acesso.</p>
                <button onClick={() => navigateTo('projects')} className="text-primary mt-4 font-semibold">Voltar para projetos</button>
            </div>
        );
    }
    
    const canEdit = user?.role === 'admin';

    const handleDeleteProject = () => {
        if(window.confirm(`Tem certeza que deseja excluir o projeto "${project.name}"?`)) {
            deleteProject(projectId);
            navigateTo('projects');
        }
    }

    const tasksTodo = project.tasks.filter(t => t.status === 'todo');
    const tasksProgress = project.tasks.filter(t => t.status === 'progress');
    const tasksDone = project.tasks.filter(t => t.status === 'done');
    
    const availableTabs: Tab[] = ['tasks', 'files', 'checklist'];
    if (canEdit) availableTabs.push('settings');

    return (
        <div className="space-y-6">
            <header className="bg-surface p-6 rounded-lg border border-border">
                 <div className="flex justify-between items-start">
                    <div>
                        <div className="flex gap-2 items-center mb-2">
                           <span className="text-sm font-semibold bg-primary-light text-primary px-2.5 py-1 rounded-full">{project.discipline}</span>
                           <span className="text-sm font-semibold bg-yellow-100 text-yellow-800 px-2.5 py-1 rounded-full">{project.status}</span>
                        </div>
                        <h1 className="text-3xl font-bold text-text-primary">{project.name}</h1>
                        <p className="text-text-secondary mt-1 max-w-2xl">{project.description}</p>
                    </div>
                     <div className="text-right flex-shrink-0">
                        <p className="text-sm text-text-secondary">Entrega</p>
                        <p className="text-lg font-semibold">{new Date(project.dueDate).toLocaleDateString('pt-BR')}</p>
                         {canEdit && (
                            <button onClick={handleDeleteProject} className="mt-2 text-sm flex items-center gap-1 text-danger hover:bg-red-50 px-2 py-1 rounded">
                                <TrashIcon className="w-4 h-4" /> Excluir Projeto
                            </button>
                         )}
                    </div>
                </div>
                <div className="flex -space-x-2 mt-4">
                    {project.members.map(m => (
                        <img key={m} className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src={`https://i.pravatar.cc/150?u=${m.toLowerCase()}`} alt={m} title={m}/>
                    ))}
                </div>
            </header>
            
            <div className="border-b border-border">
                <nav className="flex space-x-4">
                    {availableTabs.map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`px-3 py-2 font-medium text-sm rounded-t-lg ${activeTab === tab ? 'border-b-2 border-primary text-primary' : 'text-text-secondary hover:text-primary'}`}>
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </nav>
            </div>

            {activeTab === 'tasks' && (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Quadro de Tarefas</h2>
                        {user?.role !== 'viewer' && (
                        <button className="bg-primary text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-primary-hover shadow-sm">
                            <PlusIcon className="w-5 h-5" /> Nova Tarefa
                        </button>
                        )}
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-4">
                        <KanbanColumn title="A Fazer" tasks={tasksTodo} status="todo"/>
                        <KanbanColumn title="Em Andamento" tasks={tasksProgress} status="progress" />
                        <KanbanColumn title="Concluído" tasks={tasksDone} status="done" />
                    </div>
                </div>
            )}

            {activeTab === 'files' && <FilesView project={project} onUpdateProject={updateProject} />}
            {activeTab === 'checklist' && <ChecklistView project={project} onUpdateProject={updateProject} />}
            {activeTab === 'settings' && canEdit && <div>Configurações</div>}
        </div>
    );
};

export default ProjectDetail;
