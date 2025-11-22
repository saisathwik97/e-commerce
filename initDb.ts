import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://bommidikarthik07:dZV12vtVSvqa5Ktx@cluster0.xqxejhp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbName = 'Buyer';

async function initializeDatabase() {
  try {
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db(dbName);

    // Clear existing collections
    await db.collection('users').deleteMany({});
    await db.collection('agents').deleteMany({});
    await db.collection('sellers').deleteMany({});
    await db.collection('requests').deleteMany({});
    await db.collection('proposals').deleteMany({});
    await db.collection('projects').deleteMany({});

    // Create test buyer
    const hashedPassword = await bcrypt.hash('testpassword', 10);
    const buyerResult = await db.collection('users').insertOne({
      name: 'Test Buyer',
      email: 'testbuyer@example.com',
      password: hashedPassword,
      company: 'Test Company',
      phone: '+1234567890',
      address: '123 Test Street',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    if (!buyerResult.insertedId) {
      throw new Error('Failed to create test buyer');
    }
    const buyerId = buyerResult.insertedId.toString();
    console.log('Test buyer created:', buyerId);

    // Create test agent
    const agentResult = await db.collection('agents').insertOne({
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
    });

    if (!agentResult.insertedId) {
      throw new Error('Failed to create test agent');
    }
    const agentId = agentResult.insertedId.toString();
    console.log('Test agent created:', agentId);

    // Create test seller
    const sellerResult = await db.collection('sellers').insertOne({
      name: 'Test Seller',
      email: 'testseller@example.com',
      password: hashedPassword,
      company: 'Test Manufacturing Co.',
      phone: '+1122334455',
      address: '789 Seller Street',
      businessType: 'Manufacturer',
      products: ['Textiles', 'Garments'],
      gstNumber: 'GSTIN1234567890',
      rating: 4.2,
      status: 'active',
      verificationStatus: 'verified',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    if (!sellerResult.insertedId) {
      throw new Error('Failed to create test seller');
    }
    const sellerId = sellerResult.insertedId.toString();
    console.log('Test seller created:', sellerId);

    // Create test requests
    const requests = [
      {
        title: 'Organic Cotton T-shirts',
        description: 'Looking for sustainable organic cotton t-shirts in bulk quantities',
        category: 'textiles',
        budget: 5000,
        deadline: new Date('2024-06-01'),
        buyerId: buyerId,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Handmade Ceramic Tableware',
        description: 'Seeking traditional handmade ceramic tableware sets',
        category: 'goods',
        budget: 3000,
        deadline: new Date('2024-05-15'),
        buyerId: buyerId,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    for (const request of requests) {
      const requestResult = await db.collection('requests').insertOne(request);
      if (!requestResult.insertedId) {
        throw new Error('Failed to create test request');
      }
      console.log('Test request created:', requestResult.insertedId.toString());

      // Create test proposal for each request
      const proposalResult = await db.collection('proposals').insertOne({
        requestId: requestResult.insertedId.toString(),
        buyerId: buyerId,
        agentId: agentId,
        message: `I can help you source these ${request.category} with my expertise in this category.`,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      if (!proposalResult.insertedId) {
        throw new Error('Failed to create test proposal');
      }
      console.log('Test proposal created:', proposalResult.insertedId.toString());
    }

    await client.close();
    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initializeDatabase(); 