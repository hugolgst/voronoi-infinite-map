import L from 'leaflet'
import { MapContainer } from 'react-leaflet'
import React from 'react'
import { createTileLayerComponent } from '@react-leaflet/core'

// Type for coordinates given by leaflet
type Coordinates = {x: number, y: number}

const TILESIZE = 64

const Map = ({ url }: {
  url: string
}) => {
  // Extended core leaflet element to retrieve the image from the bucket directly
  const ExtendedTileLayer = L.TileLayer.extend({
    createTile: (coords: Coordinates) => {
      const tile = document.createElement('img')

      tile.setAttribute('role', 'presentation')
      tile.src = url

      return tile
    }
  })
  
  // Build the react-leaflet matching element to the previous one
  const VoronoiTileLayer = createTileLayerComponent((props, context) => {
    return {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      instance: new ExtendedTileLayer(props.url, {
        maxNativeZoom: 0,
        tileSize: TILESIZE,
        edgeBufferTiles: 10,
        ...props 
      }),
      context
    }
  }, () => null)

  return <MapContainer
    center={[0, 0]} 
    zoom={2}
    minZoom={1}
    maxZoom={5}
  
    // Non-geographical map
    crs={L.CRS.Simple}
    // Deactivate the zoom with wheel
    scrollWheelZoom={false}
    doubleClickZoom={false}
  
    attributionControl={false}
    zoomControl={false}
    style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#dedede'
    }}
  >
    <VoronoiTileLayer />
  </MapContainer>
}

export default Map