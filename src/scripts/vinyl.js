// Vinyl Collection JavaScript
// Discogs API integration for fetching vinyl collection

class VinylCollection {
    constructor() {
        this.username = 'MathisTRD';
        this.token = '';
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
        const searchInput = document.getElementById('vinyl-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchRecords(e.target.value);
            });
        }
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
            const genres = new Set();
            const years = new Set();
            genres.add('Rock');
            genres.add('Pop');
            genres.add('Electronic');
            this.allRecords.forEach(record => {
                const release = record.basic_information;
                const artist = release.artists?.[0]?.name || 'Unknown Artist';
                const title = release.title || 'Unknown Title';
                if (artist.includes('Daughter') && title.includes('Stereo Mind Game')) {
                    genres.add('Rock');
                    if (!release.genres) release.genres = [];
                    if (!release.genres.includes('Rock')) release.genres.push('Rock');
                }
                else if (title.includes('Ballads') && artist.includes('Jogius')) {
                    genres.add('Electronic');
                    if (!release.genres) release.genres = [];
                    if (!release.genres.includes('Electronic')) release.genres.push('Electronic');
                }
                else if (artist.includes('David') && title.includes('Salman')) {
                    genres.add('Pop');
                    if (!release.genres) release.genres = [];
                    if (!release.genres.includes('Pop')) release.genres.push('Pop');
                }
                else if (release.genres && release.genres.length > 0) {
                    release.genres.forEach(genre => {
                        genres.add(genre);
                    });
                }
                if (release.year) {
                    years.add(release.year);
                }
            });
            genreFilter.innerHTML = '<option value="">All Genres</option>';
            Array.from(genres).sort().forEach(genre => {
                const option = document.createElement('option');
                option.value = genre;
                option.textContent = genre;
                genreFilter.appendChild(option);
            });
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
        let filtered = [...this.allRecords];
        const searchInput = document.getElementById('vinyl-search');
        if (searchInput && searchInput.value.trim()) {
            const term = searchInput.value.toLowerCase().trim();
            filtered = filtered.filter(record => {
                const release = record.basic_information;
                const artist = release.artists?.[0]?.name?.toLowerCase() || '';
                const title = release.title?.toLowerCase() || '';
                return artist.includes(term) || title.includes(term);
            });
        }
        if (genreFilter && genreFilter.value) {
            const selectedGenre = genreFilter.value;
            filtered = filtered.filter(record => {
                const release = record.basic_information;
                const artist = release.artists?.[0]?.name || 'Unknown Artist';
                const title = release.title || 'Unknown Title';
                if (selectedGenre === 'Rock' && 
                    artist.includes('Daughter') && 
                    title.includes('Stereo Mind Game')) {
                    return true;
                }
                else if (selectedGenre === 'Electronic' && 
                         title.includes('Ballads') && 
                         artist.includes('Jogius')) {
                    return true;
                }
                else if (selectedGenre === 'Pop' && 
                         artist.includes('David') && 
                         title.includes('Salman')) {
                    return true;
                }
                const genres = release.genres || [];
                return genres.includes(selectedGenre);
            });
        }
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
        this.updatePaginationInfo();
    }
    createRecordCard(record) {
        const release = record.basic_information;
        const card = document.createElement('div');
        card.className = 'vinyl-card';
        const imageUrl = release.cover_image || release.thumb || '';
        const artist = release.artists?.[0]?.name || 'Unknown Artist';
        const title = release.title || 'Unknown Title';
        const year = release.year || '';
        let genreDisplay = '';
        if (artist.includes('Daughter') && title.includes('Stereo Mind Game')) {
            genreDisplay = 'Rock';
        }
        else if (title.includes('Ballads') && artist.includes('Jogius')) {
            genreDisplay = 'Electronic';
        }
        else if (artist.includes('David') && title.includes('Salman')) {
            genreDisplay = 'Pop';
        }
        else if (release.genres && release.genres.length > 0) {
            genreDisplay = release.genres[0];
        }
        if (artist.includes('Daughter') && title.includes('Stereo Mind Game')) {
            genreDisplay = 'Rock';
        }
        else if (title.includes('Ballads') && artist.includes('Jogius')) {
            genreDisplay = 'Electronic';
        }
        else if (artist.includes('David') && title.includes('Salman')) {
            genreDisplay = 'Pop';
        }
        else if (release.genres && release.genres.length > 0) {
            genreDisplay = release.genres[0];
        }
        let formatInfo = '';
        if (release.formats && release.formats.length > 0) {
            const format = release.formats[0];
            const descriptions = format.descriptions || [];
            let formatType = '';
            if (descriptions.includes('Album')) {
                formatType = 'Album';
            } else if (descriptions.includes('LP')) {
                formatType = 'LP';
            } else if (descriptions.includes('Single')) {
                formatType = 'Single';
            } else if (descriptions.includes('EP')) {
                formatType = 'EP';
            } else if (format.name) {
                formatType = format.name;
            }
            let recordSize = '';
            if (descriptions.includes('12"')) {
                recordSize = '12"';
            } else if (descriptions.includes('7"')) {
                recordSize = '7"';
            } else if (descriptions.includes('10"')) {
                recordSize = '10"';
            }
            if (formatType && recordSize) {
                formatInfo = `${formatType} ${recordSize}`;
            } else {
                formatInfo = formatType || recordSize;
            }
        }
        const releaseUrl = `https://www.discogs.com/release/${record.id}`;
        const artistId = release.artists?.[0]?.id;
        const artistUrl = artistId ? `https://www.discogs.com/artist/${artistId}` : '#';
        card.innerHTML = `
            <div class="vinyl-cover">
                <a href="${releaseUrl}" target="_blank" title="View on Discogs: ${title}">
                    ${imageUrl ? 
                        `<img src="${imageUrl}" alt="${title} by ${artist}" loading="lazy">` :
                        `<div class="vinyl-placeholder">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                                <circle cx="12" cy="12" r="3" fill="currentColor"/>
                            </svg>
                        </div>`
                    }
                </a>
            </div>
            <div class="vinyl-info">
                <a href="${artistUrl}" class="vinyl-artist" target="_blank" title="View artist on Discogs">${artist}</a>
                <a href="${releaseUrl}" class="vinyl-title-text" target="_blank" title="View on Discogs: ${title}">${title}</a>
                ${year ? `<div class="vinyl-year">${year}</div>` : ''}
                <div class="vinyl-meta">
                    ${genreDisplay ? `<span class="vinyl-genre">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 4px;">
                            <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" stroke-width="2"/>
                            <path d="M2 17l10 5 10-5" stroke="currentColor" stroke-width="2"/>
                            <path d="M2 12l10 5 10-5" stroke="currentColor" stroke-width="2"/>
                        </svg>
                        ${genreDisplay}
                    </span>` : ''}
                    ${formatInfo ? `<span class="vinyl-format">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 4px;">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                            <circle cx="12" cy="12" r="2" fill="currentColor"/>
                        </svg>
                        ${formatInfo}
                    </span>` : ''}
                </div>
            </div>
        `;
        return card;
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

    clearFilters() {
        // Clear search input
        const searchInput = document.getElementById('vinyl-search');
        if (searchInput) searchInput.value = '';
        
        // Reset filter dropdowns
        const genreFilter = document.getElementById('genre-filter');
        const yearFilter = document.getElementById('year-filter');
        const sortFilter = document.getElementById('sort-filter');
        
        if (genreFilter) genreFilter.value = '';
        if (yearFilter) yearFilter.value = '';
        if (sortFilter) sortFilter.value = 'date_added';
        
        // Reset filtered records to show all
        this.filteredRecords = [...this.allRecords];
        this.currentPage = 1;
        this.renderRecords();
        this.setupPagination();
    }
}
function loadVinylCollection() {
    if (window.vinylCollection) {
        window.vinylCollection.loadVinylCollection();
    }
}
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('vinyl-grid')) {
        window.vinylCollection = new VinylCollection();
    }
});
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VinylCollection;
}
