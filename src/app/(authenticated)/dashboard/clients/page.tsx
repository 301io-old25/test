// components/clients/client-management.tsx
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  FileText,
  Download,
  Mail,
  Phone,
  Building,
  User,
  Trash2,
  Send,
  Edit,
  Eye,
  AlertTriangle,
  Clock,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';
import PageContainer from '@/components/layout/page-container';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'active' | 'inactive';
  contractCount: number;
  lastContractDate?: string;
  avatar?: string;
}

export interface Contract {
  id: string;
  clientId: string;
  name: string;
  type: string;
  status: 'draft' | 'active' | 'expired' | 'terminated';
  startDate: string;
  endDate?: string;
  fileSize: string;
  lastModified: string;
}

const mockClients: Client[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1 (555) 123-4567',
    company: 'TechCorp Inc.',
    status: 'active',
    contractCount: 3,
    lastContractDate: '2024-01-15',
    avatar: '/avatars/john.jpg'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '+1 (555) 987-6543',
    company: 'Innovate Labs',
    status: 'active',
    contractCount: 2,
    lastContractDate: '2024-01-10'
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    phone: '+1 (555) 456-7890',
    company: 'Global Solutions',
    status: 'inactive',
    contractCount: 1,
    lastContractDate: '2023-12-01'
  }
];

const mockContracts: Contract[] = [
  {
    id: 'c1',
    clientId: '1',
    name: 'Service Agreement - TechCorp',
    type: 'Service',
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    fileSize: '2.4 MB',
    lastModified: '2024-01-15'
  },
  {
    id: 'c2',
    clientId: '1',
    name: 'NDA Agreement',
    type: 'NDA',
    status: 'active',
    startDate: '2023-11-01',
    fileSize: '1.1 MB',
    lastModified: '2023-11-15'
  }
];

export default function ClientManagement() {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [view, setView] = useState<'list' | 'documents'>('list');

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getClientContracts = (clientId: string) => {
    return mockContracts.filter((contract) => contract.clientId === clientId);
  };

  const getStatusVariant = (status: string) => {
    return status === 'active' ? 'default' : 'secondary';
  };

  const getContractStatusVariant = (status: string) => {
    const variants = {
      active: 'default',
      draft: 'outline',
      expired: 'destructive',
      terminated: 'secondary'
    };
    return variants[status as keyof typeof variants] || 'outline';
  };

  if (view === 'documents' && selectedClient) {
    return (
      <ClientDocumentsView
        client={selectedClient}
        contracts={getClientContracts(selectedClient.id)}
        onBack={() => {
          setView('list');
          setSelectedClient(null);
        }}
      />
    );
  }

  return (
    <div className='mx-6 mt-3 space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Clients</h1>
          <p className='text-muted-foreground'>
            Manage your clients and their contract documents
          </p>
        </div>
        <Button className='cursor-pointer bg-[#00A345] hover:bg-[#00A345]/10 hover:text-[#00A345]'>
          <Plus className='mr-2 h-4 w-4' />
          Add Client
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
            <div>
              <CardTitle>Client List</CardTitle>
              <CardDescription>
                All your clients and their contract information
              </CardDescription>
            </div>
            <div className='flex w-full gap-2 sm:w-auto'>
              <div className='relative flex-1 sm:flex-initial'>
                <Search className='text-muted-foreground absolute top-2.5 left-2 h-4 w-4' />
                <Input
                  placeholder='Search clients...'
                  className='pl-8'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant='outline' size='icon'>
                <Filter className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Contracts</TableHead>
                <TableHead>Last Contract</TableHead>
                <TableHead className='w-[80px]'></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow
                  key={client.id}
                  className='hover:bg-muted/50 cursor-pointer'
                >
                  <TableCell>
                    <div className='flex items-center gap-3'>
                      <Avatar>
                        <AvatarFallback>
                          {client.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className='font-medium'>{client.name}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{client.company}</TableCell>
                  <TableCell>
                    <div className='space-y-1'>
                      <div className='flex items-center gap-1 text-sm'>
                        <Mail className='h-3 w-3' />
                        {client.email}
                      </div>
                      <div className='text-muted-foreground flex items-center gap-1 text-sm'>
                        <Phone className='h-3 w-3' />
                        {client.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(client.status)}>
                      {client.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => {
                        setSelectedClient(client);
                        setView('documents');
                      }}
                    >
                      <FileText className='mr-2 h-4 w-4' />
                      {client.contractCount} contracts
                    </Button>
                  </TableCell>
                  <TableCell>
                    {client.lastContractDate ? (
                      new Date(client.lastContractDate).toLocaleDateString()
                    ) : (
                      <span className='text-muted-foreground'>
                        No contracts
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='icon'>
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedClient(client);
                            setView('documents');
                          }}
                        >
                          View Contracts
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit Client</DropdownMenuItem>
                        <DropdownMenuItem>Send Email</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className='text-destructive'>
                          Delete Client
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// Client Documents View Component
function ClientDocumentsView({
  client,
  contracts,
  onBack
}: {
  client: Client;
  contracts: Contract[];
  onBack: () => void;
}) {
  const router = useRouter();

  const handleClick = () => {
    router.push('/dashboard/workflow');
  };
  return (
    <PageContainer>
      <div className='space-y-6'>
        {/* Enhanced Header Section */}
        <Button variant='outline' onClick={onBack} className='gap-2 border-0'>
          <ArrowLeft className='h-4 w-4' />
          Back to Clients
        </Button>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex items-start gap-4'>
            <div className='flex items-center gap-3'>
              <Avatar className='h-12 w-12'>
                <AvatarFallback className='bg-primary/10 text-primary text-sm font-semibold'>
                  {client.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className='flex items-center gap-2'>
                  <h1 className='text-2xl font-bold tracking-tight sm:text-3xl'>
                    {client.name}
                  </h1>
                  <Badge
                    variant={
                      client.status === 'active' ? 'default' : 'secondary'
                    }
                    className='text-xs'
                  >
                    {client.status}
                  </Badge>
                </div>
                <p className='text-muted-foreground mt-1 flex items-center gap-1'>
                  <Building className='h-4 w-4' />
                  {client.company}
                </p>
              </div>
            </div>
          </div>
          <Button className='cursor-pointer gap-2' onClick={handleClick}>
            <Plus className='h-4 w-4' />
            Create New Contract
          </Button>
        </div>

        {/* Stats Overview */}
        <div className='grid gap-4 md:grid-cols-4'>
          <Card className='py-0'>
            <CardContent className='p-4'>
              <div className='flex items-center gap-2'>
                <div className='rounded-lg bg-blue-50 p-2 dark:bg-blue-950'>
                  <FileText className='h-4 w-4 text-blue-600 dark:text-blue-400' />
                </div>
                <div>
                  <p className='text-muted-foreground text-sm font-medium'>
                    Total Contracts
                  </p>
                  <p className='text-2xl font-bold'>{contracts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className='py-0'>
            <CardContent className='p-4'>
              <div className='flex items-center gap-2'>
                <div className='rounded-lg bg-green-50 p-2 dark:bg-green-950'>
                  <CheckCircle className='h-4 w-4 text-green-600 dark:text-green-400' />
                </div>
                <div>
                  <p className='text-muted-foreground text-sm font-medium'>
                    Active
                  </p>
                  <p className='text-2xl font-bold'>
                    {contracts.filter((c) => c.status === 'active').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className='py-0'>
            <CardContent className='p-4'>
              <div className='flex items-center gap-2'>
                <div className='rounded-lg bg-amber-50 p-2 dark:bg-amber-950'>
                  <Clock className='h-4 w-4 text-amber-600 dark:text-amber-400' />
                </div>
                <div>
                  <p className='text-muted-foreground text-sm font-medium'>
                    Expiring Soon
                  </p>
                  <p className='text-2xl font-bold'>0</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className='py-0'>
            <CardContent className='p-4'>
              <div className='flex items-center gap-2'>
                <div className='rounded-lg bg-red-50 p-2 dark:bg-red-950'>
                  <AlertTriangle className='h-4 w-4 text-red-600 dark:text-red-400' />
                </div>
                <div>
                  <p className='text-muted-foreground text-sm font-medium'>
                    Expired
                  </p>
                  <p className='text-2xl font-bold'>
                    {contracts.filter((c) => c.status === 'expired').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Contracts Table */}
        <Card>
          <CardHeader className='pb-3'>
            <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
              <div>
                <CardTitle className='text-xl'>Contract Documents</CardTitle>
                <CardDescription>
                  Manage all contract documents for {client.name} at{' '}
                  {client.company}
                </CardDescription>
              </div>
              <div className='flex gap-2'>
                <Button variant='outline' size='sm' className='gap-2'>
                  <Filter className='h-4 w-4' />
                  Filter
                </Button>
                <Button variant='outline' size='sm' className='gap-2'>
                  <Download className='h-4 w-4' />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className='p-0'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[300px]'>Contract Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>File Size</TableHead>
                  <TableHead>Last Modified</TableHead>
                  <TableHead className='w-[120px] text-right'>
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contracts.map((contract) => (
                  <TableRow
                    key={contract.id}
                    className='group hover:bg-muted/50'
                  >
                    <TableCell className='font-medium'>
                      <div className='flex items-center gap-3'>
                        <div className='bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg'>
                          <FileText className='text-primary h-4 w-4' />
                        </div>
                        <div>
                          <div className='font-medium'>{contract.name}</div>
                          <div className='text-muted-foreground text-xs'>
                            ID: {contract.id}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant='outline' className='text-xs'>
                        {contract.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getContractStatusVariant(contract.status)}
                        className='capitalize'
                      >
                        {contract.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className='text-sm font-medium'>
                        {new Date(contract.startDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      {contract.endDate ? (
                        <div className='text-sm font-medium'>
                          {new Date(contract.endDate).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className='text-muted-foreground text-sm'>
                          N/A
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className='text-muted-foreground text-sm'>
                        {contract.fileSize}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='text-sm'>
                        {new Date(contract.lastModified).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100'>
                        <Button variant='ghost' size='icon' className='h-8 w-8'>
                          <Eye className='h-4 w-4' />
                        </Button>
                        <Button variant='ghost' size='icon' className='h-8 w-8'>
                          <Download className='h-4 w-4' />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant='ghost'
                              size='icon'
                              className='h-8 w-8'
                            >
                              <MoreHorizontal className='h-4 w-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuItem>
                              <Edit className='mr-2 h-4 w-4' />
                              Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Send className='mr-2 h-4 w-4' />
                              Share Contract
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className='text-destructive'>
                              <Trash2 className='mr-2 h-4 w-4' />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Enhanced Client Information */}
        <div className='grid gap-6 lg:grid-cols-2'>
          <Card>
            <CardHeader className='pb-3'>
              <CardTitle className='flex items-center gap-2 text-lg'>
                <User className='h-5 w-5' />
                Contact Details
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center gap-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950'>
                  <Mail className='h-5 w-5 text-blue-600 dark:text-blue-400' />
                </div>
                <div>
                  <p className='text-sm font-medium'>Email</p>
                  <p className='text-muted-foreground'>{client.email}</p>
                </div>
              </div>
              <div className='flex items-center gap-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-full bg-green-50 dark:bg-green-950'>
                  <Phone className='h-5 w-5 text-green-600 dark:text-green-400' />
                </div>
                <div>
                  <p className='text-sm font-medium'>Phone</p>
                  <p className='text-muted-foreground'>{client.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-3'>
              <CardTitle className='flex items-center gap-2 text-lg'>
                <Building className='h-5 w-5' />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center gap-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-full bg-purple-50 dark:bg-purple-950'>
                  <Building className='h-5 w-5 text-purple-600 dark:text-purple-400' />
                </div>
                <div>
                  <p className='text-sm font-medium'>Company</p>
                  <p className='text-muted-foreground'>{client.company}</p>
                </div>
              </div>
              <div className='flex items-center gap-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-950'>
                  <FileText className='h-5 w-5 text-amber-600 dark:text-amber-400' />
                </div>
                <div>
                  <p className='text-sm font-medium'>Total Contracts</p>
                  <p className='text-muted-foreground'>
                    {client.contractCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}

// Helper function for contract status badges
function getContractStatusVariant(
  status: string
): 'default' | 'secondary' | 'destructive' | 'outline' {
  const variants = {
    active: 'default',
    draft: 'outline',
    expired: 'destructive',
    terminated: 'secondary'
  } as const;
  return variants[status as keyof typeof variants] || 'outline';
}
