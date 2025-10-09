// Comprehensive diagnostic script to find why participants aren't getting tagged
// Run with: node diagnose-participant-issue.js

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

// Test with emails from your screenshot
const TEST_PARTICIPANTS = [
  'stephenjj.lovino@gmail.com',
  'yurakusu@gmail.com',
  'rakusu17@gmail.com',
  'stephenkiri7@gmail.com'
];

async function diagnose() {
  console.log('=== Diagnosing Participant Tagging Issue ===\n');
  console.log('Configuration:');
  console.log('- Location ID:', GHL_LOCATION_ID);
  console.log('- Token:', GHL_TOKEN ? 'Present ✅' : 'Missing ❌');
  console.log('\n');

  let issuesFound = [];
  let successCount = 0;

  for (const email of TEST_PARTICIPANTS) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Testing: ${email}`);
    console.log('='.repeat(60));

    try {
      // Step 1: Search for contact
      console.log('\n1️⃣ Searching for contact...');
      const searchUrl = `${API_BASE}/contacts/search/duplicate?locationId=${GHL_LOCATION_ID}&email=${encodeURIComponent(email)}`;
      
      const searchRes = await fetch(searchUrl, {
        method: 'GET',
        headers
      });

      if (!searchRes.ok) {
        const errorText = await searchRes.text();
        console.log(`   ❌ Search failed: ${searchRes.status} ${searchRes.statusText}`);
        console.log(`   Error: ${errorText}`);
        issuesFound.push(`${email}: Search failed - ${errorText}`);
        continue;
      }

      const searchData = await searchRes.json();
      const contact = searchData?.contact;

      if (!contact) {
        console.log(`   ❌ Contact not found in GHL`);
        issuesFound.push(`${email}: Contact not found - needs to be created first`);
        continue;
      }

      console.log(`   ✅ Contact found!`);
      console.log(`   - ID: ${contact.id}`);
      console.log(`   - Name: ${contact.firstName || ''} ${contact.lastName || ''}`);
      console.log(`   - Current Tags: ${(contact.tags || []).join(', ') || 'none'}`);

      // Step 2: Check if already has participants-paid tag
      if (contact.tags && contact.tags.includes('participants-paid')) {
        console.log(`   ✅ Already has 'participants-paid' tag!`);
        successCount++;
        continue;
      }

      // Step 3: Try to add participants-paid tag
      console.log('\n2️⃣ Adding "participants-paid" tag...');
      const addTagsUrl = `${API_BASE}/contacts/${contact.id}/tags`;
      
      const addTagsRes = await fetch(addTagsUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          tags: ['participants-paid']
        })
      });

      if (!addTagsRes.ok) {
        const errorText = await addTagsRes.text();
        console.log(`   ❌ Failed to add tag: ${addTagsRes.status} ${addTagsRes.statusText}`);
        console.log(`   Error: ${errorText}`);
        issuesFound.push(`${email}: Failed to add tag - ${errorText}`);
        continue;
      }

      const addTagsData = await addTagsRes.json();
      console.log(`   ✅ Tag added successfully!`);
      console.log(`   - Tags added: ${(addTagsData.tagsAdded || []).join(', ')}`);
      console.log(`   - All tags now: ${(addTagsData.tags || []).join(', ')}`);

      // Step 4: Verify tag was added
      console.log('\n3️⃣ Verifying tag...');
      const verifyRes = await fetch(searchUrl, {
        method: 'GET',
        headers
      });

      if (verifyRes.ok) {
        const verifyData = await verifyRes.json();
        const updatedContact = verifyData?.contact;
        
        if (updatedContact?.tags?.includes('participants-paid')) {
          console.log(`   ✅ Verified! Tag is now on the contact.`);
          successCount++;
        } else {
          console.log(`   ⚠️ Tag was added but not showing yet (may need a moment)`);
          issuesFound.push(`${email}: Tag added but not verified immediately`);
        }
      }

    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      issuesFound.push(`${email}: Exception - ${error.message}`);
    }
  }

  // Summary
  console.log('\n\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));
  console.log(`\nTested: ${TEST_PARTICIPANTS.length} participants`);
  console.log(`Success: ${successCount} ✅`);
  console.log(`Issues: ${issuesFound.length} ❌`);

  if (issuesFound.length > 0) {
    console.log('\n\nIssues Found:');
    issuesFound.forEach((issue, i) => {
      console.log(`${i + 1}. ${issue}`);
    });
  }

  if (successCount === TEST_PARTICIPANTS.length) {
    console.log('\n\n🎉 SUCCESS! All participants now have the "participants-paid" tag!');
    console.log('\nNext steps:');
    console.log('1. Check GHL to verify the tags are visible');
    console.log('2. Check if your workflows are now triggering');
    console.log('3. If workflows still not triggering, check workflow configuration');
  } else if (successCount > 0) {
    console.log('\n\n⚠️ PARTIAL SUCCESS - Some participants were tagged, but not all.');
    console.log('\nNext steps:');
    console.log('1. Review the issues above');
    console.log('2. Fix any contacts that are missing or have errors');
    console.log('3. Re-run this script to tag the remaining participants');
  } else {
    console.log('\n\n❌ NO SUCCESS - None of the participants were tagged.');
    console.log('\nPossible causes:');
    console.log('1. GHL API credentials are incorrect');
    console.log('2. Contacts don\'t exist in GHL (need to register first)');
    console.log('3. GHL API permissions issue');
    console.log('4. Network/connectivity issue');
  }

  console.log('\n\n' + '='.repeat(60));
  console.log('RECOMMENDATIONS');
  console.log('='.repeat(60));
  console.log('\nIf participants were successfully tagged by this script:');
  console.log('→ The GHL API works fine');
  console.log('→ The issue is that payment-success endpoint is NOT being called');
  console.log('→ OR participantEmails is empty when it\'s called');
  console.log('\nTo debug further:');
  console.log('1. Do a test registration with participants');
  console.log('2. Check browser console for participant emails in URL');
  console.log('3. Check Vercel logs for "Tagging participants" messages');
  console.log('4. Consider using webhook instead of manual button click');
}

// Run the diagnostic
diagnose();

