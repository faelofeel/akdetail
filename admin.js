const pb = new PocketBase('https://pocketbase-production-70159.up.railway.app');

// Услуги
const serviceForm = document.getElementById('service-form');
const serviceIdInput = document.getElementById('service-id');
const titleInput = document.getElementById('title');
const descInput = document.getElementById('description');
const priceInput = document.getElementById('price');
const timeInput = document.getElementById('time');
const imageInput = document.getElementById('image');
const orderInput = document.getElementById('order');
const previewImg = document.getElementById('preview');
const serviceFormTitle = document.getElementById('service-form-title');
const cancelServiceBtn = document.getElementById('cancel-service-edit');
const serviceList = document.getElementById('service-list');

// Отзывы
const reviewForm = document.getElementById('review-form');
const reviewIdInput = document.getElementById('review-id');
const nameInput = document.getElementById('name');
const textInput = document.getElementById('text');
const reviewFormTitle = document.getElementById('review-form-title');
const cancelReviewBtn = document.getElementById('cancel-review-edit');
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

window.editService = async (id) => {
  try {
    const item = await pb.collection('services').getOne(id);
    serviceIdInput.value = item.id;
    titleInput.value = item.title;
    descInput.value = item.description || '';
    priceInput.value = item.price;
    timeInput.value = item.time || '';
    orderInput.value = item.order || 0;
    serviceFormTitle.textContent = 'Редактировать услугу';
    if (cancelServiceBtn) cancelServiceBtn.classList.remove('hidden');
  } catch (err) {
    alert('Ошибка загрузки услуги');
  }
};

serviceForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('title', titleInput.value);
  formData.append('description', descInput.value);
  formData.append('price', priceInput.value.trim());
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
    serviceForm.reset();
    serviceFormTitle.textContent = 'Добавить новую услугу';
    if (cancelServiceBtn) cancelServiceBtn.classList.add('hidden');
    serviceIdInput.value = '';
    loadServices();
  } catch (err) {
    alert('Ошибка сохранения услуги: ' + err.message);
  }
});

if (cancelServiceBtn) {
  cancelServiceBtn.addEventListener('click', () => {
    serviceForm.reset();
    serviceFormTitle.textContent = 'Добавить новую услугу';
    cancelServiceBtn.classList.add('hidden');
    serviceIdInput.value = '';
  });
}

window.deleteService = async (id) => {
  if (!confirm('Удалить услугу навсегда?')) return;
  try {
    await pb.collection('services').delete(id);
    loadServices();
  } catch (err) {
    alert('Ошибка удаления услуги');
  }
};

// === ОТЗЫВЫ ===

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

window.editReview = async (id) => {
  try {
    const item = await pb.collection('reviews').getOne(id);
    reviewIdInput.value = item.id;
    nameInput.value = item.name;
    textInput.value = item.text;
    reviewFormTitle.textContent = 'Редактировать отзыв';
    if (cancelReviewBtn) cancelReviewBtn.classList.remove('hidden');
  } catch (err) {
    alert('Ошибка загрузки отзыва');
  }
};

reviewForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    name: nameInput.value.trim(),
    text: textInput.value.trim()
  };

  try {
    if (reviewIdInput.value) {
      await pb.collection('reviews').update(reviewIdInput.value, formData);
    } else {
      await pb.collection('reviews').create(formData);
    }
    alert('Отзыв сохранён!');
    reviewForm.reset();
    reviewFormTitle.textContent = 'Добавить новый отзыв';
    if (cancelReviewBtn) cancelReviewBtn.classList.add('hidden');
    reviewIdInput.value = '';
    loadReviews();
  } catch (err) {
    alert('Ошибка сохранения отзыва: ' + err.message);
  }
});

if (cancelReviewBtn) {
  cancelReviewBtn.addEventListener('click', () => {
    reviewForm.reset();
    reviewFormTitle.textContent = 'Добавить новый отзыв';
    cancelReviewBtn.classList.add('hidden');
    reviewIdInput.value = '';
  });
}

window.deleteReview = async (id) => {
  if (!confirm('Удалить отзыв навсегда?')) return;
  try {
    await pb.collection('reviews').delete(id);
    loadReviews();
  } catch (err) {
    alert('Ошибка удаления отзыва');
  }
};

// Запуск
loadServices();
loadReviews();
