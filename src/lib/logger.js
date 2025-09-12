export const devLog = (label, ...args) => {
  if (process.env.NODE_ENV !== 'production') {
    const stack = new Error().stack
    let location = ''

    if (stack) {
      const callerLine = stack.split('\n')[2]?.trim()
      location = ` @ ${callerLine}`
    }

    // Print label + value + location in one entry
    console.log(`[${label}]`, ...args, location)
  }
}

export const devError = (...args) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(...args)
  }
}
