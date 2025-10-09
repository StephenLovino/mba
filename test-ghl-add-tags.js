// Test script to debug GHL Add Tags API
// Run with: node test-ghl-add-tags.js

require('dotenv').config({ path: '.env.local' });

const GHL_TOKEN = process.env.GHL_TOKEN;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;
const API_BASE = 'https://services.leadconnectorhq.com';

// Test with one of the participant emails from your screenshot
const TEST_EMAIL = 'stephen.ben19@gmail.com'; // Change this to one of your participant emails

const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': `Bearer ${GHL_TOKEN}`,
  'Version': '2021-07-28'
};

async function testGHLAddTags() {
  console.log('=== Testing GHL Add Tags API ===\n');
  console.log('Configuration:');
  console.log('- API Base:', API_BASE);
  console.log('- Location ID:', GHL_LOCATION_ID);
  console.log('- Token:', GHL_TOKEN ? `${GHL_TOKEN.substring(0, 20)}...` : 'MISSING');
  console.log('- Test Email:', TEST_EMAIL);
  console.log('\n');

  try {
    // Step 1: Search for the contact
    console.log('Step 1: Searching for contact...');
    const searchUrl = `${API_BASE}/contacts/search/duplicate?locationId=${GHL_LOCATION_ID}&email=${encodeURIComponent(TEST_EMAIL)}`;
    console.log('Search URL:', searchUrl);
    
    const searchRes = await fetch(searchUrl, {
      method: 'GET',
      headers
    });

    console.log('Search Response Status:', searchRes.status, searchRes.statusText);
    
    if (!searchRes.ok) {
      const errorText = await searchRes.text();
      console.error('Search Error Response:', errorText);
      return;
    }

    const searchData = await searchRes.json();
    console.log('Search Response:', JSON.stringify(searchData, null, 2));
    
    const contact = searchData?.contact;
    
    if (!contact) {
      console.error('\n❌ Contact not found!');
      console.log('Response structure:', Object.keys(searchData));
      return;
    }

    console.log('\n✅ Contact found!');
    console.log('- Contact ID:', contact.id);
    console.log('- Email:', contact.email);
    console.log('- Current Tags:', contact.tags || []);
    console.log('\n');

    // Step 2: Add the 'participants-paid' tag
    console.log('Step 2: Adding "participants-paid" tag...');
    const addTagsUrl = `${API_BASE}/contacts/${contact.id}/tags`;
    console.log('Add Tags URL:', addTagsUrl);
    
    const addTagsPayload = {
      tags: ['participants-paid']
    };
    console.log('Payload:', JSON.stringify(addTagsPayload, null, 2));

    const addTagsRes = await fetch(addTagsUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(addTagsPayload)
    });

    console.log('Add Tags Response Status:', addTagsRes.status, addTagsRes.statusText);
    
    if (!addTagsRes.ok) {
      const errorText = await addTagsRes.text();
      console.error('Add Tags Error Response:', errorText);
      return;
    }

    const addTagsData = await addTagsRes.json();
    console.log('Add Tags Response:', JSON.stringify(addTagsData, null, 2));
    
    console.log('\n✅ Tag added successfully!');
    
    // Step 3: Verify the tag was added
    console.log('\nStep 3: Verifying tag was added...');
    const verifyRes = await fetch(searchUrl, {
      method: 'GET',
      headers
    });

    if (verifyRes.ok) {
      const verifyData = await verifyRes.json();
      const updatedContact = verifyData?.contact;
      console.log('Updated Tags:', updatedContact?.tags || []);
      
      if (updatedContact?.tags?.includes('participants-paid')) {
        console.log('\n🎉 SUCCESS! The "participants-paid" tag is now on the contact!');
      } else {
        console.log('\n⚠️ WARNING: Tag was added but not showing up yet. May need to wait a moment.');
      }
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run the test
testGHLAddTags();

