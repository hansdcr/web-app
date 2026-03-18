import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'

function Login() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { login, loginAsAgent } = useAuth()

  const [mode, setMode] = useState('user') // 'user' | 'agent'
  const [formData, setFormData] = useState({ email: '', password: '', agent_id: '', api_key: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
    setErrorMessage('')
  }

  const handleModeSwitch = (newMode) => {
    setMode(newMode)
    setErrors({})
    setErrorMessage('')
  }

  const validateUser = () => {
    const newErrors = {}
    if (!formData.email.trim()) newErrors.email = t('loginEmailRequired')
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = t('loginEmailInvalid')
    if (!formData.password) newErrors.password = t('loginPasswordRequired')
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateAgent = () => {
    const newErrors = {}
    if (!formData.agent_id.trim()) newErrors.agent_id = 'Agent ID 不能为空'
    if (!formData.api_key.trim()) newErrors.api_key = 'API Key 不能为空'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const valid = mode === 'user' ? validateUser() : validateAgent()
    if (!valid) return

    setLoading(true)
    setErrorMessage('')

    try {
      if (mode === 'user') {
        await login({ email: formData.email, password: formData.password })
      } else {
        await loginAsAgent({ agent_id: formData.agent_id, api_key: formData.api_key })
      }
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
          <div className="auth-logo">{mode === 'agent' ? '🤖' : '👤'}</div>
          <h1 className="auth-title">{mode === 'agent' ? 'Agent 登录' : t('loginTitle')}</h1>
          <p className="auth-subtitle">{mode === 'agent' ? '以 Agent 身份进入系统' : t('loginSubtitle')}</p>
        </div>

        <div className="auth-mode-tabs">
          <button
            type="button"
            className={`auth-mode-tab${mode === 'user' ? ' active' : ''}`}
            onClick={() => handleModeSwitch('user')}
          >
            👤 用户登录
          </button>
          <button
            type="button"
            className={`auth-mode-tab${mode === 'agent' ? ' active' : ''}`}
            onClick={() => handleModeSwitch('agent')}
          >
            🤖 Agent 登录
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {errorMessage && <div className="auth-error-banner">{errorMessage}</div>}

          {mode === 'user' ? (
            <>
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
            </>
          ) : (
            <>
              <div className="auth-form-group">
                <label className="auth-label">Agent ID</label>
                <input
                  type="text"
                  name="agent_id"
                  className={`auth-input${errors.agent_id ? ' has-error' : ''}`}
                  placeholder="如：agent_libai"
                  value={formData.agent_id}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.agent_id && <p className="auth-error">{errors.agent_id}</p>}
              </div>
              <div className="auth-form-group">
                <label className="auth-label">API Key</label>
                <input
                  type="password"
                  name="api_key"
                  className={`auth-input${errors.api_key ? ' has-error' : ''}`}
                  placeholder="ak_..."
                  value={formData.api_key}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.api_key && <p className="auth-error">{errors.api_key}</p>}
              </div>
            </>
          )}

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? t('loginLoading') : (mode === 'agent' ? 'Agent 登录' : t('loginSubmit'))}
          </button>

          {mode === 'user' && (
            <div className="auth-footer">
              <span>{t('loginNoAccount')}</span>
              <Link to="/register" className="auth-link">{t('loginRegisterLink')}</Link>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default Login
