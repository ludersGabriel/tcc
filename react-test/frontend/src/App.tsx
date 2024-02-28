import Guac from "./components/guac/Guac"

function App() {

  return (
    <>
      <h1 className='border-2 border-black p-2 m-2'>vite with tailwind</h1>
      <Guac />
      <div id="displayContainer" className="w-full flex justify-center items-center bg-black"></div>
    </>
  )
}

export default App
