import os
import sys

# Ensure UTF-8 output on Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def list_reference_images():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    skill_dir = os.path.dirname(script_dir)
    
    # Path to product-photos or assets
    assets_dir = os.path.join(skill_dir, "assets")
    product_photos_dir = os.path.join(os.path.dirname(skill_dir), "..", "product-photos")
    
    print("[*] Checking reference photo directories...")
    
    found_any = False
    for name, path in [("Skill Assets", assets_dir), ("Product Photos (Root)", product_photos_dir)]:
        if os.path.exists(path):
            print(f"\n📁 Directory: {path}")
            files = [f for f in os.listdir(path) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp'))]
            if files:
                found_any = True
                for f in files:
                    full_path = os.path.join(path, f)
                    size_kb = os.path.getsize(full_path) / 1024
                    print(f"  - {f} ({size_kb:.1f} KB)")
            else:
                print("  (No images found)")
        else:
            print(f"\n⚠️ Directory not found: {path}")
            
    if not found_any:
        print("\n💡 Tip: Please create a 'product-photos/' directory in your repository root and add your product/model reference images there.")

if __name__ == "__main__":
    list_reference_images()
