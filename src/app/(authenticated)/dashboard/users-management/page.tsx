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

const userSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  email: z.email({ error: 'Please enter a valid email address.' }),
  phone: z.string().optional(),
  roleId: z.string().min(1, 'Role is required.'),
  isActive: z.string().min(1, 'Status is required.')
});

type UserFormData = z.infer<typeof userSchema>;

const newUserInitialValues: UserFormData = {
  name: '',
  email: '',
  phone: '',
  roleId: '',
  isActive: 'true'
};

function UsersManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [totalRecords, setTotalRecords] = useState(10);
  const dataTableRef = useRef<ImprovedDataTableRef>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] =
    useState<any>(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchData({
      page: INITIAL_PAGE,
      limit: INITIAL_LIMIT,
      sortOrder: 'desc',
      sortBy: 'id'
    });
    fetchRoles();
  }, []);

  const fetchData = async (params?: any) => {
    setIsLoading(true);
    const queryString = buildQueryParams(params);
    try {
      const response = await GetCall(`/api/company/user?${queryString}`);
      if (response.code === 'SUCCESS') {
        setUsers(response.data);
        setTotalRecords(response.total);
      } else {
        setUsers([]);
        setTotalRecords(0);
        toast.error('Failed to fetch users.');
      }
    } catch (err: any) {
      console.error('Error fetching data:', err);
      toast.error(err.message || 'An error occurred while fetching data.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await GetCall('/api/company/roles');
      if (response.code === 'SUCCESS') {
        setRoles(response.data);
      } else {
        setRoles([]);
        toast.error('Failed to fetch roles.');
      }
    } catch (err: any) {
      console.error('Error fetching roles:', err);
      toast.error(err.message || 'An error occurred while fetching roles.');
    }
  };

  // Generate user form fields with dynamic roles dropdown
  const getUserFormFields = (): FormFieldConfig[] => [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      placeholder: 'e.g. Abhishek'
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'abhishek@example.com'
    },
    {
      name: 'phone',
      label: 'Phone',
      type: 'text',
      placeholder: 'e.g. 9503562161'
    },
    {
      name: 'roleId',
      label: 'Role',
      type: 'dropdown',
      placeholder: 'Select role',
      options: roles.map(role => ({
        label: role.name,
        value: role.roleId.toString()
      }))
    },
    {
      name: 'isActive',
      label: 'Status',
      type: 'dropdown',
      placeholder: 'Select status',
      options: [
        { label: 'Active', value: 'true' },
        { label: 'Inactive', value: 'false' }
      ]
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
      key: 'name',
      header: 'Name',
      field: 'name',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: 150, maxWidth: 150 },
      filterPlaceholder: 'Name'
    },
    {
      key: 'email',
      header: 'Email',
      field: 'email',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: 200, maxWidth: 200 },
      filterPlaceholder: 'Email'
    },
    {
      key: 'phone',
      header: 'Phone',
      field: 'phone',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: 120, maxWidth: 120 },
      filterPlaceholder: 'Phone'
    },
    {
      key: 'role',
      header: 'Role',
      field: 'roleName',
      filter: true,
      sortable: true,
      filterType: 'text' as const,
      bodyStyle: { minWidth: 120, maxWidth: 120 },
      filterPlaceholder: 'Role',
      body: (data: any) => (
        <span>{data.roleName || data.role?.name || '-'}</span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      field: 'isActive',
      filter: true,
      sortable: true,
      filterType: 'dropdown' as const,
      filterOptions: statusFilter,
      filterOptionLabel: 'label',
      filterOptionValue: 'value',
      bodyStyle: { minWidth: 100, maxWidth: 100 },
      filterPlaceholder: 'Status',
      body: (data: any) => (
        <span className={`capitalize ${data.isActive ? 'text-green-600' : 'text-red-600'}`}>
          {data.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    }
  ];

  const onRowSelect = async (rowData: any, action: any) => {
    if (action === ACTIONS.DELETE) {
      setSelectedUser(rowData);
      setIsDeleteDialogVisible(true);
    }

    if (action == ACTIONS.EDIT) {
      setSelectedUser(rowData);
      setIsSheetOpen(true);
    }

    if (action === ACTIONS.VIEW) {
    }
  };

  const handleOpenCreateSheet = () => {
    setSelectedUser(null);
    setIsSheetOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogVisible(false);
    setSelectedUser(null);
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;

    setIsDeleting(true);
    try {
      const response = await DeleteCall(
        `/api/company/user/${selectedUser.id}`
      );
      if (response.code === 'SUCCESS') {
        toast.success(
          `User "${selectedUser.name}" deleted successfully!`
        );
        handleCloseDeleteDialog();
        handleRefresh();
      } else {
        toast.error(response.message || 'Failed to delete user.');
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during deletion.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFormSubmit = async (data: z.infer<typeof userSchema>) => {
    setIsSubmitting(true);
    try {
      // Prepare the data for API
      const submitData = {
        ...data,
        isActive: data.isActive === 'true'
      };

      let response;
      if (selectedUser) {
        response = await PutCall(
          `/api/company/user/${selectedUser.id}`,
          submitData
        );
        if (response.code === 'SUCCESS') {
          toast.success('User updated successfully!');
        }
      } else {
        response = await PostCall('/api/company/user', submitData);
        if (response.code === 'SUCCESS') {
          toast.success('User created successfully!');
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
    }
  };

  const handleRefresh = () => dataTableRef.current?.refreshData();

  return (
    <PageContainer scrollable={false}>
      <div className='flex-shrink-0'>
        <div className='mb-2 flex w-full items-center justify-between'>
          <div className='flex flex-col'>
            <h1 className='text-xl font-semibold text-[#525252] dark:text-[#ffffff]'>
              Users Management
            </h1>
          </div>
          <div className='flex gap-3'>
            <Button
              className='cursor-pointer bg-[var(--primary-light)]'
              onClick={handleOpenCreateSheet}
            >
              + New User
            </Button>
          </div>
        </div>
      </div>
      <ImprovedDataTable
        ref={dataTableRef}
        tableId='user-management'
        page={INITIAL_PAGE}
        limit={INITIAL_LIMIT}
        totalRecords={totalRecords}
        data={users}
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
        title={selectedUser ? 'Edit User' : 'Create a New User'}
        description='Fill in the details below to add a new user to the system.'
        fields={getUserFormFields()}
        schema={userSchema}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        initialValues={selectedUser ? {
          name: selectedUser.name,
          email: selectedUser.email,
          phone: selectedUser.phone,
          roleId: selectedUser.roleId?.toString(),
          isActive: selectedUser.isActive?.toString()
        } : newUserInitialValues}
      />
    </PageContainer>
  );
}

export default UsersManagement;