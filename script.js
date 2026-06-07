const slider = document.querySelector('.items');
 
let isDown = false;
let startX = 0;
let scrollLeft = 0;
 
slider.addEventListener('mousedown', (e) => {
 
    if (e.which !== 1) return;
 
    isDown = true;
 
    slider.classList.add('active');
 
    startX = e.pageX;
 
    scrollLeft = slider.scrollLeft;
 
});
 
document.addEventListener('mouseup', () => {
 
    isDown = false;
 
    slider.classList.remove('active');
 
});
 
document.addEventListener('mousemove', (e) => {
 
    if (!isDown) return;
 
    e.preventDefault();
 
    const x = e.pageX;
 
    const walk = x - startX;
 
    slider.scrollLeft = scrollLeft - walk;
 
});
