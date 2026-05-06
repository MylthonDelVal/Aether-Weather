import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useWeatherStore } from '../store/weatherStore'
import { UnitToggle } from '../components/UnitToggle'

// ─── Store tests ────────────────────────────────────────────────────────────

describe('weatherStore — unit toggle', () => {
  beforeEach(() => useWeatherStore.setState({ unit: 'C' }))

  it('starts in Celsius', () => {
    expect(useWeatherStore.getState().unit).toBe('C')
  })

  it('toggles to Fahrenheit', () => {
    useWeatherStore.getState().toggleUnit()
    expect(useWeatherStore.getState().unit).toBe('F')
  })

  it('toggles back to Celsius', () => {
    useWeatherStore.getState().toggleUnit()
    useWeatherStore.getState().toggleUnit()
    expect(useWeatherStore.getState().unit).toBe('C')
  })
})

describe('weatherStore — temperature conversion', () => {
  it('returns Celsius unchanged', () => {
    useWeatherStore.setState({ unit: 'C' })
    expect(useWeatherStore.getState().getTemp(0)).toBe(0)
    expect(useWeatherStore.getState().getTemp(100)).toBe(100)
  })

  it('converts to Fahrenheit correctly', () => {
    useWeatherStore.setState({ unit: 'F' })
    expect(useWeatherStore.getState().getTemp(0)).toBe(32)
    expect(useWeatherStore.getState().getTemp(100)).toBe(212)
  })
})

// ─── Component tests ─────────────────────────────────────────────────────────

describe('UnitToggle', () => {
  it('renders both unit buttons', () => {
    render(<UnitToggle />)
    expect(screen.getByText('°C')).toBeInTheDocument()
    expect(screen.getByText('°F')).toBeInTheDocument()
  })
})

// ─── Utility tests ───────────────────────────────────────────────────────────

describe('wind speed conversion', () => {
  const msToKmh = (ms) => Math.round(ms * 3.6)

  it('converts 10 m/s to 36 km/h', () => {
    expect(msToKmh(10)).toBe(36)
  })

  it('converts 0 to 0', () => {
    expect(msToKmh(0)).toBe(0)
  })
})
