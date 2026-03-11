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
const worksSubmitBtn = worksForm ? worksForm.querySelector('.btn-save') : null;

// Переключение вкладок
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
  });
});

// ==================== УСЛУГИ (без изменений) ====================
async function loadServices() { /* ... твой старый код ... */ }
window.editService = async (id) => { /* ... твой старый код ... */ };
if (serviceForm) { /* ... твой старый код ... */ }
if (cancelServiceBtn) { /* ... твой старый код ... */ }
window.deleteService = async (id) => { /* ... твой старый код ... */ };

// ==================== ОТЗЫВЫ (без изменений) ====================
async function loadReviews() { /* ... твой старый код ... */ }
window.editReview = async (id) => { /* ... твой старый код ... */ };
if (reviewForm) { /* ... твой старый код ... */ }
if (cancelReviewBtn) { /* ... твой старый код ... */ }
window.deleteReview = async (id) => { /* ... твой старый код ... */ };

// ==================== НАШИ РАБОТЫ — КАРТОЧКИ КАК НА САЙТЕ ====================
async function loadWorks() {
  if (!worksList) return;
  try {
    const res = await pb.collection('works').getList(1, 50);
    worksList.innerHTML = '';

    if (res.items.length === 0) {
      worksList.innerHTML = '<p style="text-align:center;color:#666;padding:40px;">Пока нет работ</p>';
      return;
    }

    res.items.forEach(item => {
      let imgsHTML = '';
      if (item.field && item.field.length) {
        imgsHTML = item.field.map(img => `
          <img src="${pb.files.getURL(item, img)}" alt="${item.title}">
        `).join('');
      }

      const card = document.createElement('div');
      card.className = 'work-card';           // ← точно как на сайте
      card.innerHTML = `
        <div class="work-images">
          ${imgsHTML || '<div style="height:220px;display:flex;align-items:center;justify-content:center;color:#666;">Фото отсутствует</div>'}
        </div>
        <div class="work-info">
          <h3>${item.title || 'Без названия'}</h3>
          <p>${item.description || 'Описание отсутствует'}</p>
          
          <div class="admin-actions">
            <button onclick="editWork('${item.id}')" class="btn-edit">Редактировать</button>
            <button onclick="deleteWork('${item.id}')" class="btn-delete">Удалить</button>
          </div>
        </div>
      `;
      worksList.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    worksList.innerHTML = '<p style="text-align:center;color:#e74c3c;">Не удалось загрузить список работ</p>';
  }
}

// Редактирование работы
window.editWork = async (id) => {
  try {
    const item = await pb.collection('works').getOne(id);
    worksId.value = item.id;
    worksTitle.value = item.title || '';
    worksDesc.value = item.description || '';
    worksFormTitle.textContent = 'Редактировать работу';
    if (cancelWorksBtn) cancelWorksBtn.classList.remove('hidden');
  } catch (err) {
    alert('Ошибка загрузки работы');
  }
};

// Удаление работы
window.deleteWork = async (id) => {
  if (!confirm('Удалить работу?')) return;
  try {
    await pb.collection('works').delete(id);
    loadWorks();
  } catch (err) {
    alert('Ошибка удаления');
  }
};

// Форма добавления/сохранения (оставлена без изменений)
if (worksForm) {
  worksForm.addEventListener('submit', async (e) => { /* твой старый код submit */ });
}
if (cancelWorksBtn) {
  cancelWorksBtn.addEventListener('click', () => { /* твой старый код отмены */ });
}

// ==================== ЗАПУСК ====================
loadServices();
loadReviews();
loadWorks();
