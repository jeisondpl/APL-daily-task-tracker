'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useListasController } from '@/modules/listas-tareas/presentation/hooks/useListasController'
import type { IListaTarea, ICreateListaDTO, IUpdateListaDTO } from '@/modules/listas-tareas/domain/entities/ListaTarea.entities'
import { PageHeader } from '@/shared/components/ui/PageHeader'
import { Button } from '@/shared/components/ui/Button'
import { Modal } from '@/shared/components/ui/Modal'
import { Input } from '@/shared/components/ui/Input'
import { Badge } from '@/shared/components/ui/Badge'
import { Table, THead, TBody, Tr, Th, Td } from '@/shared/components/ui/Table'

// Minimal inline form state — no react-hook-form needed for a 3-field form
interface ListaFormState {
  nombre: string
  descripcion: string
  colorDefault: string
  esCompartida: boolean
}

const EMPTY_FORM: ListaFormState = {
  nombre: '',
  descripcion: '',
  colorDefault: '#10B981',
  esCompartida: false,
}

export function ListasView() {
  const { listas, loading, error, _list, _create, _update, _delete } = useListasController()
  const { data: session } = useSession()
  const currentUserId = (session?.user as { userId?: number })?.userId

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingLista, setEditingLista] = useState<IListaTarea | null>(null)
  const [formState, setFormState] = useState<ListaFormState>(EMPTY_FORM)
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    _list()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function openCreate() {
    setEditingLista(null)
    setFormState(EMPTY_FORM)
    setFormError(null)
    setIsModalOpen(true)
  }

  function openEdit(lista: IListaTarea) {
    setEditingLista(lista)
    setFormState({
      nombre: lista.nombre,
      descripcion: lista.descripcion ?? '',
      colorDefault: lista.colorDefault ?? '#10B981',
      esCompartida: lista.esCompartida ?? false,
    })
    setFormError(null)
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setEditingLista(null)
  }

  async function handleSubmit() {
    if (!formState.nombre.trim()) {
      setFormError('El nombre es obligatorio')
      return
    }
    setSubmitting(true)
    setFormError(null)
    try {
      if (editingLista) {
        const dto: IUpdateListaDTO = {
          nombre: formState.nombre,
          descripcion: formState.descripcion || undefined,
          colorDefault: formState.colorDefault || undefined,
          esCompartida: formState.esCompartida,
        }
        await _update(editingLista.id, dto)
      } else {
        const dto: ICreateListaDTO = {
          nombre: formState.nombre,
          descripcion: formState.descripcion || undefined,
          colorDefault: formState.colorDefault || undefined,
          esCompartida: formState.esCompartida,
        }
        await _create(dto)
      }
      closeModal()
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Error al guardar')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(lista: IListaTarea) {
    if (!window.confirm(`¿Eliminar la lista "${lista.nombre}"? Se eliminarán también todas sus tareas.`)) return
    await _delete(lista.id)
  }

  return (
    <div>
      <PageHeader
        title='Listas'
        subtitle='Organizá tus tareas en listas'
        actions={
          <Button variant='primary' size='md' onClick={openCreate}>
            + Nueva lista
          </Button>
        }
      />

      {error && (
        <p
          style={{
            color: 'var(--color-danger, #c0392b)',
            marginBottom: '12px',
            fontSize: '0.875rem',
          }}
        >
          {error}
        </p>
      )}

      {loading ? (
        <p style={{ color: 'var(--color-text-soft)' }}>Cargando listas…</p>
      ) : (
        <Table>
          <THead>
            <Tr>
              <Th>Nombre</Th>
              <Th>Descripción</Th>
              <Th>Color</Th>
              <Th>Tareas</Th>
              <Th>Compartida</Th>
              <Th>Propietario</Th>
              <Th>Acciones</Th>
            </Tr>
          </THead>
          <TBody>
            {listas.length === 0 ? (
              <Tr>
                <Td colSpan={7} style={{ textAlign: 'center', color: 'var(--color-text-soft)' }}>
                  No hay listas todavía. ¡Creá una nueva!
                </Td>
              </Tr>
            ) : (
              listas.map((lista) => {
                const isOwner = lista.ownerId === currentUserId
                return (
                  <Tr key={lista.id}>
                    <Td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {lista.colorDefault && (
                          <span
                            style={{
                              width: '14px',
                              height: '14px',
                              borderRadius: '50%',
                              backgroundColor: lista.colorDefault,
                              flexShrink: 0,
                              border: '1px solid var(--color-border)',
                            }}
                          />
                        )}
                        {lista.nombre}
                      </span>
                    </Td>
                    <Td style={{ color: 'var(--color-text-soft)' }}>{lista.descripcion ?? '—'}</Td>
                    <Td style={{ color: 'var(--color-text-soft)', fontSize: '0.75rem' }}>{lista.colorDefault ?? '—'}</Td>
                    <Td>
                      <Badge variant='neutral'>{lista.tareasCount ?? 0}</Badge>
                    </Td>
                    <Td>{lista.esCompartida ? <Badge variant='success'>Sí</Badge> : <Badge variant='neutral'>No</Badge>}</Td>
                    <Td style={{ color: 'var(--color-text-soft)', fontSize: '0.8125rem' }}>{isOwner ? 'Vos' : (lista.ownerNombre ?? '—')}</Td>
                    <Td>
                      {isOwner ? (
                        <span style={{ display: 'flex', gap: '8px' }}>
                          <Button variant='ghost' size='sm' onClick={() => openEdit(lista)}>
                            Editar
                          </Button>
                          <Button variant='danger' size='sm' onClick={() => handleDelete(lista)}>
                            Eliminar
                          </Button>
                        </span>
                      ) : (
                        <span style={{ color: 'var(--color-text-soft)', fontSize: '0.8125rem' }}>—</span>
                      )}
                    </Td>
                  </Tr>
                )
              })
            )}
          </TBody>
        </Table>
      )}

      <Modal
        open={isModalOpen}
        onClose={closeModal}
        title={editingLista ? 'Editar lista' : 'Nueva lista'}
        footer={
          <span style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <Button variant='ghost' size='md' onClick={closeModal}>
              Cancelar
            </Button>
            <Button variant='primary' size='md' onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Guardando…' : 'Guardar'}
            </Button>
          </span>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {formError && <p style={{ color: 'var(--color-danger, #c0392b)', fontSize: '0.875rem' }}>{formError}</p>}
          <Input
            label='Nombre'
            type='text'
            value={formState.nombre}
            onChange={(e) => setFormState((prev) => ({ ...prev, nombre: e.target.value }))}
            placeholder='Nombre de la lista'
          />
          <Input
            label='Descripción'
            type='text'
            value={formState.descripcion}
            onChange={(e) => setFormState((prev) => ({ ...prev, descripcion: e.target.value }))}
            placeholder='Descripción (opcional)'
          />
          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span
              style={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'var(--color-text)',
              }}
            >
              Color por defecto
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type='color'
                value={formState.colorDefault || '#10B981'}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    colorDefault: e.target.value,
                  }))
                }
                style={{
                  width: '56px',
                  height: '36px',
                  padding: '2px',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  background: 'var(--color-surface)',
                  cursor: 'pointer',
                }}
              />
              <code
                style={{
                  fontSize: '0.8125rem',
                  color: 'var(--color-text-soft)',
                }}
              >
                {(formState.colorDefault || '#10B981').toUpperCase()}
              </code>
            </span>
          </label>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            <input
              type='checkbox'
              checked={formState.esCompartida}
              onChange={(e) => setFormState((prev) => ({ ...prev, esCompartida: e.target.checked }))}
              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text)' }}>Compartir con todos los usuarios</span>
          </label>
        </div>
      </Modal>
    </div>
  )
}
