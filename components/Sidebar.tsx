
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { DashboardIcon, ProjectsIcon, ActivitiesIcon, LogoutIcon, UserCircleIcon } from './icons';

interface SidebarProps {
    navigateTo: (page: 'dashboard' | 'projects' | 'activities' | 'profile') => void;
    currentPage: string;
}

const NavLink: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => {
    const baseClasses = "flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200";
    const activeClasses = "bg-primary text-white shadow-md";
    const inactiveClasses = "text-text-secondary hover:bg-primary-light hover:text-primary";

    return (
        <button onClick={onClick} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
            {icon}
            <span className="ml-3">{label}</span>
        </button>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ navigateTo, currentPage }) => {
    const { user, logout } = useAuth();

    return (
        <aside className="w-64 bg-surface border-r border-border flex-col p-4 hidden md:flex">
            <div className="flex items-center gap-2 px-4 mb-8">
                 <div className="bg-primary p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-9-5.747h18" />
                    </svg>
                 </div>
                <h1 className="text-xl font-bold text-primary">Project Gestão</h1>
            </div>
            <nav className="flex flex-col gap-2">
                <NavLink
                    icon={<DashboardIcon className="w-5 h-5" />}
                    label="Dashboard"
                    isActive={currentPage === 'dashboard'}
                    onClick={() => navigateTo('dashboard')}
                />
                <NavLink
                    icon={<ProjectsIcon className="w-5 h-5" />}
                    label="Projetos"
                    isActive={currentPage.startsWith('project')}
                    onClick={() => navigateTo('projects')}
                />
                <NavLink
                    icon={<ActivitiesIcon className="w-5 h-5" />}
                    label="Atividades"
                    isActive={currentPage === 'activities'}
                    onClick={() => navigateTo('activities')}
                />
            </nav>
            <div className="mt-auto">
                <div className="flex items-center p-2 mb-4 rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => navigateTo('profile')}>
                    <img src={user?.avatarUrl} alt={user?.name} className="w-10 h-10 rounded-full object-cover" />
                    <div className="ml-3">
                        <p className="text-sm font-semibold text-text-primary">{user?.name}</p>
                        <p className="text-xs text-text-secondary capitalize">{user?.role}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-lg text-danger hover:bg-red-50"
                >
                    <LogoutIcon className="w-5 h-5" />
                    <span className="ml-3">Sair</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
