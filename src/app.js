const path = require('node:path');
const express = require('express');
const {
  ALLOWED_STATUSES,
  ALLOWED_PRIORITIES,
  listTickets,
  getTicketById,
  createTicket,
  updateTicketStatus,
} = require('./ticketStore');

function createApp(options = {}) {
  const app = express();
  const dataFile = options.dataFile || path.join(process.cwd(), 'data', 'tickets.json');

  app.set('view engine', 'ejs');
  app.set('views', path.join(process.cwd(), 'views'));

  app.use(express.urlencoded({ extended: false }));
  app.use('/public', express.static(path.join(process.cwd(), 'public')));

  app.get('/', (_req, res) => {
    res.redirect('/tickets');
  });

  app.get('/tickets', (req, res) => {
    const selectedStatus = req.query.status;
    const tickets = listTickets(dataFile, selectedStatus);

    res.render('index', {
      tickets,
      statuses: ALLOWED_STATUSES,
      selectedStatus: ALLOWED_STATUSES.includes(selectedStatus) ? selectedStatus : '',
    });
  });

  app.get('/tickets/new', (_req, res) => {
    res.render('new', {
      priorities: ALLOWED_PRIORITIES,
      error: '',
      formValues: { title: '', description: '', priority: 'medium' },
    });
  });

  app.post('/tickets', (req, res) => {
    try {
      createTicket(dataFile, {
        title: req.body.title,
        description: req.body.description,
        priority: req.body.priority,
      });
      res.redirect('/tickets');
    } catch (error) {
      res.status(400).render('new', {
        priorities: ALLOWED_PRIORITIES,
        error: error.message,
        formValues: {
          title: String(req.body.title || ''),
          description: String(req.body.description || ''),
          priority: ALLOWED_PRIORITIES.includes(req.body.priority) ? req.body.priority : 'medium',
        },
      });
    }
  });

  app.get('/tickets/:id', (req, res) => {
    const ticket = getTicketById(dataFile, req.params.id);
    if (!ticket) {
      return res.status(404).send('Ticket nicht gefunden.');
    }

    return res.render('show', {
      ticket,
      statuses: ALLOWED_STATUSES,
    });
  });

  app.post('/tickets/:id/status', (req, res) => {
    try {
      const updated = updateTicketStatus(dataFile, req.params.id, req.body.status);
      if (!updated) {
        return res.status(404).send('Ticket nicht gefunden.');
      }
      return res.redirect(`/tickets/${updated.id}`);
    } catch (error) {
      return res.status(400).send(error.message);
    }
  });

  return app;
}

module.exports = { createApp };
