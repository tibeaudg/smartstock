import { createClient } from '@supabase/supabase-js';

export default async function captureLeadHandler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ ok: false, error: 'Method not allowed' });
      return;
    }

    const { email, source, metadata } = req.body || {};
    
    if (!email || !source) {
      res.status(400).json({ ok: false, error: 'Missing required fields: email and source' });
      return;
    }

    // Input validation and sanitization
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ ok: false, error: 'Invalid email format' });
      return;
    }

    // Sanitize inputs
    const sanitize = (str) => String(str).replace(/[<>]/g, '').trim();
    const safeEmail = sanitize(email).substring(0, 255);
    const safeSource = sanitize(source).substring(0, 100);

    // Initialize Supabase client
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase credentials not configured');
      res.status(500).json({ ok: false, error: 'Server configuration error' });
      return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Insert lead into database
    const { data, error: insertError } = await supabase
      .from('leads')
      .insert([
        {
          email: safeEmail,
          source: safeSource,
          metadata: metadata || {},
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting lead:', insertError);
      // Don't fail if it's a duplicate - still return success for better UX
      if (insertError.code === '23505') { // Unique constraint violation
        res.status(200).json({ 
          ok: true, 
          message: 'Lead captured successfully',
          duplicate: true
        });
        return;
      }
      res.status(500).json({ ok: false, error: 'Failed to capture lead' });
      return;
    }

    res.status(200).json({ 
      ok: true, 
      message: 'Lead captured successfully',
      data: data
    });

  } catch (error) {
    console.error('Error in capture-lead:', error);
    res.status(500).json({ 
      ok: false, 
      error: error.message || 'Internal server error' 
    });
  }
}





