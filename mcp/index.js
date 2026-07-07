const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const { SSEServerTransport } = require("@modelcontextprotocol/sdk/server/sse.js");
const { DatabaseSync } = require('node:sqlite');
const { z } = require("zod");
const express = require("express");
const path = require("path");
const fs = require("fs");

// Load Environment variables from .env in parent directory
const envPath = path.join(__dirname, '..', '.env');
try {
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
    console.log("-> Loaded environment variables from .env");
  }
} catch (e) {
  console.warn("-> Could not read .env file", e.message);
}

const DB_PATH = path.join(__dirname, '..', 'my brain DNA', 'brain.db');
let RESEND_API_KEY = process.env.RESEND_API_KEY || "";

// Read Resend API Key fallback if not in env
if (!RESEND_API_KEY) {
  try {
    const fallbackPath = path.join(__dirname, '..', 'resend_config.txt');
    if (fs.existsSync(fallbackPath)) {
      RESEND_API_KEY = fs.readFileSync(fallbackPath, 'utf8').trim();
    }
  } catch (err) {}
}

// Check database exists
if (!fs.existsSync(DB_PATH)) {
  console.error(`Database not found at ${DB_PATH}. Please make sure setup_tables.py has been run.`);
  process.exit(1);
}

// Helper: Send Order Confirmation Email
async function sendOrderConfirmationEmail({ orderId, customerName, customerEmail, productName, amount, status }) {
  if (!RESEND_API_KEY) {
    console.error("Email error: Missing Resend API Key.");
    return { success: false, error: "Missing API Key" };
  }
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

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "DNA Kinh Doanh <hi@dochoso.io.vn>",
        to: [customerEmail],
        subject: subject,
        html: html
      })
    });
    const data = await response.json();
    return { success: response.ok, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// Initialize SQLite database connection
let db;
try {
  db = new DatabaseSync(DB_PATH);
  console.log(`-> MCP connected to SQLite database at: ${DB_PATH}`);
} catch (err) {
  console.error("-> Failed to connect database:", err.message);
  process.exit(1);
}

// ------------------- INITIALIZE MCP SERVER -------------------
const server = new McpServer({
  name: "my-business",
  version: "1.0.0"
});

// 1. Tool: get_sales_summary
server.tool(
  "get_sales_summary",
  "Xem nhanh báo cáo doanh số, số đơn hàng mới trong ngày hôm nay hoặc một ngày cụ thể (định dạng YYYY-MM-DD).",
  {
    date: z.string().optional().describe("Ngày cần xem báo cáo (định dạng YYYY-MM-DD). Mặc định là ngày hôm nay.")
  },
  async ({ date }) => {
    try {
      const dateStr = date || new Date().toLocaleDateString('sv'); // sv format: YYYY-MM-DD
      console.log(`[MCP - get_sales_summary] Querying for date: ${dateStr}`);
      
      const summaryStmt = db.prepare(`
        SELECT COUNT(*) as total_orders, COALESCE(SUM(amount), 0) as total_revenue
        FROM orders
        WHERE DATE(order_date, 'localtime') = ?
      `);
      const summary = summaryStmt.get(dateStr);

      const statusStmt = db.prepare(`
        SELECT status, COUNT(*) as count
        FROM orders
        WHERE DATE(order_date, 'localtime') = ?
        GROUP BY status
      `);
      const statuses = statusStmt.all(dateStr);

      let statusLines = "";
      statuses.forEach(s => {
        let label = s.status;
        if (s.status === 'completed') label = "Thành công (completed)";
        if (s.status === 'pending') label = "Chờ thanh toán (pending)";
        if (s.status === 'cancelled') label = "Đã hủy (cancelled)";
        statusLines += `  + ${label}: ${s.count} đơn\n`;
      });

      if (!statusLines) statusLines = "  (Không có đơn hàng nào)\n";

      const reportText = `Báo cáo doanh số ngày: **${dateStr}**\n` +
        `- **Tổng số đơn hàng:** ${summary.total_orders} đơn\n` +
        `- **Tổng doanh thu:** ${parseFloat(summary.total_revenue).toLocaleString('vi-VN')}đ\n` +
        `- **Trạng thái chi tiết:**\n${statusLines}`;

      return {
        content: [{ type: "text", text: reportText }]
      };
    } catch (err) {
      console.error("[MCP Error - get_sales_summary]:", err.message);
      return {
        isError: true,
        content: [{ type: "text", text: `Lỗi truy vấn doanh số: ${err.message}` }]
      };
    }
  }
);

// 2. Tool: list_recent_customers
server.tool(
  "list_recent_customers",
  "Lấy danh sách các khách hàng mới đăng ký waitlist hoặc mua hàng gần đây.",
  {
    limit: z.number().optional().describe("Số lượng khách hàng muốn xem gần đây nhất. Mặc định là 5.")
  },
  async ({ limit }) => {
    try {
      const limitVal = limit || 5;
      console.log(`[MCP - list_recent_customers] Querying for limit: ${limitVal}`);

      const stmt = db.prepare(`
        SELECT id, name, phone, email, zalo, datetime(register_date, 'localtime') as register_date
        FROM customers
        ORDER BY id DESC
        LIMIT ?
      `);
      const customers = stmt.all(limitVal);

      if (customers.length === 0) {
        return {
          content: [{ type: "text", text: "Chưa có khách hàng nào trong hệ thống." }]
        };
      }

      let text = `Danh sách **${customers.length}** khách hàng mới nhất:\n`;
      customers.forEach((c, idx) => {
        text += `${idx + 1}. **${c.name}** (ID: ${c.id})\n` +
          `   - SĐT: \`${c.phone}\`\n` +
          `   - Email: \`${c.email || "Trống"}\`\n` +
          `   - Zalo: \`${c.zalo || "Trống"}\`\n` +
          `   - Ngày đăng ký: ${c.register_date}\n\n`;
      });

      return {
        content: [{ type: "text", text: text }]
      };
    } catch (err) {
      console.error("[MCP Error - list_recent_customers]:", err.message);
      return {
        isError: true,
        content: [{ type: "text", text: `Lỗi lấy danh sách khách hàng: ${err.message}` }]
      };
    }
  }
);

// 3. Tool: approve_order
server.tool(
  "approve_order",
  "Duyệt thủ công trạng thái một đơn hàng sang thành công (completed) và gửi email xác nhận cho khách.",
  {
    order_id: z.number().describe("ID của đơn hàng cần duyệt thành công.")
  },
  async ({ order_id }) => {
    try {
      console.log(`[MCP - approve_order] Approving order ID: ${order_id}`);

      // Check if order exists
      const checkStmt = db.prepare(`
        SELECT o.id, o.status, o.amount, c.name as customer_name, c.email as customer_email, p.name as product_name
        FROM orders o
        JOIN customers c ON o.customer_id = c.id
        JOIN products p ON o.product_id = p.id
        WHERE o.id = ?
      `);
      const order = checkStmt.get(order_id);

      if (!order) {
        return {
          isError: true,
          content: [{ type: "text", text: `Không tìm thấy đơn hàng có ID: ${order_id}` }]
        };
      }

      if (order.status === 'completed') {
        return {
          content: [{ type: "text", text: `Đơn hàng #${order_id} đã ở trạng thái thành công (completed) từ trước.` }]
        };
      }

      // Update status
      const updateStmt = db.prepare("UPDATE orders SET status = 'completed' WHERE id = ?");
      const info = updateStmt.run(order_id);

      if (info.changes === 0) {
        return {
          isError: true,
          content: [{ type: "text", text: `Không thể cập nhật đơn hàng #${order_id}` }]
        };
      }

      let emailStatus = "Không có địa chỉ email để gửi thư xác nhận.";
      if (order.customer_email) {
        console.log(`[MCP - approve_order] Sending confirmation email to: ${order.customer_email}`);
        const emailResult = await sendOrderConfirmationEmail({
          orderId: order_id,
          customerName: order.customer_name,
          customerEmail: order.customer_email,
          productName: order.product_name,
          amount: order.amount,
          status: 'completed'
        });
        if (emailResult.success) {
          emailStatus = `Đã tự động gửi email xác nhận thành công tới: ${order.customer_email}`;
        } else {
          emailStatus = `Lỗi gửi email xác nhận: ${JSON.stringify(emailResult.error)}`;
        }
      }

      const successText = `🎉 **Duyệt đơn hàng #${order_id} thành công!**\n` +
        `- **Khách hàng:** ${order.customer_name}\n` +
        `- **Sản phẩm:** ${order.product_name}\n` +
        `- **Số tiền:** ${parseFloat(order.amount).toLocaleString('vi-VN')}đ\n` +
        `- **Trạng thái:** pending ➔ **completed**\n` +
        `- **Gửi thư:** ${emailStatus}`;

      return {
        content: [{ type: "text", text: successText }]
      };
    } catch (err) {
      console.error("[MCP Error - approve_order]:", err.message);
      return {
        isError: true,
        content: [{ type: "text", text: `Lỗi duyệt đơn hàng: ${err.message}` }]
      };
    }
  }
);

// 4. Tool: save_post
server.tool(
  "save_post",
  "Lưu một bài viết hoặc nội dung kiến thức mới vào bảng knowledge của cơ sở dữ liệu.",
  {
    title: z.string().describe("Tiêu đề bài viết hoặc chủ đề."),
    content: z.string().describe("Nội dung chi tiết của bài viết.")
  },
  async ({ title, content }) => {
    try {
      console.log(`[MCP - save_post] Saving post: ${title}`);
      const stmt = db.prepare("INSERT INTO knowledge (title, content) VALUES (?, ?)");
      const info = stmt.run(title, content);
      
      if (info.changes > 0) {
        return {
          content: [{ type: "text", text: `Lưu bài viết thành công vào bảng knowledge với ID: ${info.lastInsertRowid}` }]
        };
      } else {
        return {
          isError: true,
          content: [{ type: "text", text: "Không có thay đổi nào được thực hiện trong database." }]
        };
      }
    } catch (err) {
      console.error("[MCP Error - save_post]:", err.message);
      return {
        isError: true,
        content: [{ type: "text", text: `Lỗi lưu bài viết: ${err.message}` }]
      };
    }
  }
);

// 5. Tool: get_new_leads
server.tool(
  "get_new_leads",
  "Lấy danh sách các khách hàng/lead mới đăng ký từ waitlist chưa được thông báo và tự động đánh dấu đã thông báo.",
  {
    limit: z.number().optional().describe("Số lượng khách hàng muốn lấy tối đa. Mặc định là 5.")
  },
  async ({ limit }) => {
    try {
      const limitVal = limit || 5;
      console.log(`[MCP - get_new_leads] Fetching up to ${limitVal} new leads...`);

      // 1. Get new leads (notified = 0)
      const fetchStmt = db.prepare(`
        SELECT id, name, phone, zalo, email, datetime(register_date, 'localtime') as register_date
        FROM customers
        WHERE notified = 0
        ORDER BY id ASC
        LIMIT ?
      `);
      const newLeads = fetchStmt.all(limitVal);

      if (newLeads.length === 0) {
        return {
          content: [{ type: "text", text: "Không có khách hàng mới nào." }]
        };
      }

      // 2. Mark them as notified (notified = 1)
      const updateStmt = db.prepare(`
        UPDATE customers
        SET notified = 1
        WHERE id = ?
      `);

      const updatedIds = [];
      newLeads.forEach(lead => {
        updateStmt.run(lead.id);
        updatedIds.push(lead.id);
      });
      console.log(`[MCP - get_new_leads] Marked leads as notified: ${updatedIds.join(', ')}`);

      let text = `Tìm thấy **${newLeads.length}** khách hàng mới đăng ký:\n`;
      newLeads.forEach((c, idx) => {
        text += `${idx + 1}. **${c.name}**\n` +
          `   - SĐT: \`${c.phone}\`\n` +
          `   - Email: \`${c.email || "Trống"}\`\n` +
          `   - Zalo: \`${c.zalo || "Trống"}\`\n` +
          `   - Ngày đăng ký: ${c.register_date}\n\n`;
      });

      return {
        content: [{ type: "text", text: text }]
      };
    } catch (err) {
      console.error("[MCP Error - get_new_leads]:", err.message);
      return {
        isError: true,
        content: [{ type: "text", text: `Lỗi lấy danh sách khách hàng mới: ${err.message}` }]
      };
    }
  }
);

// 8. Tool: generate_creative
server.tool(
  "generate_creative",
  "Tạo cả bài viết (caption) và ảnh minh họa DALL-E thực tế cho bài đăng Facebook. Kết quả được lưu cục bộ.",
  {
    topic: z.string().describe("Chủ đề hoặc ý tưởng của bài đăng."),
    image_prompt: z.string().describe("Mô tả chi tiết bằng tiếng Anh để sinh ảnh DALL-E (Phong cách chụp ảnh thực tế của người Việt).")
  },
  async ({ topic, image_prompt }) => {
    try {
      const { spawnSync } = require("child_process");
      console.log(`[MCP - generate_creative] Topic: ${topic}`);
      const scriptsDir = path.join(__dirname, "..", "skill-hoang", "tao-creative-fb", "scripts");
      
      // Run gen_caption.py
      console.log(`[MCP - generate_creative] Running gen_caption.py...`);
      const captionResult = spawnSync(
        "python", 
        ["gen_caption.py", topic, "organic"], 
        { cwd: scriptsDir, encoding: "utf8" }
      );
      
      if (captionResult.error || captionResult.status !== 0) {
        throw new Error(captionResult.stderr || "Lỗi chạy gen_caption.py");
      }
      
      // Run gen_image.py
      console.log(`[MCP - generate_creative] Running gen_image.py...`);
      const imageResult = spawnSync(
        "python", 
        ["gen_image.py", image_prompt, "live_post_image.png"], 
        { cwd: scriptsDir, encoding: "utf8" }
      );
      
      if (imageResult.error || imageResult.status !== 0) {
        throw new Error(imageResult.stderr || "Lỗi chạy gen_image.py");
      }
      
      // Read generated caption
      const captionPath = path.join(__dirname, "..", "skill-hoang", "tao-creative-fb", "output", "generated_caption_organic.txt");
      let caption = "";
      if (fs.existsSync(captionPath)) {
        caption = fs.readFileSync(captionPath, "utf8");
      } else {
        throw new Error("Không tìm thấy file caption được tạo ra.");
      }
      
      return {
        content: [
          {
            type: "text",
            text: `Tạo bài viết và ảnh thành công!\n\n**Nội dung bài viết (Caption Preview):**\n${caption}\n\n**Ảnh minh họa:** Đã vẽ xong và lưu tại thư mục \`output/live_post_image.png\`. Vui lòng gửi preview caption này cho sếp Hoàng duyệt.`
          }
        ]
      };
    } catch (err) {
      console.error("[MCP Error - generate_creative]:", err.message);
      return {
        isError: true,
        content: [{ type: "text", text: `Lỗi sinh nội dung: ${err.message}` }]
      };
    }
  }
);

// 9. Tool: post_to_facebook
server.tool(
  "post_to_facebook",
  "Đăng bài viết kèm ảnh đã được duyệt lên trang Facebook của sếp Hoàng.",
  {},
  async () => {
    try {
      const { spawnSync } = require("child_process");
      console.log(`[MCP - post_to_facebook] Posting to Facebook Page...`);
      const scriptsDir = path.join(__dirname, "..", "skill-hoang", "tao-creative-fb", "scripts");
      const imagePath = path.join(__dirname, "..", "skill-hoang", "tao-creative-fb", "output", "live_post_image.png");
      const captionPath = path.join(__dirname, "..", "skill-hoang", "tao-creative-fb", "output", "generated_caption_organic.txt");
      
      const postResult = spawnSync(
        "python", 
        ["post_facebook.py", imagePath, captionPath], 
        { cwd: scriptsDir, encoding: "utf8" }
      );
      
      if (postResult.error || postResult.status !== 0) {
        throw new Error(postResult.stderr || "Lỗi chạy post_facebook.py");
      }
      
      return {
        content: [{ type: "text", text: `Đăng lên Facebook thành công!\nChi tiết kết quả:\n${postResult.stdout}` }]
      };
    } catch (err) {
      console.error("[MCP Error - post_to_facebook]:", err.message);
      return {
        isError: true,
        content: [{ type: "text", text: `Lỗi đăng bài lên Facebook: ${err.message}` }]
      };
    }
  }
);

// ------------------- SERVER SETUP -------------------
const app = express();
app.use(express.json());

let transport;

app.get("/mcp", async (req, res) => {
  console.log(`[${new Date().toISOString()}] SSE Transport connect request received`);
  
  if (server.isConnected()) {
    console.log("McpServer is already connected to a transport. Closing old connection...");
    try {
      await server.close();
    } catch (err) {
      console.error("Error during closing old connection:", err.message);
    }
  }

  // SSE requires keeping response open
  transport = new SSEServerTransport("/mcp/messages", res);
  await server.connect(transport);
  console.log(`[${new Date().toISOString()}] SSE Transport connected`);

  req.on("close", async () => {
    console.log(`[${new Date().toISOString()}] SSE Connection closed by client`);
    try {
      if (server.isConnected()) {
        await server.close();
        console.log(`[${new Date().toISOString()}] Server disconnected from transport.`);
      }
    } catch (err) {
      console.error("Error closing server on connection close:", err.message);
    }
  });
});

app.post("/mcp/messages", async (req, res) => {
  console.log(`[${new Date().toISOString()}] Received POST message`);
  if (transport) {
    await transport.handlePostMessage(req, res, req.body);
  } else {
    res.status(500).send("No active SSE transport channel established.");
  }
});

const PORT = 3001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`\n==================================================`);
  console.log(`🚀 MCP SERVER FOR AI AGENT ĐANG CHẠY CỤC BỘ`);
  console.log(`👉 Endpoint SSE: http://localhost:${PORT}/mcp`);
  console.log(`==================================================\n`);
});
