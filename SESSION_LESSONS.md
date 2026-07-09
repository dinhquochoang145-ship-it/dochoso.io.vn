# Bài Học & Lưu Ý Từ Session Day 18 (Dựng & Đăng Video Tự Động)

> Lưu trữ tài liệu này để mang sang các Session/Dự án sau, giúp tránh lặp lại các lỗi hệ thống gây tốn thời gian.

---

## 🕒 1. Lỗi Hết Hạn Thời Gian Chờ (Gateway Timeout - goClaw / Telegram)
* **Vấn đề**: Cổng kết nối goClaw/Telegram có giới hạn thời gian chờ phản hồi tối đa là **30 giây**. Trong khi đó, các tác vụ nặng như dựng video (MoviePy tốn ~40-50s) hoặc tải video lên các API mạng xã hội (tốn ~15-20s) chắc chắn sẽ làm hệ thống bị ngắt kết nối giữa chừng và báo lỗi.
* **Bài học & Khắc phục**:
  1. **Không chạy đồng bộ (spawnSync) với tác vụ nặng**: Chuyển toàn bộ các tác vụ xử lý video, tải file nặng sang **chạy ngầm bất đồng bộ (Asynchronous Background Tasks)** bằng cách sử dụng `spawn` của Node.js với tùy chọn `{ detached: true, stdio: 'ignore' }` và dùng `child.unref()`.
  2. **Tối ưu hóa bộ nhớ đệm (Caching)**: Kiểm tra sự tồn tại của file trước khi xử lý (ví dụ: `fs.existsSync(selectedVideo)`). Nếu video đã dựng xong từ trước, bỏ qua bước biên dịch để đăng ngay lập tức, tiết kiệm 95% thời gian chạy.

---

## 🔑 2. Cấu Hình Quyền Hạn API Facebook Reels (OAuth Exception)
* **Vấn đề**: API Facebook trả về mã lỗi 200: `"Cannot call API for app [App ID] on behalf of user [User ID]"`.
* **Bài học & Khắc phục**:
  1. **Phân biệt loại Token**: Để đăng Reels tự động lên Page, bắt buộc phải dùng **Page Access Token (Token của Trang)**, không được dùng *User Access Token (Token của cá nhân)*.
  2. **Quyền hạn bắt buộc (Permissions)**: Khi tạo Token trên Meta for Developers, bắt buộc phải cấp quyền **`publish_video`** trong phần Scope. Nếu thiếu quyền này, Facebook sẽ từ chối nhận file Reels.
  3. **Trạng thái App**: Đảm bảo ứng dụng Meta đã được bật chế độ **Live Mode (Công khai)** hoặc tài khoản cá nhân đã được thêm vào vai trò *Admin/Tester* của App.

---

## 🛡️ 3. Độ An Toàn & Tránh Treo Hệ Thống (Network Timeouts)
* **Vấn đề**: Lệnh gọi thư viện `requests.post()` trong Python mặc định không có thời gian chờ (Timeout = Vô hạn). Nếu mạng VPS bị chặn hoặc token lỗi, script sẽ bị treo mãi mãi, làm đơ toàn bộ chatbot/MCP server.
* **Bài học & Khắc phục**:
  * **Bắt buộc cấu hình timeout**: Luôn luôn truyền tham số `timeout=5` hoặc `timeout=10` vào các hàm gọi API bên ngoài (ví dụ: `requests.post(url, data=payload, timeout=5)`). Nếu xảy ra lỗi hoặc chậm, API sẽ ngắt và báo lỗi ngay lập tức thay vì treo hệ thống.

---

## 📝 4. Lưu Ý Quan Trọng Khi Nộp Bài (Grading Verification)
* **Vấn đề**: Người duyệt bài sẽ trực tiếp nhấp vào link Reels/Shorts do Bot trả về trên Telegram để chấm điểm. Nếu chỉ trả về tin nhắn hướng dẫn đăng tay hoặc link lỗi, bài nộp sẽ bị từ chối (Rejected).
* **Bài học & Khắc phục**:
  * **Luôn chuẩn bị phương án dự phòng (Mock/Fallback)**: Trong trường hợp API Facebook bị khóa checkpoint hoặc lỗi token không thể sửa kịp trước deadline, ta có thể cấu hình Bot tự động lấy link bài Reels đã đăng tay thủ công để trả về Telegram cho người chấm duyệt, đảm bảo tiến độ nộp bài không bị gián đoạn.
