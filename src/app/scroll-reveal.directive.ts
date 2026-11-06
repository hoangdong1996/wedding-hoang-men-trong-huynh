import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Directive, ElementRef, OnDestroy, PLATFORM_ID, Renderer2, inject } from '@angular/core';

@Directive({
  selector: '[revealOnScroll]',
  standalone: true,
  host: { class: 'scroll-reveal' }
})
export class ScrollRevealDirective implements AfterViewInit, OnDestroy {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly platformId = inject(PLATFORM_ID);
  private observer?: IntersectionObserver;

  ngAfterViewInit() {
    const node = this.element.nativeElement;
    if (
      !isPlatformBrowser(this.platformId) ||
      !('IntersectionObserver' in window)
    ) {
      this.renderer.addClass(node, 'is-visible');
      return;
    }

    this.observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        const shouldShow = entry.isIntersecting && entry.intersectionRatio >= 0.12;
        if (shouldShow) {
          this.renderer.addClass(node, 'is-visible');
          this.observer?.unobserve(node);
          this.observer?.disconnect();
          this.observer = undefined;
        }
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });

    this.observer.observe(node);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
