import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import './Login.css'

function Login({ onLogin }) {
  const [modo, setModo] = useState('login')
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmarPassword, setConfirmarPassword] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)

  const manejarLogin = async (e) => {
    e.preventDefault()
    setMensaje('')

    if (!email || !password) {
      setMensaje('Completa todos los campos.')
      return
    }

    try {
      setCargando(true)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      onLogin(data.user)
    } catch (error) {
      setMensaje(error.message)
    } finally {
      setCargando(false)
    }
  }

  const manejarRegistro = async (e) => {
    e.preventDefault()
    setMensaje('')

    if (!nombre || !email || !password || !confirmarPassword) {
      setMensaje('Completa todos los campos.')
      return
    }

    if (password !== confirmarPassword) {
      setMensaje('Las contraseñas no coinciden.')
      return
    }

    try {
      setCargando(true)

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nombre
          }
        }
      })

      if (error) throw error

      setMensaje('Cuenta creada. Revisa tu correo para confirmar tu cuenta.')
    } catch (error) {
      setMensaje(error.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="login-logo">🏠</div>
          <div>
            <h1>Agenda Familiar</h1>
            <p>Tu familia, conectada</p>
          </div>
        </div>

        <h2>
          {modo === 'login'
            ? 'Iniciar sesión'
            : 'Crear cuenta'}
        </h2>

        <p className="login-subtitle">
          {modo === 'login'
            ? 'Ingresa para acceder a tu familia.'
            : 'Crea tu cuenta para comenzar.'}
        </p>

        <form
          onSubmit={
            modo === 'login'
              ? manejarLogin
              : manejarRegistro
          }
        >
          {modo === 'registro' && (
            <div className="field">
              <label>Nombre</label>
              <input
                type="text"
                placeholder="Tu nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
          )}

          <div className="field">
            <label>Correo electrónico</label>
            <input
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {modo === 'registro' && (
            <div className="field">
              <label>Confirmar contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmarPassword}
                onChange={(e) =>
                  setConfirmarPassword(e.target.value)
                }
              />
            </div>
          )}

          {mensaje && (
            <div className="login-message">
              {mensaje}
            </div>
          )}

          <button
            className="primary-button"
            type="submit"
            disabled={cargando}
          >
            {cargando
              ? 'Procesando...'
              : modo === 'login'
              ? 'Iniciar sesión'
              : 'Crear cuenta'}
          </button>
        </form>

        <button
          className="switch-mode"
          onClick={() => {
            setModo(
              modo === 'login'
                ? 'registro'
                : 'login'
            )
            setMensaje('')
          }}
        >
          {modo === 'login'
            ? '¿No tienes cuenta? Crear cuenta'
            : '¿Ya tienes cuenta? Iniciar sesión'}
        </button>
      </div>
    </div>
  )
}

export default Login