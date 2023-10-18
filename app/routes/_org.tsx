import { type LoaderFunction, type LoaderFunctionArgs, redirect } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { BuildingIcon } from '~/components/icons';
import { getOrganizationDetails, requireOrganizationId } from '~/lib/session.server';
import type { Organization } from '~/lib/types';

export const loader: LoaderFunction = async ({ request, params }: LoaderFunctionArgs): Promise<any> => {
  const orgId = await requireOrganizationId({ request, redirectTo: "/login" });

  if (orgId === undefined) {
    return redirect("/login");
  }

  const org: Organization | undefined = await getOrganizationDetails({ organizationId: orgId as string });

  if (org === undefined) {
    return redirect("/login"); // * org not exists
  }

  return {
    org
  };
}

export default function OrganizationLayout() {
  // @ts-ignore
  const { org } = useLoaderData<typeof loader>();

  return <div className="flex flex-col min-h-screen space-x-8 space-y-8">
    <div className="flex flex-col gap-4">
      <nav className="flex justify-between border-b">
        <div className="p-4 font-semibold">
          <a href={`/dash`} className='flex gap-2 items-center'>
            {org.logo ? <img src={org.logo} className='w-5 h-5' alt={org.name} /> : <BuildingIcon styles='h-6 w-6' />}
            <span>{org.name}</span>
          </a>
        </div>
      </nav>

      <div className="flex gap-4 p-3">
        <Outlet />
      </div>
    </div>
  </div>
}