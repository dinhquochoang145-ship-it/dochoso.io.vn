# Hướng dẫn Triển khai (Deployment Notes) - DNA Kinh Doanh

## 1. Biến Môi Trường (Environment Variables) cần thiết lập trên VPS
Hãy tạo file `.env` tại thư mục `/opt/my-website` trên VPS với các biến sau:

```env
# Cấu hình cổng chạy ứng dụng (Mặc định sẽ chạy port 3000)
PORT=3000

# Địa chỉ tên miền chính thức của website
WEBSITE_URL=https://yourdomain.com

# Cấu hình cổng thanh toán SePay
SEPAY_BANK=ACB
SEPAY_ACCOUNT_NO=16997077
SEPAY_ACCOUNT_NAME=DINH QUOC HOANG
SEPAY_API_TOKEN=your_sepay_api_token_here

# Cấu hình gửi email qua Resend
RESEND_API_KEY=your_resend_api_key_here
```

## 2. Cổng Lắng Nghe (Listening Port)
* Cổng mặc định trên VPS: **3000** (có thể điều chỉnh qua biến `PORT`).
* Ở bước sau, Caddy hoặc Nginx sẽ chuyển tiếp các yêu cầu từ cổng **80 / 443** (HTTP/HTTPS) về cổng **3000** này.

## 3. Lệnh chạy Server trên VPS
* **Chạy thử nghiệm (Development/Debug):**
  ```bash
  node server.js
  ```
* **Chạy 24/7 bằng Systemd (Khuyên dùng cho Production):**
  Chúng ta sẽ tạo một service Systemd tại `/etc/systemd/system/mywebsite.service`:
  ```ini
  [Unit]
  Description=Website DNA Kinh Doanh
  After=network.target

  [Service]
  Type=simple
  User=root
  WorkingDirectory=/opt/my-website
  ExecStart=/usr/bin/node server.js
  Restart=on-failure
  Environment=NODE_ENV=production PORT=3000 WEBSITE_URL=https://yourdomain.com SEPAY_BANK=ACB SEPAY_ACCOUNT_NO=16997077 SEPAY_ACCOUNT_NAME="DINH QUOC HOANG" SEPAY_API_TOKEN=your_sepay_api_token_here RESEND_API_KEY=your_resend_api_key_here

  [Install]
  WantedBy=multi-user.target
  ```
  *(Các lệnh kích hoạt sẽ được AI thực hiện ở Bước 2).*
