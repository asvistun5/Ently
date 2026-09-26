const router = ently.router({
    "/": "<Header /><Products /><Counter />",
    "about": "<About />",
    "*": path => `<h1>Oops! ${path} not found</h1>`
});
