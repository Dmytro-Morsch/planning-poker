import {BrowserRouter, Route, Routes} from "react-router-dom";

import {Game, Home, MainLayout, PageNotFound} from './components';

import './App.css';
import './reset.css';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout/>}>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/game/:gameId" element={<Game/>}/>
                </Route>
                <Route path="*" element={<PageNotFound/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
