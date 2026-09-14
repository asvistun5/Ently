const dom = document;
let tmp;

const page = {
    path: window.location.pathname,
    reload: () => window.location.reload(),
    template: null,
    popstate: () => {},

    go(path) {
        if (path !== page.path) {
            history.pushState({ path }, '', path);
            page.path = path;
            if (page.popstate) page.popstate(path);
        }
    },
};

function $(context, selector) {
    if (typeof context === 'string') {
        return document.querySelector(context);
    }

    return context.querySelector(selector);
}

function $a(context, selector) {
    if (typeof context === 'string') {
        return document.querySelectorAll(context);
    }

    return context.querySelectorAll(selector);
}

function template(target) {
    page.template = target;
}

function render(html) {
    const voidTags = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

    return html
        .replace(/<!--[\s\S]*?-->/g, '')

        .replace(/<([A-Z][\w]*)([^>]*)\/>/g, (m, name, attrsStr) => {
            const comp = globalThis[name];
        
            if (typeof comp !== 'function') return '';
        
            const props = {};
        
            attrsStr.replace(/(\w+)="([^"]*)"/g, (_, key, value) => {
                props[key] = value;
            });
        
            const res = comp(props);
        
            if (typeof res === 'string') return res;
            if (res?.str) return res.str();
        
            return '';
        })

        .replace(/<([a-zA-Z][\w-]*)([^>]*)\/>/g, (m, tag, attrs) => {
            tag = tag.toLowerCase();
            if (voidTags.includes(tag)) {
                return `<${tag}${attrs}>`;
            }
            return `<${tag}${attrs}></${tag}>`;
        })

        .replace(/\n+/g, '')
        .replace(/>\s+</g, '><')
        .replace(/\s{2,}/g, ' ')
        .trim();
}

function elem(tag, attrs = {}) {
    let el, html;

    if (tag.trim().startsWith('<')) {
        html = render(tag);
        const tp = document.createElement('template');
        tp.innerHTML = html;
        el = tp.content.firstElementChild;
    } else {
        el = document.createElement(tag);
        html = `<${tag}></${tag}>`;
    }

    if (attrs) {
        for (const [key, value] of Object.entries(attrs)) {
            if (key === "style" && typeof value === "object") Object.assign(el.style, value);
            else if (key === "parent") value.appendChild(el);
            else if (key === "text") el.textContent = value;
            else if (key === "children" && Array.isArray(value)) value.forEach(child => child && el.append(child)); 
            else if (key === "inner") el.innerHTML = render(value);
            else el.setAttribute(key, value);
        }
    }

    el.str = () => html;

    return el;
}

function setTranslation(transObj, useNavigator = true) {
    let lang;

    if (useNavigator) {
        lang = navigator.language || navigator.userLanguage;
    }

    if (!lang) {
        lang = document.documentElement.lang || 'en';
    }

    lang = lang.toLowerCase().split('-')[0];

    if (!transObj[lang]) {
        lang = Object.keys(transObj)[0];
    }

    document.documentElement.lang = lang;

    const dict = transObj[lang];

    function translateNode(node) {
        if (node.nodeType === 3) {
            const text = node.nodeValue.trim();
            if (dict[text] !== undefined) {
                node.nodeValue = dict[text];
            }
            return;
        }

        if (node.nodeType === 1) {
            if (dict[node.textContent?.trim()] !== undefined) {
                node.textContent = dict[node.textContent.trim()];
            }

            node.childNodes.forEach(translateNode);
        }
    }

    translateNode(document.body);

    new MutationObserver(m => {
        m.forEach(r => {
            r.addedNodes.forEach(translateNode);
        });
    }).observe(document.body, {
        childList: true,
        subtree: true,
    });

    return dict;
}

const ently = {
    translation: null,
};

if (ently.translation) setTranslation(ently.translation);

page.popstate(page.path);

window.addEventListener('popstate', e => {
    const path = e.state?.path || window.location.pathname;
    page.path = path;

    page.popstate(path);
});