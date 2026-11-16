/**
 * The mark: three isometric plates, the same interface / API / data stack the
 * hero renders in 3D. With `layers`, it doubles as a legend on project cards:
 * plates the project touched are filled, the rest are outlines.
 */
const PLATES = [
  { id: 'data', y: 22 },
  { id: 'api', y: 16 },
  { id: 'interface', y: 10 },
]

const rhombus = (y) => `4,${y} 16,${y - 6} 28,${y} 16,${y + 6}`

export default function StackMark({ layers, className = 'h-8 w-8', title }) {
  const legend = Array.isArray(layers)
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : 'true'}
      focusable="false"
    >
      {PLATES.map(({ id, y }) => {
        const on = legend ? layers.includes(id) : id === 'interface'
        return (
          <polygon
            key={id}
            points={rhombus(y)}
            fill={on ? 'rgb(var(--amber))' : 'rgb(var(--night))'}
            stroke={on ? 'rgb(var(--night))' : 'rgb(var(--chalk) / 0.7)'}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        )
      })}
    </svg>
  )
}

const LAYER_NAMES = { interface: 'Interface', api: 'API', data: 'Data' }

/** Mark plus the words, e.g. "Interface, API, Data". */
export function LayerLegend({ layers }) {
  const names = ['interface', 'api', 'data'].filter((l) => layers.includes(l)).map((l) => LAYER_NAMES[l])
  return (
    <span className="inline-flex items-center gap-2 text-sm text-haze">
      <StackMark layers={layers} className="h-5 w-5" />
      <span>
        <span className="sr-only">Layers worked on: </span>
        {names.join(', ')}
      </span>
    </span>
  )
}
