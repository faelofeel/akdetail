const pb = new PocketBase('https://pocketbase-production-70159.up.railway.app');

// ==================== ЭЛЕМЕНТЫ УСЛУГ ====================
const serviceForm = document.getElementById('service-form');
const serviceId = document.getElementById('service-id');
const serviceTitle = document.getElementById('title');
const serviceDesc = document.getElementById('description');
const servicePrice = document.getElementById('price');
const serviceTime = document.getElementById('time');
const serviceImage = document.getElementById('image');
const serviceOrder = document.getElementById('order');
const serviceFormTitle = document.getElementById('service-form-title');
const cancelServiceBtn = document.getElementById('cancel-service-edit');
const serviceList = document.getElementById('service-list');

// ==================== ЭЛЕМЕНТЫ ОТЗЫВОВ ====================
const reviewForm = document.getElementById('review-form');
const reviewId = document.getElementById('review-id');
const reviewName = document.getElementById('name');
const reviewCar = document.getElementById('car');
const reviewText = document.getElementById('text');
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

// ==================== УСЛУГИ ====================

async function loadServices() {
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
}

window.editService = async (id) => {
  const item = await pb.collection('services').getOne(id);
  serviceId.value = item.id;
  serviceTitle.value = item.title;
  serviceDesc.value = item.description || '';
  servicePrice.value = item.price;
  serviceTime.value = item.time || '';
  serviceOrder.value = item.order || 0;
  serviceFormTitle.textContent = 'Редактировать услугу';
  if (cancelServiceBtn) cancelServiceBtn.classList.remove('hidden');
};

serviceForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append('title', serviceTitle.value);
  formData.append('description', serviceDesc.value);
  formData.append('price', servicePrice.value.trim());
  formData.append('time', serviceTime.value);
  formData.append('order', serviceOrder.value || 0);
  if (serviceImage.files[0]) formData.append('image', serviceImage.files[0]);

  if (serviceId.value) {
    await pb.collection('services').update(serviceId.value, formData);
  } else {
    await pb.collection('services').create(formData);
  }

  alert('Услуга сохранена!');
  serviceForm.reset();
  serviceFormTitle.textContent = 'Добавить новую услугу';
  if (cancelServiceBtn) cancelServiceBtn.classList.add('hidden');
  serviceId.value = '';
  loadServices();
});

if (cancelServiceBtn) {
  cancelServiceBtn.addEventListener('click', () => {
    serviceForm.reset();
    serviceFormTitle.textContent = 'Добавить новую услугу';
    cancelServiceBtn.classList.add('hidden');
    serviceId.value = '';
  });
}

window.deleteService = async (id) => {
  if (!confirm('Удалить услугу?')) return;
  await pb.collection('services').delete(id);
  loadServices();
};

// ==================== ОТЗЫВЫ ====================

async function loadReviews() {
  const res = await pb.collection('reviews').getList(1, 50, { sort: '-created' });
  reviewList.innerHTML = '';
  res.items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'review-card-admin';
    card.innerHTML = `
      <div class="review-header">
        <h3>${item.name}</h3>
        ${item.car ? `<div class="car-model">${item.car}</div>` : ''}
      </div>
      <p>${item.text}</p>
      <div class="actions">
        <button onclick="editReview('${item.id}')">Редактировать</button>
        <button onclick="deleteReview('${item.id}')">Удалить</button>
      </div>
    `;
    reviewList.appendChild(card);
  });
}

window.editReview = async (id) => {
  const item = await pb.collection('reviews').getOne(id);
  reviewId.value = item.id;
  reviewName.value = item.name;
  reviewCar.value = item.car || '';
  reviewText.value = item.text;
  reviewFormTitle.textContent = 'Редактировать отзыв';
  if (cancelReviewBtn) cancelReviewBtn.classList.remove('hidden');
};

reviewForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    name: reviewName.value.trim(),
    car: reviewCar.value.trim(),
    text: reviewText.value.trim()
  };

  if (reviewId.value) {
    await pb.collection('reviews').update(reviewId.value, data);
  } else {
    await pb.collection('reviews').create(data);
  }

  alert('Отзыв сохранён!');
  reviewForm.reset();
  reviewFormTitle.textContent = 'Добавить новый отзыв';
  if (cancelReviewBtn) cancelReviewBtn.classList.add('hidden');
  reviewId.value = '';
  loadReviews();
});

if (cancelReviewBtn) {
  cancelReviewBtn.addEventListener('click', () => {
    reviewForm.reset();
    reviewFormTitle.textContent = 'Добавить новый отзыв';
    cancelReviewBtn.classList.add('hidden');
    reviewId.value = '';
  });
}

window.deleteReview = async (id) => {
  if (!confirm('Удалить отзыв?')) return;
  await pb.collection('reviews').delete(id);
  loadReviews();
};

// Запуск при загрузке
loadServices();
loadReviews();
