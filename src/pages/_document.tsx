import NextDocument, { Head, Html, Main, NextScript } from 'next/document'

import { ColorModeScript } from '@chakra-ui/react'
import React from 'react'

export default class Document extends NextDocument {
  render(): JSX.Element {
    return <Html>
      <head>
        <title>Voronoi map</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
          integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
          crossOrigin=""/>
      </head>
      <Head />
      
      <body>
        {/* Make Color mode to persists when you refresh the page. */}
        <ColorModeScript />
        <Main />
        <NextScript />
      </body>
    </Html>
  }
}
