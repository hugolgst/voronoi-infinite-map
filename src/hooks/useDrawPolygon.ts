import L, { Layer } from 'leaflet'

type Path = Array<[number, number]>

/**
 * Setup the events to change the colour of the polygon on hover
 * 
 * @param polygon Leaflet polygon
 * @param color Default color
 * @param hoverColor Color displayed when hovered
 */
const hoverSelection = (polygon: L.Polygon, color: string, hoverColor: string) => {
  polygon.on('mouseover', () => {
    polygon.setStyle({ 'fillColor': hoverColor })
  })
  polygon.on('mouseout', () => {
    polygon.setStyle({ 'fillColor': color })
  })
}

/**
 * Adapts the width of the stroke of the given polygon to avoid having
 * enormous stokes when unzomming
 * 
 * @param polygon Leaflet polygon
 */
const strokeWidth = (map: L.Map, polygon: L.Polygon) => {
  map.on('zoom', () => {
    const zoom = map.getZoom()

    polygon.setStyle({
      // Base weight: 1. A positive zoom n should make it n times bigger: n.
      // A negative zoom should make it n times smaller: 1/n 
      'weight': Math.abs(zoom) / 3
    })
  })
}

/**
 * Hook used to draw polygons in the used map
 * 
 * @returns The draw function
 */
export const useDrawPolygon = (): ((map: L.Map, canvas: L.Canvas, color: string, path: Path) => Layer) => {
  return (map: L.Map, canvas: L.Canvas, color: string, path: Path): Layer => {
    const polygon = L.polygon(path, {
      color,
      'fillColor': 'gray',
      renderer: canvas
    })

    hoverSelection(polygon, color, 'red')
    strokeWidth(map, polygon)

    return polygon
  }
}