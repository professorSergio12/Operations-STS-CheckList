'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { submitChecklistForm } from '@/lib/api';

// CL 4A Generic Checks (1-26)
const CHECKLIST_4A = [
  { clNumber: 1, description: 'Local requirements including permissions are obtained and complied with OCIMF', hasNotApplicable: true },
  { clNumber: 2, description: 'JPO procedures for cargo and ballast operations reviewed and agreed by all parties.', hasNotApplicable: false },
  { clNumber: 3, description: 'Present and forecast weather and sea conditions are within the agreed limits.', hasNotApplicable: false },
  { clNumber: 4, description: 'Cargo specifications, hazardous properties, SDS and any requirements for inerting, heating, reactivity and inhibitors have been exchanged.', hasNotApplicable: true },
  { clNumber: 5, description: 'Tank venting system and closed operation procedures agreed', hasNotApplicable: false },
  { clNumber: 6, description: 'Procedures for vapour control/balancing have been agreed.', hasNotApplicable: true },
  { clNumber: 7, description: 'Procedures for the transfer of personnel have been agreed.', hasNotApplicable: true },
  { clNumber: 8, description: 'All personnel engaged in the cargo operation are provided with PPE including, where necessary, personal gas detectors/monitors in accordance with the ship operator\'s PPE matrix.', hasNotApplicable: false },
  { clNumber: 9, description: 'Cargo transfer and, if applicable, the vapour return equipment is: In good condition Of the appropriate type Properly fitted with gaskets/seals Lined up correctly Properly rigged Secured to the manifolds Sufficiently supported', hasNotApplicable: false },
  { clNumber: 10, description: 'Electrical insulation of the ship/ship interface is effective.', hasNotApplicable: false },
  { clNumber: 11, description: 'Effective STS communications established.', hasNotApplicable: false },
  { clNumber: 12, description: 'Emergency signals and shutdown procedures are agreed.', hasNotApplicable: false },
  { clNumber: 13, description: 'The engine room will be manned and the main engine kept on standby or on short notice of readiness', hasNotApplicable: false },
  { clNumber: 14, description: 'Officers in charge of the cargo transfer on both ships are identified, and details have been exchanged and posted.', hasNotApplicable: false },
  { clNumber: 15, description: 'Procedures for cargo and ballast handling operations and transfer parameters agreed.', hasNotApplicable: false },
  { clNumber: 16, description: 'Simultaneous Operations (SIMOPS) are identified and agreed', hasNotApplicable: false, isSimops: true },
  { clNumber: 17, description: 'Messengers and toggle pins are prepared and positioned ready for unmooring in accordance with the unmooring plan.', hasNotApplicable: false },
  { clNumber: 18, description: 'Means of emergency escape from both ships are established.', hasNotApplicable: false },
  { clNumber: 19, description: 'STS operation supervision and watchkeeping is adequate', hasNotApplicable: false },
  { clNumber: 20, description: 'There are sufficient personnel to deal with an emergency.', hasNotApplicable: false },
  { clNumber: 21, description: 'Naked lights, smoking restrictions and designated smoking areas are established', hasNotApplicable: false },
  { clNumber: 22, description: 'Control of electrical and electronic devices is agreed', hasNotApplicable: false },
  { clNumber: 23, description: 'Routine for regular checks and exchange of information on cargo transferred are agreed.', hasNotApplicable: false },
  { clNumber: 24, description: 'The procedure for stopping transfer are agreed', hasNotApplicable: false },
  { clNumber: 25, description: 'Cargo and vapour balancing hoses are supported and protected from chafing and the hose release area is clear of obstructions.', hasNotApplicable: false },
  { clNumber: 26, description: 'Tools required for rapid disconnection are located at the cargo manifold.', hasNotApplicable: false },
];

// SIMOPS items
const SIMOPS_ITEMS = [
  'Nitrogen purging or inerting',
  'Repairs/maintenance',
  'Tank cleaning',
  'COW',
  'Slops discharge',
  'Waste discharge',
  'Bunkering',
  'Receiving stores',
  'Personnel transfer',
  'Crew change',
  'Planned drills',
];

// CL 4B Vapor Balancing (1-18)
const CHECKLIST_4B = [
  { clNumber: 1, description: 'Confirm ship\'s vapour headers, manifolds and all piping are drained of liquid', hasNotApplicable: false },
  { clNumber: 2, description: 'Confirm all vapour headers are vapour tight before hose connection', hasNotApplicable: false },
  { clNumber: 3, description: 'State pressure in cargo tanks (mm WG or psi)', hasNotApplicable: false },
  { clNumber: 4, description: 'Tank oxygen content is below 8% by volume', hasNotApplicable: false },
  { clNumber: 5, description: 'Tank high-level and overfill alarms have been tested within the last 24 hours', hasNotApplicable: false },
  { clNumber: 6, description: 'Vapour recovery/balancing valves are correctly set', hasNotApplicable: false },
  { clNumber: 7, description: 'Vapour recovery hose is inerted, where needed', hasNotApplicable: false },
  { clNumber: 8, description: 'Vapour hose connection confirmed vapour tight', hasNotApplicable: false },
  { clNumber: 9, description: 'Ship pressure and vacuum relief settings in:', hasNotApplicable: false },
  { clNumber: 10, description: 'Type of vapours from current/previous cargoes', hasNotApplicable: false },
  { clNumber: 11, description: 'Are the vapours being balanced harmful to ship\'s crew? E.g. H2S', hasNotApplicable: false },
  { clNumber: 12, description: 'Maximum pressure differential at maximum transfer rate (mm WG or psi)', hasNotApplicable: false },
  { clNumber: 13, description: 'Cargo tank pressure range to be maintained (mm WG or psi)', hasNotApplicable: false },
  { clNumber: 14, description: 'Cargo tank pressure alarm set points', hasNotApplicable: false },
  { clNumber: 15, description: 'IG main pressure alarm set points:', hasNotApplicable: false },
  { clNumber: 16, description: 'Vapour emission control system pressure alarm set points:', hasNotApplicable: false },
  { clNumber: 17, description: 'Oxygen analyser has been checked and calibrated', hasNotApplicable: false },
  { clNumber: 18, description: 'Agreement on the transfer sequence and procedures:', hasNotApplicable: false },
];

// CL 4C Chemical Tankers
const CHECKLIST_4C = [
  { clNumber: 1, description: 'Inhibition certificate received (if required) from manufacturer', hasNotApplicable: true },
  { clNumber: 2, description: 'Countermeasures against personal contact with cargo are agreed', hasNotApplicable: false },
];

// CL 4D LPG/LNG
const CHECKLIST_4D = [
  { clNumber: 1, description: 'Inhibition certificate received (if required) from manufacturer', hasNotApplicable: true },
  { clNumber: 2, description: 'Maximum working pressures are agreed between ships', hasNotApplicable: false },
  { clNumber: 3, description: 'Cargo handling rate and relationship with valve closure times and automatic shutdown systems is agreed', hasNotApplicable: false },
  { clNumber: 4, description: 'Maximum/minimum temperatures/pressures of the cargo to be transferred are agreed', hasNotApplicable: false },
  { clNumber: 5, description: 'Cargo tank relief valve settings are confirmed', hasNotApplicable: false },
  { clNumber: 6, description: 'Cooldown procedures have been agreed', hasNotApplicable: false },
  { clNumber: 7, description: 'Procedures for increasing/reducing transfer rates have been agreed', hasNotApplicable: false },
  { clNumber: 8, description: 'The potential for cargo roll-over has been considered', hasNotApplicable: false },
  { clNumber: 9, description: 'The deck watch is aware of the location and activation method of ESD systems on deck', hasNotApplicable: false },
];

// CL 4E LNG
const CHECKLIST_4E_ITEMS = [
  { description: 'ESD warm test has been undertaken from both ships.', hasNotApplicable: false },
  { description: 'ERS release mechanism functional test only (with no coupling release) has been tested.', hasNotApplicable: false },
  { clNumber: 2, description: 'Cargo transfer lines have been purged with nitrogen to below 5%O2', hasNotApplicable: false },
  { clNumber: 3, description: 'Cargo transfer line connections are leak tested', hasNotApplicable: false },
  { clNumber: 4, description: 'The nitrogen plant will be operational throughout the transfer', hasNotApplicable: false },
  { clNumber: 5, description: 'The protective water curtain is running', hasNotApplicable: false },
];

export default function STSChecklist4AF() {
  const [formData, setFormData] = useState({
    formNo: 'OPS-OFD-004',
    issueDate: new Date().toISOString().split('T')[0],
    approvedBy: 'JS',
    // Transfer Info
    constantHeadingShip: '',
    manoeuvringShip: '',
    designatedPOACName: '',
    stsSuperintendentName: '',
    transferDate: '',
    transferLocation: '',
    // CL 4A
    checklist4A: {
      checks: CHECKLIST_4A.map(item => ({
        clNumber: item.clNumber,
        description: item.description,
        status: { chs: false, ms: false, notApplicable: false, remarks: '' },
        hasNotApplicable: item.hasNotApplicable,
      })),
      simops: {
        nitrogenPurgingOrInerting: { chs: false, ms: false, notApplicable: false, remarks: '' },
        repairsMaintenance: { chs: false, ms: false, notApplicable: false, remarks: '' },
        tankCleaning: { chs: false, ms: false, notApplicable: false, remarks: '' },
        cow: { chs: false, ms: false, notApplicable: false, remarks: '' },
        slopsDischarge: { chs: false, ms: false, notApplicable: false, remarks: '' },
        wasteDischarge: { chs: false, ms: false, notApplicable: false, remarks: '' },
        bunkering: { chs: false, ms: false, notApplicable: false, remarks: '' },
        receivingStores: { chs: false, ms: false, notApplicable: false, remarks: '' },
        personnelTransfer: { chs: false, ms: false, notApplicable: false, remarks: '' },
        crewChange: { chs: false, ms: false, notApplicable: false, remarks: '' },
        plannedDrills: { chs: false, ms: false, notApplicable: false, remarks: '' },
      },
    },
    // CL 4B
    checklist4B: {
      checks: CHECKLIST_4B.map(item => ({
        clNumber: item.clNumber,
        description: item.description,
        status: { chs: false, ms: false, notApplicable: false, remarks: '' },
        hasNotApplicable: item.hasNotApplicable,
      })),
      pvDevices: {
        liquidPVBreaker: '',
        tankPVValves: '',
        mastHeadPVValves: '',
        otherPVDevices: '',
      },
      pressureSettings: {
        maxPressureDifferential: '',
        cargoTankPressureRange: '',
        cargoTankPressureAlarm: { high: '', low: '' },
        igMainPressureAlarm: { high: '', low: '' },
        vapourEmissionPressureAlarm: { high: '', low: '' },
      },
      oxygenAnalyserChecked: { chs: false, ms: false, notApplicable: false, remarks: '' },
      transferSequenceAgreement: {
        normalStartUp: false,
        normalShutdown: false,
        lowVapourPressureAlarm: false,
        highVapourPressureAlarm: false,
      },
    },
    // CL 4C
    checklist4C: CHECKLIST_4C.map(item => ({
      clNumber: item.clNumber,
      description: item.description,
      status: { chs: false, ms: false, notApplicable: false, remarks: '' },
      hasNotApplicable: item.hasNotApplicable,
    })),
    // CL 4D
    checklist4D: CHECKLIST_4D.map(item => ({
      clNumber: item.clNumber,
      description: item.description,
      status: { chs: false, ms: false, notApplicable: false, remarks: '' },
      hasNotApplicable: item.hasNotApplicable,
    })),
    // CL 4E
    checklist4E: {
      esdErsArrangementsTested: { chs: false, ms: false, notApplicable: false, remarks: '' },
      cargoLinesNitrogenPurged: { chs: false, ms: false, notApplicable: false, remarks: '' },
      connectionsLeakTested: { chs: false, ms: false, notApplicable: false, remarks: '' },
      nitrogenPlantOperational: { chs: false, ms: false, notApplicable: false, remarks: '' },
      waterCurtainRunning: { chs: false, ms: false, notApplicable: false, remarks: '' },
    },
    // CL 4F
    checklist4F: {
      jpo: { latestVersion: '', dateVersion: '' },
      workingLanguage: '',
      agreedSIMOPS: false,
      shipsReadyForManoeuvring: {
        notApplicableForHeadingShips: false,
        noticePeriod: '',
        ship1Minutes: '',
        ship2Minutes: '',
      },
      communicationSystem: { primarySystem: '', backupSystem: '' },
      operationalSupervision: {
        ship1Responsible: '',
        ship2Responsible: '',
        terminalResponsible: '',
      },
      smokingRestrictions: {
        ship1Restrictions: '',
        ship2Restrictions: '',
        terminalRestrictions: '',
      },
      stopCargoTransfer: '',
      environmentalLimits: {
        maxWindSpeed: '',
        current: '',
        swell: '',
        disconnect: '',
        unmooring: '',
      },
      cargoBallastLimits: {
        maxTransferRates: '',
        toppingOffRates: '',
        maxManifoldPressure: '',
        cargoTemperature: '',
        otherLimitations: '',
      },
      pressureSurgeControl: {
        loadingShip: '',
        minCargoTanksOpen: '',
        tankSwitchingProtocols: '',
        fullLoadRate: '',
        toppingOffRate: '',
        closingTimeAutoValves: '',
      },
      cargoTransferManagement: {
        actionNoticePeriods: '',
        transferStopProtocols: '',
      },
      routineChecks: {
        routineQuantityChecks: '',
      },
      emergencySignals: {
        ship1Signal: '',
        ship2Signal: '',
        terminalSignal: '',
      },
      tankSystem: {
        ship1System: '',
        ship2System: '',
      },
      closedOperations: {
        notApplicable: false,
        requirements: '',
      },
      esdOilChemical: {
        notApplicable: false,
        confirmSystem: '',
      },
      esdErsLpgLng: {
        notApplicable: false,
        fibreOpticLink: '',
        closingTimeUnloadingSeconds: '',
        closingTimeLoadingSeconds: '',
        ersAvailable: false,
      },
      vapourBalancingEmergency: {
        notApplicable: false,
        ventVesselIfNeeded: '',
      },
    },
    // Signature
    signature: {
      name: '',
      rank: '',
      signature: '',
      date: '',
    },
  });

  const handleTransferInfoChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleChecklist4AChange = (index, field, value) => {
    const updatedChecks = [...formData.checklist4A.checks];
    if (field === 'chs' || field === 'ms' || field === 'notApplicable') {
      updatedChecks[index].status[field] = value;
    } else if (field === 'remarks') {
      updatedChecks[index].status.remarks = value;
    }
    setFormData({
      ...formData,
      checklist4A: { ...formData.checklist4A, checks: updatedChecks },
    });
  };

  const handleSimopsChange = (simopsKey, field, value) => {
    setFormData({
      ...formData,
      checklist4A: {
        ...formData.checklist4A,
        simops: {
          ...formData.checklist4A.simops,
          [simopsKey]: {
            ...formData.checklist4A.simops[simopsKey],
            [field]: value,
          },
        },
      },
    });
  };

  const handleChecklist4BChange = (index, field, value) => {
    const updatedChecks = [...formData.checklist4B.checks];
    if (field === 'chs' || field === 'ms' || field === 'notApplicable') {
      updatedChecks[index].status[field] = value;
    } else if (field === 'remarks') {
      updatedChecks[index].status.remarks = value;
    }
    setFormData({
      ...formData,
      checklist4B: { ...formData.checklist4B, checks: updatedChecks },
    });
  };

  const handleChecklist4BFieldChange = (section, field, value, subField = null) => {
    if (subField) {
      setFormData({
        ...formData,
        checklist4B: {
          ...formData.checklist4B,
          [section]: {
            ...formData.checklist4B[section],
            [field]: {
              ...formData.checklist4B[section][field],
              [subField]: value,
            },
          },
        },
      });
    } else {
      setFormData({
        ...formData,
        checklist4B: {
          ...formData.checklist4B,
          [section]: {
            ...formData.checklist4B[section],
            [field]: value,
          },
        },
      });
    }
  };

  const handleChecklist4CChange = (index, field, value) => {
    const updatedChecks = [...formData.checklist4C];
    if (field === 'chs' || field === 'ms' || field === 'notApplicable') {
      updatedChecks[index].status[field] = value;
    } else if (field === 'remarks') {
      updatedChecks[index].status.remarks = value;
    }
    setFormData({ ...formData, checklist4C: updatedChecks });
  };

  const handleChecklist4DChange = (index, field, value) => {
    const updatedChecks = [...formData.checklist4D];
    if (field === 'chs' || field === 'ms' || field === 'notApplicable') {
      updatedChecks[index].status[field] = value;
    } else if (field === 'remarks') {
      updatedChecks[index].status.remarks = value;
    }
    setFormData({ ...formData, checklist4D: updatedChecks });
  };

  const handleChecklist4EChange = (field, subField, value) => {
    setFormData({
      ...formData,
      checklist4E: {
        ...formData.checklist4E,
        [field]: {
          ...formData.checklist4E[field],
          [subField]: value,
        },
      },
    });
  };

  const handleChecklist4FChange = (section, field, value, subField = null, subSubField = null) => {
    if (subSubField) {
      setFormData({
        ...formData,
        checklist4F: {
          ...formData.checklist4F,
          [section]: {
            ...formData.checklist4F[section],
            [field]: {
              ...formData.checklist4F[section][field],
              [subField]: {
                ...formData.checklist4F[section][field][subField],
                [subSubField]: value,
              },
            },
          },
        },
      });
    } else if (subField) {
      setFormData({
        ...formData,
        checklist4F: {
          ...formData.checklist4F,
          [section]: {
            ...formData.checklist4F[section],
            [field]: {
              ...formData.checklist4F[section][field],
              [subField]: value,
            },
          },
        },
      });
    } else {
      setFormData({
        ...formData,
        checklist4F: {
          ...formData.checklist4F,
          [section]: {
            ...formData.checklist4F[section],
            [field]: value,
          },
        },
      });
    }
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
        formNo: formData.formNo || 'OPS-OFD-004',
        revisionNo: formData.revisionNo || '',
        revisionDate: formData.issueDate || null,
        approvedBy: formData.approvedBy,
        page: '',
        transferInfo: {
          constantHeadingShip: formData.constantHeadingShip,
          manoeuvringShip: formData.manoeuvringShip,
          designatedPOACName: formData.designatedPOACName,
          stsSuperintendentName: formData.stsSuperintendentName,
          transferDate: formData.transferDate || null,
          transferLocation: formData.transferLocation,
        },
        checklist4A: formData.checklist4A,
        checklist4B: formData.checklist4B,
        checklist4C: formData.checklist4C,
        checklist4D: formData.checklist4D,
        checklist4E: formData.checklist4E,
        checklist4F: formData.checklist4F,
        signature: formData.signature,
        status: 'DRAFT',
      };
      await submitChecklistForm('ops-ofd-004', payload);
      setSubmitSuccess(true);
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit checklist.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderDualStatusChecklist = (checklist, checklistType, onChangeHandler) => {
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-600">
          <thead>
            <tr className="bg-gray-700">
              <th className="border border-gray-600 p-3 text-center w-16">CL</th>
              <th className="border border-gray-600 p-3 text-left">Generic Checks</th>
              <th className="border border-gray-600 p-3 text-center w-24">CHS Status</th>
              <th className="border border-gray-600 p-3 text-center w-24">MS Status</th>
              <th className="border border-gray-600 p-3 text-left">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {checklist.map((item, index) => (
              <tr key={item.clNumber || index} className="hover:bg-gray-700">
                <td className="border border-gray-600 p-3 text-center font-semibold">
                  {item.clNumber || ''}
                </td>
                <td className="border border-gray-600 p-3 text-sm">
                  {item.description}
                </td>
                <td className="border border-gray-600 p-3 text-center">
                  <label className="flex items-center justify-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.status?.chs || false}
                      onChange={(e) => onChangeHandler(index, 'chs', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Yes</span>
                  </label>
                </td>
                <td className="border border-gray-600 p-3 text-center">
                  <label className="flex items-center justify-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.status?.ms || false}
                      onChange={(e) => onChangeHandler(index, 'ms', e.target.checked)}
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
                        checked={item.status?.notApplicable || false}
                        onChange={(e) => onChangeHandler(index, 'notApplicable', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Not applicable</span>
                    </label>
                  ) : (
                    <input
                      type="text"
                      value={item.status?.remarks || ''}
                      onChange={(e) => onChangeHandler(index, 'remarks', e.target.value)}
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
              CHECKLIST 4A-F - PRE TRANSFER CONFERENCE
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
              <label className="block text-sm mb-1">Maneuvering Ship:</label>
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

        {/* CL 4A Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">CL 4A - Generic Checks</h3>
          <p className="text-sm mb-4 italic text-gray-400">For discharging / receiving ship answer as appropriate</p>
          {renderDualStatusChecklist(formData.checklist4A.checks, '4A', handleChecklist4AChange)}
          
          {/* SIMOPS Section */}
          <div className="mt-6">
            <h4 className="font-semibold mb-3">Item 16 - Simultaneous Operations (SIMOPS):</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-600">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="border border-gray-600 p-3 text-left">SIMOPS Item</th>
                    <th className="border border-gray-600 p-3 text-center w-24">CHS Status</th>
                    <th className="border border-gray-600 p-3 text-center w-24">MS Status</th>
                  </tr>
                </thead>
                <tbody>
                  {SIMOPS_ITEMS.map((item, index) => {
                    const simopsKey = item.toLowerCase().replace(/\s+/g, '').replace(/[\/-]/g, '');
                    const camelKey = simopsKey.charAt(0).toLowerCase() + simopsKey.slice(1);
                    const keyMap = {
                      'nitrogenpurgingorinerting': 'nitrogenPurgingOrInerting',
                      'repairsmaintenance': 'repairsMaintenance',
                      'tankcleaning': 'tankCleaning',
                      'cow': 'cow',
                      'slopsdischarge': 'slopsDischarge',
                      'wastedischarge': 'wasteDischarge',
                      'bunkering': 'bunkering',
                      'receivingstores': 'receivingStores',
                      'personneltransfer': 'personnelTransfer',
                      'crewchange': 'crewChange',
                      'planneddrills': 'plannedDrills',
                    };
                    const actualKey = keyMap[camelKey] || camelKey;
                    const simopsData = formData.checklist4A.simops[actualKey];
                    
                    return (
                      <tr key={index} className="hover:bg-gray-700">
                        <td className="border border-gray-600 p-3 text-sm">- {item}</td>
                        <td className="border border-gray-600 p-3 text-center">
                          <label className="flex items-center justify-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={simopsData?.chs || false}
                              onChange={(e) => handleSimopsChange(actualKey, 'chs', e.target.checked)}
                              className="w-4 h-4"
                            />
                            <span className="text-sm">Yes</span>
                          </label>
                        </td>
                        <td className="border border-gray-600 p-3 text-center">
                          <label className="flex items-center justify-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={simopsData?.ms || false}
                              onChange={(e) => handleSimopsChange(actualKey, 'ms', e.target.checked)}
                              className="w-4 h-4"
                            />
                            <span className="text-sm">Yes</span>
                          </label>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* CL 4B Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">CL 4B - Additional for Vapor Balancing</h3>
          {renderDualStatusChecklist(formData.checklist4B.checks, '4B', handleChecklist4BChange)}
          
          {/* P/V Devices */}
          <div className="mt-6 bg-gray-700 p-4 rounded">
            <h4 className="font-semibold mb-3">Item 9 - Ship pressure and vacuum relief settings in:</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Liquid P/V breaker:</label>
                <input
                  type="text"
                  value={formData.checklist4B.pvDevices.liquidPVBreaker}
                  onChange={(e) => handleChecklist4BFieldChange('pvDevices', 'liquidPVBreaker', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Tank P/V valves:</label>
                <input
                  type="text"
                  value={formData.checklist4B.pvDevices.tankPVValves}
                  onChange={(e) => handleChecklist4BFieldChange('pvDevices', 'tankPVValves', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Mast head P/V valve(s):</label>
                <input
                  type="text"
                  value={formData.checklist4B.pvDevices.mastHeadPVValves}
                  onChange={(e) => handleChecklist4BFieldChange('pvDevices', 'mastHeadPVValves', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Other P/V relieving devices:</label>
                <input
                  type="text"
                  value={formData.checklist4B.pvDevices.otherPVDevices}
                  onChange={(e) => handleChecklist4BFieldChange('pvDevices', 'otherPVDevices', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                />
              </div>
            </div>
          </div>

          {/* Pressure Settings */}
          <div className="mt-6 bg-gray-700 p-4 rounded">
            <h4 className="font-semibold mb-3">Pressure Settings:</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Maximum pressure differential at maximum transfer rate (mm WG or psi):</label>
                <input
                  type="text"
                  value={formData.checklist4B.pressureSettings.maxPressureDifferential}
                  onChange={(e) => handleChecklist4BFieldChange('pressureSettings', 'maxPressureDifferential', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Cargo tank pressure range to be maintained (mm WG or psi):</label>
                <input
                  type="text"
                  value={formData.checklist4B.pressureSettings.cargoTankPressureRange}
                  onChange={(e) => handleChecklist4BFieldChange('pressureSettings', 'cargoTankPressureRange', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Cargo tank pressure alarm set points:</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs mb-1">High alarm (mm WG or psi):</label>
                    <input
                      type="text"
                      value={formData.checklist4B.pressureSettings.cargoTankPressureAlarm.high}
                      onChange={(e) => handleChecklist4BFieldChange('pressureSettings', 'cargoTankPressureAlarm', e.target.value, 'high')}
                      className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Low alarm (mm WG or psi):</label>
                    <input
                      type="text"
                      value={formData.checklist4B.pressureSettings.cargoTankPressureAlarm.low}
                      onChange={(e) => handleChecklist4BFieldChange('pressureSettings', 'cargoTankPressureAlarm', e.target.value, 'low')}
                      className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1">IG main pressure alarm set points:</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs mb-1">High alarm (mm WG or psi):</label>
                    <input
                      type="text"
                      value={formData.checklist4B.pressureSettings.igMainPressureAlarm.high}
                      onChange={(e) => handleChecklist4BFieldChange('pressureSettings', 'igMainPressureAlarm', e.target.value, 'high')}
                      className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Low alarm (mm WG or psi):</label>
                    <input
                      type="text"
                      value={formData.checklist4B.pressureSettings.igMainPressureAlarm.low}
                      onChange={(e) => handleChecklist4BFieldChange('pressureSettings', 'igMainPressureAlarm', e.target.value, 'low')}
                      className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1">Vapour emission control system pressure alarm set points:</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs mb-1">High alarm (mm WG or psi):</label>
                    <input
                      type="text"
                      value={formData.checklist4B.pressureSettings.vapourEmissionPressureAlarm.high}
                      onChange={(e) => handleChecklist4BFieldChange('pressureSettings', 'vapourEmissionPressureAlarm', e.target.value, 'high')}
                      className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Low alarm (mm WG or psi):</label>
                    <input
                      type="text"
                      value={formData.checklist4B.pressureSettings.vapourEmissionPressureAlarm.low}
                      onChange={(e) => handleChecklist4BFieldChange('pressureSettings', 'vapourEmissionPressureAlarm', e.target.value, 'low')}
                      className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Oxygen Analyser and Transfer Sequence */}
          <div className="mt-6 bg-gray-700 p-4 rounded">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Item 17 - Oxygen analyser has been checked and calibrated:</h4>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.checklist4B.oxygenAnalyserChecked.chs}
                      onChange={(e) => handleChecklist4BFieldChange('oxygenAnalyserChecked', 'chs', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">CHS: Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.checklist4B.oxygenAnalyserChecked.ms}
                      onChange={(e) => handleChecklist4BFieldChange('oxygenAnalyserChecked', 'ms', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">MS: Yes</span>
                  </label>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Item 18 - Agreement on the transfer sequence and procedures:</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.checklist4B.transferSequenceAgreement.normalStartUp}
                      onChange={(e) => handleChecklist4BFieldChange('transferSequenceAgreement', 'normalStartUp', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Normal start up</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.checklist4B.transferSequenceAgreement.normalShutdown}
                      onChange={(e) => handleChecklist4BFieldChange('transferSequenceAgreement', 'normalShutdown', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Normal shutdown</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.checklist4B.transferSequenceAgreement.lowVapourPressureAlarm}
                      onChange={(e) => handleChecklist4BFieldChange('transferSequenceAgreement', 'lowVapourPressureAlarm', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Low vapour pressure alarm</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.checklist4B.transferSequenceAgreement.highVapourPressureAlarm}
                      onChange={(e) => handleChecklist4BFieldChange('transferSequenceAgreement', 'highVapourPressureAlarm', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">High vapour pressure alarm</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CL 4C Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">CL 4C - Additional for Chemical tankers</h3>
          {renderDualStatusChecklist(formData.checklist4C, '4C', handleChecklist4CChange)}
        </div>

        {/* CL 4D Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">CL 4D - Additional for LPG and LNG transfer</h3>
          {renderDualStatusChecklist(formData.checklist4D, '4D', handleChecklist4DChange)}
        </div>

        {/* CL 4E Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">CL 4E - Additional for LNG transfer</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-600">
              <thead>
                <tr className="bg-gray-700">
                  <th className="border border-gray-600 p-3 text-left">Description</th>
                  <th className="border border-gray-600 p-3 text-center w-24">CHS Status</th>
                  <th className="border border-gray-600 p-3 text-center w-24">MS Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-700">
                  <td className="border border-gray-600 p-3 text-sm">ESD and ERS system arrangements are in place and tested:</td>
                  <td className="border border-gray-600 p-3 text-center">
                    <label className="flex items-center justify-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.checklist4E.esdErsArrangementsTested.chs}
                        onChange={(e) => handleChecklist4EChange('esdErsArrangementsTested', 'chs', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Yes</span>
                    </label>
                  </td>
                  <td className="border border-gray-600 p-3 text-center">
                    <label className="flex items-center justify-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.checklist4E.esdErsArrangementsTested.ms}
                        onChange={(e) => handleChecklist4EChange('esdErsArrangementsTested', 'ms', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Yes</span>
                    </label>
                  </td>
                </tr>
                <tr className="hover:bg-gray-700">
                  <td className="border border-gray-600 p-3 text-sm">ESD warm test has been undertaken from both ships.</td>
                  <td className="border border-gray-600 p-3 text-center">
                    <label className="flex items-center justify-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.checklist4E.esdErsArrangementsTested.chs}
                        onChange={(e) => handleChecklist4EChange('esdErsArrangementsTested', 'chs', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Yes</span>
                    </label>
                  </td>
                  <td className="border border-gray-600 p-3 text-center">
                    <label className="flex items-center justify-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.checklist4E.esdErsArrangementsTested.ms}
                        onChange={(e) => handleChecklist4EChange('esdErsArrangementsTested', 'ms', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Yes</span>
                    </label>
                  </td>
                </tr>
                <tr className="hover:bg-gray-700">
                  <td className="border border-gray-600 p-3 text-sm">ERS release mechanism functional test only (with no coupling release) has been tested.</td>
                  <td className="border border-gray-600 p-3 text-center">
                    <label className="flex items-center justify-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.checklist4E.esdErsArrangementsTested.chs}
                        onChange={(e) => handleChecklist4EChange('esdErsArrangementsTested', 'chs', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Yes</span>
                    </label>
                  </td>
                  <td className="border border-gray-600 p-3 text-center">
                    <label className="flex items-center justify-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.checklist4E.esdErsArrangementsTested.ms}
                        onChange={(e) => handleChecklist4EChange('esdErsArrangementsTested', 'ms', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Yes</span>
                    </label>
                  </td>
                </tr>
                <tr className="hover:bg-gray-700">
                  <td className="border border-gray-600 p-3 text-sm">2. Cargo transfer lines have been purged with nitrogen to below 5%O2</td>
                  <td className="border border-gray-600 p-3 text-center">
                    <label className="flex items-center justify-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.checklist4E.cargoLinesNitrogenPurged.chs}
                        onChange={(e) => handleChecklist4EChange('cargoLinesNitrogenPurged', 'chs', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Yes</span>
                    </label>
                  </td>
                  <td className="border border-gray-600 p-3 text-center">
                    <label className="flex items-center justify-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.checklist4E.cargoLinesNitrogenPurged.ms}
                        onChange={(e) => handleChecklist4EChange('cargoLinesNitrogenPurged', 'ms', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Yes</span>
                    </label>
                  </td>
                </tr>
                <tr className="hover:bg-gray-700">
                  <td className="border border-gray-600 p-3 text-sm">3. Cargo transfer line connections are leak tested</td>
                  <td className="border border-gray-600 p-3 text-center">
                    <label className="flex items-center justify-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.checklist4E.connectionsLeakTested.chs}
                        onChange={(e) => handleChecklist4EChange('connectionsLeakTested', 'chs', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Yes</span>
                    </label>
                  </td>
                  <td className="border border-gray-600 p-3 text-center">
                    <label className="flex items-center justify-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.checklist4E.connectionsLeakTested.ms}
                        onChange={(e) => handleChecklist4EChange('connectionsLeakTested', 'ms', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Yes</span>
                    </label>
                  </td>
                </tr>
                <tr className="hover:bg-gray-700">
                  <td className="border border-gray-600 p-3 text-sm">4. The nitrogen plant will be operational throughout the transfer</td>
                  <td className="border border-gray-600 p-3 text-center">
                    <label className="flex items-center justify-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.checklist4E.nitrogenPlantOperational.chs}
                        onChange={(e) => handleChecklist4EChange('nitrogenPlantOperational', 'chs', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Yes</span>
                    </label>
                  </td>
                  <td className="border border-gray-600 p-3 text-center">
                    <label className="flex items-center justify-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.checklist4E.nitrogenPlantOperational.ms}
                        onChange={(e) => handleChecklist4EChange('nitrogenPlantOperational', 'ms', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Yes</span>
                    </label>
                  </td>
                </tr>
                <tr className="hover:bg-gray-700">
                  <td className="border border-gray-600 p-3 text-sm">5. The protective water curtain is running</td>
                  <td className="border border-gray-600 p-3 text-center">
                    <label className="flex items-center justify-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.checklist4E.waterCurtainRunning.chs}
                        onChange={(e) => handleChecklist4EChange('waterCurtainRunning', 'chs', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Yes</span>
                    </label>
                  </td>
                  <td className="border border-gray-600 p-3 text-center">
                    <label className="flex items-center justify-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.checklist4E.waterCurtainRunning.ms}
                        onChange={(e) => handleChecklist4EChange('waterCurtainRunning', 'ms', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Yes</span>
                    </label>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* CL 4F Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">CL 4F - Pre Transfer Agreements</h3>
          <div className="space-y-6">
            {/* JPO */}
            <div className="bg-gray-700 p-4 rounded">
              <h4 className="font-semibold mb-3">1. Latest version of the JPO:</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Date/version JPO:</label>
                  <input
                    type="text"
                    value={formData.checklist4F.jpo.dateVersion}
                    onChange={(e) => handleChecklist4FChange('jpo', 'dateVersion', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Working Language */}
            <div className="bg-gray-700 p-4 rounded">
              <h4 className="font-semibold mb-3">2. Working language:</h4>
              <input
                type="text"
                value={formData.checklist4F.workingLanguage}
                onChange={(e) => handleChecklist4FChange('workingLanguage', null, e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
              />
            </div>

            {/* Agreed SIMOPS */}
            <div className="bg-gray-700 p-4 rounded">
              <h4 className="font-semibold mb-3">3. Agreed SIMOPS:</h4>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.checklist4F.agreedSIMOPS}
                  onChange={(e) => handleChecklist4FChange('agreedSIMOPS', null, e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">Agreed</span>
              </label>
            </div>

            {/* Ships Ready for Maneuvering */}
            <div className="bg-gray-700 p-4 rounded">
              <h4 className="font-semibold mb-3">4. Ships ready for maneuvering:</h4>
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.checklist4F.shipsReadyForManoeuvring.notApplicableForHeadingShips}
                    onChange={(e) => handleChecklist4FChange('shipsReadyForManoeuvring', 'notApplicableForHeadingShips', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Not applicable for heading ships</span>
                </label>
                <div>
                  <label className="block text-sm mb-1">Notice period (maximum for full readiness to maneuver):</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs mb-1">Ship 1:</label>
                      <input
                        type="text"
                        value={formData.checklist4F.shipsReadyForManoeuvring.ship1Minutes}
                        onChange={(e) => handleChecklist4FChange('shipsReadyForManoeuvring', 'ship1Minutes', e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                        placeholder="____ min."
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">Ship 2:</label>
                      <input
                        type="text"
                        value={formData.checklist4F.shipsReadyForManoeuvring.ship2Minutes}
                        onChange={(e) => handleChecklist4FChange('shipsReadyForManoeuvring', 'ship2Minutes', e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                        placeholder="____ min."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Communication System */}
            <div className="bg-gray-700 p-4 rounded">
              <h4 className="font-semibold mb-3">5. Agreed communication system and backup arrangement:</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm mb-1">Primary system:</label>
                  <input
                    type="text"
                    value={formData.checklist4F.communicationSystem.primarySystem}
                    onChange={(e) => handleChecklist4FChange('communicationSystem', 'primarySystem', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Backup system:</label>
                  <input
                    type="text"
                    value={formData.checklist4F.communicationSystem.backupSystem}
                    onChange={(e) => handleChecklist4FChange('communicationSystem', 'backupSystem', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Operational Supervision */}
            <div className="bg-gray-700 p-4 rounded">
              <h4 className="font-semibold mb-3">6. Operational supervision and watchkeeping:</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm mb-1">Ship 1 responsible persons:</label>
                  <input
                    type="text"
                    value={formData.checklist4F.operationalSupervision.ship1Responsible}
                    onChange={(e) => handleChecklist4FChange('operationalSupervision', 'ship1Responsible', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Ship 2 responsible persons:</label>
                  <input
                    type="text"
                    value={formData.checklist4F.operationalSupervision.ship2Responsible}
                    onChange={(e) => handleChecklist4FChange('operationalSupervision', 'ship2Responsible', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Terminal (if applicable) responsible persons:</label>
                  <input
                    type="text"
                    value={formData.checklist4F.operationalSupervision.terminalResponsible}
                    onChange={(e) => handleChecklist4FChange('operationalSupervision', 'terminalResponsible', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Smoking Restrictions */}
            <div className="bg-gray-700 p-4 rounded">
              <h4 className="font-semibold mb-3">7. Dedicated smoking areas and naked light restrictions:</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm mb-1">Ship 1 restrictions:</label>
                  <input
                    type="text"
                    value={formData.checklist4F.smokingRestrictions.ship1Restrictions}
                    onChange={(e) => handleChecklist4FChange('smokingRestrictions', 'ship1Restrictions', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Ship 2 restrictions:</label>
                  <input
                    type="text"
                    value={formData.checklist4F.smokingRestrictions.ship2Restrictions}
                    onChange={(e) => handleChecklist4FChange('smokingRestrictions', 'ship2Restrictions', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Terminal (if applicable) restrictions:</label>
                  <input
                    type="text"
                    value={formData.checklist4F.smokingRestrictions.terminalRestrictions}
                    onChange={(e) => handleChecklist4FChange('smokingRestrictions', 'terminalRestrictions', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Stop Cargo Transfer */}
            <div className="bg-gray-700 p-4 rounded">
              <h4 className="font-semibold mb-3">8. Stop cargo transfer:</h4>
              <input
                type="text"
                value={formData.checklist4F.stopCargoTransfer}
                onChange={(e) => handleChecklist4FChange('stopCargoTransfer', null, e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
              />
            </div>

            {/* Environmental Limits */}
            <div className="bg-gray-700 p-4 rounded">
              <h4 className="font-semibold mb-3">Maximum wind, current and sea/swell criteria or other limiting environmental factors:</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Maximum wind speed:</label>
                  <input
                    type="text"
                    value={formData.checklist4F.environmentalLimits.maxWindSpeed}
                    onChange={(e) => handleChecklist4FChange('environmentalLimits', 'maxWindSpeed', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Current:</label>
                  <input
                    type="text"
                    value={formData.checklist4F.environmentalLimits.current}
                    onChange={(e) => handleChecklist4FChange('environmentalLimits', 'current', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Swell:</label>
                  <input
                    type="text"
                    value={formData.checklist4F.environmentalLimits.swell}
                    onChange={(e) => handleChecklist4FChange('environmentalLimits', 'swell', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Disconnect:</label>
                  <input
                    type="text"
                    value={formData.checklist4F.environmentalLimits.disconnect}
                    onChange={(e) => handleChecklist4FChange('environmentalLimits', 'disconnect', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Unmooring:</label>
                  <input
                    type="text"
                    value={formData.checklist4F.environmentalLimits.unmooring}
                    onChange={(e) => handleChecklist4FChange('environmentalLimits', 'unmooring', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Cargo and Ballast Limits */}
            <div className="bg-gray-700 p-4 rounded">
              <h4 className="font-semibold mb-3">9. Limits for cargo and ballast handling:</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Maximum transfer rates:</label>
                  <input
                    type="text"
                    value={formData.checklist4F.cargoBallastLimits.maxTransferRates}
                    onChange={(e) => handleChecklist4FChange('cargoBallastLimits', 'maxTransferRates', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Topping-off rates:</label>
                  <input
                    type="text"
                    value={formData.checklist4F.cargoBallastLimits.toppingOffRates}
                    onChange={(e) => handleChecklist4FChange('cargoBallastLimits', 'toppingOffRates', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Maximum manifold pressure:</label>
                  <input
                    type="text"
                    value={formData.checklist4F.cargoBallastLimits.maxManifoldPressure}
                    onChange={(e) => handleChecklist4FChange('cargoBallastLimits', 'maxManifoldPressure', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Cargo temperature:</label>
                  <input
                    type="text"
                    value={formData.checklist4F.cargoBallastLimits.cargoTemperature}
                    onChange={(e) => handleChecklist4FChange('cargoBallastLimits', 'cargoTemperature', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm mb-1">Other limitations:</label>
                  <input
                    type="text"
                    value={formData.checklist4F.cargoBallastLimits.otherLimitations}
                    onChange={(e) => handleChecklist4FChange('cargoBallastLimits', 'otherLimitations', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Pressure Surge Control */}
            <div className="bg-gray-700 p-4 rounded">
              <h4 className="font-semibold mb-3">10. Pressure surge control:</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Loading ship:</label>
                  <input
                    type="text"
                    value={formData.checklist4F.pressureSurgeControl.loadingShip}
                    onChange={(e) => handleChecklist4FChange('pressureSurgeControl', 'loadingShip', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Minimum number of cargo tanks open:</label>
                  <input
                    type="text"
                    value={formData.checklist4F.pressureSurgeControl.minCargoTanksOpen}
                    onChange={(e) => handleChecklist4FChange('pressureSurgeControl', 'minCargoTanksOpen', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Tank switching protocols:</label>
                  <input
                    type="text"
                    value={formData.checklist4F.pressureSurgeControl.tankSwitchingProtocols}
                    onChange={(e) => handleChecklist4FChange('pressureSurgeControl', 'tankSwitchingProtocols', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Full load rate:</label>
                  <input
                    type="text"
                    value={formData.checklist4F.pressureSurgeControl.fullLoadRate}
                    onChange={(e) => handleChecklist4FChange('pressureSurgeControl', 'fullLoadRate', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Topping off-rate:</label>
                  <input
                    type="text"
                    value={formData.checklist4F.pressureSurgeControl.toppingOffRate}
                    onChange={(e) => handleChecklist4FChange('pressureSurgeControl', 'toppingOffRate', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Closing time automatic valves:</label>
                  <input
                    type="text"
                    value={formData.checklist4F.pressureSurgeControl.closingTimeAutoValves}
                    onChange={(e) => handleChecklist4FChange('pressureSurgeControl', 'closingTimeAutoValves', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Cargo Transfer Management */}
            <div className="bg-gray-700 p-4 rounded">
              <h4 className="font-semibold mb-3">11. Cargo transfer management:</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Action notice periods:</label>
                  <input
                    type="text"
                    value={formData.checklist4F.cargoTransferManagement.actionNoticePeriods}
                    onChange={(e) => handleChecklist4FChange('cargoTransferManagement', 'actionNoticePeriods', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Transfer stop protocols:</label>
                  <input
                    type="text"
                    value={formData.checklist4F.cargoTransferManagement.transferStopProtocols}
                    onChange={(e) => handleChecklist4FChange('cargoTransferManagement', 'transferStopProtocols', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Routine Checks */}
            <div className="bg-gray-700 p-4 rounded">
              <h4 className="font-semibold mb-3">12. Routine for regular checks on cargo transferred are agreed:</h4>
              <div>
                <label className="block text-sm mb-1">Routine transferred quantity checks:</label>
                <input
                  type="text"
                  value={formData.checklist4F.routineChecks.routineQuantityChecks}
                  onChange={(e) => handleChecklist4FChange('routineChecks', 'routineQuantityChecks', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                />
              </div>
            </div>

            {/* Emergency Signals */}
            <div className="bg-gray-700 p-4 rounded">
              <h4 className="font-semibold mb-3">13. Emergency signals:</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Ship 1 signal:</label>
                  <input
                    type="text"
                    value={formData.checklist4F.emergencySignals.ship1Signal}
                    onChange={(e) => handleChecklist4FChange('emergencySignals', 'ship1Signal', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Ship 2 signal:</label>
                  <input
                    type="text"
                    value={formData.checklist4F.emergencySignals.ship2Signal}
                    onChange={(e) => handleChecklist4FChange('emergencySignals', 'ship2Signal', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Terminal (if applicable) signal:</label>
                  <input
                    type="text"
                    value={formData.checklist4F.emergencySignals.terminalSignal}
                    onChange={(e) => handleChecklist4FChange('emergencySignals', 'terminalSignal', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Tank System */}
            <div className="bg-gray-700 p-4 rounded">
              <h4 className="font-semibold mb-3">14. Tank system:</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Ship 1 system:</label>
                  <input
                    type="text"
                    value={formData.checklist4F.tankSystem.ship1System}
                    onChange={(e) => handleChecklist4FChange('tankSystem', 'ship1System', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Ship 2 system:</label>
                  <input
                    type="text"
                    value={formData.checklist4F.tankSystem.ship2System}
                    onChange={(e) => handleChecklist4FChange('tankSystem', 'ship2System', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Closed Operations */}
            <div className="bg-gray-700 p-4 rounded">
              <h4 className="font-semibold mb-3">15. Closed operations:</h4>
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.checklist4F.closedOperations.notApplicable}
                    onChange={(e) => handleChecklist4FChange('closedOperations', 'notApplicable', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Not applicable</span>
                </label>
                <div>
                  <label className="block text-sm mb-1">Requirements:</label>
                  <input
                    type="text"
                    value={formData.checklist4F.closedOperations.requirements}
                    onChange={(e) => handleChecklist4FChange('closedOperations', 'requirements', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  />
                </div>
              </div>
            </div>

            {/* ESD Oil Chemical */}
            <div className="bg-gray-700 p-4 rounded">
              <h4 className="font-semibold mb-3">16. ESD (oil and chemical):</h4>
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.checklist4F.esdOilChemical.notApplicable}
                    onChange={(e) => handleChecklist4FChange('esdOilChemical', 'notApplicable', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Not applicable</span>
                </label>
                <div>
                  <label className="block text-sm mb-1">Confirm ESD system:</label>
                  <input
                    type="text"
                    value={formData.checklist4F.esdOilChemical.confirmSystem}
                    onChange={(e) => handleChecklist4FChange('esdOilChemical', 'confirmSystem', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  />
                </div>
              </div>
            </div>

            {/* ESD and ERS LPG/LNG */}
            <div className="bg-gray-700 p-4 rounded">
              <h4 className="font-semibold mb-3">17. ESD and ERS systems (LPG and LNG):</h4>
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.checklist4F.esdErsLpgLng.notApplicable}
                    onChange={(e) => handleChecklist4FChange('esdErsLpgLng', 'notApplicable', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Not applicable</span>
                </label>
                <div>
                  <label className="block text-sm mb-1">Fibre optic/electrical link:</label>
                  <input
                    type="text"
                    value={formData.checklist4F.esdErsLpgLng.fibreOpticLink}
                    onChange={(e) => handleChecklist4FChange('esdErsLpgLng', 'fibreOpticLink', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">Closing time ESD valve unloading ship:</label>
                    <input
                      type="text"
                      value={formData.checklist4F.esdErsLpgLng.closingTimeUnloadingSeconds}
                      onChange={(e) => handleChecklist4FChange('esdErsLpgLng', 'closingTimeUnloadingSeconds', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                      placeholder="seconds"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Closing time ESD valve loading ship:</label>
                    <input
                      type="text"
                      value={formData.checklist4F.esdErsLpgLng.closingTimeLoadingSeconds}
                      onChange={(e) => handleChecklist4FChange('esdErsLpgLng', 'closingTimeLoadingSeconds', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                      placeholder="seconds"
                    />
                  </div>
                </div>
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.checklist4F.esdErsLpgLng.ersAvailable}
                      onChange={(e) => handleChecklist4FChange('esdErsLpgLng', 'ersAvailable', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">ERS</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Vapour Balancing Emergency */}
            <div className="bg-gray-700 p-4 rounded">
              <h4 className="font-semibold mb-3">18. In case of vapour balancing:</h4>
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.checklist4F.vapourBalancingEmergency.notApplicable}
                    onChange={(e) => handleChecklist4FChange('vapourBalancingEmergency', 'notApplicable', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Not applicable</span>
                </label>
                <div>
                  <label className="block text-sm mb-1">Which vessel will vent, if needed?</label>
                  <input
                    type="text"
                    value={formData.checklist4F.vapourBalancingEmergency.ventVesselIfNeeded}
                    onChange={(e) => handleChecklist4FChange('vapourBalancingEmergency', 'ventVesselIfNeeded', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Signature Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Signature</h3>
          <div className="bg-gray-700 p-6 rounded">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm mb-1">Name:</label>
                <input
                  type="text"
                  value={formData.signature.name}
                  onChange={(e) => handleSignatureChange('name', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                />
              </div>
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
              <div>
                <label className="block text-sm mb-1">Date:</label>
                <input
                  type="date"
                  value={formData.signature.date}
                  onChange={(e) => handleSignatureChange('date', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                />
              </div>
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