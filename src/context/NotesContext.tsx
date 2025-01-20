import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Note, NoteType, NoteColor } from '../types';

interface NotesState {
  notes: Note[];
  searchQuery: string;
  viewType: 'grid' | 'list';
  isLoading: boolean;
  error: string | null;
  showArchived: boolean;
}

type NotesAction =
  | { type: 'SET_NOTES'; payload: Note[] }
  | { type: 'ADD_NOTE'; payload: Note }
  | { type: 'UPDATE_NOTE'; payload: Note }
  | { type: 'DELETE_NOTE'; payload: string }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'TOGGLE_VIEW_TYPE' }
  | { type: 'TOGGLE_ARCHIVED_VIEW' }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' };

const initialState: NotesState = {
  notes: [],
  searchQuery: '',
  viewType: 'grid',
  isLoading: true,
  error: null,
  showArchived: false,
};

const NotesContext = createContext<{
  state: NotesState;
  dispatch: React.Dispatch<NotesAction>;
} | null>(null);

const notesReducer = (state: NotesState, action: NotesAction): NotesState => {
  switch (action.type) {
    case 'SET_NOTES':
      return { ...state, notes: action.payload, isLoading: false };
    case 'ADD_NOTE':
      return { ...state, notes: [action.payload, ...state.notes] };
    case 'UPDATE_NOTE':
      return {
        ...state,
        notes: state.notes.map((note) =>
          note.id === action.payload.id ? action.payload : note
        ),
      };
    case 'DELETE_NOTE':
      return {
        ...state,
        notes: state.notes.filter((note) => note.id !== action.payload),
      };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'TOGGLE_VIEW_TYPE':
      return { ...state, viewType: state.viewType === 'grid' ? 'list' : 'grid' };
    case 'TOGGLE_ARCHIVED_VIEW':
      return { ...state, showArchived: !state.showArchived };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(notesReducer, initialState);

  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem('notes');
      if (savedNotes) {
        dispatch({ type: 'SET_NOTES', payload: JSON.parse(savedNotes) });
      } else {
        dispatch({ type: 'SET_NOTES', payload: [] });
      }
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: 'Failed to load notes from storage',
      });
    }
  }, []);

  useEffect(() => {
    if (!state.isLoading) {
      localStorage.setItem('notes', JSON.stringify(state.notes));
    }
  }, [state.notes, state.isLoading]);

  return (
    <NotesContext.Provider value={{ state, dispatch }}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};