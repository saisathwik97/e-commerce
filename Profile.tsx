
import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBlockchain } from "@/contexts/BlockchainContext";

const SellerProfile = () => {
  const { user } = useAuth();
  const { isConnected, walletAddress } = useBlockchain();
  
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    company: "Eco Crafts India",
    phone: "+91 98765 43210",
    address: "123 Craft Street, Chennai, Tamil Nadu, India",
    about: "We are a manufacturer of eco-friendly handcrafted products specializing in home decor and kitchenware. Our products are made from sustainable materials by skilled artisans.",
    website: "www.ecocraftsindia.com",
    gst: "22ABCDE1234F5Z6",
    categories: "Home Goods, Kitchenware, Sustainable Products"
  });
  
  const [isEditing, setIsEditing] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSaveProfile = () => {
    // Validate inputs
    if (!profileData.name || !profileData.email) {
      toast.error("Name and email are required");
      return;
    }
    
    // In a real app, would save to backend
    setIsEditing(false);
    toast.success("Profile updated successfully");
  };

  return (
    <DashboardLayout title="My Profile" userType="seller">
      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Company Profile</TabsTrigger>
          <TabsTrigger value="business">Business Details</TabsTrigger>
          <TabsTrigger value="wallet">Payment Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Company Information</CardTitle>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              ) : (
                <div className="space-x-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-marketplace-blue hover:bg-marketplace-blue-light" onClick={handleSaveProfile}>
                    Save Changes
                  </Button>
                </div>
              )}
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium">Company Name</label>
                  {isEditing ? (
                    <Input 
                      name="company"
                      value={profileData.company}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1">{profileData.company}</p>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium">Contact Person</label>
                  {isEditing ? (
                    <Input 
                      name="name"
                      value={profileData.name}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1">{profileData.name}</p>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium">Email</label>
                  {isEditing ? (
                    <Input 
                      name="email"
                      type="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1">{profileData.email}</p>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  {isEditing ? (
                    <Input 
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1">{profileData.phone}</p>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium">Website</label>
                  {isEditing ? (
                    <Input 
                      name="website"
                      value={profileData.website}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1">{profileData.website}</p>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium">Product Categories</label>
                  {isEditing ? (
                    <Input 
                      name="categories"
                      value={profileData.categories}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1">{profileData.categories}</p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Address</label>
                  {isEditing ? (
                    <Textarea 
                      name="address"
                      value={profileData.address}
                      onChange={handleInputChange}
                      className="mt-1"
                      rows={2}
                    />
                  ) : (
                    <p className="mt-1">{profileData.address}</p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label className="text-sm font-medium">About</label>
                  {isEditing ? (
                    <Textarea 
                      name="about"
                      value={profileData.about}
                      onChange={handleInputChange}
                      className="mt-1"
                      rows={4}
                    />
                  ) : (
                    <p className="mt-1">{profileData.about}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle>Business Details</CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium">GST Number</label>
                  {isEditing ? (
                    <Input 
                      name="gst"
                      value={profileData.gst}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1">{profileData.gst}</p>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium">Business Type</label>
                  <p className="mt-1">Manufacturer</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Year Established</label>
                  <p className="mt-1">2018</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Number of Employees</label>
                  <p className="mt-1">25-50</p>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="font-medium text-lg mb-4">Certifications & Compliance</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input type="checkbox" id="iso" className="mr-2" checked disabled />
                    <label htmlFor="iso">ISO 9001:2015</label>
                  </div>
                  
                  <div className="flex items-center">
                    <input type="checkbox" id="fair-trade" className="mr-2" checked disabled />
                    <label htmlFor="fair-trade">Fair Trade Certified</label>
                  </div>
                  
                  <div className="flex items-center">
                    <input type="checkbox" id="organic" className="mr-2" checked disabled />
                    <label htmlFor="organic">GOTS (Global Organic Textile Standard)</label>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button variant="outline">Manage Certifications</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="wallet">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="mb-6">
                <h3 className="font-medium text-lg mb-4">Blockchain Wallet</h3>
                
                {isConnected ? (
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="font-medium">Connected</span>
                    </div>
                    
                    <p className="mb-2">
                      <span className="text-sm font-medium text-gray-500 mr-2">Wallet Address:</span>
                      {walletAddress}
                    </p>
                    
                    <p className="text-sm text-gray-600 mt-4">
                      This wallet will be used to receive payments from buyers through the platform.
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-6 bg-gray-50 rounded-md">
                    <p className="text-gray-500 mb-4">Connect your blockchain wallet to receive payments</p>
                    <p className="text-sm text-gray-400 mb-6">Use the wallet button in the sidebar to connect</p>
                  </div>
                )}
              </div>
              
              <div className="border-t pt-6">
                <h3 className="font-medium text-lg mb-4">Traditional Banking Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium">Bank Name</label>
                    <p className="mt-1">State Bank of India</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Account Number</label>
                    <p className="mt-1">XXXX XXXX XXXX 5678</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">IFSC Code</label>
                    <p className="mt-1">SBIN0011223</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Account Type</label>
                    <p className="mt-1">Current</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button variant="outline">Update Banking Details</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default SellerProfile;
