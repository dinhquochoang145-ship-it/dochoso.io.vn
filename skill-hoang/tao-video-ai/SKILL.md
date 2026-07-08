---
name: tao-video-ai
description: Quy trình 7 bước tạo video quảng cáo AI (15-25s) bằng Higgsfield Stream 4.5/Soul 2.0 (sinh ảnh) và Kling 2.6/3.0 (animate) chuẩn giọng văn sếp Hoàng, kết hợp CapCut chỉnh sửa.
---

# Skill: tao-video-ai

Skill này hướng dẫn Agent và sếp Hoàng quy trình may đo sản xuất video AI ngắn (15-25 giây) cho thương hiệu **DNA Kinh Doanh** hoặc video tặng bạn bè, tối ưu chi phí credits và giữ vững nhận diện sản phẩm/nhân vật.

---

## ⚙️ Quy Trình Vận Hành 7 Bước (Workflow KP3)

### BƯỚC 1: LÊN Ý TƯỞNG & KỊCH BẢN (KHÔNG TỰ NGHĨ)
1. Xác định hướng đi:
   * **Hướng A**: KOC Fashion/Lifestyle/Digital Product (cho DNA Kinh Doanh).
   * **Hướng B**: Video fun/troll hoặc kỷ niệm tặng bạn bè.
2. Sử dụng ChatGPT/Claude sinh kịch bản gồm:
   * Storyboard 3-5 cảnh, mỗi cảnh 4-5 giây.
   * Prompt tiếng Anh chi tiết để gen ảnh Stream 4.5/Soul 2.0 từng cảnh.
   * Prompt motion tiếng Anh cho Kling/Wan 2.2 animate từng cảnh.
   * Hook 3 giây đầu (Text overlay) + Caption Reels/TikTok có hashtag.

### BƯỚC 2: TẠO ẢNH TRÊN HIGGSFIELD (STREAM 4.5 / SOUL 2.0)
1. Mở Higgsfield $\rightarrow$ Tab Image.
2. Cài đặt tỷ lệ **9:16** (dọc). Chọn chế độ **Paid** để gen nhanh hoặc tận dụng đặc quyền **Soul 2.0 (Unlimited)** để sinh ảnh không giới hạn.
3. **Giữ nhận diện nhân vật (Character Lock)**:
   * Lấy ảnh Cảnh 1 làm mốc.
   * Upload ảnh Cảnh 1 vào ô **GENERAL** (hoặc ô reference `+` của ô prompt) để khóa màu da, bối cảnh phòng và phong cách.
   * Nếu có logo/giao diện thật, upload ảnh mẫu vào reference để AI bám theo.

### BƯỚC 3: MẶC ĐỒ CHO MODEL (CONCEPT KOC FASHION)
*Nếu làm thời trang/KOC thử đồ:*
1. Upload 1 ảnh mặt model + 1 ảnh bộ đồ (outfit) vào ô reference.
2. Dùng prompt mẫu trong tài liệu `references/koc-format.md` để AI tiến hành "thử đồ" mà vẫn giữ nguyên mặt và thiết kế sản phẩm.

### BƯỚC 4: TẠO CHUYỂN ĐỘNG (KLING 2.6 / 3.0 HOẶC WAN 2.2)
1. Chuyển sang tab Video trên Higgsfield.
2. **Chọn Model**:
   * **Kling 2.6**: Tiết kiệm credits, đủ dùng cho KOC/Lifestyle.
   * **Kling 3.0**: Dùng tính năng *Element Pin* nếu sản phẩm có logo nhỏ/chữ để tránh bị biến dạng.
   * **Wan 2.2**: Dùng khi muốn test motion không giới hạn (nếu có gói Unlimited).
3. Tắt Audio (tiết kiệm credits). Chọn thời lượng 5 giây.
4. Sử dụng cú máy **Orbit chậm/nhẹ** (Slow gentle orbit) làm mặc định cho 90% trường hợp để tránh AI bị fail/sinh dị dạng.

### BƯỚC 5: MULTISHOT TRÊN KLING 3.0 (TÙY CHỌN)
Sử dụng tính năng Multishot (cắt 2-3 phân cảnh khác nhau trong 1 video 5 giây) để tiết kiệm credit và đỡ công edit. Xem chi tiết cú pháp tại `assets/camera-prompts.md`.

### BƯỚC 6: BIÊN TẬP VÀ EDIT TRÊN CAPCUT
1. Mở CapCut $\rightarrow$ Tạo project dọc 9:16.
2. Kéo thả các clip 5s đã render vào timeline.
3. **Mẹo tiết kiệm credits**: Với các cảnh tĩnh (như Cảnh 3 hiện report), chỉ cần dùng ảnh tĩnh gen từ Higgsfield $\rightarrow$ Kéo dài 2-3s $\rightarrow$ Chọn tab Animation $\rightarrow$ Chọn **"Zoom in slow"** hoặc **"Pan right"** để tạo chuyển động gia camera $\rightarrow$ Tiết kiệm 30 credits/cảnh.
4. Thêm Text overlay cho Hook 3 giây đầu, nhạc nền trending, auto-caption và export 1080p, 30fps.

---

## 📁 Cấu Trúc Tài Nguyên Skill
Tất cả tài nguyên đi kèm được lưu tại thư mục `skill-hoang/tao-video-ai/`:
* `assets/brand-style.md`: Hướng dẫn tông màu và phong cách tối giản sang trọng của DNA Kinh Doanh.
* `assets/camera-prompts.md`: Bộ 5 công thức cú máy thắng lớn.
* `assets/negative-prompt.txt`: Bộ từ khóa loại trừ lỗi tay chân, méo chữ mặc định.
* `references/koc-format.md`: Cấu trúc video KOC triệu view.
* `references/troubleshoot.md`: Cẩm nang sửa lỗi khi AI sinh sai sản phẩm hoặc biến dạng mặt.
