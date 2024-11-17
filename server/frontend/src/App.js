import LoginPanel from "./components/Login/Login"
import RegisterContainer from "./components/Register/Register"
import { Routes, Route } from "react-router-dom";
import Dealer from "./components/Dealers/Dealer";
import Dealers from './components/Dealers/Dealers';
import PostReview from "./components/Dealers/PostReview";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPanel />} />
      <Route path="/register" element={<RegisterContainer />} />
      <Route path="/dealers" element={<Dealers/>} />
      <Route path="/dealer/:id" element={<Dealer/>} />
      <Route path="/postreview/:id" element={<PostReview/>} />
    </Routes>
  );
}
export default App;
