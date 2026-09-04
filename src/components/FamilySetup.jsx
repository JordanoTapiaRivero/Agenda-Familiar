import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import './FamilySetup.css'

function FamilySetup({ usuario, onFamiliaCreada }) {
  const [modo, setModo] = useState(null)
  const [nombreFamilia, setNombreFamilia] = useState('')
  const [codigo, setCodigo] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)
  const [familiaCreada, setFamiliaCreada] = useState(null)
  const [codigoCopiado, setCodigoCopiado] = useState(false)

  const generarCodigo = () => {
    return Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()
  }

  const crearFamilia = async (e) => {
    e.preventDefault()
    setMensaje('')

    if (!nombreFamilia.trim()) {
      setMensaje('Escribe un nombre para tu familia.')
      return
    }

    try {
      setCargando(true)

      const codigoInvitacion = generarCodigo()

      const {
        data: familia,
        error: errorFamilia
      } = await supabase
        .from('familias')
        .insert({
          nombre: nombreFamilia.trim(),
          codigo_invitacion: codigoInvitacion,
          creado_por: usuario.id
        })
        .select()
        .single()

      if (errorFamilia) {
        throw errorFamilia
      }

      const nombreUsuario =
        usuario.user_metadata?.nombre ||
        'Usuario'

      const {
        error: errorMiembro
      } = await supabase
        .from('miembros_familia')
        .insert({
          familia_id: familia.id,
          user_id: usuario.id,
          nombre: nombreUsuario,
          color: '#3478f6',
          rol: 'administrador',
          tipo: 'usuario'
        })

      if (errorMiembro) {
        throw errorMiembro
      }

      setFamiliaCreada(familia)
      setModo('creada')
    } catch (error) {
      console.error(
        'Error al crear familia:',
        error
      )

      setMensaje(
        'No se pudo crear la familia.'
      )
    } finally {
      setCargando(false)
    }
  }

  const copiarCodigo = async () => {
    if (!familiaCreada?.codigo_invitacion) return

    try {
      await navigator.clipboard.writeText(
        familiaCreada.codigo_invitacion
      )

      setCodigoCopiado(true)

      window.setTimeout(() => {
        setCodigoCopiado(false)
      }, 2000)
    } catch (error) {
      console.error(
        'No se pudo copiar el código:',
        error
      )

      setMensaje(
        'No pudimos copiar el código automáticamente.'
      )
    }
  }

  const continuar = () => {
    if (!familiaCreada) return
    onFamiliaCreada(familiaCreada)
  }

  const unirseFamilia = async (e) => {
    e.preventDefault()
    setMensaje('')

    const codigoLimpio = codigo
      .trim()
      .toUpperCase()

    if (!codigoLimpio) {
      setMensaje(
        'Ingresa el código de invitación.'
      )
      return
    }

    try {
      setCargando(true)

      const {
        data: familiaId,
        error: errorUnion
      } = await supabase.rpc(
        'unirse_a_familia',
        {
          codigo: codigoLimpio
        }
      )

      if (errorUnion) {
        throw errorUnion
      }

      const {
        data: familia,
        error: errorFamilia
      } = await supabase
        .from('familias')
        .select(`
          id,
          nombre,
          codigo_invitacion
        `)
        .eq('id', familiaId)
        .single()

      if (errorFamilia) {
        throw errorFamilia
      }

      onFamiliaCreada(familia)
    } catch (error) {
      console.error(
        'Error al unirse a la familia:',
        error
      )

      if (
        error.message
          ?.toLowerCase()
          .includes('inválido')
      ) {
        setMensaje(
          'El código de invitación no es válido.'
        )
      } else if (
        error.message
          ?.toLowerCase()
          .includes('ya perteneces')
      ) {
        setMensaje(
          'Ya perteneces a esta familia.'
        )
      } else {
        setMensaje(
          'No pudimos unirte a la familia. Intenta nuevamente.'
        )
      }
    } finally {
      setCargando(false)
    }
  }

  const volver = () => {
    setModo(null)
    setMensaje('')
    setCodigo('')
    setNombreFamilia('')
    setFamiliaCreada(null)
    setCodigoCopiado(false)
  }

  return (
    <div className="family-setup-page">
      <div className="family-setup-card">
        <div className="setup-logo">
          🏠
        </div>

        <p className="setup-brand">
          Agenda Familiar
        </p>

        {!modo && (
          <>
            <h1>
              Configuremos tu familia
            </h1>

            <p className="setup-description">
              Para comenzar, crea una nueva
              familia o únete a una existente.
            </p>

            <div className="setup-options">
              <button
                className="setup-option"
                onClick={() =>
                  setModo('crear')
                }
              >
                <span className="option-icon">
                  👨‍👩‍👧‍👦
                </span>

                <div>
                  <strong>
                    Crear una familia
                  </strong>

                  <p>
                    Crea tu espacio familiar e
                    invita a otras personas.
                  </p>
                </div>

                <span>→</span>
              </button>

              <button
                className="setup-option"
                onClick={() =>
                  setModo('unirse')
                }
              >
                <span className="option-icon">
                  🔗
                </span>

                <div>
                  <strong>
                    Unirme con código
                  </strong>

                  <p>
                    Ingresa el código que te
                    compartió un familiar.
                  </p>
                </div>

                <span>→</span>
              </button>
            </div>
          </>
        )}

        {modo === 'crear' && (
          <>
            <button
              className="back-button"
              onClick={volver}
            >
              ← Volver
            </button>

            <h1>
              Crea tu familia
            </h1>

            <p className="setup-description">
              Este será el nombre que verán
              todos los integrantes.
            </p>

            <form
              onSubmit={crearFamilia}
            >
              <div className="setup-field">
                <label>
                  Nombre de la familia
                </label>

                <input
                  type="text"
                  placeholder="Ej: Familia Tapia Gallegos"
                  value={nombreFamilia}
                  onChange={(e) =>
                    setNombreFamilia(
                      e.target.value
                    )
                  }
                  disabled={cargando}
                />
              </div>

              {mensaje && (
                <div className="setup-message">
                  {mensaje}
                </div>
              )}

              <button
                className="setup-primary"
                type="submit"
                disabled={cargando}
              >
                {cargando
                  ? 'Creando familia...'
                  : 'Crear familia'}
              </button>
            </form>
          </>
        )}

        {modo === 'creada' && familiaCreada && (
          <div className="setup-success">
            <div className="setup-success-icon">
              🎉
            </div>

            <h1>
              ¡Familia creada!
            </h1>

            <p className="setup-description">
              Comparte este código con tu pareja o familiares para que puedan unirse a <strong>{familiaCreada.nombre}</strong>.
            </p>

            <div className="setup-invite-code">
              {familiaCreada.codigo_invitacion}
            </div>

            <button
              type="button"
              className="setup-copy-button"
              onClick={copiarCodigo}
            >
              {codigoCopiado
                ? '✓ Código copiado'
                : '📋 Copiar código'}
            </button>

            {mensaje && (
              <div className="setup-message">
                {mensaje}
              </div>
            )}

            <p className="setup-code-help">
              No te preocupes: este código también quedará disponible dentro de la sección Familia.
            </p>

            <button
              type="button"
              className="setup-primary"
              onClick={continuar}
            >
              Continuar a Agenda Familiar
            </button>
          </div>
        )}

        {modo === 'unirse' && (
          <>
            <button
              className="back-button"
              onClick={volver}
              disabled={cargando}
            >
              ← Volver
            </button>

            <h1>
              Únete a tu familia
            </h1>

            <p className="setup-description">
              Ingresa el código de invitación
              que recibiste.
            </p>

            <form
              onSubmit={unirseFamilia}
            >
              <div className="setup-field">
                <label>
                  Código de invitación
                </label>

                <input
                  type="text"
                  placeholder="Ej: A7F3K2"
                  value={codigo}
                  onChange={(e) =>
                    setCodigo(
                      e.target.value
                        .toUpperCase()
                        .replace(
                          /[^A-Z0-9]/g,
                          ''
                        )
                        .slice(0, 6)
                    )
                  }
                  maxLength={6}
                  autoComplete="off"
                  disabled={cargando}
                />
              </div>

              {mensaje && (
                <div className="setup-message">
                  {mensaje}
                </div>
              )}

              <button
                className="setup-primary"
                type="submit"
                disabled={cargando}
              >
                {cargando
                  ? 'Uniéndome...'
                  : 'Unirme a la familia'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default FamilySetup
