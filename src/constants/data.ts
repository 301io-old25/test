import { NavItem } from '@/types';

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: []
  },
  {
    title: 'Master',
    url: '#',
    icon: 'kanban',
    shortcut: ['k', 'k'],
    isActive: false,
    items: [
      {
        title: 'Users Management',
        url: '/dashboard/users-management',
        icon: 'userPen',
        shortcut: ['m', 'm']
      },
      {
        title: 'Document Type',
        url: '/dashboard/document-type',
        icon: 'userPen',
        shortcut: ['m', 'm']
      },
      {
        title: 'Appointments',
        url: '/dashboard/appointments',
        icon: 'userPen',
        shortcut: ['m', 'm']
      },
      {
        title: 'Clients',
        url: '/dashboard/clients',
        icon: 'userPen',
        shortcut: ['m', 'm']
      },
    ]
  },
  {
    title: 'AI Companion',
    url: '/dashboard/chatbot-support',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: []
  },

  {
    title: 'Workflow Setup',
    url: '/dashboard/workflow',
    icon: 'kanban',
    shortcut: ['k', 'k'],
    isActive: false,
    items: []
  },
  {
    title: 'Invoice Desk',
    url: '/dashboard/invoice-desk',
    icon: 'kanban',
    shortcut: ['k', 'k'],
    isActive: false,
    items: []
  },
];
