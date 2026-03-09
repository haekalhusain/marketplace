/**
 * Song Statistics Extension
 * Shows play counts and listening stats
 */
(function() {
  'use strict';

  let statsWidget = null;

  function init() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;

    statsWidget = document.createElement('div');
    statsWidget.id = 'song-stats-widget';
    statsWidget.style.cssText = `
      padding: 16px; border-top: 1px solid var(--border);
      margin-top: auto;
    `;
    statsWidget.innerHTML = `
      <div style="font-size:11px;font-weight:700;letter-spacing:1px;color:var(--text2);margin-bottom:10px;text-transform:uppercase;">Statistik</div>
      <div id="stats-content" style="font-size:12px;color:var(--text2);line-height:1.8;">
        <div>⏱ Memuat...</div>
      </div>
    `;
    sidebar.appendChild(statsWidget);
    loadStats();

    // Update when song changes
    const audio = document.getElementById('audio');
    if (audio) audio.addEventListener('play', () => setTimeout(loadStats, 500));
  }

  function loadStats() {
    fetch('/songs/search?q=')
      .catch(() => {})
      .then(() => {
        const current = window.MusicPlayer?.getCurrent?.();
        const content = document.getElementById('stats-content');
        if (!content) return;

        if (current) {
          content.innerHTML = `
            <div style="color:var(--text);font-weight:600;margin-bottom:4px;">${esc(current.title)}</div>
            <div>🎵 ${esc(current.artist)}</div>
            <div style="margin-top:6px;padding-top:6px;border-top:1px solid var(--border);">
              <div>Queue aktif</div>
            </div>
          `;
        } else {
          content.innerHTML = '<div>Belum ada lagu diputar</div>';
        }
      });
  }

  function esc(s) { return (s||'').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  function destroy() {
    if (statsWidget) statsWidget.remove();
  }

  window.MusicPlayerExtensions = window.MusicPlayerExtensions || {};
  window.MusicPlayerExtensions['song-stats'] = { init, destroy };

  init();
})();
