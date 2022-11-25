import React, { useState } from 'react'
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import VideocamIcon from '@mui/icons-material/Videocam';
import SendIcon from '@mui/icons-material/Send';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
const Homepage = () => {
    const [text, settext] = useState("");
    const textHandler = (e) => {
        console.log(e.target.value);
        settext(e.target.value);
    }
    const send=()=>{
        if (text.length !== 0) {
            // socket.emit("message", text.target.value);
            settext("");
          }
    }
    return (
        <>
            <div className="header">
                <div className="logo">
                    <div className="header__back">
                        <i className="fas fa-angle-left"></i>
                    </div>
                    <h3>Video Chat</h3>
                </div>
            </div>
            <div className="main">
                <div className="main__left">
                    <div className="videos__group">
                        <div id="video-grid">

                        </div>
                    </div>
                    <div className="options">
                        <div className="options__left">
                            <div id="stopVideo" className="options__button">
                               <VideocamIcon fontSize="large"/>
                            </div>
                            <div id="muteButton" className="options__button">
                                <KeyboardVoiceIcon fontSize="large"/>
                            </div>
                            <div id="showChat" className="options__button">
                                <i className="fa fa-comment"></i>
                            </div>
                        </div>
                        <div className="options__right">
                            <div id="inviteButton" className="options__button">
                                <PersonAddAlt1Icon fontSize="large"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="main__right">
                    <div className="main__chat_window">
                        <div className="messages">

                        </div>
                    </div>
                    <div className="main__message_container">
                        <input id="chat_message" value={text} onChange={textHandler} type="text" placeholder="Type message here..." />                       
                        <div id="send" onClick={send} className="options__button">
                            <SendIcon fontSize="large"/>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Homepage