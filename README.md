# AR Filters App 🎭

A real-time AR face filters application similar to Snapchat and Instagram, built with React and MediaPipe.

## Features ✨

- **Real-time Face Detection** - Uses MediaPipe Face Mesh for accurate face tracking
- **Multiple AR Filters**:
  - 🐶 Dog Ears & Nose
  - 🕶️ Sunglasses
  - 👑 Crown
  - 😷 Face Mask
  - 💕 Hearts
- **Photo Capture** - Save photos with filters applied
- **Responsive Design** - Works on desktop and mobile devices
- **Smooth Performance** - Optimized for 30+ FPS

## Tech Stack 🛠️

- React 18
- Vite
- MediaPipe Face Mesh
- TensorFlow.js
- HTML5 Canvas
- WebRTC

## Installation 🚀

1. Clone the repository:
```bash
git clone https://github.com/sairam522009-del/ar-filters-app.git
cd ar-filters-app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

**Note:** You need to allow camera permissions for the app to work.

## Build for Production 📦

```bash
npm run build
```

The build files will be in the `dist` folder.

## Deploy 🌐

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy
```

## Browser Support 🌍

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Note:** HTTPS is required for camera access in production.

## How It Works 🔍

1. **Face Detection**: MediaPipe Face Mesh detects 468 facial landmarks in real-time
2. **Filter Application**: Canvas API draws AR effects based on landmark positions
3. **Rendering**: Each frame is processed and rendered at 30+ FPS
4. **Capture**: Screenshots are taken from the canvas element

## Adding Custom Filters 🎨

Edit `src/App.jsx` and add your filter function:

```javascript
const drawCustomFilter = (ctx, landmarks, width, height) => {
  // Your custom drawing code here
  const nose = landmarks[1]
  ctx.fillStyle = '#FF0000'
  ctx.fillRect(nose.x * width, nose.y * height, 50, 50)
}
```

Then add it to the filters array and switch case.

## License 📄

MIT License - feel free to use this project for personal or commercial purposes.

## Credits 👏

- MediaPipe by Google
- Face Mesh model
- React team

---

Made with ❤️ by Sai Ram