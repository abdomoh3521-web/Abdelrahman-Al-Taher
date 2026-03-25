const STORAGE_PRODUCTS = 'computerStoreProducts';
const STORAGE_SALES = 'computerStoreSales';

const productForm = document.getElementById('product-form');
const saleForm = document.getElementById('sale-form');
const productNameInput = document.getElementById('product-name');
const productPriceInput = document.getElementById('product-price');
const saleProductSelect = document.getElementById('sale-product');
const saleQuantityInput = document.getElementById('sale-quantity');

const productsTableBody = document.querySelector('#products-table tbody');
const salesTableBody = document.querySelector('#sales-table tbody');
const dailyTableBody = document.querySelector('#daily-table tbody');
const totalSalesEl = document.getElementById('total-sales');
const totalItemsEl = document.getElementById('total-items');

let products = JSON.parse(localStorage.getItem(STORAGE_PRODUCTS) || '[]');
let sales = JSON.parse(localStorage.getItem(STORAGE_SALES) || '[]');

function saveData() {
    localStorage.setItem(STORAGE_PRODUCTS, JSON.stringify(products));
    localStorage.setItem(STORAGE_SALES, JSON.stringify(sales));
}

function getDayKey(date) {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function renderProducts() {
    productsTableBody.innerHTML = '';
    saleProductSelect.innerHTML = '';
   
    if (products.length === 0) {
        productsTableBody.innerHTML = '<tr><td colspan="4">لا يوجد منتجات مضافة بعد</td></tr>';
        saleProductSelect.innerHTML = '<option value="">لا يوجد</option>';
        return;
    }

    products.forEach((product, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${product.name}</td>
            <td>${product.price.toFixed(2)}</td>
            <td><button class="delete-btn" data-id="${product.id}">حذف</button></td>
        `;
        productsTableBody.appendChild(tr);

        const opt = document.createElement('option');
        opt.value = product.id;
        opt.textContent = `${product.name} - ${product.price.toFixed(2)} جنيه`;
        saleProductSelect.appendChild(opt);
    });
}

function renderSales() {
    salesTableBody.innerHTML = '';
    if (sales.length === 0) {
        salesTableBody.innerHTML = '<tr><td colspan="5">لا يوجد مبيعات بعد</td></tr>';
    } else {
        sales.forEach(sale => {
            const product = products.find(p => p.id === sale.productId);
            if (!product) return;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${sale.date}</td>
                <td>${product.name}</td>
                <td>${sale.quantity}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>${sale.total.toFixed(2)}</td>
            `;
            salesTableBody.appendChild(tr);
        });
    }

    let totalSales = 0;
    let totalItems = 0;
    sales.forEach(sale => {
        totalSales += sale.total;
        totalItems += sale.quantity;
    });

    totalSalesEl.textContent = totalSales.toFixed(2);
    totalItemsEl.textContent = totalItems;
}

function renderDailySummary() {
    const daily = {};
    sales.forEach(sale => {
        const day = getDayKey(sale.date);
        if (!daily[day]) daily[day] = { total: 0, quantity: 0 };
        daily[day].total += sale.total;
        daily[day].quantity += sale.quantity;
    });

    const sortedDays = Object.keys(daily).sort((a,b) => new Date(a) - new Date(b));
    dailyTableBody.innerHTML = '';
    if (sortedDays.length === 0) {
        dailyTableBody.innerHTML = '<tr><td colspan="3">لا يوجد بيانات يومية</td></tr>';
        return;
    }

    sortedDays.forEach(day => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${day}</td><td>${daily[day].total.toFixed(2)}</td><td>${daily[day].quantity}</td>`;
        dailyTableBody.appendChild(row);
    });
}

productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = productNameInput.value.trim();
    const price = parseFloat(productPriceInput.value);

    if (!name || isNaN(price) || price <= 0) return;

    products.push({ id: Date.now().toString(), name, price });
    productNameInput.value = '';
    productPriceInput.value = '';
    saveData();
    renderProducts();
});

saleForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const productId = saleProductSelect.value;
    const quantity = parseInt(saleQuantityInput.value);

    if (!productId || isNaN(quantity) || quantity <= 0) return;

    const product = products.find(p => p.id === productId);
    if (!product) return;

    const now = new Date();
    const date = now.toLocaleString('ar-EG', { hour12: false });
    const total = product.price * quantity;

    sales.push({ id: Date.now().toString(), productId, quantity, date, total });
    saleQuantityInput.value = 1;
    saveData();
    renderSales();
    renderDailySummary();
});

productsTableBody.addEventListener('click', (e) => {
    if (e.target.matches('.delete-btn')) {
        const id = e.target.getAttribute('data-id');
        products = products.filter(p => p.id !== id);
        // Remove related sales automatically
        sales = sales.filter(s => s.productId !== id);
        saveData();
        renderProducts();
        renderSales();
        renderDailySummary();
    }
});

function initialize() {
    renderProducts();
    renderSales();
    renderDailySummary();

    if (!products.length) {
        // add default sample products
        products = [
            { id: 'p1', name: 'لابتوب ديل', price: 12000 },
            { id: 'p2', name: 'ويندوز 11 برو', price: 2100 },
            { id: 'p3', name: 'رام 16 جيجا', price: 850 }
        ];
        saveData();
        renderProducts();
    }
}

initialize();
