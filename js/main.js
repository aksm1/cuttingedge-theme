document.addEventListener('DOMContentLoaded', function () { 
    // =================================================================== 
    // 1. UI UTILITIES 
    // =================================================================== 
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle'); 
    const mainMenu = document.querySelector('.navbar .menu'); 
    if (mobileMenuToggle && mainMenu) { mobileMenuToggle.addEventListener('click', () => { mainMenu.classList.toggle('menu-active'); }); } 

    const menuItemsWithDropdown = document.querySelectorAll('.navbar .menu-item'); 
    menuItemsWithDropdown.forEach(item => { const dropdown = item.querySelector('.dropdown-menu'); if (dropdown) { let arrow = item.querySelector('.mobile-arrow'); if (!arrow) { arrow = document.createElement('span'); arrow.classList.add('mobile-arrow'); arrow.innerHTML = ' &#9662;'; item.appendChild(arrow); } item.addEventListener('click', function (event) { if (window.innerWidth <= 768) { if (event.target.closest('.dropdown-menu a')) return; event.preventDefault(); item.classList.toggle('submenu-open'); const currentArrow = item.querySelector('.mobile-arrow'); if (currentArrow) currentArrow.innerHTML = item.classList.contains('submenu-open') ? ' &#9652;' : ' &#9662;'; } }); } }); 
    const allTabsContainers = document.querySelectorAll('.tabs-container'); allTabsContainers.forEach(tabsContainer => { const tabsHeader = tabsContainer.querySelector('.tabs-header'); const contentWrapper = tabsContainer.querySelector('.tabs-content-wrapper'); if (tabsHeader && contentWrapper) { tabsHeader.addEventListener('click', function (event) { const button = event.target.closest('[data-tab]'); if (!button) return; const tabId = button.dataset.tab; if (button.classList.contains('tab-button')) { tabsHeader.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active')); const parentWrapper = button.closest('.submenu-wrapper'); if (parentWrapper) parentWrapper.classList.add('active'); else button.classList.add('active'); } contentWrapper.querySelectorAll('.tab-content').forEach(pane => pane.classList.remove('active')); const targetPane = contentWrapper.querySelector(`#${tabId}`); if (targetPane) targetPane.classList.add('active'); }); } }); 
    const tocList = document.getElementById('toc-list'); if(tocList) { const tocSidebar = document.getElementById('toc-sidebar'); const openBtn = document.getElementById('toc-open-btn'); const closeBtn = document.getElementById('toc-close-btn'); const overlay = document.getElementById('toc-overlay'); const generateToc = () => { tocList.innerHTML = ''; const activeTabContent = document.querySelector('.tab-content.active'); if (!activeTabContent) return; const headings = activeTabContent.querySelectorAll('h2, h3'); let headingIndex = 0; headings.forEach(heading => { if (heading.closest('.image-box') || heading.closest('.styled-table') || !heading.textContent.trim()) return; const id = heading.id || `heading-toc-${headingIndex++}`; if (!heading.id) heading.id = id; const li = document.createElement('li'); const a = document.createElement('a'); a.href = `#${id}`; a.textContent = heading.textContent.trim(); a.classList.add(`level-${heading.tagName.toLowerCase()}`); a.addEventListener('click', (e) => { e.preventDefault(); if(tocSidebar) tocSidebar.classList.remove('is-visible'); if(overlay) overlay.classList.remove('is-visible'); heading.scrollIntoView({ behavior: 'smooth', block: 'start' }); }); li.appendChild(a); tocList.appendChild(li); }); }; if(openBtn) openBtn.addEventListener('click', () => { if(tocSidebar) tocSidebar.classList.add('is-visible'); if(overlay) overlay.classList.add('is-visible'); }); if(closeBtn) closeBtn.addEventListener('click', () => { if(tocSidebar) tocSidebar.classList.remove('is-visible'); if(overlay) overlay.classList.remove('is-visible'); }); if(overlay) overlay.addEventListener('click', () => { if(tocSidebar) tocSidebar.classList.remove('is-visible'); if(overlay) overlay.classList.remove('is-visible'); }); allTabsContainers.forEach(container => { const header = container.querySelector('.tabs-header'); if (header) { header.addEventListener('click', function (event) { const button = event.target.closest('[data-tab]'); if (!button) return; setTimeout(generateToc, 50); }); } }); generateToc(); } 
    const scrollToTopBtn = document.getElementById('scrollToTopBtn'); if (scrollToTopBtn) { window.addEventListener('scroll', function () { if (window.pageYOffset > 300) scrollToTopBtn.classList.add('visible'); else scrollToTopBtn.classList.remove('visible'); }); scrollToTopBtn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); }); } 
    const allClassificationViewers = document.querySelectorAll('.classification-viewer'); allClassificationViewers.forEach(viewer => { const controlButtons = viewer.querySelectorAll('.classifier-btn'); const contentPanels = viewer.querySelectorAll('.classifier-panel'); if (controlButtons.length > 0 && contentPanels.length > 0) { controlButtons.forEach(button => { button.addEventListener('click', function () { const targetId = this.dataset.target; controlButtons.forEach(btn => btn.classList.remove('active')); this.classList.add('active'); contentPanels.forEach(panel => { if (panel.id === targetId) panel.classList.add('active'); else panel.classList.remove('active'); }); }); }); } }); 
    const spotlightOverlay = document.createElement('div'); spotlightOverlay.className = 'spotlight-overlay'; const spotlightClose = document.createElement('span'); spotlightClose.className = 'spotlight-close'; spotlightClose.innerHTML = '&times;'; const spotlightImage = document.createElement('img'); spotlightImage.className = 'spotlight-content'; spotlightOverlay.appendChild(spotlightClose); spotlightOverlay.appendChild(spotlightImage); document.body.appendChild(spotlightOverlay); const allClickableImages = document.querySelectorAll('.image-box img, .multiphoto-item img'); allClickableImages.forEach(img => { img.style.cursor = 'pointer'; img.addEventListener('click', (e) => { e.preventDefault(); spotlightOverlay.style.display = 'flex'; spotlightImage.src = img.src; }); }); const closeSpotlight = () => { spotlightOverlay.style.display = 'none'; }; spotlightClose.addEventListener('click', closeSpotlight); spotlightOverlay.addEventListener('click', (e) => { if (e.target === spotlightOverlay) closeSpotlight(); }); document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSpotlight(); }); 
    const loginTrigger = document.getElementById('login-popup-trigger'); const loginModal = document.getElementById('login-popup-modal'); const closeModalBtn = document.getElementById('login-popup-close'); const modalOverlay = document.querySelector('.modal-overlay'); if (loginTrigger) loginTrigger.addEventListener('click', () => { if (loginModal) loginModal.style.display = 'block'; }); if (closeModalBtn) closeModalBtn.addEventListener('click', () => { if (loginModal) loginModal.style.display = 'none'; }); if (modalOverlay) modalOverlay.addEventListener('click', () => { if (loginModal) loginModal.style.display = 'none'; }); document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && loginModal && loginModal.style.display === 'block') loginModal.style.display = 'none'; }); 

    // =================================================================== 
    // 2. MRCS QBANK ENGINE
    // =================================================================== 
    function initMrcsQbank(appRoot, instanceIndex) {
        let revealedAnswers = {};

        const baseQuestions = myQuestionBank.questions || []; // Metadata Only
        const baseTopicTree = myQuestionBank.topic_tree || [];
        let seenIDs = myQuestionBank.seen_ids || [];
        let wrongIDs = myQuestionBank.wrong_ids || [];
        const currentUserID = myQuestionBank.user_id || 'guest';
        const userName = myQuestionBank.user_name || 'Doctor';
        const instanceKeyRaw = appRoot.dataset.qbankKey || appRoot.id || instanceIndex;
        const instanceKey = String(instanceKeyRaw).trim().replace(/\s+/g, '_').toLowerCase();
        const storageKey = 'mrcs_quiz_state_' + currentUserID + '_' + instanceKey;
        const quickStorageKey = 'mrcs_temp_quick_session_' + instanceKey;
        const useServerSession = appRoot.dataset.useServerSession !== 'false';
        const topicFilterRaw = appRoot.dataset.topicFilter || '';
        const filterNames = topicFilterRaw
            .split(',')
            .map(name => name.trim())
            .filter(Boolean);

        const matchesFilter = (name) => {
            if (!filterNames.length) return true;
            return filterNames.some(filter => name.toLowerCase().includes(filter.toLowerCase()));
        };

        const filterTopicTree = (nodes) => {
            if (!nodes || !nodes.length) return [];
            const filtered = [];
            nodes.forEach(node => {
                if (matchesFilter(node.name)) {
                    filtered.push(node);
                    return;
                }
                const childMatches = filterTopicTree(node.children || []);
                if (childMatches.length) {
                    filtered.push({ id: node.id, name: node.name, children: childMatches });
                }
            });
            return filtered;
        };

        let topicTree = baseTopicTree;
        let allQuizQuestions = baseQuestions;
        if (filterNames.length) {
            const filteredTree = filterTopicTree(baseTopicTree);
            if (filteredTree.length) {
                topicTree = filteredTree;
                const allowedIds = new Set();
                const collectIds = (nodes) => {
                    nodes.forEach(node => {
                        allowedIds.add(parseInt(node.id));
                        if (node.children && node.children.length) collectIds(node.children);
                    });
                };
                collectIds(topicTree);
                allQuizQuestions = baseQuestions.filter(q => q.topic_ids && q.topic_ids.some(t => allowedIds.has(parseInt(t))));
            } else {
                topicTree = [];
                allQuizQuestions = [];
            }
        }

        const questionIdSet = new Set(allQuizQuestions.map(q => q.id.toString()));
        const progressDotPrefix = 'p-dot-' + instanceKey + '-';
        const menuContainer = appRoot.querySelector("#quizTypeSelection"); 
        const mainQuizContainer = appRoot.querySelector("#mainQuizContainer"); 
        const quizContainer = appRoot.querySelector("#quiz"); 
        const immediateFeedbackArea = appRoot.querySelector("#immediateFeedbackArea"); 
        const nextButton = appRoot.querySelector("#next"); 
        const prevButton = appRoot.querySelector("#prev"); 
        const submitButton = appRoot.querySelector("#submit"); 
        const topPrev = appRoot.querySelector("#topPrev"); 
        const topNext = appRoot.querySelector("#topNext"); 
        const resultsContainer = appRoot.querySelector("#results"); 
        const progressBox = appRoot.querySelector("#progressBox"); 
        const backToMenuBtn = appRoot.querySelector("#btnBackToMenu"); 
        const visualGridContainer = appRoot.querySelector("#visualProgressGrid"); 
        const quizTitleHeader = appRoot.querySelector(".quiz-header-nav h2"); 
        let timerDisplay = appRoot.querySelector('.timer-display'); 
        if (!timerDisplay && appRoot.querySelector('.quiz-header-nav')) { timerDisplay = document.createElement('div'); timerDisplay.className = 'timer-display'; timerDisplay.style.display = 'none'; appRoot.querySelector('.quiz-header-nav').appendChild(timerDisplay); } 

        let activeQuizQuestions = []; let shuffledQuestions = []; let currentQuestionIndex = 0; let userAnswers = []; let inFeedbackMode = false; let timerInterval = null; let timeRemaining = 0; let isExamMode = false; let sessionID = ''; let menuHistory = []; 
        let flaggedIndices = []; let currentDisplayTitle = 'Knowledge Quiz'; let progressGridPage = 0; const QUESTIONS_PER_GRID_PAGE = 40; let isQuickMode = false; 

        // --- ANIMATION FUNCTION ---
        function animateDonuts() {
            // Animate Donut Charts
            const donuts = document.querySelectorAll('.animate-donut');
            donuts.forEach(donut => {
                const targetGreen = parseFloat(donut.dataset.green) || 0;
                const targetRed = parseFloat(donut.dataset.red) || 0;
                const percentSpan = donut.querySelector('.big-percent');
                const targetPercent = percentSpan ? parseInt(percentSpan.dataset.percent) : 0;
                
                let startTime = null;
                const duration = 1500; 

                function step(timestamp) {
                    if (!startTime) startTime = timestamp;
                    const progress = Math.min((timestamp - startTime) / duration, 1);
                    const ease = 1 - Math.pow(1 - progress, 3);
                    
                    const currentGreen = targetGreen * ease;
                    const currentRed = targetRed * ease;
                    const currentPct = Math.round(targetPercent * ease);

                    donut.style.background = `conic-gradient(#2ecc71 0deg ${currentGreen}deg, #e74c3c ${currentGreen}deg ${currentRed}deg, #eee ${currentRed}deg 360deg)`;
                    
                    if(percentSpan) percentSpan.textContent = currentPct + '%';
                    if (progress < 1) requestAnimationFrame(step);
                }
                requestAnimationFrame(step);
                
                // --- MOBILE XP BUBBLE FIX ---
function fixMobileXpBubble() {
  if (window.innerWidth > 900) return;

  document.querySelectorAll('.timeline-line-track').forEach(track => {
    const fill = track.querySelector('.timeline-line-fill');
    const bubble = track.querySelector('.current-score-floater.xp-on-line');
    if (!fill || !bubble) return;

    // Desktop progress stored as % width
    const pct = parseFloat(fill.style.width || '0') || 0;

    const h = track.getBoundingClientRect().height;
    const y = (pct / 100) * h;

    bubble.style.left = '28px';
    bubble.style.top = `${y}px`;
    bubble.style.transform = 'translateY(-50%)';
  });
}

            });
            
            // Mobile Timeline Fix
            if (window.innerWidth <= 900) {
                const fills = document.querySelectorAll('.timeline-line-fill');
                fills.forEach(fill => {
                    const w = fill.style.width;
                    if(w) {
                        fill.style.width = '100%'; 
                        fill.style.height = w;
                    }
                });
            }
        }

        const getStatsForId = (id) => { const qs = allQuizQuestions.filter(q => q.topic_ids && q.topic_ids.includes(parseInt(id))); let a = 0, w = 0; qs.forEach(q => { if(seenIDs.includes(q.id.toString())) { a++; if(wrongIDs.includes(q.id.toString())) w++; } }); return { total: qs.length, attempted: a, correct: a-w, acc: a > 0 ? Math.round(((a-w)/a)*100) : null }; }; 
        const getTopicStats = (node) => { let ids = [node.id]; const collectIds = (children) => { children.forEach(c => { ids.push(c.id); if(c.children && c.children.length) collectIds(c.children); }); }; if(node.children) collectIds(node.children); const qs = allQuizQuestions.filter(q => q.topic_ids && q.topic_ids.some(t => ids.includes(parseInt(t)))); let a = 0, w = 0; qs.forEach(q => { if(seenIDs.includes(q.id.toString())) { a++; if(wrongIDs.includes(q.id.toString())) w++; } }); return { total: qs.length, attempted: a, correct: a-w, acc: a > 0 ? Math.round(((a-w)/a)*100) : 0 }; }; 

        function renderMainMenu() { 
            if(!menuContainer) return; 
            menuHistory = []; 
            if (!allQuizQuestions.length || !topicTree.length) {
                const emptyMessage = filterNames.length ? 'No gastrointestinal surgery questions are available yet.' : 'No questions are available yet.';
                menuContainer.innerHTML = `<p>${emptyMessage}</p>`;
                toggleUI('menu');
                return;
            }
            const totalQs = allQuizQuestions.length; 
            const seenInBank = seenIDs.filter(id => questionIdSet.has(id));
            const wrongInBank = wrongIDs.filter(id => questionIdSet.has(id));
            const attempted = seenInBank.length; 
            const wrong = wrongInBank.length; 
            const correct = attempted - wrong; 
            const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0; 
            const unseenCount = totalQs - attempted; 
            
            // --- GAMIFICATION LOGIC (JS) ---
            const currentXP = (correct * 10) + (wrong * 1);

            const ranks = [ 
                { name: 'Med Student',   limit: 0,      icon: '🎓' }, 
                { name: 'Junior Doctor', limit: 500,    icon: '🩺' }, 
                { name: 'Core Trainee',  limit: 2000,   icon: '🩻' }, 
                { name: 'Registrar',     limit: 8000,   icon: '📋' }, 
                { name: 'Consultant',    limit: 20000,  icon: '👨‍⚕️' } 
            ]; 
            
            let currentRank = ranks[0]; 
            let nextRank = null;
            for(let i = 0; i < ranks.length; i++) { 
                if(currentXP >= ranks[i].limit) { 
                    currentRank = ranks[i]; 
                    if(ranks[i+1]) nextRank = ranks[i+1];
                } 
            }
            
            // Generate Timeline HTML (Matches PHP)
            let stepperHtml = '<div class="timeline-container">';
            ranks.forEach((r, index) => {
                const isAchieved = currentXP >= r.limit;
                const isCurrent = r.name === currentRank.name;
                
                let lineWidth = '0%';
                if (isAchieved && ranks[index+1]) {
                     const nextLimit = ranks[index+1].limit;
                     const currentLimit = r.limit;
                     if (currentXP >= nextLimit) {
                         lineWidth = '100%';
                     } else if (currentXP >= currentLimit) {
                         const range = nextLimit - currentLimit;
                         const gained = currentXP - currentLimit;
                         const pct = (gained / range) * 100;
                         lineWidth = pct + '%';
                     }
                }
                
stepperHtml += `
    <div class="timeline-item ${isAchieved ? 'achieved' : ''} ${isCurrent ? 'current' : ''}">
        <div class="timeline-marker">
            <div class="marker-icon">${r.icon}</div>

            ${index < ranks.length - 1 ? `
  <div class="timeline-line-track">
    <div class="timeline-line-fill" style="width: ${lineWidth};"></div>
    ${isCurrent ? `<div class="current-score-floater xp-on-line" style="left:${lineWidth};">${currentXP.toLocaleString()} XP</div>` : ''}
  </div>
` : ''}
        </div>
        <div class="timeline-content">
            <span class="rank-name">${r.name}</span>
            <span class="rank-xp">${r.limit.toLocaleString()} XP</span>
        </div>
    </div>
`;

            });
            stepperHtml += '</div>';

            const greenEnd = attempted > 0 ? Math.round((accuracy/100)*360) : 0;
            const redEnd = attempted > 0 ? 360 : 0; 
            
            let streak = localStorage.getItem('mrcs_streak_count') || 0; 
            const lastVisit = localStorage.getItem('mrcs_last_visit'); 
            const today = new Date().toDateString(); 
            if (lastVisit !== today) { streak++; localStorage.setItem('mrcs_streak_count', streak); localStorage.setItem('mrcs_last_visit', today); } 

            let html = ` 
                <div class="dash-hero modern-rank-layout"> 
                    
                    <div class="hero-rank-section">
                        <div class="rank-header">
                            <div>
                                <small style="color:#888; text-transform:uppercase; letter-spacing:1px; font-weight:700;">Current Rank</small>
                                <h2 class="animate-pop-in" style="margin:5px 0;">${currentRank.icon} ${currentRank.name}</h2>
<div class="xp-rules-text">
  Total XP: <strong>${currentXP.toLocaleString()}</strong>
  <div class="xp-rules-sub">
    <span>✅ Correct: <strong>+10 XP</strong></span>
    <span>❌ Incorrect: <strong>+1 XP</strong></span>
  </div>
</div>                            </div>
                            ${nextRank ? `<div class="xp-badge">Next: ${nextRank.name} (${(nextRank.limit - currentXP).toLocaleString()} XP to go)</div>` : '<div class="xp-badge">Max Rank Achieved! 🏆</div>'}
                        </div>

                        ${stepperHtml}
                    </div> 

                    <div class="hero-stat">
                        <div class="donut-chart animate-donut" data-green="${greenEnd}" data-red="${redEnd}" style="background: conic-gradient(#eee 0deg 360deg);">
                            <div class="donut-inner"><span class="big-percent" data-percent="${attempted > 0 ? accuracy : 0}">0%</span><span class="label">Accuracy</span></div>
                        </div>
                        <div class="stat-pills-row"><span class="d-pill correct">✅ ${correct}</span><span class="d-pill wrong">❌ ${wrong}</span></div>
                    </div> 
                </div> 
                <div class="smart-stats-row"><div class="smart-card"><div class="smart-icon icon-streak">🔥</div><div class="smart-content"><span class="smart-label">Streak</span><span class="smart-value">${streak} Days</span></div></div><div class="smart-card"><div class="smart-icon icon-bank">🏦</div><div class="smart-content"><span class="smart-label">Remaining</span><span class="smart-value">${unseenCount} Qs</span></div></div><div class="smart-card clickable" id="btnResumedNav" style="display:none;"></div></div> 
                <h3 style="margin-top:30px; margin-bottom:15px; color:#2c3e50;">Select Paper or Subtopic to Get Started</h3><div id="dashboardTopicList"></div> 
                <h3 style="margin-top:30px; margin-bottom:15px; font-size:0.9rem; color:#888; text-transform:uppercase; letter-spacing:1px; font-weight:700;">Other Modes</h3><div class="secondary-menu-grid"><div class="menu-card-btn compact" id="btnMock"><span>⏱️</span><div><h3>Mock Exam</h3><p>Simulate exam conditions. 50 Qs, Timed.</p></div></div><div class="menu-card-btn compact" id="btnRandom"><span>🎲</span><div><h3>Random</h3><p>Generate a quiz from the entire question bank.</p></div></div><div class="menu-card-btn compact" id="btnBetweenCases"><span>☕</span><div><h3>Between Cases</h3><p>Generate 10 random questions. Perfect for free time between cases. Doesn't affect saved progress.</p></div></div></div><div id="resumeContainer"></div><div style="margin-top: 30px; text-align:center;"><button id="btnResetAll" style="background:none; border:none; color:#999; text-decoration:underline; cursor:pointer; font-size:0.8rem;">Reset All Progress</button></div>`; 
            menuContainer.innerHTML = html; 

            const listContainer = menuContainer.querySelector('#dashboardTopicList'); 
            if(topicTree && topicTree.length > 0) { topicTree.forEach(node => { 
                    const hasChildren = (node.children && node.children.length > 0); const stats = getTopicStats(node); const tAcc = stats.attempted > 0 ? Math.round((stats.correct / stats.attempted) * 100) : 0; const completionRaw = (stats.total > 0) ? (stats.attempted / stats.total) * 100 : 0; const completionPercent = Math.round(completionRaw); 
                    const rGreen = attempted > 0 ? Math.round((tAcc/100)*360) : 0; const rRed = attempted > 0 ? 360 : 0;
                    const card = document.createElement('div'); card.className = 'topic-split-card'; 
                    card.innerHTML = `<div class="topic-main-info"><h4>${node.name}</h4><div class="topic-meta-counts"><span>📚 ${stats.total} Qs</span></div></div><div class="topic-stats-area"><div class="stat-group-linear" style="margin-right:15px;"><span class="stat-label">Done</span><div class="topic-progress-track"><div class="topic-progress-fill" style="width: ${completionPercent}%"></div></div><span class="stat-value-text">${completionPercent}% Done</span></div><div class="stat-group-circle"><div class="mini-ring" data-green="${rGreen}" data-red="${rRed}" style="background: conic-gradient(#eee 0deg 360deg);"><span class="ring-text">${stats.attempted > 0 ? tAcc : '-'}</span></div><span class="stat-label" style="margin-top:2px; font-size:0.7rem;">Acc%</span></div></div>
                    <div class="topic-actions"><button class="btn-topic-start"><span>▶ Start</span></button><div class="btn-topic-subs ${hasChildren ? '' : 'topic-drill-disabled'}">${hasChildren ? 'Subtopics' : 'No Subs'}</div></div>`; 
                    const startBtn = card.querySelector('.btn-topic-start'); if (stats.total > 0) { startBtn.onclick = () => startTopicQuiz(node); } else { startBtn.style.opacity = '0.5'; startBtn.style.cursor = 'default'; startBtn.innerHTML = 'Empty'; } const subBtn = card.querySelector('.btn-topic-subs'); if (hasChildren) { subBtn.onclick = (e) => { e.stopPropagation(); menuHistory.push({nodes: topicTree, title: "Main Menu"}); renderHierarchyLevel(node.children, node.name); }; } listContainer.appendChild(card); 
                }); 
            } else { listContainer.innerHTML = '<p>No topics found.</p>'; } 
            const savedState = loadQuizState(); if (savedState && savedState.shuffledIDs && savedState.shuffledIDs.length > 0) { const resumeWrap = menuContainer.querySelector('#btnResumedNav'); if (resumeWrap) { resumeWrap.style.display = 'flex'; const unansweredCount = savedState.userAnswers ? savedState.userAnswers.filter(ans => ans === null).length : 0; const sessionName = savedState.displayTitle || "Session"; resumeWrap.innerHTML = `<div class="smart-icon" style="background:#e3f2fd; color:#0d47a1;">▶</div><div class="smart-content"><span class="smart-label">Resume</span><span class="smart-value" style="font-size:0.9rem; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; display:block; max-width:130px;" title="${sessionName}">${sessionName}</span><span class="smart-sub">${unansweredCount} Left</span></div>`; resumeWrap.onclick = () => resumeQuiz(savedState); } } 
            menuContainer.querySelector('#btnMock').onclick = startMockExam; menuContainer.querySelector('#btnRandom').onclick = renderRandomMenu; menuContainer.querySelector('#btnBetweenCases').onclick = startBetweenCases; menuContainer.querySelector('#btnResetAll').onclick = () => { if(confirm("Reset all progress? This cannot be undone.")) resetAllProgress(); }; 
            toggleUI('menu'); 
            animateDonuts(); 
            if (typeof fixMobileXpBubble === 'function') fixMobileXpBubble();
        } 
        
        const isPrimaryQbank = appRoot.dataset.qbankPrimary === 'true' || instanceIndex === 0;
        if (isPrimaryQbank) {
            window.startDashboardQuiz = function(id, name) { const findNode = (list, id) => { for(let t of list) { if(t.id == id) return t; if(t.children) { const f = findNode(t.children, id); if(f) return f; } } return null; }; const node = findNode(topicTree, id); if(node) { const dashboard = document.querySelector('.mrcs-dashboard-wrapper'); if(dashboard) dashboard.style.display = 'none'; if(appRoot) appRoot.style.display = 'block'; startTopicQuiz(node); } else { alert("Topic data not found."); } }; 
        }
        function resetAllProgress() { const fd = new URLSearchParams(); fd.append('action', 'mrcs_reset_all_history'); fetch(myQuestionBank.ajax_url, { method: 'POST', body: fd }).then(r => r.json()).then(res => { if(res.success) { seenIDs.length = 0; wrongIDs.length = 0; localStorage.removeItem(storageKey); localStorage.removeItem(quickStorageKey); alert("Progress reset."); renderMainMenu(); } }); } 
        function renderRandomMenu() { const u = allQuizQuestions.filter(q => !seenIDs.includes(q.id.toString())).length; const w = allQuizQuestions.filter(q => wrongIDs.includes(q.id.toString())).length; menuContainer.innerHTML = `<button class="back-btn back-btn-modern" style="margin-bottom:20px;">← Back to Menu</button><h2>Random Practice</h2><div class="sub-menu-options"><button class="sub-menu-btn" id="filterUnseen"><span>New Only</span><small>${u}</small></button><button class="sub-menu-btn" id="filterIncorrect"><span>Incorrect Only</span><small>${w}</small></button><button class="sub-menu-btn" id="filterAll"><span>All Questions</span><small>${allQuizQuestions.length}</small></button></div>`; menuContainer.querySelector('.back-btn').onclick = renderMainMenu; menuContainer.querySelector('#filterUnseen').onclick = () => { const f=allQuizQuestions.filter(q=>!seenIDs.includes(q.id.toString())); if(!f.length) return alert("All seen!"); startQuiz(f, false, 'Unseen Questions'); }; menuContainer.querySelector('#filterIncorrect').onclick = () => { const f=allQuizQuestions.filter(q=>wrongIDs.includes(q.id.toString())); if(!f.length) return alert("None incorrect!"); startQuiz(f, false, 'Targeted Revision'); }; menuContainer.querySelector('#filterAll').onclick = () => { startQuiz(allQuizQuestions, false, 'All Questions'); }; } 
        function renderHierarchyLevel(nodes, title) { if (!nodes || nodes.length === 0) return alert("No topics."); let html = `<div class="quiz-header-nav" style="border:none; margin-bottom:20px; padding:0;"><button class="back-btn back-btn-modern" style="margin:0;">← Back</button><h2 style="font-size:1.5rem;">${title}</h2><div style="width:70px;"></div></div><div class="topic-list" id="topicList"></div>`; menuContainer.innerHTML = html; menuContainer.querySelector('.back-btn').onclick = () => { if(!menuHistory.length) renderMainMenu(); else { const p=menuHistory.pop(); renderHierarchyLevel(p.nodes, p.title); } }; const list = menuContainer.querySelector('#topicList'); nodes.forEach(node => { const hasChildren = (node.children && node.children.length > 0); const stats = getTopicStats(node); const tAcc = stats.attempted > 0 ? Math.round((stats.correct / stats.attempted) * 100) : 0; const completionRaw = (stats.total > 0) ? (stats.attempted / stats.total) * 100 : 0; const completionPercent = Math.round(completionRaw); const ringDeg = Math.round((tAcc / 100) * 360); const rStyle = stats.attempted > 0 ? `background: conic-gradient(#2ecc71 0deg ${ringDeg}deg, #e74c3c ${ringDeg}deg 360deg);` : 'background: #eee;'; const card = document.createElement('div'); card.className = 'topic-split-card'; card.innerHTML = `<div class="topic-main-info"><h4>${node.name}</h4><div class="topic-meta-counts"><span>📚 ${stats.total} Questions</span><span>📝 ${stats.attempted} Attempted</span></div></div><div class="topic-stats-area"><div class="stat-group-linear"><span class="stat-label">Progress</span><div class="topic-progress-track"><div class="topic-progress-fill" style="width: ${completionPercent}%"></div></div><span class="stat-value-text">${completionPercent}% Done</span></div><div class="stat-group-circle"><div class="mini-ring" style="${rStyle}"><span class="ring-text">${stats.attempted > 0 ? tAcc + '%' : '-'}</span></div><span class="stat-label" style="margin-top: 5px;">Accuracy</span></div></div><div class="topic-actions"><button class="btn-topic-start"><span>▶ Start Quiz</span></button><div class="btn-topic-subs ${hasChildren ? '' : 'topic-drill-disabled'}">${hasChildren ? 'View Subtopics' : 'No Subtopics'}</div></div>`; const startBtn = card.querySelector('.btn-topic-start'); if (stats.total > 0) { startBtn.onclick = () => startTopicQuiz(node); } else { startBtn.style.opacity = '0.5'; startBtn.style.cursor = 'default'; startBtn.innerHTML = 'Empty'; } const subBtn = card.querySelector('.btn-topic-subs'); if (hasChildren) { subBtn.onclick = (e) => { e.stopPropagation(); menuHistory.push({nodes: topicTree, title: "Main Menu"}); renderHierarchyLevel(node.children, node.name); }; } list.appendChild(card); }); } 
        function startTopicQuiz(node) { let ids = [node.id]; const collectIds = (children) => { children.forEach(c => { ids.push(c.id); if(c.children && c.children.length) collectIds(c.children); }); }; if(node.children) collectIds(node.children); const f = allQuizQuestions.filter(q => q.topic_ids && q.topic_ids.some(t => ids.includes(parseInt(t)))); if (f.length === 0) return alert("No questions in this topic."); startQuiz(f, false, node.name); } 
        function startMockExam() { startQuiz([...allQuizQuestions].sort(() => 0.5 - Math.random()).slice(0, 50), true, 'Full Mock Exam'); } 
        function startBetweenCases() { const quickSet = [...allQuizQuestions].sort(() => 0.5 - Math.random()).slice(0, 10); startQuiz(quickSet, false, 'Between Cases (10 Qs)', true); } 
        
        function startQuiz(q_stubs, exam, titleText, isQuick = false) { 
            isQuickMode = isQuick;  
            if(typeof myQuestionBank !== 'undefined') { myQuestionBank.saved_session = null; } 
            if (!isQuickMode) { localStorage.removeItem(storageKey); } 

            activeQuizQuestions = q_stubs; 
            shuffledQuestions = [...q_stubs].sort(() => Math.random() - 0.5); 
            currentQuestionIndex = 0; userAnswers = Array(shuffledQuestions.length).fill(null); 
            flaggedIndices = []; inFeedbackMode = false; isExamMode = exam; sessionID = 'sess_' + Date.now(); 
            currentDisplayTitle = titleText || 'Knowledge Quiz'; 
            progressGridPage = 0; 
            revealedAnswers = {}; 
             
            if(quizTitleHeader) quizTitleHeader.textContent = currentDisplayTitle; 
            if(isExamMode) { timeRemaining = 3600; if(timerDisplay) timerDisplay.style.display='block'; startTimer(); } else { if(timerDisplay) timerDisplay.style.display='none'; if(timerInterval) clearInterval(timerInterval); } 
            
            toggleUI('quiz'); 
            quizContainer.innerHTML = '<div style="text-align:center; padding:40px;"><div class="spinner" style="border:4px solid #f3f3f3; border-top:4px solid #3498db; border-radius:50%; width:40px; height:40px; animation:spin 1s linear infinite; margin:0 auto 20px;"></div><h3>Loading Questions...</h3></div><style>@keyframes spin {0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }}</style>';
            if(nextButton) nextButton.style.display = 'none';

            const idsToFetch = shuffledQuestions.map(q => q.id);
            const fd = new URLSearchParams(); fd.append('action', 'mrcs_load_quiz_questions'); fd.append('ids', JSON.stringify(idsToFetch));
            fetch(myQuestionBank.ajax_url, { method: 'POST', body: fd })
                .then(r => r.json())
                .then(res => {
                    if (res.success && res.data) {
                        res.data.forEach(fetchedQ => { const match = shuffledQuestions.find(s => s.id == fetchedQ.id); if(match) { match.question = fetchedQ.question; match.answers = fetchedQ.answers; } });
                        saveQuizState(); generateProgressGrid(); updateProgress(); showQuestion(); if(nextButton) nextButton.style.display = 'block';
                    } else { alert("Failed to load questions."); toggleUI('menu'); }
                });
        } 

        function resumeQuiz(s) { 
            const stubs = []; s.shuffledIDs.forEach(id=>{ const q=allQuizQuestions.find(i=>i.id==id); if(q) stubs.push(q); }); if(!stubs.length) { alert("Error."); clearQuizState(); return; } 
            shuffledQuestions = stubs; currentQuestionIndex=s.currentQuestionIndex; userAnswers=s.userAnswers; flaggedIndices = s.flaggedIndices || []; currentDisplayTitle = s.displayTitle || 'Resumed Session'; 
            if (s.revealedAnswers) { Object.assign(revealedAnswers, s.revealedAnswers); }
            if(quizTitleHeader) quizTitleHeader.textContent = currentDisplayTitle; 
            progressGridPage = Math.floor(currentQuestionIndex / QUESTIONS_PER_GRID_PAGE); 
            inFeedbackMode=s.inFeedbackMode; isExamMode=s.isExamMode; sessionID=s.sessionID; timeRemaining=s.timeRemaining; isQuickMode = false;  
            toggleUI('quiz'); 
            quizContainer.innerHTML = '<div style="text-align:center; padding:40px;"><div class="spinner" style="border:4px solid #f3f3f3; border-top:4px solid #3498db; border-radius:50%; width:40px; height:40px; animation:spin 1s linear infinite; margin:0 auto 20px;"></div><h3>Resuming Session...</h3></div>';
            if(nextButton) nextButton.style.display = 'none';

            const idsToFetch = shuffledQuestions.map(q => q.id);
            const fd = new URLSearchParams(); fd.append('action', 'mrcs_load_quiz_questions'); fd.append('ids', JSON.stringify(idsToFetch));
            fetch(myQuestionBank.ajax_url, { method: 'POST', body: fd })
                .then(r => r.json())
                .then(res => {
                    if (res.success && res.data) {
                        res.data.forEach(fetchedQ => { const match = shuffledQuestions.find(s => s.id == fetchedQ.id); if(match) { match.question = fetchedQ.question; match.answers = fetchedQ.answers; if(revealedAnswers[match.id]) { match.correct = revealedAnswers[match.id].correct; match.explanation = revealedAnswers[match.id].explanation; } } });
                        generateProgressGrid(); updateProgress(); showQuestion(); if(isExamMode) { timerDisplay.style.display='block'; startTimer(); } if(nextButton) nextButton.style.display = 'block';
                    }
                });
        } 

        function toggleUI(mode) { if(mode === 'menu') { if (appRoot.querySelector('#quizWrapper')) appRoot.querySelector('#quizWrapper').classList.remove('quiz-is-active'); menuContainer.style.display = 'block'; mainQuizContainer.style.display = 'none'; progressBox.style.display = 'none'; resultsContainer.style.display = 'none'; } else if (mode === 'quiz') { if (appRoot.querySelector('#quizWrapper')) appRoot.querySelector('#quizWrapper').classList.add('quiz-is-active'); menuContainer.style.display = 'none'; mainQuizContainer.style.display = 'block'; progressBox.style.display = 'block'; resultsContainer.style.display = 'none'; } } 
        function jumpToQuestion(index) { currentQuestionIndex = index; const requiredPage = Math.floor(currentQuestionIndex / QUESTIONS_PER_GRID_PAGE); if (requiredPage !== progressGridPage) { progressGridPage = requiredPage; generateProgressGrid(); } if (userAnswers[index] !== null) inFeedbackMode = true; else inFeedbackMode = false; saveQuizState(); showQuestion(); } 
        function toggleFlag() { if (flaggedIndices.includes(currentQuestionIndex)) flaggedIndices = flaggedIndices.filter(i => i !== currentQuestionIndex); else flaggedIndices.push(currentQuestionIndex); saveQuizState(); showQuestion(); updateProgress(); } 
        function showQuestion() { const q = shuffledQuestions[currentQuestionIndex]; if (!q.question) return; const aHtml = Object.entries(q.answers).map(([k,v]) => { if(!v) return ''; return `<label><input type="radio" name="question" value="${k}"><strong>${k.toUpperCase()}:</strong> ${v}</label>`; }).join(''); const isFlagged = flaggedIndices.includes(currentQuestionIndex); const flagBtnHtml = `<button id="btnFlagQuestion" class="flag-toggle-btn ${isFlagged?'active':''}">${isFlagged ? '⚑ Flagged' : '⚑ Flag for Review'}</button>`; const feedbackHtml = `<div class="question-feedback-toggle"><button type="button" class="feedback-toggle-btn" id="btnQuestionFeedback">Leave Feedback</button><div class="feedback-form" id="questionFeedbackForm" style="display:none;"><p class="feedback-help">Spot an issue or have a suggestion? Send it here.</p><label for="feedbackText">Feedback</label><textarea id="feedbackText" rows="4" placeholder="Tell us what is wrong or how to improve this question."></textarea><label for="feedbackEmail">Email (optional)</label><input id="feedbackEmail" type="email" placeholder="name@example.com" /><button type="button" class="feedback-submit-btn" id="submitQuestionFeedback">Send Feedback</button><div class="feedback-status" id="feedbackStatus"></div></div></div>`; let progressHtml = '<div class="progress-strip">'; shuffledQuestions.forEach((_, i) => { let c = 'p-seg'; if(i === currentQuestionIndex) c += ' current'; else if(userAnswers[i] !== null) { if (shuffledQuestions[i].correct) { c += (userAnswers[i] === shuffledQuestions[i].correct) ? ' correct' : ' wrong'; } else { c += ' wrong'; } } progressHtml += `<div class="${c}"></div>`; }); progressHtml += '</div>'; quizContainer.innerHTML = `${progressHtml}<div style="overflow:hidden;">${flagBtnHtml}</div><div class="question">${q.question}</div><div class="answers">${aHtml}</div>${feedbackHtml}`; const flagBtn = quizContainer.querySelector('#btnFlagQuestion'); if (flagBtn) flagBtn.addEventListener('click', toggleFlag); if(userAnswers[currentQuestionIndex]) { const inp=quizContainer.querySelector(`input[value="${userAnswers[currentQuestionIndex]}"]`); if(inp) inp.checked=true; } if(inFeedbackMode) showFeedback(true); else { immediateFeedbackArea.innerHTML=''; quizContainer.querySelectorAll('input').forEach(i=>i.disabled=false); if(nextButton) nextButton.textContent="Submit Answer"; } if(prevButton) prevButton.style.display = currentQuestionIndex > 0 ? 'block' : 'none'; if(topPrev) topPrev.disabled = (currentQuestionIndex === 0); if(submitButton) submitButton.style.display='none'; const feedbackToggle = quizContainer.querySelector('#btnQuestionFeedback'); const feedbackForm = quizContainer.querySelector('#questionFeedbackForm'); const feedbackText = quizContainer.querySelector('#feedbackText'); const feedbackEmail = quizContainer.querySelector('#feedbackEmail'); const feedbackSubmit = quizContainer.querySelector('#submitQuestionFeedback'); const feedbackStatus = quizContainer.querySelector('#feedbackStatus'); const setFeedbackStatus = (msg, type) => { if (!feedbackStatus) return; feedbackStatus.textContent = msg; feedbackStatus.classList.remove('is-error', 'is-success'); if (type === 'error') feedbackStatus.classList.add('is-error'); if (type === 'success') feedbackStatus.classList.add('is-success'); }; if (feedbackToggle && feedbackForm) { feedbackToggle.addEventListener('click', () => { const isOpen = feedbackForm.style.display === 'block'; feedbackForm.style.display = isOpen ? 'none' : 'block'; feedbackToggle.textContent = isOpen ? 'Leave Feedback' : 'Hide Feedback Form'; if (!isOpen && feedbackText) feedbackText.focus(); }); } if (feedbackSubmit) { feedbackSubmit.addEventListener('click', () => { const message = feedbackText ? feedbackText.value.trim() : ''; if (!message) { setFeedbackStatus('Please add your feedback before sending.', 'error'); return; } const emailVal = feedbackEmail ? feedbackEmail.value.trim() : ''; feedbackSubmit.disabled = true; setFeedbackStatus('Sending...', ''); const fd = new URLSearchParams(); fd.append('action', 'mrcs_submit_question_feedback'); fd.append('question_id', q.id); fd.append('feedback', message); if (emailVal) fd.append('email', emailVal); const userAns = userAnswers[currentQuestionIndex]; if (userAns) fd.append('user_answer', userAns); fetch(myQuestionBank.ajax_url, { method: 'POST', body: fd }).then(r => r.json()).then(res => { if (res.success) { setFeedbackStatus('Thanks! Your feedback has been sent.', 'success'); if (feedbackText) feedbackText.disabled = true; if (feedbackEmail) feedbackEmail.disabled = true; feedbackSubmit.disabled = true; } else { setFeedbackStatus(res.data || 'Something went wrong. Please try again.', 'error'); feedbackSubmit.disabled = false; } }).catch(() => { setFeedbackStatus('Network error. Please try again.', 'error'); feedbackSubmit.disabled = false; }); }); } const requiredPage = Math.floor(currentQuestionIndex / QUESTIONS_PER_GRID_PAGE); if (requiredPage !== progressGridPage) { progressGridPage = requiredPage; generateProgressGrid(); } updateProgress(); } 
        function handleNextOrCheck() { if(inFeedbackMode) { currentQuestionIndex++; if(currentQuestionIndex < shuffledQuestions.length) { if(userAnswers[currentQuestionIndex] !== null) inFeedbackMode = true; else inFeedbackMode = false; saveQuizState(); showQuestion(); } else finishQuiz(); } else { const sel = quizContainer.querySelector('input:checked'); if(!sel) return alert("Select an answer."); const val = sel.value; quizContainer.querySelectorAll('input').forEach(i => i.disabled = true); nextButton.textContent = "Checking..."; const fd = new URLSearchParams(); fd.append('action', 'mrcs_record_single_answer'); fd.append('question_id', shuffledQuestions[currentQuestionIndex].id); fd.append('user_answer', val); fd.append('session_id', sessionID); fetch(myQuestionBank.ajax_url, { method: 'POST', body: fd }).then(r => r.json()).then(res => { if(res.success && res.data) { const data = res.data; userAnswers[currentQuestionIndex] = val; shuffledQuestions[currentQuestionIndex].correct = data.correct_answer; shuffledQuestions[currentQuestionIndex].explanation = data.explanation; revealedAnswers[shuffledQuestions[currentQuestionIndex].id] = { correct: data.correct_answer, explanation: data.explanation }; const isCorrect = data.is_correct; if(!seenIDs.includes(shuffledQuestions[currentQuestionIndex].id.toString())) seenIDs.push(shuffledQuestions[currentQuestionIndex].id.toString()); if(!isCorrect && !wrongIDs.includes(shuffledQuestions[currentQuestionIndex].id.toString())) wrongIDs.push(shuffledQuestions[currentQuestionIndex].id.toString()); else if (isCorrect) { const idx = wrongIDs.indexOf(shuffledQuestions[currentQuestionIndex].id.toString()); if (idx > -1) wrongIDs.splice(idx, 1); } inFeedbackMode = true; showFeedback(false); saveQuizState(); updateProgress(); } else { alert("Error checking answer."); quizContainer.querySelectorAll('input').forEach(i => i.disabled = false); nextButton.textContent = "Submit Answer"; } }); } } 
        function handlePrev() { if (currentQuestionIndex > 0) { currentQuestionIndex--; inFeedbackMode = !!userAnswers[currentQuestionIndex]; saveQuizState(); showQuestion(); } } 
        function showFeedback() { const q = shuffledQuestions[currentQuestionIndex]; const val = userAnswers[currentQuestionIndex]; const isCorrect = (val === q.correct); immediateFeedbackArea.innerHTML = `<div class="question-feedback-box ${isCorrect?'correct':'incorrect'}"><div id="stats-placeholder" style="display:none;"></div><h4>${isCorrect?'Correct!':'Incorrect'}</h4><div>${q.explanation}</div></div>`; const fd = new URLSearchParams(); fd.append('action', 'mrcs_get_question_stats'); fd.append('qid', q.id); fetch(myQuestionBank.ajax_url, { method: 'POST', body: fd }).then(r => r.json()).then(res => { if(res.success && res.data) { const stats = res.data.percentages; const correctPct = stats[q.correct] || 0; const ph = immediateFeedbackArea.querySelector('#stats-placeholder'); if(ph) { ph.style.display = 'block'; let chartHtml = `<div class="stats-chart-box"><div class="stats-header"><span>Poll Results</span><span class="pass-rate-badge">Global Pass Rate: ${correctPct}%</span></div>`; ['a','b','c','d','e'].forEach(key => { if (q.answers[key]) { const pct = stats[key] || 0; const isCorrectBar = (key === q.correct); const isUserWrong = (key === val && !isCorrect && !isCorrectBar); let fillClass = ''; if(isCorrectBar) fillClass = 'is-correct-bar'; else if(isUserWrong) fillClass = 'is-user-wrong'; chartHtml += `<div class="chart-row"><div class="chart-label">${key.toUpperCase()}</div><div class="chart-track"><div class="chart-fill ${fillClass}" style="width: ${pct}%"></div></div><div class="chart-pct">${pct}%</div></div>`; } }); chartHtml += `</div>`; ph.innerHTML = chartHtml; } } }); quizContainer.querySelectorAll('input').forEach(i => i.disabled = true); quizContainer.querySelectorAll('input').forEach(i => { const lbl = i.parentElement; if(i.value === q.correct) lbl.classList.add('is-correct'); if(i.value === val && !isCorrect) lbl.classList.add('is-incorrect'); }); if(nextButton) nextButton.textContent = (currentQuestionIndex === shuffledQuestions.length - 1) ? "Finish Session" : "Next Question"; } 
        function saveQuizState() { const s = { shuffledIDs: shuffledQuestions.map(q=>q.id), currentQuestionIndex, userAnswers, inFeedbackMode, isExamMode, timeRemaining, sessionID, flaggedIndices, displayTitle: currentDisplayTitle, revealedAnswers }; if (isQuickMode) { localStorage.setItem(quickStorageKey, JSON.stringify(s)); } else { localStorage.setItem(storageKey, JSON.stringify(s)); if (useServerSession) { const fd = new URLSearchParams(); fd.append('action', 'mrcs_save_session'); fd.append('data', JSON.stringify(s)); fetch(myQuestionBank.ajax_url, { method: 'POST', body: fd, keepalive: true }); } } } 
        function loadQuizState() { if(useServerSession && myQuestionBank.saved_session) return typeof myQuestionBank.saved_session === 'string' ? JSON.parse(myQuestionBank.saved_session) : myQuestionBank.saved_session; const ls = localStorage.getItem(storageKey); return ls ? JSON.parse(ls) : null; } 
        function clearQuizState() { if (isQuickMode) { localStorage.removeItem(quickStorageKey); } else { localStorage.removeItem(storageKey); if (useServerSession) { const fd = new URLSearchParams(); fd.append('action', 'mrcs_clear_session'); fetch(myQuestionBank.ajax_url, {method:'POST', body:fd}); } } } 
        function startTimer() { if(timerInterval) clearInterval(timerInterval); updateTimerUI(); timerInterval = setInterval(()=>{ timeRemaining--; if(timeRemaining%5===0) saveQuizState(); updateTimerUI(); if(timeRemaining<=0) finishQuiz(); }, 1000); } 
        function updateTimerUI() { const m=Math.floor(timeRemaining/60); const s=timeRemaining%60; if(timerDisplay) timerDisplay.textContent=`${m}:${s<10?'0':''}${s}`; } 
        function generateProgressGrid() { if(!visualGridContainer) return; visualGridContainer.innerHTML = ''; const mapWrapper = visualGridContainer.parentElement; if(mapWrapper) mapWrapper.style.display = 'block'; const totalQs = shuffledQuestions.length; const totalPages = Math.ceil(totalQs / QUESTIONS_PER_GRID_PAGE); if (progressGridPage >= totalPages) progressGridPage = totalPages - 1; if (progressGridPage < 0) progressGridPage = 0; const startIndex = progressGridPage * QUESTIONS_PER_GRID_PAGE; const endIndex = Math.min(startIndex + QUESTIONS_PER_GRID_PAGE, totalQs); for (let i = startIndex; i < endIndex; i++) { const dot = document.createElement('div'); dot.className = 'progress-dot'; dot.textContent = i + 1; dot.id = progressDotPrefix + i; dot.style.cursor = 'pointer'; dot.addEventListener('click', () => { jumpToQuestion(i); }); visualGridContainer.appendChild(dot); } if (totalQs > QUESTIONS_PER_GRID_PAGE) { const controls = document.createElement('div'); controls.className = 'grid-pagination'; controls.innerHTML = `<button class="grid-page-btn" id="gridPrev" ${progressGridPage === 0 ? 'disabled' : ''}>←</button><span class="grid-page-info">Page ${progressGridPage + 1} / ${totalPages}</span><button class="grid-page-btn" id="gridNext" ${progressGridPage === totalPages - 1 ? 'disabled' : ''}>→</button>`; visualGridContainer.appendChild(controls); visualGridContainer.querySelector('#gridPrev').onclick = (e) => { e.stopPropagation(); progressGridPage--; generateProgressGrid(); updateProgress(); }; visualGridContainer.querySelector('#gridNext').onclick = (e) => { e.stopPropagation(); progressGridPage++; generateProgressGrid(); updateProgress(); }; } } 
        function updateProgress() { if(appRoot.querySelector('#currentQ')) appRoot.querySelector('#currentQ').textContent = currentQuestionIndex + 1; if(appRoot.querySelector('#totalQ')) appRoot.querySelector('#totalQ').textContent = shuffledQuestions.length; let c=0, w=0; userAnswers.forEach((ans, i) => { if(ans!==null) { if(shuffledQuestions[i].correct === ans) c++; else w++; } }); if(appRoot.querySelector('#correctDisplay')) appRoot.querySelector('#correctDisplay').textContent = c; if(appRoot.querySelector('#wrongDisplay')) appRoot.querySelector('#wrongDisplay').textContent = w; const acc = (c+w)>0 ? Math.round((c/(c+w))*100) : 0; if(appRoot.querySelector('#accuracyDisplay')) appRoot.querySelector('#accuracyDisplay').textContent = acc+'%'; if(appRoot.querySelector('#progressBar')) appRoot.querySelector('#progressBar').style.width = ((currentQuestionIndex+1)/shuffledQuestions.length)*100 + '%'; if(visualGridContainer && visualGridContainer.style.display !== 'none') { visualGridContainer.querySelectorAll('.progress-dot').forEach(d => { d.classList.remove('is-active'); d.classList.remove('is-flagged'); d.classList.remove('is-correct'); d.classList.remove('is-wrong'); }); const currentDot = visualGridContainer.querySelector('#' + progressDotPrefix + currentQuestionIndex); if(currentDot) currentDot.classList.add('is-active'); flaggedIndices.forEach(idx => { const dot = visualGridContainer.querySelector('#' + progressDotPrefix + idx); if(dot) dot.classList.add('is-flagged'); }); userAnswers.forEach((ans, i) => { const dot = visualGridContainer.querySelector('#' + progressDotPrefix + i); if(dot && ans !== null) { if(shuffledQuestions[i].correct) { if(shuffledQuestions[i].correct === ans) { dot.classList.add('is-correct'); } else { dot.classList.add('is-wrong'); } } else { dot.classList.add('is-wrong'); } } }); } } 
        function finishQuiz() { clearQuizState(); if(timerInterval) clearInterval(timerInterval); mainQuizContainer.style.display='none'; progressBox.style.display='none'; resultsContainer.style.display='block'; let fc=0; userAnswers.forEach((ans, i) => { if(ans === shuffledQuestions[i].correct) fc++; }); resultsContainer.innerHTML = `<h3>Session Complete</h3><p>You scored ${fc} out of ${shuffledQuestions.length} (${Math.round((fc/shuffledQuestions.length)*100)}%)</p><button onclick="location.reload()" style="margin-top:15px; padding:10px 25px; background:#0078D7; color:white; border:none; border-radius:50px; cursor:pointer;">Start New Session</button>`; const payload = { quizName: currentDisplayTitle, correct:fc, wrong:shuffledQuestions.length-fc, total:shuffledQuestions.length, percentage:Math.round((fc/shuffledQuestions.length)*100), detailed_answers:[] }; fetch(myQuestionBank.ajax_url, {method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body:new URLSearchParams({action:'save_user_quiz_progress', data:JSON.stringify(payload)})}); } 
        if(nextButton) nextButton.addEventListener('click', handleNextOrCheck); if(topNext) topNext.addEventListener('click', handleNextOrCheck); if(prevButton) prevButton.addEventListener('click', handlePrev); if(topPrev) topPrev.addEventListener('click', handlePrev); if (backToMenuBtn) { backToMenuBtn.addEventListener('click', function() { if (confirm("Exit quiz? Your progress is saved to resume later.")) { saveQuizState(); toggleUI('menu'); renderMainMenu(); } }); } 
        
        // --- 4. START DASHBOARD ---
        renderMainMenu(); 
        
        // --- 5. TRIGGER INITIAL ANIMATION ---
        animateDonuts(); 
    }

    const qbankRoots = document.querySelectorAll('.mrcs-qbank-app, #mrcs_qbank_app');
    if (typeof myQuestionBank !== 'undefined' && qbankRoots.length) {
        qbankRoots.forEach((appRoot, instanceIndex) => {
            initMrcsQbank(appRoot, instanceIndex);
        });
    }
});
