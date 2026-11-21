import { expect, test } from 'claude-code/testing'

const BAND = {
  plugin: 'brainstorming',
  component: 'Pane',
  requestId: 'brainstorming',
  props: {
    title: 'Brainstorming',
    isFocused: false,
    bodyColumns: 30,
    placement: 'widget',
    anchoredEdges: [],
    scroll: { offset: 0, bodyRows: 4 },
    view: {},
  },
} as const

test('lo switch Brainstorming si accende e si spegne', async $ => {
  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({ ...BAND, surface })

    expect((await ui.find({ type: 'Text', text: /Brainstorming/ }))?.text).toBe('Brainstorming')
    expect((await ui.find({ type: 'Button', key: 'switch' }))?.text).toBe('○ OFF')
    await ui.press({ key: 'switch' })
    expect((await ui.find({ type: 'Button', key: 'switch' }))?.text).toBe('● ON')
    await ui.press({ key: 'switch' })
    expect((await ui.find({ type: 'Button', key: 'switch' }))?.text).toBe('○ OFF')
    await ui.unmount()
  }
})

test('con lo switch spento gli strumenti funzionano normalmente', async ($, on) => {
  on('tool.call', () => ({ result: {} }))
  const ran = await $.tool.call({ tool: 'Bash', command: 'ls' })
  expect(ran.deny).toBeUndefined()
})
