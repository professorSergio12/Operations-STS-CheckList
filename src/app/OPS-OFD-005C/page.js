'use client';

import { useState } from 'react';
import Image from 'next/image';

// Default Checklist Items
const DEFAULT_CHECKLIST_ITEMS = [
  { clNumber: 1, description: 'Relevant local requirements, including permissions, are obtained and complied with OCIMF' },
  { clNumber: 2, description: 'Procedures for cargo and ballast operations have been reviewed and accepted by all parties.' },
  { clNumber: 3, description: 'Effective communication between the ships and the terminal is established' },
  { clNumber: 4, description: 'Security information has been exchanged and, if required, a Declaration of Security has been completed' },
  { clNumber: 5, description: 'Present and forecast weather and sea conditions have been considered' },
  { clNumber: 6, description: 'Cargo specifications, hazardous properties, SDS and any requirements for inerting, heating, reactivity and inhibitors have been exchanged' },
  { clNumber: 7, description: 'Tank venting system and dosed operation procedures are agreed' },
  { clNumber: 8, description: 'Procedures for vapour control/balancing have been agreed' },
  { clNumber: 9, description: 'Access to the cargo deck is restricted and controlled during cargo transfer operations' },
  { clNumber: 10, description: 'All personnel on deck are wearing appropriate PPE, including gas detectors as per company PPE matrix' },
];

export default function STSChecklist5C() {
  const [formData, setFormData] = useState({
    // Document Info
    documentInfo: {
      formNo: 'OPS-OFD-005C',
      issueDate: new Date().toISOString().split('T')[0],
      approvedBy: 'JS',
    },
    // Terminal Transfer Info
    terminalTransferInfo: {
      terminalBerthedShip: '',
      outerShip: '',
      terminal: '',
    },
    // Checklist Items
    checklistItems: DEFAULT_CHECKLIST_ITEMS.map(item => ({
      clNumber: item.clNumber,
      description: item.description,
      status: {
        terminalBerthedShip: false,
        outerShip: false,
        terminal: false,
      },
      remarks: '',
    })),
    // Responsible Persons
    responsiblePersons: {
      chsOfficerName: '',
      msOfficerName: '',
      terminalRepresentativeName: '',
      stsSuperintendentName: '',
    },
  });

  // Document Info handlers
  const handleDocumentInfoChange = (field, value) => {
    setFormData({
      ...formData,
      documentInfo: {
        ...formData.documentInfo,
        [field]: value,
      },
    });
  };

  // Terminal Transfer Info handlers
  const handleTerminalTransferInfoChange = (field, value) => {
    setFormData({
      ...formData,
      terminalTransferInfo: {
        ...formData.terminalTransferInfo,
        [field]: value,
      },
    });
  };

  // Checklist Item handlers
  const handleChecklistItemStatusChange = (index, field, checked) => {
    const updatedItems = [...formData.checklistItems];
    updatedItems[index].status[field] = checked;
    setFormData({ ...formData, checklistItems: updatedItems });
  };

  const handleChecklistItemRemarksChange = (index, value) => {
    const updatedItems = [...formData.checklistItems];
    updatedItems[index].remarks = value;
    setFormData({ ...formData, checklistItems: updatedItems });
  };

  // Responsible Persons handlers
  const handleResponsiblePersonChange = (field, value) => {
    setFormData({
      ...formData,
      responsiblePersons: {
        ...formData.responsiblePersons,
        [field]: value,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement API call to save form data
    // eslint-disable-next-line no-console
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
              CHECKLIST 7 - CHECKS PRE TRANSFER CONFERENCE ALONGSIDE A TERMINAL
            </h2>
          </div>
          <div className="bg-gray-700 p-4 rounded min-w-[200px]">
            <div className="text-sm space-y-1">
              <div><strong>Form No:</strong> {formData.documentInfo.formNo}</div>
              <div><strong>Issue Date:</strong> {formData.documentInfo.issueDate}</div>
              <div><strong>Approved by:</strong> {formData.documentInfo.approvedBy}</div>
            </div>
          </div>
        </div>

        {/* Terminal Transfer Information Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Transfer Information</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="terminal-berthed-ship" className="block text-sm mb-1">Terminal Berthed Ship:</label>
              <input
                id="terminal-berthed-ship"
                type="text"
                value={formData.terminalTransferInfo.terminalBerthedShip}
                onChange={(e) => handleTerminalTransferInfoChange('terminalBerthedShip', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label htmlFor="outer-ship" className="block text-sm mb-1">Outer Ship:</label>
              <input
                id="outer-ship"
                type="text"
                value={formData.terminalTransferInfo.outerShip}
                onChange={(e) => handleTerminalTransferInfoChange('outerShip', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label htmlFor="terminal" className="block text-sm mb-1">Terminal:</label>
              <input
                id="terminal"
                type="text"
                value={formData.terminalTransferInfo.terminal}
                onChange={(e) => handleTerminalTransferInfoChange('terminal', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
          </div>
        </div>

        {/* Checklist Items Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Checklist Items</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-600">
              <thead>
                <tr className="bg-gray-700">
                  <th className="border border-gray-600 p-3 text-left">Description</th>
                  <th className="border border-gray-600 p-3 text-center min-w-[120px]">Terminal Berthed Ship</th>
                  <th className="border border-gray-600 p-3 text-center min-w-[120px]">Outer ship</th>
                  <th className="border border-gray-600 p-3 text-center min-w-[120px]">Terminal</th>
                  <th className="border border-gray-600 p-3 text-left">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {formData.checklistItems.map((item, index) => (
                  <tr key={item.clNumber} className="hover:bg-gray-700">
                    <td className="border border-gray-600 p-3">
                      <div className="flex items-start gap-2">
                        <span className="font-semibold text-gray-300">{item.clNumber}.</span>
                        <span className="text-sm">{item.description}</span>
                      </div>
                    </td>
                    <td className="border border-gray-600 p-3 text-center">
                      <input
                        type="checkbox"
                        checked={item.status.terminalBerthedShip}
                        onChange={(e) => handleChecklistItemStatusChange(index, 'terminalBerthedShip', e.target.checked)}
                        className="w-4 h-4"
                      />
                    </td>
                    <td className="border border-gray-600 p-3 text-center">
                      <input
                        type="checkbox"
                        checked={item.status.outerShip}
                        onChange={(e) => handleChecklistItemStatusChange(index, 'outerShip', e.target.checked)}
                        className="w-4 h-4"
                      />
                    </td>
                    <td className="border border-gray-600 p-3 text-center">
                      <input
                        type="checkbox"
                        checked={item.status.terminal}
                        onChange={(e) => handleChecklistItemStatusChange(index, 'terminal', e.target.checked)}
                        className="w-4 h-4"
                      />
                    </td>
                    <td className="border border-gray-600 p-3">
                      <input
                        type="text"
                        value={item.remarks}
                        onChange={(e) => handleChecklistItemRemarksChange(index, e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                        placeholder="Add remarks..."
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Responsible Persons Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Responsible Persons</h3>
          <div className="bg-gray-700 p-6 rounded">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label htmlFor="chs-officer-name" className="block text-sm mb-1">Officer in charge of CHS: Name:</label>
                <input
                  id="chs-officer-name"
                  type="text"
                  value={formData.responsiblePersons.chsOfficerName}
                  onChange={(e) => handleResponsiblePersonChange('chsOfficerName', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                />
              </div>
              <div>
                <label htmlFor="terminal-rep-name" className="block text-sm mb-1">Terminal Rep: Name:</label>
                <input
                  id="terminal-rep-name"
                  type="text"
                  value={formData.responsiblePersons.terminalRepresentativeName}
                  onChange={(e) => handleResponsiblePersonChange('terminalRepresentativeName', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                />
              </div>
              <div>
                <label htmlFor="ms-officer-name" className="block text-sm mb-1">Officer in charge of MS: Name:</label>
                <input
                  id="ms-officer-name"
                  type="text"
                  value={formData.responsiblePersons.msOfficerName}
                  onChange={(e) => handleResponsiblePersonChange('msOfficerName', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                />
              </div>
              <div>
                <label htmlFor="sts-supdt-name" className="block text-sm mb-1">STS Supdt: Name:</label>
                <input
                  id="sts-supdt-name"
                  type="text"
                  value={formData.responsiblePersons.stsSuperintendentName}
                  onChange={(e) => handleResponsiblePersonChange('stsSuperintendentName', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded cursor-pointer transition-colors"
          >
            Submit Checklist
          </button>
        </div>
      </div>
    </div>
  );
}

