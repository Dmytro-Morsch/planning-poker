import {useCallback, useState} from "react";
import CreateRoomPopup from "../CreateRoomPopup/CreateRoomPopup.jsx";

function Home() {
    const [roomId, setRoomId] = useState();
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    const onRoomCreated = useCallback((roomId) => {
        setRoomId(roomId);
        setIsPopupVisible(false);
    }, []);

    return (
        <>
            <div>
                <button onClick={() => setIsPopupVisible(true)}>Create new room</button>
            </div>
            <div>
                <button>Enter room</button>
            </div>

            {isPopupVisible && <CreateRoomPopup onRoomCreated={onRoomCreated}/>}
        </>
    );
}

export default Home;
