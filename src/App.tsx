import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout';
import Home from './pages/Home';
import Post from './pages/Post';
import About from './pages/About'
import Archive from './pages/Archive'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post/:slug" element={<Post />} />
          <Route path="/about" element={<About />} />
          <Route path="/archive" element={<Archive />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App
