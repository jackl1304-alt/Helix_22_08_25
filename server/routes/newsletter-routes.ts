import express from 'express';
import { neon } from "@neondatabase/serverless";

const router = express.Router();
const sql = neon(process.env.DATABASE_URL!);

// GET /api/newsletters - Fetch all newsletters
router.get('/', async (req, res) => {
  try {
    console.log('[Newsletter API] Fetching all newsletters from database');
    
    const newsletters = await sql`
      SELECT 
        id,
        title,
        content,
        status,
        subscriber_count,
        created_at
      FROM newsletters
      ORDER BY created_at DESC
    `;

    const formattedNewsletters = newsletters.map(newsletter => ({
      id: newsletter.id,
      subject: newsletter.title,
      content: newsletter.content || '',
      status: newsletter.status || 'draft',
      recipientCount: parseInt(newsletter.subscriber_count?.toString() || '0'),
      createdAt: newsletter.created_at
    }));

    console.log(`[Newsletter API] Returning ${formattedNewsletters.length} newsletters`);
    res.json(formattedNewsletters);

  } catch (error) {
    console.error('[Newsletter API] Error fetching newsletters:', error);
    res.status(500).json({ error: 'Failed to fetch newsletters' });
  }
});

// POST /api/newsletters - Create new newsletter
router.post('/', async (req, res) => {
  try {
    const { subject, content, status = 'draft' } = req.body;

    console.log('[Newsletter API] Creating new newsletter:', { subject, status });

    if (!subject || !content) {
      return res.status(400).json({ error: 'Subject and content are required' });
    }

    const result = await sql`
      INSERT INTO newsletters (title, content, status, created_at, updated_at)
      VALUES (${subject}, ${content}, ${status}, NOW(), NOW())
      RETURNING *
    `;

    const newNewsletter = result[0];
    
    console.log('[Newsletter API] Newsletter created successfully:', newNewsletter.id);
    
    res.status(201).json({
      id: newNewsletter.id,
      subject: newNewsletter.title,
      content: newNewsletter.content,
      status: newNewsletter.status,
      recipientCount: 0,
      createdAt: newNewsletter.created_at
    });

  } catch (error) {
    console.error('[Newsletter API] Error creating newsletter:', error);
    res.status(500).json({ error: 'Failed to create newsletter' });
  }
});

// PUT /api/newsletters/:id - Update newsletter
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, content, status } = req.body;

    console.log('[Newsletter API] Updating newsletter:', id);

    const result = await sql`
      UPDATE newsletters 
      SET title = ${subject}, content = ${content}, status = ${status}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Newsletter not found' });
    }

    const updatedNewsletter = result[0];
    
    res.json({
      id: updatedNewsletter.id,
      subject: updatedNewsletter.title,
      content: updatedNewsletter.content,
      status: updatedNewsletter.status,
      recipientCount: 0,
      createdAt: updatedNewsletter.created_at
    });

  } catch (error) {
    console.error('[Newsletter API] Error updating newsletter:', error);
    res.status(500).json({ error: 'Failed to update newsletter' });
  }
});

// DELETE /api/newsletters/:id - Delete newsletter
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    console.log('[Newsletter API] Deleting newsletter:', id);

    const result = await sql`DELETE FROM newsletters WHERE id = ${id} RETURNING id`;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Newsletter not found' });
    }

    res.json({ success: true, message: 'Newsletter deleted successfully' });

  } catch (error) {
    console.error('[Newsletter API] Error deleting newsletter:', error);
    res.status(500).json({ error: 'Failed to delete newsletter' });
  }
});

// GET /api/newsletters/subscribers - Get all subscribers
router.get('/subscribers', async (req, res) => {
  try {
    console.log('[Newsletter API] Fetching all subscribers');
    
    const subscribers = await sql`
      SELECT id, email, name, is_active, created_at
      FROM subscribers
      ORDER BY created_at DESC
    `;

    console.log(`[Newsletter API] Returning ${subscribers.length} subscribers`);
    res.json(subscribers);

  } catch (error) {
    console.error('[Newsletter API] Error fetching subscribers:', error);
    res.status(500).json({ error: 'Failed to fetch subscribers' });
  }
});

export default router;