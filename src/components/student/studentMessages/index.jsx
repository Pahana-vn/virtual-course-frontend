import { Stomp } from '@stomp/stompjs';
import React, { useEffect, useRef, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Scrollbars from "react-custom-scrollbars-2";
import { Link } from "react-router-dom";
import SockJS from 'sockjs-client';

import StudentHeader from "../header";
import StudentSidebar from "../sidebar";
import "./studentMessages1.css";

const StudentMessages = () => {
  const [visible, setVisible] = useState(false);
  const [searchChat, setSearchChat] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 992);
  const messagesContainerRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [currentMsg, setCurrentMsg] = useState('');

  // Get the studentId and instructorId from localStorage
  const currentUserAccountId = localStorage.getItem('studentId');  // Get studentId from local storage
  const chatWithAccountId = localStorage.getItem('instructorId');  // Get instructorId from local storage

  const stompClientRef = useRef(null);

  // Resize handler
  const handleResize = () => {
    setIsSmallScreen(window.innerWidth < 992);
  };

  useEffect(() => {
    // Fetch chat history between student and instructor
    fetch(`http://localhost:8080/api/chat/history?user1Id=${currentUserAccountId}&user2Id=${chatWithAccountId}`)
      .then(res => res.json())
      .then(data => {
        setMessages(data);
      })
      .catch(error => console.error('Error fetching chat history:', error));

    // Connect to WebSocket
    const socket = new SockJS('http://localhost:8080/ws-chat');
    const stompClient = Stomp.over(socket);
    stompClientRef.current = stompClient;

    stompClient.connect({}, (frame) => {
      console.log('Connected: ' + frame);
      // Subscribe to receive messages in real-time
      stompClient.subscribe(`/queue/user.${currentUserAccountId}`, (messageOutput) => {
        const msg = JSON.parse(messageOutput.body);
        setMessages(prev => [...prev, msg]);
      });
    }, (error) => {
      console.error('Error', error);
    });

    window.addEventListener("resize", handleResize);

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.disconnect();
      }
      window.removeEventListener("resize", handleResize);
    }
  }, [currentUserAccountId, chatWithAccountId]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (currentMsg.trim() !== '' && stompClientRef.current) {
      const chatMessageDTO = {
        senderAccountId: currentUserAccountId,
        receiverAccountId: chatWithAccountId,
        content: currentMsg,
        type: "CHAT"
      };
      stompClientRef.current.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessageDTO));

      // Temporarily add the message to UI for the sender
      setMessages(prev => [...prev, {
        ...chatMessageDTO,
        senderName: "You",
        senderAvatar: "https://ibiettuot.com/wp-content/uploads/2021/10/avatar-mac-dinh.png", // Placeholder avatar
      }]);
      setCurrentMsg('');
    }
  };

  return (
    <div className="main-wrapper chat-wrapper chat-page main-chat-blk">
      <StudentHeader activeMenu={"Messages"} />
      <div className="breadcrumb-bar breadcrumb-bar-info">
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-12">
              <div className="breadcrumb-list">
                <h2 className="breadcrumb-title">Messages</h2>
                <nav aria-label="breadcrumb" className="page-breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/home">Home</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Messages
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-content chat-page-wrapper">
        <div className="container">
          <div className="row">
            <StudentSidebar />

            <div className="col-xl-9 col-lg-9 theiaStickySidebar">
              <div className="settings-widget card-details mb-0">
                <div className="settings-menu p-0">
                  <div className="profile-heading">
                    <h3>Message</h3>
                  </div>
                  <div className="checkout-form">
                    <div className="content">
                      <div className="sidebar-group left-sidebar chat_sidebar">
                        <div
                          id="chats"
                          className="left-sidebar-wrap sidebar active slimscroll"
                        >
                          <Scrollbars className={isSmallScreen ? "mob-scrn" : ""}>
                            <div className="slimscroll">
                              <div className="left-chat-title all-chats d-flex justify-content-between align-items-center">
                                <div className="select-group-chat">
                                  <div className="dropdown">
                                    <Link to="#">All Chats</Link>
                                  </div>
                                </div>
                                <div className="add-section">
                                  <ul>
                                    <li>
                                      <Link
                                        onClick={() => setVisible(!visible)}
                                        to="#"
                                        className="user-chat-search-btn"
                                      >
                                        <i className="feather icon-search" />
                                      </Link>
                                    </li>
                                  </ul>
                                  <div
                                    className={visible
                                      ? "user-chat-search visible-chat"
                                      : "user-chat-search"
                                    }
                                  >
                                    <form>
                                      <span className="form-control-feedback">
                                        <i className="feather icon-search" />
                                      </span>
                                      <input
                                        type="text"
                                        name="chat-search"
                                        placeholder="Search"
                                        className="form-control"
                                      />
                                      <div
                                        className="user-close-btn-chat"
                                        onClick={() => setVisible(!visible)}
                                      >
                                        <i className="feather icon-x" />
                                      </div>
                                    </form>
                                  </div>
                                </div>
                              </div>
                              <div
                                className="sidebar-body chat-body"
                                id="chatsidebar"
                              >
                                <div className="d-flex justify-content-between align-items-center ps-0 pe-0">
                                  <div className="fav-title pin-chat">
                                    <h6>Recent Chat</h6>
                                  </div>
                                </div>
                                <ul className="user-list">
                                  <li className="user-list-item chat-user-list">
                                    <Link to="#">
                                      <div>
                                        <div className="avatar avatar-online">
                                          <img
                                            src="path/to/receiver/avatar.jpg"
                                            className="rounded-circle"
                                            alt="image"
                                          />
                                        </div>
                                      </div>
                                      <div className="users-list-body">
                                        <div>
                                          <h5>Receiver Name</h5>
                                          <p>
                                            <i className="bx bx-video me-1" />
                                            Video
                                          </p>
                                        </div>
                                        <div className="last-chat-time">
                                          <small className="text-muted">
                                            Yesterday
                                          </small>
                                          <div className="chat-pin">
                                            <i className="fa-solid fa-check" />
                                          </div>
                                        </div>
                                      </div>
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </Scrollbars>
                        </div>
                      </div>

                      <div className="chat chat-messages" id="middle">
                        <div className="h-100">
                          <div className="chat-header">
                            <div className="user-details mb-0">
                              <figure className="avatar mb-0">
                                <img
                                  src="path/to/receiver/avatar.jpg"
                                  className="rounded-circle"
                                  alt="image"
                                />
                              </figure>
                              <div className="mt-1">
                                <h5>Receiver Name</h5>
                                <small className="last-seen">
                                  Last Seen at 07:15 PM
                                </small>
                              </div>
                            </div>
                            <div className="chat-options ">
                              <ul className="list-inline">
                                <li className="list-inline-item">
                                  <OverlayTrigger
                                    placement="bottom"
                                    overlay={<Tooltip>Search</Tooltip>}
                                  >
                                    <Link
                                      onClick={() => setSearchChat(!searchChat)}
                                      to="#"
                                      className="btn btn-outline-light chat-search-btn"
                                    >
                                      <i className="feather icon-search" />
                                    </Link>
                                  </OverlayTrigger>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="chat-body chat-page-group slimscroll">
                            <div className="chat-messages-container" ref={messagesContainerRef}>
                              <div className="messages">
                                {messages.map((m, index) => {
                                  const isMe = m.senderAccountId === currentUserAccountId;

                                  const dateObj = new Date(m.timestamp);
                                  const timeStr = dateObj.toLocaleTimeString('en-GB', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    timeZone: 'Asia/Ho_Chi_Minh'
                                  });

                                  const avatar = m.senderAvatar
                                    ? m.senderAvatar
                                    : 'path/to/default/avatar.jpg';

                                  const displayName = m.senderName
                                    ? m.senderName
                                    : isMe
                                      ? 'You'
                                      : 'User';

                                  return (
                                    <div className={isMe ? 'chats chats-right' : 'chats'} key={index}>
                                      {!isMe && (
                                        <div className="chat-avatar">
                                          <img
                                            src={avatar}
                                            className="rounded-circle dreams_chat"
                                            alt="image"
                                          />
                                        </div>
                                      )}
                                      <div className="chat-content">
                                        <div className={`chat-profile-name ${isMe ? 'text-end' : ''}`}>
                                          <h6>
                                            {displayName}
                                            <span>{timeStr}</span>
                                          </h6>
                                        </div>
                                        <div className="message-content">{m.content}</div>
                                      </div>
                                      {isMe && (
                                        <div className="chat-avatar">
                                          <img
                                            src={avatar}
                                            className="rounded-circle dreams_chat"
                                            alt="image"
                                          />
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="chat-footer">
                          <form onSubmit={sendMessage}>
                            <div className="smile-foot">
                              <div className="chat-action-btns">
                                <div className="chat-action-col">
                                  <Link
                                    className="action-circle"
                                    to="#"
                                    data-bs-toggle="dropdown"
                                  >
                                    <i className="fa-solid fa-ellipsis-vertical" />
                                  </Link>
                                  <div className="dropdown-menu dropdown-menu-end">
                                    <Link to="#" className="dropdown-item ">
                                      <span>
                                        <i className="bx bx-file" />
                                      </span>
                                      Document
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="smile-foot emoj-action-foot">
                              <Link to="#" className="action-circle">
                                <i className="bx bx-smile" />
                              </Link>
                            </div>
                            <div className="replay-forms">
                              <input
                                type="text"
                                className="form-control chat_form"
                                placeholder="Type your message here..."
                                value={currentMsg}
                                onChange={(e) => setCurrentMsg(e.target.value)}
                              />
                            </div>
                            <div className="form-buttons">
                              <button className="btn send-btn" type="submit">
                                <i className="bx bx-paper-plane" />
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                      {/* /Chat */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Student Profile */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentMessages;
