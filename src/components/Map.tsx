import { MapConsumer, MapContainer } from 'react-leaflet'

import L from 'leaflet'
import React from 'react'
import { useDrawPolygon } from '../hooks/useDrawPolygon'
import { useQueryPolygons } from '../hooks/useQueryPolygons'

const Map = (): JSX.Element => {
  const polygons = useQueryPolygons()
  const drawPolygon = useDrawPolygon()

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
    <MapConsumer>
      {(map) => {
        const canvas = L.canvas({}).addTo(map) 

        console.log(polygons)

        polygons.forEach((polygon) => {
          drawPolygon(map, canvas, 'gray', polygon)
        })

        return null
      }}
    </MapConsumer>
  </MapContainer>
}

export default Map