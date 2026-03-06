const pb = new PocketBase('https://pocketbase-production-70159.up.railway.app');

// === ПАРОЛЬ (измени на свой) ===
const ADMIN_PASSWORD = 'akdetail2026';

if (!localStorage.getItem('adminAuthenticated')) {
    const pass = prompt('Введите пароль администратора:');
    if (pass !== ADMIN_PASSWORD) {
        alert('Неверный пароль');
        window.location.href = 'index.html';
    } else {
        localStorage.setItem('adminAuthenticated', 'true');
    }
}

// Элементы формы
const form = document.getElementById('service-form');
const serviceIdInput = document.getElementById('service-id');
const titleInput = document.getElementById('title');
const descInput = document.getElementById('description');
const priceInput = document.getElementById('price');
const timeInput = document.getElementById('time');
const imageInput = document.getElementById('image');
const orderInput = document.getElementById('order');
const previewImg = document.getElementById('preview');
const formTitle = document.getElementById('form-title');
const cancelBtn = document.getElementById('cancel-edit');
const serviceList = document.getElementById('service-list');

// Предпросмотр фото
imageInput.addEventListener('change', () => {
    const file = imageInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = e => {
            previewImg.src = e.target.result;
            previewImg.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

// Загрузка списка
async function loadServices() {
    const res = await pb.collection('services').getList(1, 50, { sort: '+order' });
    serviceList.innerHTML = '';
    res.items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'service-card-admin';
        card.innerHTML = `
            ${item.image ? `<img src="${pb.getFileUrl(item, item.image)}" alt="${item.title}">` : ''}
            <div class="info">
                <h3>${item.title}</h3>
                <p>${item.description || ''}</p>
                <strong>${item.price}</strong> • ${item.time || ''}
                <div class="actions">
                    <button onclick="editService('${item.id}')">Редактировать</button>
                    <button onclick="deleteService('${item.id}')">Удалить</button>
                </div>
            </div>
        `;
        serviceList.appendChild(card);
    });
}

// Редактирование
window.editService = async (id) => {
    const item = await pb.collection('services').getOne(id);
    serviceIdInput.value = item.id;
    titleInput.value = item.title;
    descInput.value = item.description || '';
    priceInput.value = item.price;
    timeInput.value = item.time || '';
    orderInput.value = item.order || 0;
    previewImg.src = item.image ? pb.getFileUrl(item, item.image) : '';
    previewImg.style.display = item.image ? 'block' : 'none';
    formTitle.textContent = 'Редактировать услугу';
    cancelBtn.classList.remove('hidden');
};

// Отмена
cancelBtn.addEventListener('click', () => {
    form.reset();
    previewImg.style.display = 'none';
    formTitle.textContent = 'Добавить новую услугу';
    cancelBtn.classList.add('hidden');
    serviceIdInput.value = '';
});

// Удаление
window.deleteService = async (id) => {
    if (!confirm('Удалить услугу навсегда?')) return;
    await pb.collection('services').delete(id);
    loadServices();
};

// Сохранение
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', titleInput.value);
    formData.append('description', descInput.value);
    formData.append('price', priceInput.value);
    formData.append('time', timeInput.value);
    formData.append('order', orderInput.value || 0);

    if (imageInput.files[0]) formData.append('image', imageInput.files[0]);

    try {
        if (serviceIdInput.value) {
            await pb.collection('services').update(serviceIdInput.value, formData);
        } else {
            await pb.collection('services').create(formData);
        }
        alert('Услуга успешно сохранена!');
        form.reset();
        previewImg.style.display = 'none';
        formTitle.textContent = 'Добавить новую услугу';
        cancelBtn.classList.add('hidden');
        serviceIdInput.value = '';
        loadServices();
    } catch (err) {
        alert('Ошибка: ' + err.message);
    }
});

loadServices();
