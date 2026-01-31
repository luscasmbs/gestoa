
import React, { useState, useMemo, useEffect } from 'react';
import { Activity } from '../types';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../hooks/useData';
import { PlusIcon, PinIcon, XIcon } from '../components/icons';

const ActivityListItem: React.FC<{ activity: Activity; onSelect: () => void; isActive: boolean; onPin: (id: string) => void; }> = ({ activity, onSelect, isActive, onPin }) => {
    const { user } = useAuth();
    const canPin = user?.role !== 'viewer';
    const statusMap = {
        'precisa de ajuda': { text: 'Precisa de Ajuda', color: 'bg-danger' },
        'em andamento': { text: 'Em Andamento', color: 'bg-warning' },
        'resolvida': { text: 'Resolvida', color: 'bg-success' },
    };

    return (
        <div onClick={onSelect} className={`p-4 border-b border-border cursor-pointer hover:bg-primary-light group ${isActive ? 'bg-primary-light border-l-4 border-primary' : ''}`}>
            <div className="flex justify-between items-start">
                <p className="font-semibold text-text-primary pr-2">{activity.description}</p>
                <div className="flex items-center gap-2">
                    {canPin && (
                    <button onClick={(e) => { e.stopPropagation(); onPin(activity.id); }} className="opacity-0 group-hover:opacity-100 transition-opacity">
                       <PinIcon className={`w-4 h-4 ${activity.pinned ? 'text-primary' : 'text-gray-400'}`} filled={activity.pinned} />
                    </button>
                    )}
                    <div className={`w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 ${statusMap[activity.status].color}`}></div>
                </div>
            </div>
            <p className="text-sm text-text-secondary mt-1">{activity.discipline}</p>
            <p className="text-xs text-text-secondary mt-2">Por: {activity.user}</p>
        </div>
    );
};

const ActivityDetail: React.FC<{ activity: Activity | null }> = ({ activity }) => {
    const { user } = useAuth();
    
    if (!activity) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center text-text-secondary p-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-4 text-lg font-semibold">Selecione uma atividade</h3>
                <p className="mt-1 text-sm">Escolha uma atividade da lista para ver os detalhes e comentários.</p>
            </div>
        );
    }
    
     const statusMap = {
        'precisa de ajuda': { text: 'Precisa de Ajuda', className: 'bg-red-100 text-red-800' },
        'em andamento': { text: 'Em Andamento', className: 'bg-yellow-100 text-yellow-800' },
        'resolvida': { text: 'Resolvida', className: 'bg-green-100 text-green-800' },
    };


    return (
        <div className="p-6 h-full flex flex-col">
            <header className="pb-4 border-b border-border">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-text-primary">{activity.discipline}</h2>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusMap[activity.status].className}`}>{statusMap[activity.status].text}</span>
                </div>
                <p className="text-text-secondary mt-2">{activity.description}</p>
                 <div className="text-sm text-text-secondary mt-3">
                    <span>Criado por: <strong>{activity.user}</strong></span>
                    {activity.dueDate && <span> | Prazo: <strong>{new Date(activity.dueDate).toLocaleDateString('pt-BR')}</strong></span>}
                </div>
            </header>
            
            <div className="flex-grow overflow-y-auto py-4 space-y-4">
                <h3 className="font-semibold text-text-primary">Comentários</h3>
                {activity.comments.length > 0 ? (
                    activity.comments.map((comment, index) => (
                         <div key={index} className="flex items-start gap-3">
                            <img src={`https://i.pravatar.cc/150?u=${comment.user.toLowerCase()}`} className="w-8 h-8 rounded-full" />
                            <div className="bg-gray-100 p-3 rounded-lg flex-1">
                                <p className="font-semibold text-sm">{comment.user}</p>
                                <p className="text-sm text-text-primary mt-1">{comment.text}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-center text-text-secondary py-4">Nenhum comentário ainda.</p>
                )}
            </div>

            <div className="mt-auto pt-4 border-t border-border">
                <div className="flex items-start gap-3">
                    <img src={user?.avatarUrl} className="w-8 h-8 rounded-full" />
                    <textarea placeholder="Adicionar um comentário..." className="w-full p-2 border border-border bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-primary placeholder-gray-400" rows={2}></textarea>
                    <button className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-hover">Enviar</button>
                </div>
            </div>
        </div>
    );
};

const NewActivityModal: React.FC<{ isOpen: boolean; onClose: () => void; onAddActivity: (activity: Activity) => void; }> = ({ isOpen, onClose, onAddActivity }) => {
    const { user } = useAuth();
    const [description, setDescription] = useState('');
    const [discipline, setDiscipline] = useState('');
    const [status, setStatus] = useState<'precisa de ajuda' | 'em andamento'>('em andamento');
    
    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        
        const newActivity: Activity = {
            id: `act${Date.now()}`,
            description,
            discipline,
            status,
            user: user.name,
            comments: [],
            pinned: false,
        };
        onAddActivity(newActivity);
        onClose();
    };

    return (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-surface rounded-lg shadow-xl p-6 w-full max-w-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Nova Atividade</h2>
                    <button onClick={onClose}><XIcon className="w-6 h-6 text-text-secondary" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="act-description" className="block text-sm font-medium text-text-primary mb-1">Descrição</label>
                        <textarea id="act-description" value={description} onChange={e => setDescription(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg bg-white placeholder-gray-400" rows={3} required></textarea>
                    </div>
                     <div>
                        <label htmlFor="act-discipline" className="block text-sm font-medium text-text-primary mb-1">Disciplina</label>
                        <input type="text" id="act-discipline" value={discipline} onChange={e => setDiscipline(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg bg-white placeholder-gray-400" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">Status</label>
                        <select value={status} onChange={e => setStatus(e.target.value as any)} className="w-full px-3 py-2 border border-border rounded-lg bg-white">
                            <option value="em andamento">Em Andamento</option>
                            <option value="precisa de ajuda">Precisa de Ajuda</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">Cancelar</button>
                        <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-hover">Criar Atividade</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Activities: React.FC = () => {
    const { user } = useAuth();
    const { activities, projects, addActivity, updateActivity } = useData();
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const accessibleProjectIds = useMemo(() => 
        projects.filter(p => p.access.includes(user?.id || '')).map(p => p.id)
    , [user, projects]);

    const visibleActivities = useMemo(() => 
        activities.filter(act => !act.projectId || accessibleProjectIds.includes(act.projectId))
    , [activities, accessibleProjectIds]);

    const sortedActivities = useMemo(() => {
        return [...visibleActivities].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
    }, [visibleActivities]);
    
    useEffect(() => {
       if (sortedActivities.length > 0 && !selectedActivity) {
           setSelectedActivity(sortedActivities.find(a => a.pinned) || sortedActivities[0]);
       }
       if (selectedActivity && !visibleActivities.find(a => a.id === selectedActivity.id)) {
           setSelectedActivity(sortedActivities[0] || null);
       }
    }, [sortedActivities, selectedActivity, visibleActivities]);


    const handlePinActivity = (id: string) => {
        const activity = activities.find(a => a.id === id);
        if (activity) {
            updateActivity({ ...activity, pinned: !activity.pinned });
        }
    }

    return (
        <div className="space-y-6 h-full flex flex-col">
            <header className="flex justify-between items-center flex-shrink-0">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Atividades e Ajuda</h1>
                    <p className="text-text-secondary mt-1">Acompanhe dúvidas e tarefas que precisam de atenção.</p>
                </div>
                {user?.role !== 'viewer' && (
                <button onClick={() => setIsModalOpen(true)} className="bg-primary text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-primary-hover shadow-sm">
                    <PlusIcon className="w-5 h-5" />
                    Nova Atividade
                </button>
                )}
            </header>

            <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-6 bg-surface border border-border rounded-lg overflow-hidden">
                <div className="lg:col-span-1 border-r border-border overflow-y-auto">
                    {sortedActivities.map(act => (
                        <ActivityListItem 
                            key={act.id} 
                            activity={act} 
                            onSelect={() => setSelectedActivity(act)}
                            isActive={selectedActivity?.id === act.id}
                            onPin={handlePinActivity}
                        />
                    ))}
                </div>
                <div className="lg:col-span-2">
                    <ActivityDetail activity={selectedActivity} />
                </div>
            </div>
            <NewActivityModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddActivity={addActivity}/>
        </div>
    );
};

export default Activities;
