import { CHUNK_HEIGHT, CHUNK_WIDTH } from './useQueryPolygons'

import { Coordinates } from '../components/Map'
import L from 'leaflet'
import { useState } from 'react'

interface MapCenter {
  listenToMovements: (map: L.Map) => void
  coordinates: Coordinates
}

/**
 * Listen for map movements and if it goes beyond the "viewport" change the
 * coordinates.
 * 
 * @returns 
 */
const useMapCenter = (): MapCenter => {
  const [ coordinates, setCoordinates ] = useState<Coordinates>([1, 0])

  return {
    listenToMovements: (map: L.Map) => {
      let previous: Coordinates

      map.on('movestart', () => {
        const center = map.getCenter()
        previous = [center.lat, center.lng]
      })
    
      map.on('moveend', () => {
        if (!previous) return
    
        const { lat: newY, lng: newX } = map.getCenter()
    
        if (Math.abs(newY - previous[0]) > 3/4 * CHUNK_HEIGHT || Math.abs(newX - previous[1]) > 3/4 * CHUNK_WIDTH) {
          setCoordinates([newX, newY])
        }
      })
    },
    coordinates
  }
}

export default useMapCenter