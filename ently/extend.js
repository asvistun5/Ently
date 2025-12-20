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