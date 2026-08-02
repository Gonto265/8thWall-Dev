import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'video-toggle-button',

  schema: {
    videoEntity: ecs.eid,
  },

  add: (world, component) => {
    const { videoEntity } = component.schemaAttribute.get(component.eid)
    if (videoEntity) {
      ecs.VideoControls.mutate(world, videoEntity, (cursor) => {
        cursor.paused = true
        return false
      })
    }

    // Estado inicial: video pausado -> botón visible
    ecs.Ui.mutate(world, component.eid, (cursor) => {
      cursor.opacity = 1
      return false
    })
  },

  stateMachine: ({ world, eid, schemaAttribute }) => {
    ecs.defineState('default')
      .initial()
      .listen(eid, ecs.input.UI_CLICK, () => {
        const { videoEntity } = schemaAttribute.get(eid)
        if (!videoEntity) return

        const current = ecs.VideoControls.get(world, videoEntity)
        const isPaused = current ? current.paused : true
        const willPlay = isPaused // si estaba pausado, ahora va a reproducirse

        ecs.VideoControls.mutate(world, videoEntity, (cursor) => {
          cursor.paused = !isPaused
          cursor.volume = 1
          return false
        })

        // Sincronizamos la visibilidad del botón con el estado del video
        ecs.Ui.mutate(world, eid, (cursor) => {
          cursor.opacity = willPlay ? 0 : 1
          return false
        })
      })
  },
})