'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { submitChecklistForm } from '@/lib/api';

// Predefined activities for STS Operation Timings
const PREDEFINED_ACTIVITIES = [
  'COMM SHORE MOBILISATION',
  'SUPPORT CRAFT SAILS',
  'M/M ONBOARD',
  'COMM MOB EQUIPMENT ON VESSEL',
  'COMM RUN IN',
  'MOORING',
  'HOSES CONNECTION',
  'CARGO OPERATION',
  'HOSE DISCONNECTION',
  'FIGURES / DOCUMENTS ETC',
  'UNMOORING',
  'COMM DEMOB EQUIPMENT',
  'SUPPORT CRAFT DEPARTS VESSEL',
  'SHORE DEMOBILISATION',
];

// Initial number of rows for additional activities
const INITIAL_ADDITIONAL_ROWS = 1;

export default function STSTimesheet() {
  const [formData, setFormData] = useState({
    // Document Info
    documentInfo: {
      formNo: 'OPS-OFD-018',
      issueDate: new Date().toISOString().split('T')[0],
      approvedBy: 'JS',
    },
    // Basic Info
    basicInfo: {
      stsSuperintendent: '',
      jobNumber: '',
      receivingVessel: '',
      dischargingVessel: '',
      supportCraftMobDemob: '',
      location: '',
    },
    // Operation Timings (predefined activities)
    operationTimings: PREDEFINED_ACTIVITIES.map(activity => ({
      activityName: activity,
      fromDate: '',
      fromTime: '',
      toDate: '',
      toTime: '',
      remarks: '',
    })),
    // Additional Activities
    additionalActivities: new Array(INITIAL_ADDITIONAL_ROWS).fill(null).map(() => ({
      activityName: '',
      fromDate: '',
      fromTime: '',
      toDate: '',
      toTime: '',
      remarks: '',
    })),
    // Weather Delay
    weatherDelay: {
      sea: '',
      swell: '',
      wind: '',
      totalExposureHours: '',
    },
    // Cargo Info
    cargoInfo: {
      cargoName: '',
      cargoQuantity: '',
      cargoPumpingTime: '',
    },
    // Final Remarks
    finalRemarks: '',
  });

  // Basic Info handlers
  const handleBasicInfoChange = (field, value) => {
    setFormData({
      ...formData,
      basicInfo: {
        ...formData.basicInfo,
        [field]: value,
      },
    });
  };

  // Operation Timings handlers
  const handleOperationTimingChange = (index, field, value) => {
    const updatedTimings = [...formData.operationTimings];
    updatedTimings[index][field] = value;
    setFormData({
      ...formData,
      operationTimings: updatedTimings,
    });
  };

  // Additional Activities handlers
  const handleAdditionalActivityChange = (index, field, value) => {
    const updatedActivities = [...formData.additionalActivities];
    updatedActivities[index][field] = value;
    setFormData({
      ...formData,
      additionalActivities: updatedActivities,
    });
  };

  // Add additional activity row
  const handleAddAdditionalActivityRow = () => {
    setFormData({
      ...formData,
      additionalActivities: [
        ...formData.additionalActivities,
        {
          activityName: '',
          fromDate: '',
          fromTime: '',
          toDate: '',
          toTime: '',
          remarks: '',
        },
      ],
    });
  };

  // Remove additional activity row
  const handleRemoveAdditionalActivityRow = (index) => {
    if (formData.additionalActivities.length > 1) {
      const updatedActivities = formData.additionalActivities.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        additionalActivities: updatedActivities,
      });
    }
  };

  // Weather Delay handlers
  const handleWeatherDelayChange = (field, value) => {
    setFormData({
      ...formData,
      weatherDelay: {
        ...formData.weatherDelay,
        [field]: value,
      },
    });
  };

  // Cargo Info handlers
  const handleCargoInfoChange = (field, value) => {
    setFormData({
      ...formData,
      cargoInfo: {
        ...formData.cargoInfo,
        [field]: value,
      },
    });
  };

  // Final Remarks handler
  const handleFinalRemarksChange = (value) => {
    setFormData({
      ...formData,
      finalRemarks: value,
    });
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
        documentInfo: formData.documentInfo,
        basicInfo: formData.basicInfo,
        operationTimings: formData.operationTimings,
        additionalActivities: formData.additionalActivities,
        weatherDelay: formData.weatherDelay,
        cargoInfo: formData.cargoInfo,
        finalRemarks: formData.finalRemarks,
        status: 'DRAFT',
      };
      await submitChecklistForm('ops-ofd-018', payload);
      setSubmitSuccess(true);
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit timesheet.');
    } finally {
      setSubmitting(false);
    }
  };

  // Render timing row
  const renderTimingRow = (row, index, isAdditional = false) => {
    const handleChange = isAdditional ? handleAdditionalActivityChange : handleOperationTimingChange;

    return (
      <tr key={index} className="hover:bg-gray-700">
        <td className="border border-gray-600 p-2">
          {isAdditional ? (
            <input
              type="text"
              value={row.activityName}
              onChange={(e) => handleChange(index, 'activityName', e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
              placeholder="Activity name"
            />
          ) : (
            <span className="text-sm font-semibold">{row.activityName}</span>
          )}
        </td>
        <td className="border border-gray-600 p-2">
          <input
            type="date"
            value={row.fromDate}
            onChange={(e) => handleChange(index, 'fromDate', e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
          />
        </td>
        <td className="border border-gray-600 p-2">
          <input
            type="time"
            value={row.fromTime}
            onChange={(e) => handleChange(index, 'fromTime', e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
          />
        </td>
        <td className="border border-gray-600 p-2">
          <input
            type="date"
            value={row.toDate}
            onChange={(e) => handleChange(index, 'toDate', e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
          />
        </td>
        <td className="border border-gray-600 p-2">
          <input
            type="time"
            value={row.toTime}
            onChange={(e) => handleChange(index, 'toTime', e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
          />
        </td>
        <td className="border border-gray-600 p-2">
          <input
            type="text"
            value={row.remarks}
            onChange={(e) => handleChange(index, 'remarks', e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
            placeholder="Remarks"
          />
        </td>
      </tr>
    );
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
              TIMESHEET
            </h1>
          </div>
          <div className="bg-gray-700 p-4 rounded min-w-[200px]">
            <div className="text-sm space-y-1">
              <div><strong>Form No:</strong> {formData.documentInfo.formNo}</div>
              <div><strong>Issue Date:</strong> {formData.documentInfo.issueDate}</div>
              <div><strong>Approved by:</strong> {formData.documentInfo.approvedBy}</div>
            </div>
          </div>
        </div>

        {/* Basic Info Section */}
        <div className="mb-8">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="sts-superintendent" className="block text-sm mb-1 font-semibold">STS SUPERINTENDENT:</label>
              <input
                id="sts-superintendent"
                type="text"
                value={formData.basicInfo.stsSuperintendent}
                onChange={(e) => handleBasicInfoChange('stsSuperintendent', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label htmlFor="job-number" className="block text-sm mb-1 font-semibold">JOB No.:</label>
              <input
                id="job-number"
                type="text"
                value={formData.basicInfo.jobNumber}
                onChange={(e) => handleBasicInfoChange('jobNumber', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="receiving-vessel" className="block text-sm mb-1 font-semibold">RECEIVING VESSEL:</label>
              <input
                id="receiving-vessel"
                type="text"
                value={formData.basicInfo.receivingVessel}
                onChange={(e) => handleBasicInfoChange('receivingVessel', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label htmlFor="discharging-vessel" className="block text-sm mb-1 font-semibold">DISCHARGING VESSEL:</label>
              <input
                id="discharging-vessel"
                type="text"
                value={formData.basicInfo.dischargingVessel}
                onChange={(e) => handleBasicInfoChange('dischargingVessel', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label htmlFor="support-craft" className="block text-sm mb-1 font-semibold">SUPPORT CRAFT USED FOR MOB / DEMOB:</label>
              <input
                id="support-craft"
                type="text"
                value={formData.basicInfo.supportCraftMobDemob}
                onChange={(e) => handleBasicInfoChange('supportCraftMobDemob', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm mb-1 font-semibold">LOCATION:</label>
              <input
                id="location"
                type="text"
                value={formData.basicInfo.location}
                onChange={(e) => handleBasicInfoChange('location', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
          </div>
        </div>

        {/* STS Operation Timings Table */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">STS OPERATION TIMINGS</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-600">
              <thead>
                <tr className="bg-gray-700">
                  <th className="border border-gray-600 p-3 text-left">Activities</th>
                  <th colSpan="2" className="border border-gray-600 p-3 text-center">From</th>
                  <th colSpan="2" className="border border-gray-600 p-3 text-center">To</th>
                  <th className="border border-gray-600 p-3 text-left">REMARKS</th>
                </tr>
                <tr className="bg-gray-700">
                  <th className="border border-gray-600 p-2"></th>
                  <th className="border border-gray-600 p-2 text-center">Date</th>
                  <th className="border border-gray-600 p-2 text-center">Time</th>
                  <th className="border border-gray-600 p-2 text-center">Date</th>
                  <th className="border border-gray-600 p-2 text-center">Time</th>
                  <th className="border border-gray-600 p-2"></th>
                </tr>
              </thead>
              <tbody>
                {formData.operationTimings.map((row, index) => renderTimingRow(row, index, false))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Additional Activity Table */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">ADDITIONAL ACTIVITY</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-600">
              <thead>
                <tr className="bg-gray-700">
                  <th className="border border-gray-600 p-3 text-left">Activities</th>
                  <th colSpan="2" className="border border-gray-600 p-3 text-center">FROM</th>
                  <th colSpan="2" className="border border-gray-600 p-3 text-center">TO</th>
                  <th className="border border-gray-600 p-3 text-left">REMARKS</th>
                </tr>
                <tr className="bg-gray-700">
                  <th className="border border-gray-600 p-2"></th>
                  <th className="border border-gray-600 p-2 text-center">Date</th>
                  <th className="border border-gray-600 p-2 text-center">Time</th>
                  <th className="border border-gray-600 p-2 text-center">Date</th>
                  <th className="border border-gray-600 p-2 text-center">Time</th>
                  <th className="border border-gray-600 p-2"></th>
                </tr>
              </thead>
              <tbody>
                {formData.additionalActivities.map((row, index) => renderTimingRow(row, index, true))}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            onClick={handleAddAdditionalActivityRow}
            className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white text-sm"
          >
            + Add Row
          </button>
        </div>

        {/* Weather Delay and Cargo Info Section */}
        <div className="mb-8 grid grid-cols-2 gap-6">
          {/* Weather Delay */}
          <div>
            <h2 className="text-lg font-semibold mb-4">SIGNIFICANT WEATHER WHICH CAUSED DELAY</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="sea" className="block text-sm mb-1 font-semibold">SEA:</label>
                <input
                  id="sea"
                  type="text"
                  value={formData.weatherDelay.sea}
                  onChange={(e) => handleWeatherDelayChange('sea', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                />
              </div>
              <div>
                <label htmlFor="swell" className="block text-sm mb-1 font-semibold">SWELL:</label>
                <input
                  id="swell"
                  type="text"
                  value={formData.weatherDelay.swell}
                  onChange={(e) => handleWeatherDelayChange('swell', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                />
              </div>
              <div>
                <label htmlFor="wind" className="block text-sm mb-1 font-semibold">WIND:</label>
                <input
                  id="wind"
                  type="text"
                  value={formData.weatherDelay.wind}
                  onChange={(e) => handleWeatherDelayChange('wind', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                />
              </div>
              <div>
                <label htmlFor="total-exposure-hours" className="block text-sm mb-1 font-semibold">TOTAL EXPOSURE HOURS:</label>
                <input
                  id="total-exposure-hours"
                  type="number"
                  step="0.01"
                  value={formData.weatherDelay.totalExposureHours}
                  onChange={(e) => handleWeatherDelayChange('totalExposureHours', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                />
              </div>
            </div>
          </div>

          {/* Cargo Info */}
          <div>
            <h2 className="text-lg font-semibold mb-4">CARGO</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="cargo-name" className="block text-sm mb-1 font-semibold">CARGO:</label>
                <input
                  id="cargo-name"
                  type="text"
                  value={formData.cargoInfo.cargoName}
                  onChange={(e) => handleCargoInfoChange('cargoName', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                />
              </div>
              <div>
                <label htmlFor="cargo-quantity" className="block text-sm mb-1 font-semibold">QUANTITY:</label>
                <input
                  id="cargo-quantity"
                  type="text"
                  value={formData.cargoInfo.cargoQuantity}
                  onChange={(e) => handleCargoInfoChange('cargoQuantity', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                />
              </div>
              <div>
                <label htmlFor="cargo-pumping-time" className="block text-sm mb-1 font-semibold">CARGO PUMPING TIME:</label>
                <input
                  id="cargo-pumping-time"
                  type="text"
                  value={formData.cargoInfo.cargoPumpingTime}
                  onChange={(e) => handleCargoInfoChange('cargoPumpingTime', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Final Remarks Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">EQUIPMENT / OPERATIONAL / INCIDENT / DELAYS ETC, REMARKS</h2>
          <div className="space-y-3">
            <textarea
              value={formData.finalRemarks}
              onChange={(e) => handleFinalRemarksChange(e.target.value)}
              rows={4}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
              placeholder="Enter remarks..."
            />
          </div>
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
            {submitting ? 'Submitting...' : 'Submit Timesheet'}
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

