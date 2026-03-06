const pb = new PocketBase('https://pocketbase-production-70159.up.railway.app');

const form = document.getElementById('service-form');
const serviceIdInput = document.getElementById('service-id');
const titleInput = document.getElementById('title');
const descInput = document.getElementById('description');
const priceInput = document.getElementById('price');
const timeInput = document.getElementById('time');
const imageInput = document.getElementById('image');
const orderInput = document.getElementById('order');
const previewImg = document.getElementById('preview');
const fileNameDisplay = document.getElementById('file-name');
const formTitle = document.getElementById('form-title');
const cancelBtn = document.getElementById('cancel-edit');
const serviceList = document.getElementById('service-list');

// Отображение имени файла при выборе
imageInput.addEventListener('change', () => {
  const file = imageInput.files[0];
  if (file && fileNameDisplay) {
    fileNameDisplay.textContent = file.name;
  }
  if (file && previewImg) {
    const reader = new FileReader();
    reader.onload = e => {
      previewImg.src = e.target.result;
      previewImg.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
});

// Загрузка списка услуг
async function loadServices() {
  try {
    const res = await pb.collection('services').getList(1, 50, { sort: '+order' });
    serviceList.innerHTML = '';
    res.items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'service-card-admin';
      card.innerHTML = `
        ${item.image ? `<img src="${pb.files.getURL(item, item.image)}" alt="${item.title}">` : ''}
        <div class="info">
          <h3>${item.title}</h3>
          <p>${item.description || ''}</p>
          <strong>${item.price} ₽</strong> • ${item.time || ''}
          <div class="actions">
            <button onclick="editService('${item.id}')">Редактировать</button>
            <button onclick="deleteService('${item.id}')">Удалить</button>
          </div>
        </div>
      `;
      serviceList.appendChild(card);
    });
  } catch (err) {
    console.error('Ошибка загрузки:', err);
  }
}

// Редактирование
window.editService = async (id) => {
  try {
    const item = await pb.collection('services').getOne(id);
    serviceIdInput.value = item.id;
    titleInput.value = item.title;
    descInput.value = item.description || '';
    priceInput.value = item.price; // без ₽
    timeInput.value = item.time || '';
    orderInput.value = item.order || 0;
    if (previewImg && item.image) {
      previewImg.src = pb.files.getURL(item, item.image);
      previewImg.style.display = 'block';
    }
    formTitle.textContent = 'Редактировать услугу';
    cancelBtn.classList.remove('hidden');
  } catch (err) {
    alert('Ошибка загрузки услуги');
  }
};

// Отмена
cancelBtn.addEventListener('click', () => {
  form.reset();
  if (previewImg) previewImg.style.display = 'none';
  if (fileNameDisplay) fileNameDisplay.textContent = 'Не выбран файл';
  formTitle.textContent = 'Добавить новую услугу';
  cancelBtn.classList.add('hidden');
  serviceIdInput.value = '';
});

// Удаление
window.deleteService = async (id) => {
  if (!confirm('Удалить услугу навсегда?')) return;
  try {
    await pb.collection('services').delete(id);
    loadServices();
  } catch (err) {
    alert('Ошибка удаления');
  }
};

// Сохранение
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('title', titleInput.value);
  formData.append('description', descInput.value);
  formData.append('price', priceInput.value.trim()); // чистое значение
  formData.append('time', timeInput.value);
  formData.append('order', orderInput.value || 0);

  if (imageInput.files[0]) formData.append('image', imageInput.files[0]);

  try {
    if (serviceIdInput.value) {
      await pb.collection('services').update(serviceIdInput.value, formData);
    } else {
      await pb.collection('services').create(formData);
    }
    alert('Услуга сохранена!');
    form.reset();
    if (previewImg) previewImg.style.display = 'none';
    if (fileNameDisplay) fileNameDisplay.textContent = 'Не выбран файл';
    loadServices();
  } catch (err) {
    alert('Ошибка сохранения: ' + err.message);
  }
});

loadServices();
