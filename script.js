// Funcionalidades gerais do site VerdeTEC

let lastScrollTop = 0; // Variável para armazenar a última posição do scroll

document.addEventListener("DOMContentLoaded", () => {
  // Animações suaves ao carregar a página
  const elementos = document.querySelectorAll(".curiosidade-item, .noticia, .card");
  elementos.forEach((elemento, index) => {
    elemento.style.animationDelay = '${index * 0.1}s';
  });

  // Smooth scroll para links internos
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });


const btnMobile = document.getElementById('btn-mobile');
const menuNav = document.getElementById('menu');

if (btnMobile && menuNav) {
  // Função para abrir/fechar o menu
  btnMobile.addEventListener('click', () => {
    // O classList.toggle adiciona a classe se não existir e remove se existir [2]
    menuNav.classList.toggle('active');
    btnMobile.classList.toggle('active');
  });

  // Fecha o menu ao clicar em links (exceto se for dropdown)
  menuNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (!link.parentElement.classList.contains('dropdown')) {
        menuNav.classList.remove('active');
        btnMobile.classList.remove('active');
      }
    });
  });
}

// 3. Lógica do cabeçalho ao rolar a página
window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
  const headerElement = document.querySelector("header") || document.querySelector(".nav");

  if (headerElement) {
    if (currentScroll > lastScrollTop && currentScroll > 100) {
      // Esconde o menu ao rolar para baixo
      headerElement.classList.add("menu-hidden");
    } else {
      // Mostra o menu ao rolar para cima
      headerElement.classList.remove("menu-hidden");
    }
  }
  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
}, { passive: true });

  //OU(DUAS OPÇOES)

 //window.addEventListener("scroll", () => {
  //const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
  //const headerElement = document.querySelector("header");
  //const menu = document.querySelector(".nav .menu"); // 👈 pega o menu

  //if (headerElement) {
    // Só esconde se o menu não estiver aberto
    //if (!menu.classList.contains("active")) {
      //if (currentScroll > lastScrollTop && currentScroll > 100) {
        //headerElement.classList.add("menu-hidden");
      //} else if (currentScroll < lastScrollTop || currentScroll <= 100) {
        //headerElement.classList.remove("menu-hidden");
      //}
    //}
  //}
  //lastScrollTop = currentScroll;
//});


  // Carrega preferências do usuário
  loadUserPreferences();

  // Lazy loading de imagens
  lazyLoadImages();

  // Botão de voltar ao topo
  addScrollToTopButton();

  // Acessibilidade: Esc fecha modais
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const modals = document.querySelectorAll(".modal");
      modals.forEach((modal) => {
        if (modal.style.display === "block") {
          modal.style.display = "none";
        }
      });
    }
  });

  // Animações de estatísticas quando visíveis
  const destaquesStatsSection = document.querySelector(".estatisticas");
  if (destaquesStatsSection) {
    statsObserver.observe(destaquesStatsSection);
  }

  const curiosidadesStatsSection = document.querySelector(".estatisticas-ambientais");
  if (curiosidadesStatsSection) {
    statsObserver.observe(curiosidadesStatsSection);
  }
});

// Função para mostrar/ocultar menu mobile (extra, pode ser usada globalmente)
function toggleMenu() {
  const menu = document.querySelector(".menu");
  const menuToggle = document.querySelector(".menu-toggle");
  if (menu && menuToggle) {
    menu.classList.toggle("active");
    menuToggle.classList.toggle("active");
  }
}

// Função para lazy loading de imagens
function lazyLoadImages() {
  const images = document.querySelectorAll("img[data-src]");
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy");
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));
}

// Função para scroll suave até o topo
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}


// Função para validar formulários
function validateForm(formId) {
  const form = document.getElementById(formId);
  const inputs = form.querySelectorAll("input[required], textarea[required]");
  let isValid = true;

  inputs.forEach((input) => {
    if (!input.value.trim()) {
      input.classList.add("error");
      isValid = false;
    } else {
      input.classList.remove("error");
    }
  });

  return isValid;
}

// Função para mostrar notificações
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = "notification ${type}";
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("show");
  }, 100);

  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Função para compartilhar conteúdo
function shareContent(title, url) {
  if (navigator.share) {
    navigator.share({
      title: title,
      url: url,
    });
  } else {
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      title
    )}&url=${encodeURIComponent(url)}`;
    window.open(shareUrl, "_blank");
  }
}

// Função para salvar preferências do usuário
function saveUserPreferences() {
  const preferences = {
    theme: document.body.classList.contains("dark-theme") ? "dark" : "light",
    fontSize: document.documentElement.style.fontSize || "16px",
  };
  localStorage.setItem("verdetec-preferences", JSON.stringify(preferences));
}

// Função para carregar preferências do usuário
function loadUserPreferences() {
  const saved = localStorage.getItem("verdetec-preferences");
  if (saved) {
    const preferences = JSON.parse(saved);
    if (preferences.theme === "dark") {
      document.body.classList.add("dark-theme");
    }
    if (preferences.fontSize) {
      document.documentElement.style.fontSize = preferences.fontSize;
    }
  }
}

// Função para ajustar tamanho da fonte
function adjustFontSize(action) {
  const root = document.documentElement;
  const currentSize = Number.parseFloat(getComputedStyle(root).fontSize);

  let newSize;
  if (action === "increase") {
    newSize = Math.min(currentSize + 2, 24);
  } else if (action === "decrease") {
    newSize = Math.max(currentSize - 2, 12);
  } else {
    newSize = 16; // reset
  }

  root.style.fontSize = newSize + "px";
  saveUserPreferences();
  showNotification('Tamanho da fonte ajustado para ${newSize}px');
}

// Função para busca avançada
function advancedSearch(query, filters = {}) {
  const results = [];
  const content = document.querySelectorAll("article, section, .curiosidade-item");

  content.forEach((element) => {
    const text = element.textContent.toLowerCase();
    const title =
      element.querySelector("h1, h2, h3")?.textContent.toLowerCase() || "";

    if (text.includes(query.toLowerCase()) || title.includes(query.toLowerCase())) {
      results.push({
        element: element,
        title: title,
        relevance: calculateRelevance(text, title, query),
      });
    }
  });

  return results.sort((a, b) => b.relevance - a.relevance);
}

// Função auxiliar para calcular relevância da busca
function calculateRelevance(text, title, query) {
  const titleMatches = (title.match(new RegExp(query, "gi")) || []).length * 3;
  const textMatches = (text.match(new RegExp(query, "gi")) || []).length;
  return titleMatches + textMatches;
}

// Animação de números (estatísticas)
function animarNumeros() {
  const stats = document.querySelectorAll(".stat-number");
  stats.forEach((stat) => {
    const originalText = stat.textContent;
    const target = Number.parseInt(originalText.replace(/[^0-9]/g, ""));

    if (isNaN(target)) {
      stat.textContent = originalText;
      return;
    }

    let current = 0;
    const increment = target / 50;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        stat.textContent =
          target +
          (originalText.includes("%")
            ? "%"
            : originalText.includes("+")
            ? "+"
            : "");
        clearInterval(timer);
      } else {
        stat.textContent =
          Math.floor(current) +
          (originalText.includes("%")
            ? "%"
            : originalText.includes("+")
            ? "+"
            : "");
      }
    }, 50);
  });
}

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        window.VerdeTEC.animarNumeros();
        statsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

// Exporta funções para uso global
window.VerdeTEC = {
  toggleMenu,
  scrollToTop,
  validateForm,
  showNotification,
  shareContent,
  toggleTheme,
  adjustFontSize,
  advancedSearch,
  animarNumeros,
};