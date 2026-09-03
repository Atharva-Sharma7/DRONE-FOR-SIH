import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
  try {
    return format(parseISO(date), 'MMM d, yyyy HH:mm');
  } catch (e) {
    return date;
  }
}

export function formatHectares(ha: number) {
  return `${ha.toFixed(2)} ha`;
}

export function getSeverityColor(severity: string) {
  switch (severity.toLowerCase()) {
    case 'mild':
    case 'low':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    case 'moderate':
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    case 'high':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
    case 'severe':
    case 'critical':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
  }
}

export function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case 'scheduled':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    case 'syncing':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    case 'processed':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
  }
}

export function getDiseaseDisplayName(diseaseClass: string) {
  const map: Record<string, string> = {
    'charcoal_rot': 'Charcoal Rot',
    'target_spot': 'Target Spot',
    'root_knot_nematode': 'Root-knot Nematodes',
    'yellow_mosaic': 'Yellow Mosaic Disease'
  };
  return map[diseaseClass] || diseaseClass;
}
