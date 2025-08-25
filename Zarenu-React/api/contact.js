// api/contact.js - Vercel serverless function
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { firstName, lastName, email, message } = req.body

    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    // Save to Supabase
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([
        {
          first_name: firstName,
          last_name: lastName,
          email: email,
          message: message
        }
      ])

    if (error) {
      console.error('Database error:', error)
      return res.status(500).json({ message: 'Database error' })
    }

    res.status(200).json({ 
      message: 'Contact form submitted successfully',
      data: data
    })

  } catch (error) {
    console.error('Contact form error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}