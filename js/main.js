document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Lógica dos Contadores Animados (Idêntica à v20) ---
  
  const startCounter = (counter) => {
    const targetText = counter.getAttribute('data-target');
    if (counter.innerText !== '0') return; 
    
    const targetNum = parseInt(targetText.replace('k', '000').replace(' rps', '').replace('<', '').replace('>', '').replace('$', '').replace('/h', ''));
    const prefix = targetText.startsWith('<') ? '<' : (targetText.startsWith('>') ? '>' : '');
    const suffix = targetText.includes('k') ? 'k' : (targetText.includes(' rps') ? ' rps' : (targetText.includes('/h') ? '/h' : ''));
    
    if (isNaN(targetNum)) {
      counter.innerText = targetText;
      return;
    }
    counter.innerText = '0' + suffix; 
    let increment = Math.max(targetNum / 100, 1); 

    const updateCounter = () => {
      const count = +counter.innerText.replace(suffix, '').replace(prefix, ''); 
      if (count < targetNum) {
        let newCount = Math.ceil(count + increment);
        if (newCount > targetNum) newCount = targetNum; 
        if (suffix === 'k' && newCount > 1000) {
            counter.innerText = prefix + Math.round(newCount/1000) + suffix;
        } else {
            counter.innerText = prefix + newCount + suffix;
        }
        setTimeout(updateCounter, 20); 
      } else {
        counter.innerText = targetText; 
      }
    };
    updateCounter();
  };
  
  const statObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const countersInStat = entry.target.querySelectorAll('.stat-number, .stat-value');
        countersInStat.forEach(startCounter);
        observer.unobserve(entry.target); 
      }
    });
  }, { 
    threshold: 0.7 
  });
  document.querySelectorAll('.stat').forEach(stat => {
    statObserver.observe(stat);
  });


  // --- 2. Lógica da Navegação de Pontos (Dot Nav) (Idêntica à v20) ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.dot-nav a');
  
  const navMap = new Map();
  navLinks.forEach(link => {
    navMap.set(link.hash, link);
  });

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        const currentLink = navMap.get(`#${id}`);
        navLinks.forEach(link => link.classList.remove('active'));
        if (currentLink) {
          currentLink.classList.add('active');
        }
      }
    });
  }, {
    rootMargin: '-50% 0px -50% 0px', 
    threshold: 0
  });
  sections.forEach(section => {
    navObserver.observe(section);
  });
  
  
  // --- 3. Lógica de Animação de Scroll (Idêntica à v20) ---
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  const animationObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // Anima apenas uma vez
      }
    });
  }, { 
    threshold: 0.1 // Gatilho quando 10% do elemento está visível
  });
  animatedElements.forEach(el => {
    animationObserver.observe(el);
  });
  

  // --- 4. NOVA Lógica de Título Dinâmico (v22) ---
  
  const originalTitle = document.title;
  const comeBackTitle = "Come back! Let's build something.";

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      document.title = comeBackTitle;
    } else {
      document.title = originalTitle;
    }
  });

});