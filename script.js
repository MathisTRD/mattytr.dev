// Theme Toggle Funktionalität
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    
    // Prüfen ob Element existiert
    if (!themeToggle) {
        console.error('Theme-Toggle-Button nicht gefunden!');
        return;
    }
    
    const currentTheme = localStorage.getItem('theme') || 'dark';
    
    // Theme beim Laden setzen
    document.documentElement.setAttribute('data-theme', currentTheme);
    console.log('Initial theme set to:', currentTheme);
    
    themeToggle.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Theme toggle clicked!');
        
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        console.log('Switching from', currentTheme, 'to', newTheme);
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Navbar-Hintergrund für das neue Theme anpassen
        updateNavbarBackground();
    });
}

// Navbar-Hintergrund basierend auf Theme und Scroll-Position aktualisieren
function updateNavbarBackground() {
    const navbar = document.querySelector('.navbar');
    const scrolled = window.pageYOffset;
    const scrollStart = 50;
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    
    if (scrolled > scrollStart) {
        const progress = Math.min((scrolled - scrollStart) / 150, 1);
        const bgOpacity = 0.95 + (progress * 0.03);
        
        if (isLight) {
            navbar.style.background = `rgba(255, 255, 255, ${bgOpacity})`;
        } else {
            navbar.style.background = `rgba(0, 0, 0, ${bgOpacity})`;
        }
    } else {
        if (isLight) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        } else {
            navbar.style.background = 'rgba(0, 0, 0, 0.95)';
        }
    }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Elegante Navbar-Animation: Zusammenziehen von beiden Seiten zur Mitte
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const scrolled = window.pageYOffset;
    
    const scrollStart = 50;
    
    if (scrolled > scrollStart) {
        // Navbar schrumpft - CSS übernimmt die komplette Animation
        navbar.classList.add('scrolled');
        
        // Hintergrund wird dunkler/heller basierend auf Theme
        updateNavbarBackground();
        
    } else {
        navbar.classList.remove('scrolled');
        updateNavbarBackground();
    }
});

// Intersection Observer for animations
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

// Observe all sections for animation
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'all 0.8s ease-out';
    observer.observe(section);
});

// Add typing effect to hero title (optional)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Contact form handling (if you add a form later)
function handleContactForm(event) {
    event.preventDefault();
    
    // Add your form handling logic here
    console.log('Contact form submitted');
    
    // Show success message
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.textContent = 'Nachricht erfolgreich gesendet!';
    successMessage.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #48bb78;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        z-index: 1001;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(successMessage);
    
    setTimeout(() => {
        successMessage.remove();
    }, 3000);
}

// Add slide-in animation for success message
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Parallax effect for hero section (subtle)
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroSection = document.querySelector('.hero-section');
    const parallaxSpeed = 0.5;
    
    heroSection.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    document.body.style.transition = 'opacity 0.5s ease-in';
});

// Set initial body opacity
document.body.style.opacity = '0';

// Add hover effect for project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add click effect for buttons
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
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
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// GitHub Portfolio Integration
class GitHubPortfolio {
    constructor(username, options = {}) {
        this.username = username;
        this.options = {
            maxRepos: options.maxRepos || 6,
            excludeForked: options.excludeForked !== false,
            sortBy: options.sortBy || 'updated',
            ...options
        };
        this.projects = [];
        this.filteredProjects = [];
        this.currentFilter = 'all';
    }

    async fetchRepositories() {
        try {
            const response = await fetch(`https://api.github.com/users/${this.username}/repos?sort=${this.options.sortBy}&per_page=100`);
            
            if (!response.ok) {
                throw new Error(`GitHub API Fehler: ${response.status}`);
            }

            const repos = await response.json();
            
            // Filter repositories
            let filteredRepos = repos.filter(repo => {
                if (this.options.excludeForked && repo.fork) return false;
                if (repo.private) return false;
                return true;
            });

            // Sort by stars and recent activity
            filteredRepos.sort((a, b) => {
                const aScore = a.stargazers_count * 2 + (a.forks_count || 0);
                const bScore = b.stargazers_count * 2 + (b.forks_count || 0);
                return bScore - aScore;
            });

            this.projects = filteredRepos.slice(0, this.options.maxRepos);
            this.filteredProjects = [...this.projects];
            
            return this.projects;
        } catch (error) {
            console.error('Fehler beim Laden der GitHub Repositories:', error);
            throw error;
        }
    }

    async fetchPinnedRepositories() {
        try {
            // GitHub's GraphQL API für pinned repos (vereinfachte Version)
            const query = `
                query {
                    user(login: "${this.username}") {
                        pinnedItems(first: 6, types: REPOSITORY) {
                            nodes {
                                ... on Repository {
                                    name
                                    description
                                    url
                                    homepageUrl
                                    stargazerCount
                                    forkCount
                                    primaryLanguage {
                                        name
                                        color
                                    }
                                    updatedAt
                                    topics(first: 10) {
                                        nodes {
                                            topic {
                                                name
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            `;

            // Fallback: Use regular repos if GraphQL is not available
            return this.projects.slice(0, 3);
        } catch (error) {
            console.warn('Pinned repositories konnten nicht geladen werden, verwende reguläre Repos');
            return this.projects.slice(0, 3);
        }
    }

    generateProjectCard(repo) {
        const updatedDate = new Date(repo.updated_at).toLocaleDateString('de-DE');
        const language = repo.language || 'Unknown';
        const languageColor = this.getLanguageColor(language);
        
        const topics = repo.topics ? repo.topics.slice(0, 3) : [];
        
        // Generate project image URL - prioritize different sources
        const projectImageUrl = this.getProjectImageUrl(repo);
        
        return `
            <div class="project-card" data-language="${language.toLowerCase()}" data-stars="${repo.stargazers_count}">
                <div class="project-image">
                    ${projectImageUrl ? `
                        <img src="${projectImageUrl}" alt="${repo.name} Screenshot" loading="lazy" onerror="this.style.display='none';">
                    ` : ''}
                    <div class="project-image-overlay"></div>
                    <div class="project-language-indicator" style="background-color: ${languageColor}">
                        ${language}
                    </div>
                    <div class="project-stats">
                        <div class="project-stat">
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
                            </svg>
                            ${repo.stargazers_count}
                        </div>
                        <div class="project-stat">
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.25 2.25 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878z"/>
                            </svg>
                            ${repo.forks_count}
                        </div>
                    </div>
                </div>
                <div class="project-content">
                    <div class="project-header">
                        <h3><a href="${repo.html_url}" target="_blank" class="project-title-link">${repo.name}</a></h3>
                        <div class="project-links">
                            <a href="${repo.html_url}" target="_blank" class="project-link" title="GitHub Repository">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                                </svg>
                            </a>
                            ${repo.homepage ? `
                                <a href="${repo.homepage}" target="_blank" class="project-link" title="Live Demo">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                        <path d="M3.75 2a.75.75 0 00-.75.75v10.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75V2.75a.75.75 0 00-.75-.75H3.75zm6.854 5.146a.5.5 0 010 .708l-3 3a.5.5 0 01-.708-.708L9.043 8 6.896 5.854a.5.5 0 11.708-.708l3 3z"/>
                                    </svg>
                                </a>
                            ` : ''}
                        </div>
                    </div>
                    <p>${repo.description || 'Keine Beschreibung verfügbar.'}</p>
                    <div class="project-tech">
                        ${topics.map(topic => `<span>${topic}</span>`).join('')}
                        ${language && language !== 'Unknown' ? `<span>${language}</span>` : ''}
                    </div>
                    <div class="project-updated">Aktualisiert am ${updatedDate}</div>
                </div>
            </div>
        `;
    }

    getLanguageColor(language) {
        const colors = {
            'JavaScript': '#f1e05a',
            'TypeScript': '#2b7489',
            'Python': '#3572A5',
            'Java': '#b07219',
            'C++': '#f34b7d',
            'C#': '#239120',
            'PHP': '#4F5D95',
            'Ruby': '#701516',
            'Go': '#00ADD8',
            'Rust': '#dea584',
            'Swift': '#ffac45',
            'Kotlin': '#F18E33',
            'HTML': '#e34c26',
            'CSS': '#1572B6',
            'Vue': '#4FC08D',
            'React': '#61DAFB',
            'Angular': '#DD0031'
        };
        return colors[language] || '#586069';
    }

    getProjectImageUrl(repo) {
        // Immer GitHub Open Graph Image verwenden
        // Diese Bilder sind immer verfügbar und zeigen Repository-Informationen
        return `https://opengraph.githubassets.com/1/${repo.full_name}`;
    }

    filterProjects(filter) {
        this.currentFilter = filter;
        
        switch (filter) {
            case 'pinned':
                this.filteredProjects = this.projects.slice(0, 3);
                break;
            case 'recent':
                this.filteredProjects = [...this.projects].sort((a, b) => 
                    new Date(b.updated_at) - new Date(a.updated_at)
                );
                break;
            default:
                this.filteredProjects = [...this.projects];
        }
        
        this.renderProjects();
    }

    renderProjects() {
        const projectsGrid = document.getElementById('projects-grid');
        const projectsLoading = document.getElementById('projects-loading');
        
        if (this.filteredProjects.length === 0) {
            projectsGrid.innerHTML = `
                <div class="projects-error">
                    <h3>Keine Projekte gefunden</h3>
                    <p>Es konnten keine GitHub Repositories geladen werden.</p>
                    <button class="retry-btn" onclick="gitHubPortfolio.init()">Erneut versuchen</button>
                </div>
            `;
            return;
        }

        const projectsHTML = this.filteredProjects
            .map(repo => this.generateProjectCard(repo))
            .join('');
        
        projectsGrid.innerHTML = projectsHTML;
        projectsLoading.classList.add('hidden');
    }

    renderError(error) {
        const projectsGrid = document.getElementById('projects-grid');
        const projectsLoading = document.getElementById('projects-loading');
        
        projectsGrid.innerHTML = `
            <div class="projects-error">
                <h3>Fehler beim Laden der Projekte</h3>
                <p>${error.message || 'Die GitHub Repositories konnten nicht geladen werden.'}</p>
                <button class="retry-btn" onclick="gitHubPortfolio.init()">Erneut versuchen</button>
            </div>
        `;
        
        projectsLoading.classList.add('hidden');
    }

    async init() {
        try {
            const projectsLoading = document.getElementById('projects-loading');
            const projectsGrid = document.getElementById('projects-grid');
            
            projectsLoading.classList.remove('hidden');
            projectsGrid.innerHTML = '';
            
            await this.fetchRepositories();
            this.renderProjects();
            
            // Setup filter event listeners
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                    this.filterProjects(e.target.dataset.filter);
                });
            });
            
        } catch (error) {
            this.renderError(error);
        }
    }
}

// Initialize GitHub Portfolio
// WICHTIG: Ersetzen Sie 'IHR_GITHUB_USERNAME' mit Ihrem echten GitHub Benutzernamen
const gitHubPortfolio = new GitHubPortfolio('MathisTRD', {
    maxRepos: 6,           // Maximale Anzahl der angezeigten Repositories
    excludeForked: true,   // Geforkete Repositories ausschließen
    sortBy: 'updated'      // Sortierung nach letzter Aktivität
});

// Start loading when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme toggle
    initThemeToggle();
    
    // Initialize GitHub portfolio if element exists
    if (document.getElementById('projects-grid')) {
        gitHubPortfolio.init();
    }
});
