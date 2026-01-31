
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { MOCK_PROJECTS, MOCK_CHAT_MESSAGES, MOCK_ACTIVITIES } from '../constants';
import { Project, ChatMessage, Activity } from '../types';
import { SendIcon, TrashIcon } from '../components/icons';

interface DashboardProps {
  navigateTo: (page: 'project-detail', projectId: string) => void;
}

const ProjectCard: React.FC<{ project: Project; onClick: () => void; }> = ({ project, onClick }) => (
    <div onClick={onClick} className="bg-surface p-4 rounded-lg border border-border hover:shadow-md hover:border-primary transition cursor-pointer">
        <div className="flex justify-between items-start">
            <span className="text-xs font-semibold bg-primary-light text-primary px-2 py-1 rounded-full">{project.discipline}</span>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${project.status === 'Finalizado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{project.status}</span>
        </div>
        <h3 className="font-semibold mt-3">{project.name}</h3>
        <p className="text-xs text-text-secondary mt-1 truncate">{project.description}</p>
        <div className="flex -space-x-2 mt-4">
            {project.members.map(m => (
                <img key={m} className="inline-block h-6 w-6 rounded-full ring-2 ring-white" src={`https://i.pravatar.cc/150?u=${m.toLowerCase()}`} alt={m}/>
            ))}
        </div>
    </div>
);


const ActivityItem: React.FC<{ activity: Activity }> = ({ activity }) => {
    const today = new Date().toISOString().split('T')[0];
    const isDueToday = activity.dueDate === today;

    return (
        <div className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50">
            <div className={`mt-1 w-2.5 h-2.5 rounded-full ${activity.status === 'precisa de ajuda' ? 'bg-danger' : 'bg-warning'}`}></div>
            <div>
                <p className="text-sm font-medium text-text-primary">{activity.description}</p>
                <p className="text-xs text-text-secondary">{activity.discipline} {isDueToday && <span className="text-danger font-semibold">- Vence hoje</span>}</p>
            </div>
        </div>
    );
};

const ChatWidget: React.FC = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState<ChatMessage[]>(MOCK_CHAT_MESSAGES);
    const [input, setInput] = useState('');

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !user) return;
        const newMessage: ChatMessage = {
            id: `msg${messages.length + 1}`,
            user: user.name,
            text: input,
            timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages([...messages, newMessage]);
        setInput('');
        // NOTE: For real-time functionality across users, this is where you'd
        // send the message to a service like Firebase Realtime Database.
    };

    return (
        <div className="bg-surface rounded-lg border border-border flex flex-col h-full">
            <div className="p-4 border-b border-border flex justify-between items-center">
                <h3 className="font-semibold">Chat do Grupo</h3>
                <button onClick={() => setMessages([])} className="text-text-secondary hover:text-danger" title="Limpar conversa">
                    <TrashIcon className="w-4 h-4" />
                </button>
            </div>
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex items-end gap-2 ${msg.user === user?.name ? 'justify-end' : 'justify-start'}`}>
                       {msg.user !== user?.name && <img src={`https://i.pravatar.cc/150?u=${msg.user.toLowerCase()}`} className="w-6 h-6 rounded-full" />}
                        <div className={`max-w-xs px-3 py-2 rounded-lg ${msg.user === user?.name ? 'bg-primary text-white rounded-br-none' : 'bg-gray-100 text-text-primary rounded-bl-none'}`}>
                            <p className="text-sm">{msg.text}</p>
                            <p className="text-xs opacity-70 mt-1 text-right">{msg.user} - {msg.timestamp}</p>
                        </div>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSend} className="p-4 border-t border-border flex items-center gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary placeholder-gray-400"
                />
                <button type="submit" className="bg-primary text-white p-2 rounded-lg disabled:bg-gray-300">
                    <SendIcon className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
};


const Dashboard: React.FC<DashboardProps> = ({ navigateTo }) => {
    const { user } = useAuth();
    const [projects] = useState<Project[]>(MOCK_PROJECTS);
    const [activities] = useState<Activity[]>(MOCK_ACTIVITIES);
    const today = new Date().toISOString().split('T')[0];
    const dailyActivities = activities.filter(a => a.dueDate === today);

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-text-primary">Olá, {user?.name}!</h1>
                <p className="text-text-secondary mt-1">Aqui está o resumo do que está acontecendo.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Projects Section */}
                <section className="lg:col-span-2">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Projetos Ativos</h2>
                        <button onClick={() => { /* In a routed app, this would be a Link */ }} className="text-sm font-medium text-primary hover:underline">
                            Ver todos
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {projects.filter(p => p.status !== 'Finalizado').map(p => (
                            <ProjectCard key={p.id} project={p} onClick={() => navigateTo('project-detail', p.id)} />
                        ))}
                    </div>
                </section>

                {/* Daily Activities & Chat */}
                <div className="space-y-6">
                    <section className="bg-surface rounded-lg border border-border p-4">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-semibold">Atividades do Dia</h3>
                            <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Hoje</span>
                        </div>
                        <div className="space-y-2">
                            {dailyActivities.length > 0 ? (
                                dailyActivities.map(act => <ActivityItem key={act.id} activity={act} />)
                            ) : (
                                <p className="text-sm text-center text-text-secondary py-4">Nenhuma atividade para hoje.</p>
                            )}
                        </div>
                    </section>
                    
                    <section className="h-96">
                       <ChatWidget/>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
