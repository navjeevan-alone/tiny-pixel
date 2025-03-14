import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Terms from './pages/Terms';
import PrivacyPolicy from './pages/PrivacyPolicy';
import How from './pages/How';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path='/terms-and-conditions' element={<Terms/>}/>
        <Route path='/privacy-policy' element={<PrivacyPolicy/>}/>
        <Route path='/how-to-use' element={<How/>} />
        <Route path='/*' element={<NotFound/>} />
      </Routes>
  );
}

export default App;