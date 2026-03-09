// 帝国时代4快捷键映射
const keyMappings = {
    // 时代I 建筑 (按Q进入)
    'Q-Q': '房子',
    'Q-S': '兵营',
    'Q-W': '磨坊',
    'Q-D': '码头',
    'Q-E': '伐木场',
    'Q-Z': '哨站',
    'Q-R': '采矿场',
    'Q-X': '木栅栏墙',
    'Q-A': '农田',
    'Q-C': '木栅栏门',
    
    // 时代II 建筑 (按W进入)
    'W-Q': '铁匠铺',
    'W-S': '马厩',
    'W-W': '市场',
    'W-Z': '石塔',
    'W-E': '城镇中心',
    'W-X': '石墙',
    'W-A': '射手场',
    'W-C': '石门',
    
    // 时代III 建筑 (按E进入)
    'E-Q': '修道院',
    'E-A': '攻城器械厂',
    'E-Z': '堡垒',
    
    // 时代IV 建筑 (按R进入)
    'R-Q': '大学'
};

// 建筑图片URL映射
const buildingImages = {
    // 时代I 建筑
    'Q-Q': 'https://data.aoe4world.com/images/buildings/house-1.png',
    'Q-S': 'https://data.aoe4world.com/images/buildings/barracks-1.png',
    'Q-W': 'https://data.aoe4world.com/images/buildings/mill-1.png',
    'Q-D': 'https://data.aoe4world.com/images/buildings/dock-1.png',
    'Q-E': 'https://data.aoe4world.com/images/buildings/lumber-camp-1.png',
    'Q-Z': 'https://data.aoe4world.com/images/buildings/outpost-1.png',
    'Q-R': 'https://data.aoe4world.com/images/buildings/mining-camp-1.png',
    'Q-X': 'https://data.aoe4world.com/images/buildings/palisade-1.png',
    'Q-A': 'https://data.aoe4world.com/images/buildings/farm-1.png',
    'Q-C': 'https://data.aoe4world.com/images/buildings/palisade-gate-1.png',
    
    // 时代II 建筑
    'W-Q': 'https://data.aoe4world.com/images/buildings/blacksmith-2.png',
    'W-S': 'https://data.aoe4world.com/images/buildings/stable-1.png',
    'W-W': 'https://data.aoe4world.com/images/buildings/market-2.png',
    'W-Z': 'https://data.aoe4world.com/images/buildings/stone-wall-tower-2.png',
    'W-E': 'https://data.aoe4world.com/images/buildings/town-center-1.png',
    'W-X': 'https://data.aoe4world.com/images/buildings/stone-wall-2.png',
    'W-A': 'https://data.aoe4world.com/images/buildings/archery-range-2.png',
    'W-C': 'https://data.aoe4world.com/images/buildings/stone-wall-gate-2.png',
    
    // 时代III 建筑
    'E-Q': 'https://data.aoe4world.com/images/buildings/monastery-3.png',
    'E-A': 'https://data.aoe4world.com/images/buildings/siege-workshop-3.png',
    'E-Z': 'https://data.aoe4world.com/images/buildings/keep-3.png',
    
    // 时代IV 建筑
    'R-Q': 'https://data.aoe4world.com/images/buildings/university-4.png'
};

// 游戏状态
let gameState = {
    isPlaying: false,
    currentKey: null,
    currentAge: null,
    firstKey: null,
    correct: 0,
    wrong: 0,
    time: 0,
    timer: null,
    difficulty: 'easy',
    totalCount: 0,
    currentCount: 0
};

// DOM元素 - 模式选择
let modeElements;

// DOM元素 - 学习模式
let learnElements;

// DOM元素 - 训练模式
let trainElements;

// 当前活动的元素集合
let activeElements;

// 初始化函数
function initKeyboardDisplay() {
    // 不再需要初始化键盘显示
}

// 生成随机快捷键
function generateRandomKey() {
    // 获取选中的建筑
    const selectedBuildings = getSelectedBuildings();
    
    // 如果没有选中任何建筑，默认选择所有建筑
    if (selectedBuildings.length === 0) {
        // 获取选中的时代
        const selectedAges = [];
        if (activeElements.ageQ.checked) selectedAges.push('Q');
        if (activeElements.ageW.checked) selectedAges.push('W');
        if (activeElements.ageE.checked) selectedAges.push('E');
        if (activeElements.ageR.checked) selectedAges.push('R');
        
        // 如果没有选中任何时代，默认选择所有时代
        if (selectedAges.length === 0) {
            return Object.keys(keyMappings)[Math.floor(Math.random() * Object.keys(keyMappings).length)];
        } else {
            const filteredKeys = Object.keys(keyMappings).filter(key => {
                const age = key.split('-')[0];
                return selectedAges.includes(age);
            });
            return filteredKeys[Math.floor(Math.random() * filteredKeys.length)];
        }
    } else {
        return selectedBuildings[Math.floor(Math.random() * selectedBuildings.length)];
    }
}

// 获取选中的建筑
function getSelectedBuildings() {
    const selectedBuildings = [];
    const isLearnMode = modeElements.learnMode.style.display === 'block';
    const prefix = isLearnMode ? 'build-' : 'train-build-';
    
    Object.keys(keyMappings).forEach(key => {
        const checkbox = document.getElementById(`${prefix}${key}`);
        if (checkbox && checkbox.checked) {
            selectedBuildings.push(key);
        }
    });
    
    return selectedBuildings;
}

// 全选按钮功能
function setupSelectAllButtons() {
    // 学习模式和训练模式全选按钮
    document.querySelectorAll('.select-all-btn').forEach(button => {
        button.addEventListener('click', function() {
            const age = this.getAttribute('data-age').replace('train-', '');
            const isTrainMode = this.getAttribute('data-age').startsWith('train-');
            const prefix = isTrainMode ? 'train-build-' : 'build-';
            
            // 检查当前时代是否所有建筑都已选中
            const checkboxes = document.querySelectorAll(`[id^="${prefix}${age}-"]`);
            let allChecked = true;
            checkboxes.forEach(checkbox => {
                if (!checkbox.checked) {
                    allChecked = false;
                }
            });
            
            // 切换全选/取消全选状态
            checkboxes.forEach(checkbox => {
                checkbox.checked = !allChecked;
            });
        });
    });
}

// 选好了按钮功能
function setupConfirmButtons() {
    // 学习模式选好了按钮
    document.getElementById('confirm-selection-btn').addEventListener('click', function() {
        // 可以添加一些确认逻辑
        alert('建筑选择已确认！');
    });
    
    // 训练模式选好了按钮
    document.getElementById('train-confirm-selection-btn').addEventListener('click', function() {
        // 可以添加一些确认逻辑
        alert('建筑选择已确认！');
    });
}

// 更新目标显示
function updateTarget() {
    gameState.currentKey = generateRandomKey();
    const [ageKey, funcKey] = gameState.currentKey.split('-');
    gameState.currentAge = ageKey;
    
    let ageName = '';
    switch(ageKey) {
        case 'Q': ageName = '时代I'; break;
        case 'W': ageName = '时代II'; break;
        case 'E': ageName = '时代III'; break;
        case 'R': ageName = '时代IV'; break;
    }
    
    // 获取建筑图片URL
    const buildingImage = buildingImages[gameState.currentKey];
    const buildingName = keyMappings[gameState.currentKey];
    
    // 检查当前是学习模式还是训练模式
    const isLearnMode = modeElements.learnMode.style.display === 'block';
    
    if (isLearnMode) {
        // 学习模式：显示完整的快捷键提示和图片
        activeElements.target.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; gap: 20px;">
                <img src="${buildingImage}" alt="${buildingName}" style="width: 100px; height: 100px;">
                <div style="text-align: left;">
                    <div>${ageName} (${ageKey}) → ${funcKey}</div>
                    <div style="font-size: 32px; font-weight: bold;">${buildingName}</div>
                </div>
            </div>
        `;
    } else {
        // 训练模式：只显示建筑名称和图片
        activeElements.target.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; gap: 20px;">
                <img src="${buildingImage}" alt="${buildingName}" style="width: 120px; height: 120px;">
                <div style="font-size: 36px; font-weight: bold;">${buildingName}</div>
            </div>
        `;
    }
}

// 处理键盘按下
function handleKeyDown(e) {
    if (!gameState.isPlaying) return;
    
    const pressedKey = e.key.toUpperCase();
    
    if (!gameState.firstKey) {
        // 第一次按键（时代键）
        if (pressedKey === gameState.currentAge) {
            gameState.firstKey = pressedKey;
            activeElements.feedback.textContent = `时代键正确: ${pressedKey}`;
            activeElements.feedback.className = 'feedback correct';
        } else {
            activeElements.feedback.textContent = `时代键错误，应为: ${gameState.currentAge}`;
            activeElements.feedback.className = 'feedback wrong';
            gameState.wrong++;
            activeElements.wrong.textContent = gameState.wrong;
            
            setTimeout(() => {
                activeElements.feedback.textContent = '';
                activeElements.feedback.className = 'feedback';
            }, 1000);
        }
    } else {
        // 第二次按键（功能键）
        const fullKey = `${gameState.firstKey}-${pressedKey}`;
        
        if (fullKey === gameState.currentKey) {
            activeElements.feedback.textContent = '完全正确!';
            activeElements.feedback.className = 'feedback correct';
            gameState.correct++;
            activeElements.correct.textContent = gameState.correct;
            gameState.currentCount++;
            activeElements.progress.textContent = gameState.currentCount;
            gameState.firstKey = null;
            
            // 检查是否达到训练次数
            if (gameState.currentCount >= gameState.totalCount) {
                activeElements.feedback.textContent = `训练完成! 共${gameState.totalCount}次，正确${gameState.correct}次，错误${gameState.wrong}次`;
                activeElements.feedback.className = 'feedback correct';
                setTimeout(() => {
                    resetGame();
                }, 2000);
            } else {
                updateTarget();
            }
        } else {
            activeElements.feedback.textContent = '功能键错误!';
            activeElements.feedback.className = 'feedback wrong';
            gameState.wrong++;
            activeElements.wrong.textContent = gameState.wrong;
            gameState.firstKey = null;
        }
        
        setTimeout(() => {
            activeElements.feedback.textContent = '';
            activeElements.feedback.className = 'feedback';
        }, 1000);
    }
}

// 开始游戏
function startGame() {
    gameState.isPlaying = true;
    gameState.difficulty = activeElements.difficulty.value;
    gameState.totalCount = parseInt(activeElements.trainingCount.value) || 10;
    gameState.currentCount = 0;
    
    activeElements.startBtn.disabled = true;
    activeElements.pauseBtn.disabled = false;
    activeElements.resetBtn.disabled = false;
    activeElements.difficulty.disabled = true;
    activeElements.ageQ.disabled = true;
    activeElements.ageW.disabled = true;
    activeElements.ageE.disabled = true;
    activeElements.ageR.disabled = true;
    activeElements.trainingCount.disabled = true;
    
    // 更新训练次数显示
    activeElements.totalCount.textContent = gameState.totalCount;
    activeElements.progress.textContent = '0';
    
    updateTarget();
    
    gameState.timer = setInterval(() => {
        gameState.time++;
        activeElements.time.textContent = gameState.time;
    }, 1000);
}

// 暂停游戏
function pauseGame() {
    gameState.isPlaying = false;
    
    activeElements.startBtn.disabled = false;
    activeElements.pauseBtn.disabled = true;
    activeElements.resetBtn.disabled = false;
    activeElements.difficulty.disabled = false;
    activeElements.ageQ.disabled = false;
    activeElements.ageW.disabled = false;
    activeElements.ageE.disabled = false;
    activeElements.ageR.disabled = false;
    activeElements.trainingCount.disabled = false;
    
    clearInterval(gameState.timer);
}

// 重置游戏
function resetGame() {
    gameState.isPlaying = false;
    gameState.currentKey = null;
    gameState.currentAge = null;
    gameState.firstKey = null;
    gameState.correct = 0;
    gameState.wrong = 0;
    gameState.time = 0;
    gameState.totalCount = 0;
    gameState.currentCount = 0;
    
    clearInterval(gameState.timer);
    
    activeElements.startBtn.disabled = false;
    activeElements.pauseBtn.disabled = true;
    activeElements.resetBtn.disabled = true;
    activeElements.difficulty.disabled = false;
    activeElements.ageQ.disabled = false;
    activeElements.ageW.disabled = false;
    activeElements.ageE.disabled = false;
    activeElements.ageR.disabled = false;
    activeElements.trainingCount.disabled = false;
    
    activeElements.target.textContent = '';
    activeElements.feedback.textContent = '';
    activeElements.feedback.className = 'feedback';
    activeElements.correct.textContent = '0';
    activeElements.wrong.textContent = '0';
    activeElements.time.textContent = '0';
}

// 事件监听器
function setupEventListeners() {
    // 模式切换
    modeElements.learnBtn.addEventListener('click', () => {
        modeElements.learnMode.style.display = 'block';
        modeElements.trainMode.style.display = 'none';
        activeElements = learnElements;
    });
    
    modeElements.trainBtn.addEventListener('click', () => {
        modeElements.learnMode.style.display = 'none';
        modeElements.trainMode.style.display = 'block';
        activeElements = trainElements;
    });
    
    // 学习模式控制
    learnElements.startBtn.addEventListener('click', startGame);
    learnElements.pauseBtn.addEventListener('click', pauseGame);
    learnElements.resetBtn.addEventListener('click', resetGame);
    
    // 训练模式控制
    trainElements.startBtn.addEventListener('click', startGame);
    trainElements.pauseBtn.addEventListener('click', pauseGame);
    trainElements.resetBtn.addEventListener('click', resetGame);
    
    // 训练模式时代选择事件
    document.getElementById('train-age-Q').addEventListener('change', function() {
        document.getElementById('train-age-Q-buildings').style.display = this.checked ? 'block' : 'none';
    });
    
    document.getElementById('train-age-W').addEventListener('change', function() {
        document.getElementById('train-age-W-buildings').style.display = this.checked ? 'block' : 'none';
    });
    
    document.getElementById('train-age-E').addEventListener('change', function() {
        document.getElementById('train-age-E-buildings').style.display = this.checked ? 'block' : 'none';
    });
    
    document.getElementById('train-age-R').addEventListener('change', function() {
        document.getElementById('train-age-R-buildings').style.display = this.checked ? 'block' : 'none';
    });
    
    // 键盘事件
    document.addEventListener('keydown', handleKeyDown);
}

// 初始化
function init() {
    // 在DOM加载完成后初始化元素
    modeElements = {
        learnBtn: document.getElementById('learn-btn'),
        trainBtn: document.getElementById('train-btn'),
        learnMode: document.getElementById('learn-mode'),
        trainMode: document.getElementById('train-mode')
    };
    
    // 学习模式元素
    learnElements = {
        startBtn: document.getElementById('start-btn'),
        pauseBtn: document.getElementById('pause-btn'),
        resetBtn: document.getElementById('reset-btn'),
        difficulty: document.getElementById('difficulty'),
        ageQ: document.getElementById('age-Q'),
        ageW: document.getElementById('age-W'),
        ageE: document.getElementById('age-E'),
        ageR: document.getElementById('age-R'),
        trainingCount: document.getElementById('training-count'),
        target: document.getElementById('target'),
        feedback: document.getElementById('feedback'),
        correct: document.getElementById('correct'),
        wrong: document.getElementById('wrong'),
        time: document.getElementById('time'),
        progress: document.getElementById('progress'),
        totalCount: document.getElementById('total-count')
    };
    
    // 训练模式元素
    trainElements = {
        startBtn: document.getElementById('train-start-btn'),
        pauseBtn: document.getElementById('train-pause-btn'),
        resetBtn: document.getElementById('train-reset-btn'),
        difficulty: document.getElementById('train-difficulty'),
        ageQ: document.getElementById('train-age-Q'),
        ageW: document.getElementById('train-age-W'),
        ageE: document.getElementById('train-age-E'),
        ageR: document.getElementById('train-age-R'),
        trainingCount: document.getElementById('train-training-count'),
        target: document.getElementById('train-target'),
        feedback: document.getElementById('train-feedback'),
        correct: document.getElementById('train-correct'),
        wrong: document.getElementById('train-wrong'),
        time: document.getElementById('train-time'),
        progress: document.getElementById('train-progress'),
        totalCount: document.getElementById('train-total-count')
    };
    
    // 默认激活学习模式
    activeElements = learnElements;
    
    initKeyboardDisplay();
    setupEventListeners();
    setupSelectAllButtons();
    setupConfirmButtons();
}

// 启动应用
window.addEventListener('DOMContentLoaded', init);