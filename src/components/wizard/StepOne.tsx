'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { toast } from 'sonner';
import { z } from 'zod';
import {
  FormFieldConfig,
  ReusableFormSheet
} from '../drawer/add-fields-drawer';
import { Plus } from 'lucide-react';
import { Separator } from '../ui/separator';

// Fixed upload schema for file uploads
const uploadProspectSchema = z.object({
  documentName: z.string().min(1, 'Document name is required'),
  file: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, 'File is required')
    .refine(
      (files) => files[0].size <= 5 * 1024 * 1024,
      'File size must be less than 5MB'
    )
    .refine(
      (files) =>
        [
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'text/csv'
        ].includes(files[0].type),
      'Only CSV and Excel files are allowed'
    )
});

// Alternative schema if FileList causes issues:
// const uploadProspectSchema = z.object({
//   documentName: z.string().min(1, 'Document name is required'),
//   file: z.any()
//     .refine((file) => file && file.length > 0, 'File is required')
//     .refine((file) => file[0].size <= 5 * 1024 * 1024, 'File size must be less than 5MB')
//     .refine(
//       (file) =>
//         ['application/vnd.ms-excel',
//          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//          'text/csv',
//          'application/vnd.ms-excel.sheet.binary.macroEnabled.12',
//          'application/vnd.ms-excel.sheet.macroEnabled.12'].includes(file[0].type) ||
//         file[0].name.endsWith('.csv') ||
//         file[0].name.endsWith('.xlsx') ||
//         file[0].name.endsWith('.xls'),
//       'Only CSV and Excel files are allowed'
//     )
// });

export default function StepOne({ onNext }: { onNext: (data?: any) => void }) {
  const [workflowTitle, setWorkflowTitle] = useState('');
  const [documentType, setDocumentType] = useState('MSA');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isUploadSheetOpen, setIsUploadSheetOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadLeadTypes, setUploadLeadTypes] = useState<any[]>([]);
  const [popupCampaigns, setPopupCampaigns] = useState<any[]>([]);
  const [popupSubjects, setPopupSubjects] = useState<any[]>([]);
  const [sheetSelectedCompanyId, setSheetSelectedCompanyId] = useState<
    number | null
  >(null);
  const [sheetSelectedCampaignId, setSheetSelectedCampaignId] = useState<
    number | null
  >(null);

  // Mock data - replace with actual API calls
  const mockCompanies = [
    { companyId: 1, companyName: 'Company A' },
    { companyId: 2, companyName: 'Company B' }
  ];

  const mockLeadTypes = [
    { leadTypeId: 1, leadTypeName: 'Hot Lead' },
    { leadTypeId: 2, leadTypeName: 'Warm Lead' },
    { leadTypeId: 3, leadTypeName: 'Cold Lead' }
  ];

  const handleCloseSheet = () => setIsSheetOpen(false);
  const handleCloseUploadSheet = () => {
    setIsUploadSheetOpen(false);
    setPopupCampaigns([]);
    setPopupSubjects([]);
    setSheetSelectedCompanyId(null);
    setSheetSelectedCampaignId(null);
  };

  const handleOpenUploadSheet = () => setIsUploadSheetOpen(true);

  // Fixed upload prospect form fields with proper file upload configuration
  const uploadProspectList: FormFieldConfig[] = [
    {
      name: 'documentName',
      label: 'Document Name',
      type: 'text',
      placeholder: 'Enter document name'
    },
    {
      name: 'file',
      label: 'Upload File',
      type: 'file',
      placeholder: 'Choose file to upload',
      accept: '.csv,.xlsx,.xls',
      fileSize: 5 * 1024 * 1024 // 5MB (increased from 1MB)
      // Remove the disabled condition as it might interfere with file selection
      // disabled: (watchedFields) => !watchedFields.subjectId || !watchedFields.leadTypeId
    }
  ];

  const handleFormSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      console.log('Form submitted:', data);
      toast.success('Document type created successfully!');
      handleCloseSheet();
    } catch (err: any) {
      toast.error(err.message || 'Unexpected error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUploadSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      console.log('Upload data:', data);

      // Validate file exists
      if (!data.file || data.file.length === 0) {
        toast.error('Please select a file to upload');
        return;
      }

      const file = data.file[0];
      console.log('File details:', {
        name: file.name,
        type: file.type,
        size: file.size
      });

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentName', data.documentName);
      formData.append('documentType', documentType);

      // Simulate API call - replace with actual API
      console.log('Uploading file...', formData);

      // Example of actual API call:
      // const response = await fetch('/api/upload-document', {
      //   method: 'POST',
      //   body: formData,
      // });

      // if (!response.ok) {
      //   throw new Error('Upload failed');
      // }

      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success('Document uploaded successfully!');
      handleCloseUploadSheet();

      // Optionally update the document type selection
      setDocumentType(data.documentName);
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload document');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (!workflowTitle.trim()) {
      toast.error('Please enter a workflow title');
      return;
    }

    const stepData = {
      workflowTitle,
      documentType
    };

    onNext(stepData);
  };

  const handleUpdateTitle = () => {
    if (!workflowTitle.trim()) {
      toast.error('Please enter a workflow title');
      return;
    }
    toast.success('Workflow title updated successfully!');
  };

  return (
    <div className='flex w-full justify-center bg-white'>
      <Card className='w-full rounded-2xl shadow-md'>
        <CardContent className='space-y-6 px-6'>
          <h2 className='text-xl font-semibold'>
            Select Document Type & Name Your Workflow
          </h2>

          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='workflow-title' className='text-sm font-medium'>
                Workflow Title
              </Label>
              <Input
                id='workflow-title'
                placeholder='Enter workflow title'
                value={workflowTitle}
                onChange={(e) => setWorkflowTitle(e.target.value)}
                className='rounded-md'
              />
            </div>

            <div>
              <div className='space-y-2'>
                <Label htmlFor='document-type' className='text-sm font-medium'>
                  Document Type
                </Label>
                <div className='flex items-center gap-3'>
                  <Select value={documentType} onValueChange={setDocumentType}>
                    <SelectTrigger
                      id='document-type'
                      className='w-full cursor-pointer rounded-sm'
                    >
                      <SelectValue placeholder='Select document type' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='MSA'>
                        MSA (Master Service Agreement)
                      </SelectItem>
                      <SelectItem value='NDA'>
                        NDA (Non Disclosure Agreement)
                      </SelectItem>
                      <SelectItem value='SOW'>
                        SOW (Statement of Work)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <div className='flex gap-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={handleOpenUploadSheet}
                      className='cursor-pointer text-xs'
                    >
                      <Plus className='mr-1 h-4 w-4' /> Create Document Type
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='flex justify-end gap-3 pt-4'>
            <Button
              variant='secondary'
              className='cursor-pointer rounded-sm px-6'
              onClick={handleUpdateTitle}
            >
              Update Title
            </Button>
            <Button
              className='cursor-pointer rounded-sm px-6'
              onClick={handleNext}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upload Document Form Sheet */}
      <ReusableFormSheet
        isOpen={isUploadSheetOpen}
        onClose={handleCloseUploadSheet}
        title='Create New Document Type'
        description='Enter the document name and upload your file (CSV or Excel).'
        fields={uploadProspectList}
        schema={uploadProspectSchema}
        onSubmit={handleUploadSubmit}
        isSubmitting={isSubmitting}
        initialValues={{}}
      />
    </div>
  );
}
