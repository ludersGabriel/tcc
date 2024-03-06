import useGuac from '../components/guac/Guac';

import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/about')({
  component: About,
});

function About() {
  useGuac();
  return (
    <>
      <div
        id="displayContainer"
        className="w-full h-full overflow-hidden flex justify-center items-center bg-black"
      ></div>
    </>
  );
}
