import { type LoaderFunction, type LoaderFunctionArgs, redirect } from '@remix-run/node';
import { Outlet, useFetcher, useLoaderData } from '@remix-run/react';
import { BuildingIcon } from '~/components/icons';
import { getOrganizationDetails } from '~/lib/session.server';
import type { Organization } from '~/lib/types';

export const loader: LoaderFunction = async ({ request, params }: LoaderFunctionArgs): Promise<any> => {
  if (params.orgUsername === undefined) {
    return redirect("/"); // TODO: Return to appropriate page (org not exists)
  }

  const org: Organization | undefined = await getOrganizationDetails({ organizationUsername: params.orgUsername as string });

  if (org === undefined) {
    return redirect("/"); // * org not exists
  }

  return {
    org
  };
}

export default function OrganizationLayout() {
  // @ts-ignore
  const { org } = useLoaderData<typeof loader>();
  const logOutFetcher = useFetcher();

  return <div className="flex flex-col min-h-screen space-x-8 space-y-8">
    <div className="flex flex-col gap-4">
      <nav className="flex justify-between border-b">
        <div className="p-4 font-semibold">
          <a href={`/agent/${org.username}/dash`} className='flex gap-2 items-center'>
            {org.logo ? <img src={org.logo} className='w-5 h-5' alt={org.name} /> : <BuildingIcon styles='h-6 w-6' />}
            <span>{org.name}</span>
          </a>
        </div>
        <logOutFetcher.Form method='post' action="/agent-actions">
          <input type="hidden" name='organization_id' value={org.id} />
          <button type="submit" className="p-3" name='_action' value="logOut">Log Out</button>
        </logOutFetcher.Form>
      </nav>

      <div className="flex gap-4 p-3">
        <Outlet />
      </div>
    </div>
  </div>
}