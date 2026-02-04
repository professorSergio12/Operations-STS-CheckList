'use client';

import { useState } from 'react';
import Image from 'next/image';

// Default Checklist 6A items
const DEFAULT_CHECKLIST_6A = [
  { clNumber: 1, description: 'Cargo hoses, fixed cargo pipelines, vapour return lines and manifolds are drained and confirmed to be liquid-free', hasNotApplicable: false },
  { clNumber: 2, description: 'Cargo hoses, vapour return lines, fixed pipelines and manifolds are:', hasNotApplicable: false, hasPipelineConditions: true },
  { clNumber: 3, description: 'All remotely and manually operated valves are closed ready for disconnection', hasNotApplicable: false },
  { clNumber: 4, description: 'Sufficient personnel with responsible officer available for disconnection', hasNotApplicable: false },
  { clNumber: 5, description: 'Correct PPE is used', hasNotApplicable: false },
  { clNumber: 6, description: 'The other ship is notified on "ready to disconnect"', hasNotApplicable: false },
];

// Default Checklist 6B items
const DEFAULT_CHECKLIST_6B = [
  { clNumber: 1, description: 'Cargo hoses and/or manifolds are securely blanked', hasNotApplicable: false },
  { clNumber: 2, description: 'Cargo area on the ship is cleared and restored to standard condition', hasNotApplicable: false },
  { clNumber: 3, description: 'Cargo documents signed and exchanged', hasNotApplicable: false },
  { clNumber: 4, description: 'Terminal or transfer location authority is notified on the completion of the STS operation', hasNotApplicable: true },
  { clNumber: 5, description: 'The transfer side of the ship is clear of obstructions (including hose lifting equipment)', hasNotApplicable: true },
  { clNumber: 6, description: 'The method of letting go of moorings and separation of ships has been agreed', hasNotApplicable: true },
  { clNumber: 7, description: 'Mooring winches ready for operation', hasNotApplicable: true },
  { clNumber: 8, description: 'Rope messengers and stoppers are available at mooring stations', hasNotApplicable: true },
  { clNumber: 9, description: 'Communications are established with mooring personnel and with the other ship', hasNotApplicable: true },
  { clNumber: 10, description: 'Shipping traffic in the area is being monitored and a VHF alert has been transmitted', hasNotApplicable: true },
  { clNumber: 11, description: 'Manoeuvring, mooring and navigational equipment has been tested and is ready for departure', hasNotApplicable: true },
  { clNumber: 12, description: 'The other ship has been notified that unmooring can commence', hasNotApplicable: true },
];

export default function STSChecklist6AB() {
  const [formData, setFormData] = useState({
    // Document Info
    documentInfo: {
      formNo: 'OPS-OFD-005B',
      revisionDate: new Date().toISOString().split('T')[0],
      approvedBy: 'JS',
    },
    // Transfer Info
    transferInfo: {
      constantHeadingShip: '',
      manoeuvringShip: '',
      designatedPOACName: '',
      stsSuperintendentName: '',
      transferDate: '',
      transferLocation: '',
    },
    // Checklist 6A
    checklist6A: {
      checks: DEFAULT_CHECKLIST_6A.map(item => ({
        clNumber: item.clNumber,
        description: item.description,
        status: { yes: false, notApplicable: false },
        remarks: '',
        hasNotApplicable: item.hasNotApplicable,
        hasPipelineConditions: item.hasPipelineConditions || false,
      })),
      pipelineConditions: {
        purged: false,
        inerted: false,
        depressurized: false,
      },
    },
    // Checklist 6B
    checklist6B: DEFAULT_CHECKLIST_6B.map(item => ({
      clNumber: item.clNumber,
      description: item.description,
      status: { yes: false, notApplicable: false },
      remarks: '',
      hasNotApplicable: item.hasNotApplicable,
    })),
    // Responsible Persons
    responsiblePersons: {
      chsOfficerName: '',
      msOfficerName: '',
      terminalName: '',
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

  // Checklist 6A handlers
  const handleChecklist6AStatusChange = (index, field, checked) => {
    const updatedChecks = [...formData.checklist6A.checks];
    updatedChecks[index].status[field] = checked;
    // If one is checked, uncheck the other
    if (checked && field === 'yes') {
      updatedChecks[index].status.notApplicable = false;
    } else if (checked && field === 'notApplicable') {
      updatedChecks[index].status.yes = false;
    }
    setFormData({
      ...formData,
      checklist6A: {
        ...formData.checklist6A,
        checks: updatedChecks,
      },
    });
  };

  const handleChecklist6ARemarksChange = (index, value) => {
    const updatedChecks = [...formData.checklist6A.checks];
    updatedChecks[index].remarks = value;
    setFormData({
      ...formData,
      checklist6A: {
        ...formData.checklist6A,
        checks: updatedChecks,
      },
    });
  };

  const handlePipelineConditionChange = (field, checked) => {
    setFormData({
      ...formData,
      checklist6A: {
        ...formData.checklist6A,
        pipelineConditions: {
          ...formData.checklist6A.pipelineConditions,
          [field]: checked,
        },
      },
    });
  };

  // Checklist 6B handlers
  const handleChecklist6BStatusChange = (index, field, checked) => {
    const updatedChecklist = [...formData.checklist6B];
    updatedChecklist[index].status[field] = checked;
    // If one is checked, uncheck the other
    if (checked && field === 'yes') {
      updatedChecklist[index].status.notApplicable = false;
    } else if (checked && field === 'notApplicable') {
      updatedChecklist[index].status.yes = false;
    }
    setFormData({ ...formData, checklist6B: updatedChecklist });
  };

  const handleChecklist6BRemarksChange = (index, value) => {
    const updatedChecklist = [...formData.checklist6B];
    updatedChecklist[index].remarks = value;
    setFormData({ ...formData, checklist6B: updatedChecklist });
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
              CHECKLIST 6A & B – CHECKS BEFORE & AFTER DISCONNECTION
            </h2>
          </div>
          <div className="bg-gray-700 p-4 rounded min-w-[200px]">
            <div className="text-sm space-y-1">
              <div><strong>Form No:</strong> {formData.documentInfo.formNo}</div>
              <div><strong>Rev Date:</strong> {formData.documentInfo.revisionDate}</div>
              <div><strong>Approved by:</strong> {formData.documentInfo.approvedBy}</div>
            </div>
          </div>
        </div>

        {/* Transfer Information Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Transfer Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="constant-heading-ship" className="block text-sm mb-1">Constant Heading Ship:</label>
              <input
                id="constant-heading-ship"
                type="text"
                value={formData.transferInfo.constantHeadingShip}
                onChange={(e) => handleTransferInfoChange('constantHeadingShip', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label htmlFor="manoeuvring-ship" className="block text-sm mb-1">Maneuvering Ship:</label>
              <input
                id="manoeuvring-ship"
                type="text"
                value={formData.transferInfo.manoeuvringShip}
                onChange={(e) => handleTransferInfoChange('manoeuvringShip', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label htmlFor="designated-poac-name" className="block text-sm mb-1">Name of Designated POAC:</label>
              <input
                id="designated-poac-name"
                type="text"
                value={formData.transferInfo.designatedPOACName}
                onChange={(e) => handleTransferInfoChange('designatedPOACName', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label htmlFor="sts-superintendent-name" className="block text-sm mb-1">Name of STS Superintendent if Different from POAC:</label>
              <input
                id="sts-superintendent-name"
                type="text"
                value={formData.transferInfo.stsSuperintendentName}
                onChange={(e) => handleTransferInfoChange('stsSuperintendentName', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label htmlFor="transfer-date" className="block text-sm mb-1">Date of Transfer:</label>
              <input
                id="transfer-date"
                type="date"
                value={formData.transferInfo.transferDate}
                onChange={(e) => handleTransferInfoChange('transferDate', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label htmlFor="transfer-location" className="block text-sm mb-1">Location of Transfer:</label>
              <input
                id="transfer-location"
                type="text"
                value={formData.transferInfo.transferLocation}
                onChange={(e) => handleTransferInfoChange('transferLocation', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
          </div>
        </div>

        {/* Checklist 6A Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">CL:6A – CHECKS AFTER TRANSFER BEFORE DISCONNECTION</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-600">
              <thead>
                <tr className="bg-gray-700">
                  <th className="border border-gray-600 p-3 text-center w-16">CL 6A</th>
                  <th className="border border-gray-600 p-3 text-left">Checks before Disconnection</th>
                  <th className="border border-gray-600 p-3 text-center w-32">Status</th>
                  <th className="border border-gray-600 p-3 text-left">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {formData.checklist6A.checks.map((item, index) => (
                  <tr key={item.clNumber} className="hover:bg-gray-700">
                    <td className="border border-gray-600 p-3 text-center font-semibold">
                      {item.clNumber}
                    </td>
                    <td className="border border-gray-600 p-3">
                      <span className="text-sm">{item.description}</span>
                      {item.hasPipelineConditions && (
                        <div className="mt-2 flex flex-wrap gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.checklist6A.pipelineConditions.purged}
                              onChange={(e) => handlePipelineConditionChange('purged', e.target.checked)}
                              className="w-4 h-4"
                            />
                            <span className="text-sm">Purged</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.checklist6A.pipelineConditions.inerted}
                              onChange={(e) => handlePipelineConditionChange('inerted', e.target.checked)}
                              className="w-4 h-4"
                            />
                            <span className="text-sm">Inerted</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.checklist6A.pipelineConditions.depressurized}
                              onChange={(e) => handlePipelineConditionChange('depressurized', e.target.checked)}
                              className="w-4 h-4"
                            />
                            <span className="text-sm">Depressurized</span>
                          </label>
                        </div>
                      )}
                    </td>
                    <td className="border border-gray-600 p-3">
                      <div className="flex flex-col gap-2 items-center">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.status.yes}
                            onChange={(e) => handleChecklist6AStatusChange(index, 'yes', e.target.checked)}
                            className="w-4 h-4"
                          />
                          <span className="text-sm">Yes</span>
                        </label>
                        {item.hasNotApplicable && (
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={item.status.notApplicable}
                              onChange={(e) => handleChecklist6AStatusChange(index, 'notApplicable', e.target.checked)}
                              className="w-4 h-4"
                            />
                            <span className="text-sm">NA</span>
                          </label>
                        )}
                      </div>
                    </td>
                    <td className="border border-gray-600 p-3">
                      <input
                        type="text"
                        value={item.remarks}
                        onChange={(e) => handleChecklist6ARemarksChange(index, e.target.value)}
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

        {/* Checklist 6B Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">CL:6B – CHECKS AFTER DISCONNECTION BEFORE UNMOORING</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-600">
              <thead>
                <tr className="bg-gray-700">
                  <th className="border border-gray-600 p-3 text-center w-16">CL 6B</th>
                  <th className="border border-gray-600 p-3 text-left">Checks before Unmooring</th>
                  <th className="border border-gray-600 p-3 text-center w-32">Status</th>
                  <th className="border border-gray-600 p-3 text-left">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {formData.checklist6B.map((item, index) => (
                  <tr key={item.clNumber} className="hover:bg-gray-700">
                    <td className="border border-gray-600 p-3 text-center font-semibold">
                      {item.clNumber}
                    </td>
                    <td className="border border-gray-600 p-3">
                      <span className="text-sm">{item.description}</span>
                    </td>
                    <td className="border border-gray-600 p-3">
                      <div className="flex flex-col gap-2 items-center">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.status.yes}
                            onChange={(e) => handleChecklist6BStatusChange(index, 'yes', e.target.checked)}
                            className="w-4 h-4"
                          />
                          <span className="text-sm">Yes</span>
                        </label>
                        {item.hasNotApplicable && (
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={item.status.notApplicable}
                              onChange={(e) => handleChecklist6BStatusChange(index, 'notApplicable', e.target.checked)}
                              className="w-4 h-4"
                            />
                            <span className="text-sm">NA</span>
                          </label>
                        )}
                      </div>
                    </td>
                    <td className="border border-gray-600 p-3">
                      <input
                        type="text"
                        value={item.remarks}
                        onChange={(e) => handleChecklist6BRemarksChange(index, e.target.value)}
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
                <label htmlFor="terminal-name" className="block text-sm mb-1">Terminal: Name:</label>
                <input
                  id="terminal-name"
                  type="text"
                  value={formData.responsiblePersons.terminalName}
                  onChange={(e) => handleResponsiblePersonChange('terminalName', e.target.value)}
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
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded cursor-pointer transition-colors cursor-pointer"
          >
            Submit Checklist
          </button>
        </div>
      </div>
    </div>
  );
}

