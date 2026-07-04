# Danh sách 3 MCP Functions Đã Chọn - DNA Kinh Doanh

Dưới đây là 3 chức năng MCP đã chốt để tiến hành xây dựng nhằm kết nối AI Agent với hệ thống dữ liệu website:

---

## 1. get_sales_summary
*   **Mô tả:** Xem nhanh doanh số và tình hình đơn hàng của ngày hôm nay hoặc một ngày cụ thể.
*   **Tham số đầu vào (Input params):**
    *   `date` (string, optional) - Định dạng YYYY-MM-DD (mặc định là ngày hôm nay).
*   **Kết quả trả về (Expected Output):**
    *   Tổng số đơn hàng được tạo.
    *   Số đơn hàng thành công (`completed`), chờ quét (`pending`), đã hủy (`cancelled`).
    *   Tổng doanh thu thực tế thu được trong ngày.
*   **Ví dụ câu nhắn Telegram sẽ trigger:**
    *   *"Hôm nay bán được bao nhiêu đơn rồi em?"*
    *   *"Báo cáo doanh số ngày hôm nay"*
    *   *"Doanh thu ngày 2026-07-04"*
*   **Độ ưu tiên:** 5/5

---

## 2. list_recent_customers
*   **Mô tả:** Lấy danh sách khách hàng mới đăng ký waitlist hoặc mua hàng gần đây.
*   **Tham số đầu vào (Input params):**
    *   `limit` (integer, optional) - Số lượng khách hàng muốn xem (mặc định là 5).
*   **Kết quả trả về (Expected Output):**
    *   Danh sách gồm: ID, Tên, Số điện thoại, Email, Zalo, Ngày đăng ký.
*   **Ví dụ câu nhắn Telegram sẽ trigger:**
    *   *"Ai mới đăng ký waitlist hôm nay thế?"*
    *   *"Cho anh xem danh sách 5 khách hàng mới nhất"*
    *   *"Có ai mới đăng ký tài khoản không?"*
*   **Độ ưu tiên:** 4.5/5

---

## 3. approve_order
*   **Mô tả:** Duyệt thủ công một đơn hàng từ trạng thái `pending` sang `completed` trên Telegram (kèm tự động gửi email xác nhận cho khách hàng).
*   **Tham số đầu vào (Input params):**
    *   `order_id` (integer, required) - ID của đơn hàng cần duyệt.
*   **Kết quả trả về (Expected Output):**
    *   Thông báo duyệt đơn thành công.
    *   Thông báo đã gửi mail xác nhận đơn hàng thành công qua Resend.
*   **Ví dụ câu nhắn Telegram sẽ trigger:**
    *   *"Duyệt giúp anh đơn hàng #12"*
    *   *"Kích hoạt đơn hàng số 5"*
    *   *"Duyệt đơn 8 thành công nhé"*
*   **Độ ưu tiên:** 4/5
