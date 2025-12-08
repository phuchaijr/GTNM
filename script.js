/* ==========================================================================
   1. GLOBAL LOGIC (Dùng chung cho tất cả các trang)
   ========================================================================== */

/**
 * Xử lý Menu Mobile (Hamburger)
 * - Đổi icon 3 gạch thành dấu X
 * - Trượt menu xuống
 */
function toggleMenu() {
  const nav = document.getElementById("navLinks");
  const btn = document.querySelector(".mobile-menu-btn");
  const icon = btn.querySelector("i");

  nav.classList.toggle("active");
  btn.classList.toggle("open");

  // Đổi icon
  if (nav.classList.contains("active")) {
    icon.classList.remove("fa-bars");
    icon.classList.add("fa-xmark");
  } else {
    icon.classList.remove("fa-xmark");
    icon.classList.add("fa-bars");
  }
}

/**
 * Hiệu ứng Sticky Header
 * - Khi cuộn xuống > 50px thì đổi màu nền header
 */
window.addEventListener("scroll", function () {
  const header = document.getElementById("main-header");
  if (header) {
    if (window.scrollY > 50) {
      header.classList.add("header-scrolled");
    } else {
      header.classList.remove("header-scrolled");
    }
  }
});

/* ==========================================================================
   2. BOOKING PAGE (Logic Trang Đặt Vé - booking.html)
   ========================================================================== */

// Biến toàn cục cho đặt vé
let count = 1;
const basePrice = 12000; // Giá gốc 1 chiều

/**
 * Tính tổng tiền
 * Logic: (Số người * Giá gốc) * (Hệ số khứ hồi)
 */
function calculateTotal() {
  const ticketCountDisplay = document.getElementById("ticket-count-display");
  const totalPriceDisplay = document.getElementById("total-price");

  // Kiểm tra xem có đang ở trang đặt vé không
  if (!ticketCountDisplay || !totalPriceDisplay) return;

  // Lấy trạng thái khứ hồi (nếu có radio button)
  const roundTripRadio = document.getElementById("type-round"); // ID cần thêm vào HTML
  let multiplier = 1;
  let typeText = "(Một chiều)";

  // Nếu tìm thấy radio button và nó được chọn -> Nhân đôi giá
  if (roundTripRadio && roundTripRadio.checked) {
    multiplier = 2;
    typeText = "(Khứ hồi)";
  }

  // Tính toán
  const total = count * basePrice * multiplier;

  // Cập nhật giao diện
  const countText = count < 10 ? "0" + count : count;
  ticketCountDisplay.innerText = `${countText} người ${typeText}`;
  totalPriceDisplay.innerText = total.toLocaleString("vi-VN") + " đ";
}

/**
 * Tăng giảm số lượng hành khách
 * @param {number} n : +1 hoặc -1
 */
function updateCount(n) {
  count += n;
  // Giới hạn min 1, max 10
  if (count < 1) count = 1;
  if (count > 10) count = 10;

  // Cập nhật số ở giữa 2 nút bấm
  const countDisplay = document.getElementById("count-display");
  if (countDisplay) {
    countDisplay.innerText = count;
  }

  // Tính lại tiền
  calculateTotal();
}

/**
 * Đổi vị trí Ga đi và Ga đến
 */
function swapStations() {
  const from = document.getElementById("station-from");
  const to = document.getElementById("station-to");

  if (from && to) {
    const temp = from.selectedIndex;
    from.selectedIndex = to.selectedIndex;
    to.selectedIndex = temp;
    updateRouteText();
  }
}

/**
 * Cập nhật chữ hiển thị hành trình (VD: Bến Thành -> Suối Tiên)
 */
function updateRouteText() {
  const from = document.getElementById("station-from");
  const to = document.getElementById("station-to");
  const display = document.getElementById("route-display");

  if (from && to && display) {
    // Lấy text của option đang chọn
    const fromText = from.options[from.selectedIndex].text.replace("Ga ", "");
    const toText = to.options[to.selectedIndex].text.replace("Ga ", "");
    display.innerText = `${fromText} → ${toText}`;
  }
}

/**
 * Chuyển hướng sang trang thanh toán
 */
function goToPaymentPage() {
  // Có thể thêm logic validate dữ liệu ở đây
  window.location.href = "thanh-toan.html";
}

// Gọi tính toán lần đầu khi trang load (để đảm bảo giá đúng)
document.addEventListener("DOMContentLoaded", () => {
  calculateTotal();

  // Gắn sự kiện cho radio buttons nếu chưa gắn trong HTML
  const radios = document.getElementsByName("radio");
  radios.forEach((radio) => {
    radio.addEventListener("change", calculateTotal);
  });
});

/* ==========================================================================
   3. AUTHENTICATION (Logic Đăng nhập/Đăng ký - login.html)
   ========================================================================== */

/**
 * Chuyển đổi giữa Tab Đăng nhập và Đăng ký
 */
function switchTab(tabName) {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const tabs = document.querySelectorAll(".tab-btn");

  if (loginForm && registerForm) {
    // Reset active classes
    document
      .querySelectorAll(".auth-form")
      .forEach((f) => f.classList.remove("active-form"));
    tabs.forEach((t) => t.classList.remove("active"));

    if (tabName === "login") {
      loginForm.classList.add("active-form");
      tabs[0].classList.add("active"); // Giả sử tab đầu là Login
    } else {
      registerForm.classList.add("active-form");
      tabs[1].classList.add("active"); // Giả sử tab hai là Register
    }
  }
}

/**
 * Ẩn hiện mật khẩu (Icon con mắt)
 */
function togglePass(inputId) {
  const input = document.getElementById(inputId);
  if (input) {
    input.type = input.type === "password" ? "text" : "password";
  }
}

/**
 * Demo Login
 */
function demoLogin() {
  alert("Đăng nhập thành công! Đang chuyển hướng...");
  window.location.href = "index.html";
}

/* ==========================================================================
   4. SUPPORT PAGE (Logic Trang Hỗ trợ - ho-tro.html)
   ========================================================================== */

// Xử lý Accordion (Hỏi đáp)
const accordions = document.querySelectorAll(".accordion-header");
if (accordions.length > 0) {
  accordions.forEach((acc) => {
    acc.addEventListener("click", function () {
      // Toggle class active cho header
      this.classList.toggle("active");

      // Xử lý phần content (trượt xuống)
      const content = this.nextElementSibling;
      if (content.style.maxHeight) {
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });
}

/* ==========================================================================
   5. PROFILE PAGE (Logic Trang Tài khoản - tai-khoan.html)
   ========================================================================== */

/**
 * Ẩn/Hiện phần Bảo mật & Mật khẩu
 */
function toggleSecurity() {
  const section = document.getElementById("security-section");
  const header = document.querySelector(".security-toggle-header");

  if (section && header) {
    section.classList.toggle("open");
    header.classList.toggle("active");
  }
}

/* ==========================================================================
   6. MY TICKETS PAGE (Logic Trang Vé của tôi - ve-cua-toi.html)
   ========================================================================== */

/**
 * Lọc vé (Sắp đi / Lịch sử)
 */
function filterTickets(type) {
  const activeTickets = document.querySelectorAll(".active-ticket");
  const historyTickets = document.querySelectorAll(".history-ticket");
  const tabs = document.querySelectorAll(".ticket-tabs .tab-btn");

  // Chỉ chạy nếu đang ở trang có tab vé
  if (tabs.length > 0) {
    if (type === "active") {
      activeTickets.forEach((t) => (t.style.display = "flex"));
      historyTickets.forEach((t) => (t.style.display = "none"));
      tabs[0].classList.add("active");
      tabs[1].classList.remove("active");
    } else {
      activeTickets.forEach((t) => (t.style.display = "none"));
      historyTickets.forEach((t) => (t.style.display = "flex"));
      tabs[0].classList.remove("active");
      tabs[1].classList.add("active");
    }
  }
}

/* ==========================================================================
   7. PAYMENT PAGE (Logic Trang Thanh Toán - thanh-toan.html)
   ========================================================================== */

/**
 * Xử lý hiệu ứng nút "Thanh toán ngay"
 */
function processPayment() {
  const btn = document.querySelector(".btn-pay");
  const modal = document.getElementById("success-modal");

  if (btn && modal) {
    const originalText = btn.innerHTML;

    // 1. Chuyển sang trạng thái loading
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang xử lý...';
    btn.disabled = true;
    btn.style.opacity = "0.7";

    // 2. Giả lập delay 1.5 giây
    setTimeout(() => {
      // Hiện Modal thành công
      modal.classList.add("show");

      // Reset nút (phòng khi user back lại)
      btn.innerHTML = originalText;
      btn.disabled = false;
      btn.style.opacity = "1";
    }, 1500);
  }
}
/* =========================================
   LOGIC MỚI CHO TRANG TÀI KHOẢN
   ========================================= */

// 1. Chuyển đổi Section (Thông tin / Lịch sử / Cài đặt)
function showSection(sectionId) {
  // Ẩn tất cả section
  document
    .querySelectorAll(".content-section")
    .forEach((sec) => sec.classList.remove("active-section"));
  // Bỏ active tất cả menu item
  document
    .querySelectorAll(".profile-menu .menu-item")
    .forEach((btn) => btn.classList.remove("active"));

  // Hiện section được chọn
  const target = document.getElementById("section-" + sectionId);
  if (target) target.classList.add("active-section");

  // Active menu item tương ứng
  // (Mẹo: Tìm nút có onclick chứa id section)
  const activeBtn = document.querySelector(
    `.profile-menu .menu-item[onclick*="${sectionId}"]`
  );
  if (activeBtn) activeBtn.classList.add("active");
}

// 2. Xem trước Avatar khi upload
function previewAvatar(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById("user-avatar").src = e.target.result;
      showToast("Ảnh đại diện đã được cập nhật!", "success");
    };
    reader.readAsDataURL(input.files[0]);
  }
}

// 3. Hiển thị thông báo Toast
function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${message}</span>`;

  container.appendChild(toast);

  // Tự động xóa sau 3 giây
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// 4. Toggle Password (Đã có trong code cũ, đảm bảo nó hoạt động cho cả form này)
// (Hàm togglePass ở trên đã ok)
