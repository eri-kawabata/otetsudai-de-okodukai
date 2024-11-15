let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();

function updateCalendarHeader() {
    const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    document.getElementById('current-month').textContent = `${currentYear}年 ${monthNames[currentMonth]}`;
}

function generateCalendar(year = currentYear, month = currentMonth) {
    const calendar = document.getElementById('calendar');
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    // カレンダーをクリア
    calendar.innerHTML = '';

    // 空白セルを追加
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.classList.add('calendar-cell');
        calendar.appendChild(emptyCell);
    }

    // 日付セルを追加
    for (let date = 1; date <= lastDate; date++) {
        const cell = document.createElement('div');
        cell.classList.add('calendar-cell');
        cell.textContent = date;

        // 今日の日付をハイライト
        const today = new Date();
        if (
            date === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {
            cell.classList.add('today');
        }

        // 日付クリックイベント
        cell.addEventListener('click', () => selectDate(date, year, month));
        calendar.appendChild(cell);
    }

    updateCalendarHeader();
}

function selectDate(date, year, month) {
    const allCells = document.querySelectorAll('.calendar-cell');
    allCells.forEach(cell => cell.classList.remove('active'));

    const selectedCell = [...allCells].find(cell => cell.textContent == date);
    if (!selectedCell) return;

    selectedCell.classList.add('active');

    const formattedDate = formatDateToYYYYMMDD(year, month + 1, date);
    document.getElementById('selected-date').textContent = `選択された日付: ${formattedDate}`;
    displayTasksForDate(formattedDate);
}

document.getElementById('prev-month').addEventListener('click', () => {
    if (currentMonth === 0) {
        currentMonth = 11;
        currentYear--;
    } else {
        currentMonth--;
    }
    generateCalendar(currentYear, currentMonth);
});

document.getElementById('next-month').addEventListener('click', () => {
    if (currentMonth === 11) {
        currentMonth = 0;
        currentYear++;
    } else {
        currentMonth++;
    }
    generateCalendar(currentYear, currentMonth);
});

const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const stars = [];

for (let i = 0; i < 150; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        speed: Math.random() * 0.5 + 0.1,
    });
}

function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.shadowBlur = 5;
    ctx.shadowColor = 'white';

    stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();

        star.y += star.speed;

        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
    });

    requestAnimationFrame(drawStars);
}

drawStars();

window.onload = () => generateCalendar();
