import React, { useEffect, useMemo, useState } from 'react';
import {
  Container, Typography, Box, Tabs, Tab, Paper,
  Grid, Button, Chip, CircularProgress, Alert,
  Card, CardContent, IconButton, Divider, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  People as PeopleIcon,
  Book as BookIcon,
  AutoAwesome as AutoAwesomeIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../lib/api';

const RESOURCES = {
  users: [
    { method: 'GET', route: '/api/users', description: 'List users' },
    { method: 'GET', route: '/api/users/:id', description: 'Get user by id' },
    { method: 'POST', route: '/api/users', description: 'Create user' },
    { method: 'PUT', route: '/api/users/:id', description: 'Update user' },
    { method: 'DELETE', route: '/api/users/:id', description: 'Delete user' },
    { method: 'GET', route: '/api/messages/inbox', description: 'Get inbox messages' },
    { method: 'GET', route: '/api/messages/sent', description: 'Get sent messages' },
    { method: 'POST', route: '/api/messages', description: 'Send a message' },
    { method: 'POST', route: '/api/messages/:id/read', description: 'Mark message as read' },
    { method: 'GET', route: '/api/analytics/overview', description: 'Get analytics overview' },
    { method: 'GET', route: '/api/analytics/activity', description: 'Get activity over time' },
  ],
  books: [
    { method: 'GET', route: '/api/books', description: 'List books' },
    { method: 'GET', route: '/api/books/:id', description: 'Get book by id' },
    { method: 'POST', route: '/api/books', description: 'Create book' },
    { method: 'PUT', route: '/api/books/:id', description: 'Update book' },
    { method: 'DELETE', route: '/api/books/:id', description: 'Delete book' },
    { method: 'POST', route: '/api/mocks/generate', description: 'Generate mock for book endpoint' },
    { method: 'GET', route: '/api/mocks/one', description: 'Get one mock for book endpoint' },
  ],
};

export default function MuiDashboard() {
  const [tab, setTab] = useState(0);
  const [resource, setResource] = useState('users');
  const endpoints = useMemo(() => RESOURCES[resource], [resource]);
  const [selected, setSelected] = useState(endpoints[0]);
  const [liveJson, setLiveJson] = useState('');
  const [mockJson, setMockJson] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openCreate, setOpenCreate] = useState(false);
  const [form, setForm] = useState({ title: '', author: '', isbn: '' });
  const [pathId, setPathId] = useState('');
  const [requestBody, setRequestBody] = useState('');
  const [openViewer, setOpenViewer] = useState(false);
  const [openMessages, setOpenMessages] = useState(false);
  const [inbox, setInbox] = useState([]);
  const [sent, setSent] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [composeTo, setComposeTo] = useState('');
  const [composeText, setComposeText] = useState('');
  const [backendOk, setBackendOk] = useState(true);

  useEffect(() => { setSelected(endpoints[0]); }, [endpoints]);

  useEffect(() => {
    (async () => {
      try {
        await api.get('/api/health');
        setBackendOk(true);
      } catch (e) {
        setBackendOk(false);
      }
    })();
  }, []);

  function buildUrlWithParams(template) {
    if (template.includes(':id') && pathId) return template.replace(':id', pathId);
    return template;
  }

  async function fetchLive() {
    setLoading(true); setError('');
    try {
      const url = buildUrlWithParams(selected.route);
      const config = { method: selected.method, url, headers: { 'X-Use-Mock': 'false' } };
      if (['POST', 'PUT', 'PATCH'].includes(selected.method) && requestBody) {
        config.data = JSON.parse(requestBody);
      }
      const res = await api.request(config);
      setLiveJson(JSON.stringify(res.data, null, 2));
    } catch (e) {
      const msg = e?.response?.data || { message: e.message };
      setLiveJson(JSON.stringify(msg, null, 2));
    } finally { setLoading(false); }
  }

  async function fetchMock() {
    try {
      const url = buildUrlWithParams(selected.route);
      const res = await api.get('/api/mocks/one', { params: { method: selected.method, route: url } });
      setMockJson(JSON.stringify(res.data.response, null, 2));
    } catch (e) {
      const msg = e?.response?.data || { message: e.message };
      setMockJson(JSON.stringify(msg, null, 2));
    }
  }

  async function generateMock() {
    try {
      const url = buildUrlWithParams(selected.route);
      await api.post('/api/mocks/generate', { controller: resource, method: selected.method, route: url, label: `${resource} ${selected.method} ${url} mock` });
      toast.success('Mock generated. Enable Use Mock to serve it.');
      await fetchMock();
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to generate mock');
    }
  }

  useEffect(() => {
    if (selected) { fetchLive(); fetchMock(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
        Smart MockData Dashboard
      </Typography>

      {!backendOk && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Backend not reachable. Start MongoDB and backend (http://localhost:5000). Then refresh.
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 2 }}>
        <Grid item xs={12} md={4}>
          <Card><CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box>
              <Typography color="text.secondary">Users endpoint</Typography>
              <Typography variant="h5">GET /api/users</Typography>
            </Box>
            <PeopleIcon color="primary" />
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card><CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box>
              <Typography color="text.secondary">Books endpoints</Typography>
              <Typography variant="h5">GET/POST /api/books</Typography>
            </Box>
            <BookIcon color="secondary" />
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card><CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box>
              <Typography color="text.secondary">Mocks</Typography>
              <Typography variant="h5">AI generator</Typography>
            </Box>
            <AutoAwesomeIcon color="info" />
          </CardContent></Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label="Users" icon={<PeopleIcon />} iconPosition="start" onClick={() => setResource('users')} />
          <Tab label="Books" icon={<BookIcon />} iconPosition="start" onClick={() => setResource('books')} />
        </Tabs>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {endpoints.map((e) => (
            <Chip
              key={e.method+e.route}
              label={`${e.method} ${e.route}`}
              color={selected.method===e.method && selected.route===e.route ? 'primary' : 'default'}
              onClick={() => setSelected(e)}
            />
          ))}
        </Box>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6">Endpoints</Typography>
          <Button
            variant="outlined"
            onClick={async () => {
              try {
                const [inb, snt, users] = await Promise.all([
                  api.get('/api/messages/inbox'),
                  api.get('/api/messages/sent'),
                  api.get('/api/users'),
                ]);
                setInbox(inb.data);
                setSent(snt.data);
                setUsersList(users.data);
                setOpenMessages(true);
              } catch (e) {
                toast.error('Failed to load messages');
              }
            }}
          >
            Messages
          </Button>
        </Box>
        <Grid container spacing={1}>
          {endpoints.map((e) => (
            <Grid item xs={12} md={6} key={e.method+e.route}>
              <Paper sx={{ p: 1.5 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Chip size="small" label={e.method} color={['GET'].includes(e.method) ? 'success' : ['POST'].includes(e.method) ? 'primary' : ['PUT','PATCH'].includes(e.method) ? 'warning' : 'error'} sx={{ mr: 1 }} />
                    <Typography component="span" fontFamily="monospace">{e.route}</Typography>
                    <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>{e.description}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button size="small" variant="outlined" onClick={() => { setSelected(e); setOpenViewer(true); setPathId(''); setRequestBody(''); setLiveJson(''); setMockJson(''); }}>
                      View
                    </Button>
                    <Button size="small" variant="contained" startIcon={<AutoAwesomeIcon />} onClick={async () => { setSelected(e); await generateMock(); }}>
                      Generate
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
        <Alert severity="info" sx={{ mt: 2 }}>
          Tip: Use the Messages button to coordinate with teammates. Toggle "Use Mock" in the top-right to serve generated mocks.
        </Alert>
      </Paper>

      {/* Simple create dialog for POST /api/books */}
      {resource === 'books' && selected.method === 'POST' && (
        <Box mt={2}>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenCreate(true)}>
            Open Create Book Form
          </Button>
        </Box>
      )}

      <Dialog open={openViewer} onClose={() => setOpenViewer(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selected?.method} {selected?.route}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
            {selected?.route?.includes(':id') && (
              <TextField label="Path param: id" size="small" value={pathId} onChange={(e) => setPathId(e.target.value)} />
            )}
            {['POST','PUT','PATCH'].includes(selected?.method) && (
              <TextField
                label="Body JSON"
                size="small"
                fullWidth
                multiline
                minRows={3}
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                placeholder={"{\n  \"title\": \"...\",\n  \"author\": \"...\",\n  \"isbn\": \"...\"\n}"}
              />
            )}
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                <Typography variant="subtitle1">Live JSON</Typography>
                <IconButton onClick={fetchLive}><RefreshIcon /></IconButton>
              </Box>
              {loading ? (
                <Box display="flex" justifyContent="center" py={2}><CircularProgress size={20} /></Box>
              ) : error ? (
                <Alert severity="error">{error}</Alert>
              ) : (
                <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{liveJson || 'No data'}</pre>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                <Typography variant="subtitle1">Mock JSON</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button size="small" variant="outlined" onClick={fetchMock}>Fetch mock</Button>
                  <Button size="small" variant="contained" startIcon={<AutoAwesomeIcon />} onClick={generateMock}>Generate</Button>
                </Box>
              </Box>
              <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{mockJson || 'No mock yet'}</pre>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewer(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openMessages} onClose={() => setOpenMessages(false)} maxWidth="md" fullWidth>
        <DialogTitle>Team Messages</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1">Inbox</Typography>
              <Box sx={{ maxHeight: 220, overflow: 'auto' }}>
                {inbox.map((m) => (
                  <Paper key={m._id} sx={{ p: 1, mb: 1 }}>
                    <Typography variant="caption">From: {m.from?.name} ({m.from?.role})</Typography>
                    <Typography>{m.text}</Typography>
                  </Paper>
                ))}
                {inbox.length === 0 && <Typography variant="body2">No messages</Typography>}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1">Sent</Typography>
              <Box sx={{ maxHeight: 220, overflow: 'auto' }}>
                {sent.map((m) => (
                  <Paper key={m._id} sx={{ p: 1, mb: 1 }}>
                    <Typography variant="caption">To: {m.to?.name} ({m.to?.role})</Typography>
                    <Typography>{m.text}</Typography>
                  </Paper>
                ))}
                {sent.length === 0 && <Typography variant="body2">No sent messages</Typography>}
              </Box>
            </Grid>
          </Grid>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" sx={{ mb: 1 }}>Compose</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>To</InputLabel>
              <Select label="To" value={composeTo} onChange={(e) => setComposeTo(e.target.value)}>
                {usersList.map((u) => (
                  <MenuItem key={u._id} value={u._id}>{u.name} ({u.role})</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField size="small" fullWidth label="Message" value={composeText} onChange={(e) => setComposeText(e.target.value)} />
            <Button
              variant="contained"
              onClick={async () => {
                try {
                  if (!composeTo || !composeText) return toast.error('Choose recipient and enter text');
                  await api.post('/api/messages', { to: composeTo, text: composeText });
                  setComposeText('');
                  const snt = await api.get('/api/messages/sent');
                  setSent(snt.data);
                  toast.success('Message sent');
                } catch (e) {
                  toast.error('Send failed');
                }
              }}
            >
              Send
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMessages(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openCreate} onClose={() => setOpenCreate(false)}>
        <DialogTitle>
          Create Book
          <IconButton onClick={() => setOpenCreate(false)} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField label="Title" fullWidth margin="dense" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <TextField label="Author" fullWidth margin="dense" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
          <TextField label="ISBN" fullWidth margin="dense" value={form.isbn} onChange={(e) => setForm({ ...form, isbn: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
          <Button onClick={async () => { await api.post('/api/books', form); setOpenCreate(false); fetchLive(); }}>Create</Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
}


