let cycleImpl: () => void = () => {}

/** Last mounted assembly pie hook — toolbar may sit outside React context. */
export function bindAssemblyDateCycle(fn: () => void): () => void {
  cycleImpl = fn
  return () => {
    if (cycleImpl === fn) cycleImpl = () => {}
  }
}

export function runAssemblyDateCycle(): void {
  cycleImpl()
}
