import React, { useEffect, useRef, useState } from 'react'

import { Box } from '@chakra-ui/react'
import VoronoiTile from '../components/Voronoi'
import dynamic from 'next/dynamic'

const Map = dynamic(
  () => import('../components/Map'),
  { ssr: false }
)

const Index = (): JSX.Element => {
  const svgRef = useRef<SVGSVGElement>(null)
  const [url, setURL] = useState<string>()

  useEffect(() => {
    if (!svgRef.current) return

    const blob = new Blob([svgRef.current.innerHTML], { type: 'image/svg+xml;charset=utf-8' })
    setURL(URL.createObjectURL(blob))
  }, [svgRef])

  console.log(url)

  return <>
    { url ? null : <Box ref={svgRef}>
      <VoronoiTile
        width={512}
        height={512}
      />
    </Box> }

    { url ? <Map url={url} /> : null }
  </>
}

export default Index
