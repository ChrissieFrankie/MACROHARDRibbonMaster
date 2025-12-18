export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      {/* Logo */}
      <h1 className="text-5xl font-extrabold text-blue-600 mb-10">MACROHARD</h1>

      {/* Button */}
      <button className="px-8 py-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition">
        Excel
      </button>
    </main>
  );
}
