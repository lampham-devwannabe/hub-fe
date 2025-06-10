// pages/MembersPage.tsx
import React from 'react'
import { useParams } from 'react-router-dom'
import ClassMemberView from './ClassMemberView'

export function MembersPage() {
  const { classId } = useParams<{ classId: string }>()

  if (!classId) {
    return (
      <div className="p-4">
        <div className="text-red-500">Error: Class ID not found</div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <ClassMemberView classId={classId} />
    </div>
  )
}
