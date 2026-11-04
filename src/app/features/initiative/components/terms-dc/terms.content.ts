/** Terms & Conditions text, from Figma (node 1028:132652). */
// TODO: load from the CMS / API if the legal text is managed there

export interface TermsSection {
  title: string;
  clauses: string[];
}

export const TERMS_TITLE = 'Terms and Conditions of the Initiative to Support Employees in Subsidized Establishments';

export const TERMS_SECTIONS: TermsSection[] = [
  {
    title: '1. Introduction',
    clauses: [
      '1.1. The Initiative supports the wages of Saudi employees working in eligible establishments subject to the Social Insurance Law, through the Unemployment Insurance Law (SANED), once the eligibility requirements are met within the period specified for the Initiative.',
      "1.2. By applying through GOSI Business, the establishment acknowledges that it has read, understood and agreed to these Terms and Conditions, which form an integral part of the Terms of Use of GOSI's electronic services.",
    ],
  },
  {
    title: '2. Definitions',
    clauses: [
      '2.1. GOSI: The General Organization for Social Insurance.',
      '2.2. Initiative: The Initiative to Support Employees in Subsidized Establishments.',
      "2.3. Ministerial Committee: The committee formed to set the Initiative's eligibility criteria and controls.",
      '2.4. Establishment: An establishment subject to the Social Insurance Law that the Ministerial Committee has determined as eligible for support.',
      '2.5. Contributor: A Saudi employee registered under the Social Insurance Law at the eligible establishment.',
      '2.6. SANED: The Unemployment Insurance Law.',
    ],
  },
  {
    title: '3. Eligibility of Establishments',
    clauses: [
      '3.1. Eligible establishments are determined by the Ministerial Committee based on the lists submitted by the regulatory sector responsible for them, in accordance with the approved criteria and controls.',
      '3.2. Support stops for any establishment that no longer meets the eligibility criteria.',
    ],
  },
  {
    title: '4. Eligibility of Contributors',
    clauses: [
      '4.1. The contributor must be Saudi, covered by SANED, and actively employed at the eligible establishment.',
      '4.2. The contributor must have a continuous contribution period at the establishment that started before the reference date set for the Initiative.',
      '4.3. Contributors with a suspended contribution period are not eligible for selection, as SANED coverage is not in effect during the suspension period.',
      '4.4. Eligibility is subject to the rules governing the combination of benefits under SANED.',
      '4.5. Meeting the contributor eligibility requirements alone is not sufficient; the establishment must also be eligible for support.',
    ],
  },
  {
    title: '5. Registering Contributors',
    clauses: [
      '5.1. Contributors are registered by the eligible establishment only; employees cannot apply individually.',
      '5.2. The number of contributors the establishment can register is subject to the approved ratio set by the Ministerial Committee.',
      '5.3. The establishment must add a valid IBAN for each registered contributor.',
    ],
  },
  {
    title: '6. Support Amount, Duration and Payment',
    clauses: [
      "6.1. The support amount is calculated according to the compensation calculation mechanism stipulated in the Unemployment Insurance Law (SANED) of 1435 AH, and varies according to each contributor's insurance data.",
      '6.2. The support is paid monthly to the Saudi employees registered by the establishment, according to the disbursement date set by the Ministerial Committee.',
      "6.3. The initial support period does not exceed three months, and may be extended if the establishment's continued impact is confirmed in accordance with the approved controls.",
      '6.4. Contribution and insurance coverage in all branches continue during the support period.',
    ],
  },
  {
    title: '7. Stopping the Support',
    clauses: [
      '7.1. Support stops for a contributor in any of the following cases:',
      '7.1.1. The contributor is excluded from the eligible establishment.',
      '7.1.2. The contributor reaches the statutory retirement age and meets the pension eligibility conditions.',
      '7.1.3. The contributor no longer meets any of the eligibility conditions, or any of the specified cases for stopping the support applies.',
    ],
  },
  {
    title: '8. Establishment Obligations',
    clauses: [
      '8.1. The establishment confirms that all information it submits is accurate and bears full responsibility for it.',
      '8.2. The employer must pay the full wages due to the beneficiary employees after the support period ends.',
      '8.3. The establishment authorizes GOSI to request the Initiative record from licensed entities in accordance with the applicable laws, regulations, decisions and policies.',
    ],
  },
  {
    title: '9. Data Protection and Privacy',
    clauses: [
      '9.1. GOSI protects data in accordance with the Personal Data Protection Law and its implementing regulations, and uses it only for the purposes of the Initiative and as permitted by applicable laws.',
    ],
  },
  {
    title: '10. Electronic Acceptance',
    clauses: [
      '10.1. Approving the declaration electronically through GOSI Business is considered a valid electronic signature in accordance with the Electronic Transactions Law, and is legally binding on the establishment.',
    ],
  },
  {
    title: '11. Amendments',
    clauses: [
      "11.1. GOSI may update these Terms and Conditions in line with the Ministerial Committee's decisions or applicable regulations. Continuing to use the service after the update is published means accepting the updated terms.",
    ],
  },
  {
    title: '12. Governing Law',
    clauses: ['12.1. These Terms and Conditions are governed by the laws and regulations in force in the Kingdom of Saudi Arabia.'],
  },
];
