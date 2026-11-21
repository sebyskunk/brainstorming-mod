export type BrainstormingFlag = boolean

declare module 'claude-code' {
  interface PluginState {
    brainstorming: { isOn: BrainstormingFlag; isRewriting: BrainstormingFlag }
  }
}
