// Simple expense tracker using localStorage
const STORAGE_KEY = 'expenses_v1';
let items = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
let editId = null;

const qs = (s) => document.querySelector(s);
const form = qs('#expense-form');
const titleEl = qs('#title');
const amountEl = qs('#amount');
const categoryEl = qs('#category');
const listEl = qs('#list');
const totalEl = qs('#total');
const incomeEl = qs('#income');
const expenseEl = qs('#expense');
const emptyEl = qs('#empty');
const searchEl = qs('#search');
const filterEl = qs('#filter');
const exportBtn = qs('#export');
const clearBtn = qs('#clear');
const saveBtn = qs('#save-btn');

function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function render() {
    listEl.innerHTML = '';
    const q = searchEl.value.trim().toLowerCase();
    const f = filterEl.value;
    const filtered = items.filter(it => {
        const matchesQ = it.title.toLowerCase().includes(q) || it.category.toLowerCase().includes(q);
        const matchesF = f === 'all' ? true : it.category === f;
        return matchesQ && matchesF;
    });

    if (filtered.length === 0) {
        emptyEl.style.display = 'block';
    } else {
        emptyEl.style.display = 'none';
    }

    filtered.forEach(it => {
        const row = document.createElement('div');
        row.className = 'item';

        const left = document.createElement('div');
        left.className = 'left';
        const meta = document.createElement('div');
        meta.innerHTML = `<div style="font-weight:700">${escapeHtml(it.title)}</div><div class='meta'>${it.category} • ${new Date(it.createdAt).toLocaleString()}</div>`;

        left.appendChild(meta);

        const right = document.createElement('div');
        right.style.display = 'flex';
        right.style.alignItems = 'center';
        right.style.gap = '12px';

        const amt = document.createElement('div');
        amt.className = 'amount';
        amt.textContent = formatCurrency(it.amount);
        if (Number(it.amount) < 0) amt.style.color = 'var(--danger)';
        else amt.style.color = 'var(--success)';

        const edit = document.createElement('button');
        edit.className = 'ghost';
        edit.textContent = 'Edit';
        edit.onclick = () => startEdit(it.id);

        const del = document.createElement('button');
        del.className = 'ghost';
        del.textContent = 'Delete';
        del.onclick = () => removeItem(it.id);

        right.appendChild(amt);
        right.appendChild(edit);
        right.appendChild(del);

        row.appendChild(left);
        row.appendChild(right);

        listEl.appendChild(row);
    });

    updateSummary();
}

function startEdit(id) {
    const it = items.find(x => x.id === id);
    if (!it) return;
    titleEl.value = it.title;
    amountEl.value = it.amount;
    categoryEl.value = it.category;
    saveBtn.textContent = 'Update';
    editId = id;
}

function removeItem(id) {
    if (!confirm('Delete this transaction?')) return;
    items = items.filter(x => x.id !== id);
    saveToStorage();
    render();
}

function updateSummary() {
    const amounts = items.map(i => Number(i.amount));
    const income = amounts.filter(a => a > 0).reduce((s, n) => s + n, 0);
    const expense = amounts.filter(a => a < 0).reduce((s, n) => s + n, 0);
    const total = income + expense;
    totalEl.textContent = formatCurrency(total);
    incomeEl.textContent = formatCurrency(income);
    expenseEl.textContent = formatCurrency(Math.abs(expense));
}

function clearAll() {
    if (!confirm('Clear all transactions?')) return;
    items = [];
    saveToStorage();
    render();
}

function exportCSV() {
    if (items.length === 0) { alert('No data to export'); return }
    const header = ['Title', 'Amount', 'Category', 'CreatedAt'];
    const rows = items.map(i => [i.title, i.amount, i.category, new Date(i.createdAt).toISOString()]);
    const csv = [header, ...rows].map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'expenses.csv'; a.click();
    URL.revokeObjectURL(url);
}

function formatCurrency(n) {
    const num = Number(n) || 0;
    return (num < 0 ? '-' : '') + '$' + Math.abs(num).toFixed(2);
}

function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

form.addEventListener('submit', e => {
    e.preventDefault();
    const title = titleEl.value.trim();
    const amount = amountEl.value.trim();
    const category = categoryEl.value;
    if (!title || amount === '') return alert('Please provide title and amount');
    if (editId) {
        const idx = items.findIndex(x => x.id === editId);
        if (idx > -1) {
            items[idx].title = title;
            items[idx].amount = Number(amount);
            items[idx].category = category;
        }
        editId = null;
        saveBtn.textContent = 'Add';
    } else {
        items.unshift({ id: cryptoRandomId(), title, amount: Number(amount), category, createdAt: Date.now() });
    }
    saveToStorage();
    form.reset();
    render();
});

searchEl.addEventListener('input', render);
filterEl.addEventListener('change', render);
clearBtn.addEventListener('click', clearAll);
exportBtn.addEventListener('click', exportCSV);

function cryptoRandomId() {
    // short friendly id
    return 'id_' + Math.random().toString(36).slice(2, 11);
}

// initial render
render();