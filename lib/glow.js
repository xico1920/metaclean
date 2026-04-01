export const glowStyle = {
  background: 'linear-gradient(135deg, #2563eb, #4f46e5, #8b5cf6, #6366f1)',
  backgroundSize: '300% 300%',
  backgroundPosition: '0% 50%',
  transition: 'box-shadow 0.4s ease, background-position 0.1s ease',
}

export const glowHandlers = {
  onMouseEnter: (e) => {
    e.currentTarget.style.backgroundPosition = '100% 50%'
    e.currentTarget.style.boxShadow = '0 0 0 1px rgba(139,92,246,0.6), 0 0 20px rgba(99,102,241,0.5), 0 0 45px rgba(139,92,246,0.25)'
    e.currentTarget.style.transform = 'scale(1.02)'
  },
  onMouseLeave: (e) => {
    e.currentTarget.style.backgroundPosition = '0% 50%'
    e.currentTarget.style.boxShadow = 'none'
    e.currentTarget.style.transform = 'scale(1)'
  },
  onMouseMove: (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.backgroundPosition = `${((e.clientX - r.left) / r.width * 100).toFixed(1)}% 50%`
  },
}
