'use client';

import { useState } from 'react';
import Image from 'next/image';

// Default Checklist 5A items
const DEFAULT_CHECKLIST_5A = [
  { clNumber: 1, description: 'Gas detection systems are tested and operational', hasNotApplicable: false },
  { clNumber: 2, description: 'Deck seal and P/V breaker levels have been checked and are satisfactory', hasNotApplicable: true },
  { clNumber: 3, description: 'Oxygen analyser has been checked and calibrated', hasNotApplicable: true },
  { clNumber: 4, description: 'Ship\'s ESD arrangements, including automatic valves, are tested and ready for activation', hasNotApplicable: false },
  { clNumber: 5, description: 'Linked ESD connections are established and tested', hasNotApplicable: true },
  { clNumber: 6, description: 'Other parties informed on \'ready to transfer\'', hasNotApplicable: false },
];

// Default Checklist 5B Ship Repetitive Check rows
const DEFAULT_CHECKLIST_5B_ROWS = [
  { checkName: 'Date/time of check', hasRef: false, hasNotApplicable: false },
  { checkName: 'Weather/wave conditions within limits', hasRef: false, hasNotApplicable: false },
  { checkName: 'Mooring and fender arrangement is effective', hasRef: false, hasNotApplicable: false },
  { checkName: 'Access to and from the ship is safe and controlled', hasRef: false, hasNotApplicable: false },
  { checkName: 'IGS and monitoring and recording system are operational, tank atmospheres are at positive pressure', hasRef: false, hasNotApplicable: true },
  { checkName: 'Communication is effective', hasRef: false, hasNotApplicable: false },
  { checkName: 'Illumination is sufficient and effective', hasRef: false, hasNotApplicable: false },
  { checkName: 'Cargo transfer and level monitoring system is operational', hasRef: false, hasNotApplicable: false },
  { checkName: 'External openings in superstructures are controlled', hasRef: false, hasNotApplicable: false },
  { checkName: 'Pumproom ventilation is effective', hasRef: false, hasNotApplicable: true },
  { checkName: 'Ignition source and toxicity restrictions are observed', hasRef: false, hasNotApplicable: false },
  { checkName: 'MOB restrictions are observed', hasRef: false, hasNotApplicable: true },
  { checkName: 'ESD system is operational', hasRef: false, hasNotApplicable: false },
  { checkName: 'Initials', hasRef: false, hasNotApplicable: false },
];

// Default Checklist 5C Terminal Repetitive Check rows
const DEFAULT_CHECKLIST_5C_ROWS = [
  { checkName: 'Date/time of check', hasRef: false, hasNotApplicable: false },
  { checkName: 'Weather / Wave conditions Within limits', hasRef: false, hasNotApplicable: false },
  { checkName: 'Mooring and fendering arrangement is effective', hasRef: false, hasNotApplicable: false },
  { checkName: 'Access to and from the ship and terminal is safe and controlled', hasRef: false, hasNotApplicable: false },
  { checkName: 'Communication is effective', hasRef: false, hasNotApplicable: false },
  { checkName: 'Illumination is sufficient and effective', hasRef: false, hasNotApplicable: false },
  { checkName: 'Ignition Source and toxicity restrictions are observed', hasRef: false, hasNotApplicable: false },
  { checkName: 'SIMOPS restrictions are observed', hasRef: false, hasNotApplicable: false },
  { checkName: 'Terminal Emergency response is prepared', hasRef: false, hasNotApplicable: false },
  { checkName: 'Initials', hasRef: false, hasNotApplicable: false },
];

// Number of time columns for repetitive checks
const NUM_TIME_COLUMNS = 7; // For 5B
const NUM_TIME_COLUMNS_5C = 6; // For 5C

export default function STSChecklist5AC() {
  const [formData, setFormData] = useState({
    // Document Info
    documentInfo: {
      formNo: 'OPS-OFD-005',
      issueDate: new Date().toISOString().split('T')[0],
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
    // Checklist 5A
    checklist5A: DEFAULT_CHECKLIST_5A.map(item => ({
      clNumber: item.clNumber,
      description: item.description,
      status: { yes: false, notApplicable: false },
      remarks: '',
      hasNotApplicable: item.hasNotApplicable,
    })),
    // Checklist 5B Ship
    checklist5BShip: {
      noteIntervalHours: '',
      entityName: '',
      rows: DEFAULT_CHECKLIST_5B_ROWS.map(row => ({
        checkName: row.checkName,
        ref: '',
        timeChecks: new Array(NUM_TIME_COLUMNS).fill(null).map((_, idx) => ({
          timeLabel: `Time${idx + 1}`,
          yes: false,
          dateTime: '', // For Date/time of check row
        })),
        notApplicable: false,
        remarks: '',
        hasNotApplicable: row.hasNotApplicable,
        hasRef: row.hasRef,
      })),
      initials: new Array(NUM_TIME_COLUMNS).fill(''),
    },
    // Checklist 5C Terminal
    checklist5CTerminal: {
      noteIntervalHours: '',
      entityName: '',
      rows: DEFAULT_CHECKLIST_5C_ROWS.map(row => ({
        checkName: row.checkName,
        ref: '',
        timeChecks: new Array(NUM_TIME_COLUMNS_5C).fill(null).map((_, idx) => ({
          timeLabel: `Time${idx + 1}`,
          yes: false,
          dateTime: '', // For Date/time of check row
        })),
        notApplicable: false,
        remarks: '',
        hasNotApplicable: row.hasNotApplicable,
        hasRef: row.hasRef,
      })),
      initials: new Array(NUM_TIME_COLUMNS_5C).fill(''),
    },
    // Signature
    signature: {
      name: '',
      rank: '',
      signature: '',
      date: '',
    },
  });

  // Document Info handlers (currently not used but kept for future use)
  // const handleDocumentInfoChange = (field, value) => {
  //   setFormData({
  //     ...formData,
  //     documentInfo: {
  //       ...formData.documentInfo,
  //       [field]: value,
  //     },
  //   });
  // };

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

  // Checklist 5A handlers
  const handleChecklist5AStatusChange = (index, field, checked) => {
    const updatedChecklist = [...formData.checklist5A];
    updatedChecklist[index].status[field] = checked;
    // If one is checked, uncheck the other
    if (checked && field === 'yes') {
      updatedChecklist[index].status.notApplicable = false;
    } else if (checked && field === 'notApplicable') {
      updatedChecklist[index].status.yes = false;
    }
    setFormData({ ...formData, checklist5A: updatedChecklist });
  };

  const handleChecklist5ARemarksChange = (index, value) => {
    const updatedChecklist = [...formData.checklist5A];
    updatedChecklist[index].remarks = value;
    setFormData({ ...formData, checklist5A: updatedChecklist });
  };

  // Checklist 5B Ship handlers
  const handleChecklist5BShipFieldChange = (field, value) => {
    setFormData({
      ...formData,
      checklist5BShip: {
        ...formData.checklist5BShip,
        [field]: value,
      },
    });
  };

  const handleChecklist5BShipRowTimeCheck = (rowIndex, timeIndex, checked) => {
    const updatedRows = [...formData.checklist5BShip.rows];
    updatedRows[rowIndex].timeChecks[timeIndex].yes = checked;
    setFormData({
      ...formData,
      checklist5BShip: {
        ...formData.checklist5BShip,
        rows: updatedRows,
      },
    });
  };

  const handleChecklist5BShipRowDateTimeChange = (rowIndex, timeIndex, value) => {
    const updatedRows = [...formData.checklist5BShip.rows];
    updatedRows[rowIndex].timeChecks[timeIndex].dateTime = value;
    setFormData({
      ...formData,
      checklist5BShip: {
        ...formData.checklist5BShip,
        rows: updatedRows,
      },
    });
  };

  const handleChecklist5BShipRowNotApplicable = (rowIndex, checked) => {
    const updatedRows = [...formData.checklist5BShip.rows];
    updatedRows[rowIndex].notApplicable = checked;
    setFormData({
      ...formData,
      checklist5BShip: {
        ...formData.checklist5BShip,
        rows: updatedRows,
      },
    });
  };

  const handleChecklist5BShipRowRemarksChange = (rowIndex, value) => {
    const updatedRows = [...formData.checklist5BShip.rows];
    updatedRows[rowIndex].remarks = value;
    setFormData({
      ...formData,
      checklist5BShip: {
        ...formData.checklist5BShip,
        rows: updatedRows,
      },
    });
  };

  const handleChecklist5BShipInitialsChange = (timeIndex, value) => {
    const updatedInitials = [...formData.checklist5BShip.initials];
    updatedInitials[timeIndex] = value;
    setFormData({
      ...formData,
      checklist5BShip: {
        ...formData.checklist5BShip,
        initials: updatedInitials,
      },
    });
  };

  // Checklist 5C Terminal handlers
  const handleChecklist5CTerminalFieldChange = (field, value) => {
    setFormData({
      ...formData,
      checklist5CTerminal: {
        ...formData.checklist5CTerminal,
        [field]: value,
      },
    });
  };

  const handleChecklist5CTerminalRowTimeCheck = (rowIndex, timeIndex, checked) => {
    const updatedRows = [...formData.checklist5CTerminal.rows];
    updatedRows[rowIndex].timeChecks[timeIndex].yes = checked;
    setFormData({
      ...formData,
      checklist5CTerminal: {
        ...formData.checklist5CTerminal,
        rows: updatedRows,
      },
    });
  };

  const handleChecklist5CTerminalRowDateTimeChange = (rowIndex, timeIndex, value) => {
    const updatedRows = [...formData.checklist5CTerminal.rows];
    updatedRows[rowIndex].timeChecks[timeIndex].dateTime = value;
    setFormData({
      ...formData,
      checklist5CTerminal: {
        ...formData.checklist5CTerminal,
        rows: updatedRows,
      },
    });
  };

  const handleChecklist5CTerminalRowNotApplicable = (rowIndex, checked) => {
    const updatedRows = [...formData.checklist5CTerminal.rows];
    updatedRows[rowIndex].notApplicable = checked;
    setFormData({
      ...formData,
      checklist5CTerminal: {
        ...formData.checklist5CTerminal,
        rows: updatedRows,
      },
    });
  };

  const handleChecklist5CTerminalRowRemarksChange = (rowIndex, value) => {
    const updatedRows = [...formData.checklist5CTerminal.rows];
    updatedRows[rowIndex].remarks = value;
    setFormData({
      ...formData,
      checklist5CTerminal: {
        ...formData.checklist5CTerminal,
        rows: updatedRows,
      },
    });
  };

  const handleChecklist5CTerminalInitialsChange = (timeIndex, value) => {
    const updatedInitials = [...formData.checklist5CTerminal.initials];
    updatedInitials[timeIndex] = value;
    setFormData({
      ...formData,
      checklist5CTerminal: {
        ...formData.checklist5CTerminal,
        initials: updatedInitials,
      },
    });
  };

  // Signature handlers
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
    // eslint-disable-next-line no-console
    console.log('Form Data:', formData);
  };

  // Render repetitive check section
  const renderRepetitiveCheckSection = (sectionData, sectionType, numTimeColumns) => {
    const is5B = sectionType === '5B';
    const sectionTitle = is5B 
      ? 'CHECKLIST 5B - SHIP REPETITIVE CHECKS DURING TRANSFER'
      : 'CL 5C - TERMINAL REPETATIVE CHECKS DURING TRANSFER';
    const entityLabel = is5B ? 'For Ship:' : 'Terminal:';
    
    const handleFieldChange = is5B 
      ? handleChecklist5BShipFieldChange 
      : handleChecklist5CTerminalFieldChange;
    const handleTimeCheck = is5B
      ? handleChecklist5BShipRowTimeCheck
      : handleChecklist5CTerminalRowTimeCheck;
    const handleDateTimeChange = is5B
      ? handleChecklist5BShipRowDateTimeChange
      : handleChecklist5CTerminalRowDateTimeChange;
    const handleNotApplicable = is5B
      ? handleChecklist5BShipRowNotApplicable
      : handleChecklist5CTerminalRowNotApplicable;
    const handleRemarksChange = is5B
      ? handleChecklist5BShipRowRemarksChange
      : handleChecklist5CTerminalRowRemarksChange;
    const handleInitialsChange = is5B
      ? handleChecklist5BShipInitialsChange
      : handleChecklist5CTerminalInitialsChange;

    return (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{sectionTitle}</h3>
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <label htmlFor={`note-interval-${sectionType}`} className="text-sm">Note interval:</label>
              <input
                id={`note-interval-${sectionType}`}
                type="number"
                value={sectionData.noteIntervalHours}
                onChange={(e) => handleFieldChange('noteIntervalHours', e.target.value)}
                className="w-16 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
              />
              <span className="text-sm">hrs.</span>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor={`entity-name-${sectionType}`} className="text-sm">{entityLabel}</label>
              <input
                id={`entity-name-${sectionType}`}
                type="text"
                value={sectionData.entityName}
                onChange={(e) => handleFieldChange('entityName', e.target.value)}
                className="w-48 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-600">
            <thead>
              <tr className="bg-gray-700">
                <th className="border border-gray-600 p-3 text-left">Check</th>
                {sectionData.rows[0]?.hasRef && (
                  <th className="border border-gray-600 p-3 text-center w-24">Ref.</th>
                )}
                {new Array(numTimeColumns).fill(null).map((_, idx) => (
                  <th key={idx} className="border border-gray-600 p-3 text-center min-w-[100px]">
                    Time
                  </th>
                ))}
                <th className="border border-gray-600 p-3 text-left">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {sectionData.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-700">
                  <td className="border border-gray-600 p-3">
                    <span className="text-sm">{row.checkName}</span>
                  </td>
                  {row.hasRef && (
                    <td className="border border-gray-600 p-3">
                      <input
                        type="text"
                        value={row.ref}
                        onChange={(e) => {
                          const updatedRows = [...sectionData.rows];
                          updatedRows[rowIndex].ref = e.target.value;
                          handleFieldChange('rows', updatedRows);
                        }}
                        className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                      />
                    </td>
                  )}
                  {row.timeChecks.map((timeCheck, timeIndex) => (
                    <td key={timeIndex} className="border border-gray-600 p-3 text-center">
                      {row.checkName === 'Date/time of check' ? (
                        <input
                          type="datetime-local"
                          value={timeCheck.dateTime || ''}
                          onChange={(e) => handleDateTimeChange(rowIndex, timeIndex, e.target.value)}
                          className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                        />
                      ) : row.checkName === 'Initials' ? (
                        <input
                          type="text"
                          value={sectionData.initials[timeIndex] || ''}
                          onChange={(e) => handleInitialsChange(timeIndex, e.target.value)}
                          className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm text-center"
                          placeholder="Initials"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-1">
                          <input
                            type="checkbox"
                            checked={timeCheck.yes}
                            onChange={(e) => handleTimeCheck(rowIndex, timeIndex, e.target.checked)}
                            className="w-4 h-4"
                          />
                          <span className="text-xs">Yes</span>
                        </div>
                      )}
                    </td>
                  ))}
                  <td className="border border-gray-600 p-3">
                    {row.checkName === 'Initials' ? (
                      <span className="text-sm text-gray-500">-</span>
                    ) : row.hasNotApplicable ? (
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={row.notApplicable}
                            onChange={(e) => handleNotApplicable(rowIndex, e.target.checked)}
                            className="w-4 h-4"
                          />
                          <span className="text-sm">Not applicable</span>
                        </label>
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={row.remarks}
                        onChange={(e) => handleRemarksChange(rowIndex, e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                        placeholder="Remarks..."
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
              CHECKLIST 5A-C – AFTER CONNECTION CHECKS TILL DISCONNECTION
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

        {/* Transfer Information Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">General Information</h3>
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

        {/* Checklist 5A Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">CHECKLIST 5A: After Connection Checks before Operation</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-600">
              <thead>
                <tr className="bg-gray-700">
                  <th className="border border-gray-600 p-3 text-center w-16">CL 5A</th>
                  <th className="border border-gray-600 p-3 text-left">Check</th>
                  <th className="border border-gray-600 p-3 text-center w-32">Status</th>
                  <th className="border border-gray-600 p-3 text-left">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {formData.checklist5A.map((item, index) => (
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
                            onChange={(e) => handleChecklist5AStatusChange(index, 'yes', e.target.checked)}
                            className="w-4 h-4"
                          />
                          <span className="text-sm">Yes</span>
                        </label>
                        {item.hasNotApplicable && (
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={item.status.notApplicable}
                              onChange={(e) => handleChecklist5AStatusChange(index, 'notApplicable', e.target.checked)}
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
                        value={item.remarks}
                        onChange={(e) => handleChecklist5ARemarksChange(index, e.target.value)}
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

        {/* Checklist 5B Ship Repetitive Section */}
        {renderRepetitiveCheckSection(formData.checklist5BShip, '5B', NUM_TIME_COLUMNS)}

        {/* Checklist 5C Terminal Repetitive Section */}
        {renderRepetitiveCheckSection(formData.checklist5CTerminal, '5C', NUM_TIME_COLUMNS_5C)}

        {/* Signature Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Signature</h3>
          <div className="bg-gray-700 p-6 rounded">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label htmlFor="signature-name" className="block text-sm mb-1">Name:</label>
                <input
                  id="signature-name"
                  type="text"
                  value={formData.signature.name}
                  onChange={(e) => handleSignatureChange('name', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                />
              </div>
              <div>
                <label htmlFor="signature-rank" className="block text-sm mb-1">Rank:</label>
                <input
                  id="signature-rank"
                  type="text"
                  value={formData.signature.rank}
                  onChange={(e) => handleSignatureChange('rank', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                />
              </div>
              <div>
                <label htmlFor="signature-file" className="block text-sm mb-1">Signature:</label>
                <input
                  id="signature-file"
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
                <label htmlFor="signature-date" className="block text-sm mb-1">Date:</label>
                <input
                  id="signature-date"
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
            onClick={() => globalThis.print()}
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

