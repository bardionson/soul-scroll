import './App.css';
import { BrowserRouter as Router, Routes, Route}
    from 'react-router-dom';
import Minter from './Minter'
import Compose from './Compose'

function App() {
  return (
    <Router>
    <div className="App">
    </div>
    <Routes>
        <Route exact path='/' exact element={<Minter />} />
        <Route path='/compose' element={<Compose/>} />
    </Routes>
    </Router>
  );
}

export default App;
