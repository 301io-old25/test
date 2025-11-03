'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Calendar,
  Clock,
  Download,
  FileText,
  Building,
  Users,
  DollarSign,
  X,
  CheckCircle,
  AlertCircle,
  MapPin,
  Phone,
  Mail,
  User,
  Receipt,
  Printer,
  Send,
  Eye,
  Share2,
  Heart,
  ListChecks,
  CreditCard,
  Book,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal
} from 'lucide-react';
import PageContainer from '@/components/layout/page-container';

// Type Definitions
interface Contact {
  name: string;
  email: string;
  phone: string;
}

interface Cancellation {
  timestamp: string;
  hoursBefore: number;
  refundStatus: 'full' | 'none' | 'pending';
  reason: string;
  reviewed: boolean;
}

interface Appointment {
  id: string;
  clientId: string;
  personName: string;
  service: string;
  date: string;
  time: string;
  duration: number;
  rate: number;
  status: 'completed' | 'cancelled' | 'scheduled';
  cancellation: Cancellation | null;
}

interface Client {
  id: string;
  name: string;
  region: string;
  contact: Contact;
  billingAddress: string;
  taxId: string;
  paymentTerms: string;
  cancellationPolicy: 'strict' | 'moderate' | 'flexible';
}

interface Region {
  id: string;
  name: string;
}

interface ReviewDialogState {
  open: boolean;
  appointment: Appointment | null;
}

interface InvoiceDialogState {
  open: boolean;
  client: Client | null;
}

interface InvoiceItem {
  description: string;
  date: string;
  amount: number;
  type: string;
}

interface InvoiceData {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'paid' | 'overdue' | 'pending';
}

interface Metrics {
  totalContracts: number;
  cancelledContracts: number;
  cancelledWithoutRefund: number;
  pendingReview: number;
  totalCharge: number;
  cancellationRate: number;
}

interface ContractDialogState {
  open: boolean;
  client: Client | null;
}

interface AppointmentFilters {
  personName: string;
  service: string;
  date: string;
  time: string;
  duration: string;
  rate: string;
  status: string;
  cancellationHours: string;
  refundStatus: string;
}

const InvoiceDesk = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [reviewDialog, setReviewDialog] = useState<ReviewDialogState>({
    open: false,
    appointment: null
  });
  const [invoiceDialog, setInvoiceDialog] = useState<InvoiceDialogState>({
    open: false,
    client: null
  });
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [contractDialog, setContractDialog] = useState<ContractDialogState>({
    open: false,
    client: null
  });
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  // Filter state for appointment table
  const [appointmentFilters, setAppointmentFilters] =
    useState<AppointmentFilters>({
      personName: '',
      service: '',
      date: '',
      time: '',
      duration: 'all',
      rate: '',
      status: 'all',
      cancellationHours: '',
      refundStatus: 'all'
    });

  // Update filter function
  const updateAppointmentFilter = (
    key: keyof AppointmentFilters,
    value: string
  ) => {
    setAppointmentFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Clear all appointment filters
  const clearAppointmentFilters = () => {
    setAppointmentFilters({
      personName: '',
      service: '',
      date: '',
      time: '',
      duration: 'all',
      rate: '',
      status: 'all',
      cancellationHours: '',
      refundStatus: 'all'
    });
  };

  // Regions data
  const regions: Region[] = [
    { id: 'north-america', name: 'North America' },
    { id: 'europe', name: 'Europe' },
    { id: 'asia', name: 'Asia' },
    { id: 'australia', name: 'Australia' },
    { id: 'south-america', name: 'South America' }
  ];

  // Clients by region
  const clients: Client[] = [
    {
      id: 'client-1',
      name: 'TechCorp Solutions',
      region: 'north-america',
      contact: {
        name: 'John Smith',
        email: 'john@techcorp.com',
        phone: '+1 (555) 123-4567'
      },
      billingAddress: '123 Tech Street, San Francisco, CA 94105',
      taxId: 'US-123456789',
      paymentTerms: 'Net 30',
      cancellationPolicy: 'strict'
    },
    {
      id: 'client-2',
      name: 'Global Innovations Ltd',
      region: 'europe',
      contact: {
        name: 'Maria Rodriguez',
        email: 'maria@globalinnovations.com',
        phone: '+44 20 7946 0958'
      },
      billingAddress: '456 Innovation Ave, London EC1A 1BB, UK',
      taxId: 'GB-987654321',
      paymentTerms: 'Net 15',
      cancellationPolicy: 'moderate'
    },
    {
      id: 'client-3',
      name: 'Asia Pacific Enterprises',
      region: 'asia',
      contact: {
        name: 'Wei Chen',
        email: 'wei@asiapace.com',
        phone: '+81 3 1234 5678'
      },
      billingAddress: '789 Business District, Tokyo 100-0001, Japan',
      taxId: 'JP-456789123',
      paymentTerms: 'Net 45',
      cancellationPolicy: 'flexible'
    },
    {
      id: 'client-4',
      name: 'Oceanic Services Inc',
      region: 'australia',
      contact: {
        name: 'Sarah Johnson',
        email: 'sarah@oceanic.com',
        phone: '+61 2 9876 5432'
      },
      billingAddress: '321 Harbor View, Sydney NSW 2000, Australia',
      taxId: 'AU-789123456',
      paymentTerms: 'Net 30',
      cancellationPolicy: 'strict'
    },
    {
      id: 'client-5',
      name: 'Latin American Traders',
      region: 'south-america',
      contact: {
        name: 'Carlos Mendez',
        email: 'carlos@latintraders.com',
        phone: '+55 11 3456 7890'
      },
      billingAddress: '654 Commerce Plaza, São Paulo 01310-100, Brazil',
      taxId: 'BR-321654987',
      paymentTerms: 'Net 60',
      cancellationPolicy: 'moderate'
    },
    {
      id: 'client-6',
      name: 'North Star Technologies',
      region: 'north-america',
      contact: {
        name: 'Mike Johnson',
        email: 'mike@northstar.com',
        phone: '+1 (555) 987-6543'
      },
      billingAddress: '789 Tech Park, Austin, TX 73301',
      taxId: 'US-987654321',
      paymentTerms: 'Net 30',
      cancellationPolicy: 'moderate'
    }
  ];

  // Initial appointments data with exact 24-hour cancellation cases
  const initialAppointments: Appointment[] = [
    {
      id: 'APT-001',
      clientId: 'client-1',
      personName: 'Alice Johnson',
      service: 'Strategic Consultation',
      date: '2025-01-15',
      time: '09:00 AM',
      duration: 60,
      rate: 200,
      status: 'completed',
      cancellation: null
    },
    {
      id: 'APT-002',
      clientId: 'client-1',
      personName: 'Bob Wilson',
      service: 'Technical Review',
      date: '2025-01-15',
      time: '11:00 AM',
      duration: 45,
      rate: 150,
      status: 'cancelled',
      cancellation: {
        timestamp: '2025-01-14 08:30',
        hoursBefore: 24.5,
        refundStatus: 'full',
        reason: 'Client emergency',
        reviewed: true
      }
    },
    {
      id: 'APT-003',
      clientId: 'client-1',
      personName: 'Carol Davis',
      service: 'Project Planning',
      date: '2025-01-15',
      time: '02:00 PM',
      duration: 90,
      rate: 250,
      status: 'cancelled',
      cancellation: {
        timestamp: '2025-01-15 13:45',
        hoursBefore: 0.25,
        refundStatus: 'none',
        reason: 'No show',
        reviewed: true
      }
    },
    {
      id: 'APT-004',
      clientId: 'client-1',
      personName: 'David Brown',
      service: 'Training Session',
      date: '2025-01-15',
      time: '04:00 PM',
      duration: 120,
      rate: 300,
      status: 'completed',
      cancellation: null
    },
    {
      id: 'APT-005',
      clientId: 'client-1',
      personName: 'Eva Martinez',
      service: 'Q&A Session',
      date: '2025-01-15',
      time: '10:30 AM',
      duration: 30,
      rate: 100,
      status: 'cancelled',
      cancellation: {
        timestamp: '2025-01-14 10:30',
        hoursBefore: 24,
        refundStatus: 'pending',
        reason: 'Double booked',
        reviewed: false
      }
    },
    {
      id: 'APT-006',
      clientId: 'client-2',
      personName: 'Frank Miller',
      service: 'Market Analysis',
      date: '2025-01-15',
      time: '09:30 AM',
      duration: 60,
      rate: 180,
      status: 'completed',
      cancellation: null
    },
    {
      id: 'APT-007',
      clientId: 'client-1',
      personName: 'Grace Lee',
      service: 'Implementation Review',
      date: '2025-01-16',
      time: '03:00 PM',
      duration: 45,
      rate: 175,
      status: 'cancelled',
      cancellation: {
        timestamp: '2025-01-15 15:00',
        hoursBefore: 24,
        refundStatus: 'pending',
        reason: 'Client rescheduled',
        reviewed: false
      }
    }
  ];

  useEffect(() => {
    setAppointments(initialAppointments);
  }, []);

  // Filter clients based on selected region
  const filteredClients = selectedRegion
    ? clients.filter((client) => client.region === selectedRegion)
    : clients;

  // Get selected client data
  const selectedClientData = clients.find(
    (client) => client.id === selectedClient
  );

  // Filter appointments based on column filters
  const clientAppointments = appointments
    .filter((apt) => apt.clientId === selectedClient)
    .filter((appointment) => {
      const matchesPersonName =
        appointmentFilters.personName === '' ||
        appointment.personName
          .toLowerCase()
          .includes(appointmentFilters.personName.toLowerCase());

      const matchesService =
        appointmentFilters.service === '' ||
        appointment.service
          .toLowerCase()
          .includes(appointmentFilters.service.toLowerCase());

      const matchesDate =
        appointmentFilters.date === '' ||
        appointment.date.includes(appointmentFilters.date);

      const matchesTime =
        appointmentFilters.time === '' ||
        appointment.time
          .toLowerCase()
          .includes(appointmentFilters.time.toLowerCase());

      const matchesDuration =
        appointmentFilters.duration === 'all' ||
        (appointmentFilters.duration === 'short' &&
          appointment.duration <= 30) ||
        (appointmentFilters.duration === 'medium' &&
          appointment.duration > 30 &&
          appointment.duration <= 60) ||
        (appointmentFilters.duration === 'long' && appointment.duration > 60);

      const matchesRate =
        appointmentFilters.rate === '' ||
        appointment.rate.toString().includes(appointmentFilters.rate);

      const matchesStatus =
        appointmentFilters.status === 'all' ||
        appointment.status === appointmentFilters.status;

      const matchesCancellationHours =
        appointmentFilters.cancellationHours === '' ||
        (appointment.cancellation &&
          appointment.cancellation.hoursBefore
            .toString()
            .includes(appointmentFilters.cancellationHours));

      const matchesRefundStatus =
        appointmentFilters.refundStatus === 'all' ||
        (appointment.cancellation &&
          appointment.cancellation.refundStatus ===
            appointmentFilters.refundStatus) ||
        (appointmentFilters.refundStatus === 'none' &&
          !appointment.cancellation);

      return (
        matchesPersonName &&
        matchesService &&
        matchesDate &&
        matchesTime &&
        matchesDuration &&
        matchesRate &&
        matchesStatus &&
        matchesCancellationHours &&
        matchesRefundStatus
      );
    });

  // Calculate metrics
  const calculateMetrics = (): Metrics | null => {
    if (!selectedClientData) return null;

    const totalContracts = clientAppointments.length;
    const cancelledContracts = clientAppointments.filter(
      (apt) => apt.status === 'cancelled'
    ).length;
    const cancelledWithoutRefund = clientAppointments.filter(
      (apt) => apt.cancellation?.refundStatus === 'none'
    ).length;
    const pendingReview = clientAppointments.filter(
      (apt) => apt.cancellation?.refundStatus === 'pending'
    ).length;

    const totalCharge = clientAppointments
      .filter(
        (apt) =>
          apt.status === 'completed' ||
          apt.cancellation?.refundStatus === 'none'
      )
      .reduce((sum, apt) => sum + apt.rate, 0);

    return {
      totalContracts,
      cancelledContracts,
      cancelledWithoutRefund,
      pendingReview,
      totalCharge,
      cancellationRate:
        totalContracts > 0
          ? Number(((cancelledContracts / totalContracts) * 100).toFixed(1))
          : 0
    };
  };

  const metrics = calculateMetrics();

  // Determine cancellation policy and action needed
  const getCancellationAction = (
    hoursBefore: number,
    clientPolicy: 'strict' | 'moderate' | 'flexible',
    refundStatus: 'full' | 'none' | 'pending' | undefined,
    reviewed: boolean | undefined
  ): 'free' | 'charge' | 'needs_review' => {
    const policyRules = {
      strict: { free: 48, review: 48 },
      moderate: { free: 24, review: 24 },
      flexible: { free: 12, review: 12 }
    };

    const rules = policyRules[clientPolicy] || policyRules.moderate;

    if (refundStatus === 'pending' && !reviewed) {
      return 'needs_review';
    }

    if (hoursBefore > rules.free) return 'free';
    if (hoursBefore < rules.review) return 'charge';
    if (Math.abs(hoursBefore - rules.review) < 0.001) {
      return 'needs_review';
    }
    return 'charge';
  };

  // Handle cancellation review decision
  const handleCancellationDecision = (
    appointmentId: string,
    decision: 'free' | 'charge'
  ) => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((apt) =>
        apt.id === appointmentId && apt.cancellation
          ? {
              ...apt,
              cancellation: {
                ...apt.cancellation,
                refundStatus: decision === 'free' ? 'full' : 'none',
                reviewed: true
              }
            }
          : apt
      )
    );
    setReviewDialog({ open: false, appointment: null });
  };

  // Generate invoice data
  const generateInvoiceData = (): InvoiceData | null => {
    if (!selectedClientData) return null;

    const invoiceItems: InvoiceItem[] = clientAppointments
      .filter(
        (apt) =>
          apt.status === 'completed' ||
          apt.cancellation?.refundStatus === 'none'
      )
      .map((apt) => ({
        description: `${apt.service} - ${apt.personName}`,
        date: apt.date,
        amount: apt.rate,
        type: apt.status === 'cancelled' ? 'Cancellation Fee' : 'Service Fee'
      }));

    const subtotal = invoiceItems.reduce((sum, item) => sum + item.amount, 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    // Determine invoice status based on due date
    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 30); // Net 30 days
    const status: 'paid' | 'overdue' | 'pending' = 'pending'; // Default status

    return {
      invoiceNumber: `INV-${Date.now()}`,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      items: invoiceItems,
      subtotal,
      tax,
      total,
      status
    };
  };

  const invoiceData = generateInvoiceData();

  // Print Functionality
  const handlePrint = () => {
    const invoiceElement = document.getElementById('invoice-content');
    if (invoiceElement) {
      const originalStyles = document.createElement('style');
      originalStyles.innerHTML = `
        @media print {
          body * {
            visibility: hidden;
          }
          #invoice-content, #invoice-content * {
            visibility: visible;
          }
          #invoice-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            box-shadow: none !important;
            border: 1px solid #000 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `;
      document.head.appendChild(originalStyles);
      window.print();
      document.head.removeChild(originalStyles);
    }
  };

  return (
    <PageContainer>
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Invoice Desk</h1>
            <p className='text-muted-foreground'>
              Manage client appointments, cancellations, and generate invoices
            </p>
          </div>
        </div>

        {/* Region and Client Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Client</CardTitle>
            <CardDescription>
              Choose a region and then select a client to view their appointment
              details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              {/* Region Selection */}
              <div className='space-y-3'>
                <Label htmlFor='region'>Select Region</Label>
                <Select
                  value={selectedRegion}
                  onValueChange={(value: string) => {
                    setSelectedRegion(value);
                    setSelectedClient('');
                  }}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Choose a region' />
                  </SelectTrigger>
                  <SelectContent className='w-full'>
                    <SelectItem value='all'>All Regions</SelectItem>
                    {regions.map((region) => (
                      <SelectItem key={region.id} value={region.id}>
                        {region.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Client Selection */}
              <div className='space-y-3'>
                <Label htmlFor='client'>Select Client</Label>
                <Select
                  value={selectedClient}
                  onValueChange={setSelectedClient}
                  disabled={!selectedRegion && filteredClients.length === 0}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue
                      placeholder={
                        selectedRegion
                          ? `Choose client from ${regions.find((r) => r.id === selectedRegion)?.name}`
                          : 'First select a region'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredClients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        <div className='flex items-center gap-2'>
                          <Building className='h-4 w-4' />
                          {client.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedRegion && filteredClients.length === 0 && (
                  <p className='text-muted-foreground text-sm'>
                    No clients found in this region.
                  </p>
                )}
              </div>
            </div>

            {/* Selected Client Info */}
            {selectedClientData && (
              <div className='bg-muted/50 mt-6 rounded-lg border p-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <Building className='text-primary h-8 w-8' />
                    <div>
                      <h3 className='font-semibold'>
                        {selectedClientData.name}
                      </h3>
                      <p className='text-muted-foreground text-sm'>
                        {selectedClientData.contact.name} •{' '}
                        {selectedClientData.contact.email}
                      </p>
                      <Badge variant='outline' className='mt-1 capitalize'>
                        {selectedClientData.cancellationPolicy} Cancellation
                        Policy
                      </Badge>
                    </div>
                  </div>
                  <Button
                    className='cursor-pointer bg-[#00A345] hover:bg-[#00A345]/10 hover:text-[#00A345]'
                    onClick={() =>
                      setContractDialog({
                        open: true,
                        client: selectedClientData
                      })
                    }
                  >
                    View Contract
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {selectedClientData && (
          <>
            {/* Metrics Dashboard */}
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total Contracts
                  </CardTitle>
                  <FileText className='text-muted-foreground h-4 w-4' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>430</div>
                  <p className='text-muted-foreground text-xs'>
                    For selected period
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Cancelled
                  </CardTitle>
                  <X className='text-muted-foreground h-4 w-4' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>47</div>
                  <p className='text-muted-foreground text-xs'>
                    {((47 / 430) * 100).toFixed(1)} % cancellation rate
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Not Refunded
                  </CardTitle>
                  <Book className='text-muted-foreground h-4 w-4' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>18</div>
                  <p className='text-muted-foreground text-xs'>
                    Late cancellations charged
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Pending Review
                  </CardTitle>
                  <Eye className='text-muted-foreground h-4 w-4' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>5</div>
                  <p className='text-muted-foreground text-xs'>
                    Need cancellation review
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Refund Amount
                  </CardTitle>
                  <DollarSign className='text-muted-foreground h-4 w-4' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>$2,250</div>
                  <p className='text-muted-foreground text-xs'>
                    For Pending Cancellations
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Client Details and People List */}
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
              {/* Client Information */}
              <Card className='lg:col-span-1'>
                <CardHeader>
                  <CardTitle>Client Information</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div>
                    <Label className='text-sm font-medium'>Company</Label>
                    <p className='text-sm'>{selectedClientData.name}</p>
                  </div>
                  <div>
                    <Label className='text-sm font-medium'>Contact</Label>
                    <p className='text-sm'>{selectedClientData.contact.name}</p>
                    <p className='text-muted-foreground text-sm'>
                      {selectedClientData.contact.email}
                    </p>
                    <p className='text-muted-foreground text-sm'>
                      {selectedClientData.contact.phone}
                    </p>
                  </div>
                  <div>
                    <Label className='text-sm font-medium'>
                      Billing Address
                    </Label>
                    <p className='text-muted-foreground text-sm'>
                      {selectedClientData.billingAddress}
                    </p>
                  </div>
                  <div>
                    <Label className='text-sm font-medium'>
                      Cancellation Policy
                    </Label>
                    <div className='space-y-1'>
                      <Badge variant='outline' className='capitalize'>
                        {selectedClientData.cancellationPolicy}
                      </Badge>
                      <p className='text-muted-foreground text-xs'>
                        {selectedClientData.cancellationPolicy === 'strict' &&
                          'Free cancellation before 48 hours'}
                        {selectedClientData.cancellationPolicy === 'moderate' &&
                          'Free cancellation before 24 hours'}
                        {selectedClientData.cancellationPolicy === 'flexible' &&
                          'Free cancellation before 12 hours'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* People List */}
              <Card className='lg:col-span-2'>
                <CardHeader>
                  <div className='flex items-center justify-between'>
                    <div>
                      <CardTitle>Appointment Details</CardTitle>
                      <CardDescription>
                        All appointments for {selectedClientData.name}
                      </CardDescription>
                    </div>
                    <div className='flex items-center gap-2'>
                      {metrics && metrics.pendingReview > 0 && (
                        <Badge
                          variant='test'
                          className='flex items-center gap-1'
                        >
                          <Eye className='h-3 w-3' />
                          {metrics.pendingReview} Need Review
                        </Badge>
                      )}
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                        className='cursor-pointer'
                      >
                        <SlidersHorizontal className='mr-2 h-4 w-4' />
                        Filters
                        {isFiltersOpen ? (
                          <ChevronUp className='ml-1 h-4 w-4' />
                        ) : (
                          <ChevronDown className='ml-1 h-4 w-4' />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Appointment Filters */}
                  <div
                    className={`mb-6 space-y-4 ${isFiltersOpen ? 'block' : 'hidden'}`}
                  >
                    <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'>
                      {/* Person Name Filter */}
                      <div className='space-y-2'>
                        <Label className='text-xs font-medium'>
                          Person Name
                        </Label>
                        <Input
                          placeholder='Filter by name...'
                          value={appointmentFilters.personName}
                          onChange={(e) =>
                            updateAppointmentFilter(
                              'personName',
                              e.target.value
                            )
                          }
                          className='h-8 text-sm'
                        />
                      </div>

                      {/* Service Filter */}
                      <div className='space-y-2'>
                        <Label className='text-xs font-medium'>Service</Label>
                        <Input
                          placeholder='Filter by service...'
                          value={appointmentFilters.service}
                          onChange={(e) =>
                            updateAppointmentFilter('service', e.target.value)
                          }
                          className='h-8 text-sm'
                        />
                      </div>

                      {/* Date Filter */}
                      <div className='space-y-2'>
                        <Label className='text-xs font-medium'>Date</Label>
                        <Input
                          type='date'
                          value={appointmentFilters.date}
                          onChange={(e) =>
                            updateAppointmentFilter('date', e.target.value)
                          }
                          className='h-8 text-sm'
                        />
                      </div>

                      {/* Time Filter */}
                      <div className='space-y-2'>
                        <Label className='text-xs font-medium'>Time</Label>
                        <Input
                          placeholder='Filter by time...'
                          value={appointmentFilters.time}
                          onChange={(e) =>
                            updateAppointmentFilter('time', e.target.value)
                          }
                          className='h-8 text-sm'
                        />
                      </div>

                      {/* Duration Filter */}
                      <div className='space-y-2'>
                        <Label className='text-xs font-medium'>Duration</Label>
                        <Select
                          value={appointmentFilters.duration}
                          onValueChange={(value) =>
                            updateAppointmentFilter('duration', value)
                          }
                        >
                          <SelectTrigger className='h-8 text-sm'>
                            <SelectValue placeholder='All durations' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='all'>All Durations</SelectItem>
                            <SelectItem value='short'>
                              Short (≤30 min)
                            </SelectItem>
                            <SelectItem value='medium'>
                              Medium (31-60 min)
                            </SelectItem>
                            <SelectItem value='long'>Long (60 min)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Rate Filter */}
                      <div className='space-y-2'>
                        <Label className='text-xs font-medium'>Rate</Label>
                        <Input
                          placeholder='Filter by rate...'
                          value={appointmentFilters.rate}
                          onChange={(e) =>
                            updateAppointmentFilter('rate', e.target.value)
                          }
                          className='h-8 text-sm'
                        />
                      </div>

                      {/* Status Filter */}
                      <div className='space-y-2'>
                        <Label className='text-xs font-medium'>Status</Label>
                        <Select
                          value={appointmentFilters.status}
                          onValueChange={(value) =>
                            updateAppointmentFilter('status', value)
                          }
                        >
                          <SelectTrigger className='h-8 text-sm'>
                            <SelectValue placeholder='All status' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='all'>All Status</SelectItem>
                            <SelectItem value='completed'>Completed</SelectItem>
                            <SelectItem value='cancelled'>Cancelled</SelectItem>
                            <SelectItem value='scheduled'>Scheduled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Refund Status Filter */}
                      <div className='space-y-2'>
                        <Label className='text-xs font-medium'>
                          Refund Status
                        </Label>
                        <Select
                          value={appointmentFilters.refundStatus}
                          onValueChange={(value) =>
                            updateAppointmentFilter('refundStatus', value)
                          }
                        >
                          <SelectTrigger className='h-8 text-sm'>
                            <SelectValue placeholder='All refund status' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='all'>
                              All Refund Status
                            </SelectItem>
                            <SelectItem value='full'>Full Refund</SelectItem>
                            <SelectItem value='none'>No Refund</SelectItem>
                            <SelectItem value='pending'>
                              Pending Review
                            </SelectItem>
                            <SelectItem value='none'>Not Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Clear Filters Button */}
                    <div className='flex justify-end'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={clearAppointmentFilters}
                        className='cursor-pointer'
                      >
                        <X className='mr-2 h-3 w-3' />
                        Clear Filters
                      </Button>
                    </div>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Person</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Rate</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Cancellation</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clientAppointments.map((appointment) => {
                        const cancellationAction = appointment.cancellation
                          ? getCancellationAction(
                              appointment.cancellation.hoursBefore,
                              selectedClientData.cancellationPolicy,
                              appointment.cancellation.refundStatus,
                              appointment.cancellation.reviewed
                            )
                          : null;

                        return (
                          <TableRow key={appointment.id}>
                            <TableCell>
                              <div className='font-medium'>
                                {appointment.personName}
                              </div>
                            </TableCell>
                            <TableCell>{appointment.service}</TableCell>
                            <TableCell>
                              <div className='flex flex-col'>
                                <div>{appointment.date}</div>
                                <div className='text-muted-foreground text-sm'>
                                  {appointment.time} ({appointment.duration}min)
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>${appointment.rate}</TableCell>
                            <TableCell>
                              {appointment.status === 'completed' ? (
                                <Badge
                                  variant='secondary'
                                  className='flex items-center gap-1'
                                >
                                  <CheckCircle className='h-3 w-3' />
                                  Completed
                                </Badge>
                              ) : appointment.status === 'cancelled' ? (
                                <Badge
                                  variant='destructive'
                                  className='flex items-center gap-1'
                                >
                                  <X className='h-3 w-3' />
                                  Cancelled
                                </Badge>
                              ) : (
                                <Badge variant='secondary'>Scheduled</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {appointment.cancellation ? (
                                <div className='space-y-1'>
                                  <div className='text-sm'>
                                    {appointment.cancellation.hoursBefore}h
                                    before
                                  </div>
                                  <div className='text-muted-foreground text-xs'>
                                    {appointment.cancellation.reason}
                                  </div>
                                </div>
                              ) : (
                                <span className='text-muted-foreground'>-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {cancellationAction === 'needs_review' && (
                                <Button
                                  variant='outline'
                                  size='sm'
                                  onClick={() =>
                                    setReviewDialog({ open: true, appointment })
                                  }
                                >
                                  <Eye className='mr-1 h-3 w-3' />
                                  Review
                                </Button>
                              )}
                              {cancellationAction === 'free' && (
                                <Badge variant='secondary'>Free Cancel</Badge>
                              )}
                              {cancellationAction === 'charge' && (
                                <Badge variant='destructive'>Charged</Badge>
                              )}
                              {!appointment.cancellation && (
                                <span className='text-muted-foreground'>-</span>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>

                  {clientAppointments.length === 0 && (
                    <div className='text-muted-foreground py-8 text-center'>
                      No appointments found matching your filters.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Generate Invoice Button */}
            <div className='flex justify-end'>
              <Button
                size='lg'
                onClick={() =>
                  setInvoiceDialog({ open: true, client: selectedClientData })
                }
                className='cursor-pointer bg-[#00A345] hover:bg-[#00A345]/10 hover:text-[#00A345]'
                disabled={!invoiceData || invoiceData.items.length === 0}
              >
                <Receipt className='mr-2 h-5 w-5' />
                Generate Invoice
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Cancellation Review Dialog */}
      <Dialog
        open={reviewDialog.open}
        onOpenChange={(open) => setReviewDialog({ open, appointment: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Cancellation</DialogTitle>
            <DialogDescription>
              This cancellation occurred exactly at the policy threshold. Please
              decide on refund.
            </DialogDescription>
          </DialogHeader>
          {reviewDialog.appointment && (
            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-4 text-sm'>
                <div>
                  <Label>Client</Label>
                  <p className='font-medium'>
                    {reviewDialog.appointment.personName}
                  </p>
                </div>
                <div>
                  <Label>Service</Label>
                  <p className='font-medium'>
                    {reviewDialog.appointment.service}
                  </p>
                </div>
                <div>
                  <Label>Amount</Label>
                  <p className='font-medium'>
                    ${reviewDialog.appointment.rate}
                  </p>
                </div>
                <div>
                  <Label>Cancelled</Label>
                  <p className='font-medium'>
                    {reviewDialog.appointment.cancellation?.hoursBefore}h before
                  </p>
                </div>
                <div className='col-span-2'>
                  <Label>Policy</Label>
                  <p className='font-medium capitalize'>
                    {selectedClientData?.cancellationPolicy}
                  </p>
                  <p className='text-muted-foreground text-xs'>
                    Free cancellation before{' '}
                    {selectedClientData?.cancellationPolicy === 'strict'
                      ? '48'
                      : selectedClientData?.cancellationPolicy === 'moderate'
                        ? '24'
                        : '12'}{' '}
                    hours
                  </p>
                </div>
              </div>
              <div>
                <Label>Reason for Cancellation</Label>
                <p className='text-muted-foreground bg-muted mt-2 rounded p-2 text-sm'>
                  {reviewDialog.appointment.cancellation?.reason}
                </p>
              </div>
            </div>
          )}
          <DialogFooter className='gap-2'>
            <Button
              variant='outline'
              onClick={() =>
                reviewDialog.appointment &&
                handleCancellationDecision(reviewDialog.appointment.id, 'free')
              }
              className='flex-1'
            >
              Free Cancellation
            </Button>
            <Button
              variant='destructive'
              onClick={() =>
                reviewDialog.appointment &&
                handleCancellationDecision(
                  reviewDialog.appointment.id,
                  'charge'
                )
              }
              className='flex-1'
            >
              Charge Full Amount (${reviewDialog.appointment?.rate})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invoice Dialog */}
      <Dialog
        open={invoiceDialog.open}
        onOpenChange={(open) => setInvoiceDialog({ open, client: null })}
      >
        <DialogContent className='max-h-[95vh] overflow-y-auto rounded-lg p-0 sm:max-w-[900px] lg:max-w-[1000px]'>
          <DialogHeader className='border-b p-6 pb-4'>
            <div className='flex items-center justify-between'>
              <div>
                <DialogTitle className='from-primary to-primary/60 bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent'>
                  Invoice Preview
                </DialogTitle>
                <DialogDescription className='mt-2 text-base'>
                  Review and manage invoice for{' '}
                  <span className='text-foreground font-semibold'>
                    {invoiceDialog.client?.name}
                  </span>
                </DialogDescription>
              </div>
              <div className='flex items-center gap-2'>
                <Badge
                  variant={
                    invoiceData?.status === 'paid'
                      ? 'default'
                      : invoiceData?.status === 'overdue'
                        ? 'destructive'
                        : 'secondary'
                  }
                  className='capitalize'
                >
                  {invoiceData?.status}
                </Badge>
              </div>
            </div>
          </DialogHeader>

          {invoiceData && invoiceDialog.client && (
            <div className='space-y-6 p-6'>
              {/* Quick Stats Bar */}
              <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                <Card className='border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 dark:border-blue-800 dark:from-blue-950/20 dark:to-blue-900/20'>
                  <CardContent className='p-4'>
                    <div className='flex items-center gap-3'>
                      <div className='rounded-full bg-blue-500/10 p-2'>
                        <Calendar className='h-4 w-4 text-blue-600 dark:text-blue-400' />
                      </div>
                      <div>
                        <p className='text-sm font-medium text-blue-700 dark:text-blue-300'>
                          Due Date
                        </p>
                        <p className='text-lg font-bold text-blue-900 dark:text-blue-100'>
                          {invoiceData.dueDate}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className='border-green-200 bg-gradient-to-br from-green-50 to-green-100 dark:border-green-800 dark:from-green-950/20 dark:to-green-900/20'>
                  <CardContent className='p-4'>
                    <div className='flex items-center gap-3'>
                      <div className='rounded-full bg-green-500/10 p-2'>
                        <DollarSign className='h-4 w-4 text-green-600 dark:text-green-400' />
                      </div>
                      <div>
                        <p className='text-sm font-medium text-green-700 dark:text-green-300'>
                          Total Amount
                        </p>
                        <p className='text-lg font-bold text-green-900 dark:text-green-100'>
                          ${invoiceData.total.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className='border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 dark:border-purple-800 dark:from-purple-950/20 dark:to-purple-900/20'>
                  <CardContent className='p-4'>
                    <div className='flex items-center gap-3'>
                      <div className='rounded-full bg-purple-500/10 p-2'>
                        <FileText className='h-4 w-4 text-purple-600 dark:text-purple-400' />
                      </div>
                      <div>
                        <p className='text-sm font-medium text-purple-700 dark:text-purple-300'>
                          Invoice #
                        </p>
                        <p className='text-lg font-bold text-purple-900 dark:text-purple-100'>
                          {invoiceData.invoiceNumber}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className='border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100 dark:border-amber-800 dark:from-amber-950/20 dark:to-amber-900/20'>
                  <CardContent className='p-4'>
                    <div className='flex items-center gap-3'>
                      <div className='rounded-full bg-amber-500/10 p-2'>
                        <Clock className='h-4 w-4 text-amber-600 dark:text-amber-400' />
                      </div>
                      <div>
                        <p className='text-sm font-medium text-amber-700 dark:text-amber-300'>
                          Payment Terms
                        </p>
                        <p className='text-lg font-bold text-amber-900 dark:text-amber-100'>
                          {invoiceDialog.client.paymentTerms}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Enhanced Invoice Preview */}
              <Card
                id='invoice-content'
                ref={invoiceRef}
                className='border-2 shadow-xl transition-all duration-300 hover:shadow-2xl'
              >
                <CardContent className='p-8'>
                  {/* Premium Header */}
                  <div className='mb-8 flex flex-col items-start justify-between border-b pb-6 lg:flex-row lg:items-center'>
                    <div className='space-y-3'>
                      <div className='flex items-center gap-3'>
                        <div className='from-primary to-primary/70 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br'>
                          <FileText className='h-6 w-6 text-white' />
                        </div>
                        <div>
                          <h1 className='from-primary to-primary/70 bg-gradient-to-r bg-clip-text text-3xl font-bold text-transparent'>
                            INVOICE
                          </h1>
                          <p className='text-muted-foreground font-mono'>
                            #{invoiceData.invoiceNumber}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className='mt-4 text-right lg:mt-0'>
                      <div className='bg-primary/10 inline-flex items-center gap-2 rounded-full px-4 py-2'>
                        <Building className='text-primary h-4 w-4' />
                        <span className='text-primary font-semibold'>
                          Your Company
                        </span>
                      </div>
                      <p className='text-muted-foreground mt-2 text-sm'>
                        123 Business Avenue
                        <br />
                        Suite 100, City, State 12345
                        <br />
                        contact@yourcompany.com
                      </p>
                    </div>
                  </div>

                  {/* Enhanced Details Grid */}
                  <div className='mb-8 grid grid-cols-1 gap-8 xl:grid-cols-3'>
                    {/* Bill To */}
                    <div className='space-y-4'>
                      <div className='flex items-center gap-2'>
                        <User className='text-primary h-4 w-4' />
                        <h3 className='text-lg font-semibold'>Bill To</h3>
                      </div>
                      <div className='bg-muted/30 space-y-2 rounded-lg p-4'>
                        <p className='text-foreground font-semibold'>
                          {invoiceDialog.client.name}
                        </p>
                        <p className='text-muted-foreground text-sm leading-relaxed'>
                          {invoiceDialog.client.billingAddress}
                        </p>
                        <div className='text-muted-foreground flex items-center gap-2 text-sm'>
                          <Badge variant='outline' className='text-xs'>
                            Tax ID: {invoiceDialog.client.taxId}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Invoice Details */}
                    <div className='space-y-4'>
                      <div className='flex items-center gap-2'>
                        <Calendar className='text-primary h-4 w-4' />
                        <h3 className='text-lg font-semibold'>
                          Invoice Details
                        </h3>
                      </div>
                      <div className='bg-muted/30 space-y-3 rounded-lg p-4'>
                        <div className='flex items-center justify-between'>
                          <span className='text-sm font-medium'>
                            Issue Date
                          </span>
                          <Badge variant='secondary'>
                            {invoiceData.issueDate}
                          </Badge>
                        </div>
                        <div className='flex items-center justify-between'>
                          <span className='text-sm font-medium'>Due Date</span>
                          <Badge
                            variant={
                              new Date(invoiceData.dueDate) < new Date()
                                ? 'destructive'
                                : 'default'
                            }
                          >
                            {invoiceData.dueDate}
                          </Badge>
                        </div>
                        <div className='flex items-center justify-between'>
                          <span className='text-sm font-medium'>Terms</span>
                          <span className='text-sm font-medium'>
                            {invoiceDialog.client.paymentTerms}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Status */}
                    <div className='space-y-4'>
                      <div className='flex items-center gap-2'>
                        <CreditCard className='text-primary h-4 w-4' />
                        <h3 className='text-lg font-semibold'>Payment</h3>
                      </div>
                      <div className='from-primary/5 to-primary/10 border-primary/20 rounded-lg border bg-gradient-to-br p-4'>
                        <div className='space-y-2 text-center'>
                          <div className='text-primary text-2xl font-bold'>
                            ${invoiceData.total.toFixed(2)}
                          </div>
                          <Badge
                            variant={
                              invoiceData.status === 'paid'
                                ? 'default'
                                : invoiceData.status === 'overdue'
                                  ? 'destructive'
                                  : 'secondary'
                            }
                            className='capitalize'
                          >
                            {invoiceData.status}
                          </Badge>
                          <p className='text-muted-foreground text-xs'>
                            Balance Due
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Items Table */}
                  <div className='mb-8'>
                    <div className='mb-4 flex items-center gap-2'>
                      <ListChecks className='text-primary h-4 w-4' />
                      <h3 className='text-lg font-semibold'>
                        Items & Services
                      </h3>
                    </div>
                    <div className='overflow-hidden rounded-lg border'>
                      <Table>
                        <TableHeader className='from-primary/5 to-primary/10 bg-gradient-to-r'>
                          <TableRow className='hover:bg-transparent'>
                            <TableHead className='w-[50%] font-semibold'>
                              Description
                            </TableHead>
                            <TableHead className='text-center font-semibold'>
                              Date
                            </TableHead>
                            <TableHead className='text-right font-semibold'>
                              Amount
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {invoiceData.items.map((item, index) => (
                            <TableRow
                              key={index}
                              className='group hover:bg-muted/50 transition-colors'
                            >
                              <TableCell>
                                <div className='space-y-1'>
                                  <div className='flex items-center gap-2 font-medium'>
                                    <div className='bg-primary h-2 w-2 rounded-full'></div>
                                    {item.description}
                                  </div>
                                  <div className='flex items-center gap-2'>
                                    <Badge
                                      variant='outline'
                                      className='text-xs capitalize'
                                    >
                                      {item.type}
                                    </Badge>
                                    <span className='text-muted-foreground text-xs'>
                                      Item #{index + 1}
                                    </span>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className='text-center'>
                                <div className='flex items-center justify-center gap-2'>
                                  <Calendar className='text-muted-foreground h-3 w-3' />
                                  {item.date}
                                </div>
                              </TableCell>
                              <TableCell className='text-right font-semibold'>
                                ${item.amount}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {/* Enhanced Total Section */}
                  <div className='flex justify-end'>
                    <div className='from-primary/5 to-primary/10 w-full space-y-4 rounded-lg border bg-gradient-to-br p-6 md:w-80'>
                      <div className='space-y-3'>
                        <div className='flex items-center justify-between'>
                          <span className='text-sm font-medium'>Subtotal</span>
                          <span className='font-semibold'>
                            ${invoiceData.subtotal.toFixed(2)}
                          </span>
                        </div>
                        <div className='flex items-center justify-between'>
                          <span className='text-sm font-medium'>Tax (10%)</span>
                          <span className='font-semibold'>
                            ${invoiceData.tax.toFixed(2)}
                          </span>
                        </div>
                        <div className='flex items-center justify-between border-t pt-3 text-lg font-bold'>
                          <span>Total Amount</span>
                          <span className='text-primary'>
                            ${invoiceData.total.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Payment Progress */}
                      <div className='border-t pt-4'>
                        <div className='text-muted-foreground mb-2 flex justify-between text-xs'>
                          <span>Payment Progress</span>
                          <span>
                            {invoiceData.status === 'paid' ? '100%' : '0%'}
                          </span>
                        </div>
                        <div className='bg-muted h-2 w-full rounded-full'>
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              invoiceData.status === 'paid'
                                ? 'w-full bg-green-500'
                                : 'bg-primary w-0'
                            }`}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Footer */}
                  <div className='mt-8 space-y-3 border-t pt-6 text-center'>
                    <div className='text-muted-foreground flex flex-col items-center justify-center gap-4 text-sm sm:flex-row'>
                      <div className='flex items-center gap-2'>
                        <Heart className='h-4 w-4 text-red-500' />
                        <span>Thank you for your business!</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Clock className='h-4 w-4 text-amber-500' />
                        <span>
                          Please make payment within{' '}
                          {invoiceDialog.client.paymentTerms} days
                        </span>
                      </div>
                    </div>
                    <p className='text-muted-foreground text-xs'>
                      Questions? Contact us at support@yourcompany.com or call
                      (555) 123-4567
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Action Buttons */}
              <div className='from-primary/5 to-primary/10 flex flex-col items-center justify-between gap-4 rounded-lg border bg-gradient-to-r p-6 sm:flex-row'>
                <div className='text-muted-foreground flex items-center gap-3 text-sm'>
                  <div className='flex items-center gap-2'>
                    <Eye className='h-4 w-4' />
                    <span>Preview ready for</span>
                  </div>
                  <Badge variant='outline' className='flex items-center gap-2'>
                    <User className='h-3 w-3' />
                    {invoiceDialog.client.name}
                  </Badge>
                </div>

                <div className='flex flex-wrap justify-end gap-3'>
                  <Button
                    variant='outline'
                    className='cursor-pointer gap-2 border-2'
                    onClick={handlePrint}
                  >
                    <Printer className='h-4 w-4' />
                    Print
                  </Button>

                  <Button
                    variant='outline'
                    className='cursor-pointer gap-2 border-2'
                    onClick={() => {
                      // Implement share functionality
                      alert('Share functionality would be implemented here');
                    }}
                  >
                    <Share2 className='h-4 w-4' />
                    Share
                  </Button>

                  <Button className='from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 cursor-pointer gap-2 bg-gradient-to-r'>
                    <Download className='h-4 w-4' />
                    Download PDF
                  </Button>

                  <Button
                    variant='secondary'
                    className='cursor-pointer gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800'
                  >
                    <Send className='h-4 w-4' />
                    Send Email
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Contract Dialog */}
      <Dialog
        open={contractDialog.open}
        onOpenChange={(open) => setContractDialog({ open, client: null })}
      >
        <DialogContent className='max-h-[90vh] w-full overflow-y-auto'>
          <DialogHeader>
            <DialogTitle className='text-center text-2xl font-bold'>
              MASTER SERVICE AGREEMENT
            </DialogTitle>
            <DialogDescription className='text-center'>
              This Master Service Agreement (&quot;Agreement&quot;) is executed
              as of [Effective Date] (&quot;Effective Date&quot;)
            </DialogDescription>
          </DialogHeader>

          <div className='prose prose-sm max-w-none'>
            <div className='mb-4 border-b pb-4'>
              <p className='text-sm leading-relaxed'>
                This Master Service Agreement (&quot;Agreement&quot;) is
                executed as of [Effective Date] (&quot;Effective Date&quot;), by
                and between [Client Name], whose principal place of business is
                located at [Client Address] (&quot;Client&quot;), and [Service
                Provider Name], whose principal place of business is located at
                [Service Provider Address] (&quot;Service Provider&quot;). The
                Client and the Service Provider may be individually referred to
                as a &quot;Party&quot; and collectively as the
                &quot;Parties&quot;.
              </p>
            </div>

            <div className='space-y-6 text-sm leading-relaxed'>
              <section>
                <h3 className='mb-2 text-lg font-bold'>1. Scope of Services</h3>
                <p className='ml-4'>
                  <strong>1.1 Services</strong>: The Service Provider hereby
                  commits to deliver the services delineated in the applicable
                  Statements of Work (&quot;SOW&quot;) duly executed by both
                  Parties, which shall be annexed hereto and incorporated by
                  reference.
                </p>
              </section>

              <div className='border-t pt-2' />

              <section>
                <h3 className='mb-2 text-lg font-bold'>
                  2. Term and Termination
                </h3>
                <p className='ml-4'>
                  <strong>2.1 Term</strong>: This Agreement shall commence on
                  the Effective Date and shall remain in effect until terminated
                  in accordance with the provisions herein.
                </p>
              </section>

              <div className='border-t pt-2' />

              <section>
                <h3 className='mb-2 text-lg font-bold'>3. Payment Terms</h3>
                <p className='ml-4'>
                  <strong>3.1 Fees</strong>: Client shall pay Service Provider
                  the fees as specified in the applicable SOW. All invoices are
                  due within 30 days of receipt.
                </p>
                <p className='mt-2 ml-4'>
                  <strong>3.2 Late Payment</strong>: Late payments shall accrue
                  interest at the rate of 1.5% per month.
                </p>
              </section>

              <div className='border-t pt-2' />

              <section>
                <h3 className='mb-2 text-lg font-bold'>4. Confidentiality</h3>
                <p className='ml-4'>
                  <strong>4.1 Obligation</strong>: Each party shall maintain the
                  confidentiality of all proprietary information received from
                  the other party.
                </p>
              </section>

              <div className='border-t pt-2' />

              <section>
                <h3 className='mb-2 text-lg font-bold'>
                  5. Intellectual Property
                </h3>
                <p className='ml-4'>
                  <strong>5.1 Ownership</strong>: Service Provider retains all
                  pre-existing intellectual property rights.
                </p>
              </section>

              <div className='border-t pt-2' />

              <section>
                <h3 className='mb-2 text-lg font-bold'>
                  6. Limitation of Liability
                </h3>
                <p className='ml-4'>
                  <strong>6.1 Cap</strong>: Neither party&apos;s liability shall
                  exceed the total fees paid under this Agreement.
                </p>
              </section>

              <div className='border-t pt-2' />

              <section>
                <h3 className='mb-2 text-lg font-bold'>
                  7. General Provisions
                </h3>
                <p className='ml-4'>
                  <strong>7.1 Governing Law</strong>: This Agreement shall be
                  governed by the laws of [State/Country].
                </p>
              </section>

              <div className='mt-6 border-t-2 border-dashed pt-6'>
                <p className='mb-6 text-center font-semibold'>
                  IN WITNESS WHEREOF, the parties have executed this Agreement
                  as of the Effective Date.
                </p>

                <div className='grid grid-cols-2 gap-8'>
                  <div className='text-center'>
                    <div className='mt-12 border-t border-gray-300 pt-2'>
                      <p className='font-semibold'>[Client Name]</p>
                      <p className='mt-4 text-sm text-gray-600'>
                        By: _________________________
                      </p>
                      <p className='text-sm text-gray-600'>
                        Title: ______________________
                      </p>
                    </div>
                  </div>

                  <div className='text-center'>
                    <div className='mt-12 border-t border-gray-300 pt-2'>
                      <p className='font-semibold'>[Service Provider Name]</p>
                      <p className='mt-4 text-sm text-gray-600'>
                        By: _________________________
                      </p>
                      <p className='text-sm text-gray-600'>
                        Title: ______________________
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setContractDialog({ open: false, client: null })}
            >
              Close
            </Button>
            <Button
              className='bg-[#00A345] hover:bg-[#00A345]/90'
              onClick={() => window.print()}
            >
              <Printer className='mr-2 h-4 w-4' />
              Print Contract
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};

export default InvoiceDesk;
