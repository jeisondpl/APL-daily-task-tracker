"use client";

import { useEffect, useState } from "react";
import { useUsuariosController } from "@/modules/usuarios/presentation/hooks/useUsuariosController";
import type {
  IUsuario,
  ICreateUsuarioDTO,
  IUpdateUsuarioDTO,
} from "@/modules/usuarios/domain/entities/Usuario.entities";
import { PageHeader } from "@/shared/components/ui/PageHeader";
import { Button } from "@/shared/components/ui/Button";
import { Modal } from "@/shared/components/ui/Modal";
import { Input } from "@/shared/components/ui/Input";
import { Select } from "@/shared/components/ui/Select";
import { Badge } from "@/shared/components/ui/Badge";
import { Table, THead, TBody, Tr, Th, Td } from "@/shared/components/ui/Table";

interface FormState {
  nombre: string;
  email: string;
  password: string;
  rolId: number;
  activo: boolean;
}

const EMPTY: FormState = {
  nombre: "",
  email: "",
  password: "",
  rolId: 0,
  activo: true,
};

export function UsuariosView() {
  const ctrl = useUsuariosController();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<IUsuario | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    ctrl._list();
    ctrl._listRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openCreate() {
    setEditing(null);
    setForm({ ...EMPTY, rolId: ctrl.roles[0]?.id ?? 0 });
    setFormError(null);
    setOpen(true);
  }

  function openEdit(u: IUsuario) {
    setEditing(u);
    setForm({
      nombre: u.nombre,
      email: u.email,
      password: "",
      rolId: u.rolId,
      activo: u.activo,
    });
    setFormError(null);
    setOpen(true);
  }

  async function handleSubmit() {
    if (!form.nombre.trim()) return setFormError("El nombre es obligatorio");
    if (!form.email.trim()) return setFormError("El email es obligatorio");
    if (!form.rolId) return setFormError("Seleccioná un rol");
    if (!editing && form.password.length < 6) {
      return setFormError("La contraseña debe tener al menos 6 caracteres");
    }
    if (editing && form.password && form.password.length < 6) {
      return setFormError("La contraseña debe tener al menos 6 caracteres");
    }

    setSaving(true);
    setFormError(null);
    try {
      if (editing) {
        const dto: IUpdateUsuarioDTO = {
          nombre: form.nombre.trim(),
          email: form.email.trim(),
          rolId: form.rolId,
          activo: form.activo,
          ...(form.password ? { password: form.password } : {}),
        };
        await ctrl._update(editing.id, dto);
      } else {
        const dto: ICreateUsuarioDTO = {
          nombre: form.nombre.trim(),
          email: form.email.trim(),
          password: form.password,
          rolId: form.rolId,
          activo: form.activo,
        };
        await ctrl._create(dto);
      }
      if (ctrl.error) {
        setFormError(ctrl.error);
      } else {
        setOpen(false);
      }
    } catch {
      setFormError("No se pudo guardar el usuario");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(u: IUsuario) {
    if (!window.confirm(`¿Eliminar a "${u.nombre}" (${u.email})?`)) return;
    await ctrl._delete(u.id);
  }

  return (
    <div>
      <PageHeader
        title="Usuarios"
        subtitle="Gestión de usuarios y roles"
        actions={
          <Button variant="primary" size="md" onClick={openCreate}>
            + Nuevo usuario
          </Button>
        }
      />

      {ctrl.error && (
        <p style={{ color: "#c0392b", fontSize: "0.875rem", marginBottom: "12px" }}>
          {ctrl.error}
        </p>
      )}

      {ctrl.loading ? (
        <p style={{ color: "var(--color-text-soft)" }}>Cargando usuarios…</p>
      ) : (
        <Table>
          <THead>
            <Tr>
              <Th>Nombre</Th>
              <Th>Email</Th>
              <Th>Rol</Th>
              <Th>Estado</Th>
              <Th>Acciones</Th>
            </Tr>
          </THead>
          <TBody>
            {ctrl.usuarios.length === 0 ? (
              <Tr>
                <Td colSpan={5} style={{ textAlign: "center", color: "var(--color-text-soft)" }}>
                  No hay usuarios.
                </Td>
              </Tr>
            ) : (
              ctrl.usuarios.map((u) => (
                <Tr key={u.id}>
                  <Td>{u.nombre}</Td>
                  <Td style={{ color: "var(--color-text-soft)" }}>{u.email}</Td>
                  <Td>
                    <Badge variant={u.rolNombre === "Administrador" ? "info" : "neutral"}>
                      {u.rolNombre ?? "—"}
                    </Badge>
                  </Td>
                  <Td>
                    <Badge variant={u.activo ? "success" : "danger"}>
                      {u.activo ? "Activo" : "Inactivo"}
                    </Badge>
                  </Td>
                  <Td>
                    <span style={{ display: "flex", gap: "8px" }}>
                      <Button variant="ghost" size="sm" onClick={() => openEdit(u)}>
                        Editar
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(u)}>
                        Eliminar
                      </Button>
                    </span>
                  </Td>
                </Tr>
              ))
            )}
          </TBody>
        </Table>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Editar usuario" : "Nuevo usuario"}
        footer={
          <span style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
            <Button variant="ghost" size="md" onClick={() => setOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button variant="primary" size="md" onClick={handleSubmit} disabled={saving}>
              {saving ? "Guardando…" : "Guardar"}
            </Button>
          </span>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {formError && (
            <p style={{ color: "#c0392b", fontSize: "0.875rem" }}>{formError}</p>
          )}
          <Input
            label="Nombre"
            value={form.nombre}
            onChange={(e) => setForm((p) => ({ ...p, nombre: e.target.value }))}
            placeholder="Nombre completo"
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            placeholder="usuario@dominio.com"
          />
          <Input
            label={
              editing ? "Contraseña (dejar vacío para no cambiar)" : "Contraseña"
            }
            type="password"
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            placeholder={editing ? "••••••" : "mínimo 6 caracteres"}
          />
          <Select
            label="Rol"
            value={form.rolId}
            onChange={(e) => setForm((p) => ({ ...p, rolId: Number(e.target.value) }))}
            options={ctrl.roles.map((r) => ({ value: r.id, label: r.nombre }))}
          />
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "0.875rem",
              color: "var(--color-text)",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={form.activo}
              onChange={(e) => setForm((p) => ({ ...p, activo: e.target.checked }))}
            />
            Usuario activo
          </label>
        </div>
      </Modal>
    </div>
  );
}
