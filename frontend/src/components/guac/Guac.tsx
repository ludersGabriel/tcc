import Guacamole from 'guacamole-common-js'
import { useCallback, useEffect, useRef } from 'react'

import toast from 'react-hot-toast'
import { baseUrl } from '@/api/config'

type GuacProps = {
  token: string
}

export default function useGuac({ token }: GuacProps) {
  const guacRef = useRef<Guacamole.Client | null>(null)
  const keyboardRef = useRef<Guacamole.Keyboard | null>(
    null
  )

  const guacDisconnect = useCallback(() => {
    if (keyboardRef.current) {
      keyboardRef.current.onkeydown = null
      keyboardRef.current.onkeyup = null
    }

    const displayContainer = document.getElementById(
      'displayContainer'
    )

    // remove all children
    while (displayContainer?.firstChild) {
      displayContainer.removeChild(
        displayContainer.firstChild
      )
    }

    guacRef.current?.disconnect()
    guacRef.current = null
    keyboardRef.current = null
  }, [])

  useEffect(() => {
    const tunnelUrl = baseUrl.replace('http', 'ws')

    if (!guacRef.current && !keyboardRef.current) {
      const tunnel = new Guacamole.WebSocketTunnel(
        tunnelUrl
      )

      const guac = new Guacamole.Client(tunnel)

      guacRef.current = guac

      guac.onerror = () => {
        toast.error(
          'Error connecting to vm. Please make sure its running.'
        )
      }

      guac.onleave = () => guac?.disconnect()

      const guacElement = guac.getDisplay().getElement()

      const mouse = new Guacamole.Mouse(guacElement)

      mouse.onEach(
        ['mousedown', 'mouseup', 'mousemove'],
        (event) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          guac.sendMouseState((event as any).state, true)
        }
      )

      const keyboard = new Guacamole.Keyboard(document)

      keyboardRef.current = keyboard
    }

    if (token && guacRef.current && keyboardRef.current) {
      try {
        const guacElement = guacRef.current
          .getDisplay()
          .getElement()
        const displayContainer = document.getElementById(
          'displayContainer'
        )

        const canvas =
          guacElement.querySelectorAll('canvas')

        canvas.forEach(
          (canva) => (canva.style.zIndex = '1000')
        )

        displayContainer?.appendChild(guacElement)

        keyboardRef.current.onkeydown = (keysym) => {
          guacRef.current!.sendKeyEvent(1, keysym)
        }
        keyboardRef.current.onkeyup = (keysym) => {
          guacRef.current!.sendKeyEvent(0, keysym)
        }

        guacRef.current.connect('token=' + token)
      } catch (err) {
        console.log(err)
      }
    }

    return () => {
      guacDisconnect()
    }
  }, [])
}
