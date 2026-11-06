# Thiệp cưới online — gói Cơ bản

Frontend Angular 21 standalone, TypeScript strict, CSS thuần. Không cần API, database, tài khoản quản trị hay server chạy thường trực. Nội dung mẫu được đánh dấu rõ trên giao diện.

## Chạy và build

Cần Node.js 22.12+ hoặc 24 LTS, npm tương thích. Node 16 trên máy hiện tại không đủ.

```sh
npm ci
npm start
npm run check
npm run build
```

Mở http://localhost:4200. Bộ file xuất bản nằm ở `dist/wedding/browser`.
Nếu hosting đặt trong thư mục con, base href tương đối hiện tại hỗ trợ tải asset tại đó. Không dùng Angular Router nên không cần rewrite SPA.

## Cá nhân hóa

1. Sửa `src/app/wedding.config.ts`: tên, chữ viết tắt, ngày ISO có `+07:00`, ngày kết thúc, ngày hiển thị, địa điểm, câu chuyện và lịch trình.
2. Thêm ảnh thật vào `public/images/`, khai báo `photos` bằng đường dẫn `images/ten-anh.webp` và mô tả `alt`. Ảnh album tải chậm; ưu tiên ảnh WebP khoảng 100–200 KB/ảnh. Không cần thư viện ảnh hoặc CDN ngoài.
3. Điền `mapsUrl` là liên kết Google Maps HTTPS của địa điểm thực. Không cần API key.
4. Tạo Google Forms gồm tên khách, có/không tham dự, số người và lời nhắn; liên kết câu trả lời với Google Sheets nếu cần. Điền URL chia sẻ biểu mẫu vào `rsvpUrl`. Kiểm tra khách không cần đăng nhập. Website chỉ mở biểu mẫu; dữ liệu được gửi và lưu bởi Google Forms, không lưu trong trình duyệt hay source code.
5. Sửa title, description, Open Graph trong `src/index.html` để trình thu thập link đọc được trước khi JavaScript chạy. Có thể thêm `og:image` với URL tuyệt đối sau khi biết domain.
6. Kiểm tra thông tin thật rồi đổi `demo: false`, build lại.

## Deployment đơn giản

Chỉ upload **nội dung** `dist/wedding/browser` lên hosting tĩnh hỗ trợ HTTPS; không upload `node_modules` hoặc source vào thư mục public.

- Build command: `npm ci && npm run build`.
- Output directory: `dist/wedding/browser`.
- Node version: 24.
- Có sẵn `netlify.toml` nếu dùng Netlify; hoặc đưa thư mục output lên hosting tĩnh đang có.
- Không cần Docker, VPS, Spring Boot, MariaDB hay dịch vụ chạy nền.
- Dùng subdomain của nhà cung cấp nếu muốn tránh phí domain; hạn mức/chi phí hosting tùy tài khoản và nhà cung cấp, cần kiểm tra trước khi đăng ký.
- Bật HTTPS. Cache asset có hash lâu dài; `index.html` phải được revalidate. File `public/_headers` áp dụng trên hosting có hỗ trợ định dạng này.
- Giữ bản build trước để rollback. Thay nội dung thì build và upload lại.

## Kiểm tra trước khi gửi khách

- Mobile 360 px và desktop: không tràn ngang, nội dung đủ dấu tiếng Việt.
- Tab bàn phím, focus, các anchor, thao tác sao chép trên HTTPS.
- Đếm ngược đúng giờ Việt Nam, về 0 sau ngày cưới.
- Mở file `.ics` và đối chiếu ngày, giờ, địa điểm thực tế.
- Bản đồ tới đúng sảnh; Google Forms nhận được câu trả lời thử trong tài khoản chủ tiệc.
- Thay toàn bộ dữ liệu mẫu, kiểm tra preview khi chia sẻ link.

Kế hoạch kiến trúc, luồng và các giai đoạn: `IMPLEMENTATION_PLAN.md`.

## Bố cục Basic 1.0

Thứ tự: ảnh bìa → lời mời → giới thiệu cặp đôi → đếm ngược → câu chuyện → album → lễ cưới hai gia đình → RSVP (tùy chọn) → mừng cưới → lời cảm ơn/chia sẻ QR.

Các trường bổ sung trong `wedding.config.ts`:
- `coverImage`: ảnh bìa; `couple`: ảnh và giới thiệu từng người.
- `events`: mỗi sự kiện có ngày bắt đầu/kết thúc, địa điểm, `mapsUrl` và lịch trình riêng; nút lịch xuất đúng sự kiện được chọn.
- `music`: playlist các mục `{ title, src }` có quyền sử dụng trong `public/music/`. Khi mở thiệp, một bài hợp lệ được chọn ngẫu nhiên và thử tự phát; nếu mobile chặn autoplay, lần chạm đầu tiên trên thiệp sẽ kích hoạt nhạc. Playlist rỗng sẽ tắt nhạc; `showMusicControl: false` chỉ ẩn nút phát/tạm dừng.
- `publicUrl`: URL HTTPS chính thức dùng cho QR/chia sẻ; bỏ trống dùng địa chỉ hiện tại. URL localhost không dùng để gửi khách.
- `gifts`: mỗi mục gồm `name`, `bank`, `account`, `qrImage`. Dùng ảnh QR từ ngân hàng đã đối chiếu đúng người nhận; không tạo số tài khoản mẫu. Bỏ trống sẽ ẩn phần này ở bản chính thức.
- `rsvpUrl` và `events[].mapsUrl`: bỏ trống sẽ ẩn các nút tương ứng.

Album hỗ trợ hộp xem toàn màn hình, phím trái/phải chuyển ảnh, Escape đóng và khóa cuộn nền. QR liên kết tạo tại trình duyệt, không gửi URL đến dịch vụ QR bên ngoài. Các ảnh hiện có vẫn là tranh minh họa.

## Lời chúc và bảo mật
Cấu hình Google Forms tại wishes.formUrl. Chưa có URL thì mục lời chúc hiển thị chưa mở; không lưu hoặc giả lập gửi thành công. Xem SECURITY.md để tạo Forms và bảo vệ dữ liệu phản hồi.
Build phải dùng npm run build để áp dụng meta CSP dự phòng. npm run preview mở bản production có HTTP security headers trên cổng 4201. F12 chỉ sửa tab của khách, không phải quyền sửa website gốc.

