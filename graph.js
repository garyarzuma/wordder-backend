const Vertex = require('./vertex')

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
}

module.exports = {Graph}

