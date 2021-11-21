import { CHUNK_HEIGHT, CHUNK_WIDTH } from './useQueryPolygons'

import { Coordinates } from '../components/Map'
import L from 'leaflet'
import { useState } from 'react'

interface MapCenter {
  listenToMovements: (map: L.Map) => void
  x: number
  y: number
}

/**
 * Listen for map movements and if it goes beyond the "viewport" change the
 * coordinates.
 * 
 * @returns 
 */
const useMapCenter = (): MapCenter => {
  const [coordinates, setCoordinates] = useState<Coordinates>([0, 0])

  return {
    listenToMovements: (map: L.Map) => {
      map.on('movestart', () => {
        const { lat: y, lng: x } = map.getCenter()

        map.on('moveend', () => {
          const { lat: newY, lng: newX } = map.getCenter()

          if (Math.abs(newY - y) > 3/4 * CHUNK_HEIGHT || Math.abs(newX - x) > 3/4 * CHUNK_WIDTH) {
            setCoordinates([newX, newY])
          }
        })
      })
    },
    x: coordinates[0],
    y: coordinates[1]
  }
}

export default useMapCenter