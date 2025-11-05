import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-chart-display',
  standalone: true,
  imports: [MarkdownModule],
  templateUrl: './chart-display.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartDisplayComponent {
  chartData = input.required<string | null>();
  illustration = input<string | null>();
  isGeneratingImage = input<boolean>();
}
