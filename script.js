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


buildApp('Ently', 'static/img/icon.svg', settings, navs);


const welcome = element('h2', wrapper)
welcome.textContent = 'Welcome to Ently!';

const desc = element('p', wrapper)
desc.textContent = 'This is a sample application built using the Ently framework. Enjoy exploring the features and components available to you!';

const card1 = new Card(wrapper);
card1.add([welcome, desc]);

const btn1 = new Btn('icon.png', 'Click Me', wrapper);
btn1.onClick(() => {
    alert('Button 1 clicked!');
});
btn1.setColor('green');

const btn2 = new Btn(null, 'Yellow', wrapper);
btn2.setColor('yellow');

const btn3 = new Btn(null, 'Purple', wrapper);
btn3.setColor('purple');

const btn4 = new Btn(null, 'Red', wrapper);
btn4.setColor('red');

const btn5 = new Btn(null, 'Blue', wrapper);
btn5.setColor('blue');