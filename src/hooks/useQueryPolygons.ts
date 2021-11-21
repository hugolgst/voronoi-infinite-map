import { lcg, szudzik } from '../utils/deterministic.js'

import { Delaunay } from 'd3-delaunay'

export type Datum = {
  x: number
  y: number
  id: string
}

export const CHUNK_WIDTH = 16
export const CHUNK_HEIGHT = 16

/**
 * Hook to obtain a function to query new polygons in the given center
 * 128x64 
 * x,y
 * y > 64-(64/4)
 * 
 * @returns The query function
 */
export const useQueryPolygons = (): (x: number, y: number) => IterableIterator<Delaunay.Polygon & {
  index: number;
}> => {
  return (x: number, y: number): IterableIterator<Delaunay.Polygon & {
    index: number;
  }> => {
    const [xInt, yInt] = [Math.trunc(x), Math.trunc(y)]
    const [xShift, yShift] = [x - xInt, y - yInt]

    const data: number[][] = new Array(CHUNK_WIDTH * CHUNK_HEIGHT)
    let index = 0
    for (let i: number = (xInt - CHUNK_WIDTH); i < (xInt + CHUNK_WIDTH); i++)
      for (let j: number = (yInt - CHUNK_HEIGHT); j < (yInt + CHUNK_HEIGHT); j++) {
        const id = szudzik(i, j)
        const output = lcg(id, 2)

        const alpha = ((output % 64) * 1) / 64
        const beta = ((lcg(output, 2) % 64) * 1) / 64

        data[index++] = [
          yShift + j + beta - 1 / 2,
          xShift + i + alpha - 1 / 2
        ]
      }

    const delaunay = Delaunay.from(data)
    return delaunay.voronoi([y-CHUNK_HEIGHT/2, x-CHUNK_WIDTH/2, y + CHUNK_HEIGHT/2, x + CHUNK_WIDTH/2]).cellPolygons()
  }
}