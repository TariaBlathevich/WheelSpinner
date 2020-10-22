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
        $('#pmodal-content').html(this._getStatesToLoadHTML());
    }

    openSave() {
        this._load();
        this._renderSave();
    }

    _renderPModal(title, innerHTML) {
        $('body').append(`
            <div id="pmodal-outer-body">
                <div id="pmodal-inner-body">
                    <div id="pmodal-top-bar">
                        <span id="pmodal-title-span">${title}</span>
                        <span id="pmodla-close-span" onclick="saverLoader.cancel()">\u2715</span>
                    </div>
                    <div id="pmodal-content">${innerHTML}</div>
                </div>
            </div>
        `);
        $('#pmodal-outer-body').hide().fadeIn(300);
    }

    _renderSave() {
        this._renderPModal('Save your option set as ... ', `
            <div class='pmodal-full-width-div'>
                <input id='new-state-name-input' value='my option set ${new Date().toLocaleDateString()}'/>
            </div>
            <div class='pmodal-full-width-div'>
                <input id='new-state-confirm' type='submit' value='confirm' onclick='saverLoader.confirmSave()'/>
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
        this._renderPModal('Choose an option set', 
            `<div>${this._getStatesToLoadHTML()}</div>`
        );
    }

    _getStatesToLoadHTML() {
        let html = '';
        this.states.forEach((s, i) => {
            html += `
                <div class='pmodal-full-width-div'>
                    <span class='pmodal-option-name-span' onclick='saverLoader.confirmLoad(${i})'>${s.name}</span>
                    <input class='pmodal-option-delete-span' type='button' onclick='saverLoader.delete(${i})' value='\u2715'/>
                </div>
            `;
        });
        return html;
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