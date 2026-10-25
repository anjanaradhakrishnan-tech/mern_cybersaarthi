import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'https://cybersaarthi-server.onrender.com/api';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const [urlInput, setUrlInput] = useState('');
  const [urlResult, setUrlResult] = useState('');
  
  const [msgInput, setMsgInput] = useState('');
  const [msgResult, setMsgResult] = useState('');
  
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (token) fetchHistory();
  }, [token]);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const res = await axios.post(`${API}/auth/login`, { email, password });
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
      } else {
        await axios.post(`${API}/auth/register`, { name, email, password });
        alert('Registration successful! Please login.');
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Authentication error');
    }
  };

  const checkUrl = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/check/url`, { url: urlInput }, { headers: { Authorization: token } });
      setUrlResult(res.data.resultStatus);
      fetchHistory();
    } catch (err) { alert('Error checking URL'); }
  };

  const checkMessage = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/check/message`, { message: msgInput }, { headers: { Authorization: token } });
      setMsgResult(res.data.resultStatus);
      fetchHistory();
    } catch (err) { alert('Error checking message'); }
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API}/check/history`, { headers: { Authorization: token } });
      setHistory(res.data);
    } catch (err) { console.error(err); }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
  };

  if (!token) {
    return (
      <div style={{ padding: '40px', maxWidth: '400px', margin: 'auto', fontFamily: 'Arial' }}>
        <h2>CyberSaarthi - {isLogin ? 'Login' : 'Register'}</h2>
        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {!isLogin && <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required style={{padding:'8px'}} />}
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{padding:'8px'}} />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={{padding:'8px'}} />
          <button type="submit" style={{padding:'10px', background:'#007bff', color:'#fff', border:'none'}}>{isLogin ? 'Login' : 'Register'}</button>
        </form>
        <p onClick={() => setIsLogin(!isLogin)} style={{color:'blue', cursor:'pointer', marginTop:'15px'}}>
          {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', maxWidth: '800px', margin: 'auto', fontFamily: 'Arial' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <h1>🛡️ CyberSaarthi Dashboard</h1>
        <button onClick={logout} style={{padding:'8px 15px', background:'#dc3545', color:'#fff', border:'none'}}>Logout</button>
      </div>
      <hr />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
        {/* URL Checker */}
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius:'8px' }}>
          <h3>🔗 URL / Link Phishing Checker</h3>
          <form onSubmit={checkUrl}>
            <input type="text" placeholder="Paste link (e.g., http://...)" value={urlInput} onChange={e => setUrlInput(e.target.value)} required style={{width:'100%', padding:'8px', marginBottom:'10px'}} />
            <button type="submit" style={{padding:'8px 15px', background:'#28a745', color:'#fff', border:'none'}}>Check Link</button>
          </form>
          {urlResult && <p style={{marginTop:'10px', fontWeight:'bold', color: urlResult.includes('Safe') ? 'green' : 'red'}}>Result: {urlResult}</p>}
        </div>

        {/* Message Checker */}
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius:'8px' }}>
          <h3>💬 SMS / Text Scam Checker</h3>
          <form onSubmit={checkMessage}>
            <textarea placeholder="Paste suspicious message text..." value={msgInput} onChange={e => setMsgInput(e.target.value)} required style={{width:'100%', padding:'8px', marginBottom:'10px', height:'50px'}} />
            <button type="submit" style={{padding:'8px 15px', background:'#28a745', color:'#fff', border:'none'}}>Check Message</button>
          </form>
          {msgResult && <p style={{marginTop:'10px', fontWeight:'bold', color: msgResult.includes('Safe') ? 'green' : 'red'}}>Result: {msgResult}</p>}
        </div>
      </div>

      {/* History Log */}
      <div style={{ marginTop: '30px' }}>
        <h3>📜 Your Past Safety Checks</h3>
        <ul style={{ background:'#f9f9f9', padding:'15px', borderRadius:'8px', listStyle:'none' }}>
          {history.length === 0 ? <p>No history yet.</p> : history.map(item => (
            <li key={item._id} style={{ borderBottom:'1px solid #ddd', padding:'8px 0' }}>
              <b>[{item.checkType.toUpperCase()}]</b> {item.inputContent} — <span style={{color: item.resultStatus.includes('Safe') ? 'green' : 'red'}}>{item.resultStatus}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}