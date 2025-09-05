import DaisyThemeWrapper from '@/components/DaisyThemeWrapper'
import MacroSetupForm from '@/components/MacroSetupForm'

export default function SetupPage() {
  return (
    <DaisyThemeWrapper className="flex flex-col items-center space-y-6 p-6">
      {/* Name Input */} <Hero />
      <MacroSetupForm />
      {/* <UserSetupForm /> */}
    </DaisyThemeWrapper>
  )
}

function Hero() {
  return (
    <div className="hero p-6">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-xl font-bold">{'Your Personalized Nutrition Starts Here'}</h1>
          <p className="py-3">
            Tell us a bit about yourself—your height, weight, age, and activity level—and we’ll
            calculate the perfect protein and calorie targets to fuel your day.
          </p>
        </div>
      </div>
    </div>
  )
}

function Card({ children }) {
  return (
    <div className="card bg-base-200 w-full border shadow-sm">
      <div className="card-body items-center text-center">
        {/* <h2 className="card-title"></h2> */}
        {children}
        <div className="card-actions">
          <button className="btn btn-primary">Buy Now</button>
        </div>
      </div>
    </div>
  )
}
