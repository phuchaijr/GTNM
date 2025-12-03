function toggleMenu() {
  document.getElementById("navLinks").classList.toggle("active");
}

// 2. Logic Tính tiền
let count = 1;
const price = 12000;
function updateCount(n) {
  count += n;
  if (count < 1) count = 1;
  if (count > 10) count = 10;
  document.getElementById("count-display").innerText = count;
  document.getElementById("ticket-count-display").innerText =
    (count < 10 ? "0" + count : count) + " người";
  document.getElementById("total-price").innerText =
    (count * price).toLocaleString("vi-VN") + " đ";
}

// 3. Logic Đổi Ga & Cập nhật chữ
function swapStations() {
  let from = document.getElementById("station-from");
  let to = document.getElementById("station-to");

  // Hoán đổi vị trí
  let temp = from.selectedIndex;
  from.selectedIndex = to.selectedIndex;
  to.selectedIndex = temp;

  updateRouteText();
}

function updateRouteText() {
  let fromSelect = document.getElementById("station-from");
  let toSelect = document.getElementById("station-to");
  let fromText = fromSelect.options[fromSelect.selectedIndex].value; // Lấy value cho ngắn gọn
  let toText = toSelect.options[toSelect.selectedIndex].value;

  document.getElementById("route-display").innerText =
    fromText + " → " + toText;
}

// 4. HIỆU ỨNG SCROLL (MỚI THÊM)
window.addEventListener("scroll", function () {
  var header = document.getElementById("main-header");
  // Nếu cuộn quá 50px thì thêm class màu nền, ngược lại thì bỏ
  if (window.scrollY > 50) {
    header.classList.add("header-scrolled");
  } else {
    header.classList.remove("header-scrolled");
  }
});
// ... (Giữ lại các code cũ: toggleMenu, scroll header...)

/* --- LOGIC TRANG ĐĂNG NHẬP --- */

// 1. Chuyển đổi Tab (Đăng nhập <-> Đăng ký)
function switchTab(tabName) {
  // Ẩn tất cả form
  document.getElementById("login-form").classList.remove("active-form");
  document.getElementById("register-form").classList.remove("active-form");

  // Bỏ active tất cả nút tab
  const tabs = document.querySelectorAll(".tab-btn");
  tabs.forEach((t) => t.classList.remove("active"));

  // Hiển thị form được chọn
  if (tabName === "login") {
    document.getElementById("login-form").classList.add("active-form");
    tabs[0].classList.add("active"); // Nút đầu tiên active
  } else {
    document.getElementById("register-form").classList.add("active-form");
    tabs[1].classList.add("active"); // Nút thứ hai active
  }
}

// 2. Ẩn/Hiện mật khẩu (Mắt thần)
function togglePass(inputId) {
  const input = document.getElementById(inputId);
  if (input.type === "password") {
    input.type = "text";
  } else {
    input.type = "password";
  }
}

// 3. Demo chức năng đăng nhập
function demoLogin() {
  alert("Đăng nhập thành công! Chuyển hướng về trang chủ...");
  window.location.href = "index.html";
}
/* --- (Giữ nguyên code cũ) --- */

/* --- LOGIC TRANG HỖ TRỢ (ACCORDION) --- */
const accordions = document.querySelectorAll(".accordion-header");

accordions.forEach((acc) => {
  acc.addEventListener("click", function () {
    // 1. Toggle class active cho header
    this.classList.toggle("active");

    // 2. Xử lý phần content
    const content = this.nextElementSibling;

    if (content.style.maxHeight) {
      // Nếu đang mở -> Đóng lại
      content.style.maxHeight = null;
    } else {
      // Nếu đang đóng -> Mở ra
      content.style.maxHeight = content.scrollHeight + "px";
    }

    // (Tùy chọn) Đóng các tab khác khi mở tab mới
    /* accordions.forEach(otherAcc => {
            if (otherAcc !== this && otherAcc.classList.contains('active')) {
                otherAcc.classList.remove('active');
                otherAcc.nextElementSibling.style.maxHeight = null;
            }
        }); 
        */
  });
});
