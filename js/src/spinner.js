class SpinnerHandler {

    constructor(homeId) {
        this.homeId = '#' + homeId;
        this.options = [];
        this._generateDefault();
        this.renderOptions();

        this.rotation = {
            dir: 0,
            vel: 0
        };
    }

    rotate() {
        if(this.rotation.vel > 0) {
            this.rotation.dir += this.rotation.vel;
            this.rotation.vel -= 0.001;
        }
    }

    spin() {
        this.rotation.vel = Gmt.randFloat(0.27, 0.38);
    }

    _generateDefault() {
        Gmt.iter1D(5, i => this.addOption());
    }

    addOption() {
        this.options.push(new Option(`Option ${this.options.length + 1}`, 1, this._randColor()));
        this.renderOptions();
    }

    deleteOption(index) {
        this.options = this.options.filter((e, i) => i !== index);
        this.renderOptions();
    }

    _randColor() {
        let colorString = '#';
        Gmt.iter1D(6, i => colorString += Gmt.choice('0123456789abcdef'));
        return colorString;
    }

    renderOptions() {
        $(this.homeId).empty();
        this.options.forEach((o, i) => this._renderOneOption(o, i));
        this._renderAddButton();
    }

    _renderOneOption(option, index) {
        $(this.homeId).append(`
            <div id='option-body-${index}' class='option-body'>
                <input type='text' value='${option.name}' class='option-name-holder' id='option-name-holder-${index}'/>
                <input type='number' value='${option.weight}' class='option-weight-holder' id='option-weight-holder-${index}'
                    oninput="WeightFix.onInput(this)" onfocusout="WeightFix.onFocusOut(this)" />
                <input type='color' value='${option.color}' class='option-color-holder' id='option-color-holder-${index}'/>
                <input type='button' value='X' class='option-delete-holder' id='option-delete-holder-${index}'/>
            </div>
        `);
        $(`#option-name-holder-${index}`).change(() => {option.name = $(`#option-name-holder-${index}`).val()});
        $(`#option-weight-holder-${index}`).change(() => {option.weight = $(`#option-weight-holder-${index}`).val()});
        $(`#option-color-holder-${index}`).change(() => {option.color = $(`#option-color-holder-${index}`).val()});
        $(`#option-delete-holder-${index}`).click(() => this.deleteOption(index));
    }

    _renderAddButton() {
        $(this.homeId).append(`
            <div id='option-body-next' class='option-body'>
                <input type='button' value='ADD' class='option-add-holder' id='option-add-holder'/>
            </div>
        `);
        $(`#option-add-holder`).click(() => this.addOption());
    }

}


class Option {
    
    constructor(name, weight, color) {
        this.name = name;
        this.weight = weight;
        this.color = color;
    }
}


const WeightFix = {

    onInput(element) {
        let newValue = element.value;
        if(isNaN(newValue)){
            newValue = 1;
        }
        newValue = parseInt(newValue);
        if(newValue >= 100) {
            newValue = 100;
        } else if(newValue <= 1) {
            newValue = 1;
        }
        element.value = newValue;
    },
    
    onFocusOut(element) {
        let newValue = element.value;
        if(!newValue || isNaN(newValue)){
            newValue = 1;
        }
        element.value = newValue;
    }
}
