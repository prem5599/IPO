// src/components/Navbar/Navbar.js
'use client';

import { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import debounce from 'lodash/debounce';

// Separate the search functionality into its own component
function SearchBar({ ipoData }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef(null);

  const companies = useMemo(() => {
    const companySet = new Set();
    Object.values(ipoData || {}).forEach(category => {
      category?.forEach(ipo => {
        if (ipo?.company_name) {
          companySet.add({
            name: ipo.company_name,
            symbol: ipo.symbol || '',
            status: ipo.status || ''
          });
        }
      });
    });
    return Array.from(companySet);
  }, [ipoData]);

  const debouncedSearch = useMemo(
    () => debounce((query) => {
      if (!query) {
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

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (companyName) => {
    setSearchQuery(companyName);
    router.push(`/?search=${encodeURIComponent(companyName)}`);
    setShowSuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
    }
  };

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

  return (
    <div 
      ref={searchRef} 
      className={`relative w-full max-w-xl mx-4 ${isFocused ? 'z-50' : ''}`}
    >
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            placeholder="Search IPOs..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border rounded-lg shadow-lg mt-1">
          {suggestions.map((company, index) => (
            <div
              key={index}
              onClick={() => handleSuggestionClick(company.name)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
            >
              <span>{company.name}</span>
              {company.symbol && (
                <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded">
                  {company.symbol}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Main Navbar component
export default function Navbar({ ipoData = {} }) {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          <span className="text-blue-600">IPO</span>
          <span className="text-gray-800">Watch</span>
        </Link>

        <Suspense fallback={
          <div className="w-full max-w-xl mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <div className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-100 animate-pulse">
              </div>
            </div>
          </div>
        }>
          <SearchBar ipoData={ipoData} />
        </Suspense>
      </div>
    </nav>
  );
}