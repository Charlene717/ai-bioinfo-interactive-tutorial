// Bilingual toggle + progress bar + active nav highlight + code tabs + quiz
(function(){
  // -------- Lang toggle --------
  const saved = localStorage.getItem('bioai-lang') || 'en';
  if(saved === 'en') document.body.classList.add('en');

  function injectToggle(){
    const nav = document.querySelector('.top-nav-inner');
    if(!nav) return;
    if(nav.querySelector('.lang-toggle')) return;
    const btn = document.createElement('button');
    btn.className = 'lang-toggle';
    btn.textContent = document.body.classList.contains('en') ? '中文' : 'EN';
    btn.addEventListener('click', () => {
      document.body.classList.toggle('en');
      const nowEn = document.body.classList.contains('en');
      btn.textContent = nowEn ? '中文' : 'EN';
      localStorage.setItem('bioai-lang', nowEn ? 'en' : 'zh');
    });
    nav.appendChild(btn);
  }

  // -------- Active nav link --------
  function highlightNav(){
    const path = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.top-nav-links a').forEach(a => {
      const href = a.getAttribute('href');
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
            // also reveal which one is correct
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

  // -------- Mobile menu --------
  function mobileMenu(){
    const links = document.querySelector('.top-nav-links');
    const brand = document.querySelector('.top-nav-brand');
    if(!links || !brand) return;
    if(window.innerWidth > 768) return;
    let burger = document.createElement('button');
    burger.textContent = '☰';
    burger.style.cssText = 'background:none;border:none;font-size:1.4rem;cursor:pointer;color:var(--c-accent-dark);padding:4px 8px';
    burger.addEventListener('click', () => links.classList.toggle('open'));
    document.querySelector('.top-nav-inner').insertBefore(burger, links);
  }

  document.addEventListener('DOMContentLoaded', () => {
    injectToggle();
    highlightNav();
    progressBar();
    codeTabs();
    quiz();
    mobileMenu();
  });
})();
