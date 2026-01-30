'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Search, Calendar, BookOpen, Menu, X, Bell, User } from 'lucide-react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold">Univerzitní Přednášky</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/search" 
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition"
            >
              <Search className="h-4 w-4" />
              <span>Vyhledávání</span>
            </Link>
            <Link 
              href="/schedule" 
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition"
            >
              <Calendar className="h-4 w-4" />
              <span>Můj rozvrh</span>
            </Link>
            <Link 
              href="/universities" 
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Univerzity
            </Link>
            <Link 
              href="/about" 
              className="text-gray-700 hover:text-blue-600 transition"
            >
              O projektu
            </Link>
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 text-gray-700 hover:text-blue-600 transition relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              <User className="h-4 w-4" />
              <span>Přihlásit se</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/search" 
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Search className="h-4 w-4" />
                <span>Vyhledávání</span>
              </Link>
              <Link 
                href="/schedule" 
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Calendar className="h-4 w-4" />
                <span>Můj rozvrh</span>
              </Link>
              <Link 
                href="/universities" 
                className="text-gray-700 hover:text-blue-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Univerzity
              </Link>
              <Link 
                href="/about" 
                className="text-gray-700 hover:text-blue-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                O projektu
              </Link>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full">
                <User className="h-4 w-4" />
                <span>Přihlásit se</span>
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
