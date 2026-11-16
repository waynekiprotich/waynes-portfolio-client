import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from '@/lib/router'
import SEO from '@/components/SEO'
import { breadcrumbs } from '@/lib/schema'
import { SITE } from '@/data/site'
import { PROJECT_TYPES, TIMELINES, BUDGETS, STEPS, EMPTY_BRIEF } from '@/data/scope'

const DRAFT_KEY = 'wk:brief'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_BRIEF = 20

/** Returns { field: message } for the given step; empty when valid. */
function validate(step, d) {
  const e = {}
  if (step === 0 && !d.projectType) e.projectType = 'Choose the option closest to your project.'
  if (step === 1 && d.description.trim().length < MIN_BRIEF)
    e.description = `Add a little more detail: at least ${MIN_BRIEF} characters.`
  if (step === 2) {
    if (!d.timeline) e.timeline = 'Choose a timeline.'
    if (!d.budget) e.budget = 'Choose a budget range, or “Not sure yet”.'
  }
  if (step === 3) {
    if (!d.name.trim()) e.name = 'Enter your name.'
    if (!EMAIL_RE.test(d.email.trim())) e.email = 'Enter an email address like name@example.com.'
  }
  return e
}

function RadioGroup({ name, legend, options, value, onChange, error, columns = 'sm:grid-cols-2' }) {
  const errorId = `${name}-error`
  return (
    <fieldset aria-describedby={error ? errorId : undefined}>
      <legend className="field-label text-base">{legend}</legend>
      <div className={`mt-3 grid gap-3 ${columns}`}>
        {options.map((option) => (
          <label key={option} className="choice relative">
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
              aria-invalid={error ? 'true' : undefined}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
      {error && (
        <p id={errorId} className="field-error">
          {error}
        </p>
      )}
    </fieldset>
  )
}

function TextField({ id, label, hint, error, optional, ...props }) {
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined
  const Tag = props.rows ? 'textarea' : 'input'
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
        {optional ? <span className="font-normal text-faint"> (optional)</span> : null}
      </label>
      <Tag
        id={id}
        name={id}
        className="input"
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
        {...props}
      />
      {hint && (
        <span id={`${id}-hint`} className="field-hint">
          {hint}
        </span>
      )}
      {error && (
        <span id={`${id}-error`} className="field-error">
          {error}
        </span>
      )}
    </div>
  )
}

/**
 * Project scoping wizard. Four short steps, easiest first. Answers are kept
 * as a draft on this device until the brief is sent, which posts to
 * /api/estimate (a serverless function that forwards it privately). If
 * sending fails, the same brief can go by email in one click.
 */
export default function Estimator() {
  const [step, setStep] = useState(0)
  // A draft from an earlier visit, if this device kept one.
  const [data, setData] = useState(() => {
    try {
      const saved = typeof window !== 'undefined' && JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null')
      return saved && typeof saved === 'object' ? { ...EMPTY_BRIEF, ...saved } : EMPTY_BRIEF
    } catch {
      return EMPTY_BRIEF
    }
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [serverError, setServerError] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const heading = useRef(null)
  const form = useRef(null)
  const moved = useRef(false)

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(data))
    } catch {
      /* Private mode: the draft simply is not kept. */
    }
  }, [data])

  // Each new step announces itself by moving focus to its heading.
  useEffect(() => {
    if (!moved.current) return
    heading.current?.focus()
  }, [step, status])

  const set = (field) => (value) => {
    setData((d) => ({ ...d, [field]: value }))
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }))
  }

  const go = (next) => {
    moved.current = true
    setErrors({})
    setStep(next)
  }

  const summary = useMemo(
    () =>
      [
        ['Project type', data.projectType],
        ['Brief', data.description.trim()],
        ['Timeline', data.timeline],
        ['Budget', data.budget],
        ['Name', data.name.trim()],
        ['Email', data.email.trim()],
        ['Phone', data.phone.trim()],
      ].filter(([, v]) => v),
    [data]
  )

  const mailto = `mailto:${SITE.email}?subject=${encodeURIComponent(
    `Project brief: ${data.projectType || 'new project'}`
  )}&body=${encodeURIComponent(summary.map(([k, v]) => `${k}: ${v}`).join('\n'))}`

  const send = async () => {
    setStatus('sending')
    setServerError('')
    try {
      const response = await fetch('/api/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name.trim(),
          email: data.email.trim(),
          phone: data.phone.trim(),
          projectType: data.projectType,
          timeline: data.timeline,
          budget: data.budget,
          description: data.description.trim(),
          company: honeypot,
        }),
      })
      if (response.ok) {
        moved.current = true
        setStatus('sent')
        try {
          localStorage.removeItem(DRAFT_KEY)
        } catch {
          /* nothing to clear */
        }
        return
      }
      const body = await response.json().catch(() => ({}))
      setServerError(body.error || `The server answered ${response.status}.`)
      setStatus('error')
    } catch {
      setServerError('Your browser could not reach the server. Check your connection.')
      setStatus('error')
    }
  }

  const onSubmit = (event) => {
    event.preventDefault()
    const found = validate(step, data)
    if (Object.keys(found).length) {
      setErrors(found)
      // Move focus to the first field with a problem.
      const first = Object.keys(found)[0]
      requestAnimationFrame(() => form.current?.querySelector(`[name="${first}"]`)?.focus())
      return
    }
    if (step < STEPS.length - 1) go(step + 1)
    else if (status !== 'sending') send()
  }

  const startOver = () => {
    setData(EMPTY_BRIEF)
    setStatus('idle')
    go(0)
  }

  return (
    <>
      <SEO
        title="Scope a project"
        description="Scope a website or web app project with Wayne Kiprotich in four short steps: project type, brief, timeline and budget in KES, and your details."
        path="/estimator"
        schema={breadcrumbs([['Scope a project', '/estimator']])}
      />

      <div className="shell pb-24 pt-32 sm:pt-40">
        <p className="kicker" data-intro style={{ '--d': '40ms' }}>
          Scope a project
        </p>
        <h1 className="display mt-4 max-w-[16ch] text-h1">Tell me what you want to build</h1>
        <p className="mt-6 max-w-measure text-lede text-haze" data-intro style={{ '--d': '120ms' }}>
          Four short steps, about three minutes. Nothing is sent until you press Send brief, and
          your answers are saved on this device as you go.
        </p>

        <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-16">
          <div>
            {/* Progress */}
            <nav aria-label="Progress">
              <ol className="grid grid-cols-4 gap-2">
                {STEPS.map(({ id, title }, i) => {
                  const state = status === 'sent' || i < step ? 'done' : i === step ? 'current' : 'todo'
                  return (
                    <li key={id} aria-current={state === 'current' ? 'step' : undefined}>
                      <span
                        className={`block h-1 rounded-full transition-colors duration-500 ${
                          state === 'todo' ? 'bg-lineStrong' : 'bg-amber'
                        }`}
                        aria-hidden="true"
                      />
                      <span className={`mt-3 hidden text-sm sm:block ${state === 'current' ? 'text-chalk' : 'text-faint'}`}>
                        {title}
                      </span>
                      <span className="sr-only">
                        {`Step ${i + 1}: ${title}${state === 'done' ? ' (completed)' : ''}`}
                      </span>
                    </li>
                  )
                })}
              </ol>
            </nav>
            <div className="sr-only" aria-live="polite">
              {status === 'sent' ? 'Brief sent.' : `Step ${step + 1} of ${STEPS.length}`}
            </div>

            {status === 'sent' ? (
              <div className="mt-12">
                <h2 ref={heading} tabIndex={-1} className="display text-h2 focus:outline-none">
                  Brief sent
                </h2>
                <p className="mt-4 max-w-measure text-lede text-haze">
                  Thanks{data.name ? `, ${data.name.trim().split(' ')[0]}` : ''}. I’ll read it and
                  reply to {data.email.trim() || 'your email'} with questions and next steps.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link to="/work" className="btn btn-amber">
                    See the work meanwhile
                  </Link>
                  <button type="button" onClick={startOver} className="btn btn-line">
                    Scope another project
                  </button>
                </div>
              </div>
            ) : (
              <form ref={form} noValidate onSubmit={onSubmit} className="mt-12" aria-labelledby="step-title">
                <h2
                  id="step-title"
                  ref={heading}
                  tabIndex={-1}
                  className="display text-h3 focus:outline-none sm:text-[2rem]"
                >
                  {
                    [
                      'What are you building?',
                      'Describe the project',
                      'When, and roughly for how much?',
                      'Where should I reply?',
                    ][step]
                  }
                </h2>

                <div className="mt-8 space-y-8">
                  {step === 0 && (
                    <RadioGroup
                      name="projectType"
                      legend="Project type"
                      options={PROJECT_TYPES}
                      value={data.projectType}
                      onChange={set('projectType')}
                      error={errors.projectType}
                      columns="grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                    />
                  )}

                  {step === 1 && (
                    <TextField
                      id="description"
                      label="Your brief"
                      rows={7}
                      value={data.description}
                      onChange={(e) => set('description')(e.target.value)}
                      maxLength={3000}
                      required
                      enterKeyHint="next"
                      hint="Who is it for, what should people be able to do, and any sites you like. Rough notes are fine."
                      error={errors.description}
                    />
                  )}

                  {step === 2 && (
                    <>
                      <RadioGroup
                        name="timeline"
                        legend="Timeline"
                        options={TIMELINES}
                        value={data.timeline}
                        onChange={set('timeline')}
                        error={errors.timeline}
                      />
                      <RadioGroup
                        name="budget"
                        legend="Budget"
                        options={BUDGETS}
                        value={data.budget}
                        onChange={set('budget')}
                        error={errors.budget}
                      />
                    </>
                  )}

                  {step === 3 && (
                    <>
                      <TextField
                        id="name"
                        label="Your name"
                        autoComplete="name"
                        value={data.name}
                        onChange={(e) => set('name')(e.target.value)}
                        maxLength={100}
                        required
                        enterKeyHint="next"
                        error={errors.name}
                      />
                      <TextField
                        id="email"
                        label="Email"
                        type="email"
                        autoComplete="email"
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck="false"
                        value={data.email}
                        onChange={(e) => set('email')(e.target.value)}
                        maxLength={200}
                        required
                        enterKeyHint="next"
                        error={errors.email}
                      />
                      <TextField
                        id="phone"
                        label="Phone or WhatsApp"
                        type="tel"
                        autoComplete="tel"
                        value={data.phone}
                        onChange={(e) => set('phone')(e.target.value)}
                        maxLength={40}
                        optional
                        enterKeyHint="done"
                      />
                      {/* Honeypot: hidden from people and assistive tech. */}
                      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                        <label htmlFor="company">Company</label>
                        <input
                          id="company"
                          name="company"
                          tabIndex={-1}
                          autoComplete="off"
                          value={honeypot}
                          onChange={(e) => setHoneypot(e.target.value)}
                        />
                      </div>
                    </>
                  )}
                </div>

                {status === 'error' && (
                  <div role="alert" className="mt-8 rounded-xl border border-amber/60 bg-amber/10 p-5">
                    <p className="font-semibold text-chalk">The brief was not sent.</p>
                    <p className="mt-1 text-haze">{serverError}</p>
                    <p className="mt-3">
                      <a href={mailto} className="link">
                        Send the same brief by email instead
                      </a>
                    </p>
                  </div>
                )}

                <div className="mt-10 flex flex-wrap items-center gap-3">
                  {step > 0 && (
                    <button type="button" onClick={() => go(step - 1)} className="btn btn-line">
                      Back
                    </button>
                  )}
                  <button type="submit" className="btn btn-amber" disabled={status === 'sending'}>
                    {step < STEPS.length - 1 ? 'Continue' : status === 'sending' ? 'Sending…' : 'Send brief'}
                  </button>
                  <span className="text-sm text-faint">
                    Step {step + 1} of {STEPS.length}
                  </span>
                </div>
              </form>
            )}
          </div>

          <aside aria-labelledby="summary-title" className="h-fit rounded-[1.25rem] border border-line bg-deep p-6 lg:sticky lg:top-28">
            <h2 id="summary-title" className="font-semibold text-chalk">
              Your brief so far
            </h2>
            {summary.length ? (
              <dl className="mt-5 space-y-4 text-sm">
                {summary.map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-faint">{k}</dt>
                    <dd className="mt-0.5 line-clamp-4 whitespace-pre-line break-words text-chalk">{v}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="mt-4 text-sm text-haze">Your answers appear here as you go.</p>
            )}
            {summary.length > 0 && status !== 'sent' && (
              <button type="button" onClick={startOver} className="mt-6 text-sm text-haze underline underline-offset-4 hover:text-chalk">
                Clear answers
              </button>
            )}
            <p className="mt-6 border-t border-line pt-5 text-sm text-haze">
              Prefer email?{' '}
              <a href={`mailto:${SITE.email}`} className="link">
                {SITE.email}
              </a>
            </p>
          </aside>
        </div>
      </div>
    </>
  )
}
