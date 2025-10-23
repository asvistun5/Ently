const doc = document;
const head = doc.head;
const body = doc.body;

let nav, sidebar, wrapper;

function buildApp(name, icon = false, logo = null, options = {}, navs = []) {
    const {
        navOpt = true,
        sidebarOpt = false,
        wrapperOpt = true,
        loadFonts = true,
        materialDesign = true,
        mode = 'system'
    } = options;

    if (materialDesign) addMaterialDesign();
    if (mode === 'system') {
        const darkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        body.classList.toggle('dark', darkMode);
    } else if (mode === 'dark' || mode === 'light') {
        body.classList.toggle(mode);
    }

    if (name) doc.title = name;

    if (icon) {
        const link = doc.createElement('link');
        link.rel = 'icon';
        link.href = icon;
        head.appendChild(link);
    } else {
        console.warn('Icon not found, please add an icon.png file to the root directory.');
    }

    if (loadFonts) {
        const productFont = doc.createElement('link');
        productFont.rel = 'stylesheet';
        productFont.href = 'https://fonts.googleapis.com/css2?family=Product+Sans:wght@300;400;700&display=swap';
        head.appendChild(productFont);

        const interFont = doc.createElement('link');
        interFont.rel = 'stylesheet';
        interFont.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap';
        head.appendChild(interFont);
    }

    if (navOpt) nav = new Navbar('.nav', name, icon, navs).elem;
    if (sidebarOpt) sidebar = new Sidebar('.sidebar').elem;
    if (wrapperOpt) wrapper = new Wrapper('.wrapper').elem;

    const spinner = document.querySelector('.spinner');
    if (spinner) { 
        setTimeout(() => {
            spinner.classList.add('hide');
        }, 400);
        setTimeout(() => {
            spinner.remove();
        }, 600);
    }
}


function addMaterialDesign() {
    addStylesheet('style.css');
}

function addStylesheet(href = 'styles.css') {
    const link = doc.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    head.appendChild(link);
}

function element(tag, parent) {
    const elem = doc.createElement(tag);
    if (parent) parent.appendChild(elem);
    return elem;
}

class Color {
    constructor(color = 'purple', customColors = {}) {
        this.defaultColors = {
            red: '#ffddddff',
            green: '#d0ffc8ff',
            blue: '#ddeaffff',
            purple: '#eaddffff',
            black: '#000000',
            white: '#f7f7ffff',
            yellow: '#fff7ddff',
            orange: '#ffe7ddff'
        };
        this.colors = { ...this.defaultColors, ...customColors };
        this.setColor(color);
    }

    toHex(color) {
        if (color.startsWith('#')) return color;
        return this.colors[color.toLowerCase()] || this.colors['purple'];
    }

    setFgColor(bgColor) {
        const hex = bgColor.replace('#', '').slice(0, 6);
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 128 ? '#000000' : '#ffffff';
    }

    getFgColor(bgColor) {
        return this.setFgColor(bgColor);
    }

    setColor(newColor) {
        this.color = this.toHex(newColor);
        this.fgcolor = this.getFgColor(this.color);
    }

    addColor(name, hex) {
        this.colors[name.toLowerCase()] = hex;
    }
}

class Logo {
    constructor(selector = '.logo', parent, name, icon, usedLogo = null) {
        this.elem = document.querySelector(selector);
        if (!this.elem) {
            const logo = doc.createElement('div');
            const logoIcon = doc.createElement('img');
            logo.classList.add(selector.replace('.', ''));

            if (usedLogo) {
                logoIcon.src = usedLogo || 'logo.png';
            } else if (icon) {
                logoIcon.src = icon || 'icon.png';
                logo.textContent = name || 'App';
            }

            logo.prepend(logoIcon);
            
            parent.appendChild(logo);
        }
    }
}

class Btn {
    constructor(icon, name, parent, selector = '.filled') {
        const btn = doc.createElement('button');
        btn.classList.add(selector.replace('.', ''));

        const btnText = doc.createElement('span');
        btnText.textContent = name || 'Button';

        btn.appendChild(btnText);

        parent.appendChild(btn);

        this.elem = btn;
    }
    setColor(color) {
        const c1 = new Color(color);
        color = c1.color;
        this.elem.style.backgroundColor = color;
        this.elem.style.color = c1.fgcolor;
    }
    onClick(callback) {
        this.elem.addEventListener('click', callback);
    }
    on(event, callback) {
        this.elem.addEventListener(event, callback);
    }
}

class Link {
    constructor(icon, name, href = '#', parent, selector = '.link') {
        const link = document.createElement('a');
        link.classList.add(selector.replace('.', ''));
        link.href = href;

        link.textContent = name || 'Link';

        parent.appendChild(link);

        this.elem = link;
    }
}

class Navbar {
    constructor(selector = '.nav', name, icon, navs = []) {
        this.elem = document.querySelector(selector);
        if (!this.elem) {
            const navbar = doc.createElement('nav');
            navbar.classList.add(selector.replace('.', ''));

            const logo = new Logo('.logo', navbar, name, icon);

            navs.forEach(navItem => {
                const link = new Link(null, navItem.name, navItem.href, navbar, '.nav-link');
                console.log(link);
            });
            
            body.appendChild(navbar);
            this.elem = navbar;
        }
    }

    show() { this.elem.classList.add('shown'); }
    hide() { this.elem.classList.remove('shown'); }
    toggle() { this.elem.classList.toggle('shown'); }
}

class Sidebar {
    constructor(selector, options = {}, toggleBtn) {
        this.elem = document.querySelector(selector);
        if (!this.elem) {
            const sidebar = doc.createElement('div');
            sidebar.classList.add(selector.replace('.', ''));
            body.appendChild(sidebar);
            this.elem = sidebar;
        }
    }

    show() {
        this.elem.classList.add('shown');
    }

    hide() {
        this.elem.classList.remove('shown');
    }

    toggle() {
        this.elem.classList.toggle('shown');
    }
}

class Wrapper {
    constructor(selector = '.wrapper') {
        this.elem = document.querySelector(selector);

        if (!this.elem) {
            wrapper = doc.createElement('main');
            wrapper.classList.add('wrapper');
            body.appendChild(wrapper);
            this.elem = wrapper;
        }
    }
}