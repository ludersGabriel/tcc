import Guacamole from 'guacamole-common-js';
import { useCallback, useEffect, useState } from 'react';
import { useGuacToken } from '../../api/guac-token/GuacToken.query';

export default function useGuac() {
  const [guac, setGuac] = useState<Guacamole.Client | null>(null);
  const { token } = useGuacToken();

  useEffect(() => {
    const { guac, keyboard } = guacSetup();

    const handleUnload = () => {
      if (keyboard) {
        keyboard.onkeydown = null;
        keyboard.onkeyup = null;
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
  }, []);

  const guacConnect = useCallback(() => {
    if (!guac || !token) return;

    try {
      guac.connect('token=' + token);
    } catch (err) {
      console.log(err);
    }
  }, [guac, token]);

  useEffect(() => {
    guacConnect();
  }, [guacConnect]);

  const guacSetup = () => {
    const tunnel = new Guacamole.WebSocketTunnel(
      'ws://localhost:3000/',
    );
    const guac = new Guacamole.Client(tunnel);

    setGuac(guac);

    guac.onerror = (error) => {
      console.log('Error: ' + JSON.stringify(error));
    };

    guac.onleave = () => guac?.disconnect();

    const guacElement = guac.getDisplay().getElement();
    const displayContainer = document.getElementById(
      'displayContainer',
    );

    const canvas = guacElement.querySelectorAll('canvas');

    canvas.forEach((canva) => (canva.style.zIndex = '1000'));

    displayContainer?.appendChild(guacElement);

    const mouse = new Guacamole.Mouse(guacElement);

    mouse.onEach(['mousedown', 'mouseup', 'mousemove'], (event) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      guac.sendMouseState((event as any).state, true);
    });

    const keyboard = new Guacamole.Keyboard(document);

    keyboard.onkeydown = (keysym) => {
      guac.sendKeyEvent(1, keysym);
    };
    keyboard.onkeyup = (keysym) => {
      guac.sendKeyEvent(0, keysym);
    };

    return { guac, keyboard };
  };
}
