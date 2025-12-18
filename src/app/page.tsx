import { Anton } from 'next/font/google';

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
});

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black-50">
      {/* Logo */}
      <h1 className={`text-5xl text-white-600 ${anton.className}`}>MACROHARD</h1>

      {/* Button */}
      <button className="px-8 py-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition">
        EXCEL
      </button>
    </main>
  );
}
