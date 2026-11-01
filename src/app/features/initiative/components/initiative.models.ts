export interface Establishment {
  name: string;
  registrationNumber: string;
}

/** The first call: decides whether the user sees the enrolment path or the dashboard. */
export interface Eligibility {
  establishment: Establishment;
  /** Most contributors the establishment can have in the initiative */
  maxContributors: number;
  /** Has already enrolled contributors — show the dashboard instead of the enrolment path */
  enrolled: boolean;
}

export interface Contributor {
  /** National / Iqama ID */
  nnid: string;
  name: string;
  joiningDate: string;
  wage: number;
  /** Estimated monthly benefit — provided by the backend */
  benefitAmount: number;
  /** Saudi IBAN without spaces (SA + 22 digits); missing when the contributor has none */
  iban?: string;
  /** The IBAN as lists show it, e.g. SA0380*********7519 */
  maskedIban?: string;
  bankName?: string;
}

/** How the contributor list is prepared on the Choose Contributors step. */
export type SelectionStrategy = 'highest' | 'lowest' | 'joining' | 'custom';

export interface StrategyOption {
  value: SelectionStrategy;
  title: string;
  tag: string;
  description: string;
  icon: string;
}

export const STRATEGY_OPTIONS: StrategyOption[] = [
  { value: 'highest', title: 'Highest Wage', tag: 'Max financial support', icon: 'money', description: 'Contributors with the highest benefit are selected first.' },
  { value: 'lowest', title: 'Lowest Wage', tag: 'Prioritize Low Wages', icon: 'wage-low', description: 'Contributors with the lowest wages are selected first.' },
  { value: 'joining', title: 'Joining Date', tag: 'Longest service', icon: 'service', description: 'Contributors with the earliest joining date are selected first.' },
  { value: 'custom', title: 'Customize Selection', tag: 'Build your Own', icon: 'custom', description: 'Start with an empty list and choose contributors yourself.' },
];

export interface ContributorSelection {
  strategy: SelectionStrategy;
  contributors: Contributor[];
}

/** A contributor who is part of the initiative. */
export interface InitiativeMember extends Contributor {
  requestId: string;
  benefitStart: string;
  benefitEnd: string;
}

export type RequestStatus = 'under-review' | 'approved' | 'rejected';

export interface RequestLine {
  contributor: Contributor;
  action: 'added' | 'removed';
  benefitStart: string;
  benefitEnd: string;
}

export interface InitiativeRequest {
  transactionId: string;
  date: string;
  status: RequestStatus;
  lines: RequestLine[];
}

/** An IBAN that was added or changed and is waiting to be validated. */
export interface IbanUpdate {
  contributor: Contributor;
  requestId: string;
}

export interface Faq {
  question: string;
  answer: string;
}
