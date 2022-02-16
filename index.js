const wordList = require("./word.js");

//const Graph = require('./graph');
const Vertex = (key) => {
    let id = key
    let connectedTo = new Map()
    let color = 'white'
    let distance = 0
    let predecessor = null

    const addNeighbor = (nbr, weight = 0) => {
        connectedTo.set(nbr, weight)
    }

    const display = () => {
        for (key in connectedTo) {
            console.log(key, connectedTo[key].getId)
        }
        
    }

    const getConnections = () => {
        return connectedTo
    }

    const getId = () => {
        return id
    }

    const getWeight = (nbr) => {
        return connectedTo.get(nbr)
    }

    const setColor = (newColor) => {
        color = newColor
    }

    const getColor = () => {
        return color
    }

    const setDistance = (dist) => {
        distance = dist
    }

    const getDistance = () => {
        return distance
    }

    const setPred = (vertex) => {
        predecessor = vertex
    }

    const getPred = () => {
        return predecessor
    }

    return {addNeighbor, display, getConnections, getId, getWeight, setColor, getColor, setDistance, getDistance, setPred, getPred}
}

const Graph = () => {
    let vertList = {}
    let numVertices = 0

    const addVertex = (key) => {
        numVertices = numVertices + 1
        const newVertex = Vertex(key)
        vertList[key] = newVertex
        return newVertex
    }

    const getVertex = (n) => {
        if (n in vertList) {
            return vertList[n]
        }
        else return null
    }

    const addEdge = ( f ,t,weight=0) => {
        if (!(f in vertList)) {
            const nv = addVertex(f)
        }
        if(!(t in vertList)) {
            const nnv = addVertex(t)
        }
        vertList[f].addNeighbor(vertList[t], weight)
    }

    const getVertices = () => {
        return Object.keys(vertList)
    }

    const getVertList = () => {
        return vertList
    }

    return {addVertex,getVertex, addEdge, getVertices, getVertList}
}

(() => {
    const buildGraph = () => {
        const g = Graph()
        d = {}
        wordList.forEach( word => {
            const len = word.length
            let i = 0
            while( i < len){
                const bucket = word.substring(0,i) + '_' + word.substring(i+1)
                if (bucket in d) {
                    d[bucket].push(word)
                } 
                else d[bucket] = [word]
                i++
            }
        })
        let count = 0
        for (bucket in d){
            d[bucket].forEach(word1 => {
                d[bucket].forEach( word2 => {
                    if (word1 != word2){
                        g.addEdge(word1,word2)
                        count++
                    }
                })
            })
        }
        const vertList = g.getVertList()
        for( v in vertList) {
            const vertex = vertList[v]
            const connectionsObject = vertex.getConnections()
            for (x of connectionsObject){
                //console.log("( ",v," , ", x[0].getId()," )")
            }
        }
        //console.log(count)
        return g
    }

    let myGraph = buildGraph()

    const binaryFirstSearch = (graph, start) => {
        start.setDistance(0)
        start.setPred(null)
        const vertQueue = []
        vertQueue.push(start)
        while (vertQueue.length > 0){
            let currentVert = vertQueue.shift() //pops out first item and returns it
            const currentObj = currentVert.getConnections()
            for (nbr of currentObj){
                 if(nbr[0].getColor() === 'white'){
                    nbr[0].setColor('gray')
                    nbr[0].setDistance(currentVert.getDistance() + 1)
                    nbr[0].setPred(currentVert)
                    vertQueue.push(nbr[0]) 
                } 
            currentVert.setColor('black')     
            } 
        }
    }

    //need to find the vertex in myGraph for 'fool' and put into startingVertex
    const getStartingVertex = (word, graph) => {
        const verts = graph.getVertList()
        for(v in verts){
            if(verts[v].getId() === word){
                return verts[v]
            }
        }
    }

    const traverseGraph = (y) => {
        let x = y 
        while (x.getPred() !== null ){
            console.log(x.getId(),x.getDistance())
            x = x.getPred()
        }
        console.log(x.getId(),x.getDistance())
        return y.getDistance()
    }

    const startingVertex = getStartingVertex('head',myGraph)
    binaryFirstSearch(myGraph, startingVertex) 
    console.log(traverseGraph(myGraph.getVertex('tail')))
})()


 
