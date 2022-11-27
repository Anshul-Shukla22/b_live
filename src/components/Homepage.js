import React, { useEffect, useRef, useState } from 'react'
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import SendIcon from '@mui/icons-material/Send';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { Peer } from "peerjs";
const Homepage = () => {
    // const express = require('express');
    // const app = express();
    // const http = require('http');
    // const server = http.createServer(app);
    // const { Server } = require("socket.io");
    const { io } = require("socket.io-client");
    // const io = new Server(server);
    const socket = io("/");
    const [text, settext] = useState("");
    const [videoButton, setVideoButton] = useState(true);
    const [micButton, setMicButton] = useState(true);
    const textHandler = (e) => {
        settext(e.target.value);
    }
    const videoRef = useRef(null);

    var peer = new Peer(undefined, {
        path: "/peerjs",
        host: "/",
        port: "443",
    });
    const myVideo = document.createElement("video");
    let myVideoStream;
    let user;
    useEffect(() => {
        user = prompt("Enter your name");

        peer.on("open", (id) => {
            socket.emit("join-room", "ROOM_ID",user,id);
        });
        navigator.mediaDevices
            .getUserMedia({
                audio: true,
                video: true,
            })
            .then((stream) => {
                myVideoStream = stream;
                addVideoStream(myVideo, stream);

                peer.on("call", (call) => {
                    call.answer(stream);
                    const video = document.createElement("video");
                    call.on("stream", (userVideoStream) => {
                        addVideoStream(video, userVideoStream);
                    });
                });

                socket.on("user-connected", (userId) => {
                    connectToNewUser(userId, stream);
                });
            });
    }, [user]);

    const connectToNewUser = (userId, stream) => {
        const call = peer.call(userId, stream);
        const video = document.createElement("video");
        call.on("stream", (userVideoStream) => {
            addVideoStream(video, userVideoStream);
        });
    };

    const addVideoStream = (video, stream) => {
        video.srcObject = stream;
        video.addEventListener("loadedmetadata", () => {
            video.play();
        });
        videoRef.current.append(video);
    }
    socket.on("createMessage", (message, userName) => {
        console.log(message, userName);
    });
    const send = () => {
        if (text.length !== 0) {
            socket.emit("message", text);
            settext("");
        }
    }
    const inviteButton = () => {
        prompt(
            "Copy this link and send it to people you want to meet with",
            window.location.href
        );
    }
    const sendText = (e) => {
        if (e.key === "Enter" && text.length !== 0) {
            socket.emit("message", text);
            settext("");
        }
    }
    const stopVideo = () => {
        const enabled = myVideoStream.getVideoTracks()[0].enabled;
        if (enabled) {
            setVideoButton(false);
            myVideoStream.getVideoTracks()[0].enabled = false;
        } else {
            setVideoButton(true);
            myVideoStream.getVideoTracks()[0].enabled = true;
        }
    }
    const muteMic = () => {
        const enabled = myVideoStream.getAudioTracks()[0].enabled;
        if (enabled) {
            setMicButton(false);
            myVideoStream.getAudioTracks()[0].enabled = false;
        } else {
            setMicButton(true);
            myVideoStream.getAudioTracks()[0].enabled = true;
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
                        <div ref={videoRef} id="video-grid">

                        </div>
                    </div>
                    <div className="options">
                        <div className="options__left">
                            <div id="stopVideo" onClick={stopVideo} className="options__button">
                                {videoButton ? <VideocamIcon /> : <VideocamOffIcon />}
                            </div>
                            <div id="muteButton" onClick={muteMic} className="options__button">
                                {micButton ? <KeyboardVoiceIcon /> : <MicOffIcon />}
                            </div>
                            <div id="showChat" className="options__button">
                                <i className="fa fa-comment"></i>
                            </div>
                        </div>
                        <div className="options__right">
                            <div id="inviteButton" className="options__button" onClick={inviteButton}>
                                <PersonAddAlt1Icon fontSize="large" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="main__right">
                    <div className="main__chat_window">
                        <div className="messages">
                            {/* <div class="message">
                                <b><i class="far fa-user-circle"></i> <span> ${
                                    userName === user ? "me" : userName
                                }</span> </b>
                                <span>${message}</span>
                            </div> */}
                        </div>
                    </div>
                    <div className="main__message_container">
                        <input id="chat_message" value={text} onKeyDown={(e) => sendText} onChange={textHandler} type="text" placeholder="Type message here..." />
                        <div id="send" onClick={send} className="options__button">
                            <SendIcon fontSize="large" />
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Homepage