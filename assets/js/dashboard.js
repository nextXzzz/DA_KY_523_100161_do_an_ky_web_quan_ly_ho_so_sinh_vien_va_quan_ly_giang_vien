document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await window.api.get('/dashboard/stats');
        
        if (response && response.success) {
            document.getElementById('totalStudents').textContent = response.data.totalStudents || 0;
            document.getElementById('totalLecturers').textContent = response.data.totalLecturers || 0;
        }
    } catch (error) {
        console.error('Failed to load dashboard stats', error);
        document.getElementById('totalStudents').textContent = 'Lỗi';
        document.getElementById('totalLecturers').textContent = 'Lỗi';
    }
});
