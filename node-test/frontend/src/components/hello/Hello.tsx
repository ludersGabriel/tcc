import { useState } from "react"
import { trpc } from "../../trpc"

const Hello = () => {
  const [count, setCount] = useState(0)

  const a = trpc.hello.useQuery()

  return (
    <div className="p-2 m-2 border-black border-2">
          <p className="text-center">React with vite + bun + tailwind!!</p>
          <p>{a.isLoading ? 'Loading...' : a.data}</p>
          <p>Counter: {count}</p>
          <button className="rounded bg-blue-400 p-2" onClick={() => setCount(count + 1)}>aumentar!</button>
        </div>
  )
}

export default Hello