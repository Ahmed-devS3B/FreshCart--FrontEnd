import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', sales: 300 },
  { month: 'Feb', sales: 500 },
  { month: 'Mar', sales: 700 },
  { month: 'Apr', sales: 400 },
  { month: 'May', sales: 650 },
];

export default function Chart() {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <h3>Monthly Sales</h3>
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <CartesianGrid stroke="#ccc" />
          <Tooltip />
          <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
