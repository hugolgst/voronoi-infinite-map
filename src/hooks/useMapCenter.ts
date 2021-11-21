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
  const [started, setStarted] = useState<Coordinates>()

  return {
    listenToMovements: (map: L.Map) => {
      map.on('movestart', () => {
        const { lat: y, lng: x } = map.getCenter()

        console.log(x, y)

        setStarted([ x, y ])
      })

      map.on('moveend', () => {
        if (!started) return

        const { lat: newY, lng: newX } = map.getCenter()

        console.log(newX, newY)

        if (Math.abs(newY - started[0]) > 3/4 * CHUNK_HEIGHT || Math.abs(newX - started[1]) > 3/4 * CHUNK_WIDTH) {
          setCoordinates([newX, newY])
        }
        setStarted(undefined)
      })
    },
    x: coordinates[0],
    y: coordinates[1]
  }
}

export default useMapCenter