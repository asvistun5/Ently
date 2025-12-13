<img src="static/img/icon.svg">

# Ently

Lightweight **JS library** for building simple web applications
Ently (from "ant" – small but powerful) is a **mini JS library** designed to help you **quickly create web apps**

<details>
   <summary>Installation</summary>
   
You have 2 ways to connect Ently into your app:

**Include it directly in your HTML via CDN:**

```html
<script src="https://cdn.jsdelivr.net/gh/asvistun5/Ently@main/ently/main.js"></script>
```

**OR download [Ently's main.js](ently/main.js) file yourself**

</details>

<details>
   <summary>Basic</summary>

**$**

Select a DOM element using a CSS selector.

```js
const getElem = $("#elem")
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
   working...
</details>

More info about functions and methods you can also [view in demo.js file.](demo.js)

### License

Ently is [GNU v3.0 (GPL-3.0) licensed](./LICENSE).