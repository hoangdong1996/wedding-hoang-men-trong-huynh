import { AfterViewInit, Component, ElementRef, OnDestroy, signal, viewChild } from '@angular/core';
import { CountdownComponent } from './countdown.component';
import { GalleryComponent } from './gallery.component';
import { wedding } from './wedding.config';
import { WishesComponent } from './wishes.component';
import { httpsUrl, localAsset, publicShareUrl } from './security';
import { ScrollRevealDirective } from './scroll-reveal.directive';
@Component({selector:'app-root',standalone:true,imports:[CountdownComponent,GalleryComponent,WishesComponent,ScrollRevealDirective],templateUrl:'./app.component.html'})
export class AppComponent implements AfterViewInit, OnDestroy {
  readonly musicTracks=wedding.music
    .map(track=>({...track,src:localAsset(track.src)}))
    .filter(track=>track.src);
  readonly currentMusic=this.musicTracks.length
    ? this.musicTracks[Math.floor(Math.random()*this.musicTracks.length)]
    : null;
  w={...wedding,
    rsvpUrl:httpsUrl(wedding.rsvpUrl),
    coverImage:localAsset(wedding.coverImage,'images/arches.svg'),
    couple:wedding.couple.map(p=>({...p,image:localAsset(p.image,'images/botanical.svg')})),
    events:wedding.events.map(e=>({...e,mapsUrl:httpsUrl(e.mapsUrl)})),
    gifts:wedding.gifts.filter(g=>localAsset(g.qrImage)).map(g=>({...g,qrImage:localAsset(g.qrImage)}))
  }; message=signal('');
  qrDialog=viewChild.required<ElementRef<HTMLDialogElement>>('qrDialog');
  player=viewChild<ElementRef<HTMLAudioElement>>('player');
  playing=signal(false); qrImage=signal(''); qrError=signal('');
  shareUrl=publicShareUrl(wedding.publicUrl, location.href);
  localUrl=/^(localhost|127\.|\[::1\])/.test(new URL(this.shareUrl).hostname);
  formatDate(date:string) { return new Intl.DateTimeFormat('vi-VN',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',timeZone:'Asia/Ho_Chi_Minh'}).format(new Date(date)); }
  private readonly unlockMusic=(event:Event)=>{
    const target=event.target;
    if(target instanceof Element && target.closest('.music-control')) return;
    void this.playMusic(false);
  };
  ngAfterViewInit() {
    if(!this.currentMusic) return;
    void this.playMusic(false).then(started=>{if(!started)this.listenForMusicUnlock();});
  }
  ngOnDestroy() {this.stopListeningForMusicUnlock();}
  private listenForMusicUnlock() {
    document.addEventListener('pointerdown',this.unlockMusic,{passive:true});
    document.addEventListener('click',this.unlockMusic);
    document.addEventListener('keydown',this.unlockMusic);
  }
  private stopListeningForMusicUnlock() {
    document.removeEventListener('pointerdown',this.unlockMusic);
    document.removeEventListener('click',this.unlockMusic);
    document.removeEventListener('keydown',this.unlockMusic);
  }
  private async playMusic(showError=true) {
    const audio=this.player()?.nativeElement;
    if(!audio) return false;
    try {
      await audio.play();
      this.playing.set(true);
      this.message.set('');
      this.stopListeningForMusicUnlock();
      return true;
    } catch {
      if(showError)this.message.set('Trình duyệt chưa cho phép phát nhạc. Hãy chạm lại nút Nhạc.');
      return false;
    }
  }
  async toggleMusic() {
    const audio=this.player()?.nativeElement;
    if(!audio) return;
    if(audio.paused) await this.playMusic();
    else {audio.pause();this.playing.set(false);}
  }
  async showQr() {
    this.qrDialog().nativeElement.showModal();
    try {const qr=await import('qrcode');this.qrImage.set(await qr.default.toDataURL(this.shareUrl,{width:320,margin:2}));}
    catch {this.qrError.set('Không tạo được QR. Bạn có thể sao chép đường dẫn thiệp.');}
  }
  dateParts = new Intl.DateTimeFormat('vi-VN', { day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',timeZone:'Asia/Ho_Chi_Minh',hour12:false }).formatToParts(new Date(wedding.date));
  calendarWeekdays=['T2','T3','T4','T5','T6','T7','CN'];
  weddingDay=Number(this.part('day'));
  calendarDays=this.monthCalendar(Number(this.part('year')),Number(this.part('month')));
  part(type:string) { return this.dateParts.find(p=>p.type===type)?.value ?? ''; }
  monthCalendar(year:number, month:number) {
    const firstDay=(new Date(Date.UTC(year,month-1,1)).getUTCDay()+6)%7;
    const total=new Date(Date.UTC(year,month,0)).getUTCDate();
    const days:(number|null)[]=Array(firstDay).fill(null);
    for(let day=1;day<=total;day++) days.push(day);
    while(days.length%7) days.push(null);
    return days;
  }
  weekday(date=this.w.date) { return new Intl.DateTimeFormat('vi-VN',{weekday:'long',timeZone:'Asia/Ho_Chi_Minh'}).format(new Date(date)).toLocaleUpperCase('vi-VN'); }
  dayOf(date:string) { return new Intl.DateTimeFormat('vi-VN',{day:'2-digit',timeZone:'Asia/Ho_Chi_Minh'}).format(new Date(date)); }
  calendar(event = {date:this.w.date, endDate:this.w.endDate, venue:this.w.venue, address:this.w.address}) {
    const stamp=(value:string)=>new Date(value).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
    const escape=(s:string)=>s.replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
    const content=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Wedding Basic//VI','BEGIN:VEVENT',`UID:wedding-${stamp(event.date)}@invitation.local`,`DTSTAMP:${stamp(new Date().toISOString())}`,`DTSTART:${stamp(event.date)}`,`DTEND:${stamp(event.endDate)}`,`SUMMARY:${escape('Lễ cưới '+this.w.bride+' & '+this.w.groom)}`,`LOCATION:${escape(event.venue+', '+event.address)}`,'END:VEVENT','END:VCALENDAR',''].join('\r\n');
    const url=URL.createObjectURL(new Blob([content],{type:'text/calendar;charset=utf-8'})); const a=document.createElement('a'); a.href=url;a.download='ngay-chung-doi.ics';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  async share() { try {await navigator.clipboard.writeText(this.shareUrl);this.message.set('Đã sao chép đường dẫn thiệp.');} catch {this.message.set('Bạn có thể sao chép đường dẫn trên thanh địa chỉ.');} }
}


