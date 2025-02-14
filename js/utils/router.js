// Simple Router Implementation
class Router {
    constructor(routes) {
        this.routes = routes;
        this.currentPath = window.location.pathname;
        
        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            this.handleRoute(window.location.pathname);
        });
    }

    init() {
        this.handleRoute(this.currentPath);
    }

    handleRoute(pathname) {
        const route = this.routes[pathname] || this.routes['*'];
        if (route) {
            route();
        }
    }

    navigate(path) {
        window.history.pushState({}, '', path);
        this.handleRoute(path);
    }
}

// Export router instance
export const router = new Router({
    '/': () => {
        // Handle dashboard view
        document.getElementById('gridContainer').style.display = 'grid';
    },
    '/animations/*': () => {
        // Handle animation view
        document.getElementById('gridContainer').style.display = 'none';
    },
    '*': () => {
        // Handle 404
        console.log('Page not found');
    }
});