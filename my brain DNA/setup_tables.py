import sqlite3
import os
import json
import sys

# Đảm bảo hiển thị tiếng Việt chính xác trên console Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

def setup_tables():
    db_path = os.path.join(os.path.dirname(__file__), "brain.db")
    waitlist_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "waitlist.json"))

    # 1. Tạo file waitlist.json mẫu nếu chưa tồn tại
    if not os.path.exists(waitlist_path):
        sample_waitlist = [
            {
                "name": "Nguyễn Văn A",
                "phone": "0987654321",
                "zalo": "0987654321",
                "register_date": "2026-06-28 10:00:00"
            },
            {
                "name": "Trần Thị B",
                "phone": "0912345678",
                "zalo": "https://zalo.me/0912345678",
                "register_date": "2026-06-29 14:30:00"
            },
            {
                "name": "Lê Văn C",
                "phone": "0933334444",
                "zalo": "",
                "register_date": "2026-06-30 09:15:00"
            }
        ]
        with open(waitlist_path, 'w', encoding='utf-8') as f:
            json.dump(sample_waitlist, f, ensure_ascii=False, indent=2)
        print(f"-> Đã tạo file waitlist.json mẫu tại: {waitlist_path}")

    # 2. Kết nối database
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Bật tính năng khóa ngoại (Foreign Keys) trong SQLite
    cursor.execute("PRAGMA foreign_keys = ON;")

    # 3. Tạo bảng products
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT CHECK(type IN ('physical', 'digital', 'service')) NOT NULL,
        price REAL NOT NULL,
        description TEXT,
        stock INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        -- Kiểm tra ràng buộc: sản phẩm vật lý (physical) bắt buộc có stock, loại khác thì có thể null
        CONSTRAINT check_stock_physical CHECK (
            (type = 'physical' AND stock IS NOT NULL) OR 
            (type != 'physical')
        )
    )
    """)
    print("-> Đã khởi tạo bảng 'products'")

    # 4. Tạo bảng customers
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT UNIQUE NOT NULL, -- UNIQUE để tránh trùng lặp số điện thoại
        zalo TEXT,
        register_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    print("-> Đã khởi tạo bảng 'customers'")

    # 5. Tạo bảng orders
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        amount REAL NOT NULL,
        status TEXT CHECK(status IN ('pending', 'completed', 'cancelled')) DEFAULT 'pending',
        order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
    )
    """)
    print("-> Đã khởi tạo bảng 'orders'")

    # 6. Import dữ liệu từ waitlist.json vào bảng customers
    try:
        with open(waitlist_path, 'r', encoding='utf-8') as f:
            waitlist_data = json.load(f)
        
        imported_count = 0
        skipped_count = 0
        
        for item in waitlist_data:
            name = item.get("name")
            phone = item.get("phone")
            zalo = item.get("zalo", "")
            reg_date = item.get("register_date")

            # Sử dụng INSERT OR IGNORE để tự động bỏ qua nếu số điện thoại (phone) đã tồn tại
            cursor.execute("""
            INSERT OR IGNORE INTO customers (name, phone, zalo, register_date)
            VALUES (?, ?, ?, ?)
            """, (name, phone, zalo, reg_date))
            
            if cursor.rowcount > 0:
                imported_count += 1
            else:
                skipped_count += 1

        print(f"-> Đồng bộ khách hàng: Đã import {imported_count} khách hàng mới, bỏ qua {skipped_count} khách hàng trùng lặp.")
    except Exception as e:
        print(f"[!] Lỗi khi import file waitlist.json: {e}")

    # 7. Thêm một số dữ liệu mẫu cho products và orders để kiểm tra
    # Kiểm tra xem bảng products có rỗng không
    cursor.execute("SELECT COUNT(*) FROM products")
    if cursor.fetchone()[0] == 0:
        sample_products = [
            ("Bản Đồ DNA Kinh Doanh", "digital", 3800000.0, "Báo cáo PDF 5 chương và Sổ tay DNA", None),
            ("Sổ Tay DNA In Cứng", "physical", 250000.0, "Sổ tay in cứng cao cấp", 100),
            ("Luận Giải 1-1 Chuyên Sâu", "service", 1500000.0, "60 phút trao đổi trực tiếp với chuyên gia", None)
        ]
        cursor.executemany("""
        INSERT INTO products (name, type, price, description, stock)
        VALUES (?, ?, ?, ?, ?)
        """, sample_products)
        print("-> Đã thêm 3 sản phẩm mẫu vào bảng 'products'.")

    # Tạo một vài đơn hàng mẫu nếu bảng orders trống
    cursor.execute("SELECT COUNT(*) FROM orders")
    if cursor.fetchone()[0] == 0:
        # Lấy ID của một số khách hàng và sản phẩm
        cursor.execute("SELECT id FROM customers LIMIT 2")
        customer_ids = [row[0] for row in cursor.fetchall()]
        cursor.execute("SELECT id, price FROM products LIMIT 2")
        product_rows = cursor.fetchall()
        
        if len(customer_ids) >= 2 and len(product_rows) >= 2:
            sample_orders = [
                (customer_ids[0], product_rows[0][0], product_rows[0][1], "completed"),
                (customer_ids[1], product_rows[1][0], product_rows[1][1], "pending")
            ]
            cursor.executemany("""
            INSERT INTO orders (customer_id, product_id, amount, status)
            VALUES (?, ?, ?, ?)
            """, sample_orders)
            print("-> Đã tạo các đơn hàng mẫu để kiểm tra.")

    conn.commit()
    conn.close()
    print("=== ĐÃ HOÀN TẤT THIẾT LẬP DATABASE ===")

if __name__ == "__main__":
    setup_tables()
