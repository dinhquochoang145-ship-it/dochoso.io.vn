import os
import sys
import requests
import base64
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

def generate_image(prompt, output_name="dall_e_image.png"):
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("Error: OPENAI_API_KEY is not set in .env file.")
        sys.exit(1)
        
    model = os.getenv("OPENAI_IMAGE_MODEL", "gpt-image-1")
    dry_run = os.getenv("DRY_RUN", "true").lower() == "true"
    
    print(f"[*] Calling OpenAI Image API using model '{model}'...")
    
    # Initialize OpenAI Client
    # Key4U custom endpoint if needed, but since it's OpenAI compatible we can use base_url if set, otherwise standard
    base_url = os.getenv("OPENAI_BASE_URL")
    if base_url:
        client = OpenAI(api_key=api_key, base_url=base_url)
    else:
        client = OpenAI(api_key=api_key)
        
    image_quality = os.getenv("OPENAI_IMAGE_QUALITY", "low")
    try:
        response = client.images.generate(
            model=model,
            prompt=prompt,
            size="1024x1024",
            quality=image_quality,
            n=1,
        )
        
        data = response.data[0]
        output_dir = os.path.join(skill_dir, "output")
        os.makedirs(output_dir, exist_ok=True)
        output_path = os.path.join(output_dir, output_name)
        
        image_source = None
        if getattr(data, 'url', None):
            image_source = data.url
            print(f"[+] Image generated successfully. URL: {image_source}")
            print(f"[*] Downloading image to {output_path}...")
            img_data = requests.get(image_source).content
            with open(output_path, 'wb') as handler:
                handler.write(img_data)
        elif getattr(data, 'b64_json', None):
            image_source = output_path
            print(f"[+] Image generated successfully (Base64).")
            print(f"[*] Decoding and saving image to {output_path}...")
            img_data = base64.b64decode(data.b64_json)
            with open(output_path, 'wb') as handler:
                handler.write(img_data)
        else:
            raise ValueError("No url or b64_json found in OpenAI Image API response.")
            
        print(f"[+] Image saved to {output_path}")
        return image_source, output_path
        
    except Exception as e:
        print(f"[-] Error generating image: {e}")
        # Retry once
        print("[*] Retrying image generation...")
        try:
            response = client.images.generate(
                model=model,
                prompt=prompt,
                size="1024x1024",
                quality=image_quality,
                n=1,
            )
            data = response.data[0]
            output_dir = os.path.join(skill_dir, "output")
            os.makedirs(output_dir, exist_ok=True)
            output_path = os.path.join(output_dir, output_name)
            
            image_source = None
            if getattr(data, 'url', None):
                image_source = data.url
                print(f"[+] Image generated successfully on retry. URL: {image_source}")
                print(f"[*] Downloading image to {output_path}...")
                img_data = requests.get(image_source).content
                with open(output_path, 'wb') as handler:
                    handler.write(img_data)
            elif getattr(data, 'b64_json', None):
                image_source = output_path
                print(f"[+] Image generated successfully on retry (Base64).")
                print(f"[*] Decoding and saving image to {output_path}...")
                img_data = base64.b64decode(data.b64_json)
                with open(output_path, 'wb') as handler:
                    handler.write(img_data)
            else:
                raise ValueError("No url or b64_json found in OpenAI Image API response.")
                
            print(f"[+] Image saved to {output_path}")
            return image_source, output_path
        except Exception as retry_err:
            print(f"[-] Retry failed: {retry_err}")
            sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python gen_image.py <prompt> [output_name.png]")
        sys.exit(1)
        
    prompt_arg = sys.argv[1]
    name_arg = sys.argv[2] if len(sys.argv) > 2 else "generated_image.png"
    generate_image(prompt_arg, name_arg)
