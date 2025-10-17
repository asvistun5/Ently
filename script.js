buildApp('Ently', 'icon.png', {    
    navOpt: true,
    sidebarOpt: true,
    wrapperOpt: true,
    loadFonts: true,
    materialDesign: true
});

add('h2', wrapper).textContent = 'Welcome to Ently lib.';
add('p', wrapper).textContent = 'You can customize this application by modifying the main.js file. Enjoy building your app!';
add('br', wrapper);

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