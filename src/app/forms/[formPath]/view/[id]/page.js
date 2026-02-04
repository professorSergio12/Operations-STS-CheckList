'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { API_BASE_URL } from '@/lib/config';

export default function ViewFormPage() {
  const router = useRouter();
  const params = useParams();
  const { formPath, id } = params;

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFormData();
  }, [formPath, id]);

  const fetchFormData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch from list endpoint and find the specific form
      const response = await fetch(
        `${API_BASE_URL}/${formPath}/list`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch form data');
      }

      const result = await response.json();

      if (result.success) {
        const form = result.data.find((f) => f._id === id);
        if (form) {
          setFormData(form);
        } else {
          throw new Error('Form not found');
        }
      } else {
        throw new Error(result.error || 'Failed to fetch form data');
      }
    } catch (err) {
      console.error('Error fetching form data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderFormData = (data, depth = 0) => {
    if (data === null || data === undefined) return <span className="text-gray-500">N/A</span>;
    
    if (typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean') {
      return <span className="text-gray-200">{String(data)}</span>;
    }

    if (Array.isArray(data)) {
      if (data.length === 0) return <span className="text-gray-500">Empty</span>;
      return (
        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={index} className="ml-4 border-l-2 border-gray-600 pl-4">
              {renderFormData(item, depth + 1)}
            </div>
          ))}
        </div>
      );
    }

    if (typeof data === 'object') {
      // Skip MongoDB internal fields
      const skipFields = ['_id', '__v', 'createdAt', 'updatedAt', 'createdBy'];
      const entries = Object.entries(data).filter(([key]) => !skipFields.includes(key));

      if (entries.length === 0) return <span className="text-gray-500">Empty</span>;

      return (
        <div className="space-y-3">
          {entries.map(([key, value]) => (
            <div key={key} className="border-b border-gray-700 pb-2">
              <div className="font-semibold text-blue-400 mb-1 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </div>
              <div className="ml-4">
                {renderFormData(value, depth + 1)}
              </div>
            </div>
          ))}
        </div>
      );
    }

    return <span className="text-gray-500">Unknown type</span>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-400">Loading form data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-900/20 border border-red-600 rounded-lg p-4">
            <p className="text-red-400">Error: {error}</p>
            <button
              onClick={() => router.push(`/forms/${formPath}/list`)}
              className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
            >
              Back to List
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-400">Form not found</p>
            <button
              onClick={() => router.push(`/forms/${formPath}/list`)}
              className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
            >
              Back to List
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <button
              onClick={() => router.push(`/forms/${formPath}/list`)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors mb-4"
            >
              ← Back to List
            </button>
            <h1 className="text-2xl font-bold">View Form Data</h1>
            <p className="text-gray-400 text-sm mt-1">
              Form ID: <span className="font-mono text-blue-400">{id.substring(0, 12)}...</span>
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Created</div>
            <div className="text-gray-200">{formatDate(formData.createdAt)}</div>
            <div className="text-sm text-gray-400 mt-2">Status</div>
            <div className="text-green-400 font-semibold">{formData.status || 'DRAFT'}</div>
          </div>
        </div>

        {/* Form Data Display */}
        <div className="bg-gray-800 rounded-lg shadow-2xl p-6">
          <div className="space-y-4">
            {renderFormData(formData)}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-4 justify-end">
          <button
            onClick={() => router.push(`/forms/${formPath}/list`)}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
          >
            Back to List
          </button>
          <button
            onClick={() => router.push(`/forms/${formPath}/edit/${id}`)}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded transition-colors"
          >
            Edit Form
          </button>
        </div>
      </div>
    </div>
  );
}
