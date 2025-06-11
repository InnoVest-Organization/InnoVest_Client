import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './InnovatorSignUp.css'

function InnovatorSignUp() {
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    profilePicture: '',
    birthday: '',
    gender: ''
  })

  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('') // 'success', 'warning', or 'error'

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('http://localhost:5001/api/innovator/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.status === 201) {
        setMessage('User registered successfully!')
        setMessageType('success')
        // Clear form on success
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          profilePicture: '',
          birthday: '',
          gender: ''
        })
        // Optionally redirect to home after successful registration
        setTimeout(() => {
          navigate('/')
        }, 2000)
      } else if (data.status === 200) {
        setMessage('User already exists with this email.')
        setMessageType('warning')
      } else {
        setMessage('Registration failed. Please try again.')
        setMessageType('error')
      }
    } catch (error) {
      console.error('Error during registration:', error)
      setMessage('Network error. Please check if the server is running.')
      setMessageType('error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToHome = () => {
    navigate('/')
  }

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="header-section">
          <button className="back-button" onClick={handleBackToHome}>
            ← Back to Home
          </button>
          <h1>Innovator Sign-Up</h1>
          <p>Create your profile to start your innovation journey</p>
        </div>

        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-row">
            <div className="form-group required">
              <label htmlFor="firstName">
                First Name<span className="required-asterisk">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                placeholder="Enter your first name"
              />
            </div>

            <div className="form-group required">
              <label htmlFor="lastName">
                Last Name<span className="required-asterisk">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div className="form-group required">
            <label htmlFor="email">
              Email<span className="required-asterisk">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Enter your email address"
            />
          </div>

          <div className="form-group">
            <label htmlFor="profilePicture">Profile Picture URL</label>
            <input
              type="url"
              id="profilePicture"
              name="profilePicture"
              value={formData.profilePicture}
              onChange={handleInputChange}
              placeholder="https://example.com/your-photo.jpg (Optional)"
            />
          </div>

          <div className="form-row">
            <div className="form-group required">
              <label htmlFor="birthday">
                Birthday<span className="required-asterisk">*</span>
              </label>
              <input
                type="date"
                id="birthday"
                name="birthday"
                value={formData.birthday}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group required">
              <label htmlFor="gender">
                Gender<span className="required-asterisk">*</span>
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="login-link">
          <p>Already have an account? <a href="/">Sign In</a></p>
        </div>
      </div>
    </div>
  )
}

export default InnovatorSignUp