
import React, { useState } from 'react';
import { Project, ProjectStatus } from '../types';
import { USERS } from '../constants';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../hooks/useData';
import { PlusIcon, XIcon } from '../components/icons';

const ProjectCard: React.FC<{ project: Project, onClick: () => void }> = ({ project, onClick }) => {
    const statusColorMap: { [key in ProjectStatus]: string } = {
        'Em andamento': 'bg-blue-100 text-blue-800',
        'Em revisão': 'bg-yellow-100 text-yellow-800',
        'Atrasado': 'bg-red-100 text-red-800',
        'Finalizado': 'bg-green-100 text-green-800',
    };

    return (
        <div
            onClick={onClick}
            className="bg-surface p-5 rounded-lg border border-border hover:shadow-lg hover:border-primary transition-all duration-200 cursor-pointer flex flex-col"
        >
            <div className="flex justify-between items-start mb-3">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColorMap[project.status]}`}>
                    {project.status}
                </span>
            </div>
            <h3 className="text-lg font-bold text-text-primary">{project.name}</h3>
            <p className="text-sm text-text-secondary mt-1 flex-grow">{project.description}</p>
            <div className="mt-4 pt-4 border-t border-border">
                <div className="flex justify-between items-center">
                    <div className="flex -space-x-2">
                        {project.members.map(m => (
                            <img key={m} className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src={`https://i.pravatar.cc/150?u=${m.toLowerCase()}`} alt={m} title={m} />
                        ))}
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-text-secondary">Entrega</p>
                        <p className="text-sm font-semibold text-text-primary">{new Date(project.dueDate).toLocaleDateString('pt-BR')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const NewProjectModal: React.FC<{ isOpen: boolean; onClose: () => void; onAddProject: (project: Project) => void; }> = ({ isOpen, onClose, onAddProject }) => {
    const { user } = useAuth();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [discipline, setDiscipline] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [access, setAccess] = useState<string[]>(user ? [user.id] : []);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newProject: Project = {
            id: `proj${Date.now()}`,
            name,
            description,
            discipline,
            dueDate,
            status: 'Em andamento',
            members: access.map(id => USERS.find(u => u.id === id)?.name || ''),
            tasks: [],
            documents: [],
            checklist: [],
            access,
        };
        onAddProject(newProject);
        onClose();
    };
    
    const handleAccessChange = (userId: string) => {
        setAccess(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);
    }
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-surface rounded-lg shadow-xl p-6 w-full max-w-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Novo Projeto</h2>
                    <button onClick={onClose}><XIcon className="w-6 h-6 text-text-secondary" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-1">Nome do Projeto</label>
                        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg bg-white placeholder-gray-400" required />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-text-primary mb-1">Descrição</label>
                        <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg bg-white placeholder-gray-400" rows={3}></textarea>
                    </div>
                    <div>
                        <label htmlFor="discipline" className="block text-sm font-medium text-text-primary mb-1">Disciplina</label>
                        <input type="text" id="discipline" value={discipline} onChange={e => setDiscipline(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg bg-white placeholder-gray-400" required />
                    </div>
                     <div>
                        <label htmlFor="dueDate" className="block text-sm font-medium text-text-primary mb-1">Data de Entrega</label>
                        <input type="date" id="dueDate" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg bg-white" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">Quem pode ver?</label>
                        <div className="grid grid-cols-3 gap-2">
                        {USERS.map(u => (
                            <label key={u.id} className="flex items-center gap-2 p-2 border border-border rounded-lg">
                                <input type="checkbox" checked={access.includes(u.id)} onChange={() => handleAccessChange(u.id)} disabled={u.id === user?.id} />
                                <span>{u.name}</span>
                            </label>
                        ))}
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">Cancelar</button>
                        <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-hover">Criar Projeto</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const Projects: React.FC<{ navigateTo: (page: 'project-detail', projectId: string) => void; }> = ({ navigateTo }) => {
    const { user } = useAuth();
    const { projects, addProject } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const canCreate = user?.role !== 'viewer';
    const visibleProjects = projects.filter(p => p.access.includes(user?.id || ''));

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Meus Projetos</h1>
                    <p className="text-text-secondary mt-1">Gerencie todos os seus projetos escolares.</p>
                </div>
                {canCreate && (
                    <button onClick={() => setIsModalOpen(true)} className="bg-primary text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-primary-hover shadow-sm">
                        <PlusIcon className="w-5 h-5" />
                        Novo Projeto
                    </button>
                )}
            </header>

            {visibleProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {visibleProjects.map(project => (
                        <ProjectCard key={project.id} project={project} onClick={() => navigateTo('project-detail', project.id)} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                     <div className="mx-auto h-12 w-12 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={1.5} stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                        </svg>
                    </div>
                    <h3 className="mt-2 text-lg font-semibold text-gray-900">Nenhum projeto encontrado.</h3>
                    {canCreate && (
                        <button onClick={() => setIsModalOpen(true)} className="mt-4 bg-primary text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 mx-auto hover:bg-primary-hover shadow-sm">
                            Criar primeiro projeto
                        </button>
                    )}
                </div>
            )}
            <NewProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddProject={addProject} />
        </div>
    );
};

export default Projects;
