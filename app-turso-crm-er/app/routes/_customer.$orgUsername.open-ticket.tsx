import type { LoaderFunction, LoaderFunctionArgs, TypedResponse } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useFetcher, useLoaderData } from '@remix-run/react'
import type { Organization } from '~/lib/types';
import { LoaderIcon } from '~/components/icons';
import { getOrganizationDetails } from '~/lib/session.server';

export const loader: LoaderFunction = async ({ params }: LoaderFunctionArgs): Promise<{ organization: Organization } | TypedResponse> => {
  const { orgUsername: organizationUsername } = params;
  if (organizationUsername === undefined || organizationUsername === "") {
    return redirect("/");
  }

  const organization = await getOrganizationDetails({ organizationUsername });
  if (organization === undefined) {
    return redirect("/");
  }

  return json({
    organization
  })
}

export default function CustomerOpenTicket() {
  // @ts-ignore
  const { organization } = useLoaderData<typeof loader>();
  const customerFetcher = useFetcher();

  return (
    <section className='w-full min-h-screen p-4 grid grid-cols-2'>

      <div className='col-span-2 flex flex-col items-center gap-4 pt-6 pb-8 mt-4 mb-4 min-w-full max-w-[500px] mx-auto'>
        <h3 className='text-2xl font-semibold'>Talk to {organization.name}.</h3>

        {customerFetcher.state === "idle" && customerFetcher.data && (
          <div className={`flex items-center justify-center my-3 ${(customerFetcher.data as unknown as { ok: boolean }).ok ? 'bg-green-100' : 'bg-red-100'}`}>
            <p className={`p-2 ${(customerFetcher.data as unknown as { ok: boolean }).ok ? 'text-green-700' : 'text-red-700'}`}>{(customerFetcher.data as unknown as { message: string }).message}</p>
          </div>
        )}

        <customerFetcher.Form
          method="post"
          action='/customer-actions'
          className="flex flex-col gap-3 w-full"
        >
          <input type="hidden" name='organization_username' defaultValue={organization.username} />
          <div>
            <input
              id="full-name"
              name="customer_name"
              type="text"
              autoComplete="full-name"
              required
              placeholder="Full name"
              aria-label="Full name"
              className="mb-1 appearance-none rounded dark:bg-transparent border focus:border-primary/50 focus:ring-0 w-full py-2 px-3 text-primary/90 placeholder:text-primary/50 leading-tight focus:shadow-outline border-gray-500 focus-visible:outline-gray-600"
            />
          </div>
          <div>
            <input
              id="email"
              name="customer_email"
              type="email"
              autoComplete="email"
              required
              placeholder="Email address"
              aria-label="Email address"
              className="mb-1 appearance-none rounded dark:bg-transparent border focus:border-primary/50 focus:ring-0 w-full py-2 px-3 text-primary/90 placeholder:text-primary/50 leading-tight focus:shadow-outline border-gray-500 focus-visible:outline-gray-600"
            />
          </div>
          <div>
            <textarea
              id="query"
              name="query"
              autoComplete="query"
              required
              placeholder="Write us"
              aria-label="Write us"
              rows={5}
              className="mb-1 appearance-none rounded dark:bg-transparent border focus:border-primary/50 focus:ring-0 w-full py-2 px-3 text-primary/90 placeholder:text-primary/50 leading-tight focus:shadow-outline border-gray-500 focus-visible:outline-gray-600 resize-none"
            />
          </div>
          <div>
            <button
              className="bg-primary text-white bg-gray-700 hover:bg-gray-900 rounded py-2 px-4 focus:shadow-outline flex justify-center items-center gap-3 w-full"
              type="submit"
              name='_action'
              value="openTicket"
            >
              {customerFetcher.state === "submitting" && !customerFetcher.data && <LoaderIcon styles="h-4 w-4 animate-spin fill-white" />}
              <span>Open ticket</span>
            </button>
          </div>
        </customerFetcher.Form>
      </div>
    </section>
  )
}