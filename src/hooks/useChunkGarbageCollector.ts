import { useState } from 'react'

type Chunk = {
  clear: () => void
  center: {
    x: number,
    y: number
  }
}

interface ChunkGarbageCollector {
  addChunk: (chunk: Chunk) => void
  collectGarbage: (x: number, y: number) => void
  isRendered: (x: number, y: number) => boolean
}

const distance = (x: number, y: number, x2: number, y2: number): number => {
  return Math.sqrt((x - x2)**2 + (y - y2)**2)
}

const MAX_SIZE = 30

/**
 * Takes care of garbage collection of chunks.
 * 
 * @returns 
 */
export const useChunkGarbageCollector = (): ChunkGarbageCollector => {
  const [pool, setPool] = useState<Array<Chunk>>([])

  // Add a chunk to the pool
  const addChunk = (chunk: Chunk) => {
    setPool((copy) => {
      if (copy.length >= MAX_SIZE) {
        const garbage = copy.shift()
        garbage?.clear()
      }

      copy.push(chunk)
      return copy
    })		
  }

  // Check if a chunk at the given coordinates is rendered
  const isRendered = (x: number, y: number): boolean => {
    return pool.filter(chunk => chunk.center.x == x && chunk.center.y == y).length > 0
  }

  // Collects half of the maximum size of the pool and clears the layers
  const collectGarbage = (x: number, y: number) => {
    if (pool.length < MAX_SIZE/2) {
      return
    }

    const sortedByDistance = pool.sort((a: Chunk, b: Chunk): number => {
      return distance(x, y, a.center.x, a.center.y) - distance(x, y, b.center.x, b.center.y)
    })

    const garbage = sortedByDistance.splice(MAX_SIZE/2, MAX_SIZE)
    for (const chunk of garbage) {
      chunk.clear()
    }

    setPool(sortedByDistance)
  }

  return {
    addChunk, isRendered, collectGarbage
  }
}