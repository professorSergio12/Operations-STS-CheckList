'use client';

import { useState } from 'react';
import Image from 'next/image';

const GENERIC_CHECKS = [
  { id: 1, description: 'Fenders and associated equipment are visually inspected, in good condition, correctly positioned and rigged', remark: '', hasNotApplicable: false },
  { id: 2, description: 'There are no overhanging projections on the side of berthing', remark: '', hasNotApplicable: false },
  { id: 3, description: 'A proficient helms person is at the wheel', remark: 'Not applicable if moored', hasNotApplicable: false },
  { id: 4, description: 'Course and speed information is agreed', remark: 'Not applicable if moored', hasNotApplicable: false },
  { id: 5, description: 'The method for controlling the ship\'s speed is agreed', remark: 'Not applicable if moored', hasNotApplicable: false },
  { id: 6, description: 'Navigational signals are displayed', remark: 'Not applicable if moored', hasNotApplicable: false },
  { id: 7, description: 'Adequate illumination is available', remark: '', hasNotApplicable: false },
  { id: 8, description: 'Power is available for mooring winches, and they are in good order', remark: '', hasNotApplicable: false },
  { id: 9, description: 'Mooring lines, rope messengers, rope stoppers, chain stoppers and heaving lines are ready for use', remark: '', hasNotApplicable: false },
  { id: 10, description: 'Crew are standing by at their mooring stations', remark: '', hasNotApplicable: false },
  { id: 11, description: 'Communications are established with mooring personnel and with the other ship', remark: '', hasNotApplicable: false },
  { id: 12, description: 'Firefighting and anti-pollution equipment is ready for use', remark: '', hasNotApplicable: false },
  { id: 13, description: 'Shipping traffic in the area is being monitored and, if applicable, Vessel Traffic Services (VTS) are informed', remark: '', hasNotApplicable: false },
  { id: 14, description: 'The Automatic Identification System (AIS) is appropriately set', remark: '', hasNotApplicable: false },
  { id: 15, description: 'Cargo tanks are inerted', remark: '', hasNotApplicable: true },
];

export default function BeforeRunInMooringChecklist() {
  const [formData, setFormData] = useState({
    formNo: 'OPS-OFD-002',
    issueDate: new Date().toISOString().split('T')[0],
    approvedBy: 'JS',
    // Operation Details
    constantHeadingShip: '',
    maneuveringShip: '',
    nameOfDesignatedPOAC: '',
    nameOfSTSSuperintendent: '',
    dateOfTransfer: '',
    locationOfTransfer: '',
    // Generic Checks
    genericChecks: GENERIC_CHECKS.map(check => ({
      id: check.id,
      description: check.description,
      status: false,
      notApplicable: false,
      remark: check.remark,
      userRemark: '',
      hasNotApplicable: check.hasNotApplicable,
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
    if (checked) {
      updatedChecks[index].notApplicable = false;
    }
    setFormData({ ...formData, genericChecks: updatedChecks });
  };

  const handleNotApplicableChange = (index, checked) => {
    const updatedChecks = [...formData.genericChecks];
    updatedChecks[index].notApplicable = checked;
    if (checked) {
      updatedChecks[index].status = false;
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement API call to save form data
    console.log('Form Data:', formData);
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
              CHECKLIST 2 - BEFORE RUN IN & MOORING
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
              <label className="block text-sm mb-1">Constant Heading Ship:</label>
              <input
                type="text"
                value={formData.constantHeadingShip}
                onChange={(e) => handleInputChange('constantHeadingShip', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Maneuvering Ship:</label>
              <input
                type="text"
                value={formData.maneuveringShip}
                onChange={(e) => handleInputChange('maneuveringShip', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Name of Designated POAC:</label>
              <input
                type="text"
                value={formData.nameOfDesignatedPOAC}
                onChange={(e) => handleInputChange('nameOfDesignatedPOAC', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Name of STS Superintendent if Different from POAC:</label>
              <input
                type="text"
                value={formData.nameOfSTSSuperintendent}
                onChange={(e) => handleInputChange('nameOfSTSSuperintendent', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Date of Transfer:</label>
              <input
                type="date"
                value={formData.dateOfTransfer}
                onChange={(e) => handleInputChange('dateOfTransfer', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Location of Transfer:</label>
              <input
                type="text"
                value={formData.locationOfTransfer}
                onChange={(e) => handleInputChange('locationOfTransfer', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
          </div>
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
                  <th className="border border-gray-600 p-3 text-center w-32">Status</th>
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
                    <td className="border border-gray-600 p-3">
                      <div className="flex flex-col gap-2 items-center">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={check.status}
                            onChange={(e) => handleChecklistChange(index, e.target.checked)}
                            className="w-4 h-4"
                          />
                          <span className="text-sm">Yes</span>
                        </label>
                        {check.hasNotApplicable && (
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={check.notApplicable}
                              onChange={(e) => handleNotApplicableChange(index, e.target.checked)}
                              className="w-4 h-4"
                            />
                            <span className="text-sm">Not applicable</span>
                          </label>
                        )}
                      </div>
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

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors cursor-pointer"
          >
            Print
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors cursor-pointer"
          >
            Submit Checklist
          </button>
        </div>
      </div>
    </div>
  );
}

