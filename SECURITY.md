# Bảo mật cơ bản và gửi lời chúc

## Giới hạn đúng của frontend

Người xem có thể dùng F12 sửa DOM, JavaScript, nút hoặc dữ liệu trong tab của họ. Không có cách đáng tin cậy để khóa quyền này. Chặn chuột phải, bắt phím F12, mã hóa/giấu JavaScript không phải kiểm soát truy cập. Bản sửa trong tab không ghi được lên file hosting hoặc thay dữ liệu của khách khác khi hệ thống không cung cấp API ghi công khai.

Website không có API ghi, trang quản trị, bí mật, tài khoản khách hay database trong trình duyệt. Sửa thiệp gốc cần quyền deployment trên hosting. Không dùng localStorage hoặc dữ liệu do trình duyệt gửi để quyết định ai được sửa website. Các kiểm tra URL frontend là lớp phòng vệ UI, không phải ranh giới phân quyền và có thể bị người xem bỏ qua trong tab của họ.

## Những gì đã triển khai

- Giữ nội dung trong Angular interpolation; không dùng `innerHTML`, eval hoặc API bypass sanitization để hiển thị lời chúc.
- Lời chúc chỉ POST tới endpoint `formResponse` được suy ra từ Google Forms respondent URL trên domain chính xác. URL editor, HTTP, javascript, host giả và credentials bị từ chối; tên/lời chúc nằm trong request body, không nằm trên URL website.
- Các liên kết ngoài chỉ nhận HTTPS, có `noopener noreferrer`. URL chia sẻ loại query/hash để không vô tình đưa mã khách hoặc token vào QR.
- Ảnh/nhạc chỉ dùng đường dẫn cục bộ trong `images/` và `music/`, tránh gọi máy chủ theo dõi ngoài. Chủ thiệp chỉ đưa asset đáng tin cậy vào source.
- Production CSP chỉ cho phép JS/CSS/font/media cùng nguồn, ảnh cùng nguồn hoặc data URL để tạo QR, và kết nối đọc CSV tới Google Sheets; chặn iframe, object và form submit ngay tại trang thiệp. Mở Google Forms bằng liên kết không bị `form-action` chặn.
- `frame-ancestors 'none'` + `X-Frame-Options: DENY` chống nhúng trang; `nosniff`, `no-referrer`, hạn chế camera/microphone/vị trí/payment/USB, HSTS khi phục vụ HTTPS.
- Tắt source map, tắt critical CSS inline để dùng CSP không có `unsafe-inline` hoặc `unsafe-eval`. Không có analytics/cookie theo dõi hay lưu lời chúc trong localStorage.
- Build chạy `scripts/secure-build.mjs` để thêm meta CSP dự phòng và kiểm tra không có source map/inline script/style. Meta không thay được HTTP headers chống iframe, HSTS và Permissions-Policy.

## Cấu hình và công khai lời chúc

Google Form đã được cấu hình trong `wedding.wishes`. Website POST trực tiếp tên/lời chúc tới endpoint `formResponse`; dữ liệu không được lưu trong trình duyệt hay source.

1. Chủ tiệc tạo Google Form: “Tên của bạn” dạng trả lời ngắn (bắt buộc, tối đa 80 ký tự) và “Lời chúc” dạng đoạn văn (bắt buộc, tối đa 1000 ký tự). Đặt giới hạn trong Google Forms, không chỉ ở frontend.
2. Chỉ cho chủ tiệc/người được chỉ định quyền editor. Vì website đọc danh sách lời chúc công khai, Sheet phản hồi chỉ được chứa ba cột Timestamp, Họ và Tên, Lời chúc; không thu email, số điện thoại hoặc dữ liệu riêng tư. Bật xác thực hai bước cho tài khoản Google và hosting.
3. Tắt **Allow response editing** để khách không sửa phản hồi sau khi gửi. Tắt **View results summary** để tránh công khai toàn bộ nội dung. Không thu email/số điện thoại nếu không cần; tránh câu hỏi upload file.
4. Nếu cần không đăng nhập: không bật **Limit to 1 response**. Đổi lại, link công khai có thể nhận spam/nhận nhiều phản hồi; không có chống spam tuyệt đối. Khi cần hạn chế nghiêm ngặt, dùng đăng nhập hoặc backend với rate limit/CAPTCHA/kiểm duyệt; ngoài phạm vi FE hiện tại.
5. Publish cho người trả lời. Trong menu ba chấm, chọn tạo liên kết điền sẵn, nhập dữ liệu mẫu vào hai trường rồi lấy link. Dùng URL đầy đủ `https://docs.google.com/forms/d/e/.../viewform`; không dùng URL `/edit` hay link chỉnh sửa phản hồi.
6. Trong link điền sẵn, lấy hai khóa query dạng `entry.123456`: khóa của tên điền vào `wishes.nameEntry`, khóa của lời chúc điền vào `wishes.messageEntry`; điền URL viewer vào `wishes.formUrl`.
7. Build lại, nhập thử tên/lời chúc trên website, bấm Gửi và đối chiếu trong tài khoản chủ biểu mẫu. Do Google Forms trả opaque response cho POST cross-origin, frontend chỉ xác nhận request hoàn tất; danh sách công khai đọc lại Timestamp, Họ và Tên, Lời chúc từ CSV của Sheet.
8. Website hiển thị toàn bộ lời chúc, mới nhất trước, và thời gian đúng như giá trị Timestamp trong Sheet. Nội dung gửi vào Form sẽ công khai trên website; cần ghi rõ điều này cho người gửi và kiểm duyệt/xóa nội dung không phù hợp trong Sheet.

## Deploy và xác minh

Chạy `npm run test:security`, `npm run build`, `npm run preview`. Cổng 4201 phục vụ bản production với headers để kiểm tra; cổng 4200 là dev server, không chứng minh headers của hosting đã bật.

Upload **nội dung** `dist/wedding/browser` (bao gồm `_headers`). Netlify đọc file này. Hosting khác phải cấu hình headers tương đương; `_headers` không tự có hiệu lực trên mọi máy chủ. Sau deploy kiểm tra response headers bằng trình duyệt/curl, mở album và QR, xem Console không có lỗi CSP. Bật HTTPS trước khi gửi khách; HSTS chỉ có hiệu lực trên HTTPS. Không upload `.git`, source, file `.env` hoặc quyền truy cập hosting vào thư mục public.

Kiểm tra dependency bằng `npm audit --omit=dev`; kết quả là cảnh báo đã biết ở thời điểm chạy, không phải chứng nhận an toàn. Quyền deployment, bảo vệ Google account, xử lý phản hồi và chống spam phụ thuộc cấu hình dịch vụ; frontend không kiểm soát được các quyền đó.

Tài liệu tham chiếu:
- Angular security: https://angular.dev/best-practices/security
- Netlify headers: https://docs.netlify.com/manage/routing/headers/
- Google Forms chia sẻ và cài đặt phản hồi: https://support.google.com/docs/answer/2839588
