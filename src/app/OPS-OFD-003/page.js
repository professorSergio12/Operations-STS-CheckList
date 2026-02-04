'use client';

import { useState } from 'react';
import Image from 'next/image';

// Default checklist items for 3A (Generic Checks 1-21)
const DEFAULT_CHECKLIST_3A = [
  { clNumber: 1, description: 'Mooring and fendering arrangement is effective', status: '', remarks: '', hasNotApplicable: false },
  { clNumber: 2, description: 'Unused cargo connections are blanked', status: '', remarks: '', hasNotApplicable: false },
  { clNumber: 3, description: 'The ship\'s plan to use vapour balancing', status: '', remarks: '', hasNotApplicable: true },
  { clNumber: 4, description: 'Inert Gas System (IGS) is ready for use', status: '', remarks: '', hasNotApplicable: true },
  { clNumber: 5, description: 'Firefighting equipment is ready for use', status: '', remarks: '', hasNotApplicable: false },
  { clNumber: 6, description: 'Spill response equipment is on station and ready for immediate deployment', status: '', remarks: '', hasNotApplicable: false },
  { clNumber: 7, description: 'Scuppers and save-alls are plugged', status: '', remarks: '', hasNotApplicable: false },
  { clNumber: 8, description: 'Cargo system sea connections and overboard discharges are secured', status: '', remarks: '', hasNotApplicable: true },
  { clNumber: 9, description: 'Designated transceivers are in low power mode and designated radio antennae are isolated', status: '', remarks: '', hasNotApplicable: false },
  { clNumber: 10, description: 'External openings in superstructure are closed', status: '', remarks: '', hasNotApplicable: false },
  { clNumber: 11, description: 'Spaces to be routinely monitored for any build-up of flammable and/or toxic vapour have been identified', status: '', remarks: '', hasNotApplicable: false },
  { clNumber: 12, description: 'Pumproom ventilation is operational', status: '', remarks: '', hasNotApplicable: true },
  { clNumber: 13, description: 'Accommodation spaces are at positive pressure', status: '', remarks: '', hasNotApplicable: false },
  { clNumber: 14, description: 'Fire control plans are readily available', status: '', remarks: '', hasNotApplicable: false },
  { clNumber: 15, description: 'Cargo monitoring system is fully operational and tested', status: '', remarks: '', hasNotApplicable: false },
  { clNumber: 16, description: 'Cargo gauging system operation and alarm set points are confirmed', status: '', remarks: '', hasNotApplicable: false },
  { clNumber: 17, description: 'Emergency Shutdown (ESD) system is tested and operational', status: '', remarks: '', hasNotApplicable: false },
  { clNumber: 18, description: 'Transfer equipment is in safe condition (isolated, drained and de-pressurised), Cargo manifold connections prepared, blanked and marked', status: '', remarks: '', hasNotApplicable: false },
  { clNumber: 19, description: 'The cargo transfer hoses/arms have been tested and certified and they are in apparent good condition', status: '', remarks: '', hasNotApplicable: false },
  { clNumber: 20, description: 'The hose lifting equipment is suitable and ready for use', status: '', remarks: '', hasNotApplicable: false },
  { clNumber: 21, description: 'P/V valves are operational', status: '', remarks: '', hasNotApplicable: false },
];

// Default checklist items for 3B (LPG/LNG Additional)
const DEFAULT_CHECKLIST_3B = [
  { clNumber: 1, description: 'Cargo lines have been cooled', status: '', remarks: '', hasNotApplicable: false },
  { clNumber: 2, description: 'All safety systems, including firefighting, cryogenic protection, ESD, gas detection and ventilation system are ready for use/in use', status: '', remarks: '', hasNotApplicable: false },
  { clNumber: 3, description: 'All cargo transfer equipment tested and ready for use', status: '', remarks: '', hasNotApplicable: false },
];

export default function STSChecklist3A3B() {
  const [formData, setFormData] = useState({
    formNo: 'OPS-OFD-003',
    issueDate: new Date().toISOString().split('T')[0],
    approvedBy: 'JS',
    // Transfer Info
    constantHeadingShip: '',
    manoeuvringShip: '',
    designatedPOACName: '',
    stsSuperintendentName: '',
    transferDate: '',
    transferLocation: '',
    // Checklist 3A
    checklist3A: DEFAULT_CHECKLIST_3A.map(item => ({ ...item, hasNotApplicable: item.hasNotApplicable || false })),
    // Checklist 3B
    checklist3B: DEFAULT_CHECKLIST_3B.map(item => ({ ...item, hasNotApplicable: item.hasNotApplicable || false })),
    // Signature
    signature: {
      rank: '',
      signature: '',
      date: '',
    },
  });

  const handleTransferInfoChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleChecklistChange = (checklistType, index, field, value) => {
    const updatedChecklist = [...formData[checklistType]];
    updatedChecklist[index][field] = value;
    setFormData({ ...formData, [checklistType]: updatedChecklist });
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

  const renderChecklistTable = (checklistType, title) => {
    const checklist = formData[checklistType];
    
    return (
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-600">
            <thead>
              <tr className="bg-gray-700">
                <th className="border border-gray-600 p-3 text-center w-16">CL</th>
                <th className="border border-gray-600 p-3 text-left">Description</th>
                <th className="border border-gray-600 p-3 text-center w-32">Status</th>
                <th className="border border-gray-600 p-3 text-left">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {checklist.map((item, index) => (
                <tr key={item.clNumber} className="hover:bg-gray-700">
                  <td className="border border-gray-600 p-3 text-center font-semibold">
                    {item.clNumber}
                  </td>
                  <td className="border border-gray-600 p-3">
                    <div className="text-white text-sm">
                      {item.description}
                    </div>
                  </td>
                  <td className="border border-gray-600 p-3 text-center">
                    <label className="flex items-center justify-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.status === 'YES'}
                        onChange={(e) => handleChecklistChange(checklistType, index, 'status', e.target.checked ? 'YES' : '')}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Yes</span>
                    </label>
                  </td>
                  <td className="border border-gray-600 p-3">
                    {item.hasNotApplicable ? (
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.remarks === 'NOT_APPLICABLE'}
                          onChange={(e) => handleChecklistChange(checklistType, index, 'remarks', e.target.checked ? 'NOT_APPLICABLE' : '')}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Not applicable</span>
                      </label>
                    ) : (
                      <input
                        type="text"
                        value={item.remarks}
                        onChange={(e) => handleChecklistChange(checklistType, index, 'remarks', e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                        placeholder="Add remarks..."
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
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
              AT SEA SHIP TO SHIP TRANSFER
            </h1>
            <h2 className="text-xl font-semibold">
              CHECKLIST 3A & 3B - BEFORE CARGO TRANSFER
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

        {/* Transfer Info Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Transfer Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Constant Heading Ship:</label>
              <input
                type="text"
                value={formData.constantHeadingShip}
                onChange={(e) => handleTransferInfoChange('constantHeadingShip', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Manoeuvring Ship:</label>
              <input
                type="text"
                value={formData.manoeuvringShip}
                onChange={(e) => handleTransferInfoChange('manoeuvringShip', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Name of Designated POAC:</label>
              <input
                type="text"
                value={formData.designatedPOACName}
                onChange={(e) => handleTransferInfoChange('designatedPOACName', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Name of STS Superintendent if Different from POAC:</label>
              <input
                type="text"
                value={formData.stsSuperintendentName}
                onChange={(e) => handleTransferInfoChange('stsSuperintendentName', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Date of Transfer:</label>
              <input
                type="date"
                value={formData.transferDate}
                onChange={(e) => handleTransferInfoChange('transferDate', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Location of Transfer:</label>
              <input
                type="text"
                value={formData.transferLocation}
                onChange={(e) => handleTransferInfoChange('transferLocation', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
          </div>
        </div>

        {/* Checklist 3A Section */}
        {renderChecklistTable('checklist3A', 'CHECKLIST 3A - Generic Checks (1-21)')}

        {/* Checklist 3B Section */}
        {renderChecklistTable('checklist3B', 'CHECKLIST 3B - LPG/LNG Additional Checks')}

        {/* Signature Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Signature</h3>
          <div className="bg-gray-700 p-6 rounded">
            <div className="grid grid-cols-2 gap-6">
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
                <label className="block text-sm mb-1">Date:</label>
                <input
                  type="date"
                  value={formData.signature.date}
                  onChange={(e) => handleSignatureChange('date', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                />
              </div>
              <div className="col-span-2">
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

