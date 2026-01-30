// University Types
export interface University {
  id: number;
  name: string;
  shortName: string;
  website?: string;
}

export interface Faculty {
  id: number;
  name: string;
  shortName: string;
  universityId: number;
  university?: University;
}

export interface Department {
  id: number;
  name: string;
  code: string;
  facultyId: number;
  faculty?: Faculty;
}

// Course Types
export interface Course {
  id: number;
  code: string;
  name: string;
  credits: number;
  description?: string;
  semester: 'ZS' | 'LS';
  level: 'BC' | 'MGR' | 'PHD';
  facultyId: number;
  faculty?: Faculty;
  departmentId?: number;
  department?: Department;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface CourseTag {
  courseId: number;
  tagId: number;
  course?: Course;
  tag?: Tag;
}

// Lecture Types
export type LectureType = 'LECTURE' | 'EXERCISE' | 'SEMINAR' | 'LAB' | 'WORKSHOP' | 'OTHER';

export interface Lecture {
  id: number;
  courseId: number;
  course: Course;
  type: LectureType;
  dayOfWeek: number; // 1-5 (Monday-Friday)
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
  roomId?: number;
  room?: Room;
  teacherId?: number;
  teacher?: Teacher;
  capacity?: number;
  enrolled?: number;
}

// Location Types
export interface Building {
  id: number;
  name: string;
  address: string;
  facultyId?: number;
  faculty?: Faculty;
}

export interface Room {
  id: number;
  number: string;
  buildingId: number;
  building: Building;
  capacity?: number;
}

// People Types
export interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
  title?: string;
  email?: string;
  departmentId?: number;
  department?: Department;
}

// User Types
export interface User {
  id: number;
  email: string;
  name?: string;
  createdAt: Date;
}

export interface UserPreferences {
  id: number;
  userId: number;
  emailNotifications: boolean;
  reminderMinutes: number;
}

export interface Schedule {
  id: number;
  userId: number;
  name: string;
  isActive: boolean;
  lectures: Lecture[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Attendance {
  id: number;
  userId: number;
  lectureId: number;
  attended: boolean;
  date: Date;
}

export interface Notification {
  id: number;
  userId: number;
  type: 'REMINDER' | 'CHANGE' | 'CANCELLATION';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

// Scraping Types
export interface ScrapingJob {
  id: number;
  university: string;
  faculty?: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
  coursesAdded: number;
  lecturesAdded: number;
}

export interface RawScheduleData {
  source: string;
  data: any;
  scrapedAt: Date;
}

export interface ParsedSchedule {
  courses: Partial<Course>[];
  lectures: Partial<Lecture>[];
  teachers: Partial<Teacher>[];
  rooms: Partial<Room>[];
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Search & Filter Types
export interface LectureSearchFilters {
  query?: string;
  universityId?: number;
  facultyId?: number;
  departmentId?: number;
  dayOfWeek?: number;
  startTime?: string;
  type?: LectureType;
  tags?: string[];
  page?: number;
  limit?: number;
}

export interface LectureSearchResult {
  lectures: Lecture[];
  total: number;
  filters: LectureSearchFilters;
}
