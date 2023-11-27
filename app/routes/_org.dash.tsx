import type { LoaderFunction, LoaderFunctionArgs, TypedResponse } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useFetcher, useLoaderData } from '@remix-run/react'
import { makeAgent, type Agent, type Conversation, type Ticket, makeTicket } from '~/lib/types';
import { LoaderIcon } from '~/components/icons';
import { getOrganizationDetails, requireOrganizationId } from '~/lib/session.server';
import { unixepochToDate } from '~/lib/utils';
import { _buildOrgDbClient } from '~/lib/client-org';

export const loader: LoaderFunction = async ({ request }: LoaderFunctionArgs): Promise<{
  agents: any,
  tickets: any
} | TypedResponse> => {
  const organizationId = await requireOrganizationId({ request, redirectTo: "/login" });
  if (organizationId === undefined) {
    return redirect("/login");
  }

  const orgInfo = await getOrganizationDetails({ organizationId });
  if (orgInfo === undefined) {
    return redirect("/login");
  }

  const db = _buildOrgDbClient({ url: orgInfo.dbUrl as string });

  const agents = await db.prepare("SELECT * FROM agents").all();
  const tickets = await db.prepare('select "id", "customer_email", "customer_name", "query", "is_closed", "service_rating", "created_at", "updated_at", (select json_array("id", "ticket_id", "agent_id", "created_at", "updated_at") as "data" from (select * from "conversations" "tickets_conversation" where "tickets_conversation"."ticket_id" = "tickets"."id" limit ?) "tickets_conversation") as "conversation" from "tickets"').all(1);

  return json({
    agents: agents.map((agent: any) => makeAgent(agent)),
    tickets: tickets.map((ticket: any) => makeTicket(ticket))
  })
}

export default function OrganizationDashboard() {
  // @ts-ignore
  const { agents, tickets } = useLoaderData<typeof loader>();
  const agentFetcher = useFetcher();

  return (
    <section className='w-full min-h-[90vh] flex flex-col gap-y-16'>

      <div className='col-span-2 flex flex-row justify-center pt-2'>
        <div className='flex flex-col items-center' >
          <h3 className='p-2 text-xl'>Agent onboarding form</h3>

          {agentFetcher.state === "idle" && agentFetcher.data && (
            <div className={`flex items-center justify-center my-3 ${(agentFetcher.data as unknown as { ok: boolean }).ok ? 'bg-green-100' : 'bg-red-100'}`}>
              <p className={`p-2 ${(agentFetcher.data as unknown as { ok: boolean }).ok ? 'text-green-700' : 'text-red-700'}`}>{(agentFetcher.data as unknown as { message: string }).message}</p>
            </div>
          )}

          <agentFetcher.Form
            method="post"
            action='/org-actions'
            className="w-[320px]"
          >
            <input type="hidden" name='_action' defaultValue="onboardAgent" />
            <div>
              <input
                id="full-name"
                name="full_name"
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
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Email address"
                aria-label="Email address"
                className="mb-1 appearance-none rounded dark:bg-transparent border focus:border-primary/50 focus:ring-0 w-full py-2 px-3 text-primary/90 placeholder:text-primary/50 leading-tight focus:shadow-outline border-gray-500 focus-visible:outline-gray-600"
              />
            </div>
            <div>
              <button
                className="bg-primary text-white bg-gray-700 hover:bg-gray-900 rounded py-2 px-4 focus:shadow-outline flex justify-center items-center gap-3 w-full"
                type="submit"
              >
                {agentFetcher.state === "submitting" && !agentFetcher.data && <LoaderIcon styles="h-4 w-4 animate-spin fill-white" />}
                <span>Onboard agent</span>
              </button>
            </div>
          </agentFetcher.Form>
        </div>
      </div>

      <div className='flex flex-col gap-4 sm:flex-row'>
        <div className='w-full sm:w-1/2'>
          <h2 className='text-xl'>Agents</h2>
          {agents.length > 0 ? <ul className='list-none p-2 flex flex-col gap-2'>
            {agents.map((agent: Agent) => <li key={agent.id}>{agent.fullName}</li>)}
          </ul> : <div>No Agents added in your organization</div>}
        </div>
        <div className='w-full sm:w-1/2'>
          <h2 className='text-xl'>Tickets</h2>
          {tickets.length > 0 ? <ul className='list-none p-2 flex flex-col gap-2'>
            {tickets.map((ticket: Ticket & { conversation?: Conversation }) => <li key={ticket.id}>
              <details className='flex gap-4 justify-between items-center ring-[1px] ring-gray-200 p-2'>
                <summary className='flex flex-col'>
                  <span>{ticket.customerName}</span>
                  <span className='text-sm text-gray-400'>{unixepochToDate(ticket.createdAt as number)}</span>
                </summary>
                <p className='px-2 py-1 border border-gray-300 rounded-md text-sm flex flex-col'
                >
                  <span>{ticket.query}</span>
                  {ticket?.conversation && ticket?.conversation !== undefined && <span className='flex justify-center'>
                    <a href={`/conversation/${ticket.conversation.id}`} className='px-2 py-1 text-sm border border-gray-300 hover:border-gray-600  rounded'>View interaction</a></span>}
                </p>
              </details>
            </li>)}
          </ul> : <div>No tickets opened in your organization</div>}
        </div>
      </div>
    </section>
  )
}