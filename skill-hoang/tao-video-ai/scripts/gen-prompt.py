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
load_dotenv(os.path.join(skill_dir, '.env'))
load_dotenv(os.path.join(skill_dir, '..', '..', '.env'))

SYSTEM_PROMPT = """Bạn là chuyên gia tư vấn hình ảnh và viết prompt video AI cho thương hiệu "DNA Kinh Doanh" (dochoso.io.vn).
Nhiệm vụ của bạn là chuyển đổi một chủ đề/topic hoặc nội dung bài viết thành kịch bản video ngắn (15-25 giây) tối ưu hóa cho Higgsfield và Kling AI.

Kịch bản phải tuân thủ nghiêm ngặt các quy chuẩn sau:
1. Độ dài: 5 phân cảnh (mỗi phân cảnh khoảng 4-5 giây).
2. Phong cách hình ảnh: Cinematic, premium consulting, luxury minimal, chân thực phong cách tài liệu, tông màu ấm áp vàng gold và xanh navy sẫm.
3. Nhân vật: Một nhà sáng lập/chủ doanh nghiệp người Việt tuổi khoảng 30 (Vietnamese entrepreneur).
4. Không có yếu tố tâm linh, phong thủy, cúng bái, tarot, cung hoàng đạo. Mọi thứ phải thực chiến, khoa học bằng dữ liệu.
5. Cú máy motion: Orbit chậm, dolly in chậm, pan slow, hoặc Key Zoom (làm chuyển động tĩnh trên CapCut). Tránh cú máy nhanh/mạnh làm méo hình.

Với mỗi phân cảnh, bạn phải xuất ra:
- Tên phân cảnh và mô tả hình ảnh bằng tiếng Việt (Visual Description).
- Text overlay xuất hiện trên video (tiếng Việt).
- Prompt sinh ảnh chi tiết bằng tiếng Anh (dành cho Higgsfield Soul 2.0).
- Prompt tạo chuyển động chi tiết bằng tiếng Anh (dành cho Kling/Wan 2.2).
- Ghi chú kỹ thuật (như có cần khóa nhân vật từ Cảnh 1 không, hay dùng mẹo CapCut zoom).

Cuối cùng, viết 1 câu Hook chính (3 giây đầu) và 1 bản Caption đăng Reels/TikTok (80-120 từ, chia câu đoạn cực ngắn, xưng hô Mình - Bạn, chuẩn Brand Voice của Fox Advisor).
"""

def generate_video_plan(topic):
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("Error: OPENAI_API_KEY is not set.")
        sys.exit(1)
        
    model = os.getenv("OPENAI_TEXT_MODEL", "gpt-4o-mini")
    base_url = os.getenv("OPENAI_BASE_URL")
    
    if base_url:
        client = OpenAI(api_key=api_key, base_url=base_url)
    else:
        client = OpenAI(api_key=api_key)
        
    user_prompt = f"Hãy tạo kịch bản video AI và bộ prompt chi tiết cho chủ đề: {topic}"
    
    print(f"[*] Calling LLM ({model}) to generate video plan & prompts...")
    try:
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.7,
            max_tokens=2000
        )
        
        plan_text = response.choices[0].message.content.strip()
        
        # Save output plan
        output_dir = os.path.join(skill_dir, "output")
        os.makedirs(output_dir, exist_ok=True)
        output_path = os.path.join(output_dir, "generated_video_plan.txt")
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(plan_text)
            
        print(f"[+] Video plan & prompts saved to {output_path}")
        return plan_text
        
    except Exception as e:
        print(f"[-] Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python gen-prompt.py <topic_or_post_content>")
        sys.exit(1)
        
    topic_arg = sys.argv[1]
    plan = generate_video_plan(topic_arg)
    print("\n--- GENERATED VIDEO PLAN ---")
    print(plan)
    print("----------------------------\n")
