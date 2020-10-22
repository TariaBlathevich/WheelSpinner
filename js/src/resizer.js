class Resizer {

    constructor(canvasWrapper, painter, spinner) {
        this.cw = canvasWrapper;
        this.painter = painter;
        this.spinner = spinner;
        this.isToggled = false;
    }

    toggle() {
        if(this.isToggled) {
            this._toggleOf();
        } else {
            this._toggleOn();
        }
    }

    _toggleOn() {
        this.isToggled = true;
        let r = this;
        this.animationThread(20, 15, i => {
            $('#options-home').css({height: `${50 - i * 2.5}%`, opacity: 1 - i * 0.05});
            $('#canvas-home').css({height: `${50 + i * 2.5}%`});
            r.refit();
        });
    }
    

    _toggleOf() {
        this.isToggled = false;
        let r = this;
        this.animationThread(20, 15, i => {
            $('#options-home').css({height: `${i * 2.5}%`, opacity: i * 0.05});
            $('#canvas-home').css({height: `${100 - i * 2.5}%`});
            r.refit();
        });
    }

    refit() {
        this.cw.refit();
        this.painter.paint(0, this.cw, this.spinner);
    }

    animationThread(frames, interval, funct) {
        let i = 0;
        let animation = setInterval(() => {
            i++;
            funct(i);
            if(i === frames) {
                clearInterval(animation);
            }
        }, interval);
    }

}