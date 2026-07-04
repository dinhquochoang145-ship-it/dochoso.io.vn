# Test Log - DNA Kinh Doanh

Nhật ký ghi nhận các lỗi gặp phải trong quá trình test luồng End-to-End ngày hôm nay và cách khắc phục.

## Luồng test:
1. Form đăng ký waitlist & Email chào mừng
2. Chatbot tư vấn (3 câu hỏi)
3. Thanh toán SePay 2.000đ thật
4. Email xác nhận đơn hàng
5. Admin panel cập nhật đơn hàng thành công

---

## Danh sách lỗi phát hiện & Cách khắc phục:

1. **Lỗi Chatbot: Nhấn lựa chọn 1 và 2 trong menu chào mừng không phản hồi đúng kịch bản phân luồng.**
   * *Mô tả lỗi*: Khi bấm vào nút "🛠️ Mình chuẩn bị khởi nghiệp..." hoặc "⚠️ Mình đang vận hành doanh nghiệp...", chatbot tự động chuyển tiếp tới danh sách 10 câu hỏi FAQ thay vì trả lời theo đúng kịch bản hướng nghiệp/quản trị.
   * *Cách khắc phục*: Sửa lại trường `next` của các lựa chọn ban đầu trong `chatbot.js` từ `show_faqs` thành `flow_khoi_nghiep` và `flow_van_hanh`. Bổ sung logic xử lý phân luồng kịch bản tương ứng trong hàm `handleUserChoice` để trả lời đúng nội dung tư vấn hướng nghiệp/vận hành từ `sales_script.md` và cung cấp các lựa chọn nút bấm phù hợp.

2. **Lỗi Chatbot: Chatbot không có câu trả lời khớp từ khóa cho các câu hỏi test bắt buộc ("có phù hợp không" và "để tôi nghĩ thêm").**
   * *Mô tả lỗi*: Khi người dùng gõ trực tiếp *"sản phẩm này có phù hợp với tôi không"* hoặc *"để tôi nghĩ thêm"*, chatbot trả về câu trả lời mặc định (fallback) báo lỗi *"chưa có sẵn câu trả lời tự động..."*.
   * *Cách khắc phục*: Thêm các từ khóa so khớp (`phù hợp`, `hợp không`, `nghĩ thêm`, `suy nghĩ thêm`) trong hàm `processUserText` tại `chatbot.js`. Viết nội dung phản hồi tương ứng theo đúng brand voice từ `sales_script.md` (mục 4.1 và 4.4) và hiển thị các nút định hướng phù hợp.

