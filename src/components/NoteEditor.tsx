import React, { useState } from 'react';
import { X, Image, List as ListIcon, Check } from 'lucide-react';
import { useNotes } from '../context/NotesContext';
import { Note, NoteType, NoteColor } from '../types';

const colorOptions: { color: NoteColor; bg: string }[] = [
  { color: 'default', bg: 'bg-white' },
  { color: 'red', bg: 'bg-red-100' },
  { color: 'orange', bg: 'bg-orange-100' },
  { color: 'yellow', bg: 'bg-yellow-100' },
  { color: 'green', bg: 'bg-green-100' },
  { color: 'blue', bg: 'bg-blue-100' },
  { color: 'purple', bg: 'bg-purple-100' },
  { color: 'pink', bg: 'bg-pink-100' },
];

export const NoteEditor: React.FC = () => {
  const { dispatch } = useNotes();
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<NoteType>('text');
  const [color, setColor] = useState<NoteColor>('default');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const newNote: Note = {
      id: Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      type,
      color,
      isPinned: false,
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      labels: [],
    };

    dispatch({ type: 'ADD_NOTE', payload: newNote });
    setTitle('');
    setContent('');
    setType('text');
    setColor('default');
    setIsExpanded(false);
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 px-4">
      <form
        onSubmit={handleSubmit}
        className={`relative rounded-lg border border-gray-300 shadow-sm ${
          colorOptions.find((opt) => opt.color === color)?.bg
        }`}
      >
        {isExpanded && (
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 pt-3 pb-2 bg-transparent border-none focus:outline-none text-lg font-medium"
          />
        )}
        <textarea
          placeholder="Take a note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onClick={() => setIsExpanded(true)}
          rows={isExpanded ? 3 : 1}
          className="w-full px-4 py-3 bg-transparent border-none resize-none focus:outline-none"
        />
        {isExpanded && (
          <div className="flex items-center justify-between px-2 py-2 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setType('text')}
                className={`p-2 rounded-full hover:bg-gray-100 ${
                  type === 'text' ? 'bg-gray-100' : ''
                }`}
              >
                <Check className="h-5 w-5 text-gray-500" />
              </button>
              <button
                type="button"
                onClick={() => setType('list')}
                className={`p-2 rounded-full hover:bg-gray-100 ${
                  type === 'list' ? 'bg-gray-100' : ''
                }`}
              >
                <ListIcon className="h-5 w-5 text-gray-500" />
              </button>
              <button
                type="button"
                onClick={() => setType('image')}
                className={`p-2 rounded-full hover:bg-gray-100 ${
                  type === 'image' ? 'bg-gray-100' : ''
                }`}
              >
                <Image className="h-5 w-5 text-gray-500" />
              </button>
              <div className="flex items-center space-x-1">
                {colorOptions.map((option) => (
                  <button
                    key={option.color}
                    type="button"
                    onClick={() => setColor(option.color)}
                    className={`w-6 h-6 rounded-full ${
                      option.bg
                    } border border-gray-300 ${
                      color === option.color ? 'ring-2 ring-blue-500' : ''
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => {
                  setIsExpanded(false);
                  setTitle('');
                  setContent('');
                }}
                className="px-4 py-1 text-sm text-gray-500 hover:bg-gray-100 rounded"
              >
                Close
              </button>
              <button
                type="submit"
                className="px-4 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};