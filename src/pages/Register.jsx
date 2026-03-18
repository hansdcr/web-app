import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'

function Register() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { register } = useAuth()

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
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

    if (!formData.username.trim()) {
      newErrors.username = t('registerUsernameRequired')
    } else if (formData.username.length < 3) {
      newErrors.username = t('registerUsernameTooShort')
    }

    if (!formData.email.trim()) {
      newErrors.email = t('registerEmailRequired')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('registerEmailInvalid')
    }

    if (!formData.password) {
      newErrors.password = t('registerPasswordRequired')
    } else if (formData.password.length < 8) {
      newErrors.password = t('registerPasswordTooShort')
    } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = t('registerPasswordWeak')
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('registerConfirmPasswordRequired')
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('registerPasswordMismatch')
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
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      })
      navigate('/home')
    } catch (error) {
      setErrorMessage(error.message || t('registerFailed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">🤖</div>
          <h1 className="auth-title">{t('registerTitle')}</h1>
          <p className="auth-subtitle">{t('registerSubtitle')}</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {errorMessage && (
            <div className="auth-error-banner">{errorMessage}</div>
          )}

          <div className="auth-form-group">
            <label className="auth-label">{t('registerUsername')}</label>
            <input
              type="text"
              name="username"
              className={`auth-input${errors.username ? ' has-error' : ''}`}
              placeholder={t('registerUsernamePlaceholder')}
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.username && <p className="auth-error">{errors.username}</p>}
          </div>

          <div className="auth-form-group">
            <label className="auth-label">{t('registerEmail')}</label>
            <input
              type="email"
              name="email"
              className={`auth-input${errors.email ? ' has-error' : ''}`}
              placeholder={t('registerEmailPlaceholder')}
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.email && <p className="auth-error">{errors.email}</p>}
          </div>

          <div className="auth-form-group">
            <label className="auth-label">{t('registerPassword')}</label>
            <input
              type="password"
              name="password"
              className={`auth-input${errors.password ? ' has-error' : ''}`}
              placeholder={t('registerPasswordPlaceholder')}
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.password && <p className="auth-error">{errors.password}</p>}
          </div>

          <div className="auth-form-group">
            <label className="auth-label">{t('registerConfirmPassword')}</label>
            <input
              type="password"
              name="confirmPassword"
              className={`auth-input${errors.confirmPassword ? ' has-error' : ''}`}
              placeholder={t('registerConfirmPasswordPlaceholder')}
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.confirmPassword && (
              <p className="auth-error">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading ? t('registerLoading') : t('registerSubmit')}
          </button>

          <div className="auth-footer">
            <span>{t('registerHasAccount')}</span>
            <Link to="/login" className="auth-link">
              {t('registerLoginLink')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register
