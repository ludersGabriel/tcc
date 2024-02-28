import Guacamole from 'guacamole-common-js'
import { useEffect, useState } from 'react'

export default function Guac() {
  const [guac, setGuac] = useState<Guacamole.Client | null>(null)
  const [keyboard, setKeyboard] = useState<Guacamole.Keyboard | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    // Function to be called when the page is about to be unloaded
    const handleUnload = () => {
      if(keyboard){
        keyboard.onkeydown = null
        keyboard.onkeyup = null
      } 
        
      guac?.disconnect();
      
      // Optionally, prevent default action and display a confirmation dialog
      // event.preventDefault();
      // return (event.returnValue = 'Are you sure you want to leave?');
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [guac, keyboard]);

  const disconnect = () => {
    if(keyboard){
      keyboard.onkeydown = null
      keyboard.onkeyup = null
    } 

    const displayContainer = document.getElementById('displayContainer')
    
    // remove all children
    while (displayContainer?.firstChild) {
      displayContainer.removeChild(displayContainer.firstChild)
    }
    
    guac?.disconnect()
  }

  const guacSetup = async () => {
    const response = await fetch('http://localhost:3000/getToken')

    const data = await response.json()
    const token = data.token
    setToken(token)

    const url = 'ws://localhost:3000/'
    const tunnel = new Guacamole.WebSocketTunnel(url)
    const guac = new Guacamole.Client(tunnel)

    setGuac(guac)

    guac.onerror = (error) => {
      console.log('Error: ' + JSON.stringify(error))
    }
    
    guac.onleave = () => disconnect()

    const guacElement = guac.getDisplay().getElement()
    const displayContainer = document.getElementById('displayContainer')

    const canvas = guacElement.querySelectorAll('canvas')

    canvas.forEach((canva) => canva.style.zIndex = '1000')

    displayContainer?.appendChild(guacElement)

    const mouse = new Guacamole.Mouse(guacElement)

    mouse.onEach(['mousedown', 'mouseup', 'mousemove'], (event) => {
      guac.sendMouseState(event.state, true)
    })

    const keyboard = new Guacamole.Keyboard(document)

    keyboard.onkeydown = (keysym) => {
      guac.sendKeyEvent(1, keysym)
    }
    keyboard.onkeyup = (keysym) => {
      guac.sendKeyEvent(0, keysym)
    }

    setKeyboard(keyboard)

    return { guac, token }
  }

  const handleClick = async () => {
    try {
      const {guac, token} = await guacSetup()
      if(!guac || !token) return

      console.log('hmmmm')
      guac.connect('token=' + token)
    }
    catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      <button onClick={handleClick} className='m-2 p-2 border-black border-2'>Conectar</button>
      <button onClick={disconnect} className='m-2 p-2 border-black border-2'>Desconectar</button>
    </>
  )

}