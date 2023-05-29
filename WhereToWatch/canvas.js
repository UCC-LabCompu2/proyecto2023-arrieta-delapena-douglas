document.addEventListener("DOMContentLoaded", function () {
    const coords = {x: 0, y: 0};
    const circles = document.querySelectorAll(".circle");

    circles.forEach(function (circle) {
        circle.x = 0;
        circle.y = 0;
        //circle.x y circle.y son nuevas propiedades que creamos para cada círculo
    });

    window.addEventListener("mousemove", function (e) {
        coords.x = e.clientX;
        coords.y = e.clientY;

        animateCircles();
    });

    // Es importante distinguir entre circle.x y circle.y de coords.x y coords.y, porque circle.x y circle.y establecen
    // la posición de los círculos, mientras que coords.x y coords.y son propiedades del objeto coords que creamos
    // al comienzo del código y que se actualizan con la posición del mouse.
    function animateCircles() {
        let x = coords.x;
        let y = coords.y;

        circles.forEach(function (circle, index) {
            // Ajusta la posición de cada círculo con el centro del mouse
            circle.style.left = coords.x - 12 + "px";
            circle.style.top = coords.y - 12 + "px";

            // Ajusta el tamaño de cada círculo según su posición en el array para que cada uno sea más pequeño que el anterior
            circle.style.scale = ( circles.length - index ) / circles.length;

            circle.x = x;
            circle.y = y;

            // Ajusta la posición de cada círculo con el centro del círculo anterior
            const nextCircle = circles[index + 1] || circles[0];
            coords.x += (nextCircle.x - circle.x) * .25;
            coords.y += (nextCircle.y - circle.y) * .25;
        });
    }
});
