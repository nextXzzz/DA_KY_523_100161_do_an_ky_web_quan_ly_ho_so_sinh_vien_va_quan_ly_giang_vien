const API_URL = 'http://localhost:3000/api';

// ============================================================
// API Client
// ============================================================
window.api = {
    async request(endpoint, options = {}) {
        const url = `${API_URL}${endpoint}`;
        const defaultOptions = {
            headers: { 'Content-Type': 'application/json' }
        };
        if (options.body && typeof options.body !== 'string') {
            options.body = JSON.stringify(options.body);
        }
        try {
            const response = await fetch(url, { ...defaultOptions, ...options });
            if (response.status === 401) {
                sessionStorage.removeItem('loggedIn');
                sessionStorage.removeItem('user');
                window.location.href = '../index.html';
                return null;
            }
            return await response.json();
        } catch (error) {
            console.error('API error:', error);
            showToast('Lỗi kết nối đến máy chủ', 'error');
            throw error;
        }
    },
    get(endpoint) { return this.request(endpoint); },
    post(endpoint, body) { return this.request(endpoint, { method: 'POST', body }); },
    put(endpoint, body) { return this.request(endpoint, { method: 'PUT', body }); },
    delete(endpoint) { return this.request(endpoint, { method: 'DELETE' }); }
};

// ============================================================
// Auth Check
// ============================================================
function checkAuth() {
    if (sessionStorage.getItem('loggedIn') !== 'true') {
        window.location.href = '../index.html';
    }
}

// ============================================================
// Sidebar
// ============================================================
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleSidebar');
    if (!sidebar || !toggleBtn) return;

    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (isCollapsed) {
        document.querySelector('.app-layout')?.classList.add('sidebar-collapsed');
    }

    toggleBtn.addEventListener('click', () => {
        const layout = document.querySelector('.app-layout');
        layout?.classList.toggle('sidebar-collapsed');
        localStorage.setItem('sidebarCollapsed', layout?.classList.contains('sidebar-collapsed') || false);
    });
}

function setActiveNav() {
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.nav-item a').forEach(link => {
        const href = link.getAttribute('href');
        if (href && href === currentPage) {
            link.closest('.nav-item')?.classList.add('active');
        }
    });
}

// ============================================================
// User Info & Avatar
// ============================================================
function updateUserInfo() {
    try {
        const userData = JSON.parse(sessionStorage.getItem('user') || '{}');
        const hoTen = userData.hoTen || 'Admin';
        const initials = hoTen.split(' ').map(w => w[0]).join('').slice(-2).toUpperCase();
        const avatar = userData.avatar || '';

        // Header greeting
        const headerGreeting = document.getElementById('headerGreeting');
        if (headerGreeting) headerGreeting.textContent = `Xin chào, ${hoTen}!`;

        // Sidebar name/role
        const sidebarName = document.getElementById('sidebarName');
        const sidebarRole = document.getElementById('sidebarRole');
        if (sidebarName) sidebarName.textContent = hoTen;
        if (sidebarRole) sidebarRole.textContent = 'Quản lý';

        // Sidebar avatar
        const sidebarAvatar = document.getElementById('sidebarAvatar');
        if (sidebarAvatar) {
            if (avatar) {
                sidebarAvatar.innerHTML = `<img src="${avatar}" alt="Avatar">`;
            } else {
                sidebarAvatar.textContent = initials;
            }
            sidebarAvatar.addEventListener('click', () => openAvatarModal());
        }

        // Update avatar preview in modal if exists
        updateAvatarPreview(avatar, initials);
    } catch(e) { console.error(e); }
}

function updateAvatarPreview(avatar, initials) {
    const previewContainer = document.getElementById('avatarPreviewContainer');
    const previewText = document.getElementById('avatarPreviewText');
    if (!previewContainer) return;

    if (avatar) {
        previewContainer.innerHTML = `<img src="${avatar}" alt="Avatar" style="width:100%;height:100%;object-fit:cover;">`;
    } else if (previewText) {
        previewText.textContent = initials || 'A';
    }
}

function openAvatarModal() {
    const modal = document.getElementById('avatarModal');
    if (!modal) return;
    openModal('avatarModal');

    const userData = JSON.parse(sessionStorage.getItem('user') || '{}');
    const initials = (userData.hoTen || 'A').split(' ').map(w => w[0]).join('').slice(-2).toUpperCase();
    updateAvatarPreview(userData.avatar || '', initials);
}

window.pendingAvatarBase64 = null;

function initAvatarUpload() {
    const fileInput = document.getElementById('avatarFileInput');
    if (!fileInput) return;

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            showToast('Vui lòng chọn file ảnh', 'error');
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            showToast('Ảnh quá lớn. Tối đa 2MB', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (ev) => {
            window.pendingAvatarBase64 = ev.target.result;
            const previewContainer = document.getElementById('avatarPreviewContainer');
            if (previewContainer) {
                previewContainer.innerHTML = `<img src="${ev.target.result}" alt="Preview" style="width:100%;height:100%;object-fit:cover;">`;
            }
        };
        reader.readAsDataURL(file);
    });
}

window.saveAvatar = async function() {
    if (!window.pendingAvatarBase64) {
        showToast('Vui lòng chọn ảnh trước', 'warning');
        return;
    }

    const userData = JSON.parse(sessionStorage.getItem('user') || '{}');
    const btn = document.getElementById('saveAvatarBtn');
    if (btn) { btn.disabled = true; btn.textContent = 'Đang lưu...'; }

    try {
        const result = await api.put('/auth/avatar', {
            username: userData.username,
            avatar: window.pendingAvatarBase64
        });

        if (result && result.success) {
            userData.avatar = window.pendingAvatarBase64;
            sessionStorage.setItem('user', JSON.stringify(userData));
            updateUserInfo();
            closeModal('avatarModal');
            showToast('Cập nhật ảnh đại diện thành công!', 'success');
            window.pendingAvatarBase64 = null;
        } else {
            showToast(result?.message || 'Lỗi cập nhật ảnh', 'error');
        }
    } catch(e) {
        showToast('Lỗi kết nối', 'error');
    } finally {
        if (btn) { btn.disabled = false; btn.textContent = 'Lưu ảnh đại diện'; }
    }
};

// ============================================================
// Floating Chatbot
// ============================================================
window.toggleChatbot = function() {
    const panel = document.getElementById('chatbotPanel');
    const fab = document.getElementById('chatbotFab');
    if (!panel) return;
    panel.classList.toggle('open');
    if (fab) {
        fab.style.animation = panel.classList.contains('open') ? 'none' : 'chatPulse 2s infinite';
    }
    if (panel.classList.contains('open')) {
        const input = document.getElementById('chatbotInput');
        if (input) input.focus();
        const messages = document.getElementById('chatbotMessages');
        if (messages) messages.scrollTop = messages.scrollHeight;
    }
};

window.sendChatMessage = async function() {
    const input = document.getElementById('chatbotInput');
    const messages = document.getElementById('chatbotMessages');
    if (!input || !messages) return;

    const text = input.value.trim();
    if (!text) return;

    // Hide suggestions after first message
    const suggestions = document.getElementById('chatSuggestions');
    if (suggestions) suggestions.style.display = 'none';

    // Add user bubble
    const userBubble = document.createElement('div');
    userBubble.className = 'chat-bubble user';
    userBubble.textContent = text;
    messages.appendChild(userBubble);
    input.value = '';
    messages.scrollTop = messages.scrollHeight;

    // Add typing indicator
    const typingBubble = document.createElement('div');
    typingBubble.className = 'chat-bubble bot typing';
    typingBubble.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
    messages.appendChild(typingBubble);
    messages.scrollTop = messages.scrollHeight;

    try {
        const result = await api.post('/chatbot', { message: text });
        typingBubble.remove();

        const botBubble = document.createElement('div');
        botBubble.className = 'chat-bubble bot';
        botBubble.innerHTML = result?.reply || 'Xin lỗi, có lỗi xảy ra.';
        messages.appendChild(botBubble);
    } catch(e) {
        typingBubble.remove();
        const errorBubble = document.createElement('div');
        errorBubble.className = 'chat-bubble bot';
        errorBubble.innerHTML = 'Không thể kết nối. Vui lòng thử lại sau.';
        messages.appendChild(errorBubble);
    }
    messages.scrollTop = messages.scrollHeight;
};

window.sendSuggestion = function(text) {
    const input = document.getElementById('chatbotInput');
    if (input) input.value = text;
    sendChatMessage();
};

// ============================================================
// Toast Notifications
// ============================================================
function showToast(message, type = 'info', duration = 3500) {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const icons = {
        success: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',
        error: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/></svg>',
        warning: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>',
        info: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>',
        danger: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/></svg>'
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span class="toast-icon">${icons[type] || icons.info}</span><span class="toast-msg">${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}
window.showToast = showToast;

// ============================================================
// Confirm Dialog
// ============================================================
function showConfirm({ title = 'Xác nhận', message = '', confirmText = 'Xác nhận', cancelText = 'Hủy', onConfirm }) {
    const existing = document.querySelector('.confirm-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'confirm-overlay modal-overlay active';
    overlay.innerHTML = `
        <div class="modal" style="max-width:400px;animation:slideUp 0.3s ease;">
            <div class="modal-body" style="text-align:center;padding:32px 24px;">
                <div style="width:56px;height:56px;border-radius:50%;background:#fee2e2;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;">
                    <svg viewBox="0 0 24 24" width="28" height="28" fill="#ef4444"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>
                </div>
                <h3 style="margin-bottom:8px;">${title}</h3>
                <p style="color:var(--text-light);">${message}</p>
            </div>
            <div class="modal-footer" style="justify-content:center;gap:12px;">
                <button class="btn btn-ghost cancel-btn">${cancelText}</button>
                <button class="btn btn-danger confirm-btn">${confirmText}</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    overlay.querySelector('.cancel-btn').addEventListener('click', () => overlay.remove());
    overlay.querySelector('.confirm-btn').addEventListener('click', () => {
        overlay.remove();
        if (onConfirm) onConfirm();
    });
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
}
window.showConfirm = showConfirm;

// ============================================================
// Modal Helpers
// ============================================================
function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('active');
}
function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('active');
}
window.openModal = openModal;
window.closeModal = closeModal;

// Close modal on overlay click, Escape, or .modal-close button click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay') && !e.target.classList.contains('confirm-overlay')) {
        e.target.classList.remove('active');
    }
    if (e.target.closest('.modal-close')) {
        const overlay = e.target.closest('.modal-overlay');
        if (overlay) overlay.classList.remove('active');
    }
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay').forEach(m => { m.classList.remove('active'); });
        // Also close chatbot
        const panel = document.getElementById('chatbotPanel');
        if (panel?.classList.contains('open')) toggleChatbot();
    }
});

// ============================================================
// Skeleton Loader
// ============================================================
function showSkeleton(container, rows = 5) {
    if (!container) return;
    let html = '';
    for (let i = 0; i < rows; i++) {
        html += `<div class="skeleton" style="height:44px;margin-bottom:8px;border-radius:8px;"></div>`;
    }
    container.innerHTML = html;
}
window.showSkeleton = showSkeleton;

// ============================================================
// Logout
// ============================================================
function initLogout() {
    document.querySelectorAll('[data-action="logout"]').forEach(btn => {
        btn.addEventListener('click', () => {
            showConfirm({
                title: 'Đăng xuất',
                message: 'Bạn có chắc chắn muốn đăng xuất?',
                confirmText: 'Đăng xuất',
                onConfirm: () => {
                    sessionStorage.removeItem('loggedIn');
                    sessionStorage.removeItem('user');
                    window.location.href = '../index.html';
                }
            });
        });
    });
}

// ============================================================
// Init
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    initSidebar();
    setActiveNav();
    updateUserInfo();
    initLogout();
    initAvatarUpload();
});
