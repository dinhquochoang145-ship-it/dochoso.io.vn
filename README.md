# DNA Kinh Doanh - Hệ thống Web App & Quản Trị Tự Động

Dự án giới thiệu Bản Đồ DNA Kinh Doanh (bản đồ ra quyết định cá nhân hóa), tích hợp hệ thống quản lý chăm sóc khách hàng tự động, chatbot tư vấn bán hàng, và hệ thống đối soát chuyển khoản tự động qua SePay.

## 🛠️ Công Nghệ Sử Dụng
- **Backend**: Node.js (Vanilla HTTP Server, không dùng framework bên thứ ba)
- **Database**: SQLite (sử dụng thư viện built-in `node:sqlite` của Node.js 22+)
- **Frontend**: HTML5, Vanilla CSS3, Vanilla JavaScript
- **Email Service**: Resend REST API (tự động gửi email nuôi dưỡng & xác nhận đơn hàng)
- **Payment Verification**: SePay Webhook API (đối soát giao dịch ngân hàng thời gian thực)

---

## ⚙️ Cấu Hình Môi Trường (.env)

Trước khi chạy dự án, hãy tạo file `.env` ở thư mục gốc (đã được cấu hình trong `.gitignore` để tránh rò rỉ bảo mật) và điền các thông tin sau:

```env
# Cấu hình API đối soát SePay
SEPAY_BANK=ACB
SEPAY_ACCOUNT_NO=16997077
SEPAY_ACCOUNT_NAME=DINH QUOC HOANG
SEPAY_API_TOKEN=your_sepay_api_token_here

# Cấu hình gửi thư Resend
RESEND_API_KEY=your_resend_api_key_here
```

---

## 🚀 Chạy Dưới Local

1. Đảm bảo bạn đã cài đặt **Node.js phiên bản 22** trở lên.
2. Cài đặt các biến môi trường vào file `.env`.
3. Chạy server:
   ```bash
   node server.js
   ```
4. Truy cập:
   - Trang chủ: `http://localhost:8000`
   - Trang Admin: `http://localhost:8000/admin`

---

## 🌐 Hướng Dẫn Deploy Lên Server Thật (Render / VPS)

### 1. Đưa dự án lên GitHub
Đẩy toàn bộ mã nguồn (trừ `.env` và `brain.db` đã bị chặn bởi `.gitignore`) lên kho lưu trữ GitHub của bạn:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your_github_repo_url>
git push -u origin main
```

### 2. Deploy lên Render.com
1. Tạo một tài liệu dịch vụ mới dạng **Web Service** trên Render kết nối với GitHub Repo của bạn.
2. **Environment**: Chọn `Node`.
3. **Build Command**: Không cần (để trống hoặc gõ `echo "no build step"`).
4. **Start Command**: `node server.js`.
5. **Environment Variables**: Thêm các biến môi trường đã có trong `.env` vào phần cấu hình Env của Render.
6. **Disk (Persistent Volume) - QUAN TRỌNG**:
   Vì SQLite ghi dữ liệu trực tiếp vào file `brain.db`, bạn cần tạo một **Render Disk** để lưu giữ file DB không bị xóa khi server restart:
   - Điền **Mount Path**: `/opt/render/project/src/my brain DNA` (hoặc mount thư mục chứa database).
   - Đảm bảo biến `DB_PATH` trong code luôn trỏ đúng đường dẫn thư mục Disk này.

### 3. Cấu hình Webhook SePay
Sau khi có domain chạy thật (ví dụ `https://dochoso.io.vn`), hãy truy cập trang quản trị SePay và tạo một Webhook hướng tới địa chỉ:
`https://dochoso.io.vn/api/sepay-webhook`
- Phương thức gửi: `POST`
- Điền token xác thực trùng khớp với `SEPAY_API_TOKEN` để đảm bảo an ninh bảo mật.
