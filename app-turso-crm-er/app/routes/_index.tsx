import { json, type TypedResponse, type LoaderFunction, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from '@remix-run/react';
import { makeOrganization, type Organization } from '~/lib/types';
import { getAllOrganizations } from '~/lib/utils';

export const meta: MetaFunction = () => {
  return [
    { title: "Turso-CRM" },
    { name: "description", content: "Better your customer service!" },
  ];
};

export const loader: LoaderFunction = async (): Promise<{ organizations: Organization[] } | TypedResponse> => {
  const organizations = await getAllOrganizations();

  return json({
    organizations: organizations.map((organization: any) => makeOrganization(organization))
  })
}

export default function Index() {
  // @ts-ignore
  const { organizations } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col min-h-screen space-x-8 space-y-8">
      <div className="flex flex-col gap-4">
        <nav className="flex justify-between border-b">
          <div className="p-4 font-semibold">
            <div className="flex justify-center text-xl font-bold">
              <span className='text-teal-600'>TURSO</span><span className=' text-cyan-600 font-sans underline'>CRM</span>
            </div>
          </div>
        </nav>

        <div className="flex flex-col gap-8 p-3">
          <div className='flex flex-col gap-6 items-center'>
            <h1 className='text-2xl font-semibold'>Send your queries to your service providers</h1>

            {organizations.length > 0
              ? <ul className='flex just gap-3 p-8'>
                {organizations.map((org: Organization) => <li key={org.id}>
                  <a href={`/${org.username}/open-ticket`} className='p-2 rounded-sm border border-gray-300'>{org.name}</a>
                </li>)}
              </ul>
              : <div>No organizations</div>}
          </div>

          <div className='flex flex-col gap-6 justify-center items-center'>
            <h2> <span className='text-2xl font-semibold text-gray-600'>Are you an company?</span>  <span className='text-2xl font-semibold text-gray-400'>Talk to your customers</span></h2>

            <div className='flex justify-center gap-4'>
              <a
                className="bg-primary text-white bg-gray-700 hover:bg-gray-900 rounded py-2 px-4 focus:shadow-outline flex justify-center items-center gap-3 w-40"
                href='/register'
                title='Register company'
              >
                <span>Register</span>
              </a>
              <a
                className="bg-primary text-black border border-gray-500 hover:border-gray-900 rounded py-2 px-4 focus:shadow-outline flex justify-center items-center gap-3 w-40"
                href="/login"
                title='Sign in to company account'
              >
                <span>Sign in</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
