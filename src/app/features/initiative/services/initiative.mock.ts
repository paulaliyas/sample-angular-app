import { Contributor, Establishment, Faq } from '../initiative.models';

// Sample data from the Figma frames — replace with API responses.

// TODO: real answers aren't in the design yet
export const MOCK_FAQS: Faq[] = [
  'What is the Daam Initiative for the Aviation Sector?',
  "What are the initiative's eligibility conditions?",
  'What percentage is covered by the employer?',
  'What percentage is covered by the contributor?',
  'How is the employer compensated for the initiative amount?',
  'Is there a specific duration for the initiative?',
  'How do I add a contributor to the initiative?',
  'Terms and Conditions',
].map((question) => ({ question, answer: 'Answer content goes here.' }));

export const MOCK_ESTABLISHMENT: Establishment = {
  name: 'شركة عبدالله فهد المطيري للخدمات المسانده',
  registrationNumber: '536562462',
};

const SAMPLE_ROWS: Omit<Contributor, 'nnid'>[] = [
  { name: 'Mohammed Abdullah Al-Khudhair', joiningDate: '2026/10/26', wage: 7500, eligible: true },
  { name: 'Fahad Mohammed Al-Shammari', joiningDate: '2026/10/26', wage: 6200, eligible: false, ineligibilityReason: 'Reason for Ineligibility' },
  { name: 'Abdullah Khalid Al-Harbi', joiningDate: '2026/10/26', wage: 4800, eligible: true },
  { name: 'Nasser Ibrahim Al-Qahtani', joiningDate: '2026/10/26', wage: 9100, eligible: true },
  { name: 'Saud Abdulrahman Al-Zahrani', joiningDate: '2026/10/26', wage: 3500, eligible: true },
  { name: 'Mohammed Yousef Al-Otaibi', joiningDate: '2026/10/26', wage: 8700, eligible: true },
  { name: 'Khalid Abdullah Al-Subaie', joiningDate: '2026/10/26', wage: 1300, eligible: true },
  { name: 'Abdulaziz Sulaiman Al-Dosari', joiningDate: '2026/10/26', wage: 5600, eligible: false, ineligibilityReason: 'Reason for Ineligibility' },
  { name: 'Faisal Abdullah Al-Ghamdi', joiningDate: '2026/10/26', wage: 7200, eligible: true },
  { name: 'Turki Mohammed Al-Harbi', joiningDate: '2026/10/26', wage: 4000, eligible: true },
];

/** The 10 design rows repeated with unique IDs, so search and paging have something to work on. */
export const MOCK_CONTRIBUTORS: Contributor[] = Array.from({ length: 48 }, (_, i) => ({
  ...SAMPLE_ROWS[i % SAMPLE_ROWS.length],
  nnid: String(98765432101 + i),
}));
