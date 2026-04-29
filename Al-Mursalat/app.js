(function () {
  const ayahs = SURAH_DATA.ayahs;
  let currentAudio = null;
  let playAllIndex = -1;
  let playAllActive = false;

  // ========== NAVIGATION ==========
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.mode-section').forEach(s => s.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('mode-' + btn.dataset.mode).classList.add('active');
    });
  });

  // ========== AUDIO HELPERS ==========
  let selectedReciter = 'Alafasy_128kbps';

  function getAudioUrl(ayahNum) {
    const num = String(ayahNum).padStart(3, '0');
    return 'https://everyayah.com/data/' + selectedReciter + '/077' + num + '.mp3';
  }

  function clearCurrentAudio() {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }
    document.querySelectorAll('.ayah-card.playing').forEach(c => c.classList.remove('playing'));
  }

  function stopAudio() {
    clearCurrentAudio();
    playAllActive = false;
    document.getElementById('playAllBtn').innerHTML = '&#9654; Play All';
  }

  function playAyah(num, onEnd) {
    clearCurrentAudio();
    const url = getAudioUrl(num);
    currentAudio = new Audio(url);
    const speed = parseFloat(document.getElementById('playbackSpeed').value);
    currentAudio.playbackRate = speed;
    const card = document.getElementById('listen-ayah-' + num);
    if (card) {
      card.classList.add('playing');
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    currentAudio.addEventListener('ended', () => {
      if (card) card.classList.remove('playing');
      if (onEnd) onEnd();
    });
    currentAudio.addEventListener('error', () => {
      if (card) card.classList.remove('playing');
      if (onEnd) onEnd();
    });
    currentAudio.play().catch(() => {
      if (card) card.classList.remove('playing');
      if (onEnd) onEnd();
    });
  }

  // ========== LISTEN & FOLLOW ==========
  function initListen() {
    const list = document.getElementById('listenAyahList');
    list.innerHTML = ayahs.map(a => `
      <div class="ayah-card" id="listen-ayah-${a.number}">
        <div class="ayah-number">${a.number}</div>
        <div class="ayah-content">
          <div class="ayah-arabic arabic">
            ${a.words.map((w, i) => `<span class="word" data-ayah="${a.number}" data-widx="${i}">${w.arabic}</span>`).join(' ')}
          </div>
          <div class="ayah-translation">${a.translation}</div>
        </div>
        <button class="ayah-play-btn" data-ayah="${a.number}" title="Play ayah ${a.number}">&#9654;</button>
      </div>
    `).join('');

    list.addEventListener('click', e => {
      const playBtn = e.target.closest('.ayah-play-btn');
      if (playBtn) {
        stopAudio();
        playAyah(parseInt(playBtn.dataset.ayah));
        return;
      }
      const word = e.target.closest('.word');
      if (word) {
        const ayahNum = parseInt(word.dataset.ayah);
        const widx = parseInt(word.dataset.widx);
        const ayah = ayahs[ayahNum - 1];
        document.querySelectorAll(`#listen-ayah-${ayahNum} .word`).forEach(w => w.classList.remove('highlighted'));
        word.classList.add('highlighted');
        const tooltip = ayah.words[widx].english;
        word.title = tooltip;
      }
    });

    document.getElementById('playAllBtn').addEventListener('click', () => {
      if (playAllActive) {
        stopAudio();
        return;
      }
      playAllActive = true;
      document.getElementById('playAllBtn').innerHTML = '&#9632; Pause';
      playAllIndex = 0;
      playNext();
    });

    document.getElementById('stopBtn').addEventListener('click', stopAudio);

    function playNext() {
      if (!playAllActive || playAllIndex >= ayahs.length) {
        stopAudio();
        return;
      }
      playAyah(ayahs[playAllIndex].number, () => {
        playAllIndex++;
        playNext();
      });
    }
  }

  // ========== WORD ASSOCIATION ==========
  let assocCurrentAyah = 0;

  function initAssociation() {
    const select = document.getElementById('assocAyahSelect');
    select.innerHTML = ayahs.map(a => `<option value="${a.number}">Ayah ${a.number}: ${a.arabic.substring(0, 30)}...</option>`).join('');

    select.addEventListener('change', () => loadAssocAyah(parseInt(select.value)));
    document.getElementById('assocPrev').addEventListener('click', () => {
      if (assocCurrentAyah > 1) {
        select.value = assocCurrentAyah - 1;
        loadAssocAyah(assocCurrentAyah - 1);
      }
    });
    document.getElementById('assocNext').addEventListener('click', () => {
      if (assocCurrentAyah < 50) {
        select.value = assocCurrentAyah + 1;
        loadAssocAyah(assocCurrentAyah + 1);
      }
    });

    const noteInput = document.getElementById('noteInput');
    let saveTimeout;
    noteInput.addEventListener('input', () => {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        saveNote(assocCurrentAyah, noteInput.value);
        const status = document.getElementById('noteSaveStatus');
        status.classList.add('visible');
        setTimeout(() => status.classList.remove('visible'), 2000);
      }, 500);
    });

    loadAssocAyah(1);
  }

  function loadAssocAyah(num) {
    assocCurrentAyah = num;
    const ayah = ayahs[num - 1];

    const arabicEl = document.getElementById('assocArabic');
    arabicEl.innerHTML = ayah.words.map((w, i) =>
      `<span class="word" data-idx="${i}">${w.arabic}</span>`
    ).join(' ');

    const englishEl = document.getElementById('assocEnglish');
    englishEl.innerHTML = ayah.words.map((w, i) =>
      `<span class="word" data-idx="${i}">${w.english}</span>`
    ).join(' ');

    arabicEl.querySelectorAll('.word').forEach(w => {
      w.addEventListener('click', () => highlightPair(parseInt(w.dataset.idx)));
    });
    englishEl.querySelectorAll('.word').forEach(w => {
      w.addEventListener('click', () => highlightPair(parseInt(w.dataset.idx)));
    });

    document.getElementById('noteInput').value = loadNote(num);
  }

  function highlightPair(idx) {
    const arabicEl = document.getElementById('assocArabic');
    const englishEl = document.getElementById('assocEnglish');
    arabicEl.querySelectorAll('.word').forEach(w => w.classList.remove('active'));
    englishEl.querySelectorAll('.word').forEach(w => w.classList.remove('active'));
    arabicEl.querySelector(`.word[data-idx="${idx}"]`).classList.add('active');
    englishEl.querySelector(`.word[data-idx="${idx}"]`).classList.add('active');
  }

  function saveNote(ayahNum, text) {
    const notes = JSON.parse(localStorage.getItem('hifz-notes') || '{}');
    notes[ayahNum] = text;
    localStorage.setItem('hifz-notes', JSON.stringify(notes));
  }

  function loadNote(ayahNum) {
    const notes = JSON.parse(localStorage.getItem('hifz-notes') || '{}');
    return notes[ayahNum] || '';
  }

  // ========== ORDER THE AYAHS ==========
  let orderRange = [1, 10];

  function initOrder() {
    document.getElementById('orderShuffleBtn').addEventListener('click', shuffleOrder);
    document.getElementById('orderCheckBtn').addEventListener('click', checkOrder);
    document.getElementById('orderRangeSelect').addEventListener('change', e => {
      const parts = e.target.value.split('-').map(Number);
      orderRange = parts;
      shuffleOrder();
    });
    shuffleOrder();
  }

  function shuffleOrder() {
    const [start, end] = orderRange;
    const subset = ayahs.filter(a => a.number >= start && a.number <= end);
    const shuffled = [...subset].sort(() => Math.random() - 0.5);
    const list = document.getElementById('sortableList');
    document.getElementById('orderStats').style.display = 'none';

    list.innerHTML = shuffled.map(a => `
      <div class="sortable-item" draggable="true" data-correct="${a.number}">
        <div class="drag-handle">&#9776;</div>
        <div class="item-text">${a.arabic}</div>
        <div class="item-number">?</div>
      </div>
    `).join('');

    initDragAndDrop();
  }

  function initDragAndDrop() {
    const list = document.getElementById('sortableList');
    let dragItem = null;
    let dragAfterElement = null;

    list.querySelectorAll('.sortable-item').forEach(item => {
      item.addEventListener('dragstart', () => {
        dragItem = item;
        setTimeout(() => item.classList.add('dragging'), 0);
      });
      item.addEventListener('dragend', () => {
        item.classList.remove('dragging');
        dragItem = null;
      });

      item.addEventListener('touchstart', handleTouchStart, { passive: false });
      item.addEventListener('touchmove', handleTouchMove, { passive: false });
      item.addEventListener('touchend', handleTouchEnd);
    });

    list.addEventListener('dragover', e => {
      e.preventDefault();
      const afterEl = getDragAfterElement(list, e.clientY);
      const dragging = list.querySelector('.dragging');
      if (!dragging) return;
      if (afterEl == null) {
        list.appendChild(dragging);
      } else {
        list.insertBefore(dragging, afterEl);
      }
    });

    let touchDragItem = null;
    let touchClone = null;
    let touchStartY = 0;

    function handleTouchStart(e) {
      touchDragItem = e.currentTarget;
      touchStartY = e.touches[0].clientY;
      touchDragItem.classList.add('dragging');
    }

    function handleTouchMove(e) {
      e.preventDefault();
      if (!touchDragItem) return;
      const touchY = e.touches[0].clientY;
      const afterEl = getDragAfterElement(list, touchY);
      if (afterEl == null) {
        list.appendChild(touchDragItem);
      } else {
        list.insertBefore(touchDragItem, afterEl);
      }
    }

    function handleTouchEnd() {
      if (touchDragItem) {
        touchDragItem.classList.remove('dragging');
        touchDragItem = null;
      }
    }
  }

  function getDragAfterElement(container, y) {
    const elements = [...container.querySelectorAll('.sortable-item:not(.dragging)')];
    return elements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset, element: child };
      }
      return closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }

  function checkOrder() {
    const items = document.querySelectorAll('#sortableList .sortable-item');
    const [start] = orderRange;
    let correct = 0;

    items.forEach((item, idx) => {
      const expected = start + idx;
      const actual = parseInt(item.dataset.correct);
      item.classList.remove('correct', 'incorrect');
      const numEl = item.querySelector('.item-number');

      if (actual === expected) {
        item.classList.add('correct');
        numEl.textContent = actual;
        correct++;
      } else {
        item.classList.add('incorrect');
        numEl.textContent = actual;
      }
    });

    document.getElementById('orderStats').style.display = 'flex';
    document.getElementById('orderCorrectCount').textContent = correct;
    document.getElementById('orderTotalCount').textContent = items.length;

    if (correct === items.length) {
      showResults('Perfect!', 100, 'You placed all ayahs in the correct order!');
    }
  }

  // ========== NAME THAT AYAH ==========
  let identifyMode = 'arabic-to-number';
  let identifyOrder = [];
  let identifyIdx = 0;
  let identifyResults = [];

  function initIdentify() {
    document.querySelectorAll('.identify-direction-toggle .toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.identify-direction-toggle .toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        identifyMode = btn.dataset.dir;
        resetIdentify();
      });
    });

    document.getElementById('identifySubmitBtn').addEventListener('click', submitIdentifyAnswer);
    document.getElementById('identifyNumberInput').addEventListener('keydown', e => {
      if (e.key === 'Enter') submitIdentifyAnswer();
    });
    document.getElementById('identifyNextBtn').addEventListener('click', nextIdentify);
    document.getElementById('identifyResetBtn').addEventListener('click', resetIdentify);

    resetIdentify();
  }

  function resetIdentify() {
    identifyOrder = shuffle([...Array(50)].map((_, i) => i));
    identifyIdx = 0;
    identifyResults = [];
    document.getElementById('identifyFeedback').className = 'identify-feedback';
    document.getElementById('identifyFeedback').style.display = 'none';
    document.getElementById('identifyNextBtn').style.display = 'none';
    renderIdentifyProgress();
    loadIdentifyQuestion();
  }

  function loadIdentifyQuestion() {
    const ayahIndex = identifyOrder[identifyIdx];
    const ayah = ayahs[ayahIndex];
    document.getElementById('identifyFeedback').className = 'identify-feedback';
    document.getElementById('identifyFeedback').style.display = 'none';
    document.getElementById('identifyNextBtn').style.display = 'none';

    if (identifyMode === 'arabic-to-number') {
      document.getElementById('identifyArabicMode').style.display = 'block';
      document.getElementById('identifyNumberMode').style.display = 'none';
      document.getElementById('identifyArabicText').textContent = ayah.arabic;
      document.getElementById('identifyNumberInput').value = '';
      document.getElementById('identifyNumberInput').focus();
    } else {
      document.getElementById('identifyArabicMode').style.display = 'none';
      document.getElementById('identifyNumberMode').style.display = 'block';
      document.getElementById('identifyShowNumber').textContent = ayah.number;

      const correctIdx = ayahIndex;
      let choices = [correctIdx];
      while (choices.length < 4) {
        const r = Math.floor(Math.random() * 50);
        if (!choices.includes(r)) choices.push(r);
      }
      choices = shuffle(choices);

      const grid = document.getElementById('identifyChoices');
      grid.innerHTML = choices.map(ci => {
        const a = ayahs[ci];
        return `<button class="choice-btn" data-answer="${ci}">${a.arabic}</button>`;
      }).join('');

      grid.querySelectorAll('.choice-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const answered = parseInt(btn.dataset.answer);
          grid.querySelectorAll('.choice-btn').forEach(b => b.classList.add('disabled'));

          if (answered === correctIdx) {
            btn.classList.add('selected-correct');
            showIdentifyFeedback(true, ayah);
          } else {
            btn.classList.add('selected-incorrect');
            grid.querySelector(`[data-answer="${correctIdx}"]`).classList.add('reveal-correct');
            showIdentifyFeedback(false, ayah);
          }
        });
      });
    }
  }

  function submitIdentifyAnswer() {
    const input = document.getElementById('identifyNumberInput');
    const guess = parseInt(input.value);
    if (isNaN(guess)) return;

    const ayahIndex = identifyOrder[identifyIdx];
    const ayah = ayahs[ayahIndex];
    showIdentifyFeedback(guess === ayah.number, ayah);
  }

  function showIdentifyFeedback(isCorrect, ayah) {
    const fb = document.getElementById('identifyFeedback');
    identifyResults.push(isCorrect);

    if (isCorrect) {
      fb.className = 'identify-feedback correct';
      fb.textContent = `Correct! This is Ayah ${ayah.number}`;
    } else {
      fb.className = 'identify-feedback incorrect';
      fb.textContent = `Incorrect. This is Ayah ${ayah.number}: "${ayah.translation}"`;
    }
    fb.style.display = 'block';
    document.getElementById('identifyNextBtn').style.display = 'inline-flex';
    renderIdentifyProgress();
  }

  function nextIdentify() {
    identifyIdx++;
    if (identifyIdx >= 50) {
      const correct = identifyResults.filter(Boolean).length;
      const pct = Math.round((correct / 50) * 100);
      showResults(
        pct >= 80 ? 'Excellent!' : pct >= 50 ? 'Good Effort!' : 'Keep Practicing!',
        pct,
        `You got ${correct} out of 50 correct.`
      );
      return;
    }
    loadIdentifyQuestion();
    renderIdentifyProgress();
  }

  function renderIdentifyProgress() {
    const container = document.getElementById('identifyProgress');
    container.innerHTML = '';
    for (let i = 0; i < Math.min(50, 50); i++) {
      const dot = document.createElement('div');
      dot.className = 'progress-dot';
      if (i < identifyResults.length) {
        dot.classList.add(identifyResults[i] ? 'correct' : 'incorrect');
      } else if (i === identifyIdx) {
        dot.classList.add('current');
      }
      container.appendChild(dot);
    }
  }

  // ========== FILL IN THE BLANKS ==========
  let blanksDifficulty = 'easy';
  let blanksOrder = [];
  let blanksIdx = 0;
  let blanksResults = [];
  let blanksCurrentSlots = [];
  let blanksCurrentBank = [];
  let blanksFillIndex = 0;

  function initBlanks() {
    document.querySelectorAll('.difficulty-selector .toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.difficulty-selector .toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        blanksDifficulty = btn.dataset.diff;
        resetBlanks();
      });
    });

    document.getElementById('blanksNextBtn').addEventListener('click', nextBlanks);
    document.getElementById('blanksResetBtn').addEventListener('click', resetBlanks);

    resetBlanks();
  }

  function resetBlanks() {
    blanksOrder = shuffle([...Array(50)].map((_, i) => i));
    blanksIdx = 0;
    blanksResults = [];
    document.getElementById('blanksFeedback').className = 'identify-feedback';
    document.getElementById('blanksFeedback').style.display = 'none';
    renderBlanksProgress();
    loadBlanksQuestion();
  }

  function loadBlanksQuestion() {
    const ayahIndex = blanksOrder[blanksIdx];
    const ayah = ayahs[ayahIndex];
    const words = ayah.arabic.split(' ');

    document.getElementById('blanksFeedback').className = 'identify-feedback';
    document.getElementById('blanksFeedback').style.display = 'none';

    let blankCount;
    if (blanksDifficulty === 'easy') blankCount = 1;
    else if (blanksDifficulty === 'medium') blankCount = Math.min(Math.ceil(words.length / 2), 3);
    else blankCount = words.length;

    blankCount = Math.min(blankCount, words.length);

    let blankIndices = [];
    if (blanksDifficulty === 'hard') {
      blankIndices = words.map((_, i) => i);
    } else {
      const indices = shuffle(words.map((_, i) => i));
      blankIndices = indices.slice(0, blankCount).sort((a, b) => a - b);
    }

    blanksCurrentSlots = blankIndices;
    blanksFillIndex = 0;

    const arabicEl = document.getElementById('blanksArabicText');
    arabicEl.innerHTML = words.map((w, i) => {
      if (blankIndices.includes(i)) {
        return `<span class="blank-slot" data-slot="${i}" data-answer="${w}">&#8203;</span>`;
      }
      return `<span>${w}</span>`;
    }).join(' ');

    const bankWords = shuffle(blankIndices.map(i => words[i]));
    blanksCurrentBank = bankWords;
    const bankEl = document.getElementById('blanksWordBank');
    bankEl.innerHTML = bankWords.map((w, i) =>
      `<button class="bank-word" data-bidx="${i}">${w}</button>`
    ).join('');

    bankEl.querySelectorAll('.bank-word').forEach(btn => {
      btn.addEventListener('click', () => handleBankWordClick(btn));
    });

    document.getElementById('blanksHint').textContent = `Translation: "${ayah.translation}"`;
    document.getElementById('blanksNextBtn').textContent = 'Skip';
  }

  function handleBankWordClick(btn) {
    if (btn.classList.contains('used')) return;
    if (blanksFillIndex >= blanksCurrentSlots.length) return;

    const slotIdx = blanksCurrentSlots[blanksFillIndex];
    const slot = document.querySelector(`.blank-slot[data-slot="${slotIdx}"]`);
    const answer = slot.dataset.answer;
    const guess = btn.textContent;

    btn.classList.add('used');
    slot.textContent = guess;
    slot.classList.add('filled');

    if (guess === answer) {
      slot.classList.add('correct-blank');
    } else {
      slot.classList.add('incorrect-blank');
    }

    blanksFillIndex++;

    if (blanksFillIndex >= blanksCurrentSlots.length) {
      const allCorrect = [...document.querySelectorAll('.blank-slot')].every(s =>
        s.textContent === s.dataset.answer
      );

      blanksResults.push(allCorrect);
      const fb = document.getElementById('blanksFeedback');
      if (allCorrect) {
        fb.className = 'identify-feedback correct';
        fb.textContent = 'Perfect! All words are correct!';
      } else {
        fb.className = 'identify-feedback incorrect';
        const ayah = ayahs[blanksOrder[blanksIdx]];
        fb.textContent = `Not quite. The correct ayah: ${ayah.arabic}`;
      }
      fb.style.display = 'block';
      document.getElementById('blanksNextBtn').textContent = 'Next Ayah';
      renderBlanksProgress();
    }
  }

  function nextBlanks() {
    if (blanksFillIndex < blanksCurrentSlots.length) {
      blanksResults.push(false);
    }
    blanksIdx++;
    if (blanksIdx >= 50) {
      const correct = blanksResults.filter(Boolean).length;
      const pct = Math.round((correct / 50) * 100);
      showResults(
        pct >= 80 ? 'Excellent!' : pct >= 50 ? 'Good Effort!' : 'Keep Practicing!',
        pct,
        `You completed ${correct} out of 50 ayahs correctly.`
      );
      resetBlanks();
      return;
    }
    loadBlanksQuestion();
    renderBlanksProgress();
  }

  function renderBlanksProgress() {
    const container = document.getElementById('blanksProgress');
    container.innerHTML = '';
    for (let i = 0; i < 50; i++) {
      const dot = document.createElement('div');
      dot.className = 'progress-dot';
      if (i < blanksResults.length) {
        dot.classList.add(blanksResults[i] ? 'correct' : 'incorrect');
      } else if (i === blanksIdx) {
        dot.classList.add('current');
      }
      container.appendChild(dot);
    }
  }

  // ========== RESULTS OVERLAY ==========
  function showResults(title, percentage, message) {
    document.getElementById('resultsTitle').textContent = title;
    document.getElementById('resultsScore').textContent = percentage + '%';
    document.getElementById('resultsMessage').textContent = message;
    document.getElementById('resultsOverlay').classList.add('visible');
  }

  document.getElementById('resultsCloseBtn').addEventListener('click', () => {
    document.getElementById('resultsOverlay').classList.remove('visible');
  });

  // ========== VIDEO RESOURCES ==========
  function initVideos() {
    const videos = SURAH_DATA.videos;
    const scoreColors = {
      authority: 'var(--primary)',
      relevance: 'var(--accent)',
      depth: 'var(--gold)',
      engagement: 'var(--success)',
      clarity: '#8B5CF6'
    };
    const scoreLabels = {
      authority: 'Authority',
      relevance: 'Relevance',
      depth: 'Depth',
      engagement: 'Engagement',
      clarity: 'Clarity'
    };

    const grid = document.getElementById('videoGrid');
    grid.innerHTML = videos.map((v, idx) => {
      const total = Object.values(v.scores).reduce((s, n) => s + n, 0);
      const scoreBars = Object.entries(v.scores).map(([key, val]) => {
        const dots = [1,2,3,4,5].map(n =>
          `<div class="score-dot ${n <= val ? 'filled' : ''}" style="background:${scoreColors[key]}"></div>`
        ).join('');
        return `<div class="score-pill"><span>${scoreLabels[key]}</span><div class="score-dots">${dots}</div></div>`;
      }).join('');

      const tags = v.tags.map(t => `<span class="video-tag">${t}</span>`).join('') +
        `<span class="video-tag ayah-range">Ayahs ${v.ayahsCovered}</span>`;

      return `
        <div class="video-card">
          <a class="video-thumb-link" href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener">
            <img src="https://img.youtube.com/vi/${v.id}/hqdefault.jpg" alt="${v.title}" loading="lazy">
            <div class="video-play-icon">
              <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </div>
          </a>
          <div class="video-info">
            <div class="video-rank">
              <span class="rank-badge">${idx + 1}</span>
              Recommendation #${idx + 1}
            </div>
            <div class="video-title">${v.title}</div>
            <div class="video-channel">${v.channel}</div>
            <div class="video-desc">${v.description}</div>
            <div class="video-tags">${tags}</div>
            <div class="video-score-bar">
              ${scoreBars}
              <span class="score-total">${total}/25</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // ========== PROGRESS TRACKING ==========
  function updateProgressBadge() {
    const notes = JSON.parse(localStorage.getItem('hifz-notes') || '{}');
    const count = Object.values(notes).filter(n => n.trim().length > 0).length;
    document.getElementById('progressBadge').textContent = `${count} / 50 notes saved`;
  }

  // ========== SETTINGS DRAWER ==========
  function initSettings() {
    const drawer = document.getElementById('settingsDrawer');
    const overlay = document.getElementById('settingsOverlay');
    const toggle = document.getElementById('settingsToggle');
    const close = document.getElementById('drawerClose');

    function openDrawer() {
      drawer.classList.add('open');
      overlay.classList.add('open');
    }
    function closeDrawer() {
      drawer.classList.remove('open');
      overlay.classList.remove('open');
    }

    toggle.addEventListener('click', openDrawer);
    close.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);

    const prefs = JSON.parse(localStorage.getItem('hifz-prefs') || '{}');
    const savedFont = prefs.font || 'amiri';
    const savedReciter = prefs.reciter || 'Alafasy_128kbps';

    applyFont(savedFont);
    applyReciter(savedReciter);

    document.querySelectorAll('#fontOptions .setting-option').forEach(opt => {
      if (opt.dataset.font === savedFont) opt.classList.add('active');
      else opt.classList.remove('active');
      opt.addEventListener('click', () => {
        document.querySelectorAll('#fontOptions .setting-option').forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        applyFont(opt.dataset.font);
        savePrefs();
      });
    });

    document.querySelectorAll('#reciterOptions .setting-option').forEach(opt => {
      if (opt.dataset.reciter === savedReciter) opt.classList.add('active');
      else opt.classList.remove('active');
      opt.addEventListener('click', () => {
        document.querySelectorAll('#reciterOptions .setting-option').forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        applyReciter(opt.dataset.reciter);
        savePrefs();
      });
    });
  }

  function applyFont(fontKey) {
    document.body.className = document.body.className.replace(/arabic-font-\S+/g, '').trim();
    document.body.classList.add('arabic-font-' + fontKey);
  }

  function applyReciter(reciterKey) {
    selectedReciter = reciterKey;
  }

  function savePrefs() {
    const activeFont = document.querySelector('#fontOptions .setting-option.active');
    const activeReciter = document.querySelector('#reciterOptions .setting-option.active');
    const prefs = {
      font: activeFont ? activeFont.dataset.font : 'amiri',
      reciter: activeReciter ? activeReciter.dataset.reciter : 'Alafasy_128kbps'
    };
    localStorage.setItem('hifz-prefs', JSON.stringify(prefs));
  }

  // ========== HELPERS ==========
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ========== INIT ==========
  initSettings();
  initListen();
  initAssociation();
  initOrder();
  initIdentify();
  initBlanks();
  initVideos();
  updateProgressBadge();

  setInterval(updateProgressBadge, 5000);
})();
