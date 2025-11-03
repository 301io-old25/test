'use client';
import PageContainer from '@/components/layout/page-container';
import ImprovedDataTable, {
  ImprovedDataTableRef
} from '@/components/table/ImprovedDataTable';
import { Button } from '@/components/ui/button';
import DeleteConfirmationDialog from '@/components/ui/custom/delete-dialog';
import { DeleteCall, GetCall, PostCall, PutCall } from '@/lib/apiClient';
import { ACTIONS, INITIAL_LIMIT, INITIAL_PAGE } from '@/utils/constant';
import { buildQueryParams } from '@/utils/utils';
import React, { useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  FormFieldConfig,
  ReusableFormSheet
} from '@/components/drawer/add-fields-drawer';

const statusFilter = [
  { label: 'Active', value: 'true' },
  { label: 'Inactive', value: 'false' }
];

const documentTypeSchema = z.object({
  documentName: z.string().min(1, 'Document name is required.'),
  documentFile: z.any().optional()
});

type DocumentTypeFormData = z.infer<typeof documentTypeSchema>;

const newDocumentTypeInitialValues: DocumentTypeFormData = {
  documentName: '',
  documentFile: null
};

function DocumentType() {
  const [documentTypes, setDocumentTypes] = useState<any[]>([]);
  const [totalRecords, setTotalRecords] = useState(10);
  const dataTableRef = useRef<ImprovedDataTableRef>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] =
    useState<any>(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDocumentType, setSelectedDocumentType] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  useEffect(() => {
    fetchData({
      page: INITIAL_PAGE,
      limit: INITIAL_LIMIT,
      sortOrder: 'desc',
      sortBy: 'documentTypeId'
    });
  }, []);

  const fetchData = async (params?: any) => {
    setIsLoading(true);
    const queryString = buildQueryParams(params);
    try {
      const response = await GetCall(`/api/company/document-type?${queryString}`);
      if (response.code === 'SUCCESS') {
        setDocumentTypes(response.data);
        setTotalRecords(response.total);
      } else {
        setDocumentTypes([]);
        setTotalRecords(0);
        toast.error('Failed to fetch document types.');
      }
    } catch (err: any) {
      console.error('Error fetching data:', err);
      toast.error(err.message || 'An error occurred while fetching data.');
    } finally {
      setIsLoading(false);
    }
  };

  const documentTypeFormFields: FormFieldConfig[] = [
    {
      name: 'documentName',
      label: 'Document Name',
      type: 'text',
      placeholder: 'e.g. NDA, SLA, MSA'
    },
    {
      name: 'documentFile',
      label: 'Document File',
      type: 'file',
      placeholder: 'Choose document file',
      accept: '.xlsx,.xls,.docx,.doc,.pdf',
      multiple: true,
      description: 'Upload document template files (Excel, Word, PDF)'
    }
  ];

  const columns = [
    {
      key: 'srNo',
      header: '#',
      body: (data: any, options: any) => <span>{options.rowIndex + 1}</span>,
      bodyStyle: { minWidth: 50, maxWidth: 50 }
    },
    {
      key: 'documentName',
      header: 'Document Name',
      field: 'documentName',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: 150, maxWidth: 150 },
      filterPlaceholder: 'Document Name'
    },
    {
      key: 'filePath',
      header: 'File Path',
      field: 'filePath',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: 200, maxWidth: 200 },
      filterPlaceholder: 'File Path',
      body: (data: any) => (
        <span className="truncate">
          {data.filePath ? data.filePath.split('\\').pop() || data.filePath : 'No file'}
        </span>
      )
    },
    // {
    //   key: 'status',
    //   header: 'Status',
    //   field: 'isActive',
    //   filter: true,
    //   sortable: true,
    //   filterType: 'dropdown' as const,
    //   filterOptions: statusFilter,
    //   filterOptionLabel: 'label',
    //   filterOptionValue: 'value',
    //   bodyStyle: { minWidth: 100, maxWidth: 100 },
    //   filterPlaceholder: 'Status',
    //   body: (data: any) => (
    //     <span className={`capitalize ${data.isActive ? 'text-green-600' : 'text-red-600'}`}>
    //       {data.isActive ? 'Active' : 'Inactive'}
    //     </span>
    //   )
    // },
    {
      key: 'createdAt',
      header: 'Created At',
      field: 'createdAt',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: 150, maxWidth: 150 },
      filterPlaceholder: 'Created At',
      body: (data: any) => (
        <span>{new Date(data.createdAt).toLocaleDateString()}</span>
      )
    }
  ];

  const onRowSelect = async (rowData: any, action: any) => {
    if (action === ACTIONS.DELETE) {
      setSelectedDocumentType(rowData);
      setIsDeleteDialogVisible(true);
    }

    if (action == ACTIONS.EDIT) {
      setSelectedDocumentType(rowData);
      setIsSheetOpen(true);
    }

    if (action === ACTIONS.VIEW) {
    }
  };

  const handleOpenCreateSheet = () => {
    setSelectedDocumentType(null);
    setSelectedFiles([]);
    setIsSheetOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogVisible(false);
    setSelectedDocumentType(null);
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
    setSelectedDocumentType(null);
    setSelectedFiles([]);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDocumentType) return;

    setIsDeleting(true);
    try {
      const response = await DeleteCall(
        `/api/company/document-type/${selectedDocumentType.documentTypeId}`
      );
      if (response.code === 'SUCCESS') {
        toast.success(
          `Document type "${selectedDocumentType.documentName}" deleted successfully!`
        );
        handleCloseDeleteDialog();
        handleRefresh();
      } else {
        toast.error(response.message || 'Failed to delete document type.');
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during deletion.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFormSubmit = async (data: z.infer<typeof documentTypeSchema>) => {
    setIsSubmitting(true);
    try {
      // Prepare form data for file upload
      const formData = new FormData();
      
      // Add document data as JSON
      const documentData = [{
        documentName: data.documentName
      }];
      formData.append('documentData', JSON.stringify(documentData));

      // Add files if any
      if (data.documentFile && data.documentFile.length > 0) {
        for (let i = 0; i < data.documentFile.length; i++) {
          formData.append('documentFiles', data.documentFile[i]);
        }
      }

      let response;
      if (selectedDocumentType) {
        // For edit, we need to use PUT with the specific document type ID
        response = await PutCall(
          `/api/company/document-type/${selectedDocumentType.documentTypeId}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        if (response.code === 'SUCCESS') {
          toast.success('Document type updated successfully!');
        }
        fetchData()
      } else {
        // For create, use POST
        response = await PostCall('/api/company/document-type', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (response.code === 'SUCCESS') {
          toast.success('Document type created successfully!');
        }
      }

      if (response.code === 'SUCCESS') {
        handleCloseSheet();
        handleRefresh();
      } else {
        toast.error(response.message || 'An error occurred.');
      }
    } catch (error: any) {
      toast.error(error.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
      fetchData()
    }
  };

  const handleRefresh = () => dataTableRef.current?.refreshData();

  return (
    <PageContainer scrollable={false}>
      <div className='flex-shrink-0'>
        <div className='mb-2 flex w-full items-center justify-between'>
          <div className='flex flex-col'>
            <h1 className='text-xl font-semibold text-[#525252] dark:text-[#ffffff]'>
              Document Type
            </h1>
          </div>
          <div className='flex gap-3'>
            <Button
              className='cursor-pointer bg-[#00A345] hover:bg-[#00A345]/10 hover:text-[#00A345]'
              onClick={handleOpenCreateSheet}
            >
              + New Document Type
            </Button>
          </div>
        </div>
      </div>
      <ImprovedDataTable
        ref={dataTableRef}
        tableId='document-type-management'
        page={INITIAL_PAGE}
        limit={INITIAL_LIMIT}
        totalRecords={totalRecords}
        data={documentTypes}
        columns={columns}
        loading={isLoading}
        filter={true}
        stripedRows={true}
        showGridlines={true}
        isView={false}
        isEdit={true}
        isDelete={true}
        onLoad={fetchData}
        onView={(item: any) => onRowSelect(item, 'view')}
        onEdit={(item: any) => onRowSelect(item, 'edit')}
        onDelete={(item: any) => onRowSelect(item, 'delete')}
      />

      <DeleteConfirmationDialog
        visible={isDeleteDialogVisible}
        isLoading={isDeleting}
        itemDescription=''
        onHide={handleCloseDeleteDialog}
        onConfirm={handleDeleteConfirm}
      />

      <ReusableFormSheet
        isOpen={isSheetOpen}
        onClose={handleCloseSheet}
        title={selectedDocumentType ? 'Edit Document Type' : 'Create New Document Type'}
        description='Fill in the details below to add a new document type to the system.'
        fields={documentTypeFormFields}
        schema={documentTypeSchema}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        initialValues={selectedDocumentType || newDocumentTypeInitialValues}
      />
    </PageContainer>
  );
}

export default DocumentType;