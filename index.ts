import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import type { Db } from 'mongodb';
import cors from 'cors';
import dotenv from 'dotenv';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Load environment variables
dotenv.config();

// Extend Express Request type to include user
interface AuthenticatedUser {
  id: string;
  email: string;
}

interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

const app = express();
const port = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'buyer-secret-key';

// MongoDB Connection URL
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://bommidikarthik07:dZV12vtVSvqa5Ktx@cluster0.xqxejhp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
let db: Db;

// Initialize MongoDB connection
let client: MongoClient;

async function connectDB() {
  try {
    client = await MongoClient.connect(MONGODB_URI);
    db = client.db('Buyer');
    console.log('Connected to MongoDB');
    return client;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Add sample active projects
async function addSampleProjects() {
  try {
    const sampleProjects = [
      {
        buyerId: "temp1",
        title: "Organic Cotton T-shirts",
        category: "Textiles",
        description: "Bulk order of 1000 organic cotton t-shirts for sustainable fashion line",
        budget: 5000,
        deadline: new Date("2024-06-30"),
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        buyerId: "temp1",
        title: "Handmade Ceramic Tableware",
        category: "Goods",
        description: "Set of 500 handmade ceramic plates and bowls for restaurant chain",
        budget: 7500,
        deadline: new Date("2024-07-15"),
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        buyerId: "temp1",
        title: "Organic Coffee Beans",
        category: "Agro Products",
        description: "Monthly supply of 100kg organic coffee beans for cafe chain",
        budget: 3000,
        deadline: new Date("2024-08-01"),
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Wait for MongoDB connection
    await connectDB();
    
    // Insert sample projects if they don't exist
    for (const project of sampleProjects) {
      const existingProject = await db.collection('projects').findOne({
        buyerId: project.buyerId,
        title: project.title
      });

      if (!existingProject) {
        await db.collection('projects').insertOne(project);
      }
    }

    console.log('Sample projects added successfully');
  } catch (error) {
    console.error('Error adding sample projects:', error);
  }
}

// Call the function after MongoDB connection is established
connectDB().then(() => {
  addSampleProjects();
});

app.use(cors());
app.use(express.json());

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Authentication Middleware
const authenticateToken = (req: AuthenticatedRequest, res: Response, next: Function) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token is required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = decoded as AuthenticatedUser;
    next();
  });
};

// Authentication Routes
app.post('/api/buyer/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password, company, phone, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Ensure database connection is established
    if (!db) {
      await connectDB();
    }
    
    const existingUser = await db.collection('users').findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      name,
      email,
      password: hashedPassword,
      company,
      phone,
      address,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('users').insertOne(newUser);
    const user = await db.collection('users').findOne({ _id: result.insertedId });

    if (!user) {
      return res.status(500).json({ error: 'Failed to create user' });
    }

    // Create JWT token
    const token = jwt.sign({ id: user._id.toString(), email: user.email }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        company: user.company,
        phone: user.phone,
        address: user.address
      },
      token
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Error registering user' });
  }
});

app.post('/api/buyer/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        company: user.company,
        phone: user.phone,
        address: user.address
      },
      token
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Error logging in' });
  }
});

// Protected Routes
app.get('/api/buyer/profile/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const profile = await db.collection('users').findOne({ _id: new ObjectId(req.params.id) });
    
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    // Remove sensitive data
    const { password, ...profileWithoutPassword } = profile;
    res.json(profileWithoutPassword);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Error fetching profile' });
  }
});

// API Routes
app.get('/api/buyer/requests/:buyerId', async (req: Request, res: Response) => {
  try {
    const requests = await db.collection('requests').find({ buyerId: req.params.buyerId }).toArray();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching requests' });
  }
});

app.get('/api/buyer/proposals/:buyerId', async (req: Request, res: Response) => {
  try {
    const proposals = await db.collection('proposals').find({ buyerId: req.params.buyerId }).toArray();
    res.json(proposals);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching proposals' });
  }
});

// Active Projects Schema
interface ActiveProject {
  _id: ObjectId;
  buyerId: string;
  title: string;
  category: string;
  description: string;
  budget: number;
  deadline: Date;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

// Active Projects Routes
app.post('/api/buyer/projects', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, category, description, budget, deadline } = req.body;
    const buyerId = req.user?.id;

    if (!buyerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!title || !category || !description || !budget || !deadline) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newProject: ActiveProject = {
      _id: new ObjectId(),
      buyerId,
      title,
      category,
      description,
      budget,
      deadline: new Date(deadline),
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.collection('projects').insertOne(newProject);

    res.status(201).json({
      project: {
        id: newProject._id.toString(),
        title: newProject.title,
        category: newProject.category,
        description: newProject.description,
        budget: newProject.budget,
        deadline: newProject.deadline,
        status: newProject.status
      }
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Error creating project' });
  }
});

app.get('/api/buyer/projects', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const buyerId = req.user?.id;
    if (!buyerId) {
      return res.status(400).json({ error: 'Buyer ID is required' });
    }

    // Get all projects for this buyer
    const projects = await db.collection('projects')
      .find({ buyerId: buyerId.toString() })
      .sort({ createdAt: -1 })
      .toArray();

    // Get agent and proposal details for each project
    const enrichedProjects = await Promise.all(
      projects.map(async (project) => {
        try {
          const agent = await db.collection('agents').findOne({ _id: new ObjectId(project.agentId) });
          const proposal = await db.collection('proposals').findOne({ _id: new ObjectId(project.proposalId) });

          return {
            _id: project._id.toString(),
            requestId: project.requestId,
            title: project.title,
            category: project.category,
            description: project.description,
            budget: project.budget,
            deadline: project.deadline,
            status: project.status,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
            agentName: agent?.name || 'Unknown Agent',
            agentEmail: agent?.email || '',
            agentCompany: agent?.company || '',
            agentPhone: agent?.phone || '',
            agentExperience: agent?.experience || 0,
            agentRating: agent?.rating || 0,
            proposalMessage: proposal?.message || ''
          };
        } catch (error) {
          console.error('Error processing project:', error);
          return null;
        }
      })
    );

    const validProjects = enrichedProjects.filter(project => project !== null);
    res.json(validProjects);
  } catch (error) {
    console.error('Error fetching buyer projects:', error);
    res.status(500).json({ error: 'Failed to fetch buyer projects' });
  }
});

interface BuyerRequest {
  _id?: ObjectId;
  buyerId: string;
  title: string;
  category: 'goods' | 'textiles' | 'agro';
  description: string;
  budget: number;
  deadline: Date;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

// Add sample requests
async function addSampleRequests() {
  try {
    const sampleRequests: BuyerRequest[] = [
      {
        buyerId: '680bc7d1cf098c4a3220cc6b',
        title: 'Organic Cotton T-shirts',
        category: 'textiles',
        description: 'Looking for sustainable organic cotton t-shirts in bulk quantities',
        budget: 5000,
        deadline: new Date('2024-06-01'),
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        buyerId: '680bc7d1cf098c4a3220cc6b',
        title: 'Handmade Ceramic Tableware',
        category: 'goods',
        description: 'Seeking traditional handmade ceramic tableware sets',
        budget: 3000,
        deadline: new Date('2024-05-15'),
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        buyerId: '680bc7d1cf098c4a3220cc6b',
        title: 'Organic Spices Collection',
        category: 'agro',
        description: 'Need high-quality organic spices in bulk',
        budget: 2000,
        deadline: new Date('2024-05-30'),
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        buyerId: '680bc7d1cf098c4a3220cc6b',
        title: 'Bamboo Furniture Set',
        category: 'goods',
        description: 'Looking for sustainable bamboo furniture for office space',
        budget: 8000,
        deadline: new Date('2024-06-15'),
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        buyerId: '680bc7d1cf098c4a3220cc6b',
        title: 'Handwoven Textiles',
        category: 'textiles',
        description: 'Seeking traditional handwoven textiles for fashion line',
        budget: 6000,
        deadline: new Date('2024-06-30'),
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const requestsCollection = db.collection('requests');
    for (const request of sampleRequests) {
      const existingRequest = await requestsCollection.findOne({ 
        title: request.title,
        buyerId: request.buyerId 
      });
      if (!existingRequest) {
        await requestsCollection.insertOne(request);
      }
    }
  } catch (error) {
    console.error('Error adding sample requests:', error);
  }
}

// Add sample agent
async function addSampleAgent() {
  try {
    const sampleAgent = {
      name: "Test Agent",
      email: "agent@test.com",
      password: await bcrypt.hash("test123", 10),
      company: "Test Agency",
      phone: "1234567890",
      address: "123 Test Street",
      expertise: ["textiles", "goods", "agro"],
      experience: 5,
      rating: 4.5,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const existingAgent = await db.collection('agents').findOne({ email: sampleAgent.email });
    if (!existingAgent) {
      await db.collection('agents').insertOne(sampleAgent);
      console.log('Sample agent created successfully');
    }
  } catch (error) {
    console.error('Error creating sample agent:', error);
  }
}

interface Proposal {
  _id?: ObjectId;
  requestId: string;
  buyerId: string;
  agentId: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

// Add sample proposals
async function addSampleProposals() {
  try {
    const sampleProposals = [
      {
        requestId: '680bc7d1cf098c4a3220cc6b', // This will be updated with actual request ID
        buyerId: '680bc7d1cf098c4a3220cc6b', // This will be updated with actual buyer ID
        agentId: '680bc7d1cf098c4a3220cc6c', // This will be updated with actual agent ID
        message: 'I can help you source these products with my expertise in this category.',
        status: 'accepted',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        requestId: '680bc7d1cf098c4a3220cc6d',
        buyerId: '680bc7d1cf098c4a3220cc6b',
        agentId: '680bc7d1cf098c4a3220cc6c',
        message: 'I have extensive experience with similar projects and can ensure quality delivery.',
        status: 'accepted',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Get the first buyer and agent from the database
    const buyer = await db.collection('users').findOne({});
    const agent = await db.collection('agents').findOne({});
    const requests = await db.collection('requests').find({}).limit(2).toArray();

    if (buyer && agent && requests.length > 0) {
      // Update sample proposals with actual IDs
      sampleProposals[0].buyerId = buyer._id.toString();
      sampleProposals[0].agentId = agent._id.toString();
      sampleProposals[0].requestId = requests[0]._id.toString();

      if (requests[1]) {
        sampleProposals[1].buyerId = buyer._id.toString();
        sampleProposals[1].agentId = agent._id.toString();
        sampleProposals[1].requestId = requests[1]._id.toString();
      }

      // Insert sample proposals if they don't exist
      for (const proposal of sampleProposals) {
        const existingProposal = await db.collection('proposals').findOne({
          requestId: proposal.requestId,
          agentId: proposal.agentId
        });

        if (!existingProposal) {
          await db.collection('proposals').insertOne(proposal);
        }
      }

      console.log('Sample proposals added successfully');
    }
  } catch (error) {
    console.error('Error adding sample proposals:', error);
  }
}

// Add seller registration route
app.post('/api/seller/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password, company, phone, address, businessType, products, gstNumber } = req.body;

    if (!name || !email || !password || !businessType || !gstNumber) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    const existingSeller = await db.collection('sellers').findOne({ email });
    if (existingSeller) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newSeller = {
      name,
      email,
      password: hashedPassword,
      company,
      phone,
      address,
      businessType,
      products: products || [],
      gstNumber,
      rating: 0,
      status: 'active',
      verificationStatus: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('sellers').insertOne(newSeller);
    const seller = await db.collection('sellers').findOne({ _id: result.insertedId });

    if (!seller) {
      return res.status(500).json({ error: 'Failed to create seller' });
    }

    const token = jwt.sign({ id: seller._id.toString(), email: seller.email }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({
      seller: {
        id: seller._id.toString(),
        name: seller.name,
        email: seller.email,
        company: seller.company,
        phone: seller.phone,
        address: seller.address,
        businessType: seller.businessType,
        products: seller.products,
        gstNumber: seller.gstNumber,
        rating: seller.rating,
        status: seller.status,
        verificationStatus: seller.verificationStatus
      },
      token
    });
  } catch (error) {
    console.error('Error registering seller:', error);
    res.status(500).json({ error: 'Error registering seller' });
  }
});

// Add seller login route
app.post('/api/seller/login', async (req: Request, res: Response) => {
  try {
    console.log('Seller login attempt:', { email: req.body.email });
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const seller = await db.collection('sellers').findOne({ email });
    if (!seller) {
      console.log('Seller not found with email:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    console.log('Seller found:', { id: seller._id.toString(), email: seller.email });

    const validPassword = await bcrypt.compare(password, seller.password);
    console.log('Password verification:', validPassword ? 'SUCCESS' : 'FAILED');
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: seller._id.toString(), email: seller.email }, JWT_SECRET, { expiresIn: '24h' });
    console.log('JWT token generated successfully');

    res.json({
      seller: {
        id: seller._id.toString(),
        name: seller.name,
        email: seller.email,
        company: seller.company,
        phone: seller.phone,
        address: seller.address,
        businessType: seller.businessType,
        products: seller.products,
        gstNumber: seller.gstNumber,
        rating: seller.rating,
        status: seller.status,
        verificationStatus: seller.verificationStatus
      },
      token
    });
    console.log('Login successful for seller:', seller.email);
  } catch (error) {
    console.error('Error logging in seller:', error);
    res.status(500).json({ error: 'Error logging in seller' });
  }
});

// Add seller profile route
app.get('/api/seller/profile', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const sellerId = req.user?.id;
    if (!sellerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const seller = await db.collection('sellers').findOne({ _id: new ObjectId(sellerId) });
    if (!seller) {
      return res.status(404).json({ error: 'Seller not found' });
    }

    const { password, ...sellerWithoutPassword } = seller;
    res.json(sellerWithoutPassword);
  } catch (error) {
    console.error('Error fetching seller profile:', error);
    res.status(500).json({ error: 'Error fetching seller profile' });
  }
});

// Add sample seller to initialization
async function addSampleSeller() {
  try {
    const sampleSeller = {
      name: "Test Seller",
      email: "seller@test.com",
      password: await bcrypt.hash("test123", 10),
      company: "Test Manufacturing Co.",
      phone: "9876543210",
      address: "789 Seller Street",
      businessType: "Manufacturer",
      products: ["Textiles", "Garments"],
      gstNumber: "GSTIN1234567890",
      rating: 4.2,
      status: "active",
      verificationStatus: "verified",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const existingSeller = await db.collection('sellers').findOne({ email: sampleSeller.email });
    if (!existingSeller) {
      await db.collection('sellers').insertOne(sampleSeller);
      console.log('Sample seller created successfully');
    }
  } catch (error) {
    console.error('Error creating sample seller:', error);
  }
}

// Update the initializeDatabase function to include seller initialization
async function initializeDatabase() {
  try {
    await connectDB();
    await addSampleAgent();
    await addSampleSeller();
    await addSampleRequests();
    await addSampleProposals();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Start the server
initializeDatabase().then(() => {
  // Register all routes before starting the server
  app.use(cors());
  app.use(express.json());

  // Authentication routes
  app.post('/api/buyer/register', async (req: Request, res: Response) => {
    try {
      const { name, email, password, company, phone, address } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
      }

      // Ensure database connection is established
      if (!db) {
        await connectDB();
      }
      
      const existingUser = await db.collection('users').findOne({ email });

      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        name,
        email,
        password: hashedPassword,
        company,
        phone,
        address,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await db.collection('users').insertOne(newUser);
      const user = await db.collection('users').findOne({ _id: result.insertedId });

      if (!user) {
        return res.status(500).json({ error: 'Failed to create user' });
      }

      // Create JWT token
      const token = jwt.sign({ id: user._id.toString(), email: user.email }, JWT_SECRET, { expiresIn: '24h' });

      res.status(201).json({
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          company: user.company,
          phone: user.phone,
          address: user.address
        },
        token
      });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ error: 'Error registering user' });
    }
  });

  app.post('/api/buyer/login', async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const user = await db.collection('users').findOne({ email });

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Create JWT token
      const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });

      res.json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          company: user.company,
          phone: user.phone,
          address: user.address
        },
        token
      });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ error: 'Error logging in' });
    }
  });

  app.post('/api/agent/register', async (req: Request, res: Response) => {
    try {
      const { name, email, password, company, phone, address, expertise, experience } = req.body;

      if (!name || !email || !password || !expertise || !experience) {
        return res.status(400).json({ error: 'Required fields are missing' });
      }

      const existingAgent = await db.collection('agents').findOne({ email });
      if (existingAgent) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newAgent = {
        name,
        email,
        password: hashedPassword,
        company,
        phone,
        address,
        expertise,
        experience,
        rating: 0,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await db.collection('agents').insertOne(newAgent);
      const agent = await db.collection('agents').findOne({ _id: result.insertedId });

      if (!agent) {
        return res.status(500).json({ error: 'Failed to create agent' });
      }

      const token = jwt.sign({ id: agent._id.toString(), email: agent.email }, JWT_SECRET, { expiresIn: '24h' });

      res.status(201).json({
        agent: {
          id: agent._id.toString(),
          name: agent.name,
          email: agent.email,
          company: agent.company,
          phone: agent.phone,
          address: agent.address,
          expertise: agent.expertise,
          experience: agent.experience,
          rating: agent.rating,
          status: agent.status
        },
        token
      });
    } catch (error) {
      console.error('Error registering agent:', error);
      res.status(500).json({ error: 'Error registering agent' });
    }
  });

  app.post('/api/agent/login', async (req: Request, res: Response) => {
    try {
      console.log('Agent login attempt:', { email: req.body.email });
      const { email, password } = req.body;

      if (!email || !password) {
        console.log('Missing email or password');
        return res.status(400).json({ error: 'Email and password are required' });
      }

      console.log('Searching for agent with email:', email);
      const agent = await db.collection('agents').findOne({ email });
      
      if (!agent) {
        console.log('No agent found with email:', email);
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      console.log('Agent found:', {
        id: agent._id.toString(),
        email: agent.email,
        name: agent.name
      });

      console.log('Comparing passwords...');
      const validPassword = await bcrypt.compare(password, agent.password);
      console.log('Password verification result:', validPassword);

      if (!validPassword) {
        console.log('Password verification failed');
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      console.log('Creating JWT token...');
      const token = jwt.sign(
        { id: agent._id.toString(), email: agent.email },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      console.log('Sending successful response...');
      res.json({
        agent: {
          id: agent._id.toString(),
          name: agent.name,
          email: agent.email,
          company: agent.company,
          phone: agent.phone,
          address: agent.address,
          expertise: agent.expertise,
          experience: agent.experience,
          rating: agent.rating,
          status: agent.status
        },
        token
      });
      console.log('Login successful for agent:', agent.email);
    } catch (error) {
      console.error('Error in agent login:', error);
      res.status(500).json({ error: 'Error logging in agent' });
    }
  });

  // Protected routes
  app.get('/api/buyer/profile/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const profile = await db.collection('users').findOne({ _id: new ObjectId(req.params.id) });
      
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }
      
      // Remove sensitive data
      const { password, ...profileWithoutPassword } = profile;
      res.json(profileWithoutPassword);
    } catch (error) {
      console.error('Error fetching profile:', error);
      res.status(500).json({ error: 'Error fetching profile' });
    }
  });

  app.get('/api/agent/profile', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const agentId = req.user?.id;
      if (!agentId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const agent = await db.collection('agents').findOne({ _id: new ObjectId(agentId) });
      if (!agent) {
        return res.status(404).json({ error: 'Agent not found' });
      }

      const { password, ...agentWithoutPassword } = agent;
      res.json(agentWithoutPassword);
    } catch (error) {
      console.error('Error fetching agent profile:', error);
      res.status(500).json({ error: 'Error fetching agent profile' });
    }
  });
  
  // Request and proposal routes
  app.post('/api/buyer/requests', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { title, category, description, budget, deadline } = req.body;
      const buyerId = req.user?.id;

      if (!buyerId || !title || !category || !description || !budget || !deadline) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const request: BuyerRequest = {
        buyerId,
        title,
        category,
        description,
        budget,
        deadline: new Date(deadline),
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await db.collection('requests').insertOne(request);
      res.status(201).json({ ...request, _id: result.insertedId });
    } catch (error) {
      console.error('Error creating request:', error);
      res.status(500).json({ error: 'Failed to create request' });
    }
  });

  app.get('/api/buyer/requests', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const buyerId = req.user?.id;
      if (!buyerId) {
        return res.status(400).json({ error: 'Buyer ID is required' });
      }

      const requests = await db.collection('requests')
        .find({ buyerId })
        .sort({ createdAt: -1 })
        .toArray();

      res.json(requests);
    } catch (error) {
      console.error('Error fetching requests:', error);
      res.status(500).json({ error: 'Failed to fetch requests' });
    }
  });

  app.get('/api/agent/requests', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      // Ensure database connection is established
      if (!db) {
        await connectDB();
      }

      // Fetch all buyer requests from the requests collection
      const requests = await db.collection('requests')
        .find({})
        .sort({ createdAt: -1 })
        .toArray();

      // Fetch buyer details for each request
      const requestsWithBuyerDetails = await Promise.all(
        requests.map(async (request) => {
          try {
            const buyer = await db.collection('users').findOne({ _id: new ObjectId(request.buyerId) });
            return {
              ...request,
              _id: request._id.toString(),
              buyerId: request.buyerId.toString(),
              buyerName: buyer?.name || 'Unknown Buyer',
              buyerEmail: buyer?.email || '',
              buyerCompany: buyer?.company || '',
              createdAt: request.createdAt,
              updatedAt: request.updatedAt,
              deadline: request.deadline
            };
          } catch (error) {
            console.error('Error fetching buyer details:', error);
            return {
              ...request,
              _id: request._id.toString(),
              buyerId: request.buyerId.toString(),
              buyerName: 'Unknown Buyer',
              buyerEmail: '',
              buyerCompany: '',
              createdAt: request.createdAt,
              updatedAt: request.updatedAt,
              deadline: request.deadline
            };
          }
        })
      );

      res.json(requestsWithBuyerDetails);
    } catch (error) {
      console.error('Error fetching buyer requests:', error);
      res.status(500).json({ error: 'Failed to fetch buyer requests' });
    }
  });

  app.get('/api/agent/requests/:requestId', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { requestId } = req.params;
      const request = await db.collection('requests').findOne({ _id: new ObjectId(requestId) });
      
      if (!request) {
        return res.status(404).json({ error: 'Request not found' });
      }

      const buyer = await db.collection('users').findOne({ _id: new ObjectId(request.buyerId) });
      
      res.json({
        ...request,
        _id: request._id.toString(),
        buyerName: buyer?.name || 'Unknown Buyer',
        buyerEmail: buyer?.email || '',
        buyerCompany: buyer?.company || '',
        buyerPhone: buyer?.phone || '',
        buyerAddress: buyer?.address || ''
      });
    } catch (error) {
      console.error('Error fetching request details:', error);
      res.status(500).json({ error: 'Failed to fetch request details' });
    }
  });
  
  // Proposal routes
  app.post('/api/proposals', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { requestId, message } = req.body;
      const agentId = req.user?.id;

      if (!agentId || !requestId || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Get the request to get buyerId
      const request = await db.collection('requests').findOne({ _id: new ObjectId(requestId) });
      if (!request) {
        return res.status(404).json({ error: 'Request not found' });
      }

      const proposal: Proposal = {
        requestId,
        buyerId: request.buyerId,
        agentId,
        message,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await db.collection('proposals').insertOne(proposal);
      res.status(201).json({ ...proposal, _id: result.insertedId });
    } catch (error) {
      console.error('Error creating proposal:', error);
      res.status(500).json({ error: 'Failed to create proposal' });
    }
  });

  app.get('/api/buyer/proposals', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const buyerId = req.user?.id;
      if (!buyerId) {
        return res.status(400).json({ error: 'Buyer ID is required' });
      }

      const proposals = await db.collection('proposals')
        .find({ buyerId })
        .sort({ createdAt: -1 })
        .toArray();

      // Get agent details for each proposal
      const proposalsWithAgentDetails = await Promise.all(
        proposals.map(async (proposal) => {
          const agent = await db.collection('agents').findOne({ _id: new ObjectId(proposal.agentId) });
          const request = await db.collection('requests').findOne({ _id: new ObjectId(proposal.requestId) });
          
          return {
            ...proposal,
            _id: proposal._id.toString(),
            agentName: agent?.name || 'Unknown Agent',
            agentCompany: agent?.company || '',
            requestTitle: request?.title || 'Unknown Request',
            requestCategory: request?.category || '',
            requestBudget: request?.budget || 0
          };
        })
      );

      res.json(proposalsWithAgentDetails);
    } catch (error) {
      console.error('Error fetching proposals:', error);
      res.status(500).json({ error: 'Failed to fetch proposals' });
    }
  });

  app.put('/api/proposals/:proposalId/accept', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { proposalId } = req.params;
      const buyerId = req.user?.id;

      if (!buyerId) {
        return res.status(400).json({ error: 'Buyer ID is required' });
      }

      const proposal = await db.collection('proposals').findOne({ _id: new ObjectId(proposalId) });
      if (!proposal) {
        return res.status(404).json({ error: 'Proposal not found' });
      }

      if (proposal.buyerId !== buyerId) {
        return res.status(403).json({ error: 'Not authorized to accept this proposal' });
      }

      if (proposal.status !== 'pending') {
        return res.status(400).json({ error: 'Proposal is not in pending status' });
      }

      // Update proposal status to accepted
      await db.collection('proposals').updateOne(
        { _id: new ObjectId(proposalId) },
        { $set: { 
          status: 'accepted', 
          updatedAt: new Date() 
        }}
      );

      // Create a new project entry
      const request = await db.collection('requests').findOne({ _id: new ObjectId(proposal.requestId) });
      if (!request) {
        return res.status(404).json({ error: 'Associated request not found' });
      }

      const project = {
        proposalId: proposalId,
        requestId: proposal.requestId,
        buyerId: proposal.buyerId,
        agentId: proposal.agentId,
        title: request.title,
        category: request.category,
        description: request.description,
        budget: request.budget,
        deadline: request.deadline,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await db.collection('projects').insertOne(project);

      // Update the request status to completed
      await db.collection('requests').updateOne(
        { _id: new ObjectId(proposal.requestId) },
        { $set: { 
          status: 'completed', 
          updatedAt: new Date() 
        }}
      );

      res.json({ message: 'Proposal accepted and project created successfully' });
    } catch (error) {
      console.error('Error accepting proposal:', error);
      res.status(500).json({ error: 'Failed to accept proposal' });
    }
  });

  app.put('/api/proposals/:proposalId/reject', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { proposalId } = req.params;
      const buyerId = req.user?.id;

      if (!buyerId) {
        return res.status(400).json({ error: 'Buyer ID is required' });
      }

      const proposal = await db.collection('proposals').findOne({ _id: new ObjectId(proposalId) });
      if (!proposal) {
        return res.status(404).json({ error: 'Proposal not found' });
      }

      if (proposal.buyerId !== buyerId) {
        return res.status(403).json({ error: 'Not authorized to reject this proposal' });
      }

      if (proposal.status !== 'pending') {
        return res.status(400).json({ error: 'Proposal is not in pending status' });
      }

      await db.collection('proposals').updateOne(
        { _id: new ObjectId(proposalId) },
        { $set: { status: 'rejected', updatedAt: new Date() } }
      );

      res.json({ message: 'Proposal rejected successfully' });
    } catch (error) {
      console.error('Error rejecting proposal:', error);
      res.status(500).json({ error: 'Failed to reject proposal' });
    }
  });

  // Project routes
  app.get('/api/agent/projects', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const agentId = req.user?.id;
      if (!agentId) {
        return res.status(400).json({ error: 'Agent ID is required' });
      }

      // Get all projects for this agent
      const projects = await db.collection('projects')
        .find({ agentId: agentId.toString() })
        .sort({ createdAt: -1 })
        .toArray();

      // Get buyer and proposal details for each project
      const enrichedProjects = await Promise.all(
        projects.map(async (project) => {
          try {
            const buyer = await db.collection('users').findOne({ _id: new ObjectId(project.buyerId) });
            const proposal = await db.collection('proposals').findOne({ _id: new ObjectId(project.proposalId) });

            return {
              _id: project._id.toString(),
              requestId: project.requestId,
              title: project.title,
              category: project.category,
              description: project.description,
              budget: project.budget,
              deadline: project.deadline,
              status: project.status,
              createdAt: project.createdAt,
              updatedAt: project.updatedAt,
              buyerName: buyer?.name || 'Unknown Buyer',
              buyerEmail: buyer?.email || '',
              buyerCompany: buyer?.company || '',
              buyerPhone: buyer?.phone || '',
              buyerAddress: buyer?.address || '',
              proposalMessage: proposal?.message || ''
            };
          } catch (error) {
            console.error('Error processing project:', error);
            return null;
          }
        })
      );

      const validProjects = enrichedProjects.filter(project => project !== null);
      res.json(validProjects);
    } catch (error) {
      console.error('Error fetching agent projects:', error);
      res.status(500).json({ error: 'Failed to fetch agent projects' });
    }
  });

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}); 