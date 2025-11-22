import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Building2, Mail, Calendar, DollarSign, Clock } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Proposal {
  _id: string;
  requestId: string;
  agentId: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
  agentName: string;
  agentCompany: string;
  requestTitle: string;
  requestCategory: string;
  requestBudget: number;
}

export default function Proposals() {
  const { user } = useAuth();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:5000/api/buyer/proposals', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch proposals');
      }

      const data = await response.json();
      setProposals(data);
    } catch (error) {
      console.error('Error fetching proposals:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to fetch proposals');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptProposal = async (proposalId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`http://localhost:5000/api/proposals/${proposalId}/accept`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to accept proposal');
      }

      toast.success('Proposal accepted successfully');
      fetchProposals();
    } catch (error) {
      console.error('Error accepting proposal:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to accept proposal');
    }
  };

  const handleRejectProposal = async (proposalId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`http://localhost:5000/api/proposals/${proposalId}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to reject proposal');
      }

      toast.success('Proposal rejected successfully');
      fetchProposals();
    } catch (error) {
      console.error('Error rejecting proposal:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to reject proposal');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };

    return (
      <Badge className={`${statusColors[status as keyof typeof statusColors]} capitalize`}>
        {status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <DashboardLayout title="Proposals" userType="buyer">
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <p>Loading proposals...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Proposals" userType="buyer">
      <div className="container mx-auto p-6">
        <div className="grid gap-6">
          {proposals.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <p className="text-gray-500">No proposals found</p>
              </CardContent>
            </Card>
          ) : (
            proposals.map((proposal) => (
              <Card key={proposal._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{proposal.requestTitle}</CardTitle>
                      <div className="flex gap-2 mt-2">
                        {getStatusBadge(proposal.status)}
                        <Badge className="bg-purple-100 text-purple-800 capitalize">
                          {proposal.requestCategory}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">From</p>
                      <p className="font-medium">{proposal.agentName}</p>
                      <p className="text-sm text-gray-500">{proposal.agentCompany}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <p className="text-gray-600">{proposal.message}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <span>Budget: ${proposal.requestBudget.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>Received: {new Date(proposal.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setSelectedProposal(proposal);
                          setIsDetailsDialogOpen(true);
                        }}
                      >
                        View Details
                      </Button>
                      {proposal.status === 'pending' && (
                        <>
                          <Button 
                            variant="outline"
                            onClick={() => handleRejectProposal(proposal._id)}
                          >
                            Reject
                          </Button>
                          <Button 
                            onClick={() => handleAcceptProposal(proposal._id)}
                          >
                            Accept
                          </Button>
                        </>
                      )}
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
            <DialogTitle>Proposal Details</DialogTitle>
          </DialogHeader>
          {selectedProposal && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Request Title</h3>
                <p>{selectedProposal.requestTitle}</p>
              </div>
              <div>
                <h3 className="font-semibold">Proposal Message</h3>
                <p>{selectedProposal.message}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Budget</h3>
                  <p>${selectedProposal.requestBudget.toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Category</h3>
                  <p className="capitalize">{selectedProposal.requestCategory}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold">Agent Information</h3>
                <div className="space-y-2">
                  <p>Name: {selectedProposal.agentName}</p>
                  <p>Company: {selectedProposal.agentCompany}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
