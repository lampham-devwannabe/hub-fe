import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DollarSign, TrendingUp, Users, Calendar } from 'lucide-react'
import { AdminSidebar } from '../../components/common/layout/AdminSidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '../../components/ui/pagination'
import { Separator } from '../../components/ui/separator'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../../components/ui/chart'
import { Bar, BarChart, XAxis, YAxis } from 'recharts'
import {
  fetchWeeklyRevenue,
  fetchGeneralSubscriptionData,
  fetchSubscriptions
} from '../../store/slices/subscriptionSlice'
import { RootState, AppDispatch } from '../../store'

export const SubscriptionDashboard = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { weeklyRevenue, generalData, subscriptions, weeklyLoading, subscriptionsLoading, weeklyError } = useSelector(
    (state: RootState) => state.subscription
  )

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(15)
  const [planFilter, setPlanFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    dispatch(fetchWeeklyRevenue())
    dispatch(fetchGeneralSubscriptionData())
    dispatch(fetchSubscriptions({ page: currentPage - 1, size: pageSize }))
  }, [dispatch])

  useEffect(() => {
    dispatch(
      fetchSubscriptions({
        page: currentPage - 1,
        size: pageSize,
        plan: planFilter === 'all' ? undefined : planFilter.toUpperCase(),
        status: statusFilter === 'all' ? undefined : statusFilter.toUpperCase()
      })
    )
  }, [dispatch, currentPage, pageSize, planFilter, statusFilter])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const chartConfig = {
    totalAmount: {
      label: 'Revenue',
      color: 'hsl(var(--chart-1))'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  const renderPagination = () => {
    if (!subscriptions) return null

    const totalPages = subscriptions.totalPages
    const current = currentPage

    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => current > 1 && handlePageChange(current - 1)}
              className={current <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>

          {current > 2 && (
            <>
              <PaginationItem>
                <PaginationLink onClick={() => handlePageChange(1)} className='cursor-pointer'>
                  1
                </PaginationLink>
              </PaginationItem>
              {current > 3 && <PaginationEllipsis />}
            </>
          )}

          {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
            const page = Math.max(1, current - 1) + i
            if (page <= totalPages) {
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => handlePageChange(page)}
                    isActive={page === current}
                    className='cursor-pointer'
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            }
            return null
          })}

          {current < totalPages - 1 && (
            <>
              {current < totalPages - 2 && <PaginationEllipsis />}
              <PaginationItem>
                <PaginationLink onClick={() => handlePageChange(totalPages)} className='cursor-pointer'>
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() => current < totalPages && handlePageChange(current + 1)}
              className={current >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
  }

  return (
    <div className='flex h-screen bg-gray-50'>
      {/* Left Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className='flex-1 overflow-auto'>
        <div className='p-8'>
          <div className='mb-8'>
            <h1 className='text-3xl font-bold text-gray-900'>Subscription Dashboard</h1>
            <p className='text-gray-600 mt-2'>Monitor subscription metrics and revenue</p>
          </div>

          {/* Statistics Cards */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Total Plans</CardTitle>
                <Users className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{generalData?.totalPlans || 0}</div>
                <p className='text-xs text-muted-foreground'>Active subscriptions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Standard Plans</CardTitle>
                <Calendar className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{generalData?.totalStandard || 0}</div>
                <p className='text-xs text-muted-foreground'>Standard subscriptions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Advanced Plans</CardTitle>
                <TrendingUp className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{generalData?.totalAdvanced || 0}</div>
                <p className='text-xs text-muted-foreground'>Advanced subscriptions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Total Revenue</CardTitle>
                <DollarSign className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{formatCurrency(generalData?.totalAmount || 0)}</div>
                <p className='text-xs text-muted-foreground'>All time revenue</p>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Revenue Chart */}
          <Card className='mb-8'>
            <CardHeader>
              <CardTitle>Weekly Revenue</CardTitle>
              <CardDescription>Revenue trends over recent weeks</CardDescription>
            </CardHeader>
            <CardContent>
              {weeklyLoading ? (
                <div className='flex items-center justify-center h-80'>
                  <p>Loading chart data...</p>
                </div>
              ) : weeklyError ? (
                <div className='flex items-center justify-center h-80'>
                  <p className='text-red-500'>Error loading chart: {weeklyError}</p>
                </div>
              ) : (
                <ChartContainer config={chartConfig} className='h-80'>
                  <BarChart accessibilityLayer data={weeklyRevenue || []}>
                    <XAxis
                      dataKey='weekStart'
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => formatDate(value)}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                    />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                    <Bar dataKey='totalAmount' fill='var(--color-totalAmount)' radius={8} />
                  </BarChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>

          {/* Subscriptions Table */}
          <Card>
            <CardHeader>
              <CardTitle>Subscriptions Management</CardTitle>
              <CardDescription>View and manage all subscription plans</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className='flex flex-col sm:flex-row gap-4 mb-6'>
                <Select value={planFilter} onValueChange={setPlanFilter}>
                  <SelectTrigger className='w-full sm:w-48'>
                    <SelectValue placeholder='Filter by plan' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Plans</SelectItem>
                    <SelectItem value='STANDARD'>Standard</SelectItem>
                    <SelectItem value='ADVANCED'>Advanced</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className='w-full sm:w-48'>
                    <SelectValue placeholder='Filter by status' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Status</SelectItem>
                    <SelectItem value='ACTIVE'>Active</SelectItem>
                    <SelectItem value='INACTIVE'>Expired</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(parseInt(value))}>
                  <SelectTrigger className='w-full sm:w-32'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='10'>10 per page</SelectItem>
                    <SelectItem value='15'>15 per page</SelectItem>
                    <SelectItem value='25'>25 per page</SelectItem>
                    <SelectItem value='50'>50 per page</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Table */}
              <div className='rounded-md border'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User ID</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Transaction ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscriptionsLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className='text-center py-8'>
                          Loading subscriptions...
                        </TableCell>
                      </TableRow>
                    ) : subscriptions?.content.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className='text-center py-8'>
                          No subscriptions found
                        </TableCell>
                      </TableRow>
                    ) : (
                      subscriptions?.content.map((subscription) => (
                        <TableRow key={subscription.id}>
                          <TableCell className='font-mono text-sm'>{subscription.userId}</TableCell>
                          <TableCell>
                            <Badge variant={subscription.plan === 'ADVANCED' ? 'default' : 'secondary'}>
                              {subscription.plan}
                            </Badge>
                          </TableCell>
                          <TableCell className='font-medium'>{formatCurrency(subscription.amount)}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                subscription.status === 'ACTIVE'
                                  ? 'default'
                                  : subscription.status === 'EXPIRED'
                                    ? 'destructive'
                                    : 'secondary'
                              }
                            >
                              {subscription.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(subscription.startDate)}</TableCell>
                          <TableCell>{formatDate(subscription.endDate)}</TableCell>
                          <TableCell className='font-mono text-sm'>{subscription.transactionId}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {subscriptions && subscriptions.totalPages > 1 && (
                <div className='mt-6'>
                  <Separator className='mb-4' />
                  <div className='flex justify-between items-center'>
                    <p className='text-sm text-muted-foreground'>
                      Showing {(currentPage - 1) * pageSize + 1} to{' '}
                      {Math.min(currentPage * pageSize, subscriptions.totalElements)} of {subscriptions.totalElements}{' '}
                      subscriptions
                    </p>
                    {renderPagination()}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
