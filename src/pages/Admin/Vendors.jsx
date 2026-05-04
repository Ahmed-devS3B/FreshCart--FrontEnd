// src/pages/Admin/Vendors.jsx
import { useEffect, useState } from 'react';
import { getVendors, approveVendor, disableVendor, disapproveVendor, enableVendor, autoApproveProducts , autoDisApproveProducts } from '../../api/adminApi';

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch vendors from API
  const fetchVendors = async () => {
    setLoading(true);
    try {
      const res = await getVendors();
      setVendors(res.data);
    } catch (error) {
      console.error('Failed to fetch vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load vendors on mount
  useEffect(() => {
    fetchVendors();
  }, []);

  // Handle actions: approve, disapprove, disable, enable
  const handleAction = async (phoneNumber, action) => {
    try {
      if (action === 'approve') {
        await approveVendor(phoneNumber);
      }
      else if (action === 'disapprove') {
        await disapproveVendor(phoneNumber);
      } else if (action === 'disable') {
        await disableVendor(phoneNumber);
      }
      else if (action === 'enable') {
        await enableVendor(phoneNumber)
      }
      else if (action === "enable all permissions") {
        await autoApproveProducts(phoneNumber)
      }
      else if (action === "disable all permissions") {
        await autoDisApproveProducts(phoneNumber)
      }

      // Refetch vendors to reflect latest data from server
      await fetchVendors();

    } catch (error) {
      console.error(`Action (${action}) failed:`, error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Vendor Management</h1>

      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3  text-sm font-medium text-gray-500 text-center">Name</th>
              <th className="px-6 py-3  text-sm font-medium text-gray-500 text-center">Phone Number</th>
              <th className="px-6 py-3  text-sm font-medium text-gray-500 text-center">Vendor Status</th>
              <th className="px-6 py-3 text-sm font-medium text-gray-500 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-4">Loading vendors...</td>
              </tr>
            ) : vendors.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4">No vendors found.</td>
              </tr>
            ) : (
              vendors.map((vendor) => (
                <tr key={vendor.phoneNumber}>
                  <td className="px-6 py-4 text-md font-bold text-gray-700 text-center">{vendor.ownerName}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 text-center">{vendor.phoneNumber}</td>
                  <td className="px-6 py-4 text-center">
                    <div>
                      <span className={`px-2  py-1 text-xs font-medium rounded-full 
                        ${vendor.status === 'Pending' ? 'bg-green-100 text-green-800'
                          : vendor.status === 'disapproved' ? 'bg-red-100 text-red-800'
                            : vendor.status === 'disabled' ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {/* Status displaying section */}
                        {vendor.isPending && 'Pending'}                {/* vendor still not accepted ✅ */}
                        {vendor.isPending === false && vendor.isApproved === true && vendor.isEnabled === true ?
                          vendor.autoApproveProducts ? "Approved & Full Access" : "Approved & Enabled": null}     {/* vendor was approved ✅ */}
                        {vendor.isPending === false && vendor.isApproved === false ? "DisApproved" : null}             {/* vendor is  disapproved ✅ */}
                        {vendor.isEnabled === false && vendor.isApproved === true ? "Disabled" : null}       {/* vendor is disabled ✅*/}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 space-x-2 text-center">
                    {/* Case 1: Vendor still not accepted✅ */}
                    {vendor.isPending ? (
                      <>
                        <button onClick={() => handleAction(vendor.phoneNumber, 'approve')}
                          className="px-3 py-1.5 text-sm rounded-md bg-green-500 text-white hover:bg-green-600"
                        > Approve </button>
                        <button onClick={() => handleAction(vendor.phoneNumber, 'disapprove')}
                          className="px-3 py-1.5 text-sm rounded-md bg-red-500 text-white hover:bg-red-600"
                        > Disapprove </button>
                      </>
                    ) : null}

                    {/* Case 2: Vendor was approved ✅ */}
                    {vendor.isPending === false && vendor.isApproved === true && vendor.isEnabled === true ? (
                      <>
                        <button onClick={() => handleAction(vendor.phoneNumber, 'disapprove')}
                          className="px-3 py-1.5 text-sm rounded-md bg-red-500 text-white hover:bg-red-600"
                        > Disapprove </button>
                        <button
                          onClick={() => handleAction(vendor.phoneNumber, 'disable')}
                          className="px-3 py-1.5 text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600"
                        > Disable </button>

                        {/* Only show Enable all Permissions when vendor is enabled AND doesn't already have autoApproveProducts */}
                        {!vendor.autoApproveProducts && (
                          <button
                            onClick={() => handleAction(vendor.phoneNumber, 'enable all permissions')}
                            className="px-3 py-1.5 text-sm rounded-md bg-purple-500 text-white hover:bg-purple-600"
                          > Enable All Permissions </button>
                        )}

                        {/* Only show Disable All Permissions when vendor is enabled AND has autoApproveProducts */}
                        {vendor.autoApproveProducts && (
                          <button
                            onClick={() => handleAction(vendor.phoneNumber, 'disable all permissions')}
                            className="px-3 py-1.5 text-sm rounded-md bg-orange-500 text-white hover:bg-orange-600"
                          > Disable All Permissions </button>
                        )}
                      </>
                    ) : null}

                    {/* Case 3: vendor was Disapproved ✅ */}
                    {vendor.isPending === false && vendor.isApproved === false ? (
                      <>
                        <button onClick={() => handleAction(vendor.phoneNumber, 'approve')}
                          className="px-3 py-1.5 text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600"
                        > Approve </button>
                      </>
                    ) : null}

                    {/* Case 4: Vendor was disabled ✅ */}
                    {vendor.isApproved === true && vendor.isEnabled === false ? (
                      <>
                        <button onClick={() => handleAction(vendor.phoneNumber, 'enable')}
                          className="px-3 py-1.5 text-sm rounded-md bg-yellow-500 text-white hover:bg-yellow-600"
                        > Enable </button>
                      </>
                    ) : null}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}