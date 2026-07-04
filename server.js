const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

// Nạp biến môi trường từ file .env cho môi trường phát triển local
try {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const parts = trimmed.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim().replace(/(^['"]|['"]$)/g, '');
        process.env[key] = value;
      }
    });
    console.log("-> Đã nạp biến môi trường thành công từ .env.");
  }
} catch (envErr) {
  console.warn("-> Cảnh báo: Không thể đọc file .env.", envErr.message);
}

const PORT = process.env.PORT || 3000;
const WEBSITE_URL = process.env.WEBSITE_URL || `http://localhost:${PORT}`;
const DB_PATH = path.join(__dirname, 'my brain DNA', 'brain.db');

// Cấu hình SePay để xác thực cuộc gọi API
const SEPAY_CONFIG = {
  bank: process.env.SEPAY_BANK || "ACB",
  accountNo: process.env.SEPAY_ACCOUNT_NO || "16997077",
  accountName: process.env.SEPAY_ACCOUNT_NAME || "DINH QUOC HOANG",
  apiToken: process.env.SEPAY_API_TOKEN || "" // Đọc từ .env hoặc môi trường hosting
};

// Đọc API Key của Resend
let RESEND_API_KEY = process.env.RESEND_API_KEY || "";
if (!RESEND_API_KEY) {
  try {
    RESEND_API_KEY = fs.readFileSync(path.join(__dirname, 'resend_config.txt'), 'utf8').trim();
    console.log("-> Đã đọc Resend API Key thành công từ resend_config.txt (fallback).");
  } catch (err) {
    console.warn("-> Cảnh báo: Không tìm thấy RESEND_API_KEY trong env hoặc file resend_config.txt.");
  }
}

// Helper gửi email qua Resend REST API
async function sendEmail({ to, subject, html }) {
  if (!RESEND_API_KEY) {
    console.error("Lỗi gửi email: Thiếu API Key Resend.");
    return { success: false, error: "Thiếu API Key" };
  }
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "DNA Kinh Doanh <hi@dochoso.io.vn>",
        to: Array.isArray(to) ? to : [to],
        subject: subject,
        html: html
      })
    });
    const data = await response.json();
    if (response.ok) {
      console.log(`-> Email gửi thành công tới ${to}. ID: ${data.id}`);
      return { success: true, data };
    } else {
      console.error("Lỗi gửi email từ Resend API:", data);
      return { success: false, error: data };
    }
  } catch (err) {
    console.error("Lỗi khi kết nối Resend:", err);
    return { success: false, error: err.message };
  }
}

// Helper gửi email xác nhận đơn hàng theo brand voice
async function sendOrderConfirmationEmail({ orderId, customerName, customerEmail, productName, amount, status }) {
  const amountFormatted = parseFloat(amount).toLocaleString('vi-VN');
  
  let statusText = "Chờ thanh toán (Pending)";
  if (status === 'completed') statusText = "Thành công (Completed)";
  if (status === 'cancelled') statusText = "Đã hủy (Cancelled)";

  const subject = `Xác nhận đơn hàng #${orderId} - DNA Kinh Doanh`;
  const html = `
    <div style="font-family: sans-serif; padding: 20px; max-width: 600px; border: 1px solid #eee; border-radius: 8px; line-height: 1.6; color: #2a1b10;">
      <h2 style="color: #e9b85d; margin-top: 0; border-bottom: 2px solid #fff8ee; padding-bottom: 10px;">Xác nhận đơn hàng thành công</h2>
      <p>Chào bạn <strong>${customerName}</strong>,</p>
      <p>Cảm ơn bạn đã lựa chọn dịch vụ của tụi mình. Đơn hàng của bạn đã được ghi nhận thành công trên hệ thống.</p>
      
      <div style="background: #fff8ee; border: 1px solid rgba(233,184,93,0.3); border-radius: 8px; padding: 16px; margin: 20px 0;">
        <h4 style="margin: 0 0 10px 0; color: #8b6332; font-size: 14px; letter-spacing: 0.5px;">THÔNG TIN ĐƠN HÀNG</h4>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 6px 0; color: #666; width: 120px;">Mã đơn hàng:</td>
            <td style="padding: 6px 0; font-weight: bold;">#${orderId}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #666;">Sản phẩm:</td>
            <td style="padding: 6px 0; font-weight: bold;">${productName}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #666;">Số tiền:</td>
            <td style="padding: 6px 0; font-weight: bold; color: #8b6332; font-size: 16px;">${amountFormatted}đ</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #666;">Trạng thái:</td>
            <td style="padding: 6px 0; font-weight: bold;">${statusText}</td>
          </tr>
        </table>
      </div>

      <h4 style="color: #8b6332; margin-top: 20px; font-size: 15px;">HƯỚNG DẪN NHẬN HÀNG</h4>
      <p>Bản đồ cá nhân hóa của bạn đang được mình phân tích và chuẩn bị. Nó sẽ được gửi tới bạn trong vòng 72 giờ tới qua Zalo hoặc Email này.</p>
      <p>Sau khi nhận báo cáo, tụi mình sẽ chủ động liên hệ để đặt lịch hẹn cho buổi luận giải trực tiếp 1-1 kéo dài 60 phút.</p>
      
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-style: italic; color: #666; font-size: 13px; line-height: 1.5;">
        Thật ra, việc sở hữu bản đồ chỉ là bước khởi đầu. Hành động và vận hành nó một cách bền bỉ mới thực sự quyết định kết quả. Hy vọng tấm bản đồ này sẽ giúp ích nhiều cho bạn.
      </p>
      <p style="margin-top: 20px; font-size: 14px;">Thân mến,<br/><strong>Hoàng | DNA Kinh Doanh</strong></p>
    </div>
  `;

  return sendEmail({
    to: customerEmail,
    subject: subject,
    html: html
  });
}

// Khởi tạo kết nối database SQLite (sử dụng thư viện native của Node.js)
let db;
try {
  db = new DatabaseSync(DB_PATH);
  db.exec("PRAGMA foreign_keys = ON;");
  
  // Tự động thêm cột email nếu chưa có
  try {
    db.exec("ALTER TABLE customers ADD COLUMN email TEXT;");
    console.log("-> Đã bổ sung cột 'email' vào bảng 'customers' thành công.");
  } catch (alterErr) {
    // Nếu cột đã tồn tại (lỗi duplicate column name), bỏ qua
    if (!alterErr.message.includes("duplicate column name")) {
      console.warn("-> Cảnh báo khi cấu trúc bảng customers:", alterErr.message);
    }
  }

  // Tự động tạo bảng scheduled_emails nếu chưa tồn tại
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS scheduled_emails (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER,
        email_type INTEGER,
        recipient TEXT NOT NULL,
        subject TEXT NOT NULL,
        html TEXT NOT NULL,
        send_at TIMESTAMP NOT NULL,
        status TEXT CHECK(status IN ('pending', 'sending', 'sent', 'failed')) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("-> Đã khởi tạo bảng 'scheduled_emails' thành công.");
  } catch (tableErr) {
    console.error("-> Lỗi tạo bảng scheduled_emails:", tableErr.message);
  }
  
  console.log(`-> Đã kết nối SQLite database thành công tại: ${DB_PATH}`);
} catch (err) {
  console.error("-> Lỗi kết nối database:", err);
  process.exit(1);
}

// Helper đọc dữ liệu JSON từ body request
function getJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
  });
}

// Helper gửi phản hồi JSON
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

// Helper gửi phản hồi lỗi
function sendError(res, statusCode, message) {
  sendJson(res, statusCode, { error: message });
}

// Server HTTP chính
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;
  const method = req.method;

  // --- API TEST EMAIL VIA RESEND ---
  if (pathname === '/api/test-email' && method === 'GET') {
    try {
      const emailTo = url.searchParams.get('to');
      if (!emailTo) {
        return sendError(res, 400, "Thiếu tham số 'to' (email nhận).");
      }

      console.log(`-> Đang gửi email thử nghiệm tới: ${emailTo}`);
      const result = await sendEmail({
        to: emailTo,
        subject: "Kiểm tra kết nối Resend - DNA Kinh Doanh",
        html: `
          <div style="font-family: sans-serif; padding: 20px; max-width: 600px; border: 1px solid #eee; border-radius: 8px;">
            <h2 style="color: #e9b85d;">Kết nối thành công!</h2>
            <p>Chào bạn,</p>
            <p>Email này được gửi tự động từ hệ thống website <strong>DNA Kinh Doanh</strong> thông qua dịch vụ Resend bằng tên miền riêng <strong>dochoso.io.vn</strong>.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <small style="color: #666;">Mã API Key đã lưu trong resend_config.txt đã hoạt động chính xác.</small>
          </div>
        `
      });

      if (result.success) {
        return sendJson(res, 200, { message: "Đã gửi email thử nghiệm thành công! Hãy kiểm tra hộp thư của bạn.", data: result.data });
      } else {
        return sendError(res, 500, `Không thể gửi email: ${JSON.stringify(result.error)}`);
      }
    } catch (err) {
      console.error(err);
      return sendError(res, 500, `Lỗi xử lý gửi email thử nghiệm: ${err.message}`);
    }
  }

  // --- API CHECK PAYMENT (PROXY AN TOÀN PHÍA BACKEND) ---
  if (pathname === '/api/check-payment' && method === 'GET') {
    try {
      const memo = url.searchParams.get('memo');
      const amountStr = url.searchParams.get('amount');
      const orderIdStr = url.searchParams.get('orderId');
      if (!memo || !amountStr) {
        return sendError(res, 400, "Thiếu tham số memo hoặc amount.");
      }
      const amount = parseFloat(amountStr);

      // --- MỚI: KIỂM TRA TRẠNG THÁI TRONG CƠ SỞ DỮ LIỆU ĐỊA PHƯƠNG TRƯỚC ---
      if (orderIdStr) {
        const orderId = parseInt(orderIdStr);
        if (!isNaN(orderId)) {
          const orderStmt = db.prepare("SELECT status, amount FROM orders WHERE id = ?");
          const order = orderStmt.get(orderId);
          if (order && order.status === 'completed') {
            return sendJson(res, 200, {
              success: true,
              transaction: {
                id: "MANUAL_" + orderId,
                amount_in: order.amount,
                transaction_content: memo
              }
            });
          }
        }
      }

      const apiToken = SEPAY_CONFIG.apiToken;
      const sepayUrl = `https://my.sepay.vn/userapi/transactions/list?limit=20`;

      const response = await fetch(sepayUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Không thể kết nối đến SePay API');
      }

      const data = await response.json();
      let matchedTx = null;

      if (data.status === 200 && data.transactions) {
        matchedTx = data.transactions.find(tx => {
          const content = tx.transaction_content || "";
          const amountIn = parseFloat(tx.amount_in || 0);

          const hasMemo = content.toUpperCase().includes(memo.toUpperCase());
          const hasAmount = amountIn >= amount;

          return hasMemo && hasAmount;
        });
      }

      return sendJson(res, 200, { success: !!matchedTx, transaction: matchedTx });
    } catch (err) {
      console.error("Lỗi API check-payment:", err);
      return sendError(res, 500, err.message);
    }
  }

  // --- API PRODUCTS ---
  if (pathname === '/api/products') {
    try {
      if (method === 'GET') {
        const stmt = db.prepare("SELECT id, name, type, price, description, stock, datetime(created_at, 'localtime') as created_at FROM products ORDER BY id DESC");
        const products = stmt.all();
        return sendJson(res, 200, products);
      } 
      
      else if (method === 'POST') {
        const body = await getJsonBody(req);
        const { name, type, price, description, stock } = body;
        
        if (!name || !type || price === undefined) {
          return sendError(res, 400, "Thiếu thông tin sản phẩm bắt buộc.");
        }

        // Ràng buộc sản phẩm vật lý phải có stock
        if (type === 'physical' && (stock === undefined || stock === null || stock === '')) {
          return sendError(res, 400, "Sản phẩm vật lý bắt buộc phải nhập số lượng tồn kho.");
        }

        const parsedStock = type === 'physical' ? parseInt(stock) : null;

        const stmt = db.prepare(`
          INSERT INTO products (name, type, price, description, stock)
          VALUES (?, ?, ?, ?, ?)
        `);
        const info = stmt.run(name, type, parseFloat(price), description || '', parsedStock);
        return sendJson(res, 201, { id: info.lastInsertRowid, message: "Thêm sản phẩm thành công." });
      } 
      
      else if (method === 'PUT') {
        const body = await getJsonBody(req);
        const { id, name, type, price, description, stock } = body;

        if (!id || !name || !type || price === undefined) {
          return sendError(res, 400, "Thiếu thông tin cập nhật sản phẩm.");
        }

        if (type === 'physical' && (stock === undefined || stock === null || stock === '')) {
          return sendError(res, 400, "Sản phẩm vật lý bắt buộc phải nhập số lượng tồn kho.");
        }

        const parsedStock = type === 'physical' ? parseInt(stock) : null;

        const stmt = db.prepare(`
          UPDATE products
          SET name = ?, type = ?, price = ?, description = ?, stock = ?
          WHERE id = ?
        `);
        const info = stmt.run(name, type, parseFloat(price), description || '', parsedStock, parseInt(id));
        
        if (info.changes === 0) {
          return sendError(res, 404, "Không tìm thấy sản phẩm cần sửa.");
        }
        return sendJson(res, 200, { message: "Cập nhật sản phẩm thành công." });
      } 
      
      else if (method === 'DELETE') {
        const id = url.searchParams.get('id');
        if (!id) return sendError(res, 400, "Thiếu ID sản phẩm.");

        try {
          const stmt = db.prepare("DELETE FROM products WHERE id = ?");
          stmt.run(parseInt(id));
          return sendJson(res, 200, { message: "Xóa sản phẩm thành công." });
        } catch (err) {
          if (err.message.includes('FOREIGN KEY constraint failed')) {
            return sendError(res, 400, "Không thể xóa sản phẩm này vì đã có đơn hàng liên kết.");
          }
          throw err;
        }
      }
    } catch (err) {
      console.error(err);
      return sendError(res, 500, `Lỗi xử lý Sản phẩm: ${err.message}`);
    }
  }

  // --- API CUSTOMERS ---
  if (pathname === '/api/customers') {
    try {
      if (method === 'GET') {
        const stmt = db.prepare("SELECT id, name, phone, email, zalo, datetime(register_date, 'localtime') as register_date FROM customers ORDER BY id DESC");
        const customers = stmt.all();
        return sendJson(res, 200, customers);
      } 
      
      else if (method === 'POST') {
        const body = await getJsonBody(req);
        const { name, phone, email, zalo, register_date } = body;

        if (!name || !phone) {
          return sendError(res, 400, "Tên và Số điện thoại là bắt buộc.");
        }

        // Validate định dạng số điện thoại (đúng 10 số)
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone.trim())) {
          return sendError(res, 400, "Số điện thoại không hợp lệ. Vui lòng nhập đúng 10 chữ số.");
        }

        // Validate định dạng email (nếu có nhập)
        if (email) {
          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          if (!emailRegex.test(email.trim())) {
            return sendError(res, 400, "Địa chỉ email không đúng định dạng.");
          }
        }

        try {
          const stmt = db.prepare(`
            INSERT INTO customers (name, phone, email, zalo, register_date)
            VALUES (?, ?, ?, ?, COALESCE(?, CURRENT_TIMESTAMP))
          `);
          const info = stmt.run(name, phone, email || '', zalo || '', register_date || null);
          const customerId = info.lastInsertRowid;
          
          // Lên lịch gửi 3 email chào mừng
          if (email) {
            scheduleWelcomeEmails(customerId, email);
          }
          
          return sendJson(res, 201, { id: customerId, message: "Thêm khách hàng thành công." });
        } catch (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            // Khách hàng đã tồn tại -> Cập nhật email của họ nếu có và trả về ID
            const updateStmt = db.prepare("UPDATE customers SET email = COALESCE(NULLIF(?, ''), email) WHERE phone = ?");
            updateStmt.run(email || '', phone);

            const findStmt = db.prepare("SELECT id FROM customers WHERE phone = ?");
            const customer = findStmt.get(phone);
            
            // Lên lịch gửi email nếu chưa từng có lịch
            if (email) {
              const checkStmt = db.prepare("SELECT COUNT(*) as count FROM scheduled_emails WHERE customer_id = ?");
              const hasEmails = checkStmt.get(customer.id).count > 0;
              if (!hasEmails) {
                scheduleWelcomeEmails(customer.id, email);
              }
            }

            return sendJson(res, 200, { id: customer.id, message: "Khách hàng đã tồn tại." });
          }
          throw err;
        }
      } 
      
      else if (method === 'PUT') {
        const body = await getJsonBody(req);
        const { id, name, phone, email, zalo, register_date } = body;

        if (!id || !name || !phone) {
          return sendError(res, 400, "Thiếu thông tin cập nhật khách hàng.");
        }

        try {
          const stmt = db.prepare(`
            UPDATE customers
            SET name = ?, phone = ?, email = ?, zalo = ?, register_date = ?
            WHERE id = ?
          `);
          const info = stmt.run(name, phone, email || '', zalo || '', register_date || null, parseInt(id));
          if (info.changes === 0) {
            return sendError(res, 404, "Không tìm thấy khách hàng cần sửa.");
          }
          return sendJson(res, 200, { message: "Cập nhật khách hàng thành công." });
        } catch (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return sendError(res, 400, "Số điện thoại này đã được sử dụng bởi khách hàng khác.");
          }
          throw err;
        }
      } 
      
      else if (method === 'DELETE') {
        const id = url.searchParams.get('id');
        if (!id) return sendError(res, 400, "Thiếu ID khách hàng.");

        try {
          const stmt = db.prepare("DELETE FROM customers WHERE id = ?");
          stmt.run(parseInt(id));
          return sendJson(res, 200, { message: "Xóa khách hàng thành công." });
        } catch (err) {
          if (err.message.includes('FOREIGN KEY constraint failed')) {
            return sendError(res, 400, "Không thể xóa khách hàng này vì họ đang có đơn hàng trong hệ thống.");
          }
          throw err;
        }
      }
    } catch (err) {
      console.error(err);
      return sendError(res, 500, `Lỗi xử lý Khách hàng: ${err.message}`);
    }
  }

  // --- API ORDERS ---
  if (pathname === '/api/orders') {
    try {
      if (method === 'GET') {
        // Lấy danh sách đơn hàng có JOIN tên khách hàng và tên sản phẩm, chuyển đổi múi giờ sang giờ địa phương
        const stmt = db.prepare(`
          SELECT o.id, o.customer_id, o.product_id, o.amount, o.status, datetime(o.order_date, 'localtime') as order_date,
                 c.name as customer_name, c.phone as customer_phone, p.name as product_name, p.type as product_type
          FROM orders o
          JOIN customers c ON o.customer_id = c.id
          JOIN products p ON o.product_id = p.id
          ORDER BY o.id DESC
        `);
        const orders = stmt.all();
        return sendJson(res, 200, orders);
      } 
      
      else if (method === 'POST') {
        const body = await getJsonBody(req);
        const { customer_id, product_id, amount, status } = body;

        if (!customer_id || !product_id || amount === undefined) {
          return sendError(res, 400, "Thiếu thông tin đơn hàng bắt buộc.");
        }

        // --- BẮT ĐẦU TRANSACTIONS ĐỂ ĐẢM BẢO TỒN KHO ---
        db.exec("BEGIN TRANSACTION;");
        try {
          // 1. Kiểm tra loại sản phẩm và số lượng tồn kho
          const pStmt = db.prepare("SELECT type, stock, name FROM products WHERE id = ?");
          const product = pStmt.get(parseInt(product_id));

          if (!product) {
            throw new Error("Không tìm thấy sản phẩm được chọn.");
          }

          // 2. Nếu là sản phẩm vật lý, tự động trừ tồn kho
          if (product.type === 'physical') {
            if (product.stock === null || product.stock === undefined) {
              throw new Error(`Sản phẩm '${product.name}' chưa được thiết lập số lượng tồn kho.`);
            }
            if (product.stock <= 0) {
              throw new Error(`Sản phẩm '${product.name}' đã hết hàng (Tồn kho: 0).`);
            }
            
            // Trừ tồn kho đi 1
            const updateStockStmt = db.prepare("UPDATE products SET stock = stock - 1 WHERE id = ?");
            updateStockStmt.run(parseInt(product_id));
          }
          // 3. Thêm đơn hàng mới
          const insertOrderStmt = db.prepare(`
            INSERT INTO orders (customer_id, product_id, amount, status)
            VALUES (?, ?, ?, COALESCE(?, 'pending'))
          `);
          const info = insertOrderStmt.run(parseInt(customer_id), parseInt(product_id), parseFloat(amount), status || 'pending');
          db.exec("COMMIT;");
          
          // Gửi email xác nhận đơn hàng bất đồng bộ (async)
          const orderId = info.lastInsertRowid;
          try {
            const customer = db.prepare("SELECT name, email FROM customers WHERE id = ?").get(parseInt(customer_id));
            const product = db.prepare("SELECT name FROM products WHERE id = ?").get(parseInt(product_id));
            if (customer && customer.email) {
              sendOrderConfirmationEmail({
                orderId,
                customerName: customer.name,
                customerEmail: customer.email,
                productName: product.name,
                amount: amount,
                status: status || 'pending'
              }).catch(emailErr => console.error("Lỗi gửi email xác nhận đơn hàng:", emailErr));
            }
          } catch (errQuery) {
            console.error("Lỗi truy vấn thông tin gửi email xác nhận:", errQuery);
          }

          return sendJson(res, 201, { id: orderId, message: "Tạo đơn hàng thành công." });
        } catch (txErr) {
          db.exec("ROLLBACK;");
          return sendError(res, 400, txErr.message);
        }
      } 
      
      else if (method === 'PUT') {
        const body = await getJsonBody(req);
        const { id, status } = body;

        if (!id || !status) {
          return sendError(res, 400, "Thiếu thông tin cập nhật đơn hàng.");
        }

        const stmt = db.prepare("UPDATE orders SET status = ? WHERE id = ?");
        const info = stmt.run(status, parseInt(id));
        
        if (info.changes === 0) {
          return sendError(res, 404, "Không tìm thấy đơn hàng cần sửa.");
        }

        // Nếu trạng thái được chuyển sang 'completed' (Thành công/Duyệt nhanh) -> Gửi email xác nhận đơn hàng
        if (status === 'completed') {
          try {
            const order = db.prepare(`
              SELECT o.amount, c.name as customer_name, c.email as customer_email, p.name as product_name
              FROM orders o
              JOIN customers c ON o.customer_id = c.id
              JOIN products p ON o.product_id = p.id
              WHERE o.id = ?
            `).get(parseInt(id));

            if (order && order.customer_email) {
              sendOrderConfirmationEmail({
                orderId: id,
                customerName: order.customer_name,
                customerEmail: order.customer_email,
                productName: order.product_name,
                amount: order.amount,
                status: 'completed'
              }).catch(emailErr => console.error("Lỗi gửi email khi cập nhật đơn hàng:", emailErr));
            }
          } catch (errQuery) {
            console.error("Lỗi truy vấn thông tin gửi email khi cập nhật:", errQuery);
          }
        }

        return sendJson(res, 200, { message: "Cập nhật trạng thái đơn hàng thành công." });
      } 
      
      else if (method === 'DELETE') {
        const id = url.searchParams.get('id');
        if (!id) return sendError(res, 400, "Thiếu ID đơn hàng.");

        const stmt = db.prepare("DELETE FROM orders WHERE id = ?");
        stmt.run(parseInt(id));
        return sendJson(res, 200, { message: "Xóa đơn hàng thành công." });
      }
    } catch (err) {
      console.error(err);
      return sendError(res, 500, `Lỗi xử lý Đơn hàng: ${err.message}`);
    }
  }

  // ==================== STATIC FILE SERVING ====================

  let filePath = pathname;
  if (filePath === '/admin' || filePath === '/admin/') {
    filePath = '/admin.html';
  } else if (filePath === '/') {
    filePath = '/index.html';
  }

  const fullPath = path.join(__dirname, filePath);

  const ext = path.extname(fullPath).toLowerCase();
  const base = path.basename(fullPath).toLowerCase();
  if (base === 'server.js' || base === 'brain.db' || filePath.includes('.git') || filePath.includes('.vercel')) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end("403 Forbidden - Bạn không có quyền truy cập file này.");
  }

  // Đọc file và gửi phản hồi
  fs.access(fullPath, fs.constants.F_OK, (err) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end("404 Not Found - Không tìm thấy trang yêu cầu.");
    }

    fs.readFile(fullPath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        return res.end("500 Internal Server Error.");
      }

      let contentType = 'text/html; charset=utf-8';
      if (ext === '.css') contentType = 'text/css';
      else if (ext === '.js') contentType = 'application/javascript';
      else if (ext === '.json') contentType = 'application/json';
      else if (ext === '.png') contentType = 'image/png';
      else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
      else if (ext === '.gif') contentType = 'image/gif';
      else if (ext === '.svg') contentType = 'image/svg+xml';
      else if (ext === '.ico') contentType = 'image/x-icon';

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });
});

// ==================== EMAIL SEQUENCING & SCHEDULER ====================

function getEmailsFromSequence() {
  const defaultEmails = {
    email1: {
      subject: "Cảm ơn bạn đã đăng ký Bản đồ DNA Kinh Doanh",
      html: `Chào bạn,<br/><br/>Mình là Hoàng, người sáng lập dự án DNA Kinh Doanh.<br/><br/>Rất vui vì bạn đã dành thời gian điền thông tin vào danh sách chờ nhận Bản đồ DNA Kinh Doanh.<br/><br/>Thật ra, trước khi xây dựng bản đồ này, mình cũng từng rơi vào cảnh loay hoay: đổi ý tưởng mỗi tuần, sợ chọn sai hướng đi rồi mất trắng cả vốn lẫn thời gian.<br/><br/>Vì vậy, mình tạo ra DNA Kinh Doanh không phải để "phán số mệnh" hay hù dọa điều gì.<br/><br/>Mục tiêu duy nhất là giúp bạn nhìn thấy rõ thế mạnh, mô hình vận hành và điểm mù cần tránh của riêng mình trước khi xuống tiền kinh doanh.<br/><br/>Bản đồ cá nhân hóa của bạn đang được phân tích và chuẩn bị. Nó sẽ được gửi tới bạn trong vòng 72 giờ tới qua Zalo hoặc Email này.<br/><br/>Trong thời gian này, mình sẽ chia sẻ với bạn một vài góc nhìn cốt lõi để bạn chuẩn bị tinh thần kinh doanh một cách thực chiến nhất.<br/><br/>Cảm ơn bạn đã tin tưởng đồng hành cùng mình.<br/><br/>Thân mến,<br/>Hoàng`
    },
    email2: {
      subject: "Đừng vội chọn ngành, hãy chọn mô hình hợp với bạn",
      html: `Chào bạn,<br/><br/>Nếu bạn để ý, hầu hết những người thất bại khi khởi nghiệp không phải vì họ thiếu động lực hay lười biếng.<br/><br/>Vấn đề thường nằm ở chỗ họ chọn sai cách vận hành.<br/><br/>Nhiều người nghĩ đơn giản: "Ngành này đang là xu hướng, mình phải lao vào ngay."<br/><br/>Nhưng họ không biết rằng: có người hợp làm một mình (solo), có người chỉ làm tốt khi có cộng sự bổ trợ (partnership), có người hợp làm online, có người lại mạnh về offline.<br/><br/>Thật ra, vấn đề không nằm ở chỗ "bán cái gì".<br/><br/>Nó nằm ở chỗ "bạn hợp kinh doanh theo kiểu nào".<br/><br/>Nếu bạn là người thích tự do và linh hoạt, nhưng lại cố xây dựng một hệ thống cồng kềnh với hàng chục nhân sự, bạn sẽ nhanh chóng kiệt sức (burnout) trước khi kịp kiếm được đồng tiền đầu tiên.<br/><br/>Ngược lại, nếu bạn cần một đội ngũ bổ trợ điểm mù mà lại cố tự gánh vác mọi việc, bạn sẽ sớm đụng trần giới hạn của bản thân.<br/><br/>Hiểu rõ mô hình vận hành phù hợp chính là chìa khóa để bạn đi đường dài mà không bị cạn kiệt năng lượng.<br/><br/>Trong Bản đồ DNA Kinh Doanh sắp gửi tới bạn, Chương 02 và 03 sẽ phân tích rất sâu về điều này để bạn có khung ra quyết định rõ ràng hơn.<br/><br/>Hãy kiên nhẫn một chút nhé.<br/><br/>Thân mến,<br/>Hoàng`
    },
    email3: {
      subject: "Bản đồ DNA Kinh Doanh của bạn đã sẵn sàng",
      html: `Chào bạn,<br/><br/>Báo cáo DNA Kinh Doanh cá nhân hóa của bạn đã sẵn sàng để được luận giải.<br/><br/>Bạn thử nghĩ xem: thay vì tự thử và sai mất 1–2 năm đầu đời, mất vài chục hay vài trăm triệu đồng vốn liếng, việc sở hữu một tấm bản đồ chỉ rõ:<br/>* 3 hướng ngành phù hợp và 2 hướng nên tránh.<br/>* Mô hình kinh doanh hợp nhất với cách bạn vận hành.<br/>* Kiểu đối tác và nhân sự bạn nên tìm để phân quyền bớt xung đột.<br/>* Chu kỳ năng lượng 3–5 năm tới của bạn để biết khi nào nên dồn lực.<br/>* Những điểm mù cụ thể dễ gây cháy tiền hay burnout của riêng bạn.<br/><br/>Nó giống như việc bạn có một chiếc la bàn trước khi bước vào rừng vậy. Nó không cam kết bạn chắc chắn giàu, nhưng nó giúp bạn giảm bớt những quyết định cảm tính đắt giá.<br/><br/>Mức đầu tư cho gói Bản đồ DNA Kinh Doanh kèm 60 phút luận giải 1-1 trực tiếp với mình là 3.800.000đ.<br/><br/>Bạn có thể hoàn tất đăng ký nhận bản đồ và lịch hẹn luận giải bằng cách bấm vào link dưới đây:<br/><br/><a href="${WEBSITE_URL}/#dang-ky" style="display:inline-block;padding:12px 24px;background:#e9b85d;color:#24170b;font-weight:bold;text-decoration:none;border-radius:8px;">Nhận Bản Đồ DNA Kinh Doanh & Lịch Hẹn Luận Giải</a><br/><br/>Nếu bạn chỉ muốn thử nghiệm hệ thống thanh toán tự động của tụi mình, bạn có thể chọn gói test trị giá 2.000đ để trải nghiệm.<br/><br/>Hy vọng được đồng hành cùng bạn trên chặng đường kinh doanh sắp tới.<br/><br/>Thân mến,<br/>Hoàng`
    }
  };

  try {
    const seqPath = path.join(__dirname, 'my brain DNA', 'email_sequence.md');
    if (!fs.existsSync(seqPath)) return defaultEmails;

    const content = fs.readFileSync(seqPath, 'utf8');
    const sections = content.split(/## Email \d/);
    
    const parseSection = (sectionText) => {
      const subjectMatch = sectionText.match(/Tiêu đề\s*[\*]*\s*:\s*(.*)/i);
      const subject = subjectMatch ? subjectMatch[1].trim() : "";
      
      let lines = sectionText.split('\n');
      lines.shift();
      
      let bodyLines = lines
        .filter(line => {
          const trimmed = line.trim();
          return !trimmed.includes('Tiêu đề') && 
                 !trimmed.includes('Người gửi') && 
                 !trimmed.startsWith('##') && 
                 trimmed.length > 0;
        })
        .join('\n')
        .trim();
      
      let html = bodyLines
        .replace(/\n/g, '<br/>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
          const resolvedUrl = url.replace('http://localhost:8000', WEBSITE_URL);
          return `<a href="${resolvedUrl}" style="color:#e9b85d;text-decoration:underline;">${text}</a>`;
        });
      
      return { subject, html };
    };

    if (sections.length >= 4) {
      return {
        email1: parseSection(sections[1]),
        email2: parseSection(sections[2]),
        email3: parseSection(sections[3])
      };
    }
  } catch (err) {
    console.error("Lỗi khi phân tích file email_sequence.md:", err);
  }
  return defaultEmails;
}

// Lên lịch gửi 3 email
function scheduleWelcomeEmails(customerId, recipientEmail) {
  try {
    const templates = getEmailsFromSequence();
    const isTest = recipientEmail.toLowerCase().includes('+test');

    let time1, time2, time3;
    if (isTest) {
      // Chế độ test: Gửi cả 3 email ngay lập tức (cách nhau 5-10s để tránh bị nghẽn)
      time1 = new Date().toISOString();
      time2 = new Date(Date.now() + 5000).toISOString();
      time3 = new Date(Date.now() + 10000).toISOString();
      console.log(`[TEST MODE] Lên lịch gửi cả 3 email ngay lập tức cho: ${recipientEmail}`);
    } else {
      // Chế độ bình thường: Email 1 gửi ngay, Email 2 sau 2 ngày, Email 3 sau 3 ngày (1 ngày sau Email 2)
      time1 = new Date().toISOString();
      time2 = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString();
      time3 = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
      console.log(`[NORMAL MODE] Lên lịch gửi 3 email theo tiến trình cho: ${recipientEmail}`);
    }

    const insertStmt = db.prepare(`
      INSERT INTO scheduled_emails (customer_id, email_type, recipient, subject, html, send_at, status)
      VALUES (?, ?, ?, ?, ?, ?, 'pending')
    `);

    insertStmt.run(customerId, 1, recipientEmail, templates.email1.subject, templates.email1.html, time1);
    insertStmt.run(customerId, 2, recipientEmail, templates.email2.subject, templates.email2.html, time2);
    insertStmt.run(customerId, 3, recipientEmail, templates.email3.subject, templates.email3.html, time3);

    // Quét tiến trình ngay lập tức
    processScheduledEmails();
  } catch (err) {
    console.error("Lỗi khi lên lịch gửi email:", err);
  }
}

// Tiến trình quét gửi email ngầm
let emailWorkerInterval = null;

function startEmailWorker() {
  if (emailWorkerInterval) clearInterval(emailWorkerInterval);

  // Quét mỗi 5 giây cho phản hồi nhanh (đặc biệt khi test)
  emailWorkerInterval = setInterval(processScheduledEmails, 5000);
  console.log("-> Đã kích hoạt Email Worker chạy ngầm mỗi 5 giây.");
}

async function processScheduledEmails() {
  try {
    const nowISO = new Date().toISOString();
    const stmt = db.prepare("SELECT * FROM scheduled_emails WHERE send_at <= ? AND status = 'pending'");
    const pendingEmails = stmt.all(nowISO);

    for (const email of pendingEmails) {
      // Cập nhật trạng thái đang gửi tránh trùng lặp
      db.prepare("UPDATE scheduled_emails SET status = 'sending' WHERE id = ?").run(email.id);

      console.log(`[Email Worker] Đang gửi Email ${email.email_type} tới: ${email.recipient}`);
      const result = await sendEmail({
        to: email.recipient,
        subject: email.subject,
        html: email.html
      });

      if (result.success) {
        db.prepare("UPDATE scheduled_emails SET status = 'sent' WHERE id = ?").run(email.id);
      } else {
        db.prepare("UPDATE scheduled_emails SET status = 'failed' WHERE id = ?").run(email.id);
        console.error(`[Email Worker] Gửi thất bại tới ${email.recipient}:`, result.error);
      }
    }
  } catch (err) {
    console.error("[Email Worker] Lỗi trong quá trình quét gửi email:", err);
  }
}

server.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 WEBSITE & ADMIN PANEL ĐANG CHẠY CỤC BỘ`);
  console.log(`👉 Đường dẫn trang chủ: http://localhost:${PORT}`);
  console.log(`👉 Đường dẫn admin:     http://localhost:${PORT}/admin`);
  console.log(`==================================================\n`);
  
  // Khởi động email worker chạy ngầm
  startEmailWorker();
});
