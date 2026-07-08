# Verified Camera Motion Prompts for Kling & Wan 2.2

Dưới đây là 5 công thức cú máy chuyển động (motion prompts) ổn định nhất đã được kiểm chứng qua workshop KP3 giúp tránh lỗi biến dạng hình ảnh của AI.

## 1. Orbit Chậm (Mặc định cho 90% trường hợp)
- **Prompt**:
  ```text
  A slow gentle orbit shot, camera moves smoothly around the subject, keeping the model still and elegant, soft warm light, cinematic vibe, luxury feel.
  ```
- **Ý nghĩa**: Camera quay vòng tròn nhẹ quanh nhân vật. An toàn nhất vì AI không phải tự bịa ra quá nhiều chi tiết ở góc khuất.

## 2. Dolly In Nhẹ (Zoom cơ học chậm)
- **Prompt**:
  ```text
  A slow gentle dolly-in shot, camera moves smoothly forward toward the subject, gradual focus shift, cinematic slow motion, natural lighting.
  ```
- **Ý nghĩa**: Tiến máy ảnh lại gần. Phù hợp để diễn tả sự tập trung, đi sâu vào chi tiết báo cáo hoặc gương mặt suy tư.

## 3. Pan Slow (Quay máy sang bên)
- **Prompt**:
  ```text
  A slow gentle pan shot from left to right, revealing the details on the desk, smooth camera slide, realistic motion blur, cinematic lighting.
  ```
- **Ý nghĩa**: Máy ảnh giữ nguyên vị trí, quay góc từ trái sang phải. Rất tốt cho các cảnh đặc tả bàn làm việc, sổ tay, hoặc thiết bị.

## 4. Key Zoom (Làm giả chuyển động trong CapCut)
- **Cách làm**:
  - Không cần sinh video trên Higgsfield.
  - Sử dụng ảnh tĩnh $\rightarrow$ Đưa vào CapCut $\rightarrow$ Tab Animation $\rightarrow$ Chọn hiệu ứng **"Zoom In Slow"** hoặc **"Pan Right"** kéo dài 3 giây.
- **Ý nghĩa**: Tiết kiệm 100% credits cho phân cảnh tĩnh mà vẫn tạo ra cảm giác chuyển động mượt mà.

## 5. Multishot Custom (Gen nhiều cảnh trong 1 prompt trên Kling 3.0)
- **Prompt**:
  ```text
  Scene 1 (0-2.5s): close-up of model's face looking down at the notebook, subtle eye movement, warm light.
  Scene 2 (2.5-5s): wider full-body shot, slow orbit camera move around model, showing the office and desk clearly.
  Style: photorealistic, cinematic, luxury consulting vibe.
  ```
- **Ý nghĩa**: Cắt đôi cảnh trong 1 lần gen 5s $\rightarrow$ Tạo nhịp dựng nhanh, chuyên nghiệp và tiết kiệm credits.
