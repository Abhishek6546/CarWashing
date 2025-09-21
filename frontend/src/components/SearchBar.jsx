import { useState, useEffect } from 'react';
import { Search, X, Zap } from 'lucide-react';

const SearchBar = ({ onSearch, placeholder = "Search by customer name or car details..." }) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        setIsSearching(true);

        onSearch(query.trim())
          .finally(() => setIsSearching(false));
      } else {
        onSearch('');
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, onSearch]);

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="relative">
      {/* Main Search Input */}
      <div className={`relative transition-all duration-300 ${isFocused ? 'transform -translate-y-1' : ''}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        <div className={`relative bg-white/90 backdrop-blur-sm rounded-xl border transition-all duration-200 ${
          isFocused 
            ? 'border-blue-300 shadow-lg shadow-blue-500/25' 
            : 'border-white/20 shadow-md hover:shadow-lg hover:border-blue-200'
        }`}>
          <div className="flex items-center">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className={`h-5 w-5 transition-all duration-200 ${
                isSearching 
                  ? 'text-blue-500 animate-pulse' 
                  : isFocused 
                  ? 'text-blue-500' 
                  : 'text-gray-400'
              }`} />
            </div>
            
            <input
              type="text"
              className="w-full pl-12 pr-12 py-4 bg-transparent rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 transition-all duration-200"
              placeholder={placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            />
            
            {query && (
              <button
                onClick={handleClear}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-red-500 transition-all duration-200 hover:scale-110"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>

    
    </div>
  );
};

export default SearchBar;
