function setIcon(src) {
    if (document.querySelector(`link[href="${src}"]`)) return;

    const link = elem("link", {
        rel: "shortcut icon",
        href: src,
        type: "image/x-icon"
    });

    document.head.append(link);
}

function style(src) {
    if (document.querySelector(`link[href="${src}"]`)) return;

    const link = elem("link", {
        rel: "stylesheet",
        href: src
    });

    document.head.append(link);
}


function app(icon, title, routes, opts = {}) {
    if (icon) setIcon(icon);
    if (title) document.title = title;

    const mount = opts.mount || "#app";
    const render = root(mount);

    const instance = {
        render,
        start() {
            router(routes, view => {
                render(() => {
                    cursor = 0;
                    return view();
                });
            });
        }
    };

    instance.start();
    return instance;
}

function setTranslation(transObj, useNavigator = true) {
    let lang;

    if (useNavigator) {
        lang = navigator.language || navigator.userLanguage;
    }

    if (!lang) {
        lang = document.documentElement.lang || "en";
    }

    lang = lang.toLowerCase().split("-")[0];

    if (!transObj[lang]) {
        lang = Object.keys(transObj)[0];
    }

    document.documentElement.lang = lang;

    const translation = transObj[lang];

    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (translation[key] !== undefined) {
            el.textContent = translation[key];
        }
    });

    return translation;
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