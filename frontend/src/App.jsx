import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header.jsx';
import Landing from './components/Landing/Landing.jsx';
import AboutUs from './components/About/About.jsx';
import Login from './components/Login/Login.jsx';
import Register from './components/Register/Register.jsx';
import Catalogue from './components/Catalogue/Catalogue.jsx';
import ProductPage from './components/ProductPage/ProductPage.jsx';
import AdminPage from './components/Admin/AdminPage.jsx';
import EditPage from './components/Admin/EditPage/EditPage.jsx';
import AddProductPage from './components/Admin/AddProductPage/AddProductPage.jsx';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/catalogue" element={<Catalogue />} />
        <Route path="/product/:id" element={<ProductPage/>}/>
        <Route path="/admin" element={<AdminPage/>}/>
        <Route path="/admin/editPage/:id" element={<EditPage/>}/>
        <Route path="/admin/addProductPage" element={<AddProductPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;