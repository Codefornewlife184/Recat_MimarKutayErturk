import React from 'react'

export default function Spacer({ size = 'md', height }) {
  const className = height ? 'spacer spacer-custom' : `spacer spacer-${size}`
  const style = height ? { height: `${height}px` } : undefined
  return <div className={className} style={style} />
}
