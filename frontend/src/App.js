
import { Button } from '@chakra-ui/react';
import './App.css';
import HomePage from './Pages/HomePage';
import ChatPage from './Pages/ChatPage';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Routes,
  BrowserRouter
} from "react-router-dom";
import ChatProvider from './context/context';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <ChatProvider>


          <Routes>

           
            <Route exact path="/" element={<HomePage></HomePage>} />
        <Route exact  path="/chat" element={<ChatPage></ChatPage>} />
  
          </Routes>
      </ChatProvider>

      </BrowserRouter>
      
      {/* <Route exact path="/" component={HomePage} />
      <Route exact path="/chat" component={ChatPage} /> */}



    </div>
  );
}

export default App;
