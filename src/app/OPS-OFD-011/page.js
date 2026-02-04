'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function STSStandingOrder() {
    const [formData, setFormData] = useState({
        // Document Info
        documentInfo: {
            formNo: 'OPS-OFD-011',
            issueDate: new Date().toISOString().split('T')[0],
            approvedBy: 'JS',
        },
        // Editable Content
        superintendentSpecificInstructions: '',
        // Signature Block
        signatureBlock: {
            masterName: '',
            vesselName: '',
            signedDate: new Date().toISOString().split('T')[0],
            signedTime: '',
            shipStampImage: '',
        },
    });

    // Handler for editable content
    const handleInstructionsChange = (value) => {
        setFormData({
            ...formData,
            superintendentSpecificInstructions: value,
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

    const handleStampUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                handleSignatureChange('shipStampImage', base64String);
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
                            STS Superintendent Standing Order
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

                {/* Introductory Text */}
                <div className="mb-8 space-y-4 text-sm leading-relaxed">
                    <p>
                        The STS transfer operation is conducted under the advisory control of the STS Superintendent. Throughout the operation each Master always remains responsible for the safety of his own ship, its crew, cargo, and equipment. He should not permit safety to be prejudiced by the actions of others.
                    </p>
                    <p>
                        The following outlines the requirements of the STS Superintendent and indicates the circumstances under which he should be informed.
                    </p>
                </div>

                {/* Environment Section */}
                <div className="mb-6">
                    <h2 className="text-lg font-bold mb-3">Environment</h2>
                    <p className="text-sm font-semibold mb-2">Inform Superintendent if:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                        <li>Weather forecast indicates adverse conditions.</li>
                        <li>Wind speed is increasing unexpectedly or is consistently gusting above 20kts or as directed by the STS Superintendent.</li>
                        <li>Local weather forecasts indicate an approaching deep low-pressure system or gusting winds.</li>
                        <li>There are electrical storms in the vicinity.</li>
                        <li>Call STS Superintendent if the vessel does not appear to be holding position.</li>
                    </ul>
                </div>

                {/* Communications Section */}
                <div className="mb-6">
                    <h2 className="text-lg font-bold mb-3">Communications</h2>
                    <div className="space-y-2 text-sm">
                        <p>
                            During cargo operations, essential personnel on both ships should have a reliable and common means of communication.
                        </p>
                        <p>
                            During cargo operations, in the event of breakdown of communications on either ship the emergency signal should be sounded and all operations in progress should be suspended immediately- Operation should not be resumed until satisfactory communications have been re-established.
                        </p>
                    </div>
                </div>

                {/* Emergency Situations Section */}
                <div className="mb-6">
                    <h2 className="text-lg font-bold mb-3">Emergency Situations</h2>
                    <div className="space-y-2 text-sm mb-3">
                        <p>
                            The agreed Emergency signal to be used by either ship in the event of an emergency should be clearly understood by personnel on both ships. In the event of an emergency condition arising, both vessels should immediately implement the appropriate contingency plan.
                        </p>
                        <p className="font-semibold">Examples of emergency situations which require suspension of cargo operations, and the calling of the STS Superintendent are:</p>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                        <li>Accidental cargo release</li>
                        <li>Gas accumulation on deck</li>
                        <li>Any leakages at the manifold</li>
                        <li>Onset of adverse weather conditions</li>
                        <li>Electrical storms</li>
                        <li>Ships emergency</li>
                        <li>Safety infringements</li>
                    </ul>
                </div>

                {/* State of readiness for an emergency Section */}
                <div className="mb-6">
                    <h2 className="text-lg font-bold mb-3">State of readiness for an emergency</h2>
                    <p className="text-sm mb-2">The following arrangements should be made on both ships:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                        <li>Main engines steering gear ready for immediate use.</li>
                        <li>Crew available and systems prepared to drain and disconnect hoses at short notice.</li>
                        <li>Oil spill containment equipment prepared and ready for use.</li>
                        <li>Mooring equipment ready for immediate use and extra mooring lines ready at mooring stations as replacements in case of breakage.</li>
                        <li>Firefighting equipment ready for immediate use.</li>
                    </ul>
                </div>

                {/* Hoses Section */}
                <div className="mb-6">
                    <h2 className="text-lg font-bold mb-3">Hoses</h2>
                    <p className="text-sm font-semibold mb-2">Hoses and their securing arrangement should be inspected during cargo operations. Inform STS Superintendent if:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                        <li>Hoses connections are leaking.</li>
                        <li>There is excessive movement of the hoses or hose kinking.</li>
                        <li>If there is any doubt about the positioning of the hoses.</li>
                    </ul>
                </div>

                {/* Moorings Section */}
                <div className="mb-6">
                    <h2 className="text-lg font-bold mb-3">Moorings</h2>
                    <p className="text-sm mb-2">Moorings should be inspected frequently and adjusted accordingly. Call STS Superintendent if:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                        <li>Any moorings fail.</li>
                        <li>the other vessel does not appear to be tending its mooring.</li>
                        <li>Vessels are experiencing increased movement.</li>
                        <li>If there is any doubt about the condition of the moorings.</li>
                    </ul>
                </div>

                {/* Fenders Section */}
                <div className="mb-6">
                    <h2 className="text-lg font-bold mb-3">Fenders</h2>
                    <p className="text-sm mb-2">Fenders must be inspected regularly during the cargo transfer operation. The fender moorings should be tended as required. Inform STS Superintendent if the following is observed:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                        <li>Damage to fenders, fender moorings or associated equipment.</li>
                        <li>There is excessive movement of fenders.</li>
                        <li>If there is any doubt about the condition or position of the fenders.</li>
                    </ul>
                </div>

                {/* Cargo Operations Section */}
                <div className="mb-6">
                    <h2 className="text-lg font-bold mb-3">Cargo Operations</h2>
                    <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                        <li>Maintain hourly exchange of cargo rate and quantity transferred with another vessel. Inform the STS Superintendent if there is a significant difference in figures.</li>
                        <li>Ensure a crew member is always at the manifold.</li>
                        <li>Call STS Superintendent if there are any changes to or deviations from the cargo transfer plan.</li>
                    </ul>
                </div>

                {/* STS Superintendent Specific Instructions Section */}
                <div className="mb-8">
                    <h2 className="text-lg font-bold mb-3">STS Superintendent Specific Instructions</h2>
                    <textarea
                        value={formData.superintendentSpecificInstructions}
                        onChange={(e) => handleInstructionsChange(e.target.value)}
                        rows={6}
                        className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                        placeholder="Enter specific instructions from STS Superintendent..."
                    />
                </div>

                {/* Signature Section */}
                <div className="mb-8 border-t border-gray-700 pt-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="master-name" className="block text-sm mb-1 font-semibold">Master's Name:</label>
                            <input
                                id="master-name"
                                type="text"
                                value={formData.signatureBlock.masterName}
                                onChange={(e) => handleSignatureChange('masterName', e.target.value)}
                                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                            />
                        </div>
                        <div>
                            <label htmlFor="vessel-name" className="block text-sm mb-1 font-semibold">SS/MV:</label>
                            <input
                                id="vessel-name"
                                type="text"
                                value={formData.signatureBlock.vesselName}
                                onChange={(e) => handleSignatureChange('vesselName', e.target.value)}
                                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                            />
                        </div>
                        <div>
                            <label htmlFor="signed-date" className="block text-sm mb-1 font-semibold">Date (dd/mmm/yyyy):</label>
                            <input
                                id="signed-date"
                                type="date"
                                value={formData.signatureBlock.signedDate}
                                onChange={(e) => handleSignatureChange('signedDate', e.target.value)}
                                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                            />
                        </div>
                        <div>
                            <label htmlFor="signed-time" className="block text-sm mb-1 font-semibold">Time (HH:MM):</label>
                            <input
                                id="signed-time"
                                type="time"
                                value={formData.signatureBlock.signedTime}
                                onChange={(e) => handleSignatureChange('signedTime', e.target.value)}
                                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                            />
                        </div>
                        <div className="col-span-2">
                            <label htmlFor="ship-stamp" className="block text-sm mb-1 font-semibold">Ship's stamp:</label>
                            <input
                                id="ship-stamp"
                                type="file"
                                accept="image/*"
                                onChange={handleStampUpload}
                                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                            />
                            {formData.signatureBlock.shipStampImage && (
                                <div className="mt-2">
                                    <img
                                        src={formData.signatureBlock.shipStampImage}
                                        alt="Ship stamp preview"
                                        className="max-w-full h-32 border border-gray-600 rounded bg-white p-2"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleSignatureChange('shipStampImage', '')}
                                        className="mt-2 text-sm text-red-400 hover:text-red-300"
                                    >
                                        Remove Stamp
                                    </button>
                                </div>
                            )}
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
                        Submit Order
                    </button>
                </div>
            </div>
        </div>
    );
}

