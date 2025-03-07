import { Stomp } from '@stomp/stompjs';
import React, { useEffect, useRef, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Scrollbars from "react-custom-scrollbars-2";
import { Link, useLocation } from "react-router-dom";
import SockJS from 'sockjs-client';

import { fetchChatHistory, fetchInstructorInfo, fetchRecentChats, fetchStudentInfo } from "../../../services/chatService";
import StudentHeader from "../header";
import StudentSidebar from "../sidebar";

const StudentMessages = () => {
  const [visible, setVisible] = useState(false);
  const [searchChat, setSearchChat] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 992);
  const messagesContainerRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [currentMsg, setCurrentMsg] = useState('');

  const currentUserAccountId = parseInt(localStorage.getItem('accountId'), 10);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const instructorAccountId = parseInt(queryParams.get('instructorAccountId'), 10); // Đổi từ instructorId sang instructorAccountId

  const [instructorInfo, setInstructorInfo] = useState({
    name: "Select Instructor to chat",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ36xMCcz67__zewKxiZ1t5bQf1dI01lvQKsBK2nX_mzWfFerwJwZ0WcEAokPCmzPJv42g&usqp=CAU"
  });

  const [studentInfo, setStudentInfo] = useState({
    name: "You",
    avatar: "https://ibiettuot.com/wp-content/uploads/2021/10/avatar-mac-dinh.png"
  });

  const [chatInstructors, setChatInstructors] = useState([]);
  const [selectedInstructorAccountId, setSelectedInstructorAccountId] = useState(instructorAccountId); // Đổi từ selectedInstructorId sang selectedInstructorAccountId

  const stompClientRef = useRef(null);

  useEffect(() => {
    const fetchRecentChatsData = async () => {
      try {
        const recentChats = await fetchRecentChats(currentUserAccountId);
        const instructors = await Promise.all(
          recentChats.map(async (id) => {
            const instructor = await fetchInstructorInfo(id);
            return {
              id: id,
              name: `${instructor.firstName} ${instructor.lastName}`,
              avatar: instructor.photo
            };
          })
        );
        setChatInstructors(instructors);
      } catch (error) {
        console.error('Error fetching recent chats:', error);
      }
    };

    fetchRecentChatsData();
  }, [currentUserAccountId]);

  useEffect(() => {
    if (!selectedInstructorAccountId) {
      console.error("Instructor Account ID is missing");
      return;
    }

    const fetchInstructorInfoData = async () => {
      try {
        const instructor = await fetchInstructorInfo(selectedInstructorAccountId); // Đổi từ selectedInstructorId sang selectedInstructorAccountId
        setInstructorInfo({
          name: `${instructor.firstName} ${instructor.lastName}`,
          avatar: instructor.photo
        });
      } catch (error) {
        console.error('Error fetching instructor info:', error);
      }
    };

    const fetchStudentInfoData = async () => {
      try {
        const student = await fetchStudentInfo(currentUserAccountId);
        setStudentInfo({
          name: `${student.firstName} ${student.lastName}`,
          avatar: student.photo
        });
      } catch (error) {
        console.error('Error fetching student info:', error);
      }
    };

    fetchInstructorInfoData();
    fetchStudentInfoData();

    const fetchChatHistoryData = async () => {
      try {
        const chatHistory = await fetchChatHistory(currentUserAccountId, selectedInstructorAccountId); // Đổi từ selectedInstructorId sang selectedInstructorAccountId
        const formattedMessages = chatHistory.map(m => ({
          ...m,
          senderName: m.senderAccountId === currentUserAccountId ? "You" : instructorInfo.name,
          senderAvatar: m.senderAccountId === currentUserAccountId
            ? studentInfo.avatar
            : instructorInfo.avatar
        }));
        setMessages(formattedMessages);
      } catch (error) {
        console.error('Error fetching chat history:', error);
        setMessages([]);
      }
    };

    fetchChatHistoryData();

    const stompClient = connectWebSocket(currentUserAccountId, setMessages);
    stompClientRef.current = stompClient;

    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 992);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.disconnect();
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [currentUserAccountId, selectedInstructorAccountId]); // Đổi từ selectedInstructorId sang selectedInstructorAccountId

  const connectWebSocket = (currentUserAccountId, setMessages) => {
    const socket = new SockJS('http://localhost:8080/ws-chat?token=' + localStorage.getItem("token"));
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, (frame) => {
      console.log('Connected: ' + frame);

      stompClient.subscribe(`/queue/user.${currentUserAccountId}`, (messageOutput) => {
        const msg = JSON.parse(messageOutput.body);
        setMessages(prev => [...prev, {
          ...msg,
          senderName: msg.senderAccountId === currentUserAccountId ? "You" : instructorInfo.name,
          senderAvatar: msg.senderAccountId === currentUserAccountId
            ? studentInfo.avatar
            : instructorInfo.avatar
        }]);
      });
    }, (error) => {
      console.error('Error', error);
    });

    return stompClient;
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (currentMsg.trim() !== '' && stompClientRef.current) {
      if (!stompClientRef.current.connected) {
        console.error("STOMP connection is not established.");
        return;
      }

      const chatMessageDTO = {
        senderAccountId: currentUserAccountId, // Người gửi là student
        receiverAccountId: selectedInstructorAccountId, // Người nhận là instructor (đổi từ receiverInstructorId sang receiverAccountId)
        content: currentMsg,
        type: "CHAT"
      };

      try {
        // await sendChatMessage(chatMessageDTO); // Gửi tin nhắn qua API REST để lưu vào database

        stompClientRef.current.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessageDTO)); // Gửi tin nhắn qua WebSocket

        setMessages(prev => [...prev, {
          ...chatMessageDTO,
          senderName: "You",
          senderAvatar: studentInfo.avatar,
        }]);
        setCurrentMsg('');

        const isInstructorInList = chatInstructors.some(instructor => instructor.id === selectedInstructorAccountId); // Đổi từ selectedInstructorId sang selectedInstructorAccountId
        if (!isInstructorInList) {
          const instructor = await fetchInstructorInfo(selectedInstructorAccountId); // Đổi từ selectedInstructorId sang selectedInstructorAccountId
          setChatInstructors(prev => [...prev, {
            id: selectedInstructorAccountId, // Đổi từ selectedInstructorId sang selectedInstructorAccountId
            name: `${instructor.firstName} ${instructor.lastName}`,
            avatar: instructor.photo
          }]);
        }
      } catch (error) {
        console.error('Error sending chat message:', error);
      }
    }
  };

  const handleInstructorClick = async (id) => {
    setSelectedInstructorAccountId(id); // Đổi từ setSelectedInstructorId sang setSelectedInstructorAccountId
    try {
      const chatHistory = await fetchChatHistory(currentUserAccountId, id);
      const formattedMessages = chatHistory.map(m => ({
        ...m,
        senderName: m.senderAccountId === currentUserAccountId ? "You" : instructorInfo.name,
        senderAvatar: m.senderAccountId === currentUserAccountId
          ? studentInfo.avatar
          : instructorInfo.avatar
      }));
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error fetching chat history:', error);
      setMessages([]);
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
                                  {chatInstructors.map((instructor) => (
                                    <li
                                      className={`user-list-item chat-user-list ${selectedInstructorAccountId === instructor.id ? 'active' : ''}`} // Đổi từ selectedInstructorId sang selectedInstructorAccountId
                                      key={instructor.id}
                                      onClick={() => handleInstructorClick(instructor.id)}
                                    >
                                      <Link to="#">
                                        <div>
                                          <div className="avatar avatar-online">
                                            <img
                                              src={instructor.avatar} onError={(e) => e.target.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ36xMCcz67__zewKxiZ1t5bQf1dI01lvQKsBK2nX_mzWfFerwJwZ0WcEAokPCmzPJv42g&usqp=CAU"}
                                              className="rounded-circle"
                                              alt="image"
                                            />
                                          </div>
                                        </div>
                                        <div className="users-list-body">
                                          <div>
                                            <h5>{instructor.name || "Instructor Name"}</h5>
                                            <p>
                                              viewed
                                            </p>
                                          </div>
                                          <div className="last-chat-time">
                                            <small className="text-muted">recently</small>
                                            <div className="chat-pin">
                                              <i className="fa-solid fa-check" />
                                            </div>
                                          </div>
                                        </div>
                                      </Link>
                                    </li>
                                  ))}
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
                                  src={instructorInfo.avatar} onError={(e) => e.target.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ36xMCcz67__zewKxiZ1t5bQf1dI01lvQKsBK2nX_mzWfFerwJwZ0WcEAokPCmzPJv42g&usqp=CAU"}
                                  className="rounded-circle"
                                  alt="image"
                                />
                              </figure>
                              <div className="mt-1">
                                <h5>{instructorInfo.name}</h5>
                                <small className="last-seen">
                                  Talk to me
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
                                  const isMe = m.senderAccountId === currentUserAccountId; // Đổi từ senderStudentId sang senderAccountId
                                  const dateObj = new Date(m.timestamp);
                                  const timeStr = dateObj.toLocaleTimeString('en-GB', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    timeZone: 'Asia/Ho_Chi_Minh'
                                  });

                                  const chatContainerStyle = {
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    marginBottom: '10px',
                                    width: '100%',
                                    justifyContent: isMe ? 'flex-end' : 'flex-start'
                                  };

                                  const chatContentStyle = {
                                    maxWidth: '70%',
                                    width: 'fit-content',
                                    padding: '8px 12px',
                                    borderRadius: '12px',
                                    backgroundColor: isMe ? '#fff1f0' : '#f0f5ff',
                                    wordWrap: 'break-word'
                                  };

                                  const messageContentStyle = {
                                    wordWrap: 'break-word',
                                    whiteSpace: 'pre-wrap'
                                  };

                                  const timeStyle = {
                                    fontSize: '12px',
                                    color: '#777',
                                    marginBottom: '3px',
                                    textAlign: isMe ? 'right' : 'left'
                                  };

                                  return (
                                    <div style={chatContainerStyle} key={index}>
                                      <div style={chatContentStyle}>
                                        <div style={timeStyle}>
                                          <span>{timeStr}</span>
                                        </div>
                                        <div style={messageContentStyle}>{m.content}</div>
                                      </div>
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentMessages;