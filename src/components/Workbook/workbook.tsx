'use client';

import { useEffect, useRef } from 'react';

export default function Workbook() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Adjustable grid settings
    const cols = 26; // A-Z
    const rows = 50;
    const colWidth = 80;
    const rowHeight = 25;
    const headerHeight = 30;
    const headerWidth = 50;

    canvas.width = headerWidth + cols * colWidth;
    canvas.height = headerHeight + rows * rowHeight;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;

    // Vertical lines
    for (let i = 0; i <= cols; i++) {
      const x = headerWidth + i * colWidth;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // Horizontal lines
    for (let j = 0; j <= rows; j++) {
      const y = headerHeight + j * rowHeight;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Header backgrounds
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, canvas.width, headerHeight); // Column headers row
    ctx.fillRect(0, 0, headerWidth, canvas.height); // Row numbers column

    // Column letters (A, B, ..., Z)
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < cols; i++) {
      const letter = String.fromCharCode(65 + i);
      const x = headerWidth + i * colWidth + colWidth / 2;
      ctx.fillText(letter, x, headerHeight / 2);
    }

    // Row numbers (1, 2, ...)
    ctx.textAlign = 'center';
    for (let j = 0; j < rows; j++) {
      const y = headerHeight + j * rowHeight + rowHeight / 2;
      ctx.fillText((j + 1).toString(), headerWidth / 2, y);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col overflow-hidden">
      {/* Simple Ribbon Placeholder – expand this into your custom MACROHARD Ribbon later */}
      <div className="bg-black border-b-2 border-gray-500 px-6 py-3 flex items-center gap-8">
      <span className="font-bold text-lg text-white">File</span>
        <span className="font-bold text-lg text-white">Home</span>
        <span className="font-bold text-lg text-white">Insert</span>
        <span className="font-bold text-lg text-white">Formulas</span>
        {/* Add macro buttons here */}
      </div>

      {/* The blank spreadsheet grid */}
      <div className="flex-1 overflow-auto bg-white">
        <canvas ref={canvasRef} className="shadow-lg" />
      </div>
    </div>
  );
}