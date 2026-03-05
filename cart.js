document.addEventListener('DOMContentLoaded', renderCart);

function renderCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const tableBody = document.getElementById('cart-items');
    const totalDisplay = document.getElementById('total-price');
    const container = document.getElementById('cart-container');
    const emptyMsg = document.getElementById('empty-msg');

    if (cart.length === 0) {
        if (container) container.style.display = 'none';
        if (emptyMsg) emptyMsg.style.display = 'block';
        return;
    }

    tableBody.innerHTML = '';
    let grandTotal = 0;

    cart.forEach((item, index) => {
        const price = parseFloat(item.price) || 0;
        const lotQty = parseInt(item.LotInQuantity || item.lotInQuantity) || 0;
        const count = parseInt(item.quantity) || 1;

        const pricePerLot = price * lotQty;
        const itemTotal = pricePerLot * count;
        grandTotal += itemTotal;

        tableBody.innerHTML += `
            <tr>
                <td><img src="${item.image}" class="cart-img"></td>
                <td>${item.name}</td>
                <td><small>${item.SizeInLot || item.sizeInLot || '-'}</small></td>
                <td>${lotQty} шт.</td> <td>
                    <button class="qty-btn" onclick="changeQty(${index}, -1)">-</button>
                    <span style="margin: 0 10px">${count}</span>
                    <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
                </td>
                <td>${pricePerLot.toFixed(2)} $</td>
                <td><strong>${itemTotal.toFixed(2)} $</strong></td>
                <td><button class="remove-btn" onclick="removeItem(${index})">×</button></td>
            </tr>
        `;
    });

    totalDisplay.textContent = grandTotal.toFixed(2);
}

function changeQty(index, delta) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    cart[index].quantity = (parseInt(cart[index].quantity) || 1) + delta;
    if (cart[index].quantity < 1) cart[index].quantity = 1;
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

function clearCart() {
    if(confirm("Очистить корзину?")) {
        localStorage.removeItem('cart');
        renderCart();
    }
}

function sendOrder() {
    const name = document.getElementById('order-name').value;
    const phone = document.getElementById('order-phone').value;
    const email = document.getElementById('order-email').value || "Не указан";
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (!name || !phone) {
        alert("Пожалуйста, введите имя и телефон!");
        return;
    }

    let orderDetails = cart.map(item => {
        const p = parseFloat(item.price) || 0;
        const l = parseInt(item.LotInQuantity || item.lotInQuantity) || 0;
        return `${item.name} | В лоте: ${l} шт. | Заказано лотов: ${item.quantity} | Итого: ${(p * l * item.quantity).toFixed(2)} $`;
    }).join('\n');

    const total = document.getElementById('total-price').textContent;

    const templateParams = {
        name: name,
        from_name: name,
        phone: phone,
        email: email,
        message: orderDetails,
        total_price: total + " $"
    };

    emailjs.send('service_q5l4h9z', 'template_ynpnixa', templateParams)
        .then(function(response) {
            alert("Заявка успешно отправлена! Мы свяжемся с вами.");
            localStorage.removeItem('cart');
            window.location.href = "index.html";
        }, function(error) {
            alert("Ошибка: " + JSON.stringify(error));
        });
}