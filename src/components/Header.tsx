import React from 'react';
import { Menu, Search, Grid, List, Archive } from 'lucide-react';
import { useNotes } from '../context/NotesContext';

export const Header: React.FC = () => {
  const { state, dispatch } = useNotes();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button className="p-2 rounded-full hover:bg-gray-100 md:hidden">
              <Menu className="h-6 w-6 text-gray-500" />
            </button>
            <h1 className="ml-4 text-xl font-semibold text-gray-900 truncate">
              {state.showArchived ? 'Archived Notes' : 'Keep Notes'}
            </h1>
          </div>

          <div className="flex-1 max-w-2xl mx-4 lg:mx-8 hidden md:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search notes"
                value={state.searchQuery}
                onChange={(e) =>
                  dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value })
                }
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => dispatch({ type: 'TOGGLE_ARCHIVED_VIEW' })}
              className={`p-2 rounded-full hover:bg-gray-100 ${
                state.showArchived ? 'bg-blue-100 text-blue-600' : 'text-gray-500'
              }`}
              title={state.showArchived ? 'Show active notes' : 'Show archived notes'}
            >
              <Archive className="h-6 w-6" />
            </button>
            <button
              onClick={() => dispatch({ type: 'TOGGLE_VIEW_TYPE' })}
              className="p-2 rounded-full hover:bg-gray-100"
              title={state.viewType === 'grid' ? 'Show as list' : 'Show as grid'}
            >
              {state.viewType === 'grid' ? (
                <List className="h-6 w-6 text-gray-500" />
              ) : (
                <Grid className="h-6 w-6 text-gray-500" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search notes"
              value={state.searchQuery}
              onChange={(e) =>
                dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value })
              }
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
