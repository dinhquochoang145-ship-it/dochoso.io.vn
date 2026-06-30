import sqlite3
import os
import sys

# Ensure UTF-8 output on Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def update_positioning_db():
    db_name = "brain.db"
    
    if not os.path.exists(db_name):
        print(f"Lỗi: Không tìm thấy database '{db_name}' trong thư mục hiện tại.")
        return

    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()

    title = "Định vị & Xử lý từ chối - DNA Kinh Doanh"
    
    content = """[Câu Định Vị]
Đừng bắt đầu kinh doanh bằng cảm tính. Hãy bắt đầu bằng bản đồ DNA của chính bạn. Trước khi hỏi "nên kinh doanh gì?", hãy hiểu "mình hợp kinh doanh theo kiểu nào". DNA Kinh Doanh giúp bạn có bản đồ đó.

[3 Điểm Khác Biệt Cốt Lõi]
- Chuyển hóa học thuật thành chỉ số hành động: Chúng tôi dịch lá số phức tạp thành các chỉ số thực chiến rõ ràng (tướng tiên phong hay quân sư, đi nhanh hay đi chậm, sales hay hệ thống).
- Tuyệt đối không bán vật phẩm phong thủy hay cúng bái: Tập trung 100% vào năng lực tự thân và cách quản trị. "Bản thân bạn chính là phong thủy mạnh nhất", không dọa dẫm để ép mua đồ giải hạn.
- Giải pháp ứng biến thực chiến lập tức: Cung cấp cẩm nang giải quyết bài toán vận hành thực tế (cách nói chuyện với đối tác xung khắc, cách xếp nhân sự lệch mệnh tạo kết quả tốt nhất).

[Kịch Bản Xử Lý Từ Chối]
- Khách chê đắt/so sánh với xem online miễn phí: "Dạ em hiểu chi phí luôn quan trọng. Bên khác cung cấp lá số lập sẵn chung chung. Ở DNA Kinh Doanh, anh/chị mua một bản thiết kế hành động được cá nhân hóa sâu sắc cho mô hình thực tế của mình, giúp tránh những cú ngã thử sai trị giá hàng trăm triệu đồng."
- Khách hỏi về vật phẩm/cúng bái bổ trợ: "Các bên khác bán vật phẩm phong thủy để bổ trợ niềm tin tâm lý. DNA Kinh Doanh tin rằng 'Con người là gốc của phong thủy'. Khi anh/chị hiểu rõ bản thân, biết dùng người và quản trị rõ ràng, đó mới là phong thủy mạnh nhất giúp doanh nghiệp đứng vững, chứ không có vật phẩm nào gánh thay được năng lực vận hành."

[Vì Sao Chọn Chúng Tôi]
Chọn chúng tôi nếu bạn muốn có một bản thiết kế hành động thực chiến để tự làm chủ công việc kinh doanh, thay vì mua một lá số định mệnh để phó thác cho số phận.

[Chiến Lược Định Giá & Xử Lý Khách Chê Đắt]
- Mức giá gợi ý: 3.800.000 VNĐ cho gói Bản đồ DNA Kinh Doanh + Luận giải 1-1 (60 phút) - Định vị mức giá Cao hơn trung bình thị trường.
- Lý do đặt giá cao:
  + ROI cực kỳ cao cho doanh nghiệp (tránh tuyển sai người mất 20-30 triệu lương, ký sai đối tác mất hàng trăm triệu).
  + Cam kết không bán chéo vật phẩm (No-upsell): Đối thủ lấy rẻ rồi dọa ép mua đồ phong thủy, chúng tôi thu phí cao nhưng cam kết không bán vật phẩm.
  + Lọc tệp khách hàng nghiêm túc, thực chiến.
- Câu nói khi khách chê đắt: "Anh/chị không trả tiền để nghe dự đoán số phận, mà đang đầu tư một khoản phí nhỏ để mua tấm bản đồ giúp bảo vệ hàng trăm triệu đồng vốn liếng khỏi những quyết định sai lầm." """

    # Cập nhật bản ghi có ID = 3 (hoặc chèn nếu chưa có, nhưng chúng ta đã biết nó có ID=3)
    cursor.execute(
        "UPDATE business SET content = ? WHERE id = 3",
        (content.strip(),)
    )
    
    # Kiểm tra xem có dòng nào được cập nhật không
    if cursor.rowcount == 0:
        cursor.execute(
            "INSERT INTO business (id, title, content) VALUES (3, ?, ?)",
            (title, content.strip())
        )
        print("Đã thêm mới bản ghi định vị thương hiệu vào bảng 'business'.")
    else:
        print("Đã cập nhật bản ghi định vị thương hiệu thành công trong bảng 'business'.")
        
    conn.commit()
    conn.close()

if __name__ == "__main__":
    update_positioning_db()
