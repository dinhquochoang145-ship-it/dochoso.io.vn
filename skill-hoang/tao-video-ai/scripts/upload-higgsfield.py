import os
import sys

# Ensure UTF-8 output on Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def show_upload_guide():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    skill_dir = os.path.dirname(script_dir)
    plan_path = os.path.join(skill_dir, "output", "generated_video_plan.txt")
    
    print("=" * 60)
    print("🎬 HIGGSFIELD & KLING VIDEO GENERATION - MANUAL UPLOAD GUIDE")
    print("=" * 60)
    
    if os.path.exists(plan_path):
        print(f"[+] Loaded generated video plan from: {plan_path}")
        with open(plan_path, "r", encoding="utf-8") as f:
            content = f.read()
            
        print("\n[!] BỘ PROMPTS ĐÃ ĐƯỢC TẠO SẴN:")
        print("-" * 40)
        # Display a summary or short preview of the plan
        lines = content.split('\n')
        for line in lines[:30]:
            print(line)
        if len(lines) > 30:
            print("... (Xem đầy đủ tại file output/generated_video_plan.txt) ...")
        print("-" * 40)
    else:
        print("\n⚠️ Cảnh báo: Chưa tìm thấy file kịch bản. Vui lòng chạy lệnh sau trước:")
        print("  python scripts/gen-prompt.py \"Chủ đề của bạn\"")
        print("-" * 40)
        
    print("\n💡 HƯỚNG DẪN THAO TÁC TRÊN GIAO DIỆN HIGGSFIELD:")
    print("1. Đăng nhập vào Higgsfield (https://higgsfield.ai) trên trình duyệt.")
    print("2. Để sinh ảnh nguyên liệu (Cảnh 1, 2, 3, 4, 5):")
    print("   - Vào tab IMAGE.")
    print("   - Chọn model SOUL 2.0 (Không giới hạn credit) hoặc Stream 4.5.")
    print("   - Cài đặt Aspect Ratio thành 9:16 (Dọc).")
    print("   - Copy prompt tương ứng trong file 'generated_video_plan.txt' dán vào ô Prompt.")
    print("   - Bấm Generate.")
    print("3. Để giữ nhận diện nhân vật (Character Lock):")
    print("   - Lấy ảnh Cảnh 1 vừa gen thành công, bấm upload vào ô GENERAL (hoặc reference box).")
    print("   - Sử dụng prompt Cảnh 4 & 5 kèm theo reference để đồng nhất mặt.")
    print("4. Để tạo chuyển động (Animate Video):")
    print("   - Sang tab VIDEO.")
    print("   - Upload ảnh tĩnh đã gen đạt yêu cầu.")
    print("   - Chọn model WAN 2.2 (Unlimited) hoặc KLING 3.0.")
    print("   - Paste prompt motion (cú máy orbit chậm) và bấm Generate.")
    print("=" * 60)

if __name__ == "__main__":
    show_upload_guide()
