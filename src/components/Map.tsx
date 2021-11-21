import { CHUNK_HEIGHT, CHUNK_WIDTH, Datum, useQueryPolygons } from '../hooks/useQueryPolygons'
import { MapConsumer, MapContainer } from 'react-leaflet'
import React, { useEffect, useState } from 'react'

import L from 'leaflet'
import { VoronoiPolygon } from 'd3-voronoi'
import { useDrawPolygon } from '../hooks/useDrawPolygon'

export type Coordinates = [number, number]

const Map = (): JSX.Element => {
  const queryPolygons = useQueryPolygons()
  const drawPolygon = useDrawPolygon()
  const [ polygons, setPolygons ] = useState<Array<VoronoiPolygon<Datum>>>()
  const coordinatesState = useState<Coordinates>([0, 0])
  const [ coordinates, setCoordinates ] = coordinatesState

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

        useEffect(() => {
          map.on('moveend', () => {
            const { lat: y, lng: x } = map.getCenter()
            const zoom = map.getZoom()
          
            if (Math.abs(y - coordinates[1]) > CHUNK_HEIGHT / 8 / zoom || Math.abs(x - coordinates[0]) > CHUNK_WIDTH / 8 / zoom) {
              clearCanvas()
              setCoordinates([x, y])
              setPolygons(queryPolygons(...coordinates))
            }
          })

          return () => {
            map.clearAllEventListeners()
          }
        }, [coordinates])

        useEffect(() => {
          console.log('new polygons available')
          if (!polygons) return

          for (const polygon of polygons) {
            drawPolygon(map, canvas, 'gray', polygon)
          }
        }, [ polygons ])

        return null
      }}
    </MapConsumer>
  </MapContainer>
}

export default Map