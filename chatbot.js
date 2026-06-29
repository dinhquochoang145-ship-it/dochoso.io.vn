(function() {
  // 1. Dữ liệu kịch bản Chatbot (Từ sales_script.md và bối cảnh website)
  const chatbotData = {
    greeting: `Chào bạn.

Rất vui vì bạn đã ghé qua góc nhỏ của DNA Kinh Doanh.

Mình không phải là một con bot tự động được lập trình để spam tin nhắn hay ép bạn mua hàng ngay đâu. 

Thật ra, mình ở đây để giúp bạn nhìn nhận lại việc kinh doanh dưới một góc nhìn khác. Trực chiến và thực tế hơn.

Bạn thử nghĩ xem, trước khi hỏi "nên kinh doanh gì?", có bao giờ bạn tự hỏi "mình hợp kinh doanh theo kiểu nào" chưa?

Để mình hỗ trợ bạn tốt nhất, bạn đang ở trong trường hợp nào dưới đây thế?`,
    
    welcomeOptions: [
      { text: "🛠️ Mình chuẩn bị khởi nghiệp, chưa rõ hướng đi.", next: "show_faqs" },
      { text: "⚠️ Mình đang vận hành doanh nghiệp nhưng gặp rối ren.", next: "show_faqs" },
      { text: "📖 Muốn tìm hiểu kỹ hơn về Bản Đồ DNA Kinh Doanh.", next: "show_faqs" }
    ],

    faqsPrompt: `Cảm ơn bạn đã chia sẻ. Để giúp bạn nhanh nhất, dưới đây là danh sách những câu hỏi mọi người thường quan tâm nhất về DNA Kinh Doanh.

Bạn bấm vào câu hỏi hoặc tự nhập câu hỏi vào ô chat bên dưới nhé:`,

    faqs: [
      {
        id: "q1",
        question: "1. Bản Đồ DNA Kinh Doanh có cam kết tôi sẽ thành công?",
        answer: `Thật ra là không bạn ạ. 

Chúng mình tuyệt đối không hứa hẹn sự giàu sang. Cũng không cam kết doanh nghiệp của bạn chắc chắn thành công. 

Kinh doanh thành bại phụ thuộc vào rất nhiều yếu tố. Từ năng lực thực thi, sự nhạy bén thị trường cho đến nỗ lực của chính bạn. 

Điều quan trọng là: Bản đồ này cung cấp cho bạn một công cụ phản tư chiến lược. 

Nó chỉ ra điểm mạnh, điểm yếu, chu kỳ năng lượng và các điểm mù của bạn. 

Nó giúp bạn ra quyết định tỉnh táo hơn. Để từ đó tránh được những cú ngã thử sai trị giá hàng chục, hàng trăm triệu đồng do cảm tính.`
      },
      {
        id: "q2",
        question: "2. Khác biệt lớn nhất với Tử Vi thông thường ngoài kia?",
        answer: `Tử vi thông thường ngoài kia hay phán chung chung kiểu \"số bạn hợp làm quan\", hoặc dọa dẫm vận hạn để ép bạn mua vật phẩm phong thủy giải hạn.

DNA Kinh Doanh tiếp cận theo hướng quản trị và thực chiến hơn nhiều. 

Nếu bạn để ý, chúng mình tập trung vào 3 điểm khác biệt lớn:

Một là, dịch lá số thành chỉ số hành động rõ ràng. Bạn hợp làm solo hay xây hệ thống? Bạn là tướng tiên phong đi sales hay quân sư quản trị tài chính phía sau?

Hai là, đưa ra giải pháp ứng biến cụ thể. Cách làm việc với đối tác xung khắc tuổi, cách sắp xếp vị trí nhân sự lệch mệnh để tạo kết quả tốt nhất.

Ba là, cam kết tuyệt đối không bán vật phẩm phong thủy hay cúng bái. Chúng mình tin bản thân bạn mới là phong thủy mạnh nhất.`
      },
      {
        id: "q3",
        question: "3. Khác gì trang xem online miễn phí hay bài luận giải tự động?",
        answer: `Dạ đúng là hiện tại trên mạng có rất nhiều trang web xuất lá số miễn phí hoặc phí rất rẻ. 

Nhưng vấn đề nằm ở chỗ: các phần mềm đó chỉ ghép các đoạn văn mẫu chung chung theo thuật toán thô sơ. Đọc nghe rất mơ hồ và gần như không có tính ứng dụng.

Ở DNA Kinh Doanh, điểm khác biệt là sự cá nhân hóa sâu sắc. 

Chúng mình kết hợp lá số với chính bối cảnh kinh doanh thực tế hiện tại của bạn. 

Hơn nữa, gói dịch vụ đi kèm 60 phút luận giải trực tiếp 1-1 với chuyên gia. 

Chuyên gia sẽ cùng bạn tháo gỡ chính xác những nút thắt mà bạn đang gặp phải. Điều này thì không máy móc nào làm thay người thật được.`
      },
      {
        id: "q4",
        question: "4. Mức giá 3.800.000đ sao đắt thế em? Rẻ hơn thì tốt.",
        answer: `Mình hiểu chi phí 3.800.000đ luôn là khoản tiền cần cân nhắc kỹ. 

Nhưng bạn thử nghĩ xem. Đây không phải khoản chi tiêu giải trí để nghe dự đoán tương lai cho vui tai. 

Đây là khoản đầu tư bảo hiểm cho vốn liếng kinh doanh của bạn. 

Phí 3.8 triệu này có thể giúp bạn tránh tuyển sai một nhân sự chủ chốt (mất 20-30 triệu lương mỗi tháng). Hoặc tránh ký sai một hợp đồng hợp tác không hợp tính cách gây thiệt hại hàng trăm triệu đồng. 

Đặc biệt, chúng mình cam kết không bán chéo (No-Upsell). 

Nhiều nơi lấy phí ban đầu rất rẻ, chỉ vài trăm ngàn. Nhưng sau đó họ sẽ dọa dẫm vận hạn để ép bạn mua hàng chục triệu tiền đá phong thủy hoặc làm lễ cúng bái. 

Chúng mình thu phí cao ngay từ đầu để cam kết tập trung luận giải thực chiến, bảo mật thông tin và tuyệt đối không bán kèm bất kỳ dịch vụ phong thủy đi kèm nào.`
      },
      {
        id: "q5",
        question: "5. Chưa có ý tưởng cụ thể có dùng được không?",
        answer: `Được chứ bạn. Và thật ra đây lại là thời điểm phù hợp nhất.

Khi chưa xuống tiền đầu tư, bạn đang đứng trước rất nhiều ngã rẽ. 

Bản đồ DNA Kinh Doanh sẽ giúp bạn khoanh vùng 3 hướng ngành phù hợp nhất với năng lực thiên bẩm của bạn. Đồng thời cảnh báo 2 hướng ngành rủi ro lớn dễ gặp cản trở.

Đừng vội vung tiền thử sai khi chưa rõ bản thân. Bản đồ sẽ giúp bạn tiết kiệm hàng tháng trời phân vân rối bời và tránh được việc đầu tư sai lầm ngay từ đầu.`
      },
      {
        id: "q6",
        question: "6. Có bán phong thủy hay làm lễ cúng gì hỗ trợ không?",
        answer: `Tuyệt đối không bạn ạ.

Tại DNA Kinh Doanh, chúng mình tin rằng "Con người là gốc của phong thủy". 

Khi bạn hiểu rõ bản thân, biết dùng người đúng chỗ, biết co duỗi dòng tiền đúng nhịp theo chu kỳ năng lượng, đó mới là phong thủy mạnh nhất giúp doanh nghiệp của bạn đứng vững.

Chúng mình cam kết không hù dọa vận hạn để ép bạn mua đá phong thủy hay làm lễ cúng bái đắt đỏ. 

Mọi giải pháp của chúng mình đều đi từ năng lực tự thân và cách quản trị thực tế.`
      },
      {
        id: "q7",
        question: "7. Quy trình đăng ký và nhận bản đồ diễn ra thế nào?",
        answer: `Quy trình đăng ký rất đơn giản, gồm 4 bước:

Bước 1: Bạn điền form đăng ký (gồm Họ tên, ngày giờ sinh chính xác, bối cảnh công việc và những trăn trở lớn nhất của bạn).

Bước 2: Chuyển khoản thanh toán phí dịch vụ (3.800.000đ).

Bước 3: Đội ngũ chuyên gia tiến hành luận giải và đóng gói báo cáo cá nhân hóa. Bàn giao file PDF Bản Đồ và Sổ Tay DNA 1 trang qua Email/Zalo trong vòng 72 giờ làm việc.

Bước 4: Bạn đặt lịch hẹn luận giải trực tiếp 1-1 (60 phút) qua Zoom/Zalo với chuyên gia để làm rõ báo cáo và lên giải pháp ứng biến ngay lập tức.`
      },
      {
        id: "q8",
        question: "8. Có tư vấn đầu cơ tài chính, lướt sóng coin/đất không?",
        answer: `Tuyệt đối không bạn ạ.

DNA Kinh Doanh chỉ phục vụ cho những người muốn xây dựng mô hình kinh doanh, dịch vụ, sản xuất hoặc thương mại bền vững. 

Chúng mình không đưa ra lời khuyên đầu cơ tài chính ngắn hạn, lướt sóng hay các hình thức đặt cược rủi ro cao. 

Nếu bạn tìm kiếm các dự báo may rủi để làm giàu nhanh, dịch vụ này không dành cho bạn.`
      },
      {
        id: "q9",
        question: "9. Có thực sự giúp ích gì không hay chỉ là bói toán?",
        answer: `Chúng mình hiểu sự e ngại của bạn. Rất nhiều người ngoài kia đang đánh đồng Tử Vi với bói toán mê tín.

Nhưng hãy nhìn theo cách này. 

Chúng mình coi Tử Vi là một công cụ phản tư chiến lược. Nó tương tự như bài trắc nghiệm tính cách MBTI hay DISC của phương Tây. Nhưng sâu sắc hơn vì có thêm hệ quy chiếu về thời gian (chu kỳ năng lượng phát triển).

Bản đồ giúp bạn nhận diện điểm mù mà bình thường bản thân không tự thấy được. Đồng thời dự báo các chu kỳ thuận lợi hay khó khăn để bạn chuẩn bị nguồn lực dòng tiền.

Quyết định cuối cùng vẫn nằm ở hành động của bạn. Bản đồ đóng vai trò là một người bạn đồng hành cung cấp góc nhìn tỉnh táo, khách quan.`
      },
      {
        id: "q10",
        question: "10. Cam kết giao hàng và chính sách hoàn tiền thế nào?",
        answer: `Chúng mình cam kết bàn giao Bản Đồ PDF và Sổ Tay DNA trong vòng đúng 72 giờ làm việc. Kể từ khi nhận đủ thông tin sinh và bối cảnh kinh doanh của bạn.

Chúng mình có chính sách cam kết chất lượng rõ ràng: 

Hoàn tiền 100% không cần lý do nếu báo cáo giao trễ hoặc thiếu bất kỳ chương nào trong cam kết 5 chương cốt lõi.

Đồng thời, mọi thông tin cá nhân, lá số và bối cảnh kinh doanh của bạn đều được chúng mình bảo mật tuyệt đối.`
      }
    ],

    closing: `Nếu bạn thấy những chia sẻ của mình phù hợp với định hướng của bạn.

Và bạn đã sẵn sàng sở hữu một bản thiết kế hành động thực chiến để bảo vệ nguồn vốn, tự làm chủ công việc kinh doanh thay vì phó thác cho số phận.

Hãy điền thông tin vào form đăng ký nhé. Mình đang cuộn màn hình tới khu vực đăng ký giúp bạn...`,

    formRedirect: `Mình hiểu bạn cần thêm thời gian để cân nhắc kỹ lưỡng. Kinh doanh là lâu dài, không nên vội vàng.

Để bạn có cái nhìn thực tế và khách quan nhất xem một Bản Đồ DNA Kinh Doanh thực chiến trông như thế nào, mình đã chuẩn bị sẵn một bản báo cáo mẫu.

Bạn điền nhanh thông tin vào form đăng ký ở dưới, hệ thống sẽ gửi file PDF báo cáo mẫu qua Email hoặc Zalo cho bạn ngay lập tức nhé. Mình đang cuộn tới form...`
  };

  // 2. Chèn CSS của Chatbot vào thẻ <head>
  const styles = `
    .dna-chatbot-bubble {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--gold), var(--gold-2));
      box-shadow: 0 8px 32px rgba(233, 184, 93, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 99999;
      transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s;
    }
    .dna-chatbot-bubble:hover {
      transform: scale(1.1);
      box-shadow: 0 12px 40px rgba(233, 184, 93, 0.55);
    }
    .dna-chatbot-bubble svg {
      width: 26px;
      height: 26px;
      fill: #21150a;
    }
    
    .dna-chatbot-container {
      position: fixed;
      bottom: 96px;
      right: 24px;
      width: 380px;
      height: 580px;
      max-height: calc(100vh - 120px);
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow);
      z-index: 99999;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      font-family: inherit;
      opacity: 0;
      transform: translateY(20px) scale(0.95);
      pointer-events: none;
      transition: opacity 0.3s, transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .dna-chatbot-container.active {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: all;
    }
    
    .dna-chatbot-header {
      padding: 16px 20px;
      background: var(--panel-2);
      border-bottom: 1px solid var(--line);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .dna-chatbot-header-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .dna-chatbot-avatar {
      width: 32px;
      height: 32px;
      border-radius: 12px;
      background: linear-gradient(135deg, var(--gold), var(--gold-2));
      color: #21150a;
      display: grid;
      place-items: center;
      font-weight: 800;
      font-size: 13px;
    }
    .dna-chatbot-title-group {
      display: flex;
      flex-direction: column;
    }
    .dna-chatbot-title {
      font-weight: 700;
      font-size: 14.5px;
      color: var(--text);
      line-height: 1.2;
    }
    .dna-chatbot-status {
      font-size: 11px;
      color: var(--success);
      display: flex;
      align-items: center;
      gap: 4px;
      margin-top: 2px;
    }
    .dna-chatbot-status::before {
      content: "";
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--success);
      box-shadow: 0 0 8px var(--success);
    }
    .dna-chatbot-close {
      background: transparent;
      border: none;
      color: var(--muted);
      font-size: 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      transition: background 0.2s;
    }
    .dna-chatbot-close:hover {
      background: rgba(255,255,255,0.06);
      color: var(--text);
    }
    
    .dna-chatbot-body {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 16px;
      background: linear-gradient(180deg, var(--panel) 0%, var(--bg-2) 100%);
      scroll-behavior: smooth;
    }
    
    .dna-chatbot-body::-webkit-scrollbar {
      width: 6px;
    }
    .dna-chatbot-body::-webkit-scrollbar-track {
      background: transparent;
    }
    .dna-chatbot-body::-webkit-scrollbar-thumb {
      background: rgba(255, 232, 190, 0.1);
      border-radius: 10px;
    }
    .dna-chatbot-body::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 232, 190, 0.2);
    }

    .dna-chat-msg {
      max-width: 85%;
      padding: 12px 16px;
      border-radius: var(--radius-md);
      font-size: 14px;
      line-height: 1.5;
      word-wrap: break-word;
      white-space: pre-wrap;
      animation: dna-fade-in 0.3s ease;
    }
    .dna-chat-msg.bot {
      background: rgba(255, 248, 238, 0.03);
      border: 1px solid var(--line);
      color: var(--text);
      align-self: flex-start;
      border-top-left-radius: 4px;
    }
    .dna-chat-msg.user {
      background: linear-gradient(135deg, var(--gold), var(--gold-2));
      color: #21150a;
      align-self: flex-end;
      border-top-right-radius: 4px;
      font-weight: 600;
    }
    
    .dna-chat-typing {
      align-self: flex-start;
      background: rgba(255, 248, 238, 0.03);
      border: 1px solid var(--line);
      padding: 12px 18px;
      border-radius: var(--radius-md);
      border-top-left-radius: 4px;
      display: flex;
      gap: 5px;
      animation: dna-fade-in 0.2s ease;
    }
    .dna-chat-typing span {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--soft);
      animation: dna-typing 1.2s infinite ease-in-out;
    }
    .dna-chat-typing span:nth-child(2) { animation-delay: 0.2s; }
    .dna-chat-typing span:nth-child(3) { animation-delay: 0.4s; }
    
    @keyframes dna-typing {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-4px); }
    }
    @keyframes dna-fade-in {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .dna-chat-options {
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 100%;
      animation: dna-fade-in 0.4s ease;
    }
    .dna-chat-opt-btn {
      background: rgba(255, 248, 238, 0.04);
      border: 1px solid var(--line);
      border-radius: 12px;
      padding: 10px 14px;
      color: var(--muted);
      font-size: 13.5px;
      text-align: left;
      cursor: pointer;
      transition: all 0.2s ease;
      width: 100%;
      line-height: 1.4;
      font-family: inherit;
    }
    .dna-chat-opt-btn:hover {
      background: rgba(255, 248, 238, 0.1);
      border-color: var(--gold-2);
      color: var(--text);
      transform: translateX(4px);
    }
    
    .dna-chat-opt-btn.action-primary {
      background: linear-gradient(135deg, var(--gold), var(--gold-2));
      color: #21150a;
      font-weight: 800;
      border: none;
      text-align: center;
      box-shadow: 0 4px 14px rgba(233, 184, 93, 0.2);
    }
    .dna-chat-opt-btn.action-primary:hover {
      transform: scale(1.02);
      box-shadow: 0 6px 18px rgba(233, 184, 93, 0.35);
    }
    
    .dna-chat-opt-btn.action-secondary {
      background: rgba(255, 248, 238, 0.07);
      border: 1px solid var(--gold);
      color: var(--gold-2);
      font-weight: 700;
      text-align: center;
    }
    .dna-chat-opt-btn.action-secondary:hover {
      background: rgba(255, 248, 238, 0.15);
      transform: scale(1.02);
    }

    .dna-chat-opt-btn.back-menu {
      border-color: rgba(255,255,255,0.08);
      color: var(--soft);
      font-weight: 500;
      text-align: center;
    }
    .dna-chat-opt-btn.back-menu:hover {
      background: rgba(255,255,255,0.05);
      transform: none;
    }
    
    /* Khu vực Input chat */
    .dna-chatbot-input-area {
      padding: 12px 16px;
      background: var(--panel-2);
      border-top: 1px solid var(--line);
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .dna-chatbot-input-area input {
      flex: 1;
      background: rgba(255, 248, 238, 0.04);
      border: 1px solid var(--line);
      border-radius: 99px;
      padding: 10px 16px;
      color: var(--text);
      font-size: 13.5px;
      outline: none;
      font-family: inherit;
      transition: border-color 0.2s;
    }
    .dna-chatbot-input-area input:focus {
      border-color: var(--gold);
    }
    .dna-chatbot-input-area button {
      background: linear-gradient(135deg, var(--gold), var(--gold-2));
      border: none;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: transform 0.2s;
    }
    .dna-chatbot-input-area button:hover {
      transform: scale(1.08);
    }
    .dna-chatbot-input-area button svg {
      width: 16px;
      height: 16px;
      fill: #21150a;
    }
    
    @media (max-width: 480px) {
      .dna-chatbot-container {
        width: calc(100% - 32px);
        height: calc(100vh - 100px);
        bottom: 84px;
        right: 16px;
        border-radius: var(--radius-md);
      }
      .dna-chatbot-bubble {
        bottom: 16px;
        right: 16px;
        width: 50px;
        height: 50px;
      }
    }
  `;

  // 3. Tạo cấu trúc DOM cho Chatbot
  const bubbleDiv = document.createElement("div");
  bubbleDiv.className = "dna-chatbot-bubble";
  bubbleDiv.id = "dnaChatBubble";
  bubbleDiv.innerHTML = `
    <svg viewBox="0 0 24 24">
      <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
    </svg>
  `;

  const containerDiv = document.createElement("div");
  containerDiv.className = "dna-chatbot-container";
  containerDiv.id = "dnaChatContainer";
  containerDiv.innerHTML = `
    <div class="dna-chatbot-header">
      <div class="dna-chatbot-header-info">
        <div class="dna-chatbot-avatar">DNA</div>
        <div class="dna-chatbot-title-group">
          <div class="dna-chatbot-title">Trợ lý DNA Kinh Doanh</div>
          <div class="dna-chatbot-status">Đang trực tuyến</div>
        </div>
      </div>
      <button class="dna-chatbot-close" id="dnaChatClose">&times;</button>
    </div>
    <div class="dna-chatbot-body" id="dnaChatBody"></div>
    <div class="dna-chatbot-input-area">
      <input type="text" id="dnaChatInput" placeholder="Nhập câu hỏi của bạn..." />
      <button id="dnaChatSendBtn">
        <svg viewBox="0 0 24 24">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
        </svg>
      </button>
    </div>
  `;

  // Chèn CSS và HTML vào trang
  const styleEl = document.createElement("style");
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);
  document.body.appendChild(bubbleDiv);
  document.body.appendChild(containerDiv);

  // 4. Các Elements cần điều khiển
  const chatBubble = document.getElementById("dnaChatBubble");
  const chatContainer = document.getElementById("dnaChatContainer");
  const chatClose = document.getElementById("dnaChatClose");
  const chatBody = document.getElementById("dnaChatBody");
  const chatInput = document.getElementById("dnaChatInput");
  const chatSendBtn = document.getElementById("dnaChatSendBtn");

  let isInitialized = false;

  // 5. Logic xử lý hội thoại
  function scrollToBottom() {
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function showTyping() {
    const typingDiv = document.createElement("div");
    typingDiv.className = "dna-chat-typing";
    typingDiv.id = "dnaTyping";
    typingDiv.innerHTML = "<span></span><span></span><span></span>";
    chatBody.appendChild(typingDiv);
    scrollToBottom();
  }

  function removeTyping() {
    const typing = document.getElementById("dnaTyping");
    if (typing) {
      typing.remove();
    }
  }

  function appendMessage(sender, text) {
    const msgDiv = document.createElement("div");
    msgDiv.className = `dna-chat-msg ${sender}`;
    msgDiv.textContent = text;
    chatBody.appendChild(msgDiv);
    scrollToBottom();
  }

  function appendOptions(options) {
    const optionsDiv = document.createElement("div");
    optionsDiv.className = "dna-chat-options";
    
    options.forEach(opt => {
      const btn = document.createElement("button");
      btn.className = `dna-chat-opt-btn ${opt.class || ""}`;
      btn.textContent = opt.text;
      btn.onclick = function() {
        // Xóa danh sách lựa chọn cũ
        optionsDiv.remove();
        handleUserChoice(opt);
      };
      optionsDiv.appendChild(btn);
    });
    
    chatBody.appendChild(optionsDiv);
    scrollToBottom();
  }

  function triggerSmoothScroll() {
    const target = document.getElementById("dang-ky");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
      
      // Focus vào ô input đầu tiên
      const nameInput = document.getElementById("name");
      if (nameInput) {
        setTimeout(() => {
          nameInput.focus();
          
          // Thêm hiệu ứng nhấp nháy làm nổi bật form đăng ký
          target.style.transition = "outline 0.3s ease";
          target.style.outline = "2px solid var(--gold)";
          setTimeout(() => {
            target.style.outline = "2px solid transparent";
            setTimeout(() => {
              target.style.outline = "2px solid var(--gold)";
              setTimeout(() => {
                target.style.outline = "none";
              }, 400);
            }, 300);
          }, 1000);
        }, 800);
      }
    }
  }

  function handleUserChoice(option) {
    // 1. Hiển thị tin nhắn của user
    appendMessage("user", option.text);
    
    // 2. Phản hồi của Bot
    showTyping();
    setTimeout(() => {
      removeTyping();
      
      if (option.next === "show_faqs") {
        appendMessage("bot", chatbotData.faqsPrompt);
        showFaqMenu();
      } else if (option.next === "faq_answer") {
        const faq = chatbotData.faqs.find(f => f.id === option.faqId);
        if (faq) {
          appendMessage("bot", faq.answer);
          
          // Sau mỗi câu trả lời, hiển thị các lựa chọn điều hướng chính
          setTimeout(() => {
            showStandardNavigation();
          }, 800);
        }
      } else if (option.next === "do_checkout") {
        appendMessage("bot", chatbotData.closing);
        triggerSmoothScroll();
        
        // Đóng nhẹ chat sau khi cuộn để khách điền form
        setTimeout(() => {
          chatContainer.classList.remove("active");
        }, 1500);
      } else if (option.next === "do_leadform") {
        appendMessage("bot", chatbotData.formRedirect);
        triggerSmoothScroll();
        
        // Đóng nhẹ chat sau khi cuộn
        setTimeout(() => {
          chatContainer.classList.remove("active");
        }, 1500);
      } else if (option.next === "back_to_menu") {
        appendMessage("bot", chatbotData.faqsPrompt);
        showFaqMenu();
      }
    }, 600 + Math.random() * 400);
  }

  function processUserText(text) {
    const cleanText = text.toLowerCase().trim().normalize("NFC");
    
    if (!cleanText) return;

    // Phân tích từ khóa tìm kiếm
    if (cleanText.includes("chào") || cleanText.includes("hello") || cleanText.includes("hi") || cleanText.includes("alo") || cleanText.includes("hey")) {
      appendMessage("bot", `Chào bạn! Mình có thể giúp gì cho bạn hôm nay? Dưới đây là các chủ đề thường gặp nhất:`);
      showFaqMenu();
      return;
    }
    
    if (cleanText.includes("giá") || cleanText.includes("bao nhiêu") || cleanText.includes("tiền") || cleanText.includes("đắt") || cleanText.includes("phí") || cleanText.includes("triệu") || cleanText.includes("3.8") || cleanText.includes("3.5")) {
      const faq = chatbotData.faqs.find(f => f.id === "q4");
      appendMessage("bot", faq.answer);
      setTimeout(showStandardNavigation, 600);
      return;
    }
    
    if (cleanText.includes("thành công") || cleanText.includes("đảm bảo") || cleanText.includes("hiệu quả") || cleanText.includes("đạt được")) {
      const faq = chatbotData.faqs.find(f => f.id === "q1");
      appendMessage("bot", faq.answer);
      setTimeout(showStandardNavigation, 600);
      return;
    }
    
    if (cleanText.includes("khác gì") || cleanText.includes("khác biệt") || cleanText.includes("tử vi thông thường") || cleanText.includes("ngoài kia") || cleanText.includes("so với")) {
      const faq = chatbotData.faqs.find(f => f.id === "q2");
      appendMessage("bot", faq.answer);
      setTimeout(showStandardNavigation, 600);
      return;
    }

    if (cleanText.includes("miễn phí") || cleanText.includes("online") || cleanText.includes("tự động") || cleanText.includes("phần mềm") || cleanText.includes("trên mạng")) {
      const faq = chatbotData.faqs.find(f => f.id === "q3");
      appendMessage("bot", faq.answer);
      setTimeout(showStandardNavigation, 600);
      return;
    }

    if (cleanText.includes("phong thủy") || cleanText.includes("đá") || cleanText.includes("vòng") || cleanText.includes("cúng") || cleanText.includes("lễ") || cleanText.includes("giải hạn")) {
      const faq = chatbotData.faqs.find(f => f.id === "q6");
      appendMessage("bot", faq.answer);
      setTimeout(showStandardNavigation, 600);
      return;
    }

    if (cleanText.includes("đăng ký") || cleanText.includes("quy trình") || cleanText.includes("bước") || cleanText.includes("mua") || cleanText.includes("đặt") || cleanText.includes("thanh toán")) {
      const faq = chatbotData.faqs.find(f => f.id === "q7");
      appendMessage("bot", faq.answer);
      setTimeout(showStandardNavigation, 600);
      return;
    }

    if (cleanText.includes("coin") || cleanText.includes("đầu tư") || cleanText.includes("đất") || cleanText.includes("bất động sản") || cleanText.includes("chứng khoán") || cleanText.includes("lướt sóng")) {
      const faq = chatbotData.faqs.find(f => f.id === "q8");
      appendMessage("bot", faq.answer);
      setTimeout(showStandardNavigation, 600);
      return;
    }

    if (cleanText.includes("bói") || cleanText.includes("mê tín") || cleanText.includes("tin học") || cleanText.includes("khoa học") || cleanText.includes("giúp ích")) {
      const faq = chatbotData.faqs.find(f => f.id === "q9");
      appendMessage("bot", faq.answer);
      setTimeout(showStandardNavigation, 600);
      return;
    }

    if (cleanText.includes("bao lâu") || cleanText.includes("hoàn tiền") || cleanText.includes("trễ") || cleanText.includes("cam kết")) {
      const faq = chatbotData.faqs.find(f => f.id === "q10");
      appendMessage("bot", faq.answer);
      setTimeout(showStandardNavigation, 600);
      return;
    }

    if (cleanText.includes("mẫu") || cleanText.includes("báo cáo mẫu") || cleanText.includes("bản mẫu") || cleanText.includes("pdf mẫu") || cleanText.includes("demo")) {
      appendMessage("bot", chatbotData.formRedirect);
      triggerSmoothScroll();
      setTimeout(() => {
        chatContainer.classList.remove("active");
      }, 1500);
      return;
    }

    // Câu trả lời Fallback đúng brand voice
    appendMessage("bot", `Dạ hiện tại mình chưa có sẵn câu trả lời tự động cho câu hỏi này của bạn.

Nhưng bạn thử nghĩ xem, việc kinh doanh thực tế luôn cần sự tư vấn cá nhân hóa sâu sắc theo bối cảnh của riêng bạn.

Bạn hãy điền nhanh thông tin vào form đăng ký ở dưới nhé. Chuyên gia của DNA Kinh Doanh sẽ liên hệ giải đáp trực tiếp cho bạn ngay!`);
    
    setTimeout(() => {
      showStandardNavigation();
    }, 600);
  }

  function handleSend() {
    const text = chatInput.value.trim();
    if (!text) return;
    
    chatInput.value = "";
    
    // Xóa các cụm nút lựa chọn cũ trong khung chat để đỡ rối mắt
    const oldOptions = chatBody.querySelectorAll(".dna-chat-options");
    oldOptions.forEach(el => el.remove());
    
    appendMessage("user", text);
    
    showTyping();
    setTimeout(() => {
      removeTyping();
      processUserText(text);
    }, 700 + Math.random() * 400);
  }

  function showFaqMenu() {
    const faqOptions = chatbotData.faqs.map(f => ({
      text: f.question,
      next: "faq_answer",
      faqId: f.id
    }));
    
    // Thêm 2 nút CTA cố định ở menu FAQ
    faqOptions.push({
      text: "💳 Đăng ký Bản đồ DNA Kinh Doanh",
      next: "do_checkout",
      class: "action-primary"
    });
    
    faqOptions.push({
      text: "🎁 Đăng ký nhận Báo cáo mẫu miễn phí",
      next: "do_leadform",
      class: "action-secondary"
    });
    
    appendOptions(faqOptions);
  }

  function showStandardNavigation() {
    appendOptions([
      {
        text: "↩ Quay lại danh sách câu hỏi",
        next: "back_to_menu",
        class: "back-menu"
      },
      {
        text: "💳 Đăng ký Bản đồ DNA Kinh Doanh",
        next: "do_checkout",
        class: "action-primary"
      },
      {
        text: "🎁 Đăng ký nhận Báo cáo mẫu miễn phí",
        next: "do_leadform",
        class: "action-secondary"
      }
    ]);
  }

  function initChat() {
    if (isInitialized) return;
    
    showTyping();
    setTimeout(() => {
      removeTyping();
      appendMessage("bot", chatbotData.greeting);
      appendOptions(chatbotData.welcomeOptions);
      isInitialized = true;
    }, 800);
  }

  // 6. Gán sự kiện cho các nút
  chatBubble.addEventListener("click", () => {
    chatContainer.classList.toggle("active");
    if (chatContainer.classList.contains("active")) {
      initChat();
      scrollToBottom();
      // Tự động focus vào ô input khi mở chat
      setTimeout(() => {
        chatInput.focus();
      }, 300);
    }
  });

  chatClose.addEventListener("click", () => {
    chatContainer.classList.remove("active");
  });

  // Sự kiện gửi tin nhắn
  chatSendBtn.addEventListener("click", handleSend);
  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  });
})();
