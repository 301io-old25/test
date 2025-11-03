'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  UserCheck,
  AlertCircle
} from 'lucide-react';

interface StepFourProps {
  onPrevious: () => void;
  onNext: (data?: any) => void;
  stepData?: {
    workflowTitle: string;
    documentType: string;
    method: string;
    generatedContent?: string;
  };
}

interface DocumentSection {
  id: string;
  title: string;
  status: 'Pending_Review' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED';
  originalContent: string;
  editableContent: string;
  assignedReviewer: string | null;
  reviewerComments?: string;
  adminComments?: string;
}

export default function StepFour({
  onPrevious,
  onNext,
  stepData
}: StepFourProps) {
  const [sections, setSections] = useState<DocumentSection[]>([
    {
      id: '1',
      title: 'MASTER SERVICE AGREEMENT',
      status: 'Pending_Review',
      originalContent:
        'This Master Service Agreement ("Agreement") is entered into as of [Effective Date] ("Effective Date"), by and between [Client Name], with its principal place of business at [Client Address] ("Client"), and [Service Provider Name], with its principal place of business at [Service Provider Address] ("Service Provider"). Client and Service Provider may be referred to individually as a "Party" and collectively as the "Parties."',
      editableContent:
        'This Master Service Agreement ("Agreement") is executed as of [Effective Date] ("Effective Date"), by and between [Client Name], whose principal place of business is located at [Client Address] ("Client"), and [Service Provider Name], whose principal place of business is located at [Service Provider Address] ("Service Provider"). The Client and the Service Provider may be individually referred to as a "Party" and collectively as the "Parties."',
      assignedReviewer: '1',
      reviewerComments: 'View reviewer comments below',
      adminComments: 'Admin comments here...'
    },
    {
      id: '2',
      title: 'Scope of Services',
      status: 'Pending_Review',
      originalContent:
        'The Service Provider agrees to perform the services ("Services") as described in the applicable Statements of Work ("SOW") issued under this Agreement. Each SOW shall be subject to the terms and conditions of this Agreement.',
      editableContent:
        'The Service Provider agrees to perform the services ("Services") as described in the applicable Statements of Work ("SOW") issued under this Agreement. Each SOW shall be subject to the terms and conditions of this Agreement.',
      assignedReviewer: null,
      reviewerComments: 'No comments yet',
      adminComments: 'Waiting for reviewer feedback'
    },
    {
      id: '3',
      title: 'Term and Termination',
      status: 'Pending_Review',
      originalContent:
        'This Agreement shall commence on the Effective Date and shall continue until terminated in accordance with this Section. Either party may terminate this Agreement for cause upon 30 days written notice of a material breach, if such breach remains uncured at the expiration of such period.',
      editableContent:
        'This Agreement shall commence on the Effective Date and shall continue until terminated in accordance with this Section. Either party may terminate this Agreement for cause upon 30 days written notice of a material breach, if such breach remains uncured at the expiration of such period.',
      assignedReviewer: null,
      reviewerComments: 'No comments yet',
      adminComments: 'Waiting for reviewer feedback'
    },
    {
      id: '4',
      title: 'Payment Terms',
      status: 'Pending_Review',
      originalContent:
        'Client shall pay Service Provider for the Services in accordance with the fees set forth in the applicable SOW. All invoices shall be paid within 30 days of receipt. Late payments shall bear interest at the rate of 1.5% per month.',
      editableContent:
        'Client shall pay Service Provider for the Services in accordance with the fees set forth in the applicable SOW. All invoices shall be paid within 30 days of receipt. Late payments shall bear interest at the rate of 1.5% per month.',
      assignedReviewer: null
    },
    {
      id: '5',
      title: 'Confidentiality',
      status: 'Pending_Review',
      originalContent:
        'Each party agrees that during the term of this Agreement and thereafter, it shall not use or disclose any confidential information of the other party except as expressly permitted herein. The obligations in this Section shall survive termination of this Agreement.',
      editableContent:
        'Each party agrees that during the term of this Agreement and thereafter, it shall not use or disclose any confidential information of the other party except as expressly permitted herein. The obligations in this Section shall survive termination of this Agreement.',
      assignedReviewer: null
    },
    {
      id: '6',
      title: 'Intellectual Property Rights',
      status: 'Pending_Review',
      originalContent:
        "Service Provider shall retain all right, title and interest in and to any pre-existing intellectual property. Client shall own all deliverables specifically developed for Client under this Agreement, subject to Service Provider's retention of rights in its pre-existing intellectual property.",
      editableContent:
        "Service Provider shall retain all right, title and interest in and to any pre-existing intellectual property. Client shall own all deliverables specifically developed for Client under this Agreement, subject to Service Provider's retention of rights in its pre-existing intellectual property.",
      assignedReviewer: null
    },
    {
      id: '7',
      title: 'Limitation of Liability',
      status: 'Pending_Review',
      originalContent:
        'In no event shall either party be liable for any indirect, special, incidental, or consequential damages, however caused, whether in contract, tort, or otherwise. The total cumulative liability of either party shall not exceed the fees paid by Client to Service Provider under this Agreement.',
      editableContent:
        'In no event shall either party be liable for any indirect, special, incidental, or consequential damages, however caused, whether in contract, tort, or otherwise. The total cumulative liability of either party shall not exceed the fees paid by Client to Service Provider under this Agreement.',
      assignedReviewer: null
    },
    {
      id: '8',
      title: 'General Provisions',
      status: 'Pending_Review',
      originalContent:
        'This Agreement constitutes the entire agreement between the parties and supersedes all prior agreements. This Agreement may only be amended in writing signed by both parties. The parties are independent contractors and this Agreement does not create a partnership.',
      editableContent:
        'This Agreement constitutes the entire agreement between the parties and supersedes all prior agreements. This Agreement may only be amended in writing signed by both parties. The parties are independent contractors and this Agreement does not create a partnership.',
      assignedReviewer: null
    }
  ]);

  const [expandedSection, setExpandedSection] = useState<string | null>('1');
  const [adminComments, setAdminComments] = useState<{ [key: string]: string }>(
    {}
  );

  const reviewers = [
    { id: '1', name: 'John Smith - Legal Department' },
    { id: '2', name: 'Sarah Johnson - Compliance' },
    { id: '3', name: 'Mike Chen - Business Operations' }
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const handleAdminCommentChange = (sectionId: string, comment: string) => {
    setAdminComments((prev) => ({
      ...prev,
      [sectionId]: comment
    }));
  };

  const handleSaveAdminComment = (sectionId: string) => {
    const updatedSections = sections.map((section) =>
      section.id === sectionId
        ? {
            ...section,
            adminComments: adminComments[sectionId] || section.adminComments
          }
        : section
    );
    setSections(updatedSections);
    toast.success('Admin comment saved successfully!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending_Review':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'IN_REVIEW':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'APPROVED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getReviewerName = (reviewerId: string | null) => {
    if (!reviewerId) return null;
    return reviewers.find((r) => r.id === reviewerId)?.name || null;
  };

  return (
    <div className='flex w-full justify-center bg-white'>
      <Card className='w-full rounded-2xl shadow-md'>
        <CardContent className='space-y-3 px-6'>
          {/* Header */}
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <h2 className='text-xl font-semibold'>
                Review & Admin Evaluation
              </h2>
            </div>
            {stepData && (
              <p className='text-muted-foreground text-sm'>
                Document: <strong>{stepData.documentType}</strong>
                {stepData.workflowTitle && (
                  <>
                    {' '}
                    | Workflow: <strong>{stepData.workflowTitle}</strong>
                  </>
                )}
              </p>
            )}
          </div>

          {/* Sections Accordion */}
          <div className='space-y-2'>
            {sections.map((section) => {
              const assignedReviewerName = getReviewerName(
                section.assignedReviewer
              );
              const isExpanded = expandedSection === section.id;

              return (
                <Card key={section.id} className='border-2 border-gray-200'>
                  <CardContent className='p-0'>
                    {/* Accordion Header */}
                    <div
                      className='flex cursor-pointer items-center justify-between px-4 hover:bg-gray-50'
                      onClick={() => toggleSection(section.id)}
                    >
                      <div className='flex items-center gap-4'>
                        <div className='flex items-center gap-3'>
                          {isExpanded ? (
                            <ChevronUp className='h-4 w-4 text-gray-500' />
                          ) : (
                            <ChevronDown className='h-4 w-4 text-gray-500' />
                          )}
                          <h3 className='text-lg font-semibold'>
                            {section.title}
                          </h3>
                        </div>
                        <Badge
                          variant='secondary'
                          className={`${getStatusColor(section.status)} border`}
                        >
                          {section.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className='flex items-center gap-2'>
                        {assignedReviewerName && (
                          <Badge variant='outline' className='text-xs'>
                            <UserCheck className='mr-1 h-3 w-3' />
                            {assignedReviewerName}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Accordion Content */}
                    {isExpanded && (
                      <div className='space-y-6 border-t border-gray-200 p-6'>
                        {/* Two Column Layout */}
                        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                          {/* Left Column - Original Content */}
                          <div className='space-y-4'>
                            <div className='space-y-3'>
                              <h4 className='flex items-center gap-2 text-sm font-semibold'>
                                <MessageSquare className='h-4 w-4' />
                                Original Content:
                              </h4>
                              <Card className='bg-gray-50'>
                                <CardContent className='p-4'>
                                  <div className='text-sm whitespace-pre-wrap text-gray-700'>
                                    {section.originalContent}
                                  </div>
                                </CardContent>
                              </Card>
                            </div>

                            {/* Reviewer Comments */}
                            <div className='space-y-3'>
                              <h4 className='flex items-center gap-2 text-sm font-semibold'>
                                <UserCheck className='h-4 w-4' />
                                Reviewer Comments:
                              </h4>
                              <Card>
                                <CardContent className='px-4'>
                                  <div className='text-sm text-gray-600'>
                                    {section.reviewerComments}
                                  </div>
                                  <div className='text-muted-foreground mt-2 text-xs'>
                                    Reviewer status:{' '}
                                    {section.status.replace('_', ' ')}.
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          </div>

                          {/* Right Column - Current Version & Admin Evaluation */}
                          <div className='space-y-4'>
                            <div className='space-y-3'>
                              <h4 className='text-sm font-semibold'>
                                Current Version for Review:
                              </h4>
                              <Card>
                                <CardContent className='p-4'>
                                  <div className='text-sm whitespace-pre-wrap text-gray-700'>
                                    {section.editableContent}
                                  </div>
                                </CardContent>
                              </Card>
                            </div>

                            {/* Admin Evaluation */}
                            <div className='space-y-3'>
                              <h4 className='flex items-center gap-2 text-sm font-semibold'>
                                <AlertCircle className='h-4 w-4' />
                                Admin Evaluation:
                              </h4>
                              <Card>
                                <CardContent className='space-y-3 px-4'>
                                  <div className='space-y-2'>
                                    <label className='text-sm font-medium'>
                                      Admin Comments:
                                    </label>
                                    <Textarea
                                      value={
                                        adminComments[section.id] ||
                                        section.adminComments ||
                                        ''
                                      }
                                      onChange={(e) =>
                                        handleAdminCommentChange(
                                          section.id,
                                          e.target.value
                                        )
                                      }
                                      placeholder='Enter your admin comments here...'
                                      className='resize-none text-sm'
                                    />
                                  </div>
                                  <Button
                                    onClick={() =>
                                      handleSaveAdminComment(section.id)
                                    }
                                    size='sm'
                                    className='w-full'
                                  >
                                    Save Admin Comments
                                  </Button>
                                  <div className='text-muted-foreground text-center text-xs'>
                                    {section.status === 'Pending_Review'
                                      ? 'Admin action not yet applicable. Reviewer must complete their evaluation first or section is locked.'
                                      : 'Ready for admin evaluation.'}
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Navigation */}
          <div className='flex justify-end pt-6'>
            <Button
              onClick={() => onNext({ sections, adminComments })}
              className='cursor-pointer'
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
