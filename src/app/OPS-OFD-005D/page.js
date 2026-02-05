'use client';

import { useState } from 'react';
import Image from 'next/image';
import { submitChecklistForm } from '@/lib/api';

const DECLARATION_CHECKLIST_ITEMS = [
  { checklistId: '3A', label: 'Checklist 3A Before cargo Transfer' },
  { checklistId: '3B', label: 'Checklist 3B (Additional for LPG and LNG)' },
  { checklistId: '7', label: 'Checklist 7 Checks Pre Transfer Conference alongside a terminal' },
  { checklistId: '4B', label: 'Checklist 4B (Additional for Vapour Balancing)' },
  { checklistId: '4C', label: 'Checklist 4C (Additional for Chemicals)' },
  { checklistId: '4D', label: 'Checklist 4D (Additional for LPG and LNG)' },
  { checklistId: '4E', label: 'Checklist 4E (Additional for LNG)' },
  { checklistId: '4F', label: 'Checklist 4F Pre Transfer Agreement' },
];

const initialChecklistRow = (item) => ({
  checklistId: item.checklistId,
  label: item.label,
  terminalBerthedShip: false,
  outerShip: false,
  terminal: false,
  notApplicable: false,
});

const emptySignatory = () => ({
  name: '',
  rank: '',
  signature: '',
  date: '',
  time: '',
});

export default function DeclarationSTSPortTerminal() {
  const [formData, setFormData] = useState({
    documentInfo: {
      formNo: 'OPS-OFD-005',
      revisionNo: '',
      issueDate: '',
      approvedBy: 'JS',
    },
    shipTerminalNames: {
      terminalBerthedShip: '',
      outerShip: '',
      terminal: '',
    },
    declarationChecklist: DECLARATION_CHECKLIST_ITEMS.map(initialChecklistRow),
    repetitiveChecksHours: '',
    terminalBerthedShipSignatory: emptySignatory(),
    outerShipSignatory: emptySignatory(),
    terminalSignatory: emptySignatory(),
  });

  const handleShipTerminalNamesChange = (field, value) => {
    setFormData({
      ...formData,
      shipTerminalNames: { ...formData.shipTerminalNames, [field]: value },
    });
  };

  const handleChecklistChange = (index, column) => {
    const updated = [...formData.declarationChecklist];
    updated[index] = { ...updated[index], [column]: !updated[index][column] };
    setFormData({ ...formData, declarationChecklist: updated });
  };

  const handleSignatoryChange = (party, field, value) => {
    setFormData({
      ...formData,
      [`${party}Signatory`]: {
        ...formData[`${party}Signatory`],
        [field]: value,
      },
    });
  };

  const handleSignatureUpload = (party, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleSignatoryChange(party, 'signature', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(false);
      const payload = {
        documentInfo: formData.documentInfo,
        shipTerminalNames: formData.shipTerminalNames,
        declarationChecklist: formData.declarationChecklist,
        repetitiveChecksHours: formData.repetitiveChecksHours,
        terminalBerthedShipSignatory: formData.terminalBerthedShipSignatory,
        outerShipSignatory: formData.outerShipSignatory,
        terminalSignatory: formData.terminalSignatory,
        status: 'DRAFT',
      };
      await submitChecklistForm('ops-ofd-005d', payload);
      setSubmitSuccess(true);
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit declaration.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderSignatoryBlock = (party, title) => {
    const signatory = formData[`${party}Signatory`];
    return (
      <div className="bg-gray-700 p-4 rounded flex-1 min-w-0">
        <h4 className="font-semibold mb-3 border-b border-gray-600 pb-2 text-sm">{title}</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-xs mb-1">Name:</label>
            <input
              type="text"
              value={signatory.name}
              onChange={(e) => handleSignatoryChange(party, 'name', e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs mb-1">Rank:</label>
            <input
              type="text"
              value={signatory.rank}
              onChange={(e) => handleSignatoryChange(party, 'rank', e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs mb-1">Signature:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleSignatureUpload(party, e)}
              className="w-full text-white text-sm file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-blue-600 file:text-white"
            />
            {signatory.signature && (
              <div className="mt-1">
                <img src={signatory.signature} alt="Signature" className="max-h-16 border border-gray-600 rounded" />
                <button type="button" onClick={() => handleSignatoryChange(party, 'signature', '')} className="text-xs text-red-400 hover:text-red-300 mt-1">Remove</button>
              </div>
            )}
          </div>
          <div>
            <label className="block text-xs mb-1">Date:</label>
            <input
              type="date"
              value={signatory.date}
              onChange={(e) => handleSignatoryChange(party, 'date', e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs mb-1">Time:</label>
            <input
              type="time"
              value={signatory.time}
              onChange={(e) => handleSignatoryChange(party, 'time', e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-sm"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto bg-gray-800 rounded-lg shadow-2xl p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-6 border-b border-gray-700 pb-6">
          <div className="relative w-48 h-20">
            <Image src="/image/logo.png" alt="OCEANE GROUP - SHIP-TO-SHIP TRANSFER" fill className="object-contain" priority />
          </div>
          <div className="flex-1 flex flex-col items-center text-center">
            <h1 className="text-xl font-bold mb-1">AT SEA SHIP TO SHIP TRANSFER</h1>
            <p className="text-sm text-gray-400">STS Transfer Safety Checklist</p>
            <p className="text-sm mt-1">Form No: OPS-OFD-005 &nbsp; - &nbsp; Issue Date: {formData.documentInfo.issueDate || ''} &nbsp; Approved by: {formData.documentInfo.approvedBy}</p>
          </div>
        </div>

        {/* Ship / Terminal names row (as per PDF) */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold mb-1">Terminal Berthed Ship</label>
            <input
              type="text"
              value={formData.shipTerminalNames.terminalBerthedShip}
              onChange={(e) => handleShipTerminalNamesChange('terminalBerthedShip', e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              placeholder="_____________________________________"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Outer ship</label>
            <input
              type="text"
              value={formData.shipTerminalNames.outerShip}
              onChange={(e) => handleShipTerminalNamesChange('outerShip', e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              placeholder="_____________________________________"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Terminal</label>
            <input
              type="text"
              value={formData.shipTerminalNames.terminal}
              onChange={(e) => handleShipTerminalNamesChange('terminal', e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              placeholder="_____________________________________"
            />
          </div>
        </div>

        {/* Title and intro (PDF text) */}
        <h2 className="text-lg font-semibold mb-2">Declaration for STS operations in port / at a Terminal</h2>
        <p className="text-sm text-gray-300 mb-6">
          The undersigned have checked and agreed the Applicable checklist questions and confirm in the declarations below.
        </p>

        {/* Checklist table: Terminal Berthed ship | Outer ship | Terminal | Not Applicable */}
        <div className="mb-6 overflow-x-auto">
          <table className="w-full border-collapse border border-gray-600">
            <thead>
              <tr className="bg-gray-700">
                <th className="border border-gray-600 p-2 text-left text-sm w-1/2">Checklist</th>
                <th className="border border-gray-600 p-2 text-center text-sm">Terminal Berthed ship</th>
                <th className="border border-gray-600 p-2 text-center text-sm">Outer ship</th>
                <th className="border border-gray-600 p-2 text-center text-sm">Terminal</th>
                <th className="border border-gray-600 p-2 text-center text-sm">Not Applicable</th>
              </tr>
            </thead>
            <tbody>
              {formData.declarationChecklist.map((row, index) => (
                <tr key={row.checklistId} className="hover:bg-gray-700/50">
                  <td className="border border-gray-600 p-2 text-sm">
                    <div className="font-medium">Checklist {row.checklistId}</div>
                    <div className="text-gray-400 text-xs mt-0.5">{row.label.replace(new RegExp(`^Checklist ${row.checklistId}\\s*`), '')}</div>
                  </td>
                  <td className="border border-gray-600 p-2 text-center">
                    <input
                      type="checkbox"
                      checked={row.terminalBerthedShip}
                      onChange={() => handleChecklistChange(index, 'terminalBerthedShip')}
                      className="w-4 h-4"
                    />
                  </td>
                  <td className="border border-gray-600 p-2 text-center">
                    <input
                      type="checkbox"
                      checked={row.outerShip}
                      onChange={() => handleChecklistChange(index, 'outerShip')}
                      className="w-4 h-4"
                    />
                  </td>
                  <td className="border border-gray-600 p-2 text-center">
                    <input
                      type="checkbox"
                      checked={row.terminal}
                      onChange={() => handleChecklistChange(index, 'terminal')}
                      className="w-4 h-4"
                    />
                  </td>
                  <td className="border border-gray-600 p-2 text-center">
                    <input
                      type="checkbox"
                      checked={row.notApplicable}
                      onChange={() => handleChecklistChange(index, 'notApplicable')}
                      className="w-4 h-4"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Agreement text and repetitive checks hours (PDF) */}
        <div className="mb-6 space-y-2 text-sm">
          <p className="text-gray-300">
            In Accordance with the Guidance in the STS transfer Guide, The Entries we have made are correct to the best of our knowledge and that the ships agree to perform the STS operation.
          </p>
          <p className="text-gray-300">
            Repetitive Checks noted in Checklist 5B of the transfer Guide, shall be carried out at intervals of not more than{' '}
            <input
              type="text"
              value={formData.repetitiveChecksHours}
              onChange={(e) => setFormData({ ...formData, repetitiveChecksHours: e.target.value })}
              className="inline-block w-24 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-center mx-1"
              placeholder="……"
            />
            {' '}Hours.
          </p>
          <p className="text-gray-300">If the status of any item changes, the other ship should be notified immediately.</p>
        </div>

        {/* Three signatory blocks: Terminal Berthed Ship | Outer Ship | Terminal */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {renderSignatoryBlock('terminalBerthedShip', 'Terminal Berthed Ship')}
          {renderSignatoryBlock('outerShip', 'Outer Ship')}
          {renderSignatoryBlock('terminal', 'Terminal')}
        </div>

        {submitError && (
          <div className="mb-4 p-4 bg-red-900/30 border border-red-600 rounded text-red-300 text-sm">{submitError}</div>
        )}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
