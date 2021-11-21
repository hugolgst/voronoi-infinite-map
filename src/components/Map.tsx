import { Datum, useQueryPolygons } from '../hooks/useQueryPolygons'
import { MapConsumer, MapContainer } from 'react-leaflet'
import React, { useEffect, useState } from 'react'

import L from 'leaflet'
import { VoronoiPolygon } from 'd3-voronoi'
import { useDrawPolygon } from '../hooks/useDrawPolygon'
import useMapCenter from '../hooks/useMapCenter'

export type Coordinates = [number, number]

const Map = (): JSX.Element => {
  const queryPolygons = useQueryPolygons()
  const drawPolygon = useDrawPolygon()
  const { listenToMovements, coordinates } = useMapCenter()
  const [ polygons, setPolygons ] = useState<Array<VoronoiPolygon<Datum>>>()

  useEffect(() => {
    if (!coordinates) return
    setPolygons(queryPolygons(...coordinates))
  }, [ coordinates ])

  return <MapContainer
    style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#1b202b'
    }}

    center={[0, 0]}
    zoom={3}
    minZoom={0}
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
        listenToMovements(map)        

        if (!polygons) return null

        for (const polygon of polygons) {
          drawPolygon(map, canvas, 'gray', polygon)
        }

        return null
      }}
    </MapConsumer>
  </MapContainer>
}

export default Map