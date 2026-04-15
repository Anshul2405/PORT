/**
 * Queues 3D key-cap animations until KeyboardModel registers a consumer.
 * Use this instead of synthetic KeyboardEvent so skills feel “from the keyboard”, not the DOM.
 */

export type PortfolioKeySimDetail = { code: string; silent?: boolean }

let consumer: null | ((d: PortfolioKeySimDetail) => void) = null
const queue: PortfolioKeySimDetail[] = []

export function simulatePortfolioKeyPress(code: string, options?: { silent?: boolean }) {
  const detail: PortfolioKeySimDetail = { code, silent: options?.silent }
  if (consumer) consumer(detail)
  else queue.push(detail)
}

export function registerPortfolioKeySimConsumer(fn: (d: PortfolioKeySimDetail) => void) {
  consumer = fn
  while (queue.length) fn(queue.shift()!)
  return () => {
    if (consumer === fn) consumer = null
  }
}
