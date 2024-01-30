import { useEffect, useRef } from "react";

import Guacamole from 'guacamole-common-js'
import { trpc } from "../../trpc";

const GuacRDP = () => {
  const displayRef = useRef<HTMLDivElement>(null)
  const {data: token, isLoading} = trpc.getToken.useQuery()



  useEffect(() => {
    if(!displayRef.current || isLoading || !token) return

    const url = `ws://localhost:3000/`

    const tunnel = new Guacamole.WebSocketTunnel(url)
    const client = new Guacamole.Client(tunnel)

    client.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    const guacElement = client.getDisplay().getElement()

    const canvas = guacElement.querySelectorAll('canvas')
    canvas.forEach((canva) => {
      canva.style.zIndex = '1000'
    })

    displayRef.current.appendChild(guacElement)

    
    client.connect('token=' + token)

    return () => {
      client.disconnect()
    }
    
  }, [isLoading, token])


  return (
    <div
      ref={displayRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute', // Ensure it's positioned relative to the nearest positioned ancestor
      }}
    />
  )
}

export default GuacRDP