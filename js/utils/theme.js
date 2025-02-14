// js/utils/theme.js
// Theme Management
class ThemeManager {
    constructor() {
        this.currentTheme = 'dark-glass';
        this.themeLink = document.getElementById('theme-css') || this.createThemeLink();
    }

    createThemeLink() {
        const link = document.createElement('link');
        link.id = 'theme-css';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        return link;
    }

    setTheme(themeName) {
        this.currentTheme = themeName;
        this.themeLink.href = `css/themes/${themeName}.css`;
        localStorage.setItem('theme', themeName);
    }

    init() {
        const savedTheme = localStorage.getItem('theme') || 'dark-glass';
        this.setTheme(savedTheme);
    }
}

export const themeManager = new ThemeManager();
