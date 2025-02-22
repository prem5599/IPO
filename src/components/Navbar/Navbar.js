'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import debounce from 'lodash/debounce';
import { createSlug } from '../../lib/utils';

const Navbar = ({ ipoData }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef(null);

  const companies = useMemo(() => {
    if (!ipoData) return [];
    
    const companySet = new Set();
    Object.values(ipoData).forEach(category => {
      if (!Array.isArray(category)) return;
      
      category.forEach(ipo => {
        if (ipo?.name) {
          companySet.add({
            name: ipo.name,
            symbol: ipo.symbol || '',
            status: ipo.status || '',
            slug: createSlug(ipo.name)
          });
        }
      });
    });
    return Array.from(companySet);
  }, [ipoData]);

  const debouncedSearch = useMemo(
    () => debounce((query) => {
      if (!query.trim()) {
        setSuggestions([]);
        return;
      }
      const inputValue = query.toLowerCase();
      const filtered = companies
        .filter(company => 
          company.name.toLowerCase().includes(inputValue) ||
          company.symbol?.toLowerCase().includes(inputValue)
        )
        .slice(0, 5);
      setSuggestions(filtered);
    }, 300),
    [companies]
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => debouncedSearch.cancel();
  }, [searchQuery, debouncedSearch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (company) => {
    router.push(`/ipo/${company.slug}`);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() && suggestions.length > 0) {
      handleSuggestionClick(suggestions[0]);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-black/[0.08] backdrop-blur">
      <div className="max-w-[1400px] mx-auto px-6 py-3 md:px-4">
        <div className="flex justify-between items-center gap-8">
          <Link href="/" className="text-decoration-none">
            <div className="text-2xl font-bold tracking-tight">
              <span className="text-blue-600">IPO</span>
              <span className="text-slate-800">Page</span>
            </div>
          </Link>

          <div 
            className="relative flex-1 max-w-[600px] transition-all duration-200"
            ref={searchRef}
          >
            <form onSubmit={handleSubmit} className="w-full">
              <div className={`flex items-center bg-slate-50 border-2 ${
                isFocused 
                  ? 'border-blue-600 bg-white shadow-lg shadow-blue-600/10' 
                  : 'border-blue-600/20'
              } rounded-xl px-4 py-3 transition-all duration-200`}>
                <Search size={20} className="text-slate-500 mr-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleInputChange}
                  onFocus={() => setIsFocused(true)}
                  placeholder="Search for IPOs..."
                  className="w-full bg-transparent text-base text-slate-800 placeholder-slate-400 outline-none border-none focus:ring-0 focus:outline-none"
                  aria-label="Search IPOs"
                />
              </div>
            </form>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-xl border border-black/5 overflow-hidden animate-slideDown">
                {suggestions.map((company, index) => (
                  <div
                    key={index}
                    className="px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors duration-200"
                    onClick={() => handleSuggestionClick(company)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-slate-800">
                          {company.name}
                        </span>
                        {company.symbol && (
                          <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded">
                            {company.symbol}
                          </span>
                        )}
                      </div>
                      {company.status && (
                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded font-medium">
                          {company.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;