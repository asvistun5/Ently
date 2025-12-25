let state = [];
let cursor = 0;
let rerender = () => {};
let navigate = () => {};


function $(selector) {
    return document.querySelector(selector);
}

function $a(selector) {
    return document.querySelectorAll(selector);
}

function elem(tag, attrs = {}) {
    const el = document.createElement(tag);

    for (const [key, value] of Object.entries(attrs)) {
        if (key === "style" && typeof value === "object") Object.assign(el.style, value);
        else if (key.startsWith("on") && typeof value === "function") el.addEventListener(key.slice(2).toLowerCase(), value);
        else if (key === "text") el.textContent = value;
        else el.setAttribute(key, value);
    }

    return el;
}

function style(src) {
    if (document.querySelector(`link[href="${src}"]`)) return;

    const link = elem("link", {
        rel: "stylesheet",
        href: src
    });

    document.head.append(link);
}

function get(url, headers = {}) {
    return fetch(url, {
        method: "GET",
        headers
    }).then(res => {
        if (!res.ok) throw new Error(res.status);
        return res.json();
    });
}

function post(url, data, headers = {}) {
    return fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...headers
        },
        body: JSON.stringify(data)
    }).then(res => {
        if (!res.ok) throw new Error(res.status);
        return res.json();
    });
}

function root(selector) {
    const el =
        !selector
            ? document.body
            : typeof selector === "string"
                ? $(selector) || document.body
                : selector || document.body;

    let currentView = () => "";

    function render(view) {
        currentView = view;
        el.innerHTML = view();
    }

    render.currentView = () => currentView();

    return render;
}

function router(routes, render) {
    function update() {
        const view = routes[location.pathname] || routes["*"];
        render(view);
    }

    function go(path, replace = false) {
        if (replace) {
            history.replaceState({}, "", path);
        } else {
            history.pushState({}, "", path);
        }
        update();
    }

    navigate = go;
    window.addEventListener("popstate", update);

    document.addEventListener("click", e => {
        const link = e.target.closest("a");
        if (!link) return;
        if (link.hasAttribute("data-ext")) return;

        const href = link.getAttribute("href");
        if (href && href.startsWith("/") && !href.startsWith("//")) {
            e.preventDefault();
            go(href);
        }
    });

    update();

    return { go };
}

function useState(initialValue) {
    const idx = cursor;
    if (state[idx] === undefined) state[idx] = initialValue;

    const setState = value => {
        state[idx] = typeof value === "function" ? value(state[idx]) : value;
        if (typeof rerender === "function") {
            cursor = 0;
            rerender();
        }
    };

    cursor++;
    return [state[idx], setState];
}

function useEffect(callback, deps) {
    const idx = cursor;
    const hasNoDeps = !deps;
    const oldDeps = state[idx];
    let hasChanged = true;
    if (oldDeps) {
        hasChanged = deps.some((dep, i) => !Object.is(dep, oldDeps[i]));
    }
    if (hasNoDeps || hasChanged) {
        callback();
        state[idx] = deps;
    }
    cursor++;
}

function useNavigate() {
    return (path, options = {}) => {
        navigate(path, options.replace);
    };
}

function renderApp(app) {
    cursor = 0;
    rerender = () => renderApp(app);
    const viewFunc = app.render.currentView();
    app.render(typeof viewFunc === "function" ? viewFunc() : viewFunc);
}