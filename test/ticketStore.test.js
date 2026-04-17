const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const {
  createTicket,
  listTickets,
  updateTicketStatus,
  getTicketById,
} = require('../src/ticketStore');

function createTempDataFile() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ticket-store-test-'));
  const file = path.join(dir, 'tickets.json');
  fs.writeFileSync(file, '[]', 'utf8');
  return file;
}

test('createTicket erstellt ein Ticket mit Defaults', () => {
  const file = createTempDataFile();

  const created = createTicket(file, {
    title: 'Login funktioniert nicht',
    description: 'Beim Klick auf Login passiert nichts.',
    priority: 'high',
  });

  assert.equal(created.status, 'open');
  assert.equal(created.priority, 'high');
  const all = listTickets(file);
  assert.equal(all.length, 1);
});

test('listTickets filtert nach Status', () => {
  const file = createTempDataFile();

  const first = createTicket(file, { title: 'A', description: '', priority: 'medium' });
  createTicket(file, { title: 'B', description: '', priority: 'medium' });
  updateTicketStatus(file, first.id, 'done');

  const done = listTickets(file, 'done');
  assert.equal(done.length, 1);
  assert.equal(done[0].status, 'done');
});

test('updateTicketStatus aktualisiert den Status', () => {
  const file = createTempDataFile();
  const created = createTicket(file, { title: 'Ticket', description: '', priority: 'low' });

  const updated = updateTicketStatus(file, created.id, 'in_progress');

  assert.equal(updated.status, 'in_progress');
  const fetched = getTicketById(file, created.id);
  assert.equal(fetched.status, 'in_progress');
});
