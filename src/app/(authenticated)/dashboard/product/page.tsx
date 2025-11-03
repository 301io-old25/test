'use client';

import { useState, useEffect } from 'react';
import { DataTable, Column, ActionConfig } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Delete, UserPlus } from 'lucide-react';
import { buildQueryParams } from '@/utils/utils';
import { DeleteCall, GetCall } from '@/lib/apiClient';
import { INITIAL_PAGE, INITIAL_LIMIT } from '@/utils/constant';
import { DeleteDialog } from '@/components/delete-dialog';

interface Company {
  organizationId: number;
  organizationName: string;
  website: string;
  emailId: string;
  address: string;
  status: string;
  plan: 'Free' | 'Standard' | 'Pro';
}

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  // Fetch data from API
  useEffect(() => {
    fetchData({
      page: INITIAL_PAGE,
      limit: INITIAL_LIMIT,
      sortOrder: 'desc',
      sortBy: 'organizationId'
    });
  }, []);
  const fetchData = async (params?: any) => {
    setLoading(true);
    const queryString = buildQueryParams(params);
    try {
      const response = await GetCall(
        `/global/api/global/organization?${queryString}`
      );
      setOrganizations(response.data);
      console.log(response);

      // setTotalRecords(response.total);
    } catch {
      console.error('error', 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };
  const deleteCategory = async () => {
    setLoading(true);
    if (!selectedCompany) return;
    try {
      const response = await DeleteCall(
        `/global/api/global/organization/${selectedCompany?.organizationId}`
      );
      if (response.code?.toLowerCase() === 'success') {
        // setAlert('success', 'Business Unit successfully deleted!');
        fetchData();
        // closeDeleteDialog();
      }
      fetchData({
        page: INITIAL_PAGE,
        limit: INITIAL_LIMIT,
        sortOrder: 'desc',
        sortBy: 'organizationId'
      });
      // setTotalRecords(response.total);
    } catch {
      console.error('error', 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };
  const openDeleteDialog = (organization: Company) => {
    setSelectedCompany(organization);
    setIsDeleteDialogOpen(true);
  };
  const columns: Column<Company>[] = [
    {
      key: 'organizationName',
      header: 'Company Name',
      sortable: true,
      filterable: true,
      width: '200px'
    },
    {
      key: 'website',
      header: 'Website',
      sortable: true,
      filterable: true,
      width: '200px'
    },
    {
      key: 'emailId',
      header: 'EmailId',
      sortable: true,
      filterable: true,
      width: '200px'
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      filterable: true,
      width: '200px'
    }
  ];
  const actions: ActionConfig<Company> = {
    onDelete: async (row) => {
      openDeleteDialog(row);
    }
  };

  return (
    <div className='min-h-screen w-full bg-gray-50 p-6'>
      <div className='mx-auto max-w-7xl'>
        <div className='mb-6 flex items-center justify-between'>
          <h1 className='text-2xl font-semibold text-gray-900'>
            Organization Management
          </h1>
          <Button className='bg-red-500 text-white hover:bg-red-600'>
            <UserPlus className='mr-2 h-4 w-4' />
            New
          </Button>
        </div>

        <DataTable
          data={organizations}
          columns={columns}
          actions={actions}
          showActions={{ view: false, edit: false, delete: true }}
          showSerialNo={true}
          serialNoHeader='No.'
          loading={loading}
          emptyMessage='No records found'
        />
      </div>
      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={deleteCategory}
        itemType='organization'
        itemName={selectedCompany?.organizationName}
      />
    </div>
  );
}
