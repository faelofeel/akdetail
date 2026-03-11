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

window.editService = async (id) => {
  try {
    const item = await pb.collection('services').getOne(id);
    serviceId.value = item.id;
    serviceTitle.value = item.title;
    serviceDesc.value = item.description || '';
    servicePrice.value = item.price;
    serviceTime.value = item.time || '';
    serviceOrder.value = item.order || 0;
    serviceFormTitle.textContent = 'Редактировать услугу';
    cancelServiceBtn.classList.remove('hidden');
  } catch (err) { alert('Ошибка загрузки услуги'); }
};

if (serviceForm) {
  serviceForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', serviceTitle.value);
    formData.append('description', serviceDesc.value);
    formData.append('price', servicePrice.value.trim());
    formData.append('time', serviceTime.value);
    formData.append('order', serviceOrder.value || 0);
    if (serviceImage.files[0]) formData.append('image', serviceImage.files[0]);

    try {
      if (serviceId.value) await pb.collection('services').update(serviceId.value, formData);
      else await pb.collection('services').create(formData);
      alert('Услуга сохранена!');
      serviceForm.reset();
      serviceFormTitle.textContent = 'Добавить новую услугу';
      cancelServiceBtn.classList.add('hidden');
      serviceId.value = '';
      loadServices();
    } catch (err) { alert('Ошибка: ' + err.message); }
  });
}

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
  try {
    await pb.collection('services').delete(id);
    loadServices();
  } catch (err) { alert('Ошибка удаления услуги'); }
};

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

window.editReview = async (id) => {
  try {
    const item = await pb.collection('reviews').getOne(id);
    reviewId.value = item.id;
    reviewName.value = item.name;
    reviewCar.value = item.car || '';
    reviewService.value = item.service || '';
    reviewText.value = item.text;
    reviewFormTitle.textContent = 'Редактировать отзыв';
    cancelReviewBtn.classList.remove('hidden');
  } catch (err) { alert('Ошибка загрузки отзыва'); }
};

if (reviewForm) {
  reviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
      name: reviewName.value.trim(),
      car: reviewCar.value.trim(),
      service: reviewService.value.trim(),
      text: reviewText.value.trim()
    };
    try {
      if (reviewId.value) await pb.collection('reviews').update(reviewId.value, data);
      else await pb.collection('reviews').create(data);
      alert('Отзыв сохранён!');
      reviewForm.reset();
      reviewFormTitle.textContent = 'Добавить новый отзыв';
      cancelReviewBtn.classList.add('hidden');
      reviewId.value = '';
      loadReviews();
    } catch (err) { alert('Ошибка: ' + err.message); }
  });
}

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
  try {
    await pb.collection('reviews').delete(id);
    loadReviews();
  } catch (err) { alert('Ошибка удаления отзыва'); }
};

// ==================== НАШИ РАБОТЫ ====================
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
      card.className = 'work-card';
      card.innerHTML = `
        <div class="work-images">${imgsHTML}</div>
        <div class="work-info">
          <h3>${item.title || 'Без названия'}</h3>
          <p>${item.description || ''}</p>
          <div class="actions" style="margin-top: 25px;">
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
    cancelWorksBtn.classList.remove('hidden');
  } catch (err) { alert('Ошибка загрузки работы'); }
};

if (worksForm) {
  worksForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!worksTitle.value.trim()) {
      alert('Поле "Название авто" обязательно!');
      worksTitle.focus();
      return;
    }
    if (!worksImages.files.length) {
      alert('Добавьте хотя бы одно фото!');
      return;
    }

    const originalText = worksSubmitBtn ? worksSubmitBtn.textContent : 'Сохранить работу';
    if (worksSubmitBtn) {
      worksSubmitBtn.disabled = true;
      worksSubmitBtn.textContent = 'Сохраняем...';
    }

    const formData = new FormData();
    formData.append('title', worksTitle.value.trim());
    formData.append('description', worksDesc.value.trim() || '');
    for (let i = 0; i < worksImages.files.length; i++) {
      formData.append('field', worksImages.files[i]);
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
      cancelWorksBtn.classList.add('hidden');
      worksId.value = '';
      loadWorks();
    } catch (err) {
      console.error(err);
      alert('Ошибка: ' + (err.data?.message || err.message));
    } finally {
      if (worksSubmitBtn) {
        worksSubmitBtn.disabled = false;
        worksSubmitBtn.textContent = originalText;
      }
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
  } catch (err) { alert('Ошибка удаления работы'); }
};

// ==================== ЗАПУСК ====================
loadServices();
loadReviews();
loadWorks();
