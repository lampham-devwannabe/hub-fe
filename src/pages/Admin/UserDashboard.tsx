import { useEffect, useState } from 'react'
import { Users, GraduationCap, UserCheck, Clock } from 'lucide-react'
import { useAccount } from '../../hooks/useAccount'
import { AdminSidebar } from '../../components/common/layout/AdminSidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { Input } from '../../components/ui/input'
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

export const UserDashboard = () => {
  const { generalInfo, users, loading, getGeneralDashboard, getAllUsers } = useAccount()
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(15)
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    getGeneralDashboard()
    getAllUsers({ page: currentPage, size: pageSize })
  }, [])

  useEffect(() => {
    getAllUsers({
      page: currentPage,
      size: pageSize,
      role: roleFilter === 'all' ? undefined : roleFilter,
      search: searchQuery || undefined
    })
  }, [currentPage, pageSize, roleFilter, searchQuery])

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1) // Reset to first page when searching
  }

  const handleRoleFilter = (value: string) => {
    setRoleFilter(value)
    setCurrentPage(1) // Reset to first page when filtering
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const renderPagination = () => {
    if (!users) return null

    const totalPages = users.totalPages
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

          {/* Show first page */}
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

          {/* Show current and adjacent pages */}
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

          {/* Show last page */}
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
            <h1 className='text-3xl font-bold text-gray-900'>User Dashboard</h1>
            <p className='text-gray-600 mt-2'>Manage and monitor user accounts</p>
          </div>

          {/* Statistics Cards */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Total Users</CardTitle>
                <Users className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{generalInfo?.total || 0}</div>
                <p className='text-xs text-muted-foreground'>All registered users</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Students</CardTitle>
                <GraduationCap className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{generalInfo?.totalStudents || 0}</div>
                <p className='text-xs text-muted-foreground'>Student accounts</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Teachers</CardTitle>
                <UserCheck className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{generalInfo?.totalTeachers || 0}</div>
                <p className='text-xs text-muted-foreground'>Teacher accounts</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Recent Users</CardTitle>
                <Clock className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{generalInfo?.recentUsers || 0}</div>
                <p className='text-xs text-muted-foreground'>New this period</p>
              </CardContent>
            </Card>
          </div>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>Users Management</CardTitle>
              <CardDescription>View and manage all user accounts in the system</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters and Search */}
              <div className='flex flex-col sm:flex-row gap-4 mb-6'>
                <div className='flex-1'>
                  <Input
                    placeholder='Search by name or email...'
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className='w-full'
                  />
                </div>
                <Select value={roleFilter} onValueChange={handleRoleFilter}>
                  <SelectTrigger className='w-full sm:w-48'>
                    <SelectValue placeholder='Filter by role' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Roles</SelectItem>
                    <SelectItem value='STUDENT'>Student</SelectItem>
                    <SelectItem value='TEACHER'>Teacher</SelectItem>
                    <SelectItem value='ADMIN'>Admin</SelectItem>
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
                      <TableHead>Username</TableHead>
                      <TableHead>Date of Birth</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead>School</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} className='text-center py-8'>
                          Loading users...
                        </TableCell>
                      </TableRow>
                    ) : users?.content.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className='text-center py-8'>
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      users?.content.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className='font-medium'>{user.username}</TableCell>
                          <TableCell>{user.dob}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                user.role === 'ADMIN'
                                  ? 'destructive'
                                  : user.role === 'TEACHER'
                                    ? 'default'
                                    : 'secondary'
                              }
                            >
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>{user.city}</TableCell>
                          <TableCell>{user.school}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {users && users.totalPages > 1 && (
                <div className='mt-6'>
                  <Separator className='mb-4' />
                  <div className='flex justify-between items-center'>
                    <p className='text-sm text-muted-foreground'>
                      Showing {(currentPage - 1) * pageSize + 1} to{' '}
                      {Math.min(currentPage * pageSize, users.totalElements)} of {users.totalElements} users
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
