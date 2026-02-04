'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { submitChecklistForm } from '@/lib/api';

const GENERIC_CHECKS = [
  { id: 1, description: 'A copy of the JPO has been received', remark: '' },
  { id: 2, description: 'Effective communications are established', remark: 'Note the agreed working language in CL 4F' },
  { id: 3, description: 'Ship handling characteristics exchanged', remark: '' },
  { id: 4, description: 'The ship is upright at a suitable trim, without any overhanging projections', remark: '' },
  { id: 5, description: 'Maneuvering, mooring and navigational equipment has been tested and found in good order', remark: 'Not applicable if moored' },
  { id: 6, description: 'Engineers have been briefed on engine speed (and speed adjustment) requirements', remark: 'Not applicable if moored' },
  { id: 7, description: 'Main engine(s) are available without any power limitations', remark: '' },
  { id: 8, description: 'Weather forecasts have been reviewed and will be monitored', remark: '' },
  { id: 9, description: 'Crew briefed on the mooring procedure and JPO', remark: '' },
  { id: 10, description: 'STS contingency plan agreed and an appropriate emergency drill has been conducted', remark: '' },
  { id: 11, description: 'Notifications required by local regulations are sent', remark: '' },
];

export default function BeforeOperationCommenceChecklist() {
  const [formData, setFormData] = useState({
    formNo: 'OPS-OFD-001',
    issueDate: new Date().toISOString().split('T')[0],
    approvedBy: 'JS',
    // Operation Details
    vesselName: '',
    shipsOperator: '',
    charterer: '',
    stsOrganizer: '',
    plannedDateAndTime: '',
    transferLocation: '',
    cargo: '',
    constantHeadingShip: '',
    maneuveringShip: '',
    poacStsSuperintendent: '',
    applicableSpecificJointPlanOperation: '',
    // Generic Checks
    genericChecks: GENERIC_CHECKS.map(check => ({
      id: check.id,
      description: check.description,
      status: false,
      remark: check.remark,
      userRemark: '',
    })),
    // Signature
    signature: {
      name: '',
      rank: '',
      signature: '',
      date: '',
    },
  });

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleChecklistChange = (index, checked) => {
    const updatedChecks = [...formData.genericChecks];
    updatedChecks[index].status = checked;
    setFormData({ ...formData, genericChecks: updatedChecks });
  };

  const handleRemarkChange = (index, value) => {
    const updatedChecks = [...formData.genericChecks];
    updatedChecks[index].userRemark = value;
    setFormData({ ...formData, genericChecks: updatedChecks });
  };

  const handleSignatureChange = (field, value) => {
    setFormData({
      ...formData,
      signature: {
        ...formData.signature,
        [field]: value,
      },
    });
  };

  const handleSignatureUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        handleSignatureChange('signature', base64String);
      };
      reader.readAsDataURL(file);
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
        formNo: formData.formNo || 'OPS-OFD-001',
        revisionNo: formData.revisionNo || '',
        revisionDate: formData.issueDate || null,
        approvedBy: formData.approvedBy,
        page: '',
        vesselName: formData.vesselName,
        shipsOperator: formData.shipsOperator,
        charterer: formData.charterer,
        stsOrganizer: formData.stsOrganizer,
        plannedDateAndTime: formData.plannedDateAndTime || null,
        transferLocation: formData.transferLocation,
        cargo: formData.cargo,
        constantHeadingShip: formData.constantHeadingShip,
        maneuveringShip: formData.maneuveringShip,
        poacStsSuperintendent: formData.poacStsSuperintendent,
        applicableSpecificJointPlanOperation: formData.applicableSpecificJointPlanOperation,
        genericChecks: formData.genericChecks.map((c) => ({
          id: c.id,
          clNumber: c.id,
          description: c.description,
          status: c.status,
          notApplicable: false,
          remarks: c.remark || '',
          userRemark: c.userRemark || '',
        })),
        signature: {
          name: formData.signature.name,
          rank: formData.signature.rank,
          date: formData.signature.date || null,
        },
        signatureBlock: {
          signature: formData.signature.signature || '',
        },
        status: 'DRAFT',
      };
      await submitChecklistForm('ops-ofd-001', payload);
      setSubmitSuccess(true);
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit checklist.');
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
              AT SEA SHIP TO SHIP TRANSFER
            </h1>
            <h2 className="text-xl font-semibold">
              CHECKLIST 1 - BEFORE OPERATION COMMENCE
            </h2>
          </div>
          <div className="bg-gray-700 p-4 rounded min-w-[200px]">
            <div className="text-sm space-y-1">
              <div><strong>Form No:</strong> {formData.formNo}</div>
              <div><strong>Issue Date:</strong> {formData.issueDate}</div>
              <div><strong>Approved by:</strong> {formData.approvedBy}</div>
            </div>
          </div>
        </div>

        {/* Operation Details Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Operation Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Vessel's Name:</label>
              <input
                type="text"
                value={formData.vesselName}
                onChange={(e) => handleInputChange('vesselName', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Ship's Operator:</label>
              <input
                type="text"
                value={formData.shipsOperator}
                onChange={(e) => handleInputChange('shipsOperator', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Charterer:</label>
              <input
                type="text"
                value={formData.charterer}
                onChange={(e) => handleInputChange('charterer', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">STS Organizer:</label>
              <input
                type="text"
                value={formData.stsOrganizer}
                onChange={(e) => handleInputChange('stsOrganizer', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Planned Date and Time:</label>
              <input
                type="datetime-local"
                value={formData.plannedDateAndTime}
                onChange={(e) => handleInputChange('plannedDateAndTime', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Transfer Location:</label>
              <input
                type="text"
                value={formData.transferLocation}
                onChange={(e) => handleInputChange('transferLocation', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Cargo:</label>
              <input
                type="text"
                value={formData.cargo}
                onChange={(e) => handleInputChange('cargo', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Constant Heading Ship or terminal Berthed ship:</label>
              <input
                type="text"
                value={formData.constantHeadingShip}
                onChange={(e) => handleInputChange('constantHeadingShip', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Maneuvering Ship or outer Ship:</label>
              <input
                type="text"
                value={formData.maneuveringShip}
                onChange={(e) => handleInputChange('maneuveringShip', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">POAC/STS Superintendent:</label>
              <input
                type="text"
                value={formData.poacStsSuperintendent}
                onChange={(e) => handleInputChange('poacStsSuperintendent', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm mb-1">Applicable Specific Joint Plan Operation:</label>
              <input
                type="text"
                value={formData.applicableSpecificJointPlanOperation}
                onChange={(e) => handleInputChange('applicableSpecificJointPlanOperation', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
          </div>
          <p className="mt-4 text-sm italic text-gray-400">
            For discharging / receiving ship (Delete as appropriate)
          </p>
        </div>

        {/* Generic Checks Table */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Generic Checks</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-600">
              <thead>
                <tr className="bg-gray-700">
                  <th className="border border-gray-600 p-3 text-center w-16">CL</th>
                  <th className="border border-gray-600 p-3 text-left">Generic Checks</th>
                  <th className="border border-gray-600 p-3 text-center w-24">Status</th>
                  <th className="border border-gray-600 p-3 text-left">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {formData.genericChecks.map((check, index) => (
                  <tr key={check.id} className="hover:bg-gray-700">
                    <td className="border border-gray-600 p-3 text-center font-semibold">
                      {check.id}
                    </td>
                    <td className="border border-gray-600 p-3">
                      {check.description}
                      {check.remark && (
                        <span className="block text-xs text-gray-400 mt-1 italic">
                          ({check.remark})
                        </span>
                      )}
                    </td>
                    <td className="border border-gray-600 p-3 text-center">
                      <input
                        type="checkbox"
                        checked={check.status}
                        onChange={(e) => handleChecklistChange(index, e.target.checked)}
                        className="w-4 h-4"
                      />
                    </td>
                    <td className="border border-gray-600 p-3">
                      <input
                        type="text"
                        value={check.userRemark}
                        onChange={(e) => handleRemarkChange(index, e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                        placeholder="Add remark..."
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Signature Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Signature</h3>
          <div className="bg-gray-700 p-6 rounded">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm mb-1">Name:</label>
                <input
                  type="text"
                  value={formData.signature.name}
                  onChange={(e) => handleSignatureChange('name', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Rank:</label>
                <input
                  type="text"
                  value={formData.signature.rank}
                  onChange={(e) => handleSignatureChange('rank', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Signature:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSignatureUpload}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                />
                {formData.signature.signature && (
                  <div className="mt-2">
                    <img
                      src={formData.signature.signature}
                      alt="Signature preview"
                      className="max-w-full h-24 border border-gray-600 rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleSignatureChange('signature', '')}
                      className="mt-2 text-sm text-red-400 hover:text-red-300"
                    >
                      Remove Signature
                    </button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm mb-1">Date:</label>
                <input
                  type="date"
                  value={formData.signature.date}
                  onChange={(e) => handleSignatureChange('date', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit error */}
        {submitError && (
          <div className="mb-4 p-4 bg-red-900/30 border border-red-600 rounded text-red-300 text-sm">
            {submitError}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit Checklist'}
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

