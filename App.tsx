
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { DataProvider } from './hooks/useData';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Activities from './pages/Activities';
import Profile from './pages/Profile';
import Sidebar from './components/Sidebar';
import AIAssistant from './components/AIAssistant';

type Page = 'dashboard' | 'projects' | 'project-detail' | 'activities' | 'profile';

const AppContent: React.FC = () => {
    const { user } = useAuth();
    const [currentPage, setCurrentPage] = useState<Page>('dashboard');
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

    const navigateTo = (page: Page, projectId?: string) => {
        setCurrentPage(page);
        if (projectId) {
            setSelectedProjectId(projectId);
        } else if (page !== 'project-detail') {
            setSelectedProjectId(null);
        }
    };

    if (!user) {
        return <Login />;
    }

    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return <Dashboard navigateTo={navigateTo} />;
            case 'projects':
                return <Projects navigateTo={navigateTo} />;
            case 'project-detail':
                 if (!selectedProjectId) {
                    navigateTo('projects'); // Fallback if no project is selected
                    return <Projects navigateTo={navigateTo} />;
                 }
                return <ProjectDetail projectId={selectedProjectId} navigateTo={navigateTo} />;
            case 'activities':
                return <Activities />;
            case 'profile':
                return <Profile />;
            default:
                return <Dashboard navigateTo={navigateTo} />;
        }
    };

    return (
        <div className="flex h-screen bg-background">
            <Sidebar navigateTo={navigateTo} currentPage={currentPage} />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                {renderPage()}
            </main>
            <AIAssistant />
        </div>
    );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <DataProvider>
                <AppContent />
            </DataProvider>
        </AuthProvider>
    );
};

export default App;
