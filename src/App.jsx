import { useState, useRef, useEffect } from 'react'
import { FaceMesh } from '@mediapipe/face_mesh'
import { Camera } from '@mediapipe/camera_utils'
import './App.css'

const filters = [
  { id: 'none', name: 'No Filter', icon: '🚫' },
  { id: 'dog', name: 'Dog Ears', icon: '🐶' },
  { id: 'glasses', name: 'Sunglasses', icon: '🕶️' },
  { id: 'crown', name: 'Crown', icon: '👑' },
  { id: 'mask', name: 'Face Mask', icon: '😷' },
  { id: 'hearts', name: 'Hearts', icon: '💕' }
]

function App() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [currentFilter, setCurrentFilter] = useState('none')
  const [isLoading, setIsLoading] = useState(true)
  const [faceMesh, setFaceMesh] = useState(null)
  const [camera, setCamera] = useState(null)

  useEffect(() => {
    const initFaceMesh = async () => {
      const mesh = new FaceMesh({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
        }
      })

      mesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      })

      mesh.onResults(onResults)
      setFaceMesh(mesh)
    }

    initFaceMesh()
  }, [])

  useEffect(() => {
    if (faceMesh && videoRef.current) {
      const cam = new Camera(videoRef.current, {
        onFrame: async () => {
          await faceMesh.send({ image: videoRef.current })
        },
        width: 1280,
        height: 720
      })
      cam.start()
      setCamera(cam)
      setIsLoading(false)
    }
  }, [faceMesh])

  const onResults = (results) => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    canvas.width = results.image.width
    canvas.height = results.image.height

    ctx.save()
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height)

    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
      const landmarks = results.multiFaceLandmarks[0]
      applyFilter(ctx, landmarks, canvas.width, canvas.height)
    }

    ctx.restore()
  }

  const applyFilter = (ctx, landmarks, width, height) => {
    if (currentFilter === 'none') return

    switch (currentFilter) {
      case 'dog':
        drawDogEars(ctx, landmarks, width, height)
        drawDogNose(ctx, landmarks, width, height)
        break
      case 'glasses':
        drawSunglasses(ctx, landmarks, width, height)
        break
      case 'crown':
        drawCrown(ctx, landmarks, width, height)
        break
      case 'mask':
        drawMask(ctx, landmarks, width, height)
        break
      case 'hearts':
        drawHearts(ctx, landmarks, width, height)
        break
    }
  }

  const drawDogEars = (ctx, landmarks, width, height) => {
    const leftEar = landmarks[234]
    const rightEar = landmarks[454]
    
    ctx.fillStyle = '#8B4513'
    
    // Left ear
    ctx.beginPath()
    ctx.ellipse(leftEar.x * width - 60, leftEar.y * height - 80, 50, 80, -0.3, 0, Math.PI * 2)
    ctx.fill()
    
    // Right ear
    ctx.beginPath()
    ctx.ellipse(rightEar.x * width + 60, rightEar.y * height - 80, 50, 80, 0.3, 0, Math.PI * 2)
    ctx.fill()
  }

  const drawDogNose = (ctx, landmarks, width, height) => {
    const nose = landmarks[1]
    
    ctx.fillStyle = '#000'
    ctx.beginPath()
    ctx.ellipse(nose.x * width, nose.y * height + 20, 25, 20, 0, 0, Math.PI * 2)
    ctx.fill()
  }

  const drawSunglasses = (ctx, landmarks, width, height) => {
    const leftEye = landmarks[33]
    const rightEye = landmarks[263]
    const bridge = landmarks[168]
    
    ctx.strokeStyle = '#000'
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
    ctx.lineWidth = 8
    
    // Left lens
    ctx.beginPath()
    ctx.ellipse(leftEye.x * width, leftEye.y * height, 50, 35, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    
    // Right lens
    ctx.beginPath()
    ctx.ellipse(rightEye.x * width, rightEye.y * height, 50, 35, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    
    // Bridge
    ctx.beginPath()
    ctx.moveTo(leftEye.x * width + 50, leftEye.y * height)
    ctx.lineTo(rightEye.x * width - 50, rightEye.y * height)
    ctx.stroke()
  }

  const drawCrown = (ctx, landmarks, width, height) => {
    const forehead = landmarks[10]
    
    ctx.fillStyle = '#FFD700'
    ctx.strokeStyle = '#FFA500'
    ctx.lineWidth = 3
    
    const crownY = forehead.y * height - 100
    const crownX = forehead.x * width
    
    ctx.beginPath()
    ctx.moveTo(crownX - 80, crownY + 40)
    ctx.lineTo(crownX - 60, crownY)
    ctx.lineTo(crownX - 40, crownY + 30)
    ctx.lineTo(crownX - 20, crownY)
    ctx.lineTo(crownX, crownY + 30)
    ctx.lineTo(crownX + 20, crownY)
    ctx.lineTo(crownX + 40, crownY + 30)
    ctx.lineTo(crownX + 60, crownY)
    ctx.lineTo(crownX + 80, crownY + 40)
    ctx.lineTo(crownX + 80, crownY + 60)
    ctx.lineTo(crownX - 80, crownY + 60)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
  }

  const drawMask = (ctx, landmarks, width, height) => {
    const nose = landmarks[1]
    const leftCheek = landmarks[234]
    const rightCheek = landmarks[454]
    const chin = landmarks[152]
    
    ctx.fillStyle = 'rgba(100, 149, 237, 0.7)'
    ctx.strokeStyle = '#4169E1'
    ctx.lineWidth = 2
    
    ctx.beginPath()
    ctx.moveTo(leftCheek.x * width - 40, leftCheek.y * height)
    ctx.quadraticCurveTo(
      nose.x * width, nose.y * height - 20,
      rightCheek.x * width + 40, rightCheek.y * height
    )
    ctx.lineTo(rightCheek.x * width + 30, chin.y * height - 20)
    ctx.quadraticCurveTo(
      nose.x * width, chin.y * height + 10,
      leftCheek.x * width - 30, chin.y * height - 20
    )
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
  }

  const drawHearts = (ctx, landmarks, width, height) => {
    const leftEye = landmarks[33]
    const rightEye = landmarks[263]
    
    const drawHeart = (x, y, size) => {
      ctx.fillStyle = '#FF1493'
      ctx.beginPath()
      ctx.moveTo(x, y + size / 4)
      ctx.quadraticCurveTo(x, y, x + size / 2, y)
      ctx.quadraticCurveTo(x + size, y, x + size, y + size / 4)
      ctx.quadraticCurveTo(x + size, y + size / 2, x + size / 2, y + size)
      ctx.lineTo(x, y + size / 4)
      ctx.quadraticCurveTo(x - size / 2, y + size / 2, x - size / 2, y + size / 4)
      ctx.quadraticCurveTo(x - size / 2, y, x, y)
      ctx.fill()
    }
    
    drawHeart(leftEye.x * width - 40, leftEye.y * height - 60, 30)
    drawHeart(rightEye.x * width + 40, rightEye.y * height - 60, 30)
  }

  const capturePhoto = () => {
    const canvas = canvasRef.current
    const link = document.createElement('a')
    link.download = `ar-filter-${Date.now()}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  return (
    <div className="app">
      <video ref={videoRef} style={{ display: 'none' }} />
      
      <div className="camera-container">
        <canvas ref={canvasRef} className="camera-canvas" />
        {isLoading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading AR Filters...</p>
          </div>
        )}
      </div>

      <div className="controls">
        <div className="filters">
          {filters.map(filter => (
            <button
              key={filter.id}
              className={`filter-btn ${currentFilter === filter.id ? 'active' : ''}`}
              onClick={() => setCurrentFilter(filter.id)}
            >
              <span className="filter-icon">{filter.icon}</span>
              <span className="filter-name">{filter.name}</span>
            </button>
          ))}
        </div>
        
        <button className="capture-btn" onClick={capturePhoto}>
          📸 Capture
        </button>
      </div>
    </div>
  )
}

export default App