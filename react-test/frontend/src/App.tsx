import Guac from "./components/guac/Guac"

function App() {

  return (
    <>
      <h1 className='border-2 border-black p-2 m-2'>vite with tailwind</h1>
      <div id="displayContainer" className="w-full h-600 bg-black"></div>
      <Guac />
    </>
  )
}

export default App
