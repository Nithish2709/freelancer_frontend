const BASE = "https://freelancer-backend-xp3g.onrender.com/api"

const headers = (token, json = true) => ({
    ...(json && { 'Content-Type': 'application/json' }),
    ...(token && { Authorization: `Bearer ${token}` }),
});

const handle = async (res) => {
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data;
};

// ── Auth ──────────────────────────────────────────────────────────────────────
export const loginUser     = (body)        => fetch(`${BASE}/auth/login`,    { method: 'POST', headers: headers(null), body: JSON.stringify(body) }).then(handle);
export const registerUser  = (body)        => fetch(`${BASE}/auth/register`, { method: 'POST', headers: headers(null), body: JSON.stringify(body) }).then(handle);

// ── Users ─────────────────────────────────────────────────────────────────────
export const getProfile       = (token)        => fetch(`${BASE}/users/profile`,       { headers: headers(token, false) }).then(handle);
export const updateProfile    = (token, body)  => fetch(`${BASE}/users/profile`,       { method: 'PUT', headers: headers(token), body: JSON.stringify(body) }).then(handle);
export const getFreelancers   = ()             => fetch(`${BASE}/users/freelancers`).then(handle);
export const getUserById      = (id)           => fetch(`${BASE}/users/${id}`).then(handle);

// ── Projects ──────────────────────────────────────────────────────────────────
export const getProjects      = (token)              => fetch(`${BASE}/projects`, { headers: headers(token, false) }).then(handle);
export const createProject    = (token, body)        => fetch(`${BASE}/projects`, { method: 'POST', headers: headers(token), body: JSON.stringify(body) }).then(handle);
export const getProjectById   = (id)                 => fetch(`${BASE}/projects/${encodeURIComponent(id)}`).then(handle);
export const updateProjectStatus = (token, id, status) => fetch(`${BASE}/projects/${id}/status`, { method: 'PATCH', headers: headers(token), body: JSON.stringify({ status }) }).then(handle);
export const submitProposal   = (token, id, body)    => fetch(`${BASE}/projects/${id}/proposals`, { method: 'POST', headers: headers(token), body: JSON.stringify(body) }).then(handle);
export const acceptProposal   = (token, id, propId)  => fetch(`${BASE}/projects/${encodeURIComponent(id)}/proposals/${encodeURIComponent(propId)}/accept`, { method: 'PUT', headers: headers(token, false) }).then(handle);
export const assignProject    = (token, id, body)    => fetch(`${BASE}/projects/${encodeURIComponent(id)}/assign`, { method: 'PUT', headers: headers(token), body: JSON.stringify(body) }).then(handle);

// ── Messages ──────────────────────────────────────────────────────────────────
export const getInbox         = (token)        => fetch(`${BASE}/messages`,      { headers: headers(token, false) }).then(handle);
export const getConversation  = (token, uid)   => fetch(`${BASE}/messages/${uid}`, { headers: headers(token, false) }).then(handle);
export const sendMessage      = (token, uid, body) => fetch(`${BASE}/messages/${uid}`, { method: 'POST', headers: headers(token), body: JSON.stringify(body) }).then(handle);
