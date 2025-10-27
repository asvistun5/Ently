let settings = { 
    navOpt: true, 
    sidebarOpt: true, 
    wrapperOpt: true 
};

let navs = {
    Home: '/home',
    About: '/about',
    Contact: '/contact'
};

const welcome = element('h2')
welcome.textContent = 'Welcome to Ently!';

const card1 = new Card();
card1.add(welcome);

const btn1 = new Btn('icon.png', 'Click Me');
btn1.onClick(() => { alert('Button 1 clicked!') });
btn1.setColor('green');


console.log(card1.elem);
console.log(btn1.elem);

let content = [
    card1,
    btn1
]


buildApp('Ently', 'static/img/icon.svg', settings, navs, content);

wrapper.add(content)