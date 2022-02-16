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
        console.log(myGraph.getVertex('sage').getDistance())
    }
    //need to find the vertex in myGraph for 'fool' and put into startingVertex
    const verts = myGraph.getVertList()
    for(v in verts){
        if(verts[v].getId() === 'fool'){
            startingVertex = verts[v]
        }
    }

    binaryFirstSearch(myGraph, startingVertex) 
    /* const g2 = Graph()
    g2.addVertex(4)
    g2.addVertex(3)
    g2.addVertex(5)
    g2.addEdge(0,1,5)
    g2.addEdge(1,2,34)
    g2.addEdge(2,3,34)
    g2.addEdge(32,3,34)
    g2.addEdge(0,2,4)
    g2.addEdge(4,3,2)
    g2.addEdge(4,5,1)
    const vertList = g2.getVertList()
    //iterate over every edge pairing
    for( v in vertList) {
        const vertex = vertList[v]
        const connectionsObject = vertex.getConnections()
        for (x of connectionsObject){
            console.log("( ",v," , ", x[0].getId()," )")
        }
    } */
})()


 
