// 帝国时代4快捷键映射
const keyMappings = {
    // 时代I 建筑 (按Q进入)
    'Q-Q': '房屋',
    'Q-S': '兵营',
    'Q-W': '磨坊',
    'Q-D': '码头',
    'Q-E': '伐木场',
    'Q-Z': '哨站',
    'Q-R': '采矿场',
    'Q-X': '木栅栏',
    'Q-A': '农田',
    'Q-C': '木城门',
    
    // 时代II 建筑 (按W进入)
    'W-Q': '铁匠铺',
    'W-S': '马厩',
    'W-W': '市场',
    'W-Z': '石墙塔',
    'W-E': '城镇中心',
    'W-X': '石墙',
    'W-A': '靶场',
    'W-C': '石墙城门',
    
    // 时代III 建筑 (按E进入)
    'E-Q': '修道院',
    'E-A': '攻城武器厂',
    'E-Z': '城堡',
    
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
    currentCount: 0,
    wrongAnswers: [], // 错题本，格式: [{ timestamp: 时间, errors: { 'key': { count: 次数, building: 建筑名 } } }]
    currentWrongCount: 0, // 当前题目的连续错误次数
    currentTrainingSession: null // 当前训练会话的时间戳
};

// DOM元素 - 文明选择
let civElements;

// DOM元素 - 模式选择
let modeElements;

// DOM元素 - 学习模式
let learnElements;

// DOM元素 - 训练模式
let trainElements;

// 当前活动的元素集合
let activeElements;

// 当前选择的文明
let currentCiv = null;

// 初始化函数
function initKeyboardDisplay() {
    // 不再需要初始化键盘显示
}

// 生成随机快捷键
function generateRandomKey() {
    // 获取选中的建筑
    const selectedBuildings = getSelectedBuildings();
    
    // 如果没有选中任何建筑，默认选择所有可见的建筑
    if (selectedBuildings.length === 0) {
        // 获取所有可见的建筑
        const visibleBuildings = [];
        document.querySelectorAll(`.building-checkbox`).forEach(checkbox => {
            if (checkbox.style.display !== 'none') {
                const input = checkbox.querySelector('input[type="checkbox"]');
                if (input) {
                    visibleBuildings.push(input.value);
                }
            }
        });
        
        // 获取选中的时代
        const selectedAges = [];
        if (activeElements.ageQ.checked) selectedAges.push('Q');
        if (activeElements.ageW.checked) selectedAges.push('W');
        if (activeElements.ageE.checked) selectedAges.push('E');
        if (activeElements.ageR.checked) selectedAges.push('R');
        
        // 过滤出选中时代的建筑
        let filteredBuildings = visibleBuildings;
        if (selectedAges.length > 0) {
            filteredBuildings = visibleBuildings.filter(key => {
                const age = key.split('-')[0];
                return selectedAges.includes(age);
            });
        }
        
        // 如果没有符合条件的建筑，返回默认建筑
        if (filteredBuildings.length === 0) {
            return Object.keys(keyMappings)[Math.floor(Math.random() * Object.keys(keyMappings).length)];
        } else {
            return filteredBuildings[Math.floor(Math.random() * filteredBuildings.length)];
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
    
    // 只获取当前文明可见的建筑
    document.querySelectorAll(`.building-checkbox`).forEach(checkbox => {
        if (checkbox.style.display !== 'none') {
            const input = checkbox.querySelector('input[type="checkbox"]');
            if (input && input.checked) {
                selectedBuildings.push(input.value);
            }
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

// 结束训练按钮功能
function setupConfirmButtons() {
    // 学习模式结束训练按钮
    document.getElementById('confirm-selection-btn').addEventListener('click', function() {
        // 与重置按钮功能一样
        resetGame();
    });
    
    // 训练模式结束训练按钮
    document.getElementById('train-confirm-selection-btn').addEventListener('click', function() {
        // 与重置按钮功能一样
        resetGame();
    });
}

// 更新目标显示
function updateTarget() {
    gameState.currentKey = generateRandomKey();
    const [ageKey, funcKey] = gameState.currentKey.split('-');
    gameState.currentAge = ageKey;
    gameState.currentWrongCount = 0; // 重置当前题目的连续错误次数
    
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
    
    // 检查是否为错题及错误次数
    let wrongCount = 0;
    // 遍历所有训练会话，累计错误次数
    gameState.wrongAnswers.forEach(session => {
        if (session.errors[gameState.currentKey]) {
            wrongCount += session.errors[gameState.currentKey].count;
        }
    });
    
    // 根据错误次数确定高亮样式
    let highlightStyle = '';
    let warningText = '';
    if (wrongCount > 2) {
        highlightStyle = 'border: 3px solid #ff4444; border-radius: 10px; padding: 10px; background-color: rgba(255, 68, 68, 0.1);';
        warningText = `<div style="color: #ff4444; font-weight: bold; margin-top: 10px;">⚠️ 易错点</div>`;
    } else if (wrongCount > 0) {
        highlightStyle = 'border: 2px solid #ffaa00; border-radius: 8px; padding: 8px; background-color: rgba(255, 170, 0, 0.1);';
        warningText = `<div style="color: #ffaa00; font-weight: bold; margin-top: 8px;">⚠️ 注意</div>`;
    }
    
    // 检查当前是学习模式还是训练模式
    const isLearnMode = modeElements.learnMode.style.display === 'block';
    
    if (isLearnMode) {
        // 学习模式：显示完整的快捷键提示和图片
        activeElements.target.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; gap: 20px; ${highlightStyle};">
                <img src="${buildingImage}" alt="${buildingName}" style="width: 100px; height: 100px;">
                <div style="text-align: left;">
                    <div>${ageName} (${ageKey}) → ${funcKey}</div>
                    <div style="font-size: 32px; font-weight: bold;">${buildingName}</div>
                    ${warningText}
                </div>
            </div>
        `;
    } else {
        // 训练模式：只显示建筑名称和图片
        activeElements.target.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; gap: 20px; ${highlightStyle};">
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
    const isLearnMode = modeElements.learnMode.style.display === 'block';
    
    if (!gameState.firstKey) {
        // 第一次按键（时代键）
        if (pressedKey === gameState.currentAge) {
            gameState.firstKey = pressedKey;
            if (isLearnMode) {
                activeElements.feedback.textContent = `时代键正确: ${pressedKey}`;
            } else {
                activeElements.feedback.textContent = '正确!';
            }
            activeElements.feedback.className = 'feedback correct';
        } else {
            gameState.currentWrongCount++;
            
            // 检查是否连错三次
            if (gameState.currentWrongCount >= 3) {
                const [ageKey, funcKey] = gameState.currentKey.split('-');
                activeElements.feedback.textContent = `正确按键：${ageKey} → ${funcKey}`;
                activeElements.feedback.className = 'feedback wrong';
                gameState.wrong++;
                
                // 记录错题（只在训练模式下）
                const isTrainMode = modeElements.trainMode.style.display === 'block';
                if (isTrainMode && gameState.currentTrainingSession) {
                    // 找到当前训练会话
                    const currentSession = gameState.wrongAnswers.find(session => 
                        session.timestamp === gameState.currentTrainingSession
                    );
                    if (currentSession) {
                        if (!currentSession.errors[gameState.currentKey]) {
                            currentSession.errors[gameState.currentKey] = {
                                count: 1,
                                building: keyMappings[gameState.currentKey]
                            };
                        } else {
                            currentSession.errors[gameState.currentKey].count++;
                        }
                    }
                }
                
                // 等待用户下一次按键
                document.addEventListener('keydown', function handleNextKey(e) {
                    if (e.key.toUpperCase() === ageKey || e.key.toUpperCase() === funcKey) {
                        activeElements.feedback.textContent = '';
                        activeElements.feedback.className = 'feedback';
                        gameState.currentCount++;
                        activeElements.progress.textContent = gameState.currentCount;
                        
                        // 检查是否达到训练次数
                        if (gameState.currentCount >= gameState.totalCount) {
                            activeElements.feedback.textContent = `训练完成! 共${gameState.totalCount}次`;
                            activeElements.feedback.className = 'feedback correct';
                            setTimeout(() => {
                                resetGame();
                            }, 2000);
                        } else {
                            updateTarget();
                        }
                        document.removeEventListener('keydown', handleNextKey);
                    }
                });
            } else {
                if (isLearnMode) {
                    activeElements.feedback.textContent = `时代键错误，应为: ${gameState.currentAge}`;
                } else {
                    activeElements.feedback.textContent = '错误!';
                }
                activeElements.feedback.className = 'feedback wrong';
                gameState.wrong++;
                
                // 记录错题（只在训练模式下）
                const isTrainMode = modeElements.trainMode.style.display === 'block';
                if (isTrainMode && gameState.currentTrainingSession) {
                    // 找到当前训练会话
                    const currentSession = gameState.wrongAnswers.find(session => 
                        session.timestamp === gameState.currentTrainingSession
                    );
                    if (currentSession) {
                        if (!currentSession.errors[gameState.currentKey]) {
                            currentSession.errors[gameState.currentKey] = {
                                count: 1,
                                building: keyMappings[gameState.currentKey]
                            };
                        } else {
                            currentSession.errors[gameState.currentKey].count++;
                        }
                    }
                }
                
                setTimeout(() => {
                    activeElements.feedback.textContent = '';
                    activeElements.feedback.className = 'feedback';
                }, 1000);
            }
        }
    } else {
        // 第二次按键（功能键）
        const fullKey = `${gameState.firstKey}-${pressedKey}`;
        
        if (fullKey === gameState.currentKey) {
            activeElements.feedback.textContent = '完全正确!';
            activeElements.feedback.className = 'feedback correct';
            gameState.correct++;
            gameState.currentCount++;
            activeElements.progress.textContent = gameState.currentCount;
            gameState.firstKey = null;
            
            // 正确回答后，减少错误次数或清除错误记录
            gameState.wrongAnswers.forEach(session => {
                if (session.errors[gameState.currentKey]) {
                    session.errors[gameState.currentKey].count--;
                    if (session.errors[gameState.currentKey].count <= 0) {
                        delete session.errors[gameState.currentKey];
                    }
                }
            });
            
            // 检查是否达到训练次数
            if (gameState.currentCount >= gameState.totalCount) {
                activeElements.feedback.textContent = `训练完成! 共${gameState.totalCount}次`;
                activeElements.feedback.className = 'feedback correct';
                setTimeout(() => {
                    resetGame();
                }, 2000);
            } else {
                updateTarget();
            }
        } else {
            gameState.currentWrongCount++;
            
            // 检查是否连错三次
            if (gameState.currentWrongCount >= 3) {
                const [ageKey, funcKey] = gameState.currentKey.split('-');
                activeElements.feedback.textContent = `正确按键：${ageKey} → ${funcKey}`;
                activeElements.feedback.className = 'feedback wrong';
                gameState.wrong++;
                
                // 记录错题（只在训练模式下）
                const isTrainMode = modeElements.trainMode.style.display === 'block';
                if (isTrainMode && gameState.currentTrainingSession) {
                    // 找到当前训练会话
                    const currentSession = gameState.wrongAnswers.find(session => 
                        session.timestamp === gameState.currentTrainingSession
                    );
                    if (currentSession) {
                        if (!currentSession.errors[gameState.currentKey]) {
                            currentSession.errors[gameState.currentKey] = {
                                count: 1,
                                building: keyMappings[gameState.currentKey]
                            };
                        } else {
                            currentSession.errors[gameState.currentKey].count++;
                        }
                    }
                }
                
                // 等待用户下一次按键
                document.addEventListener('keydown', function handleNextKey(e) {
                    if (e.key.toUpperCase() === funcKey) {
                        activeElements.feedback.textContent = '';
                        activeElements.feedback.className = 'feedback';
                        gameState.currentCount++;
                        activeElements.progress.textContent = gameState.currentCount;
                        gameState.firstKey = null;
                        
                        // 检查是否达到训练次数
                        if (gameState.currentCount >= gameState.totalCount) {
                            activeElements.feedback.textContent = `训练完成! 共${gameState.totalCount}次`;
                            activeElements.feedback.className = 'feedback correct';
                            setTimeout(() => {
                                resetGame();
                            }, 2000);
                        } else {
                            updateTarget();
                        }
                        document.removeEventListener('keydown', handleNextKey);
                    }
                });
            } else {
                if (isLearnMode) {
                    activeElements.feedback.textContent = '功能键错误!';
                } else {
                    activeElements.feedback.textContent = '错误!';
                }
                activeElements.feedback.className = 'feedback wrong';
                gameState.wrong++;
                
                // 记录错题（只在训练模式下）
                const isTrainMode = modeElements.trainMode.style.display === 'block';
                if (isTrainMode && gameState.currentTrainingSession) {
                    // 找到当前训练会话
                    const currentSession = gameState.wrongAnswers.find(session => 
                        session.timestamp === gameState.currentTrainingSession
                    );
                    if (currentSession) {
                        if (!currentSession.errors[gameState.currentKey]) {
                            currentSession.errors[gameState.currentKey] = {
                                count: 1,
                                building: keyMappings[gameState.currentKey]
                            };
                        } else {
                            currentSession.errors[gameState.currentKey].count++;
                        }
                    }
                }
                
                gameState.firstKey = null;
                
                setTimeout(() => {
                    activeElements.feedback.textContent = '';
                    activeElements.feedback.className = 'feedback';
                }, 1000);
            }
        }
    }
}

// 开始游戏
function startGame() {
    gameState.isPlaying = true;
    gameState.totalCount = parseInt(activeElements.trainingCount.value) || 10;
    gameState.currentCount = 0;
    
    // 检查是否是训练模式
    const isTrainMode = modeElements.trainMode.style.display === 'block';
    if (isTrainMode) {
        // 创建新的训练会话
        gameState.currentTrainingSession = new Date().toISOString();
        gameState.wrongAnswers.push({
            timestamp: gameState.currentTrainingSession,
            errors: {}
        });
    }
    
    activeElements.startBtn.disabled = true;
    activeElements.pauseBtn.disabled = false;
    activeElements.resetBtn.disabled = false;
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
    gameState.currentWrongCount = 0;
    // 保留错题本数据
    
    clearInterval(gameState.timer);
    
    activeElements.startBtn.disabled = false;
    activeElements.pauseBtn.disabled = true;
    activeElements.resetBtn.disabled = true;
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
    // 文明选择按钮点击事件
    civElements.civBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const civ = this.getAttribute('data-civ');
            const bgUrl = this.getAttribute('data-bg');
            currentCiv = civ;
            
            // 设置文明背景
            let bgElement = document.querySelector('.civ-background');
            if (!bgElement) {
                bgElement = document.createElement('div');
                bgElement.className = 'civ-background';
                document.body.appendChild(bgElement);
            }
            bgElement.style.backgroundImage = `url(${bgUrl})`;
            
            // 显示/隐藏文明特定建筑
            updateCivSpecificBuildings();
            
            // 隐藏文明选择页面，显示模式选择
            civElements.civSelection.style.display = 'none';
            civElements.modeSelector.style.display = 'flex';
        });
    });
    
    // 更新文明特定建筑的显示状态
    function updateCivSpecificBuildings() {
        // 先隐藏所有建筑
        document.querySelectorAll('.building-checkbox').forEach(el => {
            el.style.display = 'none';
        });
        
        // 显示所有默认建筑（不包括带有civ-specific类的建筑）
        const defaultBuildings = [
            '#build-Q-Q', '#build-Q-W', '#build-Q-E', '#build-Q-R', '#build-Q-A', '#build-Q-S', '#build-Q-D', '#build-Q-Z', '#build-Q-X', '#build-Q-C',
            '#build-W-Q', '#build-W-S', '#build-W-W', '#build-W-Z', '#build-W-E', '#build-W-X', '#build-W-A', '#build-W-C',
            '#build-E-Q', '#build-E-A', '#build-E-Z',
            '#build-R-Q',
            '#train-build-Q-Q', '#train-build-Q-W', '#train-build-Q-E', '#train-build-Q-R', '#train-build-Q-A', '#train-build-Q-S', '#train-build-Q-D', '#train-build-Q-Z', '#train-build-Q-X', '#train-build-Q-C',
            '#train-build-W-Q', '#train-build-W-S', '#train-build-W-W', '#train-build-W-Z', '#train-build-W-E', '#train-build-W-X', '#train-build-W-A', '#train-build-W-C',
            '#train-build-E-Q', '#train-build-E-A', '#train-build-E-Z',
            '#train-build-R-Q'
        ];
        
        defaultBuildings.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                const buildingCheckbox = element.closest('.building-checkbox');
                if (buildingCheckbox) {
                    buildingCheckbox.style.display = 'inline-block';
                }
            }
        });
        
        // 显示所有时代
        const ageLabels = ['#age-Q', '#age-W', '#age-E', '#age-R'];
        ageLabels.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                const label = element.closest('label');
                if (label) {
                    label.style.display = 'inline-block';
                }
            }
        });
        
        const ageBuildings = ['#age-Q-buildings', '#age-W-buildings', '#age-E-buildings', '#age-R-buildings'];
        ageBuildings.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.display = 'block';
            }
        });
        
        const trainAgeLabels = ['#train-age-Q', '#train-age-W', '#train-age-E', '#train-age-R'];
        trainAgeLabels.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                const label = element.closest('label');
                if (label) {
                    label.style.display = 'inline-block';
                }
            }
        });
        
        const trainAgeBuildings = ['#train-age-Q-buildings', '#train-age-W-buildings', '#train-age-E-buildings', '#train-age-R-buildings'];
        trainAgeBuildings.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.display = 'block';
            }
        });
        
        // 为其他文明显示默认的修道院图标
        document.querySelectorAll('.monastery-images').forEach(el => {
            const defaultImage = el.querySelector('.default-image');
            const alternatingImages = el.querySelector('.alternating-images');
            if (defaultImage) {
                defaultImage.style.display = 'block';
            }
            if (alternatingImages) {
                alternatingImages.style.display = 'none';
            }
        });
        
        // 根据当前选择的文明显示对应的建筑
        if (currentCiv) {
            // 显示当前文明的特定建筑
            document.querySelectorAll(`.civ-specific.${currentCiv}`).forEach(el => {
                el.style.display = 'inline-block';
            });
            
            // 为阿尤布王朝也显示智慧宫
            if (currentCiv === 'ayyubid') {
                document.querySelectorAll('.civ-specific.ayyubid').forEach(el => {
                    el.style.display = 'inline-block';
                });
            }
            
            // 隐藏其他文明的特定建筑
            document.querySelectorAll('.civ-specific').forEach(el => {
                if (!el.classList.contains(currentCiv)) {
                    el.style.display = 'none';
                }
            });
            
            // 为拜占庭显示特殊建筑
            if (currentCiv === 'byzantine') {
                document.querySelectorAll('.civ-specific.byzantine').forEach(el => {
                    el.style.display = 'inline-block';
                });
                // 隐藏拜占庭的农田
                document.querySelector('#build-Q-A').closest('.building-checkbox').style.display = 'none';
                document.querySelector('#train-build-Q-A').closest('.building-checkbox').style.display = 'none';
            }
            
            // 为中国显示特殊建筑
            if (currentCiv === 'chinese') {
                document.querySelectorAll('.civ-specific.chinese').forEach(el => {
                    el.style.display = 'inline-block';
                });
            } else if (currentCiv === 'zhu') {
                // 为朱子遗训显示特殊建筑
                document.querySelectorAll('.civ-specific.zhu').forEach(el => {
                    el.style.display = 'inline-block';
                });
            }
            
            // 为兰开斯特王朝显示特殊建筑
            if (currentCiv === 'lancaster') {
                document.querySelectorAll('.civ-specific.lancaster').forEach(el => {
                    el.style.display = 'inline-block';
                });
            }
            
            // 为圣殿骑士团显示特殊建筑
            if (currentCiv === 'knights') {
                document.querySelectorAll('.civ-specific.knights').forEach(el => {
                    el.style.display = 'inline-block';
                });
                // 隐藏圣殿骑士团的码头、堡垒和伐木场
                const knightsBuildings = [
                    '#build-Q-D', '#build-Q-E', '#build-E-Z',
                    '#train-build-Q-D', '#train-build-Q-E', '#train-build-E-Z'
                ];
                
                knightsBuildings.forEach(selector => {
                    const element = document.querySelector(selector);
                    if (element) {
                        const buildingCheckbox = element.closest('.building-checkbox');
                        if (buildingCheckbox) {
                            buildingCheckbox.style.display = 'none';
                        }
                    }
                });
            }
            
            // 为马其顿王朝显示特殊建筑
            if (currentCiv === 'macedonian') {
                document.querySelectorAll('.civ-specific.macedonian').forEach(el => {
                    el.style.display = 'inline-block';
                });
                // 隐藏马其顿王朝的兵营、铁匠铺和大学
                const macedonianBuildings = [
                    '#build-Q-S', '#build-W-Q', '#build-R-Q',
                    '#train-build-Q-S', '#train-build-W-Q', '#train-build-R-Q'
                ];
                
                macedonianBuildings.forEach(selector => {
                    const element = document.querySelector(selector);
                    if (element) {
                        const buildingCheckbox = element.closest('.building-checkbox');
                        if (buildingCheckbox) {
                            buildingCheckbox.style.display = 'none';
                        }
                    }
                });
            }
            
            // 为马里显示特殊建筑
            if (currentCiv === 'malians') {
                document.querySelectorAll('.civ-specific.malians').forEach(el => {
                    el.style.display = 'inline-block';
                });
                // 隐藏马里的哨站
                const maliansBuildings = [
                    '#build-Q-Z',
                    '#train-build-Q-Z'
                ];
                
                maliansBuildings.forEach(selector => {
                    const element = document.querySelector(selector);
                    if (element) {
                        const buildingCheckbox = element.closest('.building-checkbox');
                        if (buildingCheckbox) {
                            buildingCheckbox.style.display = 'none';
                        }
                    }
                });
            }
            
            // 为蒙古显示特殊建筑
            if (currentCiv === 'mongol') {
                document.querySelectorAll('.civ-specific.mongol').forEach(el => {
                    el.style.display = 'inline-block';
                });
                // 隐藏蒙古的房子、磨坊、伐木场、采矿场、农田、石塔、石墙、石门、堡垒、大学、木栅栏墙和木栅栏门
                const mongolBuildings = [
                    '#build-Q-Q', '#build-Q-W', '#build-Q-E', '#build-Q-R', '#build-Q-A',
                    '#build-W-Z', '#build-W-X', '#build-W-C', '#build-E-Z', '#build-R-Q', '#build-Q-X', '#build-Q-C',
                    '#train-build-Q-Q', '#train-build-Q-W', '#train-build-Q-E', '#train-build-Q-R', '#train-build-Q-A',
                    '#train-build-W-Z', '#train-build-W-X', '#train-build-W-C', '#train-build-E-Z', '#train-build-R-Q', '#train-build-Q-X', '#train-build-Q-C'
                ];
                
                mongolBuildings.forEach(selector => {
                    const element = document.querySelector(selector);
                    if (element) {
                        const buildingCheckbox = element.closest('.building-checkbox');
                        if (buildingCheckbox) {
                            buildingCheckbox.style.display = 'none';
                        }
                    }
                });
                
                // 隐藏蒙古的第四时代
                const ageRLabel = document.querySelector('#age-R');
                if (ageRLabel) {
                    const label = ageRLabel.closest('label');
                    if (label) {
                        label.style.display = 'none';
                    }
                }
                
                const ageRBuildings = document.querySelector('#age-R-buildings');
                if (ageRBuildings) {
                    ageRBuildings.style.display = 'none';
                }
                
                const trainAgeRLabel = document.querySelector('#train-age-R');
                if (trainAgeRLabel) {
                    const label = trainAgeRLabel.closest('label');
                    if (label) {
                        label.style.display = 'none';
                    }
                }
                
                const trainAgeRBuildings = document.querySelector('#train-age-R-buildings');
                if (trainAgeRBuildings) {
                    trainAgeRBuildings.style.display = 'none';
                }
                
                // 隐藏蒙古的马厩（从时代II移到时代I）
                const buildWS = document.querySelector('#build-W-S');
                if (buildWS) {
                    const buildingCheckbox = buildWS.closest('.building-checkbox');
                    if (buildingCheckbox) {
                        buildingCheckbox.style.display = 'none';
                    }
                }
                
                const trainBuildWS = document.querySelector('#train-build-W-S');
                if (trainBuildWS) {
                    const buildingCheckbox = trainBuildWS.closest('.building-checkbox');
                    if (buildingCheckbox) {
                        buildingCheckbox.style.display = 'none';
                    }
                }
            }
            
            // 为奥斯曼显示特殊建筑
            if (currentCiv === 'ottomans') {
                document.querySelectorAll('.civ-specific.ottomans').forEach(el => {
                    el.style.display = 'inline-block';
                });
            }
            
            // 为罗斯显示特殊建筑
            if (currentCiv === 'russian') {
                document.querySelectorAll('.civ-specific.russian').forEach(el => {
                    el.style.display = 'inline-block';
                });
                // 隐藏罗斯的磨坊、哨站、木栅栏墙和木栅栏门
                const russianBuildings = [
                    '#build-Q-W', '#build-Q-Z', '#build-Q-X', '#build-Q-C',
                    '#train-build-Q-W', '#train-build-Q-Z', '#train-build-Q-X', '#train-build-Q-C'
                ];
                
                russianBuildings.forEach(selector => {
                    const element = document.querySelector(selector);
                    if (element) {
                        const buildingCheckbox = element.closest('.building-checkbox');
                        if (buildingCheckbox) {
                            buildingCheckbox.style.display = 'none';
                        }
                    }
                });
            }
            
            // 为日本显示特殊建筑并隐藏一些默认建筑
            if (currentCiv === 'japanese') {
                document.querySelectorAll('.civ-specific.japanese').forEach(el => {
                    el.style.display = 'inline-block';
                });
                // 隐藏日本的房子、磨坊、采矿场、铁匠铺、堡垒
                const japaneseBuildings = [
                    '#build-Q-Q', '#build-Q-W', '#build-Q-R', '#build-W-Q', '#build-E-Z',
                    '#train-build-Q-Q', '#train-build-Q-W', '#train-build-Q-R', '#train-build-W-Q', '#train-build-E-Z'
                ];
                
                japaneseBuildings.forEach(selector => {
                    const element = document.querySelector(selector);
                    if (element) {
                        const buildingCheckbox = element.closest('.building-checkbox');
                        if (buildingCheckbox) {
                            buildingCheckbox.style.display = 'none';
                        }
                    }
                });
                // 为日本显示交替的修道院图标
                document.querySelectorAll('.monastery-images').forEach(el => {
                    const defaultImage = el.querySelector('.default-image');
                    const alternatingImages = el.querySelector('.alternating-images');
                    if (defaultImage) {
                        defaultImage.style.display = 'none';
                    }
                    if (alternatingImages) {
                        alternatingImages.style.display = 'block';
                    }
                });
            }
            
            // 为战国大名显示特殊建筑
            if (currentCiv === 'sengoku') {
                document.querySelectorAll('.civ-specific.sengoku').forEach(el => {
                    el.style.display = 'inline-block';
                });
                // 隐藏战国大名的房子、磨坊、采矿场、铁匠铺、堡垒、修道院
                const sengokuBuildings = [
                    '#build-Q-Q', '#build-Q-W', '#build-Q-R', '#build-W-Q', '#build-E-Z', '#build-E-Q',
                    '#train-build-Q-Q', '#train-build-Q-W', '#train-build-Q-R', '#train-build-W-Q', '#train-build-E-Z', '#train-build-E-Q'
                ];
                
                sengokuBuildings.forEach(selector => {
                    const element = document.querySelector(selector);
                    if (element) {
                        const buildingCheckbox = element.closest('.building-checkbox');
                        if (buildingCheckbox) {
                            buildingCheckbox.style.display = 'none';
                        }
                    }
                });
            }
            
            // 为图格鲁克王朝显示特殊建筑
            if (currentCiv === 'tughlaq') {
                document.querySelectorAll('.civ-specific.tughlaq').forEach(el => {
                    el.style.display = 'inline-block';
                });
                // 隐藏图格鲁克的磨坊、伐木场、采矿场和堡垒
                const tughlaqBuildings = [
                    '#build-Q-W', '#build-Q-E', '#build-Q-R', '#build-E-Z',
                    '#train-build-Q-W', '#train-build-Q-E', '#train-build-Q-R', '#train-build-E-Z'
                ];
                
                tughlaqBuildings.forEach(selector => {
                    const element = document.querySelector(selector);
                    if (element) {
                        const buildingCheckbox = element.closest('.building-checkbox');
                        if (buildingCheckbox) {
                            buildingCheckbox.style.display = 'none';
                        }
                    }
                });
            }
            
            // 为金帐汗国显示特殊建筑
            if (currentCiv === 'goldenhorde') {
                document.querySelectorAll('.civ-specific.goldenhorde').forEach(el => {
                    el.style.display = 'inline-block';
                });
                // 隐藏金帐汗国的默认建筑
                const goldenHordeBuildings = [
                    '#build-Q-Q', '#build-Q-W', '#build-Q-E', '#build-Q-R', '#build-Q-A',
                    '#build-W-Z', '#build-W-X', '#build-W-C', '#build-E-Z', '#build-R-Q', '#build-Q-Z',
                    '#train-build-Q-Q', '#train-build-Q-W', '#train-build-Q-E', '#train-build-Q-R', '#train-build-Q-A',
                    '#train-build-W-Z', '#train-build-W-X', '#train-build-W-C', '#train-build-E-Z', '#train-build-R-Q', '#train-build-Q-Z'
                ];
                
                goldenHordeBuildings.forEach(selector => {
                    const element = document.querySelector(selector);
                    if (element) {
                        const buildingCheckbox = element.closest('.building-checkbox');
                        if (buildingCheckbox) {
                            buildingCheckbox.style.display = 'none';
                        }
                    }
                });
                
                // 隐藏金帐汗国的第四时代
                const ageRLabel = document.querySelector('#age-R');
                if (ageRLabel) {
                    const label = ageRLabel.closest('label');
                    if (label) {
                        label.style.display = 'none';
                    }
                }
                
                const ageRBuildings = document.querySelector('#age-R-buildings');
                if (ageRBuildings) {
                    ageRBuildings.style.display = 'none';
                }
                
                const trainAgeRLabel = document.querySelector('#train-age-R');
                if (trainAgeRLabel) {
                    const label = trainAgeRLabel.closest('label');
                    if (label) {
                        label.style.display = 'none';
                    }
                }
                
                const trainAgeRBuildings = document.querySelector('#train-age-R-buildings');
                if (trainAgeRBuildings) {
                    trainAgeRBuildings.style.display = 'none';
                }
                
                // 隐藏金帐汗国的马厩（从时代II移到时代I）
                const buildWS = document.querySelector('#build-W-S');
                if (buildWS) {
                    const buildingCheckbox = buildWS.closest('.building-checkbox');
                    if (buildingCheckbox) {
                        buildingCheckbox.style.display = 'none';
                    }
                }
                
                const trainBuildWS = document.querySelector('#train-build-W-S');
                if (trainBuildWS) {
                    const buildingCheckbox = trainBuildWS.closest('.building-checkbox');
                    if (buildingCheckbox) {
                        buildingCheckbox.style.display = 'none';
                    }
                }
            }
            
            // 为德里苏丹显示特殊建筑
            if (currentCiv === 'delhi') {
                document.querySelectorAll('.civ-specific.delhi').forEach(el => {
                    el.style.display = 'inline-block';
                });
                // 隐藏德里苏丹的时代III修道院
                document.querySelector('#build-E-Q').closest('.building-checkbox').style.display = 'none';
                document.querySelector('#train-build-E-Q').closest('.building-checkbox').style.display = 'none';
            }
        }
    }
    
    // 重新选择文明按钮点击事件
    function reselectCiv() {
        // 显示文明选择页面
        civElements.civSelection.style.display = 'block';
        // 隐藏模式选择和学习/训练模式
        civElements.modeSelector.style.display = 'none';
        modeElements.learnMode.style.display = 'none';
        modeElements.trainMode.style.display = 'none';
        // 重置当前选择的文明
        currentCiv = null;
        // 隐藏所有文明特定建筑
        updateCivSpecificBuildings();
    }
    
    // 模式选择页面的重新选择文明按钮
    civElements.reselectCivBtn.addEventListener('click', reselectCiv);
    
    // 错题本按钮点击事件
    civElements.wrongAnswersBtn.addEventListener('click', showWrongAnswers);
    
    // 返回模式选择按钮点击事件
    civElements.backToModeSelectBtn.addEventListener('click', () => {
        document.getElementById('wrong-answers-page').style.display = 'none';
        civElements.modeSelector.style.display = 'flex';
    });
    
    // 清空错题记录按钮点击事件
    civElements.clearWrongAnswersBtn.addEventListener('click', clearWrongAnswers);
    
    // 模式切换
    modeElements.learnBtn.addEventListener('click', () => {
        modeElements.learnMode.style.display = 'block';
        modeElements.trainMode.style.display = 'none';
        document.getElementById('wrong-answers-page').style.display = 'none';
        activeElements = learnElements;
    });
    
    modeElements.trainBtn.addEventListener('click', () => {
        modeElements.learnMode.style.display = 'none';
        modeElements.trainMode.style.display = 'block';
        document.getElementById('wrong-answers-page').style.display = 'none';
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

// 显示错题本
function showWrongAnswers() {
    const wrongAnswersList = document.getElementById('wrong-answers-list');
    
    if (gameState.wrongAnswers.length === 0) {
        wrongAnswersList.innerHTML = '<p>暂无错题记录</p>';
    } else {
        // 按时间倒序排序训练会话
        const sortedSessions = [...gameState.wrongAnswers]
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        let html = '<h3>错题列表</h3>';
        
        sortedSessions.forEach((session, index) => {
            const sessionTime = new Date(session.timestamp).toLocaleString();
            const hasErrors = Object.keys(session.errors).length > 0;
            
            if (hasErrors) {
                html += `<div style="margin-bottom: 20px; border: 1px solid #444; border-radius: 8px; padding: 15px;">`;
                html += `<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">`;
                html += `<h4>训练会话 ${index + 1} (${sessionTime})</h4>`;
                html += `<button onclick="clearSessionErrors(${index})" style="background-color: #ff4444; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">清空此会话</button>`;
                html += `</div>`;
                
                html += '<table style="width: 100%; border-collapse: collapse; margin-top: 10px;">';
                html += '<tr style="border-bottom: 1px solid #444;"><th style="text-align: left; padding: 8px;">建筑</th><th style="text-align: left; padding: 8px;">快捷键</th><th style="text-align: left; padding: 8px;">错误次数</th></tr>';
                
                Object.entries(session.errors).forEach(([key, data]) => {
                    const [ageKey, funcKey] = key.split('-');
                    html += `<tr style="border-bottom: 1px solid #333;">`;
                    html += `<td style="padding: 8px;">${data.building}</td>`;
                    html += `<td style="padding: 8px;">${ageKey} → ${funcKey}</td>`;
                    html += `<td style="padding: 8px;">${data.count}</td>`;
                    html += `</tr>`;
                });
                
                html += '</table>';
                html += '</div>';
            }
        });
        
        wrongAnswersList.innerHTML = html;
    }
    
    // 显示错题本页面
    civElements.modeSelector.style.display = 'none';
    modeElements.learnMode.style.display = 'none';
    modeElements.trainMode.style.display = 'none';
    document.getElementById('wrong-answers-page').style.display = 'block';
}

// 清空单个训练会话的错题记录
function clearSessionErrors(sessionIndex) {
    // 直接删除整个会话，而不是只清空错误
    gameState.wrongAnswers.splice(sessionIndex, 1);
    showWrongAnswers();
}

// 清空错题记录
function clearWrongAnswers() {
    gameState.wrongAnswers = [];
    showWrongAnswers();
}

// 初始化
function init() {
    // 在DOM加载完成后初始化元素
    civElements = {
        civSelection: document.getElementById('civ-selection'),
        modeSelector: document.getElementById('mode-selector'),
        civBtns: document.querySelectorAll('.civ-btn'),
        reselectCivBtn: document.getElementById('reselect-civ-btn'),
        wrongAnswersBtn: document.getElementById('wrong-answers-btn'),
        backToModeSelectBtn: document.getElementById('back-to-mode-select-btn'),
        clearWrongAnswersBtn: document.getElementById('clear-wrong-answers-btn')
    };
    
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
    
    initKeyboardDisplay();
    setupEventListeners();
    setupSelectAllButtons();
    setupConfirmButtons();
}

// 启动应用
window.addEventListener('DOMContentLoaded', init);

// 全局函数，用于清空单个训练会话的错题记录
window.clearSessionErrors = clearSessionErrors;