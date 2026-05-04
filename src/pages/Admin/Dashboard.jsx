import { useEffect, useState } from 'react';
import { getVendors, getProducts } from '../../api/adminApi';
import { 
  UserGroupIcon, 
  CubeIcon, 
  CurrencyDollarIcon, 
  ShoppingCartIcon 
} from '@heroicons/react/24/outline';
import Chart from '../../components/Charts/chart';
import toast, { Toaster } from 'react-hot-toast';
import * as signalR from '@microsoft/signalr';

export default function Dashboard() {
  const [stats, setStats] = useState([
    { name: 'Total Sales', value: '-', change: '-', icon: CurrencyDollarIcon },
    { name: 'Total Orders', value: '-', change: '-', icon: ShoppingCartIcon },
    { name: 'Active Vendors', value: '-', change: '-', icon: UserGroupIcon },
    { name: 'Total Products', value: '-', change: '-', icon: CubeIcon },
  ]);

  // Set up SignalR connection
  useEffect(() => {
    // Create a new signalR connection
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5201/notificationHub?email=admin@marketplace.com")//the base url of the host and the notif. hub from backend, and the email parameter
      .withAutomaticReconnect()//auto reconnect when the connection is lost
      .build(); //makes the connection 

    // Start the async. connection and retry if error every 4 seconds.
    async function startConnection() {
      try { //tries to connect , if error , retries in 4 seconds
        await connection.start();
      } catch (err) {
        console.error("SignalR Connection Error: ", err);
        // Try to reconnect in 4 seconds
        setTimeout(startConnection, 4000);
      }
    }

    // Handle the ReceiveNotification event sent from backend  and display in the notification.
    connection.on("ReceiveNotification", (type, message) => {
      toast(message, {
        icon: '🔔',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      fetchData();
    });

    // Start the connection again
    startConnection();

    // Clean up when component unmounts
    //or when the component removed , stop connecting the signalR.
    return () => {
      if (connection.state === signalR.HubConnectionState.Connected) {
        connection.stop();
      }
    };
  }, []);


  //Display Data on the chart.
  async function fetchData() {
    try {
      const vendorsRes = await getVendors();
      const productsRes = await getProducts();
     

      setStats([
        { name: 'Total Sales', value: '$12,345', change: '+12%', icon: CurrencyDollarIcon },
        { name: 'Active Vendors', value: vendorsRes.data.length, change: '+5%', icon: UserGroupIcon },
        { name: 'Total Products', value: productsRes.data.length, change: '+15%', icon: CubeIcon },
      ]);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Toast Container */}
      <Toaster position="top-right" />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between ">
              <div >
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{stat.value}</p>
                <p className="text-sm text-green-500 mt-1">{stat.change} from last month</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-full">
                <stat.icon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Overview</h3>
        <div className="h-80">
          <Chart />
        </div>
      </div>
    </div>
  );
}