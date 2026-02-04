/**
 * API and form configuration for STS Checklist.
 * Use same-origin proxy to avoid CORS; proxy forwards to NEXT_PUBLIC_API_BASE_URL.
 */
export const API_BASE_URL =
  typeof window !== 'undefined'
    ? '/api/sts-proxy'
    : process.env.NEXT_PUBLIC_API_BASE_URL ||
      'http://localhost:3000/api/operations/sts-checklist';

export const FORM_TITLES = {
  'declaration-sts-sea': 'Declaration Of STS At Sea',
  'OPS-OFD-001': 'Before Operation Commence',
  'OPS-OFD-001A': 'Ship Standard Questionnaire',
  'OPS-OFD-002': 'Before Run In & Mooring',
  'OPS-OFD-003': 'Before Cargo Transfer (3A & 3B)',
  'OPS-OFD-004': 'Pre-Transfer Agreements (4A-4F)',
  'OPS-OFD-005': 'During Transfer (5A-5C)',
  'OPS-OFD-005B': 'Before Disconnection & Unmooring',
  'OPS-OFD-005C': 'Terminal Transfer Checklist',
  'OPS-OFD-008': 'Master Declaration',
  'OPS-OFD-009': "Mooring Master's Job Report",
  'OPS-OFD-011': 'STS Standing Order',
  'OPS-OFD-014': 'Equipment Checklist',
  'OPS-OFD-015': 'Hourly Quantity Log',
  'OPS-OFD-018': 'STS Timesheet',
  'OPS-OFD-029': 'Mooring Master Expense Sheet',
};

export const FORMS = [
  { path: 'declaration-sts-sea', formNo: 'Declaration Of STS At Sea' },
  { path: 'OPS-OFD-001', formNo: 'OPS-OFD-001' },
  { path: 'OPS-OFD-001A', formNo: 'OPS-OFD-001A' },
  { path: 'OPS-OFD-002', formNo: 'OPS-OFD-002' },
  { path: 'OPS-OFD-003', formNo: 'OPS-OFD-003' },
  { path: 'OPS-OFD-004', formNo: 'OPS-OFD-004' },
  { path: 'OPS-OFD-005', formNo: 'OPS-OFD-005' },
  { path: 'OPS-OFD-005B', formNo: 'OPS-OFD-005B' },
  { path: 'OPS-OFD-005C', formNo: 'OPS-OFD-005C' },
  { path: 'OPS-OFD-008', formNo: 'OPS-OFD-008' },
  { path: 'OPS-OFD-009', formNo: 'OPS-OFD-009' },
  { path: 'OPS-OFD-011', formNo: 'OPS-OFD-011' },
  { path: 'OPS-OFD-014', formNo: 'OPS-OFD-014' },
  { path: 'OPS-OFD-015', formNo: 'OPS-OFD-015' },
  { path: 'OPS-OFD-018', formNo: 'OPS-OFD-018' },
  { path: 'OPS-OFD-029', formNo: 'OPS-OFD-029' },
];
