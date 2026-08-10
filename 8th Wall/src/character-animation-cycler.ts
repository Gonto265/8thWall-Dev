import * as ecs from '@8thwall/ecs'

const ANIMATION_STATES = [
  { clip: 'Armature_1.001|mixamo.com|Layer0',  position: { x: -0.203,   y: 0.097, z: -0.658 },   rotationDeg: { x: 0, y: 0,   z: 0 } },
  { clip: 'Armature_1.001|mixamo.com|Layer0.001',  position: { x: -0.794, y: 0.156, z: -0.827 },   rotationDeg: { x: 0, y: 0,  z: 0 } },
  { clip: 'Armature_1|mixamo.com|Layer0', position: { x: -0.186,   y: 0.097, z: -0.529 }, rotationDeg: { x: 0, y: 0, z: 0 } },
  { clip: 'Armature_1|mixamo.com|Layer0.004', position: { x: 0.294,   y: 0.097, z: -0.622 }, rotationDeg: { x: 0, y: -55, z: 0 } },
  { clip: 'Armature_1|mixamo.com|Layer0.001', position: { x: -0.391,   y: 0.097, z: -0.529 }, rotationDeg: { x: 0, y: 0, z: 0 } },  
]

const applyAnimationState = (world, eid, index) => {
  const state = ANIMATION_STATES[index]

  ecs.GltfModel.mutate(world, eid, (cursor) => {
    cursor.animationClip = state.clip
    cursor.loop = true
    cursor.paused = false
    cursor.time = 0
    cursor.crossFadeDuration = 0
    return false
  })

  world.setPosition(eid, state.position.x, state.position.y, state.position.z)

  const rot = ecs.math.quat.pitchYawRollDegrees(state.rotationDeg)
  world.setQuaternion(eid, rot.x, rot.y, rot.z, rot.w)
}

ecs.registerComponent({
  name: 'character-animation-cycler',

  data: {
    currentIndex: ecs.i32,
  },

  add: (world, component) => {
    applyAnimationState(world, component.eid, 0)
  },

  stateMachine: ({ world, eid, dataAttribute }) => {
    ecs.defineState('default')
      .initial()
      .listen(eid, ecs.input.SCREEN_TOUCH_START, () => {
        console.log('Toque detectado en el personaje, eid:', eid) // <-- diagnóstico

        const data = dataAttribute.cursor(eid)
        const nextIndex = (data.currentIndex + 1) % ANIMATION_STATES.length
        data.currentIndex = nextIndex

        applyAnimationState(world, eid, nextIndex)
      })
  },
})