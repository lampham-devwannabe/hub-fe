import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { AppDispatch, RootState } from '../../store'
import { getClassMembersThunk, deleteMemberThunk } from '../../store/slices/classSlice'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../components/ui/table'
import { Button } from '../../components/ui/button'

const ClassMemberView: React.FC = () => {
  const { classId } = useParams<{ classId: string }>()
  const dispatch = useDispatch<AppDispatch>()
  const { classMembers, loading, error } = useSelector((state: RootState) => state.class)

  useEffect(() => {
    if (classId) {
      dispatch(getClassMembersThunk(classId))
    }
  }, [dispatch, classId])

  const handleDeleteMember = (studentId: string) => {
    if (classId && window.confirm('Are you sure you want to remove this student from the class?')) {
      dispatch(deleteMemberThunk({ classId, studentId }))
    }
  }

  if (!classId) {
    return (
      <div className='flex items-center justify-center py-8'>
        <div className='text-red-500'>Error: Class ID not found in URL</div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center py-8'>
        <div className='text-gray-500'>Loading class members...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex items-center justify-center py-8'>
        <div className='text-red-500'>Error: {error}</div>
      </div>
    )
  }

  if (!classMembers || classMembers.length === 0) {
    return (
      <div className='flex items-center justify-center py-8'>
        <div className='text-gray-500'>No members found in this class.</div>
      </div>
    )
  }

  return (
    <div className='w-full'>
      <div className='mb-6'>
        <h2 className='text-2xl font-bold'>Class Members</h2>
        <p className='text-gray-600 mt-2'>Manage and view all students in this class</p>
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>School</TableHead>
              <TableHead>Has Done</TableHead>
              <TableHead className='w-20'>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classMembers.map((member) => (
              <TableRow key={member.studentId}>
                <TableCell className='font-medium'>{member.name}</TableCell>
                <TableCell>{member.school}</TableCell>
                <TableCell>{member.hasDone}</TableCell>
                <TableCell>
                  <Button
                    variant='destructive'
                    size='sm'
                    onClick={() => handleDeleteMember(member.studentId)}
                    className='h-8 w-8 p-0'
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default ClassMemberView
