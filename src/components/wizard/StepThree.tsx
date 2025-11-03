'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ArrowLeft, Edit, Save, Users, Lightbulb } from 'lucide-react';

interface StepThreeProps {
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
}

export default function StepThree({
  onPrevious,
  onNext,
  stepData
}: StepThreeProps) {
  const [sections, setSections] = useState<DocumentSection[]>([
    {
      id: '1',
      title: 'MASTER SERVICE AGREEMENT',
      status: 'Pending_Review',
      originalContent:
        'This Master Service Agreement ("Agreement") is entered into as of [Effective Date] ("Effective Date"), by and between [Client Name], with its principal place of business at [Client Address] ("Client"), and [Service Provider Name], with its principal place of business at [Service Provider Address] ("Service Provider"). Client and Service Provider may be referred to individually as a "Party" and collectively as the "Parties."',
      editableContent:
        'This Master Service Agreement ("Agreement") is executed as of [Effective Date] ("Effective Date"), by and between [Client Name], whose principal place of business is located at [Client Address] ("Client"), and [Service Provider Name], whose principal place of business is located at [Service Provider Address] ("Service Provider"). The Client and the Service Provider may be individually referred to as a "Party" and collectively as the "Parties."',
      assignedReviewer: null
    },
    {
      id: '2',
      title: 'Scope of Services',
      status: 'Pending_Review',
      originalContent:
        'The Service Provider agrees to perform the services ("Services") as described in the applicable Statements of Work ("SOW") issued under this Agreement. Each SOW shall be subject to the terms and conditions of this Agreement.',
      editableContent:
        'The Service Provider agrees to perform the services ("Services") as described in the applicable Statements of Work ("SOW") issued under this Agreement. Each SOW shall be subject to the terms and conditions of this Agreement.',
      assignedReviewer: null
    },
    {
      id: '3',
      title: 'Term and Termination',
      status: 'Pending_Review',
      originalContent:
        'This Agreement shall commence on the Effective Date and shall continue until terminated in accordance with this Section. Either party may terminate this Agreement for cause upon 30 days written notice of a material breach, if such breach remains uncured at the expiration of such period.',
      editableContent:
        'This Agreement shall commence on the Effective Date and shall continue until terminated in accordance with this Section. Either party may terminate this Agreement for cause upon 30 days written notice of a material breach, if such breach remains uncured at the expiration of such period.',
      assignedReviewer: null
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

  const [selectedSection, setSelectedSection] =
    useState<DocumentSection | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string>('');
  const reviewers = [
    { id: '1', name: 'John Smith - Legal Department' },
    { id: '2', name: 'Sarah Johnson - Compliance' },
    { id: '3', name: 'Mike Chen - Business Operations' },
    { id: '4', name: 'Emily Davis - Finance' },
    { id: '5', name: 'David Wilson - Executive' }
  ];

  const handleSectionClick = (section: DocumentSection) => {
    setSelectedSection(section);
    setEditedContent(section.editableContent);
    setIsEditing(false);
  };

  const handleBackToList = () => {
    setSelectedSection(null);
    setIsEditing(false);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = () => {
    if (!selectedSection) return;

    const updatedSections = sections.map((section) =>
      section.id === selectedSection.id
        ? { ...section, editableContent: editedContent }
        : section
    );

    setSections(updatedSections);
    setSelectedSection({ ...selectedSection, editableContent: editedContent });
    setIsEditing(false);
    toast.success('Changes saved successfully!');
  };

  const handleAssignReviewer = (reviewerId: string) => {
    if (!selectedSection) return;

    const reviewer = reviewers.find((r) => r.id === reviewerId);
    const updatedSections = sections.map((section) =>
      section.id === selectedSection.id
        ? { ...section, assignedReviewer: reviewerId } // Store the ID instead of name
        : section
    );

    setSections(updatedSections);
    setSelectedSection({
      ...selectedSection,
      assignedReviewer: reviewerId // Store the ID instead of name
    });
    toast.success(`Reviewer assigned: ${reviewer?.name}`);
  };

  const handleGetSuggestion = () => {
    if (!selectedSection) return;

    // Simulate AI suggestion - in real app, this would call an API
    const suggestion = selectedSection.originalContent
      .replace('entered into', 'executed')
      .replace('by and between', 'between')
      .replace(
        'with its principal place of business at',
        'whose principal place of business is located at'
      );

    setAiSuggestion(suggestion);
    toast.info('AI suggestion generated!');
  };

  // Add function to accept AI suggestion
  const handleAcceptSuggestion = () => {
    if (!aiSuggestion) return;

    setEditedContent(aiSuggestion);
    setAiSuggestion('');
    toast.success('AI suggestion accepted!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending_Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'IN_REVIEW':
        return 'bg-blue-100 text-blue-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const highlightDifferences = (original: string, editable: string) => {
    if (original === editable) return editable;

    const originalWords = original.split(/\s+/);
    const editableWords = editable.split(/\s+/);

    let highlightedContent = [];
    let i = 0,
      j = 0;

    while (i < editableWords.length || j < originalWords.length) {
      if (
        i < editableWords.length &&
        j < originalWords.length &&
        editableWords[i] === originalWords[j]
      ) {
        // Words match, add without highlight
        highlightedContent.push(editableWords[i]);
        i++;
        j++;
      } else {
        // Words don't match, highlight the editable word
        if (i < editableWords.length) {
          highlightedContent.push(
            `<mark class="bg-yellow-200 px-1 rounded">${editableWords[i]}</mark>`
          );
          i++;
        }
        // Skip original words that don't match
        if (j < originalWords.length) {
          j++;
        }
      }
    }

    return highlightedContent.join(' ');
  };

  // Get reviewer name by ID
  const getReviewerName = (reviewerId: string | null) => {
    if (!reviewerId) return null;
    return reviewers.find((r) => r.id === reviewerId)?.name || null;
  };

  if (selectedSection) {
    const assignedReviewerName = getReviewerName(
      selectedSection.assignedReviewer
    );

    return (
      <div className='flex w-full justify-center bg-white'>
        <Card className='w-full rounded-2xl shadow-md'>
          <CardContent className='space-y-6 p-6'>
            {/* Header */}
            <div className='flex items-center justify-between'>
              <div className='space-y-1'>
                <h2 className='text-xl font-semibold'>
                  {selectedSection.title}{' '}
                  <span className='text-sm'>
                    * STATUS: {selectedSection.status}
                  </span>
                </h2>
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
              <Button
                variant='outline'
                onClick={handleBackToList}
                className='cursor-pointer'
              >
                <ArrowLeft className='mr-2 h-4 w-4' />
                Back to List
              </Button>
            </div>

            <div className='grid gap-6 lg:grid-cols-2'>
              {/* Left Column - Original Content */}
              <div className='space-y-4'>
                <h3 className='font-semibold'>Original Content:</h3>
                <Card>
                  <CardContent className='p-3'>
                    <div className='text-muted-foreground text-sm whitespace-pre-wrap'>
                      {selectedSection.originalContent}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Editable Content */}
              <div className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <h3 className='font-semibold'>
                    Editable Content (Current Version):
                  </h3>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={handleEditToggle}
                    className='cursor-pointer'
                  >
                    <Edit className='mr-2' />
                    {isEditing ? 'Cancel Edit' : 'Edit Content'}
                  </Button>
                </div>

                <Card>
                  <CardContent className='px-4'>
                    {isEditing ? (
                      <div className='space-y-3'>
                        <Textarea
                          value={editedContent}
                          onChange={(e) => setEditedContent(e.target.value)}
                          className='resize-none text-sm'
                          placeholder='Edit the content here...'
                        />

                        {/* AI Suggestion Section */}
                        {aiSuggestion && (
                          <div className='rounded border-l-4 border-blue-500 bg-blue-50 p-3'>
                            <div className='mb-2 flex items-center justify-between'>
                              <h4 className='flex items-center gap-2 font-semibold text-blue-900'>
                                <Lightbulb className='h-4 w-4' />
                                AI Suggestion
                              </h4>
                              <Button
                                size='sm'
                                onClick={handleAcceptSuggestion}
                                className='h-8 cursor-pointer'
                              >
                                Accept
                              </Button>
                            </div>
                            <div
                              className='rounded border bg-white p-2 text-sm text-blue-800'
                              dangerouslySetInnerHTML={{
                                __html: highlightDifferences(
                                  selectedSection.originalContent,
                                  aiSuggestion
                                )
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div
                        className='rounded border bg-white p-2 text-sm whitespace-pre-wrap'
                        dangerouslySetInnerHTML={{
                          __html: highlightDifferences(
                            selectedSection.originalContent,
                            selectedSection.editableContent
                          )
                        }}
                      />
                    )}
                  </CardContent>
                </Card>

                {isEditing ? (
                  <div className='flex gap-3'>
                    <Button
                      onClick={handleSaveChanges}
                      className='flex-1 cursor-pointer'
                    >
                      <Save className='mr-2 h-4 w-4' />
                      Save Changes to Editable Content
                    </Button>
                    <Button
                      variant='outline'
                      onClick={handleGetSuggestion}
                      className='cursor-pointer'
                    >
                      <Lightbulb className='mr-2 h-4 w-4' />
                      Get Suggestion
                    </Button>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
            {/* Assign Reviewer Section */}
            <div className='space-y-2'>
              <h3 className='font-semibold'>Assign Reviewer:</h3>
              <Card>
                <CardContent className='px-4'>
                  <Select
                    value={selectedSection.assignedReviewer || ''}
                    onValueChange={handleAssignReviewer}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='- Unassigned -'>
                        {assignedReviewerName || '- Unassigned -'}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {reviewers.map((reviewer) => (
                        <SelectItem key={reviewer.id} value={reviewer.id}>
                          {reviewer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className='text-muted-foreground mt-2 text-sm'>
                    {assignedReviewerName ? (
                      <span className='text-green-600'>
                        Assigned to: {assignedReviewerName}
                      </span>
                    ) : (
                      'Not assigned'
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* Navigation */}
            <div className='flex justify-end gap-3 pt-4'>
              <Button
                variant='outline'
                onClick={handleBackToList}
                className='cursor-pointer'
              >
                Back to List
              </Button>
              <Button
                onClick={() => onNext({ sections })}
                className='cursor-pointer'
              >
                Next Step
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='flex w-full justify-center bg-white'>
      <Card className='w-full rounded-2xl shadow-md'>
        <CardContent className='space-y-6 px-6'>
          {/* Header */}
          <div className='space-y-2'>
            <h2 className='text-xl font-semibold'>
              Compare, Edit & Assign for Review
            </h2>
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

          {/* Sections List */}
          <div className='space-y-2'>
            {sections.map((section, index) => {
              const sectionReviewerName = getReviewerName(
                section.assignedReviewer
              );

              return (
                <Card
                  key={section.id}
                  className='cursor-pointer transition-colors hover:bg-gray-50'
                  onClick={() => handleSectionClick(section)}
                >
                  <CardContent className='px-4'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-4'>
                        <span className='text-muted-foreground text-sm font-medium'>
                          {index + 1}.
                        </span>
                        <div>
                          <h3 className='font-semibold'>{section.title}</h3>
                          <div className='mt-1 flex items-center gap-2'>
                            <Badge
                              variant='secondary'
                              className={getStatusColor(section.status)}
                            >
                              {section.status}
                            </Badge>
                            {sectionReviewerName && (
                              <Badge variant='outline' className='text-xs'>
                                <Users className='mr-1 h-3 w-3' />
                                {sectionReviewerName}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Edit className='text-muted-foreground h-4 w-4' />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Navigation */}
          <div className='flex justify-end gap-3 pt-4'>
            <Button className='cursor-pointer' onClick={() => onNext({})}>
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
