import React, { useState } from 'react'
import { ChevronRight, BookOpen, Headphones, PenTool, MessageCircle, Clock, Target } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { ScrollArea } from '../../components/ui/scroll-area'
import Header from '../../components/common/layout/HomeHeader'

const ieltsSkills = [
  {
    id: 'listening',
    title: 'Listening Tips',
    icon: Headphones,
    content: (
      <>
        <h3 className='text-xl font-semibold text-blue-800 mb-4'>Chiến lược cho phần Listening</h3>
        <div className='space-y-4'>
          <div className='bg-blue-50 p-4 rounded-lg'>
            <h4 className='font-semibold text-blue-700 mb-2'>Trước khi nghe:</h4>
            <ul className='list-disc list-inside text-gray-700 space-y-1'>
              <li>Đọc trước các câu hỏi để dự đoán nội dung</li>
              <li>Xác định từ khóa quan trọng trong câu hỏi</li>
              <li>Dự đoán loại thông tin cần tìm (số, tên, địa điểm...)</li>
            </ul>
          </div>

          <div className='bg-green-50 p-4 rounded-lg'>
            <h4 className='font-semibold text-green-700 mb-2'>Trong khi nghe:</h4>
            <ul className='list-disc list-inside text-gray-700 space-y-1'>
              <li>Tập trung vào từ khóa và đồng nghĩa</li>
              <li>Chú ý đến các từ nối và thay đổi hướng</li>
              <li>Ghi chú nhanh nếu cần thiết</li>
              <li>Đừng dừng lại ở câu hỏi khó, tiếp tục theo dõi</li>
            </ul>
          </div>

          <div className='bg-yellow-50 p-4 rounded-lg'>
            <h4 className='font-semibold text-yellow-700 mb-2'>Sau khi nghe:</h4>
            <ul className='list-disc list-inside text-gray-700 space-y-1'>
              <li>Kiểm tra chính tả và ngữ pháp</li>
              <li>Đảm bảo đáp án phù hợp với giới hạn từ</li>
              <li>Hoàn thành các câu còn thiếu</li>
            </ul>
          </div>
        </div>
      </>
    )
  },
  {
    id: 'reading',
    title: 'Reading Tips',
    icon: BookOpen,
    content: (
      <>
        <h3 className='text-xl font-semibold text-blue-800 mb-4'>Chiến lược cho phần Reading</h3>
        <div className='space-y-4'>
          <div className='bg-purple-50 p-4 rounded-lg'>
            <h4 className='font-semibold text-purple-700 mb-2'>Quản lý thời gian:</h4>
            <ul className='list-disc list-inside text-gray-700 space-y-1'>
              <li>Dành 20 phút cho mỗi passage</li>
              <li>Đọc lướt trước để nắm ý chính</li>
              <li>Không đọc từng từ một cách chi tiết</li>
            </ul>
          </div>

          <div className='bg-indigo-50 p-4 rounded-lg'>
            <h4 className='font-semibold text-indigo-700 mb-2'>Kỹ thuật đọc hiệu quả:</h4>
            <ul className='list-disc list-inside text-gray-700 space-y-1'>
              <li>
                <strong>Skimming:</strong> Đọc nhanh để nắm ý chính
              </li>
              <li>
                <strong>Scanning:</strong> Tìm kiếm thông tin cụ thể
              </li>
              <li>
                <strong>Detailed reading:</strong> Đọc kỹ các đoạn quan trọng
              </li>
              <li>Chú ý đến các từ nối và cụm từ chuyển tiếp</li>
            </ul>
          </div>

          <div className='bg-red-50 p-4 rounded-lg'>
            <h4 className='font-semibold text-red-700 mb-2'>Các dạng câu hỏi phổ biến:</h4>
            <ul className='list-disc list-inside text-gray-700 space-y-1'>
              <li>Multiple choice: Loại trừ đáp án sai</li>
              <li>True/False/Not Given: Phân biệt rõ ba loại</li>
              <li>Matching: Tìm mối liên hệ logic</li>
              <li>Summary completion: Sử dụng từ khóa</li>
            </ul>
          </div>
        </div>
      </>
    )
  },
  {
    id: 'writing',
    title: 'Writing Tips',
    icon: PenTool,
    content: (
      <>
        <h3 className='text-xl font-semibold text-blue-800 mb-4'>Chiến lược cho phần Writing</h3>
        <div className='space-y-4'>
          <div className='bg-green-50 p-4 rounded-lg'>
            <h4 className='font-semibold text-green-700 mb-2'>Task 1 (Academic/General):</h4>
            <ul className='list-disc list-inside text-gray-700 space-y-1'>
              <li>Phân tích biểu đồ/letter format một cách cẩn thận</li>
              <li>Sử dụng từ vựng mô tả xu hướng chính xác</li>
              <li>Tránh lặp lại ngôn ngữ từ đề bài</li>
              <li>Viết tối thiểu 150 từ trong 20 phút</li>
            </ul>
          </div>

          <div className='bg-blue-50 p-4 rounded-lg'>
            <h4 className='font-semibold text-blue-700 mb-2'>Task 2 (Essay):</h4>
            <ul className='list-disc list-inside text-gray-700 space-y-1'>
              <li>Phân tích đề bài và xác định dạng bài</li>
              <li>Lập dàn ý trước khi viết</li>
              <li>Sử dụng cấu trúc 4 đoạn: Intro + 2 Body + Conclusion</li>
              <li>Phát triển ý tưởng với ví dụ cụ thể</li>
              <li>Viết tối thiểu 250 từ trong 40 phút</li>
            </ul>
          </div>

          <div className='bg-orange-50 p-4 rounded-lg'>
            <h4 className='font-semibold text-orange-700 mb-2'>4 tiêu chí chấm điểm:</h4>
            <ul className='list-disc list-inside text-gray-700 space-y-1'>
              <li>
                <strong>Task Achievement/Response:</strong> Trả lời đúng yêu cầu
              </li>
              <li>
                <strong>Coherence & Cohesion:</strong> Liên kết ý tưởng logic
              </li>
              <li>
                <strong>Lexical Resource:</strong> Sử dụng từ vựng phong phú
              </li>
              <li>
                <strong>Grammar:</strong> Cấu trúc câu đa dạng và chính xác
              </li>
            </ul>
          </div>
        </div>
      </>
    )
  },
  {
    id: 'speaking',
    title: 'Speaking Tips',
    icon: MessageCircle,
    content: (
      <>
        <h3 className='text-xl font-semibold text-blue-800 mb-4'>Chiến lược cho phần Speaking</h3>
        <div className='space-y-4'>
          <div className='bg-pink-50 p-4 rounded-lg'>
            <h4 className='font-semibold text-pink-700 mb-2'>Part 1 - Introduction:</h4>
            <ul className='list-disc list-inside text-gray-700 space-y-1'>
              <li>Trả lời ngắn gọn và tự nhiên (1-2 câu)</li>
              <li>Mở rộng câu trả lời với lý do hoặc ví dụ</li>
              <li>Sử dụng từ vựng đa dạng cho chủ đề quen thuộc</li>
            </ul>
          </div>

          <div className='bg-cyan-50 p-4 rounded-lg'>
            <h4 className='font-semibold text-cyan-700 mb-2'>Part 2 - Long turn (2 phút):</h4>
            <ul className='list-disc list-inside text-gray-700 space-y-1'>
              <li>Sử dụng 1 phút chuẩn bị để ghi chú ý tưởng</li>
              <li>Phát triển đầy đủ các điểm trong cue card</li>
              <li>Nói liên tục và tự nhiên</li>
              <li>Sử dụng các từ nối để liên kết ý tưởng</li>
            </ul>
          </div>

          <div className='bg-teal-50 p-4 rounded-lg'>
            <h4 className='font-semibold text-teal-700 mb-2'>Part 3 - Discussion:</h4>
            <ul className='list-disc list-inside text-gray-700 space-y-1'>
              <li>Đưa ra quan điểm rõ ràng và lập luận</li>
              <li>Sử dụng ngôn ngữ phân tích và so sánh</li>
              <li>Thể hiện khả năng tư duy phản biện</li>
              <li>Mở rộng câu trả lời với ví dụ từ xã hội</li>
            </ul>
          </div>

          <div className='bg-gray-50 p-4 rounded-lg'>
            <h4 className='font-semibold text-gray-700 mb-2'>Lời khuyên chung:</h4>
            <ul className='list-disc list-inside text-gray-700 space-y-1'>
              <li>Tự tin và thoải mái trong giao tiếp</li>
              <li>Đừng lo lắng về accent, tập trung vào clarity</li>
              <li>Sửa lỗi tự nhiên nếu nhận ra</li>
              <li>Tương tác tích cực với giám khảo</li>
            </ul>
          </div>
        </div>
      </>
    )
  },
  {
    id: 'time-management',
    title: 'Time Management',
    icon: Clock,
    content: (
      <>
        <h3 className='text-xl font-semibold text-blue-800 mb-4'>Quản lý thời gian hiệu quả</h3>
        <div className='space-y-4'>
          <div className='bg-amber-50 p-4 rounded-lg'>
            <h4 className='font-semibold text-amber-700 mb-2'>Lịch trình ôn tập dài hạn:</h4>
            <ul className='list-disc list-inside text-gray-700 space-y-1'>
              <li>
                <strong>3-6 tháng trước:</strong> Đánh giá trình độ và lập kế hoạch
              </li>
              <li>
                <strong>2-3 tháng trước:</strong> Ôn luyện từng kỹ năng cơ bản
              </li>
              <li>
                <strong>1 tháng trước:</strong> Làm đề thi thử và phân tích lỗi
              </li>
              <li>
                <strong>1 tuần trước:</strong> Ôn tập nhẹ và chuẩn bị tâm lý
              </li>
            </ul>
          </div>

          <div className='bg-emerald-50 p-4 rounded-lg'>
            <h4 className='font-semibold text-emerald-700 mb-2'>Thời gian cho từng phần thi:</h4>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='font-medium text-gray-800'>Listening: 40 phút</p>
                <p className='text-sm text-gray-600'>30 phút nghe + 10 phút chép bài</p>
              </div>
              <div>
                <p className='font-medium text-gray-800'>Reading: 60 phút</p>
                <p className='text-sm text-gray-600'>20 phút/passage (3 passages)</p>
              </div>
              <div>
                <p className='font-medium text-gray-800'>Writing: 60 phút</p>
                <p className='text-sm text-gray-600'>Task 1: 20 phút, Task 2: 40 phút</p>
              </div>
              <div>
                <p className='font-medium text-gray-800'>Speaking: 11-14 phút</p>
                <p className='text-sm text-gray-600'>Part 1: 4-5', Part 2: 3-4', Part 3: 4-5'</p>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  },
  {
    id: 'general-tips',
    title: 'General Tips',
    icon: Target,
    content: (
      <>
        <h3 className='text-xl font-semibold text-blue-800 mb-4'>Lời khuyên tổng quát</h3>
        <div className='space-y-4'>
          <div className='bg-violet-50 p-4 rounded-lg'>
            <h4 className='font-semibold text-violet-700 mb-2'>Chuẩn bị tâm lý:</h4>
            <ul className='list-disc list-inside text-gray-700 space-y-1'>
              <li>Ngủ đủ giấc trước ngày thi</li>
              <li>Ăn sáng đủ dinh dưỡng</li>
              <li>Đến sớm 30 phút để làm thủ tục</li>
              <li>Mang theo đầy đủ giấy tờ tùy thân</li>
            </ul>
          </div>

          <div className='bg-rose-50 p-4 rounded-lg'>
            <h4 className='font-semibold text-rose-700 mb-2'>Trong phòng thi:</h4>
            <ul className='list-disc list-inside text-gray-700 space-y-1'>
              <li>Đọc kỹ hướng dẫn trước khi bắt đầu</li>
              <li>Quản lý thời gian chặt chẽ</li>
              <li>Kiểm tra lại đáp án nếu có thời gian</li>
              <li>Giữ bình tĩnh và tự tin</li>
            </ul>
          </div>

          <div className='bg-sky-50 p-4 rounded-lg'>
            <h4 className='font-semibold text-sky-700 mb-2'>Luyện tập hàng ngày:</h4>
            <ul className='list-disc list-inside text-gray-700 space-y-1'>
              <li>Đọc báo tiếng Anh mỗi ngày (BBC, CNN...)</li>
              <li>Nghe podcast hoặc TED Talks</li>
              <li>Viết diary bằng tiếng Anh</li>
              <li>Nói chuyện với bạn bè hoặc tự luyện</li>
            </ul>
          </div>
        </div>
      </>
    )
  }
]

export default function IeltsTips() {
  const [activeSkill, setActiveSkill] = useState('listening')
  const [language, setLanguage] = useState<'en' | 'vi'>('vi')

  const handleSkillClick = (skillId: string) => {
    setActiveSkill(skillId)
  }

  const currentSkill = ieltsSkills.find((skill) => skill.id === activeSkill)

  if (!currentSkill) {
    return <div>Skill not found</div>
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
      <Header showInstructions={true} language={language} onLanguageChange={setLanguage} />

      <div className='max-w-7xl mx-auto p-6'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            {language === 'en' ? 'IELTS Tips & Strategies' : 'Mẹo và Chiến lược IELTS'}
          </h1>
          <p className='text-gray-600'>
            {language === 'en'
              ? 'Expert tips to help you achieve your target band score'
              : 'Mẹo từ chuyên gia giúp bạn đạt điểm mục tiêu'}
          </p>
        </div>

        <div className='flex gap-6'>
          {/* Skills Sidebar */}
          <div className='w-64 flex-shrink-0'>
            <Card className='sticky top-6'>
              <CardHeader className='pb-3'>
                <CardTitle className='text-lg'>{language === 'en' ? 'IELTS Skills' : 'Kỹ năng IELTS'}</CardTitle>
              </CardHeader>
              <CardContent className='p-0'>
                <div className='space-y-1 p-4'>
                  {ieltsSkills.map((skill, index) => {
                    const isActive = skill.id === activeSkill
                    const Icon = skill.icon

                    return (
                      <div
                        key={skill.id}
                        className={`
                          group relative cursor-pointer rounded-lg p-3 transition-all duration-200
                          ${
                            isActive
                              ? 'bg-blue-50 border-2 border-blue-200 shadow-sm'
                              : 'hover:bg-gray-50 border border-transparent'
                          }
                        `}
                        onClick={() => handleSkillClick(skill.id)}
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
                              {skill.title}
                            </h3>
                          </div>

                          {isActive && <ChevronRight size={16} className='text-blue-600 flex-shrink-0' />}
                        </div>

                        {/* Connection line */}
                        {index < ieltsSkills.length - 1 && (
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
                    {React.createElement(currentSkill.icon, { size: 20 })}
                  </div>
                  <div>
                    <CardTitle className='text-xl'>{currentSkill.title}</CardTitle>
                    <CardDescription>
                      {language === 'en' ? 'Expert strategies and tips' : 'Chiến lược và mẹo từ chuyên gia'}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className='pt-6'>
                <ScrollArea className='h-[700px] pr-4'>{currentSkill.content}</ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
