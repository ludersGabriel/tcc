import GuacClient from 'guacamole-common-js'

document.getElementById('connectButton').addEventListener('click', connectToGuacamole);

async function connectToGuacamole() {
  try {
    // Fetch the token from your backend
    const response = await fetch('http://localhost:3000/getToken');

    const data = await response.json();
    const token = data.token;

    console.log(token)

    const url = 'ws://localhost:3000/'
    const tunnel = new GuacClient.WebSocketTunnel(url)
    const guac = new GuacClient.Client(tunnel)

    guac.onerror = (err) => {
      console.error('guac err: ', err)
    }

    const guacElement = guac.getDisplay().getElement()
    const displayContainer = document.getElementById('displayContainer');
    
    const canvas = guacElement.querySelectorAll('canvas')
    canvas.forEach((canva) => {
      canva.style.zIndex = '1000'
    })


    const mouse = new GuacClient.Mouse(guacElement)
    const keyboard = new GuacClient.Keyboard(guacElement)
    const pad = new GuacClient.Touch(guacElement)

    mouse.onmousedown = 
    mouse.onmouseup   =
    mouse.onmousemove = function(mouseState) {
        guac.sendMouseState(mouseState);
    };

    displayContainer.appendChild(guacElement)

    guac.connect('token=' + token)
    
    guac.onleave = () => guac.disconnect()

  } catch (error) {
    console.error('Error connecting to Guacamole:', error);
  }
}

