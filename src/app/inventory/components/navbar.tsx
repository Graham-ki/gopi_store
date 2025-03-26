'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/supabase/supabaseClient';
import { FiSearch, FiX } from 'react-icons/fi';

const Navbar = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Search across all relevant tables
  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // Search suppliers
      const { data: suppliers } = await supabase
        .from('suppliers')
        .select('id, name, contact, email')
        .or(`name.ilike.%${query}%,contact.ilike.%${query}%,email.ilike.%${query}%`);

      // Search stock items
      const { data: stockItems } = await supabase
      .from('stock_items')
      .select('id, name, quantity')
      .or(`name.ilike.%${query}%,quantity.ilike.%${query}%`);
        
    console.log('Stock items search results:', stockItems); // Debug log
      // Search stock out records
      const { data: stockOut } = await supabase
        .from('stock_out')
        .select('id, name, quantity, takenby')
        .or(`name.ilike.%${query}%,takenby.ilike.%${query}%`);

      // Search LPOs
      const { data: lpos } = await supabase
        .from('purchase_lpo')
        .select('id, lpo_number, supplier_id, status')
        .or(`lpo_number.ilike.%${query}%,status.ilike.%${query}%`);

      // Combine and format results
      const results = [
        ...(suppliers?.map(s => ({ ...s, type: 'supplier' })) || []),
        ...(stockItems?.map(si => ({ ...si, type: 'stock_item' })) || []),
        ...(stockOut?.map(so => ({ ...so, type: 'stock_out' })) || []),
        ...(lpos?.map(l => ({ ...l, type: 'lpo' })) || [])
      ];

      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        performSearch(searchQuery);
        setShowResults(true);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleResultClick = (result: any) => {
    switch (result.type) {
      case 'supplier':
        router.push(`/suppliers/${result.id}`);
        break;
      case 'stock_item':
        router.push(`/stock-items/${result.id}`);
        break;
      case 'stock_out':
        router.push(`/stock-out/${result.id}`);
        break;
      case 'lpo':
        router.push(`/lpos/${result.id}`);
        break;
      default:
        break;
    }
    setSearchQuery('');
    setShowResults(false);
  };

  const getDisplayText = (result: any) => {
    switch (result.type) {
      case 'supplier':
        return `${result.name} (Supplier)`;
      case 'stock_item':
        return `${result.name} - ${result.quantity} in stock`;
      case 'stock_out':
        return `${result.name} - Taken by ${result.takenby}`;
      case 'lpo':
        return `LPO #${result.lpo_number} - ${result.status}`;
      default:
        return '';
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gray-600 text-white shadow-lg">
      <div className="flex justify-between items-center p-2">
        {/* Title */}
        <div className="text-xl font-bold cursor-pointer pl-4" onClick={() => router.push('/')}>
          MTS Management System
        </div>

        {/* Search Bar */}
        <div className="flex-grow mx-4 relative max-w-xl">
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-300" />
            <input
              type="text"
              placeholder="Search suppliers, inventory, LPOs..."
              className="w-full pl-10 pr-8 py-2 rounded-lg bg-blue-400 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery && setShowResults(true)}
            />
            {searchQuery && (
              <FiX 
                className="absolute right-3 top-3 text-gray-300 cursor-pointer"
                onClick={() => {
                  setSearchQuery('');
                  setShowResults(false);
                }}
              />
            )}
          </div>
          
          {/* Search Results Dropdown */}
          {showResults && searchQuery && (
            <div className="absolute top-full left-0 right-0 bg-white text-black rounded-b-lg shadow-lg max-h-96 overflow-y-auto z-50 border border-gray-200">
              {isSearching ? (
                <div className="p-4 text-center text-gray-500">Searching...</div>
              ) : searchResults.length > 0 ? (
                <ul>
                  {searchResults.map((result) => (
                    <li 
                      key={`${result.type}-${result.id}`}
                      className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100"
                      onClick={() => handleResultClick(result)}
                    >
                      <div className="font-medium">{getDisplayText(result)}</div>
                      <div className="text-xs text-gray-500 mt-1 capitalize">
                        {result.type.replace('_', ' ')}
                        {result.email && ` • ${result.email}`}
                        {result.status && ` • ${result.status}`}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-center text-gray-500">No results found for "{searchQuery}"</div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-2 pr-4">
          <button
            className="px-4 py-2 bg-blue-400 hover:bg-blue-800 rounded-t-lg transition-colors duration-200"
            onClick={() => router.push('/suppliers')}
          >
            Suppliers
          </button>
          <button
            className="px-4 py-2 bg-blue-400 hover:bg-blue-800 rounded-t-lg transition-colors duration-200"
            onClick={() => router.push('/lpos')}
          >
            LPOs
          </button>
          <button
            className="px-4 py-2 bg-blue-400 hover:bg-blue-800 rounded-t-lg transition-colors duration-200"
            onClick={() => router.push('/inventory')}
          >
            Inventory
          </button>
          <button
            className="px-4 py-2 bg-red-700 hover:bg-red-500 rounded-t-lg transition-colors duration-200"
            onClick={handleLogout}
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;