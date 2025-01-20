import React from 'react';
import { NotesProvider } from './context/NotesContext';
import { Header } from './components/Header';
import { NoteEditor } from './components/NoteEditor';
import { NoteGrid } from './components/NoteGrid';
import { useNotes } from './context/NotesContext';

function AppContent() {
  const { state } = useNotes();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        {!state.showArchived && <NoteEditor />}
        <NoteGrid />
      </main>
    </div>
  );
}

function App() {
  return (
    <NotesProvider>
      <AppContent />
    </NotesProvider>
  );
}

export default App;