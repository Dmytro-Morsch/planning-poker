import {BrowserRouter, Route, Routes} from "react-router-dom";

import {Game, Home, PageNotFound} from './components';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/game/:gameId" element={<Game/>}/>
                <Route path="*" element={<PageNotFound/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
