import React, { useState } from 'react';
import { useNotes } from '../context/NotesContext';
import { NoteCard } from './NoteCard';
import { Note } from '../types';

export const NoteGrid: React.FC = () => {
  const { state, dispatch } = useNotes();
  const { notes, searchQuery, viewType, showArchived } = state;
  const [draggedNote, setDraggedNote] = useState<Note | null>(null);

  const filteredNotes = notes.filter(
    (note) =>
      note.isArchived === showArchived &&
      (note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const pinnedNotes = filteredNotes.filter((note) => note.isPinned);
  const unpinnedNotes = filteredNotes.filter((note) => !note.isPinned);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, note: Note) => {
    setDraggedNote(note);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedNote(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetNote: Note) => {
    e.preventDefault();
    if (!draggedNote || draggedNote.id === targetNote.id) return;

    const updatedNotes = [...notes];
    const draggedIndex = updatedNotes.findIndex((note) => note.id === draggedNote.id);
    const targetIndex = updatedNotes.findIndex((note) => note.id === targetNote.id);

    updatedNotes.splice(draggedIndex, 1);
    updatedNotes.splice(targetIndex, 0, draggedNote);

    dispatch({ type: 'SET_NOTES', payload: updatedNotes });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {showArchived && filteredNotes.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No archived notes
        </div>
      )}

      {!showArchived && (
        <>
          {pinnedNotes.length > 0 && (
            <>
              <h2 className="text-sm font-medium text-gray-500 mb-4">PINNED</h2>
              <div
                className={`grid gap-4 ${
                  viewType === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                    : 'grid-cols-1 max-w-2xl mx-auto'
                } mb-8`}
              >
                {pinnedNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDrop={handleDrop}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {unpinnedNotes.length > 0 && (
        <>
          {!showArchived && pinnedNotes.length > 0 && (
            <h2 className="text-sm font-medium text-gray-500 mb-4">OTHERS</h2>
          )}
          <div
            className={`grid gap-4 ${
              viewType === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1 max-w-2xl mx-auto'
            }`}
          >
            {unpinnedNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDrop={handleDrop}
              />
            ))}
          </div>
        </>
      )}

      {!showArchived && filteredNotes.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          {searchQuery ? 'No matching notes found' : 'No notes yet'}
        </div>
      )}
    </div>
  );
};