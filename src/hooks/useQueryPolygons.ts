import { VoronoiPolygon } from 'd3-voronoi'
import { getSeededRandom } from '@visx/mock-data'
import { useMemo } from 'react'
import { voronoi } from '@visx/voronoi'

type Datum = {
  x: number
  y: number
  id: string
}
  
const seededRandom = getSeededRandom(0.88)

export const useQueryPolygons = (): Array<VoronoiPolygon<Datum>> => {
  const data: Datum[] = new Array(100).fill(null).map(() => ({
    x: seededRandom(),
    y: seededRandom(),
    id: Math.random().toString(36).slice(2),
  }))

  const voronoiLayout = useMemo(
    () =>
      voronoi<Datum>({
        x: (d) => d.x * innerWidth,
        y: (d) => d.y * innerHeight,
        width: innerWidth,
        height: innerHeight,
      })(data),
    [innerWidth, innerHeight],
  )
    
  return voronoiLayout.polygons()
}