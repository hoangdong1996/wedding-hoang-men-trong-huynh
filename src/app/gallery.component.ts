import { Component, ElementRef, signal, viewChild } from '@angular/core';
import { wedding } from './wedding.config';
import { localAsset } from './security';
@Component({selector:'app-gallery',standalone:true,template:`
<section id="album" class="section"><p class="eyebrow">OUR LITTLE MOMENTS</p><h2>Những ngày có nhau</h2><p class="small">Chạm vào từng khoảnh khắc để xem ảnh lớn.</p><div class="gallery">@for(photo of photos;track $index;let i=$index){<figure><button class="photo-button" (click)="open(i)" [attr.aria-label]="'Xem ảnh: '+photo.alt"><img [src]="photo.src" [alt]="photo.alt" loading="lazy" width="600" height="750"><span class="photo-zoom">↗</span></button><figcaption>{{photo.alt}}</figcaption></figure>}</div>@if(demo && w.demo){<p class="small">Tranh minh họa · Album mẫu</p>}</section>
<dialog #viewer class="lightbox" aria-label="Album ảnh cưới" (keydown.arrowleft)="step(-1)" (keydown.arrowright)="step(1)"><button class="dialog-close" (click)="viewer.close()" aria-label="Đóng ảnh">✕</button><img [src]="photos[selected()].src" [alt]="photos[selected()].alt"><div class="lightbox-controls"><button (click)="step(-1)" aria-label="Ảnh trước">←</button><p>{{selected()+1}} / {{photos.length}} · {{photos[selected()].alt}}</p><button (click)="step(1)" aria-label="Ảnh sau">→</button></div></dialog>`})
export class GalleryComponent {
 w=wedding; demo=wedding.photos.length===0;
 photos=this.demo?[{src:'images/botanical.svg',alt:'Một chút dịu dàng'},{src:'images/arches.svg',alt:'Một đời bên nhau'},{src:'images/botanical.svg',alt:'Một ngày đáng nhớ'}]:wedding.photos.map(p=>({...p,src:localAsset(p.src,'images/botanical.svg')}));
 selected=signal(0); viewer=viewChild.required<ElementRef<HTMLDialogElement>>('viewer');
 open(i:number){this.selected.set(i);this.viewer().nativeElement.showModal();}
 step(delta:number){this.selected.update(i=>(i+delta+this.photos.length)%this.photos.length);}
}
