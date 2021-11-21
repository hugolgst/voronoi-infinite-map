import { CHUNK_HEIGHT, CHUNK_WIDTH, useQueryPolygons } from '../hooks/useQueryPolygons'
import L, { Layer } from 'leaflet'
import { MapConsumer, MapContainer } from 'react-leaflet'
import React, { useEffect } from 'react'

import { useDrawPolygon } from '../hooks/useDrawPolygon'

export type Coordinates = [number, number]

const Map = (): JSX.Element => {
  const queryPolygons = useQueryPolygons()
  const drawPolygon = useDrawPolygon()

  return <MapContainer
    style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#1b202b'
    }}

    center={[0, 0]}
    zoom={5}
    minZoom={4}
    maxZoom={7}

    // Non-geographical map
    crs={L.CRS.Simple}
    // Deactivate the zoom with wheel
    scrollWheelZoom={true}
    doubleClickZoom={true}
    dragging={true}

    attributionControl={false}
  // zoomControl={false}
  >
    <MapConsumer>
      {(map) => {
        const canvas = L.canvas({}).addTo(map) 
        const clearCanvas = () => {
          map.eachLayer((layer) => {
            layer.remove()
          })
        }
        const rendered: Array<[number, number]> = []

        map.on('moveend', () => {
          const chunksX = Math.ceil(Math.abs((map.getBounds().getWest() - map.getBounds().getEast()) / CHUNK_WIDTH)) + 1
          const chunksY = Math.ceil(Math.abs((map.getBounds().getSouth() - map.getBounds().getNorth()) / CHUNK_HEIGHT)) + 1


          for (let i = 0; i < chunksX; i++) {
            const x = (i - Math.floor(chunksX / 2)) * CHUNK_WIDTH

            for (let j = 0; j < chunksY; j++) {
              const y = (j - Math.floor(chunksY / 2)) * CHUNK_HEIGHT

              if (rendered.includes([x, y])) continue
              rendered.push([x, y])
            
              const paths = queryPolygons(x, y)
              const renderedPolygons: Layer[] = []
              for (const polygon of paths) {
                renderedPolygons.push(drawPolygon(map, canvas, 'gray', polygon))
              }

              L.layerGroup(renderedPolygons).addTo(map)
            }
          }
        })

        return null
      }}
    </MapConsumer>
  </MapContainer>
}

export default Map