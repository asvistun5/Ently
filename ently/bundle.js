const dom = document;
let tmp;

const page = {
    path: window.location.pathname,
    reload: () => window.location.reload(),
    template: null,
    popstate: () => {},
    go: path => {
        if (path !== page.path) {
            history.pushState({ path }, '', path);
            page.path = path;
            if (page.popstate) page.popstate(path);
        }
    },
};

const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

function template(target) {
    page.template = target;
}

function render(html) {
    const voidTags = [
        'area',
        'base',
        'br',
        'col',
        'embed',
        'hr',
        'img',
        'input',
        'link',
        'meta',
        'param',
        'source',
        'track',
        'wbr',
    ];

    return html
        .replace(/<!--[\s\S]*?-->/g, '')

        .replace(/<([A-Z][\w]*)\s*\/>/g, (m, name) => {
            const comp = globalThis[name];

            if (typeof comp === 'function') {
                const res = comp();

                if (typeof res === 'string') return res;
                if (res?.str) return res.str();
            }

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

function elem(tag) {
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
