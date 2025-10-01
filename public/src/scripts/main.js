// ==============================================================================
// MATTYTR.DEV PORTFOLIO - MAIN SCRIPT
// ==============================================================================

// ==============================================================================
// CONSTANTS & CONFIGURATION
// ==============================================================================
const SCROLL_THRESHOLD = 50;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour
const ANIMATION_DELAYS = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6];

// ==============================================================================
// THEME MANAGEMENT
// ==============================================================================
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.sunIcon = this.themeToggle?.querySelector('.sun-icon');
        this.moonIcon = this.themeToggle?.querySelector('.moon-icon');
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        
        this.init();
    }

    init() {
        if (!this.themeToggle) {
            console.error('Theme toggle button not found!');
            return;
        }
        
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        this.updateIcons();
        this.bindEvents();
    }

    updateIcons() {
        if (!this.sunIcon || !this.moonIcon) return;
        
        if (this.currentTheme === 'dark') {
            this.sunIcon.style.display = 'block';
            this.moonIcon.style.display = 'none';
        } else {
            this.sunIcon.style.display = 'none';
            this.moonIcon.style.display = 'block';
        }
    }

    bindEvents() {
        this.themeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleTheme();
        });
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
        this.updateIcons();
        navbarManager.updateBackground();
    }
}

// ==============================================================================
// NAVBAR MANAGEMENT
// ==============================================================================
class NavbarManager {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.isScrolled = false;
        this.isMobileExpanded = false;
        this.isMobile = this.isTouchDevice();
        this.touchStartTime = 0;
        this.expandTimeout = null;
        
        this.init();
    }

    init() {
        if (!this.navbar) return;
        
        this.updateHeight();
        this.bindEvents();
        this.setupMobileTouchBehavior();
    }

    isTouchDevice() {
        return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
    }

    bindEvents() {
        window.addEventListener('load', () => this.updateHeight());
        window.addEventListener('resize', () => {
            this.isMobile = this.isTouchDevice();
            this.updateHeight();
        });
        window.addEventListener('scroll', () => this.handleScroll());
    }

    setupMobileTouchBehavior() {
        if (!this.navbar) return;

        // Handle mobile touch/tap on navbar
        this.navbar.addEventListener('touchstart', (e) => {
            if (!this.isMobile) return;
            this.touchStartTime = Date.now();
            
            if (this.isScrolled && !this.isMobileExpanded) {
                e.preventDefault();
                this.expandMobileNavbar();
            }
        });

        this.navbar.addEventListener('click', (e) => {
            if (!this.isMobile) return;
            
            const target = e.target.closest('.nav-icon');
            if (!target) return;

            // If navbar is collapsed and not expanded, expand it first
            if (this.isScrolled && !this.isMobileExpanded) {
                e.preventDefault();
                this.expandMobileNavbar();
                return;
            }
        });

        // Collapse mobile navbar when clicking outside
        document.addEventListener('touchstart', (e) => {
            if (!this.isMobile || !this.isMobileExpanded) return;
            
            if (!this.navbar.contains(e.target)) {
                this.collapseMobileNavbar();
            }
        });

        // Auto-collapse after navigation
        document.querySelectorAll('.nav-icon[href^="#"]').forEach(link => {
            link.addEventListener('click', () => {
                if (this.isMobile && this.isMobileExpanded) {
                    setTimeout(() => this.collapseMobileNavbar(), 100);
                }
            });
        });
    }

    expandMobileNavbar() {
        if (!this.isMobile) return;
        
        this.isMobileExpanded = true;
        this.navbar.classList.add('mobile-expanded');
        
        // Auto-collapse after 3 seconds if no interaction
        this.expandTimeout = setTimeout(() => {
            this.collapseMobileNavbar();
        }, 3000);
    }

    collapseMobileNavbar() {
        if (!this.isMobile) return;
        
        this.isMobileExpanded = false;
        this.navbar.classList.remove('mobile-expanded');
        
        if (this.expandTimeout) {
            clearTimeout(this.expandTimeout);
            this.expandTimeout = null;
        }
    }

    updateHeight() {
        if (!this.navbar) return;
        
        const height = this.navbar.getBoundingClientRect().height;
        document.documentElement.style.setProperty('--navbar-height', `${height}px`);
    }

    handleScroll() {
        const scrolled = window.pageYOffset;
        const shouldScroll = scrolled > SCROLL_THRESHOLD;
        
        if (shouldScroll !== this.isScrolled) {
            this.isScrolled = shouldScroll;
            this.navbar.classList.toggle('scrolled', shouldScroll);
            this.updateBackground();
            this.updateHeight();
        }
    }

    updateBackground() {
        if (!this.navbar) return;
        
        const scrolled = window.pageYOffset;
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        
        if (scrolled > SCROLL_THRESHOLD) {
            const progress = Math.min((scrolled - SCROLL_THRESHOLD) / 150, 1);
            const opacity = 0.95 + (progress * 0.03);
            
            this.navbar.style.background = isLight 
                ? `rgba(255, 255, 255, ${opacity})`
                : `rgba(0, 0, 0, ${opacity})`;
        } else {
            this.navbar.style.background = isLight 
                ? 'rgba(255, 255, 255, 0.95)'
                : 'rgba(0, 0, 0, 0.95)';
        }
    }
}

// ==============================================================================
// SMOOTH SCROLLING & NAVIGATION
// ==============================================================================
class SmoothScrollManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindScrollLinks();
        this.setupSectionObserver();
    }

    bindScrollLinks() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => this.handleAnchorClick(e, anchor));
        });
    }

    handleAnchorClick(e, anchor) {
        e.preventDefault();
        const targetId = anchor.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (!target) return;

        const navbar = document.querySelector('.navbar');
        const navbarHeight = navbar?.getBoundingClientRect().height || 0;
        const offset = this.getScrollOffset(targetId, navbarHeight);
        
        const elementPosition = target.getBoundingClientRect().top;
        const scrollPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
            top: scrollPosition,
            behavior: 'smooth'
        });

        this.updateActiveNavLink(anchor);
    }

    getScrollOffset(targetId, navbarHeight) {
        const offsets = {
            '#creative': navbarHeight + 40,
            '#development': navbarHeight + 40,
            '#contact': navbarHeight + 20,
            '#hero': 0,
            '#top': 0
        };
        
        return offsets[targetId] || navbarHeight + 20;
    }

    updateActiveNavLink(activeAnchor) {
        document.querySelectorAll('.nav-icon').forEach(link => {
            link.classList.remove('active-nav-link');
        });
        
        if (activeAnchor.classList.contains('nav-icon')) {
            activeAnchor.classList.add('active-nav-link');
        }
    }

    setupSectionObserver() {
        const sections = document.querySelectorAll('section, #hero');
        const navLinks = this.buildNavLinksMap();
        
        let throttleTimer = null;
        const throttledUpdate = () => {
            if (throttleTimer) return;
            throttleTimer = setTimeout(() => {
                this.updateActiveSectionNav(sections, navLinks);
                throttleTimer = null;
            }, 100);
        };

        window.addEventListener('scroll', throttledUpdate);
        setTimeout(() => this.updateActiveSectionNav(sections, navLinks), 500);
    }

    buildNavLinksMap() {
        const navLinks = {};
        document.querySelectorAll('.nav-icon[href^="#"]').forEach(link => {
            const targetId = link.getAttribute('href');
            navLinks[targetId] = link;
        });
        return navLinks;
    }

    updateActiveSectionNav(sections, navLinks) {
        const scrollPosition = window.scrollY + 100;
        let activeSection = this.findActiveSection(sections, scrollPosition);
        
        if (activeSection && navLinks[`#${activeSection.id}`]) {
            document.querySelectorAll('.nav-icon').forEach(link => {
                link.classList.remove('active-nav-link');
            });
            navLinks[`#${activeSection.id}`].classList.add('active-nav-link');
        }
    }

    findActiveSection(sections, scrollPosition) {
        let activeSection = null;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionBottom = sectionTop + sectionHeight;
            
            if (scrollPosition >= sectionTop - 200 && scrollPosition < sectionBottom - 100) {
                activeSection = section;
            }
        });

        if (!activeSection) {
            let closestDistance = Infinity;
            sections.forEach(section => {
                const distance = Math.abs(scrollPosition - section.offsetTop);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    activeSection = section;
                }
            });
        }

        return activeSection;
    }
}

// ==============================================================================
// VISUAL EFFECTS & ANIMATIONS
// ==============================================================================
class VisualEffectsManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupPageTransition();
        this.setupSectionAnimations();
        this.setupHeroFadeEffect();
        this.setupButtonRippleEffect();
        this.addRippleStyles();
    }

    setupPageTransition() {
        document.body.style.opacity = '0';
        window.addEventListener('load', () => {
            document.body.style.opacity = '1';
            document.body.style.transition = 'opacity 0.5s ease-in';
        });
    }

    setupSectionAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        document.querySelectorAll('section').forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'all 0.8s ease-out';
            observer.observe(section);
        });
    }

    setupHeroFadeEffect() {
        const heroDescription = document.querySelector('.hero-description');
        const heroTitle = document.querySelector('.hero-title');
        
        if (!heroDescription || !heroTitle) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroHeight = window.innerHeight;
            
            const fadeProgress = Math.min(scrolled / (heroHeight * 0.5), 1);
            heroDescription.style.opacity = 1 - fadeProgress;
            heroDescription.style.transform = `translateY(${fadeProgress * 30}px)`;
            
            const titleFadeProgress = Math.min(scrolled / (heroHeight * 0.8), 1);
            heroTitle.style.opacity = 1 - (titleFadeProgress * 0.3);
        });
    }

    setupButtonRippleEffect() {
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', (e) => this.createRipple(e, button));
        });
    }

    createRipple(e, button) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;

        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }

    addRippleStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ==============================================================================
// GITHUB PORTFOLIO MANAGEMENT
// ==============================================================================
class GitHubPortfolio {
    constructor(username, options = {}) {
        this.username = username;
        this.options = {
            maxRepos: options.maxRepos || 6,
            excludeForked: options.excludeForked !== false,
            sortBy: options.sortBy || 'updated',
            ...options
        };
        this.repositories = [];
        this.filteredRepositories = [];
        this.currentFilter = 'all';
        this.languageColors = this.initLanguageColors();
        this.languageSymbols = this.initLanguageSymbols();
    }

    async init() {
        try {
            const projectsLoading = document.getElementById('projects-loading');
            const projectsGrid = document.getElementById('projects-grid');
            
            if (!projectsGrid) return;
            
            projectsLoading?.classList.remove('hidden');
            projectsGrid.innerHTML = '';
            
            await this.fetchRepositories();
            await this.applyFilter('pinned');
            this.setupFilterButtons();
            
        } catch (error) {
            this.renderError(error);
        }
    }

    async fetchRepositories() {
        try {
            const cachedData = this.getCachedData();
            if (cachedData) {
                this.repositories = cachedData;
                this.filteredRepositories = [...this.repositories];
                return this.repositories;
            }

            const response = await fetch(
                `https://api.github.com/users/${this.username}/repos?sort=${this.options.sortBy}&per_page=100`
            );
            
            if (!response.ok) {
                throw new Error(`GitHub API Error: ${response.status}`);
            }

            const repos = await response.json();
            const filteredRepos = this.filterAndSortRepositories(repos);
            
            this.repositories = filteredRepos.slice(0, this.options.maxRepos);
            this.filteredRepositories = [...this.repositories];
            
            this.cacheData();
            return this.repositories;
            
        } catch (error) {
            console.error('Error loading GitHub repositories:', error);
            
            const fallbackData = this.getFallbackCachedData();
            if (fallbackData) {
                this.repositories = fallbackData;
                this.filteredRepositories = [...this.repositories];
                return this.repositories;
            }
            
            throw error;
        }
    }

    getCachedData() {
        const cacheKey = `github_repos_${this.username}`;
        const cacheTimeKey = `github_repos_time_${this.username}`;
        const cachedData = localStorage.getItem(cacheKey);
        const cacheTime = localStorage.getItem(cacheTimeKey);
        
        if (cachedData && cacheTime && (Date.now() - parseInt(cacheTime)) < CACHE_DURATION) {
            console.log('Loading repositories from cache');
            return JSON.parse(cachedData);
        }
        
        return null;
    }

    getFallbackCachedData() {
        const cacheKey = `github_repos_${this.username}`;
        const cachedData = localStorage.getItem(cacheKey);
        
        if (cachedData) {
            console.log('Using expired cache as fallback');
            return JSON.parse(cachedData);
        }
        
        return null;
    }

    cacheData() {
        const cacheKey = `github_repos_${this.username}`;
        const cacheTimeKey = `github_repos_time_${this.username}`;
        
        localStorage.setItem(cacheKey, JSON.stringify(this.repositories));
        localStorage.setItem(cacheTimeKey, Date.now().toString());
        console.log('Repositories cached successfully');
    }

    filterAndSortRepositories(repos) {
        let filtered = repos.filter(repo => {
            if (this.options.excludeForked && repo.fork) return false;
            if (repo.private) return false;
            return true;
        });

        return filtered.sort((a, b) => {
            const scoreA = a.stargazers_count * 2 + (a.forks_count || 0);
            const scoreB = b.stargazers_count * 2 + (b.forks_count || 0);
            return scoreB - scoreA;
        });
    }

    async fetchPinnedRepositories() {
        try {
            const sortedRepos = [...this.repositories].sort((a, b) => {
                const scoreA = (a.stargazers_count * 3) + (a.forks_count * 2) + 
                              (a.watchers_count * 1) + (new Date(a.updated_at).getTime() / 1000000000);
                const scoreB = (b.stargazers_count * 3) + (b.forks_count * 2) + 
                              (b.watchers_count * 1) + (new Date(b.updated_at).getTime() / 1000000000);
                return scoreB - scoreA;
            });
            
            const knownPinned = ['LetsGoDeeperV2', 'mattytr.dev'];
            const pinnedRepos = this.repositories.filter(repo => knownPinned.includes(repo.name));
            
            return pinnedRepos.length > 0 ? pinnedRepos : sortedRepos.slice(0, 3);
            
        } catch (error) {
            console.error('Error getting pinned repositories:', error);
            return this.repositories.slice(0, 3);
        }
    }

    async applyFilter(filter) {
        this.currentFilter = filter;
        
        switch (filter) {
            case 'pinned':
                this.filteredRepositories = await this.fetchPinnedRepositories();
                break;
            case 'recent':
                this.filteredRepositories = [...this.repositories].sort((a, b) => 
                    new Date(b.updated_at) - new Date(a.updated_at)
                );
                break;
            default:
                this.filteredRepositories = [...this.repositories];
        }
        
        await this.renderProjects();
    }

    setupFilterButtons() {
        const pinnedBtn = document.querySelector('.filter-btn[data-filter="pinned"]');
        if (pinnedBtn) {
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            pinnedBtn.classList.add('active');
        }

        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                await this.applyFilter(e.target.dataset.filter);
            });
        });
    }

    async renderProjects() {
        const projectsGrid = document.getElementById('projects-grid');
        const projectsLoading = document.getElementById('projects-loading');
        
        if (this.filteredRepositories.length === 0) {
            this.renderEmptyState(projectsGrid);
            return;
        }
        
        const projectsHTML = await Promise.all(
            this.filteredRepositories.map(repo => this.generateProjectCard(repo))
        );
        
        projectsGrid.innerHTML = projectsHTML.join('');
        projectsLoading?.classList.add('hidden');
        
        this.filteredRepositories.forEach(repo => this.updateProjectLanguages(repo));
    }

    renderEmptyState(container) {
        container.innerHTML = `
            <div class="projects-error">
                <h3>No Projects Found</h3>
                <p>No GitHub repositories could be loaded.</p>
                <button class="retry-btn" onclick="portfolioManager.init()">Try Again</button>
            </div>
        `;
    }

    renderError(error) {
        const projectsGrid = document.getElementById('projects-grid');
        const projectsLoading = document.getElementById('projects-loading');
        
        projectsGrid.innerHTML = `
            <div class="projects-error">
                <h3>Error Loading Projects</h3>
                <p>${error.message || 'Could not load GitHub repositories.'}</p>
                <button class="retry-btn" onclick="portfolioManager.init()">Try Again</button>
            </div>
        `;
        
        projectsLoading?.classList.add('hidden');
    }

    async generateProjectCard(repo) {
        const hasScreenshot = await this.hasCustomScreenshot(repo.name);
        
        return `
            <div class="project-card" data-stars="${repo.stargazers_count}" data-repo-id="${repo.id}">
                <div class="project-image">
                    ${hasScreenshot ? this.generateScreenshotHTML(repo) : this.generatePlaceholderHTML(repo)}
                    ${this.generateHoverOverlayHTML(repo)}
                </div>
            </div>
        `;
    }

    generateScreenshotHTML(repo) {
        return `
            <img src="./assets/screenshots/${repo.name}.png" 
                 alt="${repo.name} Screenshot" 
                 loading="lazy" 
                 onerror="portfolioManager.handleImageError(this, '${repo.name}')">
        `;
    }

    generatePlaceholderHTML(repo) {
        return `
            <div class="project-placeholder">
                <svg viewBox="0 0 24 24" fill="currentColor" class="project-placeholder-icon">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <h3 class="project-placeholder-title">${repo.name}</h3>
                <p class="project-placeholder-desc">${repo.description || 'Repository'}</p>
            </div>
        `;
    }

    generateHoverOverlayHTML(repo) {
        const websiteButton = repo.homepage ? `
            <a href="${repo.homepage}" target="_blank" class="project-action-btn" title="Visit Website">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
                </svg>
            </a>
        ` : '';

        const githubButton = `
            <a href="${repo.html_url}" target="_blank" class="project-action-btn" title="GitHub Repository">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
            </a>
        `;

        return `
            <div class="project-hover-overlay">
                ${websiteButton}
                ${githubButton}
            </div>
        `;
    }

    async hasCustomScreenshot(repoName) {
        try {
            const response = await fetch(`./assets/screenshots/${repoName}.png`, { method: 'HEAD' });
            return response.ok;
        } catch {
            return false;
        }
    }

    handleImageError(imgElement, repoName) {
        console.log(`Screenshot failed for ${repoName}, showing placeholder`);
        const parentDiv = imgElement.parentElement;
        imgElement.style.display = 'none';
        
        if (!parentDiv.querySelector('.project-placeholder')) {
            const placeholder = document.createElement('div');
            placeholder.className = 'project-placeholder';
            placeholder.innerHTML = this.generatePlaceholderHTML({ name: repoName });
            parentDiv.appendChild(placeholder);
        }
    }

    async updateProjectLanguages(repo) {
        const techContainer = document.getElementById(`project-tech-${repo.id}`);
        if (!techContainer) return;

        try {
            const languages = await this.fetchLanguages(repo);
            if (languages && Object.keys(languages).length > 0) {
                this.renderLanguageTags(techContainer, languages);
            }
        } catch (error) {
            console.error('Error updating project languages:', error);
        }
    }

    async fetchLanguages(repo) {
        if (!repo.languages_url) return null;
        
        const response = await fetch(repo.languages_url);
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        
        return response.json();
    }

    renderLanguageTags(container, languages) {
        const sortedLanguages = this.sortLanguagesByUsage(languages);
        const totalBytes = Object.values(languages).reduce((a, b) => a + b, 0);
        
        const languagesHTML = sortedLanguages.map(language => {
            const color = this.languageColors[language] || '#586069';
            const symbol = this.languageSymbols[language] || '?';
            const percentage = Math.round((languages[language] / totalBytes) * 100);
            const title = percentage > 5 ? `${language} (${percentage}%)` : language;
            
            return `<span class="project-language" 
                           style="background-color: ${color}70; color: var(--text-color); border: 1px solid ${color};" 
                           title="${title}">${symbol}</span>`;
        }).join('');

        const loadingIndicator = container.querySelector('.languages-loading');
        loadingIndicator?.remove();
        
        container.insertAdjacentHTML('beforeend', languagesHTML);
    }

    sortLanguagesByUsage(languages) {
        return Object.entries(languages)
            .sort((a, b) => b[1] - a[1])
            .map(entry => entry[0]);
    }

    initLanguageColors() {
        return {
            'JavaScript': '#f1e05a', 'TypeScript': '#2b7489', 'Python': '#3572A5',
            'Java': '#b07219', 'C++': '#f34b7d', 'C#': '#239120', 'C': '#555555',
            'PHP': '#4F5D95', 'Ruby': '#701516', 'Go': '#00ADD8', 'Rust': '#dea584',
            'Swift': '#ffac45', 'Kotlin': '#F18E33', 'Dart': '#00B4AB', 'HTML': '#e34c26',
            'CSS': '#563d7c', 'SCSS': '#c6538c', 'Vue': '#4FC08D', 'React': '#61DAFB'
        };
    }

    initLanguageSymbols() {
        return {
            'JavaScript': 'JS', 'TypeScript': 'TS', 'Python': 'PY', 'Java': 'JV',
            'C++': 'C++', 'C#': 'C#', 'C': 'C', 'PHP': 'PHP', 'Ruby': 'RB',
            'Go': 'GO', 'Rust': 'RS', 'Swift': 'SW', 'Kotlin': 'KT', 'Dart': 'DT',
            'HTML': 'HTML', 'CSS': 'CSS', 'SCSS': 'SCSS', 'Vue': 'VUE', 'React': 'REACT'
        };
    }

    clearCache() {
        const cacheKey = `github_repos_${this.username}`;
        const cacheTimeKey = `github_repos_time_${this.username}`;
        localStorage.removeItem(cacheKey);
        localStorage.removeItem(cacheTimeKey);
        console.log('Repository cache cleared');
    }
}

// ==============================================================================
// UTILITY FUNCTIONS
// ==============================================================================
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#48bb78' : '#f56565'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        z-index: 1001;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

function handleContactForm(event) {
    event.preventDefault();
    showNotification('Message sent successfully!');
}

// ==============================================================================
// GLOBAL MANAGERS INITIALIZATION
// ==============================================================================
let themeManager, navbarManager, scrollManager, effectsManager, portfolioManager;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize core managers
    themeManager = new ThemeManager();
    navbarManager = new NavbarManager();
    scrollManager = new SmoothScrollManager();
    effectsManager = new VisualEffectsManager();
    
    // Initialize portfolio if projects grid exists
    if (document.getElementById('projects-grid')) {
        portfolioManager = new GitHubPortfolio('MathisTRD', {
            maxRepos: 6,
            excludeForked: true,
            sortBy: 'updated'
        });
        portfolioManager.init();
    }
});

// Add notification styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(notificationStyles);
