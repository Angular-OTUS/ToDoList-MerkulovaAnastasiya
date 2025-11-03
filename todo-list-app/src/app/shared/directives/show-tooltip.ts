import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
  InputSignal,
  OnDestroy,
} from '@angular/core';

@Directive({
  selector: '[appShowTooltip]',
})
export class ShowTooltip implements OnDestroy {
  private targetElementRef: ElementRef = inject(ElementRef);
  private tooltipElement: HTMLElement | null = null;
  public tooltipText = input.required<string>();

  @HostListener('mouseenter') onMouseEnter() {
    this.showTooltip();
  }
  @HostListener('mouseleave') onMouseLeave() {
    this.hideTooltip();
  }

  private createTooltip(): HTMLDivElement {
    const target = this.targetElementRef.nativeElement as HTMLElement;
    const rect = target.getBoundingClientRect();
    const tooltip = document.createElement('div');
    tooltip.className = 'custom-tooltip';
    tooltip.textContent = this.tooltipText();
    tooltip.style.position = 'absolute';
    tooltip.style.top = `${rect.top - tooltip.offsetHeight - 40}px`;
    tooltip.style.left = `${rect.left + rect.width / 2}px`;
    return tooltip;
  }

  private showTooltip(): void {
    if (!this.tooltipElement) {
      this.tooltipElement = this.createTooltip();
      document.body.appendChild(this.tooltipElement);
    }
  }

  private hideTooltip(): void {
    if (this.tooltipElement) {
      this.tooltipElement.parentNode?.removeChild(this.tooltipElement);
      this.tooltipElement = null;
    }
  }

  ngOnDestroy(): void {
    this.hideTooltip();
  }
}
