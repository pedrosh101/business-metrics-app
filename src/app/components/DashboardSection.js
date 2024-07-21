import React from "react";

function DashboardSection() {
  return (
    <div className="grid sm:grid-cols-3 gap-4 p-4 w-full">
      <Card
        title="TOTAL VENDORS"
        value="384"
        description="Total Vendors in the system"
        icon={<Icon />}
      />
      <Card
        title="TOTAL ACTIVE VENDORS"
        value="384"
        description=""
        icon={<Icon />}
      />
      <Card title="TOTAL CONTACTS" value="640" description="" icon={<Icon />} />
      <Card
        title="TOTAL CAMPAIGNS"
        value="350"
        description=""
        icon={<Icon />}
      />
      <Card
        title="MESSAGES IN QUEUE"
        value="0"
        description=""
        icon={<Icon />}
      />
      <Card
        title="MESSAGES PROCESSED"
        value="12120"
        description=""
        icon={<Icon />}
      />
    </div>
  );
}

function Card({ title, value, description, icon }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex justify-between items-start h-32">
      <div>
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-2xl">{value}</p>
        {description && <p className="text-gray-500">{description}</p>}
      </div>
      <div className="text-3xl">{icon}</div>
    </div>
  );
}

function Icon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" height="1em" width="1em">
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M9 18H4v-8h5v8zm6 0h-5V6h5v12zm6 0h-5V2h5v16zm1 4H3v-2h19v2z" />
    </svg>
  );
}

export default DashboardSection;
