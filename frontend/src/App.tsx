import { AppErrorProvider } from './contexts/AppErrorProvider';
import { ChatScreen } from './components/ChatScreen';

function App() {
  return (
    <AppErrorProvider>
      <ChatScreen />
    </AppErrorProvider>
  );
}

export default App;
