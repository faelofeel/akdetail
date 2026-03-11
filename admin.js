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
            <button onclick="editService('${item.id}')" class="btn-edit">Редактировать</button>
            <button onclick="deleteService('${item.id}')" class="btn-delete">Удалить</button>
          </div>
        </div>
      `;
      serviceList.appendChild(card);
    });
  } catch (err) { console.error(err); }
}

window.editService = async (id) => { /* твой старый код */ };
if (serviceForm) { /* твой старый код */ }
if (cancelServiceBtn) { /* твой старый код */ }
window.deleteService = async (id) => { /* твой старый код */ };

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
          <button onclick="editReview('${item.id}')" class="btn-edit">Редактировать</button>
          <button onclick="deleteReview('${item.id}')" class="btn-delete">Удалить</button>
        </div>
      `;
      reviewList.appendChild(card);
    });
  } catch (err) { console.error(err); }
}

window.editReview = async (id) => { /* твой старый код */ };
if (reviewForm) { /* твой старый код */ }
if (cancelReviewBtn) { /* твой старый код */ }
window.deleteReview = async (id) => { /* твой старый код */ };

// ==================== НАШИ РАБОТЫ — карточки как на сайте + красивые кнопки ====================
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
          <img src="${pb.files.getURL(item, img)}" alt="">
        `).join('');
      }

      const card = document.createElement('div');
      card.className = 'work-card';   // ← точно как на сайте
      card.innerHTML = `
        <div class="work-images">${imgsHTML}</div>
        <div class="work-info">
          <h3>${item.title || 'Без названия'}</h3>
          <p>${item.description || ''}</p>
          
          <div class="actions">
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

window.editWork = async (id) => {
  try {
    const item = await pb.collection('works').getOne(id);
    worksId.value = item.id;
    worksTitle.value = item.title || '';
    worksDesc.value = item.description || '';
    worksFormTitle.textContent = 'Редактировать работу';
    if (cancelWorksBtn) cancelWorksBtn.classList.remove('hidden');
  } catch (err) { alert('Ошибка загрузки работы'); }
};

if (worksForm) {
  worksForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!worksTitle.value.trim()) { alert('Название авто обязательно!'); return; }
    if (!worksImages.files.length) { alert('Добавьте хотя бы одно фото!'); return; }

    const formData = new FormData();
    formData.append('title', worksTitle.value.trim());
    formData.append('description', worksDesc.value.trim() || '');
    for (let file of worksImages.files) formData.append('field', file);

    try {
      if (worksId.value) await pb.collection('works').update(worksId.value, formData);
      else await pb.collection('works').create(formData);
      alert('Работа сохранена!');
      worksForm.reset();
      worksFormTitle.textContent = 'Добавить новую работу';
      if (cancelWorksBtn) cancelWorksBtn.classList.add('hidden');
      worksId.value = '';
      loadWorks();
    } catch (err) { alert('Ошибка: ' + (err.data?.message || err.message)); }
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

// ==================== ЗАПУСК ====================
loadServices();
loadReviews();
loadWorks();
