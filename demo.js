const app = buildApp({
    name: 'Ently',
    icon: 'static/img/icon.svg',
    settings: {
        navOpt: true,
        sidebarOpt: true,
        wrapperOpt: true
    },
    navs: {
        home: { label: 'Home', href: '/home' },
        abt: { href: '/abt' }
    },
    content: {
        inp: new Input('Credit card', null),
        chk: new Switch('Use cookies', null, { type: 'radio' }),
        btn: new Btn('Login', null, { type: 'outlined' }),
    },
    callback: main
});

function main(app) {
    const { content } = app;
    const con = content;

    con.btn.on('click', () => { con.btn.setColor('green'); con.btn.setText('Clicked'); con.chk.click(); });
}