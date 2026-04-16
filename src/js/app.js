const app = elem(`
    <div id="app">
        <Nav />
        <main>
            <Header />
            <Products />
            <About />
        </main>
        <Footer />
    </div>
`);


dom.body.appendChild(app);