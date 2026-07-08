import os
import sys
from openai import OpenAI
from dotenv import load_dotenv

# Ensure UTF-8 output on Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Load env variables
script_dir = os.path.dirname(os.path.abspath(__file__))
skill_dir = os.path.dirname(script_dir)
# Load from skill directory (local test)
load_dotenv(os.path.join(skill_dir, '.env'))
# Load from repository root directory (VPS)
load_dotenv(os.path.join(skill_dir, '..', '..', '.env'))

# Define System Prompt enforcing Brand Voice and Rules
SYSTEM_PROMPT = """Bạn là Hoàng, chuyên gia tư vấn tại DNA Kinh Doanh (dochoso.io.vn). Bạn có phong cách viết bài đăng mạng xã hội (Facebook) độc nhất: chân thành, thẳng thắn, đồng cảm, đi vào bản chất.

Bạn BẮT BUỘC tuân thủ các nguyên tắc viết bài sau đây:

1. TÔNG GIỌNG & XƯNG HÔ:
- Giọng văn gần gũi như người thật nói chuyện, không khoa trương, không hoa mỹ.
- Xưng hô: "Mình - Bạn" hoặc "Tôi - Bạn".

2. CẤU TRÚC ĐOẠN & CÂU:
- Viết câu ngắn, một câu chỉ nên có một ý.
- Viết đoạn cực kỳ ngắn (chỉ 1 đến 3 câu mỗi đoạn).
- Bắt buộc xuống dòng sau mỗi ý quan trọng để tạo nhịp đọc chậm, thoáng, dễ đọc trên điện thoại.
- Emoji: Dùng cực kỳ hạn chế (tối đa 1-3 emoji toàn bài). Không dùng emoji trang trí đầu câu hay tiêu đề.

3. TỪ CẤM DÙNG (Tuyệt đối KHÔNG xuất hiện trong bài viết):
- synergy, leverage, optimize, ecosystem, growth hacking
- tối ưu hóa trải nghiệm, nâng tầm thương hiệu, giải pháp đột phá
- công thức thành công, bí mật triệu đô, hack tâm lý khách hàng
- tối ưu, tối ưu hóa, đột phá, giải pháp toàn diện

4. TỪ KHUYÊN DÙNG (Nên sử dụng tự nhiên):
- "Thật ra", "Bạn thử nghĩ xem", "Nếu bạn để ý", "Điều quan trọng là", "Vấn đề không nằm ở [A] - nó nằm ở [B]", "Đừng vội", "Hãy nhìn theo cách này", "Khách hàng không mua sản phẩm - họ mua kết quả", "Đừng đoán - hãy để dữ liệu nói".

5. MỞ BÀI:
- Bắt đầu bằng một câu hỏi trăn trở, câu chuyện thực tế hoặc một nghịch lý trong kinh doanh để thu hút nhịp đọc.

6. KẾT BÀI & CTA:
- Luôn kết thúc bằng từ "Cuối cùng..." kèm theo một đúc kết sâu sắc giúp người đọc tự nhìn nhận lại bản thân.
- Lời kêu gọi hành động (CTA) mềm mỏng, không chốt sale thô bạo.

7. THÔNG TIN SẢN PHẨM:
- Sản phẩm chủ lực: "Bản đồ DNA Kinh Doanh + Luận giải 1-1 (60 phút)" giá niêm yết 3.800.000 VNĐ.
- Cam kết: Tuyệt đối không cúng bái, không bán vật phẩm phong thủy giải hạn. "Bản thân con người chính là phong thủy mạnh nhất".
- Dịch lá số vận mệnh thành các chỉ số hành động thực chiến để tự làm chủ kinh doanh.
"""

def generate_caption(prompt, mode="organic"):
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("Error: OPENAI_API_KEY is not set in .env file.")
        sys.exit(1)
        
    model = os.getenv("OPENAI_TEXT_MODEL", "gpt-4o-mini")
    
    # Initialize OpenAI Client
    base_url = os.getenv("OPENAI_BASE_URL")
    if base_url:
        client = OpenAI(api_key=api_key, base_url=base_url)
    else:
        client = OpenAI(api_key=api_key)
        
    user_prompt = f"Hãy viết một bài đăng Facebook ở chế độ: {mode.upper()}.\n\nYêu cầu chủ đề/sản phẩm:\n{prompt}\n\nĐảm bảo bài viết khoảng 80-150 từ, chia câu đoạn cực ngắn, tuyệt đối không dùng từ cấm, dùng đúng các từ hay dùng."
    
    print(f"[*] Calling OpenAI Text API using model '{model}'...")
    try:
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.7,
            max_tokens=800
        )
        
        caption_text = response.choices[0].message.content.strip()
        print("[+] Caption generated successfully.")
        
        # Save caption locally for verification
        output_dir = os.path.join(skill_dir, "output")
        os.makedirs(output_dir, exist_ok=True)
        output_path = os.path.join(output_dir, f"generated_caption_{mode}.txt")
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(caption_text)
        print(f"[+] Caption saved to {output_path}")
        
        return caption_text
        
    except Exception as e:
        print(f"[-] Error generating caption: {e}")
        # Retry once
        print("[*] Retrying caption generation...")
        try:
            response = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.7,
                max_tokens=800
            )
            caption_text = response.choices[0].message.content.strip()
            print("[+] Caption generated successfully on retry.")
            return caption_text
        except Exception as retry_err:
            print(f"[-] Retry failed: {retry_err}")
            sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python gen_caption.py <prompt> [mode: organic/ads]")
        sys.exit(1)
        
    prompt_arg = sys.argv[1]
    mode_arg = sys.argv[2] if len(sys.argv) > 2 else "organic"
    caption = generate_caption(prompt_arg, mode_arg)
    print("\n--- GENERATED CAPTION ---")
    print(caption)
    print("-------------------------\n")
