/**
 * IA NA AGRICULTURA — JAVASCRIPT EXTERNO AGRINHO 2026
 * Tema: Inteligência Artificial Aplicada à Agricultura
 * Funcionalidades: tema escuro, ajuste de fonte, menu mobile,
 *                  abas, contadores, canvas de partículas,
 *                  scroll reveal, ordenação de referências,
 *                  formulário de newsletter e navegação suave.
 */

(function () {
    "use strict";

    const body = document.body;
    const header = document.getElementById("header");
    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");
    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = document.getElementById("themeIcon");
    const fontIncrease = document.getElementById("fontIncrease");
    const fontDecrease = document.getElementById("fontDecrease");
    const backToTop = document.getElementById("backToTop");
    const canvas = document.getElementById("particleCanvas");
    const ctx = canvas ? canvas.getContext("2d") : null;
    const heroStats = document.getElementById("heroStats");
    const appsTabs = document.getElementById("appsTabs");
    const refSort = document.getElementById("refSort");
    const referencesList = document.getElementById("referencesList");


    let currentFontSize = 16;
    let isDarkTheme = false;
    let particles = [];
    let animationFrameId = null;
    let statsAnimated = false;

    // ---------- TEMA ----------
    function toggleTheme() {
        isDarkTheme = !isDarkTheme;
        if (isDarkTheme) {
            body.classList.add("dark-theme");
            themeIcon.textContent = "☀️";
            themeToggle.setAttribute("aria-label", "Ativar tema claro");
        } else {
            body.classList.remove("dark-theme");
            themeIcon.textContent = "🌙";
            themeToggle.setAttribute("aria-label", "Ativar tema escuro");
        }
        initParticles();
    }

    if (themeToggle) {
        themeToggle.addEventListener("click", toggleTheme);
    }

    // ---------- FONTE ----------
    function updateFontSize(delta) {
        const minSize = 12;
        const maxSize = 24;
        let newSize = currentFontSize + delta;
        if (newSize >= minSize && newSize <= maxSize) {
            currentFontSize = newSize;
            document.documentElement.style.fontSize = currentFontSize + "px";
        }
    }

    if (fontIncrease) {
        fontIncrease.addEventListener("click", function () {
            updateFontSize(1);
        });
    }

    if (fontDecrease) {
        fontDecrease.addEventListener("click", function () {
            updateFontSize(-1);
        });
    }

    // ---------- MENU MOBILE ----------
    function toggleMenu() {
        const isOpen = mainNav.classList.toggle("open");
        menuToggle.setAttribute("aria-expanded", isOpen);
        if (isOpen) {
            menuToggle.setAttribute("aria-label", "Fechar menu mobile");
        } else {
            menuToggle.setAttribute("aria-label", "Abrir menu mobile");
        }
    }

    function closeMenu() {
        if (mainNav.classList.contains("open")) {
            mainNav.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Abrir menu mobile");
        }
    }

    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", toggleMenu);
    }

    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach(function (link) {
        link.addEventListener("click", closeMenu);
    });

    // ---------- ABAS ----------
    function initTabs() {
        if (!appsTabs) return;
        const tabButtons = appsTabs.querySelectorAll("[role='tab']");
        const tabPanels = appsTabs.querySelectorAll("[role='tabpanel']");

        tabButtons.forEach(function (btn) {
            btn.addEventListener("click", function () {
                const targetId = btn.getAttribute("aria-controls");

                tabButtons.forEach(function (b) {
                    b.classList.remove("active");
                    b.setAttribute("aria-selected", "false");
                    b.setAttribute("tabindex", "-1");
                });

                btn.classList.add("active");
                btn.setAttribute("aria-selected", "true");
                btn.setAttribute("tabindex", "0");

                tabPanels.forEach(function (panel) {
                    panel.classList.remove("active");
                    panel.hidden = true;
                });

                const targetPanel = document.getElementById(targetId);
                if (targetPanel) {
                    targetPanel.classList.add("active");
                    targetPanel.hidden = false;
                }
            });

            btn.addEventListener("keydown", function (e) {
                let index = Array.prototype.indexOf.call(tabButtons, btn);
                let nextIndex = index;

                if (e.key === "ArrowRight") {
                    nextIndex = (index + 1) % tabButtons.length;
                } else if (e.key === "ArrowLeft") {
                    nextIndex = (index - 1 + tabButtons.length) % tabButtons.length;
                } else if (e.key === "Home") {
                    nextIndex = 0;
                } else if (e.key === "End") {
                    nextIndex = tabButtons.length - 1;
                } else {
                    return;
                }

                e.preventDefault();
                tabButtons[nextIndex].focus();
                tabButtons[nextIndex].click();
            });
        });
    }

    initTabs();

    // ---------- CONTADORES ----------
    function animateCounters() {
        if (!heroStats || statsAnimated) return;
        const counters = heroStats.querySelectorAll("[data-target]");
        if (counters.length === 0) return;

        statsAnimated = true;
        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);

            counters.forEach(function (counter) {
                const target = parseInt(counter.getAttribute("data-target"), 10);
                const current = Math.round(target * ease);
                counter.textContent = current;
            });

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    // ---------- PARTÍCULAS ----------
    function resizeCanvas() {
        if (!canvas) return;
        const parent = canvas.parentElement;
        if (!parent) return;
        const rect = parent.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    }

    function createParticles() {
        const count = window.innerWidth < 768 ? 30 : 60;
        const list = [];
        const w = canvas.width;
        const h = canvas.height;
        for (let i = 0; i < count; i++) {
            list.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.6,
                vy: (Math.random() - 0.5) * 0.6,
                radius: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2,
                type: Math.random() > 0.5 ? "circle" : "square"
            });
        }
        return list;
    }

    function drawParticles() {
        if (!ctx || !canvas) return;
        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        const color = isDarkTheme ? "34, 211, 238" : "22, 163, 74";

        particles.forEach(function (p) {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > w) p.vx *= -1;
            if (p.y < 0 || p.y > h) p.vy *= -1;

            ctx.beginPath();
            if (p.type === "circle") {
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            } else {
                ctx.rect(p.x - p.radius, p.y - p.radius, p.radius * 2, p.radius * 2);
            }
            ctx.fillStyle = "rgba(" + color + ", " + p.opacity + ")";
            ctx.fill();
        });

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = "rgba(" + color + ", " + (0.1 * (1 - dist / 100)) + ")";
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }

        animationFrameId = requestAnimationFrame(drawParticles);
    }

    function initParticles() {
        if (!canvas) return;
        resizeCanvas();
        particles = createParticles();
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        drawParticles();
    }

    if (canvas) {
        window.addEventListener("resize", function () {
            resizeCanvas();
            particles = createParticles();
        });
        initParticles();
    }

    // ---------- SCROLL REVEAL ----------
    const revealElements = document.querySelectorAll(
        ".content-section, .column-card, .tech-card, .future-card, .challenge-item, .ref-item"
    );

    function revealOnScroll() {
        const windowHeight = window.innerHeight;
        const triggerOffset = 100;

        revealElements.forEach(function (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top < windowHeight - triggerOffset) {
                el.classList.add("visible");
            }
        });

        if (heroStats) {
            const statsRect = heroStats.getBoundingClientRect();
            if (statsRect.top < windowHeight - 50) {
                animateCounters();
            }
        }

        if (backToTop) {
            if (window.scrollY > 500) {
                backToTop.classList.add("visible");
            } else {
                backToTop.classList.remove("visible");
            }
        }

        if (header) {
            if (window.scrollY > 10) {
                header.style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)";
            } else {
                header.style.boxShadow = "none";
            }
        }
    }

    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll();

    // ---------- ORDENAÇÃO DE REFERÊNCIAS ----------
    function sortReferences() {
        if (!refSort || !referencesList) return;

        const value = refSort.value;
        const items = Array.from(referencesList.querySelectorAll(".ref-item"));

        if (value === "year-asc") {
            items.sort(function (a, b) {
                const yearA = parseInt(a.getAttribute("data-year"), 10);
                const yearB = parseInt(b.getAttribute("data-year"), 10);
                return yearA - yearB;
            });
        } else if (value === "year-desc") {
            items.sort(function (a, b) {
                const yearA = parseInt(a.getAttribute("data-year"), 10);
                const yearB = parseInt(b.getAttribute("data-year"), 10);
                return yearB - yearA;
            });
        } else {
            items.sort(function (a, b) {
                return (
                    parseInt(a.getAttribute("data-index") || "0", 10) -
                    parseInt(b.getAttribute("data-index") || "0", 10)
                );
            });
        }

        items.forEach(function (item) {
            referencesList.appendChild(item);
        });
    }

    if (referencesList) {
        const allRefs = referencesList.querySelectorAll(".ref-item");
        allRefs.forEach(function (item, index) {
            item.setAttribute("data-index", index);
        });
    }

    if (refSort) {
        refSort.addEventListener("change", sortReferences);
    }

    // ---------- VOLTAR AO TOPO ----------
    if (backToTop) {
        backToTop.addEventListener("click", function () {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    // ---------- FECHAR MENU AO REDIMENSIONAR ----------
    window.addEventListener("resize", function () {
        if (window.innerWidth > 768) {
            closeMenu();
        }
        if (canvas) {
            resizeCanvas();
        }
    });

    console.log("IA na Agricultura — Agrinho 2026 inicializado com sucesso.");
})();
