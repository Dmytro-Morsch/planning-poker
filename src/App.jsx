import {Route, Routes} from "react-router-dom";

import {Home, Room} from './pages';

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/room/:roomId" element={<Room/>}/>
                <Route path="*" element={<h1>Not Found</h1>}/>
            </Routes>
        </>
    )
}

export default App;
