// js/animations.js
// Animation Data and Configuration
// js/animations.js
const animations = [
  {
    id: "letterRain",
    name: "Letter Rain Simulation",
    description: "Experience a mesmerizing cascade of letters that fall like rain and merge with the ground. Utilizing Matter.js, it brings realistic gravity and collision dynamics to life in an engaging visual display.",
    thumbnail: "assets/letter-drop-animation.gif",
    preview: "animations/letter-rain/index.html",
    path: "animations/letter-rain/"
  },
  {
    id: "hexagonball1",
    name: "Ball in Rotating Hexagon",
    description: "Watch a ball bounce dynamically within a rotating hexagon, where gravity, friction, and restitution shape its every move. With interactive controls to adjust parameters like bounce and rotation speed, this simulation offers a hands-on exploration of physics in action.",
    thumbnail: "assets/hexagon-one-ball.gif",
    preview: "animations/hexagon-one-ball/index.html",
    path: "animations/hexagon-one-ball/"
  },
  {
    id: "spinner",
    name: "Loading Spinner",
    description: "A sleek spinner animation designed to indicate loading states with a modern flair.",
    thumbnail: "assets/spinner.gif",
    preview: "animations/spinner/index.html",
    path: "animations/spinner/"
  },{
    id: "spinner",
    name: "Loading Spinner",
    description: "A sleek spinner animation designed to indicate loading states with a modern flair.",
    thumbnail: "assets/spinner.gif",
    preview: "animations/spinner/index.html",
    path: "animations/spinner/"
  },
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
  
  // const description = document.createElement('p');
  // description.textContent = animation.description;

  infoDiv.appendChild(title);
  // infoDiv.appendChild(description);
  link.appendChild(img);
  link.appendChild(infoDiv);
  gridItem.appendChild(link);
  
  return gridItem;
}
