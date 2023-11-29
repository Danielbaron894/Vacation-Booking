import './App.css';
import {HashRouter, Routes, Route} from 'react-router-dom';
import Home from './components/home/Home';
import AddVacation from './components/add_vacation/AddVacation';
import EditVacation from './components/edit_vacation/EditVacation';
import VacationsReport from './components/vacations_report/VacationsReport';
import Register from './components/register/Register';
import Login from './components/login/Login';
import CheckOut from'./components/checkout/CheckOut';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path='/' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/home' element={<Home />} />
        <Route path='/add' element={<AddVacation />} />
        <Route path="/edit/:id" element={<EditVacation />} />
        <Route path='/report' element={<VacationsReport />} />
        <Route path='/checkout/:id' element={<CheckOut />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
