// configuration
const manufacturers = [
  { name: 'DeFacto', logo: 'DeFacto.png', data: 'DeFacto.json' },
];

let currentStructure = null;

// Названия в точности как в твоем новом JSON
const orderedMains = ['Мужчины', 'Женщины', 'Мальчики', 'Девочки', 'Малыши-мальчики', 'Малыши-девочки'];

document.addEventListener('DOMContentLoaded', () => {
  initManufacturers();
  setupModal(); // Инициализируем модальное окно один раз
  updateCartCount();
});

function initManufacturers() {
  const div = document.getElementById('manufacturers');
  if (!div) return;
  div.innerHTML = ''; 
  manufacturers.forEach((m, idx) => {
    const img = document.createElement('img');
    img.src = m.logo;
    img.alt = m.name;
    img.title = m.name;
    img.addEventListener('click', () => {
      document.querySelectorAll('#manufacturers img').forEach(i => i.classList.remove('selected'));
      img.classList.add('selected');
      loadProducts(m.data);
    });
    div.appendChild(img);
    if (idx === 0) img.classList.add('selected');
  });
  if (manufacturers.length) loadProducts(manufacturers[0].data);
}

function loadProducts(jsonFile) {
  fetch(jsonFile)
    .then(r => {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(products => {
      currentStructure = buildStructure(products);
      populateMainSelect();
    })
    .catch(err => console.error('Ошибка загрузки товаров:', err));
}

function buildStructure(products) {
  const struct = {};
  products.forEach((p) => {
    if (!p) return;
    const main = p.main || 'Другое';
    const cat = p.category || 'Без категории';
    if (!struct[main]) struct[main] = {};
    if (!struct[main][cat]) struct[main][cat] = [];
    struct[main][cat].push(p);
  });
  return struct;
}

function populateMainSelect() {
  const select = document.getElementById('main-select');
  if (!select) return;
  select.innerHTML = '';
  const mains = Object.keys(currentStructure);
  const sortedMains = [...orderedMains.filter(m => mains.includes(m)), ...mains.filter(m => !orderedMains.includes(m))];
  
  sortedMains.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m;
    opt.textContent = m;
    select.appendChild(opt);
  });
  select.onchange = () => updateSubSelect(select.value);
  if (sortedMains.length) {
    select.value = sortedMains[0];
    updateSubSelect(select.value);
  }
}

function updateSubSelect(main) {
  const subSelect = document.getElementById('sub-select');
  if (!subSelect) return;
  subSelect.innerHTML = '';
  const subs = Object.keys(currentStructure[main] || {}).sort((a, b) => a.localeCompare(b, 'ru'));
  
  subs.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s;
    opt.textContent = s;
    subSelect.appendChild(opt);
  });
  subSelect.onchange = () => showProducts(currentStructure[main][subSelect.value]);
  if (subs.length) {
    subSelect.value = subs[0];
    showProducts(currentStructure[main][subs[0]]);
  }
}

function showProducts(products) {
  const list = document.getElementById('product-list');
  if (!list) return;
  list.innerHTML = '';
  
  products.forEach(p => {
    const div = document.createElement('div');
    div.className = 'product';

    // Формируем уникальный ID для товара (если в JSON его нет)
    const productId = p.id || btoa(p.name).substring(0, 8); 

    div.innerHTML = `
      <img src="${p.image}" alt="${p.name}" onclick="openModal('${p.image}')">
      <h2>${p.name}</h2>
      <p class="price">Цена: ${p.price} руб.</p>
      <p><strong>Размеры:</strong> ${p.SizeInLot}</p>
      <p><strong>В лоте:</strong> ${p.LotInQuantity} шт.</p>
      <button class="add-to-cart-btn" onclick='addToCart(${JSON.stringify(p)})'>Добавить в корзину</button>
    `;
    list.appendChild(div);
  });
  hookProductImages();
}

/* --- ИСПРАВЛЕННАЯ РАБОТА С МОДАЛКОЙ --- */

function setupModal() {
  const modal = document.getElementById('modal');
  const close = document.getElementById('modal-close');
  if (!modal || !close) return;

  const closeModal = () => {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto'; // Возвращаем прокрутку сайта
  };

  close.onclick = closeModal;
  
  // Закрытие при клике на темный фон
  modal.onclick = (e) => {
    if (e.target === modal) closeModal();
  };
}

function hookProductImages() {
  document.querySelectorAll('.product img').forEach(img => {
    img.onclick = function() {
      const modal = document.getElementById('modal');
      const modalImg = document.getElementById('modal-img');
      if (!modal || !modalImg) return;

      modalImg.src = this.dataset.large || this.src;
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden'; // Отключаем прокрутку сайта при зуме
    };
  });
}

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Ищем, есть ли такой товар уже в корзине
    const existingItem = cart.find(item => item.name === product.name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: product.name,
            price: product.price,
            image: product.image,
            sizeInLot: product.SizeInLot,
            lotInQuantity: product.LotInQuantity,
            quantity: 1 // Количество лотов
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert('Товар добавлен в корзину!');
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cart-count');
    if (badge) badge.textContent = count;
}

// Вызови это при загрузке страницы
updateCartCount();