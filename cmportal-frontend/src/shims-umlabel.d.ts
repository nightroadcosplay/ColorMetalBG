import '@vue/runtime-core'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $umLabel: (raw: unknown) => string
  }
}

export {}
