import React, { useState } from 'react'
import { ChevronRight, Users, BookOpen, FileText, Eye, PenTool, BarChart3 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { ScrollArea } from '../../components/ui/scroll-area'
import Header from '../../components/common/layout/HomeHeader'

const getWorkflowActions = (language: 'en' | 'vi') => [
  {
    id: 'create-class',
    title: language === 'en' ? '1. Create Class / Student Groups' : '1. Tạo lớp học / nhóm học viên',
    icon: Users,
    content: (
      <>
        <p className='text-gray-700 mb-4'>
          {language === 'en'
            ? 'Teachers fill in the class name and password (if necessary) in the form. The class code will be automatically generated and can be regenerated if needed. This helps organize students into separate groups for easy management.'
            : 'Giáo viên điền tên lớp học và mật khẩu (nếu cần thiết) vào biểu mẫu. Mã lớp học sẽ được tự động tạo và có thể được tái tạo nếu cần. Điều này giúp tổ chức học viên thành các nhóm riêng biệt để dễ dàng quản lý.'}
        </p>
        <img
          src='https://res.cloudinary.com/du3922jvf/image/upload/v1750783062/teacher-1_hkxmv0.png'
          alt='Create Class Screenshot'
          className='rounded-md shadow-md mb-4 w-full md:w-3/4 lg:w-2/3 mx-auto'
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.onerror = null
            target.src = 'https://placehold.co/400x300/e0e0e0/000000?text=Image+Not+Found'
          }}
        />
        <ul className='list-disc list-inside text-gray-700 space-y-1'>
          <li>
            <strong>{language === 'en' ? 'Class Name:' : 'Tên lớp học:'}</strong>{' '}
            {language === 'en' ? 'Enter a class name for easy identification.' : 'Nhập tên lớp học để dễ nhận biết.'}
          </li>
          <li>
            <strong>{language === 'en' ? 'Class Code:' : 'Mã lớp học:'}</strong>{' '}
            {language === 'en'
              ? 'Unique code for students to join the class.'
              : 'Mã duy nhất để học viên tham gia lớp.'}
          </li>
          <li>
            <strong>{language === 'en' ? 'Password (Optional):' : 'Mật khẩu (Tùy chọn):'}</strong>{' '}
            {language === 'en'
              ? 'Add more security by requiring a password.'
              : 'Thêm lớp học an toàn hơn bằng cách yêu cầu mật khẩu.'}
          </li>
        </ul>
      </>
    )
  },
  {
    id: 'access-class',
    title: '2. Truy cập lớp học',
    icon: BookOpen,
    content: (
      <>
        <p className='text-gray-700 mb-4'>
          Từ trang "Class", giáo viên bấm vào biểu tượng truy cập lớp học để xem chi tiết. Sau khi truy cập, giáo viên
          sẽ được chuyển tiếp đến trang liệt kê các học sinh của lớp. Trang này hiển thị danh sách các thành viên trong
          lớp, thông tin về trường học, và số lượng bài tập đã hoàn thành.
        </p>
        <img
          src='https://res.cloudinary.com/du3922jvf/image/upload/v1750783062/teacher-2_j2f8qs.png'
          alt='Access Class Screenshot'
          className='rounded-md shadow-md mb-4 w-full md:w-3/4 lg:w-2/3 mx-auto'
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.onerror = null
            target.src = 'https://placehold.co/600x400/e0e0e0/000000?text=Image+Not+Found'
          }}
        />
        <ul className='list-disc list-inside text-gray-700 space-y-1'>
          <li>
            <strong>Danh sách học sinh:</strong> Xem tên, trường và tiến độ bài làm của từng học sinh.
          </li>
          <li>
            <strong>Quản lý thành viên:</strong> Xóa học sinh khỏi lớp nếu cần.
            <img
              src='https://res.cloudinary.com/du3922jvf/image/upload/v1750783062/teacher-3_gjsjrn.png'
              alt='Access Class Screenshot'
              className='rounded-md shadow-md mb-4 w-full md:w-3/4 lg:w-2/3 mx-auto'
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.onerror = null
                target.src = 'https://placehold.co/600x400/e0e0e0/000000?text=Image+Not+Found'
              }}
            />
          </li>
        </ul>
      </>
    )
  },
  {
    id: 'create-test',
    title: '3. Tạo đề thi',
    icon: FileText,
    content: (
      <>
        <p className='text-gray-700 mb-4'>
          Từ trang "Tests" trong lớp học, giáo viên click vào nút "Add Test" để chuyển tiếp đến trang tạo đề thi. Có thể
          chọn loại đề thi (Listening, Reading, Writing) và tải lên file PDF của đề thi (không quá 15 trang).
        </p>
        <img
          src='https://res.cloudinary.com/du3922jvf/image/upload/v1750783062/teacher-4_ewco83.png'
          alt='Create Test Screenshot 1'
          className='rounded-md shadow-md mb-4 w-full md:w-3/4 lg:w-2/3 mx-auto'
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.onerror = null
            target.src = 'https://placehold.co/600x400/e0e0e0/000000?text=Image+Not+Found'
          }}
        />
        <p className='text-gray-700 mb-4'>
          Ngoài ra, giáo viên cũng được lựa chọn các đề thi đã được tạo trước hoặc chọn đề thi có sẵn của hệ thống (nếu
          đã đăng ký một trong hai gói dịch vụ).
        </p>
        <img
          src='https://res.cloudinary.com/du3922jvf/image/upload/v1750783063/teacher-6_bsympu.png'
          alt='Create Test Screenshot 2'
          className='rounded-md shadow-md mb-4 w-full md:w-3/4 lg:w-2/3 mx-auto'
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.onerror = null
            target.src = 'https://placehold.co/600x400/e0e0e0/000000?text=Image+Not+Found'
          }}
        />
        <ul className='list-disc list-inside text-gray-700 space-y-1'>
          <li>
            <strong>Loại đề thi:</strong> Chọn giữa Listening, Reading, Writing.
          </li>
          <li>
            <strong>Tải lên PDF:</strong> Tải đề thi của riêng bạn.
          </li>
          <li>
            <strong>Chọn đề có sẵn:</strong> Sử dụng các đề thi đã có hoặc của hệ thống.
          </li>
        </ul>
      </>
    )
  },
  {
    id: 'monitor-students',
    title: '4. Giám sát học viên làm bài qua hệ thống',
    icon: Eye,
    content: (
      <>
        <p className='text-gray-700 mb-4'>
          Từ trang "Tests", chọn một bài thi và bấm nút chi tiết để vào trang giám sát bài thi. Tiến độ làm bài của học
          sinh (Bắt đầu, Rời bài thi và Nộp bài) đều sẽ được thông báo theo thời gian thực.
        </p>
        <img
          src='https://res.cloudinary.com/du3922jvf/image/upload/v1750783063/teacher-7_dnvkwg.png'
          alt='Monitor Test Details Screenshot'
          className='rounded-md shadow-md mb-4 w-full md:w-3/4 lg:w-2/3 mx-auto'
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.onerror = null
            target.src = 'https://placehold.co/600x400/e0e0e0/000000?text=Image+Not+Found'
          }}
        />
        <p className='text-gray-700 mb-4'>
          Giáo viên cũng có thể đình chỉ hoặc cấp lại quyền làm bài cho học sinh nếu cần. Điều này giúp duy trì sự công
          bằng và tính trung thực trong quá trình làm bài.
        </p>
        <img
          src='https://res.cloudinary.com/du3922jvf/image/upload/v1750783062/teacher-8_clavfw.png'
          alt='Student Progress Monitor Screenshot'
          className='rounded-md shadow-md mb-4 w-full md:w-3/4 lg:w-2/3 mx-auto'
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.onerror = null
            target.src = 'https://placehold.co/600x400/e0e0e0/000000?text=Image+Not+Found'
          }}
        />
        <ul className='list-disc list-inside text-gray-700 space-y-1'>
          <li>
            <strong>Theo dõi thời gian thực:</strong> Cập nhật liên tục trạng thái làm bài của học sinh.
          </li>
          <li>
            <strong>Quản lý quyền làm bài:</strong> Đình chỉ hoặc cấp lại quyền làm bài linh hoạt.
          </li>
        </ul>
      </>
    )
  },
  {
    id: 'grade-writing',
    title: '5. Chấm bài viết',
    icon: PenTool,
    content: (
      <>
        <p className='text-gray-700 mb-4'>
          Giáo viên có thể chỉnh sửa và nhìn thấy thay đổi so với bài làm của học sinh, ghi nhận xét. Đồng thời, xem và
          áp dụng các gợi ý điểm theo 4 tiêu chí chấm bài viết từ AI đối với bài làm của học sinh. Điều này giúp việc
          chấm bài trở nên hiệu quả và khách quan hơn.
        </p>
        <img
          src='https://res.cloudinary.com/du3922jvf/image/upload/v1750783063/teacher-9_cikjoq.png'
          alt='Writing Task Grading Screenshot'
          className='rounded-md shadow-md mb-4 w-full md:w-3/4 lg:w-2/3 mx-auto'
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.onerror = null
            target.src = 'https://placehold.co/600x400/e0e0e0/000000?text=Image+Not+Found'
          }}
        />
        <ul className='list-disc list-inside text-gray-700 space-y-1'>
          <li>
            <strong>Chỉnh sửa và ghi nhận xét:</strong> Tương tác trực tiếp trên bài làm của học sinh.
          </li>
          <li>
            <strong>Gợi ý điểm từ AI:</strong> Hỗ trợ chấm điểm theo 4 tiêu chí IELTS chính thức.
          </li>
          <li>
            <strong>4 tiêu chí:</strong> Task Achievement / Response, Coherence & Cohesion, Lexical Resource,
            Grammatical Range & Accuracy.
          </li>
        </ul>
      </>
    )
  },
  {
    id: 'track-performance',
    title: '6. Theo dõi hiệu suất qua biểu đồ / báo cáo',
    icon: BarChart3,
    content: (
      <>
        <p className='text-gray-700 mb-4'>
          Nền tảng cung cấp các biểu đồ và bảng thống kê để giáo viên có thể theo dõi hiệu suất học viên một cách trực
          quan. Xem biểu đồ điểm số tổng thể và phân tích chi tiết từng câu hỏi.
        </p>
        <img
          src='https://res.cloudinary.com/du3922jvf/image/upload/v1750783063/teacher-10_kix4wk.png'
          alt='Score Distribution Screenshot'
          className='rounded-md shadow-md mb-4 w-full md:w-3/4 lg:w-2/3 mx-auto'
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.onerror = null
            target.src = 'https://placehold.co/600x400/e0e0e0/000000?text=Image+Not+Found'
          }}
        />
        <img
          src='https://res.cloudinary.com/du3922jvf/image/upload/v1750783063/teacher-11_mfwdbm.png'
          alt='Question Performance Analysis Screenshot'
          className='rounded-md shadow-md mb-4 w-full md:w-3/4 lg:w-2/3 mx-auto'
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.onerror = null
            target.src = 'https://placehold.co/600x400/e0e0e0/000000?text=Image+Not+Found'
          }}
        />
        <ul className='list-disc list-inside text-gray-700 space-y-1'>
          <li>
            <strong>Biểu đồ điểm số:</strong> Phân phối điểm tổng thể của lớp học.
          </li>
          <li>
            <strong>Phân tích câu hỏi:</strong> Xem tỷ lệ đúng/sai cho từng câu hỏi, giúp xác định điểm yếu chung.
          </li>
        </ul>
      </>
    )
  }
]

export default function TeacherInstruction() {
  const [activeStep, setActiveStep] = useState('create-class')
  const [language, setLanguage] = useState<'en' | 'vi'>('vi')

  const handleStepClick = (stepId: string) => {
    setActiveStep(stepId)
  }

  const workflowActions = getWorkflowActions(language)
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
            {language === 'en' ? 'IELTS Platform User Guide' : 'Hướng dẫn sử dụng nền tảng IELTS'}
          </h1>
          <p className='text-gray-600'>
            {language === 'en'
              ? 'Complete workflow from creating classes to monitoring student performance'
              : 'Quy trình hoàn chỉnh từ tạo lớp học đến theo dõi hiệu suất học viên'}
          </p>
        </div>

        <div className='flex gap-6'>
          {/* Small Steps Sidebar */}
          <div className='w-64 flex-shrink-0'>
            <Card className='sticky top-6'>
              <CardHeader className='pb-3'>
                <CardTitle className='text-lg'>
                  {language === 'en' ? 'Implementation Steps' : 'Các bước thực hiện'}
                </CardTitle>
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
