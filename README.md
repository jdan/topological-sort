## topological-sort

An implementation of [Kahn's Algorithm](https://en.wikipedia.org/wiki/Topological_sorting#Kahn's_algorithm), [written for my post](https://cards.jordanscales.com/toposort) on using topological sort to generate z-index values.

### example

```js
const resolver = new ZIndexResolver();

// A nav with dropdowns
resolver.above(".nav", "main");
resolver.above(".dropdown", ".nav");
resolver.above(".submenu", ".dropdown");

// Tooltips in the document
resolver.above(".tooltip", "main");

// Modals should go above everything
resolver.above(".modal", ".nav");
resolver.above(".modal", ".submenu");
resolver.above(".modal", ".tooltip");

// Dropdowns must appear above tooltips
resolver.above(".dropdown", ".tooltip");

console.log(resolver.generateCSS());
```

Producing the following output:

```css
main { z-index: 0; }
.nav { z-index: 1; }
.tooltip { z-index: 2; }
.dropdown { z-index: 3; }
.submenu { z-index: 4; }
.modal { z-index: 5; }
```

### license

MIT
