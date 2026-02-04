'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { API_BASE_URL } from '@/lib/config';

export default function EditFormPage() {
  const router = useRouter();
  const params = useParams();
  const { formPath, id } = params;

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchFormData();
  }, [formPath, id]);

  const fetchFormData = async () => {
    try {
      setLoading(true);
      setError(null);

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

  const handleInputChange = (path, value) => {
    setFormData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        // Handle array indices
        if (!isNaN(key) && Array.isArray(current)) {
          const index = parseInt(key, 10);
          if (!current[index]) {
            current[index] = {};
          }
          current = current[index];
        } else {
          if (!current[key]) {
            current[key] = {};
          }
          current = current[key];
        }
      }
      
      const lastKey = keys[keys.length - 1];
      if (!isNaN(lastKey) && Array.isArray(current)) {
        const index = parseInt(lastKey, 10);
        current[index] = value;
      } else {
        current[lastKey] = value;
      }
      
      return newData;
    });
  };

  const handleArrayItemChange = (arrayPath, index, field, value) => {
    setFormData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      const keys = arrayPath.split('.');
      let current = newData;
      
      for (const key of keys) {
        current = current[key];
      }
      
      if (current[index]) {
        current[index][field] = value;
      }
      
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      // Prepare form data for submission
      const formDataToSend = new FormData();
      
      // Remove MongoDB internal fields
      const cleanData = JSON.parse(JSON.stringify(formData));
      delete cleanData._id;
      delete cleanData.__v;
      delete cleanData.createdAt;
      delete cleanData.updatedAt;
      delete cleanData.createdBy;

      formDataToSend.append('data', JSON.stringify(cleanData));

      // Handle signature file if it's a new file upload
      // For now, we'll keep existing signature URLs as-is
      // You can add file input handling here if needed

      const response = await fetch(
        `${API_BASE_URL}/${formPath}/${id}/update`,
        {
          method: 'POST',
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update form');
      }

      const result = await response.json();
      setSuccess(true);
      
      // Redirect to view page after a short delay
      setTimeout(() => {
        router.push(`/forms/${formPath}/view/${id}`);
      }, 1500);
    } catch (err) {
      console.error('Error updating form:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const renderEditableField = (label, path, value, type = 'text') => {
    const displayPath = path.split('.').pop();
    
    if (type === 'date') {
      const dateValue = value ? new Date(value).toISOString().split('T')[0] : '';
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1 capitalize">
            {label || displayPath.replace(/([A-Z])/g, ' $1').trim()}
          </label>
          <input
            type="date"
            value={dateValue}
            onChange={(e) => handleInputChange(path, e.target.value ? new Date(e.target.value).toISOString() : '')}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
          />
        </div>
      );
    }

    if (type === 'textarea') {
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1 capitalize">
            {label || displayPath.replace(/([A-Z])/g, ' $1').trim()}
          </label>
          <textarea
            value={value || ''}
            onChange={(e) => handleInputChange(path, e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
            rows={4}
          />
        </div>
      );
    }

    if (type === 'select') {
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1 capitalize">
            {label || displayPath.replace(/([A-Z])/g, ' $1').trim()}
          </label>
          <select
            value={value || ''}
            onChange={(e) => handleInputChange(path, e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
          >
            <option value="">Select...</option>
            {['DRAFT', 'SUBMITTED', 'APPROVED', 'SIGNED', 'ARCHIVED', 'FINALIZED', 'PENDING', 'PAID'].map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      );
    }

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-1 capitalize">
          {label || displayPath.replace(/([A-Z])/g, ' $1').trim()}
        </label>
        <input
          type={type}
          value={value || ''}
          onChange={(e) => handleInputChange(path, e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
        />
      </div>
    );
  };

  const renderEditableObject = (obj, prefix = '') => {
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return null;

    const skipFields = ['_id', '__v', 'createdAt', 'updatedAt', 'createdBy', 'signature', 'signatureBlock', 'signatureImage', 'stampImage', 'shipStampImage', 'mooringMasterSignature'];
    
    return Object.entries(obj).map(([key, value]) => {
      if (skipFields.includes(key)) return null;
      
      const path = prefix ? `${prefix}.${key}` : key;
      
      if (value === null || value === undefined) {
        return renderEditableField(key, path, '', 'text');
      }
      
      if (typeof value === 'string') {
        if (value.match(/^\d{4}-\d{2}-\d{2}/)) {
          return renderEditableField(key, path, value, 'date');
        }
        if (value.length > 100) {
          return renderEditableField(key, path, value, 'textarea');
        }
        return renderEditableField(key, path, value, 'text');
      }
      
      if (typeof value === 'number') {
        return renderEditableField(key, path, value, 'number');
      }
      
      if (typeof value === 'boolean') {
        return (
          <div key={key} className="mb-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => handleInputChange(path, e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium text-gray-300 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
            </label>
          </div>
        );
      }
      
      if (Array.isArray(value)) {
        return (
          <div key={key} className="mb-6 border border-gray-700 rounded p-4">
            <h3 className="text-lg font-semibold text-blue-400 mb-4 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()} ({value.length} items)
            </h3>
            {value.map((item, index) => (
              <div key={index} className="mb-4 border-l-2 border-gray-600 pl-4">
                <div className="text-xs text-gray-500 mb-2 font-semibold">Item {index + 1}</div>
                {typeof item === 'object' && item !== null && !Array.isArray(item)
                  ? renderEditableObject(item, `${path}.${index}`)
                  : typeof item === 'object' && Array.isArray(item)
                  ? (
                    <div className="text-gray-400 text-sm">Nested arrays not editable</div>
                  )
                  : renderEditableField(`${key}[${index}]`, `${path}.${index}`, item)}
              </div>
            ))}
          </div>
        );
      }
      
      if (typeof value === 'object') {
        return (
          <div key={key} className="mb-6 border border-gray-700 rounded p-4">
            <h3 className="text-lg font-semibold text-blue-400 mb-4 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </h3>
            {renderEditableObject(value, path)}
          </div>
        );
      }
      
      return null;
    }).filter(Boolean);
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

  if (error && !formData) {
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
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push(`/forms/${formPath}/list`)}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors mb-4"
          >
            ← Back to List
          </button>
          <h1 className="text-2xl font-bold">Edit Form</h1>
          <p className="text-gray-400 text-sm mt-1">
            Form ID: <span className="font-mono text-blue-400">{id.substring(0, 12)}...</span>
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-900/20 border border-green-600 rounded-lg p-4 mb-6">
            <p className="text-green-400">Form updated successfully! Redirecting...</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/20 border border-red-600 rounded-lg p-4 mb-6">
            <p className="text-red-400">Error: {error}</p>
          </div>
        )}

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg shadow-2xl p-6">
          {/* Status Field */}
          {renderEditableField('Status', 'status', formData.status, 'select')}

          {/* Render all editable fields */}
          <div className="space-y-6">
            {renderEditableObject(formData)}
          </div>

          {/* Submit Buttons */}
          <div className="mt-8 flex gap-4 justify-end border-t border-gray-700 pt-6">
            <button
              type="button"
              onClick={() => router.push(`/forms/${formPath}/view/${id}`)}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Update Form'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
