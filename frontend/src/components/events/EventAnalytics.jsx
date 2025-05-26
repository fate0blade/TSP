import { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { format } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const EventAnalytics = ({ eventId }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('week'); // week, month, year

  useEffect(() => {
    fetchAnalytics();
  }, [eventId, timeRange]);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`/api/events/${eventId}/analytics?range=${timeRange}`, {
        withCredentials: true
      });
      setAnalytics(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch analytics data');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        {error}
      </div>
    );
  }

  const bookingTrendsData = {
    labels: analytics?.bookingTrends.map(item => format(new Date(item.date), 'MMM dd')),
    datasets: [
      {
        label: 'Tickets Booked',
        data: analytics?.bookingTrends.map(item => item.count),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        tension: 0.3
      }
    ]
  };

  const revenueData = {
    labels: analytics?.revenue.map(item => format(new Date(item.date), 'MMM dd')),
    datasets: [
      {
        label: 'Revenue ($)',
        data: analytics?.revenue.map(item => item.amount),
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Event Analytics</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <p className="text-sm text-indigo-600 font-medium">Total Tickets Sold</p>
            <p className="text-2xl font-bold text-indigo-900">{analytics?.totalTicketsSold}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600 font-medium">Total Revenue</p>
            <p className="text-2xl font-bold text-green-900">
              ${analytics?.totalRevenue.toFixed(2)}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Tickets Available</p>
            <p className="text-2xl font-bold text-blue-900">{analytics?.ticketsAvailable}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-600 font-medium">Conversion Rate</p>
            <p className="text-2xl font-bold text-purple-900">
              {((analytics?.totalTicketsSold / analytics?.totalViews) * 100).toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Booking Progress */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Booking Progress</h3>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block text-indigo-600">
                  {((analytics?.totalTicketsSold / analytics?.totalTickets) * 100).toFixed(1)}% Sold
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-indigo-600">
                  {analytics?.totalTicketsSold}/{analytics?.totalTickets}
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
              <div
                style={{ width: `${(analytics?.totalTicketsSold / analytics?.totalTickets) * 100}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Booking Trends</h3>
          <div className="h-64">
            <Line
              data={bookingTrendsData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      stepSize: 1
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue</h3>
          <div className="h-64">
            <Bar
              data={revenueData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventAnalytics;

// In EventDetail.jsx or EventManagement.jsx
import EventAnalytics from './EventAnalytics';

// Inside your component's render method
{user?.role === 'organizer' && (
  <div className="mt-8">
    <EventAnalytics eventId={event._id} />
  </div>
)}