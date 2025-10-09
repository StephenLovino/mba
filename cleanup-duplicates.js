// Script to find and report duplicate contacts in GHL
// Run with: node cleanup-duplicates.js

require('dotenv').config({ path: '.env.local' });

const GHL_TOKEN = process.env.GHL_TOKEN;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;
const API_BASE = 'https://services.leadconnectorhq.com';

const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': `Bearer ${GHL_TOKEN}`,
  'Version': '2021-07-28'
};

async function findDuplicates() {
  console.log('=== Finding Duplicate Contacts ===\n');
  
  try {
    // Get all contacts
    console.log('Fetching all contacts...');
    const contactsUrl = `${API_BASE}/contacts/?locationId=${GHL_LOCATION_ID}&limit=100`;
    
    const response = await fetch(contactsUrl, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      console.error('Failed to fetch contacts:', await response.text());
      return;
    }

    const data = await response.json();
    const contacts = data.contacts || [];
    
    console.log(`Found ${contacts.length} contacts\n`);

    // Group by email
    const emailMap = {};
    
    for (const contact of contacts) {
      const email = contact.email?.toLowerCase();
      if (!email) continue;
      
      if (!emailMap[email]) {
        emailMap[email] = [];
      }
      emailMap[email].push(contact);
    }

    // Find duplicates
    const duplicates = Object.entries(emailMap).filter(([email, contacts]) => contacts.length > 1);
    
    if (duplicates.length === 0) {
      console.log('✅ No duplicates found!');
      return;
    }

    console.log(`⚠️ Found ${duplicates.length} duplicate emails:\n`);

    for (const [email, contacts] of duplicates) {
      console.log(`\n📧 ${email} (${contacts.length} contacts):`);
      
      for (const contact of contacts) {
        console.log(`  - ID: ${contact.id}`);
        console.log(`    Name: ${contact.firstName || ''} ${contact.lastName || ''}`);
        console.log(`    Tags: ${(contact.tags || []).join(', ')}`);
        console.log(`    Created: ${contact.dateAdded}`);
        console.log(`    Source: ${contact.source || 'unknown'}`);
      }
    }

    console.log('\n\n=== Recommendations ===\n');
    console.log('For each duplicate email:');
    console.log('1. Identify which contact has the most complete information');
    console.log('2. Merge tags from all duplicates into the primary contact');
    console.log('3. Delete the duplicate contacts');
    console.log('\nYou can do this manually in GHL or use the GHL API to automate it.');
    console.log('\n⚠️ IMPORTANT: The new code will prevent future duplicates by using');
    console.log('   "Search + Add Tags" instead of "Upsert"');

  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the script
findDuplicates();

