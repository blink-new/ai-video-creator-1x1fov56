import { useState } from 'react'
import { createClient } from '@blinkdotnew/sdk'
import { Toaster } from 'sonner'
import Dashboard from './components/Dashboard'

const blink = createClient({
  projectId: 'ai-video-creator-1x1fov56',
  authRequired: true
})

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Dashboard blink={blink} />
      <Toaster position="top-right" />
    </div>
  )
}

export default App