import { useEffect, useState } from 'react'
import './App.css'
import Login from './components/login'
import FamilySetup from './components/FamilySetup'
import AvatarUploader from './components/AvatarUploader'
import { supabase } from './lib/supabaseClient'

const convertirBase64AUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  return Uint8Array.from([...rawData].map((caracter) => caracter.charCodeAt(0)))
}

const CLAVE_DISPOSITIVO = 'agenda_familiar_dispositivo_id'

const obtenerDispositivoId = () => {
  let dispositivoId = localStorage.getItem(CLAVE_DISPOSITIVO)

  if (!dispositivoId) {
    dispositivoId =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`

    localStorage.setItem(CLAVE_DISPOSITIVO, dispositivoId)
  }

  return dispositivoId
}

function App() {
  const obtenerFechaLocalHoy = () => {
    const hoy = new Date()
    const anio = hoy.getFullYear()
    const mes = String(hoy.getMonth() + 1).padStart(2, '0')
    const dia = String(hoy.getDate()).padStart(2, '0')

    return `${anio}-${mes}-${dia}`
  }

  const fechaMinimaPermitida = obtenerFechaLocalHoy()

  const [usuario, setUsuario] = useState(null)
  const [cargandoSesion, setCargandoSesion] = useState(true)

  const [familia, setFamilia] = useState(null)
  const [miembros, setMiembros] = useState([])
  const [seccion, setSeccion] = useState('inicio')
  const [cargandoFamilia, setCargandoFamilia] = useState(false)

  const [mostrarModalIntegrante, setMostrarModalIntegrante] =
    useState(false)

  const [nombreNuevoIntegrante, setNombreNuevoIntegrante] =
    useState('')

  const [colorNuevoIntegrante, setColorNuevoIntegrante] =
    useState('#6754e7')

  const [guardandoIntegrante, setGuardandoIntegrante] =
    useState(false)

  const [mensajeIntegrante, setMensajeIntegrante] =
    useState('')
    const [miembroEditando, setMiembroEditando] =
  useState(null)

const [nombreEditado, setNombreEditado] =
  useState('')

const [colorEditado, setColorEditado] =
  useState('#6754e7')

const [guardandoEdicion, setGuardandoEdicion] =
  useState(false)

const [mensajeEdicion, setMensajeEdicion] =
  useState('')

  const [eliminandoIntegrante, setEliminandoIntegrante] =
  useState(false)

  const [mostrarConfirmacionEliminar, setMostrarConfirmacionEliminar] =
    useState(false)

  const [eventos, setEventos] = useState([])
  const [cargandoEventos, setCargandoEventos] = useState(false)
  const [mostrarModalEvento, setMostrarModalEvento] = useState(false)
  const [tituloEvento, setTituloEvento] = useState('')
  const [descripcionEvento, setDescripcionEvento] = useState('')
  const [fechaEvento, setFechaEvento] = useState('')
  const [horaEvento, setHoraEvento] = useState('')
  const [todoElDiaEvento, setTodoElDiaEvento] = useState(false)
  const [recordatorioEvento, setRecordatorioEvento] = useState('')
  const [asignadosEvento, setAsignadosEvento] = useState([])
  const [guardandoEvento, setGuardandoEvento] = useState(false)
  const [mensajeEvento, setMensajeEvento] = useState('')

  const [mostrarConfirmacionSalir, setMostrarConfirmacionSalir] =
    useState(false)

  const [eventoEditando, setEventoEditando] = useState(null)
  const [mostrarConfirmacionEliminarEvento, setMostrarConfirmacionEliminarEvento] =
    useState(false)
  const [eliminandoEvento, setEliminandoEvento] = useState(false)

  const [tareas, setTareas] = useState([])
  const [cargandoTareas, setCargandoTareas] = useState(false)
  const [mostrarModalTarea, setMostrarModalTarea] = useState(false)
  const [nombreTarea, setNombreTarea] = useState('')
  const [descripcionTarea, setDescripcionTarea] = useState('')
  const [prioridadTarea, setPrioridadTarea] = useState('media')
  const [fechaLimiteTarea, setFechaLimiteTarea] = useState('')
  const [asignadosTarea, setAsignadosTarea] = useState([])
  const [guardandoTarea, setGuardandoTarea] = useState(false)
  const [mensajeTarea, setMensajeTarea] = useState('')
  const [tareasEliminandose, setTareasEliminandose] = useState([])
  const [tareaEditando, setTareaEditando] = useState(null)
  const [mostrarConfirmacionEliminarTarea, setMostrarConfirmacionEliminarTarea] =
    useState(false)
  const [eliminandoTarea, setEliminandoTarea] = useState(false)

  const [listasCompras, setListasCompras] = useState([])
  const [cargandoCompras, setCargandoCompras] = useState(false)
  const [mostrarModalListaCompra, setMostrarModalListaCompra] = useState(false)
  const [nombreListaCompra, setNombreListaCompra] = useState('')
  const [guardandoListaCompra, setGuardandoListaCompra] = useState(false)
  const [mensajeListaCompra, setMensajeListaCompra] = useState('')
  const [listaCompraSeleccionada, setListaCompraSeleccionada] = useState(null)
  const [nombreProductoCompra, setNombreProductoCompra] = useState('')
  const [cantidadProductoCompra, setCantidadProductoCompra] = useState('')
  const [guardandoProductoCompra, setGuardandoProductoCompra] = useState(false)
  const [mensajeProductoCompra, setMensajeProductoCompra] = useState('')
  const [finalizandoListaCompra, setFinalizandoListaCompra] = useState(false)
  const [listaCompraAEliminar, setListaCompraAEliminar] = useState(null)
  const [eliminandoListaCompra, setEliminandoListaCompra] = useState(false)

  const [gastos, setGastos] = useState([])
  const [cargandoGastos, setCargandoGastos] = useState(false)
  const [mostrarModalGasto, setMostrarModalGasto] = useState(false)
  const [conceptoGasto, setConceptoGasto] = useState('')
  const [montoGasto, setMontoGasto] = useState('')
  const [categoriaGasto, setCategoriaGasto] = useState('supermercado')
  const [pagadoPorGasto, setPagadoPorGasto] = useState('')
  const [fechaGasto, setFechaGasto] = useState('')
  const [notaGasto, setNotaGasto] = useState('')
  const [guardandoGasto, setGuardandoGasto] = useState(false)
  const [mensajeGasto, setMensajeGasto] = useState('')
  const [gastoEditando, setGastoEditando] = useState(null)
  const [gastoAEliminar, setGastoAEliminar] = useState(null)
  const [eliminandoGasto, setEliminandoGasto] = useState(false)
  const [notificacionesActivas, setNotificacionesActivas] = useState(false)
  const [activandoNotificaciones, setActivandoNotificaciones] = useState(false)
  const [mensajeNotificaciones, setMensajeNotificaciones] = useState('')
  const [codigoInvitacionCopiado, setCodigoInvitacionCopiado] = useState(false)
  const [dispositivoId] = useState(() => obtenerDispositivoId())
  const [loginReciente, setLoginReciente] = useState(false)
  const [novedadesTareas, setNovedadesTareas] = useState(0)

  useEffect(() => {
    if (!mensajeNotificaciones) return

    const temporizador = window.setTimeout(() => {
      setMensajeNotificaciones('')
    }, 3000)

    return () => {
      window.clearTimeout(temporizador)
    }
  }, [mensajeNotificaciones])

  useEffect(() => {
    const cargarSesion = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        const usuarioSesion = data.session?.user ?? null

        if (!usuarioSesion) {
          setUsuario(null)
          return
        }

        const { data: sesionDispositivo, error } = await supabase
          .from('sesiones_dispositivo')
          .select('estado')
          .eq('user_id', usuarioSesion.id)
          .eq('dispositivo_id', dispositivoId)
          .maybeSingle()

        if (error) {
          console.error(
            'No se pudo validar la sesión del dispositivo:',
            error
          )
        }

        if (
          sesionDispositivo?.estado === 'expirada' ||
          sesionDispositivo?.estado === 'cerrada_manual'
        ) {
          await supabase.auth.signOut({ scope: 'local' })
          setUsuario(null)
          return
        }

        setUsuario(usuarioSesion)
      } catch (error) {
        console.error('Error al cargar la sesión:', error)
        setUsuario(null)
      } finally {
        setCargandoSesion(false)
      }
    }

    cargarSesion()

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((evento, session) => {
      if (evento === 'INITIAL_SESSION') {
        return
      }

      if (evento === 'SIGNED_IN') {
        setLoginReciente(true)
      }

      if (evento === 'SIGNED_OUT') {
        setLoginReciente(false)
      }

      setUsuario(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [dispositivoId])

  useEffect(() => {
    const revisarNotificaciones = async () => {
      if (!usuario?.id || !dispositivoId) {
        setNotificacionesActivas(false)
        return
      }

      if (
        !('serviceWorker' in navigator) ||
        !('PushManager' in window) ||
        !('Notification' in window)
      ) {
        return
      }

      try {
        const registro = await navigator.serviceWorker.register('/sw.js')
        await navigator.serviceWorker.ready

        const suscripcion = await registro.pushManager.getSubscription()

        const pushActiva =
          Notification.permission === 'granted' && Boolean(suscripcion)

        setNotificacionesActivas(pushActiva)

        // Si este navegador ya tenía Push autorizado, sincronizamos
        // automáticamente esa suscripción con el dispositivo actual.
        // Así no es necesario volver a pulsar la campana después de iniciar sesión.
        if (pushActiva && suscripcion) {
          const datos = suscripcion.toJSON()

          const { error: errorLimpiarSuscripciones } = await supabase
            .from('push_suscripciones')
            .delete()
            .eq('user_id', usuario.id)
            .eq('dispositivo_id', dispositivoId)
            .neq('endpoint', datos.endpoint)

          if (errorLimpiarSuscripciones) {
            console.error(
              'No se pudieron limpiar suscripciones antiguas del dispositivo:',
              errorLimpiarSuscripciones
            )
          }

          const { error: errorPush } = await supabase
            .from('push_suscripciones')
            .upsert(
              {
                user_id: usuario.id,
                dispositivo_id: dispositivoId,
                endpoint: datos.endpoint,
                p256dh: datos.keys?.p256dh,
                auth: datos.keys?.auth
              },
              {
                onConflict: 'endpoint'
              }
            )

          if (errorPush) {
            throw errorPush
          }

          const { error: errorSesion } = await supabase
            .from('sesiones_dispositivo')
            .upsert(
              {
                user_id: usuario.id,
                dispositivo_id: dispositivoId,
                endpoint_push: datos.endpoint,
                ultima_actividad: new Date().toISOString(),
                estado: 'activa',
                notificado_cierre: false
              },
              {
                onConflict: 'user_id,dispositivo_id'
              }
            )

          if (errorSesion) {
            throw errorSesion
          }
        }
      } catch (error) {
        console.error(
          'Error al revisar/sincronizar notificaciones:',
          error
        )
      }
    }

    revisarNotificaciones()
  }, [usuario?.id, dispositivoId])

  useEffect(() => {
    if (!usuario?.id || !dispositivoId) return

    let intervaloActividad = null
    let desmontado = false
    let cerrandoPorInactividad = false

    const cerrarSesionLocalPorInactividad = async () => {
      if (cerrandoPorInactividad) return

      cerrandoPorInactividad = true

      try {
        // Cierra solamente la sesión de este navegador/dispositivo.
        // No elimina push_suscripciones, por lo que los Push familiares
        // siguen llegando aunque la app quede en Login.
        await supabase.auth.signOut({ scope: 'local' })
      } catch (error) {
        console.error(
          'Error al cerrar la sesión local por inactividad:',
          error
        )
      } finally {
        setLoginReciente(false)
        setUsuario(null)
      }
    }

    const registrarActividadDispositivo = async () => {
      try {
        const { data: sesionActual, error: errorSesionActual } =
          await supabase
            .from('sesiones_dispositivo')
            .select('estado')
            .eq('user_id', usuario.id)
            .eq('dispositivo_id', dispositivoId)
            .maybeSingle()

        if (errorSesionActual) {
          throw errorSesionActual
        }

        if (
          sesionActual?.estado === 'expirada' ||
          sesionActual?.estado === 'cerrada_manual'
        ) {
          if (!loginReciente) {
            await cerrarSesionLocalPorInactividad()
            return
          }
        }

        let endpointPush = null

        if (
          'serviceWorker' in navigator &&
          'PushManager' in window
        ) {
          const registro = await navigator.serviceWorker.register('/sw.js')
          const suscripcion = await registro.pushManager.getSubscription()
          endpointPush = suscripcion?.endpoint ?? null
        }

        if (desmontado || cerrandoPorInactividad) return

        const { error } = await supabase
          .from('sesiones_dispositivo')
          .upsert(
            {
              user_id: usuario.id,
              dispositivo_id: dispositivoId,
              endpoint_push: endpointPush,
              ultima_actividad: new Date().toISOString(),
              estado: 'activa',
              notificado_cierre: false
            },
            {
              onConflict: 'user_id,dispositivo_id'
            }
          )

        if (error) {
          throw error
        }

        if (loginReciente) {
          setLoginReciente(false)
        }
      } catch (error) {
        console.error(
          'Error al registrar actividad del dispositivo:',
          error
        )
      }
    }

    const registrarSiVisible = () => {
      if (document.visibilityState === 'visible') {
        registrarActividadDispositivo()
      }
    }

    registrarActividadDispositivo()

    intervaloActividad = window.setInterval(() => {
      registrarActividadDispositivo()
    }, 60 * 1000)

    window.addEventListener('focus', registrarActividadDispositivo)
    document.addEventListener('visibilitychange', registrarSiVisible)

    return () => {
      desmontado = true

      if (intervaloActividad) {
        window.clearInterval(intervaloActividad)
      }

      window.removeEventListener('focus', registrarActividadDispositivo)
      document.removeEventListener('visibilitychange', registrarSiVisible)
    }
  }, [usuario?.id, dispositivoId, loginReciente])

  useEffect(() => {
    const cargarFamilia = async () => {
      if (!usuario) {
        setFamilia(null)
        setMiembros([])
        return
      }

      setCargandoFamilia(true)

      const { data, error } = await supabase
        .from('miembros_familia')
        .select(`
          familia_id,
          familias (
            id,
            nombre,
            codigo_invitacion
          )
        `)
        .eq('user_id', usuario.id)
        .maybeSingle()

      if (error) {
        console.error('Error al cargar familia:', error)
        setFamilia(null)
        setMiembros([])
        setCargandoFamilia(false)
        return
      }

      const familiaEncontrada = data?.familias ?? null

      setFamilia(familiaEncontrada)

      if (familiaEncontrada) {
        const { data: integrantes, error: errorIntegrantes } =
          await supabase
            .from('miembros_familia')
            .select(`
              id,
              user_id,
              nombre,
              color,
              avatar_url,
              rol,
              tipo
            `)
            .eq('familia_id', familiaEncontrada.id)
            .order('created_at', { ascending: true })

        if (errorIntegrantes) {
          console.error(
            'Error al cargar integrantes:',
            errorIntegrantes
          )

          setMiembros([])
        } else {
          setMiembros(integrantes ?? [])
        }
      } else {
        setMiembros([])
      }

      setCargandoFamilia(false)
    }

    cargarFamilia()
  }, [usuario])

  useEffect(() => {
    const cargarEventos = async () => {
      if (!familia?.id) {
        setEventos([])
        return
      }

      try {
        setCargandoEventos(true)

        const { data: eventosData, error: errorEventos } = await supabase
          .from('eventos')
          .select(`
            id,
            familia_id,
            titulo,
            descripcion,
            fecha_inicio,
            fecha_fin,
            todo_el_dia,
            creado_por,
            recordatorio_minutos,
            created_at
          `)
          .eq('familia_id', familia.id)
          .order('fecha_inicio', { ascending: true })

        if (errorEventos) {
          throw errorEventos
        }

        const idsEventos = (eventosData ?? []).map((evento) => evento.id)

        let asignaciones = []

        if (idsEventos.length > 0) {
          const { data, error } = await supabase
            .from('evento_asignados')
            .select(`
              evento_id,
              miembro_id,
              miembros_familia (
                id,
                nombre,
                color,
                avatar_url
              )
            `)
            .in('evento_id', idsEventos)

          if (error) {
            throw error
          }

          asignaciones = data ?? []
        }

        const eventosCompletos = (eventosData ?? []).map((evento) => ({
          ...evento,
          asignados: asignaciones
            .filter((item) => item.evento_id === evento.id)
            .map((item) => item.miembros_familia)
            .filter(Boolean)
        }))

        setEventos(eventosCompletos)
      } catch (error) {
        console.error('Error al cargar eventos:', error)
        setEventos([])
      } finally {
        setCargandoEventos(false)
      }
    }

    cargarEventos()
  }, [familia?.id])

  useEffect(() => {
    const cargarTareas = async () => {
      if (!familia?.id) {
        setTareas([])
        return
      }

      try {
        setCargandoTareas(true)

        const { data: tareasData, error: errorTareas } = await supabase
          .from('tareas_familiares')
          .select(`
            id,
            familia_id,
            nombre,
            descripcion,
            prioridad,
            fecha_limite,
            estado,
            creado_por,
            fecha_completada,
            created_at
          `)
          .eq('familia_id', familia.id)
          .order('created_at', { ascending: false })

        if (errorTareas) {
          throw errorTareas
        }

        const idsTareas = (tareasData ?? []).map((tarea) => tarea.id)

        let asignaciones = []

        if (idsTareas.length > 0) {
          const { data, error } = await supabase
            .from('tarea_asignados')
            .select(`
              tarea_id,
              miembro_id,
              miembros_familia (
                id,
                nombre,
                color,
                avatar_url
              )
            `)
            .in('tarea_id', idsTareas)

          if (error) {
            throw error
          }

          asignaciones = data ?? []
        }

        const tareasCompletas = (tareasData ?? []).map((tarea) => ({
          ...tarea,
          asignados: asignaciones
            .filter((item) => item.tarea_id === tarea.id)
            .map((item) => item.miembros_familia)
            .filter(Boolean)
        }))

        setTareas(tareasCompletas)
      } catch (error) {
        console.error('Error al cargar tareas:', error)
        setTareas([])
      } finally {
        setCargandoTareas(false)
      }
    }

    cargarTareas()
  }, [familia?.id])

  useEffect(() => {
    if (!familia?.id || !usuario?.id) return

    let temporizadorRecarga = null

    const recargarTareasRealtime = async () => {
      try {
        const { data: tareasData, error: errorTareas } = await supabase
          .from('tareas_familiares')
          .select(`
            id,
            familia_id,
            nombre,
            descripcion,
            prioridad,
            fecha_limite,
            estado,
            creado_por,
            fecha_completada,
            created_at
          `)
          .eq('familia_id', familia.id)
          .order('created_at', { ascending: false })

        if (errorTareas) throw errorTareas

        const idsTareas = (tareasData ?? []).map((tarea) => tarea.id)
        let asignaciones = []

        if (idsTareas.length > 0) {
          const { data, error } = await supabase
            .from('tarea_asignados')
            .select(`
              tarea_id,
              miembro_id,
              miembros_familia (
                id,
                nombre,
                color,
                avatar_url
              )
            `)
            .in('tarea_id', idsTareas)

          if (error) throw error
          asignaciones = data ?? []
        }

        setTareas(
          (tareasData ?? []).map((tarea) => ({
            ...tarea,
            asignados: asignaciones
              .filter((item) => item.tarea_id === tarea.id)
              .map((item) => item.miembros_familia)
              .filter(Boolean)
          }))
        )
      } catch (error) {
        console.error('Error al actualizar tareas en tiempo real:', error)
      }
    }

    const canalTareas = supabase
      .channel(`tareas-familia-${familia.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'tareas_familiares',
          filter: `familia_id=eq.${familia.id}`
        },
        (payload) => {
          if (payload.new?.creado_por !== usuario.id) {
            setNovedadesTareas((actual) => actual + 1)
          }

          // La asignación se guarda justo después de crear la tarea.
          // Esperamos un instante para traer también los integrantes asignados.
          window.clearTimeout(temporizadorRecarga)
          temporizadorRecarga = window.setTimeout(() => {
            recargarTareasRealtime()
          }, 350)
        }
      )
      .subscribe()

    return () => {
      window.clearTimeout(temporizadorRecarga)
      supabase.removeChannel(canalTareas)
    }
  }, [familia?.id, usuario?.id])

  useEffect(() => {
    if (seccion === 'tareas' && novedadesTareas > 0) {
      setNovedadesTareas(0)
    }
  }, [seccion, novedadesTareas])

  useEffect(() => {
    const cargarGastos = async () => {
      if (!familia?.id) {
        setGastos([])
        return
      }

      try {
        setCargandoGastos(true)

        const { data, error } = await supabase
          .from('gastos_familiares')
          .select(`
            id,
            familia_id,
            concepto,
            monto,
            categoria,
            pagado_por,
            fecha,
            nota,
            creado_por,
            created_at
          `)
          .eq('familia_id', familia.id)
          .order('fecha', { ascending: false })
          .order('created_at', { ascending: false })

        if (error) {
          throw error
        }

        setGastos(data ?? [])
      } catch (error) {
        console.error('Error al cargar gastos:', error)
        setGastos([])
      } finally {
        setCargandoGastos(false)
      }
    }

    cargarGastos()
  }, [familia?.id])

  useEffect(() => {
    const cargarCompras = async () => {
      if (!familia?.id) {
        setListasCompras([])
        return
      }

      try {
        setCargandoCompras(true)

        const { data: listasData, error: errorListas } = await supabase
          .from('listas_compras')
          .select(`
            id,
            familia_id,
            nombre,
            estado,
            creado_por,
            completada_at,
            created_at
          `)
          .eq('familia_id', familia.id)
          .order('created_at', { ascending: false })

        if (errorListas) {
          throw errorListas
        }

        const idsListas = (listasData ?? []).map((lista) => lista.id)
        let productos = []

        if (idsListas.length > 0) {
          const { data, error } = await supabase
            .from('productos_compra')
            .select(`
              id,
              lista_id,
              nombre,
              cantidad,
              comprado,
              comprado_por,
              comprado_at,
              agregado_por,
              created_at
            `)
            .in('lista_id', idsListas)
            .order('created_at', { ascending: true })

          if (error) {
            throw error
          }

          productos = data ?? []
        }

        setListasCompras(
          (listasData ?? []).map((lista) => ({
            ...lista,
            productos: productos.filter(
              (producto) => producto.lista_id === lista.id
            )
          }))
        )
      } catch (error) {
        console.error('Error al cargar compras:', error)
        setListasCompras([])
      } finally {
        setCargandoCompras(false)
      }
    }

    cargarCompras()
  }, [familia?.id])

  const copiarCodigoInvitacion = async () => {
    if (!familia?.codigo_invitacion) return

    try {
      await navigator.clipboard.writeText(
        familia.codigo_invitacion
      )

      setCodigoInvitacionCopiado(true)

      window.setTimeout(() => {
        setCodigoInvitacionCopiado(false)
      }, 2000)
    } catch (error) {
      console.error(
        'No se pudo copiar el código de invitación:',
        error
      )
    }
  }

  const manejarFamiliaCreada = async (familiaCreada) => {
    setFamilia(familiaCreada)

    const { data, error } = await supabase
      .from('miembros_familia')
      .select(`
        id,
        user_id,
        nombre,
        color,
        avatar_url,
        rol,
        tipo
      `)
      .eq('familia_id', familiaCreada.id)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error al cargar integrantes:', error)
      setMiembros([])
      return
    }

    setMiembros(data ?? [])
  }

  const actualizarAvatarLocal = (miembroId, nuevaUrl) => {
    setMiembros((miembrosActuales) =>
      miembrosActuales.map((item) =>
        item.id === miembroId
          ? { ...item, avatar_url: nuevaUrl }
          : item
      )
    )
  }

  const obtenerInicial = (nombre) => {
    if (!nombre) return '?'

    return nombre.trim().charAt(0).toUpperCase()
  }

  const cerrarModalIntegrante = () => {
    setMostrarModalIntegrante(false)
    setNombreNuevoIntegrante('')
    setColorNuevoIntegrante('#6754e7')
    setMensajeIntegrante('')
  }

  const agregarIntegrante = async (e) => {
    e.preventDefault()

    setMensajeIntegrante('')

    const nombreLimpio = nombreNuevoIntegrante.trim()

    if (!nombreLimpio) {
      setMensajeIntegrante('Escribe el nombre del integrante.')
      return
    }

    try {
      setGuardandoIntegrante(true)

      const { data, error } = await supabase
        .from('miembros_familia')
        .insert({
          familia_id: familia.id,
          user_id: null,
          nombre: nombreLimpio,
          color: colorNuevoIntegrante,
          avatar_url: null,
          rol: 'miembro',
          tipo: 'perfil'
        })
        .select(`
          id,
          user_id,
          nombre,
          color,
          avatar_url,
          rol,
          tipo
        `)
        .single()

      if (error) {
        throw error
      }

      setMiembros((miembrosActuales) => [
        ...miembrosActuales,
        data
      ])

      cerrarModalIntegrante()
    } catch (error) {
      console.error(
        'Error al agregar integrante:',
        error
      )

      setMensajeIntegrante(
        'No se pudo agregar el integrante.'
      )
    } finally {
      setGuardandoIntegrante(false)
    }
  }
const abrirEditarIntegrante = (miembro) => {
  setMiembroEditando(miembro)
  setNombreEditado(miembro.nombre)
  setColorEditado(miembro.color)
  setMensajeEdicion('')
}

const cerrarEditarIntegrante = () => {
  setMiembroEditando(null)
  setNombreEditado('')
  setColorEditado('#6754e7')
  setMensajeEdicion('')
}

const guardarEdicionIntegrante = async (e) => {
  e.preventDefault()

  setMensajeEdicion('')

  const nombreLimpio = nombreEditado.trim()

  if (!nombreLimpio) {
    setMensajeEdicion(
      'Escribe el nombre del integrante.'
    )
    return
  }

  try {
    setGuardandoEdicion(true)

    const { data, error } = await supabase
      .from('miembros_familia')
      .update({
        nombre: nombreLimpio,
        color: colorEditado
      })
      .eq('id', miembroEditando.id)
      .select(`
        id,
        user_id,
        nombre,
        color,
        avatar_url,
        rol,
        tipo
      `)
      .single()

    if (error) {
      throw error
    }

    setMiembros((miembrosActuales) =>
      miembrosActuales.map((miembro) =>
        miembro.id === data.id
          ? data
          : miembro
      )
    )

    cerrarEditarIntegrante()
  } catch (error) {
    console.error(
      'Error al editar integrante:',
      error
    )

    setMensajeEdicion(
      'No se pudieron guardar los cambios.'
    )
  } finally {
    setGuardandoEdicion(false)
  }
}

const eliminarIntegrante = async () => {
  if (!miembroEditando) return

  try {
    setEliminandoIntegrante(true)
    setMensajeEdicion('')

    const { error } = await supabase
      .from('miembros_familia')
      .delete()
      .eq('id', miembroEditando.id)

    if (error) {
      throw error
    }

    setMiembros((miembrosActuales) =>
      miembrosActuales.filter(
        (miembro) =>
          miembro.id !== miembroEditando.id
      )
    )

    setMostrarConfirmacionEliminar(false)
    cerrarEditarIntegrante()
  } catch (error) {
    console.error(
      'Error al eliminar integrante:',
      error
    )

    setMensajeEdicion(
      'No se pudo eliminar el integrante.'
    )

    setMostrarConfirmacionEliminar(false)
  } finally {
    setEliminandoIntegrante(false)
  }
}
  const cerrarModalEvento = () => {
    setMostrarModalEvento(false)
    setEventoEditando(null)
    setTituloEvento('')
    setDescripcionEvento('')
    setFechaEvento('')
    setHoraEvento('')
    setTodoElDiaEvento(false)
    setRecordatorioEvento('')
    setAsignadosEvento([])
    setMensajeEvento('')
  }

  const abrirNuevoEvento = () => {
    setEventoEditando(null)
    setTituloEvento('')
    setDescripcionEvento('')
    setFechaEvento('')
    setHoraEvento('')
    setTodoElDiaEvento(false)
    setRecordatorioEvento('')
    setAsignadosEvento([])
    setMensajeEvento('')
    setMostrarModalEvento(true)
  }

  const abrirEditarEvento = (evento) => {
    const fecha = new Date(evento.fecha_inicio)

    const año = fecha.getFullYear()
    const mes = String(fecha.getMonth() + 1).padStart(2, '0')
    const dia = String(fecha.getDate()).padStart(2, '0')
    const hora = String(fecha.getHours()).padStart(2, '0')
    const minutos = String(fecha.getMinutes()).padStart(2, '0')

    setEventoEditando(evento)
    setTituloEvento(evento.titulo)
    setDescripcionEvento(evento.descripcion || '')
    setFechaEvento(`${año}-${mes}-${dia}`)
    setHoraEvento(evento.todo_el_dia ? '' : `${hora}:${minutos}`)
    setTodoElDiaEvento(evento.todo_el_dia)
    setRecordatorioEvento(
      evento.recordatorio_minutos === null
        ? ''
        : String(evento.recordatorio_minutos)
    )
    setAsignadosEvento(
      evento.asignados.map((miembro) => miembro.id)
    )
    setMensajeEvento('')
    setMostrarModalEvento(true)
  }

  const alternarAsignadoEvento = (miembroId) => {
    setAsignadosEvento((actuales) =>
      actuales.includes(miembroId)
        ? actuales.filter((id) => id !== miembroId)
        : [...actuales, miembroId]
    )
  }

  const seleccionarTodaLaFamilia = () => {
    if (asignadosEvento.length === miembros.length) {
      setAsignadosEvento([])
      return
    }

    setAsignadosEvento(miembros.map((miembro) => miembro.id))
  }

  const enviarNotificacionFamiliar = async ({
    titulo,
    mensaje,
    url = '/'
  }) => {
    try {
      const { error } = await supabase.functions.invoke(
        'enviar-notificacion-familiar',
        {
          body: {
            familia_id: familia.id,
            titulo,
            mensaje,
            url
          }
        }
      )

      if (error) {
        console.error(
          'La acción se guardó, pero no se pudo enviar la notificación:',
          error
        )
      }
    } catch (error) {
      console.error(
        'La acción se guardó, pero ocurrió un error con la notificación:',
        error
      )
    }
  }

  const obtenerNombreCreadorNotificacion = () => {
    const creador = miembros.find(
      (miembro) => miembro.user_id === usuario?.id
    )

    return (
      creador?.nombre ||
      usuario?.user_metadata?.nombre ||
      'Un integrante'
    )
  }

  const crearEvento = async (e) => {
    e.preventDefault()
    setMensajeEvento('')

    const tituloLimpio = tituloEvento.trim()

    if (!tituloLimpio) {
      setMensajeEvento('Escribe un título para el evento.')
      return
    }

    if (!fechaEvento) {
      setMensajeEvento('Selecciona una fecha para el evento.')
      return
    }

    if (!todoElDiaEvento && !horaEvento) {
      setMensajeEvento('Selecciona una hora para el evento.')
      return
    }

    if (asignadosEvento.length === 0) {
      setMensajeEvento('Selecciona al menos un integrante.')
      return
    }

    const horaInicio = todoElDiaEvento ? '00:00' : horaEvento
    const fechaInicioLocal = new Date(
      `${fechaEvento}T${horaInicio}:00`
    )

    if (Number.isNaN(fechaInicioLocal.getTime())) {
      setMensajeEvento('La fecha u hora no es válida.')
      return
    }

    try {
      setGuardandoEvento(true)

      const { data: nuevoEvento, error: errorEvento } = await supabase
        .from('eventos')
        .insert({
          familia_id: familia.id,
          titulo: tituloLimpio,
          descripcion: descripcionEvento.trim() || null,
          fecha_inicio: fechaInicioLocal.toISOString(),
          fecha_fin: null,
          todo_el_dia: todoElDiaEvento,
          creado_por: usuario.id,
          recordatorio_minutos:
            recordatorioEvento === ''
              ? null
              : Number(recordatorioEvento)
        })
        .select()
        .single()

      if (errorEvento) {
        throw errorEvento
      }

      const filasAsignados = asignadosEvento.map((miembroId) => ({
        evento_id: nuevoEvento.id,
        miembro_id: miembroId
      }))

      const { error: errorAsignados } = await supabase
        .from('evento_asignados')
        .insert(filasAsignados)

      if (errorAsignados) {
        await supabase
          .from('eventos')
          .delete()
          .eq('id', nuevoEvento.id)

        throw errorAsignados
      }

      const miembrosAsignados = miembros.filter((miembro) =>
        asignadosEvento.includes(miembro.id)
      )

      setEventos((actuales) =>
        [
          ...actuales,
          {
            ...nuevoEvento,
            asignados: miembrosAsignados
          }
        ].sort(
          (a, b) =>
            new Date(a.fecha_inicio) - new Date(b.fecha_inicio)
        )
      )

      await enviarNotificacionFamiliar({
        titulo: 'Nuevo evento 📅',
        mensaje: `${obtenerNombreCreadorNotificacion()} creó un nuevo evento: ${tituloLimpio}`,
        url: '/?seccion=calendario'
      })

      cerrarModalEvento()
    } catch (error) {
      console.error('Error al crear evento:', error)
      setMensajeEvento('No se pudo crear el evento.')
    } finally {
      setGuardandoEvento(false)
    }
  }

  const guardarEdicionEvento = async (e) => {
    e.preventDefault()
    setMensajeEvento('')

    if (!eventoEditando) return

    const tituloLimpio = tituloEvento.trim()

    if (!tituloLimpio) {
      setMensajeEvento('Escribe un título para el evento.')
      return
    }

    if (!fechaEvento) {
      setMensajeEvento('Selecciona una fecha para el evento.')
      return
    }

    if (!todoElDiaEvento && !horaEvento) {
      setMensajeEvento('Selecciona una hora para el evento.')
      return
    }

    if (asignadosEvento.length === 0) {
      setMensajeEvento('Selecciona al menos un integrante.')
      return
    }

    const horaInicio = todoElDiaEvento ? '00:00' : horaEvento
    const fechaInicioLocal = new Date(
      `${fechaEvento}T${horaInicio}:00`
    )

    if (Number.isNaN(fechaInicioLocal.getTime())) {
      setMensajeEvento('La fecha u hora no es válida.')
      return
    }

    try {
      setGuardandoEvento(true)

      const { data: eventoActualizado, error: errorEvento } = await supabase
        .from('eventos')
        .update({
          titulo: tituloLimpio,
          descripcion: descripcionEvento.trim() || null,
          fecha_inicio: fechaInicioLocal.toISOString(),
          todo_el_dia: todoElDiaEvento,
          recordatorio_minutos:
            recordatorioEvento === ''
              ? null
              : Number(recordatorioEvento)
        })
        .eq('id', eventoEditando.id)
        .select()
        .single()

      if (errorEvento) {
        throw errorEvento
      }

      const { error: errorEliminarAsignados } = await supabase
        .from('evento_asignados')
        .delete()
        .eq('evento_id', eventoEditando.id)

      if (errorEliminarAsignados) {
        throw errorEliminarAsignados
      }

      const filasAsignados = asignadosEvento.map((miembroId) => ({
        evento_id: eventoEditando.id,
        miembro_id: miembroId
      }))

      const { error: errorAsignados } = await supabase
        .from('evento_asignados')
        .insert(filasAsignados)

      if (errorAsignados) {
        throw errorAsignados
      }

      const miembrosAsignados = miembros.filter((miembro) =>
        asignadosEvento.includes(miembro.id)
      )

      setEventos((actuales) =>
        actuales
          .map((evento) =>
            evento.id === eventoEditando.id
              ? {
                  ...eventoActualizado,
                  asignados: miembrosAsignados
                }
              : evento
          )
          .sort(
            (a, b) =>
              new Date(a.fecha_inicio) - new Date(b.fecha_inicio)
          )
      )

      cerrarModalEvento()
    } catch (error) {
      console.error('Error al editar evento:', error)
      setMensajeEvento('No se pudieron guardar los cambios.')
    } finally {
      setGuardandoEvento(false)
    }
  }

  const eliminarEvento = async () => {
    if (!eventoEditando) return

    try {
      setEliminandoEvento(true)

      const { error } = await supabase
        .from('eventos')
        .delete()
        .eq('id', eventoEditando.id)

      if (error) {
        throw error
      }

      setEventos((actuales) =>
        actuales.filter(
          (evento) => evento.id !== eventoEditando.id
        )
      )

      setMostrarConfirmacionEliminarEvento(false)
      cerrarModalEvento()
    } catch (error) {
      console.error('Error al eliminar evento:', error)
      setMostrarConfirmacionEliminarEvento(false)
      setMensajeEvento('No se pudo eliminar el evento.')
    } finally {
      setEliminandoEvento(false)
    }
  }

  const obtenerTextoRecordatorio = (minutos) => {
    if (minutos === null || minutos === undefined) {
      return ''
    }

    if (minutos === 0) {
      return 'Al comenzar'
    }

    if (minutos < 60) {
      return `${minutos} min antes`
    }

    if (minutos % 1440 === 0) {
      const dias = minutos / 1440
      return dias === 1
        ? '1 día antes'
        : `${dias} días antes`
    }

    if (minutos % 60 === 0) {
      const horas = minutos / 60
      return horas === 1
        ? '1 hora antes'
        : `${horas} horas antes`
    }

    return `${minutos} min antes`
  }

  const formatearFechaEvento = (fechaIso, todoElDia = false) => {
    const fecha = new Date(fechaIso)

    if (todoElDia) {
      return fecha.toLocaleDateString('es-CL', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    }

    return fecha.toLocaleString('es-CL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const esHoy = (fechaIso) => {
    const fecha = new Date(fechaIso)
    const hoy = new Date()

    return (
      fecha.getFullYear() === hoy.getFullYear() &&
      fecha.getMonth() === hoy.getMonth() &&
      fecha.getDate() === hoy.getDate()
    )
  }

  const eventosHoy = eventos.filter((evento) => esHoy(evento.fecha_inicio))

  const proximoEvento =
    eventos.find((evento) => new Date(evento.fecha_inicio) >= new Date()) ??
    null

  const cerrarModalTarea = () => {
    setMostrarModalTarea(false)
    setTareaEditando(null)
    setMostrarConfirmacionEliminarTarea(false)
    setNombreTarea('')
    setDescripcionTarea('')
    setPrioridadTarea('media')
    setFechaLimiteTarea('')
    setAsignadosTarea([])
    setMensajeTarea('')
  }

  const abrirNuevaTarea = () => {
    setTareaEditando(null)
    setNombreTarea('')
    setDescripcionTarea('')
    setPrioridadTarea('media')
    setFechaLimiteTarea('')
    setAsignadosTarea([])
    setMensajeTarea('')
    setMostrarModalTarea(true)
  }

  const abrirEditarTarea = (tarea) => {
    let fechaLimite = ''

    if (tarea.fecha_limite) {
      const fecha = new Date(tarea.fecha_limite)
      const año = fecha.getFullYear()
      const mes = String(fecha.getMonth() + 1).padStart(2, '0')
      const dia = String(fecha.getDate()).padStart(2, '0')
      fechaLimite = `${año}-${mes}-${dia}`
    }

    setTareaEditando(tarea)
    setNombreTarea(tarea.nombre)
    setDescripcionTarea(tarea.descripcion || '')
    setPrioridadTarea(tarea.prioridad)
    setFechaLimiteTarea(fechaLimite)
    setAsignadosTarea(
      tarea.asignados.map((miembro) => miembro.id)
    )
    setMensajeTarea('')
    setMostrarModalTarea(true)
  }

  const guardarEdicionTarea = async (e) => {
    e.preventDefault()
    setMensajeTarea('')

    if (!tareaEditando) return

    const nombreLimpio = nombreTarea.trim()

    if (!nombreLimpio) {
      setMensajeTarea('Escribe un nombre para la tarea.')
      return
    }

    if (asignadosTarea.length === 0) {
      setMensajeTarea('Selecciona al menos un integrante.')
      return
    }

    let fechaLimiteIso = null

    if (fechaLimiteTarea) {
      const fechaLocal = new Date(`${fechaLimiteTarea}T23:59:59`)

      if (Number.isNaN(fechaLocal.getTime())) {
        setMensajeTarea('La fecha límite no es válida.')
        return
      }

      fechaLimiteIso = fechaLocal.toISOString()
    }

    try {
      setGuardandoTarea(true)

      const { data: tareaActualizada, error: errorTarea } =
        await supabase
          .from('tareas_familiares')
          .update({
            nombre: nombreLimpio,
            descripcion: descripcionTarea.trim() || null,
            prioridad: prioridadTarea,
            fecha_limite: fechaLimiteIso
          })
          .eq('id', tareaEditando.id)
          .select()
          .single()

      if (errorTarea) {
        throw errorTarea
      }

      const { error: errorEliminarAsignados } = await supabase
        .from('tarea_asignados')
        .delete()
        .eq('tarea_id', tareaEditando.id)

      if (errorEliminarAsignados) {
        throw errorEliminarAsignados
      }

      const filasAsignados = asignadosTarea.map((miembroId) => ({
        tarea_id: tareaEditando.id,
        miembro_id: miembroId
      }))

      const { error: errorAsignados } = await supabase
        .from('tarea_asignados')
        .insert(filasAsignados)

      if (errorAsignados) {
        throw errorAsignados
      }

      const miembrosAsignados = miembros.filter((miembro) =>
        asignadosTarea.includes(miembro.id)
      )

      setTareas((actuales) =>
        actuales.map((tarea) =>
          tarea.id === tareaEditando.id
            ? {
                ...tarea,
                ...tareaActualizada,
                asignados: miembrosAsignados
              }
            : tarea
        )
      )

      cerrarModalTarea()
    } catch (error) {
      console.error('Error al editar tarea:', error)
      setMensajeTarea('No se pudieron guardar los cambios.')
    } finally {
      setGuardandoTarea(false)
    }
  }

  const eliminarTareaManual = async () => {
    if (!tareaEditando) return

    try {
      setEliminandoTarea(true)
      setMensajeTarea('')

      const { error } = await supabase
        .from('tareas_familiares')
        .delete()
        .eq('id', tareaEditando.id)

      if (error) {
        throw error
      }

      setTareas((actuales) =>
        actuales.filter(
          (tarea) => tarea.id !== tareaEditando.id
        )
      )

      setMostrarConfirmacionEliminarTarea(false)
      cerrarModalTarea()
    } catch (error) {
      console.error('Error al eliminar tarea:', error)
      setMostrarConfirmacionEliminarTarea(false)
      setMensajeTarea('No se pudo eliminar la tarea.')
    } finally {
      setEliminandoTarea(false)
    }
  }

  const alternarAsignadoTarea = (miembroId) => {
    setAsignadosTarea((actuales) =>
      actuales.includes(miembroId)
        ? actuales.filter((id) => id !== miembroId)
        : [...actuales, miembroId]
    )
  }

  const seleccionarTodaLaFamiliaTarea = () => {
    if (asignadosTarea.length === miembros.length) {
      setAsignadosTarea([])
      return
    }

    setAsignadosTarea(miembros.map((miembro) => miembro.id))
  }

  const crearTarea = async (e) => {
    e.preventDefault()
    setMensajeTarea('')

    const nombreLimpio = nombreTarea.trim()

    if (!nombreLimpio) {
      setMensajeTarea('Escribe un nombre para la tarea.')
      return
    }

    if (asignadosTarea.length === 0) {
      setMensajeTarea('Selecciona al menos un integrante.')
      return
    }

    let fechaLimiteIso = null

    if (fechaLimiteTarea) {
      const fechaLocal = new Date(`${fechaLimiteTarea}T23:59:59`)

      if (Number.isNaN(fechaLocal.getTime())) {
        setMensajeTarea('La fecha límite no es válida.')
        return
      }

      fechaLimiteIso = fechaLocal.toISOString()
    }

    try {
      setGuardandoTarea(true)

      const { data: nuevaTarea, error: errorTarea } = await supabase
        .from('tareas_familiares')
        .insert({
          familia_id: familia.id,
          nombre: nombreLimpio,
          descripcion: descripcionTarea.trim() || null,
          prioridad: prioridadTarea,
          fecha_limite: fechaLimiteIso,
          estado: 'pendiente',
          creado_por: usuario.id,
          fecha_completada: null
        })
        .select()
        .single()

      if (errorTarea) {
        throw errorTarea
      }

      const filasAsignados = asignadosTarea.map((miembroId) => ({
        tarea_id: nuevaTarea.id,
        miembro_id: miembroId
      }))

      const { error: errorAsignados } = await supabase
        .from('tarea_asignados')
        .insert(filasAsignados)

      if (errorAsignados) {
        await supabase
          .from('tareas_familiares')
          .delete()
          .eq('id', nuevaTarea.id)

        throw errorAsignados
      }

      const miembrosAsignados = miembros.filter((miembro) =>
        asignadosTarea.includes(miembro.id)
      )

      setTareas((actuales) => [
        {
          ...nuevaTarea,
          asignados: miembrosAsignados
        },
        ...actuales
      ])

      await enviarNotificacionFamiliar({
        titulo: 'Nueva tarea ✅',
        mensaje: `${obtenerNombreCreadorNotificacion()} creó una nueva tarea: ${nombreLimpio}`,
        url: '/?seccion=tareas'
      })

      cerrarModalTarea()
    } catch (error) {
      console.error('Error al crear tarea:', error)
      setMensajeTarea('No se pudo crear la tarea.')
    } finally {
      setGuardandoTarea(false)
    }
  }

  const cambiarEstadoTarea = async (tarea) => {
    if (
      tarea.estado === 'completada' ||
      tareasEliminandose.includes(tarea.id)
    ) {
      return
    }

    try {
      const { error } = await supabase.rpc(
        'marcar_tarea_completada',
        {
          tarea_uuid: tarea.id,
          nuevo_estado: true
        }
      )

      if (error) {
        throw error
      }

      setTareas((actuales) =>
        actuales.map((item) =>
          item.id === tarea.id
            ? {
                ...item,
                estado: 'completada',
                fecha_completada: new Date().toISOString()
              }
            : item
        )
      )

      setTareasEliminandose((actuales) => [
        ...actuales,
        tarea.id
      ])

      window.setTimeout(async () => {
        try {
          const { error: errorEliminar } = await supabase.rpc(
            'eliminar_tarea_completada',
            {
              tarea_uuid: tarea.id
            }
          )

          if (errorEliminar) {
            throw errorEliminar
          }

          setTareas((actuales) =>
            actuales.filter((item) => item.id !== tarea.id)
          )
        } catch (errorEliminar) {
          console.error(
            'Error al eliminar tarea completada:',
            errorEliminar
          )

          setTareas((actuales) =>
            actuales.map((item) =>
              item.id === tarea.id
                ? {
                    ...item,
                    estado: 'pendiente',
                    fecha_completada: null
                  }
                : item
            )
          )
        } finally {
          setTareasEliminandose((actuales) =>
            actuales.filter((id) => id !== tarea.id)
          )
        }
      }, 3000)
    } catch (error) {
      console.error('Error al completar tarea:', error)
    }
  }

  const obtenerTextoPrioridad = (prioridad) => {
    if (prioridad === 'alta') return 'Alta'
    if (prioridad === 'baja') return 'Baja'
    return 'Media'
  }

  const formatearFechaTarea = (fechaIso) => {
    if (!fechaIso) return 'Sin fecha límite'

    return new Date(fechaIso).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const tareasPendientes = tareas.filter(
    (tarea) => tarea.estado === 'pendiente'
  )

  const tareasCompletadas = tareas.filter(
    (tarea) => tarea.estado === 'completada'
  )

  const tareasHoy = tareasPendientes.filter(
    (tarea) => tarea.fecha_limite && esHoy(tarea.fecha_limite)
  )

  const cantidadActividadesHoy = eventosHoy.length + tareasHoy.length

  const listasComprasActivas = listasCompras.filter(
    (lista) => lista.estado === 'activa'
  )

  const listasComprasCompletadas = listasCompras.filter(
    (lista) => lista.estado === 'completada'
  )

  const productosPendientesCompra = listasComprasActivas.reduce(
    (total, lista) =>
      total +
      lista.productos.filter((producto) => !producto.comprado).length,
    0
  )

  const abrirNuevaListaCompra = () => {
    setNombreListaCompra('')
    setMensajeListaCompra('')
    setMostrarModalListaCompra(true)
  }

  const cerrarModalListaCompra = () => {
    setMostrarModalListaCompra(false)
    setNombreListaCompra('')
    setMensajeListaCompra('')
  }

  const crearListaCompra = async (e) => {
    e.preventDefault()
    setMensajeListaCompra('')

    const nombreLimpio = nombreListaCompra.trim()

    if (!nombreLimpio) {
      setMensajeListaCompra('Escribe un nombre para la lista.')
      return
    }

    try {
      setGuardandoListaCompra(true)

      const { data, error } = await supabase
        .from('listas_compras')
        .insert({
          familia_id: familia.id,
          nombre: nombreLimpio,
          estado: 'activa',
          creado_por: usuario.id,
          completada_at: null
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      setListasCompras((actuales) => [
        {
          ...data,
          productos: []
        },
        ...actuales
      ])

      await enviarNotificacionFamiliar({
        titulo: 'Nueva lista de compras 🛒',
        mensaje: `${obtenerNombreCreadorNotificacion()} creó una nueva lista: ${nombreLimpio}`,
        url: '/?seccion=compras'
      })

      cerrarModalListaCompra()
    } catch (error) {
      console.error('Error al crear lista de compras:', error)
      setMensajeListaCompra('No se pudo crear la lista.')
    } finally {
      setGuardandoListaCompra(false)
    }
  }

  const abrirListaCompra = (lista) => {
    setListaCompraSeleccionada(lista)
    setNombreProductoCompra('')
    setCantidadProductoCompra('')
    setMensajeProductoCompra('')
  }

  const cerrarListaCompra = () => {
    setListaCompraSeleccionada(null)
    setNombreProductoCompra('')
    setCantidadProductoCompra('')
    setMensajeProductoCompra('')
  }

  const agregarProductoCompra = async (e) => {
    e.preventDefault()
    setMensajeProductoCompra('')

    if (!listaCompraSeleccionada) return

    const nombreLimpio = nombreProductoCompra.trim()
    const cantidadLimpia = cantidadProductoCompra.trim()

    if (!nombreLimpio) {
      setMensajeProductoCompra('Escribe el nombre del producto.')
      return
    }

    try {
      setGuardandoProductoCompra(true)

      const { data, error } = await supabase
        .from('productos_compra')
        .insert({
          lista_id: listaCompraSeleccionada.id,
          nombre: nombreLimpio,
          cantidad: cantidadLimpia || null,
          comprado: false,
          comprado_por: null,
          comprado_at: null,
          agregado_por: usuario.id
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      setListasCompras((actuales) =>
        actuales.map((lista) =>
          lista.id === listaCompraSeleccionada.id
            ? {
                ...lista,
                productos: [...lista.productos, data]
              }
            : lista
        )
      )

      setListaCompraSeleccionada((actual) =>
        actual
          ? {
              ...actual,
              productos: [...actual.productos, data]
            }
          : actual
      )

      setNombreProductoCompra('')
      setCantidadProductoCompra('')
    } catch (error) {
      console.error('Error al agregar producto:', error)
      setMensajeProductoCompra('No se pudo agregar el producto.')
    } finally {
      setGuardandoProductoCompra(false)
    }
  }

  const alternarProductoComprado = async (producto) => {
    if (!listaCompraSeleccionada || listaCompraSeleccionada.estado !== 'activa') {
      return
    }

    const nuevoEstado = !producto.comprado

    try {
      const { data, error } = await supabase
        .from('productos_compra')
        .update({
          comprado: nuevoEstado,
          comprado_por: nuevoEstado ? usuario.id : null,
          comprado_at: nuevoEstado ? new Date().toISOString() : null
        })
        .eq('id', producto.id)
        .select()
        .single()

      if (error) {
        throw error
      }

      setListasCompras((actuales) =>
        actuales.map((lista) =>
          lista.id === listaCompraSeleccionada.id
            ? {
                ...lista,
                productos: lista.productos.map((item) =>
                  item.id === producto.id ? data : item
                )
              }
            : lista
        )
      )

      setListaCompraSeleccionada((actual) =>
        actual
          ? {
              ...actual,
              productos: actual.productos.map((item) =>
                item.id === producto.id ? data : item
              )
            }
          : actual
      )
    } catch (error) {
      console.error('Error al marcar producto:', error)
    }
  }

  const eliminarProductoCompra = async (productoId) => {
    if (!listaCompraSeleccionada || listaCompraSeleccionada.estado !== 'activa') {
      return
    }

    try {
      const { error } = await supabase
        .from('productos_compra')
        .delete()
        .eq('id', productoId)

      if (error) {
        throw error
      }

      setListasCompras((actuales) =>
        actuales.map((lista) =>
          lista.id === listaCompraSeleccionada.id
            ? {
                ...lista,
                productos: lista.productos.filter(
                  (producto) => producto.id !== productoId
                )
              }
            : lista
        )
      )

      setListaCompraSeleccionada((actual) =>
        actual
          ? {
              ...actual,
              productos: actual.productos.filter(
                (producto) => producto.id !== productoId
              )
            }
          : actual
      )
    } catch (error) {
      console.error('Error al eliminar producto:', error)
    }
  }

  const finalizarListaCompra = async () => {
    if (!listaCompraSeleccionada) return

    try {
      setFinalizandoListaCompra(true)

      const { error } = await supabase.rpc(
        'finalizar_lista_compra',
        {
          lista_uuid: listaCompraSeleccionada.id
        }
      )

      if (error) {
        throw error
      }

      const fechaCompletada = new Date().toISOString()

      setListasCompras((actuales) =>
        actuales.map((lista) =>
          lista.id === listaCompraSeleccionada.id
            ? {
                ...lista,
                estado: 'completada',
                completada_at: fechaCompletada
              }
            : lista
        )
      )

      setListaCompraSeleccionada((actual) =>
        actual
          ? {
              ...actual,
              estado: 'completada',
              completada_at: fechaCompletada
            }
          : actual
      )
    } catch (error) {
      console.error('Error al finalizar lista:', error)
      setMensajeProductoCompra('No se pudo finalizar la lista.')
    } finally {
      setFinalizandoListaCompra(false)
    }
  }

  const solicitarEliminarListaCompra = (lista, evento) => {
    evento.stopPropagation()

    if (lista.creado_por !== usuario?.id) return

    setListaCompraAEliminar(lista)
  }

  const eliminarListaCompraCompletada = async () => {
    if (!listaCompraAEliminar) return

    try {
      setEliminandoListaCompra(true)

      const { error: errorProductos } = await supabase
        .from('productos_compra')
        .delete()
        .eq('lista_id', listaCompraAEliminar.id)

      if (errorProductos) {
        throw errorProductos
      }

      const { error: errorLista } = await supabase
        .from('listas_compras')
        .delete()
        .eq('id', listaCompraAEliminar.id)
        .eq('creado_por', usuario.id)

      if (errorLista) {
        throw errorLista
      }

      setListasCompras((actuales) =>
        actuales.filter((lista) => lista.id !== listaCompraAEliminar.id)
      )

      if (listaCompraSeleccionada?.id === listaCompraAEliminar.id) {
        setListaCompraSeleccionada(null)
      }

      setListaCompraAEliminar(null)
    } catch (error) {
      console.error('Error al eliminar lista completada:', error)
    } finally {
      setEliminandoListaCompra(false)
    }
  }

  const gastosMesActual = gastos.filter((gasto) => {
    const hoy = new Date()
    const [anio, mes] = gasto.fecha.split('-').map(Number)

    return (
      anio === hoy.getFullYear() &&
      mes === hoy.getMonth() + 1
    )
  })

  const totalGastosMesActual = gastosMesActual.reduce(
    (total, gasto) => total + Number(gasto.monto || 0),
    0
  )

  const obtenerClaveMes = (fecha) => {
    const [anio, mes] = fecha.split('-')
    return `${anio}-${mes}`
  }

  const obtenerNombreMes = (claveMes) => {
    const [anio, mes] = claveMes.split('-').map(Number)

    return new Date(anio, mes - 1, 1).toLocaleDateString('es-CL', {
      month: 'long',
      year: 'numeric'
    })
  }

  const hoyGastos = new Date()
  const claveMesActual = `${hoyGastos.getFullYear()}-${String(
    hoyGastos.getMonth() + 1
  ).padStart(2, '0')}`

  const nombreMesActual = obtenerNombreMes(claveMesActual)

  const gastosMesesAnteriores = Object.entries(
    gastos
      .filter((gasto) => obtenerClaveMes(gasto.fecha) !== claveMesActual)
      .reduce((grupos, gasto) => {
        const clave = obtenerClaveMes(gasto.fecha)

        if (!grupos[clave]) {
          grupos[clave] = []
        }

        grupos[clave].push(gasto)
        return grupos
      }, {})
  )
    .sort(([mesA], [mesB]) => mesB.localeCompare(mesA))
    .map(([clave, gastosDelMes]) => ({
      clave,
      nombre: obtenerNombreMes(clave),
      total: gastosDelMes.reduce(
        (total, gasto) => total + Number(gasto.monto || 0),
        0
      ),
      gastos: gastosDelMes
    }))

  const formatearMontoCLP = (monto) =>
    new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0
    }).format(Number(monto || 0))

  const obtenerNombreCategoriaGasto = (categoria) => {
    const nombres = {
      supermercado: 'Supermercado',
      hogar: 'Hogar',
      cuentas: 'Cuentas',
      transporte: 'Transporte',
      salud: 'Salud',
      educacion: 'Educación',
      entretencion: 'Entretención',
      comida: 'Comida',
      otros: 'Otros'
    }

    return nombres[categoria] || 'Otros'
  }

  const obtenerIconoCategoriaGasto = (categoria) => {
    const iconos = {
      supermercado: '🛒',
      hogar: '🏠',
      cuentas: '🧾',
      transporte: '🚗',
      salud: '💊',
      educacion: '📚',
      entretencion: '🎬',
      comida: '🍽️',
      otros: '💳'
    }

    return iconos[categoria] || '💳'
  }

  const abrirNuevoGasto = () => {
    const hoy = new Date()
    const fechaLocal = [
      hoy.getFullYear(),
      String(hoy.getMonth() + 1).padStart(2, '0'),
      String(hoy.getDate()).padStart(2, '0')
    ].join('-')

    const miembroActual = miembros.find(
      (miembro) => miembro.user_id === usuario.id
    )

    setGastoEditando(null)
    setConceptoGasto('')
    setMontoGasto('')
    setCategoriaGasto('supermercado')
    setPagadoPorGasto(miembroActual?.id || miembros[0]?.id || '')
    setFechaGasto(fechaLocal)
    setNotaGasto('')
    setMensajeGasto('')
    setMostrarModalGasto(true)
  }

  const abrirEditarGasto = (gasto) => {
    if (gasto.creado_por !== usuario?.id) return

    setGastoEditando(gasto)
    setConceptoGasto(gasto.concepto || '')
    setMontoGasto(String(gasto.monto ?? ''))
    setCategoriaGasto(gasto.categoria || 'supermercado')
    setPagadoPorGasto(gasto.pagado_por || '')
    setFechaGasto(gasto.fecha || '')
    setNotaGasto(gasto.nota || '')
    setMensajeGasto('')
    setMostrarModalGasto(true)
  }

  const cerrarModalGasto = () => {
    if (guardandoGasto) return

    setMostrarModalGasto(false)
    setGastoEditando(null)
    setMensajeGasto('')
  }

  const guardarGasto = async (e) => {
    e.preventDefault()
    setMensajeGasto('')

    const conceptoLimpio = conceptoGasto.trim()
    const montoNumero = Number(
      String(montoGasto).replace(/\./g, '').replace(',', '.')
    )

    if (!conceptoLimpio) {
      setMensajeGasto('Escribe el nombre del gasto.')
      return
    }

    if (!Number.isFinite(montoNumero) || montoNumero <= 0) {
      setMensajeGasto('Ingresa un monto válido.')
      return
    }

    if (!pagadoPorGasto) {
      setMensajeGasto('Selecciona quién pagó.')
      return
    }

    if (!fechaGasto) {
      setMensajeGasto('Selecciona una fecha.')
      return
    }

    try {
      setGuardandoGasto(true)

      const datosGasto = {
        concepto: conceptoLimpio,
        monto: montoNumero,
        categoria: categoriaGasto,
        pagado_por: pagadoPorGasto,
        fecha: fechaGasto,
        nota: notaGasto.trim() || null
      }

      if (gastoEditando) {
        const { data, error } = await supabase
          .from('gastos_familiares')
          .update(datosGasto)
          .eq('id', gastoEditando.id)
          .eq('creado_por', usuario.id)
          .select()
          .single()

        if (error) {
          throw error
        }

        setGastos((actuales) =>
          actuales
            .map((gasto) =>
              gasto.id === gastoEditando.id ? data : gasto
            )
            .sort((a, b) => {
              if (a.fecha === b.fecha) {
                return new Date(b.created_at) - new Date(a.created_at)
              }

              return b.fecha.localeCompare(a.fecha)
            })
        )
      } else {
        const { data, error } = await supabase
          .from('gastos_familiares')
          .insert({
            familia_id: familia.id,
            ...datosGasto,
            creado_por: usuario.id
          })
          .select()
          .single()

        if (error) {
          throw error
        }

        setGastos((actuales) =>
          [data, ...actuales].sort((a, b) => {
            if (a.fecha === b.fecha) {
              return new Date(b.created_at) - new Date(a.created_at)
            }

            return b.fecha.localeCompare(a.fecha)
          })
        )

        await enviarNotificacionFamiliar({
          titulo: 'Nuevo gasto 💰',
          mensaje: `${obtenerNombreCreadorNotificacion()} registró un gasto: ${conceptoLimpio} por ${formatearMontoCLP(montoNumero)}`,
          url: '/?seccion=gastos'
        })
      }

      cerrarModalGasto()
    } catch (error) {
      console.error(
        gastoEditando
          ? 'Error al editar gasto:'
          : 'Error al registrar gasto:',
        error
      )

      setMensajeGasto(
        gastoEditando
          ? 'No se pudieron guardar los cambios.'
          : 'No se pudo registrar el gasto.'
      )
    } finally {
      setGuardandoGasto(false)
    }
  }

  const solicitarEliminarGasto = (gasto) => {
    if (gasto.creado_por !== usuario?.id) return
    setGastoAEliminar(gasto)
  }

  const eliminarGasto = async () => {
    if (!gastoAEliminar) return

    try {
      setEliminandoGasto(true)

      const { error } = await supabase
        .from('gastos_familiares')
        .delete()
        .eq('id', gastoAEliminar.id)
        .eq('creado_por', usuario.id)

      if (error) {
        throw error
      }

      setGastos((actuales) =>
        actuales.filter((gasto) => gasto.id !== gastoAEliminar.id)
      )

      if (gastoEditando?.id === gastoAEliminar.id) {
        setMostrarModalGasto(false)
        setGastoEditando(null)
      }

      setGastoAEliminar(null)
    } catch (error) {
      console.error('Error al eliminar gasto:', error)
    } finally {
      setEliminandoGasto(false)
    }
  }

  const activarNotificaciones = async () => {
    setMensajeNotificaciones('')

    if (
      !('serviceWorker' in navigator) ||
      !('PushManager' in window) ||
      !('Notification' in window)
    ) {
      setMensajeNotificaciones(
        'Este navegador no admite notificaciones Push.'
      )
      return
    }

    const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY

    if (!vapidPublicKey) {
      setMensajeNotificaciones(
        'Falta configurar VITE_VAPID_PUBLIC_KEY.'
      )
      return
    }

    try {
      setActivandoNotificaciones(true)

      const permiso = await Notification.requestPermission()

      if (permiso !== 'granted') {
        setMensajeNotificaciones(
          'Debes permitir las notificaciones en el navegador.'
        )
        return
      }

      const registro = await navigator.serviceWorker.register('/sw.js')
      await navigator.serviceWorker.ready

      let suscripcion = await registro.pushManager.getSubscription()

      if (!suscripcion) {
        suscripcion = await registro.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertirBase64AUint8Array(vapidPublicKey)
        })
      }

      const datos = suscripcion.toJSON()

      const { error: errorLimpiarSuscripciones } = await supabase
        .from('push_suscripciones')
        .delete()
        .eq('user_id', usuario.id)
        .eq('dispositivo_id', dispositivoId)
        .neq('endpoint', datos.endpoint)

      if (errorLimpiarSuscripciones) {
        console.error(
          'No se pudieron limpiar suscripciones antiguas del dispositivo:',
          errorLimpiarSuscripciones
        )
      }

      const { error } = await supabase
        .from('push_suscripciones')
        .upsert(
          {
            user_id: usuario.id,
            dispositivo_id: dispositivoId,
            endpoint: datos.endpoint,
            p256dh: datos.keys?.p256dh,
            auth: datos.keys?.auth
          },
          {
            onConflict: 'endpoint'
          }
        )

      if (error) {
        throw error
      }

      const { error: errorSesionDispositivo } = await supabase
        .from('sesiones_dispositivo')
        .upsert(
          {
            user_id: usuario.id,
            dispositivo_id: dispositivoId,
            endpoint_push: datos.endpoint,
            ultima_actividad: new Date().toISOString(),
            estado: 'activa',
            notificado_cierre: false
          },
          {
            onConflict: 'user_id,dispositivo_id'
          }
        )

      if (errorSesionDispositivo) {
        console.error(
          'Las notificaciones se activaron, pero no se pudo vincular el dispositivo:',
          errorSesionDispositivo
        )
      }

      setNotificacionesActivas(true)
      setMensajeNotificaciones('Notificaciones activadas correctamente.')
    } catch (error) {
      console.error('Error al activar notificaciones:', error)
      setMensajeNotificaciones(
        'No se pudieron activar las notificaciones.'
      )
    } finally {
      setActivandoNotificaciones(false)
    }
  }

  const cerrarSesion = async () => {
    setMostrarConfirmacionSalir(false)

    try {
      if (usuario?.id && dispositivoId) {
        const { error } = await supabase
          .from('sesiones_dispositivo')
          .update({
            estado: 'cerrada_manual',
            ultima_actividad: new Date().toISOString(),
            notificado_cierre: true
          })
          .eq('user_id', usuario.id)
          .eq('dispositivo_id', dispositivoId)

        if (error) {
          console.error(
            'No se pudo marcar el cierre manual del dispositivo:',
            error
          )
        }
      }
    } finally {
      await supabase.auth.signOut({ scope: 'local' })
    }
  }

  if (cargandoSesion) {
    return (
      <div className="loading-screen">
        <p>Cargando Agenda Familiar...</p>
      </div>
    )
  }

  if (!usuario) {
    return (
      <Login
        onLogin={(usuarioLogin) => {
          setLoginReciente(true)
          setUsuario(usuarioLogin)
        }}
      />
    )
  }

  if (cargandoFamilia) {
    return (
      <div className="loading-screen">
        <p>Cargando tu familia...</p>
      </div>
    )
  }

  if (!familia) {
    return (
      <FamilySetup
        usuario={usuario}
        onFamiliaCreada={manejarFamiliaCreada}
      />
    )
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">🏠</div>

          <div>
            <h1>Agenda Familiar</h1>
            <p>Familia conectada</p>
          </div>
        </div>

        <nav className="menu">
          <button
            className={`menu-item ${
              seccion === 'inicio' ? 'active' : ''
            }`}
            onClick={() => setSeccion('inicio')}
          >
            🏠 Inicio
          </button>

          <button
            className={`menu-item ${
              seccion === 'calendario' ? 'active' : ''
            }`}
            onClick={() => setSeccion('calendario')}
          >
            📅 Calendario
          </button>

          <button
            className={`menu-item ${
              seccion === 'tareas' ? 'active' : ''
            }`}
            onClick={() => setSeccion('tareas')}
          >
            <span className="menu-item-con-badge">
              <span>✅ Tareas</span>
              {novedadesTareas > 0 && (
                <span className="contador-novedades">
                  {novedadesTareas > 99 ? '99+' : novedadesTareas}
                </span>
              )}
            </span>
          </button>

          <button
            className={`menu-item ${
              seccion === 'compras' ? 'active' : ''
            }`}
            onClick={() => setSeccion('compras')}
          >
            🛒 Compras
          </button>

          <button
            className={`menu-item ${
              seccion === 'gastos' ? 'active' : ''
            }`}
            onClick={() => setSeccion('gastos')}
          >
            💰 Gastos
          </button>

          <button
            className={`menu-item ${
              seccion === 'familia' ? 'active' : ''
            }`}
            onClick={() => setSeccion('familia')}
          >
            👨‍👩‍👧‍👦 Familia
          </button>
        </nav>

        <div className="sidebar-bottom">
          <button
            className="sidebar-logout-button"
            onClick={() => setMostrarConfirmacionSalir(true)}
          >
            <span>↪</span>
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar compact-topbar">
          <div>
            {seccion === 'inicio' ? (
              <>
                <p className="eyebrow">
                  {familia.nombre}
                </p>

                <h2>
                  Buenos días,{' '}
                  {usuario.user_metadata?.nombre ||
                    'Usuario'}{' '}
                  👋
                </h2>
              </>
            ) : (
              <h2 className="section-main-title">
                {seccion === 'calendario'
                  ? 'Calendario'
                  : seccion === 'tareas'
                  ? 'Tareas'
                  : seccion === 'compras'
                  ? 'Compras'
                  : seccion === 'gastos'
                  ? 'Gastos'
                  : 'Familia'}
              </h2>
            )}
          </div>

          <div className="topbar-actions">
            <button
              type="button"
              className={`notification-button ${
                notificacionesActivas ? 'active' : ''
              }`}
              onClick={activarNotificaciones}
              disabled={activandoNotificaciones || notificacionesActivas}
              title={
                notificacionesActivas
                  ? 'Notificaciones activadas'
                  : 'Activar notificaciones'
              }
              aria-label={
                notificacionesActivas
                  ? 'Notificaciones activadas'
                  : 'Activar notificaciones'
              }
            >
              {activandoNotificaciones ? '…' : '🔔'}
            </button>

            <button
              type="button"
              className="mobile-logout-button"
              onClick={() => setMostrarConfirmacionSalir(true)}
              title="Cerrar sesión"
              aria-label="Cerrar sesión"
            >
              ↪
            </button>

            {mensajeNotificaciones && (
              <div className="notification-status-message">
                {mensajeNotificaciones}
              </div>
            )}
          </div>
        </header>

        {seccion === 'inicio' && (
          <>
            <section className="family-section">
              {miembros.map((miembro) => (
                <div
                  className="family-member"
                  key={miembro.id}
                >
                  {miembro.user_id === usuario.id ? (
                    <AvatarUploader
                      miembro={miembro}
                      usuario={usuario}
                      onAvatarActualizado={
                        actualizarAvatarLocal
                      }
                    />
                  ) : (
                    <div
                      className="avatar"
                      style={{
                        borderColor: miembro.color,
                        color: miembro.color
                      }}
                    >
                      {miembro.avatar_url ? (
                        <img
                          src={miembro.avatar_url}
                          alt={miembro.nombre}
                        />
                      ) : (
                        obtenerInicial(miembro.nombre)
                      )}
                    </div>
                  )}

                  <span>{miembro.nombre}</span>
                </div>
              ))}
            </section>

            <section className="summary-grid">
              <article className="summary-card event-card">
                <div className="card-icon">
                  📅
                </div>

                <p>PRÓXIMO EVENTO</p>

                <h3>
                  {proximoEvento
                    ? proximoEvento.titulo
                    : 'Sin eventos'}
                </h3>

                <span>
                  {proximoEvento
                    ? formatearFechaEvento(
                        proximoEvento.fecha_inicio,
                        proximoEvento.todo_el_dia
                      )
                    : 'No hay eventos próximos'}
                </span>

                <button
                  onClick={() => setSeccion('calendario')}
                >
                  Ver calendario →
                </button>
              </article>

              <article className="summary-card shopping-card">
                <div className="card-icon">
                  🛒
                </div>

                <p>COMPRAS</p>

                <h3>
                  {listasComprasActivas.length}{' '}
                  {listasComprasActivas.length === 1
                    ? 'lista activa'
                    : 'listas activas'}
                </h3>

                <span>
                  {productosPendientesCompra}{' '}
                  {productosPendientesCompra === 1
                    ? 'producto pendiente'
                    : 'productos pendientes'}
                </span>

                <button onClick={() => setSeccion('compras')}>
                  Ver listas →
                </button>
              </article>

              <article className="summary-card task-card">
                <div className="card-icon">
                  ✅
                </div>

                <p>TAREAS</p>

                <h3>
                  {tareasPendientes.length}{' '}
                  {tareasPendientes.length === 1
                    ? 'pendiente'
                    : 'pendientes'}
                </h3>

                <span>
                  {tareasCompletadas.length}{' '}
                  {tareasCompletadas.length === 1
                    ? 'completada'
                    : 'completadas'}
                </span>

                <button onClick={() => setSeccion('tareas')}>
                  Ver tareas →
                </button>
              </article>

              <article className="summary-card expense-card">
                <div className="card-icon">
                  💰
                </div>

                <p>GASTOS</p>

                <h3>{formatearMontoCLP(totalGastosMesActual)}</h3>

                <span>
                  {gastosMesActual.length}{' '}
                  {gastosMesActual.length === 1
                    ? 'gasto este mes'
                    : 'gastos este mes'}
                </span>

                <button onClick={() => setSeccion('gastos')}>
                  Ver gastos →
                </button>
              </article>
            </section>

            <section className="today-section">
              <div className="section-title">
                <div>
                  <p className="eyebrow">
                    HOY
                  </p>

                  <h3>
                    {cantidadActividadesHoy === 0
                      ? 'No hay actividades para hoy'
                      : `${cantidadActividadesHoy} ${
                          cantidadActividadesHoy === 1
                            ? 'actividad'
                            : 'actividades'
                        } para hoy`}
                  </h3>
                </div>
              </div>

              <div className="event-list">
                {cantidadActividadesHoy === 0 ? (
                  <div className="event-item">
                    <div className="event-info">
                      <strong>
                        Tu agenda está libre por ahora
                      </strong>

                      <span>
                        Los eventos de hoy y las tareas que vencen hoy
                        aparecerán aquí.
                      </span>
                    </div>
                  </div>
                ) : (
                  <>
                    {eventosHoy.map((evento) => (
                      <div
                        className="event-item"
                        key={`evento-${evento.id}`}
                      >
                        <div className="today-activity-type">
                          📅
                        </div>

                        <div className="event-info">
                          <strong>{evento.titulo}</strong>

                          <span>
                            {evento.todo_el_dia
                              ? 'Todo el día'
                              : new Date(
                                  evento.fecha_inicio
                                ).toLocaleTimeString(
                                  'es-CL',
                                  {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  }
                                )}
                          </span>
                        </div>

                        <div className="calendar-assignees">
                          {evento.asignados.map((miembro) => (
                            <span
                              key={miembro.id}
                              className="calendar-assignee-dot"
                              title={miembro.nombre}
                              style={{
                                backgroundColor:
                                  miembro.color
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}

                    {tareasHoy.map((tarea) => (
                      <div
                        className="event-item today-task-item"
                        key={`tarea-${tarea.id}`}
                      >
                        <div className="today-activity-type">
                          ✅
                        </div>

                        <div className="event-info">
                          <strong>{tarea.nombre}</strong>

                          <span>
                            Tarea · Prioridad{' '}
                            {obtenerTextoPrioridad(
                              tarea.prioridad
                            ).toLowerCase()}
                          </span>
                        </div>

                        <div className="calendar-assignees">
                          {tarea.asignados.map((miembro) => (
                            <span
                              key={miembro.id}
                              className="calendar-assignee-dot"
                              title={miembro.nombre}
                              style={{
                                backgroundColor:
                                  miembro.color
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </section>

            <button
              className="floating-button"
              onClick={abrirNuevoEvento}
              title="Nuevo evento"
            >
              ＋
            </button>
          </>
        )}

        {seccion === 'calendario' && (
          <section className="calendar-management">
            <div className="calendar-management-header calendar-actions-only">
              <button
                className="add-member-button"
                onClick={abrirNuevoEvento}
              >
                ＋ Nuevo evento
              </button>
            </div>

            {cargandoEventos ? (
              <div className="calendar-empty">
                Cargando eventos...
              </div>
            ) : eventos.length === 0 ? (
              <div className="calendar-empty">
                <div className="calendar-empty-icon">
                  📅
                </div>

                <h3>Aún no hay eventos</h3>

                <p>
                  Crea el primer evento para comenzar a
                  organizar a la familia.
                </p>

                <button
                  className="member-save-button"
                  onClick={abrirNuevoEvento}
                >
                  Crear primer evento
                </button>
              </div>
            ) : (
              <div className="calendar-event-list">
                {eventos.map((evento) => {
                  const creador = miembros.find(
                    (miembro) =>
                      miembro.user_id === evento.creado_por
                  )

                  return (
                    <article
                      className="calendar-event-card"
                      key={evento.id}
                    >
                      <div className="calendar-event-date">
                        <span>
                          {new Date(
                            evento.fecha_inicio
                          ).toLocaleDateString(
                            'es-CL',
                            { day: '2-digit' }
                          )}
                        </span>

                        <small>
                          {new Date(
                            evento.fecha_inicio
                          )
                            .toLocaleDateString(
                              'es-CL',
                              { month: 'short' }
                            )
                            .replace('.', '')
                            .toUpperCase()}
                        </small>
                      </div>

                      <div className="calendar-event-content">
                        <div className="calendar-event-top">
                          <div>
                            <h3>{evento.titulo}</h3>

                            <p>
                              {evento.todo_el_dia
                                ? 'Todo el día'
                                : formatearFechaEvento(
                                    evento.fecha_inicio
                                  )}
                            </p>
                          </div>

                          {evento.recordatorio_minutos !==
                            null && (
                            <span className="calendar-reminder">
                              🔔{' '}
                              {obtenerTextoRecordatorio(
                                evento.recordatorio_minutos
                              )}
                            </span>
                          )}
                        </div>

                        {evento.descripcion && (
                          <p className="calendar-description">
                            {evento.descripcion}
                          </p>
                        )}

                        <div className="calendar-event-footer">
                          <div className="calendar-assignees-row">
                            {evento.asignados.map((miembro) => (
                              <div
                                className="calendar-assignee"
                                key={miembro.id}
                                title={miembro.nombre}
                              >
                                <div
                                  className="calendar-assignee-avatar"
                                  style={{
                                    borderColor:
                                      miembro.color,
                                    color: miembro.color
                                  }}
                                >
                                  {miembro.avatar_url ? (
                                    <img
                                      src={miembro.avatar_url}
                                      alt={miembro.nombre}
                                    />
                                  ) : (
                                    obtenerInicial(
                                      miembro.nombre
                                    )
                                  )}
                                </div>

                                <span>{miembro.nombre}</span>
                              </div>
                            ))}
                          </div>

                          <div className="calendar-event-meta">
                            <small className="calendar-created-by">
                              Creado por:{' '}
                              {creador?.nombre || 'Miembro'}
                            </small>

                            {evento.creado_por === usuario.id && (
                              <button
                                type="button"
                                className="calendar-edit-button"
                                onClick={() => abrirEditarEvento(evento)}
                              >
                                ✏️ Editar
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </section>
        )}

        {seccion === 'tareas' && (
          <section className="tasks-management">
            <div className="tasks-management-header">
              <div>
                <p className="eyebrow">TAREAS FAMILIARES</p>
                <p className="subtitle">
                  Organiza pendientes y reparte responsabilidades.
                </p>
              </div>

              <button
                className="add-member-button"
                onClick={abrirNuevaTarea}
              >
                ＋ Nueva tarea
              </button>
            </div>

            {cargandoTareas ? (
              <div className="calendar-empty">
                Cargando tareas...
              </div>
            ) : tareas.length === 0 ? (
              <div className="calendar-empty">
                <div className="calendar-empty-icon">✅</div>

                <h3>Aún no hay tareas</h3>

                <p>
                  Usa el botón + Nueva tarea para crear la primera y comenzar a organizar los pendientes.
                </p>
              </div>
            ) : (
              <div className="task-list">
                {tareas.map((tarea) => {
                  const creador = miembros.find(
                    (miembro) =>
                      miembro.user_id === tarea.creado_por
                  )

                  return (
                    <article
                      className={`task-family-card priority-${tarea.prioridad} ${
                        tareasEliminandose.includes(tarea.id)
                          ? 'task-deleting'
                          : ''
                      }`}
                      key={tarea.id}
                    >
                      <div className="task-family-main">
                        <div className="task-family-top">
                          <div>
                            <span className={`task-priority-badge priority-${tarea.prioridad}`}>
                              {obtenerTextoPrioridad(tarea.prioridad)}
                            </span>

                            <h3>{tarea.nombre}</h3>
                          </div>

                          <span className={`task-status-badge ${tarea.estado}`}>
                            {tarea.estado === 'completada'
                              ? '✓ Completada'
                              : 'Pendiente'}
                          </span>
                        </div>

                        {tarea.descripcion && (
                          <p className="task-description">
                            {tarea.descripcion}
                          </p>
                        )}

                        <div className="task-family-details">
                          <span>
                            📅 {formatearFechaTarea(tarea.fecha_limite)}
                          </span>

                          <span>
                            Creada por: {creador?.nombre || 'Miembro'}
                          </span>
                        </div>

                        <div className="calendar-assignees-row">
                          {tarea.asignados.map((miembro) => (
                            <div
                              className="calendar-assignee"
                              key={miembro.id}
                              title={miembro.nombre}
                            >
                              <div
                                className="calendar-assignee-avatar"
                                style={{
                                  borderColor: miembro.color,
                                  color: miembro.color
                                }}
                              >
                                {miembro.avatar_url ? (
                                  <img
                                    src={miembro.avatar_url}
                                    alt={miembro.nombre}
                                  />
                                ) : (
                                  obtenerInicial(miembro.nombre)
                                )}
                              </div>

                              <span>{miembro.nombre}</span>
                            </div>
                          ))}
                        </div>

                        <div className="task-family-actions">
                          {tarea.creado_por === usuario.id &&
                            tarea.estado !== 'completada' && (
                              <button
                                type="button"
                                className="task-edit-button"
                                onClick={() => abrirEditarTarea(tarea)}
                              >
                                ✏️ Editar
                              </button>
                            )}

                          <button
                            type="button"
                            className={`task-complete-button ${
                              tarea.estado === 'completada'
                                ? 'completed'
                                : ''
                            }`}
                            onClick={() => cambiarEstadoTarea(tarea)}
                            disabled={
                              tarea.estado === 'completada' ||
                              tareasEliminandose.includes(tarea.id)
                            }
                          >
                            {tarea.estado === 'completada'
                              ? '✓ Completada · eliminando...'
                              : '✓ Marcar como completada'}
                          </button>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </section>
        )}

        {seccion === 'compras' && (
          <section className="shopping-management">
            <div className="shopping-management-header">
              <div>
                <p className="eyebrow">COMPRAS FAMILIARES</p>
                <p className="subtitle">
                  Crea listas y organiza las compras de la familia.
                </p>
              </div>

              <button
                className="add-member-button"
                onClick={abrirNuevaListaCompra}
              >
                ＋ Nueva lista
              </button>
            </div>

            {cargandoCompras ? (
              <div className="calendar-empty">
                Cargando listas...
              </div>
            ) : (
              <>
                <div className="shopping-section-heading">
                  <div>
                    <h3>Listas activas</h3>
                    <span>
                      {listasComprasActivas.length}{' '}
                      {listasComprasActivas.length === 1
                        ? 'lista'
                        : 'listas'}
                    </span>
                  </div>
                </div>

                {listasComprasActivas.length === 0 ? (
                  <div className="calendar-empty shopping-empty">
                    <div className="calendar-empty-icon">🛒</div>
                    <h3>Aún no hay listas de compras</h3>
                    <p>
                      Usa el botón + Nueva lista para crear la primera y comenzar a agregar productos.
                    </p>
                  </div>
                ) : (
                  <div className="shopping-list-grid">
                    {listasComprasActivas.map((lista) => {
                      const comprados = lista.productos.filter(
                        (producto) => producto.comprado
                      ).length

                      const total = lista.productos.length

                      const creador = miembros.find(
                        (miembro) =>
                          miembro.user_id === lista.creado_por
                      )

                      return (
                        <button
                          type="button"
                          className="shopping-list-card"
                          key={lista.id}
                          onClick={() => abrirListaCompra(lista)}
                        >
                          <div className="shopping-list-card-icon">
                            🛒
                          </div>

                          <div className="shopping-list-card-content">
                            <div className="shopping-list-card-top">
                              <h3>{lista.nombre}</h3>
                              <span className="shopping-active-badge">
                                Activa
                              </span>
                            </div>

                            <p>
                              {total === 0
                                ? 'Sin productos todavía'
                                : `${comprados} de ${total} comprados`}
                            </p>

                            <div className="shopping-progress">
                              <span
                                style={{
                                  width:
                                    total === 0
                                      ? '0%'
                                      : `${(comprados / total) * 100}%`
                                }}
                              />
                            </div>

                            <small>
                              Creada por: {creador?.nombre || 'Miembro'}
                            </small>
                          </div>

                          <span className="shopping-card-arrow">→</span>
                        </button>
                      )
                    })}
                  </div>
                )}

                <div className="shopping-completed-block">
                  <div className="shopping-section-heading">
                    <div>
                      <h3>Listas completadas</h3>
                      <span>
                        {listasComprasCompletadas.length}{' '}
                        {listasComprasCompletadas.length === 1
                          ? 'lista'
                          : 'listas'}
                      </span>
                    </div>
                  </div>

                  {listasComprasCompletadas.length === 0 ? (
                    <div className="shopping-completed-empty">
                      <span>✓</span>
                      <div>
                        <strong>No hay listas completadas</strong>
                        <p>
                          Cuando finalices una compra, aparecerá aquí.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="shopping-list-grid completed">
                      {listasComprasCompletadas.map((lista) => (
                        <div
                          className="shopping-list-card completed"
                          key={lista.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => abrirListaCompra(lista)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              abrirListaCompra(lista)
                            }
                          }}
                        >
                          <div className="shopping-list-card-icon">
                            ✓
                          </div>

                          <div className="shopping-list-card-content">
                            <div className="shopping-list-card-top">
                              <h3>{lista.nombre}</h3>
                              <span className="shopping-completed-badge">
                                Completada
                              </span>
                            </div>

                            <p>
                              {lista.productos.length}{' '}
                              {lista.productos.length === 1
                                ? 'producto'
                                : 'productos'}
                            </p>

                            <small>
                              {lista.completada_at
                                ? `Finalizada ${new Date(
                                    lista.completada_at
                                  ).toLocaleDateString('es-CL')}`
                                : 'Lista finalizada'}
                            </small>
                          </div>

                          <div className="shopping-completed-card-actions">
                            {lista.creado_por === usuario?.id && (
                              <button
                                type="button"
                                className="shopping-completed-delete-icon"
                                title="Eliminar lista"
                                aria-label={`Eliminar ${lista.nombre}`}
                                onClick={(e) =>
                                  solicitarEliminarListaCompra(lista, e)
                                }
                              >
                                🗑️
                              </button>
                            )}

                            <span className="shopping-card-arrow">→</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </section>
        )}

        {seccion === 'gastos' && (
          <section className="expenses-management">
            <div className="expenses-management-header">
              <div>
                <p className="eyebrow">GASTOS FAMILIARES</p>
                <p className="subtitle">
                  Registra y revisa los gastos compartidos de la familia.
                </p>
              </div>

              <button
                className="add-member-button"
                onClick={abrirNuevoGasto}
              >
                ＋ Nuevo gasto
              </button>
            </div>

            <div className="expenses-summary-grid">
              <article className="expenses-total-card">
                <span className="expenses-summary-icon">💰</span>
                <div>
                  <p>TOTAL ESTE MES</p>
                  <h3>{formatearMontoCLP(totalGastosMesActual)}</h3>
                  <span>
                    {gastosMesActual.length}{' '}
                    {gastosMesActual.length === 1
                      ? 'movimiento'
                      : 'movimientos'}
                  </span>
                </div>
              </article>

              <article className="expenses-total-card secondary">
                <span className="expenses-summary-icon">🧾</span>
                <div>
                  <p>REGISTRADOS</p>
                  <h3>{gastos.length}</h3>
                  <span>Gastos en el historial</span>
                </div>
              </article>
            </div>

            <div className="expenses-section-heading">
              <div>
                <h3>
                  Gastos de{' '}
                  {nombreMesActual.charAt(0).toUpperCase() +
                    nombreMesActual.slice(1)}
                </h3>
                <span>
                  {gastosMesActual.length}{' '}
                  {gastosMesActual.length === 1 ? 'gasto' : 'gastos'}
                </span>
              </div>
            </div>

            {cargandoGastos ? (
              <div className="calendar-empty">
                Cargando gastos...
              </div>
            ) : gastosMesActual.length === 0 ? (
              <div className="calendar-empty expenses-empty">
                <div className="calendar-empty-icon">💰</div>
                <h3>Aún no hay gastos registrados</h3>
                <p>
                  Registra el primer gasto del mes para comenzar a llevar el control.
                </p>

                <button
                  className="member-save-button"
                  onClick={abrirNuevoGasto}
                >
                  Registrar primer gasto
                </button>
              </div>
            ) : (
              <div className="expenses-list">
                {gastosMesActual.map((gasto) => {
                  const pagador = miembros.find(
                    (miembro) => miembro.id === gasto.pagado_por
                  )

                  const [anio, mes, dia] = gasto.fecha
                    .split('-')
                    .map(Number)

                  const fechaTexto = new Date(
                    anio,
                    mes - 1,
                    dia
                  ).toLocaleDateString('es-CL', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })

                  return (
                    <article className="expense-row" key={gasto.id}>
                      <div className="expense-category-icon">
                        {obtenerIconoCategoriaGasto(gasto.categoria)}
                      </div>

                      <div className="expense-main-info">
                        <div className="expense-title-row">
                          <h3>{gasto.concepto}</h3>
                          <strong>{formatearMontoCLP(gasto.monto)}</strong>
                        </div>

                        <div className="expense-meta">
                          <span>
                            {obtenerNombreCategoriaGasto(
                              gasto.categoria
                            )}
                          </span>

                          <span>•</span>

                          <span>{fechaTexto}</span>
                        </div>

                        <div className="expense-paid-by">
                          <span>Pagó</span>

                          {pagador && (
                            <span
                              className="expense-payer-dot"
                              style={{
                                backgroundColor: pagador.color
                              }}
                            />
                          )}

                          <strong>
                            {pagador?.nombre || 'Miembro'}
                          </strong>
                        </div>

                        {gasto.nota && (
                          <p className="expense-note">{gasto.nota}</p>
                        )}
                      </div>

                      {gasto.creado_por === usuario?.id && (
                        <div className="expense-row-actions">
                          <button
                            type="button"
                            className="expense-action-icon"
                            onClick={() => abrirEditarGasto(gasto)}
                            title="Editar gasto"
                            aria-label={`Editar ${gasto.concepto}`}
                          >
                            ✏️
                          </button>

                          <button
                            type="button"
                            className="expense-action-icon delete"
                            onClick={() => solicitarEliminarGasto(gasto)}
                            title="Eliminar gasto"
                            aria-label={`Eliminar ${gasto.concepto}`}
                          >
                            🗑️
                          </button>
                        </div>
                      )}
                    </article>
                  )
                })}
              </div>
            )}

            <div className="expenses-monthly-history">
              <div className="expenses-section-heading">
                <div>
                  <h3>Historial mensual</h3>
                  <span>
                    {gastosMesesAnteriores.length}{' '}
                    {gastosMesesAnteriores.length === 1
                      ? 'mes anterior'
                      : 'meses anteriores'}
                  </span>
                </div>
              </div>

              {gastosMesesAnteriores.length === 0 ? (
                <div className="expenses-history-empty">
                  <span>📁</span>
                  <div>
                    <strong>Aún no hay meses cerrados</strong>
                    <p>
                      Cuando cambie el mes, los gastos anteriores
                      aparecerán automáticamente aquí.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="expenses-month-groups">
                  {gastosMesesAnteriores.map((grupo) => (
                    <details
                      className="expenses-month-group"
                      key={grupo.clave}
                    >
                      <summary>
                        <div>
                          <strong>
                            {grupo.nombre.charAt(0).toUpperCase() +
                              grupo.nombre.slice(1)}
                          </strong>

                          <span>
                            {grupo.gastos.length}{' '}
                            {grupo.gastos.length === 1
                              ? 'gasto'
                              : 'gastos'}
                          </span>
                        </div>

                        <strong>
                          {formatearMontoCLP(grupo.total)}
                        </strong>
                      </summary>

                      <div className="expenses-month-list">
                        {grupo.gastos.map((gasto) => {
                          const pagador = miembros.find(
                            (miembro) =>
                              miembro.id === gasto.pagado_por
                          )

                          const [anio, mes, dia] = gasto.fecha
                            .split('-')
                            .map(Number)

                          const fechaTexto = new Date(
                            anio,
                            mes - 1,
                            dia
                          ).toLocaleDateString('es-CL', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })

                          return (
                            <article
                              className="expense-row history"
                              key={gasto.id}
                            >
                              <div className="expense-category-icon">
                                {obtenerIconoCategoriaGasto(
                                  gasto.categoria
                                )}
                              </div>

                              <div className="expense-main-info">
                                <div className="expense-title-row">
                                  <h3>{gasto.concepto}</h3>
                                  <strong>
                                    {formatearMontoCLP(gasto.monto)}
                                  </strong>
                                </div>

                                <div className="expense-meta">
                                  <span>
                                    {obtenerNombreCategoriaGasto(
                                      gasto.categoria
                                    )}
                                  </span>
                                  <span>•</span>
                                  <span>{fechaTexto}</span>
                                </div>

                                <div className="expense-paid-by">
                                  <span>Pagó</span>

                                  {pagador && (
                                    <span
                                      className="expense-payer-dot"
                                      style={{
                                        backgroundColor:
                                          pagador.color
                                      }}
                                    />
                                  )}

                                  <strong>
                                    {pagador?.nombre || 'Miembro'}
                                  </strong>
                                </div>
                              </div>

                              {gasto.creado_por === usuario?.id && (
                                <div className="expense-row-actions">
                                  <button
                                    type="button"
                                    className="expense-action-icon"
                                    onClick={() => abrirEditarGasto(gasto)}
                                    title="Editar gasto"
                                    aria-label={`Editar ${gasto.concepto}`}
                                  >
                                    ✏️
                                  </button>

                                  <button
                                    type="button"
                                    className="expense-action-icon delete"
                                    onClick={() => solicitarEliminarGasto(gasto)}
                                    title="Eliminar gasto"
                                    aria-label={`Eliminar ${gasto.concepto}`}
                                  >
                                    🗑️
                                  </button>
                                </div>
                              )}
                            </article>
                          )
                        })}
                      </div>
                    </details>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {seccion === 'familia' && (
          <section className="family-management">
            <div className="family-management-header">
              <div>
                <p className="eyebrow">
                  FAMILIA
                </p>

                <h2>{familia.nombre}</h2>

                <p className="subtitle">
                  Administra los integrantes de tu familia
                </p>
              </div>

              <button
                className="add-member-button"
                onClick={() =>
                  setMostrarModalIntegrante(true)
                }
              >
                ＋ Agregar integrante
              </button>
            </div>

            <div className="family-invite-card">
              <div className="family-invite-icon">
                🔗
              </div>

              <div className="family-invite-content">
                <p className="eyebrow">
                  CÓDIGO DE INVITACIÓN
                </p>

                <h3>Invita a tu familia</h3>

                <p>
                  Comparte este código con tu pareja o familiares para que puedan unirse a {familia.nombre}.
                </p>

                <div className="family-invite-code-row">
                  <strong className="family-invite-code">
                    {familia.codigo_invitacion}
                  </strong>

                  <button
                    type="button"
                    className="family-copy-code-button"
                    onClick={copiarCodigoInvitacion}
                  >
                    {codigoInvitacionCopiado
                      ? '✓ Copiado'
                      : 'Copiar código'}
                  </button>
                </div>
              </div>
            </div>

            <div className="family-cards">
              {miembros.map((miembro) => (
                <article
                  className="family-card"
                  key={miembro.id}
                >
                  {miembro.user_id === usuario.id ? (
                    <AvatarUploader
                      miembro={miembro}
                      usuario={usuario}
                      onAvatarActualizado={
                        actualizarAvatarLocal
                      }
                    />
                  ) : (
                    <div
                      className="avatar"
                      style={{
                        borderColor: miembro.color,
                        color: miembro.color
                      }}
                    >
                      {miembro.avatar_url ? (
                        <img
                          src={miembro.avatar_url}
                          alt={miembro.nombre}
                        />
                      ) : (
                        obtenerInicial(miembro.nombre)
                      )}
                    </div>
                  )}

                  <div className="family-card-info">
                    <h3>
                      {miembro.nombre}
                    </h3>

                    <span className="family-role">
                      {miembro.rol ===
                      'administrador'
                        ? 'Administrador'
                        : miembro.tipo ===
                          'perfil'
                        ? 'Perfil familiar'
                        : 'Miembro'}
                    </span>

                    <div className="member-color-row">
                      <span
                        className="member-color"
                        style={{
                          backgroundColor:
                            miembro.color
                        }}
                      />

                      <small>
                        {miembro.color}
                      </small>
                    </div>
                  </div>

                  {miembro.tipo === 'perfil' && (
  <button
    className="edit-member-button"
    onClick={() =>
      abrirEditarIntegrante(miembro)
    }
  >
    Editar
  </button>
)}
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      <nav className="mobile-bottom-nav" aria-label="Navegación principal">
        <button
          type="button"
          className={seccion === 'inicio' ? 'active' : ''}
          onClick={() => setSeccion('inicio')}
        >
          <span>🏠</span>
          <small>Inicio</small>
        </button>

        <button
          type="button"
          className={seccion === 'calendario' ? 'active' : ''}
          onClick={() => setSeccion('calendario')}
        >
          <span>📅</span>
          <small>Calendario</small>
        </button>

        <button
          type="button"
          className={seccion === 'tareas' ? 'active' : ''}
          onClick={() => setSeccion('tareas')}
        >
          <span className="mobile-nav-icono">
            ✅
            {novedadesTareas > 0 && (
              <span className="contador-novedades contador-novedades-mobile">
                {novedadesTareas > 99 ? '99+' : novedadesTareas}
              </span>
            )}
          </span>
          <small>Tareas</small>
        </button>

        <button
          type="button"
          className={seccion === 'compras' ? 'active' : ''}
          onClick={() => setSeccion('compras')}
        >
          <span>🛒</span>
          <small>Compras</small>
        </button>

        <button
          type="button"
          className={seccion === 'gastos' ? 'active' : ''}
          onClick={() => setSeccion('gastos')}
        >
          <span>💰</span>
          <small>Gastos</small>
        </button>

        <button
          type="button"
          className={seccion === 'familia' ? 'active' : ''}
          onClick={() => setSeccion('familia')}
        >
          <span>👨‍👩‍👧‍👦</span>
          <small>Familia</small>
        </button>
      </nav>

      {mostrarModalEvento && (
        <div
          className="member-modal-overlay"
          onClick={cerrarModalEvento}
        >
          <div
            className="member-modal calendar-event-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="member-modal-header">
              <div>
                <p className="eyebrow">
                  {eventoEditando ? 'EDITAR EVENTO' : 'NUEVO EVENTO'}
                </p>

                <h2>
                  {eventoEditando
                    ? 'Editar evento'
                    : 'Agregar al calendario'}
                </h2>
              </div>

              <button
                type="button"
                className="member-modal-close"
                onClick={cerrarModalEvento}
              >
                ×
              </button>
            </div>

            <form
              onSubmit={
                eventoEditando
                  ? guardarEdicionEvento
                  : crearEvento
              }
            >
              <div className="member-form-field">
                <label>Título</label>

                <input
                  type="text"
                  placeholder="Ej: Dentista Renato"
                  value={tituloEvento}
                  onChange={(e) =>
                    setTituloEvento(e.target.value)
                  }
                  autoFocus
                />
              </div>

              <div className="member-form-field">
                <label>Descripción</label>

                <textarea
                  placeholder="Agrega detalles opcionales..."
                  value={descripcionEvento}
                  onChange={(e) =>
                    setDescripcionEvento(e.target.value)
                  }
                  rows="3"
                />
              </div>

              <div className="calendar-form-grid">
                <div className="member-form-field">
                  <label>Fecha</label>

                  <input
                    type="date"
                    min={fechaMinimaPermitida}
                    value={fechaEvento}
                    onChange={(e) =>
                      setFechaEvento(e.target.value)
                    }
                  />
                </div>

                <div className="member-form-field">
                  <label>Hora</label>

                  <input
                    type="time"
                    value={horaEvento}
                    onChange={(e) =>
                      setHoraEvento(e.target.value)
                    }
                    disabled={todoElDiaEvento}
                  />
                </div>
              </div>

              <label className="calendar-checkbox-row">
                <input
                  type="checkbox"
                  checked={todoElDiaEvento}
                  onChange={(e) => {
                    setTodoElDiaEvento(
                      e.target.checked
                    )

                    if (e.target.checked) {
                      setHoraEvento('')
                    }
                  }}
                />

                <span>Evento de todo el día</span>
              </label>

              <div className="member-form-field">
                <label>Recordatorio</label>

                <select
                  value={recordatorioEvento}
                  onChange={(e) =>
                    setRecordatorioEvento(
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    Sin recordatorio
                  </option>
                  <option value="0">
                    Al comenzar
                  </option>
                  <option value="15">
                    15 minutos antes
                  </option>
                  <option value="30">
                    30 minutos antes
                  </option>
                  <option value="60">
                    1 hora antes
                  </option>
                  <option value="1440">
                    1 día antes
                  </option>
                </select>
              </div>

              <div className="member-form-field">
                <div className="calendar-assignment-header">
                  <label>Asignar a</label>

                  <button
                    type="button"
                    className="calendar-select-all"
                    onClick={seleccionarTodaLaFamilia}
                  >
                    {asignadosEvento.length ===
                    miembros.length
                      ? 'Quitar todos'
                      : 'Toda la familia'}
                  </button>
                </div>

                <div className="calendar-member-selector">
                  {miembros.map((miembro) => {
                    const seleccionado =
                      asignadosEvento.includes(
                        miembro.id
                      )

                    return (
                      <button
                        type="button"
                        key={miembro.id}
                        className={`calendar-member-option ${
                          seleccionado
                            ? 'selected'
                            : ''
                        }`}
                        style={{
                          borderColor: seleccionado
                            ? miembro.color
                            : undefined
                        }}
                        onClick={() =>
                          alternarAsignadoEvento(
                            miembro.id
                          )
                        }
                      >
                        <span
                          className="calendar-member-mini-avatar"
                          style={{
                            borderColor:
                              miembro.color,
                            color: miembro.color
                          }}
                        >
                          {miembro.avatar_url ? (
                            <img
                              src={miembro.avatar_url}
                              alt={miembro.nombre}
                            />
                          ) : (
                            obtenerInicial(
                              miembro.nombre
                            )
                          )}
                        </span>

                        <span>{miembro.nombre}</span>

                        <strong>
                          {seleccionado ? '✓' : '+'}
                        </strong>
                      </button>
                    )
                  })}
                </div>
              </div>

              {mensajeEvento && (
                <div className="member-form-message">
                  {mensajeEvento}
                </div>
              )}

              <div
                className="member-modal-actions calendar-modal-actions"
              >
                {eventoEditando && (
                  <button
                    type="button"
                    className="member-delete-button"
                    onClick={() =>
                      setMostrarConfirmacionEliminarEvento(true)
                    }
                    disabled={
                      guardandoEvento || eliminandoEvento
                    }
                  >
                    Eliminar evento
                  </button>
                )}

                <div className="calendar-modal-actions-right">
                  <button
                    type="button"
                    className="member-cancel-button"
                    onClick={cerrarModalEvento}
                    disabled={
                      guardandoEvento || eliminandoEvento
                    }
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="member-save-button"
                    disabled={
                      guardandoEvento || eliminandoEvento
                    }
                  >
                    {guardandoEvento
                      ? 'Guardando...'
                      : eventoEditando
                      ? 'Guardar cambios'
                      : 'Crear evento'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {gastoAEliminar && (
        <div
          className="member-modal-overlay event-delete-confirm-overlay"
          onClick={() =>
            !eliminandoGasto && setGastoAEliminar(null)
          }
        >
          <div
            className="member-modal delete-confirm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="delete-confirm-icon">🗑️</div>

            <h2>¿Eliminar “{gastoAEliminar.concepto}”?</h2>

            <p className="delete-confirm-text">
              Este gasto se eliminará definitivamente del registro familiar.
              Esta acción no se puede deshacer.
            </p>

            <div className="delete-confirm-actions">
              <button
                type="button"
                className="member-cancel-button"
                onClick={() => setGastoAEliminar(null)}
                disabled={eliminandoGasto}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="member-delete-confirm-button"
                onClick={eliminarGasto}
                disabled={eliminandoGasto}
              >
                {eliminandoGasto
                  ? 'Eliminando...'
                  : 'Sí, eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {mostrarModalGasto && (
        <div
          className="member-modal-overlay"
          onClick={cerrarModalGasto}
        >
          <div
            className="member-modal expense-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="member-modal-header">
              <div>
                <p className="eyebrow">
                  {gastoEditando ? 'EDITAR GASTO' : 'NUEVO GASTO'}
                </p>
                <h2>
                  {gastoEditando ? 'Editar gasto' : 'Registrar gasto'}
                </h2>
              </div>

              <button
                type="button"
                className="member-modal-close"
                onClick={cerrarModalGasto}
              >
                ×
              </button>
            </div>

            <form onSubmit={guardarGasto}>
              <div className="member-form-field">
                <label>Concepto</label>
                <input
                  type="text"
                  placeholder="Ej: Supermercado Líder"
                  value={conceptoGasto}
                  onChange={(e) => setConceptoGasto(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="expense-form-grid">
                <div className="member-form-field">
                  <label>Monto</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    placeholder="Ej: 48990"
                    value={montoGasto}
                    onChange={(e) => setMontoGasto(e.target.value)}
                  />
                </div>

                <div className="member-form-field">
                  <label>Fecha</label>
                  <input
                    type="date"
                    value={fechaGasto}
                    onChange={(e) => setFechaGasto(e.target.value)}
                  />
                </div>
              </div>

              <div className="expense-form-grid">
                <div className="member-form-field">
                  <label>Categoría</label>
                  <select
                    value={categoriaGasto}
                    onChange={(e) =>
                      setCategoriaGasto(e.target.value)
                    }
                  >
                    <option value="supermercado">Supermercado</option>
                    <option value="hogar">Hogar</option>
                    <option value="cuentas">Cuentas</option>
                    <option value="transporte">Transporte</option>
                    <option value="salud">Salud</option>
                    <option value="educacion">Educación</option>
                    <option value="entretencion">Entretención</option>
                    <option value="comida">Comida</option>
                    <option value="otros">Otros</option>
                  </select>
                </div>

                <div className="member-form-field">
                  <label>¿Quién pagó?</label>
                  <select
                    value={pagadoPorGasto}
                    onChange={(e) =>
                      setPagadoPorGasto(e.target.value)
                    }
                  >
                    <option value="">Seleccionar</option>

                    {miembros.map((miembro) => (
                      <option key={miembro.id} value={miembro.id}>
                        {miembro.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="member-form-field">
                <label>Nota opcional</label>
                <textarea
                  placeholder="Ej: Compra semanal"
                  value={notaGasto}
                  onChange={(e) => setNotaGasto(e.target.value)}
                  rows="3"
                />
              </div>

              {mensajeGasto && (
                <div className="member-form-message">
                  {mensajeGasto}
                </div>
              )}

              <div className="member-modal-actions">
                <button
                  type="button"
                  className="member-cancel-button"
                  onClick={cerrarModalGasto}
                  disabled={guardandoGasto}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="member-save-button"
                  disabled={guardandoGasto}
                >
                  {guardandoGasto
                    ? 'Guardando...'
                    : gastoEditando
                      ? 'Guardar cambios'
                      : 'Registrar gasto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {listaCompraSeleccionada && (
        <div
          className="member-modal-overlay shopping-detail-overlay"
          onClick={cerrarListaCompra}
        >
          <div
            className="member-modal shopping-detail-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="member-modal-header shopping-detail-header">
              <div>
                <p className="eyebrow">
                  {listaCompraSeleccionada.estado === 'completada'
                    ? 'LISTA COMPLETADA'
                    : 'LISTA DE COMPRAS'}
                </p>

                <h2>{listaCompraSeleccionada.nombre}</h2>

                <span className="shopping-detail-counter">
                  {
                    listaCompraSeleccionada.productos.filter(
                      (producto) => producto.comprado
                    ).length
                  }{' '}
                  de {listaCompraSeleccionada.productos.length} comprados
                </span>
              </div>

              <button
                type="button"
                className="member-modal-close"
                onClick={cerrarListaCompra}
              >
                ×
              </button>
            </div>

            {listaCompraSeleccionada.estado === 'activa' && (
              <form
                className="shopping-add-product-form"
                onSubmit={agregarProductoCompra}
              >
                <div className="shopping-add-product-fields">
                  <div className="member-form-field">
                    <label>Producto</label>
                    <input
                      type="text"
                      placeholder="Ej: Leche"
                      value={nombreProductoCompra}
                      onChange={(e) =>
                        setNombreProductoCompra(e.target.value)
                      }
                    />
                  </div>

                  <div className="member-form-field shopping-quantity-field">
                    <label>Cantidad</label>
                    <input
                      type="text"
                      placeholder="Ej: 2"
                      value={cantidadProductoCompra}
                      onChange={(e) =>
                        setCantidadProductoCompra(e.target.value)
                      }
                    />
                  </div>

                  <button
                    type="submit"
                    className="member-save-button shopping-add-product-button"
                    disabled={guardandoProductoCompra}
                  >
                    {guardandoProductoCompra ? 'Agregando...' : '＋ Agregar'}
                  </button>
                </div>
              </form>
            )}

            {mensajeProductoCompra && (
              <div className="member-form-message">
                {mensajeProductoCompra}
              </div>
            )}

            <div className="shopping-products-list">
              {listaCompraSeleccionada.productos.length === 0 ? (
                <div className="shopping-products-empty">
                  <span>🧺</span>
                  <strong>La lista está vacía</strong>
                  <p>Agrega el primer producto para comenzar.</p>
                </div>
              ) : (
                listaCompraSeleccionada.productos.map((producto) => (
                  <div
                    className={`shopping-product-item ${
                      producto.comprado ? 'purchased' : ''
                    }`}
                    key={producto.id}
                  >
                    <button
                      type="button"
                      className={`shopping-product-check ${
                        producto.comprado ? 'checked' : ''
                      }`}
                      onClick={() => alternarProductoComprado(producto)}
                      disabled={
                        listaCompraSeleccionada.estado === 'completada'
                      }
                      aria-label={
                        producto.comprado
                          ? 'Marcar como pendiente'
                          : 'Marcar como comprado'
                      }
                    >
                      {producto.comprado ? '✓' : ''}
                    </button>

                    <div className="shopping-product-info">
                      <strong>{producto.nombre}</strong>
                      {producto.cantidad && (
                        <span>Cantidad: {producto.cantidad}</span>
                      )}
                    </div>

                    {listaCompraSeleccionada.estado === 'activa' && (
                      <button
                        type="button"
                        className="shopping-product-delete"
                        onClick={() =>
                          eliminarProductoCompra(producto.id)
                        }
                        title="Eliminar producto"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            {listaCompraSeleccionada.estado === 'activa' ? (
              <div className="shopping-detail-footer">
                <span>
                  {
                    listaCompraSeleccionada.productos.filter(
                      (producto) => !producto.comprado
                    ).length
                  }{' '}
                  pendientes
                </span>

                <button
                  type="button"
                  className="shopping-finish-button"
                  onClick={finalizarListaCompra}
                  disabled={finalizandoListaCompra}
                >
                  {finalizandoListaCompra
                    ? 'Finalizando...'
                    : '✓ Finalizar lista'}
                </button>
              </div>
            ) : (
              <div className="shopping-completed-readonly">
                ✓ Esta lista está completada y se conserva como historial.
              </div>
            )}
          </div>
        </div>
      )}

      {mostrarModalListaCompra && (
        <div
          className="member-modal-overlay"
          onClick={cerrarModalListaCompra}
        >
          <div
            className="member-modal shopping-list-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="member-modal-header">
              <div>
                <p className="eyebrow">NUEVA LISTA</p>
                <h2>Crear lista de compras</h2>
              </div>

              <button
                type="button"
                className="member-modal-close"
                onClick={cerrarModalListaCompra}
              >
                ×
              </button>
            </div>

            <form onSubmit={crearListaCompra}>
              <div className="member-form-field">
                <label>Nombre de la lista</label>

                <input
                  type="text"
                  placeholder="Ej: Supermercado"
                  value={nombreListaCompra}
                  onChange={(e) =>
                    setNombreListaCompra(e.target.value)
                  }
                  autoFocus
                />
              </div>

              {mensajeListaCompra && (
                <div className="member-form-message">
                  {mensajeListaCompra}
                </div>
              )}

              <div className="member-modal-actions">
                <button
                  type="button"
                  className="member-cancel-button"
                  onClick={cerrarModalListaCompra}
                  disabled={guardandoListaCompra}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="member-save-button"
                  disabled={guardandoListaCompra}
                >
                  {guardandoListaCompra
                    ? 'Creando...'
                    : 'Crear lista'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {mostrarModalTarea && (
        <div
          className="member-modal-overlay"
          onClick={cerrarModalTarea}
        >
          <div
            className="member-modal task-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="member-modal-header">
              <div>
                <p className="eyebrow">
                  {tareaEditando ? 'EDITAR TAREA' : 'NUEVA TAREA'}
                </p>
                <h2>
                  {tareaEditando
                    ? 'Editar tarea familiar'
                    : 'Agregar pendiente familiar'}
                </h2>
              </div>

              <button
                type="button"
                className="member-modal-close"
                onClick={cerrarModalTarea}
              >
                ×
              </button>
            </div>

            <form
              onSubmit={
                tareaEditando
                  ? guardarEdicionTarea
                  : crearTarea
              }
            >
              <div className="member-form-field">
                <label>Nombre</label>

                <input
                  type="text"
                  placeholder="Ej: Sacar la basura"
                  value={nombreTarea}
                  onChange={(e) => setNombreTarea(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="member-form-field">
                <label>Descripción</label>

                <textarea
                  placeholder="Agrega detalles opcionales..."
                  value={descripcionTarea}
                  onChange={(e) =>
                    setDescripcionTarea(e.target.value)
                  }
                  rows="3"
                />
              </div>

              <div className="calendar-form-grid">
                <div
                  className="member-form-field notranslate"
                  translate="no"
                  lang="es"
                >
                  <label>Prioridad</label>

                  <select
                    className="notranslate"
                    translate="no"
                    lang="es"
                    value={prioridadTarea}
                    onChange={(e) =>
                      setPrioridadTarea(e.target.value)
                    }
                  >
                    <option value="baja" translate="no">Baja</option>
                    <option value="media" translate="no">Media</option>
                    <option value="alta" translate="no">Alta</option>
                  </select>
                </div>

                <div className="member-form-field">
                  <label>Fecha límite</label>

                  <input
                    type="date"
                    min={fechaMinimaPermitida}
                    value={fechaLimiteTarea}
                    onChange={(e) =>
                      setFechaLimiteTarea(e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="member-form-field">
                <div className="calendar-assignment-header">
                  <label>Asignar a</label>

                  <button
                    type="button"
                    className="calendar-select-all"
                    onClick={seleccionarTodaLaFamiliaTarea}
                  >
                    {asignadosTarea.length === miembros.length
                      ? 'Quitar todos'
                      : 'Toda la familia'}
                  </button>
                </div>

                <div className="calendar-member-selector">
                  {miembros.map((miembro) => {
                    const seleccionado =
                      asignadosTarea.includes(miembro.id)

                    return (
                      <button
                        type="button"
                        key={miembro.id}
                        className={`calendar-member-option ${
                          seleccionado ? 'selected' : ''
                        }`}
                        style={{
                          borderColor: seleccionado
                            ? miembro.color
                            : undefined
                        }}
                        onClick={() =>
                          alternarAsignadoTarea(miembro.id)
                        }
                      >
                        <span
                          className="calendar-member-mini-avatar"
                          style={{
                            borderColor: miembro.color,
                            color: miembro.color
                          }}
                        >
                          {miembro.avatar_url ? (
                            <img
                              src={miembro.avatar_url}
                              alt={miembro.nombre}
                            />
                          ) : (
                            obtenerInicial(miembro.nombre)
                          )}
                        </span>

                        <span>{miembro.nombre}</span>

                        <strong>
                          {seleccionado ? '✓' : '+'}
                        </strong>
                      </button>
                    )
                  })}
                </div>
              </div>

              {mensajeTarea && (
                <div className="member-form-message">
                  {mensajeTarea}
                </div>
              )}

              <div className="calendar-modal-actions task-modal-actions">
                <div>
                  {tareaEditando && (
                    <button
                      type="button"
                      className="task-delete-button"
                      onClick={() =>
                        setMostrarConfirmacionEliminarTarea(true)
                      }
                      disabled={guardandoTarea}
                    >
                      🗑️ Eliminar tarea
                    </button>
                  )}
                </div>

                <div className="calendar-modal-actions-right">
                  <button
                    type="button"
                    className="member-cancel-button"
                    onClick={cerrarModalTarea}
                    disabled={guardandoTarea}
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="member-save-button"
                    disabled={guardandoTarea}
                  >
                    {guardandoTarea
                      ? 'Guardando...'
                      : tareaEditando
                      ? 'Guardar cambios'
                      : 'Crear tarea'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {listaCompraAEliminar && (
        <div
          className="member-modal-overlay event-delete-confirm-overlay"
          onClick={() =>
            !eliminandoListaCompra && setListaCompraAEliminar(null)
          }
        >
          <div
            className="member-modal delete-confirm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="delete-confirm-icon">🗑️</div>

            <h2>¿Eliminar “{listaCompraAEliminar.nombre}”?</h2>

            <p className="delete-confirm-text">
              La lista completada y sus productos se eliminarán definitivamente.
              Esta acción no se puede deshacer.
            </p>

            <div className="delete-confirm-actions">
              <button
                type="button"
                className="member-cancel-button"
                onClick={() => setListaCompraAEliminar(null)}
                disabled={eliminandoListaCompra}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="member-delete-confirm-button"
                onClick={eliminarListaCompraCompletada}
                disabled={eliminandoListaCompra}
              >
                {eliminandoListaCompra
                  ? 'Eliminando...'
                  : 'Sí, eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {mostrarConfirmacionEliminarTarea && tareaEditando && (
        <div
          className="member-modal-overlay event-delete-confirm-overlay"
          onClick={() =>
            !eliminandoTarea &&
            setMostrarConfirmacionEliminarTarea(false)
          }
        >
          <div
            className="member-modal delete-confirm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="delete-confirm-icon">🗑️</div>

            <h2>¿Eliminar “{tareaEditando.nombre}”?</h2>

            <p className="delete-confirm-text">
              Esta tarea se eliminará definitivamente para toda la familia.
              Esta acción no se puede deshacer.
            </p>

            <div className="delete-confirm-actions">
              <button
                type="button"
                className="member-cancel-button"
                onClick={() =>
                  setMostrarConfirmacionEliminarTarea(false)
                }
                disabled={eliminandoTarea}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="member-delete-confirm-button"
                onClick={eliminarTareaManual}
                disabled={eliminandoTarea}
              >
                {eliminandoTarea
                  ? 'Eliminando...'
                  : 'Sí, eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {mostrarModalIntegrante && (
        <div
          className="member-modal-overlay"
          onClick={cerrarModalIntegrante}
        >
          <div
            className="member-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div className="member-modal-header">
              <div>
                <p className="eyebrow">
                  NUEVO INTEGRANTE
                </p>

                <h2>
                  Agregar a la familia
                </h2>
              </div>

              <button
                className="member-modal-close"
                onClick={
                  cerrarModalIntegrante
                }
              >
                ×
              </button>
            </div>

            <form
              onSubmit={agregarIntegrante}
            >
              <div className="member-form-field">
                <label>
                  Nombre
                </label>

                <input
                  type="text"
                  placeholder="Ej: Emiliano"
                  value={nombreNuevoIntegrante}
                  onChange={(e) =>
                    setNombreNuevoIntegrante(
                      e.target.value
                    )
                  }
                  autoFocus
                />
              </div>

              <div className="member-form-field">
                <label>
                  Color
                </label>

                <div className="member-color-selector">
                  <input
                    type="color"
                    value={colorNuevoIntegrante}
                    onChange={(e) =>
                      setColorNuevoIntegrante(
                        e.target.value
                      )
                    }
                  />

                  <span>
                    {colorNuevoIntegrante}
                  </span>
                </div>
              </div>

              {mensajeIntegrante && (
                <div className="member-form-message">
                  {mensajeIntegrante}
                </div>
              )}

              <div className="member-modal-actions">
                <button
                  type="button"
                  className="member-cancel-button"
                  onClick={
                    cerrarModalIntegrante
                  }
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="member-save-button"
                  disabled={
                    guardandoIntegrante
                  }
                >
                  {guardandoIntegrante
                    ? 'Guardando...'
                    : 'Agregar integrante'}
                </button>
              </div>
            </form>
          </div>
        </div>
            )}

      {miembroEditando && (
        <div
          className="member-modal-overlay"
          onClick={cerrarEditarIntegrante}
        >
          <div
            className="member-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="member-modal-header">
              <div>
                <p className="eyebrow">
                  EDITAR INTEGRANTE
                </p>

                <h2>Editar perfil</h2>
              </div>

              <button
                type="button"
                className="member-modal-close"
                onClick={cerrarEditarIntegrante}
              >
                ×
              </button>
            </div>

           <form onSubmit={guardarEdicionIntegrante}>
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '22px'
    }}
  >
    <AvatarUploader
      miembro={miembroEditando}
      usuario={usuario}
      onAvatarActualizado={(miembroId, nuevaUrl) => {
        actualizarAvatarLocal(miembroId, nuevaUrl)

        setMiembroEditando((miembroActual) => ({
          ...miembroActual,
          avatar_url: nuevaUrl
        }))
      }}
    />

    <span
      style={{
        fontSize: '13px',
        color: '#697184'
      }}
    >
      Haz clic en la foto para cambiarla
    </span>
  </div>

  <div className="member-form-field">
    <label>Nombre</label>

                <input
                  type="text"
                  value={nombreEditado}
                  onChange={(e) =>
                    setNombreEditado(e.target.value)
                  }
                  autoFocus
                />
              </div>

              <div className="member-form-field">
                <label>Color</label>

                <div className="member-color-selector">
                  <input
                    type="color"
                    value={colorEditado}
                    onChange={(e) =>
                      setColorEditado(e.target.value)
                    }
                  />

                  <span>{colorEditado}</span>
                </div>
              </div>

              {mensajeEdicion && (
                <div className="member-form-message">
                  {mensajeEdicion}
                </div>
              )}

              <div
                className="member-modal-actions"
                style={{
                  justifyContent: 'space-between'
                }}
              >
                <button
                  type="button"
                  className="member-delete-button"
                  onClick={() =>
  setMostrarConfirmacionEliminar(true)
}
                  disabled={eliminandoIntegrante}
                >
                  {eliminandoIntegrante
                    ? 'Eliminando...'
                    : 'Eliminar perfil'}
                </button>

                <div
                  style={{
                    display: 'flex',
                    gap: '10px'
                  }}
                >
                  <button
                    type="button"
                    className="member-cancel-button"
                    onClick={cerrarEditarIntegrante}
                    disabled={eliminandoIntegrante}
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="member-save-button"
                    disabled={
                      guardandoEdicion ||
                      eliminandoIntegrante
                    }
                  >
                    {guardandoEdicion
                      ? 'Guardando...'
                      : 'Guardar cambios'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      {mostrarConfirmacionEliminarEvento && eventoEditando && (
        <div
          className="member-modal-overlay event-delete-confirm-overlay"
          onClick={() =>
            setMostrarConfirmacionEliminarEvento(false)
          }
        >
          <div
            className="member-modal delete-confirm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="delete-confirm-icon">
              🗑️
            </div>

            <h2>
              ¿Eliminar “{eventoEditando.titulo}”?
            </h2>

            <p className="delete-confirm-text">
              El evento se eliminará del calendario de toda la familia.
              Esta acción no se puede deshacer.
            </p>

            <div className="delete-confirm-actions">
              <button
                type="button"
                className="member-cancel-button"
                onClick={() =>
                  setMostrarConfirmacionEliminarEvento(false)
                }
                disabled={eliminandoEvento}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="member-delete-confirm-button"
                onClick={eliminarEvento}
                disabled={eliminandoEvento}
              >
                {eliminandoEvento
                  ? 'Eliminando...'
                  : 'Sí, eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {mostrarConfirmacionEliminar && miembroEditando && (
  <div
    className="member-modal-overlay"
    onClick={() =>
      setMostrarConfirmacionEliminar(false)
    }
  >
    <div
      className="member-modal delete-confirm-modal"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="delete-confirm-icon">
        🗑️
      </div>

      <h2>
        ¿Eliminar a {miembroEditando.nombre}?
      </h2>

      <p className="delete-confirm-text">
        Este perfil se eliminará de tu familia.
        Esta acción no se puede deshacer.
      </p>

      <div className="delete-confirm-actions">
        <button
          type="button"
          className="member-cancel-button"
          onClick={() =>
            setMostrarConfirmacionEliminar(false)
          }
          disabled={eliminandoIntegrante}
        >
          Cancelar
        </button>

        <button
          type="button"
          className="member-delete-confirm-button"
          onClick={eliminarIntegrante}
          disabled={eliminandoIntegrante}
        >
          {eliminandoIntegrante
            ? 'Eliminando...'
            : 'Sí, eliminar'}
        </button>
      </div>
    </div>
  </div>
)}

      {mostrarConfirmacionSalir && (
        <div
          className="member-modal-overlay logout-confirm-overlay"
          onClick={() => setMostrarConfirmacionSalir(false)}
        >
          <div
            className="member-modal logout-confirm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="logout-confirm-icon">↪</div>

            <h2>¿Cerrar sesión?</h2>

            <p className="logout-confirm-text">
              Tendrás que iniciar sesión nuevamente para entrar a Agenda Familiar.
            </p>

            <div className="delete-confirm-actions">
              <button
                type="button"
                className="member-cancel-button"
                onClick={() => setMostrarConfirmacionSalir(false)}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="logout-confirm-button"
                onClick={cerrarSesion}
              >
                Sí, cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App