
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const Profile: React.FC = () => {
    const { user, updateProfile, updatePassword } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profileMessage, setProfileMessage] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateProfile(name, avatarUrl);
        setProfileMessage('Perfil atualizado com sucesso!');
        setTimeout(() => setProfileMessage(''), 3000);
    };
    
    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setPasswordMessage('As senhas não coincidem.');
            return;
        }
        if (newPassword.length < 3) {
             setPasswordMessage('A senha deve ter pelo menos 3 caracteres.');
             return;
        }
        updatePassword(newPassword);
        setPasswordMessage('Senha atualizada com sucesso!');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setPasswordMessage(''), 3000);
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <header>
                <h1 className="text-3xl font-bold text-text-primary">Meu Perfil</h1>
                <p className="text-text-secondary mt-1">Atualize suas informações pessoais e de segurança.</p>
            </header>

            {/* Profile Information */}
            <div className="bg-surface p-6 rounded-lg border border-border">
                <h2 className="text-xl font-semibold mb-4">Informações do Perfil</h2>
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div className="flex items-center gap-4">
                        <img src={avatarUrl} alt="Avatar" className="w-20 h-20 rounded-full object-cover"/>
                        <div className="flex-grow">
                             <label htmlFor="avatarUrl" className="block text-sm font-medium text-text-primary mb-1">URL da Foto de Perfil</label>
                             <input 
                                type="text" 
                                id="avatarUrl" 
                                value={avatarUrl} 
                                onChange={e => setAvatarUrl(e.target.value)} 
                                className="w-full px-3 py-2 border border-border rounded-lg bg-white placeholder-gray-400"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-1">Nome</label>
                        <input 
                            type="text" 
                            id="name" 
                            value={name} 
                            onChange={e => setName(e.target.value)} 
                            className="w-full px-3 py-2 border border-border rounded-lg bg-white placeholder-gray-400"
                        />
                    </div>
                     <div className="flex justify-end items-center gap-4">
                        {profileMessage && <p className="text-sm text-success">{profileMessage}</p>}
                        <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-hover">Salvar Alterações</button>
                    </div>
                </form>
            </div>
            
            {/* Change Password */}
            <div className="bg-surface p-6 rounded-lg border border-border">
                <h2 className="text-xl font-semibold mb-4">Alterar Senha</h2>
                 <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="new-password"className="block text-sm font-medium text-text-primary mb-1">Nova Senha</label>
                        <input 
                            type="password" 
                            id="new-password"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-border rounded-lg bg-white placeholder-gray-400"
                        />
                    </div>
                     <div>
                        <label htmlFor="confirm-password"className="block text-sm font-medium text-text-primary mb-1">Confirmar Nova Senha</label>
                        <input 
                            type="password" 
                            id="confirm-password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-border rounded-lg bg-white placeholder-gray-400"
                        />
                    </div>
                    <div className="flex justify-end items-center gap-4">
                        {passwordMessage && <p className={`text-sm ${passwordMessage.includes('sucesso') ? 'text-success' : 'text-danger'}`}>{passwordMessage}</p>}
                        <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-hover">Alterar Senha</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;
