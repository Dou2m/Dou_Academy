// عرض الدورات، محاكاة شراء وحفظ في localStorage - يتشارك مع data.js
const courses = window.ACADEMY_COURSES || [];

// عناصر DOM
const coursesEl = document.getElementById('courses');
const modal = document.getElementById('courseModal');
const modalBody = document.getElementById('modalBody');
const closeModalBtn = document.getElementById('closeModal');
const exploreBtn = document.getElementById('exploreBtn');

// render courses
function renderCourses(){
  if(!coursesEl) return;
  coursesEl.innerHTML = '';
  courses.forEach(c=>{
    const card = document.createElement('article');
    card.className = 'card glass';
    card.innerHTML = `
      <img src="${c.thumb}" alt="${c.title}" loading="lazy" />
      <h4>${c.title}</h4>
      <p>${c.desc}</p>
      <div class="actions">
        <button class="btn btn-outline" data-id="${c.id}" data-action="view">عرض</button>
        <button class="btn btn-primary" data-id="${c.id}" data-action="buy">اشترِ الآن</button>
      </div>
    `;
    coursesEl.appendChild(card);
  });
}

// modal handling
function openModal(content){
  modalBody.innerHTML = content;
  modal.setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden';
}
function closeModal(){ modal.setAttribute('aria-hidden','true'); modalBody.innerHTML=''; document.body.style.overflow = ''; }
if(closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
if(modal) modal.addEventListener('click', (e)=>{ if(e.target===modal) closeModal(); });

document.addEventListener('click', (e)=>{
  const btn = e.target.closest('button');
  if(!btn) return;
  const id = btn.dataset.id;
  const action = btn.dataset.action;
  if(action === 'view') showCourse(id);
  if(action === 'buy') buyCourse(id);
});

// show course details
function showCourse(id){
  const c = courses.find(x=>x.id===id);
  if(!c) return;
  const html = `
    <h2 style="margin-top:0">${c.title}</h2>
    <p style="color:var(--muted)">${c.desc}</p>
    <video controls style="width:100%;max-height:480px;border-radius:8px;margin-top:10px">
      <source src="${c.video}" type="video/mp4">
      المتصفح لا يدعم الفيديو.
    </video>
    <div style="margin-top:12px;display:flex;gap:8px;justify-content:flex-start">
      <button id="modalBuy" class="btn btn-primary">اشترِ الآن</button>
      <button id="modalClose" class="btn btn-outline">اغلاق</button>
    </div>
  `;
  openModal(html);
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalBuy').addEventListener('click', ()=>{ buyCourse(id); closeModal(); });
}

// simple auth & purchase simulation
function getUser(){ return JSON.parse(localStorage.getItem('student_user')||'null'); }
function setUser(user){ localStorage.setItem('student_user', JSON.stringify(user)); }
function getPurchases(){ return JSON.parse(localStorage.getItem('student_purchases')||'[]'); }
function setPurchases(list){ localStorage.setItem('student_purchases', JSON.stringify(list)); }

function buyCourse(id){
  let user = getUser();
  if(!user){
    const email = prompt('أدخل بريدك الإلكتروني للتسجيل والمتابعة (محليًا فقط):');
    if(!email) return alert('مطلوب بريد إلكتروني للمتابعة.');
    user = {email};
    setUser(user);
    alert('تم تسجيلك محليًا في المتصفح.');
  }
  const purchases = getPurchases();
  if(purchases.includes(id)){ alert('لقد اشتريت هذه الدورة بالفعل. يمكنك الوصول إليها من لوحة الطالب.'); return; }
  // محاكاة عملية دفع ناجحة
  purchases.push(id);
  setPurchases(purchases);
  alert('تمت إضافة الدورة إلى حسابك (محاكاة). اذهبي إلى لوحة الطالب لمتابعة المحتوى.');
  window.location.href = 'dashboard.html';
}

if(exploreBtn) exploreBtn.addEventListener('click', ()=>{ location.href='#courses'; });

renderCourses();