import { Box } from '@chakra-ui/react'
import React from 'react'
import dynamic from 'next/dynamic'

const Map = dynamic(
  () => import('../components/Map'),
  { ssr: false }
)

const Index = (): JSX.Element => (<Box
  w="100vw"
  h="100vh"
>
  <Map />
</Box>)

export default Index
