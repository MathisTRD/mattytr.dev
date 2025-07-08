// Theme Toggle Functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    
    if (!themeToggle) {
        console.error('Theme toggle button not found!');
        return;
    }
    
    const sunIcon = themeToggle.querySelector('.sun-icon');
    const moonIcon = themeToggle.querySelector('.moon-icon');
    
    const currentTheme = localStorage.getItem('theme') || 'dark';
    
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcons(currentTheme, sunIcon, moonIcon);
    
    themeToggle.addEventListener('click', (e) => {
        e.preventDefault();
        
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcons(newTheme, sunIcon, moonIcon);
        
        updateNavbarBackground();
    });
}

// Helper function for theme icon updates
function updateThemeIcons(theme, sunIcon, moonIcon) {
    if (theme === 'dark') {
        if (sunIcon) sunIcon.style.display = 'block';
        if (moonIcon) moonIcon.style.display = 'none';
    } else {
        if (sunIcon) sunIcon.style.display = 'none';
        if (moonIcon) moonIcon.style.display = 'block';
    }
}

// Update navbar background based on theme and scroll position
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

// Update navbar height CSS variable
function updateNavbarHeightVar() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        const navbarHeight = navbar.getBoundingClientRect().height;
        document.documentElement.style.setProperty('--navbar-height', `${navbarHeight}px`);
    }
}

// Call on page load and window resize
window.addEventListener('load', updateNavbarHeightVar);
window.addEventListener('resize', updateNavbarHeightVar);

// Update on scroll since navbar changes size
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
    
    // Update navbar height variable when scrolling changes its size
    updateNavbarHeightVar();
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            let offset;
            // Get navbar height for dynamic offset calculation
            const navbar = document.querySelector('.navbar');
            const navbarHeight = navbar ? navbar.getBoundingClientRect().height : 0;
            
            // Spezifische Offsets für verschiedene Sektionen
            switch (targetId) {
                case '#creative':
                    offset = navbarHeight + 40; // Dynamic calculation based on navbar height
                    break;
                case '#projects':
                    offset = navbarHeight + 40; // Matching creative section
                    break;
                case '#contact':
                    offset = navbarHeight + 20; // Slightly less offset for contact
                    break;
                case '#hero':
                    offset = 0; // Go to the very top for hero section
                    break;
                case '#top':
                    offset = 0; // Go to the absolute top of the page
                    break;
                default:
                    offset = navbarHeight + 20; // Default dynamic offset
            }
            
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            
            // Update active state in navigation
            document.querySelectorAll('.nav-icon').forEach(navLink => {
                navLink.classList.remove('active-nav-link');
            });
            
            // Only add active class if this is a nav-icon, not other links
            if (this.classList.contains('nav-icon')) {
                this.classList.add('active-nav-link');
            }
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
    
    // Show success message
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.textContent = 'Message sent successfully!';
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

// Fade-out effect for hero description on scroll
function initHeroFadeOut() {
    const heroDescription = document.querySelector('.hero-description');
    const heroTitle = document.querySelector('.hero-title');
    
    if (!heroDescription || !heroTitle) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroHeight = window.innerHeight;
        
        // Calculate fade progress (0 = not faded, 1 = completely faded)
        const fadeProgress = Math.min(scrolled / (heroHeight * 0.5), 1);
        
        // Apply fade-out to description
        heroDescription.style.opacity = 1 - fadeProgress;
        heroDescription.style.transform = `translateY(${fadeProgress * 30}px)`;
        
        // Optional: Also fade title but slower
        const titleFadeProgress = Math.min(scrolled / (heroHeight * 0.8), 1);
        heroTitle.style.opacity = 1 - (titleFadeProgress * 0.3); // Only fade to 70% opacity
    });
}

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
                throw new Error(`GitHub API Error: ${response.status}`);
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
            console.error('Error loading GitHub repositories:', error);
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
            console.warn('Pinned repositories could not be loaded, using regular repos');
            return this.projects.slice(0, 3);
        }
    }

    // Fetch all languages for a repository
    async fetchLanguages(repo) {
        if (!repo.languages_url) return null;
        
        try {
            const response = await fetch(repo.languages_url);
            if (!response.ok) {
                throw new Error(`GitHub API Error: ${response.status}`);
            }
            
            const languages = await response.json();
            return languages;
        } catch (error) {
            console.error('Error fetching languages:', error);
            return null;
        }
    }
    
    // Sort languages by usage (bytes)
    sortLanguagesByUsage(languages) {
        if (!languages) return [];
        
        return Object.entries(languages)
            .sort((a, b) => b[1] - a[1])
            .map(entry => entry[0]);
    }
    
    generateProjectCard(repo) {
        const updatedDate = new Date(repo.updated_at).toLocaleDateString('de-DE');
        
        // Extract topics
        const topics = repo.topics ? repo.topics.slice(0, 3) : [];
        
        // Generate project image URL
        const projectImageUrl = this.getProjectImageUrl(repo);
        
        // We'll inject the languages later after fetching them
        return `
            <div class="project-card" data-stars="${repo.stargazers_count}" data-repo-id="${repo.id}">
                <div class="project-image">
                    ${projectImageUrl ? `
                        <img src="${projectImageUrl}" alt="${repo.name} Screenshot" loading="lazy" onerror="this.style.display='none';">
                    ` : ''}
                    <div class="project-image-overlay"></div>
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
                    <p>${repo.description || 'No description available.'}</p>
                    <div class="project-tech" id="project-tech-${repo.id}">
                        ${topics.map(topic => `<span class="project-topic">${topic}</span>`).join('')}
                        <span class="languages-loading">Loading languages...</span>
                    </div>
                    <div class="project-updated">Updated on ${updatedDate}</div>
                </div>
            </div>
        `;
    }

    getLanguageColor(language) {
        const colors = {
            // Programming Languages
            'JavaScript': '#f1e05a',
            'TypeScript': '#2b7489',
            'Python': '#3572A5',
            'Java': '#b07219',
            'C++': '#f34b7d',
            'C#': '#239120',
            'C': '#555555',
            'PHP': '#4F5D95',
            'Ruby': '#701516',
            'Go': '#00ADD8',
            'Rust': '#dea584',
            'Swift': '#ffac45',
            'Kotlin': '#F18E33',
            'Dart': '#00B4AB',
            'Scala': '#c22d40',
            'Objective-C': '#438eff',
            'R': '#198CE7',
            'Perl': '#0298c3',
            'Haskell': '#5e5086',
            'Elixir': '#6e4a7e',
            'Clojure': '#db5855',
            'Lua': '#000080',
            'Julia': '#a270ba',
            'PowerShell': '#012456',
            'Shell': '#89e051',
            'Bash': '#4eaa25',
            
            // Frontend Languages & Frameworks
            'HTML': '#e34c26',
            'CSS': '#563d7c',
            'SCSS': '#c6538c',
            'Less': '#1d365d',
            'Vue': '#4FC08D',
            'React': '#61DAFB',
            'Angular': '#DD0031',
            'Svelte': '#ff3e00',
            'Ember': '#e04e39',
            
            // Build Tools & Config
            'Makefile': '#427819',
            'CMake': '#da3434',
            'YAML': '#cb171e',
            'Dockerfile': '#384d54',
            'Gradle': '#02303a',
            
            // Documentation
            'Markdown': '#083fa1',
            'reStructuredText': '#141414',
            'AsciiDoc': '#73a0c5',
            
            // Data
            'JSON': '#292929',
            'XML': '#0060ac',
            'CSV': '#237346',
            'TOML': '#9c4221',
            
            // Others
            'Unknown': '#586069'
        };
        return colors[language] || '#586069';
    }

    getLanguageSymbol(language) {
        const symbols = {
            // Programming Languages
            'JavaScript': 'JS',
            'TypeScript': 'TS',
            'Python': 'PY',
            'Java': 'JV',
            'C++': 'C++',
            'C#': 'C#',
            'C': 'C',
            'PHP': 'PHP',
            'Ruby': 'RB',
            'Go': 'GO',
            'Rust': 'RS',
            'Swift': 'SW',
            'Kotlin': 'KT',
            'Dart': 'DT',
            'Scala': 'SC',
            'Objective-C': 'OC',
            'R': 'R',
            'Perl': 'PL',
            'Haskell': 'HS',
            'Elixir': 'EX',
            'Clojure': 'CJ',
            'Lua': 'LUA',
            'Julia': 'JL',
            'PowerShell': 'PS',
            'Shell': 'SH',
            'Bash': 'SH',
            
            // Frontend Languages & Frameworks
            'HTML': 'HTML',
            'CSS': 'CSS',
            'SCSS': 'SCSS',
            'Less': 'LESS',
            'Vue': 'VUE',
            'React': 'REACT',
            'Angular': 'NG',
            'Svelte': 'SV',
            'Ember': 'EM',
            
            // Build Tools & Config
            'Makefile': 'MK',
            'CMake': 'CM',
            'YAML': 'YML',
            'Dockerfile': 'DOC',
            'Gradle': 'GR',
            
            // Documentation
            'Markdown': 'MD',
            'reStructuredText': 'RST',
            'AsciiDoc': 'ADC',
            
            // Data
            'JSON': 'JSON',
            'XML': 'XML',
            'CSV': 'CSV',
            'TOML': 'TOML',
            
            // Others
            'Unknown': '?'
        };
        return symbols[language] || '?';
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

    async renderProjects() {
        const projectsGrid = document.getElementById('projects-grid');
        const projectsLoading = document.getElementById('projects-loading');
        
        if (this.filteredProjects.length === 0) {
            projectsGrid.innerHTML = `
                <div class="projects-error">
                    <h3>No Projects Found</h3>
                    <p>No GitHub repositories could be loaded.</p>
                    <button class="retry-btn" onclick="gitHubPortfolio.init()">Try Again</button>
                </div>
            `;
            return;
        }

        const projectsHTML = this.filteredProjects
            .map(repo => this.generateProjectCard(repo))
            .join('');
        
        projectsGrid.innerHTML = projectsHTML;
        projectsLoading.classList.add('hidden');
        
        // After rendering, fetch and update languages for each project
        for (const repo of this.filteredProjects) {
            this.updateProjectLanguages(repo);
        }
    }
    
    async updateProjectLanguages(repo) {
        const techContainer = document.getElementById(`project-tech-${repo.id}`);
        if (!techContainer) return;
        
        const languages = await this.fetchLanguages(repo);
        
        if (languages && Object.keys(languages).length > 0) {
            // Sort languages by usage
            const sortedLanguages = this.sortLanguagesByUsage(languages);
            
            // Create HTML for language tags with symbols instead of text
            const languagesHTML = sortedLanguages.map(language => {
                const color = this.getLanguageColor(language);
                const symbol = this.getLanguageSymbol(language);
                const percentage = Math.round((languages[language] / Object.values(languages).reduce((a, b) => a + b, 0)) * 100);
                return `<span class="project-language" style="background-color: ${color}70; color: var(--text-color); border: 1px solid ${color};" title="${language}${percentage > 5 ? ` (${percentage}%)` : ''}">${symbol}</span>`;
            }).join('');
            
            // Remove loading indicator
            const loadingIndicator = techContainer.querySelector('.languages-loading');
            if (loadingIndicator) {
                loadingIndicator.remove();
            }
            
            // Add languages to the container
            techContainer.insertAdjacentHTML('beforeend', languagesHTML);
        } else {
            // Handle case when languages can't be fetched
            const loadingIndicator = techContainer.querySelector('.languages-loading');
            if (loadingIndicator) {
                loadingIndicator.textContent = '';
            }
        }
    }

    renderError(error) {
        const projectsGrid = document.getElementById('projects-grid');
        const projectsLoading = document.getElementById('projects-loading');
        
        projectsGrid.innerHTML = `
            <div class="projects-error">
                <h3>Error Loading Projects</h3>
                <p>${error.message || 'Could not load GitHub repositories.'}</p>
                <button class="retry-btn" onclick="gitHubPortfolio.init()">Try Again</button>
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
const gitHubPortfolio = new GitHubPortfolio('MathisTRD', {
    maxRepos: 6,           // Maximum number of repositories to display
    excludeForked: true,   // Exclude forked repositories
    sortBy: 'updated'      // Sort by last activity
});

// Start loading when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme toggle
    initThemeToggle();
    
    // Initialize hero fade-out effect
    initHeroFadeOut();
    
    // Initialize GitHub portfolio if element exists
    if (document.getElementById('projects-grid')) {
        gitHubPortfolio.init();
    }
    
    // Setup section observer for active nav links
    setupSectionObserver();
    
    // Update navbar height variable
    updateNavbarHeightVar();
    
    // Ensure smooth scrolling works after DOM is loaded
    setTimeout(() => {
        // Re-attach event listeners to make sure they work
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            // Remove any existing listeners
            const newAnchor = anchor.cloneNode(true);
            anchor.parentNode.replaceChild(newAnchor, anchor);
            
            // Add fresh event listener
            newAnchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    let offset;
                    // Get navbar height for dynamic offset calculation
                    const navbar = document.querySelector('.navbar');
                    const navbarHeight = navbar ? navbar.getBoundingClientRect().height : 0;
                    
                    // Spezifische Offsets für verschiedene Sektionen
                    switch (targetId) {
                        case '#creative':
                            offset = navbarHeight + 40; // Dynamic calculation based on navbar height
                            break;
                        case '#projects':
                            offset = navbarHeight + 40; // Matching creative section
                            break;
                        case '#contact':
                            offset = navbarHeight + 20; // Slightly less offset for contact
                            break;
                        case '#hero':
                            offset = 0; // Go to the very top for hero section
                            break;
                        case '#top':
                            offset = 0; // Go to the absolute top of the page
                            break;
                        default:
                            offset = navbarHeight + 20; // Default dynamic offset
                    }
                    
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update active state in navigation
                    document.querySelectorAll('.nav-icon').forEach(navLink => {
                        navLink.classList.remove('active-nav-link');
                    });
                    
                    // Only add active class if this is a nav-icon, not other links
                    if (this.classList.contains('nav-icon')) {
                        this.classList.add('active-nav-link');
                    }
                }
            });
        });
    }, 100);
});

// Observer for section visibility to update active nav links
function setupSectionObserver() {
    const sections = document.querySelectorAll('section, #hero');
    const navLinks = {};
    
    // Create a map of section IDs to nav links
    document.querySelectorAll('.nav-icon[href^="#"]').forEach(link => {
        const targetId = link.getAttribute('href');
        navLinks[targetId] = link;
    });
    
    // Function to update active nav link based on scroll position
    function updateActiveNavLink() {
        // Get current scroll position
        const scrollPosition = window.scrollY + 100; // Offset for navbar
        
        // Find the section that is currently in view
        let activeSection = null;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionBottom = sectionTop + sectionHeight;
            
            // Check if this section is currently in view
            if (scrollPosition >= sectionTop - 200 && scrollPosition < sectionBottom - 100) {
                activeSection = section;
            }
        });
        
        // If no section is clearly active, check for the closest one
        if (!activeSection) {
            let closestDistance = Infinity;
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const distance = Math.abs(scrollPosition - sectionTop);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    activeSection = section;
                }
            });
        }
        
        if (activeSection) {
            const id = '#' + activeSection.id;
            
            // Remove active class from all nav links
            document.querySelectorAll('.nav-icon').forEach(link => {
                link.classList.remove('active-nav-link');
            });
            
            // Add active class to the corresponding nav link
            if (navLinks[id]) {
                navLinks[id].classList.add('active-nav-link');
            }
        }
    }
    
    // Throttle function to limit how often updateActiveNavLink is called
    let throttleTimer = null;
    function throttledUpdate() {
        if (throttleTimer) return;
        throttleTimer = setTimeout(() => {
            updateActiveNavLink();
            throttleTimer = null;
        }, 100);
    }
    
    // Update on scroll with throttling
    window.addEventListener('scroll', throttledUpdate);
    
    // Update on page load
    setTimeout(updateActiveNavLink, 500); // Delay to ensure page is loaded
}

// Call the setup function when the DOM is loaded
document.addEventListener('DOMContentLoaded', setupSectionObserver);
