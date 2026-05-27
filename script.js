const DRAG_THRESHOLD = 5;
let selectedCube = null;
let isDragging = false;
let mouseStartX = 0;
let mouseStartY = 0;
let clickOffsetX = 0;
let clickOffsetY = 0;
   
function clamp(number, min, max) {
      return Math.min(Math.max(number, min), max);
    }
 
function getDistanceMoved(currentX, currentY) {
      const distanceX = currentX - mouseStartX;
      const distanceY = currentY - mouseStartY;
      return Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    }

function getContainerPadding(container) {
      const containerStyle = window.getComputedStyle(container);
      return {
        top:    parseFloat(containerStyle.paddingTop),
        right:  parseFloat(containerStyle.paddingRight),
        bottom: parseFloat(containerStyle.paddingBottom),
        left:   parseFloat(containerStyle.paddingLeft),
      };
    }

function startWatchingForDrag(mouseEvent, cube) {
      selectedCube = cube;
      mouseStartX = mouseEvent.clientX;
      mouseStartY = mouseEvent.clientY;

      const cubePosition = cube.getBoundingClientRect();
      clickOffsetX = mouseEvent.clientX - cubePosition.left;
      clickOffsetY = mouseEvent.clientY - cubePosition.top;
    }
 
    function pickUpCube(cube) {
      isDragging = true;
      const cubePosition = cube.getBoundingClientRect();
      const container    = cube.closest('.items');
      const containerPosition = container.getBoundingClientRect();
      cube.style.position = 'absolute';
      cube.style.width    = cubePosition.width + 'px';
      cube.style.height   = cubePosition.height + 'px';
      cube.style.left = (cubePosition.left - containerPosition.left + container.scrollLeft) + 'px';
      cube.style.top  = (cubePosition.top  - containerPosition.top) + 'px';
      cube.classList.add('is-dragging');
      container.classList.add('active');
    }

function moveCubeToMouse(mouseEvent) {
	if(!isDragging || !selectedCube) return;
	const conatiner = selectedCube.closest('.items');
	const conatinerPosition = conatiner.getBoundingClientReact();
	const padding = getContainerPadding(conatiner);
	const desiredLeft = mouseEvent.clientX - conatinerPosition.top -clickOffsetY;
	const cubeWidth = selectedCube.offsetWidth;
	const cubeHeight = selectedCube.offsetHeight;

	const leftBoundary = padding.left;
	const topBoundary = padding.top;
	const rightBoundary = conatiner.scrollWidth - padding.right - cubeWidth;
	const bottomBoundary = conatiner.clientHeight - padding.bottom - cubeHeight;

	const safeLeft = clamp(desiredLeft, leftBoundary, rightBoundary);
	const safeTop = clamp(desiredTop, topBoundary, bottomBoundary);

	selectedCube.style.left = safeLeft + "px";
	selectedCube.style.top = safeTop + "px";
}

function dropCube() {
	if(!selectedCube) return;

	const container = selectedCube.closest('.items');
	if(isDragging){
      selectedCube.classList.remove('is-dragging');
	  container.classList.remove('active');
	}
	selectedCube = null;
	isDragging = false;
}

const itemsContainer = document.querySelector('.items');
itemsContainer.addEventListener('mousedown', function(mouseEvent) {
	const clickedCube = mouseEvent.target.closest('.item');
	if(!clickedCube) return;
	startWatchingForDrag(mouseEvent, clickedCube);
})

document.addEventListener('mousemove', function(mouseEvent) {
	if(!selectedCube) return;
	if(!isDragging){
       const distanceMoved = getDistanceMoved(mouseEvent.clientX, mouseEvent.clientY);
		if(distanceMoved>DRAG_THRESHOLD){
            pickUpCube(selectedCube);
		}
	}
	if(isDragging){
       moveCubeToMouse(mouseEvent);
	}
});

document.addEventListener('mouseup', function() {
	dropCube();
})

document.addEventListener('mouseleave', function() {
	dropCube();
})
