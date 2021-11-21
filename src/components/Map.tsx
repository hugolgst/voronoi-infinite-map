import { MapContainer, useMap } from 'react-leaflet'
import React, { useEffect, useMemo, useState } from 'react'

import { Box } from '@chakra-ui/react'
import L from 'leaflet'
import { createTileLayerComponent } from '@react-leaflet/core'
import { getSeededRandom } from '@visx/mock-data'
import { voronoi } from '@visx/voronoi'

// Type for coordinates given by leaflet
type Coordinates = { x: number, y: number }

const TILESIZE = 64

type Datum = {
  x: number
  y: number
  id: string
}

const seededRandom = getSeededRandom(0.88)
const data: Datum[] = new Array(20000).fill(null).map(() => ({
  x: seededRandom(),
  y: seededRandom(),
  id: Math.random().toString(36).slice(2),
}))

const Map = ({ url }: {
  url?: string
}) => {
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

  return <MapContainer
    style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#1b202b'
    }}

    center={[0, 0]}
    zoom={1}
    minZoom={-5}
    maxZoom={5}

    // Non-geographical map
    crs={L.CRS.Simple}
    // Deactivate the zoom with wheel
    scrollWheelZoom={true}
    doubleClickZoom={true}
    dragging={true}

    attributionControl={false}
  // zoomControl={false}
  >
    <DrawPolygons polygons={polygons} />
  </MapContainer>
}

const DrawPolygons = ({ polygons }: {
  polygons: any
}) => {
  const map = useMap()
  const canvas = L.canvas({}).addTo(map)

  return polygons.map((polygon, i) => (<NicePolygon key={i} canvas={canvas} polygon={polygon} map={map} />))
}

const NicePolygon = ({ polygon, map, canvas }: {
  polygon: any,
  map: any,
  canvas: any
}) => {
  useEffect(() => {
    const poly = L.polygon(polygon, {
      'color': 'black',
      'fillColor': 'gray',
      renderer: canvas
    })

    // Change the colour on hover
    poly.on('mouseover', () => {
      poly.setStyle({
        'fillColor': 'blue'
      })
    })
    poly.on('mouseout', () => {
      poly.setStyle({
        'fillColor': 'gray'
      })
    })
    // Updates size of the stroke's width
    map.on('zoom', () => {
      console.log(map.getZoom())
      const zoom = Math.abs(map.getZoom()) + 1
      poly.setStyle({
        'weight': zoom
      })
    })

    poly.addTo(map)

    return () => poly.remove()
  }, [])

  return <></>
}

export default Map