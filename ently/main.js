const doc = document;
const head = doc.head;
const body = doc.body;

let nav, sidebar, wrapper;

function render({ name, icon = false, options = {}, navs = [], content, call }) {
    const { navOpt = true, sidebarOpt = false, wrapperOpt = true, loadFonts = true, materialDesign = true, mode = 'system' } = options;

    if (materialDesign) addMaterialDesign(materialDesign);
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

    if (loadFonts)
        ['Product+Sans:wght@300;400;700', 'Inter:wght@100;200;300;400;500;600;700;800;900']
        .forEach(f => head.appendChild(Object.assign(doc.createElement('link'), { rel:'stylesheet', href:`https://fonts.googleapis.com/css2?family=${f}&display=swap` })));


    if (navOpt) nav = new Navbar(name, icon, navs, '.nav').elem;
    if (sidebarOpt) sidebar = new Sidebar('.sidebar').elem;
    if (wrapperOpt) wrapper = new Wrapper(Object.values(content), '.wrapper');

    const spinner = document.querySelector('.spinner');
    if (spinner) { 
        setTimeout(() => {
            spinner.classList.add('hide');
        }, 400);
        setTimeout(() => {
            spinner.remove();
        }, 600);
    }

    const app = { name, icon, nav, sidebar, wrapper, content };

    if (call) call(app);

    return app;
}

function addMaterialDesign(path) {
    const defaultPath = 'ently/css/style.css';
    const finalPath = (typeof path === 'string') ? path : defaultPath;
    stylesheet(finalPath);
}

function stylesheet(href = 'styles.css') {
    const link = doc.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    head.appendChild(link);
}

function elem(tag, parent) {
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
    constructor(text, parent, options = { type: 'filled' }) {
        const { type, selector } = options;
        const btn = doc.createElement('button');
        if (type === 'filled') {
            btn.classList.add('filled');
        } else if (type === 'outlined') {
            btn.classList.add('outlined');
        }
        if (selector) btn.classList.add(selector.replace('.', ''));

        const btnText = doc.createElement('span');
        btnText.textContent = text || 'Button';

        btn.appendChild(btnText);

        if (parent) parent.appendChild(btn);

        this.elem = btn;
    }

    setColor(color) {
        const c1 = new Color(color);
        color = c1.color;
        this.elem.style.backgroundColor = color;
        this.elem.style.color = c1.fgcolor;
    }
}

class Link {
    constructor(label, href = '#', parent, selector = '.link') {
        const link = document.createElement('a');
        link.classList.add(selector.replace('.', ''));
        link.href = href;
        link.textContent = label || 'Link';

        if (parent instanceof HTMLElement) {
            parent.appendChild(link);
        } else {
            console.warn(`⚠️ Link "${label}": parent isn't HTMLElement`, parent);
        }

        this.elem = link;
    }
}

class Card {
    constructor(parent, opts = {}) {
        const image = opts.img || null;
        const selector = opts.selector || '.card';
        const btns = opts.btns || [];
        const card = doc.createElement('div');
        if (image) elem('img', card).src = image;
        if (typeof selector !== 'string') throw new Error(`${selector} Selector must be a string.`);
        card.classList.add(selector.replace('.', ''));
        if (parent) parent.appendChild(card);
        this.elem = card;
    }

    add(content) {
        (Array.isArray(content) ? content : [content]).forEach(i => this.elem.appendChild(i));
    }

    onBtn(callback) {
        //pass
    }

    on(event, callback) {
        this.elem.addEventListener(event, callback);
    }
}

class Switch {
    constructor(text, parent, options = { type: 'switch', pos: 'right', selector: '.switch' }) {
        const { type, pos, label, selector } = options;

        const checkbox = document.createElement('input');

        if (type === 'switch') checkbox.type = 'checkbox';
        else if (type === 'box') checkbox.type = 'checkbox';
        else if (type === 'radio') checkbox.type = 'radio';
        else checkbox.type = 'checkbox';

        if (label) {
            const wrapper = document.createElement('label');
            const span = document.createElement('span');
            span.textContent = typeof label === 'string' ? label : text || '';

            if (pos === 'left') {
                wrapper.appendChild(checkbox);
                wrapper.appendChild(span);
            } else {
                wrapper.appendChild(span);
                wrapper.appendChild(checkbox);
            }

            if (selector) wrapper.classList.add(selector.replace('.', ''));
            if (parent) parent.appendChild(wrapper);

            this.elem = wrapper;
            this.checkbox = checkbox;
        } else {
            if (selector) checkbox.classList.add(selector.replace('.', ''));
            if (parent) parent.appendChild(checkbox);

            this.elem = checkbox;
            this.checkbox = checkbox;
        }
    }

    setChecked(checked) {
        this.checkbox.checked = checked;
    }
}

class Input {
    constructor(placeholder, parent, options = { type: 'text', label: false }) {
        const { type, label } = options;
        
        const input = document.createElement('input');
        input.type = type;
        input.placeholder = placeholder || '';

        if (label) {
            const wrapper = document.createElement('label');

            const span = document.createElement('span');
            span.textContent = typeof label === 'string' ? label : placeholder || '';

            wrapper.appendChild(span);
            wrapper.appendChild(input);

            if (parent) parent.appendChild(wrapper);

            this.elem = wrapper;
            this.input = input;
        } else {
            this.elem = input;
            if (parent) parent.appendChild(input);
        }
    }

    setValue(value) {
        this.input.value = value;
    }

    value() {
        return this.input.value;
    }

    setPlaceholder(text) {
        this.input.placeholder = text;
        this.elem.querySelector('span').textContent = text;
    }
}

class Navbar {
    constructor(name, icon, links = {}, selector = '.nav') {
        const nav = doc.createElement('nav');
        nav.classList.add(selector.replace('.', ''));
        const navs = doc.createElement('div');
        navs.id = 'navs';
        
        new Logo('.logo', nav, name, icon);

        Object.entries(links).forEach(([key, value]) => {
            let label, href;

            if (typeof value === 'object') {
                label = value.name || key.charAt(0).toUpperCase() + key.slice(1); 
                href = value.url || '#';
            } else {
                label = key;
                href = value || '#';
            }

            new Link(label, href, navs, '.nav-link');
        });

        nav.appendChild(navs);
        body.appendChild(nav);
        this.elem = nav;
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
    constructor(content = [], selector = '.wrapper') {
        this.elem = document.querySelector(selector);

        if (!this.elem) {
            const wrp = doc.createElement('main');
            wrp.classList.add('wrapper');
            body.appendChild(wrp);
            this.elem = wrp;
        }
        this.add(content);
    }

    add(content) {
        (Array.isArray(content) ? content : [content]).forEach(i => {
            if (i instanceof HTMLElement) {
                this.elem.appendChild(i);
            } else if (i && i.elem instanceof HTMLElement) {
                this.elem.appendChild(i.elem);
            }
        });
    }
}


for (const c of [Btn, Link, Switch, Input]) {
    c.prototype.on = function(e, call) {
        this.elem.addEventListener(e, call);
    };
    c.prototype.click = function() {
        this.elem.click();
    }
    c.prototype.setText = function(text) {
        this.elem.textContent = text;
    }

    c.prototype.setStyle = function(stylesheet) {
        this.elem.style = stylesheet;
    }

    c.prototype.style = function() {
        return this.elem.style;
    }
}