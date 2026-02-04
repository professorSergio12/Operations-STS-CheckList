'use client';

import Image from 'next/image';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-6">
          <div className="relative w-48 h-20">
            <Image
              src="/image/logo.png"
              alt="OCEANE GROUP - SHIP-TO-SHIP TRANSFER"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex-1 flex flex-col items-center text-center">
            <h1 className="text-3xl font-bold mb-2">
              STS CHECKLIST MANAGEMENT
            </h1>
            <p className="text-gray-400">Operations Forms Dashboard</p>
          </div>
        </div>
      </div>
    </div>
  );
}
