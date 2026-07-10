# Business Context — Hoàng DQ

## 1. Sản phẩm / dịch vụ chính

- Tên sản phẩm: AI Skill Builder — Biến Prompt thành AI Agent biết làm việc
- Dạng: Bộ Skills
- Đang ở giai đoạn: Chuẩn bị mở bán (chưa bán)
- Giá hiện tại: 490.000đ (giá mở bán), dự kiến 990.000đ sau giai đoạn đầu
- Link sản phẩm (nếu có): Chưa có (landing page đang hoàn thiện)

## 2. Khách hàng đang có (nếu có)

- Đã bán cho ai? Chưa có khách thật, đang kiểm chứng thị trường.
- Họ tìm đến qua kênh nào? Dự kiến Facebook cá nhân, cộng đồng AI/Marketing, website, Telegram và giới thiệu.
- Họ trả tiền vì điều gì? Muốn vượt qua giai đoạn chỉ chat với AI để xây AI Skill và AI Agent có thể tái sử dụng, chuẩn hóa quy trình và giảm phụ thuộc vào con người.

## 3. Tài sản đã có sau 19 ngày

Website chạy trên VPS với:

- **Express.js Backend (server.js)**: Hệ thống máy chủ chính quản lý API trên cổng 3000.
- **Cơ sở dữ liệu SQLite (brain.db)**: Lưu trữ toàn bộ dữ liệu đơn hàng (orders), khách hàng (customers), danh sách chờ (waitlist), và kho kiến thức (knowledge).
- **Module tự động quét và xác nhận thanh toán (SePay Webhook)**: Endpoint xử lý lịch sử giao dịch ngân hàng thời gian thực.
- **Module tự động gửi email chăm sóc (Resend API)**: Hệ thống tự động hóa gửi thư xác nhận kèm link hẹn lịch tư vấn 1-1.
- **MCP Server (mcp/index.js)**: Cung cấp 12 công cụ nghiệp vụ tích hợp cho Agent qua cổng 3001.
- **Agent Telegram (goClaw Integration)**: Chatbot tương tác thời gian thực với sếp trên điện thoại để nhận lệnh, duyệt bài và tự động báo cáo.
- **Hệ thống Scripts tự động hóa**: Bộ mã nguồn Python sinh bài viết (gen_caption.py), sinh ảnh DALL-E (gen_image.py/gen_video_scenes.py), tự động dựng phim gõ sub ghép nhạc (compile_video.py), và tự động đăng đa kênh (post_video.py/post_facebook.py).
- **Dịch vụ chạy ngầm 24/7 (Systemd Services)**: Quản lý trạng thái hoạt động liên tục của mywebsite và mcpserver trên VPS.

**Bộ skills đã có:**

12 Skills Chiến lược & Đóng cửa hàng (kp3-skill/):
- assp-avatar-builder (Nghiên cứu chân dung khách hàng mục tiêu)
- assp-money-model (Thiết lập mô hình tài chính & giá chào hàng)
- assp-brand-voice (Định hình giọng điệu thương hiệu Fox Advisor)
- assp-hero-mechanism (Thiết kế cơ chế độc bản DNA Kinh Doanh)
- assp-offer-architect (Xây dựng cấu trúc lời chào hàng giá trị cao)
- assp-hvco-creator (Thiết kế quà tặng mồi thu hút lead)
- assp-funnel-strategist (Thiết kế phễu bán hàng Landing Page)
- assp-vsl-scriptwriter (Biên soạn kịch bản video bán hàng VSL)
- assp-ad-copy-machine (Sản xuất hàng loạt bài viết quảng cáo Ads)
- assp-email-closer (Thiết lập phễu email marketing bám đuổi)
- assp-follow-up-engine (Chuỗi thông điệp re-engage khách hàng)
- assp-sales-call-script (Kịch bản gọi điện chốt đơn trực tiếp)

5 Skills Thực thi & Vận hành Tự động hóa (skill-hoang/):
- viet-bai-facebook-hoang (Viết bài organic chuẩn Brand Voice)
- tra-loi-faq-dna-kinh-doanh (Tự động trả lời câu hỏi thường gặp)
- tu-van-dna-kinh-doanh (Chatbot tư vấn lộ trình dịch vụ cá nhân hóa)
- tao-creative-fb (Tự động sản xuất bài viết + vẽ ảnh DALL-E đăng Facebook)
- tao-video-ai (Dựng video Reels/Shorts/TikTok tự động 100% qua Telegram)

Brand voice đã định hình trong brain.db: **Yes** — Toàn bộ dữ liệu bài đăng mẫu, dữ liệu tư vấn sản phẩm và tài liệu đào tạo lưu trong bảng knowledge của brain.db đã được chuẩn hóa và viết đồng điệu theo đúng Brand Voice của sếp Hoàng.

## 4. Mục tiêu kinh doanh 12 tháng tới

- Mô hình kinh doanh tôi muốn xây: Hybrid (Info Products + AI Skills + AI Agent + Dịch vụ tư vấn triển khai)
- Doanh thu mong muốn 12 tháng: 3 tỷ VNĐ
- 1 năm nữa tôi muốn vị trí của mình trên thị trường VN là:
  - Một trong những người tiên phong tại Việt Nam về AI Skill và AI Agent cho doanh nghiệp vừa và nhỏ.
  - Được biết đến với phương pháp chuyển kiến thức và quy trình thành hệ thống AI có thể vận hành.
  - Xây dựng hệ sinh thái sản phẩm số xoay quanh AI Skills, AI Agents và tự động hóa vận hành.
