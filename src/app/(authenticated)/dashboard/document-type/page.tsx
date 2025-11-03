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

// Static data for 15 document types
const staticDocumentTypes = [
  {
    documentTypeId: 1,
    documentName: 'Non-Disclosure Agreement',
    filePath: 'C:\\Documents\\NDA_Template.docx',
    isActive: true,
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    documentTypeId: 2,
    documentName: 'Service Level Agreement',
    filePath: 'C:\\Documents\\SLA_Template.pdf',
    isActive: true,
    createdAt: '2024-01-16T14:20:00Z'
  },
  {
    documentTypeId: 3,
    documentName: 'Master Service Agreement',
    filePath: 'C:\\Documents\\MSA_Template.docx',
    isActive: true,
    createdAt: '2024-01-17T09:15:00Z'
  },
  {
    documentTypeId: 4,
    documentName: 'Employment Contract',
    filePath: 'C:\\Documents\\Employment_Contract.pdf',
    isActive: true,
    createdAt: '2024-01-18T11:45:00Z'
  },
  {
    documentTypeId: 5,
    documentName: 'Privacy Policy',
    filePath: 'C:\\Documents\\Privacy_Policy.docx',
    isActive: false,
    createdAt: '2024-01-19T16:10:00Z'
  },
  {
    documentTypeId: 6,
    documentName: 'Terms of Service',
    filePath: 'C:\\Documents\\Terms_of_Service.pdf',
    isActive: true,
    createdAt: '2024-01-20T13:25:00Z'
  },
  {
    documentTypeId: 7,
    documentName: 'Invoice Template',
    filePath: 'C:\\Documents\\Invoice_Template.xlsx',
    isActive: true,
    createdAt: '2024-01-21T08:50:00Z'
  },
  {
    documentTypeId: 8,
    documentName: 'Purchase Order',
    filePath: 'C:\\Documents\\Purchase_Order.docx',
    isActive: true,
    createdAt: '2024-01-22T15:35:00Z'
  },
  {
    documentTypeId: 9,
    documentName: 'Project Proposal',
    filePath: 'C:\\Documents\\Project_Proposal.pdf',
    isActive: false,
    createdAt: '2024-01-23T12:40:00Z'
  },
  {
    documentTypeId: 10,
    documentName: 'Meeting Minutes',
    filePath: 'C:\\Documents\\Meeting_Minutes.docx',
    isActive: true,
    createdAt: '2024-01-24T10:05:00Z'
  },
  {
    documentTypeId: 11,
    documentName: 'Business Plan',
    filePath: 'C:\\Documents\\Business_Plan.pdf',
    isActive: true,
    createdAt: '2024-01-25T14:55:00Z'
  },
  {
    documentTypeId: 12,
    documentName: 'Risk Assessment',
    filePath: 'C:\\Documents\\Risk_Assessment.docx',
    isActive: true,
    createdAt: '2024-01-26T11:20:00Z'
  },
  {
    documentTypeId: 13,
    documentName: 'Compliance Report',
    filePath: 'C:\\Documents\\Compliance_Report.pdf',
    isActive: false,
    createdAt: '2024-01-27T09:45:00Z'
  },
  {
    documentTypeId: 14,
    documentName: 'Performance Review',
    filePath: 'C:\\Documents\\Performance_Review.docx',
    isActive: true,
    createdAt: '2024-01-28T13:15:00Z'
  },
  {
    documentTypeId: 15,
    documentName: 'Training Manual',
    filePath: 'C:\\Documents\\Training_Manual.pdf',
    isActive: true,
    createdAt: '2024-01-29T16:30:00Z'
  }
];

interface DocumentType {
  documentTypeId: number;
  documentName: string;
  filePath: string;
  isActive: boolean;
  createdAt: string;
}

// Type guard to check if a key is valid for DocumentType
function isValidDocumentTypeKey(key: any): key is keyof DocumentType {
  return [
    'documentTypeId',
    'documentName',
    'filePath',
    'isActive',
    'createdAt'
  ].includes(key);
}

function DocumentType() {
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [totalRecords, setTotalRecords] = useState(15);
  const dataTableRef = useRef<ImprovedDataTableRef>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] =
    useState<boolean>(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDocumentType, setSelectedDocumentType] =
    useState<DocumentType | null>(null);
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

    // Simulate API delay
    setTimeout(() => {
      try {
        // Use static data instead of API call
        let filteredData = [...staticDocumentTypes];

        // Apply basic filtering/sorting if needed
        if (params?.sortBy && isValidDocumentTypeKey(params.sortBy)) {
          filteredData.sort((a: any, b: any) => {
            const aValue = a[params.sortBy];
            const bValue = b[params.sortBy];

            if (params.sortOrder === 'asc') {
              return aValue > bValue ? 1 : -1;
            } else {
              return aValue < bValue ? 1 : -1;
            }
          });
        }

        setDocumentTypes(filteredData);
        setTotalRecords(15);
      } catch (err: any) {
        console.error('Error fetching data:', err);
        toast.error(err.message || 'An error occurred while fetching data.');
        setDocumentTypes([]);
        setTotalRecords(0);
      } finally {
        setIsLoading(false);
      }
    }, 500); // Simulate network delay
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
        <span className='truncate'>
          {data.filePath
            ? data.filePath.split('\\').pop() || data.filePath
            : 'No file'}
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
      // Simulate delete operation with static data
      const updatedDocumentTypes = documentTypes.filter(
        (doc) => doc.documentTypeId !== selectedDocumentType.documentTypeId
      );

      setDocumentTypes(updatedDocumentTypes);
      setTotalRecords(updatedDocumentTypes.length);

      toast.success(
        `Document type "${selectedDocumentType.documentName}" deleted successfully!`
      );
      handleCloseDeleteDialog();
      handleRefresh();
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during deletion.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFormSubmit = async (data: z.infer<typeof documentTypeSchema>) => {
    setIsSubmitting(true);
    try {
      if (selectedDocumentType) {
        // Edit existing document type
        const updatedDocumentTypes = documentTypes.map((doc) =>
          doc.documentTypeId === selectedDocumentType.documentTypeId
            ? {
                ...doc,
                documentName: data.documentName
                // In a real scenario, filePath would be updated with the new file
              }
            : doc
        );
        setDocumentTypes(updatedDocumentTypes);
        toast.success('Document type updated successfully!');
      } else {
        // Create new document type
        const newDocumentType: DocumentType = {
          documentTypeId:
            Math.max(...documentTypes.map((d) => d.documentTypeId), 0) + 1,
          documentName: data.documentName,
          filePath: data.documentFile
            ? `C:\\Documents\\${data.documentName.replace(/\s+/g, '_')}.pdf`
            : '',
          isActive: true,
          createdAt: new Date().toISOString()
        };

        setDocumentTypes((prev) => [newDocumentType, ...prev]);
        setTotalRecords((prev) => prev + 1);
        toast.success('Document type created successfully!');
      }

      handleCloseSheet();
      handleRefresh();
    } catch (error: any) {
      toast.error(error.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefresh = () => dataTableRef.current?.refreshData();

  return (
    <PageContainer scrollable={false}>
      <div className='flex-shrink-0'>
        <div className='mb-2 flex w-full items-center justify-between'>
          <div className='flex flex-col'>
            <h1 className='dark:text{[#ffffff] text-xl font-semibold text-[#525252]'>
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
        title={
          selectedDocumentType
            ? 'Edit Document Type'
            : 'Create New Document Type'
        }
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
