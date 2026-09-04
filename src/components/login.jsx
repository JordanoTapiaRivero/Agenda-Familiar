import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import './login.css'

function Login({ onLogin }) {
  const [modo, setModo] = useState('login')
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmarPassword, setConfirmarPassword] = useState('')
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [mostrarConfirmarPassword, setMostrarConfirmarPassword] = useState(false)
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
      <div className="login-shell">
        <aside className="login-family-panel">
          <div className="login-family-copy">
            <span className="login-family-kicker">
              ORGANIZA · COMPARTE · DISFRUTA
            </span>

            <h2>
              Juntos
              <br />
              es más fácil
            </h2>

          

            <div className="login-family-features">
              <span>📅 Eventos compartidos</span>
              <span>✅ Tareas en familia</span>
              <span>🛒 Compras organizadas</span>
              <span>💰 Gastos bajo control</span>
            </div>

            <blockquote>
              “Tu familia, siempre cerca.” ♥
            </blockquote>
          </div>
        </aside>

        <section className="login-card">
          <div className="login-brand">
            <div className="login-logo">
  <img src="/pwa-192x192.png" alt="Agenda Familiar" />
</div>

            <div>
              <h1>Agenda Familiar</h1>
              <p>Tu familia, conectada</p>
            </div>
          </div>

          <div className="login-heading">
            <h2>
              {modo === 'login'
                ? '¡Bienvenido! 👋'
                : 'Crear cuenta'}
            </h2>

            <p className="login-subtitle">
              {modo === 'login'
                ? 'Ingresa para volver a tu hogar.'
                : 'Únete y comienza a organizar tu vida familiar.'}
            </p>
          </div>

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

                <div className="input-wrap">
                  <span className="input-icon">👤</span>
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="field">
              <label>Correo electrónico</label>

              <div className="input-wrap">
                <span className="input-icon">✉️</span>
                <input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="field">
              <label>Contraseña</label>

              <div className="input-wrap">
                <span className="input-icon">🔒</span>
                <input
                  type={mostrarPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setMostrarPassword((actual) => !actual)}
                >
                  {mostrarPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {modo === 'registro' && (
              <div className="field">
                <label>Confirmar contraseña</label>

                <div className="input-wrap">
                  <span className="input-icon">🔒</span>
                  <input
                    type={mostrarConfirmarPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmarPassword}
                    onChange={(e) => setConfirmarPassword(e.target.value)}
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setMostrarConfirmarPassword((actual) => !actual)
                    }
                  >
                    {mostrarConfirmarPassword ? '🙈' : '👁️'}
                  </button>
                </div>
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
            type="button"
            onClick={() => {
              setModo(modo === 'login' ? 'registro' : 'login')
              setMensaje('')
            }}
          >
            {modo === 'login'
              ? '¿No tienes cuenta? Crear cuenta'
              : '¿Ya tienes cuenta? Iniciar sesión'}
          </button>
        </section>
      </div>
    </div>
  )
}

export default Login
