import { Stomp } from '@stomp/stompjs';
import React, { useEffect, useRef, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Scrollbars from "react-custom-scrollbars-2";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SockJS from 'sockjs-client';

import {
  fetchChatHistory,
  fetchInstructorInfo,
  fetchRecentChatsForInstructor,
  fetchStudentInfo,
} from "../../../services/chatService";

import { InstructorHeader } from "../header";
import InstructorSidebar from "../sidebar";

const DEFAULT_AVATAR = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ36xMCcz67__zewKxiZ1t5bQf1dI01lvQKsBK2nX_mzWfFerwJwZ0WcEAokPCmzPJv42g&usqp=CAU";

const InstructorMessages = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const currentInstructorId = parseInt(localStorage.getItem('instructorId'), 10);
  const studentIdFromParams = parseInt(queryParams.get('studentId'), 10);

  const [selectedStudentId, setSelectedStudentId] = useState(studentIdFromParams);
  const [visible, setVisible] = useState(false);
  const [searchChat, setSearchChat] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 992);

  const [chatStudents, setChatStudents] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentMsg, setCurrentMsg] = useState('');
  const messagesContainerRef = useRef(null);

  const [studentInfo, setStudentInfo] = useState({
    name: "Select Student to chat",
    avatar: DEFAULT_AVATAR
  });

  const [instructorInfo, setInstructorInfo] = useState({
    name: "Instructor",
    avatar: DEFAULT_AVATAR
  });

  const stompClientRef = useRef(null);

  // Lấy studentId từ URL và cập nhật state
  useEffect(() => {
    const studentIdFromParams = parseInt(queryParams.get('studentId'), 10);
    if (studentIdFromParams) {
      setSelectedStudentId(studentIdFromParams);
    } else {
      console.error("Student ID is missing in the URL");
    }
  }, [location.search]);

  // Fetch danh sách học viên và thông tin instructor
  useEffect(() => {
    const fetchRecentChatsData = async () => {
      try {
        const recentChats = await fetchRecentChatsForInstructor(currentInstructorId);

        const students = await Promise.all(
          recentChats.map(async (stuAccId) => {
            const student = await fetchStudentInfo(stuAccId);
            return {
              id: stuAccId,
              name: student.username,
              avatar: student.avatar || DEFAULT_AVATAR,
              studentId: student.id
            };
          })
        );

        setChatStudents(students);
      } catch (error) {
        console.error('Error fetching recent chats for instructor:', error);
      }
    };

    const fetchInstructorInfoData = async () => {
      try {
        const instructor = await fetchInstructorInfo(currentInstructorId);
        setInstructorInfo({
          name: instructor.username,
          avatar: instructor.avatar || DEFAULT_AVATAR
        });
      } catch (error) {
        console.error('Error fetching instructor info:', error);
      }
    };

    if (currentInstructorId) {
      fetchRecentChatsData();
      fetchInstructorInfoData();
    }
  }, [currentInstructorId]);

  // Fetch thông tin học viên, lịch sử chat và kết nối WebSocket
  useEffect(() => {
    if (!selectedStudentId) {
      console.error("Student ID is missing");
      return;
    }

    const fetchStudentInfoData = async () => {
      try {
        const student = await fetchStudentInfo(selectedStudentId);
        setStudentInfo({
          name: student.username,
          avatar: student.avatar || DEFAULT_AVATAR
        });
      } catch (error) {
        console.error('Error fetching student info:', error);
      }
    };

    const fetchChatHistoryData = async () => {
      try {
        const chatHistory = await fetchChatHistory(currentInstructorId, selectedStudentId);
        const sortedMessages = chatHistory.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        setMessages(sortedMessages);
      } catch (error) {
        console.error('Error fetching chat history:', error);
        setMessages([]);
      }
    };

    fetchStudentInfoData();
    fetchChatHistoryData();

    // Kết nối WebSocket
    const socket = new SockJS('http://localhost:8080/ws-chat');
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, (frame) => {
      console.log('Instructor STOMP connected: ' + frame);

      // Đăng ký nhận tin nhắn từ hàng đợi của instructor
      stompClient.subscribe(`/queue/user.${currentInstructorId}`, (messageOutput) => {
        console.log('Received message:', messageOutput.body);
        const msg = JSON.parse(messageOutput.body);

        setMessages((prev) => [
          ...prev,
          {
            ...msg,
            senderName: msg.senderAccountId === currentInstructorId ? "You" : studentInfo.name,
            senderAvatar: msg.senderAccountId === currentInstructorId
              ? instructorInfo.avatar
              : studentInfo.avatar
          }
        ]);
      });
    }, (error) => {
      console.error('STOMP Error', error);
    });

    stompClientRef.current = stompClient;

    // Cleanup khi component unmount
    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.disconnect();
      }
    };
  }, [currentInstructorId, selectedStudentId]);

  // Xử lý gửi tin nhắn
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!currentMsg.trim() || !selectedStudentId) return;

    const chatMessageDTO = {
      senderAccountId: currentInstructorId,
      receiverAccountId: selectedStudentId,
      content: currentMsg,
      type: "CHAT",
      timestamp: new Date().toISOString(),
    };

    try {
      // Kiểm tra kết nối WebSocket
      if (stompClientRef.current && stompClientRef.current.connected) {
        // Gửi tin nhắn qua WebSocket
        stompClientRef.current.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessageDTO));
      }

      // Cập nhật state để hiển thị tin nhắn ngay lập tức
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          ...chatMessageDTO,
          senderName: "You",
          senderAvatar: instructorInfo.avatar,
        },
      ]);

      // Log thông tin tin nhắn
      const timestamp = new Date().toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      console.log("Gửi tin nhắn:");
      console.log(`Người gửi: Bạn (ID: ${currentInstructorId})`);
      console.log(`Người nhận: Học viên (ID: ${selectedStudentId})`);
      console.log(`Nội dung: ${currentMsg}`);
      console.log(`Thời gian: ${timestamp}`);

      // Xóa nội dung tin nhắn
      setCurrentMsg('');

      // Fetch lại lịch sử chat để cập nhật UI
      await fetchChatHistory(currentInstructorId, selectedStudentId);

    } catch (error) {
      console.error('Lỗi khi gửi tin nhắn:', error);
    }
  };

  // Xử lý khi nhấp vào một học viên
  const handleStudentClick = async (stuAccId) => {
    navigate(`/instructor/instructor-messages?studentId=${stuAccId}`); // Cập nhật URL
    setSelectedStudentId(stuAccId); // Cập nhật state

    try {
      const chatHistory = await fetchChatHistory(currentInstructorId, stuAccId);
      const formattedMessages = chatHistory.map(m => ({
        ...m,
        senderName: m.senderAccountId === currentInstructorId ? "You" : studentInfo.name,
        senderAvatar: m.senderAccountId === currentInstructorId
          ? instructorInfo.avatar
          : studentInfo.avatar
      }));
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error fetching chat history:', error);
      setMessages([]);
    }
  };

  // Tự động cuộn xuống dưới cùng khi có tin nhắn mới
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Xử lý thay đổi kích thước màn hình
  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 992);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="main-wrapper chat-wrapper chat-page main-chat-blk">
      {/* Header Instructor */}
      <InstructorHeader activeMenu={"Messages"} />

      {/* Breadcrumb */}
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

      {/* Page content */}
      <div className="page-content chat-page-wrapper">
        <div className="container">
          <div className="row">
            {/* Sidebar Instructor */}
            <InstructorSidebar />

            {/* Main Chat Area */}
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

                              <div className="sidebar-body chat-body" id="chatsidebar">
                                <div className="d-flex justify-content-between align-items-center ps-0 pe-0">
                                  <div className="fav-title pin-chat">
                                    <h6>Recent Chat</h6>
                                  </div>
                                </div>

                                {/* Danh sách học viên */}
                                <ul className="user-list">
                                  {chatStudents.map((student) => (
                                    <li
                                      key={student.id}
                                      className={
                                        "user-list-item chat-user-list " +
                                        (selectedStudentId === student.id ? "active" : "")
                                      }
                                      onClick={() => handleStudentClick(student.id)} // Xử lý khi nhấp vào học viên
                                    >
                                      <Link to="#">
                                        <div>
                                          <div className="avatar avatar-online">
                                            <img
                                              src={student.avatar} onError={(e) => e.target.src = DEFAULT_AVATAR}
                                              className="rounded-circle"
                                              alt="student"
                                            />
                                          </div>
                                        </div>
                                        <div className="users-list-body">
                                          <div>
                                            <h5>{student.name}</h5>
                                            <p>recently</p>
                                          </div>
                                          <div className="last-chat-time">
                                            <small className="text-muted">...</small>
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

                      {/* Khu vực chat chính */}
                      <div className="chat chat-messages" id="middle">
                        <div className="h-100">
                          {/* Header chat */}
                          <div className="chat-header">
                            <div className="user-details mb-0">
                              <figure className="avatar mb-0">
                                <img
                                  src={studentInfo.avatar} onError={(e) => e.target.src = DEFAULT_AVATAR}
                                  className="rounded-circle"
                                  alt="student"
                                />
                              </figure>
                              <div className="mt-1">
                                <h5>{studentInfo.name}</h5>
                                <small className="last-seen">
                                  Talk to me
                                </small>
                              </div>
                            </div>

                            <div className="chat-options">
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

                            <div
                              className={
                                searchChat
                                  ? "chat-search visible-chat"
                                  : "chat-search"
                              }
                            >
                              <form>
                                <span className="form-control-feedback">
                                  <i className="bx bx-search" />
                                </span>
                                <input
                                  type="text"
                                  name="chat-search"
                                  placeholder="Search Chats"
                                  className="form-control"
                                />
                                <div
                                  className="close-btn-chat"
                                  onClick={() => setSearchChat(!searchChat)}
                                >
                                  <i className="feather icon-x" />
                                </div>
                              </form>
                            </div>
                          </div>

                          {/* Nội dung chat */}
                          <div className="chat-body chat-page-group slimscroll">
                            <div className="messages" ref={messagesContainerRef}>
                              {messages.map((m, index) => {
                                const isMe = m.senderAccountId === currentInstructorId;

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
                                        <span>{new Date(m.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
                                      </div>
                                      <div style={{ whiteSpace: 'pre-wrap' }}>
                                        {m.content}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Footer gõ tin nhắn */}
                        <div className="chat-footer">
                          <form onSubmit={handleSendMessage}>
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
                        {/* /Footer gõ tin nhắn */}
                      </div>
                      {/* /Khu vực chat chính */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /End col */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorMessages