import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Terms() {
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      {/* Header with Theme Toggle */}
      <Header theme={theme} toggleTheme={toggleTheme} />

      {/* Terms and Conditions Content */}
      <div className="flex-1 max-w-3xl mx-auto px-6 py-12 text-gray-800 dark:text-gray-300 pt-28">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Terms and Conditions</h1>
        <p className="text-sm mb-4">Effective Date: 30th February 2025</p>

        <p className="mb-4">
          Welcome to <strong>TinyPixel</strong> (TinyPixel.isuru.info). By accessing and using this website, you agree to the following terms and conditions. If you do not agree, please discontinue use immediately.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">1. Use of the Service</h2>
        <ul className="list-disc pl-6">
          <li>TinyPixel is a free web-based tool for compressing images.</li>
          <li>No account or registration is required to use the service.</li>
          <li>You are responsible for ensuring that you have the right to use and process any images uploaded.</li>
          <li>The service is provided "as is" with no guarantees of uptime or availability.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">2. Image Processing & Privacy</h2>
        <ul className="list-disc pl-6">
          <li>All image processing happens on your device (client-side).</li>
          <li>TinyPixel does not upload, store, or collect any images you process.</li>
          <li>We do not claim ownership of any images you use with our tool.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">3. Limitations and Liability</h2>
        <ul className="list-disc pl-6">
          <li>We are not responsible for any loss, damage, or issues resulting from the use of this service.</li>
          <li>TinyPixel is provided as a free tool with no warranties. Use at your own risk.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">4. Changes to Terms</h2>
        <p>We may update these terms from time to time. Continued use of TinyPixel means you accept any modifications.</p>

        <p className="mt-6">For questions, contact us at <a href="mailto:navjeevanalone352@gmail.com" className="text-purple-600 dark:text-purple-400 underline">navjeevanalone352@gmail.com</a>.</p>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Terms;
