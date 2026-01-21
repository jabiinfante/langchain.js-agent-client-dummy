import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { JsonViewModule } from 'nxt-json-view';
@Component({
  selector: 'app-json-viewer',
  standalone: true,
  imports: [JsonViewModule],

  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<nxt-json-view [data]="args()" />`,
  host: {
    class:
      'block bg-neutral-200 dark:bg-neutral-300 p-2 overflow-x-auto w-full',
  },
})
export class JsonViewerComponent {
  args = input.required<unknown>();
}
