// admin.js — управление услугами

const PB_URL = 'https://pocketbase-production-70159.up.railway.app';
const pb = new PocketBase(PB_URL);

// Простая защита паролем (поменяйте на свой!)
const ADMIN_PASSWORD = '73f9565659a97bfebc2fff131fc83ac6fb26145abfef685919bf0d34c692b03c'; // ← ИЗМЕНИТЕ ЭТО ОБЯЗАТЕЛЬНО

// Проверка авторизации при загрузке страницы
if (!localStorage.getItem('adminAuthenticated')) {
  const enteredPass = prompt('Введите пароль администратора:');
  if (enteredPass !== ADMIN_PASSWORD) {
    alert('Неверный пароль');
    window.location.href = 'index.html';
    return;
  }
  localStorage.setItem('adminAuthenticated', 'true');
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

// Предпросмотр изображения
imageInput.addEventListener('change', () => {
  const file = imageInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImg.src = e.target.result;
      previewImg.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
});

// Загрузка списка услуг при открытии страницы
async function loadServices() {
  try {
    const res = await pb.collection('services').getList(1, 50, { sort: '+order' });
    serviceList.innerHTML = '';
    res.items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'service-card-admin';
      card.innerHTML = `
        ${item.image ? `<img src="${pb.getFileUrl(item, item.image)}" alt="${item.title}">` : '<div style="height:180px;background:#333;"></div>'}
        <div class="info">
          <h3>${item.title}</h3>
          <p>${item.description || ''}</p>
          <strong>${item.price}</strong> • ${item.time || ''}
          <div class="actions">
            <button class="btn-primary btn-edit" onclick="editService('${item.id}')">Редактировать</button>
            <button class="btn-primary btn-delete" onclick="deleteService('${item.id}')">Удалить</button>
          </div>
        </div>
      `;
      serviceList.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    alert('Не удалось загрузить список услуг');
  }
}

// Редактирование услуги
window.editService = async (id) => {
  try {
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    alert('Ошибка загрузки услуги');
  }
};

// Отмена редактирования
cancelBtn.addEventListener('click', () => {
  form.reset();
  previewImg.style.display = 'none';
  formTitle.textContent = 'Добавить новую услугу';
  cancelBtn.classList.add('hidden');
  serviceIdInput.value = '';
});

// Удаление услуги
window.deleteService = async (id) => {
  if (!confirm('Удалить эту услугу навсегда?')) return;
  try {
    await pb.collection('services').delete(id);
    loadServices();
    alert('Услуга удалена');
  } catch (err) {
    alert('Ошибка удаления');
  }
};

// Сохранение (создание или обновление)
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('title', titleInput.value);
  formData.append('description', descInput.value);
  formData.append('price', priceInput.value);
  formData.append('time', timeInput.value);
  formData.append('order', orderInput.value || 0);

  if (imageInput.files[0]) {
    formData.append('image', imageInput.files[0]);
  }

  try {
    if (serviceIdInput.value) {
      // Обновление существующей
      await pb.collection('services').update(serviceIdInput.value, formData);
      alert('Услуга обновлена!');
    } else {
      // Создание новой
      await pb.collection('services').create(formData);
      alert('Услуга добавлена!');
    }

    form.reset();
    previewImg.style.display = 'none';
    formTitle.textContent = 'Добавить новую услугу';
    cancelBtn.classList.add('hidden');
    serviceIdInput.value = '';
    loadServices();
  } catch (err) {
    console.error(err);
    alert('Ошибка сохранения: ' + (err.message || 'Проверьте заполненные поля'));
  }
});

// Загрузка списка при открытии страницы
loadServices();
