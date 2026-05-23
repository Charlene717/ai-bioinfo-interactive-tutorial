// AI × Bioinformatics tutorial · i18n + interactive components
// - localStorage key 'bioai-lang' shared with the quiz subsite
// - data-zh / data-en attributes on any element get textContent-swapped on toggle
// - data-zh-ph / data-en-ph swap placeholder/aria-label attributes
// - data-lang="zh" / data-lang="en" blocks are toggled via CSS too (kept for backwards compat)
// - <title> with data-zh/data-en gets swapped (browser tab follows language)
(function(){
  const SK = 'bioai-lang';
  const saved = localStorage.getItem(SK) || 'en';
  if(saved === 'en') document.body.classList.add('en');

  function curLang(){ return document.body.classList.contains('en') ? 'en' : 'zh'; }

  // -------- Core: text content swap --------
  function applyLangText(){
    const l = curLang();
    // 1) generic elements
    document.querySelectorAll('[data-zh][data-en]').forEach(el=>{
      // Avoid breaking elements that have child element nodes — only swap if all
      // children are text nodes (i.e., element holds only translatable text).
      const onlyText = Array.from(el.childNodes).every(n => n.nodeType === Node.TEXT_NODE);
      if(onlyText){ el.textContent = el.dataset[l]; }
      else {
        // For mixed-content elements, swap only direct text-node children.
        // First text child wins; subsequent text nodes are emptied.
        let first = true;
        for(const n of el.childNodes){
          if(n.nodeType === Node.TEXT_NODE){
            n.textContent = first ? el.dataset[l] : '';
            first = false;
          }
        }
      }
    });
    // 2) placeholder / aria-label
    document.querySelectorAll('[data-zh-ph][data-en-ph]').forEach(el=>{
      el.placeholder = el.dataset[l + 'Ph'];
    });
    document.querySelectorAll('[data-zh-aria][data-en-aria]').forEach(el=>{
      el.setAttribute('aria-label', el.dataset[l + 'Aria']);
    });
    // 3) document.documentElement lang attribute (a11y / SEO / fonts)
    document.documentElement.lang = (l === 'zh') ? 'zh-Hant' : 'en';
    // 4) broadcast event so dynamic widgets can re-render
    document.dispatchEvent(new CustomEvent('langchange', { detail:{ lang:l } }));
  }

  function injectToggle(){
    const nav = document.querySelector('.top-nav-inner');
    if(!nav) return;
    if(nav.querySelector('.lang-toggle')) return;
    const btn = document.createElement('button');
    btn.className = 'lang-toggle';
    btn.setAttribute('aria-label', 'Toggle language');
    btn.textContent = document.body.classList.contains('en') ? '中文' : 'EN';
    btn.addEventListener('click', () => {
      document.body.classList.toggle('en');
      const nowEn = document.body.classList.contains('en');
      btn.textContent = nowEn ? '中文' : 'EN';
      localStorage.setItem(SK, nowEn ? 'en' : 'zh');
      applyLangText();
    });
    nav.appendChild(btn);
  }

  // -------- Active nav link highlight --------
  function highlightNav(){
    const path = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.top-nav-links a').forEach(a => {
      const href = (a.getAttribute('href') || '').split('/').pop();
      if(href === path) a.classList.add('active');
    });
  }

  // -------- Reading progress bar --------
  function progressBar(){
    const bar = document.getElementById('progressBar');
    if(!bar) return;
    function update(){
      const h = document.documentElement;
      const scrolled = h.scrollTop;
      const max = h.scrollHeight - h.clientHeight;
      const pct = max > 0 ? (scrolled / max) * 100 : 0;
      bar.style.width = pct + '%';
    }
    document.addEventListener('scroll', update, {passive:true});
    update();
  }

  // -------- Code tab switching --------
  function codeTabs(){
    document.querySelectorAll('.code-tabs').forEach(group => {
      const btns = group.querySelectorAll('.code-tab-btn');
      const panes = group.querySelectorAll('.code-tab-content');
      btns.forEach((b, i) => {
        b.addEventListener('click', () => {
          btns.forEach(x => x.classList.remove('active'));
          panes.forEach(x => x.classList.remove('active'));
          b.classList.add('active');
          if(panes[i]) panes[i].classList.add('active');
        });
      });
    });
  }

  // -------- Quiz interactions --------
  function quiz(){
    document.querySelectorAll('.quiz-q').forEach(q => {
      const opts = q.querySelectorAll('.quiz-opt');
      const fb = q.querySelector('.quiz-feedback');
      opts.forEach(opt => {
        opt.addEventListener('click', () => {
          opts.forEach(o => o.classList.remove('correct','wrong'));
          const correct = opt.dataset.correct === 'true';
          opt.classList.add(correct ? 'correct' : 'wrong');
          if(!correct){
            const right = q.querySelector('.quiz-opt[data-correct="true"]');
            if(right) right.classList.add('correct');
          }
          if(fb){
            fb.classList.remove('correct-fb','wrong-fb');
            fb.classList.add(correct ? 'correct-fb' : 'wrong-fb','show');
          }
        });
      });
    });
  }

  // -------- Collapsible <details>-style discussion blocks --------
  function discuss(){
    document.querySelectorAll('.discuss-toggle').forEach(btn=>{
      const id = btn.dataset.target;
      const tgt = id && document.getElementById(id);
      if(!tgt) return;
      btn.addEventListener('click', ()=>{
        const isOpen = tgt.classList.toggle('open');
        btn.textContent = isOpen
          ? (curLang()==='en' ? '▼ Hide' : '▼ 收合')
          : (curLang()==='en' ? '▶ Show discussion' : '▶ 展開深入討論');
      });
    });
  }

  // -------- Mobile menu --------
  function mobileMenu(){
    const links = document.querySelector('.top-nav-links');
    if(!links) return;
    if(window.innerWidth > 768) return;
    const burger = document.createElement('button');
    burger.textContent = '☰';
    burger.setAttribute('aria-label','Menu');
    burger.style.cssText = 'background:none;border:none;font-size:1.4rem;cursor:pointer;color:var(--c-accent-dark);padding:4px 8px';
    burger.addEventListener('click', () => links.classList.toggle('open'));
    const inner = document.querySelector('.top-nav-inner');
    if(inner) inner.insertBefore(burger, links);
  }

  // -------- Expose minimal API --------
  window.BioAI = {
    lang: curLang,
    apply: applyLangText
  };

  document.addEventListener('DOMContentLoaded', () => {
    injectToggle();
    highlightNav();
    progressBar();
    codeTabs();
    quiz();
    discuss();
    mobileMenu();
    applyLangText();   // run once after DOM ready
  });
})();
