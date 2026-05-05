(function () {
  const ayahs = SURAH_DATA.ayahs;
  let currentAudio = null;
  let playAllIndex = -1;
  let playAllActive = false;
  let playAllPaused = false;
  let playAllPreloaded = [];

  // ========== NAVIGATION ==========
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('active')) return;
      stopAudio();
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
    const surahNum = String(SURAH_DATA.number).padStart(3, '0');
    return 'https://everyayah.com/data/' + selectedReciter + '/' + surahNum + num + '.mp3';
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
    playAllPaused = false;
    playAllPreloaded.forEach(a => a.pause());
    playAllPreloaded = [];
    const btn = document.getElementById('playAllBtn');
    btn.innerHTML = '&#9654; Play All';
    btn.disabled = false;
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
          <div class="ayah-translation">
            ${a.words.map((w, i) => `<span class="word-en" data-ayah="${a.number}" data-widx="${i}">${w.english}</span>`).join(' ')}
          </div>
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
      const wordEn = e.target.closest('.word-en');
      const clicked = word || wordEn;
      if (clicked) {
        const ayahNum = parseInt(clicked.dataset.ayah);
        const widx = parseInt(clicked.dataset.widx);
        const card = document.getElementById('listen-ayah-' + ayahNum);
        const arWord = card.querySelector(`.word[data-widx="${widx}"]`);
        const enWord = card.querySelector(`.word-en[data-widx="${widx}"]`);
        const isActive = arWord.classList.contains('highlighted');
        card.querySelectorAll('.word').forEach(w => w.classList.remove('highlighted'));
        card.querySelectorAll('.word-en').forEach(w => w.classList.remove('highlighted'));
        if (!isActive) {
          arWord.classList.add('highlighted');
          enWord.classList.add('highlighted');
        }
      }
    });

    document.getElementById('playAllBtn').addEventListener('click', () => {
      if (playAllActive && !playAllPaused) {
        playAllPaused = true;
        if (currentAudio) currentAudio.pause();
        document.getElementById('playAllBtn').innerHTML = '&#9654; Resume';
        return;
      }
      if (playAllActive && playAllPaused) {
        playAllPaused = false;
        if (currentAudio) currentAudio.play();
        document.getElementById('playAllBtn').innerHTML = '&#10074;&#10074; Pause';
        return;
      }
      playAllActive = true;
      startContinuousPlayAll();
    });

    document.getElementById('stopBtn').addEventListener('click', stopAudio);

    function startContinuousPlayAll() {
      const btn = document.getElementById('playAllBtn');
      btn.innerHTML = '&#9203; Loading...';
      btn.disabled = true;

      playAllPreloaded = ayahs.map(a => {
        const audio = new Audio(getAudioUrl(a.number));
        audio.preload = 'auto';
        return audio;
      });

      Promise.all(playAllPreloaded.map(audio =>
        new Promise(resolve => {
          if (audio.readyState >= 4) return resolve();
          audio.addEventListener('canplaythrough', resolve, { once: true });
          audio.addEventListener('error', resolve, { once: true });
        })
      )).then(() => {
        if (!playAllActive) return;
        btn.innerHTML = '&#10074;&#10074; Pause';
        btn.disabled = false;
        playAllIndex = 0;
        playNextPreloaded();
      });
    }

    function playNextPreloaded() {
      if (!playAllActive || playAllIndex >= ayahs.length) {
        stopAudio();
        return;
      }
      clearCurrentAudio();
      const audio = playAllPreloaded[playAllIndex];
      if (!audio) { stopAudio(); return; }
      const speed = parseFloat(document.getElementById('playbackSpeed').value);
      audio.playbackRate = speed;
      currentAudio = audio;
      const card = document.getElementById('listen-ayah-' + ayahs[playAllIndex].number);
      if (card) {
        card.classList.add('playing');
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      audio.addEventListener('ended', () => {
        if (card) card.classList.remove('playing');
        playAllIndex++;
        playNextPreloaded();
      }, { once: true });
      audio.addEventListener('error', () => {
        if (card) card.classList.remove('playing');
        playAllIndex++;
        playNextPreloaded();
      }, { once: true });
      audio.play().catch(() => {
        if (card) card.classList.remove('playing');
        playAllIndex++;
        playNextPreloaded();
      });
    }
  }

  // ========== WORD ASSOCIATION ==========
  let assocStartAyah = 1;
  let assocCount = 1;
  let assocHistory = [];

  function initAssociation() {
    const select = document.getElementById('assocAyahSelect');
    select.innerHTML = ayahs.map(a => `<option value="${a.number}">Ayah ${a.number}: ${a.arabic.substring(0, 30)}...</option>`).join('');

    select.addEventListener('change', () => {
      assocHistory = [];
      assocStartAyah = parseInt(select.value);
      assocCount = 1;
      updateAssocCountDisplay();
      loadAssocAyahs();
    });

    document.getElementById('assocPrev').addEventListener('click', () => {
      if (assocHistory.length > 0) {
        const prev = assocHistory.pop();
        assocStartAyah = prev.start;
        assocCount = prev.count;
        select.value = assocStartAyah;
        updateAssocCountDisplay();
        loadAssocAyahs();
      }
    });
    document.getElementById('assocNext').addEventListener('click', () => {
      const nextStart = assocStartAyah + assocCount;
      if (nextStart <= ayahs.length) {
        assocHistory.push({ start: assocStartAyah, count: assocCount });
        assocStartAyah = nextStart;
        assocCount = 1;
        select.value = assocStartAyah;
        updateAssocCountDisplay();
        loadAssocAyahs();
      }
    });

    document.getElementById('assocCountMinus').addEventListener('click', () => {
      if (assocCount > 1) {
        assocCount--;
        updateAssocCountDisplay();
        loadAssocAyahs();
      }
    });
    document.getElementById('assocCountPlus').addEventListener('click', () => {
      if (assocStartAyah + assocCount <= ayahs.length) {
        assocCount++;
        updateAssocCountDisplay();
        loadAssocAyahs();
      }
    });

    const noteInput = document.getElementById('noteInput');
    let saveTimeout;
    noteInput.addEventListener('input', () => {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        const key = assocCount === 1 ? String(assocStartAyah) : assocStartAyah + '-' + (assocStartAyah + assocCount - 1);
        saveNote(key, noteInput.value);
        const status = document.getElementById('noteSaveStatus');
        status.classList.add('visible');
        setTimeout(() => status.classList.remove('visible'), 2000);
      }, 500);
    });

    initVideos();
    loadAssocAyahs();
  }

  function updateAssocCountDisplay() {
    const display = document.getElementById('assocCountDisplay');
    display.textContent = assocCount === 1 ? '1 ayah' : assocCount + ' ayahs';
  }

  function loadAssocAyahs() {
    const end = Math.min(assocStartAyah + assocCount - 1, ayahs.length);
    const blocksEl = document.getElementById('assocAyahBlocks');
    blocksEl.innerHTML = '';

    for (let num = assocStartAyah; num <= end; num++) {
      const ayah = ayahs[num - 1];
      const block = document.createElement('div');
      block.className = 'assoc-ayah-block';
      block.innerHTML = `
        <div class="assoc-ayah-num">${num}</div>
        <div class="assoc-container">
          <div class="card assoc-panel">
            <h3>Arabic</h3>
            <div class="assoc-arabic-text arabic" data-ayah="${num}">
              ${ayah.words.map((w, i) => `<span class="word" data-ayah="${num}" data-idx="${i}">${w.arabic}</span>`).join(' ')}
            </div>
          </div>
          <div class="card assoc-panel">
            <h3>English Translation</h3>
            <div class="assoc-english-text" data-ayah="${num}">
              ${ayah.words.map((w, i) => `<span class="word" data-ayah="${num}" data-idx="${i}">${w.english}</span>`).join(' ')}
            </div>
          </div>
        </div>
      `;
      blocksEl.appendChild(block);
    }

    blocksEl.querySelectorAll('.word').forEach(w => {
      w.addEventListener('click', () => {
        const ayahNum = parseInt(w.dataset.ayah);
        const idx = parseInt(w.dataset.idx);
        highlightPair(ayahNum, idx);
      });
    });

    const combinedEl = document.getElementById('assocCombinedText');
    const translations = [];
    for (let num = assocStartAyah; num <= end; num++) {
      translations.push(ayahs[num - 1].translation);
    }
    combinedEl.textContent = translations.join(' ');

    if (assocCount === 1) {
      document.getElementById('assocCombinedTranslation').style.display = 'none';
    } else {
      document.getElementById('assocCombinedTranslation').style.display = '';
    }

    const key = assocCount === 1 ? String(assocStartAyah) : assocStartAyah + '-' + end;
    document.getElementById('noteInput').value = loadNote(key);
  }

  function highlightPair(ayahNum, idx) {
    document.querySelectorAll('#assocAyahBlocks .word').forEach(w => w.classList.remove('active'));
    const arabicWord = document.querySelector(`.assoc-arabic-text[data-ayah="${ayahNum}"] .word[data-idx="${idx}"]`);
    const englishWord = document.querySelector(`.assoc-english-text[data-ayah="${ayahNum}"] .word[data-idx="${idx}"]`);
    if (arabicWord) arabicWord.classList.add('active');
    if (englishWord) englishWord.classList.add('active');
  }

  const storagePrefix = 'hifz-' + SURAH_DATA.number + '-';

  function saveNote(key, text) {
    const notes = JSON.parse(localStorage.getItem(storagePrefix + 'notes') || '{}');
    notes[key] = text;
    localStorage.setItem(storagePrefix + 'notes', JSON.stringify(notes));
  }

  function loadNote(key) {
    const notes = JSON.parse(localStorage.getItem(storagePrefix + 'notes') || '{}');
    return notes[key] || '';
  }

  // ========== ORDER THE AYAHS ==========
  let orderRange = [1, 10];
  let orderGroupSize = 3;
  let orderGroups = [];
  let orderGroupIdx = 0;
  let orderTotalCorrect = 0;
  let orderTotalCount = 0;

  function initOrder() {
    populateRangeSelect(document.getElementById('orderRangeSelect'), ayahs.length, false);
    document.getElementById('orderShuffleBtn').addEventListener('click', startOrderGame);
    document.getElementById('orderCheckBtn').addEventListener('click', checkOrder);
    document.getElementById('orderNextGroupBtn').addEventListener('click', loadNextOrderGroup);
    document.getElementById('orderRangeSelect').addEventListener('change', e => {
      const parts = e.target.value.split('-').map(Number);
      orderRange = parts;
      startOrderGame();
    });

    document.querySelectorAll('.order-group-btns .toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.order-group-btns .toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        orderGroupSize = parseInt(btn.dataset.groupsize);
        startOrderGame();
      });
    });

    startOrderGame();
  }

  function startOrderGame() {
    const [start, end] = orderRange;
    const subset = ayahs.filter(a => a.number >= start && a.number <= end);
    orderGroups = [];
    for (let i = 0; i < subset.length; i += orderGroupSize) {
      orderGroups.push(subset.slice(i, i + orderGroupSize));
    }
    orderGroupIdx = 0;
    orderTotalCorrect = 0;
    orderTotalCount = 0;
    document.getElementById('orderStats').style.display = 'none';
    updateOrderGroupProgress();
    loadOrderGroup();
  }

  function loadOrderGroup() {
    const group = orderGroups[orderGroupIdx];
    if (!group) return;
    const shuffled = [...group].sort(() => Math.random() - 0.5);
    const list = document.getElementById('sortableList');
    document.getElementById('orderNextGroupBtn').style.display = 'none';

    list.innerHTML = shuffled.map(a => `
      <div class="sortable-item" draggable="true" data-correct="${a.number}">
        <div class="drag-handle">&#9776;</div>
        <div class="item-text">${a.arabic}</div>
        <div class="item-number">?</div>
      </div>
    `).join('');

    initDragAndDrop();
    updateOrderGroupProgress();
  }

  function loadNextOrderGroup() {
    orderGroupIdx++;
    if (orderGroupIdx >= orderGroups.length) {
      const pct = orderTotalCount > 0 ? Math.round((orderTotalCorrect / orderTotalCount) * 100) : 0;
      showResults(
        pct >= 80 ? 'Excellent!' : pct >= 50 ? 'Good Effort!' : 'Keep Practicing!',
        pct,
        `You placed ${orderTotalCorrect} out of ${orderTotalCount} ayahs correctly.`
      );
      startOrderGame();
      return;
    }
    loadOrderGroup();
  }

  function updateOrderGroupProgress() {
    const bar = document.getElementById('orderGroupProgress');
    if (orderGroups.length <= 1) {
      bar.style.display = 'none';
      return;
    }
    bar.style.display = 'flex';
    document.getElementById('orderGroupLabel').textContent = `Group ${orderGroupIdx + 1} of ${orderGroups.length}`;
    const pct = ((orderGroupIdx) / orderGroups.length) * 100;
    document.getElementById('orderProgressFill').style.width = pct + '%';
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
    const group = orderGroups[orderGroupIdx];
    if (!group) return;
    const startNum = group[0].number;
    let correct = 0;

    items.forEach((item, idx) => {
      const expected = startNum + idx;
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

    orderTotalCorrect += correct;
    orderTotalCount += items.length;

    document.getElementById('orderStats').style.display = 'flex';
    document.getElementById('orderCorrectCount').textContent = correct;
    document.getElementById('orderTotalCount').textContent = items.length;

    if (correct === items.length && orderGroups.length <= 1) {
      showResults('Perfect!', 100, 'You placed all ayahs in the correct order!');
    } else if (orderGroups.length > 1) {
      document.getElementById('orderNextGroupBtn').style.display = 'inline-flex';
      const pct = ((orderGroupIdx + 1) / orderGroups.length) * 100;
      document.getElementById('orderProgressFill').style.width = pct + '%';
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
    blanksOrder = shuffle([...Array(ayahs.length)].map((_, i) => i));
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
    if (blanksIdx >= ayahs.length) {
      const correct = blanksResults.filter(Boolean).length;
      const pct = Math.round((correct / ayahs.length) * 100);
      showResults(
        pct >= 80 ? 'Excellent!' : pct >= 50 ? 'Good Effort!' : 'Keep Practicing!',
        pct,
        `You completed ${correct} out of ${ayahs.length} ayahs correctly.`
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
    for (let i = 0; i < ayahs.length; i++) {
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

  // ========== LISTEN & RECALL ==========
  let recallMode = 'beginning';
  let recallRange = [1, ayahs.length];
  let recallAyahList = [];
  let recallIdx = 0;
  let recallResults = [];
  let recallCurrentMode = 'beginning';
  let recallHiddenStart = 0;
  let recallHiddenEnd = 0;
  let recallPauseRatio = 0;

  function initRecall() {
    populateRangeSelect(document.getElementById('recallRangeSelect'), ayahs.length, true);
    document.querySelectorAll('.recall-mode-selector .toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.recall-mode-selector .toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        recallMode = btn.dataset.recall;
        resetRecall();
      });
    });

    document.getElementById('recallRangeSelect').addEventListener('change', e => {
      recallRange = e.target.value.split('-').map(Number);
      resetRecall();
    });

    document.getElementById('recallRestartBtn').addEventListener('click', resetRecall);
    document.getElementById('recallPlayBtn').addEventListener('click', startRecallRound);
    document.getElementById('recallRevealBtn').addEventListener('click', revealRecall);
    document.getElementById('recallGotItBtn').addEventListener('click', () => rateRecall(true));
    document.getElementById('recallMissedBtn').addEventListener('click', () => rateRecall(false));

    resetRecall();
  }

  function resetRecall() {
    stopAudio();
    const [start, end] = recallRange;
    recallAyahList = [];
    for (let i = start; i <= end; i++) recallAyahList.push(i);
    recallIdx = 0;
    recallResults = [];
    renderRecallProgress();
    loadRecallAyah();
  }

  function loadRecallAyah() {
    if (recallIdx >= recallAyahList.length) {
      const correct = recallResults.filter(Boolean).length;
      const total = recallResults.length;
      const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
      showResults(
        pct >= 80 ? 'Excellent!' : pct >= 50 ? 'Good Effort!' : 'Keep Practicing!',
        pct,
        'You recalled ' + correct + ' out of ' + total + ' ayahs correctly.'
      );
      resetRecall();
      return;
    }

    const ayahNum = recallAyahList[recallIdx];
    const ayah = ayahs[ayahNum - 1];
    const n = ayah.words.length;

    recallCurrentMode = recallMode === 'mix'
      ? ['beginning', 'ending', 'middle'][Math.floor(Math.random() * 3)]
      : recallMode;

    if (n <= 2 && recallCurrentMode === 'middle') {
      recallCurrentMode = Math.random() < 0.5 ? 'beginning' : 'ending';
    }

    if (recallCurrentMode === 'beginning') {
      var hide = Math.max(1, Math.ceil(n * 0.4));
      recallHiddenStart = 0;
      recallHiddenEnd = hide - 1;
      recallPauseRatio = 0;
    } else if (recallCurrentMode === 'ending') {
      var hide = Math.max(1, Math.ceil(n * 0.4));
      recallHiddenStart = n - hide;
      recallHiddenEnd = n - 1;
      recallPauseRatio = recallHiddenStart / n;
    } else {
      var sStart = Math.max(1, Math.floor(n * 0.3));
      var sEnd = Math.max(1, Math.floor(n * 0.3));
      recallHiddenStart = sStart;
      recallHiddenEnd = Math.max(sStart, n - sEnd - 1);
      recallPauseRatio = recallHiddenStart / n;
    }

    document.getElementById('recallAyahNum').textContent = ayahNum;

    var labels = { beginning: 'Recall the beginning', ending: 'Recall the ending', middle: 'Recall the middle' };
    document.getElementById('recallModeLabel').textContent = labels[recallCurrentMode];

    var arabicEl = document.getElementById('recallArabic');
    arabicEl.innerHTML = ayah.words.map(function (w, i) {
      if (i >= recallHiddenStart && i <= recallHiddenEnd) {
        return '<span class="recall-word recall-hidden">●●●</span>';
      }
      return '<span class="recall-word">' + w.arabic + '</span>';
    }).join(' ');

    document.getElementById('recallHint').textContent = 'Translation: “' + ayah.translation + '”';
    document.getElementById('recallStatus').textContent = '';
    document.getElementById('recallStatus').className = 'recall-status';
    document.getElementById('recallPlayBtn').style.display = 'inline-flex';
    document.getElementById('recallRevealBtn').style.display = 'none';
    document.getElementById('recallAssessment').style.display = 'none';
  }

  function startRecallRound() {
    document.getElementById('recallPlayBtn').style.display = 'none';

    if (recallCurrentMode === 'beginning') {
      document.getElementById('recallStatus').textContent = 'Your turn! Recall the beginning, then press Reveal';
      document.getElementById('recallStatus').className = 'recall-status recall-status-waiting';
      document.getElementById('recallRevealBtn').style.display = 'inline-flex';
      return;
    }

    document.getElementById('recallStatus').textContent = 'Listening...';
    document.getElementById('recallStatus').className = 'recall-status recall-status-playing';

    stopAudio();
    var ayahNum = recallAyahList[recallIdx];
    currentAudio = new Audio(getAudioUrl(ayahNum));
    currentAudio.playbackRate = parseFloat(document.getElementById('recallSpeed').value);

    var pauseTriggered = false;
    var pauseTime = null;
    var ratio = recallPauseRatio;

    currentAudio.addEventListener('loadedmetadata', function () {
      pauseTime = currentAudio.duration * ratio;
    });

    currentAudio.addEventListener('timeupdate', function () {
      if (!pauseTriggered && pauseTime !== null && currentAudio.currentTime >= pauseTime) {
        pauseTriggered = true;
        currentAudio.pause();
        var msg = recallCurrentMode === 'ending'
          ? 'Your turn! Recall the ending, then press Reveal'
          : 'Your turn! Recall the middle, then press Reveal';
        document.getElementById('recallStatus').textContent = msg;
        document.getElementById('recallStatus').className = 'recall-status recall-status-waiting';
        document.getElementById('recallRevealBtn').style.display = 'inline-flex';
      }
    });

    currentAudio.play().catch(function () {
      document.getElementById('recallStatus').textContent = 'Audio unavailable — recall from memory, then press Reveal';
      document.getElementById('recallStatus').className = 'recall-status recall-status-waiting';
      document.getElementById('recallRevealBtn').style.display = 'inline-flex';
    });
  }

  function revealRecall() {
    document.getElementById('recallRevealBtn').style.display = 'none';

    var ayahNum = recallAyahList[recallIdx];
    var ayah = ayahs[ayahNum - 1];
    document.getElementById('recallArabic').innerHTML = ayah.words.map(function (w, i) {
      var cls = (i >= recallHiddenStart && i <= recallHiddenEnd) ? 'recall-word recall-revealed' : 'recall-word';
      return '<span class="' + cls + '">' + w.arabic + '</span>';
    }).join(' ');

    document.getElementById('recallStatus').textContent = 'Listen and verify...';
    document.getElementById('recallStatus').className = 'recall-status recall-status-revealing';

    function onAudioEnd() {
      document.getElementById('recallStatus').textContent = 'How did you do?';
      document.getElementById('recallStatus').className = 'recall-status';
      document.getElementById('recallAssessment').style.display = 'block';
    }

    if (recallCurrentMode === 'beginning') {
      stopAudio();
      currentAudio = new Audio(getAudioUrl(ayahNum));
      currentAudio.playbackRate = parseFloat(document.getElementById('recallSpeed').value);
      currentAudio.addEventListener('ended', onAudioEnd);
      currentAudio.addEventListener('error', onAudioEnd);
      currentAudio.play().catch(onAudioEnd);
    } else if (currentAudio) {
      currentAudio.addEventListener('ended', onAudioEnd);
      currentAudio.addEventListener('error', onAudioEnd);
      currentAudio.play().catch(onAudioEnd);
    } else {
      onAudioEnd();
    }
  }

  function rateRecall(gotIt) {
    recallResults.push(gotIt);
    stopAudio();
    recallIdx++;
    renderRecallProgress();
    loadRecallAyah();
  }

  function renderRecallProgress() {
    var container = document.getElementById('recallProgress');
    if (!container) return;
    container.innerHTML = '';
    for (var i = 0; i < recallAyahList.length; i++) {
      var dot = document.createElement('div');
      dot.className = 'progress-dot';
      if (i < recallResults.length) {
        dot.classList.add(recallResults[i] ? 'correct' : 'incorrect');
      } else if (i === recallIdx) {
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

      const videoUrl = v.playlist
        ? 'https://www.youtube.com/playlist?list=' + v.playlist
        : 'https://www.youtube.com/watch?v=' + v.id;
      return `
        <div class="video-card">
          <a class="video-thumb-link" href="${videoUrl}" target="_blank" rel="noopener">
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
    const notes = JSON.parse(localStorage.getItem(storagePrefix + 'notes') || '{}');
    const count = Object.values(notes).filter(n => n.trim().length > 0).length;
    document.getElementById('progressBadge').textContent = `${count} / ${ayahs.length} notes saved`;
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

  // ========== RANGE HELPERS ==========
  function buildRangeOptions(total) {
    const opts = [];
    for (let i = 1; i <= total; i += 10) {
      const end = Math.min(i + 9, total);
      opts.push({ value: i + '-' + end, label: 'Ayahs ' + i + ' – ' + end });
    }
    if (total > 20) {
      const half = Math.ceil(total / 2);
      opts.push({ value: '1-' + half, label: 'Ayahs 1 – ' + half });
      opts.push({ value: (half + 1) + '-' + total, label: 'Ayahs ' + (half + 1) + ' – ' + total });
    }
    opts.push({ value: '1-' + total, label: 'All ' + total + ' Ayahs' });
    return opts;
  }

  function populateRangeSelect(selectEl, total, selectAll) {
    const opts = buildRangeOptions(total);
    selectEl.innerHTML = opts.map(o =>
      '<option value="' + o.value + '"' + (selectAll && o.value === '1-' + total ? ' selected' : '') + '>' + o.label + '</option>'
    ).join('');
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
  initBlanks();
  initRecall();
  updateProgressBadge();

  setInterval(updateProgressBadge, 5000);
})();
