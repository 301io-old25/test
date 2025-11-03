'use client';

import React, { useState } from 'react';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Calendar,
  Clock,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  User,
  Phone,
  Mail,
  MapPin,
  X,
  CheckCircle,
  AlertCircle,
  CalendarX,
  Building,
  Scale,
  Stethoscope,
  Briefcase,
  GraduationCap,
  Car,
  Home,
  ChevronDown,
  ChevronUp,
  Upload,
  FileText,
  SlidersHorizontal
} from 'lucide-react';
import PageContainer from '@/components/layout/page-container';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// Type definitions
interface ContactPerson {
  name: string;
  email: string;
}

interface CancellationInfo {
  cancelled: boolean;
  cancelledBy: 'client' | 'firm' | 'agency' | 'service' | 'clinic' | null;
  cancelledAt: string | null;
  hoursBeforeAppointment: number | null;
  reason: string | null;
}

interface Appointment {
  id: string;
  company: string;
  poc: ContactPerson;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  professionalName: string;
  type:
    | 'counselling'
    | 'coaching'
    | 'support'
    | 'legal'
    | 'consultation'
    | 'assessment'
    | 'medical'
    | 'business'
    | 'education'
    | 'other';
  specialty: string;
  appointmentDate: string;
  appointmentTime: string;
  duration: number;
  status:
    | 'scheduled'
    | 'attended'
    | 'completed'
    | 'cancelled'
    | 'no-show'
    | 'rescheduled'
    | 'invoiced';
  location: string;
  cancellation: CancellationInfo;
  createdAt: string;
  notes: string;
}

interface CancellationStats {
  total: number;
  cancelled: number;
  cancelledByClient: number;
  cancelledByProfessional: number;
  averageCancellationTime: number;
}

interface FilterState {
  company: string;
  pocName: string;
  pocEmail: string;
  clientName: string;
  clientEmail: string;
  professionalName: string;
  type: string;
  specialty: string;
  status: string;
  location: string;
  dateFrom: string;
  dateTo: string;
  duration: string;
  cancelledBy: string;
}

const AppointmentsPage = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    company: '',
    pocName: '',
    pocEmail: '',
    clientName: '',
    clientEmail: '',
    professionalName: '',
    type: 'all',
    specialty: '',
    status: 'all',
    location: '',
    dateFrom: '',
    dateTo: '',
    duration: 'all',
    cancelledBy: 'all'
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      console.log('File uploaded:', file.name);
    }
  };

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearAllFilters = () => {
    setFilters({
      company: '',
      pocName: '',
      pocEmail: '',
      clientName: '',
      clientEmail: '',
      professionalName: '',
      type: 'all',
      specialty: '',
      status: 'all',
      location: '',
      dateFrom: '',
      dateTo: '',
      duration: 'all',
      cancelledBy: 'all'
    });
    setSearchTerm('');
  };

  const getAppointmentIcon = (type: string) => {
    const icons: Record<string, React.ComponentType<{ className?: string }>> = {
      medical: Stethoscope,
      legal: Scale,
      business: Briefcase,
      education: GraduationCap,
      automotive: Car,
      realestate: Home,
      government: Building,
      other: Calendar
    };
    const IconComponent = icons[type] || Calendar;
    return <IconComponent className='h-4 w-4' />;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      'default' | 'secondary' | 'destructive' | 'outline' | 'test'
    > = {
      scheduled: 'default',
      invoiced: 'test',
      cancelled: 'destructive',
      'no-show': 'destructive',
      rescheduled: 'secondary'
    };

    const icons: Record<string, React.ComponentType<{ className?: string }>> = {
      scheduled: Clock,
      invoiced: CheckCircle,
      cancelled: X,
      'no-show': AlertCircle,
      rescheduled: CalendarX
    };

    const IconComponent = icons[status];

    return (
      <Badge
        variant={variants[status] || 'test'}
        className='flex items-center gap-1 capitalize'
      >
        {IconComponent && <IconComponent className='h-3 w-3' />}
        {status.replace('-', ' ')}
      </Badge>
    );
  };

  // Sample appointments data (same as before)
 const appointments: Appointment[] = [
    {
      id: 'EAP-001',
      company: 'TechCorp Australia Pty Ltd',
      poc: { name: 'Jane Wilson', email: 'jane.wilson@techcorp.com' },
      clientName: 'Sarah Johnson',
      clientEmail: 'sarah.johnson@techcorp.com',
      clientPhone: '+61 412 345 678',
      professionalName: 'Dr. Michael Chen',
      type: 'counselling',
      specialty: 'Employee Counselling',
      appointmentDate: '2025-01-15',
      appointmentTime: '09:00 AM',
      duration: 50,
      status: 'attended',
      location: 'Telehealth',
      cancellation: {
        cancelled: false,
        cancelledBy: null,
        cancelledAt: null,
        hoursBeforeAppointment: null,
        reason: null
      },
      createdAt: '2025-01-10',
      notes:
        'Employee reported work stress; follow-up recommended after 2 weeks.'
    },
    {
      id: 'EAP-002',
      company: 'Innovate Labs Pty Ltd',
      poc: { name: 'Robert King', email: 'robert.king@innovatelabs.com' },
      clientName: 'David Thompson',
      clientEmail: 'david.thompson@innovatelabs.com',
      clientPhone: '+61 423 987 654',
      professionalName: 'Amanda Lee',
      type: 'coaching',
      specialty: 'Manager Support',
      appointmentDate: '2025-01-16',
      appointmentTime: '10:00 AM',
      duration: 60,
      status: 'cancelled',
      location: 'Video Call',
      cancellation: {
        cancelled: true,
        cancelledBy: 'client',
        cancelledAt: '2025-01-15 18:45',
        hoursBeforeAppointment: 15.25,
        reason: 'Client unavailable due to urgent site visit'
      },
      createdAt: '2025-01-09',
      notes: 'Initial leadership coaching session rescheduled.'
    },
    {
      id: 'EAP-003',
      company: 'Global Solutions Ltd',
      poc: { name: 'Emily Brown', email: 'emily.brown@globalsolutions.com' },
      clientName: 'Jennifer Kim',
      clientEmail: 'jennifer.kim@globalsolutions.com',
      clientPhone: '+61 400 567 890',
      professionalName: 'James Rodriguez',
      type: 'coaching',
      specialty: 'Financial Coaching',
      appointmentDate: '2025-01-17',
      appointmentTime: '02:00 PM',
      duration: 45,
      status: 'scheduled',
      location: 'Phone',
      cancellation: {
        cancelled: false,
        cancelledBy: null,
        cancelledAt: null,
        hoursBeforeAppointment: null,
        reason: null
      },
      createdAt: '2025-01-09',
      notes: 'Discussed budgeting and debt management; follow-up planned.'
    },
    {
      id: 'EAP-004',
      company: 'Brightline Manufacturing Pty Ltd',
      poc: { name: 'Alice Walker', email: 'alice.walker@brightline.com' },
      clientName: 'Mark Richardson',
      clientEmail: 'mark.richardson@brightline.com',
      clientPhone: '+61 433 222 111',
      professionalName: 'Dr. Emily Wilson',
      type: 'support',
      specialty: 'Critical Incident Support',
      appointmentDate: '2025-01-20',
      appointmentTime: '08:30 AM',
      duration: 90,
      status: 'completed',
      location: 'Onsite',
      cancellation: {
        cancelled: false,
        cancelledBy: null,
        cancelledAt: null,
        hoursBeforeAppointment: null,
        reason: null
      },
      createdAt: '2025-01-12',
      notes:
        'Group debrief following workplace accident; 6 participants attended.'
    },
    {
      id: 'EAP-005',
      company: 'Urban Retail Group',
      poc: { name: 'Tom Harris', email: 'tom.harris@urbanretail.com' },
      clientName: 'Emma Davis',
      clientEmail: 'emma.davis@urbanretail.com',
      clientPhone: '+61 455 789 654',
      professionalName: 'Amanda Lee',
      type: 'legal',
      specialty: 'Legal Assist',
      appointmentDate: '2025-01-22',
      appointmentTime: '11:00 AM',
      duration: 30,
      status: 'attended',
      location: 'Phone',
      cancellation: {
        cancelled: false,
        cancelledBy: null,
        cancelledAt: null,
        hoursBeforeAppointment: null,
        reason: null
      },
      createdAt: '2025-01-15',
      notes:
        'Legal support provided regarding employment contract interpretation.'
    },
    {
      id: 'EAP-006',
      company: 'Converge Australia – NSW Police Program',
      poc: { name: 'Peter Collins', email: 'peter.collins@police.nsw.gov.au' },
      clientName: 'Nathan Brooks',
      clientEmail: 'nathan.brooks@police.nsw.gov.au',
      clientPhone: '+61 400 777 321',
      professionalName: 'Dr. Laura Nguyen',
      type: 'counselling',
      specialty: 'Trauma Counselling',
      appointmentDate: '2025-01-25',
      appointmentTime: '03:00 PM',
      duration: 60,
      status: 'completed',
      location: 'Onsite',
      cancellation: {
        cancelled: false,
        cancelledBy: null,
        cancelledAt: null,
        hoursBeforeAppointment: null,
        reason: null
      },
      createdAt: '2025-01-18',
      notes: 'Post-critical incident debrief following field exposure.'
    },
    {
      id: 'EAP-007',
      company: 'City Bank Ltd',
      poc: { name: 'Lydia Green', email: 'lydia.green@citybank.com.au' },
      clientName: 'Olivia Turner',
      clientEmail: 'olivia.turner@citybank.com.au',
      clientPhone: '+61 422 888 555',
      professionalName: 'Dr. Matthew Scott',
      type: 'counselling',
      specialty: 'Employee Counselling',
      appointmentDate: '2025-02-02',
      appointmentTime: '01:00 PM',
      duration: 50,
      status: 'scheduled',
      location: 'Telehealth',
      cancellation: {
        cancelled: false,
        cancelledBy: null,
        cancelledAt: null,
        hoursBeforeAppointment: null,
        reason: null
      },
      createdAt: '2025-01-26',
      notes: 'First counselling session scheduled through HR referral.'
    },
    {
      id: 'EAP-008',
      company: 'Oceanic Mining Group',
      poc: { name: 'Marcus Boyd', email: 'marcus.boyd@oceanicmining.com' },
      clientName: 'Jake Reynolds',
      clientEmail: 'jake.reynolds@oceanicmining.com',
      clientPhone: '+61 411 456 987',
      professionalName: 'Dr. Karen Mitchell',
      type: 'consultation',
      specialty: 'Manager Assist',
      appointmentDate: '2025-02-05',
      appointmentTime: '04:00 PM',
      duration: 45,
      status: 'attended',
      location: 'Phone',
      cancellation: {
        cancelled: false,
        cancelledBy: null,
        cancelledAt: null,
        hoursBeforeAppointment: null,
        reason: null
      },
      createdAt: '2025-01-28',
      notes: 'Discussion about managing team conflict on-site.'
    },
    {
      id: 'EAP-009',
      company: 'EduFuture Schools Ltd',
      poc: { name: 'Tina Moore', email: 'tina.moore@edufuture.com' },
      clientName: 'Sophie Adams',
      clientEmail: 'sophie.adams@edufuture.com',
      clientPhone: '+61 403 222 444',
      professionalName: 'James Rodriguez',
      type: 'coaching',
      specialty: 'Wellbeing Coaching',
      appointmentDate: '2025-02-07',
      appointmentTime: '02:00 PM',
      duration: 45,
      status: 'scheduled',
      location: 'Video Call',
      cancellation: {
        cancelled: false,
        cancelledBy: null,
        cancelledAt: null,
        hoursBeforeAppointment: null,
        reason: null
      },
      createdAt: '2025-01-30',
      notes: 'Focus on resilience and classroom stress management.'
    },
    {
      id: 'EAP-010',
      company: 'Metro Utilities',
      poc: { name: 'Paul Edwards', email: 'paul.edwards@metroutilities.com' },
      clientName: 'Ben Carter',
      clientEmail: 'ben.carter@metroutilities.com',
      clientPhone: '+61 456 123 789',
      professionalName: 'Dr. Emily Wilson',
      type: 'support',
      specialty: 'Critical Incident Support',
      appointmentDate: '2025-02-09',
      appointmentTime: '09:00 AM',
      duration: 90,
      status: 'completed',
      location: 'Onsite',
      cancellation: {
        cancelled: false,
        cancelledBy: null,
        cancelledAt: null,
        hoursBeforeAppointment: null,
        reason: null
      },
      createdAt: '2025-02-02',
      notes: 'Debrief following workplace fatality; 8 participants attended.'
    },
    {
      id: 'EAP-011',
      company: 'Harbour Logistics Pty Ltd',
      poc: { name: 'Lucy Taylor', email: 'lucy.taylor@harbourlogistics.com' },
      clientName: 'Daniel White',
      clientEmail: 'daniel.white@harbourlogistics.com',
      clientPhone: '+61 490 654 321',
      professionalName: 'Dr. Laura Nguyen',
      type: 'counselling',
      specialty: 'Employee Counselling',
      appointmentDate: '2025-02-10',
      appointmentTime: '10:30 AM',
      duration: 50,
      status: 'attended',
      location: 'Phone',
      cancellation: {
        cancelled: false,
        cancelledBy: null,
        cancelledAt: null,
        hoursBeforeAppointment: null,
        reason: null
      },
      createdAt: '2025-02-03',
      notes: 'Stress management after traffic incident.'
    },
    {
      id: 'EAP-012',
      company: 'Sunrise Health Network',
      poc: {
        name: 'Michelle Clark',
        email: 'michelle.clark@sunrisehealth.org'
      },
      clientName: 'Hannah Lee',
      clientEmail: 'hannah.lee@sunrisehealth.org',
      clientPhone: '+61 421 999 123',
      professionalName: 'Dr. Matthew Scott',
      type: 'counselling',
      specialty: 'Wellbeing Support',
      appointmentDate: '2025-02-12',
      appointmentTime: '11:00 AM',
      duration: 50,
      status: 'scheduled',
      location: 'Telehealth',
      cancellation: {
        cancelled: false,
        cancelledBy: null,
        cancelledAt: null,
        hoursBeforeAppointment: null,
        reason: null
      },
      createdAt: '2025-02-05',
      notes: 'Counselling for work-life balance and emotional fatigue.'
    },
    {
      id: 'EAP-013',
      company: 'PeakTech Solutions',
      poc: { name: 'Adam Wells', email: 'adam.wells@peaktech.com' },
      clientName: 'Rachel Young',
      clientEmail: 'rachel.young@peaktech.com',
      clientPhone: '+61 438 556 909',
      professionalName: 'James Rodriguez',
      type: 'counselling',
      specialty: 'Employee Counselling',
      appointmentDate: '2025-02-15',
      appointmentTime: '01:30 PM',
      duration: 50,
      status: 'attended',
      location: 'Video Call',
      cancellation: {
        cancelled: false,
        cancelledBy: null,
        cancelledAt: null,
        hoursBeforeAppointment: null,
        reason: null
      },
      createdAt: '2025-02-08',
      notes: 'Session on burnout prevention and coping strategies.'
    },
    {
      id: 'EAP-014',
      company: 'Pacific Airlines',
      poc: {
        name: 'Samantha Brown',
        email: 'samantha.brown@pacificairlines.com'
      },
      clientName: 'Ethan Gray',
      clientEmail: 'ethan.gray@pacificairlines.com',
      clientPhone: '+61 421 567 123',
      professionalName: 'Dr. Karen Mitchell',
      type: 'assessment',
      specialty: 'Psychological Assessment',
      appointmentDate: '2025-02-17',
      appointmentTime: '09:00 AM',
      duration: 75,
      status: 'completed',
      location: 'Onsite',
      cancellation: {
        cancelled: false,
        cancelledBy: null,
        cancelledAt: null,
        hoursBeforeAppointment: null,
        reason: null
      },
      createdAt: '2025-02-10',
      notes: 'Routine psychological evaluation for safety clearance.'
    },
    {
      id: 'EAP-015',
      company: 'GreenBuild Construction',
      poc: { name: 'Neil Carter', email: 'neil.carter@greenbuild.com' },
      clientName: 'Logan Baker',
      clientEmail: 'logan.baker@greenbuild.com',
      clientPhone: '+61 402 333 777',
      professionalName: 'Dr. Laura Nguyen',
      type: 'support',
      specialty: 'Critical Incident Support',
      appointmentDate: '2025-02-20',
      appointmentTime: '08:00 AM',
      duration: 60,
      status: 'attended',
      location: 'Onsite',
      cancellation: {
        cancelled: false,
        cancelledBy: null,
        cancelledAt: null,
        hoursBeforeAppointment: null,
        reason: null
      },
      createdAt: '2025-02-13',
      notes: 'Support provided after workplace injury event.'
    }
  ];

  const filteredAppointments = appointments.filter((apt) => {
    // Global search
    const matchesSearch = searchTerm === '' ||
      apt.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.professionalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.poc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.poc.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.location.toLowerCase().includes(searchTerm.toLowerCase());

    // Individual column filters
    const matchesCompany = filters.company === '' || 
      apt.company.toLowerCase().includes(filters.company.toLowerCase());
    
    const matchesPOCName = filters.pocName === '' || 
      apt.poc.name.toLowerCase().includes(filters.pocName.toLowerCase());
    
    const matchesPOCEmail = filters.pocEmail === '' || 
      apt.poc.email.toLowerCase().includes(filters.pocEmail.toLowerCase());
    
    const matchesClientName = filters.clientName === '' || 
      apt.clientName.toLowerCase().includes(filters.clientName.toLowerCase());
    
    const matchesClientEmail = filters.clientEmail === '' || 
      apt.clientEmail.toLowerCase().includes(filters.clientEmail.toLowerCase());
    
    const matchesProfessionalName = filters.professionalName === '' || 
      apt.professionalName.toLowerCase().includes(filters.professionalName.toLowerCase());
    
    const matchesType = filters.type === 'all' || apt.type === filters.type;
    
    const matchesSpecialty = filters.specialty === '' || 
      apt.specialty.toLowerCase().includes(filters.specialty.toLowerCase());
    
    const matchesStatus = filters.status === 'all' || apt.status === filters.status;
    
    const matchesLocation = filters.location === '' || 
      apt.location.toLowerCase().includes(filters.location.toLowerCase());
    
    const matchesDateFrom = filters.dateFrom === '' || 
      new Date(apt.appointmentDate) >= new Date(filters.dateFrom);
    
    const matchesDateTo = filters.dateTo === '' || 
      new Date(apt.appointmentDate) <= new Date(filters.dateTo);
    
    const matchesDuration = filters.duration === 'all' || 
      (filters.duration === 'short' && apt.duration <= 30) ||
      (filters.duration === 'medium' && apt.duration > 30 && apt.duration <= 60) ||
      (filters.duration === 'long' && apt.duration > 60);
    
    const matchesCancelledBy = filters.cancelledBy === 'all' || 
      (filters.cancelledBy === 'none' && !apt.cancellation.cancelled) ||
      (filters.cancelledBy === 'client' && apt.cancellation.cancelledBy === 'client') ||
      (filters.cancelledBy === 'professional' && 
        ['firm', 'agency', 'service', 'clinic'].includes(apt.cancellation.cancelledBy || ''));

    return matchesSearch &&
      matchesCompany &&
      matchesPOCName &&
      matchesPOCEmail &&
      matchesClientName &&
      matchesClientEmail &&
      matchesProfessionalName &&
      matchesType &&
      matchesSpecialty &&
      matchesStatus &&
      matchesLocation &&
      matchesDateFrom &&
      matchesDateTo &&
      matchesDuration &&
      matchesCancelledBy;
  });

  const cancellationStats: CancellationStats = {
    total: appointments.length,
    cancelled: appointments.filter((apt) => apt.cancellation.cancelled).length,
    cancelledByClient: appointments.filter(
      (apt) => apt.cancellation.cancelledBy === 'client'
    ).length,
    cancelledByProfessional: appointments.filter((apt) =>
      ['firm', 'agency', 'service', 'clinic'].includes(
        apt.cancellation.cancelledBy || ''
      )
    ).length,
    averageCancellationTime:
      Math.round(
        appointments
          .filter((apt) => apt.cancellation.hoursBeforeAppointment)
          .reduce(
            (acc, apt) => acc + (apt.cancellation.hoursBeforeAppointment || 0),
            0
          ) /
          appointments.filter((apt) => apt.cancellation.hoursBeforeAppointment)
            .length
      ) || 0
  };

  // Mobile view component for appointments
  const MobileAppointmentCard = ({
    appointment
  }: {
    appointment: Appointment;
  }) => (
    <Card className='mb-4'>
      <CardContent className='p-4'>
        <div className='space-y-3'>
          {/* Header */}
          <div className='flex items-start justify-between'>
            <div className='flex items-center gap-3'>
              <div className='bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full'>
                {getAppointmentIcon(appointment.type)}
              </div>
              <div>
                <div className='text-sm font-medium'>
                  {appointment.clientName}
                </div>
                <div className='text-muted-foreground text-xs'>
                  {appointment.specialty}
                </div>
              </div>
            </div>
            {getStatusBadge(appointment.status)}
          </div>

          {/* Company & POC */}
          <div className='grid grid-cols-2 gap-2 text-sm'>
            <div>
              <div className='text-muted-foreground text-xs'>Company</div>
              <div className='truncate font-medium'>{appointment.company}</div>
            </div>
            <div>
              <div className='text-muted-foreground text-xs'>POC</div>
              <div className='truncate font-medium'>{appointment.poc.name}</div>
            </div>
          </div>

          {/* Date & Time */}
          <div className='flex items-center gap-2 text-sm'>
            <Calendar className='text-muted-foreground h-4 w-4' />
            <span className='font-medium'>{appointment.appointmentDate}</span>
            <span className='text-muted-foreground'>
              {appointment.appointmentTime}
            </span>
            <span className='text-muted-foreground'>
              ({appointment.duration}min)
            </span>
          </div>

          {/* Professional */}
          <div className='text-sm'>
            <div className='text-muted-foreground text-xs'>Professional</div>
            <div className='truncate font-medium'>
              {appointment.professionalName}
            </div>
            <div className='text-muted-foreground truncate text-xs'>
              {appointment.location}
            </div>
          </div>

          {/* Cancellation Details */}
          {appointment.cancellation.cancelled && (
            <div className='bg-muted/50 rounded-lg p-3 text-sm'>
              <div className='text-destructive font-medium'>
                Cancelled {appointment.cancellation.hoursBeforeAppointment}h
                before
              </div>
              <div className='text-muted-foreground text-xs'>
                By: {appointment.cancellation.cancelledBy}
              </div>
              <div className='text-muted-foreground mt-1 text-xs'>
                {appointment.cancellation.reason}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className='flex justify-end pt-2'>
            <Button variant='ghost' size='sm'>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <PageContainer scrollable={false}>
      <div className='space-y-6'>
        {/* Header - Grid System */}
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto] sm:items-center'>
          <div className='space-y-1'>
            <h1 className='text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl'>
              Appointments
            </h1>
            <p className='text-muted-foreground text-xs sm:text-sm lg:text-base'>
              Manage and track all appointments across different services
            </p>
          </div>
          <Button className='w-full cursor-pointer justify-self-end bg-[#00A345] hover:bg-[#00A345]/10 hover:text-[#00A345] sm:w-auto' onClick={() => setIsUploadDialogOpen(true)}>
            <Upload className='mr-2 h-4 w-4' />
            Upload Appointments
          </Button>
        </div>

        {/* Stats Cards - Enhanced Responsive Grid System */}
        <div className='xs:grid-cols-2 grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <Card className='grid grid-rows-[auto_1fr] p-0 px-2'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 p-3 pb-1'>
              <CardTitle className='text-xs font-medium sm:text-sm'>
                Total Appointments
              </CardTitle>
              <Calendar className='text-muted-foreground h-3 w-3 sm:h-4 sm:w-4' />
            </CardHeader>
            <CardContent className='p-3 pt-0'>
              <div className='text-lg font-bold sm:text-xl lg:text-2xl'>
                10,000
              </div>
              <p className='text-muted-foreground text-xs'>
                Overall appointments
              </p>
            </CardContent>
          </Card>

          <Card className='grid grid-rows-[auto_1fr] p-0 px-2'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 p-3 pb-1'>
              <CardTitle className='text-xs font-medium sm:text-sm'>
                Cancelled
              </CardTitle>
              <X className='text-muted-foreground h-3 w-3 sm:h-4 sm:w-4' />
            </CardHeader>
            <CardContent className='p-3 pt-0'>
              <div className='text-lg font-bold sm:text-xl lg:text-2xl'>
                1,460
              </div>
              <p className='text-muted-foreground text-xs'>
                {((1460 / 10000) * 100).toFixed(1)}% cancellation rate
              </p>
            </CardContent>
          </Card>

          <Card className='grid grid-rows-[auto_1fr] p-0 px-2'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 p-3 pb-1'>
              <CardTitle className='text-xs font-medium sm:text-sm'>
                Avg. Cancel Time
              </CardTitle>
              <Clock className='text-muted-foreground h-3 w-3 sm:h-4 sm:w-4' />
            </CardHeader>
            <CardContent className='p-3 pt-0'>
              <div className='text-lg font-bold sm:text-xl lg:text-2xl'>
                {cancellationStats.averageCancellationTime}h
              </div>
              <p className='text-muted-foreground text-xs'>
                before appointment
              </p>
            </CardContent>
          </Card>

          <Card className='grid grid-rows-[auto_1fr] p-0 px-2'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 p-3 pb-1'>
              <CardTitle className='text-xs font-medium sm:text-sm'>
                Refunded Appointments
              </CardTitle>
              <User className='text-muted-foreground h-3 w-3 sm:h-4 sm:w-4' />
            </CardHeader>
            <CardContent className='p-3 pt-0'>
              <div className='text-lg font-bold sm:text-xl lg:text-2xl'>
                1,009
              </div>
              <p className='text-muted-foreground text-xs'>
                {1009 > 0
                  ? `${((1009 / 10000) * 100).toFixed(1)}% of Total Appointments`
                  : 'No Total Appointments'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader className='pb-3'>
            <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
              <div>
                <CardTitle className='text-lg sm:text-xl'>
                  Appointment List
                </CardTitle>
                <CardDescription className='text-sm sm:text-base'>
                  Manage all appointments and track cancellation patterns
                </CardDescription>
              </div>
              <div className='flex w-full items-center gap-2 sm:w-auto'>
                <Button
                  variant='outline'
                  size='sm'
                  className='flex-1 cursor-pointer sm:flex-initial'
                  onClick={clearAllFilters}
                >
                  <X className='mr-2 h-4 w-4' />
                  <span className='hidden sm:inline'>Clear Filters</span>
                </Button>

                <Button
                  variant='outline'
                  size='sm'
                  className='flex-1 cursor-pointer sm:flex-initial'
                >
                  <Download className='mr-2 h-4 w-4' />
                  <span className='hidden sm:inline'>Export</span>
                </Button>

                {/* Mobile filter toggle */}
                <Button
                  variant='outline'
                  size='sm'
                  className='cursor-pointer sm:hidden'
                  onClick={() => setIsFiltersOpen(!isFiltersOpen)}
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
            {/* Search and Filters */}
            <div
              className={`mb-6 space-y-4 ${isFiltersOpen ? 'block' : 'hidden sm:block'}`}
            >
              {/* Global Search */}
              <div className='flex flex-col gap-4 sm:flex-row'>
                <div className='flex-1'>
                  <div className='relative'>
                    <Search className='text-muted-foreground absolute top-2.5 left-2 h-4 w-4' />
                    <Input
                      placeholder='Search all appointments...'
                      className='pl-8'
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Appointments Table */}
            <div className='hidden sm:block'>
              <div className='rounded-md border'>
                <div className='overflow-x-auto'>
                  <Table className='min-w-[1200px] lg:min-w-full'>
                    <TableHeader>
                      <TableRow>
                        <TableHead className='w-[120px]'>Company</TableHead>
                        <TableHead className='w-[120px]'>POC Name</TableHead>
                        <TableHead className='w-[150px]'>POC Email</TableHead>
                        <TableHead className='w-[180px]'>Appointment</TableHead>
                        <TableHead className='w-[100px]'>Type</TableHead>
                        <TableHead className='w-[140px]'>Date & Time</TableHead>
                        <TableHead className='w-[160px]'>Professional</TableHead>
                        <TableHead className='w-[100px]'>Status</TableHead>
                        <TableHead className='w-[150px]'>Cancellation Details</TableHead>
                        <TableHead className='w-[80px] text-right'>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAppointments.map((appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell className='w-[120px]'>
                            <div className='text-sm font-medium'>
                              {appointment.company}
                            </div>
                          </TableCell>
                          <TableCell className='w-[120px]'>
                            <div className='text-sm font-medium'>
                              {appointment.poc.name}
                            </div>
                          </TableCell>
                          <TableCell className='w-[150px]'>
                            <div className='text-sm font-medium'>
                              {appointment.poc.email}
                            </div>
                          </TableCell>
                          <TableCell className='w-[180px]'>
                            <div className='flex items-center gap-3'>
                              <div className='bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full'>
                                {getAppointmentIcon(appointment.type)}
                              </div>
                              <div className='flex flex-col'>
                                <div className='text-sm font-medium'>
                                  {appointment.clientName}
                                </div>
                                <div className='text-muted-foreground text-xs'>
                                  {appointment.specialty}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className='w-[100px]'>
                            <Badge
                              variant='outline'
                              className='text-xs capitalize'
                            >
                              {appointment.type}
                            </Badge>
                          </TableCell>
                          <TableCell className='w-[140px]'>
                            <div className='flex flex-col'>
                              <div className='text-sm font-medium'>
                                {appointment.appointmentDate}
                              </div>
                              <div className='text-muted-foreground text-xs'>
                                {appointment.appointmentTime} (
                                {appointment.duration}min)
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className='w-[160px]'>
                            <div className='flex flex-col'>
                              <div className='text-sm font-medium'>
                                {appointment.professionalName}
                              </div>
                              <div className='text-muted-foreground truncate text-xs'>
                                {appointment.location}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className='w-[100px]'>
                            {getStatusBadge(appointment.status)}
                          </TableCell>
                          <TableCell className='w-[150px]'>
                            {appointment.cancellation.cancelled ? (
                              <div className='flex flex-col text-xs'>
                                <div className='font-medium'>
                                  {appointment.cancellation.hoursBeforeAppointment}h before
                                </div>
                                <div className='text-muted-foreground'>
                                  By: {appointment.cancellation.cancelledBy}
                                </div>
                                <div className='text-muted-foreground truncate'>
                                  {appointment.cancellation.reason}
                                </div>
                              </div>
                            ) : (
                              <span className='text-muted-foreground text-sm'>-</span>
                            )}
                          </TableCell>
                          <TableCell className='w-[80px] text-right'>
                            <Button
                              variant='ghost'
                              size='sm'
                              className='cursor-pointer'
                            >
                              <MoreHorizontal className='h-4 w-4' />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>

            {/* Mobile View */}
            <div className='space-y-4 sm:hidden'>
              {filteredAppointments.map((appointment) => (
                <MobileAppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                />
              ))}
            </div>

            {filteredAppointments.length === 0 && (
              <div className='text-muted-foreground py-8 text-center'>
                No appointments found matching your filters.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Appointments</DialogTitle>
            <DialogDescription>
              Upload an Excel file to add new appointments to your existing records.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <FileText className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  {uploadedFile ? uploadedFile.name : 'Choose Excel file to upload'}
                </p>
                <Input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  className="cursor-pointer"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Choose File
                </Button>
              </div>
            </div>
            {uploadedFile && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  File {uploadedFile.name} selected successfully. 
                  Your existing appointments will remain unchanged.
                </p>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsUploadDialogOpen(false);
                setUploadedFile(null);
              }}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                console.log('Processing file:', uploadedFile);
                setIsUploadDialogOpen(false);
                setUploadedFile(null);
              }}
              disabled={!uploadedFile}
              className="cursor-pointer bg-[#00A345] hover:bg-[#00A345]/90"
            >
              Upload & Process
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};

export default AppointmentsPage;