import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { esAdmin } from '@/shared/lib/auth-guards'
import { ListasView } from '@/views/Listas/ListasView'

export default async function ListasPage() {
  const session = await auth()
  if (!session || !esAdmin(session.user?.rol)) {
    redirect('/tareas')
  }
  return <ListasView />
}
