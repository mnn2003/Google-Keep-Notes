import React, { useState } from 'react';
import { X, Image, List as ListIcon, Check, FilePlus } from 'lucide-react';
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
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setType('image'); // Automatically set type to 'image' when an image is uploaded
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !image) return;

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
      imageUrl: imagePreview || null, // Save the image preview URL in the note
    };

    dispatch({ type: 'ADD_NOTE', payload: newNote });
    setTitle('');
    setContent('');
    setType('text');
    setColor('default');
    setImage(null);
    setImagePreview(null);
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
          onClick={() => setIsExpanded(true)}
          onChange={(e) => setContent(e.target.value)}
          rows={isExpanded ? 3 : 1}
          className="w-full px-4 py-3 bg-transparent border-none resize-none focus:outline-none"
        />
        {imagePreview && (
          <div className="px-4 py-2">
            <img
              src={imagePreview}
              alt="Uploaded Preview"
              className="w-full h-auto rounded-lg"
            />
          </div>
        )}
        {isExpanded && (
          <div className="flex flex-wrap items-center justify-between px-2 py-2 border-t border-gray-200 gap-y-2">
            <div className="flex flex-wrap items-center space-x-2 gap-y-2">
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
              <label
                htmlFor="image-upload"
                className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
              >
                <FilePlus className="h-5 w-5 text-gray-500" />
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              <div className="flex flex-wrap items-center gap-1">
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
            <div className="flex flex-wrap items-center space-x-2 gap-y-2">
              <button
                type="button"
                onClick={() => {
                  setIsExpanded(false);
                  setTitle('');
                  setContent('');
                  setImage(null);
                  setImagePreview(null);
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
