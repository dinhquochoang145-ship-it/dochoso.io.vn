# Products — Danh sách sản phẩm/dịch vụ

Nguồn: bảng `products` trong `my brain DNA/brain.db` (export tại `vault-ready/products.md`). Đây có thể không phải danh sách mới nhất — nếu user nhắc tới sản phẩm/giá không có trong bảng này, coi là sản phẩm mới và hỏi lại chi tiết thay vì đoán.

| ID | Tên sản phẩm | Loại | Đơn giá | Mô tả | Kho hàng |
| --- | --- | --- | --- | --- | --- |
| 1 | Bản Đồ DNA Kinh Doanh | digital | 3.800.000đ | Báo cáo PDF 5 chương và Sổ tay DNA | N/A |
| 4 | Tư vấn 1 vấn đề nhỏ ngẫu nhiên | digital | 200.000đ | Tư vấn | N/A |
| 5 | Test | digital | 2.000đ | test | N/A |

## Cách refresh dữ liệu mới nhất

Nếu nghi ngờ bảng trên đã cũ (ví dụ user nhắc sản phẩm/giá lạ), chạy `scripts/read_brain.py products` để lấy trực tiếp từ `brain.db` thay vì đoán.
