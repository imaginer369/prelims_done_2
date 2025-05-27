'use client';

import { useState } from 'react';
import { Menu, User, Settings, LogOut } from 'lucide-react';

export default function HeaderMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative ml-auto">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-white focus:outline-none"
      >
        <Menu className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
          <button className="flex items-center px-4 py-2 hover:bg-gray-100 w-full">
            <User className="mr-2 h-4 w-4" /> Profile
          </button>
          <button className="flex items-center px-4 py-2 hover:bg-gray-100 w-full">
            <Settings className="mr-2 h-4 w-4" /> Settings
          </button>
          <button className="flex items-center px-4 py-2 hover:bg-gray-100 w-full">
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </button>
        </div>
      )}
    </div>
  );
}

