import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'collider-link-redirect',

  schema: {
    url: ecs.string,
    openInNewTab: ecs.boolean,
  },

  schemaDefaults: {
    url: 'https://tusitio.com',
    openInNewTab: true,
  },

  stateMachine: ({ world, eid, schemaAttribute }) => {
    ecs.defineState('default')
      .initial()
      .listen(eid, ecs.input.SCREEN_TOUCH_START, () => {
        const { url, openInNewTab } = schemaAttribute.get(eid)
        if (!url) return

        window.open(url, openInNewTab ? '_blank' : '_self')
      })
  },
})