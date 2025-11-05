import { ChangeDetectionStrategy, Component, signal, WritableSignal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NatalFormComponent, NatalFormData } from './components/natal-form/natal-form.component';
import { ChartDisplayComponent } from './components/chart-display/chart-display.component';
import { GeminiService } from './services/gemini.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [CommonModule, NatalFormComponent, ChartDisplayComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  isLoading: WritableSignal<boolean> = signal(false);
  isGeneratingImage: WritableSignal<boolean> = signal(false);
  chartData: WritableSignal<string | null> = signal(null);
  illustration: WritableSignal<string | null> = signal(null);
  errorMessage: WritableSignal<string | null> = signal(null);

  @ViewChild('backgroundMusic') backgroundMusic!: ElementRef<HTMLAudioElement>;

  constructor(private geminiService: GeminiService) {}

  async handleFormSubmit(data: NatalFormData): Promise<void> {
    this.isLoading.set(true);
    this.isGeneratingImage.set(false);
    this.chartData.set(null);
    this.illustration.set(null);
    this.errorMessage.set(null);

    this.playMusic();

    try {
      // Step 1: Generate text analysis
      const analysisResult = await this.geminiService.generateAnalysis(data);
      this.chartData.set(analysisResult);
      this.isLoading.set(false); // Text is loaded

      // Step 2: Generate illustration
      this.isGeneratingImage.set(true);
      const illustrationResult = await this.geminiService.generateIllustration(analysisResult);
      this.illustration.set(illustrationResult);

    } catch (error) {
      console.error('Error generating natal chart or illustration:', error);
      this.errorMessage.set('Došlo je do pogreške prilikom stvaranja Vaše priče ili slike. Molimo pokušajte ponovno.');
      this.isLoading.set(false);
      this.stopMusic();
    } finally {
      this.isGeneratingImage.set(false);
    }
  }

  reset(): void {
    this.chartData.set(null);
    this.errorMessage.set(null);
    this.isLoading.set(false);
    this.illustration.set(null);
    this.isGeneratingImage.set(false);
    this.stopMusic();
  }

  private playMusic(): void {
    if (this.backgroundMusic?.nativeElement) {
      this.backgroundMusic.nativeElement.volume = 0.2; // Set a subtle volume
      const playPromise = this.backgroundMusic.nativeElement.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Audio playback failed:", error);
        });
      }
    }
  }

  private stopMusic(): void {
    if (this.backgroundMusic?.nativeElement) {
      this.backgroundMusic.nativeElement.pause();
      this.backgroundMusic.nativeElement.currentTime = 0;
    }
  }
}