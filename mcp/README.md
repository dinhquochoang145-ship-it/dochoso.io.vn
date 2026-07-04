# MCP Server - DNA Kinh Doanh

Server này cung cấp các công cụ (Tools) Model Context Protocol để kết nối AI Agent (qua goClaw Gateway) với cơ sở dữ liệu `brain.db` và hệ thống API của website.

## 🛠️ Chức năng (Tools) được cung cấp
1.  **`get_sales_summary`**: Xem nhanh báo cáo doanh số, số đơn hàng ngày hôm nay hoặc ngày cụ thể.
2.  **`list_recent_customers`**: Liệt kê danh sách khách hàng đăng ký mới gần đây.
3.  **`approve_order`**: Duyệt nhanh đơn hàng thủ công trên Telegram (kèm tự động gửi email xác nhận qua Resend).

## 🚀 Hướng dẫn chạy thử nghiệm local (Development)
Ở thư mục gốc dự án, khởi chạy MCP server bằng Node:
```bash
node mcp/index.js
```
Server sẽ khởi chạy tại cổng **3001** cục bộ (`http://127.0.0.1:3001/mcp`).

---

## ⚙️ Hướng dẫn cài đặt trên VPS chạy 24/7 (Production)

Chúng ta sử dụng Systemd để quản lý tiến trình MCP server tự khởi động lại khi crash hoặc khi restart VPS.

### Bước 1: Tạo file Service Systemd
Tạo file service mới tại đường dẫn `/etc/systemd/system/mcp-server.service` trên VPS:

```ini
[Unit]
Description=MCP Server DNA Kinh Doanh
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/my-website
ExecStart=/usr/bin/node mcp/index.js
Restart=on-failure
Environment=NODE_ENV=production PORT=3001 WEBSITE_URL=https://dochoso.io.vn

[Install]
WantedBy=multi-user.target
```

### Bước 2: Kích hoạt dịch vụ
Chạy các lệnh sau để kích hoạt dịch vụ chạy ngầm:

```bash
# Nạp lại cấu hình systemd
systemctl daemon-reload

# Bật tự động khởi động cùng hệ thống
systemctl enable mcp-server

# Khởi động dịch vụ ngay lập tức
systemctl start mcp-server

# Kiểm tra trạng thái hoạt động
systemctl status mcp-server
```

### Bước 3: Cấu hình trên goClaw Dashboard
1.  Đăng nhập vào goClaw Dashboard (`https://app.dochoso.io.vn`).
2.  Đi tới **Capabilities** -> **MCP Servers**.
3.  Bấm **Add MCP Server**:
    *   **Name:** `my-business`
    *   **Transport:** `streamable-http`
    *   **URL:** `http://127.0.0.1:3001/mcp`
    *   **Tool prefix:** `biz`
4.  Nhấn **Save** để kết nối.
