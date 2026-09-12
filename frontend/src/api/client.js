const API_BASE = '/api';

export function getAuthToken() {
  return localStorage.getItem('grandpulse_token');
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('grandpulse_token', token);
  } else {
    localStorage.removeItem('grandpulse_token');
  }
}

async function request(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorDetail = 'API Request Failed';
    try {
      const data = await response.json();
      errorDetail = data.detail || JSON.stringify(data);
    } catch {
      errorDetail = response.statusText;
    }
    throw new Error(errorDetail);
  }

  // If response is empty or 204
  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  // Auth
  login: (username, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  register: (payload) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getMe: () => request('/auth/me'),

  // Members
  getMembers: (category = 'ALL', sortBy = 'score') =>
    request(`/members?category=${encodeURIComponent(category)}&sort_by=${encodeURIComponent(sortBy)}`),
  getMemberDossier: (memberId) => request(`/members/${memberId}`),
  createMember: (memberData) =>
    request('/members', {
      method: 'POST',
      body: JSON.stringify(memberData),
    }),
  updateMember: (memberId, memberData) =>
    request(`/members/${memberId}`, {
      method: 'PUT',
      body: JSON.stringify(memberData),
    }),
  deleteMember: (memberId) =>
    request(`/members/${memberId}`, {
      method: 'DELETE',
    }),

  // Tasks
  getTasks: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/tasks${query ? `?${query}` : ''}`);
  },
  createTask: (taskData) =>
    request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    }),
  updateTaskStatus: (taskId, status) =>
    request(`/tasks/${taskId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  updateTask: (taskId, taskData) =>
    request(`/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    }),
  deleteTask: (taskId) =>
    request(`/tasks/${taskId}`, {
      method: 'DELETE',
    }),

  // Contributions
  getContributions: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/contributions${query ? `?${query}` : ''}`);
  },
  createContribution: (contribData) =>
    request('/contributions', {
      method: 'POST',
      body: JSON.stringify(contribData),
    }),
  updateContribution: (contribId, contribData) =>
    request(`/contributions/${contribId}`, {
      method: 'PUT',
      body: JSON.stringify(contribData),
    }),
  deleteContribution: (contribId) =>
    request(`/contributions/${contribId}`, {
      method: 'DELETE',
    }),

  // Analytics
  getSummaryAnalytics: () => request('/analytics/summary'),
  getWeeklyVelocity: (memberId = 'shuvo') =>
    request(`/analytics/weekly-velocity?member_id=${encodeURIComponent(memberId)}`),
  getCategoryDistribution: (memberId = 'ALL') =>
    request(`/analytics/category-distribution?member_id=${encodeURIComponent(memberId)}`),

  // Gantt Chart & Schedule (PDF Spec)
  getGanttTasks: (phase = 'ALL') =>
    request(`/gantt/tasks${phase && phase !== 'ALL' ? `?phase=${encodeURIComponent(phase)}` : ''}`),
  getMilestones: () => request('/gantt/milestones'),
  getProjectModules: () => request('/gantt/modules'),
  updateTaskProgress: (taskId, progressPct, status = null, assigneeId = null) =>
    request(`/gantt/tasks/${taskId}/progress`, {
      method: 'PATCH',
      body: JSON.stringify({ progress_pct: progressPct, status, assignee_id: assigneeId }),
    }),
  getGanttSummary: () => request('/gantt/summary'),

  // Export URLs
  getExcelExportUrl: () => `${API_BASE}/export/excel`,
  getCsvExportUrl: () => `${API_BASE}/export/csv`,
};
