// Vinyl Collection JavaScript
// Discogs API integration for fetching vinyl collection

class VinylCollection {
    constructor() {
        this.username = 'MathisTRD'; // Replace with your Discogs username
        this.token = ''; // Optional: Your Discogs API token for higher rate limits
        this.baseUrl = 'https://api.discogs.com';
        this.currentPage = 1;
        this.itemsPerPage = 50;
        this.allRecords = [];
        this.filteredRecords = [];
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.loadVinylCollection();
    }
    
    bindEvents() {
        // Search functionality
        const searchInput = document.getElementById('vinyl-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchRecords(e.target.value);
            });
        }
        
        // Filter functionality
        const genreFilter = document.getElementById('genre-filter');
        const yearFilter = document.getElementById('year-filter');
        const sortFilter = document.getElementById('sort-filter');
        
        if (genreFilter) {
            genreFilter.addEventListener('change', () => this.applyFilters());
        }
        
        if (yearFilter) {
            yearFilter.addEventListener('change', () => this.applyFilters());
        }
        
        if (sortFilter) {
            sortFilter.addEventListener('change', () => this.applySorting());
        }
        
        // Pagination
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousPage());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextPage());
        }
    }
    
    async loadVinylCollection() {
        try {
            this.showLoading();
            this.hideSetupInstructions();
            
            const url = `${this.baseUrl}/users/${this.username}/collection/folders/0/releases?per_page=100`;
            const headers = {
                'User-Agent': 'VinylCollection/1.0 +https://yourwebsite.com'
            };
            
            if (this.token) {
                headers['Authorization'] = `Discogs token=${this.token}`;
            }
            
            const response = await fetch(url, { headers });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            this.allRecords = data.releases || [];
            this.filteredRecords = [...this.allRecords];
            
            this.hideLoading();
            this.populateFilters();
            this.updateStats();
            this.renderRecords();
            this.setupPagination();
            
        } catch (error) {
            console.error('Error loading vinyl collection:', error);
            this.showError();
            this.hideLoading();
        }
    }
    
    showLoading() {
        const loading = document.getElementById('vinyl-loading');
        const error = document.getElementById('vinyl-error');
        const grid = document.getElementById('vinyl-grid');
        
        if (loading) loading.style.display = 'block';
        if (error) error.style.display = 'none';
        if (grid) grid.style.display = 'none';
    }
    
    hideLoading() {
        const loading = document.getElementById('vinyl-loading');
        const grid = document.getElementById('vinyl-grid');
        
        if (loading) loading.style.display = 'none';
        if (grid) grid.style.display = 'grid';
    }
    
    showError() {
        const error = document.getElementById('vinyl-error');
        const grid = document.getElementById('vinyl-grid');
        
        if (error) error.style.display = 'block';
        if (grid) grid.style.display = 'none';
    }
    
    hideSetupInstructions() {
        const instructions = document.getElementById('setup-instructions');
        if (instructions) {
            instructions.style.display = 'none';
        }
    }
    
    populateFilters() {
        const genreFilter = document.getElementById('genre-filter');
        const yearFilter = document.getElementById('year-filter');
        
        if (genreFilter && yearFilter) {
            // Extract unique genres and years
            const genres = new Set();
            const years = new Set();
            
            this.allRecords.forEach(record => {
                const release = record.basic_information;
                if (release.genres) {
                    release.genres.forEach(genre => genres.add(genre));
                }
                if (release.year) {
                    years.add(release.year);
                }
            });
            
            // Populate genre filter
            genreFilter.innerHTML = '<option value="">All Genres</option>';
            Array.from(genres).sort().forEach(genre => {
                const option = document.createElement('option');
                option.value = genre;
                option.textContent = genre;
                genreFilter.appendChild(option);
            });
            
            // Populate year filter
            yearFilter.innerHTML = '<option value="">All Years</option>';
            Array.from(years).sort((a, b) => b - a).forEach(year => {
                const option = document.createElement('option');
                option.value = year;
                option.textContent = year;
                yearFilter.appendChild(option);
            });
        }
    }
    
    updateStats() {
        const totalAlbums = document.getElementById('total-albums');
        const newestYear = document.getElementById('newest-year');
        const oldestYear = document.getElementById('oldest-year');
        
        if (totalAlbums) {
            totalAlbums.textContent = this.allRecords.length;
        }
        
        if (this.allRecords.length > 0) {
            const years = this.allRecords
                .map(record => record.basic_information.year)
                .filter(year => year && year > 0);
            
            if (years.length > 0) {
                const newest = Math.max(...years);
                const oldest = Math.min(...years);
                
                if (newestYear) newestYear.textContent = newest;
                if (oldestYear) oldestYear.textContent = oldest;
            }
        }
    }
    
    searchRecords(searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        
        if (!term) {
            this.filteredRecords = [...this.allRecords];
        } else {
            this.filteredRecords = this.allRecords.filter(record => {
                const release = record.basic_information;
                const artist = release.artists?.[0]?.name?.toLowerCase() || '';
                const title = release.title?.toLowerCase() || '';
                
                return artist.includes(term) || title.includes(term);
            });
        }
        
        this.applyFilters();
    }
    
    applyFilters() {
        const genreFilter = document.getElementById('genre-filter');
        const yearFilter = document.getElementById('year-filter');
        
        let filtered = [...this.filteredRecords];
        
        // Apply genre filter
        if (genreFilter && genreFilter.value) {
            filtered = filtered.filter(record => {
                const genres = record.basic_information.genres || [];
                return genres.includes(genreFilter.value);
            });
        }
        
        // Apply year filter
        if (yearFilter && yearFilter.value) {
            filtered = filtered.filter(record => {
                return record.basic_information.year == yearFilter.value;
            });
        }
        
        this.filteredRecords = filtered;
        this.currentPage = 1;
        this.renderRecords();
        this.setupPagination();
    }
    
    applySorting() {
        const sortFilter = document.getElementById('sort-filter');
        if (!sortFilter) return;
        
        const sortBy = sortFilter.value;
        
        this.filteredRecords.sort((a, b) => {
            const releaseA = a.basic_information;
            const releaseB = b.basic_information;
            
            switch (sortBy) {
                case 'artist':
                    const artistA = releaseA.artists?.[0]?.name || '';
                    const artistB = releaseB.artists?.[0]?.name || '';
                    return artistA.localeCompare(artistB);
                    
                case 'title':
                    const titleA = releaseA.title || '';
                    const titleB = releaseB.title || '';
                    return titleA.localeCompare(titleB);
                    
                case 'year':
                    return (releaseB.year || 0) - (releaseA.year || 0);
                    
                case 'date_added':
                    return new Date(b.date_added) - new Date(a.date_added);
                    
                default:
                    return 0;
            }
        });
        
        this.renderRecords();
    }
    
    renderRecords() {
        const grid = document.getElementById('vinyl-grid');
        if (!grid) return;
        
        grid.innerHTML = '';
        
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const recordsToShow = this.filteredRecords.slice(startIndex, endIndex);
        
        recordsToShow.forEach(record => {
            const cardElement = this.createRecordCard(record);
            grid.appendChild(cardElement);
        });
        
        // Update pagination
        this.updatePaginationInfo();
    }
    
    createRecordCard(record) {
        const release = record.basic_information;
        const card = document.createElement('div');
        card.className = 'vinyl-card';
        
        // Get the best quality image
        const imageUrl = release.cover_image || release.thumb || '';
        const artist = release.artists?.[0]?.name || 'Unknown Artist';
        const title = release.title || 'Unknown Title';
        const year = release.year || '';
        const format = release.formats?.[0]?.name || 'Vinyl';
        
        card.innerHTML = `
            <div class="vinyl-cover">
                ${imageUrl ? 
                    `<img src="${imageUrl}" alt="${title} by ${artist}" loading="lazy">` :
                    `<div class="vinyl-placeholder">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                            <circle cx="12" cy="12" r="3" fill="currentColor"/>
                        </svg>
                    </div>`
                }
            </div>
            <div class="vinyl-info">
                <div class="vinyl-artist">${artist}</div>
                <div class="vinyl-title-text">${title}</div>
                ${year ? `<div class="vinyl-year">${year}</div>` : ''}
                <div class="vinyl-details">
                    <span class="vinyl-format">${format}</span>
                </div>
            </div>
        `;
        
        // Add click handler for future modal/detail view
        card.addEventListener('click', () => {
            this.showRecordDetails(record);
        });
        
        return card;
    }
    
    showRecordDetails(record) {
        // Placeholder for future modal implementation
        console.log('Record details:', record);
        // You can implement a modal or redirect to detail page here
    }
    
    setupPagination() {
        const pagination = document.getElementById('pagination');
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');
        
        if (!pagination || this.filteredRecords.length <= this.itemsPerPage) {
            if (pagination) pagination.style.display = 'none';
            return;
        }
        
        pagination.style.display = 'flex';
        
        const totalPages = Math.ceil(this.filteredRecords.length / this.itemsPerPage);
        
        if (prevBtn) {
            prevBtn.disabled = this.currentPage <= 1;
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.currentPage >= totalPages;
        }
        
        this.updatePaginationInfo();
    }
    
    updatePaginationInfo() {
        const pageInfo = document.getElementById('page-info');
        if (pageInfo) {
            const totalPages = Math.ceil(this.filteredRecords.length / this.itemsPerPage);
            pageInfo.textContent = `Page ${this.currentPage} of ${totalPages}`;
        }
    }
    
    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.renderRecords();
            this.setupPagination();
        }
    }
    
    nextPage() {
        const totalPages = Math.ceil(this.filteredRecords.length / this.itemsPerPage);
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.renderRecords();
            this.setupPagination();
        }
    }
}

// Global function for retry button
function loadVinylCollection() {
    if (window.vinylCollection) {
        window.vinylCollection.loadVinylCollection();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize on vinyl page
    if (document.getElementById('vinyl-grid')) {
        window.vinylCollection = new VinylCollection();
    }
});

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VinylCollection;
}
