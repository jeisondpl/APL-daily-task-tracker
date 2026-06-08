'use client'

import { useEffect, useState } from 'react'
import { useTareasPendientesController } from '@/modules/tareas-pendientes/presentation/hooks/useTareasPendientesController'
import type { IReclamarTareaPendienteDTO } from '@/modules/tareas-pendientes/domain/entities/TareaPendiente.entities'
import { Button } from '@/shared/components/ui/Button'
import { Modal } from '@/shared/components/ui/Modal'
import { Select } from '@/shared/components/ui/Select'
import { Input } from '@/shared/components/ui/Input'

const SLOTS: string[] = []
for (let h = 5; h <= 23; h++) {
  SLOTS.push(`${String(h).padStart(2, '0')}:00`)
  if (h < 23) SLOTS.push(`${String(h).padStart(2, '0')}:30`)
}

interface Props {
  fecha: string
  onReclamada: () => void
}

export function MisPendientes({ fecha, onReclamada }: Props) {
  const ctrl = useTareasPendientesController()
  const [collapsed, setCollapsed] = useState(false)
  const [reclamarId, setReclamarId] = useState<number | null>(null)
  const [horaInicio, setHoraInicio] = useState('08:00')
  const [horaFin, setHoraFin] = useState('09:00')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    ctrl._list()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (ctrl.pendientes.length === 0 && !ctrl.loading) return null

  async function handleReclamar() {
    if (horaFin <= horaInicio) {
      setFormError('Hora fin debe ser mayor')
      return
    }
    setSubmitting(true)
    setFormError(null)
    try {
      const dto: IReclamarTareaPendienteDTO = {
        fecha,
        horaInicio,
        horaFin,
      }
      await ctrl._reclamar(reclamarId!, dto)
      setReclamarId(null)
      onReclamada()
    } catch (e: unknown) {
      const err = e as Record<string, unknown>
      const msg = (err?.response as Record<string, unknown>)?.data as Record<string, unknown>
      setFormError((msg?.error as string) ?? (err?.message as string) ?? 'Error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      style={{
        marginBottom: '20px',
        border: '1px solid var(--color-border)',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      <button
        type='button'
        onClick={() => setCollapsed((c) => !c)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 16px',
          background: 'var(--color-surface-alt, var(--color-surface))',
          border: 'none',
          cursor: 'pointer',
          fontSize: '0.9rem',
          fontWeight: 600,
          color: 'var(--color-text)',
        }}
      >
        <span>📋 Tareas pendientes asignadas ({ctrl.pendientes.length})</span>
        <span>{collapsed ? '▸' : '▾'}</span>
      </button>

      {!collapsed && (
        <div style={{ padding: '8px 16px 12px' }}>
          {ctrl.loading ? (
            <p style={{ color: 'var(--color-text-soft)', fontSize: '0.8125rem' }}>Cargando…</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {ctrl.pendientes.map((tp) => (
                <li
                  key={tp.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: tp.color,
                      }}
                    />
                    <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{tp.nombre}</span>
                    {tp.descripcion && <span style={{ color: 'var(--color-text-soft)', fontSize: '0.75rem' }}>— {tp.descripcion}</span>}
                    {tp.listaNombre && (
                      <span
                        style={{
                          fontSize: '0.7rem',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: 'var(--color-bg-soft, #f0f0f0)',
                          color: 'var(--color-text-soft)',
                          border: '1px solid var(--color-border)',
                        }}
                      >
                        📋 {tp.listaNombre}
                      </span>
                    )}
                    {tp.avancePct !== undefined && (
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: (tp.avancePct ?? 0) < (tp.avanceEsperadoHoy ?? 0) - 10 ? '#fdecea' : '#e8f5e9',
                          color: (tp.avancePct ?? 0) < (tp.avanceEsperadoHoy ?? 0) - 10 ? '#c0392b' : '#27ae60',
                        }}
                      >
                        {tp.avancePct}% avance
                      </span>
                    )}
                  </span>
                  <Button
                    variant='primary'
                    size='sm'
                    onClick={() => {
                      setReclamarId(tp.id)
                      setHoraInicio('08:00')
                      setHoraFin('09:00')
                      setFormError(null)
                    }}
                  >
                    Agendar
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Modal reclamar */}
      <Modal
        open={reclamarId !== null}
        onClose={() => setReclamarId(null)}
        title='Agendar tarea'
        footer={
          <span style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <Button variant='ghost' size='md' onClick={() => setReclamarId(null)}>
              Cancelar
            </Button>
            <Button variant='primary' size='md' onClick={handleReclamar} disabled={submitting}>
              {submitting ? 'Agendando…' : 'Confirmar'}
            </Button>
          </span>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {formError && <p style={{ color: '#c0392b', fontSize: '0.875rem' }}>{formError}</p>}
          <Input label='Fecha' type='date' value={fecha} disabled />
          <Select label='Hora inicio' value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)}>
            {SLOTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
          <Select label='Hora fin' value={horaFin} onChange={(e) => setHoraFin(e.target.value)}>
            {SLOTS.filter((s) => s > horaInicio).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </div>
      </Modal>
    </div>
  )
}
