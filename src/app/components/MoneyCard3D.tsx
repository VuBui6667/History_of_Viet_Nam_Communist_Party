import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'

type Props = {
  frontImage: string
  backImage: string
}

export default function MoneyCard3D({ frontImage, backImage }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = ref.current
    if (!container) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    )
    camera.position.z = 2

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    // set pixel ratio before setSize
    renderer.setPixelRatio(window.devicePixelRatio || 1)
    // renderer.outputEncoding = THREE.sRGBEncoding // better color/contrast for images
    renderer.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(renderer.domElement)

    const loader = new THREE.TextureLoader()
    const frontTex = loader.load(frontImage)
    const backTex = loader.load(backImage)

    // improve texture quality
    const maxAniso = renderer.capabilities.getMaxAnisotropy()
      ;[frontTex, backTex].forEach((tex) => {
        // tex.encoding = THREE.sRGBEncoding
        tex.anisotropy = maxAniso
        // optional: tweak filters if you want pixel-perfect or sharper look
        tex.minFilter = THREE.LinearMipMapLinearFilter
        tex.magFilter = THREE.LinearFilter
        tex.generateMipmaps = true
        tex.needsUpdate = true
      })

    // Flip back texture horizontally so it doesn't appear mirrored
    backTex.wrapS = THREE.RepeatWrapping
    backTex.repeat.x = -1

    const thickness = 0.05
    const geometry = new THREE.BoxGeometry(1.6, 0.8, thickness)

    const sideMat = new THREE.MeshStandardMaterial({ color: 0xdddddd })
    const materials = [
      sideMat,
      sideMat.clone(),
      sideMat.clone(),
      sideMat.clone(),
      new THREE.MeshStandardMaterial({ map: frontTex }),
      new THREE.MeshStandardMaterial({ map: backTex })
    ]

    const mesh = new THREE.Mesh(geometry, materials)
    scene.add(mesh)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.enablePan = false
    controls.enableZoom = false

    const light = new THREE.AmbientLight(0xffffff, 1)
    scene.add(light)

    // Auto-rotate along the local X axis, but allow dragging.
    const clock = new THREE.Clock()
    const rotationSpeed = 0.6 // radians per second
    let isUserInteracting = false
    const onStart = () => {
      isUserInteracting = true
    }
    const onEnd = () => {
      isUserInteracting = false
    }
    controls.addEventListener('start', onStart)
    controls.addEventListener('end', onEnd)

    const handleResize = () => {
      // update pixel ratio too (important for modal / DPR changes)
      renderer.setPixelRatio(window.devicePixelRatio || 1)
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    let reqId = 0
    const animate = () => {
      reqId = requestAnimationFrame(animate)
      const delta = clock.getDelta()
      // rotate only when the user is not interacting, so dragging feels natural.
      if (!isUserInteracting) {
        mesh.rotation.y -= delta * rotationSpeed
      }
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      controls.removeEventListener('start', onStart)
      controls.removeEventListener('end', onEnd)
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      cancelAnimationFrame(reqId)
      controls.dispose()
      renderer.dispose()
      geometry.dispose()
      materials.forEach((m) => {
        if ((m as any).map) {
          ; (m as any).map.dispose()
        }
        m.dispose()
      })
      frontTex.dispose()
      backTex.dispose()
    }
  }, [frontImage, backImage])

  return <div ref={ref} style={{ width: '110%', height: '110%' }} />
}
