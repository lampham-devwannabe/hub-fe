import React, { useState } from 'react'
import { ChevronRight, Users, PenTool, Eye, BarChart3, BookOpen } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { ScrollArea } from '../../components/ui/scroll-area'
import Header from '../../components/common/layout/HomeHeader'

const workflowActions = [
  {
    id: 'join-class',
    title: '1. Tham gia lớp học',
    icon: Users,
    content: (
      <>
        <p className='text-gray-700 mb-4'>
          Vào mục "Lớp học" hoặc "Classroom". Bạn sẽ thấy danh sách lớp học được giao. Nếu chưa thấy lớp nào, nhấn "Tham
          gia lớp học" và nhập mã lớp do giáo viên cung cấp.
        </p>
        <img
          src='https://res.cloudinary.com/du3922jvf/image/upload/v1750823488/student-1.1_lvzt16.png'
          alt='Student Join Class Screenshot 1'
          className='rounded-md shadow-md mb-4 w-full md:w-3/4 lg:w-2/3 mx-auto'
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.onerror = null
            target.src = 'https://placehold.co/600x350/e0e0e0/000000?text=Image+Not+Found'
          }}
        />
        <img
          src='https://res.cloudinary.com/du3922jvf/image/upload/v1750823488/student-1.2_av0whe.png'
          alt='Student Join Class Screenshot 2'
          className='rounded-md shadow-md mb-4 w-full md:w-3/4 lg:w-2/3 mx-auto'
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.onerror = null
            target.src = 'https://placehold.co/600x350/e0e0e0/000000?text=Image+Not+Found'
          }}
        />
        <p className='text-gray-700 mb-4'>
          Sau đó, bạn có thể xem thông tin lớp học như tên giáo viên, số học viên, và số bài tập được giao, cũng như
          lịch làm bài và hạn nộp.
        </p>
        <img
          src='https://res.cloudinary.com/du3922jvf/image/upload/v1750823753/b5d39436-d919-46e0-81d4-6273cb84a339.png'
          alt='Student Class Info Screenshot'
          className='rounded-md shadow-md mb-4 w-full md:w-3/4 lg:w-2/3 mx-auto'
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.onerror = null
            target.src = 'https://placehold.co/600x350/e0e0e0/000000?text=Image+Not+Found'
          }}
        />
        <ul className='list-disc list-inside text-gray-700'>
          <li>
            <strong>Tham gia lớp:</strong> Nhập mã lớp do giáo viên cung cấp để truy cập.
          </li>
          <li>
            <strong>Xem thông tin lớp:</strong> Tên giáo viên, số học viên, số bài tập được giao, lịch và hạn nộp.
          </li>
        </ul>
      </>
    )
  },
  {
    id: 'take-test',
    title: '2. Làm bài tập IELTS',
    icon: PenTool,
    content: (
      <>
        <p className='text-gray-700 mb-4'>
          Vào mục "Bài tập" hoặc "Tests". Chọn bài thi và bấm nút "Take" / "Làm bài". Nhấn "Bắt đầu" và hệ thống sẽ mở
          trình soạn thảo để bạn viết bài trực tiếp.
        </p>
        <img
          src='https://res.cloudinary.com/du3922jvf/image/upload/v1750823592/student-7_bxz06b.png'
          alt='Student Select Test Screenshot'
          className='rounded-md shadow-md mb-4 w-full md:w-3/4 lg:w-2/3 mx-auto'
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.onerror = null
            target.src = 'https://placehold.co/600x400/e0e0e0/000000?text=Image+Not+Found'
          }}
        />
        <p className='text-gray-700 mb-4'>Sau khi hoàn thành bài viết, nhấn "Nộp bài" để gửi bài của bạn.</p>
        <img
          src='https://res.cloudinary.com/du3922jvf/image/upload/v1750823489/student-3_qalbcz.png'
          alt='Student Writing Editor Screenshot'
          className='rounded-md shadow-md mb-4 w-full md:w-3/4 lg:w-2/3 mx-auto'
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.onerror = null
            target.src = 'https://placehold.co/600x400/e0e0e0/000000?text=Image+Not+Found'
          }}
        />
        <ul className='list-disc list-inside text-gray-700'>
          <li>
            <strong>Chọn bài thi:</strong> Truy cập mục "Bài tập" để chọn bài thi mong muốn.
          </li>
          <li>
            <strong>Làm bài trực tiếp:</strong> Viết bài trong trình soạn thảo tích hợp.
          </li>
          <li>
            <strong>Nộp bài:</strong> Gửi bài làm của bạn sau khi hoàn thành.
          </li>
        </ul>
      </>
    )
  },
  {
    id: 'view-score-feedback',
    title: '3. Xem điểm & phản hồi',
    icon: Eye,
    content: (
      <>
        <p className='text-gray-700 mb-4'>
          Hệ thống AI sẽ tự động chấm điểm bài viết của bạn theo 4 tiêu chí chính của IELTS:
        </p>
        <ul className='list-disc list-inside text-gray-700 mb-4'>
          <li>Task Achievement / Response</li>
          <li>Coherence & Cohesion</li>
          <li>Lexical Resource</li>
          <li>Grammatical Range & Accuracy</li>
        </ul>
        <p className='text-gray-700 mb-4'>
          Nếu giáo viên sửa bài, bạn sẽ thấy thêm góp ý chi tiết, gợi ý sửa lỗi và điểm số được điều chỉnh (nếu có).
        </p>
        <ul className='list-disc list-inside text-gray-700'>
          <li>
            <strong>Điểm số tự động:</strong> Nhận điểm ngay lập tức từ AI.
          </li>
          <li>
            <strong>Nhận xét từ giáo viên:</strong> Phản hồi cá nhân hóa để cải thiện.
          </li>
        </ul>
      </>
    )
  },
  {
    id: 'view-progress',
    title: '4. Xem tiến độ học tập',
    icon: BarChart3,
    content: (
      <>
        <p className='text-gray-700 mb-4'>Vào mục "Bài tập / Tests" và bấm vào từng bài thi để xem điểm số chi tiết.</p>
        <img
          src='https://res.cloudinary.com/du3922jvf/image/upload/v1750823488/student-4_odw0qw.png'
          alt='Student Test Details Completed Screenshot'
          className='rounded-md shadow-md mb-4 w-full md:w-3/4 lg:w-2/3 mx-auto'
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.onerror = null
            target.src = 'https://placehold.co/600x350/e0e0e0/000000?text=Image+Not+Found'
          }}
        />
        <p className='text-gray-700 mb-4'>
          Chọn "Bảng thống kê / My Dashboard" để nhận phân tích tổng quan về kỹ năng mạnh/yếu và thời gian cần cải
          thiện.
        </p>
        <img
          src='https://res.cloudinary.com/du3922jvf/image/upload/v1750823488/student-5_jwkcfo.png'
          alt='Student My Dashboard Menu Screenshot'
          className='rounded-md shadow-md mb-4 w-full md:w-3/4 lg:w-2/3 mx-auto'
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.onerror = null
            target.src = 'https://placehold.co/600x350/e0e0e0/000000?text=Image+Not+Found'
          }}
        />
        <img
          src='https://res.cloudinary.com/du3922jvf/image/upload/v1750823489/student-6_e4c1jb.png'
          alt='Student Dashboard Analysis Screenshot'
          className='rounded-md shadow-md mb-4 w-full md:w-3/4 lg:w-2/3 mx-auto'
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.onerror = null
            target.src = 'https://placehold.co/600x400/e0e0e0/000000?text=Image+Not+Found'
          }}
        />
        <p className='text-gray-700 mb-4'>
          Bạn cũng có thể xem lại lịch sử các bài đã làm, điểm số và nhận xét, và có thể chọn "Làm lại" bài bất kỳ để
          luyện tập thêm.
        </p>
        <ul className='list-disc list-inside text-gray-700'>
          <li>
            <strong>Điểm số chi tiết:</strong> Xem kết quả từng bài thi.
          </li>
          <li>
            <strong>Bảng thống kê:</strong> Phân tích hiệu suất học tập tổng thể.
          </li>
          <li>
            <strong>Lịch sử bài làm:</strong> Ôn lại các bài đã làm và luyện tập thêm.
          </li>
        </ul>
      </>
    )
  },
  {
    id: 'access-resources',
    title: '5. Truy cập tài nguyên học tập',
    icon: BookOpen,
    content: (
      <>
        <p className='text-gray-700 mb-4'>
          Vào mục "Tài nguyên" / "Materials" để truy cập các tài liệu học tập bổ ích. Bạn có thể tải về tài liệu PDF
          hoặc ảnh (nếu cho phép) để ôn luyện mọi lúc, mọi nơi.
        </p>
        <ul className='list-disc list-inside text-gray-700'>
          <li>
            <strong>Tìm kiếm tài nguyên:</strong> Dễ dàng truy cập tài liệu học tập.
          </li>
          <li>
            <strong>Lưu và sử dụng:</strong> Tải xuống tài liệu để học offline.
          </li>
        </ul>
      </>
    )
  }
]

export default function StudentInstruction() {
  const [activeStep, setActiveStep] = useState('join-class')
  const [language, setLanguage] = useState<'en' | 'vi'>('vi')

  const handleStepClick = (stepId: string) => {
    setActiveStep(stepId)
  }

  const currentStep = workflowActions.find((step) => step.id === activeStep)

  if (!currentStep) {
    return <div>Step not found</div>
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
      <Header showInstructions={true} language={language} onLanguageChange={setLanguage} />

      <div className='max-w-7xl mx-auto p-6'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            {language === 'en' ? 'Student Guide for IELTS Platform' : 'Hướng dẫn học viên sử dụng nền tảng IELTS'}
          </h1>
          <p className='text-gray-600'>
            {language === 'en'
              ? 'Complete step-by-step guide for students'
              : 'Hướng dẫn từng bước chi tiết cho học viên'}
          </p>
        </div>

        <div className='flex gap-6'>
          {/* Steps Sidebar */}
          <div className='w-64 flex-shrink-0'>
            <Card className='sticky top-6'>
              <CardHeader className='pb-3'>
                <CardTitle className='text-lg'>{language === 'en' ? 'Student Steps' : 'Các bước thực hiện'}</CardTitle>
              </CardHeader>
              <CardContent className='p-0'>
                <div className='space-y-1 p-4'>
                  {workflowActions.map((step, index) => {
                    const isActive = step.id === activeStep
                    const Icon = step.icon

                    return (
                      <div
                        key={step.id}
                        className={`
                          group relative cursor-pointer rounded-lg p-3 transition-all duration-200
                          ${
                            isActive
                              ? 'bg-blue-50 border-2 border-blue-200 shadow-sm'
                              : 'hover:bg-gray-50 border border-transparent'
                          }
                        `}
                        onClick={() => handleStepClick(step.id)}
                      >
                        <div className='flex items-start gap-3'>
                          <div
                            className={`
                            flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors
                            ${isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}
                          `}
                          >
                            <Icon size={16} />
                          </div>

                          <div className='flex-1 min-w-0'>
                            <h3
                              className={`
                              font-medium text-sm leading-tight
                              ${isActive ? 'text-blue-900' : 'text-gray-900'}
                            `}
                            >
                              {step.title}
                            </h3>
                          </div>

                          {isActive && <ChevronRight size={16} className='text-blue-600 flex-shrink-0' />}
                        </div>

                        {/* Connection line */}
                        {index < workflowActions.length - 1 && (
                          <div className='absolute left-7 top-12 w-0.5 h-4 bg-gray-200' />
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className='flex-1'>
            <Card>
              <CardHeader className='border-b'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center'>
                    {React.createElement(currentStep.icon, { size: 20 })}
                  </div>
                  <div>
                    <CardTitle className='text-xl'>{currentStep.title}</CardTitle>
                    <CardDescription>
                      {language === 'en' ? 'Step' : 'Bước'} {workflowActions.findIndex((s) => s.id === activeStep) + 1}{' '}
                      / {workflowActions.length}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className='pt-6'>
                <ScrollArea className='h-[700px] pr-4'>{currentStep.content}</ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
