import { Stomp } from '@stomp/stompjs';
import React, { useEffect, useRef, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Scrollbars from "react-custom-scrollbars-2";
import { Link } from "react-router-dom";
import SockJS from 'sockjs-client';

// Import các hàm service (đảm bảo fetchStudentInfo gọi /students/by-account/{id})
import {
  fetchChatHistory,
  fetchRecentChatsForInstructor,
  fetchStudentInfo,
  sendChatMessage
} from "../../../services/chatService";

// Import header, sidebar cho Instructor
import { InstructorHeader } from "../header";
import InstructorSidebar from "../sidebar";

const InstructorMessages = () => {
  // Lấy instructorAccountId từ localStorage.
  const currentInstructorAccountId = parseInt(localStorage.getItem('instructorId'), 10);

  // Quản lý UI (search, responsive, v.v.)
  const [visible, setVisible] = useState(false);
  const [searchChat, setSearchChat] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 992);

  // Danh sách student đã chat (recent chat), student đang chọn, tin nhắn
  const [chatStudents, setChatStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentMsg, setCurrentMsg] = useState('');

  // Thông tin student đang chat
  const [studentInfo, setStudentInfo] = useState({
    name: "Student Name",
    avatar: "https://ibiettuot.com/wp-content/uploads/2021/10/avatar-mac-dinh.png"
  });

  // Tham chiếu stompClient để disconnect khi unmount
  const stompClientRef = useRef(null);

  // =========== Lấy danh sách student (recent chat) ===========
  useEffect(() => {
    const fetchRecentChatsData = async () => {
      try {
        // Gọi /api/chat/recent-chats-instructor?instructorId={accountId}
        const recentChats = await fetchRecentChatsForInstructor(currentInstructorAccountId);
        // recentChats có dạng [2, 5, 9, ...] => accountId của student

        // Lấy thông tin student cho mỗi accountId
        const students = await Promise.all(
          recentChats.map(async (stuAccId) => {
            // Hàm fetchStudentInfo(stuAccId) phải gọi /students/by-account/{stuAccId}
            const student = await fetchStudentInfo(stuAccId);
            // Map sang object hiển thị
            return {
              id: stuAccId,
              name: `${student.firstName} ${student.lastName}`,
              avatar: student.avatar,
              studentId: student.id // Thêm studentId vào object
            };
          })
        );

        setChatStudents(students);
      } catch (error) {
        console.error('Error fetching recent chats for instructor:', error);
      }
    };

    if (currentInstructorAccountId) {
      fetchRecentChatsData();
    }
  }, [currentInstructorAccountId]);

  // =========== Khi chọn 1 student trong Recent Chat ===========
  useEffect(() => {
    if (!selectedStudentId) return;

    // 1) Lấy lịch sử chat
    const fetchChatHistoryData = async () => {
      try {
        const chatHistory = await fetchChatHistory(currentInstructorAccountId, selectedStudentId);
        setMessages(chatHistory);
      } catch (error) {
        console.error('Error fetching chat history:', error);
        setMessages([]);
      }
    };

    fetchChatHistoryData();

    // 2) Lấy thông tin student
    const loadStudentInfo = async () => {
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

    loadStudentInfo();

    // 3) Kết nối WebSocket
    const socket = new SockJS('http://localhost:8080/ws-chat');
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, (frame) => {
      console.log('Instructor STOMP connected: ' + frame);

      // Lắng nghe tin nhắn từ queue/user.{instructorAccountId}
      stompClient.subscribe(`/queue/user.${currentInstructorAccountId}`, (messageOutput) => {
        const msg = JSON.parse(messageOutput.body);
        setMessages((prev) => [...prev, msg]);
      });
    }, (error) => {
      console.error('STOMP Error', error);
    });

    stompClientRef.current = stompClient;

    // Cleanup WS khi unmount
    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.disconnect();
      }
    };
  }, [currentInstructorAccountId, selectedStudentId]);

  // =========== Gửi tin nhắn ===========
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!currentMsg.trim() || !selectedStudentId) return;

    const chatMessageDTO = {
      senderAccountId: currentInstructorAccountId,
      receiverAccountId: selectedStudentId,
      content: currentMsg,
      type: "CHAT"
    };

    try {
      // Gửi tin nhắn bằng REST
      await sendChatMessage(chatMessageDTO);

      // Gửi tin nhắn qua WebSocket
      if (stompClientRef.current && stompClientRef.current.connected) {
        stompClientRef.current.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessageDTO));
      }

      // Thêm vào UI cho người gửi
      setMessages((prev) => [
        ...prev,
        {
          ...chatMessageDTO,
          senderName: "You",
          senderAvatar: "path/to/instructor/avatar.jpg", // Tuỳ chỉnh nếu muốn
          timestamp: new Date().toISOString()
        }
      ]);

      setCurrentMsg('');
    } catch (error) {
      console.error('Error sending chat message:', error);
    }
  };

  // =========== Chọn student (accountId) từ Recent Chat ===========
  const handleStudentClick = (stuAccId) => {
    setSelectedStudentId(stuAccId);
  };

  // =========== Theo dõi thay đổi kích thước màn hình ===========
  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 992);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ===================== Render UI =====================
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
                      {/* Left sidebar: danh sách student */}
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
                                    className={
                                      visible
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

                                {/* Danh sách Student */}
                                <ul className="user-list">
                                  {chatStudents.map((student) => (
                                    <li
                                      key={student.id}
                                      className={
                                        "user-list-item chat-user-list " +
                                        (selectedStudentId === student.id ? "active" : "")
                                      }
                                      onClick={() => handleStudentClick(student.id)}
                                    >
                                      <Link to="#">
                                        <div>
                                          <div className="avatar avatar-online">
                                            <img
                                              src={student.avatar}
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
                                {/* /Danh sách Student */}
                              </div>
                            </div>
                          </Scrollbars>
                        </div>
                      </div>
                      {/* /Left sidebar */}

                      {/* Khu vực chat chính */}
                      <div className="chat chat-messages" id="middle">
                        <div className="h-100">
                          {/* Header chat */}
                          <div className="chat-header">
                            <div className="user-details mb-0">
                              <figure className="avatar mb-0">
                                <img
                                  src={studentInfo.avatar}
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
                          {/* /Header chat */}

                          {/* Nội dung chat */}
                          <div className="chat-body chat-page-group slimscroll">
                            <div className="messages">
                              {messages.map((m, index) => {
                                const isMe = (m.senderAccountId === currentInstructorAccountId);

                                // Format giờ
                                const dateObj = new Date(m.timestamp);
                                const timeStr = dateObj.toLocaleTimeString('en-GB', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  timeZone: 'Asia/Ho_Chi_Minh'
                                });

                                // Style bubble chat
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
                                        <span>{timeStr}</span>
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
                          {/* /Nội dung chat */}
                        </div>

                        {/* Footer gõ tin nhắn */}
                        <div className="chat-footer">
                          <form onSubmit={handleSendMessage}>
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
                                    <Link to="#" className="dropdown-item">
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

export default InstructorMessages;