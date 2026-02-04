'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { submitChecklistForm } from '@/lib/api';

export default function STSChecklist8() {
  const [formData, setFormData] = useState({
    // Document Info
    documentInfo: {
      formNo: 'OPS-OFD-008',
      revisionNo: '1.2',
      revisionDate: new Date().toISOString().split('T')[0],
      approvedBy: 'JS',
    },
    // Form Data
    jobReference: '',
    masterName: '',
    vesselName: '',
    signedDate: new Date().toISOString().split('T')[0],
    signedTime: '',
    timeZoneLabel: 'LT',
    // Signature Block
    signatureBlock: {
      signatureImage: '',
      stampImage: '',
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

  // Form Data handlers
  const handleFormDataChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  // Signature handlers
  const handleSignatureChange = (field, value) => {
    setFormData({
      ...formData,
      signatureBlock: {
        ...formData.signatureBlock,
        [field]: value,
      },
    });
  };

  const handleSignatureUpload = (event, field) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        handleSignatureChange(field, base64String);
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
        documentInfo: formData.documentInfo,
        jobReference: formData.jobReference,
        masterName: formData.masterName,
        vesselName: formData.vesselName,
        signedDate: formData.signedDate,
        signedTime: formData.signedTime,
        timeZoneLabel: formData.timeZoneLabel,
        signatureBlock: formData.signatureBlock,
        status: 'DRAFT',
      };
      await submitChecklistForm('ops-ofd-008', payload);
      setSubmitSuccess(true);
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit declaration.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-5xl mx-auto bg-gray-800 rounded-lg shadow-2xl p-8">
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
              Indemnity Terms & Condition
            </h1>
          </div>
          <div className="bg-gray-700 p-4 rounded min-w-[200px]">
            <div className="text-sm space-y-1">
              <div><strong>Form No:</strong> {formData.documentInfo.formNo}</div>
              <div><strong>Rev Date:</strong> {formData.documentInfo.revisionDate}</div>
              <div><strong>Approved by:</strong> {formData.documentInfo.approvedBy}</div>
            </div>
          </div>
        </div>

        {/* Job Reference */}
        <div className="mb-6">
          <label htmlFor="job-reference" className="block text-sm mb-1 font-semibold">Job Ref:</label>
          <input
            id="job-reference"
            type="text"
            value={formData.jobReference}
            onChange={(e) => handleFormDataChange('jobReference', e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
          />
        </div>

        {/* Standard Indemnity Terms and Conditions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 underline text-center">STANDARD INDEMNITY TERMS AND CONDITIONS</h2>

          <div className="space-y-4 text-sm leading-relaxed">
            <p>
              All the applicable but not limited to standard indemnity terms and conditions with which OCEANE FENDERS DMCC (“OFD”) provides STS Transfer Services to any vessel, are prescribed hereunder and master of each vessel by signing a letter for himself and on behalf of Owners, Operators, Ship Managers and Demise Charterers (if any) of the vessel, agree to these T&C for the intended STS Transfer.
            </p>
            <p>
              If for operational reasons the standard indemnity terms and conditions is not, or cannot be signed by the Master, then the Master by accepting the STS Transfer Services, nonetheless agrees by conduct to the terms and conditions on behalf of those persons stated in paragraph 1 as fully as if the terms and conditions had been signed.
            </p>

            <div className="space-y-3">
              <p>
                <span className="font-semibold">1.</span> The Master signs for himself and for and on behalf of the Owners, Operators, Ship Managers, and Demise Charterers (if any) of the said vessel, who are all bound by these terms and conditions. OFD is or shall be deemed to be acting on behalf of and for the benefit of all.
              </p>

              <p>
                <span className="font-semibold">2.</span> The Mooring Master will be acting only in an advisory role and therefore does not supersede the Master in the command of the vessel but acts as his adviser so that the management and/or command and/or navigation of the vessel will always remain with the Master and/or crew of the vessel. The Mooring Master will be deemed to be an employee and a servant of those persons stated in paragraph 1. who shall always be liable for the Mooring master’s acts, neglect or default in the course of his employment. In all circumstances Master of the concerned vessel shall remain solely responsible on behalf of persons as stated in Para 1.
              </p>

              <p>
                <span className="font-semibold">3.</span> The presence of POAC shall not relieve the master of his responsibility as stated in Para 2 above. Neither OFD nor the POAC or any other person employed or engaged by OFD in connection with the performance of STS Transfer service shall be liable for any loss, detention, delay, mis-delivery, damage, personal injury or death, howsoever, whatsoever, and where so ever caused and of what kind whether or not such loss, detention, delay, mis-delivery, damage, death or personal injury is the result of any act, neglect or default of OFD or its servants or of others for whom it may be responsible.
              </p>

              <p>
                <span className="font-semibold">4.</span> If OFD and/or the Mooring Master should be held liable by a third party for any loss or damage of whatsoever nature or for any loss of life or personal injury to, and or illness of any person, or for any pollution of whatsoever nature, howsoever caused, the Owners, Operators, Ship Managers, and Demise Charterers (if any) shall jointly and severally fully indemnify OFD, POAC and/or the Mooring Master against all costs, charges, claims, expenses, fines and penalties; which OFD, POAC and/or Mooring Master may be liable to pay pursuant to aforesaid third party claims.
              </p>

              <p>
                <span className="font-semibold">5.</span> No liability shall be attached to OFD, POAC or the Mooring Master, if once on-board, the Mooring Master is unable for any reason whatsoever to perform the duties of a Mooring Master.
              </p>

              <p>
                <span className="font-semibold">6.</span> These conditions shall be construed according to English law and any disputes arising with respect to or in connection with this agreement shall be finally decided in London by one arbitrator in accordance with the Rules of Arbitration of the International Chamber of Commerce. The decision of the arbitrator shall be final and without appeal to the courts, and may be entered and enforced in any court of competent jurisdiction.
              </p>
            </div>
          </div>
        </div>

        {/* Acknowledgement Statement */}
        <div className="mb-8 bg-gray-700 p-4 rounded">
          <p className="text-sm font-semibold text-center">
            I HEREBY REQUEST THE SERVICES OF OCEANE FENDERS DMCC AND I HEREBY ACKNOWLEDGE RECEIPT OF A COPY OF THE CONDITIONS OF USE OF A MOORING MASTER SUPPLIED BY OCEANE FENDERS DMCC.
          </p>
        </div>

        {/* Signature Section */}
        <div className="mb-8">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="master-name" className="block text-sm mb-1 font-semibold">MASTER:</label>
              <input
                id="master-name"
                type="text"
                value={formData.masterName}
                onChange={(e) => handleFormDataChange('masterName', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                placeholder="Master Name"
              />
            </div>
            <div>
              <label htmlFor="vessel-name" className="block text-sm mb-1 font-semibold">SS/MV:</label>
              <input
                id="vessel-name"
                type="text"
                value={formData.vesselName}
                onChange={(e) => handleFormDataChange('vesselName', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                placeholder="Vessel Name"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <label htmlFor="signed-date" className="block text-sm mb-1 font-semibold">DATE:</label>
              <input
                id="signed-date"
                type="date"
                value={formData.signedDate}
                onChange={(e) => handleFormDataChange('signedDate', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label htmlFor="signed-time" className="block text-sm mb-1 font-semibold">Time (HH:MM):</label>
              <input
                id="signed-time"
                type="time"
                value={formData.signedTime}
                onChange={(e) => handleFormDataChange('signedTime', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label htmlFor="time-zone" className="block text-sm mb-1 font-semibold">Time Zone:</label>
              <input
                id="time-zone"
                type="text"
                value={formData.timeZoneLabel}
                onChange={(e) => handleFormDataChange('timeZoneLabel', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                placeholder="LT"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label htmlFor="signature-upload" className="block text-sm mb-1 font-semibold">Signature:</label>
              <input
                id="signature-upload"
                type="file"
                accept="image/*"
                onChange={(e) => handleSignatureUpload(e, 'signatureImage')}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
              />
              {formData.signatureBlock.signatureImage && (
                <div className="mt-2">
                  <img
                    src={formData.signatureBlock.signatureImage}
                    alt="Signature preview"
                    className="max-w-full h-32 border border-gray-600 rounded bg-white p-2"
                  />
                  <button
                    type="button"
                    onClick={() => handleSignatureChange('signatureImage', '')}
                    className="mt-2 text-sm text-red-400 hover:text-red-300"
                  >
                    Remove Signature
                  </button>
                </div>
              )}
            </div>
            <div>
              <label htmlFor="stamp-upload" className="block text-sm mb-1 font-semibold">STAMP:</label>
              <input
                id="stamp-upload"
                type="file"
                accept="image/*"
                onChange={(e) => handleSignatureUpload(e, 'stampImage')}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
              />
              {formData.signatureBlock.stampImage && (
                <div className="mt-2">
                  <img
                    src={formData.signatureBlock.stampImage}
                    alt="Stamp preview"
                    className="max-w-full h-32 border border-gray-600 rounded bg-white p-2"
                  />
                  <button
                    type="button"
                    onClick={() => handleSignatureChange('stampImage', '')}
                    className="mt-2 text-sm text-red-400 hover:text-red-300"
                  >
                    Remove Stamp
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {submitError && (
          <div className="mb-4 p-4 bg-red-900/30 border border-red-600 rounded text-red-300 text-sm">{submitError}</div>
        )}
        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit Form'}
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

