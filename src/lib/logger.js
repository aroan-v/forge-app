export const devLog = (...args) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(...args)
  }
}

export const devError = (...args) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(...args)
  }
}
