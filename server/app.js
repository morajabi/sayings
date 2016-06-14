import express from 'express'
import React from 'react'
import App from '../common/components/App/App'
import { renderToString } from 'react-dom/server'
const router = express.Router()

router.get('/', (req, res) => {
  let appHTML = renderToString(<App />)
  res.render('index', { content: appHTML })
})

export default router
