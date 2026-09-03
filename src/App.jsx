import { useEffect, useState } from 'react'
import './App.css'
import Login from './components/Login'
import FamilySetup from './components/FamilySetup'
import AvatarUploader from './components/AvatarUploader'
import { supabase } from './lib/supabaseClient'

function App() {
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

  useEffect(() => {
    const cargarSesion = async () => {
      const { data } = await supabase.auth.getSession()

      setUsuario(data.session?.user ?? null)
      setCargandoSesion(false)
    }

    cargarSesion()

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_evento, session) => {
      setUsuario(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

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
  if (cargandoSesion) {
    return (
      <div className="loading-screen">
        <p>Cargando Agenda Familiar...</p>
      </div>
    )
  }

  if (!usuario) {
    return <Login onLogin={setUsuario} />
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

          <button className="menu-item">
            📅 Calendario
          </button>

          <button className="menu-item">
            ✅ Tareas
          </button>

          <button className="menu-item">
            🛒 Compras
          </button>

          <button className="menu-item">
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
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">
              {familia.nombre}
            </p>

            <h2>
              Buenos días,{' '}
              {usuario.user_metadata?.nombre ||
                'Usuario'}{' '}
              👋
            </h2>

            <p className="subtitle">
              {seccion === 'inicio'
                ? 'Esto es lo que tiene la familia para hoy'
                : 'Administra los integrantes de tu familia'}
            </p>
          </div>

          <div className="topbar-actions">
            <button className="notification-button">
              🔔
            </button>

            <button
              className="logout-button"
              onClick={() =>
                supabase.auth.signOut()
              }
            >
              Salir
            </button>
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

                <h3>Sin eventos</h3>

                <span>
                  No hay eventos próximos
                </span>

                <button>
                  Ver calendario →
                </button>
              </article>

              <article className="summary-card shopping-card">
                <div className="card-icon">
                  🛒
                </div>

                <p>COMPRAS</p>

                <h3>0 pendientes</h3>

                <span>Lista familiar</span>

                <button>
                  Ver lista →
                </button>
              </article>

              <article className="summary-card task-card">
                <div className="card-icon">
                  ✅
                </div>

                <p>TAREAS</p>

                <h3>0 pendientes</h3>

                <span>0 completadas</span>

                <button>
                  Ver tareas →
                </button>
              </article>

              <article className="summary-card expense-card">
                <div className="card-icon">
                  💰
                </div>

                <p>GASTOS</p>

                <h3>$0</h3>

                <span>Este mes</span>

                <button>
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
                    No hay actividades para hoy
                  </h3>
                </div>

                <button>
                  Ver todo
                </button>
              </div>

              <div className="event-list">
                <div className="event-item">
                  <div className="event-info">
                    <strong>
                      Tu agenda está libre por ahora
                    </strong>

                    <span>
                      Cuando agreguemos eventos,
                      aparecerán aquí.
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <button className="floating-button">
              ＋
            </button>
          </>
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
    </div>
  )
}

export default App