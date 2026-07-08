import os
import sys
import requests
from dotenv import load_dotenv

# Ensure UTF-8 output
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

script_dir = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(script_dir, '..', '..', '..', '.env')
load_dotenv(env_path)

def fix_facebook_token():
    current_token = os.getenv("FB_PAGE_TOKEN")
    page_id = os.getenv("FB_PAGE_ID")
    
    if not current_token:
        print("[-] Lỗi: Chưa cấu hình FB_PAGE_TOKEN trong file .env")
        return
        
    print("[*] Đang truy vấn danh sách Trang (Pages) từ tài khoản Facebook của sếp...")
    try:
        url = f"https://graph.facebook.com/v18.0/me/accounts?access_token={current_token}"
        response = requests.get(url)
        data = response.json()
        
        if "error" in data:
            print(f"[-] Lỗi API Facebook: {data['error']['message']}")
            print("[!] Hướng dẫn: Vui lòng truy cập https://developers.facebook.com và sinh lại User Access Token mới.")
            return
            
        pages = data.get("data", [])
        if not pages:
            print("[-] Không tìm thấy Trang nào được liên kết với tài khoản này.")
            return
            
        target_page = None
        for page in pages:
            if page_id and page.get("id") == page_id:
                target_page = page
                break
            elif page.get("name") == "Tử Vi Xem":
                target_page = page
                break
                
        if not target_page:
            print("[-] Không tìm thấy trang Tử Vi Xem hoặc ID trang tương ứng trong danh sách.")
            print("Danh sách các trang đang quản lý:")
            for p in pages:
                print(f"  - {p.get('name')} (ID: {p.get('id')})")
            return
            
        page_name = target_page.get("name")
        page_access_token = target_page.get("access_token")
        target_page_id = target_page.get("id")
        
        print(f"[+] Tìm thấy Trang: {page_name} (ID: {target_page_id})")
        print(f"[+] Đã lấy thành công Page Access Token mới!")
        
        # Update .env file
        if os.path.exists(env_path):
            with open(env_path, "r", encoding="utf-8") as f:
                lines = f.readlines()
                
            new_lines = []
            replaced_token = False
            replaced_id = False
            for line in lines:
                if line.startswith("FB_PAGE_TOKEN="):
                    new_lines.append(f"FB_PAGE_TOKEN={page_access_token}\n")
                    replaced_token = True
                elif line.startswith("FB_PAGE_ID="):
                    new_lines.append(f"FB_PAGE_ID={target_page_id}\n")
                    replaced_id = True
                else:
                    new_lines.append(line)
                    
            if not replaced_token:
                new_lines.append(f"FB_PAGE_TOKEN={page_access_token}\n")
            if not replaced_id:
                new_lines.append(f"FB_PAGE_ID={target_page_id}\n")
                
            with open(env_path, "w", encoding="utf-8") as f:
                f.writelines(new_lines)
                
            print(f"[🎉] Đã tự động cập nhật Page Access Token chuẩn vào file .env!")
        else:
            print(f"[-] Không tìm thấy file .env tại {env_path} để tự động cập nhật.")
            print(f"Sếp hãy copy Token này và dán thủ công vào .env:\n{page_access_token}")
            
    except Exception as e:
        print(f"[-] Lỗi kết nối: {e}")

if __name__ == "__main__":
    fix_facebook_token()
