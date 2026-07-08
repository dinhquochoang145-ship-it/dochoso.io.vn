# Quy trình: Rewrite bài Facebook theo Brand Voice

Dùng khi user đưa một bài viết có sẵn (của họ hoặc từ nguồn khác) và muốn "viết lại theo giọng văn của tôi" / "rewrite bài này".

Đây không phải điền vào một template cố định — là quy trình phân tích rồi viết lại.

## Bước 1 — Phân tích bài gốc

Trước khi sửa, xác định:
- Big Idea của bài là gì? (giữ nguyên, không đổi ý chính trừ khi user yêu cầu)
- Cấu trúc hiện tại: có Hook rõ không? Có Story không? Có CTA không?
- Đoạn nào đang "giống AI" (câu dài, trơn tru quá, dùng từ corporate)?
- Đoạn nào đang thiếu (không có ví dụ thật, không có câu hỏi, kết bài yếu)?

## Bước 2 — Đối chiếu với Brand Voice

Đọc `references/brand-voice.md` và `references/writing-dna.md`, xác định:
- Câu/từ nào cần đổi vì nằm trong danh sách "từ cấm dùng".
- Đoạn nào cần cắt ngắn (quá 3 câu/đoạn).
- Chỗ nào cần thêm cụm từ đặc trưng ("Thật ra", "Bạn thử nghĩ xem"...) để nghe đúng giọng.
- Mở bài/kết bài có cần đổi kiểu để khớp 7 kiểu hook hoặc cách kết trong brand-voice.md không.

## Bước 3 — Viết lại

- Giữ nguyên thông tin/sự kiện gốc (không bịa thêm chi tiết không có trong bài gốc hoặc trong references/).
- Viết lại theo nhịp câu ngắn, đoạn 1-3 câu, xuống dòng nhiều.
- Đổi giọng "dạy đời"/"quảng cáo" thành giọng "Theo tôi, bạn nên thử..." (Decision DNA).
- Nếu bài gốc có CTA cụ thể do user chỉ định giữ nguyên, không tự đổi sang CTA mềm.

## Bước 4 — Tự kiểm tra

Chạy qua `assets/pre-output-checklist.md` trước khi trả kết quả — đặc biệt câu hỏi số 16 "Có câu nào nghe như AI không?" và số 20 "Đọc lên có giống người thật đang nói chuyện không?".

## Bước 5 — Trả kết quả

Trả bài đã viết lại. Nếu có thay đổi lớn về ý (không chỉ về giọng văn), nêu ngắn gọn 1-2 điểm đã điều chỉnh để user biết, ví dụ: "Mình đã bỏ đoạn liệt kê tính năng và chuyển thành ví dụ cụ thể theo đúng Product DNA."
