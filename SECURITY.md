# Bảo mật cơ bản và gửi lời chúc

## Giới hạn đúng của frontend

Người xem có thể dùng F12 sửa DOM, JavaScript, nút hoặc dữ liệu trong tab của họ. Không có cách đáng tin cậy để khóa quyền này. Chặn chuột phải, bắt phím F12, mã hóa/giấu JavaScript không phải kiểm soát truy cập. Bản sửa trong tab không ghi được lên file hosting hoặc thay dữ liệu của khách khác khi hệ thống không cung cấp API ghi công khai.

Website không có API ghi, trang quản trị, bí mật, tài khoản khách hay database trong trình duyệt. Sửa thiệp gốc cần quyền deployment trên hosting. Không dùng localStorage hoặc dữ liệu do trình duyệt gửi để quyết định ai được sửa website. Các kiểm tra URL frontend là lớp phòng vệ UI, không phải ranh giới phân quyền và có thể bị người xem bỏ qua trong tab của họ.

## Những gì đã triển khai

- Giữ nội dung trong Angular interpolation; không dùng `innerHTML`, eval hoặc API bypass sanitization để hiển thị lời chúc.
- Lời chúc chỉ mở Google Forms trên domain chính xác, đường dẫn dành cho người trả lời. URL editor, HTTP, javascript, host giả và credentials bị từ chối. Không thêm tên/lời chúc vào URL trên website.
- Các liên kết ngoài chỉ nhận HTTPS, có `noopener noreferrer`. URL chia sẻ loại query/hash để không vô tình đưa mã khách hoặc token vào QR.
- Ảnh/nhạc chỉ dùng đường dẫn cục bộ trong `images/` và `music/`, tránh gọi máy chủ theo dõi ngoài. Chủ thiệp chỉ đưa asset đáng tin cậy vào source.
- Production CSP chỉ cho phép JS/CSS/font/media cùng nguồn, ảnh cùng nguồn hoặc data URL để tạo QR; chặn iframe, object và form submit ngay tại trang thiệp. Mở Google Forms bằng liên kết không bị `form-action` chặn.
- `frame-ancestors 'none'` + `X-Frame-Options: DENY` chống nhúng trang; `nosniff`, `no-referrer`, hạn chế camera/microphone/vị trí/payment/USB, HSTS khi phục vụ HTTPS.
- Tắt source map, tắt critical CSS inline để dùng CSP không có `unsafe-inline` hoặc `unsafe-eval`. Không có analytics/cookie theo dõi hay lưu lời chúc trong localStorage.
- Build chạy `scripts/secure-build.mjs` để thêm meta CSP dự phòng và kiểm tra không có source map/inline script/style. Meta không thay được HTTP headers chống iframe, HSTS và Permissions-Policy.

## Cách nhận lời chúc khi chưa có URL

Hiện `wedding.wishes.formUrl` trống nên trang hiển thị “Chưa mở nhận lời chúc”. Chưa có lời chúc nào được nhận/lưu và không có thông báo gửi thành công giả.

1. Chủ tiệc tạo Google Form: “Tên của bạn” dạng trả lời ngắn (bắt buộc, tối đa 80 ký tự) và “Lời chúc” dạng đoạn văn (bắt buộc, tối đa 1000 ký tự). Đặt giới hạn trong Google Forms, không chỉ ở frontend.
2. Chỉ cho chủ tiệc/người được chỉ định quyền editor. Sheet nhận dữ liệu không chia sẻ công khai. Bật xác thực hai bước cho tài khoản Google và hosting.
3. Tắt **Allow response editing** để khách không sửa phản hồi sau khi gửi. Tắt **View results summary** để tránh công khai toàn bộ nội dung. Không thu email/số điện thoại nếu không cần; tránh câu hỏi upload file.
4. Nếu cần không đăng nhập: không bật **Limit to 1 response**. Đổi lại, link công khai có thể nhận spam/nhận nhiều phản hồi; không có chống spam tuyệt đối. Khi cần hạn chế nghiêm ngặt, dùng đăng nhập hoặc backend với rate limit/CAPTCHA/kiểm duyệt; ngoài phạm vi FE hiện tại.
5. Publish cho người trả lời, sao chép URL `https://forms.gle/...` hoặc `https://docs.google.com/forms/d/e/.../viewform`. Không dùng URL `/edit` hay link chỉnh sửa phản hồi.
6. Điền URL vào `src/app/wedding.config.ts` → `wishes.formUrl`; build lại. Thử gửi một phản hồi trong trình duyệt riêng tư và đối chiếu trong tài khoản chủ biểu mẫu. Website chỉ chuyển sang Forms, không đọc/công bố phản hồi.
7. Nếu muốn đăng lời chúc lên thiệp sau này: xin phép người gửi, duyệt trước khi đăng và chỉ đưa tên hiển thị/nội dung cần thiết vào source; không công khai Sheet gốc.

## Deploy và xác minh

Chạy `npm run test:security`, `npm run build`, `npm run preview`. Cổng 4201 phục vụ bản production với headers để kiểm tra; cổng 4200 là dev server, không chứng minh headers của hosting đã bật.

Upload **nội dung** `dist/wedding/browser` (bao gồm `_headers`). Netlify đọc file này. Hosting khác phải cấu hình headers tương đương; `_headers` không tự có hiệu lực trên mọi máy chủ. Sau deploy kiểm tra response headers bằng trình duyệt/curl, mở album và QR, xem Console không có lỗi CSP. Bật HTTPS trước khi gửi khách; HSTS chỉ có hiệu lực trên HTTPS. Không upload `.git`, source, file `.env` hoặc quyền truy cập hosting vào thư mục public.

Kiểm tra dependency bằng `npm audit --omit=dev`; kết quả là cảnh báo đã biết ở thời điểm chạy, không phải chứng nhận an toàn. Quyền deployment, bảo vệ Google account, xử lý phản hồi và chống spam phụ thuộc cấu hình dịch vụ; frontend không kiểm soát được các quyền đó.

Tài liệu tham chiếu:
- Angular security: https://angular.dev/best-practices/security
- Netlify headers: https://docs.netlify.com/manage/routing/headers/
- Google Forms chia sẻ và cài đặt phản hồi: https://support.google.com/docs/answer/2839588
