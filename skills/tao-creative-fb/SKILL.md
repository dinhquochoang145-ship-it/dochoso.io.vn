---
name: tao-creative-fb
description: Tạo cả HÌNH ẢNH, VĂN BẢN và VIDEO bài viết chuẩn Brand Voice của sếp Hoàng. Mode 1 (Content Free): Tự động tạo 3 ý tưởng -> sếp chọn 1 -> viết caption + gen ảnh -> đăng. Mode 2 (Creative Ads): Tạo 3 bộ ảnh + ad copy theo 3 angle. Mode 3 (Video Creator): Lên kịch bản video AI -> sếp gen ảnh/video trên Higgsfield/Kling -> lưu file video -> tự động đăng chéo Reels/Shorts/TikTok.
---

# Skill: tao-creative-fb

Skill này giúp sếp Hoàng sản xuất hàng loạt hoặc tự động hóa đăng bài viết (bao gồm cả **Hình ảnh**, **Văn bản**, và **Video**) lên Facebook Business Page, Reels, YouTube Shorts, và TikTok.

---

## ⚠️ QUY TẮC THỰC THI BẮT BUỘC CHO AGENT:
- Bạn **KHÔNG ĐƯỢC PHÉP** tự ý đọc file `.env` hoặc tự gọi API để sinh nội dung.
- Bạn **BẮT BUỘC** phải sử dụng các công cụ MCP chuyên dụng (`mcp_biz__generate_creative`, `mcp_biz__generate_video_creative`, `mcp_biz__post_to_facebook`, và `mcp_biz__post_video_to_socials`) để thực hiện sinh nội dung và đăng bài. Tuyệt đối không dùng công cụ `mcp_biz__save_post` trừ khi được yêu cầu lưu kiến thức vào database.

---

## ⚙️ Các Công Cụ MCP Để Chạy Từng Chế Độ

### 🌀 Hướng dẫn chạy Mode 1 (Content Free):
1. **Bước A (Sinh ý tưởng):** Bạn tự nghĩ ra 3 ý tưởng dựa trên Brand Voice, gửi sếp chọn.
2. **Bước B (Sinh Caption & Sinh Ảnh):**
   - Khi sếp chọn số ý tưởng, hãy gọi công cụ MCP **`mcp_biz__generate_creative`** với các đối số:
     - `topic`: Tiêu đề/chủ đề của ý tưởng đã chọn.
     - `image_prompt`: Mô tả chi tiết bằng tiếng Anh của ảnh chụp thực tế người Việt tương ứng với ý tưởng.
3. **Bước C (Preview):** Hiển thị nội dung caption trả về từ công cụ và báo ảnh đã được vẽ xong để sếp duyệt.
4. **Bước D (Đăng bài):** Khi sếp gõ `OK`, gọi công cụ MCP **`mcp_biz__post_to_facebook`** để đăng bài lên Facebook Page thật.

### 🎯 Hướng dẫn chạy Mode 2 (Creative Ads):
1. Nhận thông tin sản phẩm và gọi công cụ **`mcp_biz__generate_creative`** cho từng bộ Creative Ads để lưu ảnh và lấy bài viết tương ứng.

### 🎥 Hướng dẫn chạy Mode 3 (Video Creator):
1. **Bước A (Lên kịch bản & Prompts):** Khi sếp yêu cầu "video" hoặc "tạo video", gọi công cụ MCP **`mcp_biz__generate_video_creative`** với đối số:
   - `topic`: Chủ đề của video (ví dụ: Bản Đồ DNA Kinh Doanh, Đêm mất ngủ...).
2. **Bước B (Duyệt kịch bản):** Hiển thị kịch bản 5 cảnh và bộ prompts cho Higgsfield/Kling vừa tạo ra để sếp duyệt.
3. **Bước C (Hướng dẫn sếp gen):** Hướng dẫn sếp copy-paste prompts để tự sinh ảnh trên Higgsfield (Soul 2.0) và quay video trên Kling/Wan 2.2.
4. **Bước D (Đăng chéo video):** Khi sếp đã tạo xong video hoàn chỉnh và lưu vào thư mục `skill-hoang/tao-video-ai/output/final_video.mp4`, sếp gõ `OK` hoặc `Đăng video`. Gọi công cụ MCP **`mcp_biz__post_video_to_socials`** để tự động đăng lên Reels, TikTok, và YouTube Shorts.


---

## 🌀 Chế Độ Hoạt Động (3 Modes)

### MODE 1: CONTENT FREE (Auto-post Organic Page mỗi sáng)
- **Triggers**: "tạo content cho ngày mai", "gen bài Page", "content free", "content organic", "viết bài page".
- **Quy trình hoạt động**:
  1. **Bước A (Lên ý tưởng):** Khi được kích hoạt, Agent sẽ đọc dữ liệu từ `brain.db` hoặc tài liệu định vị sản phẩm Bản đồ DNA Kinh Doanh và tự động tạo ra **3 ý tưởng bài đăng organic** (tiêu đề + angle ngắn). Gửi danh sách 3 ý tưởng này cho sếp Hoàng và đợi sếp reply chọn số `1`, `2`, hoặc `3`.
  2. **Bước B (Sản xuất nội dung):** Khi sếp chọn số, Agent sẽ gọi:
     - Script `scripts/gen_image.py` để sinh 1 ảnh vuông (1024x1024) minh họa trực quan chủ đề.
     - Script `scripts/gen_caption.py` để sinh bài viết dài 80-150 từ theo chuẩn giọng văn của sếp Hoàng.
  3. **Bước C (Duyệt nội dung):** Agent gửi preview cả hình ảnh và bài viết qua Telegram để sếp Hoàng xem trước. Chờ sếp phản hồi `OK` hoặc `Đổi`.
  4. **Bước D (Đăng bài):** Khi sếp phản hồi `OK`, Agent sẽ gọi `scripts/post_facebook.py` để đăng cả hình ảnh và bài viết đó lên Page Facebook (nếu `DRY_RUN=false`).

---

### MODE 2: CREATIVE ADS (Sinh bộ ảnh + ad copy thủ công)
- **Triggers**: "tạo creative ads", "gen ads", "cần creative cho chiến dịch", "ads cho sản phẩm X".
- **Quy trình hoạt động**:
  1. Agent hỏi sếp các thông tin cần thiết: Tên sản phẩm/dịch vụ, mức giá, USP (điểm khác biệt nổi bật) và đối tượng mục tiêu.
  2. Agent gọi các script `gen_image.py` và `gen_caption.py` để sinh ra **3 bộ Creative độc lập** (không tự động đăng lên Page):
     - **Bộ 1 (Pain Point):** Đánh thẳng vào nỗi đau, sự thử sai mất tiền tỷ của chủ doanh nghiệp.
     - **Bộ 2 (Solution):** Nêu bật giải pháp Bản đồ DNA Kinh Doanh hoặc AI Agent vận hành giúp sếp giải phóng sức lao động.
     - **Bộ 3 (Social Proof):** Sử dụng các dẫn chứng, sự thay đổi tích cực sau khi dùng dịch vụ.
  3. Mỗi bộ bao gồm:
     - 1 hình ảnh ads chất lượng cao.
     - 1 đoạn ad copy chuẩn Brand Voice kèm lời kêu gọi hành động (CTA) hướng về Landing Page/Inbox.
  4. Tải và lưu các ảnh vào thư mục `output/`, in nội dung copy ra màn hình chat Telegram để sếp copy-paste vào Ads Manager.

---

### MODE 3: VIDEO CREATOR (Gen kịch bản & publish video)
- **Triggers**: "video", "tạo video", "quay video", "làm video", "gen video".
- **Quy trình hoạt động**:
  1. Agent hỏi sếp chủ đề hoặc tự động chọn 1 chủ đề từ Content Plan tuần này.
  2. Agent gọi công cụ MCP `generate_video_creative` $\rightarrow$ sinh kịch bản và prompts chi tiết (lưu tại `skill-hoang/tao-video-ai/output/generated_video_plan.txt`).
  3. Gửi bản preview kịch bản cho sếp Hoàng duyệt qua Telegram và hướng dẫn sếp cách gen ảnh/video trên Higgsfield/Kling.
  4. Khi sếp gõ `OK` hoặc `Đăng video` (sau khi sếp đã ghép và xuất video hoàn chỉnh lưu vào `skill-hoang/tao-video-ai/output/final_video.mp4`):
     - Agent gọi công cụ MCP `post_video_to_socials`.
     - Tải video lên Facebook Reels Page, đăng lên YouTube Shorts, và hướng dẫn đăng TikTok.
     - Trả lại liên kết hoặc kết quả xuất bản.


---

## ✍️ Brand Voice & Quy Tắc Copywriting Bắt Buộc

Mọi bài viết sinh ra từ skill này **BẮT BUỘC** phải tuân thủ nghiêm ngặt các quy tắc sau:
1. **Xưng hô**: Nhất quán dùng **Tôi - Bạn** hoặc **Mình - Bạn**. Gọi sếp là anh Hoàng/sếp Hoàng khi trao đổi trong chat hệ thống, nhưng xưng hô trong bài đăng luôn là Mình/Tôi và Bạn.
2. **Cấu trúc đoạn**: Đoạn văn cực kỳ ngắn, mỗi đoạn chỉ 1-3 câu. Bắt buộc xuống dòng sau mỗi ý quan trọng để tạo nhịp đọc chậm, dễ nhìn.
3. **Từ cấm dùng**: Tuyệt đối không dùng các từ sáo rỗng AI thường dùng: *tối ưu hóa, đột phá, giải pháp đột phá, công thức thành công, nâng tầm thương hiệu, đột phá doanh thu, hệ sinh thái, hack tâm lý*.
4. **Từ khuyên dùng**: *Thật ra, Bạn thử nghĩ xem, Nếu bạn để ý, Điều quan trọng là, Vấn đề không nằm ở [A] - nó nằm ở [B], Đừng vội, Hãy nhìn theo cách này, Cuối cùng*.
5. **Emoji**: Dùng cực kỳ hạn chế (tối đa 1-3 emoji mỗi bài). Không bao giờ dùng emoji để trang trí đầu câu hay làm tiêu đề hoa mỹ.
6. **Mở bài**: Bắt đầu bằng một câu hỏi trăn trở, một câu chuyện thực tế hoặc một nghịch lý kinh doanh.
7. **Kết bài**: Luôn kết thúc bằng chữ **"Cuối cùng..."** để tạo chiều sâu tự chiêm nghiệm, CTA nhẹ nhàng, không chốt sale dồn dập.
