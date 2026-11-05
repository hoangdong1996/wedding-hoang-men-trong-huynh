# Kế hoạch triển khai FE — thiệp cưới gói Cơ bản

## 1. Phạm vi và lựa chọn chi phí

Một landing page riêng cho một cặp đôi, tối ưu điện thoại. Angular standalone + build tĩnh. Không triển khai Spring Boot/MariaDB theo yêu cầu cập nhật. Một source mẫu có thể tái sử dụng bằng cách thay cấu hình rồi build riêng cho mỗi khách.

Bao gồm: hero, lời mời, đếm ngược, câu chuyện, lịch trình, album, đường dẫn bản đồ, tải lịch ICS, chia sẻ link và RSVP qua biểu mẫu ngoài tùy chọn. Không bao gồm trang quản trị, thanh toán, guestbook dùng chung, upload ảnh trực tuyến, gửi email/SMS hoặc báo cáo khách trong website.

## 2. Cấu trúc source

```text
src/
  main.ts                         bootstrap Angular
  index.html                      metadata tĩnh tiếng Việt
  styles.css                      responsive, màu, typography, accessibility
  app/
    wedding.config.ts             nguồn dữ liệu công khai của thiệp
    app.component.ts/html         bố cục, lịch ICS, sao chép
    countdown.component.ts        đếm ngược và dọn timer
    gallery.component.ts          ảnh lazy-load / tranh mẫu
public/
  images/                         asset nội bộ
  _headers                        cache và HTTP headers
angular.json                      build production + giới hạn bundle
netlify.toml                      cấu hình hosting tĩnh tùy chọn
```

Giữ các section tĩnh trong template chính để tránh tách quá nhiều component khó bảo trì. Countdown và gallery có hành vi riêng được tách độc lập. Nếu có nhiều mẫu thiệp về sau, tách hero/event/story khi xuất hiện nhu cầu tái sử dụng thực tế.

## 3. Dữ liệu, API và database

`wedding.config.ts` là dữ liệu được đóng gói công khai: tên, thời gian ISO có timezone, địa điểm, liên kết, câu chuyện, lịch trình, ảnh. Không đưa mật khẩu, danh sách khách hoặc thông tin riêng tư vào file này.

Không có API nội bộ, database hay request tải nội dung lúc mở trang. RSVP là external link Google Forms; dữ liệu thuộc tài khoản của chủ biểu mẫu. Nút RSVP chưa xuất hiện khi thiếu URL; website không giả báo gửi thành công. Maps chỉ là external link, chưa cấu hình thì hiện thông báo.

## 4. Luồng hoạt động

1. Khách mở URL → hosting trả HTML/CSS/JS và SVG/ảnh → Angular hiển thị cấu hình.
2. Các liên kết header cuộn tới section trong trang.
3. Countdown so giờ hiện tại với ISO timestamp, giữ giá trị bằng 0 sau sự kiện; timer được hủy khi component bị hủy.
4. Lưu lịch → tạo file ICS trong trình duyệt → khách nhập vào ứng dụng lịch.
5. Bản đồ → mở Maps ở tab mới, không có SDK hoặc request map lúc tải trang.
6. RSVP → mở Google Forms → Google lưu phản hồi; chủ tiệc xem qua Forms/Sheets.
7. Chia sẻ → sao chép URL; khi clipboard bị chặn, hướng dẫn sao chép thanh địa chỉ.

## 5. Trình tự coding

1. Khởi tạo workspace Angular, strict TypeScript, budget production 300 KB cảnh báo / 500 KB lỗi.
2. Định nghĩa cấu hình mẫu và hợp đồng dữ liệu; giữ cờ demo để tránh nhầm dữ liệu thật.
3. Xây hệ màu kem–olive, layout desktop/mobile, focus bàn phím, skip link và reduced motion.
4. Dựng từng section; dùng SVG nội bộ làm minh họa mặc định.
5. Thêm countdown, calendar export, clipboard và liên kết tùy chọn.
6. Build production, kiểm tra kiểu/template; kiểm tra trình duyệt khi có công cụ preview khả dụng.
7. Thay thông tin thật, kiểm tra biểu mẫu/bản đồ, cập nhật SEO rồi xuất bản.

## 6. Deployment và vận hành

Node chỉ cần trong bước build. Hosting chỉ phục vụ file tĩnh. Cấu hình build/output trong README; hỗ trợ tên miền gốc hoặc thư mục con với asset tương đối. Dùng HTTPS, giữ file index mới, cache dài asset có hash. Không cần backup DB; lưu source, ảnh gốc và phản hồi Forms trong tài khoản chủ tiệc.

Khi bàn giao: source + lockfile + build output + hướng dẫn chỉnh dữ liệu. Khi nâng cấp: chỉ thêm backend nếu thực sự cần quản lý khách/phản hồi trong sản phẩm; không dựng trước để tránh phí duy trì.
