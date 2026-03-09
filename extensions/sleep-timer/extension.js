/**
 * Sleep Timer Extension
 * Stop playback after X minutes
 */
(function() {
  'use strict';

  let timerId = null;
  let endTime = null;
  let timerDisplay = null;

  function init() {
    // Add sleep timer button to player bar
    const playerRight = document.querySelector('.player-right');
    if (!playerRight) return;

    const btn = document.createElement('button');
    btn.id = 'btn-sleep-timer';
    btn.title = 'Sleep Timer';
    btn.className = 'ctrl-btn';
    btn.style.fontSize = '13px';
    btn.innerHTML = '<i class="fas fa-moon"></i>';
    playerRight.insertBefore(btn, playerRight.firstChild);

    // Timer display
    timerDisplay = document.createElement('span');
    timerDisplay.id = 'sleep-timer-display';
    timerDisplay.style.cssText = 'font-size:11px;color:var(--text2);margin-right:4px;display:none;';
    playerRight.insertBefore(timerDisplay, btn);

    btn.addEventListener('click', showTimerMenu);
  }

  function showTimerMenu() {
    // Remove existing menu
    const existing = document.getElementById('sleep-timer-menu');
    if (existing) { existing.remove(); return; }

    const menu = document.createElement('div');
    menu.id = 'sleep-timer-menu';
    menu.style.cssText = `
      position: fixed; bottom: 90px; right: 20px;
      background: var(--card); border: 1px solid var(--border);
      border-radius: 8px; padding: 12px; z-index: 9999;
      min-width: 160px; box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    `;

    const options = [5, 10, 15, 30, 45, 60];
    menu.innerHTML = `<div style="font-size:13px;font-weight:600;color:var(--text);margin-bottom:8px;">Sleep Timer</div>`;

    options.forEach(min => {
      const opt = document.createElement('div');
      opt.style.cssText = 'padding:6px 8px;cursor:pointer;border-radius:4px;font-size:13px;color:var(--text2);';
      opt.textContent = min + ' minutes';
      opt.addEventListener('mouseenter', () => opt.style.background = 'var(--hover)');
      opt.addEventListener('mouseleave', () => opt.style.background = '');
      opt.addEventListener('click', () => { setTimer(min); menu.remove(); });
      menu.appendChild(opt);
    });

    if (timerId) {
      const cancel = document.createElement('div');
      cancel.style.cssText = 'padding:6px 8px;cursor:pointer;border-radius:4px;font-size:13px;color:#ff6b6b;margin-top:4px;border-top:1px solid var(--border);';
      cancel.textContent = 'Cancel timer';
      cancel.addEventListener('click', () => { cancelTimer(); menu.remove(); });
      menu.appendChild(cancel);
    }

    document.body.appendChild(menu);
    document.addEventListener('click', function closeMenu(e) {
      if (!menu.contains(e.target) && e.target.id !== 'btn-sleep-timer') {
        menu.remove(); document.removeEventListener('click', closeMenu);
      }
    });
  }

  function setTimer(minutes) {
    cancelTimer();
    endTime = Date.now() + minutes * 60 * 1000;
    timerDisplay.style.display = 'inline';
    const btn = document.getElementById('btn-sleep-timer');
    if (btn) { btn.style.color = 'var(--green)'; }

    timerId = setInterval(() => {
      const remaining = endTime - Date.now();
      if (remaining <= 0) {
        const audio = document.getElementById('audio');
        if (audio) audio.pause();
        cancelTimer();
        return;
      }
      const m = Math.floor(remaining / 60000);
      const s = Math.floor((remaining % 60000) / 1000);
      timerDisplay.textContent = m + ':' + (s < 10 ? '0' : '') + s;
    }, 1000);
  }

  function cancelTimer() {
    if (timerId) { clearInterval(timerId); timerId = null; }
    endTime = null;
    if (timerDisplay) timerDisplay.style.display = 'none';
    const btn = document.getElementById('btn-sleep-timer');
    if (btn) btn.style.color = '';
  }

  function destroy() {
    cancelTimer();
    const btn = document.getElementById('btn-sleep-timer');
    if (btn) btn.remove();
    if (timerDisplay) timerDisplay.remove();
  }

  window.MusicPlayerExtensions = window.MusicPlayerExtensions || {};
  window.MusicPlayerExtensions['sleep-timer'] = { init, destroy };

  init();
})();
