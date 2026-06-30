import sqlite3
import os
import sys

# Đảm bảo hiển thị tiếng Việt chính xác trên console Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

def setup_database():
    db_name = "brain.db"
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()

    # Create tables
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS knowledge (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS business (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS brand_voice (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Sample data
    knowledge_samples = [
        ("Bài học về Quảng cáo Facebook", "Luôn test tối thiểu 3 nhóm đối tượng khác nhau để tìm ra tệp khách hàng tiềm năng tối ưu nhất."),
        ("Quy luật 80/20 trong Kinh doanh", "80% doanh thu đến từ 20% nhóm khách hàng trung thành. Hãy tập trung chăm sóc nhóm này.")
    ]

    business_samples = [
        ("Khóa học Bản đồ Vận mệnh", "Sản phẩm chủ lực tư vấn tử vi và định hướng cuộc đời cho khách hàng cá nhân."),
        ("Khách hàng Nguyễn Văn A", "Khách hàng VIP đã mua khóa học Bản đồ Vận mệnh, quan tâm đến dịch vụ đặt tên cho con.")
    ]

    brand_voice_samples = [
        ("Tone giọng Đồng cảm & Sâu sắc", "Dùng từ ngữ gần gũi, chân thành, tránh sáo rỗng. Cách xưng hô: Mình - Bạn hoặc Tôi - Bạn."),
        ("Phong cách viết Kể chuyện (Storytelling)", "Bắt đầu bằng một câu chuyện thực tế của khách hàng, sau đó dẫn dắt đến bài học và giải pháp.")
    ]

    # Insert sample data if tables are empty
    for table, samples in [("knowledge", knowledge_samples), ("business", business_samples), ("brand_voice", brand_voice_samples)]:
        # Check if table already has data
        cursor.execute(f"SELECT COUNT(*) FROM {table}")
        count = cursor.fetchone()[0]
        if count == 0:
            cursor.executemany(f"INSERT INTO {table} (title, content) VALUES (?, ?)", samples)
            print(f"Đã thêm dữ liệu mẫu vào bảng '{table}'.")
        else:
            print(f"Bảng '{table}' đã có dữ liệu, không thêm dữ liệu mẫu.")

    conn.commit()
    conn.close()
    print(f"Đã khởi tạo database '{db_name}' thành công tại '{os.path.abspath(db_name)}'.")

if __name__ == "__main__":
    setup_database()
