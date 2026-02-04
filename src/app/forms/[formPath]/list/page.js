'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';

import { API_BASE_URL, FORM_TITLES } from '@/lib/config';

export default function FormListPage() {
  const router = useRouter();
  const params = useParams();
  const formPath = params.formPath;
  
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([new Date().getFullYear()]);

  useEffect(() => {
    fetchForms();
  }, [formPath, selectedYear]);

  const fetchForms = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `${API_BASE_URL}/${formPath}/list?year=${selectedYear}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch forms');
      }

      const result = await response.json();
      
      if (result.success) {
        setForms(result.data || []);
        setAvailableYears(result.years || [new Date().getFullYear()]);
      } else {
        throw new Error(result.error || 'Failed to fetch forms');
      }
    } catch (err) {
      console.error('Error fetching forms:', err);
      setError(err.message);
      setForms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (id) => {
    router.push(`/forms/${formPath}/view/${id}`);
  };

  const handleEdit = (id) => {
    router.push(`/forms/${formPath}/edit/${id}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      DRAFT: 'bg-gray-600',
      SUBMITTED: 'bg-yellow-600',
      APPROVED: 'bg-green-600',
      SIGNED: 'bg-blue-600',
      ARCHIVED: 'bg-gray-500',
      FINALIZED: 'bg-purple-600',
      PENDING: 'bg-orange-600',
      PAID: 'bg-green-500',
    };

    return (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${
          statusColors[status] || 'bg-gray-600'
        }`}
      >
        {status || 'DRAFT'}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
            >
              ← Back to Dashboard
            </button>
            <div>
              <h1 className="text-2xl font-bold">
                {FORM_TITLES[formPath] || `Form ${formPath}`}
              </h1>
              <p className="text-gray-400 text-sm mt-1">All submitted forms</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="text-sm text-gray-400">Filter by Year:</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-400">Loading forms...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-900/20 border border-red-600 rounded-lg p-4">
            <p className="text-red-400">Error: {error}</p>
            <button
              onClick={fetchForms}
              className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm"
            >
              Retry
            </button>
          </div>
        )}

        {/* Forms Table */}
        {!loading && !error && (
          <div className="bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
            {forms.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <p>No forms found for this year.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold">ID</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Created Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold w-48">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {forms.map((form) => (
                      <tr key={form._id} className="hover:bg-gray-750 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-mono text-blue-400 text-sm">
                            {form._id?.substring(0, 8)}...
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-200">
                            {formatDate(form.createdAt)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(form.status)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleView(form._id)}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium transition-colors"
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleEdit(form._id)}
                              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded text-sm font-medium transition-colors"
                            >
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
