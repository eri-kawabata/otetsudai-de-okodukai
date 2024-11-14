function toggleMenu() {
    const sideMenu = document.getElementById("sideMenu");
    sideMenu.classList.toggle("open"); // メニューの開閉を切り替え
}

// タスクの内容に応じてアイコンの画像を表示する
function getTaskIcon(taskName) {
    if (taskName === "掃除") return './image/souji.png';
    if (taskName === "料理") return './image/ryori.png';
    if (taskName === "片付け") return './image/kataduke.png';
    if (taskName === "洗濯") return './image/sentaku.png';
    if (taskName === "買い物") return './image/kaimono.png';
    return './image/default.png'; // それ以外のタスクの場合はデフォルトのアイコンを表示,今後のため一応設定
}

// 全体の変数を設定
let tasks = [];  // 「未完了」のタスクリスト
let completedTasks = [];  // 「完了した」タスクリスト
let totalEarnings = 0;  // 合計のおこづかい

// 新しいタスクを追加する関数
function addTask() {
    // 「お手伝いの内容」と「おこづかい金額」を取得
    const taskName = document.getElementById('task-name').value;
    const taskReward = parseInt(document.getElementById('task-reward').value);

    // もし内容と金額が正しく入力されていれば、タスクリストに追加します
    if (taskName && !isNaN(taskReward)) {
        const task = { name: taskName, reward: taskReward };  // 新しいタスクをオブジェクトとして作成
        tasks.push(task); // タスクリストに追加
        saveData();  // 追加後のデータを保存（次回のページ読み込みでも表示されるように）

        updateTaskList();  // 画面のタスクリストを更新
        document.getElementById('task-name').value = ''; // 入力フィールドをクリア（次の入力のため）
        document.getElementById('task-reward').value = ''; // 報酬フィールドもクリア
    } else {
        // 内容と金額が正しく入力されていない場合は、メッセージを表示
        alert('お手伝いの内容とおこづかいをちゃんといれてね！');
    }
}

// 「未完了のタスクリスト」を画面に表示する関数
function updateTaskList() {
    const taskList = document.getElementById('task-list'); // タスクリスト表示エリアを取得
    taskList.innerHTML = ''; // 現在のリストをクリア

    // 各タスクに対してカードを作成して画面に表示
    tasks.forEach((task, index) => {
        const taskCard = document.createElement('div');
        taskCard.classList.add('task-card');
        const iconSrc = getTaskIcon(task.name);  // タスク名に対応するアイコンを取得
        taskCard.innerHTML = `
            <img src="${iconSrc}" alt="${task.name} icon" class="task-icon">
            <span>${task.name} - ${task.reward}円</span>
            <span class="complete-btn" onclick="completeTask(${index})">
                <img src="./image/check.png" alt="完了" class="task-icon"> おわった！
            </span>
        `;
        taskList.appendChild(taskCard);  // タスクリストにカードを追加
    });
}

// タスクを完了リストに移動し、完了日を追加
function completeTask(index) {
    const task = tasks.splice(index, 1)[0];  // 未完了のタスクから削除
    const completionDate = new Date(); // 現在の日付を取得
    task.completedDate = completionDate.toLocaleDateString('ja-JP'); // 完了日を追加

    completedTasks.push(task);  // 完了済みタスクリストに追加
    totalEarnings += task.reward;   // 合計おこづかいを更新

    showCompletionMessage();  // 完了メッセージを表示
    saveData();  // データを保存
    updateTaskList();  // 未完了タスクリストを更新
    updateCompletedTaskList();  // 完了タスクリストを更新
    updateTotalEarnings();  // 合計おこづかい表示を更新
    updateAnnualEarnings();  // 年間おこづかいを更新
}

// 完了したタスクリストを画面に表示する関数
function updateCompletedTaskList() {
    const completedTaskList = document.getElementById('completed-task-list');
    completedTaskList.innerHTML = '';  // 表示エリアをクリア

    // 各完了タスクのカードを表示
    completedTasks.forEach(task => {
        const taskCard = document.createElement('div');
        taskCard.classList.add('completed-task-card');

        // タスク名のタイトルを追加
        const taskTitle = document.createElement('div');
        taskTitle.classList.add('completed-task-title');
        taskTitle.textContent = `${task.name}`;

        // 完了日とおこづかいの表示を追加
        const taskDetails = document.createElement('div');
        taskDetails.classList.add('completed-task-details');
        taskDetails.innerHTML = `
            <span>おわった日: ${task.completedDate || ''}</span>
            <span>おこづかい: ${task.reward}円</span>
        `;

        taskCard.appendChild(taskTitle);  // タスクタイトルをカードに追加
        taskCard.appendChild(taskDetails);  // 詳細をカードに追加
        completedTaskList.appendChild(taskCard);  // 完了済みタスクリストにカードを追加
    });
}

// 完了メッセージを表示する関数
function showCompletionMessage() {
    const message = document.getElementById('completion-message');
    message.style.display = 'flex'; // メッセージを表示

    // 1秒後に自動で非表示にする
    setTimeout(() => {
        message.style.display = 'none';
    }, 1000);
}

// データをローカルストレージに保存
function saveData() {
    localStorage.setItem('tasks', JSON.stringify(tasks));  // 未完了タスクを保存
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks)); // 完了タスクを保存
    localStorage.setItem('totalEarnings', totalEarnings);  // 合計おこづかいを保存
}

// データをローカルストレージから読み込む
function loadData() {
    const savedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const savedCompletedTasks = JSON.parse(localStorage.getItem('completedTasks') || '[]');
    const savedTotalEarnings = parseInt(localStorage.getItem('totalEarnings') || '0');

    tasks = savedTasks;  // 未完了タスクリストを復元
    completedTasks = savedCompletedTasks.map(task => {
        // 完了日がない場合は現在の日付を設定
        if (!task.completedDate) {
            task.completedDate = new Date().toLocaleDateString('ja-JP');
        }
        return task;
    });
    totalEarnings = savedTotalEarnings;  // 合計おこづかいを復元

    updateTaskList();  // 未完了タスクリストを更新
    updateCompletedTaskList();  // 完了済みタスクリストを更新
    updateTotalEarnings();  // 合計おこづかいを更新
    updateAnnualEarnings();  // 年間おこづかいを更新
}

// 合計おこづかいを更新
function updateTotalEarnings() {
    document.getElementById('total-earnings').textContent = totalEarnings;
}

// 年間おこづかいの合計を更新
function updateAnnualEarnings() {
    document.getElementById('annual-earnings').textContent = totalEarnings;
}

// 現在の月を表示
function displayCurrentMonth() {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    document.getElementById('current-month').textContent = `${year}年${month}月`;
}

// ページ読み込み時にデータを読み込み、月を表示
window.onload = () => {
    loadData();
    displayCurrentMonth();
};

// テーマを変更する関数
function changeTheme() {
    const theme = document.getElementById('theme').value;
    document.body.className = ''; // 現在のテーマクラスをリセット
    document.body.classList.add(`${theme}-theme`); // 新しいテーマクラスを追加

    // ローカルストレージにテーマを保存
    localStorage.setItem('selectedTheme', theme);
}

// ページ読み込み時に保存されたテーマを適用
window.onload = () => {
    loadData();    // データを読み込み
    displayCurrentMonth();   // 現在の月を表示

    const savedTheme = localStorage.getItem('selectedTheme') || 'default';
    document.getElementById('theme').value = savedTheme;
    changeTheme();
};
