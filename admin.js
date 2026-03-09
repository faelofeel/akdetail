const pb = new PocketBase('https://pocketbase-production-70159.up.railway.app');

// ==================== УСЛУГИ ====================
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
const reviewService = document.getElementById('service');
const reviewText = document.getElementById('text');
const reviewFormTitle = document.getElementById('review-form-title');
const cancelReviewBtn = document.getElementById('cancel-review-edit');
const reviewList = document.getElementById('review-list');

// ==================== НАШИ РАБОТЫ ====================
const worksForm = document.getElementById('works-form');
const worksId = document.getElementById('works-id');
const worksTitle = document.getElementById('works-title');
const worksDesc = document.getElementById('works-description');
const worksImages = document.getElementById('works-images');
const worksFormTitle = document.getElementById('works-form-title');
const cancelWorksBtn = document.getElementById('cancel-works-edit');
const worksList = document.getElementById('works-list');

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
  if (!serviceList) return;
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
  } catch (err) { console.error(err); }
}

window.editService = async (id) => { /* без изменений */ };
if (serviceForm) { /* без изменений */ }
if (cancelServiceBtn) { /* без изменений */ }
window.deleteService = async (id) => { /* без изменений */ };

// ==================== ОТЗЫВЫ ====================
async function loadReviews() {
  if (!reviewList) return;
  try {
    const res = await pb.collection('reviews').getList(1, 50);
    reviewList.innerHTML = '';
    res.items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'review-card-admin';
      card.innerHTML = `
        <div class="review-header">
          <h3 class="review-name">${item.name}</h3>
          <div class="review-meta">
            ${item.car ? `<span class="review-car">${item.car}</span>` : ''}
            ${item.service ? `<span class="review-service">${item.service}</span>` : ''}
          </div>
        </div>
        <p class="review-text">${item.text}</p>
        <div class="actions">
          <button onclick="editReview('${item.id}')">Редактировать</button>
          <button onclick="deleteReview('${item.id}')">Удалить</button>
        </div>
      `;
      reviewList.appendChild(card);
    });
  } catch (err) { console.error(err); }
}

window.editReview = async (id) => { /* без изменений */ };
if (reviewForm) { /* без изменений */ }
if (cancelReviewBtn) { /* без изменений */ }
window.deleteReview = async (id) => { /* без изменений */ };

// ==================== НАШИ РАБОТЫ ====================
async function loadWorks() {
  if (!worksList) return;
  try {
    const res = await pb.collection('works').getList(1, 50, { sort: '-created' });
    worksList.innerHTML = '';
    res.items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'work-card-admin';
      let imgs = '';
      if (item.images && item.images.length) {
        imgs = item.images.map(img => `<img src="${pb.files.getURL(item, img)}" alt="">`).join('');
      }
      card.innerHTML = `
        <div class="work-images">${imgs}</div>
        <h3>${item.title}</h3>
        <p>${item.description || ''}</p>
        <div class="actions">
          <button onclick="deleteWork('${item.id}')">Удалить</button>
        </div>
      `;
      worksList.appendChild(card);
    });
  } catch (err) { console.error(err); }
}

if (worksForm) {
  worksForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', worksTitle.value.trim());
    formData.append('description', worksDesc.value.trim());

    if (worksImages.files.length > 0) {
      for (let file of worksImages.files) {
        formData.append('images', file);
      }
    }

    try {
      if (worksId.value) {
        await pb.collection('works').update(worksId.value, formData);
      } else {
        await pb.collection('works').create(formData);
      }
      alert('Работа успешно сохранена!');
      worksForm.reset();
      worksFormTitle.textContent = 'Добавить новую работу';
      if (cancelWorksBtn) cancelWorksBtn.classList.add('hidden');
      worksId.value = '';
      loadWorks();
    } catch (err) {
      console.error('Полная ошибка PocketBase:', err);
      alert('Ошибка создания записи:\n' + JSON.stringify(err.data || err.message, null, 2));
    }
  });
}

if (cancelWorksBtn) {
  cancelWorksBtn.addEventListener('click', () => {
    worksForm.reset();
    worksFormTitle.textContent = 'Добавить новую работу';
    cancelWorksBtn.classList.add('hidden');
    worksId.value = '';
  });
}

window.deleteWork = async (id) => {
  if (!confirm('Удалить работу?')) return;
  try {
    await pb.collection('works').delete(id);
    loadWorks();
  } catch (err) { alert('Ошибка удаления'); }
};

// Запуск
loadServices();
loadReviews();
loadWorks();
