import { Stomp } from '@stomp/stompjs';
import React, { useEffect, useRef, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Scrollbars from "react-custom-scrollbars-2";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SockJS from 'sockjs-client';

import { fetchChatHistory, fetchInstructorInfo, fetchRecentChats, fetchStudentInfo } from "../../../services/chatService";
import { InstructorHeader } from "../header";
import InstructorSidebar from "../sidebar";

const InstructorChat = () => {
  const navigate = useNavigate();

  const [visible, setVisible] = useState(false);
  const [searchChat, setSearchChat] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 992);
  const messagesContainerRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [currentMsg, setCurrentMsg] = useState('');

  const currentUserAccountId = parseInt(localStorage.getItem('instructorId'), 10);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const studentId = parseInt(queryParams.get('studentId'), 10);

  const [studentInfo, setStudentInfo] = useState({
    name: "Select Student to chat",
    avatar: "https://ibiettuot.com/wp-content/uploads/2021/10/avatar-mac-dinh.png"
  });

  const [instructorInfo, setInstructorInfo] = useState({
    name: "You",
    avatar: "https://ibiettuot.com/wp-content/uploads/2021/10/avatar-mac-dinh.png"
  });

  const [chatStudents, setChatStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(studentId);

  const stompClientRef = useRef(null);

  useEffect(() => {
    const studentIdFromParams = parseInt(queryParams.get('studentId'), 10);
    if (studentIdFromParams) {
      setSelectedStudentId(studentIdFromParams);
    } else {
      console.error("Student ID is missing in the URL");
    }
  }, [location.search]);

  useEffect(() => {
    const fetchRecentChatsData = async () => {
      try {
        const recentChats = await fetchRecentChats(currentUserAccountId);
        console.log("Recent Chats:", recentChats);

        const students = await Promise.all(
          recentChats.map(async (id) => {
            const student = await fetchStudentInfo(id);
            return {
              id: id,
              name: `${student.firstName} ${student.lastName}`,
              avatar: student.avatar
            };
          })
        );

        setChatStudents(students);
      } catch (error) {
        console.error('Error fetching recent chats:', error);
      }
    };

    fetchRecentChatsData();
  }, [currentUserAccountId]);

  useEffect(() => {
    if (!selectedStudentId) {
      console.error("Student ID is missing");
      return;
    }

    const fetchStudentInfoData = async () => {
      try {
        const student = await fetchStudentInfo(selectedStudentId);
        setStudentInfo({
          name: `${student.firstName} ${student.lastName}`,
          avatar: student.avatar
        });
      } catch (error) {
        console.error('Error fetching student info:', error);
      }
    };

    const fetchInstructorInfoData = async () => {
      try {
        const instructor = await fetchInstructorInfo(currentUserAccountId);
        setInstructorInfo({
          name: `${instructor.firstName} ${instructor.lastName}`,
          avatar: instructor.photo
        });
      } catch (error) {
        console.error('Error fetching instructor info:', error);
      }
    };

    fetchStudentInfoData();
    fetchInstructorInfoData();

    const fetchChatHistoryData = async () => {
      try {
        const chatHistory = await fetchChatHistory(currentUserAccountId, selectedStudentId);
        const sortedMessages = chatHistory.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        const formattedMessages = sortedMessages.map(m => ({
          ...m,
          senderName: m.senderAccountId === currentUserAccountId ? "You" : studentInfo.name,
          senderAvatar: m.senderAccountId === currentUserAccountId
            ? instructorInfo.avatar
            : studentInfo.avatar
        }));
        setMessages(formattedMessages);
      } catch (error) {
        console.error('Error fetching chat history:', error);
        setMessages([]);
      }
    };

    fetchChatHistoryData();

    const stompClient = connectWebSocket(currentUserAccountId, selectedStudentId, setMessages);
    stompClientRef.current = stompClient;

    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 992);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.disconnect();
      }
    };
  }, [currentUserAccountId, selectedStudentId]);

  const connectWebSocket = (currentUserAccountId, selectedStudentId, setMessages) => {
    const socket = new SockJS('http://localhost:8080/ws-chat');
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, (frame) => {
      console.log('Connected: ' + frame);

      // Subscribe to the correct queue
      stompClient.subscribe(`/queue/user.${currentUserAccountId}`, (messageOutput) => {
        console.log('Received message:', messageOutput.body);
        const msg = JSON.parse(messageOutput.body);

        setMessages((prev) => {
          const newMessages = [...prev, {
            ...msg,
            senderName: msg.senderAccountId === currentUserAccountId ? "You" : studentInfo.name,
            senderAvatar: msg.senderAccountId === currentUserAccountId
              ? instructorInfo.avatar
              : studentInfo.avatar
          }];
          return newMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        });
      });
    }, (error) => {
      console.error('Error connecting to WebSocket:', error);
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
        senderAccountId: currentUserAccountId,
        receiverAccountId: selectedStudentId,
        content: currentMsg,
        type: "CHAT",
        timestamp: new Date().toISOString(),
      };

      try {
        console.log('Sending message:', chatMessageDTO);
        stompClientRef.current.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessageDTO));

        // Thêm tin nhắn mới vào state
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            ...chatMessageDTO,
            senderName: "You",
            senderAvatar: instructorInfo.avatar,
            timestamp: new Date().toISOString()
          },
        ]);

        const timestamp = new Date().toLocaleString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });

        console.log("Gửi tin nhắn:");
        console.log(`Người gửi: Bạn (ID: ${currentUserAccountId})`);
        console.log(`Người nhận: Student (ID: ${selectedStudentId})`);
        console.log(`Nội dung: ${currentMsg}`);
        console.log(`Thời gian: ${timestamp}`);

        // Clear the message input
        setCurrentMsg('');

        // Check if student is in the list of recent chats
        const isStudentInList = chatStudents.some(student => student.id === selectedStudentId);
        if (!isStudentInList) {
          const student = await fetchStudentInfo(selectedStudentId);
          setChatStudents(prev => [...prev, {
            id: selectedStudentId,
            name: `${student.firstName} ${student.lastName}`,
            avatar: student.avatar,
          }]);
        }

      } catch (error) {
        console.error('Error sending chat message:', error);
      }
    }
  };

  const handleStudentClick = async (id) => {
    navigate(`/instructor/instructor-messages?studentId=${id}`);
    setSelectedStudentId(id);

    try {
      const chatHistory = await fetchChatHistory(currentUserAccountId, id);
      const formattedMessages = chatHistory.map(m => ({
        ...m,
        senderName: m.senderAccountId === currentUserAccountId ? "You" : studentInfo.name,
        senderAvatar: m.senderAccountId === currentUserAccountId
          ? instructorInfo.avatar
          : studentInfo.avatar
      }));
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error fetching chat history:', error);
      setMessages([]);
    }
  };

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="main-wrapper chat-wrapper chat-page main-chat-blk">
      <InstructorHeader activeMenu={"Messages"} />
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
            <InstructorSidebar />

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
                                  {chatStudents.map((student) => (
                                    <li
                                      className={`user-list-item chat-user-list ${selectedStudentId === student.id ? 'active' : ''}`}
                                      key={student.id}
                                      onClick={() => handleStudentClick(student.id)}
                                    >
                                      <Link to="#">
                                        <div>
                                          <div className="avatar avatar-online">
                                            <img
                                              src={student.avatar}
                                              onError={(e) => e.target.src = "https://ibiettuot.com/wp-content/uploads/2021/10/avatar-mac-dinh.png"}
                                              className="rounded-circle"
                                              alt="image"
                                            />
                                          </div>
                                        </div>
                                        <div className="users-list-body">
                                          <div>
                                            <h5>{student.name || "Student Name"}</h5>
                                            <p>viewed</p>
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
                                  src={studentInfo.avatar}
                                  onError={(e) => e.target.src = "https://ibiettuot.com/wp-content/uploads/2021/10/avatar-mac-dinh.png"}
                                  className="rounded-circle"
                                  alt="image"
                                />
                              </figure>
                              <div className="mt-1">
                                <h5>{studentInfo.name}</h5>
                                <small className="last-seen">Last seen recently</small>
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

export default InstructorChat;