import {useCallback, useState} from "react";

import {CreateRoomPopup, EnterRoomPopup} from '../../components/index.js';

function Home() {
    const [roomId, setRoomId] = useState();
    const [isCreateRoomPopupVisible, setIsCreateRoomPopupVisible] = useState(false);
    const [isEnterRoomPopupVisible, setIsEnterRoomPopupVisible] = useState(false);

    const onRoomCreated = useCallback((roomId) => {
        setRoomId(roomId);
        setIsCreateRoomPopupVisible(false);
    }, []);

    const onRoomOpened = useCallback((roomId) => {
        setRoomId(roomId);
        setIsEnterRoomPopupVisible(false);
    }, []);

    return (
        <>
            <div>
                <button onClick={() => setIsCreateRoomPopupVisible(true)}>Create new room</button>
            </div>
            <div>
                <button onClick={() => setIsEnterRoomPopupVisible(true)}>Enter room</button>
            </div>

            {isCreateRoomPopupVisible && <CreateRoomPopup onRoomCreated={onRoomCreated}/>}

            {isEnterRoomPopupVisible && <EnterRoomPopup onRoomOpened={onRoomOpened}/>}
        </>
    );
}

export default Home;
