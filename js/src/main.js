const cw = new Gmt.CanvasWrapper('canvas-home');
const spinner = new SpinnerHandler('options-home');
const painter = new Painter();

$('.canvas-home-canvas').on('click', () => {
    spinner.spin();
});

new Gmt.Loop(62, loop => {
    spinner.rotate();
    painter.paint(loop.getFrame(), cw, spinner);
}).start();