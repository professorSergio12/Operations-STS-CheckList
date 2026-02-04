'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { submitChecklistForm } from '@/lib/api';

// Initial number of rows
const INITIAL_ROWS = 1;

export default function STSHourlyQuantityLog() {
  const [formData, setFormData] = useState({
    // Transfer Info
    transferInfo: {
      dischargingShipName: '',
      receivingShipName: '',
      transferStartDate: new Date().toISOString().split('T')[0],
      jobNumber: '',
    },
    // Hourly Records
    hourlyRecords: new Array(INITIAL_ROWS).fill(null).map((_, index) => ({
      serialNumber: index + 1,
      date: '',
      time: '',
      dischargedQuantity: '',
      receivedQuantity: '',
      differenceQuantity: '',
      checkedBy: '',
    })),
  });

  // Transfer Info handlers
  const handleTransferInfoChange = (field, value) => {
    setFormData({
      ...formData,
      transferInfo: {
        ...formData.transferInfo,
        [field]: value,
      },
    });
  };

  // Hourly Record handlers
  const handleHourlyRecordChange = (index, field, value) => {
    const updatedRecords = [...formData.hourlyRecords];
    updatedRecords[index][field] = value;
    
    // Auto-calculate difference when discharged or received quantity changes
    if (field === 'dischargedQuantity' || field === 'receivedQuantity') {
      const discharged = parseFloat(updatedRecords[index].dischargedQuantity) || 0;
      const received = parseFloat(updatedRecords[index].receivedQuantity) || 0;
      const difference = discharged - received;
      updatedRecords[index].differenceQuantity = isNaN(difference) ? '' : difference.toFixed(2);
    }
    
    setFormData({
      ...formData,
      hourlyRecords: updatedRecords,
    });
  };

  // Add row handler
  const handleAddRow = () => {
    const newSerialNumber = formData.hourlyRecords.length + 1;
    setFormData({
      ...formData,
      hourlyRecords: [
        ...formData.hourlyRecords,
        {
          serialNumber: newSerialNumber,
          date: '',
          time: '',
          dischargedQuantity: '',
          receivedQuantity: '',
          differenceQuantity: '',
          checkedBy: '',
        },
      ],
    });
  };

  // Remove row handler
  const handleRemoveRow = (index) => {
    if (formData.hourlyRecords.length > 1) {
      const updatedRecords = formData.hourlyRecords
        .filter((_, i) => i !== index)
        .map((record, i) => ({
          ...record,
          serialNumber: i + 1,
        }));
      setFormData({
        ...formData,
        hourlyRecords: updatedRecords,
      });
    }
  };

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(false);
      const payload = {
        transferInfo: formData.transferInfo,
        hourlyRecords: formData.hourlyRecords.map((r) => ({
          serialNumber: r.serialNumber,
          date: r.date || null,
          time: r.time || '',
          dischargedQuantity: parseFloat(r.dischargedQuantity) || 0,
          receivedQuantity: parseFloat(r.receivedQuantity) || 0,
          differenceQuantity: parseFloat(r.differenceQuantity) || 0,
          checkedBy: r.checkedBy || '',
        })),
        status: 'DRAFT',
      };
      await submitChecklistForm('ops-ofd-015', payload);
      setSubmitSuccess(true);
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit hourly quantity log.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto bg-gray-800 rounded-lg shadow-2xl p-8">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-8 border-b border-gray-700 pb-6">
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
            <h1 className="text-2xl font-bold mb-2">
              HOURLY CHECKS ON THE DISCHARGED AND RECEIVED QUANTITIES
            </h1>
          </div>
        </div>

        {/* Transfer Information Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">General Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="discharging-ship-name" className="block text-sm mb-1 font-semibold">Discharging Ship's Name:</label>
              <input
                id="discharging-ship-name"
                type="text"
                value={formData.transferInfo.dischargingShipName}
                onChange={(e) => handleTransferInfoChange('dischargingShipName', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label htmlFor="receiving-ship-name" className="block text-sm mb-1 font-semibold">Receiving Ship's Name:</label>
              <input
                id="receiving-ship-name"
                type="text"
                value={formData.transferInfo.receivingShipName}
                onChange={(e) => handleTransferInfoChange('receivingShipName', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label htmlFor="transfer-start-date" className="block text-sm mb-1 font-semibold">Date of commencement of Transfer:</label>
              <input
                id="transfer-start-date"
                type="date"
                value={formData.transferInfo.transferStartDate}
                onChange={(e) => handleTransferInfoChange('transferStartDate', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label htmlFor="job-number" className="block text-sm mb-1 font-semibold">Job No.:</label>
              <input
                id="job-number"
                type="text"
                value={formData.transferInfo.jobNumber}
                onChange={(e) => handleTransferInfoChange('jobNumber', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
          </div>
        </div>

        {/* Hourly Records Table */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Hourly Records</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-600">
              <thead>
                <tr className="bg-gray-700">
                  <th className="border border-gray-600 p-3 text-center">Sr.No.</th>
                  <th className="border border-gray-600 p-3 text-center">Date</th>
                  <th className="border border-gray-600 p-3 text-center">Time</th>
                  <th className="border border-gray-600 p-3 text-center">
                    Discharged Qty
                    <div className="text-xs font-normal mt-1">(barrels / M3 / Lts. / MT)</div>
                  </th>
                  <th className="border border-gray-600 p-3 text-center">
                    Received Qty
                    <div className="text-xs font-normal mt-1">(barrels / M3 / Lts. / MT)</div>
                  </th>
                  <th className="border border-gray-600 p-3 text-center">
                    Difference
                    <div className="text-xs font-normal mt-1">(barrels / M3 / Lts. / MT)</div>
                  </th>
                  <th className="border border-gray-600 p-3 text-center">Checked by (sign)</th>
                </tr>
              </thead>
              <tbody>
                {formData.hourlyRecords.map((record, index) => (
                  <tr key={index} className="hover:bg-gray-700">
                    <td className="border border-gray-600 p-3 text-center font-semibold bg-gray-600">
                      {record.serialNumber}
                    </td>
                    <td className="border border-gray-600 p-2">
                      <input
                        type="date"
                        value={record.date}
                        onChange={(e) => handleHourlyRecordChange(index, 'date', e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                      />
                    </td>
                    <td className="border border-gray-600 p-2">
                      <input
                        type="time"
                        value={record.time}
                        onChange={(e) => handleHourlyRecordChange(index, 'time', e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                      />
                    </td>
                    <td className="border border-gray-600 p-2">
                      <input
                        type="number"
                        step="0.01"
                        value={record.dischargedQuantity}
                        onChange={(e) => handleHourlyRecordChange(index, 'dischargedQuantity', e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                        placeholder="0.00"
                      />
                    </td>
                    <td className="border border-gray-600 p-2">
                      <input
                        type="number"
                        step="0.01"
                        value={record.receivedQuantity}
                        onChange={(e) => handleHourlyRecordChange(index, 'receivedQuantity', e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                        placeholder="0.00"
                      />
                    </td>
                    <td className="border border-gray-600 p-2">
                      <input
                        type="number"
                        step="0.01"
                        value={record.differenceQuantity}
                        readOnly
                        className="w-full bg-gray-700 border border-gray-500 rounded px-2 py-1 text-white text-sm cursor-not-allowed"
                        placeholder="Auto-calculated"
                      />
                    </td>
                    <td className="border border-gray-600 p-2">
                      <input
                        type="text"
                        value={record.checkedBy}
                        onChange={(e) => handleHourlyRecordChange(index, 'checkedBy', e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                        placeholder="Name or signature"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            onClick={handleAddRow}
            className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white text-sm"
          >
            + Add Row
          </button>
        </div>

        {submitError && (
          <div className="mb-4 p-4 bg-red-900/30 border border-red-600 rounded text-red-300 text-sm">{submitError}</div>
        )}
        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit Log'}
          </button>
        </div>
        {submitSuccess && (
          <div className="mt-4 p-4 bg-green-900/30 border border-green-600 rounded text-green-300 text-sm">
            Form submitted successfully.
          </div>
        )}
      </div>
    </div>
  );
}

