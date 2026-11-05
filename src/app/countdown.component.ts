import { Component, OnDestroy, signal } from '@angular/core';
import { wedding } from './wedding.config';
@Component({selector:'app-countdown', standalone:true, template:`<div class="countdown" aria-label="Đếm ngược đến ngày cưới">@for (item of parts(); track item.label) {<div><strong>{{ item.value }}</strong><span>{{ item.label }}</span></div>}</div><p class="small">{{ finished() ? 'Ngày hạnh phúc đã đến ♥' : 'Đếm từng khoảnh khắc để được gặp bạn' }}</p>`})
export class CountdownComponent implements OnDestroy {
  parts = signal<{label:string;value:string}[]>([]); finished = signal(false);
  private timer: ReturnType<typeof setInterval>;
  constructor() { this.update(); this.timer=setInterval(()=>this.update(),1000); }
  private update() { const s=Math.max(0,Math.floor((Date.parse(wedding.date)-Date.now())/1000)); this.finished.set(s===0); this.parts.set([{label:'NGÀY',value:String(Math.floor(s/86400)).padStart(2,'0')},{label:'GIỜ',value:String(Math.floor(s/3600)%24).padStart(2,'0')},{label:'PHÚT',value:String(Math.floor(s/60)%60).padStart(2,'0')},{label:'GIÂY',value:String(s%60).padStart(2,'0')}]); }
  ngOnDestroy() {clearInterval(this.timer);}
}
