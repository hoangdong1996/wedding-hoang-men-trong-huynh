import { Component, ElementRef, signal, viewChild } from '@angular/core';
import { wedding } from './wedding.config';
import { localAsset } from './security';
import { ScrollRevealDirective } from './scroll-reveal.directive';
@Component({selector:'app-gallery',standalone:true,imports:[ScrollRevealDirective],template:`
<section id="album" class="section"><p class="eyebrow" revealOnScroll>OUR LITTLE MOMENTS</p><h2 class="reveal-title" revealOnScroll>Những ngày có nhau</h2><p class="small" revealOnScroll>Chạm vào từng khoảnh khắc để xem ảnh lớn.</p><div class="gallery">@for(photo of photos;track $index;let i=$index){<figure class="reveal-photo" revealOnScroll><button class="photo-button" (click)="open(i)" [attr.aria-label]="'Xem ảnh: '+photo.alt"><img [src]="photo.src" [alt]="photo.alt" loading="lazy" decoding="async" width="600" height="750"></button><figcaption>{{photo.alt}}</figcaption></figure>}</div>@if(demo && w.demo){<p class="small">Tranh minh họa · Album mẫu</p>}</section>
<dialog #viewer class="lightbox" (close)="isOpen.set(false)" aria-label="Album ảnh cưới" (keydown.arrowleft)="step(-1)" (keydown.arrowright)="step(1)"><button class="dialog-close" (click)="viewer.close()" aria-label="Đóng ảnh">✕</button>@if(isOpen()){<img [src]="photos[selected()].fullSrc || photos[selected()].src" [alt]="photos[selected()].alt" decoding="async">}<div class="lightbox-controls"><button (click)="step(-1)" aria-label="Ảnh trước">←</button><p>{{selected()+1}} / {{photos.length}} · {{photos[selected()].alt}}</p><button (click)="step(1)" aria-label="Ảnh sau">→</button></div></dialog>`})
export class GalleryComponent {
 w=wedding; demo=wedding.photos.length===0;
 photos: {src:string;fullSrc?:string;alt:string}[]=this.demo?[{src:'images/botanical.svg',alt:'Một chút dịu dàng'},{src:'images/arches.svg',alt:'Một đời bên nhau'},{src:'images/botanical.svg',alt:'Một ngày đáng nhớ'}]:wedding.photos.map(p=>({...p,src:localAsset(p.src,'images/botanical.svg'),fullSrc:localAsset(p.fullSrc || p.src,'images/botanical.svg')}));
 isOpen=signal(false); selected=signal(0); viewer=viewChild.required<ElementRef<HTMLDialogElement>>('viewer');
 open(i:number){this.selected.set(i);this.isOpen.set(true);this.viewer().nativeElement.showModal();}
 step(delta:number){this.selected.update(i=>(i+delta+this.photos.length)%this.photos.length);}
}
