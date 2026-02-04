// API Configuration
// Update this to match your backend server URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/operations/sts-checklist';

// Form titles mapping
export const FORM_TITLES = {
  'ops-ofd-001': 'OPS-OFD-001 - Before Operation Commence',
  'ops-ofd-001a': 'OPS-OFD-001A - Ship Standard Questionnaire',
  'ops-ofd-002': 'OPS-OFD-002 - Before Run In & Mooring',
  'ops-ofd-003': 'OPS-OFD-003 - Before Cargo Transfer (3A & 3B)',
  'ops-ofd-004': 'OPS-OFD-004 - Pre-Transfer Agreements (4A-4F)',
  'ops-ofd-005': 'OPS-OFD-005 - During Transfer (5A-5C)',
  'ops-ofd-005b': 'OPS-OFD-005B - Before Disconnection & Unmooring',
  'ops-ofd-005c': 'OPS-OFD-005C - Terminal Transfer Checklist',
  'ops-ofd-008': 'OPS-OFD-008 - Master Declaration',
  'ops-ofd-009': 'OPS-OFD-009 - Mooring Master\'s Job Report',
  'ops-ofd-011': 'OPS-OFD-011 - STS Standing Order',
  'ops-ofd-014': 'OPS-OFD-014 - Equipment Checklist',
  'ops-ofd-015': 'OPS-OFD-015 - Hourly Quantity Log',
  'ops-ofd-018': 'OPS-OFD-018 - STS Timesheet',
  'ops-ofd-029': 'OPS-OFD-029 - Mooring Master Expense Sheet',
};

// Form list for dashboard
export const FORMS = [
  { formNo: 'OPS-OFD-001', title: 'Before Operation Commence', apiPath: 'ops-ofd-001' },
  { formNo: 'OPS-OFD-001A', title: 'Ship Standard Questionnaire', apiPath: 'ops-ofd-001a' },
  { formNo: 'OPS-OFD-002', title: 'Before Run In & Mooring', apiPath: 'ops-ofd-002' },
  { formNo: 'OPS-OFD-003', title: 'Before Cargo Transfer (3A & 3B)', apiPath: 'ops-ofd-003' },
  { formNo: 'OPS-OFD-004', title: 'Pre-Transfer Agreements (4A-4F)', apiPath: 'ops-ofd-004' },
  { formNo: 'OPS-OFD-005', title: 'During Transfer (5A-5C)', apiPath: 'ops-ofd-005' },
  { formNo: 'OPS-OFD-005B', title: 'Before Disconnection & Unmooring', apiPath: 'ops-ofd-005b' },
  { formNo: 'OPS-OFD-005C', title: 'Terminal Transfer Checklist', apiPath: 'ops-ofd-005c' },
  { formNo: 'OPS-OFD-008', title: 'Master Declaration', apiPath: 'ops-ofd-008' },
  { formNo: 'OPS-OFD-009', title: 'Mooring Master\'s Job Report', apiPath: 'ops-ofd-009' },
  { formNo: 'OPS-OFD-011', title: 'STS Standing Order', apiPath: 'ops-ofd-011' },
  { formNo: 'OPS-OFD-014', title: 'Equipment Checklist', apiPath: 'ops-ofd-014' },
  { formNo: 'OPS-OFD-015', title: 'Hourly Quantity Log', apiPath: 'ops-ofd-015' },
  { formNo: 'OPS-OFD-018', title: 'STS Timesheet', apiPath: 'ops-ofd-018' },
  { formNo: 'OPS-OFD-029', title: 'Mooring Master Expense Sheet', apiPath: 'ops-ofd-029' },
];
