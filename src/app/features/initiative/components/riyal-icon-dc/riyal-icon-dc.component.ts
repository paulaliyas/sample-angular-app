import { Component } from '@angular/core';

/** Stand-in for the GOSI3.0/Riyal symbol — swap for the Figma export. */
@Component({
  selector: 'app-riyal-icon-dc',
  template: `
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" role="img" aria-label="SAR">
      <path
        d="M6.2 1.5v11.2M9.8 2.3v12.2M2.3 6.4l11.4-2.4M2.3 9.6l11.4-2.4M9.4 14.2l4.3-.9M2.3 12.4l3.9-.8"
        stroke="currentColor" stroke-width="1.4" stroke-linecap="round"
      />
    </svg>
  `,
  styles: `:host { display: inline-flex; }`,
  standalone: false,
})
export class RiyalIconDcComponent {}
