"""Fallback: đọc trực tiếp brain.db khi các file references/*.md có thể đã cũ.

Dùng khi:
- User yêu cầu rõ "lấy dữ liệu mới nhất" / "brand voice mới cập nhật".
- File references/*.md không tồn tại hoặc thiếu bảng cần dùng.

Usage:
    python read_brain.py brand_voice
    python read_brain.py business
    python read_brain.py products

Chỉ dùng thư viện chuẩn (sqlite3) — không cần cài thêm gói.
"""
import sqlite3
import sys
from pathlib import Path

DB_PATH = Path(__file__).resolve().parents[3] / "my brain DNA" / "brain.db"

TABLES = {
    "brand_voice": "SELECT id, title, content FROM brand_voice",
    "business": "SELECT id, title, content FROM business",
    "knowledge": "SELECT id, title, content FROM knowledge",
    "products": "SELECT id, name, type, price, description, stock FROM products",
}


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")

    if len(sys.argv) != 2 or sys.argv[1] not in TABLES:
        print(f"Usage: python read_brain.py <{'|'.join(TABLES)}>")
        sys.exit(1)

    table = sys.argv[1]
    if not DB_PATH.exists():
        print(f"Khong tim thay brain.db tai: {DB_PATH}")
        sys.exit(1)

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(TABLES[table])
    columns = [d[0] for d in cursor.description]

    for row in cursor.fetchall():
        for col, val in zip(columns, row):
            print(f"{col}: {val}")
        print("-" * 40)

    conn.close()


if __name__ == "__main__":
    main()
