declare global {
  interface SymbolConstructor {
    readonly observable: symbol
  }
}

const $$observable: unique symbol = /* #__PURE__ */ (() =>
  (typeof Symbol === 'function' && Symbol.observable) || '@@observable' as any)()

export default $$observable
