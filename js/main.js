document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Lógica dos Contadores Animados (Corrigida) ---
  
  const startCounter = (counter) => {
    const targetText = counter.getAttribute('data-target');
    
    // Evita reiniciar a animação
    if (counter.innerText !== '0') return; // Se já foi animado (ou não é 0), não mexe
    
    const targetNum = parseInt(targetText.replace('k', '000').replace(' rps', ''));
    const suffix = targetText.includes('k') ? 'k' : (targetText.includes(' rps') ? ' rps' : '');
    
    // Se não for um número (ex: "Automated", "Full", "Ready"), apenas define o valor e sai
    if (isNaN(targetNum)) {
      counter.innerText = targetText;
      return;
    }

    counter.innerText = '0' + suffix; // Começa do "0k" ou "0 rps"
    
    // Define um incremento mínimo para números pequenos
    let increment = Math.max(targetNum / 100, 1); // 100 etapas, ou de 1 em 1

    const updateCounter = () => {
      // Pega o valor numérico atual
      const count = +counter.innerText.replace(suffix, ''); 

      if (count < targetNum) {
        let newCount = Math.ceil(count + increment);
        if (newCount > targetNum) {
          newCount = targetNum; // Garante que não ultrapasse
        }
        counter.innerText = newCount + suffix; // "1k", "2k"... ou "100 rps"
        setTimeout(updateCounter, 20); // Intervalo da animação
      } else {
        counter.innerText = targetText; // Define o valor final exato
      }
    };
    updateCounter();
  };
  
  // O IntersectionObserver agora observará cada .stat (o card do stat)
  const statObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Encontra todos os contadores dentro do .stat que entrou na tela
        const countersInStat = entry.target.querySelectorAll('.stat-number, .stat-value');
        countersInStat.forEach(startCounter);
        observer.unobserve(entry.target); // Anima apenas uma vez por card .stat
      }
    });
  }, { 
    threshold: 0.7 // Inicia quando 70% do stat está visível
  });

  // Observa cada card .stat
  document.querySelectorAll('.stat').forEach(stat => {
    statObserver.observe(stat);
  });


  // --- 2. Lógica da Navegação de Pontos (Dot Nav) ---
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
    rootMargin: '-50% 0px -50% 0px', // Ativa quando a seção está no meio da tela
    threshold: 0
  });

  sections.forEach(section => {
    navObserver.observe(section);
  });

});