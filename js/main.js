/* Dropdown */
const body = document.body;
const dropdown = document.querySelectorAll('.dropdown');

dropdown.forEach(el => {
    el.addEventListener('click', () => {
        if (el.classList.contains('show')) {
            el.classList.remove('show');
        } else {
            el.classList.add('show');
        }
    });
});

body.addEventListener('click', (el) => {
    if (!el.target.classList.contains('dropdown-item')) {
        dropdown.forEach(el => {
            el.classList.remove('show');
        });
    }
});

// if (window.devicePixelRatio !== 1){
//     let scaleValue = (1/window.devicePixelRatio);
//     $('.content, header>*, footer > *').css('transform','scale('+scaleValue+')');
// }