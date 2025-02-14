// js/animations.js
// Animation Data and Configuration
const animations = [
  {
    id: "letterRain",
    name: "Letter Rain Simulation",
    description: "A realistic simulation where letters fall like rain and merge into the ground using Matter.js.",
    thumbnail: "assets/letter-drop-animation.gif",
    preview: "animations/letter-rain/index.html",
    path: "animations/letter-rain/"
  },
  {
    id: "fallingLetters",
    name: "Falling Letters Simulation",
    description: "An engaging simulation of falling letters with realistic physics and elegant motion.",
    thumbnail: "assets/images/fallingLetters.png",
    preview: "animations/falling-letters/index.html",
    path: "animations/falling-letters/"
  }
];

// Grid Item Creation
function createGridItem(animation) {
  const gridItem = document.createElement('div');
  gridItem.className = 'grid-item';

  const link = document.createElement('a');
  // Use the animation path directly for navigation
  link.href = animation.path;
  link.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = animation.path;
  });

  const img = document.createElement('img');
  img.className = 'thumbnail';
  img.src = animation.thumbnail || 'assets/images/placeholder.png';
  img.alt = animation.name;

  const infoDiv = document.createElement('div');
  infoDiv.className = 'info';
  
  const title = document.createElement('h3');
  title.textContent = animation.name;
  
  const description = document.createElement('p');
  description.textContent = animation.description;

  infoDiv.appendChild(title);
  infoDiv.appendChild(description);
  link.appendChild(img);
  link.appendChild(infoDiv);
  gridItem.appendChild(link);
  
  return gridItem;
}
