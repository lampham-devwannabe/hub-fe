import { useTranslation } from 'react-i18next'

export const TeacherClassView = () => {
  const { t } = useTranslation()

  return <h1>{t('class.teacherView')}</h1>
}
