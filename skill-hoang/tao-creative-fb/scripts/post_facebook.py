import os
import sys
import requests
from dotenv import load_dotenv

# Ensure UTF-8 output on Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Load env variables
script_dir = os.path.dirname(os.path.abspath(__file__))
skill_dir = os.path.dirname(script_dir)
load_dotenv(os.path.join(skill_dir, '.env'))

def post_to_facebook(image_source, caption_text):
    page_id = os.getenv("FB_PAGE_ID")
    page_token = os.getenv("FB_PAGE_TOKEN")
    dry_run = os.getenv("DRY_RUN", "true").lower() == "true"
    
    if not page_id or not page_token:
        print("Error: FB_PAGE_ID or FB_PAGE_TOKEN is not set in .env file.")
        sys.exit(1)
        
    if dry_run:
        print("\n=== [DRY RUN MODE - SIMULATED POST] ===")
        print(f"Page ID: {page_id}")
        print(f"Image Source: {image_source}")
        print(f"Caption Content:\n{caption_text}")
        print("=======================================\n")
        print("[+] DRY_RUN is active. No real post was published to Facebook.")
        return {"id": "simulated_post_id_12345678", "post_id": "simulated_story_id"}
        
    print(f"[*] Posting to Facebook Page {page_id}...")
    url = f"https://graph.facebook.com/v18.0/{page_id}/photos"
    
    payload = {
        "caption": caption_text,
        "access_token": page_token
    }
    
    try:
        # Check if image_source is a URL or a local file
        if image_source.startswith("http://") or image_source.startswith("https://"):
            payload["url"] = image_source
            response = requests.post(url, data=payload)
        else:
            if not os.path.exists(image_source):
                print(f"[-] Error: Local image file not found at {image_source}")
                sys.exit(1)
            # Upload local file
            files = {
                "source": open(image_source, "rb")
            }
            # For uploading files, the caption parameter is "message" instead of "caption" in some Graph API versions,
            # but for /photos endpoint, both "caption" and "message" are accepted. We'll pass "caption" in data.
            response = requests.post(url, data=payload, files=files)
            
        result = response.json()
        
        if response.status_code == 200:
            post_id = result.get("post_id", result.get("id"))
            print(f"[+] Successfully posted to Facebook!")
            print(f"[+] Post ID: {post_id}")
            print(f"[+] View post: https://facebook.com/{post_id}")
            return result
        else:
            print(f"[-] Facebook API Error: {result.get('error', {}).get('message', 'Unknown error')}")
            print(f"[-] Full API Response: {result}")
            sys.exit(1)
            
    except Exception as e:
        print(f"[-] Request failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python post_facebook.py <image_url_or_local_path> <caption_text_or_file_path>")
        sys.exit(1)
        
    img = sys.argv[1]
    cap = sys.argv[2]
    
    # If the caption parameter is a path to a text file, read its content
    if os.path.exists(cap):
        with open(cap, "r", encoding="utf-8") as f:
            cap = f.read()
            
    post_to_facebook(img, cap)
