'use client';

import { useState } from 'react';
import { Anton } from 'next/font/google';
import Workbook from '@/components/Workbook/workbook'; // Adjust path if needed

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
});

export default function Home() {
  const [showWorkbook, setShowWorkbook] = useState(false);

  if (showWorkbook) {
    return <Workbook />;
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <h1 className={`text-7xl text-white mb-16 ${anton.className}`}>MACROHARD</h1>
      
      <button
        onClick={() => setShowWorkbook(true)}
        className="px-16 py-8 bg-green-600 text-white text-4xl font-bold rounded-xl hover:bg-green-700 transition shadow-2xl"
      >
        EXCEL
      </button>
    </main>
  );
}