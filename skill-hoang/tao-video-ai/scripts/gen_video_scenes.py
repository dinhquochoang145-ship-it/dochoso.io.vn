import os
import sys
import json
import requests
import base64
from openai import OpenAI
from dotenv import load_dotenv

# Ensure UTF-8 output
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

script_dir = os.path.dirname(os.path.abspath(__file__))
skill_dir = os.path.dirname(script_dir)
load_dotenv(os.path.join(skill_dir, '.env'))
load_dotenv(os.path.join(skill_dir, '..', '..', '.env'))

def generate_scenes():
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("[-] Lỗi: OPENAI_API_KEY chưa được cấu hình.")
        sys.exit(1)

    plan_path = os.path.join(skill_dir, "output", "generated_video_plan.txt")
    if not os.path.exists(plan_path):
        print(f"[-] Lỗi: Không tìm thấy file kịch bản tại {plan_path}")
        sys.exit(1)

    print("[*] Đang đọc file kịch bản để trích xuất prompt sinh ảnh...")
    with open(plan_path, "r", encoding="utf-8") as f:
        plan_text = f.read()

    # Use LLM to cleanly parse the 5 image prompts to avoid regex parsing failures
    model = os.getenv("OPENAI_TEXT_MODEL", "gpt-4o-mini")
    base_url = os.getenv("OPENAI_BASE_URL")
    
    if base_url:
        client = OpenAI(api_key=api_key, base_url=base_url)
    else:
        client = OpenAI(api_key=api_key)

    parser_prompt = f"""Đọc kịch bản video AI sau và trích xuất đúng 5 đoạn Prompt tiếng Anh dùng để sinh ảnh (Higgsfield/DALL-E Prompt) cho 5 phân cảnh.
Trả về kết quả dưới dạng một mảng JSON chứa đúng 5 chuỗi (5 strings), không thêm bất kỳ văn bản giải thích nào khác.

Ví dụ định dạng trả về:
[
  "A realistic photo of...",
  "An entrepreneur looking at...",
  "Close up of...",
  "Vietnamese founder writing on...",
  "Confident businessman smiling..."
]

Kịch bản cần trích xuất:
{plan_text}
"""

    print(f"[*] Đang yêu cầu LLM trích xuất 5 prompt sinh ảnh...")
    try:
        response = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": parser_prompt}],
            temperature=0.1,
            max_tokens=1000
        )
        
        raw_json = response.choices[0].message.content.strip()
        # Clean markdown code blocks if any
        if raw_json.startswith("```json"):
            raw_json = raw_json[7:]
        if raw_json.endswith("```"):
            raw_json = raw_json[:-3]
        raw_json = raw_json.strip()
        
        prompts = json.loads(raw_json)
        if len(prompts) < 5:
            raise ValueError(f"Chỉ trích xuất được {len(prompts)} prompts, cần đủ 5 prompts.")
            
        print("[+] Trích xuất prompt thành công! Đang sinh 5 ảnh bằng DALL-E...")
        
        input_dir = os.path.join(skill_dir, "input")
        os.makedirs(input_dir, exist_ok=True)
        
        image_model = os.getenv("OPENAI_IMAGE_MODEL", "dall-e-3")
        
        print("[+] Trích xuất prompt thành công! Đang sinh 5 ảnh song song bằng DALL-E...")
        
        input_dir = os.path.join(skill_dir, "input")
        os.makedirs(input_dir, exist_ok=True)
        
        image_model = os.getenv("OPENAI_IMAGE_MODEL", "dall-e-3")
        
        from concurrent.futures import ThreadPoolExecutor
        
        def download_single_scene(index_and_prompt):
            i, prompt = index_and_prompt
            filename = f"scene{i}.png"
            output_path = os.path.join(input_dir, filename)
            refined_prompt = prompt + ", vertical 9:16 aspect ratio, portrait orientation, photorealistic, cinematic lighting"
            
            print(f"[*] Đang sinh Cảnh {i}...")
            try:
                img_response = client.images.generate(
                    model=image_model,
                    prompt=refined_prompt,
                    size="1024x1792",
                    quality="standard",
                    n=1,
                )
                data = img_response.data[0]
                if getattr(data, 'url', None):
                    img_data = requests.get(data.url, timeout=10).content
                    with open(output_path, 'wb') as handler:
                        handler.write(img_data)
                elif getattr(data, 'b64_json', None):
                    img_data = base64.b64decode(data.b64_json)
                    with open(output_path, 'wb') as handler:
                        handler.write(img_data)
                print(f"[+] Đã tải xong: {filename}")
            except Exception as ex:
                print(f"[-] Lỗi sinh Cảnh {i}: {ex}")
                raise ex

        # Run DALL-E generations concurrently
        with ThreadPoolExecutor(max_workers=5) as executor:
            tasks = [(i, prompt) for i, prompt in enumerate(prompts[:5], 1)]
            list(executor.map(download_single_scene, tasks))
                
        print("[🎉] Hoàn thành sinh toàn bộ 5 cảnh ảnh thô tự động!")
        
    except Exception as e:
        print(f"[-] Lỗi trong quá trình sinh ảnh tự động: {e}")
        sys.exit(1)

if __name__ == "__main__":
    generate_scenes()
