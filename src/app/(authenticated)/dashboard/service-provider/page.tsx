// components/vendors/vendor-management.tsx
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
  ArrowLeft,
  MapPin,
  DollarSign,
  Tag
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

export interface Vendor {
  id: string;
  vendorName: string;
  vendorId: string;
  vendorType: string;
  vendorRatePerSession: number;
  vendorRegion: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  sessionCount: number;
  lastSessionDate?: string;
  avatar?: string;
}

export interface Session {
  id: string;
  vendorId: string;
  name: string;
  type: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'pending';
  sessionDate: string;
  duration: string;
  rate: number;
  totalAmount: number;
  lastModified: string;
}

// Static vendor data with 15 records
const mockVendors: Vendor[] = [
  {
    id: '1',
    vendorName: 'Tech Solutions Inc.',
    vendorId: 'VEND-001',
    vendorType: 'IT Services',
    vendorRatePerSession: 150,
    vendorRegion: 'North America',
    email: 'contact@techsolutions.com',
    phone: '+1 (555) 123-4567',
    status: 'active',
    sessionCount: 12,
    lastSessionDate: '2024-01-15'
  },
  {
    id: '2',
    vendorName: 'Creative Design Co.',
    vendorId: 'VEND-002',
    vendorType: 'Design',
    vendorRatePerSession: 120,
    vendorRegion: 'Europe',
    email: 'hello@creativedesign.co',
    phone: '+44 20 1234 5678',
    status: 'active',
    sessionCount: 8,
    lastSessionDate: '2024-01-12'
  },
  {
    id: '3',
    vendorName: 'Global Logistics Ltd.',
    vendorId: 'VEND-003',
    vendorType: 'Logistics',
    vendorRatePerSession: 200,
    vendorRegion: 'Asia Pacific',
    email: 'info@globallogistics.com',
    phone: '+81 3 1234 5678',
    status: 'inactive',
    sessionCount: 5,
    lastSessionDate: '2023-12-01'
  },
  {
    id: '4',
    vendorName: 'Health & Wellness Partners',
    vendorId: 'VEND-004',
    vendorType: 'Healthcare',
    vendorRatePerSession: 180,
    vendorRegion: 'North America',
    email: 'services@healthwellness.com',
    phone: '+1 (555) 234-5678',
    status: 'active',
    sessionCount: 15,
    lastSessionDate: '2024-01-14'
  },
  {
    id: '5',
    vendorName: 'Digital Marketing Pros',
    vendorId: 'VEND-005',
    vendorType: 'Marketing',
    vendorRatePerSession: 135,
    vendorRegion: 'Europe',
    email: 'team@digitalmarketingpros.com',
    phone: '+49 30 1234 5678',
    status: 'active',
    sessionCount: 10,
    lastSessionDate: '2024-01-10'
  },
  {
    id: '6',
    vendorName: 'Security Solutions LLC',
    vendorId: 'VEND-006',
    vendorType: 'Security',
    vendorRatePerSession: 220,
    vendorRegion: 'North America',
    email: 'security@solutionsllc.com',
    phone: '+1 (555) 345-6789',
    status: 'active',
    sessionCount: 7,
    lastSessionDate: '2024-01-13'
  },
  {
    id: '7',
    vendorName: 'Education Consultants Group',
    vendorId: 'VEND-007',
    vendorType: 'Education',
    vendorRatePerSession: 110,
    vendorRegion: 'Asia Pacific',
    email: 'contact@educationconsultants.com',
    phone: '+61 2 1234 5678',
    status: 'inactive',
    sessionCount: 3,
    lastSessionDate: '2023-11-20'
  },
  {
    id: '8',
    vendorName: 'Financial Advisors Inc.',
    vendorId: 'VEND-008',
    vendorType: 'Finance',
    vendorRatePerSession: 250,
    vendorRegion: 'Europe',
    email: 'advisor@financialinc.com',
    phone: '+33 1 1234 5678',
    status: 'active',
    sessionCount: 9,
    lastSessionDate: '2024-01-11'
  },
  {
    id: '9',
    vendorName: 'Environmental Services Co.',
    vendorId: 'VEND-009',
    vendorType: 'Environmental',
    vendorRatePerSession: 190,
    vendorRegion: 'North America',
    email: 'info@envservices.com',
    phone: '+1 (555) 456-7890',
    status: 'active',
    sessionCount: 6,
    lastSessionDate: '2024-01-09'
  },
  {
    id: '10',
    vendorName: 'Legal Support Partners',
    vendorId: 'VEND-010',
    vendorType: 'Legal',
    vendorRatePerSession: 300,
    vendorRegion: 'Europe',
    email: 'support@legalpartners.com',
    phone: '+44 20 2345 6789',
    status: 'active',
    sessionCount: 11,
    lastSessionDate: '2024-01-08'
  },
  {
    id: '11',
    vendorName: 'Construction Experts Ltd.',
    vendorId: 'VEND-011',
    vendorType: 'Construction',
    vendorRatePerSession: 175,
    vendorRegion: 'Asia Pacific',
    email: 'projects@constructionexperts.com',
    phone: '+65 6123 4567',
    status: 'inactive',
    sessionCount: 4,
    lastSessionDate: '2023-12-15'
  },
  {
    id: '12',
    vendorName: 'HR Solutions International',
    vendorId: 'VEND-012',
    vendorType: 'Human Resources',
    vendorRatePerSession: 140,
    vendorRegion: 'North America',
    email: 'hr@hrsolutions.com',
    phone: '+1 (555) 567-8901',
    status: 'active',
    sessionCount: 13,
    lastSessionDate: '2024-01-16'
  },
  {
    id: '13',
    vendorName: 'Research & Development Co.',
    vendorId: 'VEND-013',
    vendorType: 'R&D',
    vendorRatePerSession: 210,
    vendorRegion: 'Europe',
    email: 'research@rdcompany.com',
    phone: '+49 40 1234 5678',
    status: 'active',
    sessionCount: 8,
    lastSessionDate: '2024-01-07'
  },
  {
    id: '14',
    vendorName: 'Event Management Pros',
    vendorId: 'VEND-014',
    vendorType: 'Events',
    vendorRatePerSession: 160,
    vendorRegion: 'Asia Pacific',
    email: 'events@managementpros.com',
    phone: '+61 3 1234 5678',
    status: 'active',
    sessionCount: 14,
    lastSessionDate: '2024-01-17'
  },
  {
    id: '15',
    vendorName: 'Consulting Services Group',
    vendorId: 'VEND-015',
    vendorType: 'Consulting',
    vendorRatePerSession: 195,
    vendorRegion: 'North America',
    email: 'consulting@servicesgroup.com',
    phone: '+1 (555) 678-9012',
    status: 'inactive',
    sessionCount: 2,
    lastSessionDate: '2023-11-30'
  }
];

const mockSessions: Session[] = [
  {
    id: 's1',
    vendorId: '1',
    name: 'IT Infrastructure Review',
    type: 'Consultation',
    status: 'completed',
    sessionDate: '2024-01-15',
    duration: '2 hours',
    rate: 150,
    totalAmount: 300,
    lastModified: '2024-01-15'
  },
  {
    id: 's2',
    vendorId: '1',
    name: 'System Security Audit',
    type: 'Audit',
    status: 'scheduled',
    sessionDate: '2024-01-20',
    duration: '3 hours',
    rate: 150,
    totalAmount: 450,
    lastModified: '2024-01-10'
  }
];

export default function VendorManagement() {
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [view, setView] = useState<'list' | 'sessions'>('list');

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.vendorId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.vendorType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.vendorRegion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getVendorSessions = (vendorId: string) => {
    return mockSessions.filter((session) => session.vendorId === vendorId);
  };

  const getStatusVariant = (status: string) => {
    return status === 'active' ? 'default' : 'secondary';
  };

  const getSessionStatusVariant = (status: string) => {
    const variants = {
      completed: 'default',
      scheduled: 'outline',
      cancelled: 'destructive',
      pending: 'secondary'
    };
    return variants[status as keyof typeof variants] || 'outline';
  };

  if (view === 'sessions' && selectedVendor) {
    return (
      <VendorSessionsView
        vendor={selectedVendor}
        sessions={getVendorSessions(selectedVendor.id)}
        onBack={() => {
          setView('list');
          setSelectedVendor(null);
        }}
      />
    );
  }

  return (
    <PageContainer scrollable={false}>
      <div className='mt-3 space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold'>Service Provider</h1>
            <p className='text-muted-foreground'>
              Manage your Service Provider and their session information
            </p>
          </div>
          <Button className='cursor-pointer bg-[#00A345] hover:bg-[#00A345]/10 hover:text-[#00A345]'>
            <Plus className='mr-2 h-4 w-4' />
            Add Service Provider
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
              <div>
                <CardTitle>Service Provider</CardTitle>
                <CardDescription>
                  All your Service Provider and their session information
                </CardDescription>
              </div>
              <div className='flex w-full gap-2 sm:w-auto'>
                <div className='relative flex-1 sm:flex-initial'>
                  <Search className='text-muted-foreground absolute top-2.5 left-2 h-4 w-4' />
                  <Input
                    placeholder='Search vendors...'
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
                  <TableHead>Service Provider ID</TableHead>
                  <TableHead>Service Provider Name</TableHead>
                  <TableHead>Service Provider Type</TableHead>
                  <TableHead>Rate per Session (AUD)</TableHead>
                  <TableHead>Service Provider Region</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='w-[80px]'></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVendors.map((vendor) => (
                  <TableRow
                    key={vendor.id}
                    className='hover:bg-muted/50 cursor-pointer'
                  >
                    <TableCell className='font-mono text-sm'>
                      {vendor.vendorId}
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-3'>
                        <Avatar>
                          <AvatarFallback>
                            {vendor.vendorName
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className='font-medium'>{vendor.vendorName}</div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant='outline' className='text-xs'>
                        {vendor.vendorType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-1'>
                        <DollarSign className='h-3 w-3 text-green-600' />
                        <span className='font-medium'>
                          ${vendor.vendorRatePerSession}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-1 text-sm'>
                        <MapPin className='h-3 w-3' />
                        {vendor.vendorRegion}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(vendor.status)}>
                        {vendor.status}
                      </Badge>
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
                              setSelectedVendor(vendor);
                              setView('sessions');
                            }}
                          >
                            View Sessions
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            Edit Service Provider
                          </DropdownMenuItem>
                          <DropdownMenuItem>Send Email</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className='text-destructive'>
                            Delete Service Provider
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
    </PageContainer>
  );
}

// Vendor Sessions View Component
function VendorSessionsView({
  vendor,
  sessions,
  onBack
}: {
  vendor: Vendor;
  sessions: Session[];
  onBack: () => void;
}) {
  const router = useRouter();

  const handleClick = () => {
    router.push('/dashboard/workflow');
  };

  return (
    <PageContainer scrollable={false}>
      <div className='space-y-6'>
        {/* Enhanced Header Section */}
        <Button variant='outline' onClick={onBack} className='gap-2 border-0'>
          <ArrowLeft className='h-4 w-4' />
          Back to Vendors
        </Button>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex items-start gap-4'>
            <div className='flex items-center gap-3'>
              <Avatar className='h-12 w-12'>
                <AvatarFallback className='bg-primary/10 text-primary text-sm font-semibold'>
                  {vendor.vendorName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className='flex items-center gap-2'>
                  <h1 className='text-2xl font-bold tracking-tight sm:text-3xl'>
                    {vendor.vendorName}
                  </h1>
                  <Badge
                    variant={
                      vendor.status === 'active' ? 'default' : 'secondary'
                    }
                    className='text-xs'
                  >
                    {vendor.status}
                  </Badge>
                </div>
                <p className='text-muted-foreground mt-1 flex items-center gap-1'>
                  <Building className='h-4 w-4' />
                  {vendor.vendorId}
                </p>
              </div>
            </div>
          </div>
          <Button className='cursor-pointer gap-2' onClick={handleClick}>
            <Plus className='h-4 w-4' />
            Schedule New Session
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
                    Total Sessions
                  </p>
                  <p className='text-2xl font-bold'>{sessions.length}</p>
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
                    Completed
                  </p>
                  <p className='text-2xl font-bold'>
                    {sessions.filter((s) => s.status === 'completed').length}
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
                    Scheduled
                  </p>
                  <p className='text-2xl font-bold'>
                    {sessions.filter((s) => s.status === 'scheduled').length}
                  </p>
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
                    Cancelled
                  </p>
                  <p className='text-2xl font-bold'>
                    {sessions.filter((s) => s.status === 'cancelled').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Sessions Table */}
        <Card>
          <CardHeader className='pb-3'>
            <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
              <div>
                <CardTitle className='text-xl'>Session History</CardTitle>
                <CardDescription>
                  Manage all sessions for {vendor.vendorName}
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
                  <TableHead className='w-[300px]'>Session Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Session Date</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Rate (AUD)</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Last Modified</TableHead>
                  <TableHead className='w-[120px] text-right'>
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session) => (
                  <TableRow
                    key={session.id}
                    className='group hover:bg-muted/50'
                  >
                    <TableCell className='font-medium'>
                      <div className='flex items-center gap-3'>
                        <div className='bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg'>
                          <FileText className='text-primary h-4 w-4' />
                        </div>
                        <div>
                          <div className='font-medium'>{session.name}</div>
                          <div className='text-muted-foreground text-xs'>
                            ID: {session.id}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant='outline' className='text-xs'>
                        {session.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getSessionStatusVariant(session.status)}
                        className='capitalize'
                      >
                        {session.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className='text-sm font-medium'>
                        {new Date(session.sessionDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='text-sm font-medium'>
                        {session.duration}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-1 text-sm font-medium'>
                        <DollarSign className='h-3 w-3 text-green-600' />$
                        {session.rate}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-1 text-sm font-medium'>
                        <DollarSign className='h-3 w-3 text-blue-600' />$
                        {session.totalAmount}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='text-sm'>
                        {new Date(session.lastModified).toLocaleDateString()}
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
                              Share Session
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

        {/* Enhanced Vendor Information */}
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
                  <p className='text-muted-foreground'>{vendor.email}</p>
                </div>
              </div>
              <div className='flex items-center gap-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-full bg-green-50 dark:bg-green-950'>
                  <Phone className='h-5 w-5 text-green-600 dark:text-green-400' />
                </div>
                <div>
                  <p className='text-sm font-medium'>Phone</p>
                  <p className='text-muted-foreground'>{vendor.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-3'>
              <CardTitle className='flex items-center gap-2 text-lg'>
                <Building className='h-5 w-5' />
                Service Provider Information
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center gap-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-full bg-purple-50 dark:bg-purple-950'>
                  <Tag className='h-5 w-5 text-purple-600 dark:text-purple-400' />
                </div>
                <div>
                  <p className='text-sm font-medium'>Service Provider Type</p>
                  <p className='text-muted-foreground'>{vendor.vendorType}</p>
                </div>
              </div>
              <div className='flex items-center gap-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-950'>
                  <DollarSign className='h-5 w-5 text-amber-600 dark:text-amber-400' />
                </div>
                <div>
                  <p className='text-sm font-medium'>Rate per Session</p>
                  <p className='text-muted-foreground'>
                    ${vendor.vendorRatePerSession} AUD
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-full bg-green-50 dark:bg-green-950'>
                  <MapPin className='h-5 w-5 text-green-600 dark:text-green-400' />
                </div>
                <div>
                  <p className='text-sm font-medium'>Region</p>
                  <p className='text-muted-foreground'>{vendor.vendorRegion}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}

// Helper function for session status badges
function getSessionStatusVariant(
  status: string
): 'default' | 'secondary' | 'destructive' | 'outline' {
  const variants = {
    completed: 'default',
    scheduled: 'outline',
    cancelled: 'destructive',
    pending: 'secondary'
  } as const;
  return variants[status as keyof typeof variants] || 'outline';
}
