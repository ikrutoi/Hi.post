let cycleImpl: () => void = () => {}

/** Last mounted assembly pie hook — toolbar may sit outside React context. */
export function bindAssemblyRecipientCycle(fn: () => void): () => void {
  cycleImpl = fn
  return () => {
    if (cycleImpl === fn) cycleImpl = () => {}
  }
}

export function runAssemblyRecipientCycle(): void {
  cycleImpl()
}
