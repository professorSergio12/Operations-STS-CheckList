'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FORMS } from '@/lib/config';

export default function Dashboard() {
  const router = useRouter();

  const handleViewList = (apiPath) => {
    router.push(`/forms/${apiPath}/list`);
  };

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

        {/* Forms Table */}
        <div className="bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold">Available Forms</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Form Number</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Form Title</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold w-32">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {FORMS.map((form, index) => (
                  <tr
                    key={form.formNo}
                    className="hover:bg-gray-750 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-blue-400">{form.formNo}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-200">{form.title}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleViewList(form.apiPath)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors text-sm font-medium"
                      >
                        View List
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
