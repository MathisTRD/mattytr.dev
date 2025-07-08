# 🚀 Modern Portfolio Website

A clean, modern, and responsive portfolio website showcasing development projects and personal interests.

## 📁 Project Structure

```
portfolio/
├── index.html                    # Redirect page to new structure
├── vinyl.html                    # Redirect page to vinyl collection
├── public/                       # Public assets
│   └── images/                   # Image assets
├── src/                          # Source code
│   ├── assets/                   # Additional assets
│   ├── components/               # Reusable components (future)
│   ├── pages/                    # HTML pages
│   │   ├── index.html           # Main portfolio page
│   │   └── vinyl.html           # Vinyl collection page
│   ├── scripts/                  # JavaScript files
│   │   ├── script.js            # Main JavaScript
│   │   └── vinyl.js             # Vinyl collection functionality
│   └── styles/                   # CSS files
│       ├── styles.css           # Main stylesheet
│       └── vinyl.css            # Vinyl collection styles
└── README.md                     # This file
```

## ✨ Features

### Portfolio (index.html)
- **Modern Design**: Clean, minimalist interface
- **Dark/Light Mode**: Toggle between themes with smooth transitions
- **Responsive**: Works perfectly on all device sizes
- **Smooth Animations**: Hero fade-in and scroll-based navbar effects
- **Interactive Navigation**: Intuitive navigation with hover effects
- **Projects Showcase**: Featured projects with tech stacks
- **Contact Integration**: Direct links to email and social media

### Vinyl Collection (vinyl.html)
- **Discogs Integration**: Connects to Discogs API for real collection data
- **Collection Stats**: Total albums, newest/oldest releases
- **Search & Filter**: Search by artist/album, filter by genre and year
- **Sorting Options**: Sort by artist, title, year, or date added
- **Responsive Grid**: Beautiful layout for vinyl cover art
- **Loading States**: Elegant loading and error handling

## 🛠 Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **Vanilla JavaScript**: No frameworks, pure JS for performance
- **Discogs API**: Real-time vinyl collection data
- **CSS Custom Properties**: Dynamic theming system
- **Local Storage**: Theme preference persistence

## 🎨 Design Highlights

- **Typography**: System fonts for optimal performance
- **Color Scheme**: Carefully crafted dark/light themes
- **Animations**: Subtle, performant CSS transitions
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Performance**: Optimized for fast loading

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd portfolio
   ```

2. **Open the project**
   - Open `src/pages/index.html` directly in a browser
   - Or serve with a local server for best experience

3. **Configure Vinyl Collection (Optional)**
   - Edit `src/scripts/vinyl.js`
   - Add your Discogs username
   - Optional: Add Discogs API token for higher rate limits

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

## 🎵 Vinyl Collection Setup

To display your own Discogs collection:

1. Make your Discogs collection public
2. Update the username in `src/scripts/vinyl.js`
3. (Optional) Add a Discogs API token for higher rate limits

## 🔧 Customization

The project is designed to be easily customizable:

- **Colors**: Update CSS custom properties in `src/styles/styles.css`
- **Content**: Edit HTML files in `src/pages/`
- **Functionality**: Modify JavaScript files in `src/scripts/`

## 📈 Performance

- **Lightweight**: No external frameworks or heavy dependencies
- **Fast Loading**: Optimized assets and efficient code
- **SEO Friendly**: Proper meta tags and semantic HTML
- **Modern Standards**: Uses latest web standards and best practices

## 📄 Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ by Mathis | 2025
