const SaverLoader = {

    save() {
        let opts = spinner.options;
        let json = JSON.stringify(opts);
        localStorage.setItem('saved', json);
    },

    load() {
        let json = localStorage.getItem('saved');
        if(json) {
            let opst = JSON.parse(json);
            spinner.options = opst;
            spinner.renderOptions();
        }
    }

}