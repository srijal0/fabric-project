const CATEGORIES = ["Cotton","Linen","Silk","Wool","Denim","Polyester","Rayon/Viscose","Knit","Blend"];
const LOW_STOCK_THRESHOLD = 20;
const API_BASE = "https://fabric-project-08hi.onrender.com";
const AUTH_STORAGE_KEY = "selvage_auth";

let fabrics = [];
let suppliers = [];
let activeCategory = "All";
let searchTerm = "";
let sortMode = "name";

// ---- auth state ----
let currentUser = null; // { username, role, token }
try{
  const saved = localStorage.getItem(AUTH_STORAGE_KEY);
  if(saved) currentUser = JSON.parse(saved);
}catch(e){ currentUser = null; }

function isLoggedIn(){ return !!currentUser; }
function isAdmin(){ return !!currentUser && currentUser.role === 'admin'; }

function authHeader(){
  return currentUser ? { 'Authorization': `Bearer ${currentUser.token}` } : {};
}

function saveAuth(user){
  currentUser = user;
  if(user) localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  else localStorage.removeItem(AUTH_STORAGE_KEY);
  renderAuthArea();
}

function skuFor(category, name){
  const catCode = category.slice(0,3).toUpperCase();
  const nameCode = name.replace(/[^A-Za-z]/g,'').slice(0,3).toUpperCase();
  return catCode + '-' + nameCode + '-' + Math.floor(100+Math.random()*900);
}

// ---- field mapping: backend uses snake_case, frontend uses camelCase ----
function fromApi(f){
  return {
    id: f.id,
    name: f.name,
    sku: f.sku,
    category: f.category,
    composition: f.composition,
    colorName: f.color_name,
    colorHex: f.color_hex,
    pattern: f.pattern,
    weightGsm: f.weight_gsm,
    widthCm: f.width_cm,
    pricePerMeter: f.price_per_meter,
    stockMeters: f.stock_meters,
    supplier: f.supplier,
    supplierId: f.supplier_id ?? null,
    season: f.season,
    usage: f.usage,
    care: f.care,
    notes: f.notes,
    dateAdded: (f.date_added || 0) * 1000,
    imagePath: f.image_path || null
  };
}

function toApi(f){
  return {
    name: f.name,
    sku: f.sku,
    category: f.category,
    composition: f.composition,
    color_name: f.colorName,
    color_hex: f.colorHex,
    pattern: f.pattern,
    weight_gsm: f.weightGsm,
    width_cm: f.widthCm,
    price_per_meter: f.pricePerMeter,
    stock_meters: f.stockMeters,
    supplier: f.supplier,
    supplier_id: f.supplierId ?? null,
    season: f.season,
    usage: f.usage,
    care: f.care,
    notes: f.notes
  };
}

async function loadFabrics(){
  try{
    const res = await fetch(`${API_BASE}/fabrics`);
    if(!res.ok) throw new Error('Request failed: ' + res.status);
    const data = await res.json();
    fabrics = data.map(fromApi);
  }catch(e){
    console.error("Could not reach the API", e);
    document.getElementById('grid').innerHTML =
      `<div class="empty">Can't reach the backend at ${API_BASE}.<br>Make sure <code>uvicorn main:app --reload</code> is running, then refresh this page.</div>`;
    fabrics = [];
  }
  render();
}

async function loadSuppliers(){
  try{
    const res = await fetch(`${API_BASE}/suppliers`);
    if(res.ok) suppliers = await res.json();
  }catch(e){
    suppliers = [];
  }
}

async function createFabric(data){
  const payload = toApi({ ...data, sku: skuFor(data.category, data.name) });
  const res = await fetch(`${API_BASE}/fabrics`, {
    method: 'POST',
    headers: {'Content-Type':'application/json', ...authHeader()},
    body: JSON.stringify(payload)
  });
  if(res.status === 401) throw new Error('AUTH');
  if(!res.ok) throw new Error('Create failed');
  return fromApi(await res.json());
}

async function updateFabricApi(id, data){
  const res = await fetch(`${API_BASE}/fabrics/${id}`, {
    method: 'PATCH',
    headers: {'Content-Type':'application/json', ...authHeader()},
    body: JSON.stringify(toApi(data))
  });
  if(res.status === 401) throw new Error('AUTH');
  if(!res.ok) throw new Error('Update failed');
  return fromApi(await res.json());
}

async function deleteFabricApi(id){
  const res = await fetch(`${API_BASE}/fabrics/${id}`, {
    method: 'DELETE',
    headers: { ...authHeader() }
  });
  if(res.status === 401) throw new Error('AUTH');
  if(res.status === 403) throw new Error('FORBIDDEN');
  if(!res.ok) throw new Error('Delete failed');
}

async function uploadFabricImage(id, file){
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/fabrics/${id}/image`, {
    method: 'POST',
    headers: { ...authHeader() }, // do NOT set Content-Type manually for FormData
    body: formData
  });
  if(res.status === 401) throw new Error('AUTH');
  if(!res.ok) throw new Error('Image upload failed');
  return fromApi(await res.json());
}

function imageUrl(f){
  return f.imagePath ? `${API_BASE}${f.imagePath}` : null;
}

function renderCategories(){
  const counts = { All: fabrics.length };
  CATEGORIES.forEach(c => counts[c] = fabrics.filter(f=>f.category===c).length);
  const list = document.getElementById('catList');
  list.innerHTML = '';
  ["All", ...CATEGORIES].forEach(cat=>{
    const btn = document.createElement('button');
    btn.className = 'cat-btn' + (activeCategory===cat ? ' active':'');
    btn.innerHTML = `${cat} <span class="cat-count">${counts[cat] ?? 0}</span>`;
    btn.onclick = ()=>{ activeCategory = cat; render(); };
    list.appendChild(btn);
  });
}

function renderStats(){
  const total = fabrics.length;
  const totalStock = fabrics.reduce((a,f)=>a+Number(f.stockMeters||0),0);
  const lowStock = fabrics.filter(f=>Number(f.stockMeters)<LOW_STOCK_THRESHOLD).length;
  const cats = new Set(fabrics.map(f=>f.category)).size;
  document.getElementById('statsBar').innerHTML = `
    <div class="stat"><span class="num">${total}</span><span class="lbl">Fabrics</span></div>
    <div class="stat"><span class="num">${totalStock.toLocaleString()}m</span><span class="lbl">Total Stock</span></div>
    <div class="stat"><span class="num" style="color:${lowStock? 'var(--rust)':'inherit'}">${lowStock}</span><span class="lbl">Low Stock</span></div>
    <div class="stat"><span class="num">${cats}</span><span class="lbl">Categories</span></div>
  `;
}

function renderAuthArea(){
  const area = document.getElementById('authArea');
  if(!currentUser){
    area.innerHTML = `<button class="btn ghost small" id="loginBtn">Staff login</button>`;
    document.getElementById('loginBtn').onclick = openLoginModal;
  } else {
    area.innerHTML = `
      <div class="auth-info">
        <span class="who">${escapeHtml(currentUser.username)}</span>
        <span class="role-badge ${currentUser.role}">${currentUser.role}</span>
      </div>
      <button class="btn ghost small" id="logoutBtn">Log out</button>
    `;
    document.getElementById('logoutBtn').onclick = ()=>{ saveAuth(null); };
  }
}

function getFiltered(){
  let list = fabrics.slice();
  if(activeCategory !== "All") list = list.filter(f=>f.category===activeCategory);
  if(searchTerm.trim()){
    const q = searchTerm.toLowerCase();
    list = list.filter(f =>
      f.name.toLowerCase().includes(q) ||
      f.sku.toLowerCase().includes(q) ||
      (f.supplier||'').toLowerCase().includes(q) ||
      (f.composition||'').toLowerCase().includes(q)
    );
  }
  switch(sortMode){
    case 'stockLow': list.sort((a,b)=>a.stockMeters-b.stockMeters); break;
    case 'priceLow': list.sort((a,b)=>a.pricePerMeter-b.pricePerMeter); break;
    case 'priceHigh': list.sort((a,b)=>b.pricePerMeter-a.pricePerMeter); break;
    case 'newest': list.sort((a,b)=>b.dateAdded-a.dateAdded); break;
    default: list.sort((a,b)=>a.name.localeCompare(b.name));
  }
  return list;
}

function renderGrid(){
  const grid = document.getElementById('grid');
  const empty = document.getElementById('emptyState');
  const list = getFiltered();
  grid.innerHTML = '';
  empty.style.display = list.length ? 'none' : 'block';
  list.forEach(f=>{
    const low = Number(f.stockMeters) < LOW_STOCK_THRESHOLD;
    const img = imageUrl(f);
    const card = document.createElement('div');
    card.className = 'swatch-card';
    card.innerHTML = `
      <div class="hole"></div>
      <div class="swatch-block" style="${img ? `background-image:url('${img}')` : `background:${f.colorHex}`}"></div>
      <h4>${escapeHtml(f.name)}</h4>
      <div class="comp">${escapeHtml(f.composition||'')}</div>
      <div class="swatch-meta"><span>${f.sku}</span><span>$${Number(f.pricePerMeter).toFixed(2)}/m</span></div>
      <span class="stock-flag ${low?'stock-low':'stock-ok'}">${f.stockMeters}m ${low?'· LOW':'in stock'}</span>
    `;
    card.onclick = ()=>openDetail(f.id);
    grid.appendChild(card);
  });
}

function escapeHtml(s){
  const d = document.createElement('div');
  d.textContent = s ?? '';
  return d.innerHTML;
}

function render(){
  renderCategories();
  renderStats();
  renderGrid();
  renderAuthArea();
}

/* ---------- Modals ---------- */
function closeModal(){ document.getElementById('modalRoot').innerHTML = ''; }

function fieldsForm(f={}){
  const img = imageUrl(f);
  return `
    <div class="form-row full">
      <div>
        <label>Fabric photo</label>
        <div class="image-preview" id="imagePreview" style="${img ? `background-image:url('${img}')` : ''}">
          ${img ? '' : 'No photo yet'}
        </div>
        <input type="file" id="f_image" accept="image/png,image/jpeg,image/webp,image/gif">
      </div>
    </div>
    <div class="form-row">
      <div><label>Fabric name</label><input type="text" id="f_name" value="${escapeHtml(f.name||'')}"></div>
      <div><label>Category</label>
        <select id="f_category" style="width:100%;">
          ${CATEGORIES.map(c=>`<option value="${c}" ${f.category===c?'selected':''}>${c}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="form-row full">
      <div><label>Composition</label><input type="text" id="f_composition" placeholder="e.g. 60% cotton, 40% polyester" value="${escapeHtml(f.composition||'')}"></div>
    </div>
    <div class="form-row">
      <div><label>Color name</label><input type="text" id="f_colorName" value="${escapeHtml(f.colorName||'')}"></div>
      <div><label>Swatch color</label><input type="color" id="f_colorHex" value="${f.colorHex||'#cccccc'}" style="height:38px;padding:2px;"></div>
    </div>
    <div class="form-row">
      <div><label>Pattern / weave</label><input type="text" id="f_pattern" value="${escapeHtml(f.pattern||'')}"></div>
      <div><label>Weight (GSM)</label><input type="number" id="f_weightGsm" value="${f.weightGsm??''}"></div>
    </div>
    <div class="form-row">
      <div><label>Width (cm)</label><input type="number" id="f_widthCm" value="${f.widthCm??''}"></div>
      <div><label>Price per meter ($)</label><input type="number" step="0.01" id="f_pricePerMeter" value="${f.pricePerMeter??''}"></div>
    </div>
    <div class="form-row">
      <div><label>Stock (meters)</label><input type="number" id="f_stockMeters" value="${f.stockMeters??''}"></div>
      <div><label>Supplier</label>
        <select id="f_supplierId" style="width:100%;">
          <option value="">— No supplier selected —</option>
          ${suppliers.map(s=>`<option value="${s.id}" ${f.supplierId===s.id?'selected':''}>${escapeHtml(s.name)}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="form-row">
      <div><label>Season</label><input type="text" id="f_season" placeholder="e.g. Summer, All-season" value="${escapeHtml(f.season||'')}"></div>
      <div><label>Usage</label><input type="text" id="f_usage" placeholder="e.g. Shirting, dresses" value="${escapeHtml(f.usage||'')}"></div>
    </div>
    <div class="form-row full">
      <div><label>Care instructions</label><textarea id="f_care" rows="2">${escapeHtml(f.care||'')}</textarea></div>
    </div>
    <div class="form-row full">
      <div><label>Notes</label><textarea id="f_notes" rows="2">${escapeHtml(f.notes||'')}</textarea></div>
    </div>
  `;
}

function readForm(){
  const supplierSelect = document.getElementById('f_supplierId');
  const supplierId = supplierSelect && supplierSelect.value ? Number(supplierSelect.value) : null;
  const supplierName = supplierId ? (suppliers.find(s=>s.id===supplierId)?.name || '') : '';
  return {
    name: document.getElementById('f_name').value.trim() || 'Untitled fabric',
    category: document.getElementById('f_category').value,
    composition: document.getElementById('f_composition').value.trim(),
    colorName: document.getElementById('f_colorName').value.trim(),
    colorHex: document.getElementById('f_colorHex').value,
    pattern: document.getElementById('f_pattern').value.trim(),
    weightGsm: Number(document.getElementById('f_weightGsm').value)||0,
    widthCm: Number(document.getElementById('f_widthCm').value)||0,
    pricePerMeter: Number(document.getElementById('f_pricePerMeter').value)||0,
    stockMeters: Number(document.getElementById('f_stockMeters').value)||0,
    supplier: supplierName,
    supplierId: supplierId,
    season: document.getElementById('f_season').value.trim(),
    usage: document.getElementById('f_usage').value.trim(),
    care: document.getElementById('f_care').value.trim(),
    notes: document.getElementById('f_notes').value.trim(),
  };
}

function readSelectedImageFile(){
  const input = document.getElementById('f_image');
  return (input && input.files && input.files.length) ? input.files[0] : null;
}

/* ---------- Login modal ---------- */
function openLoginModal(){
  document.getElementById('modalRoot').innerHTML = `
    <div class="overlay" id="overlay">
      <div class="modal narrow">
        <h2>Staff login</h2>
        <div class="form-row full">
          <div><label>Username</label><input type="text" id="login_username" autocomplete="username"></div>
        </div>
        <div class="form-row full">
          <div><label>Password</label><input type="password" id="login_password" autocomplete="current-password"></div>
        </div>
        <div class="form-error" id="loginError">Incorrect username or password.</div>
        <div class="modal-actions">
          <button class="btn ghost" id="cancelBtn">Cancel</button>
          <button class="btn" id="loginSubmitBtn">Log in</button>
        </div>
      </div>
    </div>
  `;
  document.getElementById('cancelBtn').onclick = closeModal;
  document.getElementById('overlay').onclick = (e)=>{ if(e.target.id==='overlay') closeModal(); };
  document.getElementById('loginSubmitBtn').onclick = doLogin;
  document.getElementById('login_password').addEventListener('keydown', (e)=>{ if(e.key==='Enter') doLogin(); });
}

async function doLogin(){
  const username = document.getElementById('login_username').value.trim();
  const password = document.getElementById('login_password').value;
  const errEl = document.getElementById('loginError');
  errEl.style.display = 'none';

  try{
    const body = new URLSearchParams();
    body.append('username', username);
    body.append('password', password);
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body
    });
    if(!res.ok){
      errEl.style.display = 'block';
      return;
    }
    const data = await res.json();
    saveAuth({ username: data.username, role: data.role, token: data.access_token });
    closeModal();
  }catch(e){
    errEl.textContent = "Couldn't reach the backend server.";
    errEl.style.display = 'block';
  }
}

function requireLoginThen(action){
  if(isLoggedIn()){ action(); return; }
  openLoginModal();
}

async function openAddModal(){
  if(!isLoggedIn()){ openLoginModal(); return; }
  await loadSuppliers();
  document.getElementById('modalRoot').innerHTML = `
    <div class="overlay" id="overlay">
      <div class="modal">
        <h2>Add fabric</h2>
        ${fieldsForm()}
        <div class="form-error" id="formError">Something went wrong. Check the backend is running and you're logged in.</div>
        <div class="modal-actions">
          <button class="btn ghost" id="cancelBtn">Cancel</button>
          <button class="btn" id="saveBtn">Save fabric</button>
        </div>
      </div>
    </div>
  `;
  document.getElementById('cancelBtn').onclick = closeModal;
  document.getElementById('overlay').onclick = (e)=>{ if(e.target.id==='overlay') closeModal(); };
  document.getElementById('saveBtn').onclick = async ()=>{
    const data = readForm();
    const imageFile = readSelectedImageFile();
    try{
      const created = await createFabric(data);
      if(imageFile){
        try{ await uploadFabricImage(created.id, imageFile); }
        catch(imgErr){ console.error('Image upload failed', imgErr); }
      }
      await loadFabrics();
      closeModal();
    }catch(e){
      if(e.message === 'AUTH'){
        saveAuth(null);
        openLoginModal();
      } else {
        document.getElementById('formError').style.display = 'block';
      }
    }
  };
}

function openManageSuppliersModal(){
  if(!isLoggedIn()){ openLoginModal(); return; }
  renderManageSuppliersModal();
}

function renderManageSuppliersModal(){
  document.getElementById('modalRoot').innerHTML = `
    <div class="overlay" id="overlay">
      <div class="modal">
        <h2>Manage Suppliers</h2>
        <div class="form-row full">
          <div><label>Supplier name</label><input type="text" id="newSupplierName" placeholder="e.g. Kurabo Textiles"></div>
        </div>
        <div class="form-row">
          <div><label>Contact email</label><input type="text" id="newSupplierEmail"></div>
          <div><label>Phone</label><input type="text" id="newSupplierPhone"></div>
        </div>
        <div class="form-error" id="supplierFormError">Couldn't save. Check you're logged in and the backend is running.</div>
        <div class="modal-actions" style="justify-content:flex-start;">
          <button class="btn" id="addSupplierBtn">+ Add Supplier</button>
        </div>
        <hr class="stitch" style="margin:16px 0;">
        <div id="supplierList"></div>
        <div class="modal-actions">
          <button class="btn" id="closeSupplierModalBtn">Close</button>
        </div>
      </div>
    </div>
  `;
  renderSupplierListInModal();
  document.getElementById('overlay').onclick = (e)=>{ if(e.target.id==='overlay') closeModal(); };
  document.getElementById('closeSupplierModalBtn').onclick = closeModal;
  document.getElementById('addSupplierBtn').onclick = async ()=>{
    const name = document.getElementById('newSupplierName').value.trim();
    const errEl = document.getElementById('supplierFormError');
    errEl.style.display = 'none';
    if(!name){ return; }
    const payload = {
      name,
      contact_email: document.getElementById('newSupplierEmail').value.trim(),
      phone: document.getElementById('newSupplierPhone').value.trim(),
      notes: ''
    };
    try{
      const res = await fetch(`${API_BASE}/suppliers`, {
        method: 'POST',
        headers: {'Content-Type':'application/json', ...authHeader()},
        body: JSON.stringify(payload)
      });
      if(res.status === 401){ saveAuth(null); openLoginModal(); return; }
      if(!res.ok) throw new Error('Create failed');
      await loadSuppliers();
      renderManageSuppliersModal();
    }catch(e){
      errEl.style.display = 'block';
    }
  };
}

function renderSupplierListInModal(){
  const el = document.getElementById('supplierList');
  if(!suppliers.length){
    el.innerHTML = '<p style="opacity:0.6;font-size:13px;">No suppliers added yet.</p>';
    return;
  }
  el.innerHTML = suppliers.map(s => `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--line);">
      <div>
        <strong>${escapeHtml(s.name)}</strong>
        <div style="font-size:12px;opacity:0.65;">${escapeHtml(s.contact_email||'')}${s.phone ? ' · '+escapeHtml(s.phone) : ''}</div>
      </div>
      ${isAdmin() ? `<button class="btn danger small" data-supplier-id="${s.id}">Delete</button>` : ''}
    </div>
  `).join('');
  if(isAdmin()){
    el.querySelectorAll('[data-supplier-id]').forEach(btn=>{
      btn.onclick = async ()=>{
        const id = btn.getAttribute('data-supplier-id');
        if(!confirm('Delete this supplier? Fabrics linked to it will keep their recorded name but lose the link.')) return;
        try{
          const res = await fetch(`${API_BASE}/suppliers/${id}`, { method:'DELETE', headers:{...authHeader()} });
          if(res.status === 401){ saveAuth(null); openLoginModal(); return; }
          if(res.status === 403){ alert('Only an admin account can delete suppliers.'); return; }
          if(!res.ok) throw new Error('Delete failed');
          await loadSuppliers();
          renderManageSuppliersModal();
        }catch(e){
          alert("Couldn't delete supplier — check that the backend server is running.");
        }
      };
    });
  }
}

/* ---------- Analytics ---------- */
let analyticsChartInstances = [];

function ensureChartJsLoaded(){
  return new Promise((resolve, reject)=>{
    if(window.Chart){ resolve(); return; }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.min.js';
    script.onload = ()=>resolve();
    script.onerror = ()=>reject(new Error('Could not load charting library'));
    document.head.appendChild(script);
  });
}

function destroyAnalyticsCharts(){
  analyticsChartInstances.forEach(c => c.destroy());
  analyticsChartInstances = [];
}

async function openAnalyticsModal(){
  document.getElementById('modalRoot').innerHTML = `
    <div class="overlay" id="overlay">
      <div class="modal wide">
        <h2>Analytics</h2>
        <div id="analyticsLoading" style="opacity:0.6;font-size:13px;">Loading charts…</div>
        <div id="analyticsCharts" style="display:none;">
          <div class="chart-block">
            <h4>Total stock (m) by category</h4>
            <div class="chart-canvas-wrap"><canvas id="chartStockByCategory" height="90"></canvas></div>
          </div>
          <div class="chart-block">
            <h4>Stock value ($) by supplier</h4>
            <div class="chart-canvas-wrap"><canvas id="chartValueBySupplier" height="90"></canvas></div>
          </div>
          <div class="chart-block">
            <h4>Low stock vs healthy stock</h4>
            <div class="chart-canvas-wrap" style="max-width:320px;margin:0 auto;"><canvas id="chartLowStock" height="220"></canvas></div>
          </div>
        </div>
        <div class="form-error" id="analyticsError">Couldn't load the charting library. Check your internet connection and try again.</div>
        <div class="modal-actions">
          <button class="btn" id="closeAnalyticsBtn">Close</button>
        </div>
      </div>
    </div>
  `;
  document.getElementById('overlay').onclick = (e)=>{ if(e.target.id==='overlay'){ destroyAnalyticsCharts(); closeModal(); } };
  document.getElementById('closeAnalyticsBtn').onclick = ()=>{ destroyAnalyticsCharts(); closeModal(); };

  try{
    await ensureChartJsLoaded();
  }catch(e){
    document.getElementById('analyticsLoading').style.display = 'none';
    document.getElementById('analyticsError').style.display = 'block';
    return;
  }

  document.getElementById('analyticsLoading').style.display = 'none';
  document.getElementById('analyticsCharts').style.display = 'block';

  const chartColors = ['#3B4B6B','#A8542E','#6B7B5E','#C9A227','#8a6d8f','#4a7c8c','#b0765c','#5a6b8c'];

  // --- Chart 1: total stock by category ---
  const categoryTotals = {};
  fabrics.forEach(f => {
    categoryTotals[f.category] = (categoryTotals[f.category] || 0) + Number(f.stockMeters || 0);
  });
  const catLabels = Object.keys(categoryTotals);
  const catData = catLabels.map(k => categoryTotals[k]);

  const c1 = new Chart(document.getElementById('chartStockByCategory'), {
    type: 'bar',
    data: {
      labels: catLabels,
      datasets: [{ label: 'Stock (m)', data: catData, backgroundColor: chartColors[0] }]
    },
    options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
  });
  analyticsChartInstances.push(c1);

  // --- Chart 2: stock value by supplier ---
  const supplierValues = {};
  fabrics.forEach(f => {
    if(!f.supplierId) return;
    const supplierName = (suppliers.find(s => s.id === f.supplierId) || {}).name || 'Unknown';
    const value = Number(f.stockMeters || 0) * Number(f.pricePerMeter || 0);
    supplierValues[supplierName] = (supplierValues[supplierName] || 0) + value;
  });
  const supLabels = Object.keys(supplierValues);
  const supData = supLabels.map(k => Math.round(supplierValues[k] * 100) / 100);

  if(supLabels.length){
    const c2 = new Chart(document.getElementById('chartValueBySupplier'), {
      type: 'bar',
      data: {
        labels: supLabels,
        datasets: [{ label: 'Stock value ($)', data: supData, backgroundColor: chartColors[1] }]
      },
      options: { responsive: true, indexAxis: 'y', plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true } } }
    });
    analyticsChartInstances.push(c2);
  } else {
    document.getElementById('chartValueBySupplier').parentElement.innerHTML =
      '<p style="opacity:0.6;font-size:13px;margin:0;">No fabrics are linked to a supplier yet. Link a fabric to a supplier to see this chart.</p>';
  }

  // --- Chart 3: low stock vs healthy stock ---
  const lowCount = fabrics.filter(f => Number(f.stockMeters) < LOW_STOCK_THRESHOLD).length;
  const okCount = fabrics.length - lowCount;

  const c3 = new Chart(document.getElementById('chartLowStock'), {
    type: 'doughnut',
    data: {
      labels: ['Healthy stock', 'Low stock'],
      datasets: [{ data: [okCount, lowCount], backgroundColor: [chartColors[2], chartColors[1]] }]
    },
    options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
  });
  analyticsChartInstances.push(c3);
}

function openQrModal(f){
  const qrUrl = `${API_BASE}/fabrics/${f.id}/qrcode`;
  document.getElementById('modalRoot').innerHTML = `
    <div class="overlay" id="overlay">
      <div class="modal narrow" style="text-align:center;">
        <h2>${escapeHtml(f.name)}</h2>
        <div class="mono" style="opacity:0.65; margin-bottom:14px;">${f.sku}</div>
        <img src="${qrUrl}" alt="QR code for ${escapeHtml(f.name)}" style="width:220px;height:220px;border:1px solid var(--line);border-radius:4px;">
        <p style="font-size:12px;opacity:0.7;margin-top:12px;">Scan to see this fabric's name, SKU, category, composition and supplier. Print and attach to the physical roll.</p>
        <div class="modal-actions" style="justify-content:center;">
          <a href="${qrUrl}" download="${f.sku}-qrcode.png" class="btn ghost">Download</a>
          <button class="btn" id="closeQrBtn">Close</button>
        </div>
      </div>
    </div>
  `;
  document.getElementById('overlay').onclick = (e)=>{ if(e.target.id==='overlay') closeModal(); };
  document.getElementById('closeQrBtn').onclick = closeModal;
}

function openDetail(id){
  const f = fabrics.find(x=>x.id===id);
  if(!f) return;
  const img = imageUrl(f);
  const canEdit = isLoggedIn();
  const canDelete = isAdmin();
  document.getElementById('modalRoot').innerHTML = `
    <div class="overlay" id="overlay">
      <div class="modal">
        <div class="swatch-block" style="height:120px; ${img ? `background-image:url('${img}')` : `background:${f.colorHex}`}"></div>
        <h2>${escapeHtml(f.name)}</h2>
        <div class="mono" style="opacity:0.65; margin-bottom:14px;">${f.sku}</div>
        <div class="form-row">
          <div><label>Category</label>${f.category}</div>
          <div><label>Composition</label>${escapeHtml(f.composition||'—')}</div>
        </div>
        <div class="form-row">
          <div><label>Color</label>${escapeHtml(f.colorName||'—')}</div>
          <div><label>Pattern / weave</label>${escapeHtml(f.pattern||'—')}</div>
        </div>
        <div class="form-row">
          <div><label>Weight</label>${f.weightGsm} GSM</div>
          <div><label>Width</label>${f.widthCm} cm</div>
        </div>
        <div class="form-row">
          <div><label>Price</label>$${Number(f.pricePerMeter).toFixed(2)}/m</div>
          <div><label>Stock</label>${f.stockMeters} m ${Number(f.stockMeters)<LOW_STOCK_THRESHOLD?'<span class="stock-flag stock-low">LOW</span>':''}</div>
        </div>
        <div class="form-row">
          <div><label>Supplier</label>${escapeHtml(f.supplier||'—')}</div>
          <div><label>Season</label>${escapeHtml(f.season||'—')}</div>
        </div>
        <div class="form-row full"><div><label>Usage</label>${escapeHtml(f.usage||'—')}</div></div>
        <div class="form-row full"><div><label>Care instructions</label>${escapeHtml(f.care||'—')}</div></div>
        ${f.notes ? `<div class="form-row full"><div><label>Notes</label>${escapeHtml(f.notes)}</div></div>` : ''}
        <div class="detail-actions">
          <button class="btn ghost" id="qrBtn">View QR Code</button>
          ${canEdit ? `<button class="btn ghost" id="editBtn">Edit</button>` : `<button class="btn ghost" id="editBtn" title="Log in to edit">Log in to edit</button>`}
          ${canDelete ? `<button class="btn danger" id="deleteBtn">Delete</button>` : (isLoggedIn() ? '' : `<button class="btn danger" id="deleteBtn" title="Admin only">Log in as admin to delete</button>`)}
          <button class="btn" id="closeBtn" style="margin-left:auto;">Close</button>
        </div>
      </div>
    </div>
  `;
  document.getElementById('overlay').onclick = (e)=>{ if(e.target.id==='overlay') closeModal(); };
  document.getElementById('closeBtn').onclick = closeModal;

  document.getElementById('qrBtn').onclick = ()=>openQrModal(f);

  document.getElementById('editBtn').onclick = ()=>{
    requireLoginThen(()=>openEditModal(id));
  };

  const deleteBtnEl = document.getElementById('deleteBtn');
  if(deleteBtnEl){
    deleteBtnEl.onclick = async ()=>{
      if(!isLoggedIn()){ openLoginModal(); return; }
      if(!isAdmin()){ alert("Only an admin account can delete fabrics."); return; }
      if(!confirm(`Delete "${f.name}"? This can't be undone.`)) return;
      try{
        await deleteFabricApi(id);
        await loadFabrics();
        closeModal();
      }catch(e){
        if(e.message === 'AUTH'){ saveAuth(null); openLoginModal(); }
        else if(e.message === 'FORBIDDEN'){ alert("Only an admin account can delete fabrics."); }
        else { alert("Couldn't delete the fabric — check that the backend server is running."); }
      }
    };
  }
}

async function openEditModal(id){
  const f = fabrics.find(x=>x.id===id);
  await loadSuppliers();
  document.getElementById('modalRoot').innerHTML = `
    <div class="overlay" id="overlay">
      <div class="modal">
        <h2>Edit fabric</h2>
        ${fieldsForm(f)}
        <div class="form-error" id="formError">Something went wrong. Check the backend is running and you're logged in.</div>
        <div class="modal-actions">
          <button class="btn ghost" id="cancelBtn">Cancel</button>
          <button class="btn" id="saveBtn">Save changes</button>
        </div>
      </div>
    </div>
  `;
  document.getElementById('cancelBtn').onclick = closeModal;
  document.getElementById('overlay').onclick = (e)=>{ if(e.target.id==='overlay') closeModal(); };
  document.getElementById('saveBtn').onclick = async ()=>{
    const data = readForm();
    const imageFile = readSelectedImageFile();
    try{
      await updateFabricApi(id, { ...data, sku: f.sku });
      if(imageFile){
        try{ await uploadFabricImage(id, imageFile); }
        catch(imgErr){ console.error('Image upload failed', imgErr); }
      }
      await loadFabrics();
      closeModal();
    }catch(e){
      if(e.message === 'AUTH'){
        saveAuth(null);
        openLoginModal();
      } else {
        document.getElementById('formError').style.display = 'block';
      }
    }
  };
}

/* ---------- events ---------- */
document.getElementById('addBtn').onclick = openAddModal;
document.getElementById('manageSuppliersBtn').onclick = openManageSuppliersModal;
document.getElementById('analyticsBtn').onclick = openAnalyticsModal;
document.getElementById('resetBtn').onclick = ()=>loadFabrics();
document.getElementById('searchInput').addEventListener('input', (e)=>{ searchTerm = e.target.value; renderGrid(); });
document.getElementById('sortSelect').addEventListener('change', (e)=>{ sortMode = e.target.value; renderGrid(); });

loadSuppliers();
loadFabrics();