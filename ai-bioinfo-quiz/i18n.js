/* AI × Bioinformatics Quiz · i18n
 * 與 ../i18n.js 同邏輯：
 * - localStorage key 'bioai-lang'（與 AI 教學共用，切換能跨頁同步）
 * - data-lang 整塊切換、data-zh/data-en textContent 切換
 * - 觸發 'langchange' CustomEvent 讓動態渲染 (renderQuiz) 重繪
 */
(function(){
  const SK = 'bioai-lang';
  let lang = localStorage.getItem(SK) || 'en';

  // UI string dictionary used by JS dynamic rendering
  const STR = {
    appTitle:        { zh:"🧠 AI × 生資 互動考題", en:"🧠 AI × Bioinformatics Interactive Quiz" },
    backHome:        { zh:"← 回首頁", en:"← Home" },
    defaultUser:     { zh:"預設使用者", en:"Default user" },
    answeredOf:      { zh:(a,t)=>"已答 <strong>"+a+"</strong> / "+t, en:(a,t)=>"Answered <strong>"+a+"</strong> / "+t },
    notStarted:      { zh:"尚未開始作答", en:"Not started" },
    progressLine:    { zh:(a,t,c)=>a+"/"+t+" · 答對 "+c+" · 正確率 "+(a?Math.round(c/a*100):0)+"%", en:(a,t,c)=>a+"/"+t+" · Correct "+c+" · "+(a?Math.round(c/a*100):0)+"%" },
    examOngoing:     { zh:(n,t)=>"📋 考試進行中 "+n+"/"+t, en:(n,t)=>"📋 Exam in progress "+n+"/"+t },
    sectionDone:     { zh:(c,t)=>"✓ 已完成 · 對 "+c+"/"+t, en:(c,t)=>"✓ Completed · "+c+"/"+t+" correct" },
    practicing:      { zh:(a,t,c)=>"📝 練習中 "+a+"/"+t+" · 對 "+c, en:(a,t,c)=>"📝 Practicing "+a+"/"+t+" · "+c+" correct" },
    notAnswered:     { zh:"尚未作答", en:"Not answered" },
    qCount:          { zh:n=>"("+n+" 題)", en:n=>"("+n+" Q)" },
    practiceMode:    { zh:"📝 練習模式", en:"📝 Practice Mode" },
    examMode:        { zh:"📋 考試模式", en:"📋 Exam Mode" },
    exportImport:    { zh:"匯入/匯出本卷", en:"Import / Export this quiz" },
    chooseAnswer:    { zh:"請先選擇答案", en:"Please select an answer first" },
    submitAnswer:    { zh:"📤 送出答案", en:"📤 Submit Answer" },
    clearChoice:     { zh:"清除選擇", en:"Clear" },
    multiHint:       { zh:n=>"已勾選 "+n+" 個（多選題請勾選所有正確選項）", en:n=>n+" selected (select all correct options)" },
    tfHint:          { zh:"選擇後點「送出答案」鎖定本題", en:'Click "Submit Answer" after choosing to lock this question' },
    singleHint:      { zh:"選擇後點「送出答案」鎖定本題", en:'Click "Submit Answer" after choosing to lock this question' },
    examHintBanner:  { zh:'📋 <strong>考試模式</strong>：可隨時修改答案，全部答完後請點側邊欄或最後一題的「<strong>交卷查看結果</strong>」按鈕。',
                       en:'📋 <strong>Exam Mode</strong>: you may change your answers anytime. When done, click the "<strong>Submit & See Results</strong>" button in the sidebar or on the last question.' },
    correct:         { zh:"✓ 答對", en:"✓ Correct" },
    incorrect:       { zh:"✗ 答錯", en:"✗ Incorrect" },
    correctAnswer:   { zh:"正解：", en:"Answer: " },
    yourAnswer:      { zh:" · 你的答案：", en:" · Your answer: " },
    noExp:           { zh:"（此題未附解析）", en:"(No explanation provided)" },
    qNum:            { zh:(i,n)=>"第 "+i+" 題 / "+n, en:(i,n)=>"Q "+i+" / "+n },
    typeSingle:      { zh:"單選", en:"Single" },
    typeMulti:       { zh:"多選", en:"Multi" },
    typeTF:          { zh:"是非", en:"T/F" },
    markBtn:         { zh:"🔖 標記", en:"🔖 Mark" },
    markedBtn:       { zh:"🔖 已標記", en:"🔖 Marked" },
    prev:            { zh:"← 上一題", en:"← Previous" },
    next:            { zh:"下一題 →", en:"Next →" },
    redo:            { zh:"↺ 重做本題", en:"↺ Redo" },
    submitExamSidebarN: { zh:(a,t)=>"📋 交卷查看結果（已答 "+a+"/"+t+"）", en:(a,t)=>"📋 Submit & See Results ("+a+"/"+t+")" },
    submitExamInline: { zh:"📋 交卷查看結果", en:"📋 Submit & See Results" },
    sbTotalExam:     { zh:(a,t)=>"📋 已作答 "+a+"/"+t, en:(a,t)=>"📋 Answered "+a+"/"+t },
    sbTotal:         { zh:(t,a,c)=>"題號（共 "+t+" 題）· 已答 "+a+(a?" · 對 "+c:""), en:(t,a,c)=>"Questions (total "+t+") · Answered "+a+(a?" · "+c+" correct":"") },
    legendCorrect:   { zh:"答對", en:"Correct" },
    legendWrong:     { zh:"答錯", en:"Wrong" },
    legendAnswered:  { zh:"已作答", en:"Answered" },
    legendMarked:    { zh:"已標記", en:"Marked" },
    notYetAnswered:  { zh:"尚未作答", en:"Not answered" },
    examInProgressLeg:{ zh:"考試進行中", en:"Exam in progress" },
    practiceOrDone:  { zh:"練習中／已完成練習", en:"Practicing / completed practice" },
    summaryTitle:    { zh:"📊 本卷總結", en:"📊 Quiz Summary" },
    examResultTitle: { zh:"📋 考試結果", en:"📋 Exam Result" },
    examSubmittedPill:{ zh:"📋 考試已交卷", en:"📋 Exam Submitted" },
    examModePill:    { zh:"📋 考試模式", en:"📋 Exam Mode" },
    practicePill:    { zh:"📝 練習模式", en:"📝 Practice Mode" },
    retryPill:       { zh:"🎲 重答", en:"🎲 Retry" },
    points:          { zh:" 分", en:" pts" },
    qTotal:          { zh:"總題數", en:"Total" },
    correctN:        { zh:"答對", en:"Correct" },
    wrongN:          { zh:"答錯", en:"Wrong" },
    unansN:          { zh:"未作答", en:"Unanswered" },
    markedN:         { zh:"已標記", en:"Marked" },
    wrongList:       { zh:"錯題清單（點選跳到該題）", en:"Wrong questions (click to jump)" },
    backToQuiz:      { zh:"← 返回作答", en:"← Back to quiz" },
    backHomeBtn:     { zh:"回首頁", en:"Home" },
    exportThisQuiz:  { zh:"📤 匯出本卷", en:"📤 Export this quiz" },
    youLabel:        { zh:"你：", en:"You: " },
    answerLabel:     { zh:"正解：", en:"Answer: " },
    chooseFile:      { zh:"請先選擇 JSON 檔案", en:"Please select a JSON file first" },
    readFail:        { zh:"讀檔失敗", en:"Failed to read file" },
    pasteEmpty:      { zh:"貼上區是空的", en:"Paste area is empty" },
    parseFail:       { zh:e=>"⚠️ JSON 解析失敗："+e, en:e=>"⚠️ JSON parse failed: "+e },
    notRecognised:   { zh:"此 JSON 不像是本系統匯出的備份，是否仍嘗試匯入？", en:"This JSON does not appear to be from this system. Import anyway?" },
    importDone:      { zh:"✓ 已匯入完成", en:"✓ Import complete" },
    nothingToPick:   { zh:"沒有可抽取的題目", en:"No questions to pick" },
    noWrong:         { zh:"目前沒有錯題～", en:"No wrong questions yet" },
    noMarked:        { zh:"目前沒有標記題～", en:"No marked questions yet" },
    confirmReset:    { zh:n=>"確定要清除「"+n+"」的所有作答記錄？\n（包含考試進行中的暫存）", en:n=>'Clear all answers for "'+n+'" ?\n(Including ongoing exam drafts)' },
    confirmClearMk:  { zh:"確定要清除所有 🔖 標記？", en:"Clear all 🔖 marks?" },
    confirmDelUser:  { zh:n=>"確定要刪除使用者「"+n+"」？相關進度也會一併移除。", en:n=>'Delete user "'+n+'" ? All progress will be removed.' },
    confirmResetSec: { zh:"確定要重置本卷的所有作答？", en:"Reset all answers for this quiz?" },
    confirmResetExam:{ zh:"確定要重置本卷考試？將清空所有作答。", en:"Reset this exam? All answers will be cleared." },
    confirmEnterExamCleansec:{ zh:n=>"進入考試模式將清除本章節現有的 "+n+" 題作答記錄，是否繼續？", en:n=>"Entering Exam Mode will clear "+n+" existing answers for this section. Continue?" },
    confirmContExam: { zh:n=>"此章節有未交卷的考試（已作答 "+n+"）。\n\n按確定繼續未完成的考試；按取消放棄並重新開始。",
                       en:n=>"There is an unsubmitted exam for this section ("+n+" answered).\n\nClick OK to resume; Cancel to abandon and restart." },
    confirmRestartExam:{ zh:"確定要重新開始考試？", en:"Are you sure you want to restart the exam?" },
    confirmEnterPracticeFromExam:{ zh:n=>"此章節有未交卷的考試（已作答 "+n+"）。\n\n進入練習模式會放棄考試進度，是否繼續？", en:n=>"There is an unsubmitted exam for this section ("+n+" answered).\n\nEntering Practice Mode will discard the exam. Continue?" },
    confirmSubmitExam:{ zh:(t,a,u)=>"確定要交卷？\n\n本卷共 "+t+" 題，已作答 "+a+" 題（"+u+" 題未答將計為錯）。\n交卷後將顯示成績與每題對錯。", en:(t,a,u)=>"Submit your exam?\n\nTotal "+t+" questions, "+a+" answered ("+u+" unanswered will count as wrong).\nAfter submission you'll see your score and per-question results." },
    toastResetDone:  { zh:"已重置作答", en:"Answers reset" },
    toastClearMk:    { zh:"已清除標記", en:"Marks cleared" },
    toastSwitched:   { zh:n=>"已切換到 "+n, en:n=>"Switched to "+n },
    toastCreated:    { zh:n=>"已建立並切換到 "+n, en:n=>"Created and switched to "+n },
    toastShuffled:   { zh:"已切換為隨機順序", en:"Order shuffled" },
    toastUnshuffled: { zh:"已恢復原始順序", en:"Original order restored" },
    toastNoExam:     { zh:"找不到考試資料", en:"Exam data not found" },
    toastEnterName:  { zh:"請輸入名字", en:"Please enter a name" },
    toastExpJSON:    { zh:"已匯出 JSON 進度", en:"JSON progress exported" },
    toastExpScore:   { zh:"已匯出 HTML 成績單", en:"HTML score sheet exported" },
    toastExpErrata:  { zh:"已匯出 HTML 錯題講義", en:"HTML errata sheet exported" },
    toastUserSwitch: { zh:n=>"已切換到 "+n, en:n=>"Switched to "+n },
    toastCorrect:    { zh:"✓ 答對", en:"✓ Correct" },
    rangeAll:        { zh:"全部 12 個章節", en:"All 12 chapters" },
    rangeUserLabel:  { zh:"使用者：", en:"User: " },
    rangeScopeLabel: { zh:" · 範圍：", en:" · Scope: " },
    importThisRange: { zh:"📥 僅匯入本範圍", en:"📥 Import this scope only" },
    importThisRangeBig:{ zh:"📥 僅匯入有資料的章節", en:"📥 Import sections with data only" },
    importAll:       { zh:"📥 完整還原", en:"📥 Full restore" },
    importJsonRestore:{ zh:"📥 匯入 JSON 還原", en:"📥 Import JSON to restore" },
    expHeaderQuiz:   { zh:"📤 匯入 / 匯出本卷", en:"📤 Import / Export this quiz" },
    expHeaderAll:    { zh:"📤 匯入 / 匯出全部", en:"📤 Import / Export all" },
    rndPickerTitle:  { zh:"🎲 隨機練習", en:"🎲 Random practice" },
    wrongPickerTitle:{ zh:"📝 錯題複習", en:"📝 Wrong question review" },
    markedPickerTitle:{ zh:"🔖 標記題複習", en:"🔖 Marked question review" },
    poolAvail:       { zh:n=>"可用 "+n+" 題", en:n=>"Pool: "+n+" Q" },
    poolEmptyAll:    { zh:"題庫為空", en:"Question bank is empty" },
    poolEmptyWrong:  { zh:"目前沒有錯題", en:"No wrong questions" },
    poolEmptyMarked: { zh:"目前沒有標記題", en:"No marked questions" },
    titleRandomPrefix:{ zh:"🎲 隨機練習", en:"🎲 Random practice" },
    titleWrongPrefix:{ zh:"📝 錯題複習", en:"📝 Wrong review" },
    titleMarkedPrefix:{ zh:"🔖 標記題複習", en:"🔖 Marked review" },
    srcAll:          { zh:"全題", en:"All" },
    srcWrong:        { zh:"錯題", en:"Wrong" },
    srcMarked:       { zh:"標記題", en:"Marked" },
    quesUnit:        { zh:n=>"（"+n+" 題）", en:n=>"("+n+" Q)" },
    summaryHeader:   { zh:"📊 總結 · ", en:"📊 Summary · " },
    examResultHeader:{ zh:"📋 考試結果 · ", en:"📋 Exam Result · " },
    summaryMode:     { zh:"總結模式", en:"Summary mode" },
    examScoreSheet:  { zh:" · 成績單", en:" · Score Sheet" },
    examErrataSheet: { zh:" · 錯題講義", en:" · Errata Sheet" },
    quizAllChapters: { zh:"scRNA-seq 互動考題（全部章節）", en:"scRNA-seq Interactive Quiz (All Chapters)" },
    quizErrataTitle: { zh:"scRNA-seq 互動考題", en:"scRNA-seq Interactive Quiz" },
    exportTimeLabel: { zh:" · 匯出時間：", en:" · Exported: " },
    userLabel:       { zh:"使用者：", en:"User: " },
    countWrong:      { zh:n=>" · 共 "+n+" 題錯題", en:n=>" · "+n+" wrong questions" },
    noErrataMsg:     { zh:"🎉 沒有錯題，太棒了！", en:"🎉 No wrong questions — well done!" },
    statusUnans:     { zh:"未作答", en:"Not answered" },
    statusRight:     { zh:"✓ 答對", en:"✓ Correct" },
    statusWrong:     { zh:"✗ 答錯", en:"✗ Wrong" },
    columnNum:       { zh:"#", en:"#" },
    columnType:      { zh:"類型", en:"Type" },
    columnQ:         { zh:"題目", en:"Question" },
    columnYourAns:   { zh:"你的答案", en:"Your answer" },
    columnAns:       { zh:"正解", en:"Answer" },
    columnStatus:    { zh:"狀態", en:"Status" },
    expLabelStrong:  { zh:"解析：", en:"Explanation: " },
    yourAnsErrata:   { zh:"　·　你的答案：", en:" · Your answer: " }
  };

  function apply(l){
    lang = l;
    localStorage.setItem(SK, l);
    document.documentElement.lang = l==='zh' ? 'zh-Hant' : 'en';
    // Toggle data-lang blocks
    document.querySelectorAll('[data-lang]').forEach(el=>{
      el.style.display = el.dataset.lang === l ? '' : 'none';
    });
    // Swap data-zh/data-en text content
    document.querySelectorAll('[data-zh][data-en]').forEach(el=>{
      el.textContent = el.dataset[l];
    });
    // Lang toggle button label
    const btn = document.getElementById('langToggle');
    if(btn) btn.textContent = l==='zh' ? 'EN' : '中文';
    document.dispatchEvent(new CustomEvent('langchange', { detail:{ lang:l } }));
  }

  function toggle(){ apply(lang==='zh' ? 'en' : 'zh'); }
  function get(){ return lang; }
  function t(key, ...args){
    const e = STR[key];
    if(!e) return key;
    const v = e[lang] != null ? e[lang] : e.zh;
    return typeof v === 'function' ? v(...args) : v;
  }

  // Inject the toggle button into the header on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', ()=>{
    const host = document.querySelector('header .h-row') || document.querySelector('.h-row');
    if(host && !document.getElementById('langToggle')){
      const btn = document.createElement('button');
      btn.id = 'langToggle';
      btn.className = 'lang-toggle';
      btn.style.cssText = 'background:#fff;color:#1a6b5a;border:1px solid rgba(255,255,255,.5);border-radius:999px;padding:5px 14px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;white-space:nowrap';
      btn.textContent = lang==='zh' ? 'EN' : '中文';
      btn.onclick = toggle;
      // Insert before stat (or at end)
      const stat = host.querySelector('#stat');
      if(stat) host.insertBefore(btn, stat); else host.appendChild(btn);
    }
    apply(lang);
  });

  window.I18n = { apply, toggle, get, t };
})();
