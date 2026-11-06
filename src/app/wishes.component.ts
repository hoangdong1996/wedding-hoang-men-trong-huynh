import { Component, computed, OnInit, signal } from '@angular/core';
import { wedding } from './wedding.config';
import { googleFormResponseUrl, googleSheetCsvUrl } from './security';
import { ScrollRevealDirective } from './scroll-reveal.directive';

@Component({
  selector: 'app-wishes', standalone: true, imports: [ScrollRevealDirective],
  template: `
    <section id="wishes" class="section wishes-section reveal-panel" aria-labelledby="wishes-title" revealOnScroll>
      <span class="wish-symbol" aria-hidden="true">♡</span>
      <p class="eyebrow">WORDS TO KEEP FOREVER</p>
      <h2 id="wishes-title">Gửi một lời thương</h2>
      <p class="prose">Một lời chúc nhỏ, một kỷ niệm thật lâu. Chúng mình rất mong được đọc những lời yêu thương từ bạn.</p>

      <div class="wish-wall" aria-labelledby="wish-wall-title">
        <p class="eyebrow">WISHES FROM OUR PEOPLE</p>
        <h3 id="wish-wall-title">Những lời chúc yêu thương</h3>
        @if (feedState() === 'loading') {
          <p class="wish-feed-state" role="status">Đang tải lời chúc…</p>
        } @else if (publicWishes().length) {
          <div class="wish-marquee" aria-label="Danh sách lời chúc chạy từ phải sang trái">
            <div class="wish-list" [style.animation-duration.s]="wishDuration()">
              @for (wish of publicWishes(); track $index) {
                <article class="wish-card">
                  <p>“{{wish.message}}”</p>
                  <div><strong>{{wish.name}}</strong><time>{{wish.timestamp}}</time></div>
                </article>
              }
            </div>
          </div>
        } @else {
          <p class="wish-feed-state" role="status">{{feedState() === 'error' ? 'Chưa thể tải danh sách lời chúc.' : 'Chưa có lời chúc công khai.'}}</p>
        }
      </div>

      <form class="wish-form" (submit)="submit($event)" novalidate>
        <label class="wish-field">
          <span>Tên của bạn</span>
          <input #nameInput type="text" name="guestName" autocomplete="name" required minlength="2" maxlength="80"
            placeholder="Nhập tên của bạn" [value]="guestName()" (input)="guestName.set(nameInput.value); clearStatus()">
        </label>

        <label class="wish-field">
          <span>Lời chúc</span>
          <textarea #messageInput name="wishMessage" rows="5" required minlength="2" maxlength="1000"
            placeholder="Viết lời chúc dành cho cô dâu và chú rể…" [value]="wishMessage()"
            (input)="wishMessage.set(messageInput.value); clearStatus()"></textarea>
        </label>

        <div class="wish-form-meta">
          <span>Không gửi thông tin riêng tư.</span>
          <span>{{wishMessage().length}} / 1000</span>
        </div>

        <button class="button" type="submit" [disabled]="!configured || submitting()">{{submitting() ? 'Đang gửi…' : 'Gửi lời chúc ♡'}}</button>
        <p class="wish-status" role="status">
          {{status() || (configured ? 'Lời chúc sẽ được gửi trực tiếp và hiển thị công khai.' : 'Biểu mẫu đang chờ cặp đôi cấu hình Google Forms.')}}
        </p>
      </form>

    </section>`
})
export class WishesComponent implements OnInit {
  readonly guestName = signal('');
  readonly wishMessage = signal('');
  readonly status = signal('');
  readonly submitting = signal(false);
  readonly submitUrl = googleFormResponseUrl(wedding.wishes.formUrl);
  readonly nameEntry = this.entryKey(wedding.wishes.nameEntry);
  readonly messageEntry = this.entryKey(wedding.wishes.messageEntry);
  readonly configured = Boolean(this.submitUrl && this.nameEntry && this.messageEntry);
  readonly feedUrl = googleSheetCsvUrl(wedding.wishes.publicCsvUrl);
  readonly publicWishes = signal<{ timestamp: string; name: string; message: string }[]>([]);
  readonly feedState = signal<'loading' | 'ready' | 'error'>(this.feedUrl ? 'loading' : 'ready');
  readonly wishDuration = computed(() => Math.max(24, this.publicWishes().length * 7 + 12));

  ngOnInit() {
    if (this.feedUrl) void this.loadPublicWishes();
  }

  clearStatus() { this.status.set(''); }

  async submit(event: Event) {
    event.preventDefault();
    const name = this.guestName().trim();
    const message = this.wishMessage().trim();

    if (name.length < 2) {
      this.status.set('Vui lòng nhập tên có ít nhất 2 ký tự.');
      return;
    }
    if (message.length < 2) {
      this.status.set('Vui lòng nhập lời chúc có ít nhất 2 ký tự.');
      return;
    }
    if (!this.configured) {
      this.status.set('Biểu mẫu chưa được cấu hình nên lời chúc chưa thể gửi.');
      return;
    }

    this.submitting.set(true);
    this.status.set('');
    const body = new URLSearchParams({
      [this.nameEntry]: name,
      [this.messageEntry]: message
    });
    try {
      await fetch(this.submitUrl, {
        method: 'POST',
        mode: 'no-cors',
        body,
        referrerPolicy: 'no-referrer'
      });
      this.guestName.set('');
      this.wishMessage.set('');
      this.status.set('Đã gửi lời chúc. Cảm ơn bạn đã gửi yêu thương tới cô dâu và chú rể.');
      window.setTimeout(() => void this.loadPublicWishes(), 1500);
    } catch {
      this.status.set('Không thể gửi lời chúc lúc này. Vui lòng kiểm tra kết nối và thử lại.');
    } finally {
      this.submitting.set(false);
    }
  }

  private entryKey(value: string) {
    const key = value.trim();
    return /^entry\.\d+$/.test(key) ? key : '';
  }

  private async loadPublicWishes() {
    try {
      const response = await fetch(this.feedUrl, { cache: 'no-store', referrerPolicy: 'no-referrer' });
      if (!response.ok) throw new Error(`Google Sheet returned ${response.status}`);
      const rows = this.parseCsv(await response.text());
      if (!rows.length) {
        this.publicWishes.set([]);
        this.feedState.set('ready');
        return;
      }

      const headers = rows[0].map(value => this.normalizeHeader(value));
      const timestampIndex = headers.findIndex(value => value === 'timestamp' || value === 'dau thoi gian');
      const nameIndex = headers.findIndex(value => value === 'ho va ten' || value === 'ten' || value === 'ten cua ban');
      const messageIndex = headers.findIndex(value => value === 'loi chuc');
      if (timestampIndex < 0 || nameIndex < 0 || messageIndex < 0) throw new Error('Missing public wish columns');

      const wishes = rows.slice(1)
        .map(row => ({
          timestamp: (row[timestampIndex] || '').trim(),
          name: (row[nameIndex] || '').trim(),
          message: (row[messageIndex] || '').trim()
        }))
        .filter(wish => wish.name && wish.message)
        .reverse();
      this.publicWishes.set(wishes);
      this.feedState.set('ready');
    } catch {
      this.publicWishes.set([]);
      this.feedState.set('error');
    }
  }

  private normalizeHeader(value: string) {
    return value.replace(/^\uFEFF/, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  }

  private parseCsv(input: string) {
    const rows: string[][] = [];
    let row: string[] = [];
    let field = '';
    let quoted = false;
    for (let index = 0; index < input.length; index++) {
      const character = input[index];
      if (character === '"') {
        if (quoted && input[index + 1] === '"') { field += '"'; index++; }
        else quoted = !quoted;
      } else if (character === ',' && !quoted) {
        row.push(field); field = '';
      } else if ((character === '\n' || character === '\r') && !quoted) {
        if (character === '\r' && input[index + 1] === '\n') index++;
        row.push(field); field = '';
        if (row.some(value => value.length)) rows.push(row);
        row = [];
      } else field += character;
    }
    row.push(field);
    if (row.some(value => value.length)) rows.push(row);
    return rows;
  }
}
