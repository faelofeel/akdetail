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
const formTitle = document.getElementById('form-title');
const cancelBtn = document.getElementById('cancel-edit');
const serviceList = document.getElementById('service-list');

// Предпросмотр фото
imageInput.addEventListener('change', () => {
  const file = imageInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => { previewImg.src = e.target.result; previewImg.style.display = 'block'; };
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

// Редактирование, удаление, сохранение — минимально
window.editService = async (id) => { /* пока пусто */ };
window.deleteService = async (id) => { /* пока пусто */ };

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
    alert('Услуга сохранена!');
    form.reset();
    previewImg.style.display = 'none';
    loadServices();
  } catch (err) {
    alert('Ошибка: ' + err.message);
  }
});

loadServices();
