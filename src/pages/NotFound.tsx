import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Ghost, ArrowLeftCircle } from 'lucide-react';

const NotFound: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(
    localStorage.getItem('theme') as 'light' | 'dark' || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header theme={theme} toggleTheme={toggleTheme} />
      
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4  pt-28">
        <Ghost className="w-24 h-24 text-gray-400 dark:text-gray-600 animate-bounce" />
        <h1 className="text-6xl font-extrabold text-gray-900 dark:text-white mt-6">404</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mt-2">Oops! The page you're looking for doesn't exist.</p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gray-800 text-white dark:bg-gray-600 text-lg font-semibold rounded-lg shadow-md hover:bg-purple-700 transition-all"
        >
          <ArrowLeftCircle className="w-5 h-5" /> Go Home
        </Link>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
