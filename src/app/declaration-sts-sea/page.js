'use client';

import { useState } from 'react';
import Image from 'next/image';

const CHECKLIST_ITEMS = [
  { code: '3A', description: 'Before cargo Transfer' },
  { code: '3B', description: '(Additional for LPG and LNG)' },
  { code: '4A', description: 'Pre Transfer Conference' },
  { code: '4B', description: '(Additional for Vapour Balancing)' },
  { code: '4C', description: '(Additional for Chemicals)' },
  { code: '4D', description: '(Additional for LPG and LNG)' },
  { code: '4E', description: '(Additional for LNG)' },
  { code: '4F', description: 'Pre Transfer Agreement' },
];

export default function STSDeclarationForm() {
  const [formData, setFormData] = useState({
    formNo: 'Declaration Of Sts at sea',
    revisionNo: '1',
    issueDate: new Date().toISOString().split('T')[0],
    approvedBy: 'JS',
    shipOperationType: '',
    declarationAccepted: true,
    checklists: CHECKLIST_ITEMS.map(item => ({
      checklistCode: item.code,
      description: item.description,
      selection: '',
    })),
    repetitiveCheckHours: '',
    constantHeadingShip: {
      name: '',
      rank: '',
      signature: '',
      date: '',
      time: '',
    },
    manoeuvringShip: {
      name: '',
      rank: '',
      signature: '',
      date: '',
      time: '',
    },
  });

  const handleChecklistChange = (index, selection) => {
    const updatedChecklists = [...formData.checklists];
    // Toggle: if clicking the same selection, deselect it; otherwise set the new selection
    updatedChecklists[index].selection = 
      updatedChecklists[index].selection === selection ? '' : selection;
    setFormData({ ...formData, checklists: updatedChecklists });
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSignatureChange = (shipType, field, value) => {
    setFormData({
      ...formData,
      [shipType]: {
        ...formData[shipType],
        [field]: value,
      },
    });
  };

  const handleSignatureUpload = (shipType, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        handleSignatureChange(shipType, 'signature', base64String);
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
              Declaration Of STS At Sea
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

        {/* Ship Type Selection */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-8">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="shipOperationType"
                value="CONSTANT_HEADING_OR_BERTHED"
                checked={formData.shipOperationType === 'CONSTANT_HEADING_OR_BERTHED'}
                onChange={(e) => handleInputChange('shipOperationType', e.target.value)}
                className="w-4 h-4"
              />
              <span className="border-b-2 border-white pb-1">
                Constant Heading Ship or Berthed Ship
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="shipOperationType"
                value="MANOEUVRING_OR_OUTER"
                checked={formData.shipOperationType === 'MANOEUVRING_OR_OUTER'}
                onChange={(e) => handleInputChange('shipOperationType', e.target.value)}
                className="w-4 h-4"
              />
              <span className="border-b-2 border-white pb-1">
                Manoeuvring Ship or Outer ship
              </span>
            </label>
          </div>
        </div>

        {/* Declaration Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">
            Declaration for STS operations at Sea
          </h3>
          <p className="mb-4">
            The undersigned have checked and agreed the applicable checklist questions and confirm in the declarations below.
          </p>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.declarationAccepted}
              onChange={(e) => handleInputChange('declarationAccepted', e.target.checked)}
              className="w-4 h-4"
            />
            <span>I agree to the declaration</span>
          </label>
        </div>

        {/* Checklist Table */}
        <div className="mb-8 overflow-x-auto">
          <table className="w-full border-collapse border border-gray-600">
            <thead>
              <tr className="bg-gray-700">
                <th className="border border-gray-600 p-3 text-left">Checklist</th>
                <th className="border border-gray-600 p-3 text-left">Description</th>
                <th className="border border-gray-600 p-3 text-center">Constant heading Ship or Berthed ship</th>
                <th className="border border-gray-600 p-3 text-center">Manoeuvring Ship or Outer ship</th>
                <th className="border border-gray-600 p-3 text-center">Not Applicable</th>
              </tr>
            </thead>
            <tbody>
              {formData.checklists.map((item, index) => (
                <tr key={item.checklistCode} className="hover:bg-gray-700">
                  <td className="border border-gray-600 p-3 font-semibold">
                    Checklist {item.checklistCode}
                  </td>
                  <td className="border border-gray-600 p-3">
                    {item.description}
                  </td>
                  <td className="border border-gray-600 p-3 text-center">
                    <input
                      type="checkbox"
                      checked={item.selection === 'CONSTANT_HEADING'}
                      onChange={() => handleChecklistChange(index, 'CONSTANT_HEADING')}
                      className="w-4 h-4"
                    />
                  </td>
                  <td className="border border-gray-600 p-3 text-center">
                    <input
                      type="checkbox"
                      checked={item.selection === 'MANOEUVRING'}
                      onChange={() => handleChecklistChange(index, 'MANOEUVRING')}
                      className="w-4 h-4"
                    />
                  </td>
                  <td className="border border-gray-600 p-3 text-center">
                    <input
                      type="checkbox"
                      checked={item.selection === 'NOT_APPLICABLE'}
                      onChange={() => handleChecklistChange(index, 'NOT_APPLICABLE')}
                      className="w-4 h-4"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Additional Information */}
        <div className="mb-8 space-y-4 text-sm">
          <p>
            In Accordance with the Guidance in the STS transfer Guide, The Entries we have made are correct to the best of our knowledge and that the ships agree to perform the STS operation.
          </p>
          <div className="flex items-center gap-2">
            <span>Repetitive Checks noted in Checklist 5B of the transfer Guide, shall be carried out at intervals of not more than</span>
            <input
              type="number"
              value={formData.repetitiveCheckHours}
              onChange={(e) => handleInputChange('repetitiveCheckHours', e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded px-3 py-1 w-20 text-white"
              placeholder="Hours"
            />
            <span>Hours.</span>
          </div>
          <p>
            If the status of any item changes, the other ship should be notified immediately.
          </p>
        </div>

        {/* Signature Section */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Constant Heading Ship Signature */}
          <div className="bg-gray-700 p-6 rounded">
            <h4 className="font-semibold mb-4 border-b border-gray-600 pb-2">
              Constant Heading Ship or Berthed Ship
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Name:</label>
                <input
                  type="text"
                  value={formData.constantHeadingShip.name}
                  onChange={(e) => handleSignatureChange('constantHeadingShip', 'name', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Rank:</label>
                <input
                  type="text"
                  value={formData.constantHeadingShip.rank}
                  onChange={(e) => handleSignatureChange('constantHeadingShip', 'rank', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Signature:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleSignatureUpload('constantHeadingShip', e)}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                />
                {formData.constantHeadingShip.signature && (
                  <div className="mt-2">
                    <img
                      src={formData.constantHeadingShip.signature}
                      alt="Signature preview"
                      className="max-w-full h-24 border border-gray-600 rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleSignatureChange('constantHeadingShip', 'signature', '')}
                      className="mt-2 text-sm text-red-400 hover:text-red-300"
                    >
                      Remove Signature
                    </button>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Date:</label>
                  <input
                    type="date"
                    value={formData.constantHeadingShip.date}
                    onChange={(e) => handleSignatureChange('constantHeadingShip', 'date', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Time:</label>
                  <input
                    type="time"
                    value={formData.constantHeadingShip.time}
                    onChange={(e) => handleSignatureChange('constantHeadingShip', 'time', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Manoeuvring Ship Signature */}
          <div className="bg-gray-700 p-6 rounded">
            <h4 className="font-semibold mb-4 border-b border-gray-600 pb-2">
              Manoeuvring Ship or Outer ship
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Name:</label>
                <input
                  type="text"
                  value={formData.manoeuvringShip.name}
                  onChange={(e) => handleSignatureChange('manoeuvringShip', 'name', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Rank:</label>
                <input
                  type="text"
                  value={formData.manoeuvringShip.rank}
                  onChange={(e) => handleSignatureChange('manoeuvringShip', 'rank', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Signature:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleSignatureUpload('manoeuvringShip', e)}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                />
                {formData.manoeuvringShip.signature && (
                  <div className="mt-2">
                    <img
                      src={formData.manoeuvringShip.signature}
                      alt="Signature preview"
                      className="max-w-full h-24 border border-gray-600 rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleSignatureChange('manoeuvringShip', 'signature', '')}
                      className="mt-2 text-sm text-red-400 hover:text-red-300"
                    >
                      Remove Signature
                    </button>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Date:</label>
                  <input
                    type="date"
                    value={formData.manoeuvringShip.date}
                    onChange={(e) => handleSignatureChange('manoeuvringShip', 'date', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Time:</label>
                  <input
                    type="time"
                    value={formData.manoeuvringShip.time}
                    onChange={(e) => handleSignatureChange('manoeuvringShip', 'time', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors cursor-pointer"
          >
            Submit Declaration
          </button>
        </div>
      </div>
    </div>
  );
}

