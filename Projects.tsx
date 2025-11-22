import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Building2, Mail, Calendar, DollarSign, Clock, Phone, MapPin, Star } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Project {
  _id: string;
  requestId: string;
  title: string;
  category: string;
  description: string;
  budget: number;
  deadline: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  agentName: string;
  agentEmail: string;
  agentCompany: string;
  agentPhone?: string;
  agentExperience?: number;
  agentRating?: number;
  proposalMessage: string;
}

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Fetching projects with token:', token);

      const response = await fetch('http://localhost:5000/api/buyer/projects', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received projects data:', data);

      if (!Array.isArray(data)) {
        throw new Error('Invalid response format: expected an array of projects');
      }

      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to fetch projects');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800'
    };

    return (
      <Badge className={`${statusColors[status as keyof typeof statusColors]} capitalize`}>
        {status}
      </Badge>
    );
  };

  const getCategoryBadge = (category: string) => {
    const categoryColors = {
      goods: 'bg-purple-100 text-purple-800',
      textiles: 'bg-pink-100 text-pink-800',
      agro: 'bg-green-100 text-green-800'
    };

    return (
      <Badge className={`${categoryColors[category as keyof typeof categoryColors]} capitalize`}>
        {category}
      </Badge>
    );
  };

  const getRatingStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="flex items-center gap-1">
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        <span>{rating.toFixed(1)}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <DashboardLayout title="Active Projects" userType="buyer">
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <p>Loading projects...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Active Projects" userType="buyer">
      <div className="container mx-auto p-6">
        <div className="grid gap-6">
          {projects.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <p className="text-gray-500">No active projects found</p>
              </CardContent>
            </Card>
          ) : (
            projects.map((project) => (
              <Card key={project._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{project.title}</CardTitle>
                      <div className="flex gap-2 mt-2">
                        {getStatusBadge(project.status)}
                        {getCategoryBadge(project.category)}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Assigned Agent</p>
                      <p className="font-medium">{project.agentName}</p>
                      <p className="text-sm text-gray-500">{project.agentCompany}</p>
                      {getRatingStars(project.agentRating)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">Project Description</h3>
                      <p className="text-gray-600">{project.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <span>Budget: ${project.budget.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>Started: {new Date(project.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setSelectedProject(project);
                          setIsDetailsDialogOpen(true);
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* View Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Project Details</DialogTitle>
          </DialogHeader>
          {selectedProject && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold">Project Information</h3>
                <div className="space-y-2 mt-2">
                  <p><span className="font-medium">Title:</span> {selectedProject.title}</p>
                  <p><span className="font-medium">Category:</span> {selectedProject.category}</p>
                  <p><span className="font-medium">Description:</span> {selectedProject.description}</p>
                  <p><span className="font-medium">Budget:</span> ${selectedProject.budget.toLocaleString()}</p>
                  <p><span className="font-medium">Deadline:</span> {new Date(selectedProject.deadline).toLocaleDateString()}</p>
                  <p><span className="font-medium">Status:</span> {selectedProject.status}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold">Agent Information</h3>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-gray-500" />
                    <p>{selectedProject.agentCompany}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <p>{selectedProject.agentEmail}</p>
                  </div>
                  {selectedProject.agentPhone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <p>{selectedProject.agentPhone}</p>
                    </div>
                  )}
                  {selectedProject.agentExperience && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Experience:</span>
                      <p>{selectedProject.agentExperience} years</p>
                    </div>
                  )}
                  {selectedProject.agentRating && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Rating:</span>
                      {getRatingStars(selectedProject.agentRating)}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold">Accepted Proposal</h3>
                <p className="mt-2 text-gray-600">{selectedProject.proposalMessage}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
