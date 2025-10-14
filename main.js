const doc = document;
const head = doc.head;
const body = doc.body;

let nav, sidebar, wrapper;

function buildApp(name, icon = false, navOpt = true, sidebarOpt = false, addWrapper = true, loadFonts = true) {
    if (name) {
        doc.title = name;
    }

    if (icon) {
        const link = doc.createElement('link');
        link.rel = 'icon';
        link.href = icon || 'icon.png';
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
        interFont.href = 'https://fonts.googleapis.com/css2?family=Product+Sans:wght@300;400;700&display=swap';
        head.appendChild(interFont);
    }

    if (navOpt) {
        nav = new Navbar('.nav', name, icon);
    }

    if (sidebarOpt) {
        sidebar = new Sidebar('.sidebar');
    }

    if (addWrapper) {
        wrapper = doc.createElement('main');
        wrapper.classList.add('wrapper');
        body.appendChild(wrapper); 
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

class Logo {
    constructor(selector = '.logo', parent, name, icon) {
        this.elem = document.querySelector(selector);
        if (!this.elem) {
            const logo = doc.createElement('div');
            logo.classList.add(selector.replace('.', ''));

            const logoIcon = doc.createElement('img');
            logoIcon.src = icon || 'icon.png';

            logo.textContent = name || 'App';

            logo.prepend(logoIcon);
            
            parent.appendChild(logo);
        }
    }
}

class Btn {
    constructor(parent, name, icon, selector = '.filled') {
        const btn = doc.createElement('button');
        btn.classList.add(selector.replace('.', ''));

        const btnText = doc.createElement('span');
        btnText.textContent = name || 'Button';

        btn.appendChild(btnText);

        parent.appendChild(btn);

        this.elem = btn;
    }
}

class Link {
    constructor(parent, name, href = '#', selector = '.link') {
        const link = document.createElement('a');
        link.classList.add(selector.replace('.', ''));
        link.href = href;

        const linkText = document.createElement('span');
        linkText.textContent = name || 'Link';

        link.appendChild(linkText);
        parent.appendChild(link);

        this.elem = link;
    }
}

class Navbar {
    constructor(selector = '.nav', name, icon, options = {}) {
        this.elem = document.querySelector(selector);
        if (!this.elem) {
            const navbar = doc.createElement('nav');
            navbar.classList.add(selector.replace('.', ''));

            const logo = new Logo('.logo', navbar, name, icon);
            
            body.appendChild(navbar);
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

class Sidebar {
    constructor(selector, options = {}, toggleBtn) {
        this.elem = document.querySelector(selector);
        if (!this.elem) {
            const sidebar = doc.createElement('div');
            sidebar.classList.add(selector.replace('.', ''));
            body.appendChild(sidebar);
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