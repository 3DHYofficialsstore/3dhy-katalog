// ===== Konfigurasi harga per ukuran (berlaku untuk semua produk kaos pendek custom) =====
const SIZE_TIERS = [
  { size: "Anak (2-13)", price: 99000 },
  { size: "XS", price: 109000 },
  { size: "S", price: 109000 },
  { size: "M", price: 109000 },
  { size: "L", price: 109000 },
  { size: "XL", price: 109000 },
  { size: "2XL", price: 119000 },
  { size: "3XL", price: 129000 },
  { size: "4XL", price: 139000 },
  { size: "5XL", price: 149000 }
];

const WA_NUMBER = "6281299115928";
const CART_KEY = "3dhy_cart";

function formatRupiah(n){
  return "Rp" + n.toLocaleString('id-ID');
}

function getCart(){
  try{
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  }catch(e){ return []; }
}

function saveCart(cart){
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(item){
  const cart = getCart();
  // Gabung kalau produk+varian+ukuran sama persis
  const existing = cart.find(i => i.code === item.code && i.variant === item.variant && i.size === item.size);
  if(existing){
    existing.qty += item.qty;
  } else {
    cart.push(item);
  }
  saveCart(cart);
}

function removeFromCart(index){
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
}

function updateCartQty(index, qty){
  const cart = getCart();
  if(qty <= 0){
    cart.splice(index, 1);
  } else {
    cart[index].qty = qty;
  }
  saveCart(cart);
}

function cartCount(){
  return getCart().reduce((sum, i) => sum + i.qty, 0);
}

function cartTotal(){
  return getCart().reduce((sum, i) => sum + (i.price * i.qty), 0);
}

function updateCartBadge(){
  const badge = document.getElementById('cartBadge');
  if(!badge) return;
  const count = cartCount();
  badge.textContent = count;
  badge.style.display = count > 0 ? 'flex' : 'none';
}

function buildCheckoutMessage(){
  const cart = getCart();
  if(cart.length === 0) return '';
  let msg = "Halo Kak, saya mau order:\n\n";
  cart.forEach((item, i) => {
    msg += `${i+1}. ${item.productName} - Varian ${item.variant} - Size ${item.size} x${item.qty} = ${formatRupiah(item.price * item.qty)}\n`;
  });
  msg += `\nTotal: ${formatRupiah(cartTotal())}\n\nMohon konfirmasi ketersediaan dan ongkirnya ya Kak. Terima kasih!`;
  return msg;
}

function checkoutLink(){
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(buildCheckoutMessage())}`;
}

document.addEventListener('DOMContentLoaded', updateCartBadge);
