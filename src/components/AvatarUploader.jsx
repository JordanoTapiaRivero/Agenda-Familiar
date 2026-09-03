import { useRef, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

function AvatarUploader({ miembro, usuario, onAvatarActualizado }) {
  const inputRef = useRef(null)
  const [subiendo, setSubiendo] = useState(false)

  const obtenerInicial = (nombre) => {
    if (!nombre) return '?'

    return nombre.trim().charAt(0).toUpperCase()
  }

  const seleccionarFoto = () => {
    inputRef.current?.click()
  }

  const subirFoto = async (e) => {
    const archivo = e.target.files?.[0]

    if (!archivo) return

    if (!archivo.type.startsWith('image/')) {
      alert('Selecciona una imagen válida.')
      return
    }

    if (archivo.size > 5 * 1024 * 1024) {
      alert('La imagen no puede pesar más de 5 MB.')
      return
    }

    try {
      setSubiendo(true)

      const extension = archivo.name.split('.').pop()
      const nombreArchivo = `${miembro.id}-${Date.now()}.${extension}`

      const rutaArchivo = `${usuario.id}/${nombreArchivo}`

      const { error: errorSubida } = await supabase.storage
        .from('avatares')
        .upload(rutaArchivo, archivo)

      if (errorSubida) throw errorSubida

      const {
        data: { publicUrl }
      } = supabase.storage
        .from('avatares')
        .getPublicUrl(rutaArchivo)

      const { error: errorActualizar } = await supabase
        .from('miembros_familia')
        .update({
          avatar_url: publicUrl
        })
        .eq('id', miembro.id)

      if (errorActualizar) throw errorActualizar

      onAvatarActualizado(miembro.id, publicUrl)
    } catch (error) {
      console.error('Error al subir avatar:', error)
      alert('No se pudo subir la foto.')
    } finally {
      setSubiendo(false)

      if (inputRef.current) {
        inputRef.current.value = ''
      }
    }
  }

  return (
    <>
      <button
        type="button"
        className="avatar avatar-upload-button"
        style={{
          borderColor: miembro.color,
          color: miembro.color
        }}
        onClick={seleccionarFoto}
        disabled={subiendo}
        title="Cambiar foto"
      >
        {subiendo ? (
          '...'
        ) : miembro.avatar_url ? (
          <img
            src={miembro.avatar_url}
            alt={miembro.nombre}
          />
        ) : (
          obtenerInicial(miembro.nombre)
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={subirFoto}
        hidden
      />
    </>
  )
}

export default AvatarUploader