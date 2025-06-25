import { useEffect } from 'react'
import './App.css'
import { Provider, useSelector } from 'react-redux'
import i18n from './utils/i18n'
import { persistor, RootState, store } from './store'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AdminProtectedRoute } from './components/AdminProtectedRoute'
import { AdminLogin } from './pages/Auth/AdminLogin'
import { UserDashboard } from './pages/Admin/UserDashboard'
import { Unauthorized } from './pages/Auth/Unauthorized'
import { StudentClassView } from './pages/Class/StudentClassView'
import { TeacherClassView } from './pages/Class/TeacherClassView'
import { PersistGate } from 'redux-persist/integration/react'
import { ClassDetailView } from './pages/Class/ClassDetailView'
import HomePage from './pages/Home/HomePage'
import { Toaster } from './components/ui/sonner'
// import { WritingGradingView } from './pages/Test/WritingGradingView'
// import { WritingResponse } from './store/slices/attemptSlice'
// import { QuestionGroup, AnswerType } from './store/slices/testSlice'
import TestDetailPage from './pages/Test/TestDetailPage'
import { Login } from './pages/Auth/Login'
import { Register } from './pages/Auth/Register'
import StudentDashboard from './pages/Home/StudentDashboard'
import SubscriptionPage from './pages/Subscription/SubscriptionPage'
import PaymentSuccessPage from './pages/Payment/PaymentSuccessPage'
import PaymentCancelPage from './pages/Payment/PaymentCancelPage'
import TestOverviewDashboard from './pages/Test/TestOverView'
import { SubscriptionDashboard } from './pages/Admin/SubscriptionDashboard'
import { Analytics } from '@vercel/analytics/react'
import TeacherInstruction from './pages/Instructions/TeacherInstruction'
import StudentInstruction from './pages/Instructions/StudentInstruction'
import IeltsTips from './pages/Instructions/IeltsTips'

const LocaleSync = () => {
  const language = useSelector((state: RootState) => state.locale.language)
  useEffect(() => {
    i18n.changeLanguage(language)
  }, [language])
  return null
}

// Mock QuestionGroup for demonstration
// const mockQuestionGroup: QuestionGroup = {
//   groupId: 'wg1',
//   questionType: 'writing',
//   title: 'IELTS Writing Test',
//   content: 'This writing test consists of two tasks that should be completed in 60 minutes.',
//   instructions:
//     'You have 60 minutes to complete both writing tasks. Spend approximately 20 minutes on Task 1 and 40 minutes on Task 2.',
//   imageUrl: 'https://ielts-master.com/wp-content/uploads/2016/06/ielts_task_1_writing-e1466579722675.png', // Will be provided by user
//   questions: [
//     {
//       questionId: 1,
//       questionNumber: 1,
//       questionText:
//         'You should spend about 20 minutes on this task. The chart below shows the number of men and women in further education in Britain in three periods and whether they were studying full-time or part-time. Summarize the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.',
//       prefix: 'Task 1:',
//       suffix: '',
//       maxWords: 150,
//       answerType: AnswerType.TEXT,
//       marks: 33,
//       answer: {
//         answerId: 1,
//         correctAnswer: 'Task 1 model answer describing the chart trends...',
//         explanation:
//           'Key features to mention: overall trends, significant differences between genders, changes over time periods, specific data points for comparison.'
//       }
//     },
//     {
//       questionId: 2,
//       questionNumber: 2,
//       questionText:
//         'You should spend about 40 minutes on this task. Some people think that universities should provide graduates with the knowledge and skills needed in the workplace. Others think that the true function of a university is to give access to knowledge for its own sake, regardless of whether the course is useful to an employer. What, in your opinion, are the main functions of a university? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.',
//       prefix: 'Task 2:',
//       suffix: '',
//       maxWords: 250,
//       answerType: AnswerType.TEXT,
//       marks: 67,
//       answer: {
//         answerId: 2,
//         correctAnswer: 'Task 2 model answer discussing university functions...',
//         explanation:
//           'Should discuss both perspectives, provide clear opinion, use examples, and demonstrate strong argumentation skills.'
//       }
//     }
//   ],
//   options: [],
//   tableHeaders: [],
//   tableRows: [],
//   supportingTexts: []
// }

// Mock WritingResponse data for demonstration
// const mockWritingResponses: WritingResponse[] = [
//   // Student 1 - Task 1 Response
//   {
//     responseId: 'wr1-t1',
//     attemptId: 'att1',
//     questionId: 1,
//     originalText: `The chart shows the number of men and women in further education in Britain in three periods.

// In 1970/71, there were significantly more men than women studying. Men studying full-time was around 1000 thousand, while women was only about 200 thousand. For part-time study, men was about 800 thousand and women was around 600 thousand.

// In 1980/81, the gap between men and women became smaller. Men studying full-time increased to about 1200 thousand, and women increased dramatically to about 600 thousand. Part-time study for men stayed similar at around 800 thousand, but women increased to about 800 thousand.

// In 1990/91, women exceeded men in education. Women studying full-time reached about 1100 thousand, while men decreased to about 900 thousand. For part-time study, women reached about 1200 thousand, significantly higher than men at about 800 thousand.

// Overall, women's participation in further education increased dramatically over the three periods, while men's participation remained relatively stable.`,
//     finalText: `The chart illustrates the number of men and women pursuing further education in Britain across three distinct periods.

// In 1970/71, there was a significant gender disparity in educational participation. Male full-time students numbered approximately 1000 thousand, considerably higher than female full-time students at around 200 thousand. Regarding part-time education, men accounted for about 800 thousand students, while women comprised roughly 600 thousand.

// By 1980/81, this educational gap had begun to narrow. Male full-time enrollment increased to approximately 1200 thousand, while female participation surged dramatically to about 600 thousand. Part-time study patterns showed men maintaining similar levels at around 800 thousand, whereas women's participation rose to approximately 800 thousand.

// The period 1990/91 marked a remarkable shift, with women surpassing men in educational participation. Female full-time students reached about 1100 thousand, while male enrollment decreased to approximately 900 thousand. Most notably, part-time female students peaked at about 1200 thousand, significantly exceeding male part-time students who remained at around 800 thousand.

// In conclusion, the data reveals a dramatic transformation in educational demographics, with women's participation in further education increasing substantially over the three periods, while men's involvement remained relatively constant.`,
//     diffJson: JSON.stringify([
//       ['EQUAL', 'The chart '],
//       ['DELETE', 'shows'],
//       ['INSERT', 'illustrates'],
//       ['EQUAL', ' the number of men and women '],
//       ['DELETE', 'in'],
//       ['INSERT', 'pursuing'],
//       ['EQUAL', ' further education in Britain '],
//       ['DELETE', 'in three periods'],
//       ['INSERT', 'across three distinct periods'],
//       ['EQUAL', '.\n\nIn 1970/71, there '],
//       ['DELETE', 'were significantly more men than women studying'],
//       ['INSERT', 'was a significant gender disparity in educational participation']
//     ]),
//     aiGraded: JSON.stringify([7.0, 6.5, 6.5, 6.0, 6.5]),
//     teacherGraded: JSON.stringify([0, 0, 0, 0, 0]),
//     finalScore: 0,
//     submittedAt: '2024-01-15T10:30:00Z'
//   },
//   // Student 1 - Task 2 Response
//   {
//     responseId: 'wr1-t2',
//     attemptId: 'att1',
//     questionId: 2,
//     originalText: `Universities have different roles in society. Some people think they should prepare students for work, while others believe they should focus on knowledge itself.

// In my opinion, universities should do both things. First, students need practical skills for their future careers. For example, business students should learn about marketing and finance. Engineering students need to know how to solve real problems. If universities don't teach these skills, graduates will have difficulties finding jobs.

// However, universities also need to teach knowledge for its own sake. This helps students think critically and understand the world better. Philosophy, history, and literature might not directly help in getting a job, but they make people more intelligent and cultured.

// Furthermore, pure research in universities leads to important discoveries. Many medical breakthroughs and technological innovations came from university research that seemed useless at first.

// I think the best universities combine both approaches. They should provide practical training while also encouraging intellectual curiosity and independent thinking.

// In conclusion, universities serve society best when they prepare students for careers and also pursue knowledge for its own value.`,
//     finalText: `Universities serve multiple functions in contemporary society, and there is ongoing debate about whether their primary role should be career preparation or the pursuit of knowledge for its own merit.

// In my view, universities should fulfill both functions simultaneously. Firstly, institutions must equip students with practical skills relevant to their future careers. For instance, business students require comprehensive understanding of marketing strategies, financial management, and organizational behavior. Similarly, engineering programs must provide hands-on experience in problem-solving and technical applications. Without such practical preparation, graduates would struggle to transition effectively into professional environments.

// However, universities must also maintain their traditional commitment to knowledge acquisition for intellectual enrichment. Subjects such as philosophy, history, and literature may not offer immediate vocational benefits, but they cultivate critical thinking abilities, cultural awareness, and analytical skills that enhance overall intellectual capacity.

// Moreover, pure academic research conducted within universities frequently yields unexpected breakthroughs. Many significant medical advances and technological innovations originated from seemingly impractical research projects that later proved revolutionary.

// Consequently, the most effective universities successfully integrate both approaches. They should provide relevant professional training while simultaneously fostering intellectual curiosity, independent thinking, and scholarly inquiry.

// In conclusion, universities serve society optimally when they balance career preparation with the pursuit of knowledge, ensuring graduates are both professionally competent and intellectually sophisticated.`,
//     diffJson: JSON.stringify([
//       ['EQUAL', 'Universities '],
//       ['DELETE', 'have different roles'],
//       ['INSERT', 'serve multiple functions'],
//       ['EQUAL', ' in '],
//       ['INSERT', 'contemporary '],
//       ['EQUAL', 'society'],
//       [
//         'DELETE',
//         '. Some people think they should prepare students for work, while others believe they should focus on knowledge itself'
//       ],
//       [
//         'INSERT',
//         ', and there is ongoing debate about whether their primary role should be career preparation or the pursuit of knowledge for its own merit'
//       ],
//       ['EQUAL', '.\n\nIn my '],
//       ['DELETE', 'opinion'],
//       ['INSERT', 'view'],
//       ['EQUAL', ', universities should '],
//       ['DELETE', 'do both things'],
//       ['INSERT', 'fulfill both functions simultaneously']
//     ]),
//     aiGraded: JSON.stringify([6.5, 6.0, 6.0, 5.5, 6.0]),
//     teacherGraded: JSON.stringify([0, 0, 0, 0, 0]),
//     finalScore: 0,
//     submittedAt: '2024-01-15T10:45:00Z'
//   }
//   //   // Student 2 - Task 1 Response
//   //   {
//   //     responseId: 'wr2-t1',
//   //     attemptId: 'att2',
//   //     questionId: 1,
//   //     originalText: `The chart displays information about men and women in further education in Britain.

//   // In the first period 1970/71, men were much more than women. Men full-time study was 1000 and women only 200. Men part-time was 800 and women 600.

//   // Second period 1980/81 showed some changes. Men full-time went up to 1200 and women also increased a lot to 600. Part-time men stayed same 800 but women increased to 800 too.

//   // Last period 1990/91 was very different. Women full-time became 1100 but men went down to 900. Part-time women was highest at 1200 and men still 800.

//   // So we can see women increased a lot in education while men didn't change much.`,
//   //     finalText: `The chart displays comprehensive information about male and female participation in further education across Britain during three distinct time periods.

//   // During the initial period of 1970/71, male participation significantly exceeded female enrollment. Male full-time students numbered 1000 thousand, substantially higher than the 200 thousand female full-time students. Similarly, part-time male students totaled 800 thousand, compared to 600 thousand female part-time students.

//   // The subsequent period of 1980/81 demonstrated notable changes in educational patterns. Male full-time enrollment increased to 1200 thousand, while female participation experienced considerable growth, reaching 600 thousand. Part-time male students remained stable at 800 thousand, whereas female part-time students increased proportionally to 800 thousand.

//   // The final period of 1990/91 revealed a dramatic transformation in educational demographics. Female full-time students peaked at 1100 thousand, while male enrollment declined to 900 thousand. Most significantly, part-time female students reached their highest point at 1200 thousand, while male part-time students maintained their consistent level of 800 thousand.

//   // In summary, the data clearly demonstrates that female participation in further education increased substantially throughout the three periods, while male participation remained relatively unchanged.`,
//   //     diffJson: JSON.stringify([
//   //       ['EQUAL', 'The chart displays '],
//   //       ['INSERT', 'comprehensive '],
//   //       ['EQUAL', 'information about '],
//   //       ['DELETE', 'men and women'],
//   //       ['INSERT', 'male and female participation'],
//   //       ['EQUAL', ' in further education '],
//   //       ['DELETE', 'in Britain'],
//   //       ['INSERT', 'across Britain during three distinct time periods']
//   //     ]),
//   //     aiGraded: JSON.stringify([6.0, 5.5, 5.5, 5.0, 5.5]),
//   //     teacherGraded: JSON.stringify([0, 0, 0, 0, 0]),
//   //     finalScore: 0,
//   //     submittedAt: '2024-01-15T09:45:00Z'
//   //   },
//   //   // Student 2 - Task 2 Response
//   //   {
//   //     responseId: 'wr2-t2',
//   //     attemptId: 'att2',
//   //     questionId: 2,
//   //     originalText: `There are different ideas about what universities should do. Some people think universities should teach skills for jobs. Other people think universities should teach knowledge just for learning.

//   // I think universities should teach both. Students need to learn skills for their jobs because they need to work after graduation. If they don't have skills, they cannot find good jobs. For example, if someone studies computer science, they need to learn programming.

//   // But universities should also teach other subjects that are interesting but not for jobs. These subjects like art and history help students to think better and understand culture. They make students smarter even if they don't help with jobs directly.

//   // Also, universities do research which is very important. Scientists in universities discover new things that help everyone. This research might not seem useful at first but later it becomes very important.

//   // I believe good universities do both things. They teach practical skills and also teach knowledge for learning. This way students get jobs and also become educated people.

//   // In conclusion, universities should prepare students for work and also give them knowledge for learning.`,
//   //     finalText: `There are differing perspectives regarding the primary functions universities should serve in society. Some advocate for practical career preparation, while others emphasize knowledge acquisition for intellectual development.

//   // In my opinion, universities should effectively balance both objectives. Students require practical skills relevant to their future professions. Without applicable competencies, graduates face significant challenges securing meaningful employment. Therefore, universities must provide comprehensive vocational training aligned with industry requirements and market demands.

//   // However, universities should simultaneously maintain their commitment to broader intellectual development. Subjects such as art, history, and philosophy enhance critical thinking capabilities, cultural understanding, and intellectual sophistication. While these disciplines may not directly correlate with immediate employment benefits, they contribute substantially to personal development and societal advancement.

//   // Furthermore, universities conduct essential research that drives innovation and scientific progress. Academic researchers frequently make groundbreaking discoveries that initially appear impractical but eventually revolutionize various fields and benefit society broadly.

//   // Consequently, effective universities successfully integrate vocational training with comprehensive education. This approach ensures graduates possess both professional competencies and intellectual maturity necessary for meaningful career success and lifelong learning.

//   // In conclusion, universities optimally serve society by preparing students for professional careers while simultaneously fostering intellectual growth and cultural awareness through diverse educational experiences.`,
//   //     diffJson: JSON.stringify([
//   //       ['EQUAL', 'There are '],
//   //       ['DELETE', 'different ideas about what universities should do'],
//   //       ['INSERT', 'differing perspectives regarding the primary functions universities should serve in society'],
//   //       ['EQUAL', '. Some '],
//   //       ['DELETE', 'people think universities should teach skills for jobs'],
//   //       ['INSERT', 'advocate for practical career preparation'],
//   //       ['EQUAL', '. '],
//   //       ['DELETE', 'Other people think universities should teach knowledge just for learning'],
//   //       ['INSERT', 'Others emphasize knowledge acquisition for intellectual development']
//   //     ]),
//   //     aiGraded: JSON.stringify([5.5, 5.0, 5.0, 4.5, 5.0]),
//   //     teacherGraded: JSON.stringify([0, 0, 0, 0, 0]),
//   //     finalScore: 0,
//   //     submittedAt: '2024-01-15T10:00:00Z'
//   //   },
//   //   // Student 3 - Task 1 Response (Already graded)
//   //   {
//   //     responseId: 'wr3-t1',
//   //     attemptId: 'att3',
//   //     questionId: 1,
//   //     originalText: `The chart shows data about education in Britain for men and women in three time periods.

//   // 1970/71: More men than women. Men full-time 1000, women 200. Men part-time 800, women 600.
//   // 1980/81: Still more men but gap smaller. Men full-time 1200, women 600. Part-time both 800.
//   // 1990/91: Women more than men! Women full-time 1100, men 900. Women part-time 1200, men 800.

//   // Women increased most in education. Men not much change.`,
//   //     finalText: `The chart presents comprehensive data regarding educational participation among men and women in Britain across three significant time periods.

//   // During 1970/71, male participation substantially exceeded female enrollment. Male full-time students comprised 1000 thousand individuals, significantly outnumbering the 200 thousand female full-time students. Part-time education showed 800 thousand male students compared to 600 thousand female students.

//   // The 1980/81 period demonstrated continued male dominance, although the gender gap began to narrow considerably. Male full-time enrollment increased to 1200 thousand, while female participation experienced substantial growth to 600 thousand. Part-time education showed convergence, with both genders reaching approximately 800 thousand students.

//   // By 1990/91, a remarkable reversal had occurred, with female participation surpassing male enrollment. Female full-time students reached 1100 thousand, exceeding male students who numbered 900 thousand. Most notably, part-time female students peaked at 1200 thousand, significantly higher than the consistent 800 thousand male part-time students.

//   // In conclusion, the data reveals a transformative shift in educational demographics, with female participation experiencing dramatic growth throughout the periods, while male participation remained relatively stable with minimal fluctuation.`,
//   //     diffJson: JSON.stringify([
//   //       ['EQUAL', 'The chart '],
//   //       ['DELETE', 'shows data about education'],
//   //       ['INSERT', 'presents comprehensive data regarding educational participation among men and women'],
//   //       ['EQUAL', ' in Britain '],
//   //       ['DELETE', 'for men and women in'],
//   //       ['INSERT', 'across'],
//   //       ['EQUAL', ' three '],
//   //       ['DELETE', 'time periods'],
//   //       ['INSERT', 'significant time periods']
//   //     ]),
//   //     aiGraded: JSON.stringify([5.5, 5.0, 4.5, 4.0, 4.5]),
//   //     teacherGraded: JSON.stringify([6.0, 5.5, 5.0, 4.5, 5.0]),
//   //     finalScore: 5.0,
//   //     submittedAt: '2024-01-15T11:15:00Z',
//   //     editedAt: '2024-01-15T14:30:00Z',
//   //     editedBy: 'teacher@school.edu'
//   //   },
//   //   // Student 3 - Task 2 Response (Already graded)
//   //   {
//   //     responseId: 'wr3-t2',
//   //     attemptId: 'att3',
//   //     questionId: 2,
//   //     originalText: `Universities should teach students for jobs or for knowledge? I think both.

//   // Students need job skills. If no job skills, no job after university. This is bad. So universities must teach job skills.

//   // But also need other knowledge. History, art etc. These make people smart and understand world better.

//   // Universities also do research. This research very important for new discoveries.

//   // So universities should do both - teach job skills and knowledge.`,
//   //     finalText: `The question of whether universities should prioritize career preparation or knowledge for its own sake represents a fundamental debate in higher education. In my view, universities should effectively integrate both approaches.

//   // Students undeniably require practical skills relevant to their chosen professions. Without applicable competencies, graduates face significant challenges securing meaningful employment. Therefore, universities must provide comprehensive vocational training aligned with industry requirements and market demands.

//   // However, universities should simultaneously maintain their commitment to broader intellectual development. Subjects such as history, literature, and philosophy cultivate critical thinking, cultural awareness, and analytical capabilities essential for personal growth and societal participation.

//   // Additionally, universities conduct vital research that drives innovation and scientific advancement. Academic research frequently yields discoveries that initially appear impractical but eventually prove transformative for society.

//   // Consequently, effective universities successfully balance practical training with intellectual enrichment, ensuring graduates possess both professional competencies and scholarly sophistication necessary for meaningful contributions to society.

//   // In conclusion, universities serve their purpose optimally when they prepare students for careers while simultaneously fostering intellectual curiosity and cultural understanding.`,
//   //     diffJson: JSON.stringify([
//   //       ['DELETE', 'Universities should teach students for jobs or for knowledge? I think both.'],
//   //       [
//   //         'INSERT',
//   //         'The question of whether universities should prioritize career preparation or knowledge for its own sake represents a fundamental debate in higher education. In my view, universities should effectively integrate both approaches.'
//   //       ],
//   //       ['EQUAL', '\n\nStudents '],
//   //       [
//   //         'DELETE',
//   //         'need job skills. If no job skills, no job after university. This is bad. So universities must teach job skills.'
//   //       ],
//   //       [
//   //         'INSERT',
//   //         'undeniably require practical skills relevant to their chosen professions. Without applicable competencies, graduates face significant challenges securing meaningful employment. Therefore, universities must provide comprehensive vocational training aligned with industry requirements and market demands.'
//   //       ]
//   //     ]),
//   //     aiGraded: JSON.stringify([4.0, 3.5, 3.0, 3.0, 3.5]),
//   //     teacherGraded: JSON.stringify([5.0, 4.5, 4.0, 4.0, 4.5]),
//   //     finalScore: 4.5,
//   //     submittedAt: '2024-01-15T11:30:00Z',
//   //     editedAt: '2024-01-15T15:00:00Z',
//   //     editedBy: 'teacher@school.edu'
//   //   }
// ]
export const App = () => {
  return (
    <div className='App min-h-screen bg-background p-1 md:p-2 lg:p-4'>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <I18nextProvider i18n={i18n}>
            <BrowserRouter>
              <LocaleSync />
              <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path='/admin/login' element={<AdminLogin />} />
                <Route
                  path='/admin/dashboard'
                  element={
                    <AdminProtectedRoute>
                      <UserDashboard />
                    </AdminProtectedRoute>
                  }
                />
                <Route
                  path='/admin/subscriptions'
                  element={
                    <AdminProtectedRoute>
                      <SubscriptionDashboard />
                    </AdminProtectedRoute>
                  }
                />
                <Route path='/admin/unauthorized' element={<Unauthorized />} />
                <Route path='/admin-login' element={<Navigate to='/admin/login' replace />} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/instructions/teacher' element={<TeacherInstruction />} />
                <Route path='/instructions/student' element={<StudentInstruction />} />
                <Route path='/instructions/tips' element={<IeltsTips />} />
                <Route path='/student-dashboard' element={<StudentDashboard />} />
                <Route
                  path='/subscription'
                  element={
                    <ProtectedRoute
                      teacherView={<SubscriptionPage />}
                      studentView={
                        <div className='min-h-screen flex items-center justify-center bg-gray-50'>
                          <div className='text-center'>
                            <h1 className='text-2xl font-bold text-gray-900 mb-4'>Access Denied</h1>
                            <p className='text-gray-600'>This page is only available for teachers.</p>
                          </div>
                        </div>
                      }
                    />
                  }
                />
                <Route path='/payment/success' element={<PaymentSuccessPage />} />
                <Route path='/payment/cancel' element={<PaymentCancelPage />} />
                {/* <Route path='/test/:testId' element={<TestView />} /> */}
                <Route
                  path='/class'
                  element={<ProtectedRoute teacherView={<TeacherClassView />} studentView={<StudentClassView />} />}
                />
                <Route
                  path='/class/:classId/*'
                  element={<ProtectedRoute teacherView={<ClassDetailView />} studentView={<ClassDetailView />} />}
                />
                <Route path='/unauthorized' element={<Unauthorized />} />
                {/* <Route
                  path='/writing-grading'
                  element={
                    <WritingGradingView
                      questionGroup={mockQuestionGroup}
                      writingResponses={mockWritingResponses}
                      section={undefined}
                    />
                  }
                /> */}
                <Route path='/test-overview' element={<TestOverviewDashboard />} />
                <Route path='/test-detail' element={<TestDetailPage />} />
                <Route path='*' element={<div>404 Not Found</div>} />
              </Routes>
              <Toaster />
              <Analytics />
            </BrowserRouter>
          </I18nextProvider>
        </PersistGate>
      </Provider>
    </div>
  )
}

export default App
