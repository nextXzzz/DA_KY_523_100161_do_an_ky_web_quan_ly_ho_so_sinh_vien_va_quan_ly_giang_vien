let debounceTimer;

document.addEventListener('DOMContentLoaded', () => {
    loadLecturers();
    
    document.getElementById('searchInput').addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            loadLecturers(e.target.value);
        }, 300);
    });
});

async function loadLecturers(search = '') {
    const table = document.getElementById('lecturersTable');
    const tbody = table.querySelector('tbody');
    if (tbody) showSkeleton(tbody, 5);
    
    try {
        const url = search ? `/lecturers?search=${encodeURIComponent(search)}` : '/lecturers';
        const response = await window.api.get(url);
        
        if (tbody) tbody.innerHTML = '';
        
        if (response && response.success && response.data.length > 0) {
            document.getElementById('emptyState').style.display = 'none';
            table.style.display = 'table';
            
            response.data.forEach((lecturer, index) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${lecturer.maGiangVien || ''}</td>
                    <td>${lecturer.hoTen || ''}</td>
                    <td>${formatDate(lecturer.ngaySinh)}</td>
                    <td>${lecturer.gioiTinh || ''}</td>
                    <td>${lecturer.khoa || ''}</td>
                    <td>${lecturer.boMon || ''}</td>
                    <td>${lecturer.soDienThoai || ''}</td>
                    <td>${lecturer.email || ''}</td>
                    <td>
                        <div class="table-actions">
                            <button class="btn btn-icon btn-ghost" title="Xem" onclick="openViewModal('${lecturer.id || lecturer._id}')">
                                <svg viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                            </button>
                            <button class="btn btn-icon btn-ghost" title="Sửa" onclick="openEditModal('${lecturer.id || lecturer._id}')">
                                <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                            </button>
                            <button class="btn btn-icon btn-ghost text-danger" title="Xóa" onclick="deleteLecturer('${lecturer.id || lecturer._id}')">
                                <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                            </button>
                        </div>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        } else {
            table.style.display = 'none';
            document.getElementById('emptyState').style.display = 'block';
        }
    } catch (error) {
        console.error(error);
        table.style.display = 'none';
        document.getElementById('emptyState').style.display = 'block';
    }
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    try {
        const d = new Date(dateStr);
        if(isNaN(d)) return dateStr;
        return d.toLocaleDateString('vi-VN');
    } catch(e) {
        return dateStr;
    }
}

function formatDateForInput(dateStr) {
    if (!dateStr) return '';
    try {
        const d = new Date(dateStr);
        if(isNaN(d)) return '';
        return d.toISOString().split('T')[0];
    } catch(e) {
        return '';
    }
}

function openAddModal() {
    document.getElementById('lecturerForm').reset();
    document.getElementById('lecturerId').value = '';
    document.getElementById('modalTitle').textContent = 'Thêm giảng viên';
    openModal('lecturerModal');
}

async function openEditModal(id) {
    try {
        const response = await window.api.get(`/lecturers/${id}`);
        if (response && response.success) {
            const lecturer = response.data;
            document.getElementById('lecturerId').value = id;
            document.getElementById('maGV').value = lecturer.maGiangVien || '';
            document.getElementById('hoTen').value = lecturer.hoTen || '';
            document.getElementById('ngaySinh').value = formatDateForInput(lecturer.ngaySinh);
            document.getElementById('gioiTinh').value = lecturer.gioiTinh || 'Nam';
            document.getElementById('khoa').value = lecturer.khoa || '';
            document.getElementById('boMon').value = lecturer.boMon || '';
            document.getElementById('sdt').value = lecturer.soDienThoai || '';
            document.getElementById('email').value = lecturer.email || '';
            
            document.getElementById('modalTitle').textContent = 'Sửa thông tin giảng viên';
            openModal('lecturerModal');
        }
    } catch (error) {
        showToast('Không thể tải thông tin giảng viên', 'danger');
    }
}

async function openViewModal(id) {
    try {
        const response = await window.api.get(`/lecturers/${id}`);
        if (response && response.success) {
            const lecturer = response.data;
            const content = document.getElementById('viewContent');
            content.innerHTML = `
                <tr><th style="width:120px">Mã GV:</th><td>${lecturer.maGiangVien || ''}</td></tr>
                <tr><th>Họ tên:</th><td>${lecturer.hoTen || ''}</td></tr>
                <tr><th>Ngày sinh:</th><td>${formatDate(lecturer.ngaySinh)}</td></tr>
                <tr><th>Giới tính:</th><td>${lecturer.gioiTinh || ''}</td></tr>
                <tr><th>Khoa:</th><td>${lecturer.khoa || ''}</td></tr>
                <tr><th>Bộ môn:</th><td>${lecturer.boMon || ''}</td></tr>
                <tr><th>SĐT:</th><td>${lecturer.soDienThoai || ''}</td></tr>
                <tr><th>Email:</th><td>${lecturer.email || ''}</td></tr>
            `;
            openModal('viewModal');
        }
    } catch (error) {
        showToast('Không thể tải thông tin giảng viên', 'danger');
    }
}

async function saveLecturer() {
    const form = document.getElementById('lecturerForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const id = document.getElementById('lecturerId').value;
    const data = {
        maGiangVien: document.getElementById('maGV').value,
        hoTen: document.getElementById('hoTen').value,
        ngaySinh: document.getElementById('ngaySinh').value,
        gioiTinh: document.getElementById('gioiTinh').value,
        khoa: document.getElementById('khoa').value,
        boMon: document.getElementById('boMon').value,
        soDienThoai: document.getElementById('sdt').value,
        email: document.getElementById('email').value
    };

    try {
        let response;
        if (id) {
            response = await window.api.put(`/lecturers/${id}`, data);
        } else {
            response = await window.api.post('/lecturers', data);
        }

        if (response && response.success) {
            showToast(id ? 'Cập nhật thành công!' : 'Thêm mới thành công!', 'success');
            closeModal('lecturerModal');
            loadLecturers(document.getElementById('searchInput').value);
        } else {
            showToast(response.message || 'Có lỗi xảy ra', 'danger');
        }
    } catch (error) {
        showToast('Lỗi khi lưu dữ liệu', 'danger');
    }
}

function deleteLecturer(id) {
    showConfirm({
        title: 'Xóa giảng viên',
        message: 'Bạn có chắc chắn muốn xóa giảng viên này? Hành động này không thể hoàn tác.',
        confirmText: 'Xóa',
        onConfirm: async () => {
            try {
                const response = await window.api.delete(`/lecturers/${id}`);
                if (response && response.success) {
                    showToast('Đã xóa giảng viên', 'success');
                    loadLecturers(document.getElementById('searchInput').value);
                } else {
                    showToast('Không thể xóa giảng viên', 'danger');
                }
            } catch (error) {
                showToast('Lỗi khi xóa dữ liệu', 'danger');
            }
        }
    });
}
