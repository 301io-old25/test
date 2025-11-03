'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Plus } from 'lucide-react';
import PageContainer from '@/components/layout/page-container';

interface ApiConfiguration {
  id: number;
  name: string;
  endpoint: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export default function ApiIntegrations() {
  const [apiConfigs, setApiConfigs] = useState<ApiConfiguration[]>([
    {
      id: 1,
      name: 'Ariba',
      endpoint: 'https://api.ariba.com/v1',
      status: 'ACTIVE'
    },
    {
      id: 2,
      name: 'Coupa',
      endpoint: 'https://api.coupa.com/integration',
      status: 'ACTIVE'
    },
    {
      id: 3,
      name: 'Pegasystem',
      endpoint: 'http://pegasystem.com/integration',
      status: 'ACTIVE'
    }
  ]);

  const handleEdit = (config: ApiConfiguration) => {
    // Handle edit functionality
    console.log('Edit config:', config);
    // You can open a modal or navigate to edit page here
  };

  const handleAddNew = () => {
    // Handle add new functionality
    console.log('Add new API config');
    // You can open a modal or navigate to create page here
  };

  return (
    <PageContainer scrollable={false}>
      <div className='space-y-6'>
        {/* Header Section */}
        <div className='flex justify-between'>
          <div className='flex flex-col space-y-2'>
            <h1 className='text-3xl font-bold tracking-tight'>
              API Configurations
            </h1>
            <p className='text-muted-foreground'>
              Manage your API configurations and integrations
            </p>
          </div>
          <div className='mt-6'>
            <Button onClick={handleAddNew} className='flex items-center gap-2 cursor-pointer bg-[#00A345] hover:bg-[#00A345]/10 hover:text-[#00A345]'>
              <Plus className='h-4 w-4' />
              Add New API Config
            </Button>
          </div>
        </div>

        {/* Main Content Card */}
        <Card>
          <CardHeader>
            <CardTitle>API Configurations List</CardTitle>
            <CardDescription>
              View and manage all your API integrations in one place
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* API Configurations Table */}
            <div className='rounded-md border'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='w-16'>ID</TableHead>
                    <TableHead>API NAME</TableHead>
                    <TableHead>ENDPOINT</TableHead>
                    <TableHead>STATUS</TableHead>
                    <TableHead className='text-right'>ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiConfigs.map((config) => (
                    <TableRow key={config.id}>
                      <TableCell className='font-medium'>{config.id}</TableCell>
                      <TableCell className='font-medium'>
                        {config.name}
                      </TableCell>
                      <TableCell className='text-muted-foreground text-sm'>
                        {config.endpoint}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            config.status === 'ACTIVE' ? 'default' : 'secondary'
                          }
                          className={
                            config.status === 'ACTIVE'
                              ? 'bg-green-100 text-green-800 hover:bg-green-100'
                              : ''
                          }
                        >
                          {config.status}
                        </Badge>
                      </TableCell>
                      <TableCell className='text-right'>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => handleEdit(config)}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Add New API Config Button */}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
