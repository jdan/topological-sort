// A directed acyclic graph with a list of nodes
// and a mapping of connections between nodes
const dag = {
  nodes: new Set([5, 7, 3, 11, 8, 2, 9, 10]),
  adjacency: {
    5: new Set([11]),
    7: new Set([11, 8]),
    3: new Set([8, 10]),
    11: new Set([2, 9, 10]),
    8: new Set([9]),
    2: new Set([9]),
  },
};

// https://en.wikipedia.org/wiki/Topological_sorting#Kahn's_algorithm
function toposort({ nodes, adjacency }) {
  const res = [];

  // Build a set of nodes with no incoming edge
  const noIncomingEdge = [];
  nodes.forEach((node) => {
    if (
      !Object.values(adjacency).some((incoming) =>
        incoming.has(node)
      )
    ) {
      noIncomingEdge.push(node);
    }
  });

  while (noIncomingEdge.length > 0) {
    const node = noIncomingEdge.pop();
    res.push(node);

    // Loop through all the nodes from `node`
    (adjacency[node] || []).forEach((target) => {
      // What other nodes point to this?
      const otherIncomingNodes = Object.keys(
        adjacency
      ).filter(
        (parent) =>
          // Stringly-typed :(
          parent != node &&
          adjacency[parent].has(target)
      );

      // If none: queue target up for processing
      if (otherIncomingNodes.length === 0) {
        noIncomingEdge.push(target);
      }
    });

    // Remove all of the edges coming out
    // of `node`
    delete adjacency[node];
  }

  if (Object.keys(adjacency).length > 0) {
    throw new Error("Loop detected");
  }

  return res;
}

// console.log(toposort(dag));

class ZIndexResolver {
  constructor() {
    this.dag = {
      nodes: new Set([]),
      adjacency: {},
    };
  }

  above(a, b) {
    this.dag.nodes.add(a);
    this.dag.nodes.add(b);
    this.dag.adjacency[a] ||= new Set([]);
    this.dag.adjacency[a].add(b);
  }

  resolve() {
    return toposort(this.dag);
  }

  generateCSS() {
    return this.resolve()
      .reverse()
      .map(
        (sel, idx) =>
          `${sel} { z-index: ${idx}; }`
      )
      .join("\n");
  }
}

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
