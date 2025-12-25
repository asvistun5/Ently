function setIcon(src) {
    if (document.querySelector(`link[href="${src}"]`)) return;

    const link = elem("link", {
        rel: "shortcut icon",
        href: src,
        type: "image/x-icon"
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