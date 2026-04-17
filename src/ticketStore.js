const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');

const ALLOWED_STATUSES = ['open', 'in_progress', 'done'];
const ALLOWED_PRIORITIES = ['low', 'medium', 'high'];

function ensureDataFile(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]', 'utf8');
  }
}

function loadTickets(filePath) {
  ensureDataFile(filePath);
  const raw = fs.readFileSync(filePath, 'utf8');
  const parsed = JSON.parse(raw || '[]');
  return Array.isArray(parsed) ? parsed : [];
}

function saveTickets(filePath, tickets) {
  fs.writeFileSync(filePath, JSON.stringify(tickets, null, 2), 'utf8');
}

function listTickets(filePath, status) {
  const tickets = loadTickets(filePath);
  if (!status || !ALLOWED_STATUSES.includes(status)) {
    return tickets;
  }
  return tickets.filter((ticket) => ticket.status === status);
}

function getTicketById(filePath, id) {
  return loadTickets(filePath).find((ticket) => ticket.id === id) || null;
}

function createTicket(filePath, { title, description, priority }) {
  const trimmedTitle = String(title || '').trim();
  if (!trimmedTitle) {
    throw new Error('Titel ist erforderlich.');
  }

  const normalizedPriority = ALLOWED_PRIORITIES.includes(priority) ? priority : 'medium';
  const tickets = loadTickets(filePath);

  const ticket = {
    id: randomUUID(),
    title: trimmedTitle,
    description: String(description || '').trim(),
    priority: normalizedPriority,
    status: 'open',
    createdAt: new Date().toISOString(),
  };

  tickets.unshift(ticket);
  saveTickets(filePath, tickets);
  return ticket;
}

function updateTicketStatus(filePath, id, status) {
  if (!ALLOWED_STATUSES.includes(status)) {
    throw new Error('Ungültiger Status.');
  }

  const tickets = loadTickets(filePath);
  const ticket = tickets.find((item) => item.id === id);

  if (!ticket) {
    return null;
  }

  ticket.status = status;
  ticket.updatedAt = new Date().toISOString();
  saveTickets(filePath, tickets);

  return ticket;
}

module.exports = {
  ALLOWED_STATUSES,
  ALLOWED_PRIORITIES,
  listTickets,
  getTicketById,
  createTicket,
  updateTicketStatus,
};
