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
  FileText
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
    | 'medical'
    | 'legal'
    | 'business'
    | 'education'
    | 'automotive'
    | 'realestate'
    | 'government'
    | 'other';
  specialty: string;
  appointmentDate: string;
  appointmentTime: string;
  duration: number;
  status: 'scheduled' | 'invoiced' | 'cancelled' | 'no-show' | 'rescheduled';
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

const AppointmentsPage = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);


   const [isUploadDialogOpen, setIsUploadDialogOpen] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      // Here you can process the Excel file
      // For now, we'll just show success message
      console.log('File uploaded:', file.name);
    }
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

  // Sample appointments data
  const appointments: Appointment[] = [
    {
      id: 'APT-001',
      company: 'TechCorp Inc',
      poc: { name: 'John Smith', email: 'john.smith@example.com' },
      clientName: 'Sarah Johnson',
      clientEmail: 'sarah.j@email.com',
      clientPhone: '+1 (555) 123-4567',
      professionalName: 'Dr. Michael Chen',
      type: 'medical',
      specialty: 'Cardiology',
      appointmentDate: '2024-01-15',
      appointmentTime: '09:00 AM',
      duration: 30,
      status: 'invoiced',
      location: 'Medical Center - Room 205',
      cancellation: {
        cancelled: false,
        cancelledBy: null,
        cancelledAt: null,
        hoursBeforeAppointment: null,
        reason: null
      },
      createdAt: '2024-01-10',
      notes: 'Routine checkup'
    },
    {
      id: 'APT-002',
      company: 'Innovate Labs',
      poc: { name: 'Sarah Johnson', email: 'sarah.j@example.com' },
      clientName: 'Robert Martinez',
      clientEmail: 'robert.m@email.com',
      clientPhone: '+1 (555) 234-5678',
      professionalName: 'Dr. Emily Wilson',
      type: 'medical',
      specialty: 'Dermatology',
      appointmentDate: '2024-01-16',
      appointmentTime: '10:30 AM',
      duration: 45,
      status: 'cancelled',
      location: 'Skin Clinic - Suite 100',
      cancellation: {
        cancelled: true,
        cancelledBy: 'client',
        cancelledAt: '2024-01-15 20:15',
        hoursBeforeAppointment: 14.25,
        reason: 'Family emergency'
      },
      createdAt: '2024-01-08',
      notes: 'Skin condition follow-up'
    },
    {
      id: 'APT-003',
      company: 'Global Solutions',
      poc: { name: 'Michael Chen', email: 'michael.chen@example.com' },
      clientName: 'Jennifer Kim',
      clientEmail: 'jennifer.k@email.com',
      clientPhone: '+1 (555) 345-6789',
      professionalName: 'Atty. James Rodriguez',
      type: 'legal',
      specialty: 'Corporate Law',
      appointmentDate: '2024-01-17',
      appointmentTime: '02:00 PM',
      duration: 60,
      status: 'scheduled',
      location: 'Law Offices - Conference Room B',
      cancellation: {
        cancelled: false,
        cancelledBy: null,
        cancelledAt: null,
        hoursBeforeAppointment: null,
        reason: null
      },
      createdAt: '2024-01-09',
      notes: 'Contract review consultation'
    },
    {
      id: 'APT-004',
      company: 'TechCorp Inc',
      poc: { name: 'John Smith', email: 'john.smith@example.com' },
      clientName: 'David Thompson',
      clientEmail: 'david.t@email.com',
      clientPhone: '+1 (555) 456-7890',
      professionalName: 'Atty. Amanda Lee',
      type: 'legal',
      specialty: 'Family Law',
      appointmentDate: '2024-01-18',
      appointmentTime: '11:15 AM',
      duration: 30,
      status: 'cancelled',
      location: 'Legal Aid Society',
      cancellation: {
        cancelled: true,
        cancelledBy: 'firm',
        cancelledAt: '2024-01-17 09:30',
        hoursBeforeAppointment: 25.75,
        reason: 'Attorney unavailable - court conflict'
      },
      createdAt: '2024-01-05',
      notes: 'Divorce consultation'
    },
    {
      id: 'APT-005',
      company: 'Innovate Labs',
      poc: { name: 'Sarah Johnson', email: 'sarah.j@example.com' },
      clientName: 'Tech Solutions Inc.',
      clientEmail: 'contact@techsolutions.com',
      clientPhone: '+1 (555) 567-8901',
      professionalName: 'ABC Consulting Group',
      type: 'business',
      specialty: 'Strategic Planning',
      appointmentDate: '2024-01-19',
      appointmentTime: '03:30 PM',
      duration: 45,
      status: 'no-show',
      location: 'Virtual Meeting',
      cancellation: {
        cancelled: false,
        cancelledBy: null,
        cancelledAt: null,
        hoursBeforeAppointment: null,
        reason: null
      },
      createdAt: '2024-01-07',
      notes: 'Q1 Strategy session'
    },
    {
      id: 'APT-006',
      company: 'Global Solutions',
      poc: { name: 'Michael Chen', email: 'michael.chen@example.com' },
      clientName: 'Mark Richardson',
      clientEmail: 'mark.r@email.com',
      clientPhone: '+1 (555) 678-9012',
      professionalName: 'XYZ Financial Advisors',
      type: 'business',
      specialty: 'Investment Planning',
      appointmentDate: '2024-01-20',
      appointmentTime: '08:45 AM',
      duration: 30,
      status: 'cancelled',
      location: 'Financial District Office',
      cancellation: {
        cancelled: true,
        cancelledBy: 'client',
        cancelledAt: '2024-01-20 07:30',
        hoursBeforeAppointment: 1.25,
        reason: 'Urgent board meeting'
      },
      createdAt: '2024-01-12',
      notes: 'Portfolio review'
    },
    {
      id: 'APT-007',
      company: 'TechCorp Inc',
      poc: { name: 'John Smith', email: 'john.smith@example.com' },
      clientName: 'Maria Garcia',
      clientEmail: 'maria.g@email.com',
      clientPhone: '+1 (555) 789-0123',
      professionalName: 'Prof. Emily Wilson',
      type: 'education',
      specialty: 'Academic Counseling',
      appointmentDate: '2024-01-21',
      appointmentTime: '01:00 PM',
      duration: 60,
      status: 'scheduled',
      location: 'University Campus - Office 304',
      cancellation: {
        cancelled: false,
        cancelledBy: null,
        cancelledAt: null,
        hoursBeforeAppointment: null,
        reason: null
      },
      createdAt: '2024-01-11',
      notes: 'Graduate program advising'
    },
    {
      id: 'APT-008',
      company: 'Innovate Labs',
      poc: { name: 'Sarah Johnson', email: 'sarah.j@example.com' },
      clientName: 'Thomas Wilson',
      clientEmail: 'thomas.w@email.com',
      clientPhone: '+1 (555) 890-1234',
      professionalName: 'City Auto Service',
      type: 'automotive',
      specialty: 'Maintenance',
      appointmentDate: '2024-01-22',
      appointmentTime: '10:00 AM',
      duration: 45,
      status: 'cancelled',
      location: 'Main Street Garage',
      cancellation: {
        cancelled: true,
        cancelledBy: 'client',
        cancelledAt: '2024-01-21 15:45',
        hoursBeforeAppointment: 18.25,
        reason: 'Vehicle not available'
      },
      createdAt: '2024-01-06',
      notes: '60,000 mile service'
    },
    {
      id: 'APT-009',
      company: 'Global Solutions',
      poc: { name: 'Michael Chen', email: 'michael.chen@example.com' },
      clientName: 'Emma Davis',
      clientEmail: 'emma.d@email.com',
      clientPhone: '+1 (555) 901-2345',
      professionalName: 'Prime Realty Group',
      type: 'realestate',
      specialty: 'Residential Sales',
      appointmentDate: '2024-01-23',
      appointmentTime: '11:30 AM',
      duration: 30,
      status: 'invoiced',
      location: '123 Main St - Property Viewing',
      cancellation: {
        cancelled: false,
        cancelledBy: null,
        cancelledAt: null,
        hoursBeforeAppointment: null,
        reason: null
      },
      createdAt: '2024-01-13',
      notes: 'Home viewing appointment'
    },
    {
      id: 'APT-010',
      company: 'TechCorp Inc',
      poc: { name: 'John Smith', email: 'john.smith@example.com' },
      clientName: 'Christopher Lee',
      clientEmail: 'chris.l@email.com',
      clientPhone: '+1 (555) 012-3456',
      professionalName: 'DMV Office',
      type: 'government',
      specialty: 'License Services',
      appointmentDate: '2024-01-24',
      appointmentTime: '02:15 PM',
      duration: 60,
      status: 'cancelled',
      location: 'Downtown DMV',
      cancellation: {
        cancelled: true,
        cancelledBy: 'agency',
        cancelledAt: '2024-01-23 14:20',
        hoursBeforeAppointment: 23.92,
        reason: 'Office closure - weather'
      },
      createdAt: '2024-01-14',
      notes: 'Driver license renewal'
    },
    {
      id: 'APT-011',
      company: 'Innovate Labs',
      poc: { name: 'Sarah Johnson', email: 'sarah.j@example.com' },
      clientName: 'Olivia Parker',
      clientEmail: 'olivia.p@email.com',
      clientPhone: '+1 (555) 123-4567',
      professionalName: 'Dr. Sarah Johnson',
      type: 'medical',
      specialty: 'Pediatrics',
      appointmentDate: '2024-01-25',
      appointmentTime: '09:30 AM',
      duration: 30,
      status: 'scheduled',
      location: 'Childrens Hospital - Clinic A',
      cancellation: {
        cancelled: false,
        cancelledBy: null,
        cancelledAt: null,
        hoursBeforeAppointment: null,
        reason: null
      },
      createdAt: '2024-01-15',
      notes: 'Well-child visit'
    },
    {
      id: 'APT-012',
      company: 'Global Solutions',
      poc: { name: 'Michael Chen', email: 'michael.chen@example.com' },
      clientName: 'Daniel White',
      clientEmail: 'daniel.w@email.com',
      clientPhone: '+1 (555) 234-5678',
      professionalName: 'Legal Defense Associates',
      type: 'legal',
      specialty: 'Criminal Defense',
      appointmentDate: '2024-01-26',
      appointmentTime: '03:00 PM',
      duration: 45,
      status: 'cancelled',
      location: 'Court Building - Room 502',
      cancellation: {
        cancelled: true,
        cancelledBy: 'client',
        cancelledAt: '2024-01-25 22:10',
        hoursBeforeAppointment: 16.83,
        reason: 'Case settled out of court'
      },
      createdAt: '2024-01-16',
      notes: 'Case strategy meeting'
    },
    {
      id: 'APT-013',
      company: 'TechCorp Inc',
      poc: { name: 'John Smith', email: 'john.smith@example.com' },
      clientName: 'Global Enterprises Ltd.',
      clientEmail: 'legal@globalent.com',
      clientPhone: '+1 (555) 345-6789',
      professionalName: 'Smith & Partners Law Firm',
      type: 'legal',
      specialty: 'International Business',
      appointmentDate: '2024-01-27',
      appointmentTime: '10:45 AM',
      duration: 30,
      status: 'invoiced',
      location: 'Virtual Meeting',
      cancellation: {
        cancelled: false,
        cancelledBy: null,
        cancelledAt: null,
        hoursBeforeAppointment: null,
        reason: null
      },
      createdAt: '2024-01-17',
      notes: 'Merger agreement discussion'
    },
    {
      id: 'APT-014',
      company: 'Innovate Labs',
      poc: { name: 'Sarah Johnson', email: 'sarah.j@example.com' },
      clientName: 'Matthew Taylor',
      clientEmail: 'matthew.t@email.com',
      clientPhone: '+1 (555) 456-7890',
      professionalName: 'City College Admissions',
      type: 'education',
      specialty: 'Student Services',
      appointmentDate: '2024-01-28',
      appointmentTime: '01:30 PM',
      duration: 60,
      status: 'cancelled',
      location: 'Admissions Office - Room 101',
      cancellation: {
        cancelled: true,
        cancelledBy: 'client',
        cancelledAt: '2024-01-27 08:00',
        hoursBeforeAppointment: 29.5,
        reason: 'Decided on different college'
      },
      createdAt: '2024-01-18',
      notes: 'Transfer student evaluation'
    },
    {
      id: 'APT-015',
      company: 'Global Solutions',
      poc: { name: 'Michael Chen', email: 'michael.chen@example.com' },
      clientName: 'Ava Martinez',
      clientEmail: 'ava.m@email.com',
      clientPhone: '+1 (555) 567-8901',
      professionalName: 'Dr. Michael Chen',
      type: 'medical',
      specialty: 'Cardiology',
      appointmentDate: '2024-01-29',
      appointmentTime: '11:00 AM',
      duration: 45,
      status: 'scheduled',
      location: 'Heart Center - Suite 300',
      cancellation: {
        cancelled: false,
        cancelledBy: null,
        cancelledAt: null,
        hoursBeforeAppointment: null,
        reason: null
      },
      createdAt: '2024-01-19',
      notes: 'High blood pressure monitoring'
    },
    {
      id: 'APT-016',
      company: 'TechCorp Inc',
      poc: { name: 'John Smith', email: 'john.smith@example.com' },
      clientName: 'Ethan Harris',
      clientEmail: 'ethan.h@email.com',
      clientPhone: '+1 (555) 678-9012',
      professionalName: 'Quick Lube Center',
      type: 'automotive',
      specialty: 'Maintenance',
      appointmentDate: '2024-01-30',
      appointmentTime: '02:45 PM',
      duration: 30,
      status: 'cancelled',
      location: 'Auto Service Center',
      cancellation: {
        cancelled: true,
        cancelledBy: 'service',
        cancelledAt: '2024-01-29 16:30',
        hoursBeforeAppointment: 22.25,
        reason: 'Parts delivery delayed'
      },
      createdAt: '2024-01-20',
      notes: 'Oil change and tire rotation'
    },
    {
      id: 'APT-017',
      company: 'Innovate Labs',
      poc: { name: 'Sarah Johnson', email: 'sarah.j@example.com' },
      clientName: 'Isabella Clark',
      clientEmail: 'isabella.c@email.com',
      clientPhone: '+1 (555) 789-0123',
      professionalName: 'Dream Homes Realty',
      type: 'realestate',
      specialty: 'Property Viewing',
      appointmentDate: '2024-01-31',
      appointmentTime: '03:15 PM',
      duration: 45,
      status: 'scheduled',
      location: '456 Oak Avenue',
      cancellation: {
        cancelled: false,
        cancelledBy: null,
        cancelledAt: null,
        hoursBeforeAppointment: null,
        reason: null
      },
      createdAt: '2024-01-21',
      notes: 'First-time home buyer consultation'
    },
    {
      id: 'APT-018',
      company: 'Global Solutions',
      poc: { name: 'Michael Chen', email: 'michael.chen@example.com' },
      clientName: 'Noah Rodriguez',
      clientEmail: 'noah.r@email.com',
      clientPhone: '+1 (555) 890-1234',
      professionalName: 'IRS Tax Assistance',
      type: 'government',
      specialty: 'Tax Services',
      appointmentDate: '2024-02-01',
      appointmentTime: '09:00 AM',
      duration: 60,
      status: 'rescheduled',
      location: 'Federal Building - Room 205',
      cancellation: {
        cancelled: true,
        cancelledBy: 'agency',
        cancelledAt: '2024-01-31 14:00',
        hoursBeforeAppointment: 19,
        reason: 'Agent illness'
      },
      createdAt: '2024-01-22',
      notes: 'Tax audit preparation'
    },
    {
      id: 'APT-019',
      company: 'TechCorp Inc',
      poc: { name: 'John Smith', email: 'john.smith@example.com' },
      clientName: 'Sophia Brown',
      clientEmail: 'sophia.b@email.com',
      clientPhone: '+1 (555) 901-2345',
      professionalName: 'Business Growth Consultants',
      type: 'business',
      specialty: 'Marketing Strategy',
      appointmentDate: '2024-02-02',
      appointmentTime: '10:30 AM',
      duration: 30,
      status: 'invoiced',
      location: 'Consulting Firm - Boardroom',
      cancellation: {
        cancelled: false,
        cancelledBy: null,
        cancelledAt: null,
        hoursBeforeAppointment: null,
        reason: null
      },
      createdAt: '2024-01-23',
      notes: 'Digital marketing plan review'
    },
    {
      id: 'APT-020',
      company: 'Innovate Labs',
      poc: { name: 'Sarah Johnson', email: 'sarah.j@example.com' },
      clientName: 'Lucas Anderson',
      clientEmail: 'lucas.a@email.com',
      clientPhone: '+1 (555) 012-3456',
      professionalName: 'University Tutoring Center',
      type: 'education',
      specialty: 'Academic Support',
      appointmentDate: '2024-02-03',
      appointmentTime: '01:00 PM',
      duration: 45,
      status: 'cancelled',
      location: 'Learning Commons - Room 12',
      cancellation: {
        cancelled: true,
        cancelledBy: 'client',
        cancelledAt: '2024-02-02 18:45',
        hoursBeforeAppointment: 18.25,
        reason: 'Exam schedule changed'
      },
      createdAt: '2024-01-24',
      notes: 'Calculus tutoring session'
    }
  ];

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.professionalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.poc.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    const matchesType = typeFilter === 'all' || apt.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
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
                {cancellationStats.total}
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
                {cancellationStats.cancelled}
              </div>
              <p className='text-muted-foreground text-xs'>
                {(
                  (cancellationStats.cancelled / cancellationStats.total) *
                  100
                ).toFixed(1)}
                % cancellation rate
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
                Client Cancellations
              </CardTitle>
              <User className='text-muted-foreground h-3 w-3 sm:h-4 sm:w-4' />
            </CardHeader>
            <CardContent className='p-3 pt-0'>
              <div className='text-lg font-bold sm:text-xl lg:text-2xl'>
                {cancellationStats.cancelledByClient}
              </div>
              <p className='text-muted-foreground text-xs'>
                {cancellationStats.cancelled > 0
                  ? `${((cancellationStats.cancelledByClient / cancellationStats.cancelled) * 100).toFixed(1)}% of cancellations`
                  : 'No cancellations'}
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
                  <Filter className='mr-2 h-4 w-4' />
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
          <CardContent className=''>
            {/* Search and Filters */}
            <div
              className={`mb-6 ${isFiltersOpen ? 'block' : 'hidden sm:block'}`}
            >
              <div className='flex flex-col gap-4 sm:flex-row'>
                <div className='flex-1'>
                  <div className='relative'>
                    <Search className='text-muted-foreground absolute top-2.5 left-2 h-4 w-4' />
                    <Input
                      placeholder='Search appointments...'
                      className='pl-8'
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className='flex gap-2'>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className='w-full sm:w-[140px]'>
                      <SelectValue placeholder='Status' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All Status</SelectItem>
                      <SelectItem value='scheduled'>Scheduled</SelectItem>
                      <SelectItem value='invoiced'>Completed</SelectItem>
                      <SelectItem value='cancelled'>Cancelled</SelectItem>
                      <SelectItem value='no-show'>No Show</SelectItem>
                      <SelectItem value='rescheduled'>Rescheduled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className='w-full sm:w-[140px]'>
                      <SelectValue placeholder='Type' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All Types</SelectItem>
                      <SelectItem value='medical'>Medical</SelectItem>
                      <SelectItem value='legal'>Legal</SelectItem>
                      <SelectItem value='business'>Business</SelectItem>
                      <SelectItem value='education'>Education</SelectItem>
                      <SelectItem value='automotive'>Automotive</SelectItem>
                      <SelectItem value='realestate'>Real Estate</SelectItem>
                      <SelectItem value='government'>Government</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Appointments Table - Hidden on mobile */}
            {/* Appointments Table - Hidden on mobile */}
            <div className='hidden sm:block'>
              <div className='rounded-md border'>
                <div className='overflow-x-auto'>
                  <Table className='min-w-[1000px] lg:min-w-full'>
                    <TableHeader>
                      <TableRow>
                        <TableHead className='w-[120px]'>Company</TableHead>
                        <TableHead className='w-[120px]'>POC Name</TableHead>
                        <TableHead className='w-[150px]'>POC Email</TableHead>
                        <TableHead className='w-[180px]'>Appointment</TableHead>
                        <TableHead className='w-[100px]'>Type</TableHead>
                        <TableHead className='w-[140px]'>Date & Time</TableHead>
                        <TableHead className='w-[160px]'>
                          Professional
                        </TableHead>
                        <TableHead className='w-[100px]'>Status</TableHead>
                        <TableHead className='w-[150px]'>
                          Cancellation Details
                        </TableHead>
                        <TableHead className='w-[80px] text-right'>
                          Actions
                        </TableHead>
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
                                  {
                                    appointment.cancellation
                                      .hoursBeforeAppointment
                                  }
                                  h before
                                </div>
                                <div className='text-muted-foreground'>
                                  By: {appointment.cancellation.cancelledBy}
                                </div>
                                <div className='text-muted-foreground truncate'>
                                  {appointment.cancellation.reason}
                                </div>
                              </div>
                            ) : (
                              <span className='text-muted-foreground text-sm'>
                                -
                              </span>
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
                    // Here you would process the file and add to existing data
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
