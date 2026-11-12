/** Popup legal text per language: the Acknowledgment and Authorization, as supplied by the business (EN and AR). */
// TODO: load from the CMS / API if the legal text is managed there

export interface TermsSection {
  /** Left out for text with no heading */
  title?: string;
  clauses: string[];
}

export interface TermsContent {
  title: string;
  sections: TermsSection[];
}

export const TERMS_EN: TermsContent = {
  title: 'Acknowledgment and Authorization',
  sections: [
    {
      clauses: [
        'I, the employer submitting the registration application for the “Saudi Salaries Support in Eligible Establishments Subject to Social Insurance” initiative, hereby acknowledge and agree to the following:',
        '1. The establishment has suffered damage in accordance with the approved conditions and regulations.',
        '2. I accept full responsibility for determining the list of employees to be registered in the initiative, including any requirements arising from this determination under the terms of the employment relationship. The Institution bears no responsibility toward the employer, employees, or third parties regarding any consequences resulting from actions taken by the employer concerning their employees, including the preparation of such lists. The Institution’s responsibility is limited solely to disbursing compensation to eligible employees listed therein, in accordance with the Royal Order and implementing regulations.',
        '3. All provisions stipulated by the Royal Order apply to this establishment. I commit to complying with the Royal Order and all other relevant regulatory provisions, including continuing to pay salaries to non-compensated employees and resuming salary payments to compensated employees upon the expiration of the compensation period.',
        '4. I authorize the Institution and all relevant government entities to obtain any necessary data, information, and documents from concerned parties for the purpose of reviewing and adjudicating applications related to the initiative.',
        '5. All data, information, and documents submitted regarding the establishment and its employees are accurate and complete. I commit to updating them immediately upon any changes. The Institution and all relevant government entities retain the right to verify any of these data, information, or documents at any time.',
        '6. I consent to receive all notifications from the Institution through electronic means designated by the Institution, including but not limited to: email, phone number, my account on the e-portal, and the Institution’s website. I assume full responsibility for monitoring these channels. Any notification sent through these means shall constitute official notice as of the date of transmission.',
        '7. Submitting the application does not constitute approval thereof. The Institution will review the application and verify compliance with all eligibility conditions according to established procedures and regulations.',
        '8. Violation of any provision of the Royal Order, related systems, or clauses contained in this form shall result in legal accountability and the application of penalties prescribed under prevailing regulations, in addition to the Institution’s right to recover compensation amounts from the establishment.',
      ],
    },
  ],
};

export const TERMS_AR: TermsContent = {
  title: 'إقرار وتفويض',
  sections: [
    {
      clauses: [
        'أقر أنا صاحب العمل المتقدم بطلب التسجيل في مبادرة «دعم أجور السعوديين العاملين بالمنشآت المستحقة الخاضعة لنظام التأمينات الاجتماعية» بما يلي:',
        '1- تضرر المنشأة وفق الشروط والضوابط المعتمدة لذلك.',
        '2- التزامي بكامل المسؤولية حيال تحديد قائمة العاملين المطلوب تسجيلهم في المبادرة وما يقتضيه ذلك من أي متطلبات وفق أحكام العلاقة التعاقدية في هذا الشأن، دون أي مسؤولية على المؤسسة تجاه صاحب العمل والعاملين والغير عن أي آثار ناتجة عن الإجراءات المتخذة من صاحب العمل تجاه العاملين بمنشأته، بما في ذلك تحديد القائمة، وتقتصر مسؤولية المؤسسة على صرف التعويض للمستحقين من العاملين المدرجين في القائمة وفق أحكام الأمر الملكي والقرارات الصادرة تنفيذاً لذلك.',
        '3- أن كافة الأحكام المقررة بموجب الأمر الملكي تنطبق على هذه المنشأة، وأتعهد بالالتزام بأحكام الأمر الملكي وكافة الاحكام النظامية الأخرى ذات العلاقة، بما في ذلك الاستمرار في دفع الأجور لبقية العمال غير المشمولين بالتعويض، كما أتعهد بالالتزام باستئناف دفع الأجور للمشمولين بهذا التعويض بعد انتهاء مدة صرف التعويض.',
        '4- تفويض المؤسسة وكافة الجهات الحكومية ذات العلاقة بالحصول على أي من البيانات والمعلومات والمستندات اللازمة من الجهات المعنية، لغرض دراسة الطلبات المتعلقة بالمبادرة والبت فيها.',
        '5- أن جميع البيانات والمعلومات والمستندات المقدمة عن المنشأة والعاملين صحيحة وكاملة، وأتعهد بتحديثها فور حدوث أي تغيير يطرأ عليها، مع استمرار أحقية المؤسسة وكافة الجهات الحكومية ذات العلاقة بالتحقق من أي من تلك البيانات والمعلومات والمستندات في أي وقت.',
        '6- أوافق على تلقي كافة الإشعارات من المؤسسة من خلال الوسائل الإلكترونية التي تحددها المؤسسة، وعلى سبيل المثال لا الحصر: البريد الإلكتروني، ورقم الهاتف، وحسابي في البوابة الإلكترونية، والموقع الإلكتروني للمؤسسة، وأتحمل المسؤولية الكاملة عن متابعة هذه القنوات، وتعد أي إشعارات ترسل من خلال هذه الوسائل تبليغا نظاميَّا من تاريخ إرسالها.',
        '7- تقديم الطلب لا يعني الموافقة عليه، وأن المؤسسة ستقوم بدراسته والتحقق من مدى توافر كافة الشروط اللازمة للاستحقاق وفقاً للإجراءات والضوابط المعتمدة.',
        '8- أن مخالفة أي حكم من أحكام الأمر الملكي أو الأنظمة ذات العلاقة أو الفقرات الواردة بموجب هذا النموذج، يترتب عليها المساءلة القانونية و تطبيق العقوبات الواردة بموجب الأنظمة المرعية، بالإضافة إلى حق المؤسسة في استرداد مبالغ التعويض من المنشأة.',
      ],
    },
  ],
};

export const TERMS: Record<'en' | 'ar', TermsContent> = {
  en: TERMS_EN,
  ar: TERMS_AR,
};
