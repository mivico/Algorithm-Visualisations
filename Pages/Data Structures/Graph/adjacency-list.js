class EdgeList {
    constructor(vertex) {
        this.vertex = vertex;
        this.edges = null;

        this.addEdge = (edge) => {
            var found = false;
            for (let i = 0; i < this.edges.length; i++) {
                const temp = this.edges[i];
                if (temp.from.index === edge.from.index && temp.to.index === edge.to.index) {
                    found = true;
                    break;
                }
            }
            if(!found) {
                this.edges.push(edge);
            }
        }
    }
}

class AdjacencyList {
    constructor() {
        //This is an array of edgelists ^^^
        this.adjacencyList = [];
        this.vertices = [];
        this.triangles = [];

        this.edges = () => {
            var allEdges = [];
            for (let i = 0; i < this.adjacencyList.length; i++) {
                if (this.adjacencyList[i].edges != null) {
                    continue;
                }
                let edges = this.adjacencyList[i].edges;
                allEdges.push(edges);
            }
            return allEdges;
        }

        this.addEdge = (edge) => {
            this.edges.push(edge);
        }

        this.init = () => {
            //Vertices
            for (let i = 0; i < this.adjacencyList.length; i++) {
                this.vertices.push(this.adjacencyList[i].vertex);
            }

        }

        this.addTriangle = (triangle) => {
            this.triangles.push(triangle);
        }

        this.findMatchingVertices = (object) => {
            var result = [];
            for (let i = 0; i < this.vertices.length; i++) {
                if(this.vertices[i].object === object) {
                    result.push(object);
                }
            }
            return result;
        }

        this.createVertex = (node) => {
            // check if the vertex already exists
            let matchingVertices = this.findMatchingVertices(node);
        
            if (matchingVertices.length > 0) {
              return matchingVertices[matchingVertices.length - 1];
            }
        
            // if the vertex doesn't exist, create a new one
            let vertex = new Vertex(node, this.adjacencyList.length);
            this.adjacencyList.push(new EdgeList(vertex));
            return vertex;
          }

        this.addDirectedEdge = (from, to, weight, lineObject) => {
            let edge = new Edge(from, to, weight, lineObject);
            let edgeList = this.adjacencyList[from.index];
            if (edgeList.edges != null) {
                if(!edgeList.edges.includes(edge)) {
                    edgeList.addEdge(edge);
                }
            } else {
                edgeList.edges = [edge]
            }
        }

        this.addUndirectedEdge = (from, to, weight, lineObject) => {
            this.addDirectedEdge(from, to, weight, lineObject);
            const tempLine = new Line(lineObject.node2, lineObject.node1, 1)
            this.addDirectedEdge(to, from, weight, tempLine);
        }

        this.weightFrom = (sourceVertex, destinationVertex) => {
            if(this.adjacencyList[sourceVertex.index].edges === null) {
                return null;
            }
            
            let edges = this.adjacencyList[sourceVertex.index].edges;

            for (let i = 0; i < edges.length; i++) {
                if (edges[i].to === destinationVertex) {
                return edges[i].weight
                }
            }
        
            return nil
        }

        this.edgesFrom = (sourceVertex) => {
            if (this.adjacencyList[sourceVertex.index].edges === null) {
                return [];
            } else {
                return this.adjacencyList[sourceVertex.index].edges;
            }
          }

        this.init()
    }
}