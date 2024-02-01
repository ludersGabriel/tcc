import Guacamole from 'guacamole-common-js'

export default function Guac() {

  const handleClick = async () => {
    try {
      const response = await fetch('http://localhost:3000/getToken')

      const data = await response.json()
      const token = data.token

      console.log(token)

      const url = 'ws://localhost:3000/'
      const tunnel = new Guacamole.WebSocketTunnel(url)
      const guac = new Guacamole.Client(tunnel)

      guac.onerror = (error) => {
        console.log('Error: ' + error)
      }

      const guacElement = guac.getDisplay().getElement()
      const displayContainer = document.getElementById('displayContainer')

      const canvas = guacElement.querySelectorAll('canvas')

      canvas.forEach((canva) => canva.style.zIndex = '1000')

      displayContainer?.appendChild(guacElement)

      guac.connect('token=' + token)
      guac.onleave = () => guac.disconnect()
    }
    catch (err) {
      console.log(err)
    }
  }

  return (
    <button onClick={handleClick} className='m-2 p-2 border-black border-2'>Conectar</button>
  )

}