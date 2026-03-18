import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'

function Login() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { login } = useAuth()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // 清除该字段的错误
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
    setErrorMessage('')
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = t('loginEmailRequired')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('loginEmailInvalid')
    }

    if (!formData.password) {
      newErrors.password = t('loginPasswordRequired')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) return

    setLoading(true)
    setErrorMessage('')

    try {
      await login(formData)
      navigate('/home')
    } catch (error) {
      setErrorMessage(error.message || t('loginFailed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">🤖</div>
          <h1 className="auth-title">{t('loginTitle')}</h1>
          <p className="auth-subtitle">{t('loginSubtitle')}</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {errorMessage && (
            <div className="auth-error-banner">{errorMessage}</div>
          )}

          <div className="auth-form-group">
            <label className="auth-label">{t('loginEmail')}</label>
            <input
              type="email"
              name="email"
              className={`auth-input${errors.email ? ' has-error' : ''}`}
              placeholder={t('loginEmailPlaceholder')}
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.email && <p className="auth-error">{errors.email}</p>}
          </div>

          <div className="auth-form-group">
            <label className="auth-label">{t('loginPassword')}</label>
            <input
              type="password"
              name="password"
              className={`auth-input${errors.password ? ' has-error' : ''}`}
              placeholder={t('loginPasswordPlaceholder')}
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.password && <p className="auth-error">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading ? t('loginLoading') : t('loginSubmit')}
          </button>

          <div className="auth-footer">
            <span>{t('loginNoAccount')}</span>
            <Link to="/register" className="auth-link">
              {t('loginRegisterLink')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
