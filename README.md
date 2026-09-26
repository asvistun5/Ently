<div style="display: flex; align-items: center; gap: 12px; width: 100%; justify-content: center;">
    <img src="static/img/icon.svg">
    <h1>Ently</h1>
</div>

---

Mini **UI library** for building native html web applications

Ently (from "ant" – small but powerful) is a **library** designed to help you **create web apps**

<details>
   <summary>Installation</summary>
   
There's 2 ways to connect Ently into your app:

**Include it directly in your HTML via CDN:**

```html
<script src="https://cdn.jsdelivr.net/gh/asvistun5/Ently@main/ently/bundle.js"></script>
```

**OR download `ently/bundle.js` [file here](ently/bundle.js)**

</details>

</details>

<details>
   <summary>Quick Start</summary>

### `ently.app({ content, router, title, icon, rootTag })`

Initialize and start a single-page application.

```js
const content = elem(`
    <div class="app">
        <nav>
            <a href="/">Home</a>
            <a href="/about">About</a>
        </nav>

        <main root></main>

        <footer>My app</footer>
    </div>
`);

const router = ently.router({
    "/": "<h1>Home</h1>",
    "about": "<h1>About</h1>",
    "*": path => `<h1>Page not found: ${path}</h1>`
});

const app = ently.app({
    content,
    router,
    title: "My app",
    icon: "/icon.svg"
});
```

The `root` attribute marks the route outlet. Ently removes the attribute after finding the element. Navigation links with same-origin URLs are handled by the router, and browser Back/Forward navigation is supported.


</details>


<details>
   <summary>Basics</summary>

**`$()` and `$a()`**

Select a DOM element using a CSS selector.

```js
const element = $("#elem");
```

To get all elements with this selector

```js
const elements = $a(".elems");
```

**`elem(tag, attrs)`**

Create an HTML element. Supported special attributes include `text`, `inner`, `style`, `parent`, and `children`. Attach event handlers with `.on()`. Elements created by `elem()` also provide `.str()` to return their source HTML.

```js
const button = elem("button", {
    text: "Click me",
    style: { color: "white", backgroundColor: "blue" },
});

button.on("click", () => alert("Clicked!"));
```

**`element.on(events, callback, options?)`**

Register one or more space-separated DOM events. The callback receives a `closest(selector)` helper and the event object.

```js
button.on("click", (closest, event) => {
    console.log(event.type);
});
```

**`useState(initialValue)` and `useEffect(callback)`**

`useState` returns `[get, set]`; call `get()` to read the value. `useEffect` runs immediately and reruns when a state read inside it changes. It may return a cleanup function.

```js
const [count, setCount] = useState(0);
useEffect(() => updateLabel(count()));
setCount(value => value + 1);
```

**`page`**

The global `page` object is also available as `ently.page`.

```js
page.path;          // window.location.pathname
page.go("/about");
page.reload();
page.style("styles.css");
```

</details>

<details>
   <summary>Routing</summary>

**`ently.router(routes)`**

Create a client-side router. Route values can be HTML strings or functions that receive the current path and return HTML or a DOM node. Use `*` as the fallback route. Same-origin links are intercepted by `app`, and browser Back/Forward navigation is supported.

```js
const router = ently.router({
    "/": "<h1>Home</h1>",
    "about": path => `<h1>${path}</h1>`,
    "*": "<h1>404</h1>"
});

router.go("/about"); // Navigate through this router
```

`app()` installs the router and mounts the app to `document.body`. The router also exposes its route table as `router.routes`.

**`ently.template(content, tag?)`**

Create an element from an HTML string or an `elem()` result. If the content has no `[root]` outlet, one is added using `tag` (defaults to `main`).

```js
const layout = ently.template("<h1>Home</h1>");
```
</details>

<details>
   <summary>Customization</summary>

**`app.setTheme(path?)` and `ently.themes.add(theme)`**

Load a stylesheet from the app or add inline CSS text.

```js
app.setTheme("styles.css");
ently.themes.add("body { color: navy; }");
```

`ently.themes.colors` provides the built-in color values.
</details>

More info and examples you can view in `examples/` folder.

### License

Ently is [GNU v3.0 (GPL-3.0) licensed](./LICENSE).
