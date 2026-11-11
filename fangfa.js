/* A+C 方法页交互：目录高亮、阅读进度、速查折叠、打印、回到顶部 */
(function(){
  'use strict';

  var rail = document.querySelector('.book-rail');
  var links = rail ? Array.prototype.slice.call(rail.querySelectorAll('.rail-nav a')) : [];
  var sections = links.map(function(a){
    var id = a.getAttribute('href');
    return id && id.charAt(0) === '#' ? document.querySelector(id) : null;
  }).filter(Boolean);

  function setActive(id){
    links.forEach(function(a){
      var on = a.getAttribute('href') === '#' + id;
      a.classList.toggle('active', on);
      if (on) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }

  if ('IntersectionObserver' in window && sections.length) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if (en.isIntersecting) setActive(en.target.id);
      });
    }, {rootMargin:'-16% 0px -68% 0px', threshold:0});
    sections.forEach(function(s){ io.observe(s); });
  }

  var readbar = document.getElementById('readbar');
  var railProgress = document.getElementById('railProgress');
  var toTop = document.getElementById('toTop');

  function onScroll(){
    var d = document.documentElement;
    var max = Math.max(1, d.scrollHeight - d.clientHeight);
    var p = Math.min(1, Math.max(0, d.scrollTop / max));
    if (readbar) readbar.style.width = (p * 100).toFixed(2) + '%';
    if (railProgress) railProgress.style.width = (p * 100).toFixed(2) + '%';
    if (toTop) toTop.classList.toggle('show', d.scrollTop > 900);
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  var quick = document.querySelector('.quick-rail');
  var mqMobile = window.matchMedia('(max-width:1240px)');
  function syncQuick(){
    if (!quick) return;
    if (mqMobile.matches) quick.removeAttribute('open');
    else quick.setAttribute('open', '');
  }
  syncQuick();
  if (mqMobile.addEventListener) mqMobile.addEventListener('change', syncQuick);
  else if (mqMobile.addListener) mqMobile.addListener(syncQuick);

  var printBtn = document.getElementById('printBtn');
  if (printBtn) {
    printBtn.addEventListener('click', function(){ window.print(); });
  }

  var reopened = [];
  window.addEventListener('beforeprint', function(){
    reopened = [];
    Array.prototype.slice.call(document.querySelectorAll('details:not([open])')).forEach(function(d){
      d.open = true;
      reopened.push(d);
    });
  });
  window.addEventListener('afterprint', function(){
    reopened.forEach(function(d){ d.removeAttribute('open'); });
    reopened = [];
  });

  if (toTop) {
    toTop.addEventListener('click', function(){
      window.scrollTo({top:0, behavior:'smooth'});
    });
  }

  if (location.hash) {
    var target = document.getElementById(location.hash.slice(1));
    if (target) {
      document.documentElement.style.scrollBehavior = 'auto';
      window.setTimeout(function(){
        var offset = window.innerWidth <= 1240 ? 58 : 12;
        window.scrollTo(0, target.getBoundingClientRect().top + window.scrollY - offset);
      }, 120);
    }
  }
})();
