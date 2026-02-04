'use client';

import { useState } from 'react';
import Image from 'next/image';

// Number of rows for each table
const FENDER_ROWS = 10;
const HOSE_ROWS = 5;
const OTHER_EQUIPMENT_ROWS = 5;

export default function STSEquipmentChecklist() {
  const [formData, setFormData] = useState({
    // Document Info
    documentInfo: {
      formNo: 'OPS-OFD-014',

      issueDate: new Date().toISOString().split('T')[0],
      approvedBy: 'JS',

    },
    // Job Info
    jobInfo: {
      jobNumber: '',
      date: new Date().toISOString().split('T')[0],
      time: '',
      mooringMasterName: '',
      location: '',
      operationPhase: 'BEFORE_OPERATION',
    },
    // Fender Equipment (10 rows)
    fenderEquipment: new Array(FENDER_ROWS).fill(null).map(() => ({
      fenderId: '',
      endPlates: '',
      bShackle: '',
      swivel: '',
      secondShackle: '',
      mooringShackle: '',
      fenderBody: '',
      tires: '',
      pressure: '',
    })),
    // Hose Equipment (5 rows)
    hoseEquipment: new Array(HOSE_ROWS).fill(null).map(() => ({
      hoseId: '',
      endFlanges: '',
      bodyCondition: '',
      nutsBolts: '',
      markings: '',
    })),
    // Other Equipment (5 rows)
    otherEquipment: new Array(OTHER_EQUIPMENT_ROWS).fill(null).map(() => ({
      equipmentId: '',
      gaskets: '',
      ropes: '',
      wires: '',
      billyPugh: '',
      liftingStrops: '',
    })),
    // Remarks
    remarks: '',
    // Signature Block
    signatureBlock: {
      mooringMasterSignature: '',
    },
  });

  // Job Info handlers
  const handleJobInfoChange = (field, value) => {
    setFormData({
      ...formData,
      jobInfo: {
        ...formData.jobInfo,
        [field]: value,
      },
    });
  };

  // Fender Equipment handlers
  const handleFenderEquipmentChange = (rowIndex, field, value) => {
    const updatedRows = [...formData.fenderEquipment];
    updatedRows[rowIndex][field] = value;
    setFormData({
      ...formData,
      fenderEquipment: updatedRows,
    });
  };

  // Hose Equipment handlers
  const handleHoseEquipmentChange = (rowIndex, field, value) => {
    const updatedRows = [...formData.hoseEquipment];
    updatedRows[rowIndex][field] = value;
    setFormData({
      ...formData,
      hoseEquipment: updatedRows,
    });
  };

  // Other Equipment handlers
  const handleOtherEquipmentChange = (rowIndex, field, value) => {
    const updatedRows = [...formData.otherEquipment];
    updatedRows[rowIndex][field] = value;
    setFormData({
      ...formData,
      otherEquipment: updatedRows,
    });
  };

  // Add row handlers
  const handleAddFenderRow = () => {
    setFormData({
      ...formData,
      fenderEquipment: [
        ...formData.fenderEquipment,
        {
          fenderId: '',
          endPlates: '',
          bShackle: '',
          swivel: '',
          secondShackle: '',
          mooringShackle: '',
          fenderBody: '',
          tires: '',
          pressure: '',
        },
      ],
    });
  };

  const handleAddHoseRow = () => {
    setFormData({
      ...formData,
      hoseEquipment: [
        ...formData.hoseEquipment,
        {
          hoseId: '',
          endFlanges: '',
          bodyCondition: '',
          nutsBolts: '',
          markings: '',
        },
      ],
    });
  };

  const handleAddOtherEquipmentRow = () => {
    setFormData({
      ...formData,
      otherEquipment: [
        ...formData.otherEquipment,
        {
          equipmentId: '',
          gaskets: '',
          ropes: '',
          wires: '',
          billyPugh: '',
          liftingStrops: '',
        },
      ],
    });
  };

  // Remove row handlers
  const handleRemoveFenderRow = (rowIndex) => {
    if (formData.fenderEquipment.length > 1) {
      const updatedRows = formData.fenderEquipment.filter((_, index) => index !== rowIndex);
      setFormData({
        ...formData,
        fenderEquipment: updatedRows,
      });
    }
  };

  const handleRemoveHoseRow = (rowIndex) => {
    if (formData.hoseEquipment.length > 1) {
      const updatedRows = formData.hoseEquipment.filter((_, index) => index !== rowIndex);
      setFormData({
        ...formData,
        hoseEquipment: updatedRows,
      });
    }
  };

  const handleRemoveOtherEquipmentRow = (rowIndex) => {
    if (formData.otherEquipment.length > 1) {
      const updatedRows = formData.otherEquipment.filter((_, index) => index !== rowIndex);
      setFormData({
        ...formData,
        otherEquipment: updatedRows,
      });
    }
  };

  // Remarks handler
  const handleRemarksChange = (value) => {
    setFormData({
      ...formData,
      remarks: value,
    });
  };

  // Signature handler
  const handleSignatureUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setFormData({
          ...formData,
          signatureBlock: {
            mooringMasterSignature: base64String,
          },
        });
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
              STS Equipment Checklist
            </h1>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="operationPhase"
                  value="BEFORE_OPERATION"
                  checked={formData.jobInfo.operationPhase === 'BEFORE_OPERATION'}
                  onChange={(e) => handleJobInfoChange('operationPhase', e.target.value)}
                  className="w-4 h-4"
                />
                <span className="text-sm">Before Operation</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="operationPhase"
                  value="AFTER_OPERATION"
                  checked={formData.jobInfo.operationPhase === 'AFTER_OPERATION'}
                  onChange={(e) => handleJobInfoChange('operationPhase', e.target.value)}
                  className="w-4 h-4"
                />
                <span className="text-sm">After Operation</span>
              </label>
            </div>
          </div>
          <div className="bg-gray-700 p-4 rounded min-w-[200px]">
            <div className="text-sm space-y-1">
              <div><strong>Form No:</strong> {formData.documentInfo.formNo}</div>
              <div><strong>Issue Date:</strong> {formData.documentInfo.issueDate}</div>
              <div><strong>Approved by:</strong> {formData.documentInfo.approvedBy}</div>

            </div>
          </div>
        </div>

        {/* Job Information Section */}
        <div className="mb-8">
          <div className="grid grid-cols-5 gap-4">
            <div>
              <label htmlFor="job-number" className="block text-sm mb-1 font-semibold">Job #:</label>
              <input
                id="job-number"
                type="text"
                value={formData.jobInfo.jobNumber}
                onChange={(e) => handleJobInfoChange('jobNumber', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                placeholder="Enter Job Reference Number"
              />
            </div>
            <div>
              <label htmlFor="job-date" className="block text-sm mb-1 font-semibold">Date:</label>
              <input
                id="job-date"
                type="date"
                value={formData.jobInfo.date}
                onChange={(e) => handleJobInfoChange('date', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label htmlFor="job-time" className="block text-sm mb-1 font-semibold">Time:</label>
              <input
                id="job-time"
                type="time"
                value={formData.jobInfo.time}
                onChange={(e) => handleJobInfoChange('time', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                placeholder="Enter Time"
              />
            </div>
            <div>
              <label htmlFor="mooring-master" className="block text-sm mb-1 font-semibold">Mooring Master:</label>
              <input
                id="mooring-master"
                type="text"
                value={formData.jobInfo.mooringMasterName}
                onChange={(e) => handleJobInfoChange('mooringMasterName', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                placeholder="Enter Mooring M. Name"
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm mb-1 font-semibold">Location:</label>
              <input
                id="location"
                type="text"
                value={formData.jobInfo.location}
                onChange={(e) => handleJobInfoChange('location', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                placeholder="Enter Location"
              />
            </div>
          </div>
        </div>

        {/* Fender Equipment Table */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Fender Equipment Checklist</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-600">
              <thead>
                <tr className="bg-gray-700">
                  <th className="border border-gray-600 p-3 text-center bg-gray-600">Fender ID #</th>
                  <th className="border border-gray-600 p-3 text-center">End Plates</th>
                  <th className="border border-gray-600 p-3 text-center">B. Shackle</th>
                  <th className="border border-gray-600 p-3 text-center">Swivel</th>
                  <th className="border border-gray-600 p-3 text-center">2nd Shackle</th>
                  <th className="border border-gray-600 p-3 text-center">Mooring Shackle</th>
                  <th className="border border-gray-600 p-3 text-center">Fender Body</th>
                  <th className="border border-gray-600 p-3 text-center">Tires</th>
                  <th className="border border-gray-600 p-3 text-center">Pressure</th>
                  <th className="border border-gray-600 p-3 text-center w-20">Action</th>
                </tr>
              </thead>
              <tbody>
                {formData.fenderEquipment.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-700">
                    <td className="border border-gray-600 p-2 bg-gray-600">
                      <input
                        type="text"
                        value={row.fenderId}
                        onChange={(e) => handleFenderEquipmentChange(index, 'fenderId', e.target.value)}
                        className="w-full bg-gray-700 border border-gray-500 rounded px-2 py-1 text-white text-sm"
                      />
                    </td>
                    <td className="border border-gray-600 p-2">
                      <input
                        type="text"
                        value={row.endPlates}
                        onChange={(e) => handleFenderEquipmentChange(index, 'endPlates', e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                      />
                    </td>
                    <td className="border border-gray-600 p-2">
                      <input
                        type="text"
                        value={row.bShackle}
                        onChange={(e) => handleFenderEquipmentChange(index, 'bShackle', e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                      />
                    </td>
                    <td className="border border-gray-600 p-2">
                      <input
                        type="text"
                        value={row.swivel}
                        onChange={(e) => handleFenderEquipmentChange(index, 'swivel', e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                      />
                    </td>
                    <td className="border border-gray-600 p-2">
                      <input
                        type="text"
                        value={row.secondShackle}
                        onChange={(e) => handleFenderEquipmentChange(index, 'secondShackle', e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                      />
                    </td>
                    <td className="border border-gray-600 p-2">
                      <input
                        type="text"
                        value={row.mooringShackle}
                        onChange={(e) => handleFenderEquipmentChange(index, 'mooringShackle', e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                      />
                    </td>
                    <td className="border border-gray-600 p-2">
                      <input
                        type="text"
                        value={row.fenderBody}
                        onChange={(e) => handleFenderEquipmentChange(index, 'fenderBody', e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                      />
                    </td>
                    <td className="border border-gray-600 p-2">
                      <input
                        type="text"
                        value={row.tires}
                        onChange={(e) => handleFenderEquipmentChange(index, 'tires', e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                      />
                    </td>
                    <td className="border border-gray-600 p-2">
                      <input
                        type="text"
                        value={row.pressure}
                        onChange={(e) => handleFenderEquipmentChange(index, 'pressure', e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                      />
                    </td>
                    <td className="border border-gray-600 p-2 text-center">
                      {formData.fenderEquipment.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveFenderRow(index)}
                          className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-white text-xs"
                        >
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            onClick={handleAddFenderRow}
            className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white text-sm"
          >
            + Add Row
          </button>
        </div>

        {/* Hose Equipment Table */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Hose Equipment Checklist</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-600">
              <thead>
                <tr className="bg-gray-700">
                  <th className="border border-gray-600 p-3 text-center bg-gray-600">Hose ID #</th>
                  <th className="border border-gray-600 p-3 text-center">End Flanges</th>
                  <th className="border border-gray-600 p-3 text-center">Body Condition</th>
                  <th className="border border-gray-600 p-3 text-center">Nuts/Bolts</th>
                  <th className="border border-gray-600 p-3 text-center">Markings</th>
                  <th className="border border-gray-600 p-3 text-center w-20">Action</th>
                </tr>
              </thead>
              <tbody>
                {formData.hoseEquipment.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-700">
                    <td className="border border-gray-600 p-2 bg-gray-600">
                      <input
                        type="text"
                        value={row.hoseId}
                        onChange={(e) => handleHoseEquipmentChange(index, 'hoseId', e.target.value)}
                        className="w-full bg-gray-700 border border-gray-500 rounded px-2 py-1 text-white text-sm"
                      />
                    </td>
                    <td className="border border-gray-600 p-2">
                      <input
                        type="text"
                        value={row.endFlanges}
                        onChange={(e) => handleHoseEquipmentChange(index, 'endFlanges', e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                      />
                    </td>
                    <td className="border border-gray-600 p-2">
                      <input
                        type="text"
                        value={row.bodyCondition}
                        onChange={(e) => handleHoseEquipmentChange(index, 'bodyCondition', e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                      />
                    </td>
                    <td className="border border-gray-600 p-2">
                      <input
                        type="text"
                        value={row.nutsBolts}
                        onChange={(e) => handleHoseEquipmentChange(index, 'nutsBolts', e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                      />
                    </td>
                    <td className="border border-gray-600 p-2">
                      <input
                        type="text"
                        value={row.markings}
                        onChange={(e) => handleHoseEquipmentChange(index, 'markings', e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                      />
                    </td>
                    <td className="border border-gray-600 p-2 text-center">
                      {formData.hoseEquipment.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveHoseRow(index)}
                          className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-white text-xs"
                        >
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            onClick={handleAddHoseRow}
            className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white text-sm"
          >
            + Add Row
          </button>
        </div>

        {/* Other Equipment Table */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Other Equipment Checklist</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-600">
              <thead>
                <tr className="bg-gray-700">
                  <th className="border border-gray-600 p-3 text-center bg-gray-600">Other Equipment ID #</th>
                  <th className="border border-gray-600 p-3 text-center">Gaskets</th>
                  <th className="border border-gray-600 p-3 text-center">Ropes</th>
                  <th className="border border-gray-600 p-3 text-center">Wires</th>
                  <th className="border border-gray-600 p-3 text-center">Billy Pugh</th>
                  <th className="border border-gray-600 p-3 text-center">Lifting Strops</th>
                  <th className="border border-gray-600 p-3 text-center w-20">Action</th>
                </tr>
              </thead>
              <tbody>
                {formData.otherEquipment.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-700">
                    <td className="border border-gray-600 p-2 bg-gray-600">
                      <input
                        type="text"
                        value={row.equipmentId}
                        onChange={(e) => handleOtherEquipmentChange(index, 'equipmentId', e.target.value)}
                        className="w-full bg-gray-700 border border-gray-500 rounded px-2 py-1 text-white text-sm"
                      />
                    </td>
                    <td className="border border-gray-600 p-2">
                      <input
                        type="text"
                        value={row.gaskets}
                        onChange={(e) => handleOtherEquipmentChange(index, 'gaskets', e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                      />
                    </td>
                    <td className="border border-gray-600 p-2">
                      <input
                        type="text"
                        value={row.ropes}
                        onChange={(e) => handleOtherEquipmentChange(index, 'ropes', e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                      />
                    </td>
                    <td className="border border-gray-600 p-2">
                      <input
                        type="text"
                        value={row.wires}
                        onChange={(e) => handleOtherEquipmentChange(index, 'wires', e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                      />
                    </td>
                    <td className="border border-gray-600 p-2">
                      <input
                        type="text"
                        value={row.billyPugh}
                        onChange={(e) => handleOtherEquipmentChange(index, 'billyPugh', e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                      />
                    </td>
                    <td className="border border-gray-600 p-2">
                      <input
                        type="text"
                        value={row.liftingStrops}
                        onChange={(e) => handleOtherEquipmentChange(index, 'liftingStrops', e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                      />
                    </td>
                    <td className="border border-gray-600 p-2 text-center">
                      {formData.otherEquipment.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveOtherEquipmentRow(index)}
                          className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-white text-xs"
                        >
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            onClick={handleAddOtherEquipmentRow}
            className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white text-sm"
          >
            + Add Row
          </button>
        </div>

        {/* Signature and Remarks Section */}
        <div className="mb-8 grid grid-cols-2 gap-6">
          <div>
            <label htmlFor="signature" className="block text-sm mb-1 font-semibold">Signature of Mooring Master:</label>
            <input
              id="signature"
              type="file"
              accept="image/*"
              onChange={handleSignatureUpload}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
            />
            {formData.signatureBlock.mooringMasterSignature && (
              <div className="mt-2">
                <img
                  src={formData.signatureBlock.mooringMasterSignature}
                  alt="Signature preview"
                  className="max-w-full h-32 border border-gray-600 rounded bg-white p-2"
                />
                <button
                  type="button"
                  onClick={() => setFormData({
                    ...formData,
                    signatureBlock: { mooringMasterSignature: '' },
                  })}
                  className="mt-2 text-sm text-red-400 hover:text-red-300"
                >
                  Remove Signature
                </button>
              </div>
            )}
          </div>
          <div>
            <label htmlFor="remarks" className="block text-sm mb-1 font-semibold">Remarks:</label>
            <textarea
              id="remarks"
              value={formData.remarks}
              onChange={(e) => handleRemarksChange(e.target.value)}
              rows={6}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
              placeholder="Enter remarks..."
            />
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

