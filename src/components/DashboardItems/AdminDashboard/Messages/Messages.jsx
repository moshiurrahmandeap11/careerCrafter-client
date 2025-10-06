import React, { useEffect, useState } from "react";
import axiosIntense from "../../../../hooks/AxiosIntense/axiosIntense";
import Loader from "../../../sharedItems/Loader/Loader";

const Messages = () => {
  const [users, setUsers] = useState([]);  
  const [allMessages, setAllMessages] = useState([]);  
  const [groupedConversations, setGroupedConversations] = useState({});  
  const [loading, setLoading] = useState(true);
  const [blockedCount, setBlockedCount] = useState(0);


  const getUserName = (email) => {
    const user = users.find(u => u.email === email);
    return user ? (user.fullName || email) : email;
  };


  const groupMessages = (messages) => {
    const grouped = {};
    messages.forEach(msg => {
      const emails = [msg.fromEmail, msg.toEmail].sort();
      const key = emails.join('-');
      if (!grouped[key]) {
        grouped[key] = { participants: emails, messages: [] };
      }
      grouped[key].messages.push(msg);
    });

    Object.keys(grouped).forEach(key => {
      grouped[key].messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    });
    return grouped;
  };


  const cleanHistory = async () => {
    try {
      setLoading(true);
      const res = await axiosIntense.get("/messageUsers/allMessages");
      const { messages: cleanMessages = [], blockedCount: cleanBlockedCount = 0 } = res.data || {};
      setAllMessages(cleanMessages);
      

      const grouped = groupMessages(cleanMessages);  
      setGroupedConversations(grouped);

      setBlockedCount(cleanBlockedCount);
      
      setLoading(false);
      alert(`History cleaned! Removed ${cleanBlockedCount} hate speech messages.`);  
    } catch (err) {
      console.error("Clean error:", err);
      setLoading(false);
      alert("Failed to clean history. Try again.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);


        const usersRes = await axiosIntense.get(`/messageUsers/usersEmail?email=dummy@example.com`);
        setUsers(usersRes.data || []);


        const messagesRes = await axiosIntense.get("/messageUsers/allMessages");
        const { messages: fetchedMessages = [], blockedCount: fetchedBlockedCount = 0 } = messagesRes.data || {};
        setAllMessages(fetchedMessages);
        

        setBlockedCount(fetchedBlockedCount);


        const grouped = groupMessages(fetchedMessages);
        setGroupedConversations(grouped);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Admin Messages Monitoring</h1>
      <p className="text-gray-600">
        Global view of all conversations ({Object.keys(groupedConversations).length} active chats) | 
        Blocked hate messages: {blockedCount}
      </p>

      {/* Clean Button */}
      <div className="flex justify-end">
        <button 
          onClick={cleanHistory}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Cleaning..." : "Clean Hate Speech History"}
        </button>
      </div>

      {/* Users List */}
      <section className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-2">All Users ({users.length})</h2>
        <ul className="list-disc list-inside max-h-60 overflow-y-auto">
          {users.map((user) => (
            <li key={user._id} className="text-gray-700 py-1">
              {user.fullName || user.email}
            </li>
          ))}
          {users.length === 0 && <p className="text-gray-500">No users found</p>}
        </ul>
      </section>

      {/* Grouped Messages */}
      <section className="space-y-4">
        {Object.keys(groupedConversations).length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
            <p className="text-gray-500">No messages yet</p>
          </div>
        ) : (
          Object.entries(groupedConversations).map(([key, convo]) => {
            const [user1Email, user2Email] = convo.participants;
            const user1Name = getUserName(user1Email);
            const user2Name = getUserName(user2Email);
            return (
              <div key={key} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-800">
                    {user1Name} ↔ {user2Name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {convo.messages.length} messages | Latest: {new Date(convo.messages[convo.messages.length - 1]?.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="p-4 max-h-96 overflow-y-auto space-y-2">
                  {convo.messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.fromEmail === user1Email ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                        msg.fromEmail === user1Email
                          ? 'bg-blue-100 text-blue-800 rounded-br-sm'
                          : 'bg-green-100 text-green-800 rounded-bl-sm'
                      }`}>
                        <div className="text-sm font-medium">{getUserName(msg.fromEmail)}</div>
                        <div className="text-xs text-gray-500">{new Date(msg.timestamp).toLocaleTimeString()}</div>
                        <div className="mt-1">{msg.message}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
};

export default Messages;