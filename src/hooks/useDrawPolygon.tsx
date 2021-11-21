import L from 'leaflet'
import { useMap } from 'react-leaflet'

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

export const useDrawPolygon = (): ((color: string, path: Path) => void) => {
  const map = useMap()
  const canvas = L.canvas({}).addTo(map)

  return (color: string, path: Path) => {
    const poly = L.polygon(path, {
      color, 
      'fillColor': 'gray',
      renderer: canvas
    })
    
    hoverSelection(poly, color, 'red')

    // Updates size of the stroke's width
    // map.on('zoom', () => {
    //   poly.setStyle({
    //     'weight': Math.abs(map.getZoom())+1
    //   })
    // })
    
    poly.addTo(map)
  }
}