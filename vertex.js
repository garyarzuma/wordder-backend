const Vertex = (key) => {
    let id = key
    let connectedTo = {}

    const addNeighbor = (nbr, weight = 0) => {
        connectedTo[nbr] = weight
    }

    const display = () => {
        return (id + ' connectedTo' + [...connectedTo])
    }

    const getConnections = () => {
        return connectedTo.keys()
    }

    const getId = () => {
        return id
    }

    const getWeight = (nbr) => {
        return connectedTo[nbr]
    }
}
 
module.exports = {Vertex}
