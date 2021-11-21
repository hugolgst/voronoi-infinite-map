import React, { useEffect, useRef, useState } from 'react'

import VoronoiTile from '../components/Voronoi'

const Index = (): JSX.Element => {
  const voronoiTile = useRef<SVGSVGElement>(null)
  const [url, setURL] = useState<string>()

  useEffect(() => {
    if (!voronoiTile.current) return

    const blob = new Blob([voronoiTile.current.innerHTML], { type: 'image/svg+xml' })
    setURL(URL.createObjectURL(blob))
  }, [voronoiTile])

  return <>
    <VoronoiTile
      svgRef={voronoiTile}
      width={512}
      height={512}
    />

    { url ? <img src={url} /> : null }
  </>
}

export default Index
