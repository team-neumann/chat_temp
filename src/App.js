import React, { useState, useContext } from 'react';
import './App.css';
import WebSocketProvider, { WebSocketContext } from './WebSocket';
import { Provider, useSelector, useDispatch } from 'react-redux'
import store from './store';
import { createRoom, setUsername, joinRoom } from './actions';
import { styled } from "./styles/themes"

function ChatRoom() {
	const [usernameInput, setUsernameInput] = useState("");
	const [msgInput, setMsgInput] = useState("");

	const room = useSelector(state => state.room);
	const username = useSelector(state => state.username);
	const chats = useSelector(state => state.chatLog);

	const dispatch = useDispatch();
	const ws = useContext(WebSocketContext);

	function enterRooom(){
		dispatch(setUsername(usernameInput));
	}

	const sendMessage = () => {
		ws.sendMessage(room.id, {
			username: username,
			message: msgInput
		});
	}

	return (
		 <SHome>
            <SChatList> 
				<div>
					{!username && 
					<div className="user">
						<input type="text" placeholder="Enter username" value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)} />
						<button onClick={enterRooom}>Enter Room</button>
					</div>	
					}
				</div>
			</SChatList>
            <SChatPanel>
                <SChatInfo>{room.name}</SChatInfo>
                <SChating>
					{chats.map((c, i) => (
						<div key={i}><i>{c.username}:</i> {c.message}</div>
					))}




					
                </SChating>
                <SChatingInput className="control">
                    <SInput type="text" value={msgInput} onChange={(e) => setMsgInput(e.target.value)}></SInput>
                    <SButton onClick={sendMessage}>send</SButton>
                </SChatingInput>
            </SChatPanel>
        </SHome>
	)
	
}


function HomeComponent(){
	const [roomName, setRoomName] = useState("");
	const [roomId, setRoomId] = useState("");
	const currentRoom = useSelector(state => state.room);

	const dispatch = useDispatch();

    return (
			<div style={{width:"100%", height:"100%", display:"grid"}}>
				{!currentRoom && 
					<div className="create">
						<div>
							<span>Create new room</span>
							<input type="text" placeholder="Room name" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
							<button onClick={() => dispatch(createRoom(roomName))}>Create</button>
						</div>
						<div>
							<span>Join existing room</span>
							<input type="text" placeholder="Room code" value={roomId} onChange={(e) => setRoomId(e.target.value)} />
							<button onClick={() => dispatch(joinRoom(roomId))}>Join</button>
						</div>
					</div>	
				}

				{currentRoom && 
                	<ChatRoom  style={{width:"100%", height:"100%", display:"grid"}} />
				}
			</div>
	);
}

function App() {
	return (
		<Provider store={store}>
			<WebSocketProvider>
				<HomeComponent style={{width:"100%", height:"100%", display:"grid"}}/>
			</WebSocketProvider>
		</Provider>
	)
}

export default App;

const SHome = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
`

const SChatList = styled.div`
    font-size: 36px;
    background-color: #202225;
    width: 300px;
`

const SChatPanel = styled.div`
    font-size: 36px;
    background-color: #2F3136;
    width: 75%;
`

const SChatInfo = styled.div`
    width: 100%;
    height: 50px;
    display: flex;
    flex-direction: row;
	background-color: #212326;
	justify-content: left;
	padding: 20px 50px;
	color: white;
`
const SChating = styled.div`
    width: 100%;
    height: 80%;
    display: flex;
    flex-direction: column;
	justify-content: left;
	color: white;
	text-align:left;
	padding: 10px;
	font-size:20px;
`
const SChatingInput = styled.div`
    width: 100%;
    height:50px;
    display: flex;
    flex-direction: row;
    background-color: white ;
`
const SInput = styled.input`
    width: 90%;
    background-color: white ;
    font-size: 20px;
    padding: 0 0 0 20px;
`

const SButton = styled.button`
    width:10%;
    background-color:red;
    font-size: 20px;
`