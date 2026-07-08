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

def debug_token():
    token = os.getenv("FB_PAGE_TOKEN")
    page_id = os.getenv("FB_PAGE_ID")
    
    if not token:
        print("[-] Lỗi: Chưa cấu hình FB_PAGE_TOKEN trong file .env")
        return
        
    print("[*] Đang truy vấn chi tiết Token từ Facebook Debug API...")
    
    # Query /me to get basic info of the token
    try:
        me_url = f"https://graph.facebook.com/v18.0/me?access_token={token}"
        me_res = requests.get(me_url)
        me_data = me_res.json()
        
        if "error" in me_data:
            print(f"[-] Facebook API Error: {me_data['error']['message']}")
            print(f"[-] Chi tiết: {me_data['error']}")
            return
            
        print(f"[+] Token hợp lệ!")
        print(f"[+] Đại diện cho thực thể (Name): {me_data.get('name')} (ID: {me_data.get('id')})")
        
        # Check if it represents a User or a Page
        # Query page accounts list to verify if this is a page token
        accounts_url = f"https://graph.facebook.com/v18.0/me/accounts?access_token={token}"
        acc_res = requests.get(accounts_url)
        acc_data = acc_res.json()
        
        is_page_token = False
        if "data" in acc_data:
            print("[+] Token này là User Access Token (Quyền cá nhân).")
        else:
            is_page_token = True
            print("[+] Token này là Page Access Token (Quyền trang).")
            
        # Query permissions (scopes)
        permissions_url = f"https://graph.facebook.com/v18.0/me/permissions?access_token={token}"
        perm_res = requests.get(permissions_url)
        perm_data = perm_res.json()
        
        scopes = []
        if "data" in perm_data:
            scopes = [p["permission"] for p in perm_data["data"] if p["status"] == "granted"]
            print("\n[+] CÁC QUYỀN ĐÃ CẤP CHO TOKEN NÀY (GRANTED SCOPES):")
            for scope in scopes:
                print(f"  - {scope}")
        else:
            print("[-] Không thể lấy danh sách quyền của Token.")
            
        # Verify required scopes for Reels
        required_reels_scopes = ["pages_manage_posts", "publish_video"]
        missing_scopes = [s for s in required_reels_scopes if s not in scopes]
        
        print("\n" + "=" * 50)
        print("📊 ĐÁNH GIÁ ĐIỀU KIỆN ĐĂNG REELS TỰ ĐỘNG:")
        print("-" * 50)
        if missing_scopes:
            print(f"❌ THIẾU QUYỀN: Token của sếp đang thiếu các quyền sau:")
            for ms in missing_scopes:
                print(f"   👉 {ms}")
            print("\n💡 HƯỚNG DẪN FIX:")
            print("1. Truy cập https://developers.facebook.com -> Tools -> Graph API Explorer.")
            print("2. Chọn App của sếp ở góc phải.")
            print("3. Trong ô 'Permissions' ở cột phải, thêm các quyền sau:")
            print("   - pages_show_list")
            print("   - pages_read_engagement")
            print("   - pages_manage_posts")
            print("   - publish_video")
            print("4. Bấm 'Generate Access Token' -> Đăng nhập cấp quyền trang.")
            print("5. Dán token mới đó vào file .env trên VPS và chạy lại nhé!")
        else:
            print("✅ Đầy đủ quyền đăng video Reels!")
            
    except Exception as e:
        print(f"[-] Lỗi kết nối: {e}")

if __name__ == "__main__":
    debug_token()
