export interface Establishment {
  name: string;
  registrationNumber: string;
}

export interface Contributor {
  /** National / Iqama ID */
  nnid: string;
  name: string;
  joiningDate: string;
  wage: number;
  eligible: boolean;
  ineligibilityReason?: string;
  /** Provided by the backend once the contributor is added */
  benefitAmount?: number;
}

export interface Faq {
  question: string;
  answer: string;
}
