const { DatabaseSync } = require('node:sqlite');
const fs = require('fs');
const path = require('path');

const dbPath = 'e:/TỬ VI ADS/my brain DNA/brain.db';
const outputDir = 'e:/TỬ VI ADS/vault-ready';

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const db = new DatabaseSync(dbPath);

// Helper function to count words in a string
function countWords(str) {
  if (!str) return 0;
  return str.trim().split(/\s+/).filter(w => w.length > 0).length;
}

// 1. Export brand_voice -> brand-voice.md
function exportBrandVoice() {
  const rows = db.prepare("SELECT title, content FROM brand_voice").all();
  let md = "# Brand Voice\n\n";
  md += "Đây là giọng văn, tông giọng và phong cách viết chính thức của thương hiệu. Xem thêm tại [[index]].\n\n";
  
  rows.forEach(row => {
    md += `## ${row.title}\n`;
    md += `${row.content}\n\n`;
  });
  
  fs.writeFileSync(path.join(outputDir, 'brand-voice.md'), md, 'utf8');
  console.log('Exported brand-voice.md');
}

// 2. Export knowledge -> knowledge-base.md
function exportKnowledge() {
  const rows = db.prepare("SELECT title, content FROM knowledge").all();
  let md = "# Knowledge Base\n\n";
  md += "Tài liệu kiến thức chuyên môn và thông tin tham khảo. Xem thêm tại [[index]].\n\n";
  
  rows.forEach(row => {
    md += `## ${row.title}\n`;
    md += `${row.content}\n\n`;
  });
  
  fs.writeFileSync(path.join(outputDir, 'knowledge-base.md'), md, 'utf8');
  console.log('Exported knowledge-base.md');
}

// 3. Export business -> my-business.md
function exportBusiness() {
  const rows = db.prepare("SELECT title, content FROM business").all();
  let md = "# My Business Info\n\n";
  md += "Thông tin về sản phẩm, khách hàng mục tiêu và định vị kinh doanh. Xem thêm sản phẩm tại [[products]].\n\n";
  
  rows.forEach(row => {
    md += `## ${row.title}\n`;
    md += `${row.content}\n\n`;
  });
  
  fs.writeFileSync(path.join(outputDir, 'my-business.md'), md, 'utf8');
  console.log('Exported my-business.md');
}

// 4. Export products -> products.md
function exportProducts() {
  const rows = db.prepare("SELECT id, name, type, price, description, stock FROM products").all();
  let md = "# Products\n\n";
  md += "Danh sách các sản phẩm và dịch vụ hiện có. Các thông tin kinh doanh khác xem tại [[my-business]].\n\n";
  md += "| ID | Tên sản phẩm | Loại | Đơn giá | Mô tả | Kho hàng |\n";
  md += "| --- | --- | --- | --- | --- | --- |\n";
  
  rows.forEach(row => {
    const stockStr = row.stock !== null ? row.stock : "N/A";
    const priceStr = parseFloat(row.price).toLocaleString('vi-VN') + 'đ';
    md += `| ${row.id} | ${row.name} | ${row.type} | ${priceStr} | ${row.description || ""} | ${stockStr} |\n`;
  });
  
  fs.writeFileSync(path.join(outputDir, 'products.md'), md, 'utf8');
  console.log('Exported products.md');
}

// 5. Export customers -> customers.md
function exportCustomers() {
  const rows = db.prepare("SELECT id, name, phone, zalo, register_date, email, notified FROM customers").all();
  let md = "# Customers & Leads\n\n";
  md += "Danh sách khách hàng và lượt đăng ký waitlist. Xem các đơn hàng liên quan tại [[orders]].\n\n";
  md += "| ID | Họ tên | Số điện thoại | Zalo | Ngày đăng ký | Email | Đã thông báo |\n";
  md += "| --- | --- | --- | --- | --- | --- | --- |\n";
  
  rows.forEach(row => {
    const notifiedStr = row.notified === 1 ? "Đã nhắn" : "Chưa nhắn";
    md += `| ${row.id} | ${row.name} | ${row.phone} | ${row.zalo || ""} | ${row.register_date} | ${row.email || ""} | ${notifiedStr} |\n`;
  });
  
  fs.writeFileSync(path.join(outputDir, 'customers.md'), md, 'utf8');
  console.log('Exported customers.md');
}

// 6. Export orders -> orders.md
function exportOrders() {
  const rows = db.prepare(`
    SELECT o.id, c.name as customer_name, p.name as product_name, o.amount, o.status, o.order_date
    FROM orders o
    JOIN customers c ON o.customer_id = c.id
    JOIN products p ON o.product_id = p.id
  `).all();
  
  let md = "# Orders\n\n";
  md += "Danh sách đơn hàng của hệ thống. Xem thông tin khách hàng tại [[customers]].\n\n";
  md += "| ID | Khách hàng | Sản phẩm | Số tiền | Trạng thái | Ngày đặt |\n";
  md += "| --- | --- | --- | --- | --- | --- |\n";
  
  rows.forEach(row => {
    const amountStr = parseFloat(row.amount).toLocaleString('vi-VN') + 'đ';
    md += `| ${row.id} | ${row.customer_name} | ${row.product_name} | ${amountStr} | ${row.status} | ${row.order_date} |\n`;
  });
  
  fs.writeFileSync(path.join(outputDir, 'orders.md'), md, 'utf8');
  console.log('Exported orders.md');
}

// 7. Export scheduled_emails -> scheduled-emails.md
function exportScheduledEmails() {
  let rows = [];
  try {
    rows = db.prepare("SELECT id, order_id, email, subject, status, scheduled_time FROM scheduled_emails").all();
  } catch (err) {
    console.log('Table scheduled_emails might not have data or exist:', err.message);
    return;
  }
  
  let md = "# Scheduled Emails\n\n";
  md += "Danh sách các email lên lịch gửi tự động liên quan tới [[orders]].\n\n";
  md += "| ID | Đơn hàng ID | Email nhận | Tiêu đề | Trạng thái | Lịch gửi |\n";
  md += "| --- | --- | --- | --- | --- | --- |\n";
  
  rows.forEach(row => {
    md += `| ${row.id} | ${row.order_id} | ${row.email} | ${row.subject} | ${row.status} | ${row.scheduled_time} |\n`;
  });
  
  fs.writeFileSync(path.join(outputDir, 'scheduled-emails.md'), md, 'utf8');
  console.log('Exported scheduled-emails.md');
}

// 8. Generate index.md
function generateIndex() {
  let md = "# Knowledge Vault Index\n\n";
  md += "Chào mừng bạn đến với Bộ não thứ 2 (Second Brain) của chúng tôi. Dưới đây là mục lục các tài liệu đã được trích xuất:\n\n";
  md += "## 🧠 Bản sắc thương hiệu & Kiến thức\n";
  md += "- [[brand-voice]]: Giọng văn, tông giọng, phong cách viết.\n";
  md += "- [[knowledge-base]]: Kiến thức chuyên môn, tài liệu lưu trữ.\n";
  md += "- [[my-business]]: Định vị kinh doanh, thông tin chung.\n\n";
  md += "## 📊 Dữ liệu vận hành (Database)\n";
  md += "- [[products]]: Danh sách sản phẩm và dịch vụ.\n";
  md += "- [[customers]]: Danh sách khách hàng & Waitlist đăng ký.\n";
  md += "- [[orders]]: Nhật ký các đơn hàng phát sinh.\n";
  
  if (fs.existsSync(path.join(outputDir, 'scheduled-emails.md'))) {
    md += "- [[scheduled-emails]]: Các email được lên lịch gửi đi.\n";
  }
  
  fs.writeFileSync(path.join(outputDir, 'index.md'), md, 'utf8');
  console.log('Generated index.md');
}

// Run exports
exportBrandVoice();
exportKnowledge();
exportBusiness();
exportProducts();
exportCustomers();
exportOrders();
exportScheduledEmails();
generateIndex();

// Summary count
const files = fs.readdirSync(outputDir).filter(f => f.endsWith('.md'));
let totalWords = 0;
files.forEach(f => {
  const content = fs.readFileSync(path.join(outputDir, f), 'utf8');
  totalWords += countWords(content);
});

console.log(`\n=== EXPORT REPORT ===`);
console.log(`- Total Files generated: \${files.length} files`);
console.log(`- Files: \${files.join(', ')}`);
console.log(`- Total Words: \${totalWords} words`);
