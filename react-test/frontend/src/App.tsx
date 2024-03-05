import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import useGuac from './components/guac/Guac';

const queryClient = new QueryClient();

function RenderApp() {
  useGuac();
  return (
    <>
      <div
        id="displayContainer"
        className="w-full flex justify-center items-center bg-black"
      ></div>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RenderApp />
    </QueryClientProvider>
  );
}

export default App;
