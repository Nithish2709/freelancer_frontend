import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, MessageSquare, ArrowLeft, Search } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const Messaging = () => {
    const { userId } = useParams();           // optional — open a specific convo
    const { user: authUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const [conversations, setConversations] = useState([]);
    const [activeConvo, setActiveConvo]     = useState(null); // { user, messages }
    const [messages, setMessages]           = useState([]);
    const [newMsg, setNewMsg]               = useState('');
    const [sending, setSending]             = useState(false);
    const [loadingInbox, setLoadingInbox]   = useState(true);
    const [loadingMsgs, setLoadingMsgs]     = useState(false);
    const [search, setSearch]               = useState('');
    const bottomRef = useRef(null);

    const token = authUser?.token;
    const uid   = authUser?.id || authUser?._id;

    // ── Load inbox ────────────────────────────────────────────
    useEffect(() => {
        if (!token) return;
        const fetchInbox = async () => {
            try {
                const res  = await fetch('/api/messages', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message);
                setConversations(Array.isArray(data) ? data : []);
            } catch (err) {
                toast.error('Failed to load inbox: ' + err.message);
            } finally {
                setLoadingInbox(false);
            }
        };
        fetchInbox();
    }, [token]);

    // ── Auto-open conversation from URL param ─────────────────
    useEffect(() => {
        if (userId && token) openConversation(userId);
    }, [userId, token]); // eslint-disable-line

    // ── Scroll to bottom on new messages ─────────────────────
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const openConversation = async (otherUserId) => {
        setLoadingMsgs(true);
        try {
            const res  = await fetch(`/api/messages/${otherUserId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setActiveConvo(data.otherUser);
            setMessages(data.messages || []);
            // Update unread count in sidebar
            setConversations(prev =>
                prev.map(c => c.user.id === otherUserId ? { ...c, unread: 0 } : c)
            );
            navigate(`/messages/${otherUserId}`, { replace: true });
        } catch (err) {
            toast.error('Failed to load conversation: ' + err.message);
        } finally {
            setLoadingMsgs(false);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMsg.trim() || !activeConvo) return;
        setSending(true);
        try {
            const res  = await fetch(`/api/messages/${activeConvo.id}`, {
                method:  'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization:  `Bearer ${token}`
                },
                body: JSON.stringify({ content: newMsg.trim() })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setMessages(prev => [...prev, data]);
            setNewMsg('');
            // Bump last message in sidebar
            setConversations(prev => {
                const exists = prev.find(c => c.user.id === activeConvo.id);
                if (exists) {
                    return prev.map(c =>
                        c.user.id === activeConvo.id ? { ...c, lastMessage: data } : c
                    );
                }
                return [{ user: activeConvo, lastMessage: data, unread: 0 }, ...prev];
            });
        } catch (err) {
            toast.error('Failed to send message: ' + err.message);
        } finally {
            setSending(false);
        }
    };

    const filteredConvos = conversations.filter(c =>
        c.user?.name?.toLowerCase().includes(search.toLowerCase())
    );

    const formatTime = (ts) => {
        if (!ts) return '';
        const d = new Date(ts);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (ts) => {
        if (!ts) return '';
        return new Date(ts).toLocaleDateString();
    };

    return (
        <div className="min-h-screen py-6 px-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <MessageSquare className="h-6 w-6 text-sky-500" />
                    Messages
                </h1>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex"
                    style={{ height: '70vh' }}>

                    {/* ── Sidebar ─────────────────────────────── */}
                    <div className="w-72 flex-shrink-0 border-r border-gray-100 flex flex-col">
                        {/* Search */}
                        <div className="p-3 border-b border-gray-100">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search conversations…"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                                />
                            </div>
                        </div>

                        {/* Conversation list */}
                        <div className="flex-1 overflow-y-auto">
                            {loadingInbox ? (
                                <div className="p-4 space-y-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="skeleton h-10 w-10 rounded-full flex-shrink-0" />
                                            <div className="flex-1 space-y-1.5">
                                                <div className="skeleton h-3 w-3/4 rounded" />
                                                <div className="skeleton h-3 w-1/2 rounded" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : filteredConvos.length === 0 ? (
                                <div className="p-6 text-center text-gray-400 text-sm">
                                    No conversations yet
                                </div>
                            ) : (
                                filteredConvos.map(({ user: other, lastMessage, unread }) => (
                                    <button
                                        key={other.id}
                                        onClick={() => openConversation(other.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 ${
                                            activeConvo?.id === other.id ? 'bg-sky-50 border-l-2 border-l-sky-500' : ''
                                        }`}
                                    >
                                        <div className="relative flex-shrink-0">
                                            {other.profileImage ? (
                                                <img src={other.profileImage} alt={other.name}
                                                    className="h-10 w-10 rounded-full object-cover" />
                                            ) : (
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center">
                                                    <span className="text-sm font-bold text-white">
                                                        {other.name?.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                            )}
                                            {unread > 0 && (
                                                <span className="absolute -top-1 -right-1 h-4 w-4 bg-sky-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                                                    {unread}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <p className={`text-sm truncate ${unread > 0 ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                                                    {other.name}
                                                </p>
                                                <span className="text-xs text-gray-400 flex-shrink-0 ml-1">
                                                    {formatTime(lastMessage?.createdAt)}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-400 truncate mt-0.5">
                                                {lastMessage?.senderId === uid ? 'You: ' : ''}
                                                {lastMessage?.content || ''}
                                            </p>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* ── Chat Window ──────────────────────────── */}
                    <div className="flex-1 flex flex-col min-w-0">
                        {activeConvo ? (
                            <>
                                {/* Chat header */}
                                <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-3 bg-white">
                                    <button
                                        onClick={() => { setActiveConvo(null); setMessages([]); navigate('/messages'); }}
                                        className="sm:hidden p-1 rounded-lg hover:bg-gray-100 text-gray-500"
                                    >
                                        <ArrowLeft className="h-5 w-5" />
                                    </button>
                                    {activeConvo.profileImage ? (
                                        <img src={activeConvo.profileImage} alt={activeConvo.name}
                                            className="h-9 w-9 rounded-full object-cover" />
                                    ) : (
                                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center flex-shrink-0">
                                            <span className="text-sm font-bold text-white">
                                                {activeConvo.name?.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">{activeConvo.name}</p>
                                        <p className="text-xs text-gray-400 capitalize">{activeConvo.role}</p>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-gray-50">
                                    {loadingMsgs ? (
                                        <div className="flex items-center justify-center h-full">
                                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-sky-500 border-t-transparent" />
                                        </div>
                                    ) : messages.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                            <MessageSquare className="h-10 w-10 mb-2 text-gray-200" />
                                            <p className="text-sm">No messages yet. Say hello!</p>
                                        </div>
                                    ) : (
                                        <>
                                            {messages.map((msg, idx) => {
                                                const isMine = msg.senderId === uid || msg.sender?.id === uid;
                                                const showDate = idx === 0 ||
                                                    formatDate(messages[idx - 1]?.createdAt) !== formatDate(msg.createdAt);
                                                return (
                                                    <React.Fragment key={msg.id}>
                                                        {showDate && (
                                                            <div className="text-center">
                                                                <span className="text-xs text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-100">
                                                                    {formatDate(msg.createdAt)}
                                                                </span>
                                                            </div>
                                                        )}
                                                        <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                                                            <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                                                                isMine
                                                                    ? 'bg-sky-500 text-white rounded-br-sm'
                                                                    : 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm shadow-sm'
                                                            }`}>
                                                                <p>{msg.content}</p>
                                                                <p className={`text-xs mt-1 ${isMine ? 'text-sky-100' : 'text-gray-400'}`}>
                                                                    {formatTime(msg.createdAt)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </React.Fragment>
                                                );
                                            })}
                                            <div ref={bottomRef} />
                                        </>
                                    )}
                                </div>

                                {/* Input */}
                                <form onSubmit={handleSend}
                                    className="px-4 py-3 border-t border-gray-100 bg-white flex items-center gap-3">
                                    <input
                                        type="text"
                                        value={newMsg}
                                        onChange={e => setNewMsg(e.target.value)}
                                        placeholder="Type a message…"
                                        className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 bg-gray-50"
                                        disabled={sending}
                                    />
                                    <button
                                        type="submit"
                                        disabled={sending || !newMsg.trim()}
                                        className="h-10 w-10 rounded-xl btn-primary flex items-center justify-center flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {sending
                                            ? <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            : <Send className="h-4 w-4" />
                                        }
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                                <MessageSquare className="h-14 w-14 text-gray-200 mb-4" />
                                <p className="text-base font-medium text-gray-500">Select a conversation</p>
                                <p className="text-sm mt-1">Choose from your inbox or start a new chat</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Messaging;
