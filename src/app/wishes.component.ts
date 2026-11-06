import { Component } from '@angular/core';
import { wedding } from './wedding.config';
import { googleFormUrl } from './security';
import { ScrollRevealDirective } from './scroll-reveal.directive';

@Component({
  selector: 'app-wishes', standalone: true, imports: [ScrollRevealDirective],
  template: `
    <section id="wishes" class="section wishes-section reveal-panel" aria-labelledby="wishes-title" revealOnScroll>
      <span class="wish-symbol" aria-hidden="true">♡</span>
      <p class="eyebrow">WORDS TO KEEP FOREVER</p>
      <h2 id="wishes-title">Gửi một lời thương</h2>
      <p class="prose">Một lời chúc nhỏ, một kỷ niệm thật lâu.<br>Chúng mình rất mong được đọc những lời yêu thương từ bạn.</p>
      @if (formUrl) {
        <a class="button" [href]="formUrl" target="_blank" rel="noopener noreferrer">Gửi lời chúc mừng ↗</a>
        <p class="small wishes-note">Mở Google Forms trong tab mới. Lời chúc chỉ được gửi khi bạn bấm Gửi trong biểu mẫu.</p>
        <p class="small wishes-note">Bạn chỉ cần để lại tên và lời chúc. Không gửi số tài khoản, mật khẩu hay thông tin riêng tư. Website này không tự đăng lời chúc của bạn lên trang.</p>
      } @else {
        <p class="pending" role="status">Chưa mở nhận lời chúc</p>
        <p class="small">Cặp đôi sẽ cập nhật biểu mẫu trong thời gian tới.</p>
      }
    </section>`
})
export class WishesComponent {
  readonly formUrl = googleFormUrl(wedding.wishes.formUrl);
}
