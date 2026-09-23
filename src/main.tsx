import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { MotionConfig } from 'framer-motion'
import App from './App'
import { store } from './store'
import { FeedbackProvider } from './components/ui/Feedback'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <FeedbackProvider>
        {/* Visitors who ask their OS for reduced motion get fades instead of movement. */}
        <MotionConfig reducedMotion="user">
          <App />
        </MotionConfig>
      </FeedbackProvider>
    </Provider>
  </React.StrictMode>,
)
