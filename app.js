/**
 * CYBER_CHRONO // TECHNO POMODORO ENGINE
 * Web Audio API Synth, State Management & AdSense / Privacy Modal Support
 */

(function () {
  'use strict';

  // --- 定数 ---
  const WORK_TIME_DEFAULT = 25 * 60; // 25分
  const BREAK_TIME_DEFAULT = 5 * 60;  // 5分
  const WORK_TIME_TEST = 10;         // テスト用 10秒
  const BREAK_TIME_TEST = 5;          // テスト用 5秒

  const CIRCLE_RADIUS = 140;
  const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS; // ≈ 879.64

  // --- 状態変数 ---
  let mode = 'work'; // 'work' | 'break'
  let isRunning = false;
  let timerInterval = null;
  let testMode = false;

  let workDuration = WORK_TIME_DEFAULT;
  let breakDuration = BREAK_TIME_DEFAULT;
  let totalDuration = workDuration;
  let timeLeft = workDuration;

  let sessionCount = 0;
  let soundEnabled = true;
  let autoSwitch = true; // デフォルトで自動シーケンスON（25分作業後、自動で5分休憩開始）

  // --- DOM要素 ---
  const body = document.body;
  const statusText = document.getElementById('statusText');
  const missionInput = document.getElementById('missionInput');
  const missionClearBtn = document.getElementById('missionClearBtn');

  const modeWorkBtn = document.getElementById('modeWorkBtn');
  const modeBreakBtn = document.getElementById('modeBreakBtn');

  const progressCircle = document.getElementById('progressCircle');
  const modeCaption = document.getElementById('modeCaption');
  const timeDigits = document.getElementById('timeDigits');
  const percentDisplay = document.getElementById('percentDisplay');

  const sessionCountEl = document.getElementById('sessionCount');
  const sessionDotsEl = document.getElementById('sessionDots');
  const resetSessionsBtn = document.getElementById('resetSessionsBtn');

  const startPauseBtn = document.getElementById('startPauseBtn');
  const startPauseText = document.getElementById('startPauseText');
  const skipBtn = document.getElementById('skipBtn');
  const resetTimerBtn = document.getElementById('resetTimerBtn');

  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const soundStatusText = document.getElementById('soundStatusText');
  const autoSwitchToggleBtn = document.getElementById('autoSwitchToggleBtn');
  const autoSwitchStatusText = document.getElementById('autoSwitchStatusText');
  const quickTestBtn = document.getElementById('quickTestBtn');
  const testModeStatusText = document.getElementById('testModeStatusText');

  // 広告要素
  const adContainer = document.getElementById('adContainer');
  const adHeaderLabel = document.getElementById('adHeaderLabel');
  const adHeaderSub = document.getElementById('adHeaderSub');

  // プライバシーモーダル要素
  const privacyBtn = document.getElementById('privacyBtn');
  const privacyModal = document.getElementById('privacyModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalConfirmBtn = document.getElementById('modalConfirmBtn');

  // --- Web Audio API シンセサイザー ---
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // SFクリック音
  function playClickSound() {
    if (!soundEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.04);
    } catch (e) {}
  }

  // 起動・スタート音（サイバーアルペジオ）
  function playStartSound() {
    if (!soundEnabled || !audioCtx) return;
    try {
      const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.07);
        gain.gain.setValueAtTime(0.18, audioCtx.currentTime + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.07 + 0.2);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + idx * 0.07);
        osc.stop(audioCtx.currentTime + idx * 0.07 + 0.22);
      });
    } catch (e) {}
  }

  // 一時停止音
  function playPauseSound() {
    if (!soundEnabled || !audioCtx) return;
    try {
      const notes = [659.25, 440];
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.08 + 0.15);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + idx * 0.08);
        osc.stop(audioCtx.currentTime + idx * 0.08 + 0.16);
      });
    } catch (e) {}
  }

  // 作業完了ファンファーレ（サイバー調）
  function playWorkCompleteSound() {
    if (!soundEnabled || !audioCtx) return;
    try {
      const chords = [
        { freq: 523.25, time: 0 },    // C5
        { freq: 659.25, time: 0.12 }, // E5
        { freq: 783.99, time: 0.24 }, // G5
        { freq: 1046.50, time: 0.36 },// C6
        { freq: 1318.51, time: 0.52 } // E6
      ];
      chords.forEach(note => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(note.freq, audioCtx.currentTime + note.time);
        gain.gain.setValueAtTime(0.25, audioCtx.currentTime + note.time);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + note.time + 0.45);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + note.time);
        osc.stop(audioCtx.currentTime + note.time + 0.5);
      });
    } catch (e) {}
  }

  // 休憩完了アラーム（警告＋チャージ音）
  function playBreakCompleteSound() {
    if (!soundEnabled || !audioCtx) return;
    try {
      const beeps = [0, 0.18, 0.36];
      beeps.forEach(delay => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + delay);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + delay + 0.12);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + delay);
        osc.stop(audioCtx.currentTime + delay + 0.13);
      });
    } catch (e) {}
  }

  // --- 初期化 & ローカルストレージ復元 ---
  function loadStoredData() {
    try {
      const savedCount = localStorage.getItem('cyber_session_count');
      if (savedCount !== null) {
        sessionCount = parseInt(savedCount, 10) || 0;
      }
      const savedMission = localStorage.getItem('cyber_mission');
      if (savedMission && missionInput) {
        missionInput.value = savedMission;
      }
      const savedAudio = localStorage.getItem('cyber_audio');
      if (savedAudio !== null) {
        soundEnabled = savedAudio === 'true';
        updateAudioBtnState();
      }
      const savedAuto = localStorage.getItem('cyber_autoswitch');
      if (savedAuto !== null) {
        autoSwitch = savedAuto === 'true';
      } else {
        autoSwitch = true; // 初回デフォルトON
      }
      updateAutoSwitchBtnState();
    } catch (e) {
      console.warn('LocalStorage access warning:', e);
    }
  }

  function saveStoredData() {
    try {
      localStorage.setItem('cyber_session_count', sessionCount.toString());
      localStorage.setItem('cyber_mission', missionInput.value);
      localStorage.setItem('cyber_audio', soundEnabled.toString());
      localStorage.setItem('cyber_autoswitch', autoSwitch.toString());
    } catch (e) {}
  }

  // --- 表示の更新 ---
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  function updateDisplay() {
    const formatted = formatTime(timeLeft);
    timeDigits.textContent = formatted;

    // 円形プログレスバーの更新
    const progressRatio = totalDuration > 0 ? (timeLeft / totalDuration) : 0;
    const offset = CIRCLE_CIRCUMFERENCE * (1 - progressRatio);
    progressCircle.style.strokeDasharray = CIRCLE_CIRCUMFERENCE;
    progressCircle.style.strokeDashoffset = offset;

    const percent = Math.round(progressRatio * 100);
    percentDisplay.textContent = `${percent}% REMAINING`;

    // セッションカウント表示
    sessionCountEl.textContent = sessionCount.toString().padStart(2, '0');
    renderSessionDots();

    // ブラウザタブタイトル
    const modeLabel = mode === 'work' ? 'WORK' : 'REST';
    document.title = `[${formatted}] ${modeLabel} // CYBER_CHRONO`;
  }

  function renderSessionDots() {
    sessionDotsEl.innerHTML = '';
    const currentCycleSlot = sessionCount % 4;
    for (let i = 0; i < 4; i++) {
      const dot = document.createElement('div');
      dot.className = 'dot-slot';
      if (sessionCount > 0 && (i < currentCycleSlot || (currentCycleSlot === 0 && sessionCount >= 4))) {
        dot.classList.add('filled');
      }
      sessionDotsEl.appendChild(dot);
    }
  }

  function updateStatus(text) {
    statusText.textContent = text;
  }

  function updateAudioBtnState() {
    if (soundEnabled) {
      soundToggleBtn.classList.add('active');
      soundStatusText.textContent = 'ON';
    } else {
      soundToggleBtn.classList.remove('active');
      soundStatusText.textContent = 'MUTED';
    }
  }

  function updateAutoSwitchBtnState() {
    if (autoSwitch) {
      autoSwitchToggleBtn.classList.add('active');
      autoSwitchStatusText.textContent = 'ON';
    } else {
      autoSwitchToggleBtn.classList.remove('active');
      autoSwitchStatusText.textContent = 'OFF';
    }
  }

  // --- 広告エリアの休憩時強調表示制御 ---
  function updateAdState(isBreak) {
    if (!adContainer) return;
    if (isBreak) {
      adContainer.classList.add('break-active');
      if (adHeaderLabel) adHeaderLabel.textContent = '// BREAK PROTOCOL // RECOMMENDED SPONSOR';
      if (adHeaderSub) adHeaderSub.textContent = 'RELAX & DISCOVER';
    } else {
      adContainer.classList.remove('break-active');
      if (adHeaderLabel) adHeaderLabel.textContent = '// SPONSORED TRANSMISSION';
      if (adHeaderSub) adHeaderSub.textContent = 'SYSTEM SUPPORT FEED';
    }
  }

  // --- モード切替 ---
  function setMode(newMode, resetTimer = true) {
    mode = newMode;
    if (mode === 'work') {
      body.classList.remove('mode-break');
      body.classList.add('mode-work');
      modeWorkBtn.classList.add('active');
      modeBreakBtn.classList.remove('active');
      modeCaption.textContent = 'PHASE: WORK FOCUS';
      totalDuration = workDuration;
      updateAdState(false);
    } else {
      body.classList.remove('mode-work');
      body.classList.add('mode-break');
      modeWorkBtn.classList.remove('active');
      modeBreakBtn.classList.add('active');
      modeCaption.textContent = 'PHASE: REST INTERVAL';
      totalDuration = breakDuration;
      updateAdState(true);
    }

    if (resetTimer) {
      pauseTimer();
      timeLeft = totalDuration;
      updateDisplay();
      updateStatus('ONLINE // READY');
    }
  }

  // --- タイマー制御 ---
  function startTimer() {
    initAudio();
    if (isRunning) return;

    isRunning = true;
    startPauseBtn.classList.add('running');
    startPauseText.textContent = 'HALT';
    updateStatus(mode === 'work' ? 'ENGAGED // FOCUS' : 'ENGAGED // REST');
    playStartSound();

    const startTime = Date.now();
    const initialTimeLeft = timeLeft;

    timerInterval = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      timeLeft = Math.max(0, initialTimeLeft - elapsedSeconds);
      updateDisplay();

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        isRunning = false;
        startPauseBtn.classList.remove('running');
        startPauseText.textContent = 'INITIALIZE';
        handleTimerCompletion();
      }
    }, 250);
  }

  function pauseTimer() {
    if (!isRunning) return;
    clearInterval(timerInterval);
    timerInterval = null;
    isRunning = false;
    startPauseBtn.classList.remove('running');
    startPauseText.textContent = 'RESUME';
    updateStatus('PAUSED // STANDBY');
    playPauseSound();
  }

  function toggleStartPause() {
    initAudio();
    playClickSound();
    if (isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  }

  function resetCurrentTimer() {
    initAudio();
    playClickSound();
    pauseTimer();
    timeLeft = totalDuration;
    startPauseText.textContent = 'INITIALIZE';
    updateDisplay();
    updateStatus('REBOOTED // READY');
  }

  function skipPhase() {
    initAudio();
    playClickSound();
    pauseTimer();
    if (mode === 'work') {
      setMode('break', true);
    } else {
      setMode('work', true);
    }
    updateStatus('PHASE SKIPPED');
  }

  function handleTimerCompletion() {
    if (mode === 'work') {
      sessionCount++;
      saveStoredData();
      updateDisplay();
      playWorkCompleteSound();
      updateStatus('FOCUS COMPLETE // AUTO-INITIATING BREAK');

      sendNotification('MISSION ACCOMPLISHED', 'Work session complete! 5-minute break initiated.');

      // 広告エリアを休憩モードとして強調出現！
      updateAdState(true);

      // 1.2秒の完了ファンファーレ余韻後、自動的に5分休憩タイマーを開始
      setTimeout(() => {
        setMode('break', true);
        startTimer();
      }, 1200);
    } else {
      // 休憩完了
      playBreakCompleteSound();
      updateStatus('REST COMPLETE // READY FOR NEXT MISSION');
      sendNotification('SYSTEM RECHARGED', 'Break session ended. Ready to resume next focus mission?');

      // 広告を通常表示に戻す
      updateAdState(false);

      if (autoSwitch) {
        setTimeout(() => {
          setMode('work', true);
          startTimer();
        }, 1500);
      } else {
        setTimeout(() => {
          setMode('work', true);
        }, 2000);
      }
    }
  }

  // デスクトップ通知サポート
  function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }

  function sendNotification(title, bodyText) {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, { body: bodyText });
      } catch (e) {}
    }
  }

  // --- プライバシーポリシー モーダル制御 ---
  function openPrivacyModal() {
    initAudio();
    playClickSound();
    privacyModal.classList.add('open');
    privacyModal.setAttribute('aria-hidden', 'false');
  }

  function closePrivacyModal() {
    initAudio();
    playClickSound();
    privacyModal.classList.remove('open');
    privacyModal.setAttribute('aria-hidden', 'true');
  }

  // --- イベントリスナー設定 ---
  startPauseBtn.addEventListener('click', toggleStartPause);
  resetTimerBtn.addEventListener('click', resetCurrentTimer);
  skipBtn.addEventListener('click', skipPhase);

  modeWorkBtn.addEventListener('click', () => {
    initAudio();
    playClickSound();
    setMode('work', true);
  });

  modeBreakBtn.addEventListener('click', () => {
    initAudio();
    playClickSound();
    setMode('break', true);
  });

  resetSessionsBtn.addEventListener('click', () => {
    initAudio();
    playClickSound();
    if (confirm('RESET SESSION COUNTER TO ZERO?')) {
      sessionCount = 0;
      saveStoredData();
      updateDisplay();
      updateStatus('SESSIONS PURGED // ZEROED');
    }
  });

  // サウンド切り替え
  soundToggleBtn.addEventListener('click', () => {
    initAudio();
    soundEnabled = !soundEnabled;
    updateAudioBtnState();
    saveStoredData();
    if (soundEnabled) playClickSound();
  });

  // 自動シーケンス切り替え
  autoSwitchToggleBtn.addEventListener('click', () => {
    initAudio();
    playClickSound();
    autoSwitch = !autoSwitch;
    updateAutoSwitchBtnState();
    saveStoredData();
  });

  // テストモード切り替え（10秒作業/5秒休憩）
  quickTestBtn.addEventListener('click', () => {
    initAudio();
    playClickSound();
    testMode = !testMode;
    if (testMode) {
      workDuration = WORK_TIME_TEST;
      breakDuration = BREAK_TIME_TEST;
      quickTestBtn.classList.add('active');
      testModeStatusText.textContent = 'ON (10s/5s)';
    } else {
      workDuration = WORK_TIME_DEFAULT;
      breakDuration = BREAK_TIME_DEFAULT;
      quickTestBtn.classList.remove('active');
      testModeStatusText.textContent = 'OFF';
    }
    setMode(mode, true);
  });

  // ミッション入力
  missionInput.addEventListener('input', () => {
    saveStoredData();
  });

  missionClearBtn.addEventListener('click', () => {
    missionInput.value = '';
    saveStoredData();
  });

  // プライバシーモーダルイベント
  privacyBtn.addEventListener('click', openPrivacyModal);
  modalCloseBtn.addEventListener('click', closePrivacyModal);
  modalConfirmBtn.addEventListener('click', closePrivacyModal);
  privacyModal.addEventListener('click', (e) => {
    if (e.target === privacyModal) {
      closePrivacyModal();
    }
  });

  // キーボードショートカット
  window.addEventListener('keydown', (e) => {
    // モーダルが開いている時はESCで閉じる
    if (privacyModal.classList.contains('open')) {
      if (e.code === 'Escape') {
        closePrivacyModal();
      }
      return;
    }

    // 入力欄にフォーカスがある時はショートカット無効
    if (document.activeElement === missionInput) return;

    if (e.code === 'Space') {
      e.preventDefault();
      toggleStartPause();
    } else if (e.code === 'KeyR') {
      resetCurrentTimer();
    } else if (e.code === 'KeyS') {
      skipPhase();
    }
  });

  // 初回インタラクションでオーディオと通知初期化
  window.addEventListener('click', () => {
    initAudio();
    requestNotificationPermission();
  }, { once: true });

  // --- アプリケーション起動 ---
  loadStoredData();
  setMode('work', true);
})();
