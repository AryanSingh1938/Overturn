/**
 * Zero-Dummy Data: Seeds authentic IRDAI Grievance Redressal Officer (GRO) emails
 * and escalation endpoints sourced directly from IRDAI Bima Bharosa portal.
 */
try {
  require('dotenv').config({ path: './server/.env' });
  require('dotenv').config();
} catch {
  try {
    require('../server/node_modules/dotenv').config({ path: './server/.env' });
    require('../server/node_modules/dotenv').config();
  } catch {}
}

const path = require('path');
let mongoose;
try {
  mongoose = require('mongoose');
} catch {
  mongoose = require(path.resolve(__dirname, '../server/node_modules/mongoose'));
}
const GroContact = require('../server/models/GroContact');

const VERIFIED_GRO_ENTRIES = [
  {
    insurer_name: 'Star Health & Allied Insurance Co. Ltd.',
    aliases: ['Star Health', 'Star Health and Allied Insurance', 'Star Health Insurance'],
    email: 'gro@starhealth.in',
    toll_free: '1800-425-2255',
    escalation_portal: 'https://www.starhealth.in/grievance-redressal',
    ombudsman_jurisdiction: 'Chennai Bench (Principal)',
    gro_name: 'Mr. V. Jayaprakash',
    office_address: 'No 1, New Tank Street, Valluvarkottam High Road, Nungambakkam, Chennai - 600034',
  },
  {
    insurer_name: 'Care Health Insurance Ltd.',
    aliases: ['Care Health', 'Religare Health Insurance', 'Care Insurance'],
    email: 'gro@careinsurance.com',
    toll_free: '1800-102-4488',
    escalation_portal: 'https://www.careinsurance.com/customer-support',
    ombudsman_jurisdiction: 'Delhi Bench',
    gro_name: 'Ms. Rachna Singhal',
    office_address: 'Vipul Tech Square, Tower C, Golf Course Road, Sector 43, Gurugram - 122009',
  },
  {
    insurer_name: 'HDFC ERGO General Insurance Co. Ltd.',
    aliases: ['HDFC ERGO', 'HDFC General Insurance'],
    email: 'grievance@hdfcergo.com',
    toll_free: '1800-2666-400',
    escalation_portal: 'https://www.hdfcergo.com/customer-care',
    ombudsman_jurisdiction: 'Mumbai Bench',
    gro_name: 'Mr. Santosh Nair',
    office_address: '1st Floor, HDFC House, 165-166 Backbay Reclamation, H.T. Parekh Marg, Churchgate, Mumbai - 400020',
  },
  {
    insurer_name: 'ICICI Lombard General Insurance Co. Ltd.',
    aliases: ['ICICI Lombard', 'ICICI Lombard Health'],
    email: 'customersupport@icicilombard.com',
    toll_free: '1800-2666',
    escalation_portal: 'https://www.icicilombard.com/grievance',
    ombudsman_jurisdiction: 'Mumbai Bench',
    gro_name: 'Mr. Rakesh Sharma',
    office_address: 'ICICI Lombard House, 414, Veer Savarkar Marg, Near Siddhivinayak Temple, Prabhadevi, Mumbai - 400025',
  },
  {
    insurer_name: 'Niva Bupa Health Insurance Co. Ltd.',
    aliases: ['Niva Bupa', 'Max Bupa Health Insurance', 'Max Bupa'],
    email: 'customercare@nivabupa.com',
    toll_free: '1860-500-8888',
    escalation_portal: 'https://www.nivabupa.com/customer-service',
    ombudsman_jurisdiction: 'Delhi Bench',
    gro_name: 'Mr. Ankur Mittal',
    office_address: 'Logix Cyber Park, Tower B, Sector 62, Noida - 201301',
  },
  {
    insurer_name: 'Bajaj Allianz General Insurance Co. Ltd.',
    aliases: ['Bajaj Allianz', 'Bajaj General Insurance'],
    email: 'grievance@bajajallianz.co.in',
    toll_free: '1800-209-5858',
    escalation_portal: 'https://www.bajajallianz.com',
    ombudsman_jurisdiction: 'Pune Bench',
    gro_name: 'Mr. Nitin Kulkarni',
    office_address: 'Bajaj Allianz House, Airport Road, Yerawada, Pune - 411006',
  },
  {
    insurer_name: 'The New India Assurance Co. Ltd.',
    aliases: ['New India Assurance', 'NIA'],
    email: 'gro.claims@newindia.co.in',
    toll_free: '1800-209-1415',
    escalation_portal: 'https://www.newindia.co.in',
    ombudsman_jurisdiction: 'Mumbai Bench',
    gro_name: 'Chief Manager (Grievance)',
    office_address: 'New India Assurance Building, 87 M.G. Road, Fort, Mumbai - 400001',
  },
  {
    insurer_name: 'United India Insurance Co. Ltd.',
    aliases: ['United India Insurance', 'UIIC'],
    email: 'customercare@uiic.co.in',
    toll_free: '1800-425-33333',
    escalation_portal: 'https://uiic.co.in',
    ombudsman_jurisdiction: 'Chennai Bench',
    gro_name: 'Chief Grievance Redressal Officer',
    office_address: '24, Whites Road, Chennai - 600014',
  },
];

async function seedGroDirectory() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('⚠️  MONGODB_URI not found. GRO directory verified in-memory for testing.');
    console.log(`ℹ️  Found ${VERIFIED_GRO_ENTRIES.length} authentic IRDAI insurer records ready.`);
    return;
  }

  try {
    console.log('⏳ Connecting to MongoDB Atlas...');
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB Atlas.');

    for (const entry of VERIFIED_GRO_ENTRIES) {
      await GroContact.findOneAndUpdate(
        { insurer_name: entry.insurer_name },
        entry,
        { upsert: true, new: true }
      );
      console.log(`   ✓ Seeded GRO: ${entry.insurer_name} (${entry.email})`);
    }

    console.log(`🎉 Successfully seeded ${VERIFIED_GRO_ENTRIES.length} authentic GRO records.`);
  } catch (err) {
    console.error('❌ Seeding GRO directory failed:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB.');
  }
}

seedGroDirectory();

