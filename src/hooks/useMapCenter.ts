import { CHUNK_HEIGHT, CHUNK_WIDTH } from './useQueryPolygons'

import { Coordinates } from '../components/Map'
import L from 'leaflet'

type State<T> = [T, (value: T) => void]
type ListenToMovements = (map: L.Map, coordinates: State<Coordinates>) => void

/**
 * Listen for map movements and if it goes beyond the "viewport" change the
 * coordinates.
 * 
 * @returns 
 */
const useMapCenter = (): ListenToMovements  => {
  return (map: L.Map, coordinates: State<Coordinates>) => {
    const [values, setCoordinates] = coordinates
    const [oldX, oldY] = values

    
  }
}

export default useMapCenter