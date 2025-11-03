'use client';

import { useState, useEffect } from 'react';
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
import { toast } from 'sonner';
import { Upload, Zap, Database, ArrowLeft, FileText, X } from 'lucide-react';

interface StepTwoProps {
  onPrevious: () => void;
  onNext: (data?: any) => void;
  stepOneData?: {
    workflowTitle: string;
    documentType: string;
  };
}

// MSA Document content
const msaDocumentContent = `**MASTER SERVICE AGREEMENT**

This Master Service Agreement ("Agreement") is entered into as of [Effective Date] by and between [Client Name], with its principal place of business at [Client Address] ("Client"), and [Service Provider Name], with its principal place of business at [Service Provider Address] ("Service Provider").

**1. Scope of Services**

1.1. The Service Provider agrees to perform the services ("Services") as described in the applicable Statements of Work ("SOW") issued under this Agreement.

**2. Term**

2.1. This Agreement shall commence on [Effective Date] and shall continue until terminated in accordance with Section 8 of this Agreement.

**3. Payment Terms**

3.1. The Client shall pay the Service Provider for the Services in accordance with the fees set forth in the applicable SOW.

3.2. Payment shall be due within sixty (60) days from the date of the invoice.

**4. Confidentiality**

4.1. Both parties agree to maintain the confidentiality of any proprietary or confidential information disclosed during the term of this Agreement.

**5. Intellectual Property Rights**

5.1. All intellectual property rights in any materials created or provided by the Service Provider in connection with the Services shall remain the property of the Service Provider, except as expressly set forth in the applicable SOW.

**6. Warranties**

6.1. The Service Provider warrants that the Services will be performed in a professional and workmanlike manner.

**7. Limitation of Liability**

7.1. Neither party shall be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with this Agreement.

**8. Termination**

8.1. Either party may terminate this Agreement or any SOW for convenience with thirty (30) days' written notice to the other party.

8.2. Either party may terminate this Agreement immediately if the other party breaches a material term of this Agreement and fails to cure the breach within fifteen (15) days of receiving notice of the breach.

**9. Governing Law**

9.1. This Agreement shall be governed by and construed in accordance with the laws of [State/Country].

**10. Miscellaneous**

10.1. This Agreement, together with any SOWs, constitutes the entire agreement between the parties and supersedes all prior agreements and understandings.

10.2. Any amendments to this Agreement must be in writing and signed by both parties.

IN WITNESS WHEREOF, the parties hereto have executed this Master Service Agreement as of the Effective Date.

_____________________________  
[Client Name]  
Authorized Signature  

_____________________________  
[Service Provider Name]  
Authorized Signature  `;

export default function StepTwo({
  onPrevious,
  onNext,
  stepOneData
}: StepTwoProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiSource, setApiSource] = useState('');
  const [contractId, setContractId] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [activeOption, setActiveOption] = useState<'upload' | 'ai' | 'api'>(
    'upload'
  );
  const [showGeneratedDocument, setShowGeneratedDocument] = useState(false);
  const [typedContent, setTypedContent] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  // Typewriter effect
  useEffect(() => {
    if (showGeneratedDocument && currentIndex < msaDocumentContent.length) {
      const timer = setTimeout(() => {
        setTypedContent(msaDocumentContent.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 2); // Adjust typing speed here (lower = faster)

      return () => clearTimeout(timer);
    } else if (
      showGeneratedDocument &&
      currentIndex >= msaDocumentContent.length
    ) {
      setIsTypingComplete(true);
    }
  }, [showGeneratedDocument, currentIndex]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if file is DOCX
      if (
        file.type !==
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document' &&
        !file.name.endsWith('.docx')
      ) {
        toast.error('Please select a DOCX file');
        return;
      }
      setSelectedFile(file);
      toast.success(`Selected: ${file.name}`);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a DOCX file first');
      return;
    }

    setIsUploading(true);
    try {
      // Simulate file upload process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Here you would typically upload to your backend
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('documentType', stepOneData?.documentType || '');
      formData.append('workflowTitle', stepOneData?.workflowTitle || '');

      // Mock API call
      console.log('Uploading file:', selectedFile.name);

      toast.success('Document uploaded and processed successfully!');

      // Proceed to next step with uploaded file data
      onNext({
        method: 'upload',
        file: selectedFile,
        fileName: selectedFile.name
      });
    } catch (error) {
      toast.error('Failed to upload document. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) {
      toast.error('Please enter a prompt for document generation');
      return;
    }

    setIsGenerating(true);
    try {
      // Simulate AI generation process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock AI generation
      console.log('Generating document with prompt:', aiPrompt);

      // Reset typing state
      setTypedContent('');
      setCurrentIndex(0);
      setIsTypingComplete(false);

      // Show the generated document with typewriter effect
      setShowGeneratedDocument(true);

      toast.success('Document generated successfully with AI!');
    } catch (error) {
      toast.error('Failed to generate document. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCloseDocument = () => {
    setShowGeneratedDocument(false);
    setTypedContent('');
    setCurrentIndex(0);
    setIsTypingComplete(false);
  };

  const handleUseGeneratedDocument = () => {
    // Proceed to next step with AI generated data
    onNext({
      method: 'ai',
      prompt: aiPrompt,
      generatedContent: msaDocumentContent,
      documentType: stepOneData?.documentType
    });
  };

  const handleApiFetch = async () => {
    if (!apiSource) {
      toast.error('Please select an API source');
      return;
    }
    if (!contractId.trim()) {
      toast.error('Please enter a Contract ID or search term');
      return;
    }

    setIsFetching(true);
    try {
      // Simulate API fetch process
      await new Promise((resolve) => setTimeout(resolve, 2500));

      // Mock API fetch
      console.log('Fetching from:', apiSource, 'with ID:', contractId);

      toast.success('Document fetched and processed successfully!');

      // Proceed to next step with API data
      onNext({
        method: 'api',
        source: apiSource,
        contractId: contractId,
        fetchedData: `Imported ${stepOneData?.documentType} from ${apiSource}`
      });
    } catch (error) {
      toast.error('Failed to fetch from API. Please try again.');
    } finally {
      setIsFetching(false);
    }
  };

  const apiSources = [
    'Ariba (Mock)',
    'SAP (Mock)',
    'Oracle (Mock)',
    'Salesforce (Mock)',
    'Custom API (Mock)'
  ];

  return (
    <div className='flex w-full justify-center bg-white'>
      {/* Generated Document Modal */}
      {showGeneratedDocument && (
        <div className='bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black'>
          <div className='max-h-[90vh] w-11/12 max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl'>
            <div className='flex items-center justify-between border-b p-4'>
              <h3 className='text-lg font-semibold'>AI Generated Document</h3>
              <Button
                variant='ghost'
                size='sm'
                onClick={handleCloseDocument}
                className='h-8 w-8 p-0'
              >
                <X className='h-4 w-4 cursor-pointer' />
              </Button>
            </div>
            <div className='max-h-[calc(90vh-80px)] overflow-y-auto px-6'>
              <div className='prose max-w-none'>
                <pre className='pt-6 pb-3 font-sans text-sm whitespace-pre-wrap'>
                  {typedContent}
                  {!isTypingComplete && (
                    <span className='ml-1 animate-pulse'>|</span>
                  )}
                </pre>
              </div>
              <div className='flex justify-end gap-3 border-t py-4'>
                <Button
                  variant='outline'
                  onClick={handleCloseDocument}
                  className='cursor-pointer'
                >
                  Close
                </Button>
                <Button
                  onClick={handleUseGeneratedDocument}
                  disabled={!isTypingComplete}
                  className='cursor-pointer'
                >
                  Use This Document
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Card className='w-full'>
        <CardContent className='space-y-6 px-6'>
          {/* Header */}
          <div className='space-y-2'>
            <h2 className='text-xl font-semibold'>
              Upload DOCX, Generate with AI, or Import from API
            </h2>
            {stepOneData && (
              <p className='text-muted-foreground text-sm'>
                Selected Document Type:{' '}
                <strong>{stepOneData.documentType}</strong>
                {stepOneData.workflowTitle && (
                  <>
                    {' '}
                    | Workflow: <strong>{stepOneData.workflowTitle}</strong>
                  </>
                )}
              </p>
            )}
          </div>

          <div className='grid gap-6 md:grid-cols-2'>
            {/* Option 1: Upload DOCX */}
            <Card>
              <CardContent className='px-4'>
                <div className='mb-4 flex items-center gap-2'>
                  <Upload className='text-primary h-5 w-5' />
                  <h3 className='font-semibold'>
                    Option 1: Upload DOCX Document
                  </h3>
                </div>

                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <Label className='text-sm font-medium'>
                      Select Docx File:
                    </Label>
                    <div className='rounded-lg border-2 border-dashed border-gray-300 p-4 text-center'>
                      <Input
                        type='file'
                        accept='.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                        onChange={handleFileSelect}
                        className='hidden'
                        id='file-upload'
                      />
                      <Label
                        htmlFor='file-upload'
                        className='block cursor-pointer'
                      >
                        <div className='flex flex-col items-center gap-2'>
                          <FileText className='h-8 w-8 text-gray-400' />
                          <span className='text-sm font-medium'>
                            Choose File
                          </span>
                          <span className='text-muted-foreground text-xs'>
                            {selectedFile
                              ? selectedFile.name
                              : 'No file chosen'}
                          </span>
                        </div>
                      </Label>
                    </div>
                  </div>

                  <Button
                    onClick={handleUpload}
                    disabled={!selectedFile || isUploading}
                    className='w-full cursor-pointer'
                    onClickCapture={() => setActiveOption('upload')}
                  >
                    {isUploading ? (
                      <>
                        <div className='mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white' />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Upload className='mr-2 h-4 w-4' />
                        Upload & Process File
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Option 2: Generate with AI */}
            <Card>
              <CardContent className='px-4'>
                <div className='mb-4 flex items-center gap-2'>
                  <Zap className='h-5 w-5 text-yellow-500' />
                  <h3 className='font-semibold'>
                    Option 2: Generate Document with AI
                  </h3>
                </div>

                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <Label className='text-sm font-medium'>
                      Enter your Promt for document generation:
                    </Label>
                    <Textarea
                      placeholder='e.g., Generate a standard SOW for software development services including sections for Scope, Timeline, and Payment Terms.'
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      className='min-h-[120px] resize-none'
                      onClick={() => setActiveOption('ai')}
                    />
                  </div>

                  <Button
                    onClick={handleAIGenerate}
                    disabled={!aiPrompt.trim() || isGenerating}
                    className='w-full bg-yellow-600 hover:bg-yellow-700 cursor-pointer'
                  >
                    {isGenerating ? (
                      <>
                        <div className='mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white' />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Zap className='mr-2 h-4 w-4' />
                        Generate with AI
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className=''>
            {/* Option 3: Import from API */}
            <Card>
              <CardContent className='px-4'>
                <div className='mb-4 flex items-center gap-2'>
                  <Database className='h-5 w-5 text-green-500' />
                  <h3 className='font-semibold'>
                    Option 3: Import from API & Process
                  </h3>
                </div>

                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <Label className='text-sm font-medium'>
                      Select api source (mock):
                    </Label>
                    <Select value={apiSource} onValueChange={setApiSource}>
                      <SelectTrigger onClick={() => setActiveOption('api')}>
                        <SelectValue placeholder='Select API source' />
                      </SelectTrigger>
                      <SelectContent>
                        {apiSources.map((source) => (
                          <SelectItem key={source} value={source}>
                            {source}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='space-y-2'>
                    <Label className='text-sm font-medium'>
                      Enter contract id / API search term:
                    </Label>
                    <Input
                      placeholder='e.g., Contract-12345 or Project Phoenix SOW'
                      value={contractId}
                      onChange={(e) => setContractId(e.target.value)}
                      onClick={() => setActiveOption('api')}
                    />
                  </div>

                  <Button
                    onClick={handleApiFetch}
                    disabled={!apiSource || !contractId.trim() || isFetching}
                    className='w-full bg-green-600 hover:bg-green-700 cursor-pointer'
                  >
                    {isFetching ? (
                      <>
                        <div className='mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white' />
                        Fetching...
                      </>
                    ) : (
                      <>
                        <Database className='mr-2 h-4 w-4' />
                        Fetch & Process with AI
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Navigation */}
          <div className='flex justify-end gap-3 pt-2'>
            {/* <Button
              variant='outline'
              onClick={onPrevious}
              className='cursor-pointer'
            >
              Previous
            </Button> */}

            <Button className='cursor-pointer' onClick={() => onNext({})}>
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
