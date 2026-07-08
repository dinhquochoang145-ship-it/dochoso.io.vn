# Cẩm Nang Sửa Lỗi Khi Gen Video/Ảnh Bằng AI

Dưới đây là các lỗi thường gặp trong quá trình vận hành Higgsfield/Kling và cách tháo gỡ thực chiến từ kinh nghiệm của Fox Advisor.

## 1. Lỗi biến đổi chi tiết sản phẩm hoặc sai logo/chữ
- **Triệu chứng**: AI sinh ra chữ bị lỗi chính tả (như "Bán Doy U" thay vì "Bản Đồ"), hoặc méo mó logo trên áo/hộp.
- **Nguyên nhân**: AI tạo sinh (generative AI) rất yếu trong việc vẽ lại ký tự text chính xác.
- **Giải pháp**:
  - Dùng **Kling 3.0** và upload 10-20 ảnh sản phẩm/thiết kế làm tham chiếu. Bật tính năng **Element Pin** để ghim chặt vị trí có logo/chữ.
  - Hoặc trong Prompt, bổ sung từ khóa loại trừ lỗi chính tả vào Negative Prompt (ví dụ: `misspelled text, wrong logo, warped letters`).
  - Đối với video quảng bá dịch vụ (digital product), tốt nhất là chừa trống phần hiển thị chữ, sau đó dùng tính năng **Text Overlay** của CapCut để gõ chữ thật đè lên.

## 2. Lỗi nhảy mặt nhân vật (Character Inconsistency)
- **Triệu chứng**: Cảnh 1 và Cảnh 4 trông như hai người hoàn toàn khác nhau.
- **Giải pháp**:
  - Luôn sử dụng ảnh Cảnh 1 làm ảnh gốc khóa nhân vật.
  - Trong Higgsfield, upload ảnh Cảnh 1 vào ô **GENERAL** (hoặc `+` trên thanh prompt) và ghi thêm trong prompt: `the same Vietnamese man from the reference image, with the same hairstyle and shirt`.
  - Hạn chế đổi kiểu tóc, quần áo quá đột ngột giữa các phân cảnh liên tiếp.

## 3. Lỗi sinh tay chân kỳ dị khi chuyển động (Warped Motion)
- **Triệu chứng**: Nhân vật tự dưng mọc thêm ngón tay, tay dài ra bất thường, hoặc cơ thể bị xoắn vặn khi chuyển động.
- **Giải pháp**:
  - Dùng cú máy **Orbit chậm/nhẹ** hoặc **Dolly in chậm** (vận tốc di chuyển camera cực thấp).
  - Tuyệt đối TRÁNH các cú máy quay 360 độ hoặc lia máy quá nhanh (Fast Pan/Quick Zoom) vì AI không có dữ liệu phía sau lưng hoặc hai bên của ảnh tĩnh gốc, nó sẽ tự bịa ra và gây lỗi.
  - Hạ thời lượng video xuống 5s thay vì 10s để giảm biên độ lỗi tích lũy của thuật toán AI.
