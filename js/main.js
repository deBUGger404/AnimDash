// js/main.js

(function(){
  'use strict';

  // App Configuration
  const config = {
    gridContainerId: 'gridContainer',
    searchDebounceTime: 300,
    animationDuration: 300
  };

  // DOM Elements
  let gridContainer;
  let searchInput;
  let sidebar;
  let navLinks;

  // Utility Functions
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  function fadeIn(element) {
    element.style.opacity = 0;
    element.style.display = 'block';
    setTimeout(() => {
      element.style.opacity = 1;
    }, 10);
  }

  function fadeOut(element) {
    element.style.opacity = 0;
    setTimeout(() => {
      element.style.display = 'none';
    }, config.animationDuration);
  }

  // Grid Functions
  function populateGrid(animationsToShow = animations) {
    try {
      gridContainer.innerHTML = ''; // Clear existing content
      
      const fragment = document.createDocumentFragment();
      
      animationsToShow.forEach(anim => {
        const gridItem = createGridItem(anim);
        fragment.appendChild(gridItem);
      });

      // Add animation classes to new items
      const items = fragment.querySelectorAll('.grid-item');
      items.forEach(item => {
        item.style.opacity = 0;
        item.style.transform = 'translateY(20px)';
      });

      gridContainer.appendChild(fragment);

      // Trigger animations
      setTimeout(() => {
        items.forEach((item, index) => {
          setTimeout(() => {
            item.style.opacity = 1;
            item.style.transform = 'translateY(0)';
          }, index * 100);
        });
      }, 50);

    } catch (error) {
      console.error("Error populating grid:", error);
      showErrorMessage("Failed to load animations");
    }
  }

  // Search Functions
  function handleSearch(searchTerm) {
    searchTerm = searchTerm.toLowerCase().trim();
    
    const filteredAnimations = animations.filter(anim => 
      anim.name.toLowerCase().includes(searchTerm) || 
      anim.description.toLowerCase().includes(searchTerm)
    );

    populateGrid(filteredAnimations);
    
    // Update UI to show search results
    updateSearchResults(filteredAnimations.length, searchTerm);
  }

  function updateSearchResults(resultCount, searchTerm) {
    const header = document.querySelector('.header h1');
    if (searchTerm) {
      header.textContent = `Found ${resultCount} animation${resultCount !== 1 ? 's' : ''}`;
    } else {
      header.textContent = 'Animation Dashboard';
    }
  }

  // Navigation Functions
  function initializeNavigation() {
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all links
        navLinks.forEach(l => l.classList.remove('active'));
        
        // Add active class to clicked link
        link.classList.add('active');
        
        // Handle navigation action
        handleNavigation(link.getAttribute('href'));
      });
    });
  }

  function handleNavigation(route) {
    // Simple router
    switch(route) {
      case '#dashboard':
        populateGrid(animations);
        break;
      case '#featured':
        const featuredAnimations = animations.filter(anim => anim.featured);
        populateGrid(featuredAnimations);
        break;
      case '#collections':
        // Handle collections view if implemented
        break;
      case '#settings':
        // Handle settings view if implemented
        break;
      default:
        populateGrid(animations);
    }
  }

  // Error Handling
  function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    gridContainer.innerHTML = '';
    gridContainer.appendChild(errorDiv);
  }

  // Event Listeners
  function initializeEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', debounce((e) => {
      handleSearch(e.target.value);
    }, config.searchDebounceTime));

    // Clear search on ESC key
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchInput.value = '';
        handleSearch('');
        searchInput.blur();
      }
    });

    // Handle window resize
    window.addEventListener('resize', debounce(() => {
      if (window.innerWidth <= 768) {
        sidebar.classList.add('collapsed');
      } else {
        sidebar.classList.remove('collapsed');
      }
    }, 250));

    // Handle grid item clicks (if using modal preview)
    gridContainer.addEventListener('click', (e) => {
      const gridItem = e.target.closest('.grid-item');
      if (gridItem) {
        const link = gridItem.querySelector('a');
        if (link) {
          e.preventDefault();
          const animationId = new URL(link.href).searchParams.get('id');
          openAnimationPreview(animationId);
        }
      }
    });
  }

  // Animation Preview (modal)
  function openAnimationPreview(animationId) {
    const animation = animations.find(a => a.id === animationId);
    if (!animation) return;

    // Create modal for preview
    const modal = document.createElement('div');
    modal.className = 'preview-modal';
    modal.innerHTML = `
      <div class="preview-content">
        <button class="close-btn">&times;</button>
        <h2>${animation.name}</h2>
        <div class="preview-container">
          <iframe src="${animation.preview}" frameborder="0"></iframe>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    
    // Close modal on button click
    modal.querySelector('.close-btn').addEventListener('click', () => {
      modal.remove();
    });

    // Close modal when clicking outside content
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }

  // Initialize Application
  function init() {
    // Cache DOM elements
    gridContainer = document.getElementById(config.gridContainerId);
    searchInput = document.querySelector('.search-bar input');
    sidebar = document.querySelector('.sidebar');
    navLinks = document.querySelectorAll('.nav-link');

    // Initialize features
    initializeEventListeners();
    initializeNavigation();
    
    // Initial content load
    populateGrid();

    // Check initial window size
    if (window.innerWidth <= 768) {
      sidebar.classList.add('collapsed');
    }

    // Remove loading state if present
    document.body.classList.remove('loading');
  }

  // Start the application when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
