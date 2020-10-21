class SaverLoader {

    constructor(spinner) {
        this.spinner = spinner;
        this.states = [];
    }

    _get() {
        return JSON.parse(localStorage.getItem('wsSavedData') || '[]');
    }

    _set(data) {
        localStorage.setItem('wsSavedData', JSON.stringify(data || []));
    }

    _load() {
        this.states = this._get();
    }

    _save() {
        this._set(this.states);
    }

    add(newState) {
        this.states.append(newState);
        return this;
    }

    delete(index) {
        this.states = this.states.filter((e, i) => i !== index);
        this._save();
        this._renderLoad();
    }

    openSave() {
        this._load();
        this._renderSave();
    }

    _renderPModal(title, innerHTML) {
        this.close();
        $('body').append(`
            <div id="pmodal-outer-body">
                <div id="pmodal-inner-body">
                    <div id="pmodal-top-bar">
                        <span id="pmodal-title-span">${title}</span>
                        <span id="pmodla-close-span" onclick="saverLoader.cancel()">\u2715</span>
                    </div>
                    <div id="pmodal-content">
                        ${innerHTML}
                    </div>
                </div>
            </div>
        `);
    }

    _renderSave() {
        this._renderPModal('Save an option set', `
            <div>
                <input id='new-state-name-input' value='my option set'/>
                <input type='submit' value='confirm' onclick='saverLoader.confirmSave()'/>
            </div>
        `);
    }

    confirmSave() {
        let newState = new State($('#new-state-name-input').val() || 'unnamed', this.spinner.options);
        this.states.push(newState);
        this._save();
        this.close();
    }

    openLoad() {
        this._load();
        this._renderLoad();
    }

    _renderLoad() {
        let innerHtml = '<div>';
        this.states.forEach((s, i) => {
            innerHtml += `
                <div onclick='saverLoader.confirmLoad(${i})'>
                    ${s.name}
                </div>
                <div onclick='saverLoader.delete(${i})'>
                    \u2715
                </div>`
        });
        innerHtml += '</div>';
        this._renderPModal('Load an option set', innerHtml);
    }

    confirmLoad(index) {
        this.spinner.options = this.states[index].optionSet;
        this.spinner.renderOptions();
        this.close();
    }

    close() {
        $('#pmodal-outer-body').remove();
        return this;
    }

    cancel() {
        this.close();
    }

}


class State {
    constructor(name, optionSet) {
        this.name = name;
        this.optionSet = optionSet;
    }
}