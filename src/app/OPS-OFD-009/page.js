'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { submitChecklistForm } from '@/lib/api';

export default function MooringMastersJobReport() {
  const [formData, setFormData] = useState({
    // Document Info
    documentInfo: {
      formNo: 'OPS-OFD-009',
      issueDate: new Date().toISOString().split('T')[0],
      approvedBy: 'JS',
    },
    // Ship to be Lightered (STBL)
    shipToBeLighted: {
      locationSTSPosition: '',
      vesselName: '',
      arrivalDisplacement: '',
      arrivalDrafts: '',
      pblCommencementArrivalDrafts: '',
      pblCentreManifoldForwardArrival: '',
      pblCentreManifoldAftArrival: '',
      pblCompletionDepartureDrafts: '',
      maxFreeboard: '',
      minFreeboard: '',
      deadSlowAheadSpeed: '',
      bridgeWingToCentreManifoldDistance: '',
      craneCertifiedForPersonnelTransfer: false,
      masterWillingIfCraneNotCertified: false,
      maxCraneReachOverShipsSide: '',
      bowThrusterFitted: false,
      nightBerthingAccepted: false,
      cargo: '',
      quantityToTransfer: '',
      fenderSizes: { values: ['', ''] },
      fenderSerialNumbers: { values: ['', ''] },
      vaporHoses: { values: ['', ''] },
      hoseSizes: { values: ['', ''] },
      hoseSerialNumbers: { values: ['', ''] },
      agents: '',
      otherInformation: '',
    },
    // Receiving Ship
    receivingShip: {
      locationSTSPosition: '',
      vesselName: '',
      arrivalDisplacement: '',
      arrivalDrafts: '',
      pblCommencementArrivalDrafts: '',
      pblCentreManifoldForwardArrival: '',
      pblCentreManifoldAftArrival: '',
      pblCompletionDepartureDrafts: '',
      maxFreeboard: '',
      minFreeboard: '',
      deadSlowAheadSpeed: '',
      bridgeWingToCentreManifoldDistance: '',
      craneCertifiedForPersonnelTransfer: false,
      masterWillingIfCraneNotCertified: false,
      maxCraneReachOverShipsSide: '',
      bowThrusterFitted: false,
      nightBerthingAccepted: false,
      cargo: '',
      quantityToTransfer: '',
      fenderSizes: { values: ['', ''] },
      fenderSerialNumbers: { values: ['', ''] },
      vaporHoses: { values: ['', ''] },
      hoseSizes: { values: ['', ''] },
      hoseSerialNumbers: { values: ['', ''] },
      agents: '',
      otherInformation: '',
    },
  });

  // Handler for single value fields
  const handleVesselFieldChange = (vesselType, field, value) => {
    setFormData({
      ...formData,
      [vesselType]: {
        ...formData[vesselType],
        [field]: value,
      },
    });
  };

  // Handler for boolean fields
  const handleBooleanChange = (vesselType, field, checked) => {
    setFormData({
      ...formData,
      [vesselType]: {
        ...formData[vesselType],
        [field]: checked,
      },
    });
  };

  // Handler for equipment set fields (multi-value)
  const handleEquipmentSetChange = (vesselType, field, index, value) => {
    const updatedValues = [...formData[vesselType][field].values];
    updatedValues[index] = value;
    setFormData({
      ...formData,
      [vesselType]: {
        ...formData[vesselType],
        [field]: {
          values: updatedValues,
        },
      },
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
        shipToBeLighted: formData.shipToBeLighted,
        receivingShip: formData.receivingShip,
        status: 'DRAFT',
      };
      await submitChecklistForm('ops-ofd-009', payload);
      setSubmitSuccess(true);
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit job report.');
    } finally {
      setSubmitting(false);
    }
  };

  // Render input field for vessel
  const renderInput = (vesselType, field, type = 'text') => {
    return (
      <input
        type={type}
        value={formData[vesselType][field]}
        onChange={(e) => handleVesselFieldChange(vesselType, field, e.target.value)}
        className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
      />
    );
  };

  // Render checkbox for boolean fields
  const renderCheckbox = (vesselType, field) => {
    return (
      <div className="flex items-center justify-center">
        <input
          type="checkbox"
          checked={formData[vesselType][field]}
          onChange={(e) => handleBooleanChange(vesselType, field, e.target.checked)}
          className="w-4 h-4"
        />
      </div>
    );
  };

  // Render equipment set (2 inputs side by side)
  const renderEquipmentSet = (vesselType, field) => {
    return (
      <div className="flex gap-2">
        {formData[vesselType][field].values.map((value, index) => (
          <input
            key={index}
            type="text"
            value={value}
            onChange={(e) => handleEquipmentSetChange(vesselType, field, index, e.target.value)}
            className="flex-1 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
          />
        ))}
      </div>
    );
  };

  // Render textarea
  const renderTextarea = (vesselType, field) => {
    return (
      <textarea
        value={formData[vesselType][field]}
        onChange={(e) => handleVesselFieldChange(vesselType, field, e.target.value)}
        rows={3}
        className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
      />
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
              Mooring Master's Job Report
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

        {/* Main Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-600">
            <thead>
              <tr className="bg-gray-700">
                <th className="border border-gray-600 p-3 text-left">Detail</th>
                <th className="border border-gray-600 p-3 text-center">Ship to be Lightered (STBL)</th>
                <th className="border border-gray-600 p-3 text-center">Receiving Ship</th>
              </tr>
            </thead>
            <tbody>
              {/* Location/STS position */}
              <tr className="hover:bg-gray-700">
                <td className="border border-gray-600 p-3 font-semibold">Location/STS position:</td>
                <td className="border border-gray-600 p-3">{renderInput('shipToBeLighted', 'locationSTSPosition')}</td>
                <td className="border border-gray-600 p-3">{renderInput('receivingShip', 'locationSTSPosition')}</td>
              </tr>

              {/* Name */}
              <tr className="hover:bg-gray-700">
                <td className="border border-gray-600 p-3 font-semibold">Name:</td>
                <td className="border border-gray-600 p-3">{renderInput('shipToBeLighted', 'vesselName')}</td>
                <td className="border border-gray-600 p-3">{renderInput('receivingShip', 'vesselName')}</td>
              </tr>

              {/* Arrival Displacement */}
              <tr className="hover:bg-gray-700">
                <td className="border border-gray-600 p-3 font-semibold">Arrival Displacement:</td>
                <td className="border border-gray-600 p-3">{renderInput('shipToBeLighted', 'arrivalDisplacement')}</td>
                <td className="border border-gray-600 p-3">{renderInput('receivingShip', 'arrivalDisplacement')}</td>
              </tr>

              {/* Arrival Drafts */}
              <tr className="hover:bg-gray-700">
                <td className="border border-gray-600 p-3 font-semibold">Arrival Drafts:</td>
                <td className="border border-gray-600 p-3">{renderInput('shipToBeLighted', 'arrivalDrafts')}</td>
                <td className="border border-gray-600 p-3">{renderInput('receivingShip', 'arrivalDrafts')}</td>
              </tr>

              {/* PBL AT Commencement of Transfer on arrival drafts */}
              <tr className="hover:bg-gray-700">
                <td className="border border-gray-600 p-3 font-semibold">PBL AT Commencement of Transfer on arrival drafts:</td>
                <td className="border border-gray-600 p-3">{renderInput('shipToBeLighted', 'pblCommencementArrivalDrafts')}</td>
                <td className="border border-gray-600 p-3">{renderInput('receivingShip', 'pblCommencementArrivalDrafts')}</td>
              </tr>

              {/* PBL from Centre of manifold to forward on arrival drafts */}
              <tr className="hover:bg-gray-700">
                <td className="border border-gray-600 p-3 font-semibold">PBL from Centre of manifold to forward on arrival drafts:</td>
                <td className="border border-gray-600 p-3">{renderInput('shipToBeLighted', 'pblCentreManifoldForwardArrival')}</td>
                <td className="border border-gray-600 p-3">{renderInput('receivingShip', 'pblCentreManifoldForwardArrival')}</td>
              </tr>

              {/* PBL from Centre of manifold to aft on arrival drafts */}
              <tr className="hover:bg-gray-700">
                <td className="border border-gray-600 p-3 font-semibold">PBL from Centre of manifold to aft on arrival drafts:</td>
                <td className="border border-gray-600 p-3">{renderInput('shipToBeLighted', 'pblCentreManifoldAftArrival')}</td>
                <td className="border border-gray-600 p-3">{renderInput('receivingShip', 'pblCentreManifoldAftArrival')}</td>
              </tr>

              {/* PBL at completion of transfer on departure drafts */}
              <tr className="hover:bg-gray-700">
                <td className="border border-gray-600 p-3 font-semibold">PBL at completion of transfer on departure drafts:</td>
                <td className="border border-gray-600 p-3">{renderInput('shipToBeLighted', 'pblCompletionDepartureDrafts')}</td>
                <td className="border border-gray-600 p-3">{renderInput('receivingShip', 'pblCompletionDepartureDrafts')}</td>
              </tr>

              {/* Max Freeboard */}
              <tr className="hover:bg-gray-700">
                <td className="border border-gray-600 p-3 font-semibold">Max Freeboard:</td>
                <td className="border border-gray-600 p-3">{renderInput('shipToBeLighted', 'maxFreeboard')}</td>
                <td className="border border-gray-600 p-3">{renderInput('receivingShip', 'maxFreeboard')}</td>
              </tr>

              {/* Min Freeboard */}
              <tr className="hover:bg-gray-700">
                <td className="border border-gray-600 p-3 font-semibold">Min Freeboard:</td>
                <td className="border border-gray-600 p-3">{renderInput('shipToBeLighted', 'minFreeboard')}</td>
                <td className="border border-gray-600 p-3">{renderInput('receivingShip', 'minFreeboard')}</td>
              </tr>

              {/* Dead Slow Ahead Speed */}
              <tr className="hover:bg-gray-700">
                <td className="border border-gray-600 p-3 font-semibold">Dead Slow Ahead Speed:</td>
                <td className="border border-gray-600 p-3">{renderInput('shipToBeLighted', 'deadSlowAheadSpeed')}</td>
                <td className="border border-gray-600 p-3">{renderInput('receivingShip', 'deadSlowAheadSpeed')}</td>
              </tr>

              {/* Distance from Bridge Wing to Centre Manifold */}
              <tr className="hover:bg-gray-700">
                <td className="border border-gray-600 p-3 font-semibold">Distance from Bridge Wing to Centre Manifold:</td>
                <td className="border border-gray-600 p-3">{renderInput('shipToBeLighted', 'bridgeWingToCentreManifoldDistance')}</td>
                <td className="border border-gray-600 p-3">{renderInput('receivingShip', 'bridgeWingToCentreManifoldDistance')}</td>
              </tr>

              {/* Is the crane certified for transfer of personnel? */}
              <tr className="hover:bg-gray-700">
                <td className="border border-gray-600 p-3 font-semibold">Is the crane certified for transfer of personnel?:</td>
                <td className="border border-gray-600 p-3">{renderCheckbox('shipToBeLighted', 'craneCertifiedForPersonnelTransfer')}</td>
                <td className="border border-gray-600 p-3">{renderCheckbox('receivingShip', 'craneCertifiedForPersonnelTransfer')}</td>
              </tr>

              {/* If the crane is not certified is the Master of the Vessel willing to use it for Personnel Transfer? */}
              <tr className="hover:bg-gray-700">
                <td className="border border-gray-600 p-3 font-semibold">If the crane is not certified is the Master of the Vessel willing to use it for Personnel Transfer?:</td>
                <td className="border border-gray-600 p-3">{renderCheckbox('shipToBeLighted', 'masterWillingIfCraneNotCertified')}</td>
                <td className="border border-gray-600 p-3">{renderCheckbox('receivingShip', 'masterWillingIfCraneNotCertified')}</td>
              </tr>

              {/* Maximum Crane reach over the ships side */}
              <tr className="hover:bg-gray-700">
                <td className="border border-gray-600 p-3 font-semibold">Maximum Crane reach over the ships side:</td>
                <td className="border border-gray-600 p-3">{renderInput('shipToBeLighted', 'maxCraneReachOverShipsSide')}</td>
                <td className="border border-gray-600 p-3">{renderInput('receivingShip', 'maxCraneReachOverShipsSide')}</td>
              </tr>

              {/* Is the vessel fitted with Bow Thruster */}
              <tr className="hover:bg-gray-700">
                <td className="border border-gray-600 p-3 font-semibold">Is the vessel fitted with Bow Thruster:</td>
                <td className="border border-gray-600 p-3">{renderCheckbox('shipToBeLighted', 'bowThrusterFitted')}</td>
                <td className="border border-gray-600 p-3">{renderCheckbox('receivingShip', 'bowThrusterFitted')}</td>
              </tr>

              {/* Is the Master of the vessel happy to conduct Nighttime berthing? */}
              <tr className="hover:bg-gray-700">
                <td className="border border-gray-600 p-3 font-semibold">Is the Master of the vessel happy to conduct Nighttime berthing?:</td>
                <td className="border border-gray-600 p-3">{renderCheckbox('shipToBeLighted', 'nightBerthingAccepted')}</td>
                <td className="border border-gray-600 p-3">{renderCheckbox('receivingShip', 'nightBerthingAccepted')}</td>
              </tr>

              {/* Cargo */}
              <tr className="hover:bg-gray-700">
                <td className="border border-gray-600 p-3 font-semibold">Cargo:</td>
                <td className="border border-gray-600 p-3">{renderInput('shipToBeLighted', 'cargo')}</td>
                <td className="border border-gray-600 p-3">{renderInput('receivingShip', 'cargo')}</td>
              </tr>

              {/* Quantity to be transferred */}
              <tr className="hover:bg-gray-700">
                <td className="border border-gray-600 p-3 font-semibold">Quantity to be transferred:</td>
                <td className="border border-gray-600 p-3">{renderInput('shipToBeLighted', 'quantityToTransfer')}</td>
                <td className="border border-gray-600 p-3">{renderInput('receivingShip', 'quantityToTransfer')}</td>
              </tr>

              {/* Fender Size */}
              <tr className="hover:bg-gray-700">
                <td className="border border-gray-600 p-3 font-semibold">Fender Size:</td>
                <td className="border border-gray-600 p-3">{renderEquipmentSet('shipToBeLighted', 'fenderSizes')}</td>
                <td className="border border-gray-600 p-3">{renderEquipmentSet('receivingShip', 'fenderSizes')}</td>
              </tr>

              {/* Fender Serial Number */}
              <tr className="hover:bg-gray-700">
                <td className="border border-gray-600 p-3 font-semibold">Fender Serial Number:</td>
                <td className="border border-gray-600 p-3">{renderEquipmentSet('shipToBeLighted', 'fenderSerialNumbers')}</td>
                <td className="border border-gray-600 p-3">{renderEquipmentSet('receivingShip', 'fenderSerialNumbers')}</td>
              </tr>

              {/* Vapor Hoses */}
              <tr className="hover:bg-gray-700">
                <td className="border border-gray-600 p-3 font-semibold">Vapor Hoses:</td>
                <td className="border border-gray-600 p-3">{renderEquipmentSet('shipToBeLighted', 'vaporHoses')}</td>
                <td className="border border-gray-600 p-3">{renderEquipmentSet('receivingShip', 'vaporHoses')}</td>
              </tr>

              {/* Hose Size */}
              <tr className="hover:bg-gray-700">
                <td className="border border-gray-600 p-3 font-semibold">Hose Size:</td>
                <td className="border border-gray-600 p-3">{renderEquipmentSet('shipToBeLighted', 'hoseSizes')}</td>
                <td className="border border-gray-600 p-3">{renderEquipmentSet('receivingShip', 'hoseSizes')}</td>
              </tr>

              {/* Hose Serial Number */}
              <tr className="hover:bg-gray-700">
                <td className="border border-gray-600 p-3 font-semibold">Hose Serial Number:</td>
                <td className="border border-gray-600 p-3">{renderEquipmentSet('shipToBeLighted', 'hoseSerialNumbers')}</td>
                <td className="border border-gray-600 p-3">{renderEquipmentSet('receivingShip', 'hoseSerialNumbers')}</td>
              </tr>

              {/* Agents */}
              <tr className="hover:bg-gray-700">
                <td className="border border-gray-600 p-3 font-semibold">Agents:</td>
                <td className="border border-gray-600 p-3">{renderInput('shipToBeLighted', 'agents')}</td>
                <td className="border border-gray-600 p-3">{renderInput('receivingShip', 'agents')}</td>
              </tr>

              {/* Other Information */}
              <tr className="hover:bg-gray-700">
                <td className="border border-gray-600 p-3 font-semibold">Other Information:</td>
                <td className="border border-gray-600 p-3">{renderTextarea('shipToBeLighted', 'otherInformation')}</td>
                <td className="border border-gray-600 p-3">{renderTextarea('receivingShip', 'otherInformation')}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {submitError && (
          <div className="mb-4 p-4 bg-red-900/30 border border-red-600 rounded text-red-300 text-sm">{submitError}</div>
        )}
        {/* Submit Button */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit Report'}
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

