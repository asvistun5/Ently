const year = new Date().getFullYear();

function Nav() {
    return elem(`
        <nav>
            <div class="logo" />
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/contact">Contacts</a>
            <a href="/blog">News</a>
            <button class="try-btn">Try for free</button>
        </nav>
    `)
}

function Header() {
    return elem(`
        <header>
            <h1>AI and Software Solutions that Empower Businesses</h1>
            <p>We create software which is easy to use, efficient, and helps our clients & businesses achieve their goals.</p>
            <marquee class="sponsors" behavior="scroll" direction="left" scrollamount="5">
                <img src="logo1.png" alt="Sponsor 1">
                <img src="logo2.png" alt="Sponsor 2">
                <img src="logo3.png" alt="Sponsor 3">
            </marquee>
        </header>
    `)
}

function Products() {
    return elem(`
        <h2>Our Products</h2>
        <section class="products">
        </section>
    `)
}

function About() {
    return elem(`
        <h2>About Us</h2>
        <p>Our mission is to create comfortable software designed for everyone. Our solutions combine cutting-edge artificial intelligence with intuitive user experiences, making technology accessible and enjoyable for all.</p>
    `)
}

function Footer() {
    return elem(`
        <footer>
            <div class="column">
                <p class="copyright">&copy; ${year} AI Group. All rights reserved.</p>
                <div class="socials">
                    <a href="https://twitter.com/" target="_blank">Twitter</a>
                    <a href="https://youtube.com/" target="_blank">Youtube</a>
                </div>
            </div>
        </footer>
    `)
}