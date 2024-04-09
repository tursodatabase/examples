import Link from 'next/link';
import './form.css'

export const runtime = 'edge'

export const metadata = {
  title: 'Register',
  description: 'Create an account in Top Web Frameworks',
}

export default function RegisterPage(request: { searchParams: any}) {
  const {error, message} = request.searchParams;

  return (
    <>
      <h1>
        Register
      </h1>

      <div className="mb-32 text-center lg:text-left w-[80vw] max-w-2xl flex flex-col">
        {
          message && <div className='bg-green-200 text-green-800 p-2 w-full'>
            {message}
          </div>
        }
        {
          error && <div className='bg-red-200 text-red-800 p-2 w-full'>
            {error}
          </div>
        }
        <form action="/api/auth" method="post" className="flex flex-col w-full">

          <div>
            <label htmlFor="full-name">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              id='full-name'
              placeholder="Foo Bar"
              required
            />
          </div>

          <div>
            <label htmlFor="email">
              email
            </label>

            <input
              type="email"
              name="email"
              id='email'
              placeholder="me@email.com"
              required
            />
          </div>

          <div className='flex p-2 text-sm'>
            Have an account? <Link className='hover:underline px-2' href="/log-in">Log in</Link>
          </div>
          
          <div className="flex justify-center p-2">
            <button
              type="submit"
              name='_action'
              value="register"
              className="py-2 px-4 text-white font-semibold bg-teal-600 rounded-md hover:bg-teal-700 focus:relative flex space-x-2 justify-between items-center"
              title="View Orders"
            >
              <span>Register</span>
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

