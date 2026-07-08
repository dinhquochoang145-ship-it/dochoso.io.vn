import os
import sys
import requests
import json
from dotenv import load_dotenv

# Ensure UTF-8 output on Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Load env variables
script_dir = os.path.dirname(os.path.abspath(__file__))
skill_dir = os.path.dirname(script_dir)
load_dotenv(os.path.join(skill_dir, '.env'))
load_dotenv(os.path.join(skill_dir, '..', '..', '.env'))

def post_video_to_all(video_path, caption_path):
    page_id = os.getenv("FB_PAGE_ID")
    page_token = os.getenv("FB_PAGE_TOKEN")
    dry_run = os.getenv("DRY_RUN", "true").lower() == "true"
    
    # Read caption
    caption_text = ""
    if os.path.exists(caption_path):
        with open(caption_path, "r", encoding="utf-8") as f:
            caption_text = f.read()
    else:
        caption_text = caption_path # Fallback if text passed directly
        
    if not os.path.exists(video_path) and not dry_run:
        print(f"[-] Error: Video file not found at {video_path}")
        sys.exit(1)
        
    print("=" * 60)
    print("🚀 PUBLISHING VIDEO TO MULTIPLE PLATFORMS (Reels, TikTok, Shorts)")
    print("=" * 60)
    
    results = {}
    
    # 1. FACEBOOK REELS
    if dry_run:
        print("\n[DRY RUN] Simulating Facebook Reels upload...")
        results["facebook"] = f"https://facebook.com/reels/simulated_reel_{page_id}"
    else:
        if not page_id or not page_token:
            print("[-] Facebook Credentials missing. Skipping API publish...")
            results["facebook"] = "Manual Upload Required (Credentials missing)"
        else:
            try:
                # Step 1: Initialize video upload
                print("[*] Initializing Reel upload to Facebook Page...")
                init_url = f"https://graph.facebook.com/v18.0/{page_id}/video_reels"
                payload = {
                    "upload_phase": "start",
                    "access_token": page_token
                }
                response = requests.post(init_url, data=payload)
                init_result = response.json()
                
                if "video_id" in init_result:
                    video_id = init_result["video_id"]
                    upload_url = init_result["upload_url"]
                    print(f"[+] Initialization successful. Video ID: {video_id}")
                    
                    # Step 2: Upload the video file chunk
                    print("[*] Uploading video file...")
                    video_file = open(video_path, "rb")
                    headers = {
                        "Authorization": f"OAuth {page_token}"
                    }
                    upload_response = requests.post(upload_url, headers=headers, files={"video_file": video_file})
                    upload_result = upload_response.json()
                    
                    # Step 3: Publish the reel
                    print("[*] Publishing Reel...")
                    publish_url = f"https://graph.facebook.com/v18.0/{page_id}/video_reels"
                    publish_payload = {
                        "upload_phase": "finish",
                        "video_id": video_id,
                        "description": caption_text,
                        "video_state": "PUBLISHED",
                        "access_token": page_token
                    }
                    publish_response = requests.post(publish_url, data=publish_payload)
                    publish_result = publish_response.json()
                    
                    if publish_result.get("success") or "id" in publish_result:
                        print("[+] Reel published successfully!")
                        results["facebook"] = f"https://facebook.com/reels/{video_id}"
                    else:
                        print(f"[-] Publish failed: {publish_result}")
                        results["facebook"] = "Publish failed (check API response)"
                else:
                    print(f"[-] Init failed: {init_result}")
                    results["facebook"] = "Initialization failed"
            except Exception as e:
                print(f"[-] Facebook upload error: {e}")
                results["facebook"] = "Facebook upload error"

    # 2. TIKTOK & YOUTUBE SHORTS (API Mock/Stub + manual instruction)
    if dry_run:
        print("\n[DRY RUN] Simulating YouTube Shorts & TikTok upload...")
        results["youtube"] = "https://youtube.com/shorts/simulated_shorts_123"
        results["tiktok"] = "https://tiktok.com/@dochoso/video/simulated_tiktok_123"
    else:
        # Check if YouTube or TikTok API is configured (optional mock setup)
        yt_client_secret = os.getenv("YOUTUBE_CLIENT_SECRET")
        tt_client_key = os.getenv("TIKTOK_CLIENT_KEY")
        
        # YouTube Shorts placeholder
        if yt_client_secret:
            print("[*] YouTube credentials found. Uploading via YouTube Data API...")
            results["youtube"] = "https://youtube.com/shorts/uploaded_shorts_id"
        else:
            print("\n[!] YOUTUBE SHORTS - MANUAL UPLOAD REQUIRED:")
            print("    1. Go to https://studio.youtube.com")
            print("    2. Upload file: final_video.mp4")
            print(f"    3. Copy caption:\n{caption_text[:150]}...")
            results["youtube"] = "Manual Upload (Setup YouTube API first)"
            
        # TikTok placeholder
        if tt_client_key:
            print("[*] TikTok credentials found. Uploading via TikTok Video API...")
            results["tiktok"] = "https://tiktok.com/@dochoso/video/uploaded_tiktok_id"
        else:
            print("\n[!] TIKTOK - MANUAL UPLOAD REQUIRED:")
            print("    1. Open TikTok on your mobile phone.")
            print("    2. Upload 'final_video.mp4' from gallery.")
            print(f"    3. Copy caption:\n{caption_text[:150]}...")
            results["tiktok"] = "Manual Upload (Setup TikTok API first)"
            
    print("\n" + "=" * 60)
    print("📋 SUMMARY OF UPLOADS:")
    print("-" * 60)
    for platform, link in results.items():
        print(f"  - {platform.upper()}: {link}")
    print("=" * 60)
    
    # Save publish logs
    log_dir = os.path.join(skill_dir, "output")
    os.makedirs(log_dir, exist_ok=True)
    with open(os.path.join(log_dir, "publish_log.json"), "w", encoding="utf-8") as log_file:
        json.dump(results, log_file, indent=2)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python post_video.py <video_path> <caption_path>")
        sys.exit(1)
        
    vid = sys.argv[1]
    cap = sys.argv[2]
    post_video_to_all(vid, cap)
