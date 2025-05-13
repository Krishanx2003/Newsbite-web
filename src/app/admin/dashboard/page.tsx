import React from 'react'
import DashboardCard from './_components/dashboardcard'

const Dashboard
 = () => {
  return (
    <div>Dashboard
        <DashboardCard 
          title="Total Users"
          value="1,234"
          change="+12%"
          icon="👤"
        />
        <DashboardCard 
          title="Total Articles"
          value="567"
          change="-5%"
          icon="📝"
          />
        <DashboardCard
          title="Total Comments"
          value="890"
          change="+8%"
          icon="💬"
        />
        <DashboardCard
          title="Total Likes"
          value="1,234"
          change="+15%"
          icon="❤️"
        />
        <DashboardCard
          title="Total Shares"
          value="567"
          change="-2%"
          icon="🔗"
        />s
    </div>
  )
}

export default Dashboard
