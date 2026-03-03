// configuration
const manufacturers = [
  { name: 'DeFacto', logo: 'DeFacto.png', data: 'DeFacto.json' },
  { name: 'Loft',    logo: 'Loft.png',    data: 'Loft.json'    },
  // добавляйте другие производители в том же формате
];

let currentStructure = null; // структура для выбранного производителя

// упорядоченный список главных разделов
const orderedMains = ['мужское','женское','юноши','девушки','мальчики','девочки'];

document.addEventListener('DOMContentLoaded', () => {
  initManufacturers();
  setupModal();
});

function initManufacturers() {
  const div = document.getElementById('manufacturers');
  div.innerHTML = ''; // clear existing logos
  manufacturers.forEach((m,idx) => {
    const img = document.createElement('img');
    img.src = m.logo;
    img.alt = m.name;
    img.title = m.name;
    img.addEventListener('click', () => {
      // highlight selected
      document.querySelectorAll('#manufacturers img').forEach(i=>i.classList.remove('selected'));
      img.classList.add('selected');
      loadProducts(m.data);
    });
    div.appendChild(img);
    if (idx === 0) {
      // pre-select first
      img.classList.add('selected');
    }
  });
  if (manufacturers.length) {
    loadProducts(manufacturers[0].data);
  }
}

// home button is a normal link; no click handler needed now (navigation handled by browser)

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
  products.forEach((p,i) => {
    if (!p || typeof p !== 'object') {
      console.warn('buildStructure skipped non-object', i, p);
      return;
    }
    const main = p.main || 'другое';
    const cat = p.category || 'Без категории';
    if (!struct[main]) struct[main] = {};
    if (!struct[main][cat]) struct[main][cat] = [];
    struct[main][cat].push(p);
  });
  // sort subcategories alphabetically (русские строки)
  Object.keys(struct).forEach(m => {
    if (!struct[m]) {
      console.warn('struct has undefined for main',m);
      return;
    }
    const sorted = {};
    Object.keys(struct[m]).sort((a,b)=> a.localeCompare(b,'ru')).forEach(k=> sorted[k] = struct[m][k]);
    struct[m] = sorted;
  });
  return struct;
}

function populateMainSelect() {
  const select = document.getElementById('main-select');
  select.innerHTML = '';
  const mains = Object.keys(currentStructure);
  // order according to orderedMains array, others after
  const sortedMains = [...orderedMains.filter(m=>mains.includes(m)), ...mains.filter(m=>!orderedMains.includes(m))];
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
  } else {
    console.warn('no mains available');
  }
}

function updateSubSelect(main) {
  const subSelect = document.getElementById('sub-select');
  subSelect.innerHTML = '';
  const subs = Object.keys(currentStructure[main] || {});
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
  } else {
    document.getElementById('product-list').innerHTML = '<p>Нет товаров</p>';
  }
}


/* attempt to resolve a Loft page URL to the actual image file inside it */
function resolveLoftImage(pageUrl) {
  // fetch text and parse first <img> tag inside body
  return fetch(pageUrl)
    .then(r => r.text())
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const img = doc.querySelector('img');
      if (img) {
        let src = img.getAttribute('src');
        if (src && !src.startsWith('http')) {
          // make absolute
          const base = new URL(pageUrl).origin;
          src = base + src;
        }
        return src;
      }
      return null;
    })
    .catch(() => null);
}

function showProducts(products) {
  if (!products || !products.length) {
    console.warn('showProducts called with empty list', products);
  }
  const list = document.getElementById('product-list');
  list.innerHTML = '';
  products.forEach(p => {
    const div = document.createElement('div');
    div.className = 'product';
    // helper to format field or default
    const fmt = (label, val) => {
      // gracefully handle undefined/null/numeric values
      if (val === undefined || val === null) {
        return `<p>${label}: <em>не указано</em></p>`;
      }
      const s = String(val).trim();
      if (s === '') {
        return `<p>${label}: <em>не указано</em></p>`;
      }
      return `<p>${label}: ${val}</p>`;
    };
    // initial image source; loft page URLs will be resolved later
    let imgsrc = p.image || 'noimage.png';
    div.innerHTML = `
      <img src="${imgsrc}" alt="${p.name}" data-large="${imgsrc}">
      <h2>${p.name}</h2>
      <p>Цена: ${p.price}</p>
      ${fmt('Материал', p.Composition)}
      ${fmt('Размерный ряд', p.SizeInLot)}
      ${fmt('Ед. в линейке', p.LotInQuantity)}
    `;
    list.appendChild(div);
  });
  hookProductImages();
  // after DOM updated, attempt to fetch real images for loft items
  document.querySelectorAll('#product-list .product img').forEach(img => {
    const orig = img.getAttribute('src');
    if (orig && orig.toLowerCase().includes('productimage.loft.com.tr')) {
      resolveLoftImage(orig).then(real => {
        if (real) {
          img.src = real;
          img.dataset.large = real;
        }
      });
    }
  });
}


/* modal support */
function setupModal() {
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modal-img');
  const close = document.getElementById('modal-close');
  close.addEventListener('click', () => modal.classList.add('hidden'));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.add('hidden');
  });
}

function hookProductImages() {
  document.querySelectorAll('.product img').forEach(img => {
    img.addEventListener('click', () => {
      const modal = document.getElementById('modal');
      const modalImg = document.getElementById('modal-img');
      modalImg.src = img.dataset.large || img.src;
      modal.classList.remove('hidden');
    });
  });
}
