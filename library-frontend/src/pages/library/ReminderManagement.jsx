import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Users,
  BookOpen,
  Rupee,
  Settings,
  Play,
  BarChart3
} from 'lucide-react';
import { api } from '../../api/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const ReminderManagement = () => {
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState(null);
  const [overdueBooks, setOverdueBooks] = useState([]);
  const [dueSoonBooks, setDueSoonBooks] = useState([]);
  const [schedulerStatus, setSchedulerStatus] = useState(null);
  const [manualReminder, setManualReminder] = useState({
    recipient_email: '',
    recipient_phone: '',
    subject: '',
    message: '',
    send_email: true,
    send_sms: false
  });
  const [bulkReminder, setBulkReminder] = useState({
    reminder_type: 'overdue',
    role_filter: '',
    user_ids: []
  });
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchReminderData();
  }, []);

  const fetchReminderData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [statsRes, overdueRes, dueSoonRes, schedulerRes] = await Promise.all([
        api.get('/reminders/statistics'),
        api.get('/reminders/overdue-books'),
        api.get('/reminders/due-soon-books'),
        api.get('/reminders/scheduler-status')
      ]);

      setStatistics(statsRes);
      setOverdueBooks(overdueRes.overdue_books || []);
      setDueSoonBooks(dueSoonRes.due_soon_books || []);
      setSchedulerStatus(schedulerRes);
      
    } catch (error) {
      console.error('Error fetching reminder data:', error);
      setNotifications([{ type: 'error', message: 'Failed to load reminder data' }]);
    } finally {
      setLoading(false);
    }
  };

  const sendManualReminder = async () => {
    try {
      setLoading(true);
      await api.post('/reminders/send-manual', manualReminder);
      setNotifications([{ type: 'success', message: 'Manual reminder sent successfully!' }]);
      setManualReminder({
        recipient_email: '',
        recipient_phone: '',
        subject: '',
        message: '',
        send_email: true,
        send_sms: false
      });
    } catch (error) {
      setNotifications([{ type: 'error', message: error.message || 'Failed to send reminder' }]);
    } finally {
      setLoading(false);
    }
  };

  const sendBulkReminders = async () => {
    try {
      setLoading(true);
      await api.post('/reminders/send-bulk', bulkReminder);
      setNotifications([{ type: 'success', message: 'Bulk reminders sent successfully!' }]);
      fetchReminderData(); // Refresh data
    } catch (error) {
      setNotifications([{ type: 'error', message: error.message || 'Failed to send bulk reminders' }]);
    } finally {
      setLoading(false);
    }
  };

  const triggerJob = async (jobId) => {
    try {
      setLoading(true);
      await api.post(`/reminders/trigger-job/${jobId}`);
      setNotifications([{ type: 'success', message: `Job '${jobId}' triggered successfully!` }]);
    } catch (error) {
      setNotifications([{ type: 'error', message: error.message || 'Failed to trigger job' }]);
    } finally {
      setLoading(false);
    }
  };

  const testEmail = async () => {
    try {
      setLoading(true);
      await api.post('/reminders/test-email');
      setNotifications([{ type: 'success', message: 'Test email sent successfully!' }]);
    } catch (error) {
      setNotifications([{ type: 'error', message: error.message || 'Failed to send test email' }]);
    } finally {
      setLoading(false);
    }
  };

  const testSMS = async (phoneNumber = '+1234567890') => {
    try {
      setLoading(true);
      await api.post('/reminders/test-sms', null, { params: { phone_number: phoneNumber } });
      setNotifications([{ type: 'success', message: 'Test SMS sent successfully!' }]);
    } catch (error) {
      setNotifications([{ type: 'error', message: error.message || 'Failed to send test SMS' }]);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !statistics) {
    return <LoadingSpinner fullScreen text="Loading reminder management..." />;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reminder Management</h1>
          <p className="text-gray-600">Manage email and SMS notifications for library users</p>
        </div>
        <Button onClick={fetchReminderData} variant="outline">
          <Settings className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Notifications */}
      {notifications.map((notification, index) => (
        <Alert key={index} className={notification.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
          <AlertDescription>{notification.message}</AlertDescription>
        </Alert>
      ))}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Books</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{statistics?.overdue_books_count || 0}</div>
            <p className="text-xs text-gray-600">Books needing immediate return</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due Soon</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{statistics?.due_soon_books_count || 0}</div>
            <p className="text-xs text-gray-600">Books due within 2 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fine</CardTitle>
            <Rupee className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">₹{statistics?.total_overdue_fine || 0}</div>
            <p className="text-xs text-gray-600">Accumulated fines</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduler Status</CardTitle>
            {schedulerStatus?.scheduler_running ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {schedulerStatus?.scheduler_running ? 'Active' : 'Inactive'}
            </div>
            <p className="text-xs text-gray-600">{schedulerStatus?.total_jobs || 0} scheduled jobs</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="manual">Manual Reminders</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Reminders</TabsTrigger>
          <TabsTrigger value="scheduler">Scheduler</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Overdue Books */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  Overdue Books
                </CardTitle>
                <CardDescription>Books that need immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {overdueBooks.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No overdue books</p>
                  ) : (
                    overdueBooks.map((book, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{book.book.title}</h4>
                            <p className="text-sm text-gray-600">{book.user.name}</p>
                            <p className="text-sm text-gray-600">{book.user.email}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="destructive">{book.days_overdue} days</Badge>
                            <p className="text-sm font-medium text-red-600">₹{book.fine_amount}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Due Soon Books */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-yellow-500" />
                  Due Soon Books
                </CardTitle>
                <CardDescription>Books due within the next few days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {dueSoonBooks.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No books due soon</p>
                  ) : (
                    dueSoonBooks.map((book, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{book.book.title}</h4>
                            <p className="text-sm text-gray-600">{book.user.name}</p>
                            <p className="text-sm text-gray-600">{book.user.email}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="secondary">{book.days_until_due} days</Badge>
                            <p className="text-sm text-gray-600">Due soon</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="manual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Send Manual Reminder</CardTitle>
              <CardDescription>Send a custom reminder to a specific user</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="recipient_email">Recipient Email</Label>
                  <Input
                    id="recipient_email"
                    type="email"
                    value={manualReminder.recipient_email}
                    onChange={(e) => setManualReminder({...manualReminder, recipient_email: e.target.value})}
                    placeholder="user@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="recipient_phone">Phone Number (Optional)</Label>
                  <Input
                    id="recipient_phone"
                    value={manualReminder.recipient_phone}
                    onChange={(e) => setManualReminder({...manualReminder, recipient_phone: e.target.value})}
                    placeholder="+1234567890"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={manualReminder.subject}
                  onChange={(e) => setManualReminder({...manualReminder, subject: e.target.value})}
                  placeholder="Reminder subject"
                />
              </div>
              
              <div>
                <Label htmlFor="message">Message</Label>
                <textarea
                  id="message"
                  className="w-full p-2 border rounded-md"
                  rows={4}
                  value={manualReminder.message}
                  onChange={(e) => setManualReminder({...manualReminder, message: e.target.value})}
                  placeholder="Enter your reminder message here..."
                />
              </div>
              
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={manualReminder.send_email}
                    onChange={(e) => setManualReminder({...manualReminder, send_email: e.target.checked})}
                  />
                  <Mail className="w-4 h-4" />
                  <span>Send Email</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={manualReminder.send_sms}
                    onChange={(e) => setManualReminder({...manualReminder, send_sms: e.target.checked})}
                  />
                  <MessageSquare className="w-4 h-4" />
                  <span>Send SMS</span>
                </label>
              </div>
              
              <Button onClick={sendManualReminder} disabled={loading}>
                {loading ? <LoadingSpinner size="sm" /> : <Bell className="w-4 h-4 mr-2" />}
                Send Reminder
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Send Bulk Reminders</CardTitle>
              <CardDescription>Send reminders to multiple users at once</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Reminder Type</Label>
                  <Select
                    value={bulkReminder.reminder_type}
                    onValueChange={(value) => setBulkReminder({...bulkReminder, reminder_type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="overdue">Overdue Books</SelectItem>
                      <SelectItem value="due_soon">Due Soon Books</SelectItem>
                      <SelectItem value="fine">Fine Notifications</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Filter by Role (Optional)</Label>
                  <Select
                    value={bulkReminder.role_filter}
                    onValueChange={(value) => setBulkReminder({...bulkReminder, role_filter: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All roles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Roles</SelectItem>
                      <SelectItem value="student">Students</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="library_staff">Library Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button onClick={sendBulkReminders} disabled={loading}>
                {loading ? <LoadingSpinner size="sm" /> : <Users className="w-4 h-4 mr-2" />}
                Send Bulk Reminders
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduler" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Scheduler Status</CardTitle>
                <CardDescription>Manage automated reminder jobs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Status:</span>
                    <Badge variant={schedulerStatus?.scheduler_running ? "default" : "destructive"}>
                      {schedulerStatus?.scheduler_running ? "Running" : "Stopped"}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Scheduled Jobs:</h4>
                    {schedulerStatus?.jobs?.map((job, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <p className="font-medium text-sm">{job.name}</p>
                          <p className="text-xs text-gray-600">{job.trigger}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => triggerJob(job.id)}
                          disabled={loading}
                        >
                          <Play className="w-3 h-3 mr-1" />
                          Run
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Test Configuration</CardTitle>
                <CardDescription>Test email and SMS settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button onClick={testEmail} disabled={loading} className="w-full">
                    {loading ? <LoadingSpinner size="sm" /> : <Mail className="w-4 h-4 mr-2" />}
                    Test Email Configuration
                  </Button>
                  
                  <Button onClick={() => testSMS()} disabled={loading} variant="outline" className="w-full">
                    {loading ? <LoadingSpinner size="sm" /> : <MessageSquare className="w-4 h-4 mr-2" />}
                    Test SMS Configuration
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure reminder preferences and schedules</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertDescription>
                  Settings can be configured through environment variables in the backend. 
                  Check the documentation for available configuration options.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReminderManagement;
