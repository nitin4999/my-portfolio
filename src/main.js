import './style.css';
document.addEventListener('DOMContentLoaded', () => {
  // 1. Custom Cursor Glow
  const cursor = document.querySelector('.cursor-glow');
  document.addEventListener('mousemove', (e) => {
    if(cursor) {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    }
  });
  document.addEventListener('mousedown', () => {
    if(cursor) {
      cursor.style.width = '350px';
      cursor.style.height = '350px';
    }
  });
  document.addEventListener('mouseup', () => {
    if(cursor) {
      cursor.style.width = '400px';
      cursor.style.height = '400px';
    }
  });
  // 2. Card Hover Glow Effect
  const cards = document.querySelectorAll('.project-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
  // 3. Typewriter Effect
  const texts = [
    "AI Automation Developer",
    "Chatbot Engineer",
    "Workflow Architect"
  ];
  let count = 0;
  let index = 0;
  let currentText = '';
  let letter = '';
  let isDeleting = false;
  
  const typeZone = document.querySelector('.typewriter');
  
  function type() {
    if (count === texts.length) {
      count = 0;
    }
    currentText = texts[count];
    
    if (isDeleting) {
      letter = currentText.slice(0, --index);
    } else {
      letter = currentText.slice(0, ++index);
    }
    
    if(typeZone) typeZone.textContent = letter;
    
    let typeSpeed = isDeleting ? 50 : 100;
    
    if (!isDeleting && letter.length === currentText.length) {
      typeSpeed = 2000; // Pause at end
      isDeleting = true;
    } else if (isDeleting && letter.length === 0) {
      isDeleting = false;
      count++;
      typeSpeed = 500; // Pause before next word
    }
    
    setTimeout(type, typeSpeed);
  }
  
  if(typeZone) type();
  // 4. Scroll Reveal
  const reveals = document.querySelectorAll('.reveal');
  const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };
  
  const revealObserver = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('active');
      observer.unobserve(entry.target);
    });
  }, revealOptions);
  
  reveals.forEach(reveal => {
    revealObserver.observe(reveal);
  });
  // 5. Navbar background on scroll
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
  // 8. Hamburger Mobile Menu
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  
  if(hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
    
    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }
  // 7. Theme Switcher Logic
  let primaryRGB = '0, 240, 255'; // default
  
  function updateThemeColor() {
     primaryRGB = getComputedStyle(document.documentElement).getPropertyValue('--primary-rgb').trim() || '0, 240, 255';
  }
  updateThemeColor(); // run once on load
  const themeDots = document.querySelectorAll('.theme-option');
  themeDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const theme = dot.getAttribute('data-theme');
      if(theme === 'cyberpunk') {
         document.documentElement.removeAttribute('data-theme');
      } else {
         document.documentElement.setAttribute('data-theme', theme);
      }
      
      themeDots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
      
      // close menu logic can be handled naturally via css hover off, but here we just update state
      
      updateThemeColor();
      
      if(window.particlesArray) {
        window.particlesArray.forEach(p => p.color = `rgba(${primaryRGB}, 0.4)`);
      }
    });
  });
  // 6. Network/Particle Canvas Background
  const canvas = document.getElementById('bg-canvas');
  if(canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    window.particlesArray = [];
    const numberOfParticles = Math.min(100, Math.floor(window.innerWidth / 15));
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = `rgba(${primaryRGB}, 0.4)`;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }
      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    function init() {
      window.particlesArray = [];
      for (let i = 0; i < numberOfParticles; i++) {
        window.particlesArray.push(new Particle());
      }
    }
    function connect() {
      let opacityValue = 1;
      for (let a = 0; a < window.particlesArray.length; a++) {
        for (let b = a; b < window.particlesArray.length; b++) {
          let distance = ((window.particlesArray[a].x - window.particlesArray[b].x) * (window.particlesArray[a].x - window.particlesArray[b].x))
            + ((window.particlesArray[a].y - window.particlesArray[b].y) * (window.particlesArray[a].y - window.particlesArray[b].y));
          
          if (distance < (canvas.width/7) * (canvas.height/7)) {
            opacityValue = 1 - (distance / 20000);
            ctx.strokeStyle = `rgba(${primaryRGB}, ${opacityValue * 0.15})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(window.particlesArray[a].x, window.particlesArray[a].y);
            ctx.lineTo(window.particlesArray[b].x, window.particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    }
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < window.particlesArray.length; i++) {
        window.particlesArray[i].update();
        window.particlesArray[i].draw();
      }
      connect();
      requestAnimationFrame(animate);
    }
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    });
    init();
    animate();
  }
});
