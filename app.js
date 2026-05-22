document.addEventListener('DOMContentLoaded', () => {
    let portfolioData = null;

    const mouse = { x: null, y: null, radius: 150 };       
    const cursorRing = { x: 0, y: 0 };  

    const cursorEl = document.querySelector('.custom-cursor');
    const cursorDotEl = document.querySelector('.custom-cursor-dot');
    const overlay = document.querySelector('.page-overlay');

    // Modal elements
    const modal = document.getElementById('cert-modal');
    const modalImg = document.getElementById('cert-modal-img');
    const closeBtn = document.getElementById('cert-modal-close');

    // Sidebar Hamburger Elements
    const menuToggle = document.getElementById('menuToggle');
    const sidebarMenu = document.getElementById('sidebarMenu');
    const sidebarBackdrop = document.getElementById('sidebarBackdrop');

    // --- LOGIKA INTERAKSI RESPONSIVE SIDEBAR ---
    function toggleSidebar() {
        menuToggle.classList.toggle('open');
        sidebarMenu.classList.toggle('open');
        sidebarBackdrop.classList.toggle('open');
    }

    function closeSidebar() {
        menuToggle.classList.remove('open');
        sidebarMenu.classList.remove('open');
        sidebarBackdrop.classList.remove('open');
    }

    if(menuToggle) menuToggle.addEventListener('click', toggleSidebar);
    if(sidebarBackdrop) sidebarBackdrop.addEventListener('click', closeSidebar);

    // 1. Fetch JSON Structural Assets
    async function loadPortfolioData() {
        try {
            const response = await fetch('data.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            portfolioData = await response.json();
            initPortfolio();
        } catch (error) {
            console.error('Failed to load portfolio dynamic assets:', error);
            // Fallback aman
            document.getElementById('hero-name').textContent = "Abdul Hafiz Khairi";
            document.getElementById('hero-role').textContent = "Network Engineer & Creative Technician";
            document.getElementById('hero-bio').textContent = "Informatics Engineering student with a robust background in Computer & Network Engineering. Experienced in Kominfo's network infrastructure, system administration, and basic multimedia production.";
        }
    }

    // 2. Render Assets into DOM Trees (Mengembalikan Kode Rendering yang Sempat Hilang)
    function initPortfolio() {
        if (!portfolioData) return;

        document.getElementById('hero-name').textContent = portfolioData.profile.name;
        document.getElementById('hero-role').textContent = portfolioData.profile.role;
        document.getElementById('hero-bio').textContent = portfolioData.profile.bio;

        // Render Tombol Media Sosial (Instagram & TikTok)
        const socialContainer = document.getElementById('hero-socials');
        if (socialContainer && portfolioData.profile.socials) {
            socialContainer.innerHTML = `
                <a href="${portfolioData.profile.socials.instagram}" target="_blank" class="social-btn target-hover" aria-label="Instagram">
                    <i class="fab fa-instagram"></i> Instagram
                </a>
                <a href="${portfolioData.profile.socials.tiktok}" target="_blank" class="social-btn target-hover" aria-label="TikTok">
                    <i class="fab fa-tiktok"></i> TikTok
                </a>
            `;
        }

        // Render Education Timeline
        const eduList = document.getElementById('education-list');
        if (eduList && portfolioData.education) {
            eduList.innerHTML = '';
            portfolioData.education.forEach(edu => {
                eduList.innerHTML += `
                    <div class="resume-card target-hover">
                        <span class="card-date">${edu.year}</span>
                        <h4>${edu.institution}</h4>
                        <p style="color: var(--color-pink); font-size: 0.9rem; margin-top: 0.2rem;">${edu.major}</p>
                    </div>
                `;
            });
        }

        // Render Experience Timeline
        const expList = document.getElementById('experience-list');
        if (expList && portfolioData.experience) {
            expList.innerHTML = '';
            portfolioData.experience.forEach(exp => {
                expList.innerHTML += `
                    <div class="resume-card target-hover">
                        <span class="card-date">${exp.period}</span>
                        <h4>${exp.role}</h4>
                        <h5 style="color: var(--color-yellow); font-weight: 600; margin: 0.3rem 0 0.6rem 0;"><i class="fas fa-building mr-1"></i> ${exp.company}</h5>
                        <p class="text-justify" style="font-size: 0.9rem; line-height: 1.6; color: rgba(255,255,255,0.7);">${exp.description}</p>
                    </div>
                `;
            });
        }

        // Render Skill Grids
        const skillsGrid = document.getElementById('skills-grid');
        if (skillsGrid && portfolioData.skills) {
            skillsGrid.innerHTML = '';
            portfolioData.skills.forEach(skill => {
                const card = document.createElement('div');
                card.className = 'project-card target-hover';
                card.innerHTML = `
                    <div class="card-inner">
                        <span class="project-cat">${skill.category}</span>
                        <h3>${skill.title}</h3>
                        <p class="text-justify" style="margin-top: 0.8rem; font-size: 0.95rem; line-height: 1.6; color: rgba(255,255,255,0.75);">${skill.details}</p>
                    </div>
                `;
                skillsGrid.appendChild(card);
                initSmoothTilt(card);
            });
        }

        // Render Dynamic Certificates Grid
        const certGrid = document.getElementById('certificates-grid');
        if (certGrid && portfolioData.certificates) {
            certGrid.innerHTML = '';
            portfolioData.certificates.forEach(cert => {
                const card = document.createElement('div');
                card.className = 'cert-card target-hover';
                
                let tagsHTML = '';
                cert.tags.forEach(tag => { tagsHTML += `<span class="cert-tag">${tag}</span>`; });

                card.innerHTML = `
                    <div class="cert-card-inner">
                        <div class="cert-num">${cert.id}</div>
                        <div class="cert-img-wrap" data-src="${cert.image}">
                            <img src="${cert.image}" alt="${cert.title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                            <div class="cert-img-placeholder" style="display:none;">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
                                <span>Certificate Image</span>
                            </div>
                        </div>
                        <div class="cert-main-info">
                            <div class="cert-icon-box">${cert.icon}</div>
                            <h3>${cert.title}</h3>
                        </div>
                        <div class="cert-issuer">${cert.issuer}</div>
                        <p class="cert-desc text-justify">${cert.description}</p>
                        <div class="cert-tags">${tagsHTML}</div>
                        <span class="cert-badge ${cert.badgeClass}">${cert.badge}</span>
                    </div>
                `;
                certGrid.appendChild(card);
                initSmoothTilt(card);
                
                const imgWrap = card.querySelector('.cert-img-wrap');
                imgWrap.addEventListener('click', () => {
                    const imgNode = imgWrap.querySelector('img');
                    if (imgNode.style.display === 'none') return; 
                    modalImg.src = cert.image;
                    modal.classList.add('open');
                    document.body.style.overflow = 'hidden';
                });
            });
        }

        updateCursorListeners();
    }

    // 3. SPA Unified Routing Overlay Engine (Desktop & Sidebar Berbagi Satu Logika)
    const allRouteButtons = document.querySelectorAll('[data-page]');

    allRouteButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetPage = btn.getAttribute('data-page');
            const currentActive = document.querySelector('.page-section.active');

            if (!currentActive || currentActive.id === targetPage) {
                closeSidebar();
                return;
            }

            closeSidebar(); 
            overlay.classList.add('slide-in');

            setTimeout(() => {
                currentActive.classList.remove('active');
                const targetSec = document.getElementById(targetPage);
                if (targetSec) targetSec.classList.add('active');

                allRouteButtons.forEach(b => b.classList.remove('active'));
                document.querySelectorAll(`[data-page="${targetPage}"]`).forEach(activeBtn => {
                    activeBtn.classList.add('active');
                });

                overlay.classList.remove('slide-in');
                overlay.classList.add('slide-out');

                setTimeout(() => { overlay.classList.remove('slide-out'); }, 600);
            }, 600); 
        });
    });

    function closeModal() {
        if (modal) { modal.classList.remove('open'); document.body.style.overflow = ''; }
    }
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
    }

    // 4. Cursor Tracking
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX; mouse.y = e.clientY;
        if (cursorDotEl) cursorDotEl.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
    });
    window.addEventListener('mouseout', () => { mouse.x = null; mouse.y = null; });

    function updateCursorListeners() {
        const targets = document.querySelectorAll('.target-hover, nav button, .sidebar-btn, .cta-btn, .resume-card, .social-btn, .cert-card, .cert-img-wrap, #cert-modal-close, .menu-toggle');
        targets.forEach(el => {
            el.addEventListener('mouseenter', () => {
                if (cursorEl) cursorEl.classList.add('expand');
                if (cursorDotEl) cursorDotEl.classList.add('hide');
            });
            el.addEventListener('mouseleave', () => {
                if (cursorEl) cursorEl.classList.remove('expand');
                if (cursorDotEl) cursorDotEl.classList.remove('hide');
            });
        });
    }

    // 5. 3D Card Matrix Rotation
    function initSmoothTilt(card) {
        const inner = card.querySelector('.card-inner, .cert-card-inner');
        if (!inner) return;

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((centerY - y) / centerY) * 12;
            const rotateY = ((x - centerX) / centerX) * 12;

            card.style.transition = 'none';
            inner.style.transition = 'none';
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            const easeCurve = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
            card.style.transition = easeCurve;
            inner.style.transition = easeCurve;
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        });
    }

    // 6. Network Constellation Engine Architecture
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray = [];
        let maxDistance = 110;
        let numberOfParticles = 65;

        function setCanvasSize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            if (window.innerWidth < 640) { numberOfParticles = 35; maxDistance = 85; mouse.radius = 90; }
            else if (window.innerWidth < 1024) { numberOfParticles = 55; maxDistance = 105; mouse.radius = 120; }
            else { numberOfParticles = 75; maxDistance = 125; mouse.radius = 150; }
            initParticles();
        }

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = (Math.random() * 0.4) - 0.2;
                this.speedY = (Math.random() * 0.4) - 0.2;
                this.color = Math.random() > 0.5 ? '#FF5FCF' : '#FAEB92';
            }
            update() {
                this.x += this.speedX; this.y += this.speedY;
                if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX;
                if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY;
                
                if (mouse.x != null && mouse.y != null) {
                    let dx = mouse.x - this.x; let dy = mouse.y - this.y; let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouse.radius) {
                        let forceDirectionX = dx / distance; let forceDirectionY = dy / distance;
                        let force = (mouse.radius - distance) / mouse.radius;
                        this.x -= forceDirectionX * force * 3.0; this.y -= forceDirectionY * force * 3.0;
                    }
                }
            }
            draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fillStyle = this.color; ctx.fill(); }
        }

        function initParticles() {
            particlesArray = []; 
            for (let i = 0; i < numberOfParticles; i++) { particlesArray.push(new Particle()); }
        }

        function connectParticles() {
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let dx = particlesArray[a].x - particlesArray[b].x; let dy = particlesArray[a].y - particlesArray[b].y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < maxDistance) {
                        let opacity = (1 - (distance / maxDistance)) * 0.18;
                        ctx.strokeStyle = particlesArray[a].color === '#FF5FCF' ? `rgba(255, 95, 207, ${opacity})` : `rgba(250, 235, 146, ${opacity})`;
                        ctx.lineWidth = 0.8; ctx.beginPath(); ctx.moveTo(particlesArray[a].x, particlesArray[a].y); ctx.lineTo(particlesArray[b].x, particlesArray[b].y); ctx.stroke();
                    }
                }
            }
        }

        function animateLoop() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particlesArray.length; i++) { particlesArray[i].update(); particlesArray[i].draw(); }
            connectParticles();

            if (mouse.x !== null && mouse.y !== null && cursorEl && window.innerWidth > 768) {
                cursorRing.x += (mouse.x - cursorRing.x) * 0.12;
                cursorRing.y += (mouse.y - cursorRing.y) * 0.12;
                cursorEl.style.transform = `translate3d(${cursorRing.x}px, ${cursorRing.y}px, 0)`;
            }
            requestAnimationFrame(animateLoop);
        }

        setCanvasSize();
        window.addEventListener('resize', () => { clearTimeout(window.resizeTimer); window.resizeTimer = setTimeout(setCanvasSize, 150); });
        animateLoop();
    }

    loadPortfolioData();
});