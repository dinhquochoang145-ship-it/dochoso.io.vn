import os
import sys
import re
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from moviepy import ImageClip, VideoFileClip, concatenate_videoclips, AudioFileClip, vfx

# Ensure UTF-8 output on Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

script_dir = os.path.dirname(os.path.abspath(__file__))
skill_dir = os.path.dirname(script_dir)
input_dir = os.path.join(skill_dir, "input")
output_dir = os.path.join(skill_dir, "output")
os.makedirs(output_dir, exist_ok=True)

# Path to system font (Arial is default on Windows)
font_path = "C:/Windows/Fonts/arial.ttf"
if not os.path.exists(font_path):
    font_path = None

DEFAULT_CAPTIONS = [
    "Bạn muốn kinh doanh… nhưng không biết bắt đầu từ đâu?",
    "Hôm nay idea này, mai lại idea khác.",
    "Bạn không thiếu động lực. Bạn thiếu bản đồ.",
    "DNA Kinh Doanh: rõ hướng trước khi xuống tiền.",
    "Nhận Bản Đồ DNA Kinh Doanh trong 72H."
]

def wrap_text(text, max_chars=30):
    words = text.split(' ')
    lines = []
    current_line = []
    for word in words:
        if len(' '.join(current_line + [word])) <= max_chars:
            current_line.append(word)
        else:
            lines.append(' '.join(current_line))
            current_line = [word]
    if current_line:
        lines.append(' '.join(current_line))
    return '\n'.join(lines)

def draw_caption_on_frame(frame_np, text):
    img = Image.fromarray(frame_np)
    draw = ImageDraw.Draw(img)
    width, height = img.size
    
    font_size = 32
    if font_path:
        font = ImageFont.truetype(font_path, font_size)
    else:
        font = ImageFont.load_default()
        
    wrapped_text = wrap_text(text, max_chars=28)
    lines = wrapped_text.split('\n')
    
    line_height = 42
    box_padding = 24
    box_height = len(lines) * line_height + box_padding
    
    # Position box at the bottom of the 9:16 vertical frame
    box_y1 = height - 200 - box_height
    box_y2 = height - 200
    
    # Draw rounded semi-transparent black rectangle
    draw.rounded_rectangle([40, box_y1, width - 40, box_y2], radius=12, fill=(0, 0, 0, 160))
    
    # Draw lines centered
    y_cursor = box_y1 + box_padding // 2
    for line in lines:
        left, top, right, bottom = draw.textbbox((0, 0), line, font=font)
        text_w = right - left
        x = (width - text_w) // 2
        draw.text((x, y_cursor), line, font=font, fill=(255, 255, 255))
        y_cursor += line_height
        
    return np.array(img)

def apply_zoom_effect(clip, zoom_ratio=0.08):
    duration = clip.duration
    def zoom_frame(get_frame, t):
        frame = get_frame(t)
        img = Image.fromarray(frame)
        width, height = img.size
        
        # Scale factor increases over time
        scale = 1.0 + (zoom_ratio * (t / duration))
        new_w = int(width * scale)
        new_h = int(height * scale)
        
        img_resized = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
        # Crop centered
        x1 = (new_w - width) // 2
        y1 = (new_h - height) // 2
        x2 = x1 + width
        y2 = y1 + height
        
        return np.array(img_resized.crop((x1, y1, x2, y2)))
        
    return clip.transform(zoom_frame)

def parse_captions_from_plan():
    plan_path = os.path.join(output_dir, "generated_video_plan.txt")
    if not os.path.exists(plan_path):
        # Fallback to general workspace plan location
        plan_path = os.path.join(os.path.dirname(skill_dir), "tao-video-ai", "output", "generated_video_plan.txt")
        
    if not os.path.exists(plan_path):
        print("[*] No generated_video_plan.txt found. Using default captions.")
        return DEFAULT_CAPTIONS
        
    print(f"[*] Parsing captions from {plan_path}...")
    try:
        with open(plan_path, "r", encoding="utf-8") as f:
            content = f.read()
            
        # Regex to find text overlay lines
        overlays = re.findall(r"Text [Oo]verlay\s*:\s*[\"']?(.*?)[\"']?\n", content)
        if len(overlays) >= 5:
            print("[+] Parsed 5 captions successfully!")
            return [x.strip() for x in overlays[:5]]
        else:
            print(f"[*] Found only {len(overlays)} captions in plan. Using default fallback.")
            return DEFAULT_CAPTIONS
    except Exception as e:
        print(f"[-] Parsing error: {e}. Using default captions.")
        return DEFAULT_CAPTIONS

def compile_video():
    print("=" * 60)
    # Parse captions
    captions = parse_captions_from_plan()
    
    clips = []
    
    for i in range(1, 6):
        # Check for scene file (sceneX.mp4 or sceneX.png/jpg)
        video_file = os.path.join(input_dir, f"scene{i}.mp4")
        image_file = os.path.join(input_dir, f"scene{i}.png")
        if not os.path.exists(image_file):
            image_file = os.path.join(input_dir, f"scene{i}.jpg")
            
        print(f"[*] Processing Scene {i}...")
        
        if os.path.exists(video_file):
            print(f"  [+] Found video file: {video_file}")
            clip = VideoFileClip(video_file)
            # Ensure clip is 4.0 or 5.0 seconds
            if clip.duration > 5.0:
                clip = clip.subclipped(0, 5.0)
        elif os.path.exists(image_file):
            print(f"  [+] Found static image file: {image_file}. Applying zoom effect...")
            # Convert static image to a 5-second zoom video clip
            raw_clip = ImageClip(image_file).with_duration(5.0)
            clip = apply_zoom_effect(raw_clip, zoom_ratio=0.08)
        else:
            print(f"  [-] Error: No scene{i}.mp4 or scene{i}.png/jpg found in input folder!")
            sys.exit(1)
            
        # Apply caption drawing
        caption_text = captions[i-1]
        print(f"  [+] Overlaying Text: \"{caption_text}\"")
        captioned_clip = clip.image_transform(lambda frame: draw_caption_on_frame(frame, caption_text))
        clips.append(captioned_clip)
        
    print("[*] Concatenating clips...")
    final_clip = concatenate_videoclips(clips, method="compose")
    
    # Check for background music
    music_file = os.path.join(input_dir, "music.mp3")
    if not os.path.exists(music_file):
        music_file = os.path.join(input_dir, "music.wav")
        
    if os.path.exists(music_file):
        print(f"[+] Found background music track: {music_file}")
        audio = AudioFileClip(music_file)
        # If music is shorter, loop it; if longer, trim it
        if audio.duration < final_clip.duration:
            # Simple loop
            audio = audio.with_duration(final_clip.duration) # moviepy auto loops or we can stretch
        else:
            audio = audio.subclipped(0, final_clip.duration)
            
        # Set volume (e.g. 15%)
        audio = audio.multiply_volume(0.15)
        final_clip = final_clip.with_audio(audio)
    else:
        print("[*] No music.mp3 found. Rendering video without background track.")
        
    final_output = os.path.join(output_dir, "final_video.mp4")
    print(f"[*] Rendering final video to: {final_output}...")
    
    # Write video
    final_clip.write_videofile(
        final_output,
        fps=24,
        codec="libx264",
        audio_codec="aac" if os.path.exists(music_file) else None,
        temp_audiofile=os.path.join(output_dir, "temp-audio.m4a") if os.path.exists(music_file) else None,
        remove_temp=True
    )
    
    print("=" * 60)
    print(f"🎉 SUCCESS! Final video compiled and saved to {final_output}")
    print("=" * 60)

if __name__ == "__main__":
    compile_video()
