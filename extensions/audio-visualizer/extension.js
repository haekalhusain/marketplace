/**
 * Audio Visualizer Extension
 * Real-time frequency bars that react to music
 */
(function() {
  'use strict';

  const STORAGE_KEY = 'ext_visualizer_enabled';
  let canvas, ctx, analyser, source, animId;
  let audioCtx = null;

  function init() {
    // Create canvas
    canvas = document.createElement('canvas');
    canvas.id = 'audio-visualizer';
    canvas.style.cssText = `
      position: fixed;
      bottom: 80px;
      left: 0; right: 0;
      height: 60px;
      width: 100%;
      pointer-events: none;
      z-index: 99;
      opacity: 0.6;
    `;
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');

    const audio = document.getElementById('audio');
    if (!audio) return;

    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 128;
    source = audioCtx.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);

    draw();

    audio.addEventListener('play', () => { if (audioCtx.state === 'suspended') audioCtx.resume(); });
  }

  function draw() {
    animId = requestAnimationFrame(draw);
    canvas.width = window.innerWidth;

    const bufLen = analyser.frequencyBinCount;
    const data   = new Uint8Array(bufLen);
    analyser.getByteFrequencyData(data);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const barW = (canvas.width / bufLen) * 2.5;
    let x = 0;

    const accent = getComputedStyle(document.documentElement).getPropertyValue('--green').trim() || '#1db954';

    for (let i = 0; i < bufLen; i++) {
      const barH = (data[i] / 255) * canvas.height;
      const alpha = 0.4 + (data[i] / 255) * 0.6;
      ctx.fillStyle = accent;
      ctx.globalAlpha = alpha;
      ctx.fillRect(x, canvas.height - barH, barW - 1, barH);
      x += barW + 1;
    }
    ctx.globalAlpha = 1;
  }

  function destroy() {
    if (animId) cancelAnimationFrame(animId);
    if (canvas) canvas.remove();
    if (audioCtx) audioCtx.close();
  }

  // Register with marketplace
  window.MusicPlayerExtensions = window.MusicPlayerExtensions || {};
  window.MusicPlayerExtensions['audio-visualizer'] = { init, destroy };

  init();
})();
