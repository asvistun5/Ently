const rootApp = root();
style('ently/css/style.css')

const Base = page => {
  const comp = page();

  rootApp(() =>     `
        <nav>
            <a href="/">Home</a> |
            <a href="/about">About</a>
        </nav>
        <hr>
        <main>
            <div>Hello Ently!</div>
            <content>
                ${comp.src}
            </content>
        </main>
    `);

    if (comp.effect) setTimeout(() => comp.effect(), 0);
}

const Home = () => ({
  src: `
    <h1>Home</h1>
    <button id="inc">+1</button>
    <a href="/about">About</a>
  `,
  effect: () => {
    const [count, setCount] = useState(0);

    const btn = document.getElementById("inc");
    if (btn) {
      btn.onclick = () => {
        setCount(c => c + 1);
        console.log("Count:", count + 1);
      };
    }
  }
});

const About = () => ({
  src: `
    <h1>About</h1>
    <a href="/">Home</a>
  `,
  effect: () => {
    console.log("About mounted");
  }
});


const routerApp = router(
  {
    "/": () => Base(Home),
    "/about": () => Base(About),
    "*": () => "<h1>404</h1>"
  },
  rootApp
);