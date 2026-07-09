import React, { createContext, useContext, useState } from 'react';
import * as initialData from '../data/index.js';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [students, setStudents] = useState(initialData.students);
  const [memorizationRecords, setMemorizationRecords] = useState(initialData.memorizationRecords);
  const [exams, setExams] = useState(initialData.exams);
  const [examResults, setExamResults] = useState(initialData.examResults);
  const [notifications, setNotifications] = useState(initialData.notifications);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider value={{
      teacher: initialData.teacher,
      groups: initialData.groups,
      students, setStudents,
      availableStudents: initialData.availableStudents,
      memorizationRecords, setMemorizationRecords,
      exams, setExams,
      examResults, setExamResults,
      competitions: initialData.competitions,
      notifications, setNotifications, markAllRead, unreadCount,
      recentActivities: initialData.recentActivities,
      surahs: initialData.surahs,
      showToast, toast,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
