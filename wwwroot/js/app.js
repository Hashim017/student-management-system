const API = '/api/students';
const state = { page: 1, pageSize: 8, search: '', department: '', sortBy: 'name' };
const $ = id => document.getElementById(id);

/* ---------- Helpers ---------- */
const esc = s => String(s ?? '').replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const initials = n => n.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();
const hue = s => { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 360; return h; };
const fmtDate = d => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
const debounce = (fn, ms = 350) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };

async function api(url, options) {
    const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...options });
    let data = null;
    if (res.status !== 204) { try { data = await res.json(); } catch { } }
    if (!res.ok) {
        let msg = data?.message || data?.title || 'Something went wrong.';
        if (data?.errors) msg = Object.values(data.errors).flat()[0];
        throw new Error(msg);
    }
    return data;
}

function toast(message, type = 'success') {
    const el = document.createElement('div');
    el.className = 'toast ' + (type === 'error' ? 'error' : '');
    el.textContent = (type === 'error' ? '⚠️ ' : '✅ ') + message;
    $('toasts').appendChild(el);
    setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 300); }, 3200);
}

function countUp(el, to) {
    const from = Number(el.textContent) || 0, t0 = performance.now();
    const step = t => {
        const k = Math.min((t - t0) / 600, 1);
        el.textContent = Math.round(from + (to - from) * k);
        if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}

/* ---------- Theme ---------- */
function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    $('themeBtn').textContent = theme === 'dark' ? '☀️' : '🌙';
    try { localStorage.setItem('theme', theme); } catch { }
}
let savedTheme = 'light';
try { savedTheme = localStorage.getItem('theme') || 'light'; } catch { }
setTheme(savedTheme);
$('themeBtn').onclick = () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');

/* ---------- Load data ---------- */
async function loadStats() {
    try {
        const s = await api(API + '/stats');
        countUp($('statTotal'), s.total);
        countUp($('statNew'), s.newThisMonth);
        countUp($('statDept'), s.departmentCount);

        $('chips').innerHTML =
            `<button class="chip ${state.department === '' ? 'active' : ''}" data-dept="">All<b>${s.total}</b></button>` +
            s.byDepartment.map(d =>
                `<button class="chip ${state.department === d.department ? 'active' : ''}" data-dept="${esc(d.department)}">${esc(d.department)}<b>${d.count}</b></button>`
            ).join('');
    } catch (e) { toast(e.message, 'error'); }
}

async function loadDepartments() {
    try {
        const list = await api(API + '/departments');
        $('deptFilter').innerHTML = '<option value="">All departments</option>' +
            list.map(d => `<option value="${esc(d)}">${esc(d)}</option>`).join('');
        $('deptFilter').value = state.department;
        $('deptList').innerHTML = list.map(d => `<option value="${esc(d)}">`).join('');
    } catch (e) { toast(e.message, 'error'); }
}

function showSkeleton() {
    $('empty').classList.add('hidden');
    $('rows').innerHTML = Array.from({ length: 5 }, () =>
        `<tr>${'<td><div class="skeleton"></div></td>'.repeat(6)}</tr>`).join('');
}

async function loadStudents() {
    showSkeleton();
    const p = new URLSearchParams({ page: state.page, pageSize: state.pageSize, sortBy: state.sortBy });
    if (state.search) p.set('search', state.search);
    if (state.department) p.set('department', state.department);
    try {
        const data = await api(`${API}?${p}`);
        renderRows(data.items);
        renderPagination(data);
    } catch (e) { $('rows').innerHTML = ''; toast(e.message, 'error'); }
}

const refreshAll = () => Promise.all([loadStats(), loadDepartments(), loadStudents()]);

/* ---------- Render ---------- */
function renderRows(items) {
    $('empty').classList.toggle('hidden', items.length > 0);
    $('rows').innerHTML = items.map((s, i) => {
        const h = hue(s.department);
        return `
    <tr style="animation-delay:${i * 40}ms" data-id="${s.id}">
      <td>
        <div class="person">
          <div class="avatar" style="background:hsl(${hue(s.fullName)} 65% 48%)">${esc(initials(s.fullName))}</div>
          <div>
            <div class="person-name">${esc(s.fullName)}</div>
            <div class="person-email">${esc(s.email)}</div>
          </div>
        </div>
      </td>
      <td><b>${esc(s.rollNumber)}</b></td>
      <td><span class="badge" style="background:hsl(${h} 80% 50% / .13);color:hsl(${h} 65% 48%)">${esc(s.department)}</span></td>
      <td class="muted">${esc(s.phone || '—')}</td>
      <td class="muted">${fmtDate(s.enrollmentDate)}</td>
      <td class="actions">
        <button class="act" data-action="edit" data-id="${s.id}" title="Edit">✏️</button>
        <button class="act danger" data-action="delete" data-id="${s.id}" data-name="${esc(s.fullName)}" title="Delete">🗑️</button>
      </td>
    </tr>`;
    }).join('');
}

function renderPagination(d) {
    const from = d.totalCount === 0 ? 0 : (d.page - 1) * d.pageSize + 1;
    const to = Math.min(d.page * d.pageSize, d.totalCount);
    $('pageInfo').textContent = `Showing ${from}–${to} of ${d.totalCount}`;

    if (d.totalPages <= 1) { $('pageBtns').innerHTML = ''; return; }
    const start = Math.max(1, Math.min(d.page - 2, d.totalPages - 4));
    const end = Math.min(d.totalPages, start + 4);
    let html = `<button data-page="${d.page - 1}" ${d.page === 1 ? 'disabled' : ''}>‹</button>`;
    for (let i = start; i <= end; i++)
        html += `<button data-page="${i}" class="${i === d.page ? 'active' : ''}">${i}</button>`;
    html += `<button data-page="${d.page + 1}" ${d.page === d.totalPages ? 'disabled' : ''}>›</button>`;
    $('pageBtns').innerHTML = html;
}

/* ---------- Events: search, filter, sort, paging ---------- */
$('searchInput').addEventListener('input', debounce(e => {
    state.search = e.target.value.trim(); state.page = 1; loadStudents();
}));
$('deptFilter').onchange = e => { state.department = e.target.value; state.page = 1; loadStudents(); loadStats(); };
$('sortBy').onchange = e => { state.sortBy = e.target.value; state.page = 1; loadStudents(); };
$('pageBtns').onclick = e => {
    const b = e.target.closest('button[data-page]');
    if (!b || b.disabled) return;
    state.page = Number(b.dataset.page); loadStudents();
};
$('chips').onclick = e => {
    const c = e.target.closest('.chip'); if (!c) return;
    state.department = c.dataset.dept; $('deptFilter').value = state.department;
    state.page = 1; loadStudents(); loadStats();
};

/* ---------- Modal and form ---------- */
const fieldNames = ['fullName', 'rollNumber', 'email', 'phone', 'department', 'dateOfBirth', 'enrollmentDate', 'address'];

function clearErrors() {
    document.querySelectorAll('.field').forEach(f => f.classList.remove('invalid'));
    document.querySelectorAll('[data-err]').forEach(s => s.textContent = '');
}
function showErrors(errs) {
    clearErrors();
    for (const [k, msg] of Object.entries(errs)) {
        const small = document.querySelector(`[data-err="${k}"]`);
        if (small) { small.textContent = msg; small.closest('.field').classList.add('invalid'); }
    }
    const first = Object.keys(errs)[0];
    if (first) $('f_' + first)?.focus();
}
function getValues() {
    const v = {};
    fieldNames.forEach(n => v[n] = $('f_' + n).value.trim());
    v.phone = v.phone || null;
    v.address = v.address || null;
    return v;
}
function validate(v) {
    const e = {};
    if (!v.fullName) e.fullName = 'Full name is required.';
    if (!v.rollNumber) e.rollNumber = 'Roll number is required.';
    if (!v.email) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = 'Enter a valid email.';
    if (!v.department) e.department = 'Department is required.';
    if (!v.dateOfBirth) e.dateOfBirth = 'Date of birth is required.';
    else if (new Date(v.dateOfBirth) >= new Date()) e.dateOfBirth = 'Date must be in the past.';
    if (!v.enrollmentDate) e.enrollmentDate = 'Enrollment date is required.';
    return e;
}

let editingId = null;

function openModal(student = null) {
    $('studentForm').reset();
    clearErrors();
    editingId = student ? student.id : null;
    $('modalTitle').textContent = student ? 'Edit Student' : 'Add Student';
    $('saveBtn').textContent = student ? 'Update student' : 'Save student';
    if (student) {
        fieldNames.forEach(n => {
            let val = student[n] ?? '';
            if (n === 'dateOfBirth' || n === 'enrollmentDate') val = String(val).slice(0, 10);
            $('f_' + n).value = val;
        });
    } else {
        $('f_enrollmentDate').value = new Date().toISOString().slice(0, 10);
    }
    $('modal').classList.add('open');
    setTimeout(() => $('f_fullName').focus(), 150);
}
function closeModal() { $('modal').classList.remove('open'); }

$('addBtn').onclick = () => openModal();
$('emptyAddBtn').onclick = () => openModal();
$('closeModal').onclick = closeModal;
$('cancelBtn').onclick = closeModal;
$('modal').onclick = e => { if (e.target === $('modal')) closeModal(); };
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

$('studentForm').addEventListener('submit', async ev => {
    ev.preventDefault();
    const v = getValues();
    const errs = validate(v);
    showErrors(errs);
    if (Object.keys(errs).length) return;

    const editing = editingId !== null;
    const btn = $('saveBtn');
    btn.disabled = true; btn.textContent = 'Saving...';
    try {
        if (editing) {
            await api(`${API}/${editingId}`, { method: 'PUT', body: JSON.stringify({ ...v, id: editingId }) });
        } else {
            await api(API, { method: 'POST', body: JSON.stringify(v) });
            state.page = 1;
        }
        closeModal();
        toast(editing ? 'Student updated.' : 'Student added successfully.');
        await refreshAll();
    } catch (err) {
        toast(err.message, 'error');
        if (/roll/i.test(err.message)) showErrors({ rollNumber: err.message });
        else if (/email/i.test(err.message)) showErrors({ email: err.message });
    } finally {
        btn.disabled = false;
        btn.textContent = editing ? 'Update student' : 'Save student';
    }
});

/* ---------- Clock ---------- */
function tickClock() {
    const n = new Date();
    $('clockDate').textContent = n.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
    $('clockTime').textContent = n.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}
tickClock();
setInterval(tickClock, 30000);

/* ---------- Details panel ---------- */
const detailRow = (icon, label, value) =>
    `<div class="d-row"><span class="d-icon">${icon}</span><div><small>${label}</small><div class="d-val">${esc(value || '—')}</div></div></div>`;

async function openDetails(id) {
    try {
        const s = await api(`${API}/${id}`);
        const age = Math.floor((Date.now() - new Date(s.dateOfBirth)) / 31557600000);
        const h = hue(s.fullName);
        $('drawerBody').innerHTML = `
      <div class="d-hero" style="background:linear-gradient(135deg,hsl(${h} 65% 48%),hsl(${(h + 50) % 360} 65% 38%))">
        <div class="d-avatar">${esc(initials(s.fullName))}</div>
        <h2>${esc(s.fullName)}</h2>
        <p>${esc(s.rollNumber)} · ${esc(s.department)}</p>
      </div>
      <div class="d-list">
        ${detailRow('📧', 'Email', s.email)}
        ${detailRow('📱', 'Phone', s.phone)}
        ${detailRow('🎂', 'Date of birth', fmtDate(s.dateOfBirth) + ' (' + age + ' years)')}
        ${detailRow('📅', 'Enrolled on', fmtDate(s.enrollmentDate))}
        ${detailRow('📍', 'Address', s.address)}
      </div>
      <div class="d-actions">
        <button class="btn btn-primary" id="dEdit">✏️ Edit</button>
        <button class="btn btn-danger" id="dDelete">🗑️ Delete</button>
      </div>`;
        $('dEdit').onclick = () => { closeDetails(); openModal(s); };
        $('dDelete').onclick = () => askDelete(s.id, s.fullName);
        $('drawer').classList.add('open');
    } catch (err) { toast(err.message, 'error'); }
}
function closeDetails() { $('drawer').classList.remove('open'); }
$('closeDrawer').onclick = closeDetails;
$('drawerBackdrop').onclick = closeDetails;

/* ---------- Delete with confirm ---------- */
let deleteId = null;
function askDelete(id, name) {
    deleteId = id;
    $('confirmText').innerHTML = `Are you sure you want to delete <b>${esc(name)}</b>? This cannot be undone.`;
    $('confirmModal').classList.add('open');
}
function closeConfirm() { $('confirmModal').classList.remove('open'); deleteId = null; }
$('confirmCancel').onclick = closeConfirm;
$('confirmModal').onclick = e => { if (e.target === $('confirmModal')) closeConfirm(); };
$('confirmDelete').onclick = async () => {
    if (deleteId === null) return;
    const btn = $('confirmDelete');
    btn.disabled = true; btn.textContent = 'Deleting...';
    try {
        await api(`${API}/${deleteId}`, { method: 'DELETE' });
        if (state.page > 1 && document.querySelectorAll('#rows tr[data-id]').length === 1) state.page--;
        closeConfirm(); closeDetails();
        toast('Student deleted.');
        await refreshAll();
    } catch (err) { toast(err.message, 'error'); }
    finally { btn.disabled = false; btn.textContent = 'Yes, delete'; }
};

/* ---------- Row clicks ---------- */
$('rows').addEventListener('click', async e => {
    const btn = e.target.closest('.act');
    if (btn) {
        const id = Number(btn.dataset.id);
        if (btn.dataset.action === 'edit') {
            try { openModal(await api(`${API}/${id}`)); } catch (err) { toast(err.message, 'error'); }
        } else {
            askDelete(id, btn.dataset.name);
        }
        return;
    }
    const row = e.target.closest('tr[data-id]');
    if (row) openDetails(Number(row.dataset.id));
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeConfirm(); closeDetails(); }
});

/* ---------- Responsive search placeholder ---------- */
function fitPlaceholder() {
    $('searchInput').placeholder = window.innerWidth > 700
        ? 'Search by name, roll number or email...'
        : 'Search students...';
}
fitPlaceholder();
window.addEventListener('resize', fitPlaceholder);

/* ---------- Start ---------- */
refreshAll();