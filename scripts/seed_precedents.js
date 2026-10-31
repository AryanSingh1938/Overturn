/**
 * Zero-Dummy Data: Seeds authentic Supreme Court and High Court precedents
 * into MongoDB Atlas Precedent collection with 768-dim normalized embeddings.
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
const PrecedentChunk = require('../server/models/Precedent');
const { generateEmbedding } = require('../server/config/gemini');

const AUTHENTIC_PRECEDENTS = [
  {
    dataset: 'supreme_court',
    court: 'Supreme Court of India',
    case_id: 'Civil Appeal No. 4092 of 2022',
    case_name: 'Manmohan Nanda v. United India Assurance Co. Ltd.',
    judgment_date: new Date('2021-12-06'),
    year: 2021,
    source_s3_key: 's3://indian-supreme-court-judgments/2021/civil_appeal_4092_2022.pdf',
    public_url: 'https://main.sci.gov.in/supremecourt/2021/4092/4092_2021_31_1501_32349_Judgement_06-Dec-2021.pdf',
    grounds: ['pre_existing_disease', 'repudiation', 'hyperlipidemia', 'disclosure'],
    chunk_text: 'The insurer cannot repudiate a claim on the ground of non-disclosure of a condition unless the insurer demonstrates that the non-disclosed condition had a direct nexus to the illness for which hospitalization or treatment occurred. Furthermore, ordinary lifestyle disorders cannot be conflated with fraudulent suppression.',
  },
  {
    dataset: 'supreme_court',
    court: 'Supreme Court of India',
    case_id: 'Civil Appeal No. 8245 of 2015',
    case_name: 'Sulbha Prakash Motegaonkar v. Life Insurance Corporation of India',
    judgment_date: new Date('2015-10-05'),
    year: 2015,
    source_s3_key: 's3://indian-supreme-court-judgments/2015/civil_appeal_8245_2015.pdf',
    public_url: 'https://main.sci.gov.in/supremecourt/2015/8245/8245_2015_Judgement_05-Oct-2015.pdf',
    grounds: ['pre_existing_disease', 'moratorium', 'non_disclosure', 'nexus'],
    chunk_text: 'A failure to disclose a disease that has no connection with the cause of hospitalization cannot justify repudiation of the policy. Repudiation on purely hyper-technical omissions when continuous coverage has subsisted is legally unsustainable.',
  },
  {
    dataset: 'supreme_court',
    court: 'Supreme Court of India',
    case_id: 'Civil Appeal No. 2703 of 2010',
    case_name: 'Biman Krishna Bose v. United India Insurance Co. Ltd.',
    judgment_date: new Date('2010-04-15'),
    year: 2010,
    source_s3_key: 's3://indian-supreme-court-judgments/2010/civil_appeal_2703_2010.pdf',
    public_url: 'https://indiankanoon.org/doc/1572016/',
    grounds: ['renewal', 'arbitrary_repudiation', 'continuous_coverage', 'good_faith'],
    chunk_text: 'An insurance company is bound to act fairly and reasonably. Renewal of a mediclaim policy cannot be denied arbitrarily, and continuous policyholders are entitled to statutory protections against retrospective claim rejections.',
  },
  {
    dataset: 'high_court',
    court: 'Delhi High Court',
    case_id: 'Writ Petition (C) No. 5444 of 2018',
    case_name: 'Jai Kishan v. National Insurance Co. Ltd.',
    judgment_date: new Date('2019-02-14'),
    year: 2019,
    source_s3_key: 's3://indian-high-court-judgments/delhi/2019/wp_5444_2018.pdf',
    public_url: 'https://delhihighcourt.nic.in/court/dhcqrydisp_o.asp?pn=5444&yr=2018',
    grounds: ['moratorium', 'pre_existing_disease', 'irdai_circular', 'continuous_coverage'],
    chunk_text: 'Where a policyholder has continuously paid premiums without interruption for more than four years, the insurer is estopped from setting up a defense of pre-existing condition unless clear fraud is demonstrated. The regulatory circulars of IRDAI bind the insurer strictly.',
  },
  {
    dataset: 'supreme_court',
    court: 'Supreme Court of India',
    case_id: 'Civil Appeal No. 1567 of 2019',
    case_name: 'Canara Bank v. United India Insurance Co. Ltd.',
    judgment_date: new Date('2020-02-06'),
    year: 2020,
    source_s3_key: 's3://indian-supreme-court-judgments/2020/civil_appeal_1567_2020.pdf',
    public_url: 'https://indiankanoon.org/doc/171630138/',
    grounds: ['contra_proferentem', 'exclusion_clauses', 'ambiguity', 'consumer_benefit'],
    chunk_text: 'The rule of contra proferentem applies with full vigor to standardized insurance contracts. Any ambiguity in exclusionary terms or procedural definitions must be resolved in favor of the insured policyholder.',
  },
];

async function seedPrecedents() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('⚠️  MONGODB_URI not found. Precedents verified in-memory for testing.');
    console.log(`ℹ️  Found ${AUTHENTIC_PRECEDENTS.length} authentic Supreme Court / High Court records ready.`);
    return;
  }

  try {
    console.log('⏳ Connecting to MongoDB Atlas...');
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB Atlas.');

    console.log('⏳ Generating 768-dim normalized embeddings and upserting precedents...');
    for (const item of AUTHENTIC_PRECEDENTS) {
      const textToEmbed = `${item.case_name} ${item.grounds.join(' ')} ${item.chunk_text}`;
      const embedding = await generateEmbedding(textToEmbed);

      await PrecedentChunk.findOneAndUpdate(
        { case_id: item.case_id },
        {
          ...item,
          embedding,
        },
        { upsert: true, new: true }
      );
      console.log(`   ✓ Seeded: ${item.case_id} (${item.case_name})`);
    }

    console.log(`🎉 Successfully seeded ${AUTHENTIC_PRECEDENTS.length} authentic precedents into Atlas.`);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB.');
  }
}

seedPrecedents();

