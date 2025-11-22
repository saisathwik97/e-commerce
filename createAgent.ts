import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';

const MONGODB_URI = "mongodb+srv://bommidikarthik07:dZV12vtVSvqa5Ktx@cluster0.xqxejhp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbName = 'Buyer';

async function createAgent() {
  let client;
  try {
    console.log('Connecting to MongoDB...');
    client = await MongoClient.connect(MONGODB_URI);
    console.log('Connected successfully!');
    
    const db = client.db(dbName);
    
    // Create test agent
    const hashedPassword = await bcrypt.hash('testpassword', 10);
    const agent = {
      name: 'Test Agent',
      email: 'testagent@example.com',
      password: hashedPassword,
      company: 'Test Agency',
      phone: '+0987654321',
      address: '456 Agent Street',
      expertise: ['textiles', 'goods', 'agro'],
      experience: 5,
      rating: 4.5,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // First, let's clear any existing agent with this email
    console.log('Removing any existing agent...');
    await db.collection('agents').deleteOne({ email: agent.email });

    // Insert the agent
    console.log('Creating new agent...');
    const result = await db.collection('agents').insertOne(agent);
    console.log('Agent created successfully with ID:', result.insertedId.toString());

    // Verify the agent was created by fetching it
    console.log('\nVerifying agent data...');
    const createdAgent = await db.collection('agents').findOne({ _id: result.insertedId });
    if (createdAgent) {
      console.log('Agent verified in database:');
      console.log({
        id: createdAgent._id.toString(),
        name: createdAgent.name,
        email: createdAgent.email,
        company: createdAgent.company,
        expertise: createdAgent.expertise
      });

      // Test password verification
      console.log('\nTesting password verification...');
      const validPassword = await bcrypt.compare('testpassword', createdAgent.password);
      console.log('Password verification:', validPassword ? 'SUCCESS' : 'FAILED');
    } else {
      console.error('Failed to verify agent in database!');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('\nDatabase connection closed.');
    }
  }
}

// Run the function
createAgent(); 