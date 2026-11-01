import { Component, Input, ViewEncapsulation } from '@angular/core';

/**
 * The design's icons (exported from Figma), in one place.
 * The host is `display: contents`, so the svg lays out as if it were inline in the parent.
 */
@Component({
  selector: 'app-icon-dc',
  templateUrl: './icon-dc.component.html',
  encapsulation: ViewEncapsulation.None,
  host: { style: 'display: contents' },
  standalone: false,
})
export class IconDcComponent {
  @Input() name = '';
}
