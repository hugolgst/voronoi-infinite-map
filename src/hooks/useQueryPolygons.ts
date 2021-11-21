import { lcg, szudzik } from '../utils/deterministic.js'
import { useEffect, useMemo, useState } from 'react'

import { VoronoiPolygon } from 'd3-voronoi'
import { getSeededRandom } from '@visx/mock-data'
import { voronoi } from '@visx/voronoi'

type Datum = {
  x: number
  y: number
  id: string
}

const seededRandom = getSeededRandom(0.88)

export const CHUNK_WIDTH = 128
export const CHUNK_HEIGHT = 64

/**
 * Hook to obtain a function to query new polygons in the given center
 * 128x64 
 * x,y
 * y > 64-(64/4)
 * 
 * @returns The query function
 */
export const useQueryPolygons = (): (x: number, y: number) => Array<VoronoiPolygon<Datum>> => {
  return (x: number, y: number): Array<VoronoiPolygon<Datum>> => {
    const [xInt, yInt] = [Math.trunc(x), Math.trunc(y)]
    const [xShift, yShift] = [x - xInt, y - yInt]

    const data: Datum[] = new Array(CHUNK_WIDTH * CHUNK_HEIGHT)
    for (let i: number = xInt; i < xInt + CHUNK_WIDTH; i++)
      for (let j: number = xInt; j < xInt + CHUNK_WIDTH; j++) {
        const id = szudzik(i, j)
        const output = lcg(id, 2)

        const alpha = ((output % 64) * CHUNK_WIDTH) / 64
        const beta = ((lcg(output, 2) % 64) * 1) / 64
        data[i + j * CHUNK_WIDTH] = {
          x: xShift + i + alpha - 1 / 2,
          y: yShift + j + beta - 1 / 2,
          id: id.toString(),
        }
      }

    const voronoiLayout = voronoi<Datum>({
      x: (d) => d.y,
      y: (d) => d.x,
      width: CHUNK_HEIGHT,
      height: CHUNK_WIDTH,
    })(data)

    return voronoiLayout.polygons()
  }
}