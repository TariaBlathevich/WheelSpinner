class Resizer {

    constructor(canvasWrapper) {
        this.cw = canvasWrapper;
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
        $('#options-home').hide().height('0%');
        $('#canvas-home').height('100%');
        this.cw.refit();
    }

    _toggleOf() {
        this.isToggled = false;
        $('#options-home').show().height('50%');
        $('#canvas-home').height('50%');
        this.cw.refit();
        
    }

}