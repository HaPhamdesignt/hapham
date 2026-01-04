import React, { useState, useEffect } from 'react';
import { ViewState, AppData } from './types';
import { loadData, saveData } from './services/storageService';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import DebtManager from './components/DebtManager';
import AccountManager from './components/AccountManager';
import NotesManager from './components/NotesManager';
import BookmarksManager from './components/BookmarksManager';
import PromptManager from './components/PromptManager';
import Login from './components/Login';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeView, setActiveView] = useState<ViewState>('dashboard');
  const [data, setData] = useState<AppData | null>(null);

  useEffect(() => {
    // Load data on mount
    const loadedData = loadData();
    setData(loadedData);
  }, []);

  const handleUpdate = (key: keyof AppData, value: any) => {
    if (!data) return;
    const newData = { ...data, [key]: value };
    setData(newData);
    saveData(newData);
  };

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  if (!data) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-500">Đang tải LifeOS...</div>;

  return (
    <Layout 
      activeView={activeView} 
      onChangeView={setActiveView}
      userProfile={data.userProfile}
      onUpdateProfile={(profile) => handleUpdate('userProfile', profile)}
    >
      {activeView === 'dashboard' && (
        <Dashboard data={data} onChangeView={setActiveView} />
      )}
      {activeView === 'debts' && (
        <DebtManager debts={data.debts} onUpdate={(debts) => handleUpdate('debts', debts)} />
      )}
      {activeView === 'accounts' && (
        <AccountManager 
          accounts={data.accounts} 
          contacts={data.sellerContacts}
          onUpdate={(accounts) => handleUpdate('accounts', accounts)} 
          onUpdateContacts={(contacts) => handleUpdate('sellerContacts', contacts)}
        />
      )}
      {activeView === 'notes' && (
        <NotesManager 
          notes={data.notes} 
          folders={data.folders}
          onUpdateNotes={(notes) => handleUpdate('notes', notes)} 
          onUpdateFolders={(folders) => handleUpdate('folders', folders)} 
        />
      )}
      {activeView === 'bookmarks' && (
        <BookmarksManager bookmarks={data.bookmarks} onUpdate={(bookmarks) => handleUpdate('bookmarks', bookmarks)} />
      )}
      {activeView === 'prompts' && (
        <PromptManager 
          prompts={data.prompts || []} 
          folders={data.promptFolders || []}
          onUpdatePrompts={(prompts) => handleUpdate('prompts', prompts)} 
          onUpdateFolders={(folders) => handleUpdate('promptFolders', folders)}
        />
      )}
    </Layout>
  );
};

export default App;