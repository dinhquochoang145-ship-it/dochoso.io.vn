const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const PORT = 8000;
const DB_PATH = path.join(__dirname, 'my brain DNA', 'brain.db');

// Cấu hình SePay để xác thực cuộc gọi API
const SEPAY_CONFIG = {
  bank: "ACB",
  accountNo: "16997077",
  accountName: "DINH QUOC HOANG",
  apiToken: "EIS2YGLM6CYFHR0OXNYS8WT9TM1UVQIC7IQPD1ESSUKLHHUXOCZ4FXUJRT93EA2F"
};

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

        try {
          const stmt = db.prepare(`
            INSERT INTO customers (name, phone, email, zalo, register_date)
            VALUES (?, ?, ?, ?, COALESCE(?, CURRENT_TIMESTAMP))
          `);
          const info = stmt.run(name, phone, email || '', zalo || '', register_date || null);
          return sendJson(res, 201, { id: info.lastInsertRowid, message: "Thêm khách hàng thành công." });
        } catch (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            // Khách hàng đã tồn tại -> Cập nhật email của họ nếu có và trả về ID
            const updateStmt = db.prepare("UPDATE customers SET email = COALESCE(NULLIF(?, ''), email) WHERE phone = ?");
            updateStmt.run(email || '', phone);

            const findStmt = db.prepare("SELECT id FROM customers WHERE phone = ?");
            const customer = findStmt.get(phone);
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
          return sendJson(res, 201, { id: info.lastInsertRowid, message: "Tạo đơn hàng thành công." });
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

  // Điều hướng /admin và /admin/ về file admin.html
  let filePath = pathname;
  if (filePath === '/admin' || filePath === '/admin/') {
    filePath = '/admin.html';
  } else if (filePath === '/') {
    filePath = '/index.html';
  }

  const fullPath = path.join(__dirname, filePath);

  // Bảo vệ không cho đọc các file hệ thống (.git, .vercel, database, server.js)
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

      // Xác định Content-Type
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

server.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 WEBSITE & ADMIN PANEL ĐANG CHẠY CỤC BỘ`);
  console.log(`👉 Đường dẫn trang chủ: http://localhost:${PORT}`);
  console.log(`👉 Đường dẫn admin:     http://localhost:${PORT}/admin`);
  console.log(`==================================================\n`);
});
