/* ================= NAVBAR SMOOTH SCROLL ================= */

const sections = document.querySelectorAll(".nav__list-item");

sections.forEach((section) => {
  section.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = section.textContent.toLowerCase();
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

/* ================= MOBILE NAV TOGGLE ================= */

const toggleIcon = document.getElementById("navToggle");
const navList = document.getElementById("navList");
const navItems = document.querySelectorAll(".nav__list-item");

toggleIcon.addEventListener("click", () => {
  navList.classList.toggle("nav__toggle");
});

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    navList.classList.remove("nav__toggle");
  });
});

/* ================= ADD TO CART SYSTEM ================= */

const cart = {
  items: JSON.parse(localStorage.getItem("cartItems")) || [],
};

/* ---- Floating Cart Button (navbar ke neeche) ---- */
const cartBtn = document.createElement("div");
cartBtn.innerHTML = `<i class="fas fa-shopping-cart"></i> <span id="cartCount">0</span>`;
cartBtn.style.cssText = `
  position: fixed;
  top: 90px;
  right: 20px;
  background: #111;
  color: #fff;
  padding: 12px 18px;
  border-radius: 30px;
  cursor: pointer;
  z-index: 999;
`;
document.body.appendChild(cartBtn);

/* ---- Cart Box ---- */
const cartBox = document.createElement("div");
cartBox.style.cssText = `
  position: fixed;
  top: 140px;
  right: 20px;
  width: 320px;
  background: #fff;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 10px 25px rgba(0,0,0,.2);
  display: none;
  z-index: 999;
`;
document.body.appendChild(cartBox);

cartBtn.onclick = () => {
  cartBox.style.display =
    cartBox.style.display === "none" ? "block" : "none";
};

/* ---- Update Cart UI ---- */
function updateCart() {
  localStorage.setItem("cartItems", JSON.stringify(cart.items));

  const count = cart.items.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById("cartCount").innerText = count;

  if (cart.items.length === 0) {
    cartBox.innerHTML = "<p>🛒 Cart is empty</p>";
    return;
  }

  let total = 0;
  cartBox.innerHTML = `<h3>Your Cart</h3>`;

  cart.items.forEach((item, i) => {
    total += item.price * item.qty;

    cartBox.innerHTML += `
      <div style="margin:10px 0;">
        <strong>${item.name}</strong>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px;">
          <div>
            <button onclick="changeQty(${i}, -1)">−</button>
            <span style="margin:0 8px;">${item.qty}</span>
            <button onclick="changeQty(${i}, 1)">+</button>
          </div>
          <span>₹${item.price * item.qty}</span>
          <button onclick="removeItem(${i})">❌</button>
        </div>
      </div>
    `;
  });

  cartBox.innerHTML += `
    <hr>
    <strong>Total: ₹${total}</strong>
    <button onclick="checkout()" style="
      width:100%;
      margin-top:12px;
      padding:10px;
      background:#111;
      color:#fff;
      border:none;
      border-radius:8px;
      cursor:pointer;
    ">Checkout</button>
  `;
}

/* ---- Quantity Change ---- */
function changeQty(index, change) {
  cart.items[index].qty += change;
  if (cart.items[index].qty <= 0) {
    cart.items.splice(index, 1);
  }
  updateCart();
}

/* ---- Remove Item ---- */
function removeItem(index) {
  cart.items.splice(index, 1);
  updateCart();
}

/* ---- Checkout (WhatsApp) ---- */
function checkout() {
  let message = "🛒 AKB Cafe Order:%0A";
  let total = 0;

  cart.items.forEach((item) => {
    message += `${item.name} x ${item.qty} = ₹${
      item.price * item.qty
    }%0A`;
    total += item.price * item.qty;
  });

  message += `%0A💰 Total: ₹${total}`;

  window.open(
    `https://wa.me/919170441747?text=${message}`,
    "_blank"
  );
}

/* ---- Attach Add to Cart Buttons ---- */
document.querySelectorAll(".menu__card").forEach((card) => {
  const btn = card.querySelector(".menu__btn");
  const name = card.querySelector(".menu__item").innerText;
  const price = Number(
    card.querySelector(".menu__price").innerText.replace("₹", "")
  );

  btn.innerText = "Add to Cart";

  btn.addEventListener("click", () => {
    const existing = cart.items.find((i) => i.name === name);
    if (existing) {
      existing.qty++;
    } else {
      cart.items.push({ name, price, qty: 1 });
    }
    updateCart();
  });
});

/* ---- Init ---- */
updateCart();
