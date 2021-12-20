import { CHUNK_HEIGHT, CHUNK_WIDTH, useQueryPolygons } from '../hooks/useQueryPolygons'
import { MapContainer, useMap } from 'react-leaflet'

import L from 'leaflet'
import React from 'react'
import { createTileLayerComponent } from '@react-leaflet/core'
import { useChunkGarbageCollector } from '../hooks/useChunkGarbageCollector'
import { useDrawPolygon } from '../hooks/useDrawPolygon'

export type Coordinates = [number, number]

const dummyDiv = (): HTMLDivElement => {
  const tile = document.createElement('div')
  tile.style.backgroundColor = '#3e3e4a'
  tile.style.width = '100%'
  tile.style.height = '100%'

  return tile
}

const Map = (): JSX.Element => {
  const queryPolygons = useQueryPolygons()
  const drawPolygon = useDrawPolygon()

  const Tile = (): JSX.Element => {
    const map = useMap()
    const canvas = L.canvas({}).addTo(map)
    const { addChunk, collectGarbage, isRendered } = useChunkGarbageCollector()

    // Extended core leaflet element to retrieve the image from the bucket directly
    const ExtendedTileLayer = L.TileLayer.extend({
      createTile: (coords: {
        x: number,
        y: number
      }) => {
        const x = coords.x * CHUNK_WIDTH - CHUNK_WIDTH / 2
        const y = coords.y * CHUNK_HEIGHT - CHUNK_HEIGHT / 2

        L.marker([x, y]).bindTooltip("chunk: (" + coords.x + "; " + coords.y + ")", { permanent: true, offset: [0, 12] }).addTo(map)

        if (isRendered(x, y)) return dummyDiv()

        // Compute the paths and draw the polygons in a LayerGroup
        const paths = queryPolygons(x, y)
        const polygons: Array<L.Layer> = []
        let i = 0;


        for (const path of paths) {
          let ix = i % 35;
          let iy = (i - ix) / 35;
          console.log(i)
          if (iy != 0 && iy != 34 && iy != 33) {
            const polygon = drawPolygon(map, canvas, 'gray', path)
            polygons.push(polygon)
          }
          i++;
        }
        const layerGroup = L.layerGroup(polygons).addTo(map)

        addChunk({
          center: { x: x, y: y },
          clear: () => { layerGroup.clearLayers() }
        })
        const center = map.getCenter()
        collectGarbage(center.lng, center.lat)

        console.log("c")
        return dummyDiv()
      }
    })

    // Build the react-leaflet matching element to the previous one
    const CustomTileLayer = createTileLayerComponent((props, context) => {
      return {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        instance: new ExtendedTileLayer(props.url, {
          maxNativeZoom: 0,
          tileSize: CHUNK_HEIGHT,
          edgeBufferTiles: 10,
          ...props
        }),
        context
      }
    }, () => null)

    return <CustomTileLayer />
  }

  return <MapContainer
    style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#e8e8e8'
    }}

    center={[0, 0]}
    zoom={5}
    minZoom={3}
    maxZoom={10}

    preferCanvas={true}

    // Non-geographical map
    crs={L.CRS.Simple}
    // Deactivate the zoom with wheel
    scrollWheelZoom={true}
    doubleClickZoom={true}
    dragging={true}

    attributionControl={false}
  // zoomControl={false}
  >
    <Tile />
  </MapContainer>
}

export default Map