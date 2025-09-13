export const devLog = (label, ...args) => {
  if (process.env.NODE_ENV !== 'production') {
    // Start a collapsible group for a clean console.
    console.groupCollapsed(`[${label}]`, ...args)

    // Print the full stack trace. The first line of the stack trace
    // will show exactly where devLog was called from.
    console.trace()

    // End the log group.
    console.groupEnd()
  }
}

export const devError = (...args) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(...args)
  }
}
