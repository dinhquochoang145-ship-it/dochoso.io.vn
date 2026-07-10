<!-- 13-roadmap-asks.md — Lộ trình & 3 Câu hỏi chiến lược lớn -->

# Lộ Trình Triển Khai 90 Ngày & Câu Hỏi Chiến Lược (Roadmap & ASKS) — AI Skill OS

---

## 🗺️ LỘ TRÌNH 90 NGÀY TRIỂN KHAI (3 THÁNG x 3 MILESTONES)

### 📅 THÁNG 1: HOÀN THIỆN MVP & LAUNCH PHỄU CHUYỂN ĐỔI (Tuần 1 - Tuần 4)
* **Milestone 1 (Hạ tầng kỹ thuật):** Khởi chạy Backend Express.js trên VPS + cấu hình cơ sở dữ liệu SQLite (`brain.db`). Tích hợp thành công SePay Auto-banking (liên kết MB Bank `1450119888888`) và Resend API để kích hoạt email tự động.
* **Milestone 2 (Trang giao dịch & Sản phẩm):** Hoàn thiện Landing Page (`landing.html`) + checkout VietQR + Trang Cảm ơn bảo mật (ẩn link tải trực tiếp trên trình duyệt, chỉ cho phép nhận link Drive qua email đã xác thực).
* **Milestone 3 (Kiểm thử thực tế):** Thực hiện tự test giao dịch mua thật trị giá **2.000đ** thành công. Kiểm tra hệ thống tự động ghi nhận trạng thái đơn hàng là `completed` và Resend gửi email bàn giao link Drive thật tự động trong vòng 5 giây.

---

### 📅 THÁNG 2: ĐO LƯỜNG CHỈ SỐ ADS & LỌC LEAD B2B (Tuần 5 - Tuần 8)
* **Milestone 4 (Kích hoạt Traffic):** Khởi chạy quảng cáo Facebook/Google Ads sử dụng 3 góc viết copy từ file `08-ads-copy.md`. Đạt chỉ số mục tiêu: Chi phí mỗi Lead (CPL) dưới 40.000đ và Tỷ lệ điền form đăng ký đạt trên 25%.
* **Milestone 5 (Phễu lọc Lead DWY):** Nhúng biểu mẫu khảo sát AI Readiness Audit (15 câu hỏi tự chẩn đoán) vào phễu chăm sóc. Tự động phân loại lead ấm và lead nóng dựa trên điểm số của doanh nghiệp để chọn lọc khách hàng cho gói DWY (Done-With-You).
* **Milestone 6 (Kênh Organic Traffic):** Xây dựng hệ thống Organic Traffic bền vững bằng cách sản xuất 4 video demo thực tế (mỗi video 7 phút hướng dẫn đúc AI Skill) đăng lên YouTube và viết 4 bài blog SEO chuyên sâu định vị thương hiệu AI Skill OS.

---

### 📅 THÁNG 3: SCALE DOANH THU & CHUYỂN GIAO QUY TRÌNH SALES (Tuần 9 - Tuần 12)
* **Milestone 7 (Chốt hợp đồng DWY):** Kích hoạt cuộc gọi tư vấn trực tiếp 1-1 theo mô hình chẩn đoán y khoa (6 pha) trong file `12-sales-script.md`. Mục tiêu chốt thành công 2 hợp đồng Done-With-You đầu tiên trị giá từ 30M - 80M.
* **Milestone 8 (Đào tạo nhân sự Sales):** Đóng gói quy trình tư vấn thành SOP và trực tiếp đào tạo 1 nhân sự Sales chiến lược để thay thế Founder trực cuộc gọi chốt sales khi lượng lead đăng ký cuộc gọi tăng lên 10-15 cuộc/tuần.
* **Milestone 9 (Tối ưu biên lợi nhuận):** Đạt mốc doanh số mục tiêu tháng 250 triệu VNĐ (hoàn tất 1/12 chặng đường đạt 3 tỷ VNĐ/năm) và tối ưu hóa chi phí quảng cáo Ads để duy trì biên lợi nhuận ròng trên 45%.

---

## 🧠 3 ĐIỂM YẾU CHÍNH & CÂU HỎI CHIẾN LƯỢC CỤ THỂ (ASKS)

*Để hệ thống vận hành trơn tru và đạt mục tiêu 3 tỷ VNĐ mà không bị tắc nghẽn, sếp Hoàng cần trực tiếp giải quyết 3 điểm yếu lớn dưới đây:*

### ❓ ASK 1: Quy trình cập nhật chất lượng của 3 Starter Skills khi API của OpenAI/Claude thay đổi liên tục là gì?
* **Điểm yếu cụ thể (Weakness):** 3 Starter Skills (SOP, Content, Insight) là linh hồn của bộ mồi nhử 490k. Tuy nhiên, các hãng AI liên tục nâng cấp mô hình (ChatGPT cập nhật lên bản mới, Claude thay đổi cấu trúc system prompt). Nếu cấu trúc prompt mẫu bị lỗi thời hoặc không tương thích, khách hàng sử dụng sẽ bị lỗi kết quả, dẫn đến tỷ lệ đòi hoàn tiền (refund) tăng vọt vượt mốc an toàn 2%.
* **Yêu cầu hành động:** Sếp Hoàng cần thiết lập quy trình kiểm thử chất lượng (QA Checklist) định kỳ vào ngày 1 hàng tháng để chạy thử 3 Starter Skills trên các phiên bản mô hình AI mới nhất. Đồng thời, cần soạn sẵn tài liệu FAQ xử lý lỗi kỹ thuật thường gặp khi đúc Skill để nhân sự hỗ trợ khách hàng nhanh chóng.

### ❓ ASK 2: Làm sao để duy trì tệp 1.000 Leads ấm mỗi tháng bằng Organic Traffic để tránh phụ thuộc vào Ads?
* **Điểm yếu cụ thể (Weakness):** Ngân sách chạy ads dự kiến ban đầu là 40 triệu/tháng. Nếu chi phí quảng cáo của Facebook tăng cao (CPL tăng vọt từ 40k lên 80k do cạnh tranh), phễu sẽ lập tức bị âm dòng tiền đầu phễu và không có ngân sách tái đầu tư. Nếu phụ thuộc 100% vào Ads, hệ thống kinh doanh sẽ cực kỳ mong manh trước các đợt quét tài khoản quảng cáo.
* **Yêu cầu hành động:** Sếp Hoàng cần tuyển dụng hoặc chuyển giao cho một nhân sự Content Writer cứng phụ trách dựng các video demo thực tế (7 phút) đăng lên YouTube/TikTok hàng tuần. Mục tiêu là kéo tối thiểu 40% lượng lead (400 leads/tháng) đến từ nguồn tìm kiếm tự nhiên, giúp giảm chi phí ads tổng thể.

### ❓ ASK 3: Quy trình chuyển giao cuộc gọi tư vấn DWY (30M-80M) cho nhân sự Sales được thiết kế như thế nào?
* **Điểm yếu cụ thể (Weakness):** Gói DWY (Done-With-You) có giá trị cao, bắt buộc phải tư vấn sâu về tư duy quy trình hệ thống (SKILL Framework) thì khách hàng doanh nghiệp mới tin tưởng xuống tiền. Nhân sự Sales thông thường chỉ quen chốt đơn giá rẻ sẽ hoàn toàn bị ngợp và không thể phản biện hoặc giải đáp thắc mắc chuyên môn của các chủ doanh nghiệp trên cuộc gọi.
* **Yêu cầu hành động:** Sếp Hoàng cần trực tiếp ghi âm lại 5 cuộc gọi chốt sales thành công đầu tiên của mình để làm case study thực tế. Từ đó viết thành bộ cẩm nang phản biện câu từ chối (Objection Handling Manual) dành riêng cho sản phẩm AI Skill OS để đào tạo nhân sự sales chốt thay thế, tránh tắc nghẽn ở khâu Founder trực tiếp tư vấn.
