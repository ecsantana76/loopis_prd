import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { LoginModal } from './components/LoginModal';

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <LoginModal />
    </>
  );
}

export default App;
