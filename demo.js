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
        btn: new Btn('user', 'Login')
    },
    callback: main
});

function main(app) {
    const { content } = app;
    content.btn.onClick(() => { content.btn.setColor('green'); content.btn.setText('Clicked'); });
}