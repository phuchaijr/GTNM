/* ==========================================================================
   1. GLOBAL LOGIC (Dùng chung cho tất cả các trang)
   ========================================================================== */

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

const stationList = [
  "Bến Thành",
  "Nhà hát Thành phố",
  "Ba Son",
  "Văn Thánh",
  "Tân Cảng",
  "Thảo Điền",
  "An Phú",
  "Rạch Chiếc",
  "Phước Long",
  "Bình Thái",
  "Thủ Đức",
  "Khu Công nghệ cao",
  "Đại học Quốc gia",
  "Suối Tiên",
];

const priceMatrix = [
  [0, 7, 7, 7, 7, 7, 7, 9, 10, 12, 14, 16, 18, 20],
  [7, 0, 7, 7, 7, 7, 7, 8, 10, 11, 13, 16, 17, 20],
  [7, 7, 0, 7, 7, 7, 7, 7, 9, 10, 12, 15, 16, 18],
  [7, 7, 7, 0, 7, 7, 7, 7, 7, 8, 10, 13, 14, 17],
  [7, 7, 7, 7, 0, 7, 7, 7, 7, 7, 9, 12, 13, 16],
  [7, 7, 7, 7, 7, 0, 7, 7, 7, 7, 8, 10, 12, 14],
  [7, 7, 7, 7, 7, 7, 0, 7, 7, 7, 7, 9, 11, 13],
  [9, 8, 7, 7, 7, 7, 7, 0, 7, 7, 7, 8, 9, 11],
  [10, 10, 9, 7, 7, 7, 7, 7, 0, 7, 7, 7, 8, 10],
  [12, 11, 10, 8, 7, 7, 7, 7, 7, 0, 7, 7, 7, 8],
  [14, 13, 12, 10, 9, 8, 7, 7, 7, 7, 0, 7, 7, 7],
  [16, 16, 15, 13, 12, 10, 9, 8, 7, 7, 7, 0, 7, 7],
  [18, 17, 16, 14, 13, 12, 11, 9, 8, 7, 7, 7, 0, 7],
  [20, 20, 18, 17, 16, 14, 13, 11, 10, 8, 7, 7, 7, 0],
];

function calculateTotal() {
  const ticketCountDisplay = document.getElementById("ticket-count-display");
  const totalPriceDisplay = document.getElementById("total-price");
  const fromSelect = document.getElementById("station-from");
  const toSelect = document.getElementById("station-to");
  const countDisplay = document.getElementById("count-display");

  if (!ticketCountDisplay || !fromSelect || !toSelect) return;

  const fromStation = fromSelect.value;
  const toStation = toSelect.value;
  const count = parseInt(countDisplay.innerText) || 1;

  const roundTripRadio = document.getElementById("type-round");
  const isRoundTrip = roundTripRadio && roundTripRadio.checked;

  // Cập nhật text hành trình
  const indexFrom = stationList.indexOf(fromStation);
  const indexTo = stationList.indexOf(toStation);
  const routeDisplay = document.getElementById("route-display");
  if (routeDisplay && indexFrom !== -1 && indexTo !== -1) {
    routeDisplay.innerHTML = `${fromStation} <i class="fa-solid fa-arrow-right"></i> ${toStation}`;
  }

  // Cập nhật text số người
  const typeText = isRoundTrip ? "(Khứ hồi)" : "(Một chiều)";
  const countText = count < 10 ? "0" + count : count;
  ticketCountDisplay.innerText = `${countText} người ${typeText}`;

  // TÍNH TIỀN
  let total = 0;
  if (indexFrom !== -1 && indexTo !== -1 && indexFrom !== indexTo) {
    let priceK = priceMatrix[indexFrom][indexTo];
    let singlePrice = priceK * 1000;
    if (isRoundTrip) singlePrice = singlePrice * 2;
    total = singlePrice * count;
  }

  if (totalPriceDisplay) {
    totalPriceDisplay.innerText = total.toLocaleString("vi-VN") + " đ";
    // Lưu tạm giá trị tổng tiền vào attribute để hàm goToPaymentPage dễ lấy
    totalPriceDisplay.setAttribute("data-value", total);
  }
}

function updateCount(n) {
  const display = document.getElementById("count-display");
  if (!display) return;
  let count = parseInt(display.innerText) + n;
  if (count < 1) count = 1;
  if (count > 50) count = 50;
  display.innerText = count;
  calculateTotal();
}

function swapStations() {
  const from = document.getElementById("station-from");
  const to = document.getElementById("station-to");
  if (from && to) {
    const temp = from.value;
    from.value = to.value;
    to.value = temp;
    calculateTotal();
  }
}

function updateRouteText() {
  calculateTotal();
}

function goToPaymentPage() {
  const fromStation = document.getElementById("station-from").value;
  const toStation = document.getElementById("station-to").value;
  const count = document.getElementById("count-display").innerText;
  const isRoundTrip = document.getElementById("type-round").checked;
  const totalPriceElement = document.getElementById("total-price");

  // Lấy tổng tiền (Nếu có attribute data-value thì lấy, không thì lấy text)
  let totalString = totalPriceElement.innerText;

  // Tạo object chứa thông tin vé
  const ticketData = {
    from: fromStation,
    to: toStation,
    count: count,
    type: isRoundTrip ? "Khứ hồi" : "Một chiều",
    total: totalString,
    date: new Date().toLocaleDateString("vi-VN"), // Ngày hiện tại
  };

  // Lưu vào LocalStorage
  localStorage.setItem("pendingTicket", JSON.stringify(ticketData));

  // Chuyển trang
  window.location.href = "thanh-toan.html"; // Sửa lại đúng tên file của bạn
}
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
      tabs[0].classList.add("active");
    } else {
      registerForm.classList.add("active-form");
      tabs[1].classList.add("active");
    }
  }
}

/**
 * Ẩn hiện mật khẩu
 */
function togglePass(inputId) {
  const input = document.getElementById(inputId);
  const icon = input.nextElementSibling; // Lấy icon bên cạnh

  if (input) {
    if (input.type === "password") {
      input.type = "text";
      if (icon) {
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
      }
    } else {
      input.type = "password";
      if (icon) {
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
      }
    }
  }
}

/**
 * Xử lý ĐĂNG KÝ
 */
function handleRegister() {
  // 1. Lấy dữ liệu từ form
  const name = document.getElementById("reg-name").value.trim();
  const phone = document.getElementById("reg-phone").value.trim();
  const pass = document.getElementById("reg-pass").value;
  const confirmPass = document.getElementById("reg-confirm-pass").value;

  // 2. Kiểm tra dữ liệu
  if (!name || !phone || !pass || !confirmPass) {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  if (pass !== confirmPass) {
    alert("Mật khẩu nhập lại không khớp!");
    return;
  }

  // 3. Lấy danh sách user cũ từ LocalStorage
  const users = JSON.parse(localStorage.getItem("hcmc_users")) || [];

  // Kiểm tra xem số điện thoại đã tồn tại chưa
  const exists = users.find((u) => u.phone === phone);
  if (exists) {
    alert("Số điện thoại này đã được đăng ký!");
    return;
  }

  // 4. Lưu user mới
  const newUser = { name, phone, pass };
  users.push(newUser);
  localStorage.setItem("hcmc_users", JSON.stringify(users));

  alert("Đăng ký thành công! Vui lòng đăng nhập.");

  // 5. Chuyển sang tab đăng nhập
  switchTab("login");

  // --- SỬA LỖI: Dùng đúng ID 'login-username' của file HTML ---
  const loginInput = document.getElementById("login-username");
  if (loginInput) {
    loginInput.value = phone; // Tự điền số điện thoại vừa đăng ký
    document.getElementById("login-pass").focus();
  }

  // Xóa form đăng ký
  document.getElementById("register-form").reset();
}

/**
 * Xử lý ĐĂNG NHẬP
 */
function handleLogin() {
  // --- SỬA LỖI: Dùng đúng ID 'login-username' của file HTML ---
  const phoneInput = document.getElementById("login-username").value.trim();
  const passInput = document.getElementById("login-pass").value;

  if (!phoneInput || !passInput) {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  // Lấy dữ liệu từ LocalStorage
  const users = JSON.parse(localStorage.getItem("hcmc_users")) || [];

  // Tìm kiếm user (So khớp Số điện thoại và Mật khẩu)
  const user = users.find(
    (u) => u.phone === phoneInput && u.pass === passInput
  );

  if (user) {
    alert("Đăng nhập thành công! Xin chào " + user.name);

    // Lưu phiên đăng nhập hiện tại
    localStorage.setItem("currentUser", JSON.stringify(user));

    // --- CHUYỂN HƯỚNG TRANG ---
    // Đảm bảo file trang chủ của bạn tên là "trangchu.html"
    window.location.href = "trangchu.html";
  } else {
    alert("Sai số điện thoại hoặc mật khẩu! (Hoặc tài khoản chưa đăng ký)");
  }
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
 * 1. NẠP DỮ LIỆU USER VÀO FORM (Đã sửa để xử lý khách)
 */
function loadUserDataToProfile() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // NẾU KHÔNG CÓ NGƯỜI DÙNG (ĐÃ ĐĂNG XUẤT)
  if (!currentUser) {
    resetToGuestMode(); // Gọi hàm reset giao diện về Khách
    return;
  }

  // NẾU CÓ NGƯỜI DÙNG -> HIỆN THÔNG TIN
  // 1. Hiển thị Tên ở Sidebar
  const displayName = document.getElementById("user-display-name");
  if (displayName) displayName.innerText = currentUser.name;

  // Hiển thị huy hiệu thành viên
  const badge = document.querySelector(".member-badge");
  if (badge) badge.style.display = "inline-block";

  // 2. Điền thông tin vào các ô Input
  const nameInput = document.getElementById("profile-name");
  const phoneInput = document.getElementById("profile-phone");
  const emailInput = document.getElementById("profile-email");
  const addressInput = document.getElementById("profile-address");

  if (nameInput) nameInput.value = currentUser.name || "";
  if (phoneInput) phoneInput.value = currentUser.phone || "";
  if (emailInput) emailInput.value = currentUser.email || "";
  if (addressInput) addressInput.value = currentUser.address || "";

  // 3. Reset ô mật khẩu
  if (document.getElementById("new-pass"))
    document.getElementById("new-pass").value = "";
  if (document.getElementById("confirm-pass"))
    document.getElementById("confirm-pass").value = "";
}

/**
 * HÀM MỚI: Đưa giao diện về trạng thái Khách (Trắng thông tin)
 */
function resetToGuestMode() {
  // 1. Sidebar về Khách
  const displayName = document.getElementById("user-display-name");
  if (displayName) displayName.innerText = "Khách";

  // Ẩn huy hiệu thành viên
  const badge = document.querySelector(".member-badge");
  if (badge) badge.style.display = "none";

  // Về avatar mặc định
  const avatar = document.getElementById("user-avatar");
  if (avatar) avatar.src = "./img/avatar.jpg"; // Hoặc ảnh mặc định của bạn

  // 2. Xóa trắng form input
  const inputs = document.querySelectorAll(".profile-form input");
  inputs.forEach((input) => {
    input.value = "";
  });

  // 3. Cập nhật nút trên Header (nếu có)
  const userBtn = document.getElementById("header-user-name");
  if (userBtn) {
    userBtn.innerText = "Tài khoản";
    userBtn.href = "login.html"; // Bấm vào sẽ dẫn tới đăng nhập
  }
}

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
   6. MY TICKETS PAGE (Logic hiển thị vé đã mua)
   ========================================================================== */

function renderMyTickets() {
  const container = document.getElementById("ticket-container");

  // Chỉ chạy nếu đang ở trang ve-cua-toi.html
  if (!container) return;

  // Lấy danh sách vé từ bộ nhớ
  const myTickets = JSON.parse(localStorage.getItem("myTickets")) || [];

  // Nếu không có vé nào
  if (myTickets.length === 0) {
    // Bạn có thể hiện thông báo "Chưa có vé" nếu muốn
    return;
  }

  // Duyệt qua từng vé và tạo HTML
  myTickets.forEach((ticket, index) => {
    // Tạo mã vé ngẫu nhiên để làm QR Code
    const ticketCode = "METRO-" + Math.floor(Math.random() * 1000000);

    // Tạo giờ ngẫu nhiên (hoặc lấy giờ hiện tại)
    const timeStart = new Date().getHours() + ":" + new Date().getMinutes();

    // HTML Cấu trúc vé (Khớp với file HTML của bạn)
    const ticketHTML = `
      <div class="digital-ticket active-ticket">
        <div class="ticket-left">
            <div class="ticket-header">
                <span class="ticket-type">${
                  ticket.type || "Vé một chiều"
                }</span>
                <span class="ticket-status status-active">Mới mua</span>
            </div>
            <div class="ticket-route">
                <div class="station">
                    <strong>${ticket.from}</strong>
                    <span>${timeStart} - ${ticket.date}</span>
                </div>
                <i class="fa-solid fa-arrow-right-long route-arrow"></i>
                <div class="station">
                    <strong>${ticket.to}</strong>
                    <span>Dự kiến --:--</span>
                </div>
            </div>
            <div class="ticket-footer">
                <span><i class="fa-solid fa-user"></i> ${ticket.count}</span>
                <span><i class="fa-solid fa-tag"></i> ${ticket.total}</span>
            </div>
        </div>
        <div class="ticket-right">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticketCode}" alt="QR Code" class="qr-code">
            <p class="qr-note">Quét mã</p>
        </div>
      </div>
    `;

    // Chèn vé mới vào ngay sau các nút Tab (để nó nằm trên cùng)
    // Cách đơn giản nhất: Tạo element và prepend vào container
    const div = document.createElement("div");
    div.innerHTML = ticketHTML;

    // Tìm vị trí chèn: Chèn vào đầu danh sách vé
    // Lưu ý: Code này sẽ chèn thêm vào danh sách có sẵn trong HTML
    container.insertBefore(
      div.firstElementChild,
      container.querySelector(".digital-ticket")
    );
  });
}

// Gọi hàm này khi tải trang
document.addEventListener("DOMContentLoaded", () => {
  renderMyTickets();
});

/* ==========================================================================
   7. PAYMENT PAGE (Logic Trang Thanh Toán - thanh-toan.html)
   ========================================================================== */

function loadPaymentInfo() {
  // Chỉ chạy nếu đang ở trang có id="pay-total"
  const payTotal = document.getElementById("pay-total");
  if (!payTotal) return;

  // Lấy dữ liệu từ LocalStorage
  const data = JSON.parse(localStorage.getItem("pendingTicket"));

  if (data) {
    document.getElementById(
      "pay-route"
    ).innerText = `${data.from} → ${data.to}`;
    document.getElementById("pay-type").innerText = data.type;
    document.getElementById("pay-passenger").innerText =
      data.count < 10 ? `0${data.count} Người` : `${data.count} Người`;
    document.getElementById("pay-total").innerText = data.total;

    if (document.getElementById("pay-date")) {
      document.getElementById("pay-date").innerText = data.date;
    }
  } else {
    // Nếu không có dữ liệu (người dùng vào thẳng link thanh toán) -> Về trang đặt vé
    alert("Vui lòng chọn vé trước!");
    window.location.href = "booking.html";
  }
}

function processPayment() {
  const btn = document.querySelector(".btn-pay");
  const modal = document.getElementById("success-modal");

  if (btn && modal) {
    const originalText = btn.innerHTML;

    // 1. Hiệu ứng Loading
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang xử lý...';
    btn.disabled = true;
    btn.style.opacity = "0.7";

    // 2. Giả lập xử lý thanh toán (1.5 giây)
    setTimeout(() => {
      // --- LOGIC LƯU VÉ MỚI ---
      // Lấy vé đang chờ thanh toán
      const pendingTicket = JSON.parse(localStorage.getItem("pendingTicket"));

      if (pendingTicket) {
        // Lấy danh sách vé cũ (nếu có), nếu chưa có thì tạo mảng rỗng
        let myTickets = JSON.parse(localStorage.getItem("myTickets")) || [];

        // Thêm vé mới vào đầu danh sách
        myTickets.unshift(pendingTicket);

        // Lưu lại vào LocalStorage
        localStorage.setItem("myTickets", JSON.stringify(myTickets));

        // Xóa vé tạm
        localStorage.removeItem("pendingTicket");
      }
      // -------------------------

      // Hiện Modal thành công
      modal.classList.add("show");

      // Reset nút
      btn.innerHTML = originalText;
      btn.disabled = false;
      btn.style.opacity = "1";
    }, 1500);
  }
}

// --- GLOBAL EVENT LISTENERS ---
document.addEventListener("DOMContentLoaded", () => {
  // 1. Tính toán giá nếu ở trang Booking
  calculateTotal();

  // 2. Load thông tin vé nếu ở trang Thanh toán
  loadPaymentInfo();

  // 3. Sự kiện radio buttons
  const radios = document.getElementsByName("radio");
  radios.forEach((radio) => {
    radio.addEventListener("change", calculateTotal);
  });
});
/* =========================================
   LOGIC TRANG TÀI KHOẢN
   ========================================= */

document.addEventListener("DOMContentLoaded", function () {
  // Kiểm tra nếu đang ở trang có form profile thì mới chạy
  if (document.getElementById("profile-form")) {
    loadUserDataToProfile();
  }
});

/**
 * 1. NẠP DỮ LIỆU USER VÀO FORM
 */
function loadUserDataToProfile() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  // 1. Hiển thị Tên ở Sidebar
  const displayName = document.getElementById("user-display-name");
  if (displayName) displayName.innerText = currentUser.name;

  // 2. Điền thông tin vào các ô Input
  const nameInput = document.getElementById("profile-name");
  const phoneInput = document.getElementById("profile-phone");
  const emailInput = document.getElementById("profile-email");
  const addressInput = document.getElementById("profile-address");

  // --- QUAN TRỌNG: Chỉ điền đúng dữ liệu ---
  if (nameInput) nameInput.value = currentUser.name || "";
  if (phoneInput) phoneInput.value = currentUser.phone || "";

  // Kiểm tra kỹ: Nếu email chưa có thì để rỗng, KHÔNG ĐƯỢC lấy phone điền vào
  if (emailInput) {
    emailInput.value = currentUser.email || "";
  }

  if (addressInput) addressInput.value = currentUser.address || "";

  // 3. --- XỬ LÝ LỖI HIỆN MẬT KHẨU ---
  // Tìm các ô mật khẩu và ép chúng rỗng (reset)
  const newPass = document.getElementById("new-pass");
  const confirmPass = document.getElementById("confirm-pass");

  if (newPass) newPass.value = ""; // Xóa trắng ô mật khẩu mới
  if (confirmPass) confirmPass.value = ""; // Xóa trắng ô xác nhận
}

/**
 * 2. CẬP NHẬT THÔNG TIN & MẬT KHẨU
 */
function updateProfile() {
  // Lấy dữ liệu từ form
  const name = document.getElementById("profile-name").value;
  const email = document.getElementById("profile-email").value;
  const address = document.getElementById("profile-address").value;

  const newPass = document.getElementById("new-pass").value;
  const confirmPass = document.getElementById("confirm-pass").value;

  // Lấy user hiện tại
  let currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // --- Xử lý đổi mật khẩu (Nếu có nhập) ---
  if (newPass) {
    if (newPass !== confirmPass) {
      showToast("Mật khẩu xác nhận không khớp!", "error"); // Giả sử bạn có hàm showToast
      return;
    }
    currentUser.pass = newPass; // Cập nhật pass mới
  }

  // --- Cập nhật thông tin cá nhân ---
  currentUser.name = name;
  currentUser.email = email;
  currentUser.address = address;

  // 1. Lưu vào Session (Đăng nhập hiện tại)
  localStorage.setItem("currentUser", JSON.stringify(currentUser));

  // 2. Lưu vào Database giả (localStorage danh sách users)
  let users = JSON.parse(localStorage.getItem("hcmc_users")) || [];
  const index = users.findIndex((u) => u.phone === currentUser.phone);

  if (index !== -1) {
    users[index] = currentUser; // Cập nhật trong danh sách tổng
    localStorage.setItem("hcmc_users", JSON.stringify(users));
  }

  // Thông báo và load lại giao diện
  alert("Cập nhật hồ sơ thành công!");
  loadUserDataToProfile(); // Load lại để cập nhật sidebar

  // Reset ô mật khẩu để bảo mật
  document.getElementById("new-pass").value = "";
  document.getElementById("confirm-pass").value = "";
}

/**
 * 3. ẨN/HIỆN MẬT KHẨU (Fix lỗi hiện pass text)
 */
function togglePass(inputId) {
  const input = document.getElementById(inputId);
  const icon = input.parentElement.querySelector(".show-pass-icon");

  if (input.type === "password") {
    input.type = "text"; // Hiện mật khẩu
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash");
  } else {
    input.type = "password"; // Ẩn mật khẩu
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
  }
}
/* ==========================================================================
   8. CHECK LOGIN STATUS (Hiển thị tên người dùng trên trang chủ)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  // 1. Lấy thông tin user đang đăng nhập từ LocalStorage
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // 2. Lấy vị trí nút hiển thị tên trên Header
  const userBtn = document.getElementById("header-user-name");

  // 3. Nếu tìm thấy user và nút userBtn tồn tại
  if (currentUser && userBtn) {
    // Thay đổi nội dung nút thành tên người dùng
    // Lấy tên đầu tiên để cho ngắn gọn (Ví dụ: "Nguyễn Văn A" -> "A")
    const shortName = currentUser.name.split(" ").pop();
    userBtn.innerHTML = `<i class="fa-solid fa-user"></i> Chào, ${shortName}`;
  }
});

/**
 * Hàm Đăng xuất (Bạn có thể gắn hàm này vào một nút "Đăng xuất" trong trang tai-khoan.html)
 */
/**
 * Hàm Đăng xuất (Đã sửa lỗi logic)
 */
function handleLogout(event) {
  // Ngăn chặn hành vi mặc định của thẻ a (chuyển trang)
  if (event) event.preventDefault();

  if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
    // 1. Xóa session
    localStorage.removeItem("currentUser");
    localStorage.removeItem("isLoggedIn");

    // 2. Reset giao diện về Khách ngay lập tức
    resetToGuestMode();

    // 3. Thông báo
    alert("Đăng xuất thành công! Giao diện đã trở về trạng thái Khách.");
  }
}
