// When served by Express, API is on the same origin. Opened from file:// or hosted elsewhere,
// set API_BASE to your deployed backend URL, e.g. 'https://your-app.onrender.com'
const API_BASE = location.protocol === 'file:' ? 'http://localhost:3000' : '';
const API = API_BASE + '/api/products';

const $ = (id) => document.getElementById(id);
const form = $('productForm');
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function show(text, ok = true) {
  const m = $('msg');
  m.textContent = text;
  m.style.display = 'block';
  m.style.background = ok ? '#d4efdf' : '#f5b7b1';
  setTimeout(() => (m.style.display = 'none'), 2500);
}

async function load() {
  try {
    const res = await fetch(API);
    const data = await res.json();
    $('rows').innerHTML = data.map((p) => `
      <tr>
        <td>${p.id}</td><td>${esc(p.product_name)}</td><td>${esc(p.brand)}</td>
        <td>${esc(p.category)}</td><td>$${Number(p.price).toFixed(2)}</td><td>${p.stock}</td>
        <td>${esc(p.description)}</td><td>${esc(p.updated_at)}</td>
        <td><button class="edit" onclick="editItem(${p.id})">Edit</button>
            <button class="del" onclick="delItem(${p.id})">Delete</button></td>
      </tr>`).join('');
  } catch (e) { show('Could not reach API', false); }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = $('id').value;
  const body = {
    product_name: $('product_name').value, brand: $('brand').value, category: $('category').value,
    price: $('price').value, stock: $('stock').value, description: $('description').value,
  };
  const res = await fetch(id ? `${API}/${id}` : API, {
    method: id ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) return show((await res.json()).error || 'Error', false);
  show(id ? 'Product updated' : 'Product created');
  resetForm();
  load();
});

async function editItem(id) {
  const p = await (await fetch(`${API}/${id}`)).json();
  ['id','product_name','brand','category','price','stock','description'].forEach((k) => ($(k).value = p[k] ?? ''));
  $('formTitle').textContent = `Edit Product #${id}`;
  $('cancelBtn').style.display = 'inline-block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function delItem(id) {
  if (!confirm('Delete this product?')) return;
  const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
  show(res.ok ? 'Product deleted' : 'Delete failed', res.ok);
  load();
}

function resetForm() {
  form.reset();
  $('id').value = '';
  $('formTitle').textContent = 'Add Product';
  $('cancelBtn').style.display = 'none';
}
$('cancelBtn').addEventListener('click', resetForm);
load();
