'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useTareasPendientesController } from '@/modules/tareas-pendientes/presentation/hooks/useTareasPendientesController'
import type { ITareaPendiente, ICreateTareaPendienteDTO, IUpdateTareaPendienteDTO } from '@/modules/tareas-pendientes/domain/entities/TareaPendiente.entities'
import { PageHeader } from '@/shared/components/ui/PageHeader'
import { Button } from '@/shared/components/ui/Button'
import { Modal } from '@/shared/components/ui/Modal'
import { Input } from '@/shared/components/ui/Input'
import { Select } from '@/shared/components/ui/Select'
import { Badge } from '@/shared/components/ui/Badge'
import { Table, THead, TBody, Tr, Th, Td } from '@/shared/components/ui/Table'
import { api } from '@/shared/lib/axios'

interface UsuarioOption {
  id: number
  nombre: string
}

export default function TareasPendientesPage() {
  const { data: session } = useSession()
  const rol = session?.user?.rol
  const isAdmin = rol === 'Administrador' || rol === 'ADMIN'

  const ctrl = useTareasPendientesController()
  const [usuarios, setUsuarios] = useState<UsuarioOption[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<ITareaPendiente | null>(null)

  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [color, setColor] = useState('#10B981')
  const [asignadoAId, setAsignadoAId] = useState<string>('')
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    ctrl._list()
    if (isAdmin) {
      api.get('/usuarios').then((r: { data: UsuarioOption[] }) => setUsuarios(r.data))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin])

  function openCreate() {
    setEditing(null)
    setNombre('')
    setDescripcion('')
    setColor('#10B981')
    setAsignadoAId('')
    setFormError(null)
    setModalOpen(true)
  }

  function openEdit(tp: ITareaPendiente) {
    setEditing(tp)
    setNombre(tp.nombre)
    setDescripcion(tp.descripcion ?? '')
    setColor(tp.color)
    setAsignadoAId(tp.asignadoAId ? String(tp.asignadoAId) : '')
    setFormError(null)
    setModalOpen(true)
  }

  async function handleSubmit() {
    if (!nombre.trim()) {
      setFormError('El nombre es obligatorio')
      return
    }
    setSubmitting(true)
    setFormError(null)
    try {
      if (editing) {
        const dto: IUpdateTareaPendienteDTO = {
          nombre,
          descripcion: descripcion || undefined,
          color,
          asignadoAId: asignadoAId ? Number(asignadoAId) : null,
        }
        await ctrl._update(editing.id, dto)
      } else {
        const dto: ICreateTareaPendienteDTO = {
          nombre,
          descripcion: descripcion || undefined,
          color,
          asignadoAId: asignadoAId ? Number(asignadoAId) : null,
        }
        await ctrl._create(dto)
      }
      setModalOpen(false)
    } catch (e: unknown) {
      const err = e as Record<string, unknown>
      const msg = (err?.response as Record<string, unknown>)?.data as Record<string, unknown>
      setFormError((msg?.error as string) ?? (err?.message as string) ?? 'Error al guardar')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(tp: ITareaPendiente) {
    if (!confirm(`¿Eliminar "${tp.nombre}"?`)) return
    await ctrl._delete(tp.id)
  }

  return (
    <div>
      <PageHeader
        title='Tareas Pendientes'
        subtitle={isAdmin ? 'Asigná tareas a los trabajadores' : 'Tareas disponibles para agendar'}
        actions={
          isAdmin ? (
            <Button variant='primary' size='md' onClick={openCreate}>
              + Nueva pendiente
            </Button>
          ) : undefined
        }
      />

      {ctrl.error && <p style={{ color: '#c0392b', fontSize: '0.875rem', marginBottom: '8px' }}>{ctrl.error}</p>}

      {ctrl.loading ? (
        <p style={{ color: 'var(--color-text-soft)' }}>Cargando…</p>
      ) : (
        <Table>
          <THead>
            <Tr>
              <Th>Nombre</Th>
              <Th>Descripción</Th>
              <Th>Asignado a</Th>
              <Th>Estado</Th>
              {isAdmin && <Th>Acciones</Th>}
            </Tr>
          </THead>
          <TBody>
            {ctrl.pendientes.length === 0 ? (
              <Tr>
                <Td colSpan={isAdmin ? 5 : 4} style={{ textAlign: 'center', color: 'var(--color-text-soft)' }}>
                  No hay tareas pendientes.
                </Td>
              </Tr>
            ) : (
              ctrl.pendientes.map((tp) => (
                <Tr key={tp.id}>
                  <Td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          backgroundColor: tp.color,
                          flexShrink: 0,
                        }}
                      />
                      {tp.nombre}
                    </span>
                  </Td>
                  <Td style={{ color: 'var(--color-text-soft)' }}>{tp.descripcion ?? '—'}</Td>
                  <Td>{tp.asignadoANombre ?? <Badge variant='neutral'>Todos</Badge>}</Td>
                  <Td>{tp.reclamada ? <Badge variant='success'>Agendada</Badge> : <Badge variant='warning'>Pendiente</Badge>}</Td>
                  {isAdmin && (
                    <Td>
                      <span style={{ display: 'flex', gap: '8px' }}>
                        <Button variant='ghost' size='sm' onClick={() => openEdit(tp)}>
                          Editar
                        </Button>
                        <Button variant='danger' size='sm' onClick={() => handleDelete(tp)}>
                          Eliminar
                        </Button>
                      </span>
                    </Td>
                  )}
                </Tr>
              ))
            )}
          </TBody>
        </Table>
      )}

      {/* Modal crear/editar (admin only) */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar pendiente' : 'Nueva tarea pendiente'}
        footer={
          <span style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <Button variant='ghost' size='md' onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant='primary' size='md' onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Guardando…' : 'Guardar'}
            </Button>
          </span>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {formError && <p style={{ color: '#c0392b', fontSize: '0.875rem' }}>{formError}</p>}
          <Input label='Nombre' value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder='Nombre de la tarea' />
          <Input label='Descripción' value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder='Opcional' />
          <Select label='Asignar a' value={asignadoAId} onChange={(e) => setAsignadoAId(e.target.value)}>
            <option value=''>Todos (pool general)</option>
            {usuarios.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nombre}
              </option>
            ))}
          </Select>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Color</span>
            <input
              type='color'
              value={color}
              onChange={(e) => setColor(e.target.value)}
              style={{ width: '40px', height: '30px', border: '1px solid var(--color-border)', borderRadius: '6px', cursor: 'pointer' }}
            />
          </label>
        </div>
      </Modal>
    </div>
  )
}
