// ========== SIDEBAR TOGGLE UNTUK HP ==========
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    
    sidebar.classList.toggle('open');
    overlay.classList.toggle('show');
    
    if (sidebar.classList.contains('open')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

function closeSidebarOnMobile() {
    if (window.innerWidth <= 768) {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        sidebar.classList.remove('open');
        overlay.classList.remove('show');
        document.body.style.overflow = '';
    }
}

window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        sidebar.classList.remove('open');
        overlay.classList.remove('show');
        document.body.style.overflow = '';
    }
});

// ========== DATA ==========
let dataSurat = JSON.parse(localStorage.getItem('suratData')) || [];

// ========== FUNGSI MENU (PERBAIKAN UTAMA) ==========
function showMenu(id) {
    // Sembunyikan SEMUA menu
    const allMenus = document.querySelectorAll('.menu');
    allMenus.forEach(menu => {
        menu.classList.remove('active');
        menu.style.display = 'none'; // tambahan biar pasti
    });
    
    // Tampilkan menu yang dipilih
    const selectedMenu = document.getElementById(id);
    if (selectedMenu) {
        selectedMenu.classList.add('active');
        selectedMenu.style.display = 'block';
    }
    
    // Refresh data jika perlu
    if (id === 'rekapMenu') {
        loadRekap();
    }
    if (id === 'dataMenu') {
        loadData();
    }
}

// ========== SIMPAN DATA ==========
const form = document.getElementById('formSurat');
if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let data = {
            id: Date.now(),
            nama: document.getElementById('nama').value.trim(),
            kelas: document.getElementById('kelas').value.trim(),
            jenis: document.getElementById('jenis').value,
            tanggal: document.getElementById('tanggal').value,
            keterangan: document.getElementById('keterangan').value.trim(),
            guru: document.getElementById('guru').value.trim()
        };
        
        if (!data.nama || !data.kelas || !data.tanggal) {
            alert('Nama, Kelas, dan Tanggal wajib diisi!');
            return;
        }
        
        dataSurat.push(data);
        localStorage.setItem('suratData', JSON.stringify(dataSurat));
        loadData();
        resetForm();
        alert('Data berhasil disimpan');
    });
}

function resetForm() {
    document.getElementById('nama').value = '';
    document.getElementById('kelas').value = '';
    document.getElementById('jenis').value = 'Izin';
    document.getElementById('tanggal').value = '';
    document.getElementById('keterangan').value = '';
    document.getElementById('guru').value = '';
    updatePreview();
}

function updatePreview() {
    const pNama = document.getElementById('pNama');
    const pKelas = document.getElementById('pKelas');
    const pJenis = document.getElementById('pJenis');
    const pTanggal = document.getElementById('pTanggal');
    const pKeterangan = document.getElementById('pKeterangan');
    const pGuru = document.getElementById('pGuru');
    
    if (pNama) pNama.innerText = document.getElementById('nama').value || '-';
    if (pKelas) pKelas.innerText = document.getElementById('kelas').value || '-';
    if (pJenis) pJenis.innerText = document.getElementById('jenis').value;
    if (pTanggal) pTanggal.innerText = document.getElementById('tanggal').value || '-';
    if (pKeterangan) pKeterangan.innerText = document.getElementById('keterangan').value || '-';
    if (pGuru) pGuru.innerText = document.getElementById('guru').value || '-';
}

function cetakSurat() {
    updatePreview();
    window.print();
}

// ========== LOAD DATA SURAT ==========
function loadData() {
    const tbody = document.getElementById('dataTable');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (dataSurat.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center">Belum ada data surat</td></tr>';
        return;
    }
    
    // Urutkan berdasarkan tanggal ascending
    let sortedData = [...dataSurat].sort((a, b) => {
        if (a.tanggal && b.tanggal) {
            return a.tanggal.localeCompare(b.tanggal);
        }
        return a.id - b.id;
    });
    
    sortedData.forEach((item, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${escapeHtml(item.nama)}</td>
                <td>${escapeHtml(item.kelas)}</td>
                <td>${item.jenis}</td>
                <td>${item.tanggal}</td>
                <td>${escapeHtml(item.keterangan || '-')}</td>
                <td>${escapeHtml(item.guru || '-')}</td>
                <td><button class="hapus-btn" onclick="hapusData(${item.id})">Hapus</button></td>
            </tr>
        `;
    });
}

function hapusSemuaData() {
    if (confirm('⚠️ Yakin ingin menghapus SEMUA data surat? Tindakan ini tidak dapat dibatalkan!')) {
        dataSurat = [];
        localStorage.setItem('suratData', JSON.stringify(dataSurat));
        loadData();
        if (document.getElementById('rekapMenu') && document.getElementById('rekapMenu').classList.contains('active')) {
            loadRekap();
        }
        alert('Semua data telah dihapus');
    }
}

function hapusData(id) {
    if (confirm('Hapus data ini?')) {
        dataSurat = dataSurat.filter(item => item.id !== id);
        localStorage.setItem('suratData', JSON.stringify(dataSurat));
        loadData();
        if (document.getElementById('rekapMenu') && document.getElementById('rekapMenu').classList.contains('active')) {
            loadRekap();
        }
    }
}

function escapeHtml(str) {
    if (!str) return '-';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// ========== REKAP BULANAN ==========
function loadRekap() {
    let bulanTahun = document.getElementById('bulanRekap').value;
    if (!bulanTahun) {
        let now = new Date();
        let defaultMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        document.getElementById('bulanRekap').value = defaultMonth;
        bulanTahun = defaultMonth;
    }
    
    let [tahun, bulan] = bulanTahun.split('-');
    let filtered = dataSurat.filter(item => {
        if (!item.tanggal) return false;
        let tgl = item.tanggal.split('-');
        return tgl[0] == tahun && tgl[1] == bulan;
    });
    
    // Akumulasi per (nama + kelas) - CASE INSENSITIVE
    let mapRekap = new Map();
    filtered.forEach(item => {
        let namaLower = item.nama.toLowerCase();
        let key = `${namaLower}|${item.kelas}`;
        if (!mapRekap.has(key)) {
            mapRekap.set(key, {
                nama: item.nama,
                kelas: item.kelas,
                Izin: 0, Sakit: 0, Alpha: 0, Keluar: 0
            });
        }
        let rek = mapRekap.get(key);
        if (item.jenis === 'Izin') rek.Izin++;
        else if (item.jenis === 'Sakit') rek.Sakit++;
        else if (item.jenis === 'Alpha') rek.Alpha++;
        else if (item.jenis === 'Keluar') rek.Keluar++;
    });
    
    let rekapArray = Array.from(mapRekap.values());
    const tbody = document.getElementById('rekapTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    if (rekapArray.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center">Tidak ada data pada bulan ini</td></tr>';
        return;
    }
    
    rekapArray.forEach((item, idx) => {
        let total = item.Izin + item.Sakit + item.Alpha + item.Keluar;
        tbody.innerHTML += `
            <tr>
                <td>${idx+1}</td>
                <td>${escapeHtml(item.nama)}</td>
                <td>${escapeHtml(item.kelas)}</td>
                <td>${item.Izin}</td>
                <td>${item.Sakit}</td>
                <td>${item.Alpha}</td>
                <td>${item.Keluar}</td>
                <td><strong>${total}</strong></td>
            </tr>
        `;
    });
}

// ========== EXPORT ==========
function exportToExcel() {
    if (dataSurat.length === 0) {
        alert('Tidak ada data untuk diexport');
        return;
    }
    let rows = [['No', 'Nama', 'Kelas', 'Jenis', 'Tanggal', 'Keterangan', 'Guru']];
    dataSurat.forEach((item, i) => {
        rows.push([
            i+1, item.nama, item.kelas, item.jenis, item.tanggal, 
            item.keterangan || '-', item.guru || '-'
        ]);
    });
    let csv = rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    let blob = new Blob(["\uFEFF" + csv], {type: 'text/csv;charset=utf-8;'});
    let link = document.createElement('a');
    let url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', 'data_surat_madrasah.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function exportRekapToExcel() {
    let bulanTahun = document.getElementById('bulanRekap').value;
    if (!bulanTahun) {
        alert('Pilih bulan terlebih dahulu!');
        return;
    }
    let [tahun, bulan] = bulanTahun.split('-');
    let filtered = dataSurat.filter(item => {
        if (!item.tanggal) return false;
        let tgl = item.tanggal.split('-');
        return tgl[0] == tahun && tgl[1] == bulan;
    });
    
    let mapRekap = new Map();
    filtered.forEach(item => {
        let namaLower = item.nama.toLowerCase();
        let key = `${namaLower}|${item.kelas}`;
        if (!mapRekap.has(key)) {
            mapRekap.set(key, { nama: item.nama, kelas: item.kelas, Izin:0, Sakit:0, Alpha:0, Keluar:0 });
        }
        let rek = mapRekap.get(key);
        if (item.jenis === 'Izin') rek.Izin++;
        else if (item.jenis === 'Sakit') rek.Sakit++;
        else if (item.jenis === 'Alpha') rek.Alpha++;
        else if (item.jenis === 'Keluar') rek.Keluar++;
    });
    
    let rekapArray = Array.from(mapRekap.values());
    if (rekapArray.length === 0) {
        alert('Tidak ada data rekap untuk bulan ini');
        return;
    }
    let rows = [['No', 'Nama', 'Kelas', 'Izin', 'Sakit', 'Alpha', 'Keluar', 'Total']];
    rekapArray.forEach((item, idx) => {
        let total = item.Izin + item.Sakit + item.Alpha + item.Keluar;
        rows.push([idx+1, item.nama, item.kelas, item.Izin, item.Sakit, item.Alpha, item.Keluar, total]);
    });
    let csv = rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    let blob = new Blob(["\uFEFF" + csv], {type: 'text/csv;charset=utf-8;'});
    let link = document.createElement('a');
    let url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', `rekap_bulanan_${bulanTahun}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// ========== BACKUP & RESTORE ==========
function backupData() {
    let dataStr = JSON.stringify(dataSurat, null, 2);
    let blob = new Blob([dataStr], {type: 'application/json'});
    let link = document.createElement('a');
    let url = URL.createObjectURL(blob);
    link.href = url;
    let now = new Date();
    let filename = `backup_surat_${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}.json`;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function restoreData(input) {
    let file = input.files[0];
    if (!file) return;
    let reader = new FileReader();
    reader.onload = function(e) {
        try {
            let restored = JSON.parse(e.target.result);
            if (Array.isArray(restored)) {
                dataSurat = restored;
                localStorage.setItem('suratData', JSON.stringify(dataSurat));
                loadData();
                alert('Restore berhasil!');
                if (document.getElementById('rekapMenu') && document.getElementById('rekapMenu').classList.contains('active')) {
                    loadRekap();
                }
            } else {
                alert('File tidak valid');
            }
        } catch(err) {
            alert('Gagal membaca file backup');
        }
        input.value = '';
    };
    reader.readAsText(file);
}

// ========== INITIAL SETUP ==========
// Sembunyikan semua menu kecuali formMenu
document.addEventListener('DOMContentLoaded', function() {
    const allMenus = document.querySelectorAll('.menu');
    allMenus.forEach(menu => {
        menu.style.display = 'none';
        menu.classList.remove('active');
    });
    
    const formMenu = document.getElementById('formMenu');
    if (formMenu) {
        formMenu.style.display = 'block';
        formMenu.classList.add('active');
    }
    
    // Event listener untuk preview
    ['nama', 'kelas', 'jenis', 'tanggal', 'keterangan', 'guru'].forEach(id => {
        let el = document.getElementById(id);
        if (el) el.addEventListener('input', updatePreview);
    });
    
    loadData();
    updatePreview();
});