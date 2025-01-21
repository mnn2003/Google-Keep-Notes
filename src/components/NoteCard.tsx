import React, { useState } from 'react';
import { Pin, Archive, Trash2, Image, List as ListIcon, Edit2, Check, X } from 'lucide-react';
import { Note } from '../types';
import { useNotes } from '../context/NotesContext';

interface NoteCardProps {
  note: Note;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, note: Note) => void;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, targetNote: Note) => void;
}

const bgColorMap = {
  default: 'bg-white',
  red: 'bg-red-100',
  orange: 'bg-orange-100',
  yellow: 'bg-yellow-100',
  green: 'bg-green-100',
  blue: 'bg-blue-100',
  purple: 'bg-purple-100',
  pink: 'bg-pink-100',
};

export const NoteCard: React.FC<NoteCardProps> = ({ note, onDragStart, onDragEnd, onDrop }) => {
  const { dispatch } = useNotes();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(note.title);
  const [editedContent, setEditedContent] = useState(note.content);

  const handlePin = () => {
    dispatch({
      type: 'UPDATE_NOTE',
      payload: { ...note, isPinned: !note.isPinned },
    });
  };

  const handleArchive = () => {
    dispatch({
      type: 'UPDATE_NOTE',
      payload: { ...note, isArchived: !note.isArchived },
    });
  };

  const handleDelete = () => {
    dispatch({ type: 'DELETE_NOTE', payload: note.id });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedTitle(note.title);
    setEditedContent(note.content);
  };

  const handleSaveEdit = () => {
    dispatch({
      type: 'UPDATE_NOTE',
      payload: {
        ...note,
        title: editedTitle.trim(),
        content: editedContent.trim(),
        updatedAt: new Date().toISOString(),
      },
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedTitle(note.title);
    setEditedContent(note.content);
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, note)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDrop(e, note)}
      className={`relative rounded-lg border border-gray-300 shadow-sm hover:shadow-md transition-shadow ${
        bgColorMap[note.color]
      } cursor-move`}
    >
      <div className="p-4">
        {isEditing ? (
          <div className="space-y-2">
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              placeholder="Title"
              className="w-full px-2 py-1 bg-transparent border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              placeholder="Take a note..."
              rows={3}
              className="w-full px-2 py-1 bg-transparent border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ) : (
          <>
            {note.title && (
              <h3 className="text-lg font-medium text-gray-900 mb-2">{note.title}</h3>
            )}
            <div className="text-gray-700">
              {note.type === 'image' && note.imageUrl && (
                <img
                  src={note.imageUrl}
                  alt=""
                  className="w-full h-48 object-cover rounded mb-2"
                />
              )}
              {note.type === 'list' && note.listItems ? (
                <ul className="space-y-1">
                  {note.listItems.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => {}}
                        className="rounded text-blue-500"
                      />
                      <span className={item.completed ? 'line-through' : ''}>
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>{note.content}</p>
              )}
            </div>
          </>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 border-t border-gray-200">
        {note.type === 'image' && <Image className="h-4 w-4 text-gray-400" />}
        {note.type === 'list' && <ListIcon className="h-4 w-4 text-gray-400" />}
        {isEditing ? (
          <div className="flex flex-wrap gap-2 w-full">
            <button
              onClick={handleSaveEdit}
              className="p-2 rounded-full hover:bg-gray-200 text-green-500"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={handleCancelEdit}
              className="p-2 rounded-full hover:bg-gray-200 text-red-500"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={handleEdit}
              className="p-2 rounded-full hover:bg-gray-200 text-gray-500"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={handleArchive}
              className="p-2 rounded-full hover:bg-gray-200 text-gray-500"
            >
              <Archive className="h-4 w-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 rounded-full hover:bg-gray-200 text-gray-500"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};
