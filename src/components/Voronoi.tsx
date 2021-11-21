import { GradientOrangeRed, GradientPinkRed } from '@visx/gradient'
import React, { useMemo, useRef, useState } from 'react'
import { VoronoiPolygon, voronoi } from '@visx/voronoi'

import { Group } from '@visx/group'
import { RectClipPath } from '@visx/clip-path'
import { getSeededRandom } from '@visx/mock-data'
import { localPoint } from '@visx/event'

type Datum = {
  x: number
  y: number
  id: string
}

const seededRandom = getSeededRandom(0.88)
const data: Datum[] = new Array(150).fill(null).map(() => ({
  x: seededRandom(),
  y: seededRandom(),
  id: Math.random().toString(36).slice(2),
}))

const neighborRadius = 75
const defaultMargin = {
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
}

export type VoronoiProps = {
  width: number
  height: number
  margin?: { top: number; right: number; bottom: number; left: number }
}

const VoronoiTile = ({ width, height, margin = defaultMargin }: VoronoiProps) => {
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

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

  const polygons = voronoiLayout.polygons()
  const svgRef = useRef<SVGSVGElement>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [neighborIds, setNeighborIds] = useState<Set<string>>(new Set())

  return width < 10 ? null : (
    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width={width} height={height} viewBox="0 0 512 512" ref={svgRef}>
      <Group
        top={margin.top}
        left={margin.left}
        clipPath="url(#voronoi_clip)"
      >
        <GradientOrangeRed id="voronoi_orange_red" />
        <GradientPinkRed id="voronoi_pink_red" />
        <RectClipPath id="voronoi_clip" width={innerWidth} height={innerHeight} />

        {polygons.map((polygon) => (
          <VoronoiPolygon
            key={`polygon-${polygon.data.id}`}
            id={`polygon-${polygon.data.id}`}
            polygon={polygon}
            fill="#8ab9ff"
            stroke="#fff"
            strokeWidth={1}
            fillOpacity={hoveredId && neighborIds.has(polygon.data.id) ? 0.5 : 1}
            style={{
              zIndex: 10000
            }}
          />
        ))}
        {data.map(({ x, y, id }) => (
          <circle
            key={`circle-${id}`}
            r={2}
            cx={x * innerWidth}
            cy={y * innerHeight}
            fill={id === hoveredId ? 'fuchsia' : '#fff'}
            fillOpacity={0.8}
          />
        ))}
      </Group>
    </svg>
  )
}

export default VoronoiTile