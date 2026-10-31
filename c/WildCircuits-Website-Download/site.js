(() => {
  document.body.classList.add('has-js');
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.menu-toggle');
  const closeMenu = () => {
    nav?.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  };
  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    nav?.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  addEventListener('resize', () => { if (innerWidth > 700) closeMenu(); });
  const progress = document.querySelector('.scroll-progress');
  const updateProgress = () => {
    if (!progress) return;
    const total = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = `${total > 0 ? scrollY / total * 100 : 0}%`;
  };
  addEventListener('scroll', updateProgress, { passive: true }); updateProgress();
  if ('IntersectionObserver' in window) {
    const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); reveal.unobserve(entry.target); }
    }), { threshold: .12 });
    document.querySelectorAll('.reveal').forEach(item => reveal.observe(item));
    const scene = document.querySelector('.scroll-scene');
    const steps = [...document.querySelectorAll('.story-step')];
    if (scene && steps.length) {
      const story = new IntersectionObserver(entries => entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const index = steps.indexOf(entry.target);
        scene.dataset.step = String(index + 1);
        steps.forEach((step, i) => step.classList.toggle('active', i === index));
      }), { rootMargin: '-40% 0px -42% 0px', threshold: 0 });
      steps.forEach(step => story.observe(step));
    }
  } else document.querySelectorAll('.reveal').forEach(item => item.classList.add('visible'));
  const form = document.querySelector('[data-sponsor-form]');
  if (form) {
    const status = form.querySelector('[data-status]');
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) {
        status.textContent = 'Please fill in the required fields before continuing.';
        status.className = 'form-status error';
        return;
      }
      const fields = new FormData(form);
      const interest = String(fields.get('interest') || 'sponsor conversation');
      const body = `Hello WildCircuits,\n\n${String(fields.get('message') || '')}\n\nName: ${String(fields.get('name') || '')}\nOrganization: ${String(fields.get('organization') || '')}\nInterested in: ${interest}`;
      status.textContent = 'Your email app should open with a draft. Review it before sending.';
      status.className = 'form-status';
      location.href = `mailto:ftc36611@gmail.com?subject=${encodeURIComponent(`WildCircuits — ${interest}`)}&body=${encodeURIComponent(body)}`;
    });
  }
})();

(() => {
  const panel = document.querySelector('[data-instagram-panel]');
  if (!panel) return;
  let loading = false;
  panel.addEventListener('toggle', () => {
    if (!panel.open) return;
    if (window.instgrm?.Embeds) { window.instgrm.Embeds.process(); return; }
    if (loading) return;
    loading = true;
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.instagram.com/embed.js';
    script.onload = () => { loading = false; window.instgrm?.Embeds?.process(); };
    script.onerror = () => { loading = false; script.remove(); };
    document.body.appendChild(script);
  });
})();

(() => {
 const panel=document.querySelector('[data-instagram-panel]');const frame=document.querySelector('[data-youtube-frame]');if(!panel||!frame)return;
 const buttons=[...panel.querySelectorAll('[data-video]')];const title=panel.querySelector('[data-video-title]');const watch=panel.querySelector('[data-watch-video]');const fallback=panel.querySelector('[data-youtube-fallback]');const thumbnail=panel.querySelector('[data-youtube-thumbnail]');const local=location.protocol==='file:';
 function load(){frame.hidden=local;fallback.hidden=!local;if(panel.open&&!local&&!frame.hasAttribute('src'))frame.src=frame.dataset.src;}
 panel.addEventListener('toggle',load);load();
 buttons.forEach(button=>button.addEventListener('click',()=>{const id=button.dataset.video;const match=button.dataset.match;if(button.getAttribute('aria-pressed')==='true')return;frame.dataset.src='https://www.youtube-nocookie.com/embed/'+id;if(!local)frame.src=frame.dataset.src;frame.title='Wild Circuits — Biobuzz first league meet, Match '+match;title.textContent='Watch Match '+match;watch.href='https://www.youtube.com/watch?v='+id;fallback.href=watch.href;thumbnail.src='https://i.ytimg.com/vi/'+id+'/hqdefault.jpg';thumbnail.alt='Preview of Wild Circuits FTC’s first league meet, Match '+match;fallback.querySelector('span').textContent='Watch Match '+match+' on YouTube';buttons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));}));
})();
