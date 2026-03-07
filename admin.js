const pb = new PocketBase('https://pocketbase-production-70159.up.railway.app');

// ==================== УСЛУГИ (оставил как было) ====================
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

// ==================== ОТЗЫВЫ ====================
const reviewForm = document.getElementById('review-form');
const reviewId = document.getElementById('review-id');
const reviewName = document.getElementById('name');
const reviewCar = document.getElementById('car');
const reviewText = document.getElementById('text');
const reviewFormTitle = document.getElementById('review-form-title');
const cancelReviewBtn = document.getElementById('cancel-review-edit');
const reviewList = document.getElementById('review-list');

// Переключение вкладок (без изменений)
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
  });
});

// ==================== УСЛУГИ (без изменений) ====================
// ... (оставил весь блок услуг как был раньше)

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

  // Проверка перед отправкой
  if (!reviewName.value.trim()) {
    alert('Введите имя клиента!');
    return;
  }
  if (!reviewText.value.trim()) {
    alert('Введите текст отзыва!');
    return;
  }

  const data = {
    name: reviewName.value.trim(),
    car: reviewCar.value.trim(),
    text: reviewText.value.trim()
  };

  try {
    if (reviewId.value) {
      await pb.collection('reviews').update(reviewId.value, data);
    } else {
      await pb.collection('reviews').create(data);
    }
    alert('Отзыв успешно сохранён!');
    reviewForm.reset();
    reviewFormTitle.textContent = 'Добавить новый отзыв';
    if (cancelReviewBtn) cancelReviewBtn.classList.add('hidden');
    reviewId.value = '';
    loadReviews();
  } catch (err) {
    console.error("Полная ошибка:", err);           // ← смотрим в консоль
    const msg = err.data?.message || err.message || 'Неизвестная ошибка';
    alert('Ошибка сохранения отзыва:\n' + msg);
  }
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

// Запуск
loadServices();
loadReviews();
