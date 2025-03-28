'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Navbar from '../inventory/components/navbar';
import Sidebar from '../inventory/components/sidebar';
import {
  CurrencyDollarIcon,
  DocumentTextIcon,
  CubeIcon,
} from '@heroicons/react/24/outline';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const DashboardPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  
  interface SystemLog {
    action: string;
    details: string;
    created_by?: string;
    created_at: string;
  }

  const [dashboardData, setDashboardData] = useState<{
    totalStockValue: number;
    lpoCount: number;
    inventoryCount: number;
    systemLogs: SystemLog[];
  }>({
    totalStockValue: 0,
    lpoCount: 0,
    inventoryCount: 0,
    systemLogs: []
  });

  // Check authentication and authorization
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (!session || error) {
        router.push('/login');
        return;
      }

      setUserEmail(session.user.email || null);
      console.log('User email:', session.user.email);

      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('role, usertype,email')
        .eq('id', session.user.id)
        .single();

      if (profileError || !profile || profile.role != 2 || profile.usertype != 'inventory') {
        router.push('/unauthorized');
        return;
      }

      setAuthorized(true);
      fetchDashboardData(session.user.email ?? null);
    };

    const fetchDashboardData = async (email: string | null) => {
      try {
        setLoading(true);
        
        const { data: stockData } = await supabase
          .from('stock_items')
          .select('quantity, cost');
        
        const totalStockValue = stockData?.reduce(
          (sum, item) => sum + (item.quantity * item.cost || 0), 
          0
        ) || 0;

        const { count: lpoCount } = await supabase
          .from('purchase_lpo')
          .select('*', { count: 'exact', head: true });

        const { count: inventoryCount } = await supabase
          .from('stock_items')
          .select('*', { count: 'exact', head: true });

        let systemLogsQuery = supabase
          .from('system_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        if (email) {
          systemLogsQuery = systemLogsQuery.eq('created_by', email);
        }

        const { data: systemLogs } = await systemLogsQuery;

        setDashboardData({
          totalStockValue,
          lpoCount: lpoCount || 0,
          inventoryCount: inventoryCount || 0,
          systemLogs: systemLogs || []
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, userEmail]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(amount).replace('UGX', 'UGX ');
  };

  // Overview cards data
  const overviewData = [
    { 
      title: 'Total Stock Value', 
      value: formatCurrency(dashboardData.totalStockValue), 
      icon: CurrencyDollarIcon, 
      color: 'bg-blue-500',
      description: 'Total value of all inventory items'
    },
    { 
      title: 'LPO Count', 
      value: dashboardData.lpoCount, 
      icon: DocumentTextIcon, 
      color: 'bg-green-500',
      description: 'Total number of purchase orders'
    },
    { 
      title: 'Inventory Items', 
      value: `${dashboardData.inventoryCount} Items`, 
      icon: CubeIcon, 
      color: 'bg-yellow-500',
      description: 'Total number of inventory items'
    },
  ];

  if (loading) {
    return (
      <div className="flex-1 ml-16 p-6 flex items-center justify-center">
        <div className="animate-pulse flex space-x-2 items-center mt-50">
          <div className="h-2 w-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="h-2 w-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="h-2 w-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          <span className="ml-2 text-green-500 font-large">Loading...</span>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-500">Unauthorized Access</div>
      </div>
    );
  }

  return (
    <div className="flex mt-5">
      <Sidebar />
      <div className="flex-1 ml-16 p-6">
        <Navbar />
        <div className="text-center mt-5">
          <h1 className="text-3xl font-bold mb-6">Inventory Dashboard</h1>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {overviewData.map((item, index) => (
            <div
              key={index}
              className={`${item.color} p-6 rounded-lg shadow-md text-white`}
            >
              <div className="flex items-center mb-2">
                <item.icon className="h-8 w-8 mr-3" />
                <h3 className="text-lg font-semibold">{item.title}</h3>
              </div>
              <p className="text-2xl font-bold mb-2">{item.value}</p>
              <p className="text-sm opacity-80">{item.description}</p>
            </div>
          ))}
        </div>

        {/* System Logs Table */}
        <div className="bg-white rounded-lg shadow-md p-6 text-black">
          <h2 className="text-xl font-semibold mb-4">Your Recent Activities</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 text-left">Action</th>
                  <th className="py-3 px-4 text-left">Details</th>
                  <th className="py-3 px-4 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.systemLogs.map((log, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 capitalize">{log.action}</td>
                    <td className="py-3 px-4">{log.details}</td>
                    <td className="py-3 px-4">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {dashboardData.systemLogs.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-3 px-4 text-center text-gray-500">
                      No recent activities found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;