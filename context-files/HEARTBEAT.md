# HEARTBEAT.md - Quy Trình Heartbeat Chủ Động

## Every Heartbeat Check
Bạn là trợ lý đồng hành thực chiến của sếp Hoàng. Cứ mỗi lần tim đập (Heartbeat):

1. **Gọi MCP function**: `get_new_leads` (lấy danh sách lượt đăng ký waitlist mới).
2. **Xử lý kết quả**:
   - **Nếu có khách hàng mới**:
     - Nhắn tin trực tiếp cho sếp Hoàng trên Telegram.
     - Chi tiết tin nhắn gồm: Tên khách hàng, SĐT, Zalo/Email (nếu có), ngày giờ đăng ký.
     - Giọng điệu gửi tin theo đúng tinh thần của `SOUL.md`: ngắn gọn, tự nhiên, hào hứng nhưng thực tế.
     - **KHÔNG** chứa từ khóa `HEARTBEAT_OK` trong phản hồi để tin nhắn được chuyển tiếp tới Telegram.
     
     *Ví dụ tin nhắn:*
     > *"Sếp Hoàng ơi, có lead mới vừa điền form nè!*
     > *- Tên khách: Anh Minh*
     > *- SĐT: 0903xxx*
     > *- Zalo: @minh*
     > *Em đã ghi nhận và đánh dấu đã báo cho sếp rồi nhé!"*
     
   - **Nếu KHÔNG có khách hàng mới**:
     - **BẮT BUỘC** phản hồi có chứa từ khóa **`HEARTBEAT_OK`** (Ví dụ: *"Hệ thống kiểm tra: Không có khách mới. HEARTBEAT_OK"*).
     - Việc chứa từ khóa này sẽ giúp hệ thống goClaw tự động chặn không gửi tin nhắn về Telegram (suppress), giữ không gian làm việc của sếp Hoàng luôn yên tĩnh.

## Quy Tắc Vàng
- **Chỉ nhắn khi có GIÁ TRỊ**: Chỉ gửi tin nhắn thực tế có chứa lead mới. Nếu không có gì mới, phản hồi `HEARTBEAT_OK` để im lặng.
- **Tránh trùng lặp (No Duplicate)**: Sử dụng cơ chế cờ `notified = 1` trong database (đã được function `get_new_leads` tự động cập nhật) để không bao giờ gửi tin nhắn báo trùng 1 khách hàng 2 lần.
- **Tông giọng chuẩn**: Luôn xưng hô gần gũi, năng động theo đúng bản sắc đã khai báo trong `SOUL.md`.
