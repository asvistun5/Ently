const app = render({
    /* general */
    name: 'Ently',
    icon: 'static/img/icon.svg',

    /* page settings */
    settings: {
        components: ['navbar', 'sidebar', 'wrapper']
    },
    navs: {
        home: { name: 'Home', url: '/home' },
        abt: { url: '/abt' }
    },

    /* main page content */
    content: {
        inp: new Input('Credit card', null),
        chk: new Switch('Use cookies', null, { type: 'radio' }),
        btn: new Btn('Login', null, { type: 'outlined' }),
    },

    /* main callback function */
    call: function main(app) {
        const { content } = app;
        const con = content;

        con.btn.on('click', () => { con.btn.setColor('green'); con.btn.setText('Clicked'); con.chk.click(); });
    }
});