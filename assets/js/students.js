let debounceTimer;

document.addEventListener('DOMContentLoaded', () => {
    loadStudents();
    
    document.getElementById('searchInput').addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            loadStudents(e.target.value);
        }, 300);
    });
});

async function loadStudents(search = '') {
    const table = document.getElementById('studentsTable');
    const tbody = table.querySelector('tbody');
    if (tbody) showSkeleton(tbody, 5);
    
    try {
        const url = search ? `/students?search=${encodeURIComponent(search)}` : '/students';
        const response = await window.api.get(url);
        
        if (tbody) tbody.innerHTML = '';
        
        if (response && response.success && response.data.length > 0) {
            document.getElementById('emptyState').style.display = 'none';
            table.style.display = 'table';
            
            response.data.forEach((student, index) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${student.maSinhVien || ''}</td>
                    <td>${student.hoTen || ''}</td>
                    <td>${formatDate(student.ngaySinh)}</td>
                    <td>${student.gioiTinh || ''}</td>
                    <td>${student.lop || ''}</td>
                    <td>${student.khoa || ''}</td>
                    <td>${student.soDienThoai || ''}</td>
                    <td>${student.email || ''}</td>
                    <td>
                        <div class="table-actions">
                            <button class="btn btn-icon btn-ghost" title="Xem" onclick="openViewModal('${student.id || student._id}')">
                                <svg viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                            </button>
                            <button class="btn btn-icon btn-ghost" title="Sửa" onclick="openEditModal('${student.id || student._id}')">
                                <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                            </button>
                            <button class="btn btn-icon btn-ghost text-danger" title="Xóa" onclick="deleteStudent('${student.id || student._id}')">
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
    document.getElementById('studentForm').reset();
    document.getElementById('studentId').value = '';
    document.getElementById('modalTitle').textContent = 'Thêm sinh viên';
    openModal('studentModal');
}

async function openEditModal(id) {
    try {
        const response = await window.api.get(`/students/${id}`);
        if (response && response.success) {
            const student = response.data;
            document.getElementById('studentId').value = id;
            document.getElementById('maSV').value = student.maSinhVien || '';
            document.getElementById('hoTen').value = student.hoTen || '';
            document.getElementById('ngaySinh').value = formatDateForInput(student.ngaySinh);
            document.getElementById('gioiTinh').value = student.gioiTinh || 'Nam';
            document.getElementById('lop').value = student.lop || '';
            document.getElementById('khoa').value = student.khoa || '';
            document.getElementById('sdt').value = student.soDienThoai || '';
            document.getElementById('email').value = student.email || '';
            
            document.getElementById('modalTitle').textContent = 'Sửa thông tin sinh viên';
            openModal('studentModal');
        }
    } catch (error) {
        showToast('Không thể tải thông tin sinh viên', 'danger');
    }
}

async function openViewModal(id) {
    try {
        const response = await window.api.get(`/students/${id}`);
        if (response && response.success) {
            const student = response.data;
            const content = document.getElementById('viewContent');
            content.innerHTML = `
                <tr><th style="width:120px">Mã SV:</th><td>${student.maSinhVien || ''}</td></tr>
                <tr><th>Họ tên:</th><td>${student.hoTen || ''}</td></tr>
                <tr><th>Ngày sinh:</th><td>${formatDate(student.ngaySinh)}</td></tr>
                <tr><th>Giới tính:</th><td>${student.gioiTinh || ''}</td></tr>
                <tr><th>Lớp:</th><td>${student.lop || ''}</td></tr>
                <tr><th>Khoa:</th><td>${student.khoa || ''}</td></tr>
                <tr><th>SĐT:</th><td>${student.soDienThoai || ''}</td></tr>
                <tr><th>Email:</th><td>${student.email || ''}</td></tr>
            `;
            openModal('viewModal');
        }
    } catch (error) {
        showToast('Không thể tải thông tin sinh viên', 'danger');
    }
}

async function saveStudent() {
    const form = document.getElementById('studentForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const id = document.getElementById('studentId').value;
    const data = {
        maSinhVien: document.getElementById('maSV').value,
        hoTen: document.getElementById('hoTen').value,
        ngaySinh: document.getElementById('ngaySinh').value,
        gioiTinh: document.getElementById('gioiTinh').value,
        lop: document.getElementById('lop').value,
        khoa: document.getElementById('khoa').value,
        soDienThoai: document.getElementById('sdt').value,
        email: document.getElementById('email').value
    };

    try {
        let response;
        if (id) {
            response = await window.api.put(`/students/${id}`, data);
        } else {
            response = await window.api.post('/students', data);
        }

        if (response && response.success) {
            showToast(id ? 'Cập nhật thành công!' : 'Thêm mới thành công!', 'success');
            closeModal('studentModal');
            loadStudents(document.getElementById('searchInput').value);
        } else {
            showToast(response.message || 'Có lỗi xảy ra', 'danger');
        }
    } catch (error) {
        showToast('Lỗi khi lưu dữ liệu', 'danger');
    }
}

function deleteStudent(id) {
    showConfirm({
        title: 'Xóa sinh viên',
        message: 'Bạn có chắc chắn muốn xóa sinh viên này? Hành động này không thể hoàn tác.',
        confirmText: 'Xóa',
        onConfirm: async () => {
            try {
                const response = await window.api.delete(`/students/${id}`);
                if (response && response.success) {
                    showToast('Đã xóa sinh viên', 'success');
                    loadStudents(document.getElementById('searchInput').value);
                } else {
                    showToast('Không thể xóa sinh viên', 'danger');
                }
            } catch (error) {
                showToast('Lỗi khi xóa dữ liệu', 'danger');
            }
        }
    });
}
