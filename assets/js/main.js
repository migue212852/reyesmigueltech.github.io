/* Miguel Reyes Tech — vanilla JavaScript, no external dependencies */
(() => {
  'use strict';
  const root = document.body.dataset.root || '';
  const $ = (selector) => document.querySelector(selector);
  const all = (selector) => Array.from(document.querySelectorAll(selector));

  // Navigation: every main menu label opens its own page, the chevron opens a submenu.
  const navigation = $('#primary-nav');
  const menuButton = $('#menu-toggle');
  if (navigation && menuButton) {
    menuButton.addEventListener('click', () => {
      const expanded = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!expanded));
      navigation.classList.toggle('is-open', !expanded);
    });
    all('.nav-trigger').forEach(button => {
      button.addEventListener('click', event => {
        event.stopPropagation();
        const parent = button.closest('.nav-entry');
        const opening = !parent.classList.contains('open');
        all('.nav-entry.open').forEach(entry => {
          entry.classList.remove('open');
          entry.querySelector('.nav-trigger')?.setAttribute('aria-expanded', 'false');
        });
        parent.classList.toggle('open', opening);
        button.setAttribute('aria-expanded', String(opening));
      });
    });
    document.addEventListener('click', event => {
      if (!event.target.closest('.nav-entry')) {
        all('.nav-entry.open').forEach(entry => {
          entry.classList.remove('open');
          entry.querySelector('.nav-trigger')?.setAttribute('aria-expanded', 'false');
        });
      }
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        all('.nav-entry.open').forEach(entry => {
          entry.classList.remove('open');
          entry.querySelector('.nav-trigger')?.setAttribute('aria-expanded', 'false');
        });
        if (navigation.classList.contains('is-open')) {
          navigation.classList.remove('is-open');
          menuButton.setAttribute('aria-expanded', 'false');
          menuButton.focus();
        }
      }
    });
  }
  all('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  // JSON content library. Dynamic text is always inserted using textContent, not arbitrary HTML.
  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  };
  function safeUrl(raw) {
    if (typeof raw !== 'string' || !raw.trim()) return null;
    const value = raw.trim();
    if (/^https:\/\/[a-z0-9.-]+(?:[:/\?#]|$)/i.test(value)) return value;
    if (/^(?!\/|\.|#)[a-z0-9_\-áéíóúñ]+(?:\/[a-z0-9_\-.%áéíóúñ]+)*\.(?:pdf|html|htm|ipynb|zip|md)$/i.test(value)) return root + value;
    return null;
  }
  function empty(container, instruction, available=true) {
    container.replaceChildren();
    const box = element('div', 'empty-state');
    box.append(element('strong', '', available ? 'Material en preparación' : 'No hay resultados para este filtro'));
    box.append(element('p', '', instruction));
    container.append(box);
  }
  function documentCard(record, options={}) {
    const article = element('article', 'document-card');
    const copy = element('div');
    const type = record.category || record.type || options.type || 'Recurso';
    const parts = [type, record.year, record.event].filter(v => v !== undefined && v !== null && v !== '');
    copy.append(element('div', 'doc-meta', parts.join('  ·  ')));
    copy.append(element('h3', '', record.title || 'Sin título'));
    if (record.description || record.authors) copy.append(element('p', '', record.description || record.authors));
    article.append(copy);
    const href = safeUrl(record.pdf || record.url || record.link || '');
    if (href) {
      const link = element('a', 'doc-link', 'Abrir recurso ↗');
      link.href = href;
      if (/^https:\/\//.test(href)) { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
      else if (/\.pdf(?:[?#]|$)/i.test(href)) { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
      link.setAttribute('aria-label', 'Abrir recurso: ' + (record.title || 'Documento'));
      article.append(link);
    }
    return article;
  }
  function populateList(id, items, options={}) {
    const holder = document.getElementById(id);
    if (!holder) return;
    const selected = Array.isArray(items) ? items : [];
    if (!selected.length) { empty(holder, options.emptyText || 'Podés incorporar registros desde assets/data/content.json.'); return; }
    holder.replaceChildren(...selected.map(item => documentCard(item, options)));
  }
  function initTeaching(items) {
    const holder = $('#teaching-list');
    if (!holder) return;
    const entries = Array.isArray(items) ? items : [];
    let active = 'Todos';
    let search = '';
    function refresh() {
      const selected = entries.filter(r => (active === 'Todos' || r.category === active) &&
        `${r.title || ''} ${r.description || ''} ${r.category || ''}`.toLocaleLowerCase('es').includes(search));
      if (selected.length === 0) {
        empty(holder, entries.length ? 'Probá otra categoría o cambiá los términos de búsqueda.' : 'Colocá archivos PDF en docs/teaching/ y agregá sus datos a assets/data/content.json.', !entries.length);
      } else { holder.replaceChildren(...selected.map(r => documentCard(r))); }
    }
    all('[data-teaching-filter]').forEach(button => button.addEventListener('click', () => {
      active = button.dataset.teachingFilter;
      all('[data-teaching-filter]').forEach(b => { b.classList.toggle('active', b === button); b.setAttribute('aria-pressed', String(b === button)); });
      refresh();
    }));
    $('#teaching-search')?.addEventListener('input', event => { search = event.target.value.toLocaleLowerCase('es').trim(); refresh(); });
    refresh();
  }
  function initProfile(profile) {
    const pdf = safeUrl(profile.cvPdf || '');
    all('[data-cv-button]').forEach(anchor => {
      if (pdf && /\.pdf$/i.test(pdf)) { anchor.href = pdf; anchor.hidden = false; }
      else { anchor.hidden = true; }
    });
    all('[data-cv-hint]').forEach(node => node.hidden = Boolean(pdf));
    const github = safeUrl(profile.github || '');
    all('[data-github]').forEach(anchor => {
      if (github) anchor.href = github;
      else anchor.hidden = true;
    });
    const email = typeof profile.email === 'string' ? profile.email.trim() : '';
    all('[data-email]').forEach(a => {
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { a.href = `mailto:${email}`; a.hidden = false; }
      else { a.hidden = true; }
    });
    all('[data-email-hint]').forEach(n => n.hidden = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
  }
  fetch(root + 'assets/data/content.json')
    .then(response => { if (!response.ok) throw new Error(`HTTP ${response.status}`); return response.json(); })
    .then(data => {
      initProfile(data.profile || {});
      initTeaching(data.teaching);
      populateList('portfolio-list', data.portfolio, {emptyText:'Sumá proyectos, demostraciones y repositorios en el apartado portfolio de assets/data/content.json.'});
      populateList('publications-list', data.publications, {emptyText:'Agregá artículos, capítulos o preprints reales y sus DOI, URL o PDF en assets/data/content.json.'});
      populateList('conferences-list', data.conferences, {emptyText:'Subí las diapositivas en PDF a docs/conferencias/ y registrá cada conferencia en assets/data/content.json.'});
      populateList('outreach-list', data.divulgacion, {emptyText:'Agregá recursos de divulgación en assets/data/content.json (apartado divulgacion).'});
      const research = Array.isArray(data.researchProjects) ? data.researchProjects : [];
      const area = document.body.dataset.researchArea;
      if (area) populateList('research-project-list', research.filter(r=>r.area===area), {emptyText:'Este repositorio está organizado y listo para recibir proyectos; incorporalos en el archivo JSON bajo researchProjects.'});
    })
    .catch(err => {
      console.warn('No se pudo leer content.json; abrir el sitio con un servidor HTTP.', err);
      initProfile({}); initTeaching([]);
      ['portfolio-list','publications-list','conferences-list','outreach-list','research-project-list'].forEach(id => {
        const target = document.getElementById(id);
        if (target) empty(target, 'No fue posible cargar el índice de contenidos. Revisá assets/data/content.json y probá con un servidor HTTP local.');
      });
    });

  // Animated overlay aligned precisely with the 1920x1080 Canva image. The image itself is never modified.
  const canvas = $('#cover-canvas');
  if (canvas) {
    const context = canvas.getContext('2d', {alpha: true});
    if (context) {
      const home = $('#cover');
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      const vertices = [
        [145,330],[75,354],[192,377],[161,409],[81,464],[126,503],
        [185,531],[217,573],[108,663],[180,662],[220,663],[273,731],
        [183,776],[314,796],[164,821],[460,805],[355,888],[430,884],
        [522,865],[604,880],[64,874],[156,868],[44,604],[126,573],[262,819]
      ];
      const edges = [
        [0,1],[0,2],[1,3],[2,3],[3,4],[3,5],[3,6],[4,5],[5,6],[5,7],
        [5,23],[6,7],[6,9],[7,10],[7,11],[8,9],[8,20],[9,10],[9,12],
        [10,11],[11,12],[11,13],[12,14],[12,13],[13,15],[13,16],[14,21],
        [14,16],[15,17],[15,18],[16,17],[17,18],[18,19],[20,21],[22,23],[23,8],
        [9,23],[10,13],[8,12],[16,24],[24,13],[15,19]
      ];
      let width = 1, height = 1, dpr = 1, frameHandle = 0, lastFrame = 0;
      const colors = { cyan:[176,246,243], violet:[198,175,255], pink:[241,176,240] };
      function resize() {
        width = Math.max(1, home.clientWidth);
        height = Math.max(1, home.clientHeight);
        dpr = Math.min(2, window.devicePixelRatio || 1);
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
      }
      function draw(timestamp) {
        // 30fps maximum, with no animation when the user requests reduced motion.
        if (!reduceMotion.matches && timestamp - lastFrame < 32) { frameHandle = requestAnimationFrame(draw); return; }
        lastFrame = timestamp;
        context.setTransform(1,0,0,1,0,0);
        context.clearRect(0,0,canvas.width,canvas.height);
        context.setTransform(canvas.width/1920,0,0,canvas.height/1080,0,0);
        const t = reduceMotion.matches ? 0 : timestamp * .001;
        const positions = vertices.map(([x,y],i) => [x + Math.sin(t * .42 + i*1.73)*5,
          y + Math.cos(t * .37 + i*1.25)*6]);
        // A light connected mesh follows the graph nodes on the left side of the Canva illustration.
        edges.forEach(([a,b],i) => {
          const [ax,ay] = positions[a], [bx,by] = positions[b];
          context.beginPath(); context.moveTo(ax,ay); context.lineTo(bx,by);
          context.lineWidth = 1.45;
          context.strokeStyle = `rgba(180,236,255,${0.11 + 0.065*Math.sin(t*.8+i*.4)**2})`;
          context.stroke();
        });
        positions.forEach(([x,y],i) => {
          const r = 2.5+1.6*(1+Math.sin(t*1.1+i))/2;
          context.beginPath();context.arc(x,y,r+7,0,Math.PI*2);
          context.fillStyle = 'rgba(179,243,255,.07)';context.fill();
          context.beginPath();context.arc(x,y,r,0,Math.PI*2);
          context.fillStyle = i%4===0?'rgba(232,192,250,.76)':'rgba(183,232,255,.68)';context.fill();
        });
        // Wavefield at the bottom: curves gently oscillate, preserving the linework of the image.
        for(let j=0;j<16;j++) {
          const p=j/15;
          context.beginPath();
          for(let x=680;x<=1920;x+=17){
            const phase=(x-680)/145+t*.3+p*2.1;
            const arch=Math.sin((x-680)/1240*Math.PI);
            const y=900 - 150*arch + (p-.5)*175 + Math.sin(phase)* (12+44*arch);
            if(x===680)context.moveTo(x,y);else context.lineTo(x,y);
          }
          const c = j%2 ? colors.violet : colors.cyan;
          context.strokeStyle=`rgba(${c.join(',')},.12)`;context.lineWidth=1.25;context.stroke();
        }
        // Subtle ellipses over the existing toroidal line geometry (upper right).
        for(let j=0;j<11;j++) {
          const theta=t*.045+j*.39;
          const rx=280+j*3,ry=165-j*2;
          context.beginPath();
          for(let k=0;k<=120;k++) {
            const a=k/120*Math.PI*2;
            const x=1555+rx*Math.cos(a)*Math.cos(theta)-72*Math.sin(a)*Math.sin(theta);
            const y=246+ry*Math.sin(a)*Math.cos(theta)+27*Math.cos(a)*Math.sin(theta);
            if(k===0)context.moveTo(x,y);else context.lineTo(x,y);
          }
          context.strokeStyle=j%2?'rgba(225,166,237,.085)':'rgba(154,246,226,.095)';
          context.lineWidth=1.15;context.stroke();
        }
        if (!reduceMotion.matches && !document.hidden) frameHandle = requestAnimationFrame(draw);
      }
      resize();
      draw(0);
      window.addEventListener('resize', () => { resize(); if(reduceMotion.matches)draw(0); }, {passive:true});
      document.addEventListener('visibilitychange', () => { if(!document.hidden && !reduceMotion.matches) { cancelAnimationFrame(frameHandle); frameHandle=requestAnimationFrame(draw); } });
      reduceMotion.addEventListener?.('change', () => { cancelAnimationFrame(frameHandle); draw(0); });
    }
  }
})();
