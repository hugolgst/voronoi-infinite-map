import React, { useEffect } from 'react'

import L from 'leaflet'
import { useMap } from 'react-leaflet'

interface PolygonProps {
  path: Array<[number, number]>
  canvas: L.Canvas
}

const Polygon = ({ path, canvas }: PolygonProps) => {
  useEffect(() => {
    
  }, [])

  return <></>
}

const Polygons = (): JSX.Element => {
  const map = useMap()
  const canvas = L.canvas({}).addTo(map)

  return <>
  </>
}

export default Polygons