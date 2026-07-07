---
name: viet-bai-facebook-hoang
description: >
  Viết, viết lại, cải thiện hoặc lên ý tưởng cho bài đăng Facebook đúng Brand Voice
  cá nhân của Hoàng (DNA Kinh Doanh), dựa trên dữ liệu thật trong Brain.db (giọng văn,
  cách xưng hô, cách kể chuyện, từ nên/tránh dùng, CTA, USP, triết lý kinh doanh).
  LUÔN dùng skill này bất cứ khi nào user nhắc tới việc viết nội dung để đăng lên
  Facebook (trang cá nhân hoặc fanpage), kể cả khi họ không dùng đúng từ "Facebook" —
  ví dụ khi họ nói "viết bài", "viết post", "viết status", "viết content" và ngữ cảnh
  rõ ràng là đăng Facebook. Các câu thường gặp kích hoạt skill: "viết bài Facebook",
  "viết post Facebook", "viết status", "viết content Facebook", "viết bài bán hàng
  trên Facebook", "viết bài chia sẻ", "viết bài chia sẻ kinh nghiệm", "viết lại bài
  Facebook này", "rewrite bài Facebook", "viết theo Brand Voice của tôi", "viết theo
  giọng văn của tôi", "chuyển ý tưởng này thành bài Facebook", "giúp tôi viết bài về
  sản phẩm X giá Y" (khi ngữ cảnh là đăng Facebook). KHÔNG dùng skill này cho nội dung
  thuộc nền tảng hoặc định dạng khác — kể cả khi user dùng các từ nghe giống nhau như
  "viết caption" hay "viết bài": email/email sequence, landing page, kịch bản quảng
  cáo Google/Facebook Ads, bài đăng LinkedIn, caption/kịch bản Instagram, kịch bản
  TikTok/video, hoặc copy cho website. Những loại nội dung đó có văn phong và cấu trúc
  khác — nếu user yêu cầu các loại này (kể cả khi họ nhắc "theo giọng văn của tôi"),
  viết trực tiếp theo đúng định dạng đó, không áp dụng quy trình của skill này.
---

# Viết bài Facebook theo Brand Voice của Hoàng

## Vì sao skill này tồn tại

Bài Facebook của Hoàng phải đọc lên như chính Hoàng đang gõ, không phải như AI viết hộ. Điều đó chỉ đạt được khi bám sát dữ liệu thật trong Brain.db (giọng văn, nguyên tắc viết, USP, cách xử lý từ chối) thay vì viết theo giọng "content mẫu" chung chung. Vì vậy quy tắc số 1: **đọc `references/` trước, viết sau.**

## Instructions

1. Trước khi viết bất kỳ chữ nào, đọc các file trong `references/`:
   - `references/brand-voice.md` — giọng văn, xưng hô, từ nên/tránh dùng, cách mở/kết bài.
   - `references/writing-dna.md` — hệ thống 9 tầng tư duy (Belief → ... → Editing DNA) quyết định cách suy nghĩ trước khi viết, không chỉ là văn phong.
   - `references/business.md` — định vị, USP, chiến lược giá, kịch bản xử lý từ chối, đối thủ.
   - `references/products.md` — danh sách sản phẩm/giá đã biết.
   Nếu các file này thiếu dữ liệu cần thiết (ví dụ sản phẩm mới không có trong `products.md`), có thể chạy `scripts/read_brain.py <table>` để lấy trực tiếp từ `brain.db` — nhưng ưu tiên đọc file Markdown trước vì nhanh hơn và không phụ thuộc Python.
2. Xác định user đang cần loại bài nào trong 3 loại (xem Workflow bên dưới) rồi chọn đúng template trong `assets/`.
3. Nếu thiếu thông tin để viết (không rõ sản phẩm, đối tượng, mục tiêu, hoặc hành động mong muốn), hỏi lại trước khi viết — đừng đoán rồi viết một bài chung chung. Xem phần "Khi thiếu thông tin".
4. Viết theo template đã chọn, áp dụng Writing DNA (câu ngắn, đoạn 1-3 câu, xuống dòng nhiều) và tránh toàn bộ từ trong danh sách cấm.
5. Trước khi trả kết quả, chạy nhanh qua `assets/brand-voice-checklist.md` và `assets/pre-output-checklist.md`. Nếu sai từ 3-4 điểm trở lên, viết lại đoạn liên quan trước khi gửi.

## Workflow

### Nhánh 1 — Viết bài bán sản phẩm (có tên sản phẩm/dịch vụ, thường kèm giá)

Trigger ví dụ: "Viết bài Facebook về sản phẩm A giá 500.000đ".

1. Đối chiếu sản phẩm với `references/products.md`. Nếu không có, hỏi lại: mô tả sản phẩm, giá, đối tượng khách hàng.
2. Đọc `references/business.md` để lấy USP và cách xử lý từ chối liên quan (nếu sản phẩm khớp với DNA Kinh Doanh).
3. Dùng `assets/facebook-post-template.md` (Hook → Story → Value → CTA).
4. Chọn hook phù hợp trong `assets/hook-library.md` (ưu tiên "Câu hỏi trực diện" hoặc "Nghịch lý" cho bài bán hàng).

### Nhánh 2 — Viết bài chia sẻ kinh nghiệm

Trigger ví dụ: "Viết bài Facebook chia sẻ kinh nghiệm".

1. Nếu user chưa nêu chủ đề/câu chuyện cụ thể, hỏi lại (xem "Khi thiếu thông tin") — bài chia sẻ mà không có câu chuyện cụ thể sẽ đọc rất chung chung.
2. Dùng `assets/facebook-storytelling-template.md` (Hook → Story → Insight → CTA).
3. Đây là bài "cho đi" giá trị — không gắn CTA bán hàng cứng trừ khi user yêu cầu rõ.

### Nhánh 3 — Rewrite bài Facebook có sẵn

Trigger ví dụ: "Viết lại bài Facebook này theo giọng văn của tôi".

1. Yêu cầu/đọc bài gốc nếu chưa có trong context.
2. Làm theo quy trình 5 bước trong `assets/facebook-rewrite-template.md` (Phân tích → Đối chiếu Brand Voice → Viết lại → Tự kiểm tra → Trả kết quả).
3. Giữ nguyên thông tin/sự kiện gốc, chỉ đổi giọng văn và cấu trúc — không tự thêm chi tiết không có trong bài gốc hoặc trong `references/`.

### Khi thiếu thông tin (áp dụng cho cả 3 nhánh)

Hỏi cụ thể, không hỏi chung chung "bạn muốn viết gì":

- Sản phẩm hoặc dịch vụ là gì?
- Đối tượng khách hàng là ai?
- Mục tiêu của bài viết là gì? (bán hàng / chia sẻ kinh nghiệm / xây dựng thương hiệu...)
- Muốn người đọc làm gì sau khi đọc xong?

Chỉ hỏi những câu còn thiếu — nếu user đã cung cấp đủ trong yêu cầu ban đầu, viết luôn, đừng hỏi lại những gì đã biết.

## Constraints — Không được

- Không tự đổi Brand Voice đã định nghĩa trong `references/brand-voice.md` (giọng văn, xưng hô) trừ khi user yêu cầu rõ.
- Không dùng từ trong danh sách cấm ở `references/brand-voice.md` (synergy, tối ưu hóa trải nghiệm, giải pháp đột phá, bí mật triệu đô...).
- Không viết bài quá dài hoặc đoạn quá 3 câu — phá nhịp đọc đặc trưng của giọng này.
- Không dùng nhiều emoji — Brand Voice này thiên về chữ, không thiên về hình thức trang trí.
- Không tự đổi CTA nếu user đã yêu cầu CTA cụ thể (ví dụ "kêu gọi inbox", "kêu gọi để lại số điện thoại").
- Không thêm thông tin, số liệu, hoặc cam kết không có nguồn trong `references/` hoặc trong yêu cầu của user — đặc biệt giá và USP, phải khớp với `references/products.md` và `references/business.md`.
- Không viết chắc chắn tuyệt đối khi thiếu dữ liệu (theo Decision DNA) — ví dụ không viết "chắc chắn bạn sẽ thành công".

## Examples

**Ví dụ 1 — Bán hàng có giá cụ thể**
Input: "Viết bài Facebook về Bản Đồ DNA Kinh Doanh giá 3.800.000đ"
→ Đọc `products.md` xác nhận sản phẩm tồn tại, đọc `business.md` lấy USP (không bán vật phẩm phong thủy, chuyển hóa học thuật thành chỉ số hành động), dùng `facebook-post-template.md`, hook kiểu "Câu hỏi trực diện" hoặc "Nghịch lý", kết bằng CTA mềm.

**Ví dụ 2 — Chia sẻ kinh nghiệm, thiếu thông tin**
Input: "Viết bài Facebook chia sẻ kinh nghiệm"
→ Chưa có chủ đề/câu chuyện cụ thể. Hỏi lại: "Bạn muốn chia sẻ kinh nghiệm về chuyện gì? Có câu chuyện/tình huống cụ thể nào không? Mục tiêu bài là xây dựng niềm tin hay dẫn tới sản phẩm nào không?"

**Ví dụ 3 — Rewrite**
Input: user dán một đoạn văn cũ + "viết lại bài Facebook này theo giọng văn của tôi"
→ Phân tích Big Idea của bài gốc, đối chiếu `brand-voice.md`, viết lại theo `facebook-rewrite-template.md`, chạy `pre-output-checklist.md` trước khi trả.

**Ví dụ 4 — Storytelling có chủ đề rõ**
Input: "Viết bài Facebook kể chuyện một khách hàng từng nghĩ xem tuổi hợp đối tác quan trọng hơn năng lực, sau đó nhận ra sai lầm"
→ Có đủ thông tin, dùng `facebook-storytelling-template.md` ngay, không cần hỏi lại. Tham khảo `post.txt` phong cách viết thật để giữ đúng nhịp câu.

**Ví dụ 5 — Rút gọn bài đã có**
Input: "Bài này hơi dài, rút gọn lại giúp tôi nhưng vẫn giữ giọng văn của tôi"
→ Áp dụng Editing DNA (mục "Nếu bài quá dài" trong `writing-dna.md`): cắt câu trùng ý, từ hoa mỹ, đoạn dẫn dài — không cắt mất Hook, Story cốt lõi, hoặc CTA.

## Troubleshooting

- **Bài đọc "giống AI"** → chạy lại `pre-output-checklist.md` mục 16 và 20, thêm chi tiết đời thường/câu hỏi, cắt câu quá trơn tru.
- **Thiếu CTA hoặc CTA quá lộ liễu** → xem lại cách kết bài trong `brand-voice.md`, đổi sang CTA mềm trừ khi user yêu cầu CTA cứng.
- **Brain.db/references không có dữ liệu cho sản phẩm/chủ đề mới** → đừng bịa, hỏi lại user hoặc chạy `scripts/read_brain.py` để kiểm tra dữ liệu mới nhất trong `brain.db`.
- **User nói bài "không giống giọng của tôi"** → hỏi cụ thể điểm nào chưa đúng (từ ngữ, cấu trúc, độ dài câu), đối chiếu lại `brand-voice-checklist.md`, không đoán chung chung rồi viết lại toàn bộ.
- **Yêu cầu nội dung không phải Facebook** (email, landing page, quảng cáo, LinkedIn, TikTok script) → không áp dụng quy trình/template của skill này, viết trực tiếp theo yêu cầu vì văn phong và cấu trúc khác nhau.
