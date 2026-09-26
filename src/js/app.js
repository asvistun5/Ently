const content = elem(`
    <div id="app">
        <Nav />
        <main root>
            <Header />
            <Products />
            <About />
        </main>
        <Footer />
    </div>
`);

const app = ently.app({
    content,
    router, 
    title: "Ently",
    icon: "static/img/icon.svg"
});

app.setTheme();