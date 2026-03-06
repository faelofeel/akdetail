const pb = new PocketBase('https://pocketbase-production-70159.up.railway.app');

// Общие элементы
const serviceForm = document.getElementById('service-form');
const reviewForm = document.getElementById('review-form');
const serviceList = document.getElementById('service-list');
const reviewList = document.getElementById('review-list');

// Переключение вкладок
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
  });
});

// === УСЛУГИ ===

// Загрузка услуг
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
    console.error('Ошибка загрузки услуг:', err);
  }
}

// Редактирование услуги
window.editService = async (id) => {
  try {
    const item = await pb.collection('services').getOne(id);
    document.getElementById('service-id').value = item.id;
    document.getElementById('title').value = item.title;
    document.getElementById('description').value = item.description || '';
    document.getElementById('price').value = item.price;
    document.getElementById('time').value = item.time || '';
    document.getElementById('order').value = item.order || 0;
    document.getElementById('form-title').textContent = 'Редактировать услугу';
    document.getElementById('cancel-service-edit').classList.remove('hidden');
  } catch (err) {
    alert('Ошибка загрузки услуги');
  }
};

// Сохранение услуги
serviceForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('title', document.getElementById('title').value);
  formData.append('description', document.getElementById('description').value);
  formData.append('price', document.getElementById('price').value.trim());
  formData.append('time', document.getElementById('time').value);
  formData.append('order', document.getElementById('order').value || 0);

  if (document.getElementById('image').files[0]) {
    formData.append('image', document.getElementById('image').files[0]);
  }

  try {
    if (document.getElementById('service-id').value) {
      await pb.collection('services').update(document.getElementById('service-id').value, formData);
    } else {
      await pb.collection('services').create(formData);
    }
    alert('Услуга сохранена!');
    serviceForm.reset();
    document.getElementById('form-title').textContent = 'Добавить новую услугу';
    document.getElementById('cancel-service-edit').classList.add('hidden');
    document.getElementById('service-id').value = '';
    loadServices();
  } catch (err) {
    alert('Ошибка сохранения: ' + err.message);
  }
});

// Отмена услуги
document.getElementById('cancel-service-edit').addEventListener('click', () => {
  serviceForm.reset();
  document.getElementById('form-title').textContent = 'Добавить новую услугу';
  document.getElementById('cancel-service-edit').classList.add('hidden');
  document.getElementById('service-id').value = '';
});

// Удаление услуги
window.deleteService = async (id) => {
  if (!confirm('Удалить услугу навсегда?')) return;
  try {
    await pb.collection('services').delete(id);
    loadServices();
  } catch (err) {
    alert('Ошибка удаления');
  }
};

// === ОТЗЫВЫ ===

// Загрузка отзывов
async function loadReviews() {
  try {
    const res = await pb.collection('reviews').getList(1, 50, { sort: '-created' });
    reviewList.innerHTML = '';
    res.items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'review-card-admin';
      card.innerHTML = `
        <div class="review-header">
          <h3>${item.name}</h3>
          <div class="review-date">${new Date(item.created).toLocaleDateString('ru-RU')}</div>
        </div>
        <p>${item.text}</p>
        <div class="actions">
          <button onclick="editReview('${item.id}')">Редактировать</button>
          <button onclick="deleteReview('${item.id}')">Удалить</button>
        </div>
      `;
      reviewList.appendChild(card);
    });
  } catch (err) {
    console.error('Ошибка загрузки отзывов:', err);
  }
}

// Редактирование отзыва
window.editReview = async (id) => {
  try {
    const item = await pb.collection('reviews').getOne(id);
    document.getElementById('review-id').value = item.id;
    document.getElementById('name').value = item.name;
    document.getElementById('text').value = item.text;
    document.getElementById('form-title').textContent = 'Редактировать отзыв';
    document.getElementById('cancel-edit').classList.remove('hidden');
  } catch (err) {
    alert('Ошибка загрузки отзыва');
  }
};

// Сохранение отзыва
reviewForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    name: document.getElementById('name').value.trim(),
    text: document.getElementById('text').value.trim()
  };

  try {
    if (document.getElementById('review-id').value) {
      await pb.collection('reviews').update(document.getElementById('review-id').value, formData);
    } else {
      await pb.collection('reviews').create(formData);
    }
    alert('Отзыв сохранён!');
    reviewForm.reset();
    document.getElementById('form-title').textContent = 'Добавить новый отзыв';
    document.getElementById('cancel-edit').classList.add('hidden');
    document.getElementById('review-id').value = '';
    loadReviews();
  } catch (err) {
    alert('Ошибка сохранения: ' + err.message);
  }
});

// Отмена отзыва
document.getElementById('cancel-edit').addEventListener('click', () => {
  reviewForm.reset();
  document.getElementById('form-title').textContent = 'Добавить новый отзыв';
  document.getElementById('cancel-edit').classList.add('hidden');
  document.getElementById('review-id').value = '';
});

// Удаление отзыва
window.deleteReview = async (id) => {
  if (!confirm('Удалить отзыв навсегда?')) return;
  try {
    await pb.collection('reviews').delete(id);
    loadReviews();
  } catch (err) {
    alert('Ошибка удаления');
  }
};

// Запуск
loadServices();
loadReviews();
