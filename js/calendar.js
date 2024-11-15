// 現在の年と月を取得
let currentYear = new Date().getFullYear();  // 現在の西暦年
let currentMonth = new Date().getMonth();  // 現在の月（0が1月、11が12月を表す）

// カレンダーのヘッダーを更新する関数
function updateCalendarHeader() {
    const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];// 月の名前を日本語で配列に
    document.getElementById('current-month').textContent = `${currentYear}年 ${monthNames[currentMonth]}`;// 年と月を設定
}

// カレンダーを生成する関数
function generateCalendar(year = currentYear, month = currentMonth) {
    const calendar = document.getElementById('calendar');  // カレンダーを表示する要素を取得
    const firstDay = new Date(year, month, 1).getDay();  // 月の最初の日の曜日（0が日曜日）
    const lastDate = new Date(year, month + 1, 0).getDate();  // 月の最後の日の番号

    // カレンダーをクリア
    calendar.innerHTML = '';

 // 月の最初の曜日まで空白のセルを追加
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');  // 空白のセルを作成
        emptyCell.classList.add('calendar-cell');  // スタイルを適用
        calendar.appendChild(emptyCell);  // カレンダーに追加
    }

    // 日付セルを追加
    for (let date = 1; date <= lastDate; date++) {
        const cell = document.createElement('div');  // 日付のセルを作成
        cell.classList.add('calendar-cell');  // スタイルを適用
        cell.textContent = date;  // 日付を表示

        // 今日の日付をハイライト（強調表示）
        const today = new Date();
        if (
            date === today.getDate() &&  // 今日の日付と一致
            month === today.getMonth() &&  // 今月と一致
            year === today.getFullYear()  // 今年と一致
        ) {
            cell.classList.add('today');  // 特別なスタイルを適用
        }

        // セルがクリックされた時の処理
        cell.addEventListener('click', () => selectDate(date, year, month));
        calendar.appendChild(cell);  // カレンダーにセルを追加
    }

    // カレンダーのヘッダーを更新
    updateCalendarHeader();
}

// 日付を選択した時の処理
function selectDate(date, year, month) {
    const allCells = document.querySelectorAll('.calendar-cell');  // 全てのセルを取得
    allCells.forEach(cell => cell.classList.remove('active'));  // 他のセルから選択状態を解除

    // 選択された日付のセルを探して特別なスタイルを適用
    const selectedCell = [...allCells].find(cell => cell.textContent == date);  // 対象のセルを見つける
    if (!selectedCell) return;  // 見つからなければ終了

    selectedCell.classList.add('active');  // 選択状態のスタイルを追加

    // 選択された日付をフォーマットして表示
    const formattedDate = formatDateToYYYYMMDD(year, month + 1, date);  // 年月日をフォーマット
    document.getElementById('selected-date').textContent = `選択された日付: ${formattedDate}`;  // 日付を表示
    displayTasksForDate(formattedDate);  // 選択された日付のタスクを表示
}

// 前月ボタンのクリックイベント
document.getElementById('prev-month').addEventListener('click', () => {
    if (currentMonth === 0) {  // 1月の場合
        currentMonth = 11;  // 前月は12月
        currentYear--;  // 年を1年戻す
    } else {
        currentMonth--;  // 前月に移動
    }
    generateCalendar(currentYear, currentMonth);  // カレンダーを更新
});

// 次月ボタンのクリックイベント
document.getElementById('next-month').addEventListener('click', () => {
    if (currentMonth === 11) {  // 12月の場合
        currentMonth = 0;  // 次月は1月
        currentYear++;  // 年を1年進める
    } else {
        currentMonth++;  // 次月に移動
    }
    generateCalendar(currentYear, currentMonth);  // カレンダーを更新
});

// 星のアニメーションを描画するキャンバスの準備
const canvas = document.getElementById('starfield');  // キャンバス要素を取得
const ctx = canvas.getContext('2d');  // 2D描画コンテキストを取得

canvas.width = window.innerWidth;  // キャンバスの横幅を画面全体に
canvas.height = window.innerHeight;  // キャンバスの高さを画面全体に

// 星の情報を格納する配列
const stars = [];

// 星をランダムに生成
for (let i = 0; i < 150; i++) {
    stars.push({
        x: Math.random() * canvas.width,  // ランダムなX座標
        y: Math.random() * canvas.height,  // ランダムなY座標
        radius: Math.random() * 1.5,  // ランダムな半径（サイズ）
        speed: Math.random() * 0.5 + 0.1,  // ランダムな速度
    });
}

// 星を描画する関数
function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // キャンバスをクリア
    ctx.fillStyle = 'white';  // 星の色を白に設定
    ctx.shadowBlur = 5;  // 星にぼかし効果を追加
    ctx.shadowColor = 'white';  // ぼかし効果の色を白に設定

    stars.forEach(star => {
        ctx.beginPath();  // 新しい描画パスを開始
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);  // 円（星）を描画
        ctx.fill();  // 塗りつぶし

        star.y += star.speed;  // 星を下方向に移動

        // 星が画面外に出たら、上部に戻してランダムな位置に
        if (star.y > canvas.height) {
            star.y = 0;  // Y座標を画面上部に
            star.x = Math.random() * canvas.width;  // X座標をランダムに
        }
    });

    requestAnimationFrame(drawStars);  // 次のフレームで再描画
}

// 星のアニメーションを開始
drawStars();

// ページが読み込まれたらカレンダーを生成
window.onload = () => generateCalendar();
