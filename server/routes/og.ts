import { Router } from 'express'

const router = Router()

// Generate OG meta tags for Farcaster frames
router.get('/:collectionId/:tokenId', (req, res) => {
  const { collectionId, tokenId } = req.params
  const appUrl = process.env.APP_URL || 'http://localhost:5173'

  const ogHtml = `
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="ZAOUNZ - Music NFT" />
        <meta property="og:description" content="Discover and mint music NFTs" />
        <meta property="og:image" content="${appUrl}/og-image.png" />
        <meta name="fc:frame" content="vNext" />
        <meta name="fc:frame:image" content="${appUrl}/api/og/image/${collectionId}/${tokenId}" />
        <meta name="fc:frame:button:1" content="View on ZAOUNZ" />
        <meta name="fc:frame:button:1:action" content="link" />
        <meta name="fc:frame:button:1:target" content="${appUrl}/?collection=${collectionId}&token=${tokenId}" />
      </head>
      <body>Redirecting...</body>
    </html>
  `
  res.setHeader('Content-Type', 'text/html')
  res.send(ogHtml)
})

export default router