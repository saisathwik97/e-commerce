import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';

const MONGODB_URI = "mongodb+srv://bommidikarthik07:dZV12vtVSvqa5Ktx@cluster0.xqxejhp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbName = 'Buyer';

async function createSeller() {
  let client;
  try {
    console.log('Connecting to MongoDB...');
    client = await MongoClient.connect(MONGODB_URI);
    console.log('Connected successfully!');
    
    const db = client.db(dbName);
    
    // Create test seller
    const hashedPassword = await bcrypt.hash('testpassword', 10);
    const seller = {
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
    };

    // First, let's clear any existing seller with this email
    console.log('Removing any existing seller...');
    await db.collection('sellers').deleteOne({ email: seller.email });

    // Insert the seller
    console.log('Creating new seller...');
    const result = await db.collection('sellers').insertOne(seller);
    console.log('Seller created successfully with ID:', result.insertedId.toString());

    // Verify the seller was created by fetching it
    console.log('\nVerifying seller data...');
    const createdSeller = await db.collection('sellers').findOne({ _id: result.insertedId });
    if (createdSeller) {
      console.log('Seller verified in database:');
      console.log({
        id: createdSeller._id.toString(),
        name: createdSeller.name,
        email: createdSeller.email,
        company: createdSeller.company,
        businessType: createdSeller.businessType,
        // Don't log the password
      });

      // Test password verification
      console.log('\nTesting password verification...');
      const validPassword = await bcrypt.compare('testpassword', createdSeller.password);
      console.log('Password verification:', validPassword ? 'SUCCESS' : 'FAILED');
    } else {
      console.error('Failed to verify seller in database!');
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
createSeller(); 