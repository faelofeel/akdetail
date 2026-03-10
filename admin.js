const pb = new PocketBase('https://pocketbase-production-70159.up.railway.app');

// Переключение вкладок
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
  });
});

// Услуги (оставляем как было)
const serviceForm = document.getElementById('service-form');
const serviceId = document.getElementById('service-id');
const serviceTitle = document.getElementById('title');
const serviceDesc = document.getElementById('description');
const servicePrice = document.getElementById('price');
const serviceTime = document.getElementById('time');
const serviceImage = document.getElementById('image');
const serviceOrder = document.getElementById('order');
const cancelServiceBtn = document.getElementById('cancel-service-edit');
const serviceList = document.getElementById('service-list');

async function loadServices() {
  if (!serviceList) return;
  try {
    const res = await pb.collection('services').getList(1, 50, { sort: '+order' });
    serviceList.innerHTML = '';
    res.items.forEach(item => {
      const card = document.createElement('div');
      card.innerHTML = `
        <div style="background:#222;padding:20px;border-radius:12px;">
          ${item.image ? `<img src="${pb.files.getURL(item, item.image)}" style="width:100%;height:180px;object-fit:cover;border-radius:8px;">` : ''}
          <h3 style="margin:15px 0 10px;">${item.title}</h3>
          <p style="color:#aaa;">${item.description || ''}</p>
          <strong style="color:#4a90e2;">${item.price} ₽</strong> • ${item.time || ''}
          <div style="margin-top:15px;">
            <button onclick="editService('${item.id}')" style="background:#4a90e2;color:white;border:none;padding:8px 16px;border-radius:6px;cursor:pointer;">Редактировать</button>
            <button onclick="deleteService('${item.id}')" style="background:#e74c3c;color:white;border:none;padding:8px 16px;border-radius:6px;cursor:pointer;margin-left:10px;">Удалить</button>
          </div>
        </div>
      `;
      serviceList.appendChild(card.firstChild);
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
    cancelServiceBtn.classList.remove('hidden');
  } catch (err) { alert('Ошибка загрузки услуги'); }
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

  try {
    if (serviceId.value) await pb.collection('services').update(serviceId.value, formData);
    else await pb.collection('services').create(formData);
    alert('Услуга сохранена!');
    serviceForm.reset();
    cancelServiceBtn.classList.add('hidden');
    serviceId.value = '';
    loadServices();
  } catch (err) { alert('Ошибка: ' + err.message); }
});

cancelServiceBtn.addEventListener('click', () => {
  serviceForm.reset();
  cancelServiceBtn.classList.add('hidden');
  serviceId.value = '';
});

window.deleteService = async (id) => {
  if (!confirm('Удалить услугу?')) return;
  try {
    await pb.collection('services').delete(id);
    loadServices();
  } catch (err) { alert('Ошибка удаления'); }
};

// Отзывы (оставляем как было)
const reviewForm = document.getElementById('review-form');
const reviewId = document.getElementById('review-id');
const reviewName = document.getElementById('name');
const reviewCar = document.getElementById('car');
const reviewService = document.getElementById('service');
const reviewText = document.getElementById('text');
const cancelReviewBtn = document.getElementById('cancel-review-edit');
const reviewList = document.getElementById('review-list');

async function loadReviews() {
  if (!reviewList) return;
  try {
    const res = await pb.collection('reviews').getList(1, 50);
    reviewList.innerHTML = '';
    res.items.forEach(item => {
      const card = document.createElement('div');
      card.innerHTML = `
        <div style="background:#222;padding:20px;border-radius:12px;margin-bottom:20px;">
          <h3 style="margin:0 0 10px;">${item.name}</h3>
          <p style="color:#aaa;margin:0 0 10px;">${item.car ? item.car + ' • ' : ''}${item.service || ''}</p>
          <p style="margin:0;">${item.text}</p>
          <div style="margin-top:15px;">
            <button onclick="editReview('${item.id}')" style="background:#4a90e2;color:white;border:none;padding:8px 16px;border-radius:6px;cursor:pointer;">Редактировать</button>
            <button onclick="deleteReview('${item.id}')" style="background:#e74c3c;color:white;border:none;padding:8px 16px;border-radius:6px;cursor:pointer;margin-left:10px;">Удалить</button>
          </div>
        </div>
      `;
      reviewList.appendChild(card.firstChild);
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
    cancelReviewBtn.classList.remove('hidden');
  } catch (err) { alert('Ошибка загрузки отзыва'); }
};

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
    cancelReviewBtn.classList.add('hidden');
    reviewId.value = '';
    loadReviews();
  } catch (err) { alert('Ошибка: ' + err.message); }
});

cancelReviewBtn.addEventListener('click', () => {
  reviewForm.reset();
  cancelReviewBtn.classList.add('hidden');
  reviewId.value = '';
});

window.deleteReview = async (id) => {
  if (!confirm('Удалить отзыв?')) return;
  try {
    await pb.collection('reviews').delete(id);
    loadReviews();
  } catch (err) { alert('Ошибка удаления'); }
};

// Наши работы — список + стили как на сайте
const worksForm = document.getElementById('works-form');
const worksId = document.getElementById('works-id');
const worksTitle = document.getElementById('works-title');
const worksDesc = document.getElementById('works-description');
const worksImages = document.getElementById('works-images');
const cancelWorksBtn = document.getElementById('cancel-works-edit');
const worksList = document.getElementById('works-list');

async function loadWorks() {
  if (!worksList) return;
  try {
    const res = await pb.collection('works').getList(1, 50, { sort: '-created' });
    worksList.innerHTML = '';
    if (res.items.length === 0) {
      worksList.innerHTML = '<p style="text-align:center;color:#666;">Пока нет работ</p>';
      return;
    }

    res.items.forEach(item => {
      let imgs = '';
      if (item.field && item.field.length) {
        imgs = item.field.map(img => `
          <img src="${pb.files.getURL(item, img)}" style="width:100%;height:100%;object-fit:cover;">
        `).join('');
      }

      const card = document.createElement('div');
      card.className = 'work-card-admin';
      card.innerHTML = `
        <div class="work-images">
          ${imgs || '<div style="height:220px;display:flex;align-items:center;justify-content:center;color:#666;">Нет фото</div>'}
        </div>
        <div class="work-info">
          <h3>${item.title || 'Без названия'}</h3>
          <p>${item.description || 'Описание отсутствует'}</p>
          <div class="actions">
            <button onclick="deleteWork('${item.id}')">Удалить</button>
          </div>
        </div>
      `;
      worksList.appendChild(card);
    });
  } catch (err) {
    console.error('Ошибка загрузки работ:', err);
    worksList.innerHTML = '<p style="color:#e74c3c;text-align:center;">Ошибка загрузки списка работ</p>';
  }
}

worksForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!worksTitle.value.trim()) {
    alert('Название авто обязательно!');
    return;
  }

  const formData = new FormData();
  formData.append('title', worksTitle.value.trim());
  formData.append('description', worksDesc.value.trim() || '');

  if (worksImages.files.length === 0) {
    alert('Добавьте хотя бы одно фото!');
    return;
  }

  for (let file of worksImages.files) {
    formData.append('field', file);
  }

  try {
    if (worksId.value) {
      await pb.collection('works').update(worksId.value, formData);
    } else {
      await pb.collection('works').create(formData);
    }
    alert('Работа сохранена!');
    worksForm.reset();
    cancelWorksBtn.classList.add('hidden');
    worksId.value = '';
    loadWorks();
  } catch (err) {
    console.error(err);
    alert('Ошибка сохранения: ' + (err.data?.message || err.message));
  }
});

cancelWorksBtn.addEventListener('click', () => {
  worksForm.reset();
  cancelWorksBtn.classList.add('hidden');
  worksId.value = '';
});

window.deleteWork = async (id) => {
  if (!confirm('Удалить работу?')) return;
  try {
    await pb.collection('works').delete(id);
    loadWorks();
  } catch (err) {
    alert('Ошибка удаления');
  }
};

// Запуск загрузки всех данных
loadServices();
loadReviews();
loadWorks();
