const dom = document;

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

const page = {
    get path() {
        return window.location.pathname;
    },

    reload: () => window.location.reload(),
    template: null,
    popstate: () => {},

    go(path) {
        if (path !== window.location.pathname) {
            history.pushState({ path }, '', path);
            if (page.popstate) page.popstate(path);
        }
    },

    style(src) {
        if ($(`link[href="${src}"]`)) return;

        const link = elem("link", {
            rel: "stylesheet",
            href: src
        });

        dom.head.append(link);
    }
};

let activeEffect = null;
const componentNodes = new Map();
let componentNodeId = 0;

function useEffect(fn) {
    let cleanup;
    function run() {
        activeEffect = run;
        try {
            if (cleanup) cleanup();
            cleanup = fn() || null;
        } finally {
            activeEffect = null;
        }
    }

    run();

    return run;
}

function hydrate(root) {
    root.querySelectorAll?.('[data-ently-node]').forEach(placeholder => {
        const id = placeholder.getAttribute('data-ently-node');
        const node = componentNodes.get(id);
        if (!node) return;
        componentNodes.delete(id);
        placeholder.replaceWith(node);
    });
}

function useState(value) {
    let current = value;
    const effects = new Set();

    const get = () => {
        if (activeEffect) {
            effects.add(activeEffect);
        }

        return current;
    };

    const set = value => {
        current = typeof value === 'function' ? value(current) : value;

        effects.forEach(effect => effect());
    };

    return [get, set];
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
            if (res instanceof Node) {
                const id = String(++componentNodeId);
                componentNodes.set(id, res);
                return `<span data-ently-node="${id}"></span>`;
            }
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
    let el, html, source;

    if (tag.trim().startsWith('<')) {
        source = tag;
        html = render(tag);
        const tp = document.createElement('template');
        tp.innerHTML = html;
        hydrate(tp.content);
        el = tp.content.firstElementChild;
    } else {
        el = document.createElement(tag);
        html = `<${tag}></${tag}>`;
        source = html;
    }

    if (attrs) {
        for (const [key, value] of Object.entries(attrs)) {
            if (key === 'style' && typeof value === 'object') Object.assign(el.style, value);
            else if (key === 'parent') value.appendChild(el);
            else if (key === 'text') el.textContent = value;
            else if (key === 'children' && Array.isArray(value))
                value.forEach(child => child && el.append(child));
            else if (key === 'inner') el.innerHTML = render(value);
            else el.setAttribute(key, value);
        }
    }
    
    el.str = () => source;

    return el;
}

Element.prototype.on = function(events, callback, options) {
    events.split(' ').forEach(event => {
        this.addEventListener(event, e => {
            const close = sel => e.target.closest(sel);

            callback(close, e);
        }, options);
    });

    return this;
};

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
    page,
    useState,
    useEffect,

    themes: {
        colors: {
            red: '#ffddddff',
            green: '#d0ffc8ff',
            blue: '#ddeaffff',
            purple: '#eaddffff',
            black: '#000000',
            white: '#f7f7ffff',
            yellow: '#fff7ddff',
            orange: '#ffe7ddff'
        },

        add(theme) {
            if (theme.includes(".css")) {

            } else {
                dom.body.prepend(elem('style', { inner: theme }));
            }
        }
    },

    template(content = '', tag = 'main') {
        const source = content?.str ? content.str() : content;
        if (typeof source !== 'string') {
            throw new TypeError(
                'template(content) expects an HTML string or an element created by elem()',
            );
        }

        const parsed = elem('template');
        parsed.innerHTML = render(source);
        hydrate(parsed.content);

        if ($(parsed.content, '[root]')) return parsed.content.firstElementChild;

        const outlet = elem(tag);
        outlet.setAttribute('root', '');

        outlet.innerHTML = parsed.innerHTML;
        hydrate(outlet);
        return outlet;
    },

    router(routes = {}) {
        if (!routes || typeof routes !== 'object' || Array.isArray(routes)) {
            throw new TypeError('router(routes) expects an object of path-to-view entries');
        }

        const renderRoute = path => {
            const key = path === '/' ? '/' : path.replace(/^\/+|\/+$/g, '');
            const view = routes[path] ?? routes[key] ?? routes[`/${key}`] ?? routes['*'];
            if (view === undefined) return;
            const output = typeof view === 'function' ? view(path) : view;
            if (output == null) return;

            const root = page.root || document.querySelector('[root]');
            if (!root) return;
            if (output instanceof Node) root.replaceChildren(output);
            else root.innerHTML = render(String(output));
            hydrate(root);
        };

        renderRoute.go = path => page.go(path);
        renderRoute.routes = routes;
        return renderRoute;
    },

    app({ content, router, title, icon, rootTag }) {
        if (title) dom.title = title;
        if (icon) dom.head.appendChild(elem(`<link rel="icon" href="${icon}">`))

        const source = content?.str ? content.str() : content;

        if (typeof source !== 'string')
            throw new TypeError('app({ content }) expects HTML or an elem() result');

        const result = template(source, rootTag || 'main');
        const root = result.matches('[root]') ? result : result.querySelector('[root]');

        if (!root) throw new Error('app could not create a [root] outlet');
        page.root = root;
        root.removeAttribute('root');

        if (typeof router === 'function') {
            page.popstate = router;
            router(page.path);
        }

        result.on('click', event => {
            if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            const link = event.target.closest?.('a[href]');
            if (!link || link.target || link.hasAttribute('download')) return;

            const url = new URL(link.href, window.location.href);
            if (url.origin !== window.location.origin || !router) return;

            event.preventDefault();
            page.go(url.pathname);
        });

        dom.body.appendChild(result);

        result.setTheme = (css = 'ently/css/style.css') => {
            page.style(css);
        }

        return result;
    },

    template,
};

if (ently.translation) setTranslation(ently.translation);

page.popstate(page.path);

window.addEventListener('popstate', e => {
    const path = e.state?.path || window.location.pathname;
    page.popstate(path);
});

globalThis.page = page;