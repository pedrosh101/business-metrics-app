import React from 'react';

function VendorsSection() {
  const vendors = [
    {
      title: 'Vendor 1',
      quickActions: 'Edit',
      adminUserName: 'Admin1',
      username: 'vendor1',
      email: 'vendor1@example.com',
      status: 'Active',
      adminUserStatus: 'Active',
      createdOn: '2023-01-01',
      action: 'Delete'
    },
    {
      title: 'Vendor 2',
      quickActions: 'Edit',
      adminUserName: 'Admin2',
      username: 'vendor2',
      email: 'vendor2@example.com',
      status: 'Inactive',
      adminUserStatus: 'Active',
      createdOn: '2023-02-01',
      action: 'Delete'
    },
    {
      title: 'Vendor 3',
      quickActions: 'Edit',
      adminUserName: 'Admin3',
      username: 'vendor3',
      email: 'vendor3@example.com',
      status: 'Active',
      adminUserStatus: 'Inactive',
      createdOn: '2023-03-01',
      action: 'Delete'
    },
    {
      title: 'Vendor 4',
      quickActions: 'Edit',
      adminUserName: 'Admin4',
      username: 'vendor4',
      email: 'vendor4@example.com',
      status: 'Active',
      adminUserStatus: 'Active',
      createdOn: '2023-04-01',
      action: 'Delete'
    },
    {
      title: 'Vendor 5',
      quickActions: 'Edit',
      adminUserName: 'Admin5',
      username: 'vendor5',
      email: 'vendor5@example.com',
      status: 'Inactive',
      adminUserStatus: 'Inactive',
      createdOn: '2023-05-01',
      action: 'Delete'
    }
  ];

  return (
    <div className="overflow-x-auto w-full p-4">
      <h1 className='text-lg font-medium pb-2'>Vendors</h1>
      <table className="min-w-full bg-white border rounded-xl">
        <thead>
          <tr>
            <th className="px-4 py-2">VENDOR TITLE</th>
            <th className="px-4 py-2">QUICK ACTIONS</th>
            <th className="px-4 py-2">ADMIN USER NAME</th>
            <th className="px-4 py-2">USERNAME</th>
            <th className="px-4 py-2">EMAIL</th>
            <th className="px-4 py-2">STATUS</th>
            <th className="px-4 py-2">ADMIN USER STATUS</th>
            <th className="px-4 py-2">CREATED ON</th>
            <th className="px-4 py-2">ACTION</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map((vendor, index) => (
            <tr key={index} className="border-t">
              <td className="px-4 py-2">{vendor.title}</td>
              <td className="px-4 py-2">{vendor.quickActions}</td>
              <td className="px-4 py-2">{vendor.adminUserName}</td>
              <td className="px-4 py-2">{vendor.username}</td>
              <td className="px-4 py-2">{vendor.email}</td>
              <td className="px-4 py-2">{vendor.status}</td>
              <td className="px-4 py-2">{vendor.adminUserStatus}</td>
              <td className="px-4 py-2">{vendor.createdOn}</td>
              <td className="px-4 py-2">{vendor.action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default VendorsSection;
