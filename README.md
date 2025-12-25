<div style="display: flex; align-items: center; gap: 12px; width: 100%; justify-content: center;">
    <img src="static/img/icon.svg">
    <h1>Ently</h1>
</div>

---

Mini **JS library** for building powerful web applications

Ently (from "ant" – small but powerful) is a **JS library** designed to help you **quickly create web apps**

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

### `app(icon, title, routes, opts?)`

Initialize and start a single-page application.

```js
const App = app(
    "/static/img/icon.svg",
    "Demo App",
    {
        "/": () => {
            return `
                <h1>Home</h1>
            `;
        },
        "*": () => `<h1>404</h1>`
    },
    {mount: "#app"}
);
```


</details>


<details>
   <summary>Basics</summary>

**$ and $a**

Select a DOM element using a CSS selector.

```js
const getElem = $("#elem")
```

To get all elements with this selector

```js
const getElems = $a(".elems")
```

**elem(tag, attrs)**

Create a new HTML element with optional attributes, styles, text content, and event listeners.

```js
const button = elem("button", {
  text: "Click me",
  style: { color: "white", backgroundColor: "blue" },
  onclick: () => alert("Clicked!")
})
```

**style(src)**

Load a CSS file dynamically, avoiding duplicates.


```js
style("styles.css");
```

</details>

<details>
   <summary>HTTP Requests</summary>

**get(url, headers)**

Perform a simple async GET request.

```js
get("/api/data")
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

**post(url, data, headers)**

Perform a POST request with JSON data.

```js
post("/api/save", { name: "John" })
  .then(res => console.log(res))
  .catch(err => console.error(err));
```
</details>

<details>
   <summary>Customization</summary>

### `router(routes, render)`

Client-side router for single-page applications.

```js
const nav = router(routes, render)
```

useState

useEffect

renderApp

</details>

More info and examples you can view in `examples/` folder.

### License

Ently is [GNU v3.0 (GPL-3.0) licensed](./LICENSE).